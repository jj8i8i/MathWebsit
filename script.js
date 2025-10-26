// ===== SCRIPT.JS (ULTRA SIMPLIFIED - VISIBILITY TEST with CSS) =====

// --- On-Screen Error Handler ---
window.onerror = function(message, source, lineno, colno, error) {
    try {
        const errorDiv = document.getElementById('error-display');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = `
                <h2>JavaScript Error!</h2>
                <p>Cannot load page content.</p>
                <p><b>Msg:</b> ${message || 'N/A'}<br>
                   <b>File:</b> ${source ? source.substring(source.lastIndexOf('/') + 1) : 'unknown'}<br>
                   <b>Line:</b> ${lineno || 'N/A'}</p>
                ${error && error.stack ? `<pre style="white-space: pre-wrap; word-break: break-all;">${error.stack}</pre>` : ''}`;
        } else {
            alert(`FATAL JS ERROR:\nMsg: ${message}\nLine: ${lineno}`);
        }
    } catch (e) {
        alert(`Double Fatal Error: ${message}`);
    }
    return true; // Prevent default browser error handling
};

// --- Main Script ---
try {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Loaded. Running simplified script WITH CSS...");
        const errorDiv = document.getElementById('error-display'); // Get error div again

        try {
            // Get screen elements
            const getElem = (id) => document.getElementById(id);
            const screens = {
                login: getElem('login-screen'),
                selection: getElem('selection-screen'),
                test: getElem('test-screen'),
                solution: getElem('solution-screen'),
            };
            const appDiv = getElem('app');

            // --- Core Show Screen ---
            const showScreen = (screenId) => {
                console.log(`Attempting to show screen: ${screenId}`);
                // Hide all screens
                Object.values(screens).forEach(screen => {
                    if (screen) screen.classList.remove('active');
                });
                // Show target screen
                const targetScreen = screens[screenId];
                if (targetScreen) {
                    targetScreen.classList.add('active');
                    console.log(`Screen ${screenId} activated.`);
                } else {
                     console.error(`Screen "${screenId}" element not found.`);
                     throw new Error(`Screen "${screenId}" element not found.`);
                }
            };


            // *** CRITICAL CHECK ***
            if (!appDiv) throw new Error("App container #app not found!");
            if (!screens.login) throw new Error("Login screen #login-screen not found!");


            console.log("Showing login screen...");
            showScreen('login'); // Make login screen visible
            console.log("Simplified script finished.");

        } catch (initError) {
            console.error("Error during simplified init:", initError);
            if (window.onerror) window.onerror(`Simplified Init Error: ${initError.message}`, "script.js", 0, 0, initError);
        }
    }); // End DOMContentLoaded

} catch (globalError) {
    console.error("FATAL ERROR outside DOMContentLoaded:", globalError);
    if (window.onerror) window.onerror("Early Script Error", "script.js", 0, 0, globalError);
}
