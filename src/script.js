import { faker } from '@faker-js/faker';
/////////////////////////////////////////////

///////VARIABLES

const targetElement = document.getElementById('target-text');
const inputElement = document.getElementById('user-input');
const overlay = document.querySelector('.overlay');
const btnReset = document.querySelectorAll('.fa-arrow-rotate-right');

let targetText;
let wordCount = 10;
let startedTime;
let mispelled = 0;
let timeOn = false;
let timerStarted = false;
let countDown;
let timeFinished = false;
let mispelledHistory = {};
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
      if (mispelledHistory[i]) {
        delete mispelledHistory[i];
      }
    } else {
      if (!mispelledHistory[i]) {
        mispelledHistory[i] = true;
        mispelled++;
      }
      charElement.classList.add('incorrect');
    }
  }

  // Highlight the current cursor position
  if (userInput.length < targetText.length) {
    const cursorElement = document.getElementById(`char-${userInput.length}`);
    cursorElement.classList.add('cursor');
  }
  //display result
  if (!timeOn) {
    if (userInput.length === targetText.length) {
      displayResult(userInput.length);
    }
  }
  if (timeOn && userInput.length === targetText.length) {
    displayResult(userInput.length);
    timeFinished = false;
  }
  if (timeOn && timeFinished) {
    displayResult(userInput.length);
    timeFinished = false;
  }
};
const startText = function () {
  startedTime = Date.now();
  mispelled = 0;
  inputElement.classList.remove('hidden');
  targetText = faker.lorem.sentence(wordCount);
  // Initialize target text with each character wrapped in a span
  targetElement.innerHTML = targetText
    .split('')
    .map((char, index) => `<span id="char-${index}">${char}</span>`)
    .join('');
  inputElement.addEventListener('input', () => {
    if (timeOn && !timerStarted) {
      startTimer();
      timerStarted = true;
    }
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
const showResult = document.querySelector('.result');
btnReset.forEach(btn =>
  btn.addEventListener('click', e => {
    showResult.classList.add('hidden');
    inputElement.focus();
    inputElement.value = '';
    startText();
    timerStarted = false;
  })
);
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
const timerText = document.querySelector('.timer-text');

const settingsConfigFunction = function (html) {
  ParentElconfig.innerHTML = '';
  ParentElconfig.insertAdjacentHTML('afterbegin', html);
  if (!timeOn) {
    const activeConfig = document.querySelector('.setting-config li.active');
    const configValue = +activeConfig.textContent;
    wordCount = configValue;
  }
  startText();
};

ParentElsetting.addEventListener('click', function (e) {
  addActiveSettings('.setting-display li', e);
  if (e.target.classList.contains('word-set')) {
    const html = `  <li class="word-config active">10</li>
          <li class="word-config">25</li>
          <li class="word-config">50</li>
          <li class="word-config">100</li>`;
    timeOn = false;
    timeFinished = false;
    settingsConfigFunction(html);
  }
  if (e.target.classList.contains('time-set')) {
    const html = ` <li class="time-config active">15</li>
          <li class="time-config">30</li>
          <li class="time-config">60</li>
          <li class="time-config">120</li>`;
    timeOn = true;
    wordCount = 25;
    countDown = 15;
    settingsConfigFunction(html);
  }
});
ParentElconfig.addEventListener('click', function (e) {
  addActiveSettings('.setting-config li', e);
  if (e.target.classList.contains('word-config')) {
    const value = e.target.textContent;
    wordCount = +value;
    startText();
  }
  if (e.target.classList.contains('time-config')) {
    const value = e.target.textContent;
    countDown = +value;
    startText();
  }
});
let timerInterval;
const startTimer = function () {
  let remainingTime = countDown;
  timerText.textContent = remainingTime;
  timerText.style.visibility = 'visible';

  clearInterval(timerInterval);

  // Start the timer
  timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime > 0) {
      timerText.textContent = remainingTime;
    } else {
      clearInterval(timerInterval);
      timeFinished = true;
      timerText.style.visibility = 'hidden';
    }
  }, 1000);
};

const wpmText = document.querySelector('.wpm-res');
const accuracyText = document.querySelector('.accuracy-res');
const timeText = document.querySelector('.time-res');

//////////////////////////////////////
// display result
function displayResult(inputLength) {
  inputElement.classList.add('hidden');
  // calculate the wpm
  const timeDiff = Date.now() - startedTime;
  const timeInMin = timeDiff / (1000 * 60);
  const timeInSec = timeDiff / 1000;
  const standardOfTyping = 5;
  const WPM = Math.round(inputLength / standardOfTyping / timeInMin);
  // calculating the accuracy
  const accuracy = ((inputLength - mispelled) / inputLength) * 100;

  wpmText.textContent = WPM;
  accuracyText.textContent = accuracy.toFixed(2);
  timeText.textContent = timeOn ? countDown + 's' : timeInSec.toFixed(2) + 's';

  showResult.classList.remove('hidden');
}
