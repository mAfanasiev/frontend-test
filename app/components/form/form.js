const form = document.getElementById("form");
const inputs = form.querySelectorAll(".form__field-input");
const tips = document.querySelector(".form__field-tips");
const overlay = document.querySelector(".form__help-overlay");
let focus;

tips.addEventListener("click", openTips);
overlay.addEventListener("click", closeTips);
form.addEventListener("submit", submitForm);
document.addEventListener("click", resetAllErrors);
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("focus", focusInput);
  inputs[i].addEventListener("blur", blurInput);
}

function openTips() {
  this.parentElement.classList.toggle("active");
  overlay.classList.add("active");
}

function closeTips() {
  tips.parentElement.classList.remove("active");
  overlay.classList.remove("active");
}

function showError(container) {
  resetAllErrors();
  container.classList.add("error");
  var msgElem = document.createElement("span");
  msgElem.className = "error-message";
  msgElem.innerHTML = "<b>Required field.</b> Can’t be empty";
  container.parentElement.appendChild(msgElem);
}

function resetError(container) {
  container.className = "form__field-input";
  if (container.nextElementSibling && container.nextElementSibling.className == "error-message") {
    container.parentElement.removeChild(container.nextElementSibling);
  }
}

function resetAllErrors() {
  for (let i = 0; i < inputs.length; i++) {
    resetError(inputs[i]);
  }
}

function submitForm(e) {
  if (focus) return e.preventDefault();

  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].value) {
      e.preventDefault();
      showError(inputs[i]);
      return;
    }
  }
}

function focusInput() {
  focus = true;
  this.addEventListener("keydown", handlerKeyUp);
}

function handlerKeyUp(e) {
  if (e.keyCode === 13 || e.keyCode === 9) {
    setTimeout(() => {
      if (!this.value) {
        showError(this);
      }
    }, 10);
  }
}

function blurInput() {
  focus = false;
}