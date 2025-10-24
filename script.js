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
    const solutionContainer = document.getElementById('solution-container');
    const solutionList = document.getElementById('solution-list');
    const scoreDisplay = document.getElementById('score-display');
    const submitBtn = document.getElementById('submit-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const langToggles = document.querySelectorAll('.lang-toggle');

    // --- State ---
    let timerInterval;
    let currentLang = 'en';
    let lastScore = null;
    const DURATION = 2 * 60 * 60; // 2 hours in seconds

    const credentials = {
        JJ: 'admin',
        Waigoon: 'Joi',
        Thimphu: 'Yensira',
        Meepooh: 'Meepooh',
        Win: 'Eovs',
    };

    const problems = {
        en: [
            {
                title: "Problem 1: A Quartic Condition",
                statement: "Find the sum of all rational numbers $r$ for which the equation $r^2 x^2 + (r-1)x + (r-2) = 0$ has two distinct integer roots."
            },
            {
                title: "Problem 2: A Divisibility Condition",
                statement: "It is a known fact that the only integer solutions to $n | (2^n+1)$ are powers of 3. Find the second smallest integer $n>1$ that is not a power of 3, such that $n$ divides $2^n+2$."
            },
            {
                title: "Problem 3: The Markov Equation",
                statement: "The equation $x^2+y^2+z^2=3xyz$ is known as the Markov equation. Find the sum of the components of the unique non-trivial integer solution $(x,y,z)$ with $x \\le y \\le z$ and $z < 10$. A non-trivial solution is one where $x, y, z$ are positive integers."
            },
            {
                title: "Problem 4: A Missing Sequence",
                statement: "Let the sequence $a_n$ be defined for $n \\ge 1$ by the formula $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$. Find the number of positive integers less than or equal to 2025 that are not in the set $\\{a_n | n \\in \\mathbb{Z}^+\\}$."
            },
            {
                title: "Problem 5: Quadratic Residues and Roots of Unity",
                statement: "Let $p=2027$ (a prime number). Let $\\omega = e^{2\\pi i/p}$ be a primitive $p$-th root of unity. Calculate the numerical value of the product $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$, where $(\\frac{k}{p})$ is the Legendre symbol."
            },
            {
                title: "Problem 6: A Peculiar Pell-like Equation",
                statement: "Find the largest integer $n$ less than 1000 for which there exists a pair of positive integers $(x,y)$ satisfying the equation $x^2 - (n^2+1)y^2 = -1$."
            },
            {
                title: "Problem 7: A Sum over Primitive Roots",
                statement: "Let $p=43$. Find the value of the sum $\\sum_{g} g \\pmod{p}$, where the sum is taken over all primitive roots $g$ modulo $p$ in the range $1 \\le g < p$."
            },
            {
                title: "Problem 8: Sum of Divisors Congruence",
                statement: "Let $\\sigma(n)$ denote the sum of the positive divisors of $n$. Find the smallest integer $n > 2$ such that $\\sigma(n) \\equiv 2 \\pmod{n}$."
            },
            {
                title: "Problem 9: A Fibonacci Arctan Sum",
                statement: "Let $F_n$ be the $n$-th Fibonacci number ($F_1=1, F_2=1$). Evaluate the sum $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$. Your answer should be a number."
            },
            {
                title: "Problem 10: Last Non-Zero Digit of a Factorial",
                statement: "Find the last non-zero digit in the decimal representation of $1000!$."
            }
        ],
        th: [
             {
                title: "โจทย์ข้อที่ 1: เงื่อนไขสมการกำลังสี่",
                statement: "จงหาผลบวกของจำนวนตรรกยะ $r$ ทั้งหมดที่ทำให้สมการ $r^2 x^2 + (r-1)x + (r-2) = 0$ มีรากเป็นจำนวนเต็มที่แตกต่างกันสองค่า"
            },
            {
                title: "โจทย์ข้อที่ 2: เงื่อนไขการหารลงตัว",
                statement: "เป็นที่ทราบกันว่าผลเฉลยจำนวนเต็มของ $n | (2^n+1)$ คือจำนวนที่อยู่ในรูป $3^k$ เท่านั้น จงหาจำนวนเต็ม $n>1$ ที่ไม่ใช่กำลังของ 3 ที่มีค่าน้อยที่สุดเป็นอันดับที่สอง ที่สอดคล้องกับเงื่อนไข $n$ หาร $2^n+2$ ลงตัว"
            },
            {
                title: "โจทย์ข้อที่ 3: สมการมาร์คอฟ",
                statement: "สมการ $x^2+y^2+z^2=3xyz$ เป็นที่รู้จักในชื่อสมการมาร์คอฟ จงหาผลบวกขององค์ประกอบของผลเฉลยจำนวนเต็มบวก $(x,y,z)$ ที่ไม่ใช่ผลเฉลยชัดแจ้งเพียงชุดเดียวที่สอดคล้องกับเงื่อนไข $x \\le y \\le z$ และ $z < 10$"
            },
            {
                title: "โจทย์ข้อที่ 4: ลำดับที่หายไป",
                statement: "ให้ลำดับ $a_n$ สำหรับ $n \\ge 1$ นิยามโดยสูตร $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ จงหาจำนวนของจำนวนเต็มบวกที่น้อยกว่าหรือเท่ากับ 2025 ที่ไม่อยู่ในเซต $\\{a_n | n \\in \\mathbb{Z}^+\\}$"
            },
            {
                title: "โจทย์ข้อที่ 5: เศษกำลังสองและรากของเอกภาพ",
                statement: "ให้ $p=2027$ (เป็นจำนวนเฉพาะ) และให้ $\\omega = e^{2\\pi i/p}$ เป็นรากปฐมฐานที่ $p$ ของเอกภาพ จงคำนวณค่าของผลคูณ $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$ โดยที่ $(\\frac{k}{p})$ คือสัญลักษณ์เลอจองดร์"
            },
            {
                title: "โจทย์ข้อที่ 6: สมการของเพลล์รูปแบบพิเศษ",
                statement: "จงหาจำนวนเต็ม $n$ ที่มากที่สุดที่น้อยกว่า 1000 ซึ่งมีคู่ของจำนวนเต็มบวก $(x,y)$ ที่สอดคล้องกับสมการ $x^2 - (n^2+1)y^2 = -1$"
            },
            {
                title: "โจทย์ข้อที่ 7: ผลบวกของรากปฐมฐาน",
                statement: "ให้ $p=43$ จงหาค่าของผลบวก $\\sum_{g} g \\pmod{p}$ โดยที่ผลบวกนี้กระทำบนทุกรากปฐมฐาน $g$ มอดุโล $p$ ในช่วง $1 \\le g < p$"
            },
            {
                title: "โจทย์ข้อที่ 8: คอนกรูเอนซ์ของผลบวกตัวหาร",
                statement: "ให้ $\\sigma(n)$ แทนผลบวกของตัวหารที่เป็นบวกของ $n$ จงหาจำนวนเต็ม $n > 2$ ที่น้อยที่สุดที่สอดคล้องกับ $\\sigma(n) \\equiv 2 \\pmod{n}$"
            },
            {
                title: "โจทย์ข้อที่ 9: ผลบวกอนันต์ของฟีโบนักชี",
                statement: "ให้ $F_n$ เป็นจำนวนฟีโบนักชีตัวที่ $n$ ($F_1=1, F_2=1$) จงหาค่าของผลบวก $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$"
            },
            {
                title: "โจทย์ข้อที่ 10: เลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายของแฟกทอเรียล",
                statement: "จงหาเลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายในการเขียนแทน $1000!$ ในระบบเลขฐานสิบ"
            }
        ]
    };

    // Note: The answer key is always based on the English version's index.
    const solutions = {
        en: [
            { title: "Solution 1", answer: "1/4", steps: "Let the integer roots be $m, n$. By Vieta's formulas... The sum is $1/4$." },
            { title: "Solution 2", answer: "6", steps: "We need $n | 2^n+2$. If $n$ is even, let $n=2k$, so $k | (2^{2k-1}+1)$... This gives $n=2, 6, 66, ...$. The second smallest is 6." },
            { title: "Solution 3", answer: "8", steps: "This is the Markov equation. We find solutions using Vieta Jumping... The largest solution with $z<10$ is $(1,2,5)$. The sum of its components is $1+2+5=8$." },
            { title: "Solution 4", answer: "45", steps: "The sequence $a_n$ generates all positive integers except for the perfect squares... We need to find the number of perfect squares $\\le 2025$. Since $\\sqrt{2025}=45$, there are 45 such numbers." },
            { title: "Solution 5", answer: "-1", steps: "The product is $P=(-1)^{h_{(-p)}}$, where $h_{(-p)}$ is the class number... For $p=2027 \\equiv 3 \\pmod 8$, the class number is odd. Therefore, $P = (-1)^{\\text{odd}} = -1$." },
            { title: "Solution 6", answer: "999", steps: "The equation $x^2 - (n^2+1)y^2 = -1$ has a solution if and only if the period length of the continued fraction of $\\sqrt{n^2+1}$ is odd. The period length is 1 for all $n \\ge 1$. Thus, a solution exists for every $n$. The largest $n<1000$ is 999." },
            { title: "Solution 7", answer: "42", steps: "The sum of primitive roots modulo a prime $p$ is congruent to $\\mu(p-1) \\pmod p$. For $p=43$, we need $\\mu(42)$. Since $42 = 2 \\cdot 3 \\cdot 7$, $\\mu(42) = (-1)^3 = -1$. The sum is $-1 \\equiv 42 \\pmod{43}$." },
            { title: "Solution 8", answer: "20", steps: "The condition implies that $n$ must be an abundant number... Testing abundant numbers in order: for $n=20$, $\\sigma(20)=42$. $42 = 2 \\cdot 20 + 2$, so $42 \\equiv 2 \\pmod{20}$. This is the smallest solution > 2." },
            { title: "Solution 9", answer: "-arctan(1/7)", steps: "The term inside the arctan is of the form $\\frac{x-y}{1+xy}$... This creates a telescoping sum $S = \\sum_{n=3}^\\infty (A_{n-1}-A_{n+1})$, where $A_k = \\arctan(F_k/F_{k-1})$. The sum evaluates to $\\arctan(2) - \\arctan(3)$, which is $-\\arctan(1/7)$." },
            { title: "Solution 10", answer: "2", steps: "We need to compute $X = \\frac{1000!}{10^{249}} \\pmod{10}$. This requires solving $X \\equiv 0 \\pmod 2$ and $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$. By a generalization of Wilson's Theorem, $\\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$. Also, $(2^{-1})^{249} \\equiv 3^{249} \\equiv 3 \\pmod 5$. So $X \\equiv 4 \\cdot 3 \\equiv 2 \\pmod 5$. The only even digit that is $2 \\pmod 5$ is 2." }
        ],
        th: [
            { title: "เฉลยข้อที่ 1", answer: "1/4", steps: "ให้ $m, n$ เป็นรากจำนวนเต็ม จากสูตรของเวียดจะได้... ผลรวมคือ $1/4$" },
            { title: "เฉลยข้อที่ 2", answer: "6", steps: "เราต้องการหา $n$ ที่ $n | 2^n+2$ ถ้า $n$ เป็นคู่ ให้ $n=2k$ จะได้ $k | (2^{2k-1}+1)$... ทำให้ได้ $n=2, 6, 66, ...$ ตัวที่เล็กที่สุดเป็นอันดับสองคือ 6" },
            { title: "เฉลยข้อที่ 3", answer: "8", steps: "นี่คือสมการมาร์คอฟ เราหาผลเฉลยด้วย Vieta Jumping... ผลเฉลยใหญ่ที่สุดที่มี $z<10$ คือ $(1,2,5)$ ผลรวมขององค์ประกอบคือ $1+2+5=8$" },
            { title: "เฉลยข้อที่ 4", answer: "45", steps: "ลำดับ $a_n$ สร้างจำนวนเต็มบวกทั้งหมด ยกเว้นจำนวนกำลังสองสมบูรณ์... เราต้องหาจำนวนกำลังสองสมบูรณ์ที่ $\\le 2025$ เนื่องจาก $\\sqrt{2025}=45$ จึงมี 45 จำนวน" },
            { title: "เฉลยข้อที่ 5", answer: "-1", steps: "ผลคูณคือ $P=(-1)^{h_{(-p)}}$ โดย $h_{(-p)}$ คือเลขชั้น... สำหรับ $p=2027 \\equiv 3 \\pmod 8$ เลขชั้นจะเป็นจำนวนคี่ ดังนั้น $P = (-1)^{\\text{odd}} = -1$" },
            { title: "เฉลยข้อที่ 6", answer: "999", steps: "สมการ $x^2 - (n^2+1)y^2 = -1$ มีผลเฉลยก็ต่อเมื่อคาบของเศษส่วนต่อเนื่องของ $\\sqrt{n^2+1}$ เป็นเลขคี่ ซึ่งความยาวคาบเป็น 1 เสมอสำหรับทุก $n \\ge 1$ ดังนั้นจึงมีผลเฉลยสำหรับทุก $n$ ค่า $n$ ที่มากที่สุดที่น้อยกว่า 1000 คือ 999" },
            { title: "เฉลยข้อที่ 7", answer: "42", steps: "ผลบวกของรากปฐมฐานมอดุโล $p$ เท่ากับ $\\mu(p-1) \\pmod p$ สำหรับ $p=43$ เราต้องการ $\\mu(42)$ เนื่องจาก $42=2 \\cdot 3 \\cdot 7$ ดังนั้น $\\mu(42)=(-1)^3 = -1$ ผลบวกจึงเป็น $-1 \\equiv 42 \\pmod{43}$" },
            { title: "เฉลยข้อที่ 8", answer: "20", steps: "เงื่อนไขนี้หมายความว่า $n$ ต้องเป็นจำนวนบริบูรณ์... เมื่อทดสอบจำนวนบริบูรณ์ตามลำดับ: สำหรับ $n=20$, $\\sigma(20)=42$ และ $42 = 2 \\cdot 20 + 2$ ดังนั้น $42 \\equiv 2 \\pmod{20}$ นี่คือผลเฉลยที่เล็กที่สุดที่มากกว่า 2" },
            { title: "เฉลยข้อที่ 9", answer: "-arctan(1/7)", steps: "พจน์ใน arctan อยู่ในรูป $\\frac{x-y}{1+xy}$... ทำให้เกิดอนุกรมโทรทรรศน์ $S = \\sum_{n=3}^\\infty (A_{n-1}-A_{n+1})$ โดย $A_k = \\arctan(F_k/F_{k-1})$ ผลรวมมีค่าเท่ากับ $\\arctan(2) - \\arctan(3)$ ซึ่งเท่ากับ $-\\arctan(1/7)$" },
            { title: "เฉลยข้อที่ 10", answer: "2", steps: "เราต้องการหาค่าของ $X = \\frac{1000!}{10^{249}} \\pmod{10}$ ซึ่งต้องแก้ระบบ $X \\equiv 0 \\pmod 2$ และ $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$ จากทฤษฎีบทวิลสันรูปแบบทั่วไปได้ว่า $\\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$ และ $(2^{-1})^{249} \\equiv 3 \\pmod 5$ ดังนั้น $X \\equiv 4 \\cdot 3 \\equiv 2 \\pmod 5$ เลขโดดคู่เดียวที่สอดคล้องคือ 2" }
        ]
    };

    // --- Functions ---
    const showScreen = (screenId) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenId].classList.add('active');
    };

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
        const username = loginStuff.usernameInput.value;
        localStorage.setItem(`test_completed_${username}`, 'true');

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
                <p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${s.answer}</strong></p>
                <div class="solution-statement">${s.steps.replace(/(\r\n|\n|\r)/gm, " ")}</div>
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
        // Update login screen text
        document.getElementById('login-title').textContent = lang === 'en' ? 'Number Theory Set 1' : 'แบบทดสอบทฤษฎีจำนวน ชุดที่ 1';
        document.getElementById('login-subtitle').textContent = lang === 'en' ? 'Mock Test' : 'ข้อสอบจำลอง';
        loginStuff.usernameInput.placeholder = lang === 'en' ? 'Username' : 'ชื่อผู้ใช้';
        loginStuff.passwordInput.placeholder = lang === 'en' ? 'Password' : 'รหัสผ่าน';
        loginStuff.loginBtn.textContent = lang === 'en' ? 'Login' : 'เข้าสู่ระบบ';
        // Update test screen text
        document.getElementById('test-title').textContent = lang === 'en' ? 'Number Theory Set 1' : 'แบบทดสอบทฤษฎีจำนวน ชุดที่ 1';
        document.getElementById('timer-label').textContent = lang === 'en' ? 'Time Left:' : 'เวลาที่เหลือ:';
        document.getElementById('submit-btn').textContent = lang === 'en' ? 'Submit' : 'ส่งคำตอบ';
        // Update solution screen text
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

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', () => {
        const username = loginStuff.usernameInput.value;
        const password = loginStuff.passwordInput.value;

        if (credentials[username] && credentials[username] === password) {
            loginStuff.errorMsg.textContent = '';
            lastScore = null;
            scoreDisplay.textContent = '';
            
            if (localStorage.getItem(`test_completed_${username}`)) {
                renderSolutions();
                showScreen('solution');
            } else {
                renderProblems();
                showScreen('test');
                startTimer();
            }
        } else {
            loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
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
        scoreDisplay.textContent = '';
        lastScore = null;
        showScreen('login');
    });
    
    langToggles.forEach(btn => btn.addEventListener('click', toggleLanguage));

    // --- Initial Setup ---
    setLanguage('en');
});
