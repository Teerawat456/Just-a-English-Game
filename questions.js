const easyQuestions = [
  { question: "Which animal can fly?", choices: ["Dog", "Cat", "Bird", "Fish"], correct: "Bird" },
  { question: "What do you drink in the morning?", choices: ["Water", "Coffee", "Juice", "All of these"], correct: "All of these" },
  { question: "Which is a vegetable?", choices: ["Apple", "Carrot", "Banana", "Orange"], correct: "Carrot" },
  { question: "What color are bananas?", choices: ["Red", "Yellow", "Blue", "Green"], correct: "Yellow" },
  { question: "Which one is a day of the week?", choices: ["January", "Monday", "Summer", "Night"], correct: "Monday" },
  { question: "What is the opposite of 'hot'?", choices: ["cold", "warm", "soft", "hard"], correct: "cold" },
  { question: "Which animal barks?", choices: ["Cat", "Dog", "Bird", "Fish"], correct: "Dog" },
  { question: "What is the plural of 'cat'?", choices: ["cats", "cat's", "cates", "catz"], correct: "cats" },
  { question: "Which one is a color?", choices: ["run", "blue", "quick", "jump"], correct: "blue" },
  { question: "How many legs does a spider have?", choices: ["6", "8", "4", "10"], correct: "8" },
  { question: "What sound does a dog make?", choices: ["meow", "quack", "woof", "moo"], correct: "woof" },
  { question: "Which is a fruit?", choices: ["carrot", "apple", "potato", "celery"], correct: "apple" },
  { question: "Choose the correct article: ___ apple", choices: ["A", "An", "The", "Some"], correct: "An" },
  { question: "What color is the sky on a clear day?", choices: ["Blue", "Green", "Red", "Black"], correct: "Blue" },
  { question: "How do you say 'สวัสดี' in English?", choices: ["Goodbye", "Thank you", "Hello", "Please"], correct: "Hello" },
  { question: "Which word is a verb?", choices: ["run", "blue", "table", "sweet"], correct: "run" },
  { question: "Which one is a fruit?", choices: ["Fish", "Orange", "Car", "Chair"], correct: "Orange" }
];

const normalQuestions = [
  { question: "Which is a pronoun?", choices: ["he", "run", "blue", "cat"], correct: "he" },
  { question: "What is the past tense of 'eat'?", choices: ["eated", "ate", "eats", "eating"], correct: "ate" },
  { question: "Which is a synonym for 'happy'?", choices: ["sad", "joyful", "angry", "tired"], correct: "joyful" },
  { question: "Which is an antonym for 'fast'?", choices: ["quick", "slow", "run", "jump"], correct: "slow" },
  { question: "Which is a question word?", choices: ["What", "Cat", "Run", "Blue"], correct: "What" },
  { question: "Which is a preposition?", choices: ["under", "run", "blue", "happy"], correct: "under" },
  { question: "What is the plural of 'child'?", choices: ["childs", "children", "childes", "child"], correct: "children" },
  { question: "Choose the correct past form of 'go'", choices: ["goes", "goed", "went", "gone"], correct: "went" },
  { question: "Which sentence is correct?", choices: ["He go to school", "He goes to school", "He going to school", "He go"], correct: "He goes to school" },
  { question: "What is the opposite of 'happy'?", choices: ["sad", "angry", "excited", "smile"], correct: "sad" },
  { question: "What is 12 divided by 4?", choices: ["3", "4", "2", "6"], correct: "3" },
  { question: "Which word is a noun?", choices: ["jump", "beautiful", "cat", "quickly"], correct: "cat" },
  { question: "How do you spell the number 40?", choices: ["fourty", "forty", "foury", "fouty"], correct: "forty" },
  { question: "What is the synonym of 'big'?", choices: ["small", "tiny", "large", "short"], correct: "large" },
  { question: "Which one is NOT an adjective?", choices: ["happy", "blue", "run", "tall"], correct: "run" },
  { question: "Which sentence is in present continuous?", choices: ["She eats", "She eating", "She is eating", "She eat"], correct: "She is eating" }
];

const hardQuestions = [
  { question: "Which is a collective noun?", choices: ["team", "run", "blue", "cat"], correct: "team" },
  { question: "What is the meaning of 'reluctant'?", choices: ["willing", "unwilling", "happy"], correct: "unwilling" },
  { question: "Which is a phrasal verb?", choices: ["look up", "run", "cat", "blue"], correct: "look up" },
  { question: "What is the past participle of 'write'?", choices: ["wrote", "written", "writing"], correct: "written" },
  { question: "Which is an interjection?", choices: ["Wow!", "Run", "Blue", "Cat"], correct: "Wow!" },
  { question: "What is the superlative form of 'good'?", choices: ["goodest", "better", "best"], correct: "best" },
  { question: "Which is a synonym for 'rapid'?", choices: ["slow", "quick", "sad"], correct: "quick" },
  { question: "Choose the correct: 'She ___ to the store yesterday.'", correct: "went", choices: ["go", "goed", "went"] },
  { question: "Which word is an antonym of 'expand'?", correct: "shrink", choices: ["shrink", "grow", "inflate"] },
  { question: "What does 'benevolent' mean?", correct: "kind", choices: ["angry", "kind", "lazy"] },
  { question: "What is the correct form of 'run' in present perfect?", correct: "run", choices: ["ran", "runned", "run"] },
  { question: "Which sentence is grammatically correct?", correct: "He has never been to Japan.", choices: ["He have never been to Japan.", "He has never been to Japan.", "He is never been to Japan."] },
  { question: "Choose the correct: 'If I ___ rich, I would travel the world.'", correct: "were", choices: ["was", "were", "am"] },
  { question: "What is the passive form of 'They built a house'?", choices: ["A house built by them", "A house is built", "A house was built by them", "They were built a house"], correct: "A house was built by them" },
  { question: "Identify the adjective clause: The man who is wearing a hat is my uncle.", choices: ["The man", "who is wearing a hat", "is my uncle", "wearing a hat"], correct: "who is wearing a hat" },
  { question: "What is the comparative form of 'good'?", choices: ["gooder", "more good", "better", "best"], correct: "better" },
  { question: "What is the meaning of 'to break the ice'?", choices: ["Destroy something", "Start a conversation", "Make something cold", "Avoid talking"], correct: "Start a conversation" },
  { question: "Choose the correct reported speech: He said, 'I will go home.'", choices: ["He said he will go home", "He said he would go home", "He said I will go home", "He said I would go home"], correct: "He said he would go home" },
  { question: "Which is a gerund?", choices: ["Running", "Run", "To run", "Ran"], correct: "Running" },
  { question: "Which word is an adverb?", choices: ["Quickly", "Quick", "Quicker", "Quickness"], correct: "Quickly" },
  { question: "Which sentence uses future perfect tense?", choices: ["She will eat", "She will be eating", "She will have eaten", "She is eating"], correct: "She will have eaten" },
  { question: "Choose the correct conditional: If I had known, I ___ gone.", choices: ["would have", "will have", "would", "had"], correct: "would have" },
  { question: "Which is an example of a metaphor?", choices: ["He is as fast as a cheetah", "He runs like a deer", "He is a shining star", "He is running fast"], correct: "He is a shining star" }
];

const lunaticQuestions = [
  {
    question: "Which sentence contains a dangling participle?",
    choices: [
      "Walking down the street, the trees were beautiful.",
      "The trees were beautiful as I walked down the street.",
      "I walked down the street and saw beautiful trees.",
      "The street was beautiful."
    ],
    correct: "Walking down the street, the trees were beautiful."
  },
  {
    question: "What is the meaning of 'defenestration'?",
    choices: ["Throwing out of a window", "Defending a nation", "A type of flower", "A kind of dance"],
    correct: "Throwing out of a window"
  },
  {
    question: "Which is an example of a zeugma?",
    choices: [
      "She broke his car and his heart.",
      "He ran quickly and quietly.",
      "The cat sat on the mat.",
      "They went to the store and bought apples."
    ],
    correct: "She broke his car and his heart."
  },
  {
    question: "Which sentence uses an oxymoron?",
    choices: [
      "Bittersweet memories last forever.",
      "The cat is on the mat.",
      "He runs every morning.",
      "She likes apples."
    ],
    correct: "Bittersweet memories last forever."
  },
  {
    question: "Which sentence uses a subjunctive mood?",
    choices: [
      "If I were you, I would go.",
      "I am going to the store.",
      "She likes ice cream.",
      "He will come tomorrow."
    ],
    correct: "If I were you, I would go."
  },
  {
    question: "What is the meaning of 'pulchritudinous'?",
    choices: ["Beautiful", "Ugly", "Dangerous", "Tiny"],
    correct: "Beautiful"
  },
  {
    question: "Which sentence contains an ellipsis?",
    choices: [
      "She went to the store, and I went to the store too.",
      "She went to the store, and I did too.",
      "She went to the store, and I also went.",
      "She went to the store, and I followed."
    ],
    correct: "She went to the store, and I did too."
  },
  {
    question: "What does 'antediluvian' mean?",
    choices: ["Modern", "Ancient", "Flooded", "Unpredictable"],
    correct: "Ancient"
  },
  {
    question: "Identify the nominalization in the sentence: 'Her explanation was unclear.'",
    choices: ["Her", "Explanation", "Was", "Unclear"],
    correct: "Explanation"
  },
  {
    question: "Which sentence demonstrates syntactic ambiguity?",
    choices: [
      "Flying planes can be dangerous.",
      "Planes are dangerous when flying.",
      "Flying in planes is risky.",
      "Dangerous planes are flying."
    ],
    correct: "Flying planes can be dangerous."
  },
  {
    question: "Choose the correct use of a reduced relative clause:",
    choices: [
      "The man who is sitting over there is my uncle.",
      "The man sitting over there is my uncle.",
      "The man he is sitting over there is my uncle.",
      "The man that sitting over there is my uncle."
    ],
    correct: "The man sitting over there is my uncle."
  },
  {
    question: "What does 'sesquipedalian' describe?",
    choices: ["Short words", "Long words", "Simple speech", "Fast talking"],
    correct: "Long words"
  },
  {
    question: "Which sentence uses a correlative conjunction correctly?",
    choices: [
      "Either you come or stay.",
      "Neither the rain nor the wind could stop us.",
      "Both of them and she are going.",
      "Not only he but also her is late."
    ],
    correct: "Neither the rain nor the wind could stop us."
  },
  {
    question: "What is the meaning of 'apocryphal'?",
    choices: ["Authentic", "Dubious", "Verified", "Transparent"],
    correct: "Dubious"
  },
  {
    question: "Which sentence uses a perfect infinitive correctly?",
    choices: [
      "She claims to have finished the work.",
      "She claims to finish the work.",
      "She claims finishing the work.",
      "She claims to be finishing the work."
    ],
    correct: "She claims to have finished the work."
  },
  {
    question: "Choose the correct use of a conditional inversion:",
    choices: [
      "Had I known, I would have helped.",
      "If I had known, I would have helped.",
      "I would have helped if I had known.",
      "Knowing I had, I would have helped."
    ],
    correct: "Had I known, I would have helped."
  }
];
