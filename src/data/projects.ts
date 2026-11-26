import type { Locale } from "@/lib/i18n";

export interface ProjectEntry {
  slug: string;
  index: string;
  visualType:
    | "restaurant"
    | "chatbotpro"
    | "lexassist"
    | "elearning"
    | "voice-agent"
    | "rpa-workflow"
    | "rpa-platform";
  title: Record<Locale, string>;
  category: Record<Locale, string>;
  status: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  challenge: Record<Locale, string>;
  solution: Record<Locale, string>;
  features: Record<Locale, string[]>;
  architectureHighlights: Record<Locale, string[]>;
  stack: string[];
}

export const projects: ProjectEntry[] = [
  {
    slug: "restaurant-management-platform",
    index: "01",
    visualType: "restaurant",
    title: {
      en: "Restaurant Management Platform",
      fr: "Plateforme de Gestion pour la Restauration",
    },
    category: {
      en: "Custom Software / Restaurant Technology",
      fr: "Logiciel sur Mesure / Technologie Restauration",
    },
    status: {
      en: "Custom Software",
      fr: "Logiciel sur Mesure",
    },
    shortDescription: {
      en: "Custom software for restaurant operations, including QR ordering, order management, kitchen display, receipt printing and sales reporting.",
      fr: "Logiciel sur mesure pour les opérations de restauration : commande par QR code, gestion des commandes, écran cuisine, impression de tickets et suivi des ventes.",
    },
    challenge: {
      en: "Independent and multi-site restaurants often rely on disconnected point-of-sale tools, paper kitchen tickets, and manual end-of-day sales reconciliation. This fragmentation slows down table turnover and increases order errors during peak hours.",
      fr: "Les établissements de restauration s'appuient souvent sur des outils cloisonnés, des bons papier en cuisine et un rapprochement manuel des ventes en fin de service. Cette fragmentation ralentit le service et multiplie les erreurs en période d'affluence.",
    },
    solution: {
      en: "We designed a unified web-based operational platform connecting guest QR ordering directly to centralized order management and a real-time Kitchen Display System (KDS), backed by deterministic receipt printing and structured sales reporting.",
      fr: "Nous avons conçu une plateforme web unifiée reliant la commande par QR code à une gestion centralisée des commandes et à un écran cuisine temps réel (KDS), avec impression de tickets et rapports de ventes structurés.",
    },
    features: {
      en: [
        "QR ordering",
        "Order management",
        "Kitchen display system",
        "Receipt printing",
        "Sales reporting",
      ],
      fr: [
        "Commande par QR code",
        "Gestion des commandes",
        "Écran de suivi cuisine (KDS)",
        "Impression de tickets",
        "Rapports de ventes",
      ],
    },
    architectureHighlights: {
      en: [
        "Real-time order state synchronization between QR tables, front-of-house, and kitchen stations.",
        "Deterministic thermal receipt printing queue supporting kitchen prep tickets and customer receipts.",
        "Centralized order management console for dine-in, takeaway, and table status tracking.",
        "Daily sales reporting module breaking down payment methods, item volume, and shift totals.",
      ],
      fr: [
        "Synchronisation temps réel des statuts de commande entre QR, salle et postes cuisine.",
        "File d'impression thermique déterministe pour bons cuisine et tickets clients.",
        "Console centralisée pour le suivi des commandes sur place, à emporter et des tables.",
        "Module de rapports de ventes détaillant modes de paiement, volumes et totaux par service.",
      ],
    },
    stack: ["Next.js", "TypeScript", "Real-Time Sync", "Thermal Print Bridge", "PostgreSQL"],
  },
  {
    slug: "chatbotpro",
    index: "02",
    visualType: "chatbotpro",
    title: {
      en: "ChatbotPro",
      fr: "ChatbotPro",
    },
    category: {
      en: "Multi-Tenant AI SaaS",
      fr: "SaaS IA Multi-Locataires",
    },
    status: {
      en: "SaaS Platform",
      fr: "Plateforme SaaS",
    },
    shortDescription: {
      en: "Multi-tenant AI chatbot SaaS platform allowing businesses to customize their own AI chatbot and embed it into any website using a simple HTML/JavaScript snippet.",
      fr: "Plateforme SaaS multi-locataires permettant aux entreprises de personnaliser leur propre chatbot IA et de l'intégrer sur n'importe quel site via un simple extrait HTML/JavaScript.",
    },
    challenge: {
      en: "Businesses want to deploy tailored AI support assistants on their websites without building custom LLM infrastructure, managing tenant isolation, or dealing with complex frontend integrations.",
      fr: "Les entreprises souhaitent déployer des assistants IA sur leur site sans devoir bâtir une infrastructure LLM dédiée, gérer l'isolation des données ni subir une intégration complexe.",
    },
    solution: {
      en: "We architected a multi-tenant SaaS platform where each organization configures its assistant's branding, knowledge sources, and behavior from a clean workspace—then deploys it anywhere with a lightweight HTML/JavaScript embed snippet.",
      fr: "Nous avons conçu une plateforme SaaS multi-locataires où chaque organisation configure l'identité, la base de connaissances et les règles de son assistant, puis le déploie partout grâce à un extrait HTML/JavaScript léger.",
    },
    features: {
      en: [
        "Multi-tenant workspace isolation",
        "Custom assistant branding & tone",
        "Knowledge base ingestion",
        "One-line HTML/JS embed snippet",
      ],
      fr: [
        "Isolation multi-locataires",
        "Personnalisation du ton et de l'interface",
        "Ingestion de base de connaissances",
        "Intégration par extrait HTML/JS",
      ],
    },
    architectureHighlights: {
      en: [
        "Tenant-isolated vector indexes and configuration profiles ensuring zero cross-client data leakage.",
        "Zero-dependency embeddable JavaScript widget designed to load asynchronously without slowing host pages.",
        "Live customization studio for brand colors, welcome prompts, and fallback escalation rules.",
        "Domain allowlisting and token-scoped API endpoints for secure public website embedding.",
      ],
      fr: [
        "Index vectoriels et profils isolés par locataire garantissant aucune fuite de données entre clients.",
        "Widget JavaScript embarquable sans dépendance, chargé de façon asynchrone sans ralentir le site hôte.",
        "Studio de personnalisation en direct pour les couleurs, messages d'accueil et règles d'escalade.",
        "Liste blanche de domaines et endpoints sécurisés par jeton pour l'intégration publique.",
      ],
    },
    stack: ["Next.js", "TypeScript", "Multi-Tenant SaaS", "Embeddable JS Widget", "RAG"],
  },
  {
    slug: "lexassist",
    index: "03",
    visualType: "lexassist",
    title: {
      en: "LexAssist",
      fr: "LexAssist",
    },
    category: {
      en: "Desktop AI / Legal Technology",
      fr: "IA Desktop / LegalTech",
    },
    status: {
      en: "Desktop AI System",
      fr: "Système IA Desktop",
    },
    shortDescription: {
      en: "Desktop-based local AI legal assistant with RAG-powered document search, client information retrieval, source citations and optional online research.",
      fr: "Assistant juridique IA local sur ordinateur intégrant recherche documentaire RAG, récupération d'informations clients, citations de sources et recherche en ligne optionnelle.",
    },
    challenge: {
      en: "Legal professionals handle sensitive case files and client records that cannot be freely uploaded to third-party cloud chatbots, yet reviewing hundreds of documents manually slows down legal research.",
      fr: "Les professionnels du droit manipulent des dossiers sensibles et confidentiels qui ne peuvent pas être exposés à des services cloud publics, alors que l'analyse manuelle de centaines de pièces ralentit la recherche juridique.",
    },
    solution: {
      en: "We designed a privacy-first desktop AI assistant that indexes local case documents and client records on-device using RAG, returns answers with verifiable source citations, and provides an explicit toggle for optional online research.",
      fr: "Nous avons conçu un assistant IA desktop axé sur la confidentialité qui indexe localement les dossiers et fiches clients via RAG, fournit des réponses avec citations vérifiables et propose une activation explicite pour la recherche en ligne.",
    },
    features: {
      en: [
        "Local desktop execution",
        "RAG-powered document search",
        "Client information retrieval",
        "Verifiable source citations",
        "Optional online research mode",
      ],
      fr: [
        "Exécution locale sur poste de travail",
        "Recherche documentaire par RAG",
        "Récupération d'informations clients",
        "Citations précises des sources",
        "Mode recherche en ligne optionnel",
      ],
    },
    architectureHighlights: {
      en: [
        "Local-first document ingestion pipeline supporting PDF, DOCX, and structured case folders.",
        "Strict citation-linking engine referencing exact file names, page numbers, and clauses.",
        "Client context index separating matters and parties for rapid dossier lookup.",
        "Explicit air-gapped vs. online-research switch giving practitioners full control over external queries.",
      ],
      fr: [
        "Pipeline d'ingestion local supportant PDF, DOCX et arborescences de dossiers.",
        "Moteur de citations strict reliant chaque réponse au document, à la page et à la clause exacte.",
        "Index contextuel par client séparant affaires et parties pour un accès rapide.",
        "Sélecteur explicite entre mode hors-ligne strict et recherche web optionnelle.",
      ],
    },
    stack: ["Desktop App", "Local LLM / RAG", "Document Indexing", "Citation Engine", "Python / TS"],
  },
  {
    slug: "website-and-elearning-platform",
    index: "04",
    visualType: "elearning",
    title: {
      en: "Website & E-learning Platform",
      fr: "Site Web & Plateforme E-learning",
    },
    category: {
      en: "WordPress / E-learning & Automation",
      fr: "WordPress / E-learning & Automatisation",
    },
    status: {
      en: "Web & Automation",
      fr: "Web & Automatisation",
    },
    shortDescription: {
      en: "Website and online course management platform built with WordPress and its plugin ecosystem, paired with social media automation powered by ManyChat.",
      fr: "Site web et plateforme de gestion de cours en ligne développés avec WordPress et ses plugins, accompagnés d'une automatisation des réseaux sociaux via ManyChat.",
    },
    challenge: {
      en: "Training businesses need a manageable website and course portal that non-technical teams can update easily, connected to automated social media lead capture and student onboarding.",
      fr: "Les organismes de formation ont besoin d'un site web et d'un portail de cours faciles à administrer par des équipes non techniques, reliés à une acquisition et un accueil automatisés sur les réseaux sociaux.",
    },
    solution: {
      en: "We built a tailored WordPress website and e-learning portal leveraging dedicated LMS and content plugins, integrated with ManyChat social media automation workflows to qualify prospects and guide learners automatically.",
      fr: "Nous avons conçu un site WordPress et un portail e-learning structurés autour de plugins LMS dédiés, intégrés à des scénarios d'automatisation ManyChat sur les réseaux sociaux pour qualifier les prospects et orienter les apprenants.",
    },
    features: {
      en: [
        "WordPress website architecture",
        "LMS & course management plugins",
        "Social media automation (ManyChat)",
        "Automated prospect & learner flows",
      ],
      fr: [
        "Architecture WordPress sur mesure",
        "Plugins LMS et gestion de cours",
        "Automatisation réseaux sociaux (ManyChat)",
        "Parcours prospects et apprenants automatisés",
      ],
    },
    architectureHighlights: {
      en: [
        "Modular WordPress setup configured for clean course presentation, enrollment, and content administration.",
        "Curated LMS plugin stack managing course modules, learner access, and structured progression.",
        "ManyChat conversational flows automating social media inquiries, DM responses, and course links.",
        "Seamless handoff between social media touchpoints and course registration pages.",
      ],
      fr: [
        "Configuration WordPress modulaire pensée pour la présentation des formations, l'inscription et l'administration.",
        "Écosystème de plugins LMS gérant les modules de cours, les accès apprenants et la progression.",
        "Scénarios conversationnels ManyChat automatisant les réponses aux messages et la qualification.",
        "Passerelle fluide entre les points de contact sociaux et les pages d'inscription aux cours.",
      ],
    },
    stack: ["WordPress", "LMS Plugins", "ManyChat", "Social Automation", "Responsive Web"],
  },
  {
    slug: "ai-voice-agent",
    index: "05",
    visualType: "voice-agent",
    title: {
      en: "AI Voice Agent",
      fr: "Agent Vocal IA Temps Réel",
    },
    category: {
      en: "Real-Time Voice AI / Telephony",
      fr: "IA Vocale Temps Réel / Téléphonie",
    },
    status: {
      en: "Voice & Telephony",
      fr: "Voix & Téléphonie",
    },
    shortDescription: {
      en: "Real-time AI voice assistant integrating OpenAI Realtime API, Asterisk and FastAPI for natural, low-latency phone conversations.",
      fr: "Assistant vocal IA temps réel intégrant OpenAI Realtime API, Asterisk et FastAPI pour des conversations téléphoniques fluides à faible latence.",
    },
    challenge: {
      en: "Traditional automated phone trees (IVR) frustrate callers with rigid keypad menus, while stitched speech-to-text → LLM → text-to-speech pipelines introduce awkward latency during live phone calls.",
      fr: "Les serveurs vocaux interactifs classiques (SVI) frustrent les appelants avec des menus rigides, tandis que les chaînes STT → LLM → TTS classiques introduisent une latence gênante au téléphone.",
    },
    solution: {
      en: "We engineered a real-time voice bridge connecting Asterisk telephony trunks through a high-concurrency FastAPI service directly to the OpenAI Realtime API, enabling responsive, interruptible spoken interactions.",
      fr: "Nous avons développé une passerelle vocale temps réel reliant la téléphonie Asterisk via un service FastAPI haute concurrence directement à l'API OpenAI Realtime, permettant des échanges vocaux naturels et interruptibles.",
    },
    features: {
      en: [
        "OpenAI Realtime API streaming",
        "Asterisk SIP / telephony integration",
        "FastAPI orchestration backend",
        "Low-latency bidirectional audio",
      ],
      fr: [
        "Streaming OpenAI Realtime API",
        "Intégration téléphonie / SIP Asterisk",
        "Orchestration backend FastAPI",
        "Audio bidirectionnel basse latence",
      ],
    },
    architectureHighlights: {
      en: [
        "Bidirectional audio streaming bridge handling Asterisk media channels and WebSocket frames.",
        "Asynchronous FastAPI control plane managing call state, session context, and tool-call execution.",
        "Voice activity detection (VAD) and barge-in handling for natural conversational turn-taking.",
        "Structured call logging and fallback routing to human operators when escalation is needed.",
      ],
      fr: [
        "Passerelle audio bidirectionnelle reliant les canaux média Asterisk aux flux WebSocket.",
        "Plan de contrôle asynchrone FastAPI gérant l'état d'appel, le contexte et l'exécution d'outils.",
        "Détection d'activité vocale (VAD) et gestion des interruptions pour un dialogue naturel.",
        "Journalisation structurée des appels et transfert vers un opérateur humain si nécessaire.",
      ],
    },
    stack: ["OpenAI Realtime API", "Asterisk", "FastAPI", "WebSockets", "Python"],
  },
  {
    slug: "rpa-business-process-automation",
    index: "06",
    visualType: "rpa-workflow",
    title: {
      en: "RPA & Business Process Automation",
      fr: "RPA & Automatisation des Processus Métier",
    },
    category: {
      en: "RPA & Business Process Automation",
      fr: "RPA & Automatisation des Processus Métier",
    },
    status: {
      en: "Process Automation",
      fr: "Automatisation Métier",
    },
    shortDescription: {
      en: "End-to-end robotic process automation covering browser automation, repetitive task execution, structured data entry, document processing and automated reporting.",
      fr: "Automatisation robotisée des processus couvrant l'automatisation navigateur, les tâches répétitives, la saisie de données, le traitement documentaire et le reporting.",
    },
    challenge: {
      en: "Operational teams lose hours every week copying data between web portals, spreadsheets, PDFs, and legacy back-office tools that lack clean APIs.",
      fr: "Les équipes opérationnelles perdent chaque semaine un temps précieux à recopier des données entre portails web, tableurs, PDF et outils internes dépourvus d'API.",
    },
    solution: {
      en: "We design deterministic RPA pipelines that automate browser interactions, extract and validate document data, execute repetitive data entry reliably, and generate scheduled operational reports.",
      fr: "Nous concevons des pipelines RPA déterministes qui automatisent les interactions navigateur, extraient et valident les données documentaires, exécutent la saisie de données et génèrent des rapports planifiés.",
    },
    features: {
      en: [
        "Browser automation",
        "Repetitive task automation",
        "Automated data entry",
        "Document processing",
        "Scheduled reporting",
        "Business workflow automation",
      ],
      fr: [
        "Automatisation navigateur",
        "Automatisation des tâches répétitives",
        "Saisie automatisée de données",
        "Traitement documentaire",
        "Reporting automatisé",
        "Automatisation des workflows métier",
      ],
    },
    architectureHighlights: {
      en: [
        "Headless and attended browser automation scripts handling multi-step web portals and forms.",
        "Structured document parsing pipelines extracting fields from PDFs, invoices, and spreadsheets.",
        "Idempotent data-entry routines with validation checks, retry policies, and execution audit logs.",
        "Automated report generation and scheduled distribution across email or internal dashboards.",
      ],
      fr: [
        "Scripts d'automatisation navigateur gérant portails web complexes et formulaires multi-étapes.",
        "Pipelines d'extraction structurée pour PDF, factures et feuilles de calcul.",
        "Routines de saisie idempotentes avec contrôles de validation, reprises et journaux d'exécution.",
        "Génération et diffusion planifiée de rapports par e-mail ou vers des tableaux de bord internes.",
      ],
    },
    stack: ["Playwright / Puppeteer", "Python", "Document Parsing", "Workflow Orchestration", "Reporting"],
  },
  {
    slug: "rpa-automation-platform",
    index: "07",
    visualType: "rpa-platform",
    title: {
      en: "RPA Automation Platform",
      fr: "Plateforme d'Automatisation RPA",
    },
    category: {
      en: "RPA & Business Process Automation",
      fr: "RPA & Automatisation des Processus Métier",
    },
    status: {
      en: "In Development",
      fr: "En développement",
    },
    shortDescription: {
      en: "In Development — A unified automation platform inspired by UiPath, designed to automate desktop applications, web browsers, mobile applications and end-to-end business workflows.",
      fr: "En développement — Une plateforme d'automatisation unifiée inspirée d'UiPath, conçue pour automatiser applications desktop, navigateurs web, applications mobiles et workflows métier.",
    },
    challenge: {
      en: "Modern business processes rarely live in a single environment; a single workflow often spans a desktop ERP, a web portal, and a mobile interface, requiring unified orchestration.",
      fr: "Les processus métier modernes s'exécutent rarement dans un seul environnement ; un même flux traverse souvent un ERP desktop, un portail web et une interface mobile.",
    },
    solution: {
      en: "Currently in active development, this platform is architected as a modular, UiPath-inspired studio and execution engine capable of orchestrating cross-surface automations across desktop, web, and mobile targets.",
      fr: "Actuellement en développement actif, cette plateforme est conçue comme un studio et un moteur d'exécution modulaires inspirés d'UiPath pour orchestrer des automatisations desktop, web et mobiles.",
    },
    features: {
      en: [
        "Desktop application automation",
        "Web browser automation",
        "Mobile application automation",
        "Visual workflow orchestration",
      ],
      fr: [
        "Automatisation d'applications desktop",
        "Automatisation de navigateurs web",
        "Automatisation d'applications mobiles",
        "Orchestration visuelle des workflows",
      ],
    },
    architectureHighlights: {
      en: [
        "Cross-platform runner architecture targeting desktop UI trees, browser DOMs, and mobile automation bridges.",
        "Composable workflow graph separating reusable action blocks, triggers, and conditional branches.",
        "Centralized execution queue and state monitoring designed for attended and unattended bots.",
        "Project currently in development; core studio and runtime modules under active engineering.",
      ],
      fr: [
        "Architecture d'exécution multi-cibles couvrant interfaces desktop, DOM web et passerelles mobiles.",
        "Graphe de workflow composable séparant blocs d'action réutilisables, déclencheurs et conditions.",
        "File d'exécution centralisée et supervision des états pour robots assistés ou autonomes.",
        "Projet en cours de développement ; le studio et le moteur d'exécution sont en ingénierie active.",
      ],
    },
    stack: ["In Development", "Desktop UI Automation", "Browser Engine", "Mobile Bridge", "Orchestrator"],
  },
];

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
  return projects.find((p) => p.slug === slug);
}
