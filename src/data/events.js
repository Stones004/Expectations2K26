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
  organizers: data.organizers || organizers,
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
    count: 5
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
    slug: 'trials-of-athena',
    number: '09',
    group: 'technical',
    category: 'Technical',
    title: 'Trials of Athena: Wisdom Under Pressure',
    tagline: 'Think clearly. Stay composed. Prove your wisdom.',

    summary:
      'A technical event designed to evaluate technical knowledge, problem-solving ability, confidence, communication skills, and performance under pressure in a simulated interview environment.',

    image:
      '/assets/trials-of-athena.jpg',

    info: [
      ['Format', 'Individual'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '2'],
      ['Track', 'Technical']
    ],

    about:
      'Trials of Athena: Wisdom Under Pressure is a technical event designed to evaluate participants’ technical knowledge, problem-solving ability, confidence, communication skills, and ability to perform effectively under pressure in a simulated interview environment.',

    rounds: [
      [
        'Aptitude & Code Completion Qualifying Test',
        'Participants will take a written qualifying test consisting of aptitude questions to assess logical reasoning and problem-solving skills, along with code completion questions.'
      ],
      [
        'Stress Interview',
        'Shortlisted participants will take part in an engaging one-on-one interactive session with the judging panel. Each participant will navigate engaging conversations, creative scenarios, and unexpected twists inspired by the event theme.'
      ]
    ],

    rules: [
      'Participants must attend the event in formal attire.',
      'Each participant must carry a printed copy of their updated resume.',
      'The use of mobile phones, smartwatches, laptops, or other electronic devices is prohibited during the event.',
      'Individual participation only; discussion or external assistance is not permitted.',
      'Only participants who qualify in Round 1 will proceed to the Stress Interview.',
      'Participants should be prepared to answer questions related to anything mentioned in their resume.',
      'Participants must maintain professional behaviour throughout the event.',
      'The decision of the judging panel will be final.'
    ],

    organizers: [
      {
        name: 'Athira',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 79770 20787',
        linkedin: ''
      },
      {
        name: 'Akansha Singh',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 72507 27006',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'stat-wars',
    number: '03',
    group: 'technical',
    category: 'Statistics',
    title: 'STAT WARS: Battle of Probabilities',
    tagline: 'Navigate uncertainty with confidence.',

    summary:
      'A multi-round technical quiz competition combining statistics, probability, logical reasoning, analytical thinking and teamwork through written and interactive challenges.',

    image:
      '/assets/Battle-of-Probabilities.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2 members'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '3'],
      ['Track', 'Statistics & Probability']
    ],

    about:
      'STAT WARS: Battle of Probabilities is a multi-round technical quiz competition which combines statistics, probability, logical reasoning, analytical thinking and teamwork, designed to engage teams in problem solving through written and interactive challenges.',

    rounds: [
      [
        "The Oracle's Test",
        'The event will begin with a screening round conducted through a pen-and-paper test. It will cover problems from statistics, probability, logical reasoning, and estimation.'
      ],
      [
        'The Battle Arena',
        'The teams shortlisted from Round 1 will enter this interactive round of rapid-fire questions, estimation games and puzzles. The activities will take place in a fast-paced manner, testing the quick thinking of the teams.'
      ],
      [
        'The Final Quest',
        'The teams still standing after The Battle Arena will face questions of high difficulty in a live buzzer round. The questions will test the theoretical knowledge as well as the practical knowledge of the teams.'
      ]
    ],

    rules: [
      'Participants are expected to bring their own scientific calculators. Graphing calculators are strictly prohibited.',
      'Any electronic devices including, but not limited to, smartwatches, phones, laptops, and earphones/headphones are strictly not allowed in the quiz room.',
      'Each team gets only one chance to answer each question.',
      'Tie-breaker questions will be asked if required.',
      'Any breach of rules or malpractice will result in disqualification.',
      'The decision of the organising team will be final.'
    ],

    organizers: [
      {
        name: 'Mohamed Namis A',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 73970 26812',
        linkedin: ''
      },
      {
        name: 'Chiranshie Vyas',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 88265 78459',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'data-feud',
    number: '04',
    group: 'technical',
    category: 'Data Science',
    title: "Data Feud: The Oracle's Verdict",
    tagline: 'Think with data. Think like the crowd.',

    summary:
      'A technical team competition combining Data Science, AI, Statistics, logical reasoning, and survey-based challenges to test analytical thinking, problem solving, and the ability to think with data and like the crowd.',

    image:
      '/assets/The-Oracles-Verdict.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2–3 members'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '3'],
      ['Track', 'Data Science & AI']
    ],

    about:
      "Data Feud: The Oracle's Verdict is a technical team competition combining Data Science, AI, Statistics, logical reasoning, and survey-based challenges. The event tests analytical thinking, problem solving, data interpretation, and the ability to think with data and like the crowd.",

    rounds: [
      [
        'Hidden Crossword Challenge',
        'Teams solve a crossword featuring clues from Data Science, AI, Programming, Statistics, and Technology. Highlighted words reveal a hidden concept connecting the answers. Skills tested: Technical Knowledge, Pattern Recognition, and Logical Thinking.'
      ],
      [
        'Decode the Crowd',
        'Teams reconstruct a corrupted survey report using charts, comments, statistics, and visualizations. Teams must match surveys, identify missing questions, spot misleading insights, rebuild a dashboard, and predict missing responses. Skills tested: Data Interpretation, Critical Thinking, and Teamwork.'
      ],
      [
        'Data Feud',
        'A Family Feud-style survey finale where teams predict the most popular responses from a pre-event student survey. Points are awarded based on the number of respondents giving each answer, with opportunities to steal points after three strikes. Skills tested: Quick Thinking, Public Opinion, and Strategy.'
      ]
    ],

    rules: [
      'Mobile phones, smart devices, and internet access are prohibited unless permitted by the organisers.',
      'Teams must follow the instructions and time limits specified for each round.',
      'Tie-breakers may be conducted if required.',
      'Malpractice or misconduct will result in disqualification.',
      'Judges’ and organisers’ decisions will be final.'
    ],

    organizers: [
      {
        name: 'Adlyn Glenita D Cunha',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 63622 87045',
        linkedin: ''
      },
      {
        name: 'Christal Deepthi Serrao',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 96116 46059',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'fates-wager',
    number: '05',
    group: 'technical',
    category: 'Escape Room',
    title: "The Fates' Wager",
    tagline: 'Solve. Unlock. Advance. Race against time.',

    summary:
      'A fast-paced escape-room challenge where teams navigate a series of technical, non-technical, and mini-game challenges. Solve, unlock, and advance through the quest while racing against time.',

    image:
      '/assets/The-Fates-Wager.jpg',

    info: [
      ['Format', 'Escape-room challenge'],
      ['Team size', '2–3 members'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '2 + Event-long Side Quest'],
      ['Track', 'Technical & Non-Technical']
    ],

    about:
      "The Fates' Wager is a fast-paced escape-room challenge where teams navigate a series of technical, non-technical, and mini-game challenges. Teams must solve challenges, unlock stations, collect clues, and advance through the quest while racing against time.",

    rounds: [
      [
        'Qualification',
        'If 30+ teams participate, a preliminary quiz will be conducted to shortlist the top 15 teams for the main quest.'
      ],
      [
        'Main Quest',
        'Teams navigate a series of technical, non-technical, and mini-game challenges across the designated roadmap. Challenges must be completed within the allotted time to progress through the quest.'
      ]
    ],

    challenges: {
      technical: [
        [
          "Hermes' Workshop: Python Debugging",
          'Find and fix bugs in Python code to unlock the station.'
        ],
        [
          "Apollo's Observatory: Data Visualization Storytelling",
          'Interpret a data visualization and present a 90-second data story.'
        ],
        [
          'The Outlier Oracle',
          'Identify an outlier using IQR or Z-score and use the result to crack the code.'
        ],
        [
          'Probability Prophecy',
          'Solve chained probability challenges using dice and cards.'
        ],
        [
          "Poseidon's Ledger",
          'Solve a physical SQL JOIN challenge using card-based tables.'
        ]
      ],

      nonTechnical: [
        [
          'Tile Matching',
          'Find matching Odyssey-themed tiles within the allotted time limit.'
        ],
        [
          'Bottle Matching',
          'Match bottles to clues using their physical characteristics.'
        ]
      ],

      miniGames: [
        'Bottle Flip',
        'Ball in Cup',
        'Paper Airplane',
        'Puzzle',
        'Envelope Draw',
        'Paper Boat',
        'Memory Sentence',
        'Riddle Solver'
      ]
    },

    sideQuest: {
      title: 'The Fractured Cipher',
      description:
        'Complete the designated stations to collect 6 clue fragments. Combine the fragments at the Final Crossing to solve the hidden cipher and earn bonus points.'
    },

    rules: [
      'Teams must follow the designated roadmap and complete challenges within the allotted time.',
      'No outside assistance or tampering with clues or props is permitted.',
      'Malpractice or rule violations will result in disqualification.',
      'Tie-breakers may be conducted if required.',
      'The organisers’ decision will be final.'
    ],

    organizers: [
      {
        name: 'Darren Dsouza',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 99024 75502',
        linkedin: ''
      },
      {
        name: 'Jasmine',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 76390 11108',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'quest-of-ithaca',
    number: '06',
    group: 'non-technical',
    category: 'Non-Technical',
    title: 'Quest for Ithaca: The Hidden Voyage',
    tagline: 'Every clue leads one step closer to Ithaca.',

    summary:
      'A campus-wide treasure hunt where teams embark on an adventurous journey inspired by The Odyssey. Participants solve mythology-themed riddles, complete exciting checkpoint challenges, and uncover hidden clues while racing across campus to find their way back to Ithaca.',

    image:
      '/assets/The-Hidden-Voyage.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2–3 members'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '2'],
      ['Track', 'Non-Technical']
    ],

    about:
      'The Quest of Ithaca is a campus-wide treasure hunt where teams embark on an adventurous journey inspired by The Odyssey. Participants solve mythology-themed riddles, complete exciting checkpoint challenges, and uncover hidden clues while racing across campus to find their way back to Ithaca. The event combines observation, teamwork, quick thinking, and strategy into a thrilling expedition where every clue leads one step closer to victory.',

    rounds: [
      [
        "The Oracle's Test",
        'Teams compete in a simultaneous qualifier consisting of observation and memory-based challenges. Participants explore a designated area for a limited time before recalling hidden symbols, objects, and clues. Top-performing teams qualify for the main treasure hunt.'
      ],
      [
        'Voyage to Ithaca',
        'Qualified teams race across multiple themed checkpoints around the campus. Each checkpoint features a unique challenge including riddles, hidden-object searches, audio clues, team decision-making tasks, and puzzle-solving. The first team to successfully complete all checkpoints and reach Ithaca wins.'
      ]
    ],

    rules: [
      'Team members must remain together throughout the event.',
      'Checkpoints must be completed in the prescribed order.',
      'Mobile phones and external assistance are prohibited unless specified.',
      'Teams may request hints with an associated time penalty.',
      'Any tampering with clues or unfair practices will lead to disqualification.',
      "Judges' decisions are final."
    ],

    organizers: [
      {
        name: 'Sristi Banerjee',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 81000 14022',
        linkedin: ''
      },
      {
        name: 'Pendyala Hema Meghana',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 83740 31151',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'olympian-league-auction',
    number: '07',
    group: 'non-technical',
    category: 'Non-Technical',
    title: "Olympian League Auction: The Heroes' Draft",
    tagline: 'Build your dynasty. Bid smart. Rule the league.',

    summary:
      'A strategic auction-based competition where teams step into the shoes of franchise owners to build the strongest possible squad within a fixed budget. Combining cricket knowledge, analytical thinking, budgeting, and decision-making, participants must outbid their competitors while maintaining a balanced team and making smart investment choices.',

    image:
      '/assets/The-Heroes-Draft.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2–4 members'],
      ['Mode', 'Offline'],
      ['Duration', '3–4 hours'],
      ['Rounds', '2'],
      ['Track', 'Non-Technical']
    ],

    about:
      "The Olympian League Auction is a strategic auction-based competition where teams step into the shoes of franchise owners to build the strongest possible squad within a fixed budget. Combining cricket knowledge, analytical thinking, budgeting, and decision-making, participants must outbid their competitors while maintaining a balanced team and making smart investment choices. Success depends on strategy rather than simply purchasing star players.",

    rounds: [
      [
        "Oracle's Screening",
        'Teams compete in a preliminary quiz based on IPL, cricket, sports analytics, and logical reasoning. The highest-scoring teams qualify for the live auction.'
      ],
      [
        "Heroes' Draft",
        'Qualified teams participate in a live IPL-style auction. Teams strategically bid for players while managing their budget and squad composition. The final squad is evaluated based on balance, strategy, budget utilization, and overall team strength.'
      ]
    ],

    rules: [
      'Teams must stay within the allotted auction purse.',
      'Franchise allocation is decided by the organizers.',
      'Auctioneer decisions are final.',
      'Mobile phones are not permitted during the screening quiz.',
      'Teams must satisfy all squad composition requirements.',
      "Judges' decisions are final."
    ],

    organizers: [
      {
        name: 'Sibin',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 80787 71574',
        linkedin: ''
      },
      {
        name: 'Adhi',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 81110 13164',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'impossible-pitch',
    number: '08',
    group: 'non-technical',
    category: 'Marketing',
    title: 'The Impossible Pitch: Sirens of Commerce',
    tagline: 'Sell the unsellable.',

    summary:
      'A creative marketing challenge where teams transform an absurd or impractical product into a marketable success using AI tools and creative software. Teams develop a complete branding and marketing campaign before presenting and defending their ideas before a judging panel.',

    image:
      '/assets/Sirens-of-Commerce.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2–3 members'],
      ['Mode', 'Offline'],
      ['Duration', '2.5 hours'],
      ['Rounds', '2'],
      ['Track', 'Marketing']
    ],

    about:
      'The Impossible Pitch is a creative marketing challenge where teams transform an absurd or impractical product into a marketable success. Using AI tools and creative software, participants develop a complete branding and marketing campaign before presenting and defending their ideas before a judging panel. The event tests creativity, innovation, persuasive communication, and strategic thinking under time constraints.',

    rounds: [
      [
        'The Forge',
        'Teams receive a randomly assigned unconventional product. Using AI tools and creative software, participants develop a complete marketing campaign and create at least one promotional asset.'
      ],
      [
        'The Grilling',
        'Teams present their campaign through a live pitch. Judges challenge the team’s marketing strategy through cross-questioning. Teams defend their decisions and justify how they overcame the product’s limitations.'
      ]
    ],

    rules: [
      'Products allotted by the organizers cannot be exchanged.',
      'All creative work must be produced during the event.',
      'AI usage is permitted but must be disclosed.',
      'Content must remain appropriate for a university audience.',
      'Presentation time limits must be strictly followed.',
      "Judges' decisions are final."
    ],

    organizers: [
      {
        name: 'Simran Rajput',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 78921 82139',
        linkedin: ''
      },
      {
        name: 'Pratap Mangalam',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 73385 71742',
        linkedin: ''
      }
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
      'A technical team event combining SQL, analytical thinking, and problem-solving. Participants act as data investigators, using a corrupted archival database containing anomalies, missing data, and hidden clues to analyse, cross-reference, and reconstruct events.',

    image:
      '/assets/The-Oracles-Archive.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '2 members'],
      ['Mode', 'Offline'],
      ['Duration', '2.5 hours'],
      ['Rounds', '2'],
      ['Track', 'SQL & Analytics']
    ],

    about:
      'The Oracle’s Archive is a technical team event combining SQL, analytical thinking, and problem-solving. Participants act as data investigators, using a corrupted archival database containing anomalies, missing data, and hidden clues to analyse, cross-reference, and reconstruct events. Every conclusion must be supported by SQL-based evidence, making logical reasoning essential.',

    rounds: [
      [
        'Excavation',
        '45 Minutes — Participants receive the initial archival database and investigate it using SQL queries. Identify missing values, duplicate records, inconsistencies, anomalies, and suspicious patterns, and gather preliminary evidence.'
      ],
      [
        'The Unlocked Archive',
        '35 Minutes — A second linked dataset is released, requiring participants to connect it with their Round 1 findings using JOINs, subqueries, and other SQL techniques. They must analyse the new evidence, uncover deeper connections, and refine their investigation and conclusions.'
      ]
    ],

    rules: [
      'Participants must bring their own fully charged laptops with MySQL Workbench pre-installed.',
      'Only SQL queries executed on the provided database are permitted.',
      'A complete SQL query log and final conclusion must be submitted.',
      'Internet and external resources are strictly prohibited.',
      'The database structure must not be modified unless instructed by the organizers.',
      'Plagiarism, inter-team collaboration, or unauthorized resources will result in disqualification.',
      'Judges may ask participants to re-execute any submitted query.',
      'The judges’ decision is final and binding.'
    ],

    organizers: [
      {
        name: 'Ann Maria Anil',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 63610 26699',
        linkedin: ''
      },
      {
        name: 'Sai Sanjana D',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 97315 19874',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'sirens-stage',
    number: '10',
    group: 'non-technical',
    category: 'Dance',
    title: "Siren's Stage: Where Waves Dance",
    tagline: 'Where rhythm meets the tide.',

    summary:
      'A high-energy dance competition showcasing choreography, synchronization, creativity, musicality, and stage presence.',

    image:
      '/assets/Sirens-Stage.jpg',

    info: [
      ['Format', 'Team performance'],
      ['Team size', '6–9 members'],
      ['Mode', 'Offline'],
      ['Duration', 'Maximum 5 minutes'],
      ['Track', 'Dance']
    ],

    about:
      "Siren's Stage: Where Waves Dance is a high-energy dance competition showcasing choreography, synchronization, creativity, musicality, and stage presence. Teams compete through carefully crafted performances while demonstrating energy, execution, thematic expression, and visual impact.",

    details: [
      {
        title: 'The Screen Mirror Concept',
        items: [
          [
            'Video Selection',
            'Teams must select one cinema video song or a clean montage clip.'
          ],
          [
            'Video Submission',
            'The high-definition video must be submitted in 1080p MP4 format along with the audio file 72 hours before the event.'
          ],
          [
            'Exact Step Match',
            'Teams will be evaluated on how accurately they replicate the original step-by-step choreography, hook steps, dancer formations, expressions, and dynamic timing relative to the video.'
          ],
          [
            'Role Distribution',
            'Teams must assign lead roles such as Hero/Heroine and backing dancers to reflect the original video layout on stage.'
          ],
          [
            'Visual Similarity',
            'Matching the colour palettes, style, and iconic look of the original music video contributes to the Costumes & Cinematic Accuracy criterion.'
          ]
        ]
      },

      {
        title: 'Team Composition & Eligibility',
        items: [
          [
            'Active Dancers',
            'Minimum of 6 and maximum of 15 active dancers on stage.'
          ],
          [
            'Cross-Participation',
            'A student cannot perform in more than one dance team during the competition.'
          ]
        ]
      },

      {
        title: 'Timing & Penalties',
        items: [
          [
            'Performance Duration',
            'The total clip must be between 3 and 5 minutes.'
          ],
          [
            'Clock Start',
            'Timing begins with the start of the background video playback and the first step on stage.'
          ],
          [
            'Clock End',
            'Timing stops when the video terminates or dancers freeze in the final frame.'
          ],
          [
            'Overtime Penalty',
            'Routines exceeding 5 minutes receive an automatic deduction of 0.5 points for every 10 seconds over time.'
          ]
        ]
      },

      {
        title: 'Stage Transitions',
        items: [
          [
            'Buffer Window',
            'A strict 2-minute buffer is provided between teams for stage entry, exit, and AV checks.'
          ],
          [
            'Props',
            'Any props used must be placed on stage and completely cleared within the 2-minute window.'
          ],
          [
            'Queueing',
            'The next scheduled team must line up backstage during the active performance of the preceding team.'
          ]
        ]
      },

      {
        title: 'Media Submission & Technical Check',
        items: [
          [
            'Video Format',
            'MP4, 1080p.'
          ],
          [
            'Audio Format',
            'MP3.'
          ],
          [
            'Submission',
            'Video and audio must be submitted through the online portal before the deadline.'
          ],
          [
            'Backup Media',
            'Teams must carry backup copies of both video and audio on a clearly labelled USB flash drive.'
          ]
        ]
      },

      {
        title: 'Safety & Stage Rules',
        items: [
          [
            'Costume Integrity',
            'Costumes must align with Christ University standards and remain secure during dynamic movement.'
          ],
          [
            'Prohibited Items',
            'Open fire, water, powder, glass, loose confetti, and slippery materials are prohibited.'
          ],
          [
            'Clean Stage',
            'Performers must leave the stage clean and safe for subsequent teams.'
          ],
          [
            'Green Room',
            'Teams are responsible for their belongings, garments, headpieces, armour props, and makeup kits.'
          ]
        ]
      }
    ],

    rules: [
      'A participant may perform in only one team.',
      'All teams must adhere to the allotted performance and transition time.',
      'Props must be safely managed and cleared within the transition period.',
      'Any inappropriate content, malpractice, or violation of rules may lead to disqualification.',
      'The decision of the judges will be final.'
    ],

    evaluation: [
      ['Choreography & Execution', '30%'],
      ['Theme & Musicality', '30%'],
      ['Stage Presence & Energy', '20%'],
      ['Costumes & Props', '20%']
    ],

    organizers: [
      {
        name: 'Adduri Srivallika',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 74167 03262',
        linkedin: ''
      },
      {
        name: 'Aliza Elizabeth',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 70122 44801',
        linkedin: ''
      }
    ]
  }),

  makeEvent({
    slug: 'myths-in-motion',
    number: '01',
    group: 'non-technical',
    category: 'Fashion',
    title: 'Myths in Motion',
    tagline: 'Where mythology meets the runway.',

    summary:
      'A creative team-based fashion event showcasing style, originality, storytelling, presentation, and teamwork through a themed runway.',

    image: '/assets/MYTHS-IN-MOTION.jpg',

    info: [
      ['Format', 'Team'],
      ['Team size', '8–10 models + maximum 3 support crew'],
      ['Mode', 'Offline'],
      ['Duration', '2 hours'],
      ['Rounds', '1'],
      ['Track', 'Fashion']
    ],

    about:
      'Myths in Motion invites participating crews to step into ancient antiquity and bring the legends, deities, and mortals of Greek mythology to life on the runway. Teams must present a cohesive collection that merges authentic classical motifs with high-concept fashion design and modern tailoring.',

    rounds: [
      [
        'Runway Showcase',
        'Maximum 5 Minutes — Teams present 8–10 models in a themed Greek mythology-inspired runway. Performances are judged on Mythological Depiction & Concept, Garment Design & Craftsmanship, Walking & Posture, and Grooming, Makeup & Styling.'
      ]
    ],

    details: [
      {
        title: 'Schedule',
        items: [
          ['Day', 'Day 2'],
          ['Date', '29th September'],
          ['Time', '2:00 PM – 3:00 PM']
        ]
      },

      {
        title: 'Creative Theme Mandate',
        items: [
          [
            'Theme Focus',
            'Collections must draw inspiration exclusively from Greek Mythology and Classical Antiquity, including Olympians, Titans, Demigods, Myths & Legends, Heroic Epics, or Architectural/Artistic Eras of Classical Greece.'
          ],
          [
            'Concept Note / Script',
            'Teams must submit a 100-word Concept Note along with their track submission, detailing the specific Greek myth or deity roster being depicted, garment inspiration, and creative narrative.'
          ],
          [
            'Modern Interpretation Bonus',
            'Up to 5 bonus points will be awarded under Garment Design for teams that successfully blend classical draping techniques such as chitons, peploi, himations, and golden laurel motifs with contemporary high-fashion silhouettes.'
          ]
        ]
      },

      {
        title: 'Team Composition & Backstage Rules',
        items: [
          [
            'Model Limits',
            'Minimum of 8 and maximum of 10 models per team on stage.'
          ],
          [
            'Support Crew',
            'Maximum of 3 backstage members, including designers, makeup artists, and assistants.'
          ],
          [
            'Reporting Time',
            'All models and support crew must report to the backstage green room 45 minutes before the event starts. Late arrivals will result in a direct walkover to the next team.'
          ],
          [
            'Green Room Etiquette',
            'Teams are fully responsible for their belongings, garments, headpieces, armor props, and makeup kits. The organizing committee is not liable for loss or theft.'
          ],
          [
            'Sequence Sheet',
            'A detailed sequence sheet mapping the order of model appearances, including character names and roles, must be handed to the backstage coordinator during reporting.'
          ]
        ]
      },

      {
        title: 'Timing & Stage Guidelines',
        items: [
          [
            'Total Performance Limit',
            'Maximum of 5 minutes total per team, including setup and performance.'
          ],
          [
            'Grace Period',
            'Exactly 2 minutes are allocated for stage setup and complete stage clearing.'
          ],
          [
            'Overtime Penalty',
            'A deduction of 2 marks will be applied for every 30 seconds over the 5-minute limit.'
          ],
          [
            'No Live Changing',
            'All outfit changes must take place inside the green room. Changing behind props or on stage is strictly prohibited.'
          ],
          [
            'Stage & Audience Limits',
            'Models must remain on the stage area. Jumping off the stage, physically interacting with judges, or throwing items into the audience is forbidden.'
          ]
        ]
      },

      {
        title: 'Decency Code & Restrictions',
        items: [
          [
            'Christ University Decency Code',
            'Outfits must strictly adhere to campus decorum. Garments must be fully lined and appropriately structured.'
          ],
          [
            'Zero Vulgarity',
            'Inappropriate gestures, suggestive posing, or explicit background music will result in instant disqualification.'
          ],
          [
            'Hazard Restrictions',
            'Fire, water, liquids, real metal sharp weapons, powders, and loose glitter or confetti are strictly banned on stage.'
          ],
          [
            'Permitted Props',
            'Lightweight prop weapons such as foam or wooden tridents, shields, or staffs are permitted if they are inspectable and safe.'
          ],
          [
            'Stage Cleanliness',
            'Teams must leave the stage completely clean after their performance.'
          ]
        ]
      },

      {
        title: 'Audio & Visual Requirements',
        items: [
          [
            'Track Submission',
            'Music tracks must be submitted in MP3 format through the online portal at least 48 hours before the event.'
          ],
          [
            'Backup Media',
            'Teams must bring a backup copy on a clearly labelled USB flash drive to the sound console during reporting.'
          ],
          [
            'Audio Cues',
            'One support crew member must sit at the sound desk to coordinate audio start and stop cues with the technician.'
          ],
          [
            'LED Screen / Projector',
            'Background visuals must be submitted alongside the audio track. Static images or simple video loops only.'
          ]
        ]
      },

      {
        title: 'Tie-Breaker',
        items: [
          [
            'First Criterion',
            'In case of a tie, Mythological Depiction & Concept will be considered first.'
          ],
          [
            'Second Criterion',
            'If the tie persists, Garment Design will determine the winner.'
          ]
        ]
      }
    ],

    rules: [
      'All models and support crew must report to the backstage green room 45 minutes before the event starts.',
      'The total performance time is 5 minutes, including setup and performance.',
      'A deduction of 2 marks will be applied for every 30 seconds over the 5-minute limit.',
      'All outfit changes must take place inside the green room.',
      'Outfits, gestures, music, and performances must follow Christ University decency standards.',
      'Vulgarity, inappropriate gestures, suggestive posing, or explicit background music will result in immediate disqualification.',
      'Fire, water, liquids, real metal sharp weapons, powders, and loose glitter or confetti are prohibited.',
      'Teams must leave the stage completely clean after their performance.',
      'Teams must submit their music in MP3 format at least 48 hours before the event.',
      'Background visuals, if used, must be submitted alongside the audio track.',
      'The judges’ decision is final, binding, and absolute.'
    ],

    evaluation: [
      ['Mythological Depiction & Concept', '30%'],
      ['Garment Design & Craftsmanship', '30%'],
      ['Walking & Posture', '20%'],
      ['Grooming, Makeup & Styling', '20%']
    ],

    organizers: [
      {
        name: 'Adduri Srivallika',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 74167 03262',
        linkedin: ''
      },
      {
        name: 'Aliza Elizabeth',
        role: 'Event Organizer',
        image: '',
        email: '',
        phone: '+91 70122 44801',
        linkedin: ''
      }
    ]
  }),
];

export const getEventsByGroup = (group) => events.filter((event) => event.group === group);

export const findEvent = (slug) => events.find((event) => event.slug === slug);
