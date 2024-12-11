const targetText =
  'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.';
const targetElement = document.getElementById('target-text');

const inputElement = document.getElementById('user-input');
// Initialize target text with each character wrapped in a span

targetElement.innerHTML = targetText
  .split('')
  .map((char, index) => `<span id="char-${index}">${char}</span>`)
  .join('');

let currentIndex = 0;

inputElement.addEventListener('input', () => {
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
});

inputElement.addEventListener('blur', () => {
  console.log(`lost focus`);
});
