const secondText = select('.second-text');

// text를 앞에서 부터 붙여 나간다.
function moveForward(text) {
  let textIndex = 0;
  return setInterval(() => {
    if (textIndex >= text.length) return;
    secondText.innerText += text[textIndex++];
  }, 100);
}
// 현재 정해진 text를 지워 나간다
function moveBack() {
  return setInterval(() => {
    if (secondText.innerText.length < 0) return;
    secondText.innerText = secondText.innerText.slice(0, -1);
  }, 100);
}
// 끝이 나면 다음 텍스트에 대해서 해당 기능들을 수행한다
function changeText() {
  const texts = ['개발자', '꿈나무', '칠칠맞조'];
  let curIndex = 0;
  // 시작 : toFlag == fales, 끝 플래그 : toFlag === true
  let backTimeout = null;
  let forwardTimeout = null;

  return () => {
    forwardTimeout = moveForward(texts[curIndex++]);
    curIndex %= texts.length;
    setTimeout(() => {
      backTimeout = moveBack();
    }, 1500);
    setInterval(() => {
      // 특정 초 안에 아래 동작을 완수한다.
      if (backTimeout) clearInterval(backTimeout);
      if (forwardTimeout) clearInterval(forwardTimeout);
      console.log('here');
      forwardTimeout = moveForward(texts[curIndex++]);
      curIndex %= texts.length;
      setTimeout(() => {
        backTimeout = moveBack();
      }, 1500);
    }, 3500);
  };
}

changeText()();

function select(selector) {
  return document.querySelector(selector);
}
