# 투자 랜딩 페이지

가온벤처스 X 주식와이프 X 토마토TV - 단기 급등주 체험방 랜딩 페이지

## 📋 프로젝트 개요

현대적이고 반응형인 투자 서비스 랜딩 페이지입니다. 다크모드 지원, 스크롤 애니메이션, 모바일 최적화 등 최신 웹 기술을 활용했습니다.

## 📁 프로젝트 구조

```
investment-landing-page/
├── index.html           # 메인 HTML 파일
├── style.css            # 통합 스타일시트 (3200+ lines)
├── script.js            # JavaScript 기능
├── images/              # 이미지 파일
│   ├── gaon.png        # 가온벤처스 로고
│   ├── wife.png        # 주식와이프 로고
│   └── tomatoTV.png    # 토마토TV 로고
└── icons/               # 아이콘 파일
    ├── chat.png        # 채팅 아이콘
    ├── like.png        # 좋아요 아이콘
    ├── gift.png        # 선물 아이콘
    ├── chart.png       # 차트 아이콘
    └── dart.png        # 다트 아이콘
```

## 🎨 주요 기능

### 1. 다크모드
- 오른쪽 상단 토글 버튼 (☀️/🌙)
- localStorage에 설정 저장
- 전체 페이지 테마 자동 전환
- CSS 변수 기반 색상 시스템

### 2. 반응형 디자인
- **데스크톱** (1024px+): 최적화된 레이아웃, 큰 타이포그래피
- **태블릿** (768px - 1023px): 중간 크기 레이아웃
- **모바일** (< 768px): 세로 스크롤 최적화, 터치 친화적 UI
- **작은 모바일** (< 480px): 컴팩트한 레이아웃

### 3. 폰 목업 & 플로팅 아이콘
- 중앙에 iPhone 스타일 목업
- 목업 내부: 세로 정렬된 원형 로고 (토마토TV, 가온벤처스)
- 플로팅 아이콘 (chat, like, gift)이 목업 뒤에서 삐져나옴
- 은은한 둥둥 떠다니는 애니메이션 효과
- 데스크톱: overflow visible로 아이콘 전체 표시
- 모바일: overflow hidden으로 가로 스크롤 방지

### 4. 스크롤 애니메이션
- Intersection Observer API 활용
- Reveal 애니메이션 (fade-in, slide-up)
- 카드, 버튼, 제목 등 요소별 staggered 애니메이션
- 숫자 카운터 애니메이션

### 5. 헤더 자동 숨김
- 스크롤 방향 감지 (delta accumulation)
- 아래로 스크롤 시 헤더 숨김
- 위로 스크롤 시 헤더 표시
- 부드러운 fade & transform 효과

### 6. 인터랙티브 요소
- 카드 호버 시 3D tilt 효과
- 버튼 호버/클릭 애니메이션
- 모달 팝업 (회원가입 폼)
- 폼 유효성 검사 (전화번호 자동 포맷팅)

## 🎯 파일 설명

### index.html
시맨틱 HTML5 구조로 작성된 메인 페이지:
- `<header>`: 파트너십 로고, 다크모드 토글
- `<section class="hero">`: 히어로 섹션, 폰 목업
- `<section class="performance">`: 성과 카드
- `<section class="ai-section">`: AI 기능 소개
- `<section class="benefits">`: 혜택 카드
- `<section class="kakao-section">`: 카카오톡 오픈채팅
- `<section class="price-table-section">`: 가격표
- `<footer>`: CTA 버튼

### style.css
통합 스타일시트 구조 (3200+ lines):

1. **폰트** (1-72 lines)
   - Pretendard 웹폰트 (100-900 weight)

2. **CSS 변수** (80-115 lines)
   - 색상 시스템 (primary, secondary, accent)
   - 배경색 (light/dark 모드)
   - 텍스트 색상
   - 테두리 & 그림자

3. **기본 스타일** (117-610 lines)
   - CSS 리셋
   - 타이포그래피 (h1-h6, p)
   - 컨테이너 레이아웃
   - 유틸리티 클래스

4. **헤더** (535-605 lines)
   - 파트너십 로고 배치
   - 스티키/픽스드 네비게이션
   - 스크롤 시 자동 숨김 효과
   - 다크모드 토글 버튼

5. **히어로 섹션** (612-660 lines)
   - 폰 목업 컨테이너
   - 히어로 텍스트
   - Gradient 버튼

6. **폰 목업** (2060-2310 lines)
   - iPhone 스타일 프레임
   - 노치 디자인
   - 내부 콘텐츠 (로고, 버튼)
   - 플로팅 아이콘 배치
   - z-index 레이어링

7. **성과 & 기능 섹션** (670-1100 lines)
   - 성과 카드 그리드
   - AI 카드
   - 혜택 카드
   - 호버 효과

8. **카카오톡 섹션** (1680-1800 lines)
   - 카카오톡 버튼 스타일
   - 혜택 그리드

9. **가격표** (1800-1920 lines)
   - 테이블 스타일
   - 행 호버 효과

10. **다크모드** (2630-2800 lines)
    - `.dark-mode` 클래스 스타일
    - CSS 변수 오버라이드

11. **애니메이션** (480-550, 2110-2125 lines)
    - @keyframes 정의
    - floatIcon, phoneFloat, emojiPop 등

12. **반응형** (1923-3230 lines)
    - 태블릿 (768px-1023px)
    - 모바일 (< 768px)
    - 작은 모바일 (< 480px)

### script.js
JavaScript 기능 모듈:

1. **부드러운 스크롤** (1-13 lines)
   - 앵커 링크 클릭 시 smooth scroll

2. **Intersection Observer** (15-86 lines)
   - 스크롤 시 요소 reveal 애니메이션
   - 카드, 버튼, 제목별 staggered timing

3. **CTA 버튼** (88-114 lines)
   - 회원가입 버튼 클릭 핸들러
   - Feature 버튼 인터랙션

4. **모달** (116-188 lines)
   - 모달 열기/닫기
   - ESC 키 지원
   - 폼 유효성 검사
   - 전화번호 자동 포맷팅

5. **테이블 호버** (209-219 lines)
   - 가격표 행 호버 효과

6. **숫자 카운터** (221-455 lines)
   - animateCounter 함수
   - Intersection Observer로 트리거
   - 퍼센트, 만 단위 포맷팅

7. **스크롤 프로그레스 바** (248-258 lines)
   - 페이지 스크롤 진행률 표시

8. **헤더 자동 숨김** (260-293 lines)
   - 스크롤 delta 계산
   - 방향 감지 후 header-hidden 클래스 토글

9. **Parallax 효과** (295-340 lines)
   - 이모지 아이콘 parallax
   - 카드 배경 parallax

10. **마우스 효과** (342-363 lines)
    - 카드 위에서 3D tilt 효과

11. **페이지 로드 애니메이션** (457-492 lines)
    - 헤더 fade-in
    - 버튼 entrance 애니메이션

12. **다크모드 토글** (494-517 lines)
    - IIFE 패턴으로 캡슐화
    - localStorage 저장/로드
    - 버튼 회전 애니메이션

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* Primary */
--primary-color: #6366f1;      /* Indigo */
--primary-light: #818cf8;
--primary-dark: #4f46e5;

/* Secondary */
--secondary-color: #10b981;    /* Emerald Green */
--secondary-light: #34d399;
--secondary-dark: #059669;

/* Accent */
--accent-color: #f59e0b;       /* Amber */
--accent-light: #fbbf24;
--accent-dark: #d97706;
```

### 타이포그래피
- Font Family: Pretendard (한글 최적화)
- Desktop: 20px-56px
- Mobile: 15px-32px
- Line Height: 1.4-1.8

### 그리드 & 레이아웃
- Container: max-width 1200px
- Grid: CSS Grid (auto-fit, minmax)
- Gap: 15px-40px

## 🚀 개발 서버 실행

```bash
# Python 3 내장 서버
python3 -m http.server 8000

# Node.js http-server (설치 필요)
npx http-server -p 8000

# VS Code Live Server 확장 사용
```

브라우저에서 http://localhost:8000 접속

## ✅ 최적화 완료 사항

- ✅ CSS 파일 통합 (단일 파일로 관리)
- ✅ JavaScript 최적화 (IIFE 패턴, 불필요한 console.log 제거)
- ✅ 다크모드 완전 구현
- ✅ 반응형 타이포그래피 (clamp, vw 단위)
- ✅ 모바일 최적화 (터치 이벤트, 가로 스크롤 방지)
- ✅ 플로팅 아이콘 z-index 레이어링
- ✅ 원형 로고 디자인 (border-radius: 50%)
- ✅ 은은한 그림자 효과
- ✅ 헤더 자동 숨김 (스크롤 방향 감지)
- ✅ Intersection Observer 기반 애니메이션

## 🎯 주요 스타일 컴포넌트

### 1. 폰 목업 (.phone-mockup)
```css
/* 목업 컨테이너 */
.phone-mockup-container {
  position: relative;
  overflow: hidden;        /* 모바일: 가로 스크롤 방지 */
  overflow: visible;       /* 데스크톱: 아이콘 표시 */
}

/* 플로팅 아이콘 */
.floating-icons {
  z-index: 1;             /* 목업 뒤에 배치 */
}

.phone-mockup {
  z-index: 5;             /* 아이콘 앞에 배치 */
}
```

### 2. 원형 로고 (.mockup-logo-horizontal)
```css
.mockup-logo-horizontal {
  width: 135px;            /* 데스크톱 */
  width: 110px;            /* 모바일 */
  border-radius: 50%;      /* 완전한 원형 */
  object-fit: cover;       /* 이미지 꽉 채움 */
  aspect-ratio: 1 / 1;     /* 1:1 비율 강제 */
}
```

### 3. 헤더 자동 숨김 (.partnership-header)
```css
.partnership-header {
  position: fixed;
  transition: transform 0.4s, opacity 0.4s;
}

.partnership-header.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
}
```

## 📱 브라우저 지원

- Chrome (최신) ✅
- Firefox (최신) ✅
- Safari (최신) ✅
- Edge (최신) ✅
- IE 11 ❌ (CSS Grid, CSS Variables 미지원)

## 🔧 향후 개선 사항

- [ ] 이미지 최적화 (WebP, AVIF 형식)
- [ ] Critical CSS 분리 (above-the-fold 최적화)
- [ ] 접근성 개선 (ARIA 레이블, 키보드 네비게이션)
- [ ] SEO 최적화 (메타 태그, Open Graph)
- [ ] 성능 최적화 (lazy loading, code splitting)
- [ ] PWA 지원 (Service Worker, manifest.json)
- [ ] 애니메이션 성능 개선 (will-change, transform)
- [ ] 폰트 서브셋팅 (한글 자소 분리)

## 📝 코드 컨벤션

### CSS
- BEM 네이밍 (Block__Element--Modifier)
- 모바일 퍼스트 (기본 스타일 → 미디어 쿼리)
- CSS 변수 활용 (색상, 간격)
- 주석으로 섹션 구분

### JavaScript
- camelCase 네이밍
- IIFE로 스코프 캡슐화
- addEventListener 사용 (인라인 핸들러 지양)
- 주석으로 기능 설명

### HTML
- 시맨틱 태그 사용
- 들여쓰기 2칸
- 속성 순서: class, id, data-*, src/href, 기타

## 📄 라이선스

이 프로젝트는 상업용으로 제작되었습니다.

## 👥 제작

- **파트너십**: 가온벤처스 X 주식와이프 X 토마토TV
- **디자인 & 개발**: Claude Code
- **최종 업데이트**: 2025년

---

**문의사항**이 있으시면 카카오톡 오픈채팅을 이용해주세요.
