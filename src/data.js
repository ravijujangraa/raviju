// All personal facts are transcribed from Raviju_Resume.pdf, including its link annotations.
// null / empty arrays deliberately preserve information absent from that source.
// 01 — PERSONAL DETAILS: naam, role, email, phone, GitHub, LinkedIn, location aur summary yahan badlo.
// GitHub: null ki jagah apna actual profile URL quotes mein likho. Example format: "https://github.com/USERNAME".
// Tumhare PC par kiye gaye edits is copy mein automatically sync nahi hote.
export const profile = {
  fullName: "Raviju Jangra",
  firstName: "Raviju",
  lastName: "Jangra",
  initials: "RJ",
  role: "Digital Marketer | Business Development Executive",
  shortRole: "Digital Marketer",
  email: "ravijujangraa@gmail.com",
  phone: "+91-9138513377",
  github: null,
  linkedin: "https://www.linkedin.com/in/ravijukhandelwal",
  location: "Gurugram, India",
  address: "A 212, Subhash Chowk, Gurugram",
  summary:
    "Digital Marketer and Business Development professional with hands-on experience in Social Media Management, Meta Ads, SEO, WordPress, Content Creation, Lead Generation and Client Relationship Management. Skilled in managing digital campaigns, creating engaging content, analyzing campaign performance, and supporting business growth through digital marketing and customer engagement.",
  oneSentence:
    "I build brand visibility and business growth through digital marketing, engaging content and customer relationships.",
  degree: "B.Tech in Computer Science & Engineering",
  field: "Computer Science & Engineering",
  college: "Lovely Professional University",
  graduationYear: null,
  nativeGreeting: "राम राम",
  languages: ["English", "Hindi"],
  codingPlatforms: [],
  achievements: [],
  certifications: [
  { name: "Certificate name", issuer: "Issuer / platform", category: "SEO", year: "2026" },
  { name: "Another certificate", issuer: "Issuer name", category: "Paid Ads", year: "2026" },
],
};
// 02 — PROJECTS: title, subtitle, category, dates, description aur tech list badlo.
// repo mein project ka GitHub repository URL aur url mein live website URL likh sakte ho.
// Naya project add karne ke liye poora { ... } object copy karke array mein comma ke baad paste karo.
export const projects = [
  {
    title: "Topper Campus",
    subtitle: "SEO, Social Media & Ads",
    category: "Digital marketing · Education",
    dates: "September 2025 – March 2026",
    description:
      "Plan and manage social media content, schedule posts, engage with audiences and monitor performance to improve brand visibility and engagement. Create 4–6 social media posts weekly, focusing on brand awareness, engagement and student-focused content. Assist with Meta Ads campaigns, audience targeting, keyword research and on-page, off-page and technical SEO optimization.",
    tech: [
      "Social Media Management",
      "Content Strategy",
      "Meta Ads",
      "Keyword Research",
      "On-page SEO",
      "Off-page SEO",
      "Technical SEO",
    ],
    repo: null,
    url: null,
  },
];
// 03 — SKILLS: har category ki list mein quoted skill names add/remove karo.
// Category names (Languages, Frontend, Backend, Databases, Tools, Core) filter buttons se connected hain.
export const skills = {
  "Digital Marketing": [
    "Campaign Planning",
    "Campaign Management",
    "Campaign Optimization",
    "Audience Targeting",
    "Lead Generation",
    "Brand Promotion",
    "Customer Engagement",
    "KPI Tracking",
  ],
  "Social Media": [
    "Social Media Marketing",
    "Social Media Management",
    "Instagram Marketing",
    "Facebook Marketing",
    "Content Scheduling",
    "Community Engagement",
  ],
  Content: [
    "Content Strategy",
    "Content Marketing",
    "Content Creation",
    "Graphic Design",
    "Ad Copywriting",
  ],
  SEO: [
    "Search Engine Optimization",
    "Keyword Research",
    "On-page SEO",
    "Off-page SEO",
    "Technical SEO",
  ],
  "Paid Ads": [
    "Meta Ads",
    "Facebook Ads Manager",
    "Campaign Structure",
    "CTR · CPC · CPL",
  ],
  "Tools & Analytics": [
    "Meta Business Suite",
    "Canva",
    "WordPress",
    "CRMs",
    "Google Sheets",
    "MS Office",
    "Google Analytics",
    "Google Ads",
    "WhatsApp Business",
  ],
};
// 04 — EXPERIENCE: job title, company/place, dates, year, meta label aur description badlo.
// Nayi job ke liye isi format ka ek aur object add karo; Journey order neeche milestones mein set hota hai.
export const experience = [
  {
    title: "Business Development Executive (CRE)",
    place: "PERS Publication",
    dates: "April 2026 – Present",
    year: "2026",
    meta: "Business development",
    description:
      "Develop and implement strategic business growth initiatives. Build and maintain relationships with potential and existing clients. Analyze market trends and competitive landscapes. Manage brand presence across 2 platforms (Instagram and LinkedIn) to boost visibility and engagement. Leverage social media for lead generation and client outreach.",
  },
  {
    title: "Digital Marketing Intern",
    place: "WebMok Pvt. Ltd.",
    dates: "September 2025 – March 2026",
    year: "2025",
    meta: "Internship",
    description:
      "Manage Instagram and Facebook pages by planning, creating and scheduling content. Create and manage Meta Ads campaigns with audience targeting and optimization. Conduct keyword research and implement on-page, off-page and technical SEO. Build and maintain a WordPress website. Design creatives using Canva and monitor CTR, CPC, CPL and ROI.",
  },
];
// 05 — EDUCATION: degree/diploma ka title, college/place, dates, year aur meta label badlo.
// education[1] abhi Paper Trail mein diploma card ke liye bhi use hota hai.
export const education = [
  {
    title: "B.Tech in Computer Science & Engineering",
    place: "Lovely Professional University, Punjab, India",
    dates: "2025 – Pursuing",
    year: "2025",
    meta: "Degree · In progress",
  },
  {
    title: "Digital Marketing Diploma",
    place: "WebMok Pvt. Ltd., Rohtak, Haryana",
    dates: "2025 – 2025",
    year: "2025",
    meta: "Diploma",
  },
];
// 06 — JOURNEY ORDER: education aur experience ke entries yahan jis order mein hongi, carousel waise chalega.
// Array index 0 pehli entry hoti hai, 1 doosri. Nayi entry banane ke baad use yahan bhi add karo.
export const milestones = [
  education[1],
  education[0],
  experience[1],
  experience[0],
];
// 07 — NUMBERS SECTION: paragraph ka text aur number chips ke value, display aur label badlo.
// value counting animation ka final number hai; label chhota uppercase caption hai.
export const numbers = [
  { text: "I create " },
  { value: 6, display: "4–6", label: "POSTS / WEEK" },
  { text: " social media posts weekly, build brand presence across " },
  { value: 2, display: "2", label: "PLATFORMS" },
  { text: " platforms at PERS Publication, and track " },
  { value: 4, display: "4", label: "KEY METRICS" },
  {
    text: " performance metrics — CTR, CPC, CPL and ROI — to turn attention into opportunity.",
  },
];
// 08 — ABOUT KE 4 CHAPTERS: label, heading line, italic accent, chhoti pill aur sentence yahan badlo.
// Abhi scroll animation 4 chapters ke liye set hai; sirf text badalne par animation edit nahi karni.
export const chapters = [
  {
    label: "01 — Hello",
    line: "Hi, I’m",
    accent: profile.firstName,
    pill: profile.shortRole,
    sentence:
      "Digital Marketer and Business Development professional with hands-on experience in social media, Meta Ads, SEO and WordPress.",
  },
  {
    label: "02 — Builder",
    line: "I build",
    accent: "brand visibility",
    pill: "Meta Ads · SEO · WordPress · Canva",
    sentence:
      "I manage digital campaigns, create engaging content and support business growth through digital marketing and customer engagement.",
  },
  {
    label: "03 — Student",
    line: "I study",
    accent: "computer science",
    pill: "B.Tech · 2025 – Pursuing",
    sentence:
      "I’m pursuing Computer Science & Engineering at Lovely Professional University in Punjab, India.",
  },
  {
    label: "04 — Solver",
    line: "I grow",
    accent: "relationships",
    pill: "Client engagement · Lead generation",
    sentence:
      "I build and maintain relationships with potential and existing clients, analyze market trends and support business development.",
  },
];
// 09 — COMMON WEBSITE TEXT: navigation names, loading greetings, character bubbles aur marquee words badlo.
// Nav names badalte waqt section IDs aur links ka matching src/main.jsx mein bhi check karo.
export const ui = {
  year: new Date().getFullYear(),
  nav: ["About", "Numbers", "Work", "Skills", "Journey", "Contact"],
  greetings: [
    "Hello",
    profile.nativeGreeting,
    "नमस्ते",
    "Hola",
    "Bonjour",
    "Ciao",
    "こんにちは",
    "Hi",
  ],
  bubbles: [
    `Hi, I’m ${profile.firstName}!`,
    "Hi there!",
    "Hello!",
    "Namaste!",
    "Hey, welcome!",
    "Hi again!",
  ],
  heroAccent: "crafting products that move.",
  marquee: [
    profile.shortRole,
    "Meta Ads",
    "SEO",
    "WordPress",
    "Open to opportunities",
    profile.field,
    "Builder of things",
  ],
  missing: [
    "GitHub URL",
    "Project repository or live URL",
    "Additional projects (resume contains one)",
    "Programming-language, frontend, backend and database skills",
    "Coding-platform counts and problem-solving achievements",
    "CGPA, department rank and hackathon results",
    "Expected graduation year",
    "Separate certifications and their issuers",
  ],
  certificateNote:
    "The resume lists a Digital Marketing Diploma under Education. No separate certifications are listed.",
};

// Interface copy, kept alongside the resume-derived content.
// 10 — BUTTONS AUR LABELS: neeche t000 jaise keys ke saamne visible website text badal sakte ho.
// Keys ko rename/delete mat karo; sirf quotes ke andar wali value badlo. Ctrl+F se current text dhoondo.
export const copy = {
  t000: "000",
  t001: "Retry",
  t002: "A LITTLE PATIENCE. A LOT OF POSSIBILITY.",
  t003: "LOADING THE EXPERIENCE",
  t004: "©",
  t005: "Open to work",
  t006: "EXPLORE THE PORTFOLIO",
  t007: "CURRENTLY",
  t008: "See my work ",
  t009: "Get in touch ",
  t010: "SCROLL TO EXPLORE",
  t011: "LET’S TALK",
  t012: "LET’S BUILD",
  t013: "SOMETHING",
  t014: "that moves.",
  t015: ":",
  t016: "Back to top ↑",
  t017: "Skip to work",
  t018: "Loading character frames",
  t019: "Raviju Jangra home",
  t020: "GitHub",
  t021: "GitHub — URL not supplied in resume",
  t022: "GitHub URL not supplied",
  t023: "LinkedIn",
  t024: "Email Raviju",
  t025: "02 — A little closer",
  t026: "Scroll to get to know me",
  t027: "03 — In numbers",
  t028: "n.value?",
  t029: "CAMPAIGN INTELLIGENCE",
  t030: "OPTIMIZE. MEASURE. GROW.",
  t031: "CTR ",
  t032: "TOPPER CAMPUS ",
  t033: "SEO + SOCIAL + ADS",
  t034: "ENGAGEMENT SIGNALS",
  t035: "04 — Selected work",
  t036: "Things I’ve",
  t037: "THE TOOLKIT",
  t038: "Open repository ↗",
  t039: ":",
  t040: "Repository not supplied ↗",
  t041: ":visual===1?",
  t042: ":",
  t043: "CONCEPT VISUAL · CLICK TO EXPLORE",
  t044: "05 — Toolbox",
  t045: "Grab a skill,",
  t046: "STACK",
  t047: "GRAB · DRAG · LET GO",
  t048: "06 — Journey",
  t049: "The road",
  t050: "SCROLL TO CONTINUE →",
  t051: "07 — Certifications",
  t052: "Paper",
  t053: ":",
  t054: "EDUCATION · DIPLOMA",
  t055: "01",
  t056: "WM",
  t057: "2025",
  t058: "A NOTE ON CREDENTIALS",
  t059: "Read my resume ↗",
  t060: "Raviju turning 360 degrees",
  t061: "One sentence, read it slowly",
  t062: "built",
  t063: "The resume contains no repository URL",
  t064: "Change campaign visual",
  t065: "throw it around.",
  t066: "so far",
  t067: "trail",
  t068: "Animated character of Raviju",
};
