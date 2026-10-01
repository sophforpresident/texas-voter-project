// Texas Voter Project — "Find Your Party" quiz (texasvoterproject.org/findyourparty)
//
// Each answer scores one of TVP's three audience "parties" (see the Three Parties
// framing in the marketing copy bank). The contact form is a Netlify Form named
// "find-your-party"; a Zap picks up each submission and creates/updates the
// Qomon contact, tagging them with the value in `party_tags`.
//
// To edit questions or results, change QUESTIONS / PARTIES below. Every option's
// `p` must be one of: "smarty", "after", "active".

(function () {
  var QUESTIONS = [
    {
      q: 'Your ideal Saturday starts with…',
      a: [
        { e: '☕', t: 'Coffee, a crossword, and a podcast deep-dive', p: 'smarty' },
        { e: '🥂', t: 'Brunch that accidentally turns into a day party', p: 'after' },
        { e: '🏃', t: 'A sunrise run club (and a smoothie after)', p: 'active' }
      ]
    },
    {
      q: 'Your group chat counts on you to…',
      a: [
        { e: '🔎', t: 'Fact-check everyone, with sources', p: 'smarty' },
        { e: '📍', t: 'Pick the spot and make the playlist', p: 'after' },
        { e: '📣', t: 'Get everyone off the couch and outside', p: 'active' }
      ]
    },
    {
      q: "It's Friday night. You're…",
      a: [
        { e: '🧠', t: "At trivia night, and you're winning", p: 'smarty' },
        { e: '🍸', t: 'Bar hopping on the east side', p: 'after' },
        { e: '😴', t: 'Asleep by 10. Long run tomorrow.', p: 'active' }
      ]
    },
    {
      q: 'Pick a snack:',
      a: [
        { e: '🍕', t: 'Pizza while debating the best pizza place', p: 'smarty' },
        { e: '🧀', t: 'Late-night queso, no questions asked', p: 'after' },
        { e: '🌮', t: 'Post-workout breakfast tacos', p: 'active' }
      ]
    },
    {
      q: 'When someone says "election season," you…',
      a: [
        { e: '📊', t: 'Open a spreadsheet of every race on your ballot', p: 'smarty' },
        { e: '🎉', t: 'Ask where the watch party is', p: 'after' },
        { e: '🚲', t: 'Check if you can bike to your polling place', p: 'active' }
      ]
    },
    {
      q: 'Your Texas bucket list includes…',
      a: [
        { e: '📚', t: 'Every indie bookstore and library in the state', p: 'smarty' },
        { e: '🎸', t: 'A live music night at every dive bar in town', p: 'after' },
        { e: '🥾', t: 'Hiking every state park you can drive to', p: 'active' }
      ]
    }
  ];

  var PARTIES = {
    smarty: {
      name: 'The Smarty Party',
      tag: 'Smarty Party',
      cls: 'party-smarty',
      blurb: "You read the whole ballot, all the way to the bottom. You love a good debate, a better trivia question, and knowing exactly who's running for what. Your vote is informed and you want your friends' to be too.",
      events: [
        { n: 'Diners, Dives & VR Drives', d: 'Voter registration trivia nights at bars and restaurants.' },
        { n: 'Pinot, Pizza & Politics', d: 'Pizza, BYOB, and everyone becomes the expert on one race.' },
        { n: "Don't Talk About Politics", d: 'Board game nights where candidates and voters meet as equals.' }
      ]
    },
    after: {
      name: 'The After Party',
      tag: 'After Party',
      cls: 'party-after',
      blurb: "You're the reason everyone shows up. Voting is better with friends, a playlist, and a drink in hand afterward, and you know that showing up together is how turnout actually happens.",
      events: [
        { n: 'Voter Fest (Sat, Oct 24)', d: 'Our early voting kickoff: DJs, breakfast tacos, and a party steps from the polls.' },
        { n: 'Race to the Polls Bar Crawl', d: 'An East Austin bar crawl during early voting.' },
        { n: 'NVED Happy Hour Guide', d: 'Where to celebrate after you cast your ballot.' }
      ]
    },
    active: {
      name: 'The Active Party',
      tag: 'Active Party',
      cls: 'party-active',
      blurb: "You'd rather run to the polls than drive. You find your people at run club, on the trail, or in a class at 6am, and you think civic life should feel as energizing as a good workout.",
      events: [
        { n: 'Run to the Polls', d: 'A national Strava challenge routing your miles toward Election Day.' },
        { n: 'Barriers to Voting Obstacle Course', d: 'A fitness challenge built around the real barriers to voting.' },
        { n: 'Pups to the Polls', d: 'Bring the dog. We dog-sit while you vote.' }
      ]
    }
  };

  var SPLIT = {
    name: 'The Split Ticket',
    cls: 'party-split',
    blurb: "You contain multitudes. Spreadsheet freak at 4pm, dance floor at midnight, trail run at 6am. Just like splitting your ballot, you get to choose, and every one of our events is open to you."
  };

  var answers = new Array(QUESTIONS.length);
  var stepsEl = document.getElementById('quiz-steps');
  var bar = document.getElementById('quiz-progress-bar');
  var questionsWrap = document.getElementById('quiz-questions');
  var gate = document.getElementById('quiz-gate');
  var resultEl = document.getElementById('quiz-result');
  var form = document.getElementById('party-form');
  var current = 0;
  var lastResult = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Build question steps
  QUESTIONS.forEach(function (item, i) {
    var step = document.createElement('div');
    step.className = 'quiz-step';
    step.setAttribute('data-step', i);
    var html = '<div class="quiz-count">Question ' + (i + 1) + ' of ' + QUESTIONS.length + '</div>' +
      '<h2 class="tvp-h quiz-q">' + esc(item.q) + '</h2><div class="quiz-options">';
    item.a.forEach(function (opt, j) {
      html += '<button type="button" class="quiz-option" data-q="' + i + '" data-a="' + j + '">' +
        '<span class="emoji" aria-hidden="true">' + opt.e + '</span>' + esc(opt.t) + '</button>';
    });
    html += '</div>';
    if (i > 0) html += '<button type="button" class="quiz-back" data-back="1">← Back</button>';
    step.innerHTML = html;
    stepsEl.appendChild(step);
  });

  function show(i) {
    current = i;
    var steps = stepsEl.querySelectorAll('.quiz-step');
    steps.forEach(function (s) { s.classList.remove('active'); });
    gate.classList.remove('active');
    resultEl.classList.remove('active');
    if (i < QUESTIONS.length) {
      questionsWrap.style.display = '';
      steps[i].classList.add('active');
      steps[i].querySelectorAll('.quiz-option').forEach(function (b) {
        b.classList.toggle('picked', answers[i] === +b.getAttribute('data-a'));
      });
    } else {
      gate.classList.add('active');
    }
    bar.style.width = Math.round((Math.min(i, QUESTIONS.length) / QUESTIONS.length) * 100) + '%';
  }

  stepsEl.addEventListener('click', function (e) {
    var opt = e.target.closest('.quiz-option');
    if (opt) {
      answers[+opt.getAttribute('data-q')] = +opt.getAttribute('data-a');
      opt.classList.add('picked');
      setTimeout(function () { show(current + 1); }, 180);
      return;
    }
    if (e.target.closest('[data-back]')) show(current - 1);
  });

  document.getElementById('gate-back').addEventListener('click', function () { show(QUESTIONS.length - 1); });

  function score() {
    var counts = { smarty: 0, after: 0, active: 0 };
    answers.forEach(function (aIdx, qIdx) {
      if (aIdx == null) return;
      counts[QUESTIONS[qIdx].a[aIdx].p]++;
    });
    var max = Math.max(counts.smarty, counts.after, counts.active);
    var top = Object.keys(counts).filter(function (k) { return counts[k] === max; });
    return { counts: counts, top: top };
  }

  function renderResult(r) {
    var card = document.getElementById('result-card');
    var evEl = document.getElementById('result-events');
    var isSplit = r.top.length > 1;
    var info = isSplit ? SPLIT : PARTIES[r.top[0]];
    card.className = 'result-card ' + info.cls;
    document.getElementById('result-name').textContent = info.name;
    document.getElementById('result-blurb').textContent = info.blurb;
    var events = [];
    r.top.forEach(function (k) {
      var list = PARTIES[k].events;
      (isSplit ? list.slice(0, 2) : list).forEach(function (ev) { events.push(ev); });
    });
    evEl.innerHTML = '<div class="tvp-label" style="font-size:13px; margin-bottom:2px;">Your kind of events</div>' +
      events.map(function (ev) {
        return '<div class="result-event"><strong>' + esc(ev.n) + '</strong><span>' + esc(ev.d) + '</span></div>';
      }).join('');
  }

  function encode(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = document.getElementById('gate-error');
    err.textContent = '';
    var required = ['first_name', 'last_name', 'email', 'birthday', 'zip'];
    for (var i = 0; i < required.length; i++) {
      var el = form.elements[required[i]];
      if (!el.value.trim()) { err.textContent = 'Please fill in every field except mobile number.'; el.focus(); return; }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.elements.email.value.trim())) {
      err.textContent = 'That email address doesn’t look quite right.'; form.elements.email.focus(); return;
    }
    if (!/^\d{5}(-\d{4})?$/.test(form.elements.zip.value.trim())) {
      err.textContent = 'Please enter a 5-digit ZIP code.'; form.elements.zip.focus(); return;
    }

    var r = score();
    lastResult = r;
    var isSplit = r.top.length > 1;
    document.getElementById('f-party').value = isSplit ? SPLIT.name : PARTIES[r.top[0]].name;
    document.getElementById('f-party-tags').value = r.top.map(function (k) { return PARTIES[k].tag; }).join(', ');
    document.getElementById('f-answers').value = answers.map(function (aIdx, qIdx) {
      return QUESTIONS[qIdx].q + ' ' + QUESTIONS[qIdx].a[aIdx].t;
    }).join(' | ');

    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox') { data[el.name] = el.checked ? 'yes' : 'no'; return; }
      data[el.name] = el.value;
    });

    var btn = document.getElementById('gate-submit');
    btn.disabled = true;
    btn.textContent = 'Counting the votes…';

    function reveal() {
      btn.disabled = false;
      btn.textContent = 'Reveal My Party';
      renderResult(r);
      questionsWrap.style.display = 'none';
      gate.classList.remove('active');
      resultEl.classList.add('active');
      bar.style.width = '100%';
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(data)
    }).then(reveal, reveal); // never block the reveal on a network hiccup
  });

  document.getElementById('retake').addEventListener('click', function () {
    for (var i = 0; i < answers.length; i++) answers[i] = undefined;
    show(0);
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('share-btn').addEventListener('click', function () {
    var url = 'https://texasvoterproject.org/findyourparty';
    var name = lastResult && lastResult.top.length === 1 ? PARTIES[lastResult.top[0]].name : SPLIT.name;
    var text = "I got " + name + "! Which party are you already at?";
    var btn = this;
    if (navigator.share) {
      navigator.share({ title: 'Find Your Party', text: text, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' ' + url).then(function () {
        btn.textContent = 'Link Copied!';
        setTimeout(function () { btn.textContent = 'Share the Quiz'; }, 2000);
      });
    }
  });

  show(0);
})();
