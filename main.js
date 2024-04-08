const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("button");
let fromText = document.querySelector(".from-text");
let toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const copyBtn = document.querySelectorAll("i");
let change = false;

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;
    if (id === 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id === 1 && country_code == "ar-SA") {
      selected = "selected";
    }
    let option = ` <option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

translateBtn.addEventListener("click", translateClick);

async function translateClick() {
  let text = fromText.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  toText.value = "";
  if (text == "") {
    toText.value = "";
    return;
  }
  toText.setAttribute("placeholder", "Translate...");
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    toText.value = "";
    toText.value = data.responseData.translatedText;
  } catch (error) {
    console.error("Error fetching translation:", error);
    toText.value = "";
  }
}

exchangeIcon.onclick = () => {
  [fromText.value, toText.value] = [toText.value, fromText.value];

  [selectTag[0].value, selectTag[1].value] = [
    selectTag[1].value,
    selectTag[0].value,
  ];
};

copyBtn.forEach((ele, i) => {
  ele.onclick = async ({ target }) => {
    let textCopied = "";
    let utterance;

    if (target.classList.contains("fa-copy") && i == 1) {
      textCopied = fromText.value;
    } else if (target.classList.contains("fa-copy") && i == 5) {
      textCopied = toText.value;
    } else if (target.classList.contains("fa-volume-up") && i == 0) {
      textCopied = fromText.value;
      utterance = new SpeechSynthesisUtterance(textCopied);
      utterance.lang = selectTag[0].value;
    } else if (target.classList.contains("fa-volume-up") && i == 4) {
      textCopied = toText.value;
      utterance = new SpeechSynthesisUtterance(textCopied);
      utterance.lang = selectTag[1].value;
    } else if (
      target.classList.contains("fa-microphone") ||
      (target.classList.contains("fa-square") && i == 2)
    ) {
      if (!change) {
        target.className = "fa-solid fa-square";
        target.classList.add("animation");
        target.style.color = "white";
        change = true;
      } else {
        target.className = "fa-solid fa-microphone";
        target.classList.remove("animation");
        target.style.color = "#9f9f9f9f";
        change = false;
      }
    }

    // Check if utterance is defined before attempting to speak
    if (utterance) {
      speechSynthesis.speak(utterance);
    } else {
      // For copying text to clipboard
      await navigator.clipboard.writeText(textCopied);
    }
  };
});
