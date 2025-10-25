// ===== SCRIPT.JS (FINAL VERSION WITH WORKING LOGOUT) =====
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
    // ** Ensure selecting ALL logout buttons **
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
    
    // --- Data ---
    const examSets = { 'nt1': { en: { name: "Number Theory Set 1" }, th: { name: "ทฤษฎีจำนวน ชุดที่ 1" } } };
    const allProblems = {};
    const allSolutions = {};

    // --- Core Functions ---
    const showScreen = (screenId) => {
        console.log(`Switching to screen: ${screenId}`);
        if(loginCard) loginCard.classList.remove('authenticating');
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenId]?.classList.add('active');
        renderMath(); // Re-render math on screen change
    };

    const renderMath = () => {
        if (window.renderMathInElement) {
            try { renderMathInElement(document.body, { delimiters: [ {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false} ], throwOnError: false }); } 
            catch (error) { console.error("KaTeX rendering failed:", error); }
        } else { console.warn("KaTeX not loaded yet, skipping math rendering."); }
    };

    const updateWelcomeMessage = () => {
        welcomeMessages.forEach(msg => {
            if (currentUser) {
                msg.textContent = currentLang === 'en' ? `Welcome, ${currentUser}` : `ยินดีต้อนรับ, ${currentUser}`;
            } else {
                 msg.textContent = ''; // Clear if no user
            }
        });
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
        updateWelcomeMessage();
        renderMath();
    };

    const renderProblems = () => { /* ... same as before ... */ };
    const startTimer = () => { /* ... same as before ... */ };
    const submitTest = () => { /* ... same as before ... */ };
    const displayScore = (score) => { /* ... same as before ... */ };
    const renderSolutions = () => { /* ... same as before ... */ };
    const formatTime = (seconds) => { /* ... same as before ... */ };

    const setLanguage = (lang) => {
        currentLang = lang;
        // Update all static text
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
        
        // Re-render dynamic content if needed
        updateWelcomeMessage();
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
                localStorage.setItem('loggedInUser', username);
                renderSelectionScreen();
                showScreen('selection');
            } else {
                loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
                loginCard.classList.remove('authenticating');
            }
        }, 100); // Shorter delay
    };

    // --- THIS IS THE CORRECTED LOGOUT FUNCTION ---
    const logoutAction = () => {
        console.log("Logout action initiated"); // Debug log
        currentUser = null;
        lastScore = null; // Reset score
        currentSetId = null; // Reset current set
        localStorage.removeItem('loggedInUser');
        loginStuff.usernameInput.value = '';
        loginStuff.passwordInput.value = '';
        if(timerInterval) clearInterval(timerInterval); // Stop timer if running
        showScreen('login');
    };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', loginAction);
    submitBtn.addEventListener('click', () => {
        if (confirm(currentLang === 'en' ? 'Are you sure you want to submit?' : 'คุณแน่ใจหรือไม่ว่าต้องการส่งคำตอบ?')) {
            submitTest();
        }
    });
    backToSelectionBtn.addEventListener('click', () => {
        renderSelectionScreen();
        showScreen('selection');
    });
    // ** Ensure listener is attached to ALL logout buttons **
    logoutBtns.forEach(btn => btn.addEventListener('click', logoutAction));
    langToggles.forEach(btn => btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'th' : 'en')));
    
    // --- Data Definitions (Paste full data here) ---
    // ... (Paste the allProblems and allSolutions objects here) ...

    const initApp = () => {
        console.log("Initializing App...");
        // Tie data together
        Object.keys(allSolutions).forEach(setId => {
            if (allSolutions[setId]?.th) {
                allSolutions[setId].th.forEach((sol_th, i) => {
                    if (allSolutions[setId]?.en?.[i]) sol_th.answer = allSolutions[setId].en[i].answer;
                    if (allProblems[setId]?.th?.[i]) sol_th.title = allProblems[setId].th[i].title;
                });
            }
        });

        // Check for a logged-in user session
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser && credentials[savedUser]) {
            console.log(`Found logged in user: ${savedUser}`);
            currentUser = savedUser;
            showScreen('selection');
            renderSelectionScreen();
        } else {
            console.log("No logged in user found, showing login.");
            showScreen('login');
        }
        setLanguage('en'); // Set initial language
        renderMath(); // Initial math render
    };
    
    // Robust Initialization
    let katexLoaded = false;
    const checkKatexAndInit = () => {
        if (window.renderMathInElement) {
            if (!katexLoaded) {
                katexLoaded = true;
                console.log("KaTeX loaded, initializing app.");
                initApp();
            }
        } else {
            console.log("Waiting for KaTeX...");
            setTimeout(checkKatexAndInit, 150);
        }
    };
    
    // --- Start the App ---
    checkKatexAndInit();

}); // End DOMContentLoaded


// --- PASTE FULL DATA OBJECTS HERE ---
Object.assign(allProblems, {'nt1':{en:[{title:"Problem 1",statement:"Find the sum of all rational numbers $r$ for which the equation $r^2 x^2 + (r-1)x + (r-2) = 0$ has two distinct integer roots."},{title:"Problem 2",statement:"It is a known fact that the only integer solutions to $n | (2^n+1)$ are powers of 3. Find the second smallest integer $n>1$ that is not a power of 3, such that $n$ divides $2^n+2$."},{title:"Problem 3",statement:"The equation $x^2+y^2+z^2=3xyz$ is known as the Markov equation. Find the sum of the components of the unique non-trivial integer solution $(x,y,z)$ with $x \\le y \\le z$ and $z < 10$. A non-trivial solution is one where $x, y, z$ are positive integers."},{title:"Problem 4",statement:"Let the sequence $a_n$ be defined for $n \\ge 1$ by $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$. Find the number of positive integers less than or equal to 2025 that are not in the set $\\{a_n | n \\in \\mathbb{Z}^+\\}$."},{title:"Problem 5",statement:"Let $p=2027$ (a prime number). Let $\\omega = e^{2\\pi i/p}$ be a primitive $p$-th root of unity. Calculate the numerical value of the product $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$, where $(\\frac{k}{p})$ is the Legendre symbol."},{title:"Problem 6",statement:"Find the largest integer $n$ less than 1000 for which there exists a pair of positive integers $(x,y)$ satisfying the equation $x^2 - (n^2+1)y^2 = -1$."},{title:"Problem 7",statement:"Let $p=43$. Find the value of the sum $\\sum_{g} g \\pmod{p}$, where the sum is taken over all primitive roots $g$ modulo $p$ in the range $1 \\le g < p$."},{title:"Problem 8",statement:"Let $\\sigma(n)$ denote the sum of the positive divisors of $n$. Find the smallest integer $n > 2$ such that $\\sigma(n) \\equiv 2 \\pmod{n}$."},{title:"Problem 9",statement:"Let $F_n$ be the $n$-th Fibonacci number ($F_1=1, F_2=1$). Evaluate the sum $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$."},{title:"Problem 10",statement:"Find the last non-zero digit in the decimal representation of $1000!$."}],th:[{title:"โจทย์ข้อที่ 1",statement:"จงหาผลบวกของจำนวนตรรกยะ $r$ ทั้งหมดที่ทำให้สมการ $r^2 x^2 + (r-1)x + (r-2) = 0$ มีรากเป็นจำนวนเต็มที่แตกต่างกันสองค่า"},{title:"โจทย์ข้อที่ 2",statement:"เป็นที่ทราบกันว่าผลเฉลยจำนวนเต็มของ $n | (2^n+1)$ คือ $3^k$ เท่านั้น จงหาจำนวนเต็ม $n>1$ ที่ไม่ใช่กำลังของ 3 ที่มีค่าน้อยที่สุดเป็นอันดับที่สอง ที่สอดคล้องกับ $n$ หาร $2^n+2$ ลงตัว"},{title:"โจทย์ข้อที่ 3",statement:"สมการ $x^2+y^2+z^2=3xyz$ คือสมการมาร์คอฟ จงหาผลบวกขององค์ประกอบของผลเฉลยจำนวนเต็มบวก $(x,y,z)$ ที่ไม่ใช่ผลเฉลยชัดแจ้งเพียงชุดเดียวที่สอดคล้องกับ $x \\le y \\le z$ และ $z < 10$"},{title:"โจทย์ข้อที่ 4",statement:"ให้ลำดับ $a_n$ สำหรับ $n \\ge 1$ นิยามโดย $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ จงหาจำนวนของจำนวนเต็มบวกที่ $\\le 2025$ ที่ไม่อยู่ในเซต $\\{a_n | n \\in \\mathbb{Z}^+\\}$"},{title:"โจทย์ข้อที่ 5",statement:"ให้ $p=2027$ (จำนวนเฉพาะ) และให้ $\\omega = e^{2\\pi i/p}$... จงคำนวณค่าของผลคูณ $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$..."},{title:"โจทย์ข้อที่ 6",statement:"จงหาจำนวนเต็ม $n$ ที่มากที่สุดที่น้อยกว่า 1000 ซึ่งมีคู่ของจำนวนเต็มบวก $(x,y)$ ที่สอดคล้องกับสมการ $x^2 - (n^2+1)y^2 = -1$"},{title:"โจทย์ข้อที่ 7",statement:"ให้ $p=43$ จงหาค่าของผลบวก $\\sum_{g} g \\pmod{p}$ โดยที่ผลบวกนี้กระทำบนทุกรากปฐมฐาน $g$ ในช่วง $1 \\le g < p$"},{title:"โจทย์ข้อที่ 8",statement:"ให้ $\\sigma(n)$ แทนผลบวกของตัวหารที่เป็นบวกของ $n$ จงหาจำนวนเต็ม $n > 2$ ที่น้อยที่สุดที่สอดคล้องกับ $\\sigma(n) \\equiv 2 \\pmod{n}$"},{title:"โจทย์ข้อที่ 9",statement:"ให้ $F_n$ เป็นจำนวนฟีโบนักชี... จงหาค่าของผลบวก $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$"},{title:"โจทย์ข้อที่ 10",statement:"จงหาเลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายในการเขียนแทน $1000!$ ในระบบเลขฐานสิบ"}]}});
Object.assign(allSolutions, {'nt1':{en:[{answer:"1/4",steps:"Let the integer roots be $m, n$. Let $S=m+n$ and $P=mn$. From Vieta's formulas, we derive $r = \\frac{P+2S}{P+S}$.\n\nSubstituting this into the relation $r^2(S+P)=-1$ gives a quadratic equation for $P$: $P^2+P(4S+1)+(4S^2+S)=0$.\n\nFor $P$ to be an integer, the discriminant $D_P = 4S+1$ must be a perfect square. For the roots $m,n$ to be integers, $S^2-4P$ must also be a perfect square.\n\nTesting integer values for $j$ (where $S=j(j+1)$) yields valid pairs for $j=0,1,3$. These pairs correspond to $r=1, -1, 1/4$. The sum is $1 + (-1) + 1/4 = 1/4$."},{answer:"6",steps:"We need $n | 2^n+2$. If $n$ is even, let $n=2k$. The condition becomes $k | (2^{2k-1}+1)$.\n\nFor this to hold, $k$ must be odd (unless $k=1$).\n\nFor $k=1$, $1|2^1+1$ is true, giving $n=2$. This is the smallest solution not a power of 3.\n\nFor $k=3$, $3|2^5+1=33$ is true, giving $n=6$. This is the second smallest solution not a power of 3."},{answer:"8",steps:"This is the Markov equation. We find solutions using Vieta Jumping. Start with the base solution $(1,1,1)$.\n\nFix $(x,y)=(1,1)$, and solve the resulting quadratic $t^2 - 3xyt + (x^2+y^2)=0$. This gives $t^2-3t+2=0$, with roots $t=1,2$, generating $(1,1,2)$.\n\nNext, starting with $(1,2)$, the quadratic is $t^2 - 6t+5=0$, with roots $t=1,5$, generating $(1,2,5)$.\n\nThe largest solution with $z<10$ is $(1,2,5)$. The sum is $1+2+5=8$."},{answer:"45",steps:"The expression $\\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ is rounding $\\sqrt{n}$ to the nearest integer. Let $k = \\text{round}(\\sqrt{n})$. This holds for $n$ in the range $k^2-k+1 \\le n \\le k^2+k$.\n\nFor such $n$, $a_n = n+k$. The set of values for a fixed $k$ is the range $[k^2+1, k^2+2k]$.\n\nThe integers missing from the sequence are the perfect squares: $1, 4, 9, \\dots$. We need the number of perfect squares $\\le 2025$. Since $\\sqrt{2025} = 45$, there are 45 such numbers."},{answer:"-1",steps:"The product is $P = (-1)^{h_{(-p)}}$, where $h_{(-p)}$ is the class number of the imaginary quadratic field $\\mathbb{Q}(\\sqrt{-p})$.\n\nFor a prime $p>3$ with $p \\equiv 3 \\pmod 4$, the class number $h_{(-p)}$ is odd if and only if $p \\equiv 3 \\pmod 8$.\n\nWe check $2027 \\equiv 3 \\pmod 8$. Since the class number is odd, $P = (-1)^{\\text{odd}} = -1$."},{answer:"999",steps:"The equation $x^2 - Dy^2 = -1$ has a solution if and only if the period length of the continued fraction of $\\sqrt{D}$ is odd.\n\nHere, $D = n^2+1$. The continued fraction for $\\sqrt{n^2+1}$ is $[n; \\overline{2n}]$. The period length is 1.\n\nSince 1 is odd, the equation has a solution for every positive integer $n$. The largest $n < 1000$ is 999."},{answer:"42",steps:"The sum of primitive roots modulo a prime $p$ is congruent to $\\mu(p-1) \\pmod p$.\n\nFor $p=43$, we need $\\mu(p-1) = \\mu(42)$.\n\nSince $42 = 2 \\cdot 3 \\cdot 7$, $\\mu(42) = (-1)^3 = -1$.\n\nThe sum is therefore $-1 \\equiv 42 \\pmod{43}$."},{answer:"20",steps:"The condition $\\sigma(n) \\equiv 2 \\pmod{n}$ means the sum of proper divisors $S_p(n) \\equiv 2 \\pmod n$. This implies $n$ must be an abundant number.\n\nWe test abundant numbers in order: $n=12 (\\sigma(12)=28 \\equiv 4)$, $n=18 (\\sigma(18)=39 \\equiv 3)$.\n\nFor $n=20$, $\\sigma(20)=42$. Since $42 = 2 \\cdot 20 + 2$, we have $42 \\equiv 2 \\pmod{20}$. This is the smallest solution > 2."},{answer:"-arctan(1/7)",steps:"The argument fits the tangent subtraction formula $\\arctan(x)-\\arctan(y)$.\n\nLet $x=F_{n-1}/F_{n-2}$ and $y=F_{n+1}/F_n$. The $n$-th term is $A_{n-1} - A_{n+1}$, where $A_k = \\arctan(F_k/F_{k-1})$.\n\nThis is a telescoping sum which evaluates to $S = A_2+A_3 - 2\\lim A_k = \\arctan(1)+\\arctan(2) - 2\\arctan(\\phi)$.\n\nUsing known identities, this simplifies to $\\arctan(2) - \\arctan(3) = -\\arctan(1/7)$."},{answer:"2",steps:"The last non-zero digit is $D(1000!) = \\frac{1000!}{10^k} \\pmod{10}$ where $k = \\nu_5(1000!) = 249$.\n\nWe need to solve $X \\equiv 0 \\pmod 2$ and $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$.\n\nUsing a generalization of Wilson's Theorem, we show that $A = \\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$. The other term is $(2^{-1})^{249} \\equiv 3 \\pmod 5$.\n\nThus, $X \\equiv 4 \\cdot 3 = 12 \\equiv 2 \\pmod 5$. The only even digit that is $2 \\pmod 5$ is 2."}],th:[{answer:"1/4",steps:"ให้ $m, n$ เป็นรากจำนวนเต็ม และ $S=m+n, P=mn$ จากสูตรของเวียดจะได้ $r = \\frac{P+2S}{P+S}$ \n\nเมื่อแทนค่าใน $r^2(S+P)=-1$ จะได้สมการกำลังสองของ $P$ ซึ่งมี discriminant $D_P = 4S+1$ จะต้องเป็นกำลังสองสมบูรณ์ และ $S^2-4P$ ก็ต้องเป็นกำลังสองสมบูรณ์เช่นกัน\n\nเมื่อทดสอบค่า $j$ (โดย $S=j(j+1)$) จะได้คู่ $(S,P)$ ที่สอดคล้องสำหรับ $j=0,1,3$ ซึ่งให้ค่า $r=1, -1, 1/4$ ตามลำดับ ผลรวมคือ $1/4$"},{answer:"6",steps:"เราต้องการหา $n$ ที่ $n | 2^n+2$ ถ้า $n$ เป็นคู่ ให้ $n=2k$ เงื่อนไขจะกลายเป็น $k | (2^{2k-1}+1)$ \n\n$k$ จะต้องเป็นจำนวนคี่ (ยกเว้น $k=1$)\n\nกรณี $k=1$ เป็นจริง ได้ $n=2$ ซึ่งเป็นผลเฉลยแรกที่ไม่ใช่กำลังของ 3\n\nกรณี $k=3$ เป็นจริง ได้ $n=6$ ซึ่งเป็นผลเฉลยที่สองที่ไม่ใช่กำลังของ 3"},{answer:"8",steps:"นี่คือสมการมาร์คอฟ ซึ่งหาผลเฉลยได้ด้วยเทคนิค Vieta Jumping เริ่มจากผลเฉลยพื้นฐาน $(1,1,1)$\n\nตรึงค่า $(x,y)=(1,1)$ ในสมการกำลังสอง $t^2 - 3xyt + (x^2+y^2)=0$ จะได้ราก $t=1,2$ ซึ่งสร้างผลเฉลยใหม่ $(1,1,2)$ จากนั้นตรึง $(1,2)$ ในสมการเดียวกันจะได้ราก $t=1,5$ ซึ่งสร้างผลเฉลย $(1,2,5)$\n\nผลเฉลยถัดไปมีค่า $z \\ge 10$ ดังนั้นผลเฉลยที่ใหญ่ที่สุดที่สอดคล้องเงื่อนไขคือ $(1,2,5)$ ผลรวมคือ $1+2+5=8$"},{answer:"45",steps:"นิพจน์ $\\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ คือการปัดเศษของ $\\sqrt{n}$\n\nให้ $k = \\text{round}(\\sqrt{n})$ ซึ่งจะเกิดขึ้นเมื่อ $k^2-k+1 \\le n \\le k^2+k$ สำหรับค่า $n$ เหล่านี้ $a_n = n+k$ ซึ่งจะสร้างช่วงของจำนวนเต็ม $[k^2+1, k^2+2k]$\n\nเมื่อรวมช่วงเหล่านี้ จะพบว่าจำนวนเต็มที่หายไปคือจำนวนกำลังสองสมบูรณ์: $1, 4, 9, \\dots$ เราจึงต้องหาจำนวนกำลังสองสมบูรณ์ที่น้อยกว่าหรือเท่ากับ 2025 เนื่องจาก $\\sqrt{2025}=45$ จำนวนที่หายไปคือ $1^2, 2^2, \\dots, 45^2$ ซึ่งมีทั้งหมด 45 จำนวน"},{answer:"-1",steps:"ผลคูณคือ $P = (-1)^{h_{(-p)}}$ โดยที่ $h_{(-p)}$ คือเลขชั้น (class number) ของฟีลด์จินตภาพกำลังสอง $\\mathbb{Q}(\\sqrt{-p})$\n\nสำหรับจำนวนเฉพาะ $p>3$ ที่ $p \\equiv 3 \\pmod 4$ เลขชั้น $h_{(-p)}$ จะเป็นจำนวนคี่ก็ต่อเมื่อ $p \\equiv 3 \\pmod 8$\n\nเราตรวจสอบได้ว่า $2027 \\equiv 3 \\pmod 8$ ดังนั้นเลขชั้นเป็นจำนวนคี่ ทำให้ $P = (-1)^{\\text{odd}} = -1$"},{answer:"999",steps:"สมการ $x^2 - Dy^2 = -1$ คือสมการของเพลล์ภาคลบ ซึ่งจะมีผลเฉลยเป็นจำนวนเต็มบวกก็ต่อเมื่อความยาวคาบของเศษส่วนต่อเนื่องของ $\\sqrt{D}$ เป็นเลขคี่\n\nในข้อนี้ $D=n^2+1$ ซึ่งมีเศษส่วนต่อเนื่องคือ $[n; \\overline{2n}]$ และมีความยาวคาบเท่ากับ 1 ซึ่งเป็นจำนวนคี่เสมอ\n\nดังนั้นสมการนี้จึงมีผลเฉลยสำหรับทุกจำนวนเต็มบวก $n$ คำตอบคือจำนวนเต็มที่มากที่สุดที่น้อยกว่า 1000 ซึ่งก็คือ 999"},{answer:"42",steps:"ผลบวกของรากปฐมฐานมอดุโล $p$ เท่ากับ $\\mu(p-1) \\pmod p$\n\nสำหรับ $p=43$ เราต้องการหาค่า $\\mu(42)$\n\nเนื่องจาก $42 = 2 \\cdot 3 \\cdot 7$ ดังนั้น $\\mu(42)=(-1)^3 = -1$\n\nผลบวกจึงเป็น $-1 \\equiv 42 \\pmod{43}$"},{answer:"20",steps:"เงื่อนไข $\\sigma(n) \\equiv 2 \\pmod{n}$ หมายความว่า $n$ ต้องเป็นจำนวนบริบูรณ์ (abundant number) ซึ่งคือจำนวนที่ $\\sigma(n) > 2n$\n\nเราจึงเริ่มทดสอบจากจำนวนบริบูรณ์น้อยๆ ไป: $n=12 (\\sigma(12)=28 \\equiv 4)$, $n=18 (\\sigma(18)=39 \\equiv 3)$\n\nสำหรับ $n=20$, $\\sigma(20)=42$ และเนื่องจาก $42 = 2 \\cdot 20 + 2$ ดังนั้น $42 \\equiv 2 \\pmod{20}$ นี่คือผลเฉลยที่เล็กที่สุด"},{answer:"-arctan(1/7)",steps:"พจน์ใน arctan อยู่ในรูป $\\frac{x-y}{1+xy}$ ทำให้เกิดอนุกรมโทรทรรศน์ $S = \\sum_{n=3}^\\infty (A_{n-1}-A_{n+1})$ โดย $A_k = \\arctan(F_k/F_{k-1})$\n\nผลบวกของอนุกรมนี้มีค่าเท่ากับ $S = A_2+A_3 - 2\\lim A_k = \\arctan(1)+\\arctan(2) - 2\\arctan(\\phi)$\n\nเมื่อใช้เอกลักษณ์ของ arctan จะได้ผลลัพธ์สุดท้ายเป็น $\\arctan(2) - \\arctan(3)$ ซึ่งเท่ากับ $-\\arctan(1/7)$"},{answer:"2",steps:"เลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายคือ $D(1000!) = \\frac{1000!}{10^k} \\pmod{10}$ โดยที่ $k = \\nu_5(1000!) = 249$\n\nเราต้องแก้ระบบสมการ $X \\equiv 0 \\pmod 2$ และ $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$\n\nจากทฤษฎีบทวิลสันรูปแบบทั่วไป จะได้ว่า $\\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$ และพจน์ $(2^{-1})^{249} \\equiv 3 \\pmod 5$\n\nดังนั้น $X \\equiv 4 \\cdot 3 = 12 \\equiv 2 \\pmod 5$ เลขโดดคู่เดียวที่สอดคล้องคือ 2"}]}});
// --- Helper Functions (Full definitions) ---
const formatTime = (seconds) => { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`; };
const updateWelcomeMessage = () => { welcomeMessages.forEach(msg => { if (currentUser) { msg.textContent = currentLang === 'en' ? `Welcome, ${currentUser}` : `ยินดีต้อนรับ, ${currentUser}`; } else { msg.textContent = ''; } }); };
const renderSelectionScreen = () => { examListContainer.innerHTML = ''; Object.keys(examSets).forEach(setId => { const setName = examSets[setId][currentLang].name; const card = document.createElement('div'); card.className = 'exam-card'; card.innerHTML = `<h2>${setName}</h2><button class="start-btn" data-set-id="${setId}">${currentLang === 'en' ? 'Start' : 'เริ่มทำ'}</button>`; examListContainer.appendChild(card); }); document.querySelectorAll('.start-btn').forEach(button => { button.addEventListener('click', (e) => { currentSetId = e.target.getAttribute('data-set-id'); document.getElementById('test-title').textContent = examSets[currentSetId][currentLang].name; showScreen('test'); renderProblems(); startTimer(); }); }); updateWelcomeMessage(); renderMath(); };
const renderProblems = () => { problemContainer.innerHTML = ''; allProblems[currentSetId][currentLang].forEach((p, index) => { const card = document.createElement('div'); card.className = 'problem-card'; card.innerHTML = `<h2>${p.title}</h2><div class="problem-statement">${p.statement}</div><input type="text" class="answer-input" id="answer-${index}" placeholder="${currentLang === 'en' ? 'Your answer' : 'คำตอบของคุณ'}">`; problemContainer.appendChild(card); }); renderMath(); };
const displayScore = (score) => { const total = allProblems[currentSetId][currentLang].length; scoreDisplay.textContent = currentLang === 'en' ? `Your Score: ${score} / ${total}` : `คะแนนของคุณ: ${score} / ${total}`; };
const renderSolutions = () => { solutionList.innerHTML = ''; const solutions = allSolutions[currentSetId][currentLang]; const problems = allProblems[currentSetId][currentLang]; solutions.forEach((s, index) => { const card = document.createElement('div'); card.className = 'solution-card'; const formattedSteps = s.steps.replace(/\n/g, '<br><br>'); card.innerHTML = `<h2>${problems[index].title}</h2><div class="problem-statement">${problems[index].statement}</div><hr><p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${s.answer}</strong></p><div class="solution-statement">${formattedSteps}</div>`; solutionList.appendChild(card); }); updateWelcomeMessage(); renderMath(); };
