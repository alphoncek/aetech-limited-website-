/*!
 * ÆTeCH Limited — ÆTeCH Intelligence Assistant
 * Version: 2.0
 *
 * FUTURISTIC WEBSITE AI ASSISTANT
 * --------------------------------
 * - No external JavaScript dependencies
 * - Mobile responsive
 * - Intelligent local intent matching
 * - Conversation context
 * - Typing indicator
 * - Quick actions
 * - Service discovery
 * - Contact actions
 * - Optional backend AI integration
 *
 * INSTALL:
 *
 * <script src="assets/aetech-chatbot.js" defer></script>
 *
 * OPTIONAL AI BACKEND:
 *
 * Set USE_REMOTE_AI = true
 * and change API_URL to your deployed ÆTeCH AI endpoint.
 */

(function () {
  "use strict";

  /* ============================================================
     1. ÆTeCH CONFIGURATION
  ============================================================ */

  var CONFIG = {
    company: "ÆTeCH Limited Company",
    assistantName: "ÆTeCH Intelligence",
    version: "2.0",

    phone: "0795 963 615",
    tel: "+254795963615",

    email: "mwamachikwaru@gmail.com",

    whatsapp: "https://wa.me/254795963615",

    website: window.location.origin,

    /*
     * KEEP FALSE until your backend is publicly deployed.
     *
     * When your ÆTeCH AI API is ready:
     *
     * USE_REMOTE_AI: true
     * API_URL: "https://your-api-domain.com/v1/chat"
     */
    USE_REMOTE_AI: false,
    API_URL: "/v1/chat",

    maxMessageLength: 1000,

    storageKey: "aetech_assistant_history_v2"
  };


  /* ============================================================
     2. CORE COMPANY KNOWLEDGE
  ============================================================ */

  var COMPANY = {
    name: "ÆTeCH Limited Company",

    shortName: "ÆTeCH",

    description:
      "ÆTeCH is a technology company focused on artificial intelligence, machine learning, software engineering, cybersecurity, cloud and network engineering, IT support and technology consulting.",

    mission:
      "Empowering people, optimizing technology and securing the future through practical engineering and digital technology solutions.",

    coverage:
      "Kenya-wide, with remote support and on-site arrangements where appropriate.",

    founder:
      "Alphonce Mwamachi Kwaru",

    contact:
      "The ÆTeCH team can be reached through WhatsApp, phone or email.",

    approach: [
      "Discover — understand the requirement.",
      "Design — define a practical technical solution.",
      "Engineer — build, configure and integrate.",
      "Support — maintain, improve and optimize."
    ],

    services: [
      {
        id: "ai",
        title: "Artificial Intelligence Engineering",
        icon: "AI",
        description:
          "Design and engineering of practical AI solutions, intelligent workflows, AI-enabled applications, automation and application integration.",
        keywords: [
          "ai",
          "artificial intelligence",
          "automation",
          "intelligent system",
          "ai application",
          "ai solution"
        ]
      },

      {
        id: "ml",
        title: "Machine Learning Engineering",
        icon: "ML",
        description:
          "Data-driven workflows covering data analysis, model development, evaluation and intelligent decision support.",
        keywords: [
          "machine learning",
          "ml",
          "model",
          "prediction",
          "data model",
          "data science"
        ]
      },

      {
        id: "software",
        title: "Software Engineering & Development",
        icon: "DEV",
        description:
          "Websites, web applications, business systems, APIs, integrations, automation and software maintenance.",
        keywords: [
          "software",
          "website",
          "web application",
          "web app",
          "api",
          "application",
          "developer",
          "development"
        ]
      },

      {
        id: "cyber",
        title: "Cybersecurity & Data Protection",
        icon: "SEC",
        description:
          "Security-conscious technical support, cybersecurity awareness, system hardening guidance and data protection practices.",
        keywords: [
          "cybersecurity",
          "cyber security",
          "security",
          "data protection",
          "privacy",
          "secure",
          "hack",
          "breach"
        ]
      },

      {
        id: "cloud",
        title: "Cloud & Network Engineering",
        icon: "NET",
        description:
          "Cloud deployment support, connectivity, networking, infrastructure setup, troubleshooting and technical guidance.",
        keywords: [
          "cloud",
          "network",
          "networking",
          "server",
          "wifi",
          "infrastructure",
          "deployment"
        ]
      },

      {
        id: "support",
        title: "IT Support & Technology Consulting",
        icon: "IT",
        description:
          "Technical support, remote assistance, systems and software installation, monitoring and technology consulting.",
        keywords: [
          "it support",
          "technical support",
          "computer",
          "consulting",
          "help desk",
          "installation",
          "troubleshooting"
        ]
      }
    ]
  };


  /* ============================================================
     3. CONVERSATION STATE
  ============================================================ */

  var STATE = {
    open: false,
    initialized: false,
    lastIntent: null,
    lastService: null,
    messages: [],
    userName: null,
    awaitingName: false,
    awaitingProjectDetails: false
  };


  /* ============================================================
     4. GREETING
  ============================================================ */

  var GREETING =
    "Hello 👋 I'm ÆTeCH Intelligence — the digital assistant for ÆTeCH Limited Company.\n\n" +
    "I can help you explore our technology services, discuss a project, " +
    "explain how ÆTeCH works, answer common questions and connect you with the team.\n\n" +
    "What would you like to explore?";


  /* ============================================================
     5. NORMALIZATION
  ============================================================ */

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w\s@.+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  function includesAny(text, words) {
    var value = normalize(text);

    for (var i = 0; i < words.length; i++) {
      if (value.indexOf(words[i]) !== -1) {
        return true;
      }
    }

    return false;
  }


  /* ============================================================
     6. INTENT ENGINE
  ============================================================ */

  function detectIntent(message) {
    var text = normalize(message);

    if (!text) {
      return {
        intent: "empty",
        confidence: 1
      };
    }

    var rules = [
      {
        intent: "greeting",
        words: [
          "hello",
          "hi",
          "hey",
          "hallo",
          "sasa",
          "mambo",
          "good morning",
          "good afternoon",
          "good evening"
        ]
      },

      {
        intent: "services",
        words: [
          "services",
          "service",
          "what do you offer",
          "what do you provide",
          "what do you do",
          "capabilities",
          "solutions"
        ]
      },

      {
        intent: "ai",
        words: [
          "artificial intelligence",
          " ai ",
          "ai solution",
          "ai system",
          "intelligent automation",
          "intelligent application"
        ]
      },

      {
        intent: "machine_learning",
        words: [
          "machine learning",
          "machine-learning",
          " ml ",
          "prediction model",
          "predictive model",
          "data model"
        ]
      },

      {
        intent: "software",
        words: [
          "software",
          "website",
          "web application",
          "web app",
          "application",
          "api",
          "developer",
          "development",
          "build an app",
          "build a website"
        ]
      },

      {
        intent: "cybersecurity",
        words: [
          "cybersecurity",
          "cyber security",
          "security",
          "data protection",
          "privacy",
          "hack",
          "hacked",
          "breach"
        ]
      },

      {
        intent: "cloud",
        words: [
          "cloud",
          "network",
          "networking",
          "server",
          "wifi",
          "infrastructure",
          "hosting",
          "deployment"
        ]
      },

      {
        intent: "support",
        words: [
          "it support",
          "technical support",
          "computer support",
          "help desk",
          "troubleshooting",
          "installation",
          "consulting"
        ]
      },

      {
        intent: "pricing",
        words: [
          "price",
          "pricing",
          "cost",
          "how much",
          "quote",
          "quotation",
          "budget",
          "rate",
          "rates",
          "fee",
          "fees"
        ]
      },

      {
        intent: "coverage",
        words: [
          "coverage",
          "where do you work",
          "where are you",
          "location",
          "mombasa",
          "nairobi",
          "kisumu",
          "nakuru",
          "eldoret",
          "kenya",
          "kenya wide",
          "nationwide"
        ]
      },

      {
        intent: "process",
        words: [
          "how does it work",
          "how it works",
          "process",
          "steps",
          "approach",
          "methodology",
          "how do i start",
          "start a project"
        ]
      },

      {
        intent: "contact",
        words: [
          "contact",
          "phone",
          "call",
          "email",
          "whatsapp",
          "reach you",
          "get in touch",
          "talk to someone",
          "human",
          "agent"
        ]
      },

      {
        intent: "about",
        words: [
          "about aetech",
          "who are you",
          "what is aetech",
          "tell me about aetech",
          "company",
          "your company"
        ]
      },

      {
        intent: "founder",
        words: [
          "founder",
          "created aetech",
          "creator",
          "who created",
          "who founded",
          "alphonce",
          "alphonce kwaru"
        ]
      },

      {
        intent: "project",
        words: [
          "project",
          "my project",
          "i need a system",
          "i need software",
          "i need an app",
          "i need a website",
          "build something"
        ]
      },

      {
        intent: "thanks",
        words: [
          "thank you",
          "thanks",
          "thank",
          "asante"
        ]
      },

      {
        intent: "goodbye",
        words: [
          "bye",
          "goodbye",
          "see you",
          "talk later"
        ]
      }
    ];

    var best = {
      intent: "fallback",
      confidence: 0
    };

    for (var i = 0; i < rules.length; i++) {
      var score = 0;

      for (var j = 0; j < rules[i].words.length; j++) {
        var word = rules[i].words[j];

        if (text.indexOf(word.trim()) !== -1) {
          score += word.length > 8 ? 3 : 1;
        }
      }

      if (score > best.confidence) {
        best = {
          intent: rules[i].intent,
          confidence: score
        };
      }
    }

    return best;
  }


  /* ============================================================
     7. SERVICE DETECTION
  ============================================================ */

  function detectService(message) {
    var text = normalize(message);

    var best = null;
    var bestScore = 0;

    COMPANY.services.forEach(function (service) {
      var score = 0;

      service.keywords.forEach(function (keyword) {
        if (text.indexOf(keyword.trim()) !== -1) {
          score++;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        best = service;
      }
    });

    return best;
  }


  /* ============================================================
     8. RESPONSE ENGINE
  ============================================================ */

  function generateResponse(message) {
    var intentData = detectIntent(message);
    var intent = intentData.intent;

    var service = detectService(message);

    if (service) {
      STATE.lastService = service.id;
    }

    STATE.lastIntent = intent;

    switch (intent) {

      case "empty":
        return {
          text:
            "Please type a question and I'll help you explore ÆTeCH.",
          actions: []
        };


      case "greeting":
        return {
          text:
            "Hello 👋 Welcome to ÆTeCH.\n\n" +
            "I'm ÆTeCH Intelligence. I can help you with services, AI, software development, cybersecurity, cloud, IT support, project enquiries and contacting the team.",
          actions: ["services", "project", "contact"]
        };


      case "services":
        return {
          text:
            "ÆTeCH currently works across six main technology areas:\n\n" +
            "1. Artificial Intelligence Engineering\n" +
            "2. Machine Learning Engineering\n" +
            "3. Software Engineering & Development\n" +
            "4. Cybersecurity & Data Protection\n" +
            "5. Cloud & Network Engineering\n" +
            "6. IT Support & Technology Consulting\n\n" +
            "Tell me which area interests you and I can explain it.",
          actions: [
            "ai",
            "software",
            "cybersecurity",
            "contact"
          ]
        };


      case "ai":
        return {
          text:
            "🤖 Artificial Intelligence Engineering\n\n" +
            "ÆTeCH focuses on practical AI systems rather than AI as a buzzword.\n\n" +
            "This can include intelligent applications, AI workflows, automation, application integration and AI-enabled business systems.\n\n" +
            "If you have a specific AI idea, tell me what you want the system to do.",
          actions: ["project", "contact"]
        };


      case "machine_learning":
        return {
          text:
            "🧠 Machine Learning Engineering\n\n" +
            "This area covers data-driven workflows, model development, evaluation and intelligent decision-support systems.\n\n" +
            "A project can begin with understanding the available data and the problem you want the system to solve.",
          actions: ["project", "contact"]
        };


      case "software":
        return {
          text:
            "💻 Software Engineering & Development\n\n" +
            "ÆTeCH can work on websites, web applications, business systems, APIs, integrations, automation and software maintenance.\n\n" +
            "If you already have an idea, describe what you want the software to accomplish.",
          actions: ["project", "contact"]
        };


      case "cybersecurity":
        return {
          text:
            "🛡️ Cybersecurity & Data Protection\n\n" +
            "ÆTeCH provides security-conscious technical support, cybersecurity awareness, hardening guidance and data protection practices.\n\n" +
            "For an actual security incident or suspected breach, contact the team directly so the situation can be assessed appropriately.",
          actions: ["contact"]
        };


      case "cloud":
        return {
          text:
            "☁️ Cloud & Network Engineering\n\n" +
            "This includes cloud deployment support, connectivity, network setup, infrastructure guidance and troubleshooting.\n\n" +
            "Tell me what infrastructure you currently have and what you want to achieve.",
          actions: ["project", "contact"]
        };


      case "support":
        return {
          text:
            "🔧 IT Support & Technology Consulting\n\n" +
            "ÆTeCH can assist with technical support, troubleshooting, systems and software installation, monitoring, remote support and technology consulting.",
          actions: ["contact"]
        };


      case "pricing":
        return {
          text:
            "💰 Project pricing depends on scope, complexity, technology requirements, integrations, timeline and support requirements.\n\n" +
            "ÆTeCH does not use one generic price for every project. The team can review your requirements and provide an appropriate quotation.",
          actions: ["project", "whatsapp", "email"]
        };


      case "coverage":
        return {
          text:
            "📍 ÆTeCH works Kenya-wide.\n\n" +
            "Remote digital support can be provided from anywhere in Kenya, while on-site arrangements can be discussed where appropriate.\n\n" +
            "The service model can therefore be remote, on-site or a combination of both.",
          actions: ["contact"]
        };


      case "process":
        return {
          text:
            "⚙️ The ÆTeCH approach is simple:\n\n" +
            "01 — DISCOVER\nUnderstand the requirement and the problem.\n\n" +
            "02 — DESIGN\nTranslate the requirement into a practical technical solution.\n\n" +
            "03 — ENGINEER\nBuild, configure, integrate and test.\n\n" +
            "04 — SUPPORT\nMaintain, improve and optimize the delivered solution.",
          actions: ["project", "contact"]
        };


      case "contact":
        return {
          text:
            "📡 You can connect directly with the ÆTeCH team through:\n\n" +
            "📱 Phone: " + CONFIG.phone + "\n" +
            "✉️ Email: " + CONFIG.email + "\n" +
            "💬 WhatsApp: available below\n\n" +
            "Choose the channel you prefer.",
          actions: ["whatsapp", "call", "email"]
        };


      case "about":
        return {
          text:
            "ÆTeCH Limited Company is a technology-focused organization working across AI, machine learning, software engineering, cybersecurity, cloud and network engineering, IT support and technology consulting.\n\n" +
            "The broader goal is to build practical technology that empowers people, optimizes technology and contributes to a more secure digital future.",
          actions: ["services", "project", "contact"]
        };


      case "founder":
        return {
          text:
            "ÆTeCH identifies Alphonce Mwamachi Kwaru as its founder and developer.\n\n" +
            "The company and its technology projects are being developed around software engineering, artificial intelligence, cybersecurity, data and digital technology.",
          actions: ["about", "contact"]
        };


      case "project":
        STATE.awaitingProjectDetails = true;

        return {
          text:
            "🚀 Let's talk about your project.\n\n" +
            "Tell me three things:\n\n" +
            "1. What do you want to build?\n" +
            "2. What problem should it solve?\n" +
            "3. Who will use it?\n\n" +
            "You don't need technical language. Describe the idea naturally and we can take it from there.",
          actions: ["whatsapp", "contact"]
        };


      case "thanks":
        return {
          text:
            "You're welcome! 🤝\n\n" +
            "Whenever you're ready, ÆTeCH is here to help you explore the technology side of your idea.",
          actions: ["services", "project"]
        };


      case "goodbye":
        return {
          text:
            "Thank you for visiting ÆTeCH. 👋\n\n" +
            "You can return anytime or contact the team directly when you're ready.",
          actions: ["contact"]
        };


      default:

        if (service) {
          return {
            text:
              "I think you're asking about " +
              service.title +
              ".\n\n" +
              service.description +
              "\n\nWould you like to discuss a project in this area?",
            actions: ["project", "contact"]
          };
        }

        return {
          text:
            "I understand the question, but I don't have enough controlled information to give you a reliable answer yet.\n\n" +
            "I can help with ÆTeCH services, AI, machine learning, software development, cybersecurity, cloud, IT support, project enquiries, pricing guidance, coverage and contact information.",
          actions: [
            "services",
            "project",
            "contact"
          ]
        };
    }
  }


  /* ============================================================
     9. OPTIONAL REMOTE AI
  ============================================================ */

  async function askRemoteAI(message) {

    if (!CONFIG.USE_REMOTE_AI) {
      return null;
    }

    try {

      var response = await fetch(CONFIG.API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: message,

          conversation: STATE.messages.slice(-10).map(function (item) {
            return {
              role: item.who,
              content: item.text
            };
          })
        })
      });

      if (!response.ok) {
        throw new Error("AI API request failed");
      }

      var data = await response.json();

      return (
        data.response ||
        data.message ||
        data.reply ||
        data.answer ||
        null
      );

    } catch (error) {

      console.warn(
        "ÆTeCH AI backend unavailable. Local intelligence used instead.",
        error
      );

      return null;
    }
  }


  /* ============================================================
     10. CSS
  ============================================================ */

  var css = `
  
  #aetech-bot-launcher {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(95,195,230,.55);
    background:
      radial-gradient(circle at 30% 25%, #183c5a 0%, #071321 42%, #020712 75%);
    color: #72d9ff;
    box-shadow:
      0 0 0 1px rgba(95,195,230,.08),
      0 0 24px rgba(95,195,230,.25),
      0 12px 35px rgba(0,0,0,.55);
    z-index: 999999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    font-weight: 800;
    font-size: 20px;
    transition: .2s ease;
  }

  #aetech-bot-launcher:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow:
      0 0 30px rgba(95,195,230,.4),
      0 15px 40px rgba(0,0,0,.6);
  }

  #aetech-bot-launcher::before {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px solid rgba(95,195,230,.15);
    animation: aetechPulse 2.5s infinite;
  }

  #aetech-bot-launcher .dot {
    position: absolute;
    right: 2px;
    top: 1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #5fe6a3;
    border: 2px solid #020712;
  }

  @keyframes aetechPulse {
    0% {
      transform: scale(.95);
      opacity: .8;
    }

    70% {
      transform: scale(1.15);
      opacity: 0;
    }

    100% {
      transform: scale(1.15);
      opacity: 0;
    }
  }


  #aetech-bot-panel {
    position: fixed;
    right: 22px;
    bottom: 100px;

    width: 380px;
    max-width: calc(100vw - 28px);

    height: 610px;
    max-height: calc(100vh - 125px);

    display: none;
    flex-direction: column;

    overflow: hidden;

    background:
      radial-gradient(circle at 90% 0%, rgba(30,92,130,.18), transparent 35%),
      linear-gradient(180deg, #030b16, #02060c);

    border: 1px solid #1d405a;

    border-radius: 20px;

    box-shadow:
      0 30px 90px rgba(0,0,0,.7),
      0 0 45px rgba(40,150,200,.12);

    z-index: 999999;

    font-family:
      Arial,
      Helvetica,
      sans-serif;
  }

  #aetech-bot-panel.open {
    display: flex;
    animation: aetechPanelIn .2s ease;
  }

  @keyframes aetechPanelIn {
    from {
      opacity: 0;
      transform: translateY(12px) scale(.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }


  #aetech-bot-header {
    padding: 15px 16px;

    display: flex;
    align-items: center;
    gap: 11px;

    background:
      linear-gradient(
        180deg,
        rgba(11,30,49,.98),
        rgba(2,7,14,.98)
      );

    border-bottom: 1px solid #163249;
  }


  #aetech-bot-header .mark {
    width: 38px;
    height: 38px;

    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #70d9ff;
    font-weight: 900;

    background:
      radial-gradient(circle at 30% 25%, #183b57, #07111e);

    border: 1px solid #2d6380;

    box-shadow:
      0 0 18px rgba(95,195,230,.15);
  }


  #aetech-bot-header .title {
    color: #edf8ff;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .2px;
  }


  #aetech-bot-header .sub {
    color: #7294a9;
    font-size: 10px;
    margin-top: 3px;

    display: flex;
    align-items: center;
    gap: 5px;
  }


  #aetech-bot-header .live {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: #5fe6a3;

    box-shadow: 0 0 8px rgba(95,230,163,.6);
  }


  #aetech-bot-close {
    margin-left: auto;

    background: transparent;
    border: 0;

    color: #6f94a8;

    font-size: 19px;

    cursor: pointer;

    padding: 5px;
  }

  #aetech-bot-close:hover {
    color: white;
  }


  #aetech-bot-status {
    padding: 7px 15px;

    color: #6f94a8;

    background: #020912;

    border-bottom: 1px solid #10263a;

    font-size: 9px;

    letter-spacing: .5px;

    text-transform: uppercase;
  }


  #aetech-bot-messages {
    flex: 1;

    overflow-y: auto;

    padding: 16px;

    display: flex;
    flex-direction: column;

    gap: 11px;

    scroll-behavior: smooth;
  }


  #aetech-bot-messages::-webkit-scrollbar {
    width: 5px;
  }

  #aetech-bot-messages::-webkit-scrollbar-thumb {
    background: #1c3b50;
    border-radius: 5px;
  }


  .aetech-msg-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }


  .aetech-msg {
    max-width: 87%;

    padding: 10px 13px;

    border-radius: 14px;

    font-size: 13px;

    line-height: 1.55;

    white-space: pre-wrap;

    word-wrap: break-word;
  }


  .aetech-msg.bot {
    align-self: flex-start;

    color: #dcecf5;

    background:
      linear-gradient(
        135deg,
        rgba(10,28,45,.98),
        rgba(5,15,26,.98)
      );

    border: 1px solid #19384e;

    border-bottom-left-radius: 4px;

    box-shadow:
      0 4px 16px rgba(0,0,0,.15);
  }


  .aetech-msg.user {
    align-self: flex-end;

    color: #effaff;

    background:
      linear-gradient(
        135deg,
        #18526d,
        #12394f
      );

    border: 1px solid #2a6783;

    border-bottom-right-radius: 4px;
  }


  .aetech-actions {
    display: flex;
    flex-wrap: wrap;

    gap: 6px;
  }


  .aetech-action {
    border: 1px solid #28556e;

    background: #071725;

    color: #65cef0;

    border-radius: 999px;

    padding: 7px 10px;

    font-size: 11px;

    cursor: pointer;

    text-decoration: none;

    transition: .15s ease;
  }


  .aetech-action:hover {
    background: #10304a;
    border-color: #5fc3e6;
    transform: translateY(-1px);
  }


  #aetech-bot-suggestions {
    padding: 0 14px 10px;

    display: flex;
    flex-wrap: wrap;

    gap: 6px;

    max-height: 100px;

    overflow-y: auto;
  }


  .aetech-chip {
    border: 1px solid #20455d;

    background: #071421;

    color: #77cfe9;

    border-radius: 999px;

    padding: 7px 10px;

    font-size: 10.5px;

    cursor: pointer;

    transition: .15s ease;
  }


  .aetech-chip:hover {
    background: #102b40;
    border-color: #5fc3e6;
  }


  #aetech-bot-inputrow {
    padding: 12px;

    display: flex;

    gap: 7px;

    background: #02070d;

    border-top: 1px solid #132d41;
  }


  #aetech-bot-input {
    flex: 1;

    min-width: 0;

    background: #081523;

    border: 1px solid #1c3c52;

    color: #eaf7fc;

    border-radius: 11px;

    outline: none;

    padding: 10px 11px;

    font-size: 13px;
  }


  #aetech-bot-input:focus {
    border-color: #55c7ed;

    box-shadow:
      0 0 0 2px rgba(85,199,237,.08);
  }


  #aetech-bot-send {
    width: 58px;

    border: 0;

    border-radius: 11px;

    background: #5fc3e6;

    color: #02101a;

    font-weight: 800;

    cursor: pointer;

    transition: .15s ease;
  }


  #aetech-bot-send:hover {
    background: #83dbf7;
  }


  #aetech-bot-send:disabled {
    opacity: .5;
    cursor: default;
  }


  .aetech-typing {
    display: flex;

    align-items: center;

    gap: 4px;

    width: 48px;
  }


  .aetech-typing span {
    width: 6px;
    height: 6px;

    background: #6acde9;

    border-radius: 50%;

    animation: aetechTyping 1s infinite;
  }


  .aetech-typing span:nth-child(2) {
    animation-delay: .15s;
  }


  .aetech-typing span:nth-child(3) {
    animation-delay: .3s;
  }


  @keyframes aetechTyping {
    0%, 60%, 100% {
      opacity: .3;
      transform: translateY(0);
    }

    30% {
      opacity: 1;
      transform: translateY(-3px);
    }
  }


  @media (max-width: 500px) {

    #aetech-bot-panel {
      left: 10px;
      right: 10px;
      bottom: 84px;

      width: auto;

      height: calc(100vh - 105px);

      max-height: calc(100vh - 105px);

      border-radius: 18px;
    }

    #aetech-bot-launcher {
      right: 14px;
      bottom: 14px;
    }

  }

  `;


  /* ============================================================
     11. INJECT CSS
  ============================================================ */

  var style = document.createElement("style");

  style.id = "aetech-assistant-style";

  style.textContent = css;

  document.head.appendChild(style);


  /* ============================================================
     12. CREATE UI
  ============================================================ */

  var launcher = document.createElement("button");

  launcher.id = "aetech-bot-launcher";

  launcher.type = "button";

  launcher.setAttribute(
    "aria-label",
    "Open ÆTeCH Intelligence Assistant"
  );

  launcher.innerHTML =
    'Æ<span class="dot"></span>';


  var panel = document.createElement("section");

  panel.id = "aetech-bot-panel";

  panel.setAttribute(
    "aria-label",
    "ÆTeCH Intelligence Assistant"
  );


  panel.innerHTML =

    '<div id="aetech-bot-header">' +

      '<div class="mark">Æ</div>' +

      '<div>' +
        '<div class="title">ÆTeCH Intelligence</div>' +
        '<div class="sub">' +
          '<span class="live"></span>' +
          'Digital assistant • Online' +
        '</div>' +
      '</div>' +

      '<button id="aetech-bot-close" aria-label="Close assistant">' +
        '×' +
      '</button>' +

    '</div>' +

    '<div id="aetech-bot-status">' +
      'ÆTeCH DIGITAL INTELLIGENCE • ' +
      CONFIG.version +
    '</div>' +

    '<div id="aetech-bot-messages"></div>' +

    '<div id="aetech-bot-suggestions"></div>' +

    '<div id="aetech-bot-inputrow">' +

      '<input ' +
        'id="aetech-bot-input" ' +
        'type="text" ' +
        'maxlength="' + CONFIG.maxMessageLength + '" ' +
        'autocomplete="off" ' +
        'placeholder="Ask ÆTeCH anything..." ' +
      '/>' +

      '<button id="aetech-bot-send" type="button">' +
        'Send' +
      '</button>' +

    '</div>';


  document.body.appendChild(launcher);

  document.body.appendChild(panel);


  /* ============================================================
     13. ELEMENT REFERENCES
  ============================================================ */

  var messagesEl =
    panel.querySelector("#aetech-bot-messages");

  var suggestionsEl =
    panel.querySelector("#aetech-bot-suggestions");

  var inputEl =
    panel.querySelector("#aetech-bot-input");

  var sendBtn =
    panel.querySelector("#aetech-bot-send");

  var closeBtn =
    panel.querySelector("#aetech-bot-close");


  /* ============================================================
     14. CONTACT ACTIONS
  ============================================================ */

  function actionMarkup(actions) {

    if (!actions || !actions.length) {
      return "";
    }

    var html = '<div class="aetech-actions">';

    actions.forEach(function (action) {

      if (action === "whatsapp") {

        html +=
          '<a class="aetech-action" ' +
          'href="' + CONFIG.whatsapp + '" ' +
          'target="_blank" ' +
          'rel="noopener noreferrer">' +
          '💬 WhatsApp' +
          '</a>';

      }

      else if (action === "call") {

        html +=
          '<a class="aetech-action" ' +
          'href="tel:' + CONFIG.tel + '">' +
          '📞 Call' +
          '</a>';

      }

      else if (action === "email") {

        html +=
          '<a class="aetech-action" ' +
          'href="mailto:' + CONFIG.email + '">' +
          '✉️ Email' +
          '</a>';

      }

      else if (action === "services") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="What services does ÆTeCH offer?">' +
          '⚡ Services' +
          '</button>';

      }

      else if (action === "ai") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="Tell me about your AI services">' +
          '🤖 AI' +
          '</button>';

      }

      else if (action === "software") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="Tell me about software engineering">' +
          '💻 Software' +
          '</button>';

      }

      else if (action === "cybersecurity") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="Tell me about cybersecurity">' +
          '🛡️ Security' +
          '</button>';

      }

      else if (action === "project") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="I want to discuss a project">' +
          '🚀 Start project' +
          '</button>';

      }

      else if (action === "contact") {

        html +=
          '<button class="aetech-action" ' +
          'data-question="How can I contact ÆTeCH?">' +
          '📡 Contact' +
          '</button>';

      }

    });

    html += "</div>";

    return html;
  }


  /* ============================================================
     15. ADD MESSAGE
  ============================================================ */

  function addMessage(text, who, actions) {

    var wrap = document.createElement("div");

    wrap.className = "aetech-msg-wrap";

    wrap.style.alignItems =
      who === "user"
        ? "flex-end"
        : "flex-start";


    var bubble = document.createElement("div");

    bubble.className =
      "aetech-msg " + who;

    bubble.textContent = text;


    wrap.appendChild(bubble);


    if (actions && actions.length) {

      var actionContainer =
        document.createElement("div");

      actionContainer.innerHTML =
        actionMarkup(actions);

      wrap.appendChild(
        actionContainer.firstElementChild
      );

    }


    messagesEl.appendChild(wrap);

    messagesEl.scrollTop =
      messagesEl.scrollHeight;


    STATE.messages.push({
      who: who,
      text: text,
      time: Date.now()
    });


    saveConversation();
  }


  /* ============================================================
     16. TYPING INDICATOR
  ============================================================ */

  function showTyping() {

    var wrap =
      document.createElement("div");

    wrap.className =
      "aetech-msg-wrap";

    wrap.id =
      "aetech-thinking";


    var bubble =
      document.createElement("div");

    bubble.className =
      "aetech-msg bot";


    bubble.innerHTML =
      '<div class="aetech-typing">' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
      '</div>';


    wrap.appendChild(bubble);

    messagesEl.appendChild(wrap);

    messagesEl.scrollTop =
      messagesEl.scrollHeight;
  }


  function hideTyping() {

    var thinking =
      document.getElementById(
        "aetech-thinking"
      );

    if (thinking) {
      thinking.remove();
    }
  }


  /* ============================================================
     17. SUGGESTIONS
  ============================================================ */

  function renderSuggestions() {

    suggestionsEl.innerHTML = "";


    var suggestions = [
      "Services",
      "AI solutions",
      "Software development",
      "Cybersecurity",
      "Pricing",
      "Coverage",
      "Start a project",
      "Contact ÆTeCH"
    ];


    suggestions.forEach(function (suggestion) {

      var chip =
        document.createElement("button");

      chip.className =
        "aetech-chip";

      chip.type =
        "button";

      chip.textContent =
        suggestion;


      chip.addEventListener(
        "click",
        function () {

          processUserMessage(
            suggestion
          );

        }
      );


      suggestionsEl.appendChild(chip);

    });

  }


  /* ============================================================
     18. PROCESS USER MESSAGE
  ============================================================ */

  async function processUserMessage(message) {

    var text =
      String(message || "").trim();


    if (!text) {
      return;
    }


    if (
      text.length >
      CONFIG.maxMessageLength
    ) {

      addMessage(
        "That message is a little too long. Please shorten it and try again.",
        "bot"
      );

      return;
    }


    addMessage(
      text,
      "user"
    );


    inputEl.value = "";

    sendBtn.disabled = true;


    showTyping();


    /*
     * Small delay makes the assistant
     * feel conversational even when
     * operating locally.
     */

    await new Promise(function (resolve) {

      setTimeout(
        resolve,
        350
      );

    });


    var remoteAnswer =
      await askRemoteAI(text);


    hideTyping();


    if (remoteAnswer) {

      addMessage(
        remoteAnswer,
        "bot"
      );

    } else {

      var result =
        generateResponse(text);


      addMessage(
        result.text,
        "bot",
        result.actions
      );

    }


    sendBtn.disabled = false;

    inputEl.focus();

  }


  /* ============================================================
     19. EVENT DELEGATION FOR ACTION BUTTONS
  ============================================================ */

  panel.addEventListener(
    "click",
    function (event) {

      var button =
        event.target.closest(
          "[data-question]"
        );


      if (!button) {
        return;
      }


      var question =
        button.getAttribute(
          "data-question"
        );


      if (question) {

        processUserMessage(
          question
        );

      }

    }
  );


  /* ============================================================
     20. OPEN / CLOSE
  ============================================================ */

  function openAssistant() {

    panel.classList.add(
      "open"
    );

    STATE.open = true;


    if (!STATE.initialized) {

      STATE.initialized = true;

      addMessage(
        GREETING,
        "bot",
        ["services", "project", "contact"]
      );

      renderSuggestions();

    }


    setTimeout(
      function () {
        inputEl.focus();
      },
      100
    );

  }


  function closeAssistant() {

    panel.classList.remove(
      "open"
    );

    STATE.open = false;

  }


  launcher.addEventListener(
    "click",
    function () {

      if (
        panel.classList.contains(
          "open"
        )
      ) {

        closeAssistant();

      } else {

        openAssistant();

      }

    }
  );


  closeBtn.addEventListener(
    "click",
    closeAssistant
  );


  /* ============================================================
     21. SEND EVENTS
  ============================================================ */

  sendBtn.addEventListener(
    "click",
    function () {

      processUserMessage(
        inputEl.value
      );

    }
  );


  inputEl.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        processUserMessage(
          inputEl.value
        );

      }

    }
  );


  /* ============================================================
     22. KEYBOARD ACCESSIBILITY
  ============================================================ */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        STATE.open
      ) {

        closeAssistant();

      }

    }
  );


  /* ============================================================
     23. CONVERSATION STORAGE
  ============================================================ */

  function saveConversation() {

    try {

      localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(
          STATE.messages.slice(-30)
        )
      );

    } catch (error) {

      console.warn(
        "ÆTeCH conversation storage unavailable."
      );

    }

  }


  function loadConversation() {

    try {

      var stored =
        localStorage.getItem(
          CONFIG.storageKey
        );


      if (!stored) {
        return;
      }


      var history =
        JSON.parse(
          stored
        );


      if (
        !Array.isArray(history)
      ) {
        return;
      }


      /*
       * We intentionally don't
       * automatically display old
       * messages on every page load.
       *
       * We only restore context.
       */

      STATE.messages =
        history.slice(-30);

    } catch (error) {

      console.warn(
        "Could not restore ÆTeCH assistant context."
      );

    }

  }


  /* ============================================================
     24. PUBLIC RESET FUNCTION
  ============================================================ */

  window.AETeCHAssistant = {

    open: openAssistant,

    close: closeAssistant,

    reset: function () {

      try {

        localStorage.removeItem(
          CONFIG.storageKey
        );

      } catch (error) {}

      STATE.messages = [];

      STATE.initialized = false;

      messagesEl.innerHTML = "";

      suggestionsEl.innerHTML = "";

    },

    ask: function (question) {

      openAssistant();

      processUserMessage(
        question
      );

    }

  };


  /* ============================================================
     25. INITIALIZE
  ============================================================ */

  loadConversation();


  /*
   * The assistant is now installed.
   *
   * It will appear automatically
   * when this script is loaded.
   */

})();
