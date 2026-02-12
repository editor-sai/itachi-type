/* =====================
   THEME SYNC
===================== */
const themes = {
  green:"#7cffb2",
  amber:"#ffcc66",
  blue:"#66ccff",
  purple:"#c77dff",
  red:"#ff6b6b"
};
const savedTheme = localStorage.getItem("itachiTheme");
if (savedTheme && themes[savedTheme]) {
  document.documentElement.style.setProperty("--accent", themes[savedTheme]);
}

/* =====================
   COURSE DATA (3 MONTHS)
===================== */
const lessons = [
  { title:"Month 1 · Home Row (Index & Middle)", text:`f j f j ff jj fff jjj fjf jfj d k d k dd kk ddd kkk dkd kdk f d k j dd ff kk jj df jk fd kj fdkj fdkj jkdf jkdf` },
  { title:"Month 1 · Home Row (Ring & Pinky)", text:`s l s l ss ll sss lll a ; a ; aa ;; aaa ;;; asdf jkl; asks dads fall lass glad halls` },
  { title:"Month 1 · Top Row (Index & Middle)", text:`frf juj frf juj ftf jyj ftf jyj ded kik de ki jug rug tug rut fire deer gear` },
  { title:"Month 1 · Top Row (Ring & Pinky)", text:`sws lol sws lol aqa ;p; area power write order world water words` },
  { title:"Month 1 · Bottom Row", text:`fv jn fv jn dc km sx l, az ;. van move neck back exam zone` },

  { title:"Month 2 · Shift Key (Capitals)", text:`Aa Ss Dd Ff India Japan France Korea The Quick Brown Fox` },
  { title:"Month 2 · Numbers (1–5)", text:`a1 s2 d3 f4 12345 Level 1 Room 2 Floor 3` },
  { title:"Month 2 · Numbers (6–0)", text:`j6 j7 k8 l9 ;0 67890 Page 6 Line 7 Item 8` },
  { title:"Month 2 · Punctuation", text:`Is it true? Yes! User's Guide; "Check file." 100% + 200%` },
  { title:"Month 2 · Word Rhythm", text:`the and for are though business professional computer practice` },

  { title:"Month 3 · Business Phrases", text:`As per our conversation Please let me know Thank you for response` },
  { title:"Month 3 · Technical Data", text:`Invoice 8829 Serial XP 992 IP 192.168.1.1 Port 8080` },
  { title:"Month 3 · Sentences (Short)", text:`Bright stars shine Focus on screen Accuracy before speed` },
  { title:"Month 3 · Sentences (Medium)", text:`Technology is changing Learning takes patience Practice daily` },
  { title:"Month 3 · Speed Sprint", text:`Pack my box with five dozen liquor jugs` },

  { title:"Final · Certification Test", text:`Typing is a fundamental skill Maintain posture Keep practicing Grow your career` }
];

/* =====================
   STATE + PROGRESS SAVE
===================== */
let lessonIndex = parseInt(localStorage.getItem("itachiProgress")) || 0;
let charIndex = 0;
let mistakes = 0;
let lessonText = "";

/* =====================
   DOM
===================== */
const typingText = document.getElementById("typingText");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");
const lessonTitle = document.getElementById("lessonTitle");
const lessonList = document.getElementById("lessonList");
const popup = document.getElementById("popup");

/* =====================
   BUILD LESSON LIST
===================== */
lessonList.innerHTML = "";
lessons.forEach((l, i) => {
  const div = document.createElement("div");
  div.className = "lesson";
  div.innerText = `${i + 1}. ${l.title}`;
  div.onclick = () => loadLesson(i);
  lessonList.appendChild(div);
});

/* =====================
   LOAD LESSON
===================== */
function loadLesson(i) {
  popup.style.display = "none";
  lessonIndex = i;
  localStorage.setItem("itachiProgress", lessonIndex);

  charIndex = 0;
  mistakes = 0;

  lessonTitle.innerText = lessons[i].title;
  accuracyEl.innerText = "100%";
  mistakesEl.innerText = "0";
  typingText.innerHTML = "";

  document.querySelectorAll(".lesson").forEach(l =>
    l.classList.remove("active")
  );
  lessonList.children[i].classList.add("active");

  lessonText = lessons[i].text.replace(/\s+/g, " ").trim();

  lessonText.split("").forEach(ch => {
    const span = document.createElement("span");
if (ch === " ") {
  span.innerHTML = "&nbsp;";
  span.classList.add("space");
} else {
  span.innerText = ch;
}
typingText.appendChild(span);

  });

  typingText.children[0].classList.add("active");
}

/* =====================
   INPUT ENGINE
===================== */
document.addEventListener("keydown", e => {

  /* ===== POPUP SHORTCUTS ONLY ===== */
  if (popup.style.display === "flex") {

    // Alt + N → Next lesson
    if (e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      if (lessonIndex < lessons.length - 1) {
        loadLesson(lessonIndex + 1);
      }
      return;
    }

    // Alt + R → Repeat lesson
    if (e.altKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      loadLesson(lessonIndex);
      return;
    }

    // popup open typing block
    return;
  }

  const spans = typingText.children;
  if (!spans[charIndex]) return;

  /* BACKSPACE */
  if (e.key === "Backspace") {
    if (charIndex > 0) {
      charIndex--;
      spans[charIndex].className = "";
      spans[charIndex].classList.add("active");
      spans[charIndex + 1]?.classList.remove("active");
    }
    return;
  }

  if (e.key.length !== 1) return;

  /* ===== CORRECT CHARACTER COMPARISON (SPACE FIX INCLUDED) ===== */
  const expectedChar = lessonText[charIndex];
  const typedChar = e.key;

  if (typedChar === expectedChar) {
    spans[charIndex].classList.add("correct");
  } else {
    spans[charIndex].classList.add("wrong");
    mistakes++;
  }

  spans[charIndex].classList.remove("active");
  charIndex++;

  updateStats();

  if (charIndex === spans.length) {
    finishLesson();
    return;
  }

  spans[charIndex].classList.add("active");
});

/* =====================
   STATS
===================== */
function updateStats() {
  const typed = charIndex;
  const correct = typed - mistakes;
  accuracyEl.innerText = typed
    ? Math.round((correct / typed) * 100) + "%"
    : "100%";
  mistakesEl.innerText = mistakes;
}

/* =====================
   FINISH + CERTIFICATE
===================== */
function finishLesson() {
  if (lessonIndex === lessons.length - 1) {
    showCertificate();
  } else {
    popup.style.display = "flex";
  }
}

/* =====================
   POPUP BUTTONS
===================== */
document.getElementById("repeat").onclick = () => loadLesson(lessonIndex);
document.getElementById("next").onclick = () => {
  if (lessonIndex < lessons.length - 1) {
    loadLesson(lessonIndex + 1);
  }
};

/* =====================
   CERTIFICATE SCREEN
===================== */
function showCertificate() {
  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#0b0f0d;
      color:#7cffb2;
      font-family:monospace;
      text-align:center
    ">
      <div style="border:2px solid #7cffb2;padding:40px">
        <h1>Congratulations!</h1>
        <p>You have successfully completed the itachiType 3-Month Typing Course</p>
        <p><b>Excellent work!</b></p>
      </div>
    </div>
  `;
  localStorage.removeItem("itachiProgress");
}

/* =====================
   INIT
===================== */
loadLesson(lessonIndex);
