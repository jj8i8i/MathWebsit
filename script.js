// ===== SCRIPT.JS (ULTRA SIMPLIFIED - VISIBILITY TEST) =====

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
                ${error && error.stack ? `<pre style="white-space: pre-wrap;">${error.stack}</pre>` : ''}`;
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
        console.log("DOM Loaded. Running simplified script...");
        const errorDiv = document.getElementById('error-display'); // Get error div again

        try {
            // Get only the login screen element
            const loginScreen = document.getElementById('login-screen');
            const appDiv = document.getElementById('app');

            if (!appDiv) {
                 console.error("App container #app not found!");
                 throw new Error("App container #app not found!");
            }

            if (loginScreen) {
                console.log("Login screen element found.");
                // Directly make the login screen visible
                loginScreen.classList.add('active');
                console.log("Login screen should be active now.");

                // Test button existence (optional)
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) {
                    console.log("Login button found.");
                    // loginBtn.addEventListener('click', () => alert("Button works!"));
                } else {
                    console.warn("Login button not found.");
                }

            } else {
                console.error("Login screen element (#login-screen) NOT FOUND!");
                // Display error directly if login screen is missing
                 throw new Error("Login screen element (#login-screen) NOT FOUND!");
            }

            console.log("Simplified script finished.");

        } catch (initError) {
            console.error("Error during simplified init:", initError);
            // Use the onerror mechanism to display the error
            if (window.onerror) window.onerror(`Simplified Init Error: ${initError.message}`, "script.js", 0, 0, initError);
        }
    }); // End DOMContentLoaded

} catch (globalError) {
    // Catch errors outside DOMContentLoaded
    console.error("FATAL ERROR outside DOMContentLoaded:", globalError);
    if (window.onerror) window.onerror("Early Script Error", "script.js", 0, 0, globalError);
}
