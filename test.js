/* =====================
   THEME SYNC
===================== */
const themes={
  green:"#7cffb2",
  amber:"#ffcc66",
  blue:"#66ccff",
  purple:"#c77dff",
  red:"#ff6b6b"
};
const savedTheme=localStorage.getItem("itachiTheme");
if(savedTheme&&themes[savedTheme]){
  document.documentElement.style.setProperty("--accent",themes[savedTheme]);
}

/* =====================
   DATA
===================== */
const wordsList=[
  "focus","discipline","consistency","accuracy","speed",
  "practice","control","skill","effort","progress"
];

/* =====================
   STATE
===================== */
let mode="time";
let timeLimit=30;
let timeLeft=30;
let timer=null;
let started=false;
let startTime=null;

let charIndex=0;
let totalTyped=0;
let totalMistakes=0;

let selectedWords=25;

/* =====================
   DOM
===================== */
const typingText=document.getElementById("typingText");
const timeEl=document.getElementById("time");
const wpmEl=document.getElementById("wpm");
const accEl=document.getElementById("accuracy");
const options=document.getElementById("options");

/* =====================
   HOME NAVIGATION
===================== */
const homeBtn = document.getElementById("homeBtn");

if(homeBtn){
  homeBtn.onclick = () => {
    window.location.href = "index.html";
  };
}

/* Ctrl + H → Home */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && (e.key === "h" || e.key === "H")) {
    e.preventDefault();
    window.location.href = "index.html";
  }
});

/* =====================
   MODES
===================== */
document.querySelectorAll(".mode").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelector(".mode.active").classList.remove("active");
    btn.classList.add("active");
    mode=btn.dataset.mode;
    resetTest();
    renderOptions();
  };
});

/* =====================
   OPTIONS
===================== */
function renderOptions(){
  options.innerHTML="";

  if(mode==="time"){
    [15,30,60,120].forEach(t=>{
      const s=document.createElement("span");
      s.innerText=t;
      if(t===timeLimit)s.classList.add("active");
      s.onclick=()=>{
        timeLimit=t;
        resetTest();
        renderOptions();
      };
      options.appendChild(s);
    });

    const c=document.createElement("input");
    c.type="number";
    c.placeholder="custom";
    c.min=5;
    c.onchange=()=>{
      if(c.value>=5){
        timeLimit=parseInt(c.value);
        resetTest();
        renderOptions();
      }
    };
    options.appendChild(c);
  }

  if(mode==="words"){
    [10,25,50].forEach(w=>{   // 🔥 100 REMOVED
      const s=document.createElement("span");
      s.innerText=w;
      if(w===selectedWords)s.classList.add("active","blink");
      s.onclick=()=>{
        selectedWords=w;
        renderOptions();
        loadWords(w);
      };
      options.appendChild(s);
    });
  }
}

/* =====================
   LOAD WORDS
===================== */
function loadWords(count){
  typingText.innerHTML="";
  charIndex=0;
  totalTyped=0;
  totalMistakes=0;
  startTime=null;
  started=false;

  let arr=[];
  for(let i=0;i<count;i++){
    arr.push(wordsList[Math.floor(Math.random()*wordsList.length)]);
  }

  arr.join(" ").split("").forEach(ch=>{
    const span=document.createElement("span");
    span.innerText=ch;
    typingText.appendChild(span);
  });

  typingText.children[0].classList.add("active");
}

/* =====================
   TIMER (TIME MODE)
===================== */
function startTimer(){
  timer=setInterval(()=>{
    timeLeft--;
    timeEl.innerText=timeLeft;
    if(timeLeft<=10)timeEl.classList.add("blink");
    if(timeLeft<=0){
      clearInterval(timer);
      finishTest();
    }
  },1000);
}

/* =====================
   INPUT ENGINE
===================== */
document.addEventListener("keydown",e=>{
  if(mode==="time"&&timeLeft<=0)return;

  if(e.key==="Backspace"){
    if(charIndex>0){
      charIndex--;
      const s=typingText.children[charIndex];
      s.classList.remove("correct","wrong");
      s.classList.add("active");
      typingText.children[charIndex+1]?.classList.remove("active");
    }
    return;
  }

  if(e.key.length!==1)return;

  if(!started){
    started=true;
    startTime=Date.now();
    if(mode==="time")startTimer();
  }

  const span=typingText.children[charIndex];
  if(!span)return;

  totalTyped++;

  if(e.key===span.innerText){
    span.classList.add("correct");
  }else{
    span.classList.add("wrong");
    totalMistakes++;
  }

  span.classList.remove("active");
  charIndex++;

  if(charIndex<typingText.children.length){
    typingText.children[charIndex].classList.add("active");
  }else if(mode==="words"){
    finishTest();
  }

  updateStats();
});

/* =====================
   STATS
===================== */
function updateStats(){
  const correct=totalTyped-totalMistakes;
  let minutes;

  if(mode==="time"){
    minutes=timeLimit/60;
  }else{
    minutes=((Date.now()-startTime)/1000)/60;
  }

  const wpm=Math.round((correct/5)/minutes);
  const acc=totalTyped>0?Math.round((correct/totalTyped)*100):100;

  wpmEl.innerText=isFinite(wpm)?wpm:0;
  accEl.innerText=acc;
}

/* =====================
   FINISH
===================== */
function finishTest(){
  typingText.innerHTML=`
    <div style="text-align:center">
      <div style="font-size:32px;color:var(--accent)">test complete</div>
      <div>wpm ${wpmEl.innerText}</div>
      <div>accuracy ${accEl.innerText}%</div>
    </div>`;
}

/* =====================
   RESET
===================== */
function resetTest(){
  clearInterval(timer);
  timer=null;
  started=false;
  startTime=null;

  totalTyped=0;
  totalMistakes=0;

  timeLeft=timeLimit;
  timeEl.innerText=timeLeft;
  timeEl.classList.remove("blink");

  wpmEl.innerText=0;
  accEl.innerText=100;

  if(mode==="words"){
    loadWords(selectedWords);
  }else{
    loadWords(25);
  }
}

/* =====================
   INIT
===================== */
renderOptions();
resetTest();