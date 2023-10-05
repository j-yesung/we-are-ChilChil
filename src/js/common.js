// 로드 시 자기소개 hide -> 버튼 클릭하면 hide/show
$(document).ready(function() {
  $("div").hide();
    $("button").click(function() {
       $("div").hide();
       
       if ($(this).hasClass("active")) {
          $(".active").removeClass('active')
       } else {
          $(".active").removeClass('active')
          $("." + $(this).val()).show()  
          $(this).addClass('active')
       }
  
    })  
  })

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
