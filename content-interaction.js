(function () {
    document.cookie = "clipboard=true";
    console.log('Script initialized');



    async function I(value) {
        const element = document.querySelector('textarea');
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

    function findButtonByText(text) {
        const allButtons = Array.from(document.querySelectorAll('button, [role="menuitem"]'));
        return allButtons.find(button => button.textContent.trim().toLowerCase().includes(text.toLowerCase())) || null;
    }



    function isMatchingHost() {
        const currentUrl = window.location.href;
        const hosts = ['zerogpt.com', 'gptzero.me'];
        console.log(`Checking if current URL matches hosts: ${hosts.join(', ')}`);
        return hosts.find(host => currentUrl.includes(host)) || '';
    }


    function safeClipboardRead() {
        console.log('Prompting user to paste content');
        return new Promise((resolve) => {
            const userInput = prompt("Please paste your text here:");
            resolve(userInput || '');
        });
    }

    async function main() {
        console.log('Main function started');
        if (isMatchingHost().length === 0) {
            console.log('Current host does not match target hosts. Exiting.');
            return;
        }

        const clipboardText = await safeClipboardRead();
        if (clipboardText.length > 0) {
            if (document.cookie.includes("clipboard=false")) {
                document.cookie = "clipboard=true"
            }
        }
        console.log(`User input text length: ${clipboardText.length}`);

        if (clipboardText.length > 0) {
            console.log('User provided content. Interacting with textarea.');
            await I(clipboardText);


        } else {
            console.log('No content provided. No action taken.');
        }
        if (document.cookie.includes("clipboard=true")) {
            if (document.querySelector('textarea').value.length > 0) {
                const host = isMatchingHost();
                let submitButton = null;
                if (host === "zerogpt.com") {
                    submitButton = findButtonByText('detect text');
                } else if (host === "gptzero.me") {
                    submitButton = findButtonByText('check origin');
                }
                if (submitButton) {
                    console.log('Submit button found, clicking');
                    submitButton.click();
                    observer.disconnect();
                }
            }
        }
    }

    if (document.readyState === 'complete') {
        console.log('Document already loaded. Executing main function immediately.');
        main();
    } else {
        console.log('Document not yet loaded. Adding load event listener.');
        window.addEventListener('load', () => {
            console.log('Document loaded. Executing main function.');
            main();
        });
    }



})();
