const typingText = document.querySelector('.typing-text p'),
  inpField = document.querySelector('.wrapper .input-field'),
  tryAgainBtn = document.querySelector('.content button'),
  timeTag = document.querySelector('.time span b'),
  mistakeTag = document.querySelector('.mistake span'),
  wpmTag = document.querySelector('.wpm span'),
  cpmTag = document.querySelector('.cpm span'),
  typingDiv = document.querySelector('.typing-text')

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = (mistakes = isTyping = 0)


function loadParagraph() {
  const ranIndex = Math.floor(Math.random() * paragraphs.length)
  typingText.innerHTML = ''
  paragraphs[ranIndex].split('').forEach((char) => {
    let span = `<span>${char}</span>`
    typingText.innerHTML += span
  })
  typingText.querySelectorAll('span')[0].classList.add('active')
  document.addEventListener('keydown', () =>
    inpField.focus(),
  ) /*yet to be understand */
  typingText.addEventListener('click', () => inpField.focus())
}

function initTyping() {
  let characters = typingText.querySelectorAll('span') // paragraph text
  // console.log(inpField.value)
  let typedChar = inpField.value.split('')[charIndex]
  console.log(typedChar)
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000)
      isTyping = true
    }
    if (typedChar === undefined) {
      // when typed character is backspace
      if (charIndex > 0) {
        //if the previous character is incorrect then remove the incorrect class
        charIndex--
        if (characters[charIndex].classList.contains('incorrect')) {
          mistakes--
        }
        characters[charIndex].classList.remove('correct', 'incorrect')
      }
    } else {
      // when typed character is other than backspace
      if (characters[charIndex].innerText === typedChar) {
        // if typed character matches with the paragraph character then add the correct class
        characters[charIndex].classList.add('correct')
      } else {
        // else add the incorrect class and increase the mistake by one
        mistakes++
        characters[charIndex].classList.add('incorrect')
      }
      charIndex++
    }
    // blinking underline is removed from the previous charcter
    characters.forEach((span) => span.classList.remove('active')) // removed the active class from each of the character of paragraph text
    characters[charIndex].classList.add('active') // then added to the current character
    // so this wpm is for every change in the input
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60,
    ) // again find the wpm
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm

    wpmTag.innerText = wpm
    mistakeTag.innerText = mistakes
    cpmTag.innerText = charIndex - mistakes
  } else {
    clearInterval(timer)
    inpField.value = ''
    typingDiv.classList.add('typingDisable')
    // console.log('Hi in typing');
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--
    timeTag.innerText = timeLeft
    // this wpm is calculated on every second
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60,
    )
    wpmTag.innerText = wpm
  }
  else {
    typingDiv.classList.add('typingDisable')
    // console.log('Hi in initTimer');
    clearInterval(timer)
  }
}

function resetGame() {
  typingDiv.classList.remove('typingDisable')
  loadParagraph()
  clearInterval(timer)
  timeLeft = maxTime
  charIndex = mistakes = isTyping = 0
  inpField.value = ''
  timeTag.innerText = timeLeft
  wpmTag.innerText = 0
  mistakeTag.innerText = 0
  cpmTag.innerText = 0
}

loadParagraph()
inpField.addEventListener('input', initTyping)
tryAgainBtn.addEventListener('click', resetGame)
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    e.preventDefault()
  }
})
