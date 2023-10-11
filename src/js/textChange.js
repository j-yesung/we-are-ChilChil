const secondText = select('.second-text');

function wait(time) {
  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, time),
  );
}

function moveForward(speed, delay) {
  return (element) => async (text) => {
    let textIndex = 0;
    const size = text.length;
    while (textIndex < size) {
      element.innerText += text[textIndex++];
      await wait(speed);
    }
    await wait(delay);

    moveBack(speed)(element);
  };
}
function moveBack(speed) {
  return async (element) => {
    while (element.innerText) {
      element.innerText = element.innerText.slice(0, -1);
      await wait(speed);
    }
  };
}
const texts = ['개발자', '꿈나무', '칠칠맞조'];
let curIndex = 0;
const delay1000 = moveForward(100, 1000);
delay1000(secondText)(texts[curIndex++]);
curIndex %= texts.length;
setInterval(() => {
  delay1000(secondText)(texts[curIndex++]);
  curIndex %= texts.length;
}, 3000);

function select(selector) {
  return document.querySelector(selector);
}
