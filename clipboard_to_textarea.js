
async function I(selector, value) {
  const element = document.querySelector(selector);
  if (element.disabled)
    return;
  element.focus();

  if (element.tagName === "SELECT") {
    element.selectedIndex = value;
  } else if (element.tagName === "SPAN") {
    element.textContent += value;
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("change", {
    bubbles: true
  }));
  element.dispatchEvent(new Event("input", {
    bubbles: true
  }));

  [...element.attributes].filter((attr) => attr.name.includes("_react")).forEach((reactAttr) => {
    const events = ["change", "keydown", "keyup", "mouseenter"];
    events.forEach((event) => {
      if (typeof element[reactAttr.name][event] === "function") {
        element[reactAttr.name][event]({
          target: {
            value
          }
        });
      }
    }
    );
    if (typeof element[reactAttr.name].blur === "function") {
      element[reactAttr.name].blur();
    }
  }
  );
}

const URL = document.location.href;
const hosts = ["zerogpt.com", "gptzero.me"]
const anyHost = hosts.some((host) => URL.includes(host));
if (!anyHost) {
  return;
}

const waitForPage = setInterval(() => {
  if (document.readyState === "complete") {
    clearInterval(waitForPage);
  }
}, 500);

const wait = setInterval(async () => {
  if (document.hasFocus()) {
    clearInterval(wait);
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText.length > 0) {
      await I("textarea", clipboardText);
    }
  }
}, 1000);
