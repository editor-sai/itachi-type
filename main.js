/* =====================
   THEME SWITCH
   ===================== */
const themes = {
  green:"#7cffb2",
  amber:"#ffcc66",
  blue:"#66ccff",
  purple:"#c77dff",
  red:"#ff6b6b"
};

document.querySelectorAll(".dot").forEach(dot=>{
  dot.onclick = () => {
    document.documentElement.style.setProperty(
      "--accent",
      themes[dot.dataset.theme]
    );
    localStorage.setItem("itachiTheme", dot.dataset.theme);
  };
});

const savedTheme = localStorage.getItem("itachiTheme");
if(savedTheme && themes[savedTheme]){
  document.documentElement.style.setProperty(
    "--accent",
    themes[savedTheme]
  );
}

/* =====================
   MOTIVATION QUOTES
   (SPACE FIX – FINAL)
   ===================== */
const quotes = [
  "consistency turns effort into skill.",
  "typing is not speed it is control.",
  "every accurate key press builds discipline.",
  "slow is smooth smooth becomes fast.",
  "focus today creates speed tomorrow.",
  "mastery is built one key stroke at a time."
];

const quoteEl = document.getElementById("quote");

function typeQuote(){
  const text = quotes[Math.floor(Math.random() * quotes.length)];
  let i = 0;
  quoteEl.innerHTML = "";

  const timer = setInterval(() => {
    const char = text[i];

    // 🔥 SPACE FIX
    if (char === " ") {
      quoteEl.innerHTML += "&nbsp;";
    } else {
      quoteEl.innerText += char;
    }

    i++;
    if (i >= text.length) clearInterval(timer);
  }, 45);
}

typeQuote();
