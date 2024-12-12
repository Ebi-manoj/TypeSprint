import { faker } from '@faker-js/faker';
/////////////////////////////////////////////

///////VARIABLES

const targetElement = document.getElementById('target-text');
const inputElement = document.getElementById('user-input');
const overlay = document.querySelector('.overlay');
const btnReset = document.querySelector('.fa-arrow-rotate-right');

let targetText;
////////////////////////////////////////////////////
const highlightText = function () {
  const userInput = inputElement.value;

  // Reset styles for all characters
  [...targetElement.children].forEach(charElement => {
    charElement.classList.remove('correct', 'incorrect', 'cursor');
  });

  // Highlight typed characters
  for (let i = 0; i < userInput.length; i++) {
    const charElement = document.getElementById(`char-${i}`);
    if (userInput[i] === targetText[i]) {
      charElement.classList.add('correct');
    } else {
      charElement.classList.add('incorrect');
    }
  }

  // Highlight the current cursor position
  if (userInput.length < targetText.length) {
    const cursorElement = document.getElementById(`char-${userInput.length}`);
    cursorElement.classList.add('cursor');
  }
};
const startText = function () {
  targetText = faker.lorem.sentence(20);
  // Initialize target text with each character wrapped in a span
  targetElement.innerHTML = targetText
    .split('')
    .map((char, index) => `<span id="char-${index}">${char}</span>`)
    .join('');
  inputElement.addEventListener('input', () => {
    highlightText();
  });
};
startText();

///////////////////////////
// Make overlay visible when out of focus and vice verca
inputElement.addEventListener('blur', () => {
  overlay.classList.remove('hidden');
});
inputElement.addEventListener('focus', () => {
  overlay.classList.add('hidden');
});

overlay.addEventListener('click', function () {
  inputElement.focus();
  this.classList.add('hidden');
});

///////////////////////////////////////
////Restart functionality

btnReset.addEventListener('click', e => {
  inputElement.focus();
  inputElement.value = '';
  startText();
});
//////////////////////////////////////////////////////////////
const addActiveSettings = function (element, e) {
  const targetLi = e.target.closest('li');
  if (!targetLi) return;
  document
    .querySelectorAll(element)
    .forEach(li => li.classList.remove('active'));
  targetLi.classList.add('active');
};
const ParentElsetting = document.querySelector('.setting-display');
const ParentElconfig = document.querySelector('.setting-config');

ParentElsetting.addEventListener('click', function (e) {
  addActiveSettings('.setting-display li', e);
});
ParentElconfig.addEventListener('click', function (e) {
  addActiveSettings('.setting-config li', e);
});
