let examCode = "";
let rollNumber = "";

function setExamCode(code, number) {
  examCode = code;
  rollNumber = number;
}

function getExamCode() {
  return examCode;
}

function getRollNumber() {
  return rollNumber;
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('submit');

  button.addEventListener('click', () => {
    const code = document.getElementById('exam-code').value.trim();
    const studentName = document.getElementById('student-name').value.trim();
    const rollNum = document.getElementById('roll-number').value.trim();

    if (!code || !studentName || !rollNum) {
      alert('Please fill all details');
      return;
    }

    setExamCode(code, rollNum);

    const testElement = document.querySelector('.test');
    const width = parseInt(getComputedStyle(testElement).width);

    if (width < 700) {
      testElement.style.display = 'flex';
    } else {
      testElement.style.display = 'grid';
    }

    document.getElementById('exam-code').disabled = true;
    document.getElementById('student-name').disabled = true;
    document.getElementById('roll-number').disabled = true;
    document.querySelector('.check').style.display = 'flex';
    button.disabled = true;

    startTimer();
    loadQuestions();
  });
});

let countdown;

function startTimer() {
  let timeLeft = 30 * 60;

  countdown = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('timer').textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert('Time is up!');
    }

    timeLeft--;
  }, 1000);
}

import { loadQuestions } from "./test.js";

export { getExamCode, getRollNumber };
