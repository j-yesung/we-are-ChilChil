/* 기본설정 */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
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
              <button type="button" class="warning-btn" id="delete-btn">삭제</button>
              <button type="button" class="success-btn" id="modify-btn">수정</button>
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
export async function updateGuestBook(pwd, text) {
  // guestbooks 데이터 읽어와서 비번 일치하면 해당 id 값 데이터 수정
  try {
    // const docSnap = await getDoc(docRef);
    // const docRef = doc(db, 'guestbooks', docSnap.id);
    // // 비밀번호가 미일치 할 경우에
    // if (docSnap.data().pwd !== pwd)
    //   return {
    //     msg: 'invalid-password',
    //   };
    const docs = await getDocs(collection(db, 'guestbooks'));
    
    docs.forEach((docSnap) => {
      let row = docSnap.data();
      console.log(docSnap.id)

      // 입력한 비밀번호와 DB에 저장되어 있는 비밀번호가 일치하면 삭제
      if (pwd == row.pwd) {
        console.log('완료')
        return updateDoc(doc(db, 'guestbooks', docSnap.id), { text });
      }
    });

    // updateDoc(docRef, { text });
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

    docs.forEach((docSnap) => {
      let row = docSnap.data();

      // 입력한 비밀번호와 DB에 저장되어 있는 비밀번호가 일치하면 삭제
      if (pwd == row.pwd) {
        return deleteDoc(doc(db, 'guestbooks', docSnap.id));
      }
    });

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

  // 방명록을 삭제할 때, 비밀번호를 입력해서 일치하면 삭제합니다.
  $('.guestbooks-box > #delete-btn').click(function () {
    let pwd = prompt('비밀번호', '');

    switch (pwd) {
      case '':
        alert('비밀번호를 입력해 주세요.');
        return;
      case null:
        return;
      default:
        break;
    }
    removeGuestBook(pwd);
    // window.location.reload();
  });

  // 방명록 수정 버튼 이벤트
  $('.guestbooks-box > #modify-btn').click(function () {
    

    $('#modalContainer').removeClass('hidden');
    $('.pwd-data').css('width', '150px');
    $('#modalContent').css({
      'width': '300px',
      'height': '180px'
    });
    $('#modalContent').children('.pwd').css('margin-top', '30px');
    $('#modalContainer > #modalContent').children('.gb').show();
    $('#modalContainer > #modalContent').children('#update-btn').show();
    $('#modalContainer > #modalContent').children('#send-btn').hide();
    $('#modalContainer > #modalContent').children('#update-btn').addClass('success-btn');
    
  });
  $('#update-btn').click(function () {
    let pwd = $('.pwd-data').val();
    let text = $('.gb-data').val();

    console.log('비번/텍스트: ', pwd, text);
    updateGuestBook(pwd, text);
  });
}
