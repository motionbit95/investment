// Firebase 설정 파일
// Investment Backend Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyCwlEuCwVXUT-TnQaYO9CbtEArLmlXRrPs",
  authDomain: "investment-backend-980e8.firebaseapp.com",
  projectId: "investment-backend-980e8",
  storageBucket: "investment-backend-980e8.firebasestorage.app",
  messagingSenderId: "886280408749",
  appId: "1:886280408749:web:8ba56d2bb11456bb370024",
  measurementId: "G-2DTM59625K",
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 및 Auth 참조
const db = firebase.firestore();
const auth = firebase.auth();

// 관리자 계정 (이메일 기반)
// TODO: 실제 관리자 이메일로 변경하세요
const ADMIN_EMAILS = [
  "motionbit.dev@gmail.com", // 관리자 1
  "gaon@test.com", // 관리자 2 (필요시 변경)
];

// 현재 사용자가 관리자인지 확인
function isAdmin(email) {
  return ADMIN_EMAILS.includes(email);
}
