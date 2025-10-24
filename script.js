// ===== SCRIPT.JS (FINAL ROBUST VERSION) =====
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = { /* ... same as before ... */ };
    const loginStuff = { /* ... same as before ... */ };
    const loginCard = document.querySelector('#login-screen .card');
    const loginForm = document.getElementById('login-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const examListContainer = document.getElementById('exam-list-container');
    const timerDisplay = document.getElementById('timer');
    const problemContainer = document.getElementById('problem-container');
    // ... (the rest of the element selections are the same)

    // --- State & Data ---
    // ... (all state and data are the same as the previous version)

    // --- Core Functions ---
    const loginAction = () => {
        // --- THIS IS THE KEY CHANGE ---
        // 1. Immediately hide form and show loading spinner
        loginCard.classList.add('authenticating');
        loginStuff.errorMsg.textContent = '';

        // 2. Use a short delay to allow the UI to update
        setTimeout(() => {
            const username = loginStuff.usernameInput.value.trim();
            const password = loginStuff.passwordInput.value.trim();

            if (credentials[username] && credentials[username] === password) {
                // On success, the class will be removed by the screen change
                if (username === 'JJ') {
                    renderSelectionScreen();
                    showScreen('selection');
                    return;
                }
                let completedSetId = null;
                for (const setId in examSets) {
                    if (localStorage.getItem(`test_completed_${username}_${setId}`)) {
                        completedSetId = setId; break;
                    }
                }
                if (completedSetId) {
                    currentSetId = completedSetId;
                    scoreDisplay.textContent = '';
                    renderSolutions();
                    showScreen('solution');
                } else {
                    renderSelectionScreen();
                    showScreen('selection');
                }
            } else {
                // On failure, show error and bring back the form
                loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
                loginCard.classList.remove('authenticating');
            }
        }, 300); // 300ms delay for better UX
    };

    // --- ALL OTHER FUNCTIONS AND EVENT LISTENERS REMAIN THE SAME ---
    // (The full script is below for easy copy-paste)
});

// For easier replacement, here is the full script.js file:
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
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const langToggles = document.querySelectorAll('.lang-toggle');

    // --- State ---
    let timerInterval;
    let currentLang = 'en';
    let lastScore = null;
    let currentSetId = null;
    const DURATION = 2 * 60 * 60; 

    const credentials = {
        JJ: 'admin', Waigoon: 'Joi', Thimphu: 'Yensira',
        Meepooh: 'Meepooh', Win: 'Eovs',
    };

    const examSets = { 'nt1': { en: { name: "Number Theory Set 1" }, th: { name: "ทฤษฎีจำนวน ชุดที่ 1" } } };
    const allProblems = { /* Data is at the bottom */ };
    const allSolutions = { /* Data is at the bottom */ };

    // --- Core Functions ---
    const showScreen = (screenId) => {
        // Before showing a new screen, always remove the authenticating class from login
        if(loginCard) loginCard.classList.remove('authenticating');
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenId]?.classList.add('active');
    };

    const renderMath = () => {
        try {
            if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                    delimiters: [ {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false} ],
                    throwOnError: false
                });
            }
        } catch (error) { console.error("KaTeX rendering failed:", error); }
    };
    
    const renderSelectionScreen = () => {
        examListContainer.innerHTML = '';
        Object.keys(examSets).forEach(setId => {
            const setName = examSets[setId][currentLang].name;
            const card = document.createElement('div');
            card.className = 'exam-card';
            card.innerHTML = `<h2>${setName}</h2><button class="start-btn" data-set-id="${setId}">${currentLang === 'en' ? 'Start' : 'เริ่มทำ'}</button>`;
            examListContainer.appendChild(card);
        });
        document.querySelectorAll('.start-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                currentSetId = e.target.getAttribute('data-set-id');
                document.getElementById('test-title').textContent = examSets[currentSetId][currentLang].name;
                showScreen('test');
                renderProblems();
                startTimer();
            });
        });
        renderMath();
    };

    const renderProblems = () => {
        problemContainer.innerHTML = '';
        allProblems[currentSetId][currentLang].forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'problem-card';
            card.innerHTML = `<h2>${p.title}</h2><div class="problem-statement">${p.statement}</div><input type="text" class="answer-input" id="answer-${index}" placeholder="${currentLang === 'en' ? 'Your answer' : 'คำตอบของคุณ'}">`;
            problemContainer.appendChild(card);
        });
        renderMath();
    };

    const startTimer = () => {
        let timeLeft = DURATION;
        timerDisplay.textContent = formatTime(timeLeft);
        timerDisplay.classList.remove('warning', 'danger');
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft < 600 && timeLeft >= 60) timerDisplay.classList.add('warning');
            if (timeLeft < 60) timerDisplay.classList.add('danger');
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    };

    const submitTest = () => {
        if(!currentSetId) return;
        clearInterval(timerInterval);
        const username = loginStuff.usernameInput.value.trim();
        if (username !== 'JJ') {
            localStorage.setItem(`test_completed_${username}_${currentSetId}`, 'true');
        }
        let score = 0;
        allSolutions[currentSetId].en.forEach((sol, i) => {
            const userInputEl = document.getElementById(`answer-${i}`);
            if(userInputEl && userInputEl.value.trim() === sol.answer) {
                score++;
            }
        });
        lastScore = score;
        displayScore(score);
        renderSolutions();
        showScreen('solution');
    };

    const displayScore = (score) => {
        const total = allProblems[currentSetId][currentLang].length;
        scoreDisplay.textContent = currentLang === 'en' ? `Your Score: ${score} / ${total}` : `คะแนนของคุณ: ${score} / ${total}`;
    };

    const renderSolutions = () => {
        solutionList.innerHTML = '';
        const solutions = allSolutions[currentSetId][currentLang];
        const problems = allProblems[currentSetId][currentLang];
        solutions.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'solution-card';
            const formattedSteps = s.steps.replace(/\n/g, '<br><br>');
            card.innerHTML = `<h2>${problems[index].title}</h2><div class="problem-statement">${problems[index].statement}</div><hr><p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${s.answer}</strong></p><div class="solution-statement">${formattedSteps}</div>`;
            solutionList.appendChild(card);
        });
        renderMath();
    };
    
    const setLanguage = (lang) => {
        currentLang = lang;
        document.getElementById('login-title').textContent = lang === 'en' ? 'Mathematics Exam' : 'แบบทดสอบคณิตศาสตร์';
        loginStuff.usernameInput.placeholder = lang === 'en' ? 'Username' : 'ชื่อผู้ใช้';
        loginStuff.passwordInput.placeholder = lang === 'en' ? 'Password' : 'รหัสผ่าน';
        loginStuff.loginBtn.textContent = lang === 'en' ? 'Login' : 'เข้าสู่ระบบ';
        document.getElementById('selection-title').textContent = lang === 'en' ? 'Select Exam' : 'เลือกชุดข้อสอบ';
        document.getElementById('timer-label').textContent = lang === 'en' ? 'Time Left:' : 'เวลาที่เหลือ:';
        document.getElementById('submit-btn').textContent = lang === 'en' ? 'Submit' : 'ส่งคำตอบ';
        document.getElementById('solution-title').textContent = lang === 'en' ? 'Results & Solutions' : 'ผลลัพธ์และเฉลย';
        document.getElementById('back-to-login-btn').textContent = lang === 'en' ? 'Back to Login' : 'กลับไปหน้าล็อคอิน';
        document.getElementById('loading-text').textContent = lang === 'en' ? 'Verifying...' : 'กำลังตรวจสอบ...';
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
                if (username === 'JJ') {
                     renderSelectionScreen();
                     showScreen('selection');
                     return;
                }
                let completedSetId = null;
                for (const setId in examSets) {
                    if (localStorage.getItem(`test_completed_${username}_${setId}`)) {
                        completedSetId = setId; break;
                    }
                }
                if (completedSetId) {
                    currentSetId = completedSetId;
                    scoreDisplay.textContent = '';
                    renderSolutions();
                    showScreen('solution');
                } else {
                    renderSelectionScreen();
                    showScreen('selection');
                }
            } else {
                loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
                loginCard.classList.remove('authenticating');
            }
        }, 300);
    };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', loginAction);
    submitBtn.addEventListener('click', () => {
        if (confirm(currentLang === 'en' ? 'Are you sure you want to submit?' : 'คุณแน่ใจหรือไม่ว่าต้องการส่งคำตอบ?')) {
            submitTest();
        }
    });
    backToLoginBtn.addEventListener('click', () => {
        loginStuff.usernameInput.value = '';
        loginStuff.passwordInput.value = '';
        showScreen('login');
    });
    langToggles.forEach(btn => btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'th' : 'en')));
    
    // --- Data Definitions ---
    // (Omitted here for brevity, but they are the same as the previous version)
    // IMPORTANT: Make sure the full problems and solutions objects are included here
    Object.assign(allProblems, { /* full problem data object */ });
    Object.assign(allSolutions, { /* full solution data object */ });

    const initApp = () => {
        setLanguage('en');
    };
    
    // This robustly waits for the KaTeX script to be loaded and ready
    let katexLoaded = false;
    const kaTeXScript = document.querySelector('script[src*="auto-render.min.js"]');
    const checkKatex = () => {
        if (window.renderMathInElement) {
            initApp();
        } else if (!katexLoaded) {
            setTimeout(checkKatex, 100);
        }
    };
    if (kaTeXScript) {
        kaTeXScript.onload = () => { katexLoaded = true; checkKatex(); };
    } else {
        checkKatex();
    }
});

// NOTE: You need to copy the full problem and solution objects from the previous response and place them where the comments /* Data is at the bottom */ and /* full ... data object */ are.
