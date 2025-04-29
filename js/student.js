let examCode = "";
let rollnumber = '';
function setExamCode(code,rollNumber) {
  examCode = code;
  rollnumber = rollNumber; 
}

function getExamCode() {
  return examCode;
}

function getRollNumber() {
  return rollnumber;
}

const button = document.getElementById('submit');
button.addEventListener('click', () => {
  const code = document.getElementById('exam-code').value.trim();
  const studentName = document.getElementById('student-name').value.trim();
  const rollNumber = document.getElementById('roll-number').value.trim();

  if (!code || !studentName || !rollNumber) {
    alert('Please fill all details');
  } else {
    setExamCode(code,rollNumber);
    document.querySelector('.test').style.display  = 'grid';
    document.getElementById('exam-code').disabled = true;
    document.getElementById('student-name').disabled = true;
    document.getElementById('roll-number').disabled = true;
    document.querySelector('.check').style.display = 'flex';
    button.disabled = true;
    startTimer();
    loadQuestions(); // call from test.js
  }
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

export { getExamCode };
export{getRollNumber}