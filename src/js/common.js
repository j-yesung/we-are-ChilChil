import { onAuthChange, signOutUser, signUser, userInfo, writeGuestBook } from '../js/firebase.js';
// 로드 시 자기소개 hide -> 버튼 클릭하면 hide/show
$(document).ready(async function () {
  // info-area 채우기
  const $infoArea = $('.info-area');

  const result = await getDataPromise('../data/data.json');
  const data = result.data;
  $infoArea.append(data.map(makeInfoItem));
  //isGuestbooksStatus();

  /* $('#send-btn').click(function () {
    const pwd = $('.pwd-data').val(); // 비밀번호 입력 값
    const text = $('.write-data').val(); // 방명록 입력 값

    writeGuestBook(text, pwd); // 방명록 작성 함수 호출
    //window.location.reload();
    $('#modalContainer').addClass('hidden');
  }); */

  // 말풍선 숨기기
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

  $('.input-container input').on('focus', (e) => {
    // 로그인 상태가 아니라면
    console.log(userInfo);
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      e.currentTarget.blur();
      signUser();
      return;
    }
  });

  // 로그인 상태에 따른 조작 함수
  onAuthChange(
    (user) => {
      // 로그인 상태일 시
      $('.welcome h4').text(`안녕하세요! ${user.reloadUserInfo.screenName}님!`);
    },
    () => {
      // 로그인 상태가 아닐 시
      $('.welcome h4').text('');
    },
  );

  $('.logout-btn').on('click', () => {
    console.log('click logout btn, user Info is : ', userInfo);
    if (!userInfo) return;
    signOutUser();
  });

  // 방명록 등록 이벤트 함수
  $('#enroll-guestbook-btn').click(async function (event) {
    event.preventDefault();
    let text = $('.write-data').val();

    if (text === '') {
      return alert('방명록을 작성해 주세요.');
    }
    if (!userInfo) {
      return alert('로그인을 해주세요!');
    }
    const email = userInfo.email;
    const nickname = userInfo.reloadUserInfo.screenName;
    const { msg } = await writeGuestBook(email, nickname, text);

    if (msg === 'write-success') {
      // [TODO] : add reloading guestbook container;
      alert('등록이 완료됐습니다!');
      return;
    }
    alert('등록에 실패했습니다.');
  });

  /* 로그인 모달 이벤트들.. login modal events */

  $('#modalContainer').on('click', (e) => {
    if ($(e.target).is($('#modalContainer'))) {
      $('#modalContainer').addClass('hidden');
    }
  });

  // 방명록을 삭제x할 때, 비밀번호를 입력해서 일치하면 삭제합니다.
  $('.guestbooks-box button').click(function () {
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
    window.location.reload();
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
