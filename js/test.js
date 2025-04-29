import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getExamCode, getRollNumber } from "./student.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLeqZFHJjn03iWXagHoqJTwKaQzj5obqo",
  authDomain: "dual-panel-exam-app.firebaseapp.com",
  projectId: "dual-panel-exam-app",
  storageBucket: "dual-panel-exam-app.firebasestorage.app",
  messagingSenderId: "1054816284399",
  appId: "1:1054816284399:web:961764dce93dada84b351a",
  measurementId: "G-RRT9SCJTGT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let questions = [];
let currentIndex = 0;
let answers = [];

async function loadQuestions() {
  const collectionName = getExamCode();
  const rollNumber = getRollNumber();
  if (!collectionName || !rollNumber) return;

  const resultRef = doc(db, `${collectionName}_result`, rollNumber);
  const resultSnap = await getDoc(resultRef);
  if (resultSnap.exists()) {
    alert("You have already attempted the test. Retake not allowed.");
    document.querySelector('.test').style.display = 'none';
    return;
  }

  const querySnapshot = await getDocs(collection(db, collectionName));
  questions = [];
  querySnapshot.forEach((doc) => {
    questions.push(doc.data());
  });
  currentIndex = 0;
  showQuestion(currentIndex);
}

function showQuestion(index) {
  const q = questions[index];
  document.querySelector(".question").textContent = q.question;
  document.getElementById("optionA").textContent = q.options.A;
  document.getElementById("optionB").textContent = q.options.B;
  document.getElementById("optionC").textContent = q.options.C;
  document.getElementById("optionD").textContent = q.options.D;

  const radios = document.getElementsByName("answer");
  radios.forEach(r => r.checked = false);
}

function nextQuestion() {
  const answer = getSelectedAnswer();
  if (!answer) {
    alert("Please select an option.");
    return;
  }

  answers.push({
    question: questions[currentIndex].question,
    selected: answer
  });

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    document.querySelector('.test').style.display = 'none';
    displayResult();
  }
}

function getSelectedAnswer() {
  const radios = document.getElementsByName("answer");
  for (let radio of radios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

function displayResult() {
  const resultSection = document.createElement("section");
  resultSection.classList.add("result");
  let html = "<h2 style='padding-left: 25px'>Your Answers:</h2><ol>";
  answers.forEach((ans) => {
    html += `<li><strong>Q:</strong> ${ans.question}<br/><strong>Answer:</strong> ${ans.selected}</li>`;
  });
  html += `</ol><button class="saveresult" id="saveResult">Save Result</button>`;
  resultSection.innerHTML = html;
  document.body.appendChild(resultSection);

  document.getElementById("saveResult").addEventListener("click", saveResult);
}

async function saveResult() {
  const examCode = getExamCode();
  const rollNumber = getRollNumber();
  const resultCollection = `${examCode}_result`;

  const resultData = {
    rollNumber,
    answers
  };

  try {
    await setDoc(doc(db, resultCollection, rollNumber), resultData);
    alert("Result saved successfully!");
  } catch (error) {
    console.error("Error saving result: ", error);
    alert("Failed to save result.");
  }
}

document.getElementById("next").addEventListener("click", nextQuestion);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    alert("You switched tabs! Test is being submitted.");
    saveResult();
    document.querySelector('.test').style.display = 'none';
  }
});

export { loadQuestions };
