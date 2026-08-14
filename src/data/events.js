const defaultRules = [
  'Participants must report at least 15 minutes before the scheduled start.',
  'Respect fellow participants, mentors and organizers; plagiarism or misconduct leads to disqualification.',
  'The decision of the judging panel will be final and binding.'
];

const defaultEvaluation = [
  ['Clarity of insight', '30%'],
  ['Technical craft', '25%'],
  ['Originality', '25%'],
  ['Communication', '20%']
];

const organizers = [
  {
    name: 'Programme Coordinator',
    role: 'Event Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    email: 'odyssey@expectations.edu',
    phone: '+91 90000 00001',
    linkedin: 'https://www.linkedin.com/'
  },
  {
    name: 'Data Society Lead',
    role: 'Student Coordinator',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'events@expectations.edu',
    phone: '+91 90000 00002',
    linkedin: 'https://www.linkedin.com/'
  }
];

const makeEvent = (data) => ({
  ...data,
  rules: data.rules || defaultRules,
  evaluation: data.evaluation || defaultEvaluation,
  organizers,
  rounds: data.rounds
});

export const eventCategories = [
  {
    slug: 'technical',
    title: 'Technical Events',
    tagline: 'Code, query and conquer.',
    summary:
      'Five technical challenges spanning interviews, SQL investigation, statistics, data science and an escape-room odyssey.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    count: 5
  },
  {
    slug: 'non-technical',
    title: 'Non Technical Events',
    tagline: 'Strategy, creativity and adventure.',
    summary:
      'Treasure hunts, live auctions and impossible pitches — three non-technical events built for teamwork and flair.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85',
    count: 3
  },
  {
    slug: 'pre-expectations',
    title: 'Pre Expectations Events',
    tagline: 'The voyage begins early.',
    summary:
      'Warm-up events and pre-fest experiences leading up to Expectations 2K26 — details announcing soon.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85',
    count: 0
  }
];

export const isEventCategory = (slug) => eventCategories.some((category) => category.slug === slug);

export const findEventCategory = (slug) => eventCategories.find((category) => category.slug === slug);

export const events = [
  makeEvent({
    slug: 'stress-interview',
    number: '01',
    group: 'technical',
    category: 'Technical',
    title: 'Stress Interview',
    tagline: 'Perform under pressure.',
    summary:
      'A technical event evaluating knowledge, problem-solving, confidence and communication in a simulated high-pressure interview environment.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Individual'],
      ['Team size', 'Solo participant'],
      ['Duration', 'One event day'],
      ['Track', 'Technical']
    ],
    about:
      'Stress Interview is designed to evaluate participants\' technical knowledge, problem-solving ability, confidence, communication skills, and ability to perform effectively under pressure in a simulated interview environment.',
    rounds: [
      [
        'Aptitude & Code Completion Qualifying Test',
        'A written qualifying test with aptitude questions and code completion tasks to assess logical reasoning, programming knowledge and code understanding. Top performers advance to Round 2.'
      ],
      [
        'Stress Interview',
        'Shortlisted participants face a one-on-one interactive session with the judging panel — navigating engaging conversations, creative scenarios and unexpected twists. Evaluates confidence, communication, analytical thinking, adaptability and presence of mind.'
      ]
    ],
    rules: [
      'Participants must report to the venue 15 minutes before the scheduled start.',
      'Participants must attend in formal attire and carry a printed copy of their updated resume.',
      'Mobile phones, smartwatches, laptops and other electronic devices are prohibited during the event.',
      'Individual participation only — no discussion or external assistance.',
      'Only participants who qualify in Round 1 proceed to the Stress Interview.',
      'Participants should be prepared to answer questions related to anything mentioned in their resume.',
      'Professional behaviour must be maintained throughout; the judging panel\'s decision is final.'
    ],
    evaluation: [
      ['Technical knowledge', '30%'],
      ['Problem-solving', '25%'],
      ['Communication', '25%'],
      ['Confidence under pressure', '20%']
    ]
  }),

  makeEvent({
    slug: 'oracles-archive',
    number: '02',
    group: 'technical',
    category: 'SQL & Analytics',
    title: "The Oracle's Archive",
    tagline: 'Investigate. Query. Uncover the truth.',
    summary:
      'A team SQL challenge where data investigators explore a corrupted archival database, clean anomalies and reconstruct the sequence of events using evidence-based reasoning.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Team challenge'],
      ['Team size', '2–3 participants'],
      ['Duration', '2.5 hours'],
      ['Track', 'SQL & Data Investigation']
    ],
    about:
      "The Oracle's Archive combines SQL programming with analytical thinking. Teams act as data investigators working with a corrupted archival database linked to a fictional incident — uncovering clues, reconstructing events and arriving at logical conclusions supported by SQL query outputs.",
    rounds: [
      [
        'Elimination Round (if required)',
        'If registrations exceed capacity, an elimination round of MCQs, puzzles or crosswords will be conducted.'
      ],
      [
        'Excavation (45 minutes)',
        'Teams receive the archival database and explore it using SQL queries. Identify missing values, duplicates, inconsistencies and suspicious patterns. Submit a Findings Sheet with all observations and supporting SQL queries.'
      ],
      [
        'The Unlocked Archive (35 minutes)',
        'A second linked dataset is released. Teams connect new data with Round 1 findings using JOINs, subqueries and other SQL techniques to refine their investigation.'
      ],
      [
        'The Verdict (20 min prep + 5 min presentation)',
        'Teams present their investigation process, key findings, supporting SQL queries and final theory before the judging panel. Judges may request re-execution of any submitted query.'
      ]
    ],
    rules: [
      'Teams must consist of 2–3 participants.',
      'Bring your own fully charged laptop with MySQL Workbench installed.',
      'Only SQL queries executed on the provided database are permitted.',
      'Internet access and external resources are strictly prohibited.',
      'Do not modify the database structure unless explicitly instructed.',
      'Submit complete SQL query log along with the final conclusion.',
      'Plagiarism, collaboration between teams or unauthorized resources result in disqualification.',
      'Judges may ask participants to execute any submitted query during the final round.'
    ],
    evaluation: [
      ['Investigation process', '25%'],
      ['SQL query quality', '30%'],
      ['Analytical reasoning', '25%'],
      ['Presentation & justification', '20%']
    ]
  }),

  makeEvent({
    slug: 'stat-wars',
    number: '03',
    group: 'technical',
    category: 'Statistics',
    title: "STAT WARS: The Battle of Probabilities",
    tagline: 'Navigate uncertainty with confidence.',
    summary:
      'A multi-round statistics and probability quiz combining logical reasoning, analytical thinking and teamwork through written and interactive challenges.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Team quiz'],
      ['Team size', '2 members'],
      ['Duration', '120 minutes'],
      ['Track', 'Statistics & Probability']
    ],
    about:
      'Stat Wars is a multi-round technical quiz competition combining statistics, probability, logical reasoning, analytical thinking and teamwork — designed to engage teams in problem solving through written and interactive challenges.',
    rounds: [
      [
        "The Oracle's Test",
        'A screening pen-and-paper test covering statistics, probability, logical reasoning and estimation. Teams that pass advance to Round 2.'
      ],
      [
        'The Battle Arena',
        'Shortlisted teams enter an interactive round of rapid-fire questions, estimation games and puzzles in a fast-paced format testing quick thinking.'
      ],
      [
        'The Final Quest',
        'Remaining teams face high-difficulty questions in a live buzzer round testing theoretical and practical knowledge. Highest score wins.'
      ]
    ],
    rules: [
      'Participants compete in teams of 2.',
      'Bring your own scientific calculator; graphing calculators are strictly prohibited.',
      'Electronic devices including smartwatches, phones, laptops and earphones are not allowed in the quiz room.',
      'Each team gets one chance to answer each question.',
      'Tie-breaker questions will be asked if required.',
      'Any breach of rules or malpractice results in disqualification.'
    ],
    evaluation: [
      ['Statistical knowledge', '35%'],
      ['Probability & reasoning', '30%'],
      ['Speed & accuracy', '20%'],
      ['Teamwork', '15%']
    ]
  }),

  makeEvent({
    slug: 'data-feud',
    number: '04',
    group: 'technical',
    category: 'Data Science',
    title: 'Data Feud',
    tagline: 'Think like the crowd.',
    summary:
      'A team-based competition testing analytical thinking, logical reasoning and creativity through puzzles, data interpretation and survey-based gameplay inspired by Family Feud.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Team competition'],
      ['Team size', '2–3 members'],
      ['Duration', '~2 hours'],
      ['Track', 'Data Science & AI']
    ],
    about:
      'Data Feud combines puzzles, reasoning tasks and survey-based gameplay to create an interactive experience inspired by Data Science, Artificial Intelligence, Technology and Public Opinion — testing analytical thinking, teamwork and the ability to think like the majority.',
    rounds: [
      [
        'Hidden Crossword Challenge (30 minutes)',
        'Teams complete a crossword with clues related to Data Science, AI, Programming, Statistics and Technology. Highlighted words reveal a hidden connecting theme — evaluating technical knowledge and pattern recognition.'
      ],
      [
        'Decode the Crowd (40–45 minutes)',
        'Teams reconstruct a corrupted survey report through five tasks: matching charts to categories, identifying missing questions, spotting fake insights, rebuilding a dashboard and predicting crowd responses — culminating in an executive summary.'
      ],
      [
        'Data Feud Finale (30 minutes)',
        'Top 4 teams compete in a Family Feud-style round predicting the most common survey responses. Face-offs, strikes and steal opportunities determine the winner and runner-up.'
      ]
    ],
    rules: [
      'Each team must consist of 2–3 participants.',
      'Report at least 15 minutes before the event.',
      'Mobile phones, smart devices and internet access are prohibited unless instructed.',
      'Follow instructions for each round; time penalties apply where applicable.',
      'All event materials must be returned after the competition.',
      'Tie-breaker questions will be conducted if required; judges\' decisions are final.'
    ],
    evaluation: [
      ['Technical knowledge', '25%'],
      ['Data interpretation', '30%'],
      ['Critical thinking', '25%'],
      ['Team collaboration', '20%']
    ]
  }),

  makeEvent({
    slug: 'fates-wager',
    number: '05',
    group: 'technical',
    category: 'Escape Room',
    title: "The Fates' Wager",
    tagline: 'Navigate the seas of data.',
    summary:
      'An escape-room style odyssey where teams of 2–3 complete five technical and two non-technical station challenges along a time-scored roadmap across campus.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Escape room odyssey'],
      ['Team size', '2–3 participants'],
      ['Duration', '120 minutes'],
      ['Track', 'Technical & Non-Technical']
    ],
    about:
      'The Odyssey: Navigating the Seas of Data — a series of five technical tasks and two non-technical tasks where teams follow a predefined roadmap to complete challenges and earn time-based points. A shared side quest, The Fractured Cipher, offers bonus points for teams collecting all six clue fragments.',
    rounds: [
      [
        'Qualifier (if 30+ teams)',
        'A quiz determines which 15 teams qualify for the main event when registrations exceed capacity.'
      ],
      [
        "Hermes' Workshop — Python Debugging",
        'Fix broken Python snippets on printed cards to produce correct output and unlock the station lock.'
      ],
      [
        "Apollo's Observatory — Data Visualization Storytelling",
        'Interpret a data visualization and deliver a 90-second verbal story explaining what the data shows and why it matters.'
      ],
      [
        'The Outlier Oracle',
        'Identify the outlier in a printed dataset using IQR or z-score; the outlier ID becomes the lock code.'
      ],
      [
        'Probability Prophecy',
        'Solve 2–3 linked probability questions using dice/card draws; answers combine to form the unlock code.'
      ],
      [
        "Poseidon's Ledger — SQL",
        'A hands-on, no-laptop SQL challenge using physical index-card tables that teams manually JOIN to answer a written query.'
      ],
      [
        'Non-Technical Stations & Mini-Games',
        'Tile matching, bottle matching and a suite of mini-games including bottle flip, ball in cup, paper airplane, puzzles and riddles.'
      ],
      [
        'Side Quest — The Fractured Cipher',
        'Each completed station yields one clue fragment. All six fragments combine into a keyword solved at the Final Crossing for bonus points.'
      ]
    ],
    rules: [
      'Teams of 2–3 participants; scoring is time-based — faster completion earns higher points.',
      'Follow the predefined roadmap and complete stations in order.',
      'Qualifier round applies when registrations exceed 30 teams.',
      'Maintain fair play across all technical and non-technical stations.',
      'Any form of malpractice leads to disqualification.'
    ],
    evaluation: [
      ['Speed & completion', '40%'],
      ['Technical accuracy', '30%'],
      ['Team coordination', '20%'],
      ['Side quest bonus', '10%']
    ]
  }),

  makeEvent({
    slug: 'quest-of-ithaca',
    number: '06',
    group: 'non-technical',
    category: 'Non-Technical',
    title: 'Quest of Ithaca: The Hidden Voyage',
    tagline: 'Every clue leads closer to home.',
    summary:
      'A campus-wide treasure hunt where teams solve mythology-themed riddles, complete checkpoint challenges and race across campus to find their way back to Ithaca.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Treasure hunt'],
      ['Team size', '2–3 members'],
      ['Duration', '2 hours'],
      ['Track', 'Non-Technical']
    ],
    about:
      'The Quest of Ithaca is a campus-wide treasure hunt inspired by The Odyssey. Participants solve mythology-themed riddles, complete exciting checkpoint challenges and uncover hidden clues while racing across campus — combining observation, teamwork, quick thinking and strategy.',
    rounds: [
      [
        "The Oracle's Test",
        'A simultaneous qualifier with observation and memory-based challenges. Teams explore a designated area, then recall hidden symbols, objects and clues. Top performers advance to the main hunt.'
      ],
      [
        'Voyage to Ithaca',
        'Qualified teams race across themed campus checkpoints featuring riddles, hidden-object searches, audio clues, team decision-making tasks and puzzle-solving. First team to complete all checkpoints and reach Ithaca wins.'
      ]
    ],
    rules: [
      'Team members must remain together throughout the event.',
      'Checkpoints must be completed in the prescribed order.',
      'Mobile phones and external assistance are prohibited unless specified.',
      'Hints may be requested with an associated time penalty.',
      'Tampering with clues or unfair practices leads to disqualification.',
      'Judges\' decisions are final.'
    ],
    evaluation: [
      ['Speed & navigation', '35%'],
      ['Puzzle-solving', '30%'],
      ['Teamwork', '20%'],
      ['Observation & memory', '15%']
    ]
  }),

  makeEvent({
    slug: 'olympian-league-auction',
    number: '07',
    group: 'non-technical',
    category: 'Non-Technical',
    title: "Olympian League Auction: The Heroes' Draft",
    tagline: 'Build your dynasty.',
    summary:
      'A strategic IPL-style auction where teams act as franchise owners, bidding for players within a fixed budget to build the strongest balanced squad.',
    image: 'https://images.unsplash.com/photo-1531418847157-7b46bddb825a?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Live auction'],
      ['Team size', '2–4 members'],
      ['Duration', '3–4 hours'],
      ['Track', 'Non-Technical']
    ],
    about:
      'The Olympian League Auction is a strategic auction-based competition where teams step into the shoes of franchise owners. Combining cricket knowledge, analytical thinking, budgeting and decision-making, participants outbid competitors while maintaining a balanced squad and making smart investment choices.',
    rounds: [
      [
        "Oracle's Screening",
        'A preliminary quiz based on IPL, cricket, sports analytics and logical reasoning. Highest-scoring teams qualify for the live auction.'
      ],
      [
        "Heroes' Draft",
        'Qualified teams participate in a live IPL-style auction, strategically bidding for players while managing budget and squad composition. Final squads are evaluated on balance, strategy, budget utilization and overall team strength.'
      ]
    ],
    rules: [
      'Teams must stay within the allotted auction purse.',
      'Franchise allocation is decided by the organizers.',
      'Auctioneer decisions are final.',
      'Mobile phones are not permitted during the screening quiz.',
      'Teams must satisfy all squad composition requirements.',
      'Judges\' decisions are final.'
    ],
    evaluation: [
      ['Cricket knowledge', '25%'],
      ['Budget management', '30%'],
      ['Squad balance', '30%'],
      ['Strategic bidding', '15%']
    ]
  }),

  makeEvent({
    slug: 'impossible-pitch',
    number: '08',
    group: 'non-technical',
    category: 'Non-Technical',
    title: 'The Impossible Pitch: Sirens of Commerce',
    tagline: 'Sell the unsellable.',
    summary:
      'A creative marketing challenge where teams transform an absurd product into a marketable success using AI tools, then pitch and defend their campaign before a judging panel.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
    info: [
      ['Format', 'Marketing pitch'],
      ['Team size', '2–3 members'],
      ['Duration', '2.5 hours'],
      ['Track', 'Non-Technical']
    ],
    about:
      'The Impossible Pitch is a creative marketing challenge where teams transform an absurd or impractical product into a marketable success. Using AI tools and creative software, participants develop a complete branding and marketing campaign before presenting and defending their ideas — testing creativity, innovation, persuasive communication and strategic thinking under time constraints.',
    rounds: [
      [
        'The Forge',
        'Teams receive a randomly assigned unconventional product. Using AI tools and creative software, they develop a complete marketing campaign and create at least one promotional asset.'
      ],
      [
        'The Grilling',
        'Teams present their campaign through a live pitch. Judges cross-examine the marketing strategy; teams defend their decisions and justify how they overcame the product\'s limitations.'
      ]
    ],
    rules: [
      'Products allotted by organizers cannot be exchanged.',
      'All creative work must be produced during the event.',
      'AI usage is permitted but must be disclosed.',
      'Content must remain appropriate for a university audience.',
      'Presentation time limits must be strictly followed.',
      'Judges\' decisions are final.'
    ],
    evaluation: [
      ['Creativity & innovation', '30%'],
      ['Marketing strategy', '25%'],
      ['Presentation & persuasion', '25%'],
      ['Defence under questioning', '20%']
    ]
  })
];

export const getEventsByGroup = (group) => events.filter((event) => event.group === group);

export const findEvent = (slug) => events.find((event) => event.slug === slug);
