(function() {
    console.log('Standalone script initialized');

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
     * Attempts to retrieve content from the page or a predefined source.
     * @returns {string} The content to be used or an empty string if not found.
     */
    function getContent() {
        // Attempt to find content in the page
        const possibleSources = [
            () => document.querySelector('input[type="text"]')?.value,
            () => document.querySelector('textarea')?.value,
            () => window.getSelection().toString(),
            // Add more potential sources here
        ];

        for (const source of possibleSources) {
            const content = source();
            if (content) {
                console.log(`Content found: ${content.substring(0, 50)}...`);
                return content;
            }
        }

        console.log('No content found on the page');
        return '';
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

        const content = getContent();
        
        if (content.length > 0) {
            console.log('Content found. Interacting with textarea.');
            interactWithElement('textarea', content);
        } else {
            console.log('No content found. No action taken.');
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
