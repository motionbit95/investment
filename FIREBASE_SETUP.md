# Firebase 설정 가이드

채팅방 참여 신청 시스템을 위한 Firebase 설정 방법입니다.

## 📋 목차

1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Firestore 데이터베이스 설정](#2-firestore-데이터베이스-설정)
3. [Authentication 설정](#3-authentication-설정)
4. [보안 규칙 설정](#4-보안-규칙-설정)
5. [프로젝트 설정 파일 수정](#5-프로젝트-설정-파일-수정)
6. [관리자 계정 생성](#6-관리자-계정-생성)
7. [index.html 수정](#7-indexhtml-수정)

---

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭

### 1.2 프로젝트 생성
1. **프로젝트 이름**: `investment-chatroom` (원하는 이름)
2. **Google 애널리틱스**: 선택 사항 (필요 시 활성화)
3. "프로젝트 만들기" 클릭

---

## 2. Firestore 데이터베이스 설정

### 2.1 Firestore 시작
1. 왼쪽 메뉴에서 **Firestore Database** 클릭
2. "데이터베이스 만들기" 클릭
3. **프로덕션 모드**로 시작 선택
4. 위치: `asia-northeast3 (서울)` 선택 권장
5. "사용 설정" 클릭

### 2.2 컬렉션 구조
자동으로 생성되지만, 참고용 구조:

```
chatroom_applications (컬렉션)
  └── {documentId} (문서)
      ├── name: string (신청자 이름)
      ├── phone: string (전화번호)
      ├── status: string (pending|approved|rejected)
      ├── createdAt: timestamp (신청일시)
      ├── processedAt: timestamp|null (처리일시)
      ├── processedBy: string|null (처리자 이메일)
      └── notes: string (메모)
```

---

## 3. Authentication 설정

### 3.1 Authentication 활성화
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. "시작하기" 클릭

### 3.2 이메일/비밀번호 로그인 활성화
1. **Sign-in method** 탭 클릭
2. **이메일/비밀번호** 행 클릭
3. "사용 설정" 토글 ON
4. "저장" 클릭

---

## 4. 보안 규칙 설정

### 4.1 Firestore 보안 규칙
1. **Firestore Database** > **규칙** 탭 클릭
2. 아래 규칙을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 관리자 이메일 목록
    function isAdmin() {
      return request.auth != null &&
             (request.auth.token.email == 'admin1@example.com' ||
              request.auth.token.email == 'admin2@example.com');
    }

    // chatroom_applications 컬렉션
    match /chatroom_applications/{document} {
      // 누구나 생성 가능 (신청)
      allow create: if true;

      // 관리자만 읽기, 수정, 삭제 가능
      allow read, update, delete: if isAdmin();
    }
  }
}
```

3. **admin1@example.com, admin2@example.com을 실제 관리자 이메일로 변경**
4. "게시" 클릭

### 4.2 Storage 규칙 (선택사항)
Storage를 사용하지 않으면 건너뛰어도 됩니다.

---

## 5. 프로젝트 설정 파일 수정

### 5.1 Firebase 구성 정보 가져오기
1. 프로젝트 설정(⚙️) > **일반** 탭 클릭
2. "내 앱" 섹션에서 웹 앱 추가 (</> 아이콘)
3. 앱 닉네임 입력: `Investment Landing Page`
4. "Firebase SDK snippet" > **구성** 선택
5. `firebaseConfig` 객체 복사

### 5.2 firebase-config.js 수정
`firebase-config.js` 파일을 열고 다음 값들을 변경:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // 여기에 실제 값 입력
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5.3 관리자 이메일 수정
`firebase-config.js`에서 관리자 이메일 변경:

```javascript
const ADMIN_EMAILS = [
  'admin1@example.com',  // 실제 관리자 이메일로 변경
  'admin2@example.com'   // 실제 관리자 이메일로 변경
];
```

---

## 6. 관리자 계정 생성

### 6.1 Firebase Console에서 생성
1. **Authentication** > **Users** 탭 클릭
2. "사용자 추가" 클릭
3. 이메일과 비밀번호 입력 (firebase-config.js의 ADMIN_EMAILS와 동일해야 함)
4. "사용자 추가" 클릭
5. 두 번째 관리자도 동일하게 추가

**예시:**
- 이메일: `admin1@example.com`
- 비밀번호: `SecurePassword123!`

### 6.2 테스트 계정 (개발용)
개발 중에는 간단한 비밀번호 사용 가능하지만, 프로덕션에서는 강력한 비밀번호 사용 권장.

---

## 7. index.html 수정

### 7.1 Firebase SDK 추가
`index.html`의 `</body>` 태그 직전에 다음 스크립트 추가:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Firebase Config -->
<script src="firebase-config.js"></script>

<!-- Signup Form Script -->
<script src="signup-form.js"></script>
```

### 7.2 기존 script.js 수정
`script.js`에서 모달 관련 코드를 제거하거나 주석 처리 (signup-form.js와 중복 방지)

**주석 처리할 부분:**
- 116-188 lines: 모달 기능
- 88-96 lines: CTA 버튼 클릭 핸들러

---

## 8. 테스트

### 8.1 로컬 서버 실행
```bash
python3 -m http.server 8000
```

### 8.2 신청 폼 테스트
1. http://localhost:8000 접속
2. "채팅방 참여 신청" 버튼 클릭
3. 이름과 전화번호 입력
4. "신청하기" 클릭
5. Firebase Console > Firestore Database에서 데이터 확인

### 8.3 관리자 로그인 테스트
1. http://localhost:8000/admin-login.html 접속
2. 관리자 이메일/비밀번호 입력
3. 로그인 후 대시보드 확인
4. 신청 목록에서 승인/거절/삭제 테스트

---

## 9. 프로덕션 배포

### 9.1 보안 강화
1. **Firestore 보안 규칙** 재확인
2. **관리자 비밀번호** 강력하게 변경
3. **API 키 보호**: `.env` 파일 사용 권장 (Webpack/Vite 사용 시)

### 9.2 도메인 허용
1. Firebase Console > **Authentication** > **Settings** 탭
2. **승인된 도메인**에 실제 도메인 추가

### 9.3 호스팅 (Firebase Hosting 사용 시)
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init hosting

# 배포
firebase deploy
```

---

## 10. 문제 해결

### 10.1 "Permission denied" 오류
- Firestore 보안 규칙 확인
- 관리자 이메일이 규칙과 일치하는지 확인

### 10.2 "Firebase: Error (auth/user-not-found)"
- Authentication > Users에서 계정 생성 여부 확인

### 10.3 데이터가 저장되지 않음
- 브라우저 콘솔에서 오류 메시지 확인
- firebase-config.js의 설정 값 확인
- Firestore 보안 규칙에서 `allow create: if true;` 확인

### 10.4 CORS 오류
- 로컬 서버로 실행 (python3 -m http.server)
- file:// 프로토콜 대신 http:// 사용

---

## 11. 추가 기능 (선택사항)

### 11.1 이메일 알림
Firebase Functions를 사용하여 신청 시 관리자에게 이메일 발송:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.sendAdminNotification = functions.firestore
  .document('chatroom_applications/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // 이메일 전송 로직
    // ...
  });
```

### 11.2 SMS 알림
Twilio 등을 사용하여 승인 시 신청자에게 SMS 발송

### 11.3 CSV 내보내기
대시보드에서 신청 목록을 CSV로 다운로드하는 기능 추가

---

## 📞 지원

문제가 발생하면:
1. Firebase Console의 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. Firebase 공식 문서: https://firebase.google.com/docs

---

**작성일**: 2025년
**작성자**: Motionbit
