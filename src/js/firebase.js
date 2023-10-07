/* 기본설정 */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';

import { GithubAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDKmdt_1FzRNBhaWU5IDCUCNDehX6mFIrQ',
  authDomain: 'sparta-82b6a.firebaseapp.com',
  projectId: 'sparta-82b6a',
  storageBucket: 'sparta-82b6a.appspot.com',
  messagingSenderId: '471910514788',
  appId: '1:471910514788:web:60157c536b4fd2b0699f71',
  measurementId: 'G-6G83Z7ZF03',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

/**
 * 방명록 목록을 가져오는 함수
 * @returns {object} {data: [{email,text,nickname, id}] , msg : 방명록 성공 실패 메시지}
 */
export async function readGuestBooks() {
  try {
    const docSnap = await getDocs(collection(db, 'guestbooks'));
    const docs = docSnap.docs;
    return { data: docs.map((v) => ({ id: v.id, ...v.data() })), msg: 'read-success' };
  } catch (e) {
    console.error(e);
    return { data: [], msg: 'read-fail' };
  }
}
/**
 * 방명록을 작성하는 함수
 * @param {string} email
 * @param {string} nickname
 * @param {string} text
 * @returns {object} {msg : 방명록 작성 성공 실패 메시지}
 */
export async function writeGuestBook(email, nickname, text) {
  console.log({ email, nickname, text });
  try {
    await addDoc(collection(db, 'guestbooks'), { email, nickname, text });
    // ref에 id 자동 저장
  } catch (e) {
    console.error(e);
    return { msg: 'write-fail' };
  }
  return { msg: 'write-success' };
}
/**
 * 특정 방명록을 업데이트 하는 함수
 * @param {string} id
 * @param {string} text
 * @returns {object} {msg: 방명록 업데이트 성공 실패 메시지, 비밀번호 미일치 메시지}
 */
export async function updateGuestBook(id, text) {
  try {
    const docRef = doc(db, 'guestbooks', id);
    // 비밀번호가 미일치 할 경우에
    updateDoc(docRef, { text });
    return { msg: 'update-success' };
  } catch {
    return { msg: 'update-fail' };
  }
}
/**
 * 특정 방명록을 제거하는 함수
 * @param {string} id
 * @returns {object} {msg: 방명록 삭제 성공 실패 메시지, 비밀번호 미일치 메시지}
 */
export async function removeGuestBook(id) {
  try {
    await deleteDoc(doc(db, 'guestbooks', id));
    console.log('삭제완료');
    return { msg: 'remove-success' };
  } catch (e) {
    console.error(e);
    return { msg: 'remove-fail' };
  }
}
/**
 * 특정 방명록을 읽어오는 함수
 * @param {string} id
 * @returns {object} {msg: 방명록 읽기 성공 실패 메시지
 */
export async function readGuestBook(id) {
  try {
    const doc = doc(db, 'guestbooks', id);
    const docSnap = await getDoc(docRef);
    const { docId, text } = docSnap.data();
    return { msg: 'read-success', data: { id: docId, text } };
  } catch {
    return { msg: 'read-fail' };
  }
}

/*******************************************
 *                                         *
 *              함수 호출 이벤트               *
 *                                         *
 *******************************************/
// 방명록 상태 변경 함수 (삭제, 수정)
export async function isGuestbooksStatus() {
  await readGuestBooks();
  console.log('방명록 불러오기 완료');
}

/* Auth 관련 함수들... */
export let userInfo = null;

/**
 * 회원가입 하는 함수
 */
export async function signUser() {
  signInWithPopup(auth, provider)
    .then((result) => {
      userInfo = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
}
/**
 * 로그아웃 하는 함수
 */
export async function signOutUser() {
  signOut(auth);
}
export function onAuthChange(onSuccess, onFail) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userInfo = user;
      onSuccess(user);
    } else {
      userInfo = null;
      onFail();
    }
  });
}
