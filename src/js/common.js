// 로드 시 자기소개 hide -> 버튼 클릭하면 hide/show
$(document).ready(function () {
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
