/* docs/quiz.js
   Quiz engine: loads a quiz.json from the current topic folder (relative), renders a polished modal UI,
   shuffles questions (if enabled), calculates score, shows pass/fail (80%), and provides retake/exit.
*/
(function(){
  'use strict';

  // Utility: shuffle array in place
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create modal container
  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'vvsk-quiz-overlay';
    overlay.innerHTML = `
      <style>
        #vvsk-quiz-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999}
        #vvsk-quiz{background:#fff;border-radius:8px;max-width:820px;width:96%;box-shadow:0 10px 30px rgba(0,0,0,0.3);overflow:hidden;font-family:Arial,Helvetica,sans-serif}
        #vvsk-quiz header{padding:18px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
        #vvsk-quiz .body{padding:18px 20px;max-height:64vh;overflow:auto}
        #vvsk-quiz .footer{padding:12px 20px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
        .vvsk-q-title{font-size:18px;margin:0 0 8px}
        .vvsk-progress{font-size:13px;color:#666}
        .vvsk-options{margin-top:12px}
        .vvsk-option{display:block;padding:10px 12px;border:1px solid #e6e6e6;border-radius:6px;margin-bottom:8px;cursor:pointer}
        .vvsk-option input{margin-right:8px}
        .vvsk-btn{background:#0078d4;color:#fff;padding:10px 14px;border-radius:6px;border:none;cursor:pointer}
        .vvsk-btn.secondary{background:#f3f3f3;color:#222}
        .vvsk-result-pass{color:green;font-weight:700}
        .vvsk-result-fail{color:#c0392b;font-weight:700}
      </style>
      <div id="vvsk-quiz" role="dialog" aria-modal="true" aria-labelledby="vvsk-title">
        <header>
          <div><strong id="vvsk-title">Quiz</strong></div>
          <div class="vvsk-progress" id="vvsk-progress">0 / 0</div>
        </header>
        <div class="body" id="vvsk-body">
          <!-- question content injected here -->
        </div>
        <div class="footer">
          <div>
            <button class="vvsk-btn secondary" id="vvsk-prev">Previous</button>
            <button class="vvsk-btn secondary" id="vvsk-next">Next</button>
          </div>
          <div>
            <button class="vvsk-btn" id="vvsk-submit">Submit</button>
          </div>
        </div>
      </div>
    `;
    return overlay;
  }

  function loadQuiz(url, opts) {
    return fetch(url, {cache: 'no-store'}).then(r=>{ if(!r.ok) throw new Error('Failed to load quiz.json'); return r.json(); });
  }

  function renderQuizModal(quiz){
    let questions = quiz.questions.slice();
    if (quiz.shuffleQuestions) {
      questions = shuffle(questions);
    }
    // For each question, optionally shuffle options
    questions = questions.map(q => ({...q, options: shuffle(q.options.slice())}));

    const overlay = createModal();
    document.body.appendChild(overlay);

    const body = document.getElementById('vvsk-body');
    const progressEl = document.getElementById('vvsk-progress');
    const titleEl = document.getElementById('vvsk-title');
    titleEl.textContent = quiz.title || 'Quiz';

    let current = 0;
    const state = { answers: Array(questions.length).fill(null) };

    function updateProgress(){ progressEl.textContent = `${current+1} / ${questions.length}`; }

    function renderQuestion(index){
      const q = questions[index];
      body.innerHTML = '';
      const qt = document.createElement('div');
      qt.innerHTML = `<h3 class="vvsk-q-title">${index+1}. ${q.question}</h3>`;
      const opts = document.createElement('div'); opts.className = 'vvsk-options';
      const name = 'vvsk-q-' + index;
      if (q.type === 'multiple'){
        q.options.forEach(opt => {
          const el = document.createElement('label'); el.className = 'vvsk-option';
          el.innerHTML = `<input type="checkbox" value="${opt.id}" /> <span>${opt.text}</span>`;
          opts.appendChild(el);
        });
      } else {
        q.options.forEach(opt => {
          const el = document.createElement('label'); el.className = 'vvsk-option';
          el.innerHTML = `<input type="radio" name="${name}" value="${opt.id}" /> <span>${opt.text}</span>`;
          opts.appendChild(el);
        });
      }
      qt.appendChild(opts);
      if (q.explanation) {
        const exp = document.createElement('div'); exp.style.marginTop='12px'; exp.style.color='#444'; exp.innerHTML = `<small>${q.explanation}</small>`; qt.appendChild(exp);
      }
      body.appendChild(qt);

      // restore previous selection
      const prev = state.answers[index];
      if (prev) {
        if (q.type === 'multiple'){
          const inputs = opts.querySelectorAll('input[type=checkbox]');
          inputs.forEach(inp => { if (prev.includes(inp.value)) inp.checked = true; });
        } else {
          const inputs = opts.querySelectorAll('input[type=radio]');
          inputs.forEach(inp => { if (prev[0] === inp.value) inp.checked = true; });
        }
      }

      updateProgress();
    }

    function collectAnswer(index){
      const q = questions[index];
      const container = body.querySelector('.vvsk-options');
      if (!container) return null;
      if (q.type === 'multiple'){
        const vals = Array.from(container.querySelectorAll('input[type=checkbox]:checked')).map(i=>i.value);
        return vals.length ? vals : null;
      } else {
        const v = container.querySelector('input[type=radio]:checked');
        return v ? [v.value] : null;
      }
    }

    function goto(index){
      if (index < 0 || index >= questions.length) return;
      // save current
      if (body.querySelector('.vvsk-options')) {
        state.answers[current] = collectAnswer(current);
      }
      current = index;
      renderQuestion(current);
    }

    function computeScore(){
      // ensure last saved
      state.answers[current] = collectAnswer(current);
      let correct = 0;
      questions.forEach((q, idx) => {
        const got = state.answers[idx] || [];
        const want = q.correctOptions || [];
        // compare sets
        const setA = new Set(got);
        const setB = new Set(want);
        if (setA.size === setB.size && [...setA].every(x=>setB.has(x))) correct++;
      });
      const percent = Math.round((correct / questions.length) * 100);
      return {correct, total: questions.length, percent};
    }

    // button hooks
    const btnPrev = document.getElementById('vvsk-prev');
    const btnNext = document.getElementById('vvsk-next');
    const btnSubmit = document.getElementById('vvsk-submit');

    btnPrev.addEventListener('click', ()=>{ if (current>0) goto(current-1); });
    btnNext.addEventListener('click', ()=>{ if (current<questions.length-1) goto(current+1); });

    function showResults(result){
      const passed = result.percent >= 80;
      body.innerHTML = `<div style="padding:12px"><h2>Result</h2><p>Score: <strong>${result.percent}%</strong> (${result.correct}/${result.total})</p><p class="${passed? 'vvsk-result-pass':'vvsk-result-fail'}">${passed? 'Passed':'Failed'}</p></div>`;
      // footer buttons: Retake / Exit
      btnPrev.style.display='none'; btnNext.style.display='none'; btnSubmit.style.display='inline-block';
      btnSubmit.textContent = 'Retake'; btnSubmit.classList.remove('vvsk-btn'); btnSubmit.classList.add('vvsk-btn');
      // change action
      btnSubmit.onclick = ()=>{
        // reset state and optionally reshuffle
        state.answers = Array(questions.length).fill(null);
        if (quiz.shuffleQuestions) {
          questions = shuffle(questions.map(q=>({...q, options: shuffle(q.options)})));
        }
        current = 0; renderQuestion(current);
        // restore buttons
        btnPrev.style.display='inline-block'; btnNext.style.display='inline-block'; btnSubmit.textContent='Submit';
        btnSubmit.onclick = submitHandler;
      };
      // add an Exit control
      const exit = document.createElement('button'); exit.className='vvsk-btn secondary'; exit.textContent='Close'; exit.style.marginLeft='12px';
      exit.onclick = closeModal;
      document.querySelector('#vvsk-quiz .footer div:last-child').appendChild(exit);
    }

    function submitHandler(){
      const res = computeScore();
      showResults(res);
    }

    btnSubmit.onclick = submitHandler;

    function closeModal(){
      overlay.remove();
    }

    // Allow ESC to close
    overlay.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

    goto(0);
  }

  // Attach click listeners to data-quiz elements (delegation)
  function init() {
    document.addEventListener('click', function(ev){
      const target = ev.target.closest('[data-quiz]');
      if (!target) return;
      ev.preventDefault();
      const quizPath = target.getAttribute('data-quiz') || 'quiz.json';
      // fetch relative to current document
      loadQuiz(quizPath).then(q=>{
        renderQuizModal(q);
      }).catch(err=>{
        alert('Failed to load quiz: ' + err.message);
      });
    }, false);
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
