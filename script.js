// ===== SCRIPT.JS (FINAL CORRECTED VERSION v2) =====
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
        JJ: 'admin',
        Waigoon: 'Joi',
        Thimphu: 'Yensira',
        Meepooh: 'Meepooh',
        Win: 'Eovs',
    };

    const examSets = {
        'nt1': {
            en: { name: "Number Theory Set 1" },
            th: { name: "ทฤษฎีจำนวน ชุดที่ 1" }
        }
    };

    const allProblems = {
        'nt1': {
            en: [
                { title: "Problem 1", statement: "Find the sum of all rational numbers $r$ for which the equation $r^2 x^2 + (r-1)x + (r-2) = 0$ has two distinct integer roots." },
                { title: "Problem 2", statement: "It is a known fact that the only integer solutions to $n | (2^n+1)$ are powers of 3. Find the second smallest integer $n>1$ that is not a power of 3, such that $n$ divides $2^n+2$." },
                { title: "Problem 3", statement: "The equation $x^2+y^2+z^2=3xyz$ is known as the Markov equation... Find the sum of the components of the unique non-trivial integer solution $(x,y,z)$ with $x \\le y \\le z$ and $z < 10$." },
                { title: "Problem 4", statement: "Let the sequence $a_n$ be defined for $n \\ge 1$ by $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$. Find the number of positive integers less than or equal to 2025 that are not in the set $\\{a_n | n \\in \\mathbb{Z}^+\\}$." },
                { title: "Problem 5", statement: "Let $p=2027$ (a prime number). Let $\\omega = e^{2\\pi i/p}$... Calculate the numerical value of the product $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$..." },
                { title: "Problem 6", statement: "Find the largest integer $n$ less than 1000 for which there exists a pair of positive integers $(x,y)$ satisfying the equation $x^2 - (n^2+1)y^2 = -1$." },
                { title: "Problem 7", statement: "Let $p=43$. Find the value of the sum $\\sum_{g} g \\pmod{p}$, where the sum is taken over all primitive roots $g$ in the range $1 \\le g < p$." },
                { title: "Problem 8", statement: "Let $\\sigma(n)$ denote the sum of the positive divisors of $n$. Find the smallest integer $n > 2$ such that $\\sigma(n) \\equiv 2 \\pmod{n}$." },
                { title: "Problem 9", statement: "Let $F_n$ be the $n$-th Fibonacci number... Evaluate the sum $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$." },
                { title: "Problem 10", statement: "Find the last non-zero digit in the decimal representation of $1000!$." }
            ],
            th: [
                { title: "โจทย์ข้อที่ 1", statement: "จงหาผลบวกของจำนวนตรรกยะ $r$ ทั้งหมดที่ทำให้สมการ $r^2 x^2 + (r-1)x + (r-2) = 0$ มีรากเป็นจำนวนเต็มที่แตกต่างกันสองค่า" },
                { title: "โจทย์ข้อที่ 2", statement: "เป็นที่ทราบกันว่าผลเฉลยจำนวนเต็มของ $n | (2^n+1)$ คือ $3^k$ เท่านั้น จงหาจำนวนเต็ม $n>1$ ที่ไม่ใช่กำลังของ 3 ที่มีค่าน้อยที่สุดเป็นอันดับที่สอง ที่สอดคล้องกับ $n$ หาร $2^n+2$ ลงตัว" },
                { title: "โจทย์ข้อที่ 3", statement: "สมการ $x^2+y^2+z^2=3xyz$ คือสมการมาร์คอฟ... จงหาผลบวกขององค์ประกอบของผลเฉลยจำนวนเต็มบวก $(x,y,z)$ ที่ไม่ใช่ผลเฉลยชัดแจ้งเพียงชุดเดียวที่สอดคล้องกับ $x \\le y \\le z$ และ $z < 10$" },
                { title: "โจทย์ข้อที่ 4", statement: "ให้ลำดับ $a_n$ สำหรับ $n \\ge 1$ นิยามโดย $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ จงหาจำนวนของจำนวนเต็มบวกที่ $\\le 2025$ ที่ไม่อยู่ในเซต $\\{a_n | n \\in \\mathbb{Z}^+\\}$" },
                { title: "โจทย์ข้อที่ 5", statement: "ให้ $p=2027$ (จำนวนเฉพาะ) และ $\\omega = e^{2\\pi i/p}$... จงคำนวณค่าของผลคูณ $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$..." },
                { title: "โจทย์ข้อที่ 6", statement: "จงหาจำนวนเต็ม $n$ ที่มากที่สุดที่น้อยกว่า 1000 ซึ่งมีคู่ของจำนวนเต็มบวก $(x,y)$ ที่สอดคล้องกับสมการ $x^2 - (n^2+1)y^2 = -1$" },
                { title: "โจทย์ข้อที่ 7", statement: "ให้ $p=43$ จงหาค่าของผลบวก $\\sum_{g} g \\pmod{p}$ โดยที่ผลบวกนี้กระทำบนทุกรากปฐมฐาน $g$ ในช่วง $1 \\le g < p$" },
                { title: "โจทย์ข้อที่ 8", statement: "ให้ $\\sigma(n)$ แทนผลบวกของตัวหารที่เป็นบวกของ $n$ จงหาจำนวนเต็ม $n > 2$ ที่น้อยที่สุดที่สอดคล้องกับ $\\sigma(n) \\equiv 2 \\pmod{n}$" },
                { title: "โจทย์ข้อที่ 9", statement: "ให้ $F_n$ เป็นจำนวนฟีโบนักชี... จงหาค่าของผลบวก $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$" },
                { title: "โจทย์ข้อที่ 10", statement: "จงหาเลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายในการเขียนแทน $1000!$ ในระบบเลขฐานสิบ" }
            ]
        }
    };

    const allSolutions = {
        'nt1': [
            { answer: "1/4", steps: "Let the integer roots be $m, n$. By Vieta's formulas... The sum is $1/4$." },
            { answer: "6", steps: "We need $n | 2^n+2$. If $n$ is even, let $n=2k$, so $k | (2^{2k-1}+1)$... This gives $n=2, 6, 66, ...$. The second smallest is 6." },
            { answer: "8", steps: "This is the Markov equation. We find solutions using Vieta Jumping... The largest solution with $z<10$ is $(1,2,5)$. The sum of its components is $1+2+5=8$." },
            { answer: "45", steps: "The sequence $a_n$ generates all positive integers except for the perfect squares... We need to find the number of perfect squares $\\le 2025$. Since $\\sqrt{2025}=45$, there are 45 such numbers." },
            { answer: "-1", steps: "The product is $P=(-1)^{h_{(-p)}}$, where $h_{(-p)}$ is the class number... For $p=2027 \\equiv 3 \\pmod 8$, the class number is odd. Therefore, $P = (-1)^{\\text{odd}} = -1$." },
            { answer: "999", steps: "The equation $x^2 - (n^2+1)y^2 = -1$ has a solution if the period length of the continued fraction of $\\sqrt{n^2+1}$ is odd. The length is 1 for all $n \\ge 1$. The largest $n<1000$ is 999." },
            { answer: "42", steps: "The sum of primitive roots modulo a prime $p$ is congruent to $\\mu(p-1) \\pmod p$. For $p=43$, we need $\\mu(42) = -1$. The sum is $-1 \\equiv 42 \\pmod{43}$." },
            { answer: "20", steps: "The condition implies that $n$ must be an abundant number... Testing abundant numbers in order: for $n=20$, $\\sigma(20)=42$. $42 = 2 \\cdot 20 + 2$, so $42 \\equiv 2 \\pmod{20}$. This is the smallest solution > 2." },
            { answer: "-arctan(1/7)", steps: "The term inside the arctan is of the form $\\frac{x-y}{1+xy}$... This creates a telescoping sum whose sum evaluates to $\\arctan(2) - \\arctan(3)$, which is $-\\arctan(1/7)$." },
            { answer: "2", steps: "We need to compute $X = \\frac{1000!}{10^{249}} \\pmod{10}$. This requires solving $X \\equiv 0 \\pmod 2$ and $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$. This resolves to $X \\equiv 2 \\pmod 5$. The only even digit is 2." }
        ]
    };
    
    // --- Core Functions ---

    const showScreen = (screenId) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }
    };

    const renderMath = () => {
        // This function will be called once the KaTeX script is loaded
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false}, {left: '\\[', right: '\\]', display: true}
                ]
            });
        }
    };
    
    const renderSelectionScreen = () => {
        examListContainer.innerHTML = '';
        for (const setId in examSets) {
            const setName = examSets[setId][currentLang].name;
            const card = document.createElement('div');
            card.className = 'exam-card';
            card.innerHTML = `<h2>${setName}</h2><button class="start-btn" data-set-id="${setId}">${currentLang === 'en' ? 'Start' : 'เริ่มทำ'}</button>`;
            examListContainer.appendChild(card);
        }

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
        allProblems[currentSetId][currentLang].forEach((p, i) => {
            const userInputEl = document.getElementById(`answer-${i}`);
            if(userInputEl) {
                const userInput = userInputEl.value.trim();
                const correctAnswer = allSolutions[currentSetId][i].answer;
                if (userInput === correctAnswer) {
                    score++;
                }
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
        const solutions = allSolutions[currentSetId];
        const problems = allProblems[currentSetId][currentLang];
        solutions.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'solution-card';
            card.innerHTML = `<h2>${problems[index].title}</h2><div class="problem-statement">${problems[index].statement}</div><hr><p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${s.answer}</strong></p><div class="solution-statement">${s.steps}</div>`;
            solutionList.appendChild(card);
        });
        renderMath();
    };

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
        document.getElementById('back-to-login-btn').textContent = lang === 'en' ? 'Back to Login' : 'กลับไปหน้าล็อคอิน';
        
        // Re-render dynamic content
        if (screens.selection.classList.contains('active')) renderSelectionScreen();
        if (screens.test.classList.contains('active')) {
            document.getElementById('test-title').textContent = examSets[currentSetId][currentLang].name;
            renderProblems();
        }
        if (screens.solution.classList.contains('active')) {
            if (lastScore !== null) displayScore(lastScore);
            renderSolutions();
        }
    };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', () => {
        const username = loginStuff.usernameInput.value.trim();
        const password = loginStuff.passwordInput.value.trim();

        if (credentials[username] && credentials[username] === password) {
            loginStuff.errorMsg.textContent = '';
            
            if (username === 'JJ') {
                 renderSelectionScreen();
                 showScreen('selection');
                 return;
            }

            let hasCompletedTest = false;
            for (const setId in examSets) {
                if (localStorage.getItem(`test_completed_${username}_${setId}`)) {
                    hasCompletedTest = true;
                    currentSetId = setId;
                    break;
                }
            }

            if (hasCompletedTest) {
                renderSolutions();
                showScreen('solution');
            } else {
                renderSelectionScreen();
                showScreen('selection');
            }
        } else {
            loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
        }
    });

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
    
    // --- Initial Setup ---
    // This will run after the main DOM is loaded, but it waits for the KaTeX script to be ready
    const kaTeXScript = document.querySelector('script[src*="auto-render.min.js"]');
    kaTeXScript.onload = () => {
        setLanguage('en'); // Set initial language and render math
    };
    if (document.readyState === "complete") {
       kaTeXScript.onload();
    }
});
