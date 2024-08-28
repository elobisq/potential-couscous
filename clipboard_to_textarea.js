/**
 * Interacts with an element on the page, setting its value and triggering events.
 * @param {string} selector - CSS selector for the target element.
 * @param {string} value - Value to set on the element.
 */
async function interactWithElement(selector, value) {
    const element = document.querySelector(selector);
    if (!element || element.disabled) return;

    element.focus();

    if (element.tagName === "SELECT") {
        element.selectedIndex = value;
    } else if (element.tagName === "SPAN") {
        element.textContent += value;
    } else {
        element.value = value;
    }

    // Dispatch native events
    ['change', 'input'].forEach(eventType => {
        element.dispatchEvent(new Event(eventType, { bubbles: true }));
    });

    // Handle React-specific attributes
    const reactAttributes = [...element.attributes].filter(attr => attr.name.includes('_react'));
    reactAttributes.forEach(reactAttr => {
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
 * Checks if the current URL matches any of the specified hosts.
 * @param {string[]} hosts - Array of host names to check against.
 * @returns {boolean} True if the current URL matches any host, false otherwise.
 */
function isMatchingHost(hosts) {
    const currentUrl = document.location.href;
    return hosts.some(host => currentUrl.includes(host));
}

/**
 * Main function to execute when the page is loaded.
 */
async function main() {
    const hosts = ['zerogpt.com', 'gptzero.me'];
    if (!isMatchingHost(hosts)) return;

    const waitInterval = setInterval(async () => {
        if (document.hasFocus()) {
            clearInterval(waitInterval);
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText.length > 0) {
                    await interactWithElement('textarea', clipboardText);
                }
            } catch (error) {
                console.error('Error accessing clipboard:', error);
            }
        }
    }, 1000);
}

// Execute main function when the page is fully loaded
if (document.readyState === 'complete') {
    main();
} else {
    window.addEventListener('load', main);
}
