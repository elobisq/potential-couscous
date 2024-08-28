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

        if (element.tagName === "SELECT") {
            console.log(`Setting selectedIndex for SELECT element: ${value}`);
            element.selectedIndex = value;
        } else if (element.tagName === "SPAN") {
            console.log(`Appending text to SPAN element: ${value}`);
            element.textContent += value;
        } else {
            console.log(`Setting value for element: ${value}`);
            element.value = value;
        }

        // Dispatch native events
        ['change', 'input'].forEach(eventType => {
            console.log(`Dispatching ${eventType} event`);
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        // Handle React-specific attributes
        const reactAttributes = [...element.attributes].filter(attr => attr.name.includes('_react'));
        console.log(`Found ${reactAttributes.length} React-specific attributes`);
        reactAttributes.forEach(reactAttr => {
            console.log(`Processing React attribute: ${reactAttr.name}`);
            ['change', 'keydown', 'keyup', 'mouseenter'].forEach(eventType => {
                if (typeof element[reactAttr.name][eventType] === 'function') {
                    console.log(`Triggering React ${eventType} event`);
                    element[reactAttr.name][eventType]({ target: { value } });
                }
            });

            if (typeof element[reactAttr.name].blur === 'function') {
                console.log('Triggering React blur event');
                element[reactAttr.name].blur();
            }
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
     * Attempts to read the clipboard content using a fallback method for iOS.
     * @returns {Promise<string>} The clipboard content or an empty string if failed.
     */
    async function safeClipboardRead() {
        console.log('Attempting to read clipboard');
        if (navigator.clipboard && navigator.clipboard.readText) {
            try {
                return await navigator.clipboard.readText();
            } catch (error) {
                console.error('Error accessing clipboard API:', error);
            }
        }

        // Fallback method for iOS
        console.log('Using fallback method for clipboard access');
        return new Promise((resolve) => {
            const textArea = document.createElement('textarea');
            textArea.value = '';
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);

            document.execCommand('paste');
            const clipboardText = textArea.value;
            document.body.removeChild(textArea);

            resolve(clipboardText);
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

        console.log('Starting wait interval');
        const waitInterval = setInterval(async () => {
            console.log('Checking document focus');
            if (document.hasFocus()) {
                console.log('Document is focused. Clearing interval.');
                clearInterval(waitInterval);
                
                const clipboardText = await safeClipboardRead();
                console.log(`Clipboard text length: ${clipboardText.length}`);
                
                if (clipboardText.length > 0) {
                    console.log('Clipboard has content. Interacting with textarea.');
                    interactWithElement('textarea', clipboardText);
                } else {
                    console.log('Clipboard is empty or inaccessible. No action taken.');
                }
            } else {
                console.log('Document not focused. Waiting...');
            }
        }, 1000);
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
