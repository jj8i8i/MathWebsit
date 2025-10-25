// ===== SCRIPT.JS (FINAL VERSION WITH SESSION & CORRECT LOGIN LAYOUT) =====
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        login: document.getElementById('login-screen'),
        selection: document.getElementById('selection-screen'),
        test: document.getElementById('test-screen'),
        solution: document.getElementById('solution-screen'),
    };
    const loginStuff = { /* ... */ };
    const loginCard = document.querySelector('#login-screen .card');
    // ... (rest of element selections are the same)
    const backToSelectionBtn = document.getElementById('back-to-selection-btn');
    const welcomeMessages = document.querySelectorAll('.welcome-message');
    const logoutBtns = document.querySelectorAll('.logout-btn');

    // --- State & Data ---
    let timerInterval;
    let currentLang = 'en';
    let lastScore = null;
    let currentSetId = null;
    let currentUser = null;
    const DURATION = 2 * 60 * 60; 
    const credentials = { /* ... */ };
    const examSets = { /* ... */ };
    const allProblems = {};
    const allSolutions = {};

    // --- Core Functions ---
    const showScreen = (screenId) => {
        if(loginCard) loginCard.classList.remove('authenticating');
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenId]?.classList.add('active');

        // *** THIS IS THE FIX for layout ***
        // Add/Remove body class for specific login screen centering
        if (screenId === 'login') {
            document.body.classList.add('login-active');
        } else {
            document.body.classList.remove('login-active');
        }
    };

    // ... (renderMath, updateWelcomeMessage, renderSelectionScreen, renderProblems, startTimer, submitTest, displayScore, renderSolutions are the same as previous correct version)
    
    const renderMath = () => { /* ... */ };
    const updateWelcomeMessage = () => { /* ... */ };
    const renderSelectionScreen = () => { /* ... */ };
    const renderProblems = () => { /* ... */ };
    const startTimer = () => { /* ... */ };
    const submitTest = () => { /* ... */ };
    const displayScore = (score) => { /* ... */ };
    const renderSolutions = () => { /* ... */ };
    
    const setLanguage = (lang) => {
        currentLang = lang;
        // Update all static text based on language
        document.getElementById('login-title').textContent = lang === 'en' ? 'Mathematics Exam' : 'แบบทดสอบคณิตศาสตร์';
        loginStuff.usernameInput.placeholder = lang === 'en' ? 'Username' : 'ชื่อผู้ใช้';
        loginStuff.passwordInput.placeholder = lang === 'en' ? 'Password' : 'รหัสผ่าน';
        loginStuff.loginBtn.textContent = lang === 'en' ? 'Login' : 'เข้าสู่ระบบ';
        document.getElementById('selection-title').textContent = lang === 'en' ? 'Select Exam' : 'เลือกชุดข้อสอบ';
        document.getElementById('timer-label').textContent = lang === 'en' ? 'Time Left:' : 'เวลาที่เหลือ:';
        document.getElementById('submit-btn').textContent = lang === 'en' ? 'Submit' : 'ส่งคำตอบ';
        document.getElementById('solution-title').textContent = lang === 'en' ? 'Results & Solutions' : 'ผลลัพธ์และเฉลย';
        document.getElementById('back-to-selection-btn').textContent = lang === 'en' ? 'Select Another Exam' : 'เลือกข้อสอบอื่น';
        document.getElementById('loading-text').textContent = lang === 'en' ? 'Verifying...' : 'กำลังตรวจสอบ...';
        logoutBtns.forEach(btn => btn.textContent = lang === 'en' ? 'Logout' : 'ออกจากระบบ');
        
        // Re-render dynamic content
        updateWelcomeMessage(); // Make sure welcome msg updates on lang change
        if (screens.selection.classList.contains('active')) renderSelectionScreen();
        if (screens.test.classList.contains('active')) {
            if(currentSetId) document.getElementById('test-title').textContent = examSets[currentSetId][currentLang].name;
            renderProblems();
        }
        if (screens.solution.classList.contains('active')) {
            if (lastScore !== null) displayScore(lastScore);
            renderSolutions();
        }
    };

    const loginAction = () => {
        loginCard.classList.add('authenticating');
        loginStuff.errorMsg.textContent = '';
        setTimeout(() => {
            const username = loginStuff.usernameInput.value.trim();
            const password = loginStuff.passwordInput.value.trim();
            if (credentials[username] && credentials[username] === password) {
                currentUser = username;
                localStorage.setItem('loggedInUser', username); // Save session
                renderSelectionScreen();
                showScreen('selection'); // This will remove body.login-active
            } else {
                loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
                loginCard.classList.remove('authenticating'); // Remove loading on error
            }
        }, 300);
    };

    const logoutAction = () => {
        currentUser = null;
        localStorage.removeItem('loggedInUser'); // Clear session
        loginStuff.usernameInput.value = '';
        loginStuff.passwordInput.value = '';
        showScreen('login'); // This will add body.login-active
    };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', loginAction);
    submitBtn.addEventListener('click', () => { /* ... */ }); // Same as before
    backToSelectionBtn.addEventListener('click', () => {
        renderSelectionScreen();
        showScreen('selection'); // This will remove body.login-active
    });
    logoutBtns.forEach(btn => btn.addEventListener('click', logoutAction);
    langToggles.forEach(btn => btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'th' : 'en')));
    
    // --- Data Definitions ---
    const formatTime = (seconds) => { /* ... */ }; // Same as before
    Object.assign(allProblems, { /* ... */ }); // Same as before
    Object.assign(allSolutions, { /* ... */ }); // Same as before

    const initApp = () => {
        // Tie data together
        Object.keys(allSolutions).forEach(setId => {
            allSolutions[setId].th.forEach((sol_th, i) => {
                sol_th.answer = allSolutions[setId].en[i].answer;
                sol_th.title = allProblems[setId].th[i].title;
            });
        });

        // Check for a logged-in user session
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser && credentials[savedUser]) {
            currentUser = savedUser;
            renderSelectionScreen();
            showScreen('selection'); // Will remove body class
        } else {
            showScreen('login'); // Will add body class
        }
        setLanguage('en');
    };
    
    // Robust Initialization (Same as before)
    let katexLoaded = false;
    const checkKatexAndInit = () => { /* ... */ };
    
    // --- Start the App ---
    checkKatexAndInit();
});

// NOTE: Remember to copy the full problem and solution data from the previous version into the allProblems and allSolutions objects.
