(function() {
    // Check if the current URL includes the target domain
    if (window.location.hostname.includes('swpc.noaa.gov')) {
        // Disable horizontal scrolling by setting the overflow-x property to hidden
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';

        /*
          On iOS, setting both the documentElement and body overflow-x to hidden should prevent 
          horizontal scrolling. This works on most modern browsers, including those on iOS devices.
        */
    }
})();
