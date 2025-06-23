chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg.type === "PASTE_SNIPPET") {
        const activeElement = document.activeElement;
        if (activeElement) {
            if (activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA") {
                const inputOrTextArea = activeElement;
                inputOrTextArea.value += msg.text ?? "";
                inputOrTextArea.dispatchEvent(new Event("input", { bubbles: true }));
            }
            else if (activeElement.isContentEditable) {
                const textToInsert = msg.text ?? "";
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const textNode = document.createTextNode(textToInsert);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                else {
                    console.warn("No selection range found in contenteditable element. Text might not be inserted at cursor.");
                    if (activeElement.textContent !== null) {
                        activeElement.textContent += textToInsert;
                    }
                }
                activeElement.dispatchEvent(new Event("input", { bubbles: true }));
                activeElement.focus();
            }
            else {
                navigator.clipboard
                    .writeText(msg.text)
                    .catch((e) => console.error("Failed to copy text:", e));
            }
        }
    }
});
export {};
