// standalone-script.js

(function() {
    console.log('Standalone script initialized');

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
     * Sets up a mutation observer to watch for the textarea element.
     */
    function setupMutationObserver() {
        console.log('Setting up mutation observer');
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                        console.log('Textarea found');
                        observer.disconnect();
                        attemptPaste(textarea);
                        return;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
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
     * Main function to execute when the page is loaded.
     */
    function main() {
        console.log('Main function started');
        const hosts = ['zerogpt.com', 'gptzero.me'];
        if (!isMatchingHost(hosts)) {
            console.log('Current host does not match target hosts. Exiting.');
            return;
        }

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
