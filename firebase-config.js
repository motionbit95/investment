// Firebase 설정 파일
// Investment Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyAGmZgqz8iA9nXfdvE2wu24L4okuM0jvHk",
  authDomain: "investment-28f07.firebaseapp.com",
  projectId: "investment-28f07",
  storageBucket: "investment-28f07.firebasestorage.app",
  messagingSenderId: "987404568547",
  appId: "1:987404568547:web:24dcee818f50675e1f42d6"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 및 Auth 참조
const db = firebase.firestore();
const auth = firebase.auth();

// 참고: Firebase Authentication에 등록된 모든 계정은 관리자입니다.
