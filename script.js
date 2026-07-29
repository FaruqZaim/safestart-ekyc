const screens = [...document.querySelectorAll(".screen")];
const progressWrap = document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");

const stepMap = {
  account: 1,
  details: 2,
  consent: 3,
  upload: 4,
  selfie: 5
};

let currentScreen = "welcome";
let previousScreen = "welcome";
let selfieTaken = false;

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;

  previousScreen = currentScreen;
  currentScreen = id;

  screens.forEach(screen => screen.classList.remove("active"));
  target.classList.add("active");

  if (stepMap[id]) {
    const step = stepMap[id];
    const percent = step * 20;
    progressWrap.classList.remove("hidden");
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `Step ${step} of 5`;
    progressPercent.textContent = `${percent}%`;
  } else {
    progressWrap.classList.add("hidden");
  }

  if (id === "verification") runChecks();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-go]");
  if (trigger) showScreen(trigger.dataset.go);
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  showScreen("welcome");
});

document.getElementById("accountForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.getElementById("accountError");

  if (!form.checkValidity()) {
    error.textContent = "Please complete every field correctly. Password must contain at least 8 characters.";
    return;
  }

  error.textContent = "";
  showScreen("details");
});

document.getElementById("detailsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.getElementById("detailsError");
  const nric = document.getElementById("nric").value.trim().toUpperCase();
  const nricPattern = /^[STFGM]\d{7}[A-Z]$/;

  if (!form.checkValidity()) {
    error.textContent = "Please complete all personal details.";
    return;
  }

  if (!nricPattern.test(nric)) {
    error.textContent = "Enter a valid NRIC format, for example S1234567A.";
    return;
  }

  error.textContent = "";
  showScreen("consent");
});

document.getElementById("consentContinue").addEventListener("click", () => {
  const dataConsent = document.getElementById("dataConsent").checked;
  const verifyConsent = document.getElementById("verifyConsent").checked;
  const error = document.getElementById("consentError");

  if (!dataConsent || !verifyConsent) {
    error.textContent = "Please agree to both statements before continuing.";
    return;
  }

  error.textContent = "";
  showScreen("upload");
});

function handleFile(inputId, statusId, boxId) {
  const input = document.getElementById(inputId);
  const status = document.getElementById(statusId);
  const box = document.getElementById(boxId);

  input.addEventListener("change", () => {
    if (input.files.length) {
      status.textContent = "Image selected ✓";
      box.classList.add("ready");
    } else {
      status.textContent = "Choose image";
      box.classList.remove("ready");
    }
  });
}

handleFile("frontFile", "frontStatus", "frontBox");
handleFile("backFile", "backStatus", "backBox");

document.getElementById("uploadContinue").addEventListener("click", () => {
  const front = document.getElementById("frontFile").files.length;
  const back = document.getElementById("backFile").files.length;
  const error = document.getElementById("uploadError");

  if (!front || !back) {
    error.textContent = "Please select both the front and back NRIC images.";
    return;
  }

  error.textContent = "";
  showScreen("selfie");
});

document.getElementById("takeSelfie").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const success = document.getElementById("selfieSuccess");

  if (!selfieTaken) {
    selfieTaken = true;
    success.classList.remove("hidden");
    button.textContent = "Continue";
    return;
  }

  showScreen("verification");
});

function runChecks() {
  const items = [...document.querySelectorAll(".check-item")];
  const resultOptions = document.getElementById("resultOptions");

  items.forEach(item => {
    item.classList.remove("done");
    item.querySelector("span").textContent = "○";
  });
  resultOptions.classList.add("hidden");

  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("done");
      item.querySelector("span").textContent = "✓";

      if (index === items.length - 1) {
        setTimeout(() => resultOptions.classList.remove("hidden"), 350);
      }
    }, 700 * (index + 1));
  });
}

document.getElementById("helpBack").addEventListener("click", () => {
  showScreen(previousScreen === "help" ? "welcome" : previousScreen);
});
