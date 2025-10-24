// ===== SCRIPT.JS (DEBUG VERSION) =====
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
    const DURATION = 2 * 60 * 60;

    const credentials = {
        JJ: 'admin',
        Waigoon: 'Joi',
        Thimphu: 'Yensira',
        Meepooh: 'Meepooh',
        Win: 'Eovs',
    };

    // --- Event Listeners (DEBUG VERSION) ---
    loginStuff.loginBtn.addEventListener('click', () => {
        alert("ขั้นที่ 1: ปุ่ม Login ถูกกดแล้ว กำลังจะเริ่มตรวจสอบข้อมูล");

        const username = loginStuff.usernameInput.value.trim();
        const password = loginStuff.passwordInput.value.trim();

        alert(`ขั้นที่ 2: ข้อมูลที่โค้ดอ่านได้\n\nUsername ที่คุณพิมพ์: "${username}"\nPassword ที่คุณพิมพ์: "${password}"\n\n(โปรดสังเกตว่ามีเว้นวรรคหรือตัวพิมพ์เล็ก-ใหญ่ผิดหรือไม่)`);

        const correctPassword = credentials[username];

        if (correctPassword && correctPassword === password) {
            alert("ขั้นที่ 3: ตรวจสอบข้อมูลถูกต้อง! กำลังจะไปหน้าทำข้อสอบ");

            // --- ส่วนที่เหลือของโค้ด (ทำงานเมื่อ Login สำเร็จ) ---
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
            // --- จบส่วนทำงาน ---

        } else {
            alert(`ขั้นที่ 3: ตรวจสอบข้อมูลผิดพลาด!\n\n- Username ที่โค้ดเห็น: "${username}"\n- Password ที่ถูกต้องสำหรับ User นี้คือ: "${correctPassword}"\n- Password ที่คุณพิมพ์: "${password}"\n\nสาเหตุอาจเกิดจาก: \n1. พิมพ์ผิด \n2. ตัวพิมพ์เล็ก-ใหญ่ไม่ตรงกัน (เช่น jj แทน JJ)`);
            loginStuff.errorMsg.textContent = currentLang === 'en' ? 'Invalid username or password. Note: It is case-sensitive.' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (โปรดระวังตัวพิมพ์เล็ก-ใหญ่)';
        }
    });


    // --- ส่วนฟังก์ชันอื่นๆ (ไม่ต้องแก้ไข) ---
    const showScreen = (screenId) => { Object.values(screens).forEach(s=>s.classList.remove('active')); screens[screenId].classList.add('active'); };
    const formatTime = (s) => { const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); const sec = s%60; return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;};
    const startTimer = () => { let t=DURATION; timerDisplay.textContent=formatTime(t); timerDisplay.classList.remove('warning','danger'); timerInterval=setInterval(()=>{ t--; timerDisplay.textContent=formatTime(t); if(t<600&&t>=60)timerDisplay.classList.add('warning'); if(t<60)timerDisplay.classList.add('danger'); if(t<=0){clearInterval(timerInterval); submitTest();}},1000);};
    const submitTest = () => { clearInterval(timerInterval); const u=loginStuff.usernameInput.value.trim(); localStorage.setItem(`test_completed_${u}`,'true'); let s=0; for(let i=0;i<problems.en.length;i++){const a=document.getElementById(`answer-${i}`).value.trim(); const c=solutions.en[i].answer; if(a===c){s++;}} lastScore=s; displayScore(s); renderSolutions(); showScreen('solution');};
    const displayScore = (s) => { scoreDisplay.textContent = currentLang==='en'?`Your Score: ${s} / 10`:`คะแนนของคุณ: ${s} / 10`;};
    const renderMath = () => { if(window.renderMathInElement){renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}]});}};
    const renderProblems = () => { problemContainer.innerHTML=''; problems[currentLang].forEach((p,i)=>{ const d=document.createElement('div'); d.className='problem-card'; d.innerHTML=`<h2>${p.title}</h2><div class="problem-statement">${p.statement}</div><input type="text" class="answer-input" id="answer-${i}" placeholder="${currentLang==='en'?'Your answer':'คำตอบของคุณ'}">`; problemContainer.appendChild(d);}); renderMath();};
    const renderSolutions = () => { solutionList.innerHTML=''; solutions[currentLang].forEach((s,i)=>{ const p=problems[currentLang][i]; const d=document.createElement('div'); d.className='solution-card'; d.innerHTML=`<h2>${p.title}</h2><div class="problem-statement">${p.statement}</div><hr><p><strong>${currentLang==='en'?'Answer':'คำตอบ'}: ${s.answer}</strong></p><div class="solution-statement">${solutions.en[i].steps.replace(/(\r\n|\n|\r)/gm," ")}</div>`; solutionList.appendChild(d);}); renderMath();};
    const setLanguage = (l) => { currentLang=l; document.getElementById('login-title').textContent=l==='en'?'Mathematics Exam':'แบบทดสอบคณิตศาสตร์'; document.getElementById('login-subtitle').textContent=l==='en'?'Mock Test':'ข้อสอบจำลอง'; loginStuff.usernameInput.placeholder=l==='en'?'Username':'ชื่อผู้ใช้'; loginStuff.passwordInput.placeholder=l==='en'?'Password':'รหัสผ่าน'; loginStuff.loginBtn.textContent=l==='en'?'Login':'เข้าสู่ระบบ'; document.getElementById('test-title').textContent=l==='en'?'Mathematics Exam':'แบบทดสอบคณิตศาสตร์'; document.getElementById('timer-label').textContent=l==='en'?'Time Left:':'เวลาที่เหลือ:'; document.getElementById('submit-btn').textContent=l==='en'?'Submit':'ส่งคำตอบ'; document.getElementById('solution-title').textContent=l==='en'?'Results & Solutions':'ผลลัพธ์และเฉลย'; document.getElementById('back-to-login-btn').textContent=l==='en'?'Back to Login':'กลับไปหน้าล็อคอิน'; if(screens.test.classList.contains('active'))renderProblems(); if(screens.solution.classList.contains('active')){if(lastScore!==null)displayScore(lastScore); renderSolutions();}};
    const toggleLanguage = () => { setLanguage(currentLang === 'en' ? 'th' : 'en'); };
    submitBtn.addEventListener('click',()=>{if(confirm(currentLang==='en'?'Are you sure you want to submit?':'คุณแน่ใจหรือไม่ว่าต้องการส่งคำตอบ?')){submitTest();}});
    backToLoginBtn.addEventListener('click',()=>{loginStuff.usernameInput.value=''; loginStuff.passwordInput.value=''; scoreDisplay.textContent=''; lastScore=null; showScreen('login');});
    langToggles.forEach(b=>b.addEventListener('click',toggleLanguage));
    setLanguage('en');
});
