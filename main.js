const words =
  "the be to of and a in that have it you he will not on with as for at by this but from or which one would all say who here there when make like through just him know take into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us might still such off while three few own down name right sentence children help mean before call side house something place show man small find around hear second go believe must long where several answer night mind course rest act door turn center safe point speak fall early great tell sound go take thought real case support write watch sure listen pay team move best month go take step ever law let line several break ask problem become view close much room kind result large same hold serve never light idea hard let try thing pass school plan low keep provide share win interest local matter while here sense hope open story land research drive ground team reason time friend goal ready woman area wish child put leave all big book face sound next young system city fast tell person keep care without plan close money find run hold lose clear best keep find ask bring learn read class even case say home state year love talk follow share take work head plan stay school close light ask do cover girl love next area follow part close plan care home make order time clear report share add level see past room point lead share take work head plan lead stay school stay next view share year question move ask follow number young work light year make ask ask ask stay leave child".split(
    " "
  );

const gameTime = 60;
window.timer = null;
window.startTime = 0;
window.pauseTime = 0;

const game = document.getElementById("game");

function newGame() {
  removeClass(document.getElementById("game"), "over");
  document.getElementById("words").innerHTML = "";
  for (let i = 0; i < 300; i++) {
    document.getElementById("words").innerHTML += formatWord(randomWord());
  }
  //   focus error adding
  {
    const focusErr = document.createElement(`div`);
    focusErr.id = "focus-error";
    focusErr.innerText = "Click here to Focus";
    game.appendChild(focusErr);
    game.focus();
    window.timer = null;
  }
  document.getElementById("info").innerHTML = gameTime;
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
}

function getWpm() {
  const words = document.querySelectorAll(".word"); // Use NodeList directly
  let correctWordCount = 0;

  // Iterate through the words to count correct words
  for (let word of words) {
    const letters = word.children; // Get children directly
    let allCorrect = true; // Assume all letters are correct initially

    for (let letter of letters) {
      if (
        letter.classList.contains("incorrect") ||
        !letter.classList.contains("correct")
      ) {
        allCorrect = false; // Found an incorrect letter
        break; // No need to check further
      }
    }

    // Only increment the count if all letters are correct
    if (allCorrect && letters.length > 0) {
      correctWordCount++;
    }
  }

  return (correctWordCount / gameTime) * 60; // Return WPM
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById("game"), "over");
  const result = getWpm();
  document.getElementById("info").innerHTML = `WPM: ${result}`;
}

function formatWord(word) {
  return `<div class="word">
        ${word
          .split("")
          .map((letter) => `<span class="letter">${letter}</span>`)
          .join("")}
    </div>`;
}

function randomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function addClass(element, className) {
  element.className += " " + className;
}

function removeClass(element, className) {
  element.className = element.className.replace(className, "").trim();
}

game.addEventListener("keydown", (event) => {
  const key = event.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || " ";
  const isSpace = key === " ";
  const isLetter = key.length === 1 && key !== " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.querySelector(".letter");

  console.log(`key: ${key}, expected: ${expected}`);

  if (document.querySelector("#game.over")) return;

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.startTime) window.startTime = new Date().getTime();
      const currTime = new Date().getTime();
      const secPassed = Math.round((currTime - window.startTime) / 1000);

      // const msPassed = currentTime - window.startTime;
      // const sPassed = Math.round(msPassed / 1000);
      // const sLeft = Math.round(gameTime / 1000 - sPassed);
      const timeLeft = gameTime - secPassed;
      console.log(
        `secPassed: ${secPassed}, gameTime: ${gameTime}, currTime: ${currTime}, startTime: ${window.startTime}, timeLeft: ${timeLeft}`
      );
      if (timeLeft <= 0) {
        document.getElementById("info").innerHTML = timeLeft;
        gameOver();
        return;
      }
      document.getElementById("info").innerHTML = timeLeft;
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key == expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling)
        addClass(currentLetter.nextSibling, "current");
    } else {
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerText = key.trim();
      console.log(key, incorrectLetter, currentWord);

      incorrectLetter.classList.add("letter", "incorrect", "extra");
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== " ") {
      const lettersToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];
      console.log(lettersToInvalidate);
      lettersToInvalidate.forEach((letter) => {
        addClass(letter, "incorrect");
      });
    }
    removeClass(currentWord, "current");
    addClass(currentWord.nextSibling, "current");
    const firstLetter = currentWord.nextSibling.querySelector(".letter");
    if (firstLetter) addClass(firstLetter, "current");
    if (currentLetter) {
      removeClass(currentLetter, "current");
    }
  }

  if (isBackspace) {
    const isExtra = currentWord.lastElementChild?.classList.contains("extra");
    if (
      currentLetter &&
      isFirstLetter &&
      currentWord === document.querySelector(".word:first-child")
    ) {
      return;
    } else if (!currentLetter && isExtra) {
      currentWord.removeChild(currentWord.lastElementChild);
    } else if (currentLetter && isFirstLetter) {
      console.log(key, expected);
      // make prev word current
      removeClass(currentWord, "current");
      addClass(currentWord.previousSibling, "current");
      // make last letter current
      removeClass(currentLetter, "current");
      const lastLetter = currentWord.previousSibling?.lastElementChild;
      if (lastLetter) {
        addClass(lastLetter, "current");
        removeClass(lastLetter, "incorrect");
        removeClass(lastLetter, "correct");
      }
    } else if (currentLetter && !isFirstLetter) {
      // move back one letter and invalidate letter
      removeClass(currentLetter, "current");
      const prevLetter = currentLetter.previousElementSibling;
      if (prevLetter) {
        addClass(prevLetter, "current");
        removeClass(prevLetter, "incorrect");
        removeClass(prevLetter, "correct");
      }
    } else if (!currentLetter) {
      addClass(currentWord.lastElementChild, "current");
      removeClass(currentWord.lastElementChild, "incorrect");
      removeClass(currentWord.lastElementChild, "correct");
    }
  }

  // to Move Lines Up
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px");
    words.style.marginTop = margin - 35 + "px";
  }
});

document.getElementById("btn").addEventListener("click", () => {
  location.reload(); // Refresh the page
});

newGame();
