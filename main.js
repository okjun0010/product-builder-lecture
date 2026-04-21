const generatorBtn = document.getElementById('generator-btn');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Theme logic
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeButtonText(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButtonText(newTheme);
});

function updateThemeButtonText(theme) {
  themeToggleBtn.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

// Lotto logic
generatorBtn.addEventListener('click', () => {
  const numbers = generateLottoNumbers();
  displayNumbers(numbers);
});

function generateLottoNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers.sort((a, b) => a - b);
}

function displayNumbers(numbers) {
  lottoNumbersContainer.innerHTML = '';
  numbers.forEach(num => {
    const numberCircle = document.createElement('div');
    numberCircle.classList.add('number-circle');
    numberCircle.textContent = num;
    lottoNumbersContainer.appendChild(numberCircle);
  });
}
