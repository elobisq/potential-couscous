(function() {
    console.log('script initialized');

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
     * @param {string[]} hosts - Array of host names to check against.
     * @returns {boolean} True if the current URL matches any host, false otherwise.
     */
    function isMatchingHost(hosts) {
        const currentUrl = window.location.href;
        console.log(`Checking if current URL matches hosts: ${hosts.join(', ')}`);
        const isMatching = hosts.some(host => currentUrl.includes(host));
        console.log(`URL match result: ${isMatching}`);
        return isMatching;
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
        const hosts = ['zerogpt.com', 'gptzero.me'];
        if (!isMatchingHost(hosts)) {
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
})();
