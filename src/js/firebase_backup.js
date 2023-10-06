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

        return {
            data: docs.map((doc) => {
                const { name, text, id } = doc.data();
                return { name, text, id };
            }),
            msg: 'read-success',
        };
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
        addDoc(collection(db, 'guestbooks'), { text, pwd });
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
export async function removeGuestBook(id, pwd) {
    try {
        const docRef = doc(db, 'guestbooks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().pwd !== pwd) {
            return {
                msg: 'invalid-password',
            };
        }
        await deleteDoc(docRef);
        return { msg: 'remove-success' };
    } catch {
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
