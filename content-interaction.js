(function () {
    console.log('Script initialized');

    /**
     * Checks if the current URL matches any of the specified hosts.
     * @returns {string} The matched host or an empty string if no match.
     */
    function isMatchingHost() {
        const currentUrl = window.location.href;
        const hosts = ['zerogpt.com', 'gptzero.me'];
        console.log(`Checking if current URL matches hosts: ${hosts.join(', ')}`);
        return hosts.find(host => currentUrl.includes(host)) || '';
    }

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
     * Attempts to paste content into the specified element.
     * @param {Element} element - The element to paste into.
     */
    function attemptPaste(element) {
        console.log('Attempting to paste content');
        element.focus();
        document.execCommand('paste');
        console.log(`Element value after paste attempt: ${element.value}`);

        if (element.value) {
            console.log('Content pasted successfully');
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.log('Paste attempt failed or no content in clipboard');
        }
    }

    /**
     * Sets up a mutation observer to watch for the textarea element and submit button.
     */
    function setupMutationObserver() {
        console.log('Setting up mutation observer');
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function (mutationsList, observer) {
            const textarea = document.querySelector('textarea');
            if (!textarea) return;

            if (textarea.value.length === 0) {
                console.log('Empty textarea found');
                attemptPaste(textarea);
            } else {
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
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    /**
     * Main function to execute when the page is loaded.
     */
    function main() {
        console.log('Main function started');
        const host = isMatchingHost();
        if (!host) {
            console.log('Current host does not match target hosts. Exiting.');
            return;
        }
        console.log(`Matched host: ${host}`);
        setupMutationObserver();
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
