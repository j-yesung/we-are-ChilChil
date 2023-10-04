const $container = $('.container');
const $btnsContainer = $container.find('.btns-container');
const $btnBoxes = $('<div class="btn-box"></div>');
const $mainContentContainer = $container.find('.main-content-container');

/* 
parameter["members"] 내용
member : {
    name : string;
    url : imgUrl, string;
}
members : member[]    

members가 주어지면 그에 따라서 버튼을 초기화 하는 함수
 */
function initButton(members) {
    return members.map(({ name, url }) => {
        const $button = $(`<button class="btn-box" aria-selected="false" data-name=${name}></button>`);
        const $bondeeImgBox = $('<div class="bondee-img"></div>');
        const $img = $(`<img src="${url}" alt="member-profile-img"/>`);
        const $text = $(`<div class="text">${name}</div>`);

        $bondeeImgBox.append($img);
        $button.append($bondeeImgBox, [$text]);

        $button.on('click', handleClickButton);
        return $button;
    });
}

/* button 클릭 시 발생 이벤트 */
function handleClickButton(e) {
    const $btn = $(e.currentTarget);
    // btn이 속성 data-selected가 True인 경우 현재 btn의 data-selecetd 속성을 없앤다.
    if ($btn.attr('aria-selected') === 'true') {
        $btn.attr('aria-selected', 'false');
    }
    // btn이 속성 attr-saria-elected가 False인 경우 나머지 버튼들의 속성 attr-saria-elected를 false로 처리한다.
    else if ($btn.attr('aria-selected') === 'false') {
        const $btns = $btnsContainer.find('button');
        $btns.attr('aria-selected', 'false');
        $btn.attr('aria-selected', 'true');
    }

    renderMainContent();
}
/* main-content-container 내 아이템 랜더링 하는 함수 */
function renderMainContent() {
    // btn중에서 data-seleced가 하나라도 True인 경우에는 해당 팀원 소개 페이지를 보여주고
    // 모두가 False라면 팀 소개 페이지를 보여준다.
    const btns = Array.prototype.slice.call($btnsContainer.find('button'));

    if (
        !btns.some((btn) => {
            if ($(btn).attr('aria-selected') === 'true') {
                const name = $(btn).data('name');
                $('.main-content-container .member-introduce-container').each((_, element) => {
                    $(element).removeClass('on');
                    if ($(element).data('name') === name) {
                        $(element).addClass('on');
                    }
                });

                return true;
            }
            return false;
        })
    ) {
        // 모두 비어있다면
        $('.main-content-container .team-introduce-container').addClass('on');
        $('.main-content-container .member-introduce-container').removeClass('on');
    } else {
        $('.main-content-container .team-introduce-container').removeClass('on');
    }
}
/* debug 함수 */
function tab(x) {
    console.log(x);
    return x;
}

let weName = ['장예성', '박가연', '이진호', '김지예', '김건우'];
$btnsContainer.append(initButton(weName.map((v) => ({ name: v, url: '' }))));

$(document).on('click', handleClickDocument);
