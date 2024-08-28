(function () {
    console.log('Script initialized');

    /**
 * Finds a button by its text content.
 * @param {string} text - The text to search for in the button.
 * @returns {Element|null} The found button element or null.
 */
    function findButtonByText(text) {
        const allButtons = Array.from(document.querySelectorAll('button, [role="menuitem"]'));
        return allButtons.find(button => button.textContent.trim().toLowerCase().includes(text.toLowerCase())) || null;
    }


    /**
     * Interacts with an element on the page, setting its value and triggering events.
     * @param {string} selector - CSS selector for the target element.
     * @param {string} value - Value to set on the element.
     */
    function interactWithElement(selector, value) {
        console.log(`Attempting to interact with element: ${selector}`);
        const element = document.querySelector(selector);
        if (!element || element.disabled) {
            console.log(`Element not found or disabled: ${selector}`);
            return;
        }

        console.log(`Focusing on element: ${selector}`);
        element.focus();

        console.log(`Setting value for element: ${value}`);
        element.value = value;

        // Dispatch native events
        ['change', 'input'].forEach(eventType => {
            console.log(`Dispatching ${eventType} event`);
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        console.log('Finished interacting with element');
    }

    /**
     * Checks if the current URL matches any of the specified hosts.
     */

    function isMatchingHost() {
        const currentUrl = window.location.href;
        const hosts = ['zerogpt.com', 'gptzero.me'];
        console.log(`Checking if current URL matches hosts: ${hosts.join(', ')}`);
        return hosts.find(host => currentUrl.includes(host)) || '';
    }


    /**
     * Attempts to read the clipboard content using a user-triggered method.
     * @returns {Promise<string>} The clipboard content or an empty string if failed.
     */
    function safeClipboardRead() {
        console.log('Prompting user to paste content');
        return new Promise((resolve) => {
            const userInput = prompt("Please paste your text here:");
            resolve(userInput || '');
        });
    }

    /**
     * Main function to execute when the page is loaded.
     */
    async function main() {
        console.log('Main function started');
        if (isMatchingHost().length === 0) {
            console.log('Current host does not match target hosts. Exiting.');
            return;
        }

        const clipboardText = await safeClipboardRead();
        console.log(`User input text length: ${clipboardText.length}`);

        if (clipboardText.length > 0) {
            console.log('User provided content. Interacting with textarea.');
            interactWithElement('textarea', clipboardText);


        } else {
            console.log('No content provided. No action taken.');
        }
    }

    // Execute main function when the page is fully loaded
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

    // if (document.querySelector('textarea').value.length > 0) {
    //     const host = isMatchingHost();
    //     let submitButton = null;
    //     if (host === "zerogpt.com") {
    //         submitButton = findButtonByText('detect text');
    //     } else if (host === "gptzero.me") {
    //         submitButton = findButtonByText('check origin');
    //     }
    //     if (submitButton) {
    //         console.log('Submit button found, clicking');
    //         submitButton.click();
    //         observer.disconnect();
    //     }
    // }

})();
