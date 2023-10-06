// 로드 시 자기소개 hide -> 버튼 클릭하면 hide/show
$(document).ready(async function () {
  // info-area 채우기
  const $infoArea = $('.info-area');

  const result = await getDataPromise('../data/data.json');
  const data = result.data;
  $infoArea.append(data.map(makeInfoItem));

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
});

// 뒤로가기
function goBack() {
  window.history.back();
}
// 홈으로 이동
function home() {
  location.href = '../html/main.html';
}
// 상세 페이지 이동
function goContentsPage() {
  location.href = '../html/contents.html';
}

/**
 * 문서 로드 시 바로 실행되는 즉시 실행 함수입니다.
 * 중복되는 태그들이 많아서 한번에 일괄 처리 했습니다.
 */
/* (function () {
  let infomation = {};
  let weName = ['장예성', '박가연', '이진호', '김지예', '김건우'];

  weName.forEach(function (name) {
    let contentHtml = `
      <div class="btn-box">
        <button class="btn">
          <div class="bondee-img">
            <img src="/" width="50" height="50" />
          </div>
          <div class="text">${name}</div>
        </button>
      </div>
    `;
    $('.container').append(contentHtml);
  });
})(); */
// url을 입력으로 데이터 가져오는 함수
async function getDataPromise(url) {
  const result = await fetch(url).then((result) => result.json());
  return result;
}
// 소개 페이지 동적 생성
function makeInfoItem(data) {
  const { id, name, tmi, mbti, interesting, introduce, img, advantage, blog } = data;
  const $infoItem = $(`<div class="${id} user info-item"></div>`);
  const $heading = $(`<h3>안녕하세요.<br/>저는 ${name}입니다.</h3>`);
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
  const bubbleObject = {
    MBTI: $bubbleMBTI,
    TMI: $bubbleTMI,
    advantage: $bubbleAdvantage,
    blog: $bubbleBlog,
  };

  // 데이터 동적 넣기 (text)
  Object.keys(textInfo).forEach((label) => {
    bubbleObject[label].append(makeTextBubble(label, textInfo[label]));
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

/* debug 함수 */
function tab(x) {
  console.log(x);
  return x;
}
