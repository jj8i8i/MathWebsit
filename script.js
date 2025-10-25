// ===== SCRIPT.JS (FINAL ROBUST VERSION v3 - Focus on Screen Transition) =====
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        login: document.getElementById('login-screen'),
        selection: document.getElementById('selection-screen'),
        test: document.getElementById('test-screen'),
        solution: document.getElementById('solution-screen'),
    };
    const loginStuff = {
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        loginBtn: document.getElementById('login-btn'),
        errorMsg: document.getElementById('login-error'),
    };
    const loginCard = document.querySelector('#login-screen .card');
    const examListContainer = document.getElementById('exam-list-container');
    const timerDisplay = document.getElementById('timer');
    const problemContainer = document.getElementById('problem-container');
    const solutionList = document.getElementById('solution-list');
    const scoreDisplay = document.getElementById('score-display');
    const submitBtn = document.getElementById('submit-btn');
    const backToSelectionBtn = document.getElementById('back-to-selection-btn');
    const langToggles = document.querySelectorAll('.lang-toggle');
    const welcomeMessages = document.querySelectorAll('.welcome-message');
    const logoutBtns = document.querySelectorAll('.logout-btn');

    // --- State ---
    let timerInterval;
    let currentLang = 'en';
    let lastScore = null;
    let currentSetId = null;
    let currentUser = null;
    const DURATION = 2 * 60 * 60; 

    const credentials = {
        JJ: 'admin', Waigoon: 'Joi', Thimphu: 'Yensira',
        Meepooh: 'Meepooh', Win: 'Eovs',
    };
    
    // --- Data (Full data is at the bottom) ---
    const examSets = { 'nt1': { en: { name: "Number Theory Set 1" }, th: { name: "ทฤษฎีจำนวน ชุดที่ 1" } } };
    const allProblems = {};
    const allSolutions = {};

    // --- Core Functions ---
    const showScreen = (screenId) => {
        console.log(`Attempting to show screen: ${screenId}`); // Debug log
        if(loginCard) loginCard.classList.remove('authenticating');

        // Force hide all screens first
        Object.values(screens).forEach(screen => {
            if(screen) screen.classList.remove('active');
        });

        // Then show the target screen
        const targetScreen = screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log(`Screen ${screenId} should now be active.`); // Debug log
        } else {
             console.error(`Screen with id "${screenId}" not found!`); // Debug log
        }


        // Add/Remove body class for specific login screen centering
        if (screenId === 'login') {
            document.body.classList.add('login-active');
        } else {
            document.body.classList.remove('login-active');
        }
    };

    const renderMath = () => { /* ... same as before ... */ };
    const updateWelcomeMessage = () => { /* ... same as before ... */ };
    const renderSelectionScreen = () => { /* ... same as before ... */ };
    const renderProblems = () => { /* ... same as before ... */ };
    const startTimer = () => { /* ... same as before ... */ };
    const submitTest = () => { /* ... same as before ... */ };
    const displayScore = (score) => { /* ... same as before ... */ };
    const renderSolutions = () => { /* ... same as before ... */ };
    const setLanguage = (lang) => { /* ... same as before ... */ };
    const formatTime = (seconds) => { /* ... same as before ... */ };

    const loginAction = () => {
        loginCard.classList.add('authenticating');
        loginStuff.errorMsg.textContent = '';
        console.log("Login button clicked, showing loading."); // Debug log

        // Use setTimeout to ensure the loading indicator renders before checking credentials
        setTimeout(() => {
            const username = loginStuff.usernameInput.value.trim();
            const password = loginStuff.passwordInput.value.trim();
            console.log(`Verifying: User='${username}', Pass='${password}'`); // Debug log

            if (credentials[username] && credentials[username] === password) {
                console.log("Credentials verified successfully."); // Debug log
                currentUser = username;
                localStorage.setItem('loggedInUser', username); // Save session

                // Crucial Step: Show screen FIRST, then render content
                showScreen('selection');
                console.log("Called showScreen('selection')."); // Debug log

                // Use another small delay before rendering the selection screen content
                // This ensures the screen transition animation completes smoothly
                setTimeout(() => {
                     console.log("Rendering selection screen content now."); // Debug log
                     renderSelectionScreen();
                }, 50); // Small delay after screen transition

            } else {
                console.log("Credential verification failed."); // Debug log
                loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
                loginCard.classList.remove('authenticating'); // Remove loading on error
            }
        }, 50); // Short delay to show loading indicator reliably
    };

    const logoutAction = () => { /* ... same as before ... */ };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', loginAction);
    submitBtn.addEventListener('click', () => { /* ... same as before ... */ });
    backToSelectionBtn.addEventListener('click', () => { /* ... same as before ... */ });
    logoutBtns.forEach(btn => btn.addEventListener('click', logoutAction));
    langToggles.forEach(btn => btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'th' : 'en')));
    
    // --- Data Definitions ---
    // (Ensure the full problem/solution data from the previous correct response is here)
    Object.assign(allProblems, { /* full problem data object */ });
    Object.assign(allSolutions, { /* full solution data object */ });

    const initApp = () => {
        // Tie data together
        Object.keys(allSolutions).forEach(setId => {
            if (allSolutions[setId] && allSolutions[setId].th) { // Add safety check
                allSolutions[setId].th.forEach((sol_th, i) => {
                    if (allSolutions[setId].en && allSolutions[setId].en[i]) { // Add safety check
                        sol_th.answer = allSolutions[setId].en[i].answer;
                    }
                    if (allProblems[setId] && allProblems[setId].th && allProblems[setId].th[i]) { // Add safety check
                       sol_th.title = allProblems[setId].th[i].title;
                    }
                });
            }
        });

        // Check for a logged-in user session
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser && credentials[savedUser]) {
            currentUser = savedUser;
            showScreen('selection'); // Go straight to selection
            renderSelectionScreen(); // Render content after showing screen
        } else {
            showScreen('login'); // Show login screen
        }
        setLanguage('en'); // Set initial language AFTER deciding the screen
    };
    
    // Robust Initialization
    let katexLoaded = false;
    const checkKatexAndInit = () => {
        if (window.renderMathInElement) {
            if (!katexLoaded) {
                katexLoaded = true;
                console.log("KaTeX loaded, initializing app."); // Debug log
                initApp();
            }
        } else {
            console.log("Waiting for KaTeX..."); // Debug log
            setTimeout(checkKatexAndInit, 150); // Check again
        }
    };
    
    // --- Start the App ---
    checkKatexAndInit();
});

// --- FULL DATA (Copy from previous correct response) ---
Object.assign(allProblems, {'nt1':{en:[{title:"Problem 1",statement:"..."}, {title:"Problem 2",statement:"..."}, {title:"Problem 3",statement:"..."}, {title:"Problem 4",statement:"..."}, {title:"Problem 5",statement:"..."}, {title:"Problem 6",statement:"..."}, {title:"Problem 7",statement:"..."}, {title:"Problem 8",statement:"..."}, {title:"Problem 9",statement:"..."}, {title:"Problem 10",statement:"..."}],th:[{title:"โจทย์ข้อที่ 1",statement:"..."}, {title:"โจทย์ข้อที่ 2",statement:"..."}, {title:"โจทย์ข้อที่ 3",statement:"..."}, {title:"โจทย์ข้อที่ 4",statement:"..."}, {title:"โจทย์ข้อที่ 5",statement:"..."}, {title:"โจทย์ข้อที่ 6",statement:"..."}, {title:"โจทย์ข้อที่ 7",statement:"..."}, {title:"โจทย์ข้อที่ 8",statement:"..."}, {title:"โจทย์ข้อที่ 9",statement:"..."}, {title:"โจทย์ข้อที่ 10",statement:"..."}]}});
Object.assign(allSolutions, {'nt1':{en:[{answer:"1/4",steps:"..."},{answer:"6",steps:"..."},{answer:"8",steps:"..."},{answer:"45",steps:"..."},{answer:"-1",steps:"..."},{answer:"999",steps:"..."},{answer:"42",steps:"..."},{answer:"20",steps:"..."},{answer:"-arctan(1/7)",steps:"..."},{answer:"2",steps:"..."}],th:[{answer:"1/4",steps:"..."},{answer:"6",steps:"..."},{answer:"8",steps:"..."},{answer:"45",steps:"..."},{answer:"-1",steps:"..."},{answer:"999",steps:"..."},{answer:"42",steps:"..."},{answer:"20",steps:"..."},{answer:"-arctan(1/7)",steps:"..."},{answer:"2",steps:"..."}]}});
// --- Helper Functions (Copy from previous correct response) ---
const formatTime = (seconds) => { /* ... */ };
const renderMath = () => { /* ... */ };
const updateWelcomeMessage = () => { /* ... */ };
const renderSelectionScreen = () => { /* ... */ };
const renderProblems = () => { /* ... */ };
const displayScore = (score) => { /* ... */ };
const renderSolutions = () => { /* ... */ };
