document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        login: document.getElementById('login-screen'),
        test: document.getElementById('test-screen'),
        solution: document.getElementById('solution-screen'),
    };
    const loginStuff = {
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        loginBtn: document.getElementById('login-btn'),
        errorMsg: document.getElementById('login-error'),
    };
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
    const DURATION = 2 * 60 * 60; 

    const credentials = {
        JJ: 'admin',
        Waigoon: 'Joi',
        Thimphu: 'Yensira',
        Meepooh: 'Meepooh',
        Win: 'Eovs',
    };

    // --- Functions ---
    const showScreen = (screenId) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenId].classList.add('active');
    };
    
    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', () => {
        const username = loginStuff.usernameInput.value.trim();
        const password = loginStuff.passwordInput.value.trim();

        if (credentials[username] && credentials[username] === password) {
            // If login is correct, just switch the screen.
            // We will load the problems and start the timer AFTER the screen is shown.
            showScreen('test');
            
            // Now, prepare the test screen
            loginStuff.errorMsg.textContent = '';
            lastScore = null;
            scoreDisplay.textContent = '';
            renderProblems();
            startTimer();
            
        } else {
            loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
        }
    });

    // (The rest of the script remains the same)

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        let timeLeft = DURATION;
        timerDisplay.textContent = formatTime(timeLeft);
        timerDisplay.classList.remove('warning', 'danger');
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

    const renderProblems = () => {
        problemContainer.innerHTML = '';
        problems[currentLang].forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'problem-card';
            card.innerHTML = `
                <h2>${p.title}</h2>
                <div class="problem-statement">${p.statement}</div>
                <input type="text" class="answer-input" id="answer-${index}" placeholder="${currentLang === 'en' ? 'Your answer' : 'คำตอบของคุณ'}">
            `;
            problemContainer.appendChild(card);
        });
        renderMath();
    };

    const submitTest = () => {
        clearInterval(timerInterval);
        let score = 0;
        for (let i = 0; i < problems[currentLang].length; i++) {
            const userInput = document.getElementById(`answer-${i}`).value.trim();
            const correctAnswer = solutions['en'][i].answer;
            if (userInput === correctAnswer) {
                score++;
            }
        }
        lastScore = score;
        displayScore(score);
        renderSolutions();
        showScreen('solution');
    };

    const displayScore = (score) => {
        if (currentLang === 'en') {
            scoreDisplay.textContent = `Your Score: ${score} / 10`;
        } else {
            scoreDisplay.textContent = `คะแนนของคุณ: ${score} / 10`;
        }
    };

    const renderSolutions = () => {
        solutionList.innerHTML = '';
        solutions[currentLang].forEach((s, index) => {
            const problem = problems[currentLang][index];
            const card = document.createElement('div');
            card.className = 'solution-card';
            card.innerHTML = `
                <h2>${problem.title}</h2>
                <div class="problem-statement">${problem.statement}</div>
                <hr>
                <p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${solutions.en[i].answer}</strong></p>
                <div class="solution-statement">${solutions.en[i].steps.replace(/(\r\n|\n|\r)/gm, " ")}</div>
            `;
            solutionList.appendChild(card);
        });
        renderMath();
    }
    
    const renderMath = () => {
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ]
            });
        }
    };
    
    const setLanguage = (lang) => {
        currentLang = lang;
        document.getElementById('login-title').textContent = lang === 'en' ? 'Mathematics Exam' : 'แบบทดสอบคณิตศาสตร์';
        document.getElementById('login-subtitle').textContent = lang === 'en' ? 'Mock Test' : 'ข้อสอบจำลอง';
        loginStuff.usernameInput.placeholder = lang === 'en' ? 'Username' : 'ชื่อผู้ใช้';
        loginStuff.passwordInput.placeholder = lang === 'en' ? 'Password' : 'รหัสผ่าน';
        loginStuff.loginBtn.textContent = lang === 'en' ? 'Login' : 'เข้าสู่ระบบ';
        document.getElementById('test-title').textContent = lang === 'en' ? 'Mathematics Exam' : 'แบบทดสอบคณิตศาสตร์';
        document.getElementById('timer-label').textContent = lang === 'en' ? 'Time Left:' : 'เวลาที่เหลือ:';
        document.getElementById('submit-btn').textContent = lang === 'en' ? 'Submit' : 'ส่งคำตอบ';
        document.getElementById('solution-title').textContent = lang === 'en' ? 'Results & Solutions' : 'ผลลัพธ์และเฉลย';
        document.getElementById('back-to-login-btn').textContent = lang === 'en' ? 'Back to Login' : 'กลับไปหน้าล็อคอิน';
        if (screens.test.classList.contains('active')) renderProblems();
        if (screens.solution.classList.contains('active')) {
            if (lastScore !== null) displayScore(lastScore);
            renderSolutions();
        }
    };

    const toggleLanguage = () => {
        setLanguage(currentLang === 'en' ? 'th' : 'en');
    };

    submitBtn.addEventListener('click', () => {
        if (confirm(currentLang === 'en' ? 'Are you sure you want to submit?' : 'คุณแน่ใจหรือไม่ว่าต้องการส่งคำตอบ?')) {
            submitTest();
        }
    });

    backToLoginBtn.addEventListener('click', () => {
        loginStuff.usernameInput.value = '';
        loginStuff.passwordInput.value = '';
        scoreDisplay.textContent = '';
        lastScore = null;
        showScreen('login');
    });
    
    langToggles.forEach(btn => btn.addEventListener('click', toggleLanguage));

    // --- Initial Setup ---
    setLanguage('en');

    // (Problem and Solution data is omitted for brevity but should be included as before)
    const problemsAndSolutionsData = {
        // ... all problem and solution objects go here ...
    };
    Object.assign(problems, problemsAndSolutionsData.problems);
    Object.assign(solutions, problemsAndSolutionsData.solutions);
});
