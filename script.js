// ===== SCRIPT.JS (FINAL VERSION WITH FULL SOLUTIONS) =====
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
                { title: "Problem 3", statement: "The equation $x^2+y^2+z^2=3xyz$ is known as the Markov equation. Find the sum of the components of the unique non-trivial integer solution $(x,y,z)$ with $x \\le y \\le z$ and $z < 10$. A non-trivial solution is one where $x, y, z$ are positive integers." },
                { title: "Problem 4", statement: "Let the sequence $a_n$ be defined for $n \\ge 1$ by $a_n = n + \\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$. Find the number of positive integers less than or equal to 2025 that are not in the set $\\{a_n | n \\in \\mathbb{Z}^+\\}$." },
                { title: "Problem 5", statement: "Let $p=2027$ (a prime number). Let $\\omega = e^{2\\pi i/p}$ be a primitive $p$-th root of unity. Calculate the numerical value of the product $P = \\prod_{k=1}^{p-1} (1-\\omega^k)^{(\\frac{k}{p})}$, where $(\\frac{k}{p})$ is the Legendre symbol." },
                { title: "Problem 6", statement: "Find the largest integer $n$ less than 1000 for which there exists a pair of positive integers $(x,y)$ satisfying the equation $x^2 - (n^2+1)y^2 = -1$." },
                { title: "Problem 7", statement: "Let $p=43$. Find the value of the sum $\\sum_{g} g \\pmod{p}$, where the sum is taken over all primitive roots $g$ modulo $p$ in the range $1 \\le g < p$." },
                { title: "Problem 8", statement: "Let $\\sigma(n)$ denote the sum of the positive divisors of $n$. Find the smallest integer $n > 2$ such that $\\sigma(n) \\equiv 2 \\pmod{n}$." },
                { title: "Problem 9", statement: "Let $F_n$ be the $n$-th Fibonacci number ($F_1=1, F_2=1$). Evaluate the sum $S = \\sum_{n=3}^{\\infty} \\arctan\\left(\\frac{F_{n-1}F_n - F_{n-2}F_{n+1}}{F_{n-1}F_{n+1}+F_n F_{n-2}}\\right)$." },
                { title: "Problem 10", statement: "Find the last non-zero digit in the decimal representation of $1000!$." }
            ],
            th: [
                { title: "โจทย์ข้อที่ 1", statement: "จงหาผลบวกของจำนวนตรรกยะ $r$ ทั้งหมดที่ทำให้สมการ $r^2 x^2 + (r-1)x + (r-2) = 0$ มีรากเป็นจำนวนเต็มที่แตกต่างกันสองค่า" },
                { title: "โจทย์ข้อที่ 2", statement: "เป็นที่ทราบกันว่าผลเฉลยจำนวนเต็มของ $n | (2^n+1)$ คือ $3^k$ เท่านั้น จงหาจำนวนเต็ม $n>1$ ที่ไม่ใช่กำลังของ 3 ที่มีค่าน้อยที่สุดเป็นอันดับที่สอง ที่สอดคล้องกับ $n$ หาร $2^n+2$ ลงตัว" },
                { title: "โจทย์ข้อที่ 3", statement: "สมการ $x^2+y^2+z^2=3xyz$ คือสมการมาร์คอฟ จงหาผลบวกขององค์ประกอบของผลเฉลยจำนวนเต็มบวก $(x,y,z)$ ที่ไม่ใช่ผลเฉลยชัดแจ้งเพียงชุดเดียวที่สอดคล้องกับ $x \\le y \\le z$ และ $z < 10$" },
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
        'nt1': {
            en: [
                { answer: "1/4", steps: "Let the integer roots be $m, n$. Let $S=m+n$ and $P=mn$. From Vieta's formulas, we derive $r = \\frac{P+2S}{P+S}$. Substituting this into the relation $r^2(S+P)=-1$ gives a quadratic equation for $P$: $P^2+P(4S+1)+(4S^2+S)=0$. For $P$ to be an integer, the discriminant $D_P = 4S+1$ must be a perfect square, say $k^2$. This implies $S=j(j+1)$ for some integer $j$. For the roots $m,n$ to be integers, the discriminant of $x^2-Sx+P=0$, which is $S^2-4P$, must also be a perfect square. Testing integer values for $j$ yields valid pairs $(S,P)$ for $j=0,1,3$ (and their negative counterparts). These pairs correspond to $r=1, -1, 1/4$. The sum is $1 + (-1) + 1/4 = 1/4$." },
                { answer: "6", steps: "We need $n | 2^n+2$. If $n$ is odd and not a power of 3, small values do not work. If $n$ is even, let $n=2k$. The condition becomes $k | (2^{2k-1}+1)$. For this to hold, $k$ must be odd (unless $k=1$). We test small odd values for $k$. For $k=1$, $1|2^1+1$ is true, giving $n=2(1)=2$. This is the smallest solution not a power of 3. For $k=3$, $3|2^5+1=33$ is true, giving $n=2(3)=6$. This is the second smallest solution not a power of 3. Further analysis shows the next solution is $n=66$ (from $k=33$). So 6 is indeed the second smallest." },
                { answer: "8", steps: "This is the Markov equation. We find solutions using Vieta Jumping. Start with the base solution $(1,1,1)$. Fix two variables, say $(x,y)=(1,1)$, and solve the resulting quadratic $t^2 - 3xyt + (x^2+y^2)=0$ for the third, $t$. This gives $t^2-3t+2=0$, with roots $t=1,2$, generating the new solution $(1,1,2)$. Next, starting with $(1,2)$, the quadratic is $t^2 - 6t+5=0$, with roots $t=1,5$, generating $(1,2,5)$. Continuing this process, the next solution generated is $(1,5,13)$, where $z=13 \\ge 10$. The solutions satisfying $x \\le y \\le z$ and $z<10$ are $(1,1,1), (1,1,2), (1,2,5)$. The problem asks for the unique non-trivial solution. The largest and only one with distinct components is $(1,2,5)$. The sum is $1+2+5=8$." },
                { answer: "45", steps: "The expression $\\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ is equivalent to rounding $\\sqrt{n}$ to the nearest integer. Let $k = \\text{round}(\\sqrt{n})$. This condition holds for integers $n$ in the range $k^2-k+1 \\le n \\le k^2+k$. For such $n$, the sequence value is $a_n = n+k$. The set of values generated for a fixed $k$ is the range of consecutive integers $[k^2+1, k^2+2k]$. The union of these sets for $k=1, 2, 3, \\dots$ is $\\{2,3\\} \\cup \\{5,6,7,8\\} \\cup \\{10,\\dots,15\\} \\cup \\dots$. The integers that are missing from this sequence are exactly the perfect squares: $1, 4, 9, 16, \\dots$. We need to find the number of perfect squares less than or equal to 2025. Since $\\sqrt{2025} = 45$, the missing numbers are $1^2, 2^2, \\dots, 45^2$. There are 45 such numbers." },
                { answer: "-1", steps: "The product is $P = A/B$ where $A$ is the product over quadratic residues $R$ and $B$ is over non-residues $N$. For $p=2027 \\equiv 3 \\pmod 4$, we have $N = \\{-k \\pmod p | k \\in R\\}$, which implies $B = \\bar{A}$. Thus $P = A/\\bar{A}$ has magnitude 1. The value is given by $P = (-1)^{h_{(-p)}}$, where $h_{(-p)}$ is the class number of the imaginary quadratic field $\\mathbb{Q}(\\sqrt{-p})$. For a prime $p>3$ with $p \\equiv 3 \\pmod 4$, the class number $h_{(-p)}$ is odd if and only if $p \\equiv 3 \\pmod 8$. We check $2027 \\pmod 8$: $2027 = 8 \\cdot 253 + 3$. Since $p \\equiv 3 \\pmod 8$, the class number $h_{(-2027)}$ is odd. Therefore, $P = (-1)^{\\text{odd}} = -1$." },
                { answer: "999", steps: "The equation $x^2 - Dy^2 = -1$ is a negative Pell's equation. It has a solution in positive integers if and only if the period length of the simple continued fraction of $\\sqrt{D}$ is odd. Here, $D = n^2+1$. The continued fraction for $\\sqrt{n^2+1}$ is $[n; \\overline{2n}]$. The period of this continued fraction is $(2n)$, which has a length of 1. Since 1 is an odd number, the equation $x^2 - (n^2+1)y^2 = -1$ has a solution for every positive integer $n$. The question asks for the largest integer $n$ less than 1000. Since a solution exists for all $n$, we simply need the largest integer satisfying $n < 1000$, which is 999." },
                { answer: "42", steps: "The sum of elements of order $d$ in $(\\mathbb{Z}/p\\mathbb{Z})^\\times$, let's call it $S_d$, can be found using Möbius inversion on the function $f(n) = \\sum_{d|n}S_d$. The function $f(n)$ is the sum of all elements whose order divides $n$, which are the roots of $x^n-1 \\equiv 0 \\pmod p$. The sum of these roots is 0 for $n>1$ and is 1 for $n=1$. The inversion formula gives $S_n = \\sum_{d|n} \\mu(n/d)f(d)$. For $n=p-1=42$, all terms in the sum are zero except for $d=1$, so $S_{42} \\equiv \\mu(42/1)f(1) = \\mu(42)$. Since $42 = 2 \\cdot 3 \\cdot 7$, $\\mu(42) = (-1)^3 = -1$. Therefore, the sum is $-1 \\equiv 42 \\pmod{43}$." },
                { answer: "20", steps: "The condition $\\sigma(n) \\equiv 2 \\pmod{n}$ means that $\\sigma(n) = kn+2$ for some integer $k$. Let $S_p(n) = \\sigma(n)-n$ be the sum of proper divisors. The condition is equivalent to $S_p(n) \\equiv 2 \\pmod n$. The sum of proper divisors for $n>2$ cannot be 2. Therefore, we must have $\\sigma(n) = kn+2$ for $k \\ge 2$. This implies $\\sigma(n) > 2n$, so $n$ must be an abundant number. The smallest abundant number is 12. We test abundant numbers in order: for $n=12$, $\\sigma(12)=28 \\equiv 4 \\pmod{12}$. For $n=18$, $\\sigma(18)=39 \\equiv 3 \\pmod{18}$. For $n=20$, $\\sigma(20)=42$. Since $42 = 2 \\cdot 20 + 2$, we have $42 \\equiv 2 \\pmod{20}$. This is the smallest solution > 2." },
                { answer: "-arctan(1/7)", steps: "The argument of arctan fits the tangent subtraction formula $\\arctan(x)-\\arctan(y) = \\arctan(\\frac{x-y}{1+xy})$. Let $x=F_{n-1}/F_{n-2}$ and $y=F_{n+1}/F_n$. The term becomes $\\arctan(x)-\\arctan(y)$. Let $A_k = \\arctan(F_k/F_{k-1})$. The $n$-th term of the sum is $A_{n-1} - A_{n+1}$. This is a telescoping sum with a step of 2. The sum evaluates to $S = A_2+A_3 - 2\\lim A_k = \\arctan(1)+\\arctan(2) - 2\\arctan(\\phi)$. Using the identities $\\arctan(1)+\\arctan(2)=\\pi-\\arctan(3)$ and $2\\arctan(\\phi)=\\pi-\\arctan(2)$, the sum simplifies to $S = \\arctan(2) - \\arctan(3) = \\arctan(\\frac{2-3}{1+2\\cdot3}) = \\arctan(-1/7) = -\\arctan(1/7)$." },
                { answer: "2", steps: "The last non-zero digit is $D(1000!) = \\frac{1000!}{10^k} \\pmod{10}$ where $k = \\nu_5(1000!) = 249$. We need to solve the system $X \\equiv 0 \\pmod 2$ and $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$. Using a generalization of Wilson's Theorem, we can show recursively that $A = \\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$. The other term is $(2^{-1})^{249} \\equiv 3^{249} \\equiv 3^1 = 3 \\pmod 5$. Thus, $X \\equiv A \\cdot 3 \\equiv 4 \\cdot 3 = 12 \\equiv 2 \\pmod 5$. The only even digit that is $2 \\pmod 5$ is 2." }
            ],
            th: [
                { answer: "1/4", steps: "ให้ $m, n$ เป็นรากจำนวนเต็ม ให้ $S=m+n$ และ $P=mn$ จากสูตรของเวียดจะได้ $r = \\frac{P+2S}{P+S}$ นำไปแทนค่าในความสัมพันธ์ $r^2(S+P)=-1$ จะได้สมการกำลังสองของ $P$: $P^2+P(4S+1)+(4S^2+S)=0$ การที่ $P$ จะเป็นจำนวนเต็มได้ ดิสคริมิแนนต์ $D_P = 4S+1$ จะต้องเป็นกำลังสองสมบูรณ์ ($k^2$) ซึ่งหมายความว่า $S=j(j+1)$ และราก $m,n$ ต้องเป็นจำนวนเต็ม ดังนั้น $S^2-4P$ ก็ต้องเป็นกำลังสองสมบูรณ์เช่นกัน เมื่อทดสอบค่า $j$ จะได้คู่ $(S,P)$ ที่สอดคล้องสำหรับ $j=0,1,3$ ซึ่งให้ค่า $r=1, -1, 1/4$ ตามลำดับ ผลรวมคือ $1/4$" },
                { answer: "6", steps: "เราต้องการหา $n$ ที่ $n | 2^n+2$ ถ้า $n$ เป็นคู่ ให้ $n=2k$ เงื่อนไขจะกลายเป็น $k | (2^{2k-1}+1)$ การที่เงื่อนไขนี้จะเป็นจริง $k$ จะต้องเป็นจำนวนคี่ (ยกเว้นกรณี $k=1$) เมื่อทดสอบค่า $k$ ที่เป็นจำนวนคี่น้อยๆ: กรณี $k=1$ เป็นจริง ได้ $n=2$ ซึ่งเป็นผลเฉลยแรกที่ไม่ใช่กำลังของ 3 กรณี $k=3$ เป็นจริง ได้ $n=6$ ซึ่งเป็นผลเฉลยที่สองที่ไม่ใช่กำลังของ 3 ผลเฉลยถัดไปคือ $n=66$ (จาก $k=33$) ดังนั้น 6 จึงเป็นคำตอบ" },
                { answer: "8", steps: "นี่คือสมการมาร์คอฟ เราหาผลเฉลยได้ด้วยเทคนิค Vieta Jumping เริ่มจากผลเฉลยพื้นฐาน $(1,1,1)$ ตรึงค่า $(x,y)=(1,1)$ ในสมการกำลังสอง $t^2 - 3xyt + (x^2+y^2)=0$ จะได้ราก $t=1,2$ ซึ่งสร้างผลเฉลยใหม่ $(1,1,2)$ จากนั้นตรึง $(1,2)$ ในสมการเดียวกันจะได้ราก $t=1,5$ ซึ่งสร้างผลเฉลย $(1,2,5)$ ผลเฉลยถัดไปคือ $(1,5,13)$ ซึ่งมี $z \\ge 10$ ดังนั้นผลเฉลยที่สอดคล้องกับเงื่อนไขคือ $(1,1,1), (1,1,2), (1,2,5)$ ผลเฉลยที่ไม่ใช่ผลเฉลยชัดแจ้งที่ใหญ่ที่สุดคือ $(1,2,5)$ ผลรวมคือ $1+2+5=8$" },
                { answer: "45", steps: "นิพจน์ $\\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ คือการปัดเศษของ $\\sqrt{n}$ ไปยังจำนวนเต็มที่ใกล้ที่สุด ให้ $k = \\text{round}(\\sqrt{n})$ ซึ่งจะเกิดขึ้นเมื่อ $k^2-k+1 \\le n \\le k^2+k$ สำหรับค่า $n$ เหล่านี้ ค่าของลำดับคือ $a_n = n+k$ ซึ่งจะสร้างช่วงของจำนวนเต็ม $[k^2+1, k^2+2k]$ เมื่อรวมช่วงเหล่านี้สำหรับ $k=1, 2, 3, \\dots$ จะพบว่าจำนวนเต็มที่หายไปจากลำดับคือจำนวนกำลังสองสมบูรณ์: $1, 4, 9, \\dots$ เราจึงต้องหาจำนวนกำลังสองสมบูรณ์ที่น้อยกว่าหรือเท่ากับ 2025 เนื่องจาก $\\sqrt{2025}=45$ จำนวนที่หายไปคือ $1^2, 2^2, \\dots, 45^2$ ซึ่งมีทั้งหมด 45 จำนวน" },
                { answer: "-1", steps: "ผลคูณคือ $P = A/B$ โดยที่ $A$ คือผลคูณของพจน์ที่เกี่ยวข้องกับเศษกำลังสอง (Residues) และ $B$ คือผลคูณของพจน์ที่ไม่ใช่เศษกำลังสอง (Non-residues) สำหรับจำนวนเฉพาะ $p=2027 \\equiv 3 \\pmod 4$ จะมีความสัมพันธ์ว่า $B=\\bar{A}$ ดังนั้น $P=A/\\bar{A}$ ซึ่งมีขนาดเท่ากับ 1 ค่าของ $P$ สามารถคำนวณได้จากสูตร $P=(-1)^{h_{(-p)}}$ โดยที่ $h_{(-p)}$ คือเลขชั้น (class number) ของฟีลด์จินตภาพกำลังสอง $\\mathbb{Q}(\\sqrt{-p})$ สำหรับจำนวนเฉพาะ $p>3$ ที่ $p \\equiv 3 \\pmod 4$ เลขชั้น $h_{(-p)}$ จะเป็นจำนวนคี่ก็ต่อเมื่อ $p \\equiv 3 \\pmod 8$ เราตรวจสอบได้ว่า $2027 \\equiv 3 \\pmod 8$ ดังนั้นเลขชั้นเป็นจำนวนคี่ ทำให้ $P = (-1)^{\\text{odd}} = -1$" },
                { answer: "999", steps: "สมการ $x^2 - Dy^2 = -1$ คือสมการของเพลล์ภาคลบ ซึ่งจะมีผลเฉลยเป็นจำนวนเต็มบวกก็ต่อเมื่อความยาวคาบของเศษส่วนต่อเนื่องของ $\\sqrt{D}$ เป็นจำนวนคี่ ในข้อนี้ $D=n^2+1$ ซึ่งมีเศษส่วนต่อเนื่องคือ $[n; \\overline{2n}]$ คาบมีความยาวเท่ากับ 1 ซึ่งเป็นจำนวนคี่เสมอ ดังนั้นสมการนี้จึงมีผลเฉลยสำหรับทุกจำนวนเต็มบวก $n$ โจทย์ต้องการหาจำนวนเต็ม $n$ ที่มากที่สุดที่น้อยกว่า 1000 ดังนั้นคำตอบคือ 999" },
                { answer: "42", steps: "ผลบวกของรากปฐมฐานมอดุโล $p$ เท่ากับ $\\mu(p-1) \\pmod p$ สำหรับ $p=43$ เราต้องการหาค่า $\\mu(42)$ เนื่องจาก $42=2 \\cdot 3 \\cdot 7$ เป็นผลคูณของจำนวนเฉพาะที่แตกต่างกัน 3 ตัว ดังนั้น $\\mu(42)=(-1)^3 = -1$ ผลบวกของรากปฐมฐานจึงเท่ากับ $-1 \\equiv 42 \\pmod{43}$" },
                { answer: "20", steps: "เงื่อนไข $\\sigma(n) \\equiv 2 \\pmod{n}$ หมายความว่า $n$ ต้องเป็นจำนวนบริบูรณ์ (abundant number) ซึ่งคือจำนวนที่ $\\sigma(n) > 2n$ เราจึงเริ่มทดสอบจากจำนวนบริบูรณ์น้อยๆ ไป: $n=12$, $\\sigma(12)=28 \\equiv 4 \\pmod{12}$; $n=18$, $\\sigma(18)=39 \\equiv 3 \\pmod{18}$; สำหรับ $n=20$, $\\sigma(20)=42$ และเนื่องจาก $42 = 2 \\cdot 20 + 2$ ดังนั้น $42 \\equiv 2 \\pmod{20}$ เนื่องจากจำนวนที่น้อยกว่า 20 ไม่สอดคล้องเงื่อนไข 20 จึงเป็นผลเฉลยที่น้อยที่สุด" },
                { answer: "-arctan(1/7)", steps: "พจน์ใน arctan สอดคล้องกับสูตรผลต่างของอาร์กแทนเจนต์ $\\arctan(x)-\\arctan(y) = \\arctan(\\frac{x-y}{1+xy})$ เมื่อให้ $x=F_{n-1}/F_{n-2}$ และ $y=F_{n+1}/F_n$ จะได้ว่าพจน์ที่ $n$ ของอนุกรมคือ $A_{n-1} - A_{n+1}$ โดยที่ $A_k = \\arctan(F_k/F_{k-1})$ อนุกรมนี้จึงเป็นอนุกรมโทรทรรศน์ที่มีผลบวกเท่ากับ $S = A_2+A_3 - 2\\lim A_k = \\arctan(1)+\\arctan(2) - 2\\arctan(\\phi)$ เมื่อใช้เอกลักษณ์ที่เกี่ยวข้อง จะได้ผลลัพธ์สุดท้ายเป็น $\\arctan(2) - \\arctan(3)$ ซึ่งเท่ากับ $-\\arctan(1/7)$" },
                { answer: "2", steps: "เลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายคือ $D(1000!) = \\frac{1000!}{10^k} \\pmod{10}$ โดยที่ $k = \\nu_5(1000!) = 249$ เราต้องแก้ระบบสมการ $X \\equiv 0 \\pmod 2$ และ $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$ จากทฤษฎีบทวิลสันรูปแบบทั่วไป จะได้ว่า $\\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$ และพจน์ $(2^{-1})^{249} \\equiv 3^{249} \\equiv 3 \\pmod 5$ ดังนั้น $X \\equiv 4 \\cdot 3 = 12 \\equiv 2 \\pmod 5$ เลขโดดคู่เดียวที่สอดคล้องกับเงื่อนไขทั้งสองคือ 2" }
            ]
        }
    };
    
    // --- Core Functions ---

    const showScreen = (screenId) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }
    };

    const renderMath = () => {
        try {
            if (window.renderMathInElement) {
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false}, {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            }
        } catch (error) {
            console.error("KaTeX rendering failed:", error);
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
        allProblems[currentSetId]['en'].forEach((p, i) => { // Always check against 'en' answer key
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
        const solutions = allSolutions[currentSetId][currentLang];
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
        document.getElementById('login-title').textContent = lang === 'en' ? 'Mathematics Exam' : 'แบบทดสอบคณิตศาสตร์';
        loginStuff.usernameInput.placeholder = lang === 'en' ? 'Username' : 'ชื่อผู้ใช้';
        loginStuff.passwordInput.placeholder = lang === 'en' ? 'Password' : 'รหัสผ่าน';
        loginStuff.loginBtn.textContent = lang === 'en' ? 'Login' : 'เข้าสู่ระบบ';
        document.getElementById('selection-title').textContent = lang === 'en' ? 'Select Exam' : 'เลือกชุดข้อสอบ';
        document.getElementById('timer-label').textContent = lang === 'en' ? 'Time Left:' : 'เวลาที่เหลือ:';
        document.getElementById('submit-btn').textContent = lang === 'en' ? 'Submit' : 'ส่งคำตอบ';
        document.getElementById('solution-title').textContent = lang === 'en' ? 'Results & Solutions' : 'ผลลัพธ์และเฉลย';
        document.getElementById('back-to-login-btn').textContent = lang === 'en' ? 'Back to Login' : 'กลับไปหน้าล็อคอิน';
        
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
        const username = loginStuff.usernameInput.value.trim();
        const password = loginStuff.passwordInput.value.trim();

        if (credentials[username] && credentials[username] === password) {
            loginStuff.errorMsg.textContent = '';
            
            if (username === 'JJ') {
                 renderSelectionScreen();
                 showScreen('selection');
                 return;
            }
            
            let completedSetId = null;
            for (const setId in examSets) {
                if (localStorage.getItem(`test_completed_${username}_${setId}`)) {
                    completedSetId = setId;
                    break;
                }
            }

            if (completedSetId) {
                currentSetId = completedSetId;
                lastScore = "N/A"; // Score is not saved, so just mark as not applicable
                displayScore("N/A");
                renderSolutions();
                showScreen('solution');
            } else {
                renderSelectionScreen();
                showScreen('selection');
            }
        } else {
            loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
        }
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
    
    // --- Initial Setup ---
    const init = () => {
        // This function runs once KaTeX is loaded
        const allSolutionsData = {
            'nt1': {
                en: allSolutions['nt1'],
                th: [
                    { answer: "1/4", steps: "ให้ $m, n$ เป็นรากจำนวนเต็ม ให้ $S=m+n$ และ $P=mn$ จากสูตรของเวียดจะได้ $r = \\frac{P+2S}{P+S}$ นำไปแทนค่าในความสัมพันธ์ $r^2(S+P)=-1$ จะได้สมการกำลังสองของ $P$: $P^2+P(4S+1)+(4S^2+S)=0$ การที่ $P$ จะเป็นจำนวนเต็มได้ ดิสคริมิแนนต์ $D_P = 4S+1$ จะต้องเป็นกำลังสองสมบูรณ์ ($k^2$) ซึ่งหมายความว่า $S=j(j+1)$ และราก $m,n$ ต้องเป็นจำนวนเต็ม ดังนั้น $S^2-4P$ ก็ต้องเป็นกำลังสองสมบูรณ์เช่นกัน เมื่อทดสอบค่า $j$ จะได้คู่ $(S,P)$ ที่สอดคล้องสำหรับ $j=0,1,3$ ซึ่งให้ค่า $r=1, -1, 1/4$ ตามลำดับ ผลรวมคือ $1/4$" },
                    { answer: "6", steps: "เราต้องการหา $n$ ที่ $n | 2^n+2$ ถ้า $n$ เป็นคู่ ให้ $n=2k$ เงื่อนไขจะกลายเป็น $k | (2^{2k-1}+1)$ การที่เงื่อนไขนี้จะเป็นจริง $k$ จะต้องเป็นจำนวนคี่ (ยกเว้นกรณี $k=1$) เมื่อทดสอบค่า $k$ ที่เป็นจำนวนคี่น้อยๆ: กรณี $k=1$ เป็นจริง ได้ $n=2$ ซึ่งเป็นผลเฉลยแรกที่ไม่ใช่กำลังของ 3 กรณี $k=3$ เป็นจริง ได้ $n=6$ ซึ่งเป็นผลเฉลยที่สองที่ไม่ใช่กำลังของ 3 ผลเฉลยถัดไปคือ $n=66$ (จาก $k=33$) ดังนั้น 6 จึงเป็นคำตอบ" },
                    { answer: "8", steps: "นี่คือสมการมาร์คอฟ เราหาผลเฉลยได้ด้วยเทคนิค Vieta Jumping เริ่มจากผลเฉลยพื้นฐาน $(1,1,1)$ ตรึงค่า $(x,y)=(1,1)$ ในสมการกำลังสอง $t^2 - 3xyt + (x^2+y^2)=0$ จะได้ราก $t=1,2$ ซึ่งสร้างผลเฉลยใหม่ $(1,1,2)$ จากนั้นตรึง $(1,2)$ ในสมการเดียวกันจะได้ราก $t=1,5$ ซึ่งสร้างผลเฉลย $(1,2,5)$ ผลเฉลยถัดไปคือ $(1,5,13)$ ซึ่งมี $z \\ge 10$ ดังนั้นผลเฉลยที่สอดคล้องกับเงื่อนไขคือ $(1,1,1), (1,1,2), (1,2,5)$ ผลเฉลยที่ไม่ใช่ผลเฉลยชัดแจ้งที่ใหญ่ที่สุดคือ $(1,2,5)$ ผลรวมคือ $1+2+5=8$" },
                    { answer: "45", steps: "นิพจน์ $\\lfloor \\sqrt{n} + \\frac{1}{2} \\rfloor$ คือการปัดเศษของ $\\sqrt{n}$ ไปยังจำนวนเต็มที่ใกล้ที่สุด ให้ $k = \\text{round}(\\sqrt{n})$ ซึ่งจะเกิดขึ้นเมื่อ $k^2-k+1 \\le n \\le k^2+k$ สำหรับค่า $n$ เหล่านี้ ค่าของลำดับคือ $a_n = n+k$ ซึ่งจะสร้างช่วงของจำนวนเต็ม $[k^2+1, k^2+2k]$ เมื่อรวมช่วงเหล่านี้สำหรับ $k=1, 2, 3, \\dots$ จะพบว่าจำนวนเต็มที่หายไปจากลำดับคือจำนวนกำลังสองสมบูรณ์: $1, 4, 9, \\dots$ เราจึงต้องหาจำนวนกำลังสองสมบูรณ์ที่น้อยกว่าหรือเท่ากับ 2025 เนื่องจาก $\\sqrt{2025}=45$ จำนวนที่หายไปคือ $1^2, 2^2, \\dots, 45^2$ ซึ่งมีทั้งหมด 45 จำนวน" },
                    { answer: "-1", steps: "ผลคูณคือ $P = A/B$ โดยที่ $A$ คือผลคูณของพจน์ที่เกี่ยวข้องกับเศษกำลังสอง (Residues) และ $B$ คือผลคูณของพจน์ที่ไม่ใช่เศษกำลังสอง (Non-residues) สำหรับจำนวนเฉพาะ $p=2027 \\equiv 3 \\pmod 4$ จะมีความสัมพันธ์ว่า $B=\\bar{A}$ ดังนั้น $P=A/\\bar{A}$ ซึ่งมีขนาดเท่ากับ 1 ค่าของ $P$ สามารถคำนวณได้จากสูตร $P=(-1)^{h_{(-p)}}$ โดยที่ $h_{(-p)}$ คือเลขชั้น (class number) ของฟีลด์จินตภาพกำลังสอง $\\mathbb{Q}(\\sqrt{-p})$ สำหรับจำนวนเฉพาะ $p>3$ ที่ $p \\equiv 3 \\pmod 4$ เลขชั้น $h_{(-p)}$ จะเป็นจำนวนคี่ก็ต่อเมื่อ $p \\equiv 3 \\pmod 8$ เราตรวจสอบได้ว่า $2027 \\equiv 3 \\pmod 8$ ดังนั้นเลขชั้นเป็นจำนวนคี่ ทำให้ $P = (-1)^{\\text{odd}} = -1$" },
                    { answer: "999", steps: "สมการ $x^2 - Dy^2 = -1$ คือสมการของเพลล์ภาคลบ ซึ่งจะมีผลเฉลยเป็นจำนวนเต็มบวกก็ต่อเมื่อความยาวคาบของเศษส่วนต่อเนื่องของ $\\sqrt{D}$ เป็นจำนวนคี่ ในข้อนี้ $D=n^2+1$ ซึ่งมีเศษส่วนต่อเนื่องคือ $[n; \\overline{2n}]$ คาบมีความยาวเท่ากับ 1 ซึ่งเป็นจำนวนคี่เสมอ ดังนั้นสมการนี้จึงมีผลเฉลยสำหรับทุกจำนวนเต็มบวก $n$ โจทย์ต้องการหาจำนวนเต็ม $n$ ที่มากที่สุดที่น้อยกว่า 1000 ดังนั้นคำตอบคือ 999" },
                    { answer: "42", steps: "ผลบวกของรากปฐมฐานมอดุโล $p$ เท่ากับ $\\mu(p-1) \\pmod p$ สำหรับ $p=43$ เราต้องการหาค่า $\\mu(42)$ เนื่องจาก $42=2 \\cdot 3 \\cdot 7$ เป็นผลคูณของจำนวนเฉพาะที่แตกต่างกัน 3 ตัว ดังนั้น $\\mu(42)=(-1)^3 = -1$ ผลบวกของรากปฐมฐานจึงเท่ากับ $-1 \\equiv 42 \\pmod{43}$" },
                    { answer: "20", steps: "เงื่อนไข $\\sigma(n) \\equiv 2 \\pmod{n}$ หมายความว่า $n$ ต้องเป็นจำนวนบริบูรณ์ (abundant number) ซึ่งคือจำนวนที่ $\\sigma(n) > 2n$ เราจึงเริ่มทดสอบจากจำนวนบริบูรณ์น้อยๆ ไป: $n=12$, $\\sigma(12)=28 \\equiv 4 \\pmod{12}$; $n=18$, $\\sigma(18)=39 \\equiv 3 \\pmod{18}$; สำหรับ $n=20$, $\\sigma(20)=42$ และเนื่องจาก $42 = 2 \\cdot 20 + 2$ ดังนั้น $42 \\equiv 2 \\pmod{20}$ เนื่องจากจำนวนที่น้อยกว่า 20 ไม่สอดคล้องเงื่อนไข 20 จึงเป็นผลเฉลยที่น้อยที่สุด" },
                    { answer: "-arctan(1/7)", steps: "พจน์ใน arctan สอดคล้องกับสูตรผลต่างของอาร์กแทนเจนต์ $\\arctan(x)-\\arctan(y) = \\arctan(\\frac{x-y}{1+xy})$ เมื่อให้ $x=F_{n-1}/F_{n-2}$ และ $y=F_{n+1}/F_n$ จะได้ว่าพจน์ที่ $n$ ของอนุกรมคือ $A_{n-1} - A_{n+1}$ โดยที่ $A_k = \\arctan(F_k/F_{k-1})$ อนุกรมนี้จึงเป็นอนุกรมโทรทรรศน์ที่มีผลบวกเท่ากับ $S = A_2+A_3 - 2\\lim A_k = \\arctan(1)+\\arctan(2) - 2\\arctan(\\phi)$ เมื่อใช้เอกลักษณ์ที่เกี่ยวข้อง จะได้ผลลัพธ์สุดท้ายเป็น $\\arctan(2) - \\arctan(3)$ ซึ่งเท่ากับ $-\\arctan(1/7)$" },
                    { answer: "2", steps: "เลขโดดที่ไม่ใช่ศูนย์ตัวสุดท้ายคือ $D(1000!) = \\frac{1000!}{10^k} \\pmod{10}$ โดยที่ $k = \\nu_5(1000!) = 249$ เราต้องแก้ระบบสมการ $X \\equiv 0 \\pmod 2$ และ $X \\equiv \\frac{1000!}{5^{249}} (2^{-1})^{249} \\pmod 5$ จากทฤษฎีบทวิลสันรูปแบบทั่วไป จะได้ว่า $\\frac{1000!}{5^{249}} \\equiv 4 \\pmod 5$ และพจน์ $(2^{-1})^{249} \\equiv 3^{249} \\equiv 3 \\pmod 5$ ดังนั้น $X \\equiv 4 \\cdot 3 = 12 \\equiv 2 \\pmod 5$ เลขโดดคู่เดียวที่สอดคล้องกับเงื่อนไขทั้งสองคือ 2" }
                ]
            }
        };
        Object.assign(allSolutions['nt1'], allSolutionsData);
        setLanguage('en');
    };

    // This robustly waits for the KaTeX script to be loaded and ready
    const kaTeXScript = document.querySelector('script[src*="auto-render.min.js"]');
    if (kaTeXScript) {
        kaTeXScript.onload = init;
    } else {
        // Fallback if the script is already loaded by the time this runs
        init();
    }
});
