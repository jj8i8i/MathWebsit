// ===== SCRIPT.JS (FINAL COMPLETE VERSION - ALGEBRA SET 1 + HINTS + NO STEP NUMBERS) =====
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
    const DURATION = 2 * 60 * 60; // 2 hours in seconds

    const credentials = {
        JJ: 'admin', Waigoon: 'Joi', Thimphu: 'Yensira',
        Meepooh: 'Meepooh', Win: 'Eovs',
    };

    // --- Data ---
    // Only Algebra Set 1
    const examSets = {
        'alg1': {
            en: { name: "Algebra Set 1 (2 Hours)" },
            th: { name: "พีชคณิต ชุดที่ 1 (2 ชั่วโมง)" }
        }
    };
    const allProblems = {
         'alg1': {
            en: [
                { title: "Problem 1", statement: "Let $P(x) = x^3 - 6x^2 + 11x - 6$. If $\\alpha, \\beta, \\gamma$ are the roots of $P(x)$, find the value of $(\\alpha+1)(\\beta+1)(\\gamma+1)$." },
                { title: "Problem 2", statement: "Find all functions $f: \\mathbb{R} \\to \\mathbb{R}$ such that $f(x+y) + f(x-y) = 2f(x) + 2f(y)$ for all $x, y \\in \\mathbb{R}$ and $f(1)=2$. Find the value of $f(3)$." },
                { title: "Problem 3", statement: "For positive real numbers $a, b, c$ such that $a+b+c=3$, find the minimum value of $\\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b}$." },
                { title: "Problem 4", statement: "Let the sequence $a_1 = 1$ and $a_{n+1} = \\frac{a_n}{1+na_n}$ for $n \\ge 1$. Find the value of $a_{100}$ (answer as a fraction)." },
                { title: "Problem 5", statement: "Let $P(x)$ be a polynomial such that $P(x^2+1) = x^4+5x^2+3$. Find the value of $P(5)$." },
                { title: "Problem 6", statement: "Find the number of ordered pairs of positive integers $(x,y)$ such that $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$." },
                { title: "Problem 7", statement: "Let $\\omega = e^{2\\pi i / 5}$ be a primitive 5th root of unity. Find the value of $(1-\\omega)(1-\\omega^2)(1-\\omega^3)(1-\\omega^4)$." },
                { title: "Problem 8", statement: "Let $f: \\mathbb{R} \\to \\mathbb{R}$ be a differentiable function satisfying $f(x+y) = f(x)f(y)$ for all $x,y \\in \\mathbb{R}$ and $f'(0)=3$. Find the value of $f(2)$ (answer in terms of $e$)." },
                { title: "Problem 9", statement: "Find the maximum value of $x^2y$ where $x,y$ are positive real numbers satisfying $2x+3y=6$." },
                { title: "Problem 10", statement: "Let $P(x)$ be a polynomial with integer coefficients. If $P(1)=5$ and $P(4)=8$, and $a$ is an integer such that $P(a)=6$, find the value of $a$." }
            ],
            th: [
                { title: "โจทย์ข้อที่ 1", statement: "ให้ $P(x) = x^3 - 6x^2 + 11x - 6$ ถ้า $\\alpha, \\beta, \\gamma$ เป็นรากของ $P(x)$ จงหาค่าของ $(\\alpha+1)(\\beta+1)(\\gamma+1)$" },
                { title: "โจทย์ข้อที่ 2", statement: "จงหาฟังก์ชัน $f: \\mathbb{R} \\to \\mathbb{R}$ ทั้งหมดที่สอดคล้องเงื่อนไข $f(x+y) + f(x-y) = 2f(x) + 2f(y)$ สำหรับทุก $x, y \\in \\mathbb{R}$ และ $f(1)=2$ จงหาค่าของ $f(3)$" },
                { title: "โจทย์ข้อที่ 3", statement: "สำหรับจำนวนจริงบวก $a, b, c$ ซึ่ง $a+b+c=3$ จงหาค่าต่ำสุดของ $\\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b}$" },
                { title: "โจทย์ข้อที่ 4", statement: "ให้ลำดับ $a_1 = 1$ และ $a_{n+1} = \\frac{a_n}{1+na_n}$ สำหรับ $n \\ge 1$ จงหาค่าของ $a_{100}$ (ตอบในรูปเศษส่วน)" },
                { title: "โจทย์ข้อที่ 5", statement: "ให้ $P(x)$ เป็นพหุนามซึ่ง $P(x^2+1) = x^4+5x^2+3$ จงหาค่าของ $P(5)$" },
                { title: "โจทย์ข้อที่ 6", statement: "จงหาจำนวนคู่อันดับของจำนวนเต็มบวก $(x,y)$ ทั้งหมดที่สอดคล้องสมการ $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$" },
                { title: "โจทย์ข้อที่ 7", statement: "ให้ $\\omega = e^{2\\pi i / 5}$ เป็นรากปฐมฐานที่ 5 ของ 1 จงหาค่าของ $(1-\\omega)(1-\\omega^2)(1-\\omega^3)(1-\\omega^4)$" },
                { title: "โจทย์ข้อที่ 8", statement: "ให้ $f: \\mathbb{R} \\to \\mathbb{R}$ เป็นฟังก์ชันที่หาอนุพันธ์ได้ ซึ่งสอดคล้อง $f(x+y) = f(x)f(y)$ สำหรับทุก $x,y \\in \\mathbb{R}$ และ $f'(0)=3$ จงหาค่าของ $f(2)$ (ตอบในรูป $e$ ยกกำลัง)" },
                { title: "โจทย์ข้อที่ 9", statement: "จงหาค่าสูงสุดของ $x^2y$ เมื่อ $x,y$ เป็นจำนวนจริงบวกที่สอดคล้อง $2x+3y=6$" },
                { title: "โจทย์ข้อที่ 10", statement: "ให้ $P(x)$ เป็นพหุนามที่มีสัมประสิทธิ์เป็นจำนวนเต็ม ถ้า $P(1)=5$ และ $P(4)=8$ และ $a$ เป็นจำนวนเต็มซึ่ง $P(a)=6$ จงหาค่าของ $a$" }
            ]
        }
    };
    const allSolutions = {
         'alg1': {
            en: [
                { answer: "24", hint: "Consider the factored form P(x) = (x-α)(x-β)(x-γ) and evaluate P(-1).", steps: "Since $\\alpha, \\beta, \\gamma$ are the roots, $P(x) = (x-\\alpha)(x-\\beta)(x-\\gamma)$.\nWe want $V = (\\alpha+1)(\\beta+1)(\\gamma+1)$.\nNotice $P(-1) = (-1-\\alpha)(-1-\\beta)(-1-\\gamma) = (-1)^3 (1+\\alpha)(1+\beta)(1+\\gamma) = -V$.\nThus, $V = -P(-1)$.\nCalculate $P(-1) = (-1)^3 - 6(-1)^2 + 11(-1) - 6 = -1 - 6 - 11 - 6 = -24$.\n$V = -(-24) = 24$." },
                { answer: "18", hint: "This is a standard functional equation. What kind of function satisfies it?", steps: "The equation is d'Alembert's functional equation.\nThe general continuous solution is $f(x) = cx^2$.\nUse $f(1)=2$: $c(1)^2 = 2 \\implies c=2$.\nSo $f(x) = 2x^2$.\n$f(3) = 2(3^2) = 2(9) = 18$." },
                { answer: "3/2", hint: "Try applying the Engel form of Cauchy-Schwarz.", steps: "Apply Cauchy-Schwarz (Engel form): $\\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b} \\ge \\frac{(a+b+c)^2}{(b+c)+(c+a)+(a+b)}$.\nDenominator simplifies to $2(a+b+c)$.\nInequality becomes: $\\ge \\frac{(a+b+c)^2}{2(a+b+c)} = \\frac{a+b+c}{2}$.\nGiven $a+b+c=3$, the minimum is $\\ge 3/2$.\nEquality holds for $a=b=c=1$. Checking: $1/2+1/2+1/2 = 3/2$.\nMinimum value is $3/2$." },
                { answer: "1/4951", hint: "Consider the reciprocal sequence b_n = 1/a_n.", steps: "Let $b_n = 1/a_n$. Then $b_{n+1} = 1/a_{n+1} = (1+na_n)/a_n = 1/a_n + n = b_n + n$.\n$b_{n+1} - b_n = n$.\n$b_{100} = b_1 + \\sum_{k=1}^{99} (b_{k+1}-b_k) = b_1 + \\sum_{k=1}^{99} k$.\n$b_1 = 1/a_1 = 1$.\n$\\sum_{k=1}^{99} k = \\frac{99(100)}{2} = 4950$.\n$b_{100} = 1 + 4950 = 4951$.\n$a_{100} = 1/b_{100} = 1/4951$." },
                { answer: "39", hint: "Let y = x^2+1 and express the right side in terms of y.", steps: "Let $y = x^2+1$, so $x^2 = y-1$.\nSubstitute into $P(x^2+1) = x^4+5x^2+3$:\n$P(y) = (x^2)^2 + 5(x^2) + 3$\n$P(y) = (y-1)^2 + 5(y-1) + 3$\nExpand: $P(y) = (y^2 - 2y + 1) + (5y - 5) + 3 = y^2 + 3y - 1$.\nFind $P(5)$ by substituting $y=5$:\n$P(5) = 5^2 + 3(5) - 1 = 25 + 15 - 1 = 39$." },
                { answer: "15", hint: "Clear denominators and try to factor using SFFT (Simon's Favorite Factoring Trick).", steps: "Multiply $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$ by $12xy$: $12y + 12x = xy$.\nRearrange: $xy - 12x - 12y = 0$.\nAdd 144 to both sides: $xy - 12x - 12y + 144 = 144$.\nFactor: $(x-12)(y-12) = 144$.\nLet $X=x-12, Y=y-12$. $XY=144$.\nSince $x, y \ge 1$, $X, Y \ge -11$. As $XY=144>0$, $X$ and $Y$ must have the same sign. They must be positive.\n$X, Y$ must be positive integer factors of 144.\nNumber of positive divisors of $144 = 2^4 \\cdot 3^2$ is $(4+1)(2+1) = 15$.\nThere are 15 pairs." },
                { answer: "5", hint: "Consider the polynomial P(x) = x^5 - 1 and its roots.", steps: "Consider $P(x) = x^5 - 1$. Its roots are $1, \\omega, \\omega^2, \\omega^3, \\omega^4$.\n$x^5 - 1 = (x-1)(x-\\omega)(x-\\omega^2)(x-\\omega^3)(x-\\omega^4)$.\nLet $Q(x) = \\frac{x^5-1}{x-1} = x^4 + x^3 + x^2 + x + 1$.\nThen $Q(x) = (x-\\omega)(x-\\omega^2)(x-\\omega^3)(x-\\omega^4)$.\nThe desired expression is $(1-\\omega)(1-\\omega^2)(1-\\omega^3)(1-\\omega^4) = Q(1)$.\n$Q(1) = 1^4 + 1^3 + 1^2 + 1 + 1 = 5$." },
                { answer: "e^6", hint: "What is the general form of a differentiable function satisfying f(x+y)=f(x)f(y)?", steps: "$f(x+y)=f(x)f(y)$ with $f$ differentiable implies $f(x)=e^{cx}$ (non-zero case).\n$f'(x) = c e^{cx}$.\n$f'(0) = c e^0 = c$. Given $f'(0)=3$, so $c=3$.\n$f(x) = e^{3x}$.\n$f(2) = e^{3(2)} = e^6$." },
                { answer: "8/3", hint: "Use AM-GM inequality. How can you split 2x+3y to get x^2y in the product?", steps: "Maximize $x^2y$ subject to $x,y>0$ and $2x+3y=6$.\nUse AM-GM on terms $x, x, 3y$. Their sum is $x+x+3y = 2x+3y = 6$.\n$\\frac{x+x+3y}{3} \ge \\sqrt[3]{x \\cdot x \\cdot (3y)}$.\n$\\frac{6}{3} \ge \\sqrt[3]{3x^2y} \implies 2 \ge \\sqrt[3]{3x^2y}$.\nCube both sides: $8 \ge 3x^2y \implies x^2y \le 8/3$.\nEquality holds when $x = 3y$. Substitute into $2x+3y=6$: $2(3y)+3y=6 \implies 9y=6 \implies y=2/3$. Then $x=2$. Maximum is $8/3$." },
                { answer: "2", hint: "Use the property that (m-n) divides (P(m)-P(n)) for polynomials with integer coefficients.", steps: "Property: If $P(x)$ has integer coefficients, then $(m-n)$ divides $(P(m)-P(n))$ for distinct integers $m, n$.\nApply with $(a, 1)$: $(a-1)$ divides $(P(a)-P(1)) = 6-5 = 1$. So $a-1 = \pm 1 \implies a=2$ or $a=0$.\nApply with $(a, 4)$: $(a-4)$ divides $(P(a)-P(4)) = 6-8 = -2$. So $a-4 \in \{1, -1, 2, -2\}$.\nCheck possibilities for $a$:\nIf $a=0$, $a-4 = -4$. $-4$ does not divide $-2$.\nIf $a=2$, $a-4 = -2$. $-2$ divides $-2$. Yes.\nThe only possible integer value for $a$ is 2." }
            ],
            th: [ // Translate hints and remove step numbers from Thai solutions
                 { answer: "24", hint: "พิจารณารูปตัวประกอบ P(x) = (x-α)(x-β)(x-γ) และหาค่า P(-1)", steps: "ให้รากคือ $\\alpha, \\beta, \\gamma$ ดังนั้น $P(x) = (x-\\alpha)(x-\\beta)(x-\\gamma)$\nเราต้องการหา $V = (\\alpha+1)(\\beta+1)(\\gamma+1)$\nสังเกตว่า $P(-1) = (-1-\\alpha)(-1-\\beta)(-1-\\gamma) = (-1)^3 (1+\\alpha)(1+\beta)(1+\\gamma) = -V$\nดังนั้น $V = -P(-1)$\nคำนวณ $P(-1) = (-1)^3 - 6(-1)^2 + 11(-1) - 6 = -1 - 6 - 11 - 6 = -24$\n$V = -(-24) = 24$" },
                { answer: "18", hint: "นี่คือสมการฟังก์ชันมาตรฐาน ฟังก์ชันรูปแบบใดสอดคล้องกับสมการนี้?", steps: "สมการที่ให้มาคือสมการฟังก์ชัน d'Alembert\nผลเฉลยต่อเนื่องทั่วไปคือ $f(x) = cx^2$\nจาก $f(1)=2$ ได้ $c(1)^2 = 2 \implies c=2$\nดังนั้น $f(x) = 2x^2$\nหาค่า $f(3) = 2(3^2) = 2(9) = 18$" },
                { answer: "3/2", hint: "ลองใช้อสมการ Cauchy-Schwarz ในรูปแบบ Engel", steps: "ใช้อสมการ Cauchy-Schwarz (Engel form):\n$\\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b} \\ge \\frac{(a+b+c)^2}{(b+c)+(c+a)+(a+b)}$\nตัวส่วน $= 2(a+b+c)$\nอสมการกลายเป็น $\\ge \\frac{(a+b+c)^2}{2(a+b+c)} = \\frac{a+b+c}{2}$\nโจทย์ให้ $a+b+c=3$, ดังนั้นค่าต่ำสุด $\\ge 3/2$\nสมการเกิดเมื่อ $a=b=c=1$. ตรวจสอบ: $1/2+1/2+1/2 = 3/2$\nค่าต่ำสุดคือ $3/2$" },
                { answer: "1/4951", hint: "พิจารณาลำดับส่วนกลับ b_n = 1/a_n", steps: "ให้ $b_n = 1/a_n$. จะได้ $b_{n+1} = 1/a_{n+1} = (1+na_n)/a_n = 1/a_n + n = b_n + n$\n$b_{n+1} - b_n = n$\n$b_{100} = b_1 + \\sum_{k=1}^{99} (b_{k+1}-b_k) = b_1 + \\sum_{k=1}^{99} k$\n$b_1 = 1/a_1 = 1$\n$\\sum_{k=1}^{99} k = \\frac{99(100)}{2} = 4950$\n$b_{100} = 1 + 4950 = 4951$\n$a_{100} = 1/b_{100} = 1/4951$" },
                { answer: "39", hint: "ให้ y = x^2+1 แล้วเขียนนิพจน์ฝั่งขวาในเทอมของ y", steps: "ให้ $y = x^2+1$ ดังนั้น $x^2 = y-1$\nแทนค่าใน $P(x^2+1) = x^4+5x^2+3$:\n$P(y) = (x^2)^2 + 5(x^2) + 3$\n$P(y) = (y-1)^2 + 5(y-1) + 3$\nกระจาย: $P(y) = (y^2 - 2y + 1) + (5y - 5) + 3 = y^2 + 3y - 1$\nหา $P(5)$ โดยแทน $y=5$:\n$P(5) = 5^2 + 3(5) - 1 = 25 + 15 - 1 = 39$" },
                { answer: "15", hint: "กำจัดส่วนแล้วลองแยกตัวประกอบโดยใช้ SFFT (Simon's Favorite Factoring Trick)", steps: "คูณ $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$ ด้วย $12xy$: $12y + 12x = xy$\nจัดรูป: $xy - 12x - 12y = 0$\nบวก 144 ทั้งสองข้าง: $xy - 12x - 12y + 144 = 144$\nแยกตัวประกอบ: $(x-12)(y-12) = 144$\nให้ $X=x-12, Y=y-12$. $XY=144$\nเนื่องจาก $x, y \\ge 1$, $X, Y \\ge -11$. $XY>0$ แสดงว่า $X, Y$ เครื่องหมายเหมือนกัน ต้องเป็นบวกทั้งคู่\n$X, Y$ ต้องเป็นตัวประกอบบวกของ 144\nจำนวนตัวประกอบบวกของ $144 = 2^4 \\cdot 3^2$ คือ $(4+1)(2+1) = 15$\nมี 15 คู่" },
                { answer: "5", hint: "พิจารณาพหุนาม P(x) = x^5 - 1 และรากของมัน", steps: "พิจารณา $P(x) = x^5 - 1$. รากคือ $1, \\omega, \\omega^2, \\omega^3, \\omega^4$\n$x^5 - 1 = (x-1)(x-\\omega)(x-\\omega^2)(x-\\omega^3)(x-\\omega^4)$\nให้ $Q(x) = \\frac{x^5-1}{x-1} = x^4 + x^3 + x^2 + x + 1$\nดังนั้น $Q(x) = (x-\\omega)(x-\\omega^2)(x-\\omega^3)(x-\\omega^4)$\nค่าที่ต้องการคือ $(1-\\omega)(1-\\omega^2)(1-\\omega^3)(1-\\omega^4) = Q(1)$\n$Q(1) = 1^4 + 1^3 + 1^2 + 1 + 1 = 5$" },
                { answer: "e^6", hint: "ฟังก์ชันที่หาอนุพันธ์ได้ที่สอดคล้อง f(x+y)=f(x)f(y) มีรูปแบบทั่วไปอย่างไร?", steps: "$f(x+y)=f(x)f(y)$ และ $f$ หาอนุพันธ์ได้ หมายความว่า $f(x)=e^{cx}$\n$f'(x) = c e^{cx}$\n$f'(0) = c e^0 = c$. โจทย์ให้ $f'(0)=3$, ดังนั้น $c=3$\n$f(x) = e^{3x}$\n$f(2) = e^{3(2)} = e^6$" },
                { answer: "8/3", hint: "ใช้อสมการ AM-GM จะแยกพจน์ 2x+3y อย่างไรเพื่อให้ผลคูณเกิด x^2y?", steps: "หาค่าสูงสุดของ $x^2y$ เมื่อ $x,y>0$ และ $2x+3y=6$\nใช้ AM-GM กับพจน์ $x, x, 3y$. ผลบวกคือ $x+x+3y = 2x+3y = 6$\n$\\frac{x+x+3y}{3} \ge \\sqrt[3]{x \\cdot x \\cdot (3y)}$\n$\\frac{6}{3} \ge \\sqrt[3]{3x^2y} \implies 2 \ge \\sqrt[3]{3x^2y}$\nยกกำลังสาม: $8 \ge 3x^2y \implies x^2y \le 8/3$\nสมการเกิดเมื่อ $x = 3y$. แทนใน $2x+3y=6$: $2(3y)+3y=6 \implies 9y=6 \implies y=2/3$. $x=2$. ค่าสูงสุดคือ $8/3$" },
                { answer: "2", hint: "ใช้คุณสมบัติที่ว่า (m-n) หาร (P(m)-P(n)) ลงตัว สำหรับพหุนามที่มีสัมประสิทธิ์เป็นจำนวนเต็ม", steps: "คุณสมบัติ: ถ้า $P(x)$ มีสัมประสิทธิ์เป็นจำนวนเต็ม แล้ว $(m-n)$ หาร $(P(m)-P(n))$ ลงตัว สำหรับ $m \ne n$\nใช้กับ $(a, 1)$: $(a-1)$ หาร $(P(a)-P(1)) = 6-5 = 1$. ดังนั้น $a-1 = \pm 1 \implies a=2$ หรือ $a=0$\nใช้กับ $(a, 4)$: $(a-4)$ หาร $(P(a)-P(4)) = 6-8 = -2$. ดังนั้น $a-4 \in \{1, -1, 2, -2\}$\nตรวจสอบค่า $a$:\nถ้า $a=0$ แล้ว $a-4 = -4$. $-4$ หาร $-2$ ไม่ลงตัว\nถ้า $a=2$ แล้ว $a-4 = -2$. $-2$ หาร $-2$ ลงตัว\nค่า $a$ ที่เป็นไปได้คือ 2" }
            ]
        }
    };

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
            try {
                renderMathInElement(document.body, {
                    delimiters: [ {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false} ],
                    throwOnError: false
                });
            } catch (error) { console.error("KaTeX rendering failed:", error); }
        } else {
             console.warn("KaTeX not loaded yet, skipping math rendering.");
        }
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
            const numQuestions = (allProblems[setId]?.[currentLang] || []).length;
            const detailsText = currentLang === 'en' ? `${numQuestions} Questions` : `${numQuestions} ข้อ`;
            card.innerHTML = `<div><h2>${setName}</h2><p class="exam-details">${detailsText}</p></div><button class="start-btn" data-set-id="${setId}">${currentLang === 'en' ? 'Start' : 'เริ่มทำ'}</button>`;
            examListContainer.appendChild(card);
        });
        document.querySelectorAll('.start-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                currentSetId = e.target.getAttribute('data-set-id');
                const titleElement = document.getElementById('test-title');
                if (titleElement) {
                    titleElement.textContent = examSets[currentSetId][currentLang].name;
                }
                showScreen('test');
                renderProblems();
                startTimer();
            });
        });
        updateWelcomeMessage();
        renderMath();
    };

    const renderProblems = () => {
        problemContainer.innerHTML = '';
        if (!currentSetId || !allProblems[currentSetId]?.[currentLang]) {
            problemContainer.innerHTML = "Error: Problem set not found.";
            return;
        }
        allProblems[currentSetId][currentLang].forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'problem-card';
            const hintButtonText = currentLang === 'en' ? 'Hint' : 'คำใบ้';
            card.innerHTML = `
                <h2>${p.title}</h2>
                <div class="problem-statement">${p.statement}</div>
                <input type="text" class="answer-input" id="answer-${index}" placeholder="${currentLang === 'en' ? 'Your answer' : 'คำตอบของคุณ'}">
                <button class="hint-btn" data-problem-index="${index}">${hintButtonText}</button>
            `;
            problemContainer.appendChild(card);
        });

        document.querySelectorAll('.hint-btn').forEach(button => {
             button.addEventListener('click', handleHintClick);
        });

        renderMath();
    };

    const handleHintClick = (event) => {
        const button = event.target;
        const problemIndex = parseInt(button.getAttribute('data-problem-index'), 10);
        showHint(currentSetId, currentLang, problemIndex);
    };

    const showHint = (setId, lang, index) => {
        // Find the correct hint text based on current language
        const hintText = allSolutions[setId]?.[lang]?.[index]?.hint;
        const alertTitle = lang === 'en' ? 'Hint' : 'คำใบ้';
        if (hintText) {
            alert(`${alertTitle}: ${hintText}`);
        } else {
            alert(lang === 'en' ? 'No hint available for this problem.' : 'ไม่มีคำใบ้สำหรับข้อนี้');
        }
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
                submitTest(); // Automatically submit when time runs out
            }
        }, 1000);
    };

    const submitTest = () => {
        if(!currentSetId || !allSolutions[currentSetId]?.en) {
            console.error("Cannot submit: currentSetId or solutions missing.");
            return;
        }
        clearInterval(timerInterval); // Stop the timer
        if (currentUser !== 'JJ') {
            // Use try-catch for localStorage in case of security restrictions
            try {
                localStorage.setItem(`test_completed_${currentUser}_${currentSetId}`, 'true');
            } catch (e) {
                console.warn("Could not save completion status to localStorage:", e);
            }
        }
        let score = 0;
        allSolutions[currentSetId].en.forEach((sol, i) => {
            const userInputEl = document.getElementById(`answer-${i}`);
            // Check if element exists before accessing value
            if(userInputEl && userInputEl.value.trim() === sol.answer) {
                score++;
            }
        });
        lastScore = score;
        displayScore(score); // Calculate score first
        renderSolutions();   // Then render solutions page
        showScreen('solution'); // Finally, show the solutions screen
    };

    const displayScore = (score) => {
        // Safely get total number of problems
        const total = (currentSetId && allProblems[currentSetId]?.[currentLang]) ? allProblems[currentSetId][currentLang].length : 0;
        const scoreText = currentLang === 'en' ? `Your Score: ${score} / ${total}` : `คะแนนของคุณ: ${score} / ${total}`;
        // Ensure scoreDisplay element exists
        if (scoreDisplay) {
            scoreDisplay.textContent = scoreText;
        } else {
             console.error("Score display element not found.");
        }
    };

    const renderSolutions = () => {
        solutionList.innerHTML = ''; // Clear previous solutions
        // Check if all necessary data exists
        if (currentSetId && allSolutions[currentSetId]?.[currentLang] && allProblems[currentSetId]?.[currentLang]) {
            const solutions = allSolutions[currentSetId][currentLang];
            const problems = allProblems[currentSetId][currentLang];
            solutions.forEach((s, index) => {
                const card = document.createElement('div');
                card.className = 'solution-card';
                // Format steps without numbering
                const formattedSteps = s.steps
                    .replace(/^\s*[\d\.]+\s*/gm, '') // Remove starting numbers/dots
                    .replace(/\n\n/g, '<br><br>')    // Keep paragraph breaks
                    .replace(/\n/g, '<br>');         // Convert single newlines

                // Safely access problem title and statement
                const problemTitle = problems[index]?.title || `Problem ${index + 1}`;
                const problemStatement = problems[index]?.statement || '';

                card.innerHTML = `
                    <h2>${problemTitle}</h2>
                    <div class="problem-statement">${problemStatement}</div>
                    <hr>
                    <p><strong>${currentLang === 'en' ? 'Answer' : 'คำตอบ'}: ${s.answer}</strong></p>
                    <div class="solution-statement">${formattedSteps}</div>`;
                solutionList.appendChild(card);
            });
        } else {
            // Display an error message if data is missing
            solutionList.innerHTML = `<p>${currentLang === 'en' ? 'Solutions are currently unavailable.' : 'ไม่สามารถแสดงเฉลยได้ในขณะนี้'}</p>`;
            console.error("Could not render solutions: Data missing for set", currentSetId, " lang", currentLang);
        }
        updateWelcomeMessage(); // Update welcome message if user info is displayed here
        renderMath(); // Re-render math content
    };


    const setLanguage = (lang) => {
        currentLang = lang;
        // Update static text elements
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

        // Update dynamic content based on the current screen
        updateWelcomeMessage();
        if (screens.selection.classList.contains('active')) {
            renderSelectionScreen();
        } else if (screens.test.classList.contains('active')) {
            // Update title and re-render problems with correct language
            const titleElement = document.getElementById('test-title');
             if (titleElement && currentSetId && examSets[currentSetId]) {
                 titleElement.textContent = examSets[currentSetId][currentLang].name;
             }
            renderProblems(); // Re-render problems to update hint button text
        } else if (screens.solution.classList.contains('active')) {
            // Update score display and re-render solutions
            if (lastScore !== null) displayScore(lastScore);
            renderSolutions();
        }
    };


    const loginAction = () => { loginCard.classList.add('authenticating'); loginStuff.errorMsg.textContent = ''; setTimeout(() => { const username = loginStuff.usernameInput.value.trim(); const password = loginStuff.passwordInput.value.trim(); if (credentials[username] && credentials[username] === password) { currentUser = username; localStorage.setItem('loggedInUser', username); showScreen('selection'); renderSelectionScreen(); } else { loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)'; loginCard.classList.remove('authenticating'); } }, 100); };
    const logoutAction = () => { currentUser = null; lastScore = null; currentSetId = null; localStorage.removeItem('loggedInUser'); loginStuff.usernameInput.value = ''; loginStuff.passwordInput.value = ''; if(timerInterval) clearInterval(timerInterval); showScreen('login'); };

    // --- Event Listeners ---
    loginStuff.loginBtn.addEventListener('click', loginAction);
    submitBtn.addEventListener('click', () => { if (confirm(currentLang === 'en' ? 'Are you sure you want to submit?' : 'คุณแน่ใจหรือไม่ว่าต้องการส่งคำตอบ?')) { submitTest(); } });
    backToSelectionBtn.addEventListener('click', () => { renderSelectionScreen(); showScreen('selection'); });
    logoutBtns.forEach(btn => btn.addEventListener('click', logoutAction));
    langToggles.forEach(btn => btn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'th' : 'en')));

    // --- Initialize App ---
    const initApp = () => {
        console.log("Initializing App...");
        // Tie data together
        Object.keys(allSolutions).forEach(setId => {
            if (allSolutions[setId]?.th && allSolutions[setId]?.en) {
                allSolutions[setId].th.forEach((sol_th, i) => {
                    if (allSolutions[setId].en[i]) {
                        sol_th.answer = allSolutions[setId].en[i].answer;
                        sol_th.hint = allSolutions[setId].en[i].hint; // Copy hint
                    }
                    if (allProblems[setId]?.th?.[i]) {
                        sol_th.title = allProblems[setId].th[i].title;
                    }
                });
            }
             if (allSolutions[setId]?.en && allProblems[setId]?.en) {
                 allSolutions[setId].en.forEach((sol_en, i) => {
                     if (allProblems[setId].en[i]) {
                         sol_en.title = allProblems[setId].en[i].title; // Sync EN title too
                     }
                 });
             }
        });

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
        setLanguage('en');
    };

    let katexLoaded = false;
    const checkKatexAndInit = () => {
        if (window.katex && window.renderMathInElement) {
            if (!katexLoaded) {
                katexLoaded = true;
                console.log("KaTeX confirmed loaded, initializing app.");
                initApp();
            }
        } else {
            console.log("Waiting for KaTeX to load...");
            setTimeout(checkKatexAndInit, 100);
        }
    };

    checkKatexAndInit();

}); // End DOMContentLoaded
