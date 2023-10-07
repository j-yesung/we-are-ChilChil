import { onAuthChange, readGuestBooks, removeGuestBook, signOutUser, signUser, userInfo, writeGuestBook } from '../js/firebase.js';
// 로드 시 자기소개 hide -> 버튼 클릭하면 hide/show
let GgusetBooks = [];
$(document).ready(async function () {
  // info-area 채우기
  const $infoArea = $('.info-area');

  const result = await getDataPromise('../data/data.json');
  const data = result.data;

  /* 초기화 함수들  */
  $infoArea.append(data.map(makeInfoItem));
  renderGuestBook('server');

  /* $('#send-btn').click(function () {
    const pwd = $('.pwd-data').val(); // 비밀번호 입력 값
    const text = $('.write-data').val(); // 방명록 입력 값

    writeGuestBook(text, pwd); // 방명록 작성 함수 호출
    //window.location.reload();
    $('#modalContainer').addClass('hidden');
  }); */

  /* ======== 말풍선 관련 함수들 ======== */
  $('.bubble').hide();
  // 자기 소개 숨기기
  $('.info-area').children('.user').hide();

  $('.info-btn').click(function () {
    $('.info-area').children().hide();

    if ($(this).hasClass('active')) {
      $('.active').removeClass('active');
      $('.bubble').hide();
      $('.info-area').children().not('.user').show();
    } else {
      $('.active').removeClass('active');
      $('.bubble').show();
      $('.' + $(this).val()).show();
      $(this).addClass('active');
    }
  });

  /* ======== 방명록 관련 함수들 ======== */
  // 방명록 등록 이벤트 함수
  $('#enroll-guestbook-btn').click(async function (event) {
    event.preventDefault();
    let text = $('.write-data').val();

    if (!userInfo) {
      return alert('로그인을 해주세요!');
    }
    if (text === '') {
      return alert('방명록을 작성해 주세요.');
    }

    const email = userInfo.email;
    const nickname = userInfo.reloadUserInfo.screenName;
    const { msg } = await writeGuestBook(email, nickname, text);

    if (msg === 'write-success') {
      // [TODO] : add reloading guestbook container;
      const data = { email, nickname, text };
      GgusetBooks = guestBooks.concat([data]);
      renderGuestBook('local', GgusetBooks);
      alert('등록이 완료됐습니다!');
      return;
    }
    alert('등록에 실패했습니다.');
  });

  // 방명록을 삭제할 때, 현재 userInfo의 이메일과 등록된 이메일이 같을 경우 없앤다.
  $('.guestbooks-box .warning-btn').click(function () {
    console.log('here');
    if (!userInfo) {
      alert('로그인 후 이용하실 수 있습니다.');
    }
    const $container = $(this).parent();
    const id = $container.data('id');
    console.log(id);
    guestBooks = guestBooks.filter((guestBook) => guestBook.id !== id);

    renderGuestBook('local', guestBooks);
    removeGuestBook(id);
  });

  /* ======== 로그인 관련 함수들 ======== */
  // 사용자가 방명록을 남기려 input에 focus를 했을 때 로그인을 하지 않았다면 로그인 알림이 발생한다.
  $('.input-container input').on('focus', (e) => {
    // 로그인 상태가 아니라면
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      e.currentTarget.blur();
      signUser();
      return;
    }
  });
  // 로그인 상태에 따른 DOM 조작 함수
  // onAuthChange(onSuccess: function , onFail : function)
  onAuthChange(
    (user) => {
      // 로그인 상태일 시
      $('.logout-btn').show();
      $('.welcome h4').text(`안녕하세요! ${user.reloadUserInfo.screenName}님!`);
    },
    () => {
      // 로그인 상태가 아닐 시
      $('.logout-btn').hidden();
      $('.welcome h4').text('');
    },
  );
  // 로그아웃 버튼을 눌렀을 경우 발생하는 이벤트 함수
  $('.logout-btn').on('click', () => {
    if (!userInfo) return;
    signOutUser();
  });

  /* 로그인 모달 이벤트들.. login modal events */
  $('#modalContainer').on('click', (e) => {
    if ($(e.target).is($('#modalContainer'))) {
      $('#modalContainer').addClass('hidden');
    }
  });

  // 스크롤 맨 위로 옮기는 동작
  const $btnScrollTop = $('.scroll-up-btn button');
  $btnScrollTop.on('click', moveScrollTop);
});

// url을 입력으로 데이터 가져오는 함수
async function getDataPromise(url) {
  const result = await fetch(url).then((result) => result.json());
  return result;
}
// 소개 페이지 동적 생성
function makeInfoItem(data) {
  const { id, name, tmi, mbti, interesting, introduce, img, advantage, blog } = data;
  const $infoItem = $(`<div class="${id} user info-item"></div>`);
  const $heading = $(`<h3>안녕하세요.<br/>저는 <strong>${name}</strong>입니다.</h3>`);
  const $introduceContainer = $('<div class="introduce-container"></div>');
  const $introduce = $(`<p>${introduce}</p>`);
  const $bubbleSpeechContainer = $('<div class="bubble-speech-container"></div>');
  const $bubbleLeft = $('<div class="bubble-left"></div>');
  const $bubbleRight = $('<div class="bubble-right"></div>');
  const $img = $('<img />');

  const $bubbleMBTI = $('<div class="bubble right bottom"></div>');
  const $bubbleinteresting1 = $('<div class="bubble right center"></div>');
  const $bubbleAdvantage = $('<div class="bubble right top"></div>');

  const $bubbleTMI = $('<div class="bubble left bottom"></div>');
  const $bubbleBlog = $('<div class="bubble left top blog"></div>');
  const $bubbleinteresting2 = $('<div class="bubble left center"></div>');

  /* ------------ 버블 시작 ------------  */
  const textInfo = {
    MBTI: mbti,
    TMI: tmi,
    advantage: advantage,
    blog: blog,
  };
  const infoMap = {
    MBTI: 'MBTI',
    TMI: 'TMI',
    advantage: '장점',
    blog: '블로그',
  };
  const bubbleObject = {
    MBTI: $bubbleMBTI,
    TMI: $bubbleTMI,
    advantage: $bubbleAdvantage,
    blog: $bubbleBlog,
  };

  // 데이터 동적 넣기 (text)
  Object.keys(textInfo).forEach((key) => {
    bubbleObject[key].append(makeTextBubble(infoMap[key], textInfo[key]));
  });
  // 데이터 동적 넣기 (list)
  const interesting1 = interesting.slice(0, interesting.length / 2),
    interesting2 = interesting.slice(interesting.length / 2);

  [
    [$bubbleinteresting1, interesting1],
    [$bubbleinteresting2, interesting2],
  ].forEach((data) => {
    const [parent, items] = data;

    parent.append(makeListBubble('관심분야', items));
  });

  // 버블 left, right에 아이템들 넣기
  $bubbleLeft.append([$bubbleMBTI, $bubbleinteresting1, $bubbleAdvantage]);
  $bubbleRight.append([$bubbleTMI, $bubbleinteresting2, $bubbleBlog]);
  $bubbleSpeechContainer.append([$bubbleLeft, $img, $bubbleRight]);

  /* ------------ 이미지 ------------  */
  $img.attr('src', img);

  /* ------------ 소개글 ------------  */
  $introduceContainer.append($introduce);

  $infoItem.append([$heading, $bubbleSpeechContainer, $introduceContainer]);
  return $infoItem;
}

// TEXT 세팅(MBTI, TMI, 장점, 블로그 주소) 함수
function makeTextBubble(label, desc) {
  const $label = $(`<div class="label">${label}</div>`);
  const $desc = $(`<div class="desc">${desc}</div>`);
  if (label === '블로그') {
    $desc.text('');
    $desc.append($(`<a href="${desc}">${desc}</a>`));
  }
  const $wrapper = $('<div class="balloon-text"></div>');

  $wrapper.append([$label, $desc]);

  return $wrapper;
}
// LIST 세팅 함수
function makeListBubble(label, listItems) {
  const $label = $(`<div class="label">${label}</div>`);
  const $list = $('<ul class="list"></ul>');
  // list item 내용들 $list에 추가
  $list.append(
    listItems.map((item) => {
      return $(`<li class="list-item">#${item}</li>`);
    }),
  );

  const $wrapper = $('<div class="balloon-list"></div>');

  $wrapper.append([$label, $list]);

  return $wrapper;
}
/**
 * 방명록을 렌더링 해주는 함수
 * @param {'local'|'server'} type
 * @param {[GuestBook]} guestBooks
 * @returns void
 * type이 'local'일 경우 입력으로 주어진 guestBooks를 이용하여 렌더링 하고
 * type이 'server'일 경우 서버에서 새로운 데이터를 가져온다.
 */

async function renderGuestBook(type, guestBooks) {
  // 1. 방명록을 가져온다
  let docs = guestBooks;
  if (type === 'server') {
    const { msg, data } = await readGuestBooks();
    if (msg === 'read-fail') {
      console.error('read guest book fail');
      return;
    }
    docs = data;
    GgusetBooks = data;
  }
  // 2. 가져온 방명록을 동적으로 넣어준다.
  const $guestBooksBoxes = docs.map(({ email, nickname, text, id }) => {
    const $guestBooksBox = $(`<div class="guestbooks-box" data-id="${id}"></div>`);
    const $text = $(`<p class="guestbook-text">${text}</p>`);
    const $warningBtn = $(`<button type="button" class="warning-btn" >삭제</button>`);
    const $updateBtn = $(`<button type="button" class="success-btn">수정</button>`);

    $guestBooksBox.append([$text, $warningBtn, $updateBtn]);

    // 삭제 이벤트

    $warningBtn.on('click', () => {
      if (!userInfo) {
        alert('로그인 후 이용하실 수 있습니다.');
      }
      console.log(id, GgusetBooks);
      GgusetBooks = GgusetBooks.filter((guestBook) => guestBook.id !== id);

      renderGuestBook('local', GgusetBooks);
      removeGuestBook(id);
    });

    return $guestBooksBox;
  });

  $('.guestbooks-container').html('').append($guestBooksBoxes);
}

// 페이지 최상단 이동 함수
function moveScrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

/* debug 함수 */
function tab(x) {
  console.log(x);
  return x;
}
