// 관리자 대시보드 스크립트

(function() {
  'use strict';

  // DOM 요소
  const userEmailSpan = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const applicationsBody = document.getElementById('applicationsBody');
  const loadingState = document.getElementById('loadingState');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  // 통계 요소
  const totalCount = document.getElementById('totalCount');
  const pendingCount = document.getElementById('pendingCount');
  const approvedCount = document.getElementById('approvedCount');
  const rejectedCount = document.getElementById('rejectedCount');

  // 알림 요소
  const notificationToast = document.getElementById('notificationToast');
  const notificationText = document.getElementById('notificationText');
  const notificationClose = document.getElementById('notificationClose');

  // 모달 요소
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContainer = document.getElementById('modalContainer');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalInput = document.getElementById('modalInput');
  const modalCancel = document.getElementById('modalCancel');
  const modalConfirm = document.getElementById('modalConfirm');

  // 필터 탭
  const filterTabs = document.querySelectorAll('.filter-tab');
  let currentFilter = 'all';

  // 검색 및 페이지네이션 요소
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const sortSelect = document.getElementById('sortSelect');
  const perPageSelect = document.getElementById('perPageSelect');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageNumbers = document.getElementById('pageNumbers');
  const paginationInfo = document.getElementById('paginationInfo');

  // 전역 변수
  let currentUser = null;
  let searchQuery = '';
  let currentPage = 1;
  let itemsPerPage = 20;
  let sortBy = 'createdAt-desc'; // 기본: 최신순
  let totalDocuments = 0;
  let lastVisible = null; // 페이지네이션용 마지막 문서
  let firstVisible = null; // 페이지네이션용 첫 문서
  let pageCache = {}; // 페이지 캐시
  let lastNewApplicationCheck = null; // 마지막 신청 확인 시간

  // 인증 상태 확인
  auth.onAuthStateChanged(function(user) {
    if (!user) {
      // 로그인되지 않았으면 로그인 페이지로 리다이렉트
      window.location.href = 'admin-login.html';
      return;
    }

    // 현재 사용자 저장 (로그인한 모든 계정은 관리자)
    currentUser = user;
    userEmailSpan.textContent = user.email;

    // 통계 로드
    loadStats();

    // 신청 목록 로드
    loadApplications();

    // 실시간 알림 리스너 시작 (약간 지연)
    setTimeout(() => {
      startNewApplicationListener();
    }, 1000);
  });

  // 로그아웃
  logoutBtn.addEventListener('click', async function() {
    const confirmed = await customConfirm('로그아웃하시겠습니까?', '로그아웃');
    if (confirmed) {
      try {
        await auth.signOut();
        window.location.href = 'admin-login.html';
      } catch (error) {
        console.error('로그아웃 오류:', error);
        await customAlert('로그아웃 중 오류가 발생했습니다.', '오류');
      }
    }
  });

  // 통계 로드 (한 번만 실행)
  async function loadStats() {
    try {
      const snapshot = await db.collection('chatroom_applications').get();
      const stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total++;
        if (data.status === 'pending') stats.pending++;
        else if (data.status === 'approved') stats.approved++;
        else if (data.status === 'rejected') stats.rejected++;
      });

      totalCount.textContent = stats.total;
      pendingCount.textContent = stats.pending;
      approvedCount.textContent = stats.approved;
      rejectedCount.textContent = stats.rejected;

      totalDocuments = stats.total;
    } catch (error) {
      console.error('통계 로드 오류:', error);
    }
  }

  // 신청 목록 로드 (서버측 페이지네이션)
  async function loadApplications() {
    try {
      loadingState.style.display = 'block';
      tableContainer.style.display = 'none';
      emptyState.style.display = 'none';

      // 캐시 확인
      const cacheKey = `${currentFilter}-${sortBy}-${currentPage}-${itemsPerPage}`;
      if (pageCache[cacheKey]) {
        renderTable(pageCache[cacheKey]);
        return;
      }

      // Firestore 쿼리 구성
      let query = db.collection('chatroom_applications');

      // 필터 적용
      if (currentFilter !== 'all') {
        query = query.where('status', '==', currentFilter);
      }

      // 정렬 적용
      const [field, order] = sortBy.split('-');
      const orderDirection = order === 'asc' ? 'asc' : 'desc';

      if (field === 'createdAt') {
        query = query.orderBy('createdAt', orderDirection);
      } else if (field === 'name') {
        query = query.orderBy('name', orderDirection);
      } else if (field === 'status') {
        query = query.orderBy('status', orderDirection);
      }

      // 단순 페이지네이션: skip 대신 모든 데이터 가져온 후 클라이언트에서 슬라이스
      // (Firestore는 offset이 없어서 작은 데이터셋에서는 이 방식이 더 안정적)
      const snapshot = await query.get();

      if (snapshot.empty) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        loadingState.style.display = 'none';
        return;
      }

      const allApplications = [];
      snapshot.forEach(doc => {
        allApplications.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // 클라이언트 측 페이지네이션
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedApplications = allApplications.slice(startIndex, endIndex);

      // 캐시 저장
      pageCache[cacheKey] = paginatedApplications;

      // 테이블 렌더링
      renderTable(paginatedApplications);

    } catch (error) {
      console.error('데이터 로드 오류:', error);
      await customAlert('데이터를 불러오는 중 오류가 발생했습니다:\n' + error.message, '오류');
      loadingState.textContent = '데이터 로드 실패';
    }
  }

  // 테이블 렌더링
  function renderTable(apps) {
    loadingState.style.display = 'none';

    // 테이블 표시
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';

    // 테이블 내용 생성
    applicationsBody.innerHTML = apps.map(app => {
      const createdAt = app.createdAt ? formatDate(app.createdAt.toDate()) : '-';
      const processedAt = app.processedAt ? formatDate(app.processedAt.toDate()) : '-';
      const processedBy = app.processedBy || '-';

      const statusClass = `status-${app.status}`;
      const statusText = getStatusText(app.status);

      return `
        <tr>
          <td>${createdAt}</td>
          <td><strong>${app.name}</strong></td>
          <td>${app.phone}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>${processedAt}</td>
          <td>${processedBy}</td>
          <td>
            <div class="action-buttons">
              ${app.status === 'pending' ? `
                <button class="action-btn approve-btn" onclick="window.approveApplication('${app.id}')">
                  ✓ 승인
                </button>
                <button class="action-btn reject-btn" onclick="window.rejectApplication('${app.id}')">
                  ✗ 거절
                </button>
              ` : ''}
              <button class="action-btn delete-btn" onclick="window.deleteApplication('${app.id}')">
                🗑 삭제
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // 페이지네이션 UI 업데이트
    renderPagination();
  }

  // 페이지네이션 UI 렌더링
  function renderPagination() {
    // 총 페이지 계산 (필터 적용 시)
    let filteredTotal = totalDocuments;
    if (currentFilter !== 'all') {
      // 필터된 통계에서 가져오기
      if (currentFilter === 'pending') filteredTotal = parseInt(pendingCount.textContent);
      else if (currentFilter === 'approved') filteredTotal = parseInt(approvedCount.textContent);
      else if (currentFilter === 'rejected') filteredTotal = parseInt(rejectedCount.textContent);
    }

    const totalPages = Math.ceil(filteredTotal / itemsPerPage);

    // 페이지 정보 업데이트
    paginationInfo.textContent = `${currentPage} / ${totalPages}`;

    // 이전/다음 버튼 상태
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;

    // 페이지 번호 버튼 생성 (최대 5개 표시)
    pageNumbers.innerHTML = '';

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // startPage 조정 (끝에 도달했을 때)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
      pageBtn.textContent = i;
      pageBtn.onclick = () => goToPage(i);
      pageNumbers.appendChild(pageBtn);
    }
  }

  // 페이지 이동
  function goToPage(page) {
    if (page !== currentPage) {
      currentPage = page;
      lastVisible = null; // 리셋
      loadApplications();
    }
  }

  // 상태 텍스트 반환
  function getStatusText(status) {
    const statusMap = {
      pending: '대기 중',
      approved: '승인 완료',
      rejected: '거절'
    };
    return statusMap[status] || status;
  }

  // 날짜 포맷팅
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // 커스텀 confirm 함수
  function customConfirm(message, title = '확인') {
    return new Promise((resolve) => {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modalInput.style.display = 'none';
      modalCancel.style.display = 'inline-block';
      modalConfirm.textContent = '확인';
      modalConfirm.className = 'modal-btn modal-btn-confirm';

      modalOverlay.classList.add('show');

      const handleConfirm = () => {
        modalOverlay.classList.remove('show');
        cleanup();
        resolve(true);
      };

      const handleCancel = () => {
        modalOverlay.classList.remove('show');
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        modalConfirm.removeEventListener('click', handleConfirm);
        modalCancel.removeEventListener('click', handleCancel);
        modalOverlay.removeEventListener('click', handleOverlayClick);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalOverlay) {
          handleCancel();
        }
      };

      modalConfirm.addEventListener('click', handleConfirm);
      modalCancel.addEventListener('click', handleCancel);
      modalOverlay.addEventListener('click', handleOverlayClick);
    });
  }

  // 커스텀 prompt 함수
  function customPrompt(message, title = '입력', defaultValue = '') {
    return new Promise((resolve) => {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modalInput.style.display = 'block';
      modalInput.value = defaultValue;
      modalCancel.style.display = 'inline-block';
      modalConfirm.textContent = '확인';
      modalConfirm.className = 'modal-btn modal-btn-confirm';

      modalOverlay.classList.add('show');
      setTimeout(() => modalInput.focus(), 100);

      const handleConfirm = () => {
        const value = modalInput.value;
        modalOverlay.classList.remove('show');
        cleanup();
        resolve(value);
      };

      const handleCancel = () => {
        modalOverlay.classList.remove('show');
        cleanup();
        resolve(null);
      };

      const handleKeypress = (e) => {
        if (e.key === 'Enter') {
          handleConfirm();
        } else if (e.key === 'Escape') {
          handleCancel();
        }
      };

      const cleanup = () => {
        modalConfirm.removeEventListener('click', handleConfirm);
        modalCancel.removeEventListener('click', handleCancel);
        modalInput.removeEventListener('keypress', handleKeypress);
        modalOverlay.removeEventListener('click', handleOverlayClick);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalOverlay) {
          handleCancel();
        }
      };

      modalConfirm.addEventListener('click', handleConfirm);
      modalCancel.addEventListener('click', handleCancel);
      modalInput.addEventListener('keypress', handleKeypress);
      modalOverlay.addEventListener('click', handleOverlayClick);
    });
  }

  // 커스텀 alert 함수
  function customAlert(message, title = '알림') {
    return new Promise((resolve) => {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modalInput.style.display = 'none';
      modalCancel.style.display = 'none';
      modalConfirm.textContent = '확인';
      modalConfirm.className = 'modal-btn modal-btn-confirm';

      modalOverlay.classList.add('show');

      const handleConfirm = () => {
        modalOverlay.classList.remove('show');
        cleanup();
        resolve();
      };

      const cleanup = () => {
        modalConfirm.removeEventListener('click', handleConfirm);
        modalOverlay.removeEventListener('click', handleOverlayClick);
      };

      const handleOverlayClick = (e) => {
        if (e.target === modalOverlay) {
          handleConfirm();
        }
      };

      modalConfirm.addEventListener('click', handleConfirm);
      modalOverlay.addEventListener('click', handleOverlayClick);
    });
  }

  // 알림 표시
  function showNotification(message, type = 'success') {
    console.log('알림 표시:', message, type); // 디버깅용

    if (!notificationToast || !notificationText) {
      console.error('알림 요소를 찾을 수 없습니다');
      return;
    }

    notificationText.textContent = message;

    // 기존 클래스 제거 후 새로 추가
    notificationToast.className = 'notification-toast';

    // 약간의 딜레이 후 show 클래스 추가 (애니메이션 작동 위해)
    setTimeout(() => {
      notificationToast.classList.add('show', type);
    }, 10);

    // 3초 후 자동 숨김
    setTimeout(() => {
      hideNotification();
    }, 3000);
  }

  // 알림 숨김
  function hideNotification() {
    if (notificationToast) {
      notificationToast.classList.remove('show', 'success', 'warning', 'info');
    }
  }

  // 알림 닫기 버튼
  if (notificationClose) {
    notificationClose.addEventListener('click', hideNotification);
  }

  // 실시간 알림 리스너 (새 신청만 감지)
  function startNewApplicationListener() {
    // 현재 시간 저장
    lastNewApplicationCheck = firebase.firestore.Timestamp.now();

    // 새 신청만 감지
    db.collection('chatroom_applications')
      .where('createdAt', '>', lastNewApplicationCheck)
      .where('status', '==', 'pending')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            showNotification(`새로운 신청: ${data.name} (${data.phone})`, 'info');

            // 통계 업데이트
            loadStats();

            // 현재 페이지가 1페이지이고 필터가 전체/대기 중이면 새로고침
            if (currentPage === 1 && (currentFilter === 'all' || currentFilter === 'pending')) {
              pageCache = {}; // 캐시 초기화
              loadApplications();
            }
          }
        });
      }, error => {
        console.error('실시간 리스너 오류:', error);
      });
  }

  // 신청 승인
  window.approveApplication = async function(id) {
    const confirmed = await customConfirm('이 신청을 승인하시겠습니까?', '승인 확인');
    if (!confirmed) {
      return;
    }

    try {
      await db.collection('chatroom_applications').doc(id).update({
        status: 'approved',
        processedAt: firebase.firestore.FieldValue.serverTimestamp(),
        processedBy: currentUser.email
      });

      showNotification('✅ 신청이 승인되었습니다', 'success');

      pageCache = {}; // 캐시 초기화
      loadStats();
      loadApplications();

    } catch (error) {
      console.error('승인 처리 오류:', error);
      showNotification('❌ 승인 처리 중 오류가 발생했습니다', 'warning');
    }
  };

  // 신청 거절
  window.rejectApplication = async function(id) {
    const reason = await customPrompt('거절 사유를 입력하세요 (선택사항):', '거절 사유');

    if (reason === null) {
      return; // 취소
    }

    try {
      await db.collection('chatroom_applications').doc(id).update({
        status: 'rejected',
        processedAt: firebase.firestore.FieldValue.serverTimestamp(),
        processedBy: currentUser.email,
        notes: reason || ''
      });

      showNotification('❌ 신청이 거절되었습니다', 'warning');
      pageCache = {}; // 캐시 초기화
      loadStats();
      loadApplications();

    } catch (error) {
      console.error('거절 처리 오류:', error);
      showNotification('❌ 거절 처리 중 오류가 발생했습니다', 'warning');
    }
  };

  // 신청 삭제
  window.deleteApplication = async function(id) {
    const confirmed = await customConfirm('이 신청을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', '삭제 확인');
    if (!confirmed) {
      return;
    }

    try {
      await db.collection('chatroom_applications').doc(id).delete();
      showNotification('🗑 신청이 삭제되었습니다', 'info');
      pageCache = {}; // 캐시 초기화
      loadStats();
      loadApplications();

    } catch (error) {
      console.error('삭제 오류:', error);
      showNotification('❌ 삭제 중 오류가 발생했습니다', 'warning');
    }
  };

  // 새로고침 버튼
  refreshBtn.addEventListener('click', function() {
    pageCache = {}; // 캐시 초기화
    loadStats();
    loadApplications();
  });

  // 필터 탭 클릭
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // 활성 탭 변경
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // 필터 적용
      currentFilter = this.dataset.filter;
      currentPage = 1; // 필터 변경 시 첫 페이지로
      pageCache = {}; // 캐시 초기화
      lastVisible = null;
      loadApplications();
    });
  });

  // 정렬 기준 변경
  sortSelect.addEventListener('change', function() {
    sortBy = this.value;
    currentPage = 1; // 정렬 변경 시 첫 페이지로
    pageCache = {}; // 캐시 초기화
    lastVisible = null;
    loadApplications();
  });

  // 페이지당 항목 수 변경
  perPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1; // 항목 수 변경 시 첫 페이지로
    pageCache = {}; // 캐시 초기화
    lastVisible = null;
    loadApplications();
  });

  // 이전 페이지 버튼
  prevBtn.addEventListener('click', function() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  // 다음 페이지 버튼
  nextBtn.addEventListener('click', function() {
    goToPage(currentPage + 1);
  });

})();
