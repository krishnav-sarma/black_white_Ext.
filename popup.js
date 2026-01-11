const btn = document.getElementById("apply");
const btnText = document.getElementById("btnText");

btn.addEventListener("click", async () => {
  // 🔹 Change text immediately (optimistic UI)
  btnText.textContent =
    btnText.textContent === "Enable" ? "Disable" : "Enable";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const elements = document.querySelectorAll("*");
      const enabled = document.body.dataset.bwEnabled === "true";

      if (!enabled) {
        elements.forEach(el => {
          el.dataset.oldBg = el.style.backgroundColor;
          el.dataset.oldColor = el.style.color;
          el.dataset.oldBorder = el.style.borderColor;

          el.style.backgroundColor = "black";
          el.style.color = "white";
          el.style.borderColor = "white";
        });

        document.body.dataset.bwEnabled = "true";
        return true;
      } else {
        elements.forEach(el => {
          el.style.backgroundColor = el.dataset.oldBg || "";
          el.style.color = el.dataset.oldColor || "";
          el.style.borderColor = el.dataset.oldBorder || "";

          delete el.dataset.oldBg;
          delete el.dataset.oldColor;
          delete el.dataset.oldBorder;
        });

        delete document.body.dataset.bwEnabled;
        return false;
      }
    }
  });

  // 🔁 Sync text with actual page state (safety)
  btnText.textContent = result[0].result ? "Disable" : "Enable";
});
