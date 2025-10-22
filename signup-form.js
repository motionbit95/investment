// 채팅방 참여 신청 폼 처리 (Firebase 연동)

(function () {
  "use strict";

  // DOM 요소
  const modal = document.getElementById("signupModal");
  const openModalBtn = document.getElementById("openSignupModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const submitBtn = document.getElementById("submitSignup");
  const userName = document.getElementById("userName");
  const userPhone = document.getElementById("userPhone");

  // Confirmation Modal 요소
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmationOverlay = document.getElementById("confirmationOverlay");
  const confirmationBtn = document.getElementById("confirmationBtn");
  const confirmationMessage = document.getElementById("confirmationMessage");

  // 알림 요소
  const notificationToast = document.getElementById("notificationToast");
  const notificationIcon = document.getElementById("notificationIcon");
  const notificationText = document.getElementById("notificationText");
  const notificationClose = document.getElementById("notificationClose");

  // 커스텀 알림 함수
  function showNotification(message, type = "info") {
    console.log("showNotification 호출:", message, type);
    console.log("알림 요소 확인:", {
      toast: notificationToast,
      text: notificationText,
      icon: notificationIcon,
    });

    if (!notificationToast || !notificationText || !notificationIcon) {
      console.error("알림 요소를 찾을 수 없어서 alert 사용");
      alert(message); // fallback
      return;
    }

    // 아이콘 설정
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    notificationIcon.textContent = icons[type] || icons.info;
    notificationText.textContent = message;

    // 기존 클래스 제거 후 새로 추가
    notificationToast.className = "notification-toast";

    console.log("알림 표시 시도");

    setTimeout(() => {
      notificationToast.classList.add("show", type);
      console.log("알림 클래스 추가됨:", notificationToast.className);
    }, 10);

    // 5초 후 자동 숨김 (길게 수정)
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  // 알림 숨김
  function hideNotification() {
    if (notificationToast) {
      notificationToast.classList.remove(
        "show",
        "success",
        "error",
        "warning",
        "info"
      );
    }
  }

  // 알림 닫기 버튼
  if (notificationClose) {
    notificationClose.addEventListener("click", hideNotification);
  }

  // Confirmation Modal 관련 함수
  function showConfirmationModal(name) {
    if (confirmationModal) {
      confirmationModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeConfirmationModal() {
    if (confirmationModal) {
      confirmationModal.classList.remove("active");
      document.body.style.overflow = "";
    }
    // 신청 모달도 함께 닫고 폼 초기화
    if (modal) {
      modal.classList.remove("active");
      userName.value = "";
      userPhone.value = "";
    }
  }

  // Confirmation Modal 닫기 이벤트
  if (confirmationBtn) {
    confirmationBtn.addEventListener("click", closeConfirmationModal);
  }

  if (confirmationOverlay) {
    confirmationOverlay.addEventListener("click", closeConfirmationModal);
  }

  // 모달 열기
  if (openModalBtn) {
    openModalBtn.addEventListener("click", function () {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // 모달 닫기
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    userName.value = "";
    userPhone.value = "";
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }

  // ESC 키로 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modal.classList.contains("active")) {
        closeModal();
      }
      if (confirmationModal && confirmationModal.classList.contains("active")) {
        closeConfirmationModal();
      }
    }
  });

  // 전화번호 자동 포맷팅
  if (userPhone) {
    userPhone.addEventListener("input", function (e) {
      let value = e.target.value.replace(/[^0-9]/g, "");

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,4})/, "$1-$2");
      }

      e.target.value = value;
    });
  }

  // 폼 제출 처리 (Firebase에 저장)
  if (submitBtn) {
    submitBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const name = userName.value.trim();
      const phone = userPhone.value.trim();

      // 유효성 검사
      if (!name) {
        showNotification("이름을 입력해주세요.", "warning");
        userName.focus();
        return;
      }

      if (!phone) {
        showNotification("전화번호를 입력해주세요.", "warning");
        userPhone.focus();
        return;
      }

      // 전화번호 형식 검사
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(phone)) {
        showNotification(
          "올바른 전화번호 형식을 입력해주세요.\n(예: 010-1234-5678)",
          "warning"
        );
        userPhone.focus();
        return;
      }

      // 로딩 표시
      submitBtn.disabled = true;
      submitBtn.textContent = "처리 중...";

      try {
        // Firestore에 신청 정보 저장
        const docRef = await db.collection("chatroom_applications").add({
          name: name,
          phone: phone,
          status: "pending", // pending, approved, rejected
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          processedAt: null,
          processedBy: null,
          notes: "",
        });

        console.log("신청이 저장되었습니다. ID:", docRef.id);

        // 모달 닫기
        closeModal();

        // 확인 팝업 표시
        showConfirmationModal(name);
      } catch (error) {
        console.error("신청 저장 중 오류:", error);
        showNotification(
          "신청 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
          "error"
        );
      } finally {
        // 버튼 상태 복원
        submitBtn.disabled = false;
        submitBtn.textContent = "신청하기";
      }
    });
  }

  // CTA 버튼에도 모달 열기 연결
  const ctaButtons = document.querySelectorAll(".cta-button, .signup-btn");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });
})();
