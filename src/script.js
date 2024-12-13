import { faker } from '@faker-js/faker';
/////////////////////////////////////////////

///////VARIABLES

const targetElement = document.getElementById('target-text');
const inputElement = document.getElementById('user-input');
const overlay = document.querySelector('.overlay');
const btnReset = document.querySelector('.fa-arrow-rotate-right');

let targetText;
let wordCount = 10;
let startedTime;
let mispelled = 0;
////////////////////////////////////////////////////
const highlightText = function () {
  const userInput = inputElement.value;
  mispelled = 0;

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
      mispelled++;
    }
  }

  // Highlight the current cursor position
  if (userInput.length < targetText.length) {
    const cursorElement = document.getElementById(`char-${userInput.length}`);
    cursorElement.classList.add('cursor');
  }
  //display result
  if (userInput.length === targetText.length) {
    displayResult(userInput.length);
  }
};
const startText = function () {
  startedTime = Date.now();
  mispelled = 0;
  targetText = faker.lorem.sentence(wordCount);
  // Initialize target text with each character wrapped in a span
  targetElement.innerHTML = targetText
    .split('')
    .map((char, index) => `<span id="char-${index}">${char}</span>`)
    .join('');
  inputElement.addEventListener('input', () => {
    highlightText();
  });
  inputElement.value = '';
  inputElement.focus();
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
  if (e.target.classList.contains('word-set')) {
    inputElement.focus();
    inputElement.value = '';
    ParentElconfig.innerHTML = '';
    ParentElconfig.insertAdjacentHTML(
      'afterbegin',
      `
          <li class="word-config active">10</li>
          <li class="word-config">25</li>
          <li class="word-config">50</li>
          <li class="word-config">100</li>
    `
    );
    const activeConfig = document.querySelector('.setting-config li.active');
    const configValue = +activeConfig.textContent;
    wordCount = configValue;
    startText();
  }
});
ParentElconfig.addEventListener('click', function (e) {
  addActiveSettings('.setting-config li', e);
  const value = +e.target.textContent;
  if (value) {
    wordCount = value;
    startText();
  }
});

//////////////////////////////////////
// display result
function displayResult(inputLength) {
  // calculate the wpm
  const timeDiff = Date.now() - startedTime;
  const timeInMin = timeDiff / (1000 * 60);
  const timeInSec = timeDiff / 1000;
  const standardOfTyping = 5;
  const WPM = Math.round(inputLength / standardOfTyping / timeInMin);
  // calculating the accuracy
  const accuracy = ((inputLength - mispelled) / inputLength) * 100;
  console.log(`Time taken ${timeInSec.toFixed(2)}`);
  console.log(`WPM ${WPM}`);
  console.log(`Accuracy ${accuracy.toFixed(2)}`);
}
