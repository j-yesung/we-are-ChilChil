/* 기본설정 */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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

const $form = $('#form');
const $display = $('#display');
/* 생성 */
// 컬렉션 members 안에 새로운 document 생성
$form.on('submit', async (e) => {
    e.preventDefault();
    const nameInput = $('#name');
    const pwdInput = $('#password');
    const textInput = $('#text');

    await addDoc(collection(db, 'guestbooks'), {
        name: nameInput.val(),
        pwd: pwdInput.val(),
        text: textInput.val(),
    });

    alert('등록완료');

    window.location.reload();
});
/* 읽기 */
let docs = await getDocs(collection(db, 'guestbooks'));
console.log(docs);
docs.forEach((doc) => {
    const { name, text, pwd } = doc.data();
    const { id } = doc;

    let temp_html = `
                    <div class='guestbook-container'>
                        <span class='blind'>${id}</span>
                        <p>이름 : ${name}</p>
                        <p>${text}</p>
                        <p>비밀번호 : ${pwd}</p>
                        <button class='update-button'>업데이트 버튼</button>
                        <button class='delete-button'>삭제 버튼</button>
                    </div>
                `;
    $display.append(temp_html);
});

/* 업데이트 */
async function update(id, name, text) {
    const item = await doc(db, 'guestbooks', id);
    updateDoc(item, { name, text });
}
/* 삭제 */
async function remove(id) {
    await deleteDoc(await doc(db, 'guestbooks', id));
    window.location.reload();
}
$('.delete-button').on('click', (e) => {
    const id = $(e.currentTarget).parent().find('.blind').text();
    remove(id);
});
