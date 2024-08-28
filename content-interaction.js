// content-interaction.js

(function() {
    'use strict';

    const HOSTS = ['zerogpt.com', 'gptzero.me'];
    const DEBUG = true;

    function log(message) {
        if (DEBUG) console.log(`[Content Interaction]: ${message}`);
    }

    log('Script initialized');

    /**
     * Interacts with the textarea element on the page.
     * @param {string} value - The text to be inserted into the textarea.
     */
    async function interactWithTextArea(value) {
        const element = document.querySelector('textarea');
        if (!element || element.disabled) return;

        element.focus();
        element.value = value;

        ['change', 'input'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        // Handle React-specific attributes
        Array.from(element.attributes)
            .filter(attr => attr.name.includes('_react'))
            .forEach(reactAttr => {
                ['change', 'keydown', 'keyup', 'mouseenter'].forEach(eventType => {
                    if (typeof element[reactAttr.name][eventType] === 'function') {
                        element[reactAttr.name][eventType]({ target: { value } });
                    }
                });
                if (typeof element[reactAttr.name].blur === 'function') {
                    element[reactAttr.name].blur();
                }
            });
    }

    /**
     * Finds a button by its text content.
     * @param {string} text - The text to search for in button content.
     * @returns {HTMLElement|null} - The found button element or null.
     */
    function findButtonByText(text) {
        const elements = Array.from(document.querySelectorAll('button, [role="menuitem"], [type="submit"]'));
        return elements.find(el => el.textContent.trim().toLowerCase().includes(text.toLowerCase())) || null;
    }

    /**
     * Checks if the current host matches any in the HOSTS array.
     * @returns {string} - The matched host or an empty string.
     */
    function getMatchingHost() {
        const currentUrl = window.location.href;
        log(`Checking if current URL matches hosts: ${HOSTS.join(', ')}`);
        return HOSTS.find(host => currentUrl.includes(host)) || '';
    }

    /**
     * Prompts the user to paste content.
     * @returns {Promise<string>} - A promise that resolves with the pasted content.
     */
    function safeClipboardRead() {
        log('Prompting user to paste content');
        return new Promise(resolve => {
            const userInput = prompt("Please paste your text here:");
            resolve(userInput || '');
        });
    }

    /**
     * Simulates a click on the given element using multiple methods.
     * @param {HTMLElement} element - The element to click.
     */
    function simulateClick(element) {
        if (!element) {
            log('No element provided to simulateClick');
            return;
        }

        log('Attempting to simulate click');

        // Method 1: Dispatch click event
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);

        // Method 2: Use the click() method
        if (typeof element.click === 'function') {
            element.click();
        }

        // Method 3: Trigger mousedown and mouseup events
        const mousedownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const mouseupEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(mousedownEvent);
        element.dispatchEvent(mouseupEvent);

        // Method 4: Focus and then trigger keydown/keyup for Enter key
        element.focus();
        const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter', bubbles: true });
        element.dispatchEvent(keydownEvent);
        element.dispatchEvent(keyupEvent);

        log('Click simulation attempts completed');
    }

    /**
     * Main function to handle the content interaction process.
     */
    async function main() {
        log('Main function started');
        const host = getMatchingHost();
        if (!host) {
            log('Current host does not match target hosts. Exiting.');
            return;
        }

        const clipboardText = await safeClipboardRead();
        log(`User input text length: ${clipboardText.length}`);

        if (clipboardText.length > 0) {
            log('User provided content. Interacting with textarea.');
            await interactWithTextArea(clipboardText);

            const textarea = document.querySelector('textarea');
            if (textarea && textarea.value.length > 0) {
                let submitButton = null;
                if (host === "zerogpt.com") {
                    submitButton = findButtonByText('detect text');
                } else if (host === "gptzero.me") {
                    submitButton = findButtonByText('check origin');
                }
                
                if (submitButton) {
                    log('Submit button found, simulating click');
                    simulateClick(submitButton);
                    
                    // Add a delay and then check if the button is still clickable
                    setTimeout(() => {
                        if (submitButton.offsetParent !== null) {
                            log('Button might not have been clicked. Attempting again.');
                            simulateClick(submitButton);
                        } else {
                            log('Button appears to have been clicked successfully.');
                        }
                    }, 1000);
                } else {
                    log('Submit button not found');
                }
            }
        } else {
            log('No content provided. No action taken.');
        }
    }

    // Execute main function when the document is ready
    if (document.readyState === 'complete') {
        log('Document already loaded. Executing main function immediately.');
        main();
    } else {
        log('Document not yet loaded. Adding load event listener.');
        window.addEventListener('load', main);
    }
})();
