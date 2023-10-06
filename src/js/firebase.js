/* 기본설정 */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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

/**
 * 방명록 목록을 가져오는 함수
 * @returns {object} {data: [{text,id}] , msg : 방명록 성공 실패 메시지}
 */
export async function readGuestBooks() {
  try {
    const docs = await getDocs(collection(db, 'guestbooks'));

    docs.forEach((doc) => {
      let row = doc.data();
      console.log('Data: ', row, row.id);
      let docHtml = `
            <div class="guestbooks-box">${row['text']}
                <button type="button" id="delete-btn">삭제</button>
            </div>
        `;
      $('.guestbooks-container').append(docHtml);
    });
  } catch {
    return { data: [], msg: 'read-fail' };
  }
}
/**
 * 방명록을 작성하는 함수
 * @param {string} text
 * @param {string} pwd
 * @returns {object} {msg : 방명록 작성 성공 실패 메시지}
 */
export async function writeGuestBook(text, pwd) {
  try {
    await addDoc(collection(db, 'guestbooks'), { text, pwd });
    console.log(text, pwd);
    // ref에 id 자동 저장
  } catch {
    return { msg: 'write-fail' };
  }
  return { msg: 'write-success' };
}
/**
 * 특정 방명록을 업데이트 하는 함수
 * @param {string} id
 * @param {string} pwd
 * @param {string} text
 * @returns {object} {msg: 방명록 업데이트 성공 실패 메시지, 비밀번호 미일치 메시지}
 */
export async function updateGuestBook(id, pwd, text) {
  try {
    const docRef = doc(db, 'guestbooks', id);
    const docSnap = await getDoc(docRef);
    // 비밀번호가 미일치 할 경우에
    if (docSnap.data().pwd !== pwd)
      return {
        msg: 'invalid-password',
      };
    updateDoc(docRef, { text });
    return { msg: 'update-success' };
  } catch {
    return { msg: 'update-fail' };
  }
}
/**
 * 특정 방명록을 제거하는 함수
 * @param {string} id
 * @param {string} pwd
 * @returns {object} {msg: 방명록 삭제 성공 실패 메시지, 비밀번호 미일치 메시지}
 */
export async function removeGuestBook(pwd) {
  try {
    const docs = await getDocs(collection(db, 'guestbooks'));
    console.log(pwd, typeof pwd);
    
    docs.forEach((docSnap) => {
      let row = docSnap.data();
      // 실제데이터 : getDoc(docRef)
      // id값이 없네요 x
      // docRef.id o
      // docData.id -> undefined

      if (pwd == row.pwd) {
        return deleteDoc(doc(db, 'guestbooks', docSnap.id));
      }
    });

    console.log('삭제완료')
    return { msg: 'remove-success' };
  } catch(e){
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

  // 방명록을 삭제할 때, 비밀번호를 입력해서 일치하면 삭제합니다.
  $('.guestbooks-box button').click(function () {
    let pwd = prompt('비밀번호를 입력해 주세요.', '');
    // 입력한 비밀번호를 함수의 파라미터로 전달합니다.
    removeGuestBook(pwd);
  });
}

$(document).ready(function () {
  isGuestbooksStatus();

  // 방명록 작성
  $('#send-btn').click(function () {
    const pwd = $('.pwd-data').val();     // 비밀번호 입력 값
    const text = $('.write-data').val();  // 방명록 입력 값
    
    writeGuestBook(text, pwd);  // 방명록 작성 함수 호출
    $('#modalContainer').addClass('hidden');
  });
});
