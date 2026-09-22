// Know Your Ballot — office data + card rendering
const KYB_OFFICES = [
  // EXECUTIVE
  { id:'gov', category:'exec', title:'Governor', back:'Signs or vetoes bills (including line-item vetoes on the budget), appoints hundreds of board and commission members, can call special legislative sessions, and serves as commander-in-chief of the state’s military forces.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'Gubernatorial appointees across state agencies and boards — not the other independently elected executives', caveat:'Because Texas’s other top executives are elected separately, the Governor can’t fire the Attorney General, Comptroller, or any Railroad Commissioner — but the Governor does appoint other powerful offices people often assume answer to someone else. Example: the Commissioner of Education, who runs the Texas Education Agency (TEA) day to day, is appointed by the Governor, not by the elected State Board of Education you might expect to be in charge. And legislatively, the single most powerful office in Texas isn’t the Governor at all — it’s the Lieutenant Governor.' },
  { id:'ltgov', category:'exec', title:'Lieutenant Governor', back:'Presides over the Texas Senate, assigns bills to committees, appoints every committee chair, controls the Senate’s calendar, and casts tie-breaking votes. First in line to become Governor.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'No state agencies — controls the Senate’s legislative process', caveat:'Elected completely separately from the Governor, on a separate ballot line — they aren’t a ticket, and in theory could be political rivals.' },
  { id:'ag', category:'exec', title:'Attorney General', back:'Defends Texas in court, issues formal legal opinions for state agencies, runs one of the largest child-support-enforcement programs in the country, and enforces consumer-protection law.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'Divisions of the Office of the Attorney General', caveat:'Not "the Governor’s lawyer" — independently elected. AG opinions are legal guidance, not binding court rulings.' },
  { id:'comptroller', category:'exec', title:'Comptroller of Public Accounts', back:'Collects state taxes, manages state investments, and must certify that the legislature’s budget doesn’t spend more than the state will actually take in — a uniquely powerful check on the Legislature.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'Comptroller’s agency and staff', caveat:'Texas eliminated a separate elected State Treasurer in the 1990s and folded those duties into this office.' },
  { id:'glo', category:'exec', title:'Land Commissioner', back:'Leases state land and mineral rights to help fund public schools through the Permanent School Fund, runs low-interest loan programs for veterans, manages coastal resources, and oversees the Alamo. Formally the Commissioner of the General Land Office.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'General Land Office staff and programs', caveat:'Functions more like a major asset manager for public education funding than a records office.' },
  { id:'agcom', category:'exec', title:'Agriculture Commissioner', back:'Inspects gas pumps and grocery scales for accuracy, regulates pesticide use, administers the school lunch program statewide, and promotes Texas agricultural products.', term:'4 years, no term limit', reportsTo:'Voters statewide', oversees:'Department of Agriculture', caveat:'Its consumer-facing reach — the sticker on a gas pump, the food on a school lunch tray — surprises a lot of people.' },
  { id:'rrc', category:'exec', title:'Railroad Commissioner', back:'Three commissioners, elected on staggered terms, regulate oil and gas drilling and production, pipeline safety, natural gas utilities, and coal and uranium mining.', term:'6 years, staggered — one of the three seats up roughly every two years', reportsTo:'Voters statewide', oversees:'Oil and gas industry compliance statewide', caveat:'The name is an 1891 holdover — the agency stopped regulating railroads decades ago (that’s now federal). It’s the most commonly misunderstood office name in Texas government.' },
  { id:'sos', category:'exec', appointed:true, title:'Secretary of State', back:'Oversees statewide election administration and guidance to county election officials, commissions notaries public, maintains the state seal and archives, and processes business filings.', term:'No fixed term — serves at the Governor’s pleasure, confirmed by the Senate', reportsTo:'The Governor (appointed, not elected)', oversees:'Elections Division and other Secretary of State staff', caveat:'Unlike most states, Texans don’t vote for this office directly — worth knowing since it’s the one most central to how elections are actually run.' },
  { id:'tea', category:'exec', appointed:true, title:'Education Commissioner', back:'Leads the Texas Education Agency (TEA) day to day — sets school accountability ratings, distributes state funding to districts, and can step in to take over a failing district. Appointed by the Governor, confirmed by the Senate.', term:'No fixed term — serves at the Governor’s pleasure, confirmed by the Senate', reportsTo:'The Governor (appointed, not elected)', oversees:'The Texas Education Agency (TEA) — accountability, school funding distribution, and district oversight statewide', caveat:'Easy to assume this answers to the elected State Board of Education — it doesn’t. The Board sets curriculum standards; this office runs the agency that actually administers schools day to day.' },
  { id:'inscom', category:'exec', appointed:true, title:'Insurance Commissioner', back:'Regulates the entire Texas insurance industry — licenses insurers and agents, reviews rate filings, investigates fraud and complaints, and runs the State Fire Marshal’s Office.', term:'Statutory 2-year term, but reappointed at the Governor’s discretion in practice', reportsTo:'The Governor (appointed, not elected)', oversees:'Texas Department of Insurance (TDI) staff and the State Fire Marshal’s Office', caveat:'A separate Governor appointee — the Commissioner of Workers’ Compensation — handles workplace injury claims. Even though that office sits inside the same agency, it isn’t this Commissioner’s job.' },
  { id:'wccom', category:'exec', appointed:true, title:'Workers’ Compensation Commissioner', back:'Regulates how injured workers are compensated — sets medical fee guidelines and resolves disputes between injured employees, employers, and insurance carriers.', term:'Statutory 2-year term, reappointed at the Governor’s discretion', reportsTo:'The Governor (appointed, not elected)', oversees:'Texas Department of Insurance, Division of Workers’ Compensation (TDI-DWC)', caveat:'Technically a division inside the Department of Insurance, but this Commissioner is a separate, independently Senate-confirmed Governor appointee — not part of the Insurance Commissioner’s chain of command.' },
  { id:'hhscom', category:'exec', appointed:true, title:'Health & Human Services Commissioner', back:'Runs the largest state agency in Texas by budget and staff — Medicaid and CHIP, mental health and state hospitals, nursing home regulation, disability services, and SNAP/TANF benefits.', term:'Statutory 2-year term, reappointed at the Governor’s discretion', reportsTo:'The Governor (appointed, not elected)', oversees:'The Texas Health and Human Services Commission (HHSC) — 30,000+ employees statewide', caveat:'Officially the "Executive Commissioner." Arguably the single most consequential appointed job in Texas government by budget and headcount — not a narrow regulatory post.' },
  { id:'dfpscom', category:'exec', appointed:true, title:'Family & Protective Services Commissioner', back:'Oversees Child Protective Services investigations and foster care, plus Adult Protective Services investigations into abuse or neglect of elderly and disabled adults.', term:'Statutory 2-year term, reappointed at the Governor’s discretion', reportsTo:'The Governor (appointed, not elected)', oversees:'Texas Department of Family and Protective Services (DFPS) — roughly 12,000 caseworkers and staff statewide', caveat:'An advisory council exists alongside this office, but it only offers guidance — it doesn’t govern the agency or choose the Commissioner the way some other Texas boards do.' },

  // JUDICIAL
  { id:'sct', category:'judicial', title:'Texas Supreme Court Justice', back:'Nine justices hear the state’s final word on civil lawsuits — contracts, property, family law, and business disputes. Does not hear criminal cases.', term:'6 years, staggered', reportsTo:'Voters statewide', oversees:'Sets rules for how state courts operate; hears final civil appeals', caveat:'Many justices first reach the bench through a governor’s appointment to fill a vacancy, then have to win election to keep the seat.' },
  { id:'cca', category:'judicial', title:'Court of Criminal Appeals Judge', back:'Nine judges hear the state’s final word on criminal cases, including mandatory review of every death sentence.', term:'6 years, staggered', reportsTo:'Voters statewide', oversees:'Final criminal appeals statewide', caveat:'Constantly confused with the Supreme Court — remember the split: Supreme Court = civil, Court of Criminal Appeals = criminal. Only Texas and Oklahoma divide their top courts this way.' },
  { id:'coa', category:'judicial', title:'Courts of Appeals Justice', back:'Fourteen regional courts hear appeals from trial courts in both civil and criminal cases within their district. A new 15th, statewide court (seated since Sept. 2024) handles state-agency appeals and high-dollar business disputes only.', term:'6 years, staggered', reportsTo:'Voters in their district (statewide for the 15th court)', oversees:'Reviews trial-court rulings; sends further appeals up to the Supreme Court or Court of Criminal Appeals', caveat:'Recently changed — for decades there were 14 of these courts; a 15th, statewide court joined in 2024. Its first contested election is in 2026.' },

  // LEGISLATIVE
  { id:'sen', category:'legislative', title:'State Senator', back:'One of 31 members of the Texas Senate. Writes, debates, and votes on state law and the state budget, and confirms many gubernatorial appointments.', term:'4 years, staggered — except right after redistricting, when all 31 seats are up at once', reportsTo:'Voters in their district', oversees:'N/A — legislative role, not administrative', caveat:'After 2023 redistricting, all 31 senators drew lots for a 2-year or 4-year term just to reset the staggered schedule.' },
  { id:'rep', category:'legislative', title:'State Representative', back:'One of 150 members of the Texas House. Writes, debates, and votes on state law and the state budget, representing the smallest legislative districts in state government.', term:'2 years — all 150 seats up every election', reportsTo:'Voters in their district', oversees:'N/A — legislative role, not administrative', caveat:'Because every seat is up every two years, the House tends to turn over faster than the Senate.' },
  { id:'speaker', category:'legislative', title:'Speaker of the House', back:'Chosen by fellow House members from among themselves at the start of each session. Assigns bills to committees, appoints committee chairs, and controls the House calendar. Third in line to become Governor.', term:'Chosen each 2-year session', reportsTo:'Fellow House members who elected them', oversees:'The House’s legislative process', caveat:'You don’t vote for the Speaker on your ballot — you vote for your own State Representative, and representatives choose the Speaker among themselves.' },

  // EDUCATION
  { id:'sboe', category:'education', title:'State Board of Education Member', back:'Approves the state’s curriculum standards (the TEKS) and instructional materials, and oversees investment of the Permanent School Fund, which helps fund public education statewide.', term:'4 years, staggered, elected by district', reportsTo:'Voters in their district', oversees:'Curriculum standards and instructional materials statewide', caveat:'The Board’s Chair isn’t chosen by its own members — the Governor appoints the Chair from among the 15 elected members every two years, confirmed by the Senate. Also worth knowing: day-to-day school administration — accountability ratings, funding decisions, even taking over failing districts — is run by the Texas Education Agency (TEA), led by a Commissioner of Education the Governor appoints. This board doesn’t oversee TEA.' },

  // LOCAL
  { id:'cjudge', category:'local', title:'County Judge', back:'Presides over the Commissioners Court, often serves as the county’s chief budget and emergency-management officer, and in some counties also hears misdemeanor or probate cases.', term:'4 years', reportsTo:'Voters countywide', oversees:'Varies by county — from mostly administrative to also judicial', caveat:'Doesn’t have to be a lawyer — the constitution only requires being "well informed in the law of the state." In many counties, this is really a chief administrator role.' },
  { id:'ccomm', category:'local', title:'County Commissioner', back:'Sits on the Commissioners Court, helps set the county budget and property tax rate, and oversees roads and infrastructure within their own precinct.', term:'4 years, staggered by precinct', reportsTo:'Voters in their precinct', oversees:'Roads, bridges, and county services in their precinct', caveat:'' },
  { id:'sheriff', category:'local', title:'Sheriff', back:'Runs the county jail, provides courthouse security, and is often the primary police presence in unincorporated parts of the county, outside city police jurisdiction.', term:'4 years', reportsTo:'Voters countywide', oversees:'County jail and sheriff’s office deputies', caveat:'' },
  { id:'da', category:'local', title:'District / County Attorney', back:'The District Attorney typically prosecutes felonies; the County Attorney typically prosecutes misdemeanors and advises the county on civil matters.', term:'4 years', reportsTo:'Voters (district or countywide, depending on the office)', oversees:'Prosecutors and staff in their office', caveat:'This split isn’t uniform — some counties combine both jobs into a single "Criminal District Attorney."' },
  { id:'distjudge', category:'local', title:'District Judge', back:'Hears felony criminal cases, major civil lawsuits, and family or juvenile law matters at the trial-court level.', term:'4 years', reportsTo:'Voters in their district', oversees:'Their own courtroom and staff', caveat:'Don’t confuse with appellate "Justices," who serve longer, 6-year terms and don’t hold trials.' },
  { id:'clerk', category:'local', title:'County Clerk', back:'Maintains vital records (birth, death, marriage), property records, court filings, and assumed-name ("DBA") registrations. In some counties, also administers voter registration and elections.', term:'4 years', reportsTo:'Voters countywide', oversees:'County records office', caveat:'' },
  { id:'tac', category:'local', title:'County Tax Assessor-Collector', back:'Collects property taxes on behalf of local taxing entities and processes vehicle title and registration. In many counties, also runs voter registration.', term:'4 years', reportsTo:'Voters countywide', oversees:'Tax office staff', caveat:'Who actually runs voter registration in your county varies — it might be this office, the County Clerk, or a separate appointed Elections Administrator. There’s no single statewide answer, which is exactly the kind of local detail this project exists to help you find.' },
  { id:'jp', category:'local', title:'Justice of the Peace', back:'Hears small claims and debt disputes up to $20,000, evictions, and Class C misdemeanors (fine-only offenses, no jail time), plus magistrate duties like issuing warrants and setting bail.', term:'4 years', reportsTo:'Voters in their precinct', oversees:'Their own JP court', caveat:'No law degree required — and this is likely the court venue most Texans actually encounter in person.' },
  { id:'constable', category:'local', title:'Constable', back:'Serves civil court papers and warrants, provides bailiff service for Justice of the Peace courts, and in many counties also patrols.', term:'4 years', reportsTo:'Voters in their precinct', oversees:'Constable’s office deputies', caveat:'Elected by precinct, but their authority to serve civil process can extend countywide, and sometimes statewide.' },
  { id:'trustee', category:'local', title:'School Board Trustee', back:'Hires and evaluates the superintendent, sets the district’s budget and local tax rate, and sets district-wide policy.', term:'Locally set — 3 or 4 years, decided by each district’s board', reportsTo:'Voters in the school district', oversees:'The superintendent, who runs day-to-day district operations', caveat:'The only office on this page where the term length genuinely isn’t the same everywhere in Texas — each district chooses.' },

  // FEDERAL
  { id:'ussen', category:'federal', title:'U.S. Senator', back:'Votes on federal legislation, treaties, and the federal budget, and confirms federal judges, Cabinet officials, and Supreme Court justices. Texas elects two, on staggered schedules.', term:'6 years, staggered — Texas’s two seats are never up in the same election', reportsTo:'Voters statewide (serves in Washington, D.C., not Austin)', oversees:'N/A — legislative role; helps confirm federal appointees', caveat:'Represents Texas, but doesn’t vote on Texas state law at all — that’s the state Legislature’s job, in Austin. A U.S. Senator’s actual workplace is the Capitol in Washington, D.C.' },
  { id:'usrep', category:'federal', title:'U.S. Representative', back:'Votes on federal legislation and the federal budget as one of 435 members nationwide. Texas currently has 38 U.S. House districts — more than any state but California.', term:'2 years — all seats up every election', reportsTo:'Voters in their district', oversees:'N/A — legislative role', caveat:'Also based in Washington, D.C. for most of the legislative calendar. The federal laws they help pass apply across the whole country — not just to their district, and not just to Texas.' },
  { id:'president', category:'federal', title:'President of the United States', back:'Appoints Cabinet secretaries, federal judges, and Supreme Court justices (with Senate confirmation), directs foreign policy, and serves as commander-in-chief of the armed forces. Can sign or veto federal legislation — but doesn’t write it.', term:'4 years, limited to 2 elected terms', reportsTo:'Voters nationwide, through the Electoral College', oversees:'Federal executive agencies and departments; the U.S. armed forces', caveat:'A common misconception: presidents don’t "pass laws." Congress writes and passes federal law — the President’s real power is in appointments, foreign affairs, and enforcement, not lawmaking.' },
];

const KYB_CATEGORIES = [
  { id:'exec', name:'Statewide Executive — the "Plural Executive"', color:'var(--red)', blurb:'Seven separately elected jobs, none of them the Governor’s employees — plus six powerful appointed offices (dashed cards) the Governor names directly, no board in between. Voting for Governor is, in that sense, also an endorsement of who fills those six other jobs.' },
  { id:'legislative', name:'Statewide Legislative', color:'var(--green)', blurb:'The 181 people who write Texas law and the state budget — plus the two roles that run each chamber.' },
  { id:'judicial', name:'Statewide Judicial', color:'var(--teal)', blurb:'Texas is one of only two states with separate top courts for civil and criminal cases.' },
  { id:'education', name:'Education', color:'#C99A1D', blurb:'The elected board that sets what Texas public schools teach and how the Permanent School Fund is invested.' },
  { id:'local', name:'Local & County', color:'var(--pink)', blurb:'The offices most Texans interact with directly — and where the details vary most from county to county.' },
  { id:'federal', name:'Federal Offices — Elected Here, Serve in D.C.', color:'#5C4B87', blurb:'Texans elect these offices, but the job happens in Washington — and the laws and decisions that come out of them apply to the whole country, not just to Texas.' },
];

(function () {
  const legendEl = document.getElementById('kyb-legend');
  const catsEl = document.getElementById('kyb-categories');
  if (!legendEl || !catsEl) return;

  const catById = Object.fromEntries(KYB_CATEGORIES.map((c) => [c.id, c]));

  // Legend
  legendEl.innerHTML = KYB_CATEGORIES.map((c) => `
    <span class="kyb-legend-item">
      <span class="kyb-legend-dot" style="background:${c.color};"></span>
      ${c.name.split(' —')[0]}
    </span>
  `).join('');

  // Category sections with flip cards
  catsEl.innerHTML = KYB_CATEGORIES.map((cat) => {
    const offices = KYB_OFFICES.filter((o) => o.category === cat.id);
    const cards = offices.map((o) => {
      const appointed = !!o.appointed;
      const label = cat.name.split(' —')[0] + (appointed ? ' · Appointed' : '');
      const frontStyle = appointed
        ? `background:#FFFFFF; border:2px dashed ${cat.color}; color:${cat.color};`
        : `background:${cat.color}; border:none; color:#F8F1E4;`;
      return `
        <div class="kyb-card-scene">
          <div class="kyb-card-inner" data-office="${o.id}">
            <div class="kyb-card-face kyb-card-front" style="${frontStyle}">
              <div class="kyb-card-eyebrow">${label}</div>
              <div class="kyb-card-title">${o.title}</div>
              <div class="kyb-card-hint">tap to flip</div>
            </div>
            <div class="kyb-card-face kyb-card-back" style="border-top:${appointed ? '3px dashed ' + cat.color : '5px solid ' + cat.color};">
              <div>
                <div class="kyb-card-back-title">${o.title}</div>
                <p class="kyb-card-back-text">${o.back}</p>
              </div>
              <button type="button" class="kyb-learn-more" style="color:${cat.color};" data-office="${o.id}">Learn more →</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="kyb-cat-section">
        <div class="kyb-cat-heading">
          <span class="kyb-cat-swatch" style="background:${cat.color};"></span>
          <h2 class="tvp-h kyb-cat-title">${cat.name}</h2>
        </div>
        <p class="kyb-cat-blurb">${cat.blurb}</p>
        <div class="kyb-card-grid">${cards}</div>
      </div>
    `;
  }).join('');

  // Flip handling (click the card face toggles flip, unless clicking "Learn more")
  catsEl.addEventListener('click', (e) => {
    const learnBtn = e.target.closest('.kyb-learn-more');
    if (learnBtn) {
      e.stopPropagation();
      openModal(learnBtn.dataset.office);
      return;
    }
    const inner = e.target.closest('.kyb-card-inner');
    if (inner) {
      inner.classList.toggle('is-flipped');
    }
  });

  // Modal
  const backdrop = document.getElementById('kyb-modal-backdrop');
  const modalBody = document.getElementById('kyb-modal-body');
  const closeBtn = document.getElementById('kyb-modal-close');

  function openModal(officeId) {
    const office = KYB_OFFICES.find((o) => o.id === officeId);
    if (!office) return;
    const cat = catById[office.category];
    modalBody.innerHTML = `
      <div class="kyb-modal-eyebrow" style="color:${cat.color};">${cat.name.split(' —')[0]}${office.appointed ? ' · Appointed' : ''}</div>
      <h3 class="tvp-h kyb-modal-title">${office.title}</h3>
      <p class="kyb-modal-text">${office.back}</p>
      <div class="kyb-modal-grid">
        <div class="kyb-modal-fact">
          <div class="kyb-modal-fact-label">Term length</div>
          <div class="kyb-modal-fact-value">${office.term}</div>
        </div>
        <div class="kyb-modal-fact">
          <div class="kyb-modal-fact-label">Reports to</div>
          <div class="kyb-modal-fact-value">${office.reportsTo}</div>
        </div>
        <div class="kyb-modal-fact" style="grid-column:1 / -1;">
          <div class="kyb-modal-fact-label">What reports to it</div>
          <div class="kyb-modal-fact-value">${office.oversees}</div>
        </div>
      </div>
      ${office.caveat ? `
        <div class="kyb-modal-caveat" style="border-left-color:${cat.color};">
          <div class="kyb-modal-caveat-label" style="color:${cat.color};">Worth knowing</div>
          <p class="kyb-modal-caveat-text">${office.caveat}</p>
        </div>
      ` : ''}
    `;
    backdrop.hidden = false;
  }

  function closeModal() {
    backdrop.hidden = true;
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
