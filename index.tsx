import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { 
  BookOpen, 
  PenTool, 
  Users, 
  LogOut, 
  ChevronRight, 
  CheckCircle, 
  Save, 
  Clock, 
  FileText, 
  Layout, 
  Award,
  Settings,
  Menu,
  X,
  Newspaper,
  Feather,
  Megaphone,
  Mic,
  Eye,
  Heart,
  ArrowLeft,
  TrendingUp,
  Globe,
  Zap,
  UserPlus,
  LogIn,
  AlertCircle,
  Camera,
  GraduationCap,
  PlayCircle,
  ExternalLink,
  Mail
} from 'lucide-react';

// --- Supabase Configuration ---
// TO ENABLE SUPABASE: Enter your project URL and Anon Key below.
// If left blank, the app will use the local mock backend automatically.
const SUPABASE_URL = ""; 
const SUPABASE_ANON_KEY = "";

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// --- Assets ---
// Updated to match the SMES Skyline Logo design (Beige/Green/Red)
const LOGO_URL = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Ccircle cx='250' cy='250' r='245' fill='%23F5F5DC' stroke='%2315803d' stroke-width='10'/%3E%3Ccircle cx='250' cy='250' r='220' fill='none' stroke='%23b91c1c' stroke-width='5'/%3E%3Ctext x='250' y='200' font-family='serif' font-size='140' font-weight='bold' text-anchor='middle' fill='%2315803d'%3ESMES%3C/text%3E%3Ctext x='250' y='300' font-family='cursive' font-size='90' font-weight='bold' text-anchor='middle' fill='%23b91c1c'%3ESkyline%3C/text%3E%3Ctext x='250' y='380' font-family='sans-serif' font-size='30' font-weight='bold' text-anchor='middle' fill='%2315803d' letter-spacing='2'%3EEST. 1945%3C/text%3E%3C/svg%3E";

// --- Types ---

type Role = 'student' | 'teacher';
type Language = 'english' | 'filipino';
type Category = 'news' | 'feature' | 'editorial';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // stored for simulation
  role: Role;
  schoolId: string;
}

interface Prompt {
  id: string;
  title: string;
  category: Category;
  language: Language;
  facts: string[];
  instructions: string;
  isPractice?: boolean;
}

interface Submission {
  id: string;
  promptId: string;
  promptTitle: string;
  studentId: string;
  studentName: string;
  content: string;
  category: Category;
  date: string;
  status: 'draft' | 'submitted' | 'graded';
  score?: number;
}

interface BilingualContent {
  en: string;
  tl: string;
}

interface TrendTopic {
  title: BilingualContent;
  facts: {
    en: string[];
    tl: string[];
  };
}

// --- Tutorial Data ---

const TUTORIALS = {
  news: {
    title: "News Writing",
    intro: "A news article reports on current events or timely information. It should present facts clearly and objectively. News writing uses the inverted pyramid style – the most important information comes first, followed by supporting details in decreasing order of importance. This ensures that even if a reader only reads the beginning, they get the essential facts.",
    tips: [
      { title: "Gather the 5 Ws and 1 H", desc: "Before writing, find out Who, What, When, Where, Why, and How of the event or topic. A good news report answers all these questions clearly. Make sure you have verified facts from reliable sources." },
      { title: "Write a strong lead", desc: "The lead is the first sentence or paragraph. It should briefly summarize the most important facts. Imagine telling a friend in one sentence what happened. Example: 'The school launched a reading program Monday to help students improve literacy.'" },
      { title: "Use the inverted pyramid", desc: "Present information from most important to least important. Paragraphs after the lead provide details, quotes, or context. There is typically no need for a formal conclusion in a straight news article." },
      { title: "Keep it clear and concise", desc: "Use short, straightforward sentences. News writing values brevity. Avoid opinions or flowery language – stick to the facts in an unbiased tone." },
      { title: "Attribute sources", desc: "If you include quotes, always cite who said it. Example: 'Our school’s garden teaches responsibility,' said Principal Reyes. This adds credibility." },
      { title: "Double-check facts", desc: "Ensure names, dates, and details are correct. A news report is characterized by factual information, which sets it apart from opinion pieces." },
      { title: "Write a headline last", desc: "A headline is a short title that grabs attention and tells the main point. Keep it concise. It’s easiest to write the headline after drafting so you know the focus." }
    ],
    videos: [
      "6u25Bna3ckA",
      "lnkyjD-HlF0",
      "WH7FgHdJyOI",
      "flHmfUDJTG0",
      "VIWsrla2jSg"
    ]
  },
  feature: {
    title: "Feature Writing",
    intro: "A feature article is a more in-depth, creative article that often focuses on human interest stories, trends, or personal profiles. The main function is usually to entertain or engage readers while still informing them. Unlike a hard news story, a feature uses a narrative structure – much like storytelling – with a clear beginning, middle, and end that keeps readers interested throughout.",
    tips: [
      { title: "Choose an interesting topic", desc: "Feature stories often zoom in on a specific aspect of a broader topic. Pick a topic that is relatable and engaging for your audience, like a day in the life of a student achiever." },
      { title: "Research and gather details", desc: "Gather plenty of information: facts, statistics, background history, and especially anecdotes or quotes. These details will give life to your story." },
      { title: "Start with a catchy lead (hook)", desc: "Instead of a summary, start with a vivid description or a compelling quote. Example: 'Every morning, 10-year-old Ana wakes up at 5 AM to tend a small garden.' Build curiosity." },
      { title: "Use a narrative flow", desc: "Write with progression. Use a 'nutgraph' (often the 2nd or 3rd paragraph) that clearly states what the story is about and why it matters." },
      { title: "Show, don’t just tell", desc: "Use descriptive language and sensory details (sights, sounds, smells). Include specific examples so the reader can visualize the scene." },
      { title: "Keep it factual and fair", desc: "A feature is narrative but based on facts. Do not inject personal opinion or bias. The piece should be grounded in truthful reporting." },
      { title: "End with impact", desc: "The ending should give a sense of closure. It might be a memorable quote or a call to action. Avoid just summarizing; finish in a way that resonates." }
    ],
    videos: [
      "sO74FrGArzo",
      "QPtDWCMhg_s",
      "RienQJNXXmc",
      "ogcbh5HTDck",
      "xwAUrEjc4u8"
    ]
  },
  editorial: {
    title: "Editorial Writing",
    intro: "An editorial article is an opinion piece that presents the writer’s stance on an issue. In a school paper, it usually reflects the collective opinion of the staff. It is similar to a persuasive essay: the goal is to convince or influence readers to adopt a certain viewpoint. Editorial writing is subjective but requires facts and logical reasoning to support the opinion.",
    tips: [
      { title: "Select a focused topic and stance", desc: "Choose a timely issue you feel strongly about. Clearly decide your position (pro or con). Focus on one specific idea rather than covering too many points." },
      { title: "Know your purpose and audience", desc: "Tailor your tone to your audience. You can be passionate but should remain respectful and reasonable." },
      { title: "Plan your argument", desc: "Jot down 2–3 strong reasons supporting your opinion. Consider counterarguments (what might those who disagree say?) to strengthen your own points." },
      { title: "Write a compelling introduction", desc: "Start with a hook. Clearly state your opinion in one sentence (thesis statement). Example: 'Homework should be limited to 30 minutes daily.'" },
      { title: "Develop the body with evidence", desc: "Write one paragraph for each major reason. Provide facts, examples, or data that back it up. Use concrete evidence to make your argument convincing." },
      { title: "Use a persuasive tone", desc: "Support every opinion with logic. Avoid insults. Writing in third person often works better than using 'I' too much in formal editorials." },
      { title: "Conclude with a strong closing", desc: "Restate your position and summarize main points. End with a call to action. Example: 'Change starts with us – and it can start now.'" }
    ],
    videos: [
      "5-E-zYfW4pI",
      "JI8vJNA94G8",
      "ekTfGpNE5tI",
      "ITDKnxIiUJM",
      "MM5IG0Z1ebo"
    ]
  }
};

// --- Mock Backend (LocalStorage) ---
const STORAGE_KEYS = {
  USERS: 'smes_users_v1',
  SUBMISSIONS: 'smes_submissions_v1',
  CURRENT_USER: 'smes_current_user_v1'
};

const Backend = {
  getUsers: (): User[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    } catch { return []; }
  },
  saveUser: (user: User) => {
    const users = Backend.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getSubmissions: (): Submission[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
    } catch { return []; }
  },
  saveSubmission: (sub: Submission) => {
    const subs = Backend.getSubmissions();
    // Check if exists (update) or new
    const existingIdx = subs.findIndex(s => s.id === sub.id);
    if (existingIdx >= 0) {
      subs[existingIdx] = sub;
    } else {
      subs.push(sub);
    }
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
  }
};

// --- Data: 10 Trends per Category (Bilingual with Facts) ---

const TRENDS: Record<Category, TrendTopic[]> = {
  news: [
    { 
      title: { en: "Flood Control Audit: Ghost Projects?", tl: "Audit sa Flood Control: Mga Ghost Project?" },
      facts: {
        en: ["Why it’s news: Government and COA moved to audit flood control projects after allegations of corruption.", "Context: President ordered transparency measures, including public listing tools.", "Write it as: Straight news (5Ws/1H) + explainers (what 'performance audit' means).", "Evidence checklist: Project name/location, cost, contractor, status, audit scope.", "Interviews: DPWH district engineer, COA audit spokesperson, affected residents."],
        tl: ["Bakit balita: Sinimulan ng gobyerno at COA ang audit sa mga flood control projects.", "Konteksto: Ipinag-utos ng Pangulo ang transparency at public listing ng mga proyekto.", "Isulat bilang: Straight news (5Ws/1H) + paliwanag sa 'performance audit'.", "Ebidensya: Pangalan ng proyekto, gastos, contractor, status.", "Interbyu: DPWH engineer, COA spokesperson, mga apektadong residente."]
      }
    },
    { 
      title: { en: "Typhoons + Habagat: Suspensions & Recovery", tl: "Bagyo at Habagat: Suspensyon at Pagbangon" },
      facts: {
        en: ["Why it’s news: Recent 2025 storms intensified monsoon rains, causing flooding and closures.", "Impact: School suspensions, evacuations, casualties, and relief operations.", "Write it as: Breaking update + community impact story (schools, transport, health).", "Evidence checklist: Affected barangays, suspension orders, evac center count.", "Interviews: LDRRMO, school head, evac center manager, parents."],
        tl: ["Bakit balita: Pinalakas ng mga bagyo sa 2025 ang Habagat na nagdulot ng baha.", "Epekto: Walang pasok, paglikas, at relief operations.", "Isulat bilang: Breaking update + epekto sa komunidad.", "Ebidensya: Apektadong barangay, suspension orders, bilang ng nasa evacuation.", "Interbyu: LDRRMO, school head, evac center manager, mga magulang."]
      }
    },
    { 
      title: { en: "WeeLMat in NIR: Learning Continuity", tl: "WeeLMat sa NIR: Tuloy-tuloy na Pag-aaral" },
      facts: {
        en: ["Why it’s news: DepEd guidelines on class suspensions require continuity; NIR memos operationalize WeeLMat.", "Write it as: Local policy news + 'what changes for learners/teachers?'", "Evidence checklist: Memo dates, who submits/when, content requirements.", "Interviews: EPS/SGOD/CID, school heads, teachers, parents, learners."],
        tl: ["Bakit balita: Kailangan ng learning continuity tuwing walang pasok ayon sa DepEd.", "Isulat bilang: Local policy news + epekto sa mag-aaral at guro.", "Ebidensya: Petsa ng memo, sino ang magsusumite, nilalaman.", "Interbyu: EPS/SGOD, school heads, guro, magulang, estudyante."]
      }
    },
    { 
      title: { en: "Inflation Update: Prices Easing (1.5%)", tl: "Inflation Update: Pagbaba ng Presyo (1.5%)" },
      facts: {
        en: ["Why it’s news: Headline inflation decelerated to 1.5% in Nov 2025.", "Impact: Affects household budgets, school feeding, transport costs.", "Write it as: Data-driven news with a 'market basket' sidebar.", "Evidence checklist: PSA/BSP figures, local market price checks.", "Interviews: Wet market vendors, parents, canteen operators."],
        tl: ["Bakit balita: Bumagal ang inflation sa 1.5% noong Nobyembre 2025.", "Epekto: Budget sa bahay, school feeding, pamasahe.", "Isulat bilang: Data-driven news na may 'market basket' sidebar.", "Ebidensya: Datos ng PSA/BSP, presyo sa palengke.", "Interbyu: Tindera sa palengke, magulang, canteen operators."]
      }
    },
    { 
      title: { en: "Sara Duterte Impeachment: SC Decision", tl: "Impeachment kay Sara Duterte: Desisyon ng SC" },
      facts: {
        en: ["Why it’s news: SC dismissed impeachment complaint vs VP Sara Duterte (July 25, 2025) as unconstitutional.", "Context: Cited one-year rule and due process; clarified it was not ruling on guilt/innocence.", "Write it as: Legal-process explainer (impeachment steps, one-year ban).", "Evidence checklist: Decision date, constitutional basis, procedural next steps.", "Interviews: Law professors, civics teachers, student leaders."],
        tl: ["Bakit balita: Ibinasura ng SC ang impeachment complaint laban kay VP Sara Duterte.", "Konteksto: Labag daw sa one-year rule; hindi ito desisyon sa guilty o hindi.", "Isulat bilang: Paliwanag sa proseso ng impeachment.", "Ebidensya: Petsa ng desisyon, batayan sa konstitusyon.", "Interbyu: Law professors, civics teachers, student leaders."]
      }
    },
    { 
      title: { en: "WPS Incident: Sabina Shoal", tl: "Insidente sa WPS: Sabina Shoal" },
      facts: {
        en: ["Why it’s news: PCG reported injuries/boat damage after Chinese Coast Guard actions; China issued counter-claim.", "Write it as: Conflict/incident report with strict attribution ('PCG said…', 'China said…').", "Evidence checklist: Location, timeline, boat count, medical aid, statements.", "Interviews: Fisherfolk groups, maritime analysts, PCG spokesperson."],
        tl: ["Bakit balita: Nag-ulat ang PCG ng pinsala at sugatan dahil sa Chinese Coast Guard.", "Isulat bilang: Incident report na may maingat na atribusyon.", "Ebidensya: Lokasyon, timeline, bilang ng bangka, pahayag ng opisyal.", "Interbyu: Mangingisda, maritime analysts, PCG spokesperson."]
      }
    },
    { 
      title: { en: "Anti-Corruption Protests", tl: "Protesta Laban sa Korapsyon" },
      facts: {
        en: ["Why it’s news: Large demonstrations calling for accountability tied to flood-control funds controversy.", "Write it as: Crowd/reporting discipline: counts, permits, advisories.", "Evidence checklist: Organizers, demands, routes, police advisories, incidents.", "Interviews: Organizers, police PIO, rights groups, participants."],
        tl: ["Bakit balita: Malawakang protesta para sa pananagutan sa flood-control funds.", "Isulat bilang: Crowd reporting (bilang, permit, abiso).", "Ebidensya: Organisador, panawagan, ruta, police advisory.", "Interbyu: Organisador, pulis, rights groups, mga raliyista."]
      }
    },
    { 
      title: { en: "Dengue & Post-Typhoon Health Risks", tl: "Dengue at Panganib sa Kalusugan" },
      facts: {
        en: ["Why it’s news: DOH advisories note dengue trends/risks after storms; local LGUs may see spikes.", "Write it as: Public health bulletin with prevention/response actions.", "Evidence checklist: Cases (national/local), affected ages, barangay interventions.", "Interviews: Health Office, school nurse, barangay health workers."],
        tl: ["Bakit balita: Nagbabala ang DOH sa dengue pagkatapos ng mga bagyo.", "Isulat bilang: Public health bulletin na may tips sa pag-iwas.", "Ebidensya: Bilang ng kaso, edad ng apektado, aksyon ng barangay.", "Interbyu: Health Office, school nurse, barangay health workers."]
      }
    },
    { 
      title: { en: "Meralco Rates: Dec 2025 Decrease", tl: "Singil sa Meralco: Bawas ngayong Disyembre" },
      facts: {
        en: ["Why it’s news: Meralco announced lower rates for December 2025.", "Context: Drivers include generation and transmission costs.", "Write it as: Consumer-impact explainer (sample bill computation).", "Evidence checklist: Pesos/kWh movement, causes, consumer advice.", "Interviews: Meralco spokesperson, small business owners, households."],
        tl: ["Bakit balita: Nag-anunsyo ang Meralco ng bawas-singil ngayong Disyembre 2025.", "Konteksto: Dahil sa pagbabago sa generation at transmission costs.", "Isulat bilang: Paliwanag sa epekto sa konsyumer (sample bill).", "Ebidensya: Paggalaw ng presyo per kWh, payo sa konsyumer.", "Interbyu: Meralco spokesperson, negosyante, pamilya."]
      }
    },
    { 
      title: { en: "Infra Corruption Probe & Economy", tl: "Imbestigasyon sa Korapsyon at Ekonomiya" },
      facts: {
        en: ["Why it’s news: BSP rate cut context included corruption scandal affecting confidence.", "Write it as: 'Policy + impact' story (governance issues vs growth/trust).", "Evidence checklist: Official statements, probe mandate, economic indicators.", "Interviews: Economists, procurement experts, civil society watchdogs."],
        tl: ["Bakit balita: Nakaapekto ang isyu ng korapsyon sa tiwala sa ekonomiya.", "Isulat bilang: Kwentong 'Policy + Impact' (epekto sa paglago).", "Ebidensya: Opisyal na pahayag, mandato ng imbestigasyon, economic data.", "Interbyu: Ekonomista, procurement experts, civil society."]
      }
    }
  ],
  feature: [
    { 
      title: { en: "SMES @ Regional Expo: 4th Place", tl: "SMES sa Regional Expo: Ika-4 na Pwesto" },
      facts: {
        en: ["Angle: 'Fourth Place, First Breakthrough' - The unseen grind.", "Focus: Practice runs, revisions, nerves, and lessons learned.", "Interviews: Project lead, coach/mentor, school head.", "Documents: Program, certificates, photos."],
        tl: ["Anggulo: Ang hindi nakikitang pagsisikap sa likod ng pagkapanalo.", "Pokus: Practice runs, rebisyon, kaba, at aral mula sa pagkatalo.", "Interbyu: Project lead, coach, school head.", "Dokumento: Programa, sertipiko, mga larawan."]
      }
    },
    { 
      title: { en: "SMES @ Division Fiesta: Champion", tl: "SMES sa Division Fiesta: Kampeon" },
      facts: {
        en: ["Angle: 'Why SMES won' - Problem-to-solution journey.", "Focus: Community relevance and teamwork.", "Interviews: Team members, division organizer, adviser.", "Documents: Score sheets, certificates."],
        tl: ["Anggulo: Bakit nanalo ang SMES? Mula problema tungong solusyon.", "Pokus: Kahalagahan sa komunidad at pagtutulungan.", "Interbyu: Miyembro ng team, organizer, adviser.", "Dokumento: Score sheets, sertipiko."]
      }
    },
    { 
      title: { en: "Shekienna’s Silver Medal Journey", tl: "Ang Silver Medal ni Shekienna" },
      facts: {
        en: ["Angle: Training discipline and support system.", "Focus: How the athlete stays consistent despite school demands.", "Interviews: Athlete, coach, parent/guardian, PE teacher.", "Documents: Training log, medals."],
        tl: ["Anggulo: Disiplina sa ensayo at suporta ng pamilya/paaralan.", "Pokus: Paano naging konsistent sa kabila ng pag-aaral.", "Interbyu: Atleta, coach, magulang, guro sa PE.", "Dokumento: Training log, medalya."]
      }
    },
    { 
      title: { en: "Elthea Iasha: District to Congressional", tl: "Elthea Iasha: District hanggang Congressional" },
      facts: {
        en: ["Topic: From District Champion to 3rd Place Congressional (Informative Writing).", "Angle: 'How she writes to win' - Habits and routine.", "Focus: Research habits, drafting routine, coaching, confidence.", "Interviews: Elthea, Filipino coach, adviser, parent."],
        tl: ["Paksa: Mula District Champion hanggang 3rd Place sa Congressional.", "Anggulo: Paano siya nagsusulat para manalo?", "Pokus: Research, routine sa pagsulat, coaching, tiwala sa sarili.", "Interbyu: Elthea, coach sa Filipino, adviser, magulang."]
      }
    },
    { 
      title: { en: "SMES Monthly Mass: Faith & Values", tl: "Buwanang Misa ng SMES: Pananampalataya" },
      facts: {
        en: ["Angle: Beyond tradition - shaping discipline and culture.", "Focus: Faith, values, and community inside the campus.", "Interviews: School head, values coordinator, learners, parents.", "Documents: Schedule, photos."],
        tl: ["Anggulo: Higit pa sa tradisyon - paghubog ng disiplina.", "Pokus: Pananampalataya, values, at komunidad sa paaralan.", "Interbyu: School head, values coordinator, mag-aaral.", "Dokumento: Iskedyul, mga larawan."]
      }
    },
    { 
      title: { en: "SMES United Nations Day", tl: "United Nations Day sa SMES" },
      facts: {
        en: ["Angle: The meaning behind costumes/flags.", "Focus: Diversity, peace, and global citizenship.", "Interviews: Event coordinator, class advisers, learners.", "Documents: Program, photos, activity sheets."],
        tl: ["Anggulo: Ang kahulugan sa likod ng mga kasuotan at watawat.", "Pokus: Pagkakaiba-iba, kapayapaan, at global citizenship.", "Interbyu: Coordinator, advisers, mga mag-aaral.", "Dokumento: Programa, larawan, activity sheets."]
      }
    },
    { 
      title: { en: "SMES Buwan ng Wika", tl: "Buwan ng Wika sa SMES" },
      facts: {
        en: ["Angle: 'Wika is more than a program'.", "Focus: Language pride, identity, creativity, and confidence.", "Interviews: Filipino teachers, participants, judges.", "Documents: Rubrics, program, outputs."],
        tl: ["Anggulo: Higit pa sa programa ang Wika.", "Pokus: Pagmamalaki sa wika, identidad, at pagkamalikhain.", "Interbyu: Guro sa Filipino, kalahok, hurado.", "Dokumento: Rubrics, programa, mga gawa."]
      }
    },
    { 
      title: { en: "SMES NIR 4-Star Approach (Bully-Free)", tl: "NIR 4-Star Approach Kontra Bullying" },
      facts: {
        en: ["Angle: Safety is built daily.", "Focus: Prevention, reporting, peer support, restorative discipline.", "Interviews: Guidance counselor, advisers, learners.", "Documents: CPC logs/guidelines, campaign materials."],
        tl: ["Anggulo: Araw-araw binuo ang kaligtasan.", "Pokus: Pag-iwas, pag-uulat, suporta, at disiplina.", "Interbyu: Guidance counselor, advisers, mag-aaral.", "Dokumento: CPC guidelines, campaign materials."]
      }
    },
    { 
      title: { en: "Aike & Jairus: Silver Medal NORAA", tl: "Aike at Jairus: Silver Medal sa NORAA" },
      facts: {
        en: ["Angle: 'Teamwork under pressure'.", "Focus: Preparation, competition moments, handling setbacks.", "Interviews: Aike, Jairus, coach, teammates.", "Documents: Medals, brackets/results, photos."],
        tl: ["Anggulo: Pagtutulungan sa gitna ng pressure.", "Pokus: Paghahanda, sandali ng laban, pagbangon sa pagsubok.", "Interbyu: Aike, Jairus, coach, teammates.", "Dokumento: Medalya, resulta, larawan."]
      }
    },
    { 
      title: { en: "SMES Athletes at NORAA", tl: "Mga Atleta ng SMES sa NORAA" },
      facts: {
        en: ["Angle: One school, many disciplines, one goal.", "Focus: Multi-sport portrait, academics, nutrition, time management.", "Interviews: Athletes, PE coordinator, coaches, parents.", "Documents: Delegation list, training schedules."],
        tl: ["Anggulo: Isang paaralan, iba't ibang laro, iisang layunin.", "Pokus: Balanse sa aral at laro, nutrisyon, oras.", "Interbyu: Mga atleta, PE coordinator, coaches, magulang.", "Dokumento: Listahan ng delegasyon, iskedyul ng ensayo."]
      }
    }
  ],
  editorial: [
    { 
      title: { en: "Flood Control: Transparency Non-Negotiable", tl: "Flood Control: Transparensiya, Di Matatawaran" },
      facts: {
        en: ["Stand: Transparency must be non-negotiable.", "Evidence: Audits, public listings, scale of controversy.", "Counterpoint: 'Audits slow down projects'.", "Call to Action: Publish dashboards, citizen monitoring, blacklisting."],
        tl: ["Paninindigan: Hindi dapat ipagkait ang transparency.", "Ebidensya: Audit, public listing, lawak ng kontrobersya.", "Kontra-punto: 'Nakaka-delay ang audit'.", "Panawagan: I-publish ang dashboards, bantayan ng mamamayan."]
      }
    },
    { 
      title: { en: "Corruption & Trust: A Learning Issue", tl: "Korapsyon at Tiwala: Isyu ng Pagkatuto" },
      facts: {
        en: ["Stand: Accountability is a learning issue, not just politics.", "Evidence: Corruption probe, public outrage.", "Counterpoint: 'Let investigations finish first'.", "Call to Action: Strengthen procurement transparency, civic education."],
        tl: ["Paninindigan: Ang pananagutan ay isyu ng edukasyon, di lang pulitika.", "Ebidensya: Imbestigasyon, galit ng publiko.", "Kontra-punto: 'Tapusin muna ang imbestigasyon'.", "Panawagan: Palakasin ang transparency, edukasyong sibiko."]
      }
    },
    { 
      title: { en: "AI in School: Allow but Regulate", tl: "AI sa Paaralan: Payagan pero Kontrolin" },
      facts: {
        en: ["Stand: Allow AI as a partner, but regulate it.", "Options: Learning partner (tutoring) vs Shortcut (plagiarism).", "Must include: Academic integrity rules, citation of AI, teacher training.", "Call to Action: Teach responsible use."],
        tl: ["Paninindigan: Gamitin ang AI bilang katuwang, pero may limitasyon.", "Opsyon: Tutor vs Pandaraya.", "Isama: Rules sa integrity, tamang citation, training.", "Panawagan: Ituro ang responsableng paggamit."]
      }
    },
    { 
      title: { en: "WeeLMat & Workload: Avoid Burnout", tl: "WeeLMat at Workload: Iwas Burnout" },
      facts: {
        en: ["Stand: Continuity should not equal burnout.", "Anchor: DepEd disaster guidelines + WeeLMat.", "Counterpoint: 'It’s necessary for continuity'.", "Call to Action: Templates, shared banks, admin support, time allocation."],
        tl: ["Paninindigan: Hindi dapat magdulot ng burnout ang continuity.", "Batayan: DepEd guidelines + WeeLMat.", "Kontra-punto: 'Kailangan ito sa pag-aaral'.", "Panawagan: Templates, suporta ng admin, tamang oras."]
      }
    },
    { 
      title: { en: "Typhoon Readiness: Practice as Subject", tl: "Kahandaan sa Bagyo: Ituring na Asignatura" },
      facts: {
        en: ["Stand: Disaster prep should be practiced like a subject.", "Evidence: Repeated severe weather impacts.", "Counterpoint: 'Drills waste class time'.", "Call to Action: Regular drills, go-bags, mental health support."],
        tl: ["Paninindigan: Dapat praktisin ang disaster prep parang leksyon.", "Ebidensya: Madalas na kalamidad.", "Kontra-punto: 'Sayang sa oras ang drill'.", "Panawagan: Regular na drill, go-bags, suportang mental."]
      }
    },
    { 
      title: { en: "Dengue Prevention: Discipline Saves Lives", tl: "Iwas Dengue: Disiplina ang Sagip-Buhay" },
      facts: {
        en: ["Stand: Discipline at home/school saves lives.", "Evidence: DOH advisories, case monitoring.", "Counterpoint: 'Fogging is enough'.", "Call to Action: Clean-up routines, water checks, school-community coordination."],
        tl: ["Paninindigan: Disiplina sa bahay/paaralan ang solusyon.", "Ebidensya: Babala ng DOH, bilang ng kaso.", "Kontra-punto: 'Sapat na ang fogging'.", "Panawagan: Linis-paligid, check ng tubig, koordinasyon."]
      }
    },
    { 
      title: { en: "Impeachment Discourse: Teach Facts", tl: "Usapang Impeachment: Ituro ang Katotohanan" },
      facts: {
        en: ["Stand: Teach process, facts, and civility.", "Evidence: SC ruling, constitutional limits.", "Counterpoint: 'It’s too political for students'.", "Call to Action: Civic literacy—focus on institutions, due process."],
        tl: ["Paninindigan: Ituro ang proseso at respeto.", "Ebidensya: Desisyon ng SC, konstitusyon.", "Kontra-punto: 'Masyadong pulitikal para sa bata'.", "Panawagan: Civic literacy, due process, institusyon."]
      }
    },
    { 
      title: { en: "WPS: Defend Rights, Protect Lives", tl: "WPS: Ipagtanggol ang Karapatan at Buhay" },
      facts: {
        en: ["Stand: Defend rights while protecting lives.", "Evidence: Incident reports, claims.", "Counterpoint: 'Any stand risks escalation'.", "Call to Action: Fisherfolk protection, diplomacy, law literacy."],
        tl: ["Paninindigan: Ipaglaban ang karapatan at buhay.", "Ebidensya: Ulat ng insidente.", "Kontra-punto: 'Nakakatakot ang gulo'.", "Panawagan: Proteksyon sa mangingisda, diplomasya."]
      }
    },
    { 
      title: { en: "Power Costs: Make it Understandable", tl: "Presyo ng Kuryente: Gawing Malinaw" },
      facts: {
        en: ["Stand: Electricity pricing must be understandable.", "Evidence: Rate advisories, consumer impact.", "Counterpoint: 'Rates are technical; consumers won’t care'.", "Call to Action: Transparent bills, energy-saving programs."],
        tl: ["Paninindigan: Dapat maintindihan ang presyo ng kuryente.", "Ebidensya: Abiso sa presyo, epekto sa tao.", "Kontra-punto: 'Masyadong teknikal yan'.", "Panawagan: Malinaw na bill, tips sa pagtitipid."]
      }
    },
    { 
      title: { en: "Student Journalism in AI Era: Credibility", tl: "Student Journalism sa AI Era: Kredibilidad" },
      facts: {
        en: ["Stand: Credibility is your competitive advantage.", "Focus: Verification over virality.", "Call to Action: Fact-check checklist, source grading, ethics pledge."],
        tl: ["Paninindigan: Kredibilidad ang iyong bentahe.", "Pokus: Beripikasyon bago mag-viral.", "Panawagan: Fact-check checklist, tamang sources, ethics pledge."]
      }
    }
  ]
};

// --- Components ---

// 0. Tutorial Section Component
const TutorialSection = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<Category>('news');
  const content = TUTORIALS[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-50 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border-4 border-emerald-900">
        <div className="bg-emerald-900 p-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
             <div className="bg-white p-2 rounded-lg">
                <GraduationCap className="w-8 h-8 text-emerald-900" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white font-serif tracking-wide">Journalism Training Camp</h2>
               <p className="text-emerald-200 text-sm">Master the art of News, Feature, and Editorial writing</p>
             </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-2 hover:bg-emerald-800 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex bg-stone-200 border-b border-stone-300">
          {(['news', 'feature', 'editorial'] as const).map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveTab(cat)}
               className={`flex-1 py-4 text-center font-bold font-serif text-lg transition-all border-b-4 ${
                 activeTab === cat 
                   ? 'bg-stone-50 text-red-700 border-red-700' 
                   : 'text-stone-500 border-transparent hover:bg-stone-100'
               }`}
             >
               {cat.charAt(0).toUpperCase() + cat.slice(1)} Writing
             </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-stone-50">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="border-b-2 border-stone-200 pb-6">
              <h3 className="text-3xl font-bold text-stone-800 font-serif mb-4 flex items-center gap-3">
                 {activeTab === 'news' && <Newspaper className="w-8 h-8 text-sky-700" />}
                 {activeTab === 'feature' && <Feather className="w-8 h-8 text-emerald-700" />}
                 {activeTab === 'editorial' && <Megaphone className="w-8 h-8 text-red-700" />}
                 {content.title}
              </h3>
              <p className="text-lg text-stone-600 leading-relaxed font-serif">
                {content.intro}
              </p>
            </div>

            {/* Tips Section */}
            <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
              <h4 className="text-xl font-bold text-red-800 mb-6 uppercase tracking-widest font-sans flex items-center gap-2">
                <Award className="w-5 h-5" /> Key Guidelines & Tips
              </h4>
              <ul className="space-y-4">
                {content.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-400 border border-stone-300 font-serif">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="block text-stone-800 font-bold mb-1">{tip.title}</strong>
                      <span className="text-stone-600 leading-relaxed">{tip.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Videos Section */}
            <div>
               <h4 className="text-xl font-bold text-red-800 mb-6 uppercase tracking-widest font-sans flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Video Resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {content.videos.map((videoId) => (
                  <a 
                    key={videoId} 
                    href={`https://www.youtube.com/watch?v=${videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg hover:border-red-300 transition-all"
                  >
                    <div className="relative aspect-video bg-black">
                      <img 
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wide bg-stone-50 group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                      <span>Watch Tutorial</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 1. Auth Screen
const AuthScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // REGISTER
        if (!fullName || !email || !password) {
          throw new Error("All fields are required.");
        }
        
        if (supabase) {
           // Supabase Registration
           const { data, error: signUpError } = await supabase.auth.signUp({
             email,
             password,
             options: {
               data: { full_name: fullName, role: role },
               emailRedirectTo: window.location.origin
             }
           });
           
           if (signUpError) throw signUpError;
           
           if (data.user && !data.session) {
             setVerificationSent(true);
             setIsLoading(false);
             return;
           }

           if (data.user) {
             const newUser: User = {
               id: data.user.id,
               name: fullName,
               email: data.user.email || email,
               role: role,
               schoolId: 'skyline_high'
             };
             // Optional: You could still sync to local backend if needed
             // Backend.saveUser(newUser); 
             
             setSuccess("Account created! Check email for confirmation or log in if confirmation is disabled.");
             // Automatically log them in if Supabase returns a session immediately (depends on config)
             if (data.session) {
                setTimeout(() => onLogin(newUser), 1000);
             } else {
                setIsLoading(false);
             }
           }
        } else {
          // Fallback Local Mock Registration
          const users = Backend.getUsers();
          if (users.find(u => u.email === email)) {
            throw new Error("Email is already registered.");
          }

          const newUser: User = {
            id: `user_${Date.now()}`,
            name: fullName,
            email,
            password, // In a real app, hash this!
            role,
            schoolId: 'skyline_high'
          };

          Backend.saveUser(newUser);
          setSuccess("Account created successfully! Logging you in...");
          setTimeout(() => onLogin(newUser), 1000);
        }

      } else {
        // LOGIN
        if (supabase) {
           const { data, error: signInError } = await supabase.auth.signInWithPassword({
             email,
             password
           });
           
           if (signInError) throw signInError;
           
           if (data.user) {
             const loggedInUser: User = {
               id: data.user.id,
               name: data.user.user_metadata.full_name || email.split('@')[0],
               email: data.user.email || email,
               role: data.user.user_metadata.role || 'student',
               schoolId: 'skyline_high'
             };
             onLogin(loggedInUser);
           }
        } else {
          // Fallback Local Mock Login
          const users = Backend.getUsers();
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            onLogin(user);
          } else {
            // Backdoor for demo teacher if no users exist yet and keys are empty
            if (users.length === 0 && email === 'teacher@demo.com' && password === 'admin') {
               const admin: User = { id: 'admin', name: 'Admin Teacher', email, role: 'teacher', schoolId: 's1' };
               Backend.saveUser(admin);
               onLogin(admin);
               return;
            }
            throw new Error("Invalid email or password. Please try again or create an account.");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
          <div className="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border-4 border-emerald-900 p-8 text-center">
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-emerald-700" />
               </div>
               <h2 className="text-2xl font-bold text-stone-800 font-serif mb-4">Check Your Email</h2>
               <p className="text-stone-600 mb-6">
                 We've sent a verification link to <span className="font-bold text-stone-800">{email}</span>. 
                 Please click the link to verify your account and log in.
               </p>
               <button 
                 onClick={() => setVerificationSent(false)}
                 className="text-emerald-700 font-bold hover:underline"
               >
                 Back to Login
               </button>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
      <div className="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border-4 border-emerald-900">
        <div className="p-8 bg-stone-100 text-center relative border-b border-stone-200">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-emerald-800">
              <img src={LOGO_URL} alt="SMES Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-1 font-serif">SMES Skyline</h1>
          <p className="text-red-700 font-medium tracking-wide text-sm uppercase">San Miguel Elementary School</p>
        </div>
        
        <div className="p-8">
          <div className="flex bg-stone-200 p-1 rounded-lg mb-6">
            <button 
              onClick={() => { setRole('student'); setIsRegistering(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'student' ? 'bg-white shadow text-red-700' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Student
            </button>
            <button 
              onClick={() => { setRole('teacher'); setIsRegistering(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'teacher' ? 'bg-white shadow text-emerald-700' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-stone-800 text-center mb-4 font-serif">
              {isRegistering ? `Create ${role === 'student' ? 'Student' : 'Teacher'} Account` : 'Welcome Back'}
            </h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-stone-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white text-stone-900"
                  placeholder="Juan Dela Cruz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white text-stone-900"
                placeholder={role === 'student' ? 'juan@student.edu' : 'teacher@school.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white text-stone-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed
                ${role === 'student' ? 'bg-red-700 hover:bg-red-800 shadow-red-700/30' : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/30'}
              `}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isRegistering ? 'Register' : 'Login'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500">
             {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
             <button 
               onClick={() => setIsRegistering(!isRegistering)}
               className={`font-bold hover:underline ${role === 'student' ? 'text-red-700' : 'text-emerald-700'}`}
             >
               {isRegistering ? "Login here" : "Register now"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Writing Workspace (The Core)
const WritingWorkspace = ({ 
  prompt, 
  user, 
  onBack,
  onSave 
}: { 
  prompt: Prompt; 
  user: User; 
  onBack: () => void; 
  onSave: (content: string) => void;
}) => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'builder' | 'draft' | 'checklist'>('builder');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const isFilipino = prompt.language === 'filipino';

  // Specific Labels based on Language
  const labels = {
    builder: isFilipino ? 'Mga Ideya' : 'Idea Builder',
    draft: isFilipino ? 'Burador' : 'Draft',
    checklist: isFilipino ? 'Tseklist' : 'Checklist',
    submit: isFilipino ? 'Ipasa sa Guro' : 'Submit to Teacher',
    save: isFilipino ? 'I-save' : 'Save',
    facts: isFilipino ? 'Mga Datos' : 'Fact Pack',
    back: isFilipino ? 'Bumalik' : 'Back',
    notes: isFilipino ? 'Mga Tala' : 'Notes',
  };

  const handleEditorSubmit = () => {
    if (content.trim().length < 50) {
      alert(isFilipino ? "Masyadong maikli ang iyong gawa." : "Your submission is too short.");
      return;
    }
    if (confirm(isFilipino ? "Sigurado ka bang ipapasa ito sa iyong guro?" : "Are you sure you want to submit this to your teacher?")) {
      onSave(content);
    }
  };

  // Helper to render Builder Content based on Category
  const renderIdeaBuilder = () => {
    if (prompt.category === 'news') {
      return (
        <div className="space-y-6">
          <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mb-4">
             <h4 className="font-bold text-sky-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
               <Newspaper className="w-4 h-4" />
               {isFilipino ? 'Ang Pamatnubay (Lead)' : 'The Lead Structure'}
             </h4>
             <p className="text-xs text-sky-700">
               {isFilipino 
                 ? 'Ang unang talata ay dapat sumagot sa pinakamahalagang tanong.' 
                 : 'The first paragraph should answer the most important questions immediately.'}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isFilipino ? 'Sino (Who)' : 'Who'}
              </label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none bg-white" placeholder="..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isFilipino ? 'Ano (What)' : 'What'}
              </label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none bg-white" placeholder="..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isFilipino ? 'Kailan (When)' : 'When'}
              </label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none bg-white" placeholder="..." />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {isFilipino ? 'Saan (Where)' : 'Where'}
              </label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none bg-white" placeholder="..." />
            </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
               {isFilipino ? 'Bakit / Paano (Why/How)' : 'Why / How'}
             </label>
             <textarea className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none bg-white" rows={2} placeholder="..." />
          </div>
        </div>
      );
    } 
    
    if (prompt.category === 'feature') {
      return (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-4">
             <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
               <Feather className="w-4 h-4" />
               {isFilipino ? 'Paggising sa Damdamin' : 'Sensory Details'}
             </h4>
             <p className="text-xs text-emerald-700">
               {isFilipino 
                 ? 'Gamitin ang iyong pandama upang dalhin ang mambabasa sa kwento.' 
                 : 'Use your senses to transport the reader into the story. Show, don\'t tell.'}
             </p>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
               <Mic className="w-3 h-3" /> {isFilipino ? 'Pambungad (Hook)' : 'The Hook'}
             </label>
             <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white" placeholder={isFilipino ? "Isang tanong, sipi, o paglalarawan..." : "A question, quote, or vivid description..."} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                   <Eye className="w-3 h-3" /> {isFilipino ? 'Paningin' : 'Sight'}
                </label>
                <textarea className="w-full p-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white" rows={3} placeholder="..." />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                   <Mic className="w-3 h-3" /> {isFilipino ? 'Pandinig' : 'Sound'}
                </label>
                <textarea className="w-full p-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white" rows={3} placeholder="..." />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                   <Heart className="w-3 h-3" /> {isFilipino ? 'Damdamin' : 'Emotion'}
                </label>
                <textarea className="w-full p-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white" rows={3} placeholder="..." />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
               {isFilipino ? 'Ang "Nut Graph" (Tema)' : 'The Nut Graph (Theme)'}
             </label>
             <textarea className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none bg-white" rows={2} placeholder={isFilipino ? "Bakit mahalaga ang kwentong ito ngayon?" : "Why does this story matter right now?"} />
          </div>
        </div>
      );
    }

    // Editorial (SPECS Model)
    return (
      <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
             <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
               <Megaphone className="w-4 h-4" />
               SPECS Model
             </h4>
             <p className="text-xs text-red-700">
               State the problem, Position, Evidence, Conclusion, Solution.
             </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              State the Problem (Isyu)
            </label>
            <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none bg-white" placeholder="..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Position (Paninindigan)
              </label>
              <textarea className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none bg-white" rows={4} placeholder="..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Evidence (Ebidensya)
              </label>
              <textarea className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none bg-white" rows={4} placeholder="..." />
            </div>
          </div>
          
           <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Solution (Solusyon)
              </label>
              <input type="text" className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none bg-white" placeholder="..." />
            </div>
      </div>
    );
  };

  // Helper for dynamic checklists
  const getChecklistItems = () => {
    const common = [
      { l: isFilipino ? 'Tamang pagbabaybay (Spelling)' : 'Correct spelling', c: true },
      { l: isFilipino ? 'Wastong bantas (Punctuation)' : 'Correct punctuation', c: true },
    ];

    if (prompt.category === 'news') {
      return [
        { l: 'Lead < 35 words', c: content.length > 0 && content.split('.')[0].split(' ').length < 35 },
        { l: 'No opinion (I/Me/My)', c: content.length > 0 && !/\b(I|me|my|mine|we|us|our)\b/i.test(content) },
        { l: 'Who, What, When, Where included', c: false },
        ...common
      ];
    }
    if (prompt.category === 'feature') {
      return [
        { l: 'Strong Hook/Intro', c: content.length > 50 },
        { l: 'Uses sensory words', c: /\b(see|hear|felt|smell|taste|bright|loud|soft|rough)\b/i.test(content) },
        { l: 'Creative transitions', c: false },
        ...common
      ];
    }
    // Editorial
    return [
      { l: 'Clear stance stated', c: content.length > 50 },
      { l: 'At least 2 supporting arguments', c: false },
      { l: 'Call to action included', c: false },
      ...common
    ];
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full text-stone-600">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-stone-800 flex items-center gap-2 font-serif">
              {prompt.isPractice && <span className="bg-stone-200 text-stone-600 text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold sans-serif">{isFilipino ? 'Paksa' : 'Topic'}</span>}
              {prompt.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                prompt.category === 'news' ? 'bg-sky-100 text-sky-700' :
                prompt.category === 'editorial' ? 'bg-red-100 text-red-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {prompt.category}
              </span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>Autosaved</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert("Simulated Save: Draft saved to device.")}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{labels.save}</span>
          </button>
          <button 
            onClick={handleEditorSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-medium shadow-md shadow-red-700/20 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{labels.submit}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Source Material */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-stone-100 border-r border-stone-200 transition-all duration-300 flex flex-col overflow-hidden`}>
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-bold text-stone-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {prompt.isPractice ? labels.notes : labels.facts}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-sm text-stone-500 italic mb-4 font-serif">{prompt.instructions}</p>
            {prompt.facts.length > 0 ? (
               prompt.facts.map((fact, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-3 rounded-md border border-stone-200 shadow-sm text-sm text-stone-700 cursor-move hover:border-red-400 transition-colors"
                  draggable
                >
                  {fact}
                </div>
              ))
            ) : (
              <div className="text-sm text-stone-400 text-center p-4 border-2 border-dashed border-stone-200 rounded-lg">
                {isFilipino 
                  ? <span>Walang tiyak na datos para sa paksang ito. Magsaliksik tungkol sa <strong>{prompt.title}</strong> at ilista ang iyong mga nahanap na datos dito.</span>
                  : <span>No specific facts provided for this topic. Use the Internet to research <strong>{prompt.title}</strong> and list your gathered facts here manually if needed.</span>
                }
              </div>
            )}
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-6 left-6 z-20 bg-stone-800 text-white p-2 rounded-full shadow-lg hover:bg-stone-700 transition-colors"
          title="Toggle Fact Panel"
        >
          {sidebarOpen ? <Menu className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
        </button>

        {/* Right Panel: Workspace */}
        <div className="flex-1 flex flex-col bg-stone-50">
          {/* Tabs */}
          <div className="flex border-b border-stone-200 bg-white">
            {(['builder', 'draft', 'checklist'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold tracking-wide border-b-4 transition-colors ${
                  activeTab === tab 
                    ? 'border-red-700 text-red-800 bg-stone-50' 
                    : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                }`}
              >
                {labels[tab]}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-stone-100/50">
            {activeTab === 'builder' && (
              <div className="p-6 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <h3 className="text-lg font-bold text-stone-800 mb-4 font-serif">
                    {isFilipino ? 'Balangkasin ang Ideya' : 'Structure Your Draft'}
                  </h3>
                  {renderIdeaBuilder()}
                </div>
              </div>
            )}

            {activeTab === 'draft' && (
              <div className="h-full flex flex-col">
                <textarea
                  className="flex-1 w-full p-8 text-lg leading-relaxed resize-none outline-none font-serif text-stone-900 bg-white"
                  placeholder={isFilipino ? "Magsimulang magsulat dito..." : "Start writing here..."}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="p-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                  <div className="p-4 bg-stone-50 border-b border-stone-200">
                    <h3 className="font-bold text-stone-700">
                      {isFilipino ? 'Pamantayan sa Pagsulat' : 'Writing Standards'}
                    </h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {getChecklistItems().map((item, i) => (
                      <div key={i} className="p-4 flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.c ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-300'}`}>
                           {item.c && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <span className={item.c ? 'text-stone-700' : 'text-stone-400'}>{item.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Student Dashboard
const StudentDashboard = ({ user, onSelectPrompt }: { user: User; onSelectPrompt: (prompt: Prompt) => void }) => {
  const [category, setCategory] = useState<Category>('news');
  const [language, setLanguage] = useState<Language>('english');
  const [showTutorial, setShowTutorial] = useState(false);

  const trends = TRENDS[category];

  const handleSelect = (trend: TrendTopic) => {
    const prompt: Prompt = {
      id: `p_${Date.now()}`,
      title: language === 'english' ? trend.title.en : trend.title.tl,
      category,
      language,
      facts: language === 'english' ? trend.facts.en : trend.facts.tl,
      instructions: language === 'english' 
        ? `Write a ${category} article based on the facts provided.`
        : `Sumulat ng ${category === 'news' ? 'balita' : category === 'feature' ? 'lathalain' : 'editoryal'} gamit ang mga datos na ibinigay.`,
      isPractice: true
    };
    onSelectPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {showTutorial && <TutorialSection onClose={() => setShowTutorial(false)} />}
      
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-white p-1.5 rounded-full">
               <img src={LOGO_URL} alt="Logo" className="w-8 h-8 rounded-full" />
             </div>
             <div>
               <h1 className="font-bold text-lg leading-tight font-serif">The Skyline</h1>
               <p className="text-emerald-300 text-xs uppercase tracking-wider">Student Newsroom</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="font-bold text-sm">{user.name}</p>
               <p className="text-emerald-300 text-xs">Student Journalist</p>
             </div>
             <button 
               onClick={() => setShowTutorial(true)}
               className="bg-emerald-800 hover:bg-emerald-700 p-2 rounded-lg transition-colors text-emerald-100"
               title="Open Tutorials"
             >
               <GraduationCap className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div>
             <h2 className="text-2xl font-bold text-stone-800 font-serif mb-1">Assignment Board</h2>
             <p className="text-stone-500 text-sm">Select a topic to start writing your article.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex bg-stone-100 p-1 rounded-lg">
                {(['english', 'filipino'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                      language === l ? 'bg-white shadow text-emerald-900' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex bg-stone-100 p-1 rounded-lg">
                {(['news', 'feature', 'editorial'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${
                      category === c ? 'bg-white shadow text-emerald-900' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Trend Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-200 group flex flex-col h-full"
            >
              <div className={`h-2 w-full ${
                category === 'news' ? 'bg-sky-600' : 
                category === 'editorial' ? 'bg-red-600' : 
                'bg-emerald-600'
              }`} />
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                    category === 'news' ? 'bg-sky-50 text-sky-700' : 
                    category === 'editorial' ? 'bg-red-50 text-red-700' : 
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {category}
                  </span>
                  {idx < 2 && (
                    <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-stone-800 mb-3 font-serif leading-tight group-hover:text-red-800 transition-colors">
                  {language === 'english' ? trend.title.en : trend.title.tl}
                </h3>
                
                <p className="text-stone-500 text-sm mb-6 line-clamp-3 flex-1">
                  {(language === 'english' ? trend.facts.en : trend.facts.tl)[0]}
                </p>

                <button 
                  onClick={() => handleSelect(trend)}
                  className="w-full py-3 border-2 border-stone-100 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-stone-600 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <PenTool className="w-4 h-4" />
                  {language === 'english' ? 'Start Writing' : 'Magsimula'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// 4. Teacher Dashboard
const TeacherDashboard = ({ user }: { user: User }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    // Load submissions
    setSubmissions(Backend.getSubmissions());
  }, []);

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-stone-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-emerald-600 p-2 rounded-lg">
               <FileText className="w-5 h-5 text-white" />
             </div>
             <div>
               <h1 className="font-bold text-xl font-serif">Editorial Desk</h1>
               <p className="text-stone-400 text-xs uppercase tracking-wider">Faculty Administration</p>
             </div>
           </div>
           <div className="text-right">
             <p className="font-bold text-sm">{user.name}</p>
             <p className="text-emerald-400 text-xs">Adviser / Editor</p>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Student Submissions
            </h2>
            <span className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-bold">
              {submissions.length} Items
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-stone-400">
               <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                 <FileText className="w-8 h-8 opacity-50" />
               </div>
               <p>No submissions found yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-6 hover:bg-stone-50 transition-colors group">
                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            sub.category === 'news' ? 'bg-sky-100 text-sky-700' :
                            sub.category === 'editorial' ? 'bg-red-100 text-red-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {sub.category}
                          </span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 font-medium">
                            {new Date(sub.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg font-serif group-hover:text-red-800 transition-colors">
                          {sub.promptTitle}
                        </h3>
                        <p className="text-sm text-stone-500">
                          by <span className="font-bold text-stone-700">{sub.studentName}</span> ({sub.studentId})
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                         <button className="px-3 py-1.5 border border-stone-300 rounded text-sm font-bold text-stone-600 hover:bg-white hover:border-stone-400 transition-all shadow-sm">
                           View
                         </button>
                         <button className="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm">
                           Grade
                         </button>
                      </div>
                   </div>
                   <div className="bg-stone-100/50 p-4 rounded-lg border border-stone-200">
                     <p className="text-stone-600 font-serif text-sm line-clamp-3 italic">
                       "{sub.content}"
                     </p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Main App Container ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);

  // Check for session (Local + Supabase if available)
  useEffect(() => {
    // Check local storage first (covers both mock and persisted Supabase session potentially)
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Optional: If Supabase is active, check real session
    if (supabase) {
      // 1. Check initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          const u: User = {
             id: session.user.id,
             name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
             email: session.user.email || '',
             role: session.user.user_metadata.role || 'student',
             schoolId: 'skyline_high'
          };
          setUser(u);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(u));
        }
      });

      // 2. Listen for auth changes (redirects, magic links, sign outs)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         if (session && session.user) {
            const u: User = {
               id: session.user.id,
               name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
               email: session.user.email || '',
               role: session.user.user_metadata.role || 'student',
               schoolId: 'skyline_high'
            };
            setUser(u);
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(u));
         } else if (_event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
         }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(u));
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setActivePrompt(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const handleSaveSubmission = (content: string) => {
    if (!user || !activePrompt) return;

    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      promptId: activePrompt.id,
      promptTitle: activePrompt.title,
      studentId: user.id,
      studentName: user.name,
      content: content,
      category: activePrompt.category,
      date: new Date().toISOString(),
      status: 'submitted'
    };

    Backend.saveSubmission(newSubmission);
    alert("Success! Your article has been sent to the teacher.");
    setActivePrompt(null); // Return to dashboard
  };

  // Render logic
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (activePrompt) {
    return (
      <WritingWorkspace 
        prompt={activePrompt} 
        user={user} 
        onBack={() => setActivePrompt(null)} 
        onSave={handleSaveSubmission}
      />
    );
  }

  return (
    <div>
      {user.role === 'student' ? (
        <StudentDashboard user={user} onSelectPrompt={setActivePrompt} />
      ) : (
        <TeacherDashboard user={user} />
      )}
      
      {/* Floating Logout for Demo */}
      <button 
        onClick={handleLogout}
        className="fixed bottom-4 right-4 p-3 bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-700 transition-colors z-50 flex items-center gap-2 border-2 border-stone-600"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-xs font-bold pr-1">LOGOUT</span>
      </button>
    </div>
  );
};

// Render
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}