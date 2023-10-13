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
  };
}
function moveBack(speed, option) {
  return async (element) => {
    while (element.innerText) {
      element.innerText = element.innerText.slice(0, -1);
      await wait(speed);
    }
    if (option.backWait) await wait(option.backWait);
  };
}
const texts = ['개발자', '꿈나무', '칠칠맞조'];
let curIndex = 0;
async function typing(element, option) {
  if (!element || !element instanceof HTMLElement) return;
  const { speed = 100, delay = 1000, backWait } = option || {};
  await moveForward(speed, delay)(element)(texts[curIndex++]);
  curIndex %= texts.length;
  await moveBack(speed, { backWait })(element);
  return true;
}
async function infinite() {
  while (true) {
    await typing(secondText, { backWait: 500 });
  }
}
infinite();

function select(selector) {
  return document.querySelector(selector);
}
