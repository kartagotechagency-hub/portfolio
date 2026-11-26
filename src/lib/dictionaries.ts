import type { Locale } from "./i18n";

export interface Dictionary {
  meta: {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
  };
  nav: {
    home: string;
    services: string;
    work: string;
    about: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
    startProject: string;
  };
  home: {
    hero: {
      eyebrow: string;
      headlineLine1: string;
      headlineLine2: string;
      supporting: string;
      primaryCta: string;
      secondaryCta: string;
      exploreCta: string;
      location: string;
      scrollLabel: string;
    };
    story: {
      sectionLabel: string;
      chapters: Array<{
        index: string;
        tag: string;
        title: string;
        headline: string;
        body: string;
        highlights: string[];
      }>;
    };
    vision: {
      label: string;
      headline: string;
      body: string;
      stages: string[];
    };
    selectedWork: {
      label: string;
      title: string;
      viewAll: string;
      exploreCase: string;
    };
    services: {
      label: string;
      title: string;
      subtitle: string;
      exploreServices: string;
      items: Array<{
        index: string;
        title: string;
        description: string;
        href: string;
      }>;
    };
    approach: {
      label: string;
      title: string;
      subtitle: string;
      steps: Array<{
        number: string;
        title: string;
        description: string;
      }>;
    };
    about: {
      label: string;
      title: string;
      paragraph1: string;
      paragraph2: string;
      cta: string;
      pillars: Array<{
        title: string;
        description: string;
      }>;
    };
    contactCta: {
      label: string;
      headline: string;
      button: string;
    };
  };
  servicesPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    businessValueLabel: string;
    deliverablesLabel: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    sections: Array<{
      id: string;
      index: string;
      title: string;
      summary: string;
      businessValue: string;
      deliverables: Array<{
        name: string;
        detail: string;
      }>;
    }>;
  };
  workPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    viewCaseStudy: string;
    featuresLabel: string;
    statusLabel: string;
    mockupLabel: string;
    backToWork: string;
    challengeLabel: string;
    solutionLabel: string;
    architectureLabel: string;
    capabilitiesLabel: string;
    nextProjectLabel: string;
    inquireSimilar: string;
  };
  aboutPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    whoWeAre: {
      label: string;
      title: string;
      body: string[];
    };
    mindset: {
      label: string;
      title: string;
      body: string;
      principles: Array<{
        index: string;
        title: string;
        description: string;
      }>;
    };
    howWeWork: {
      label: string;
      title: string;
      body: string;
    };
    international: {
      label: string;
      title: string;
      body: string;
      regions: Array<{
        name: string;
        role: string;
        detail: string;
      }>;
    };
  };
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    directContactLabel: string;
    emailLabel: string;
    emailValue: string;
    presenceLabel: string;
    presenceValue: string;
    responseLabel: string;
    responseValue: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      serviceLabel: string;
      servicePlaceholder: string;
      serviceOptions: string[];
      budgetLabel: string;
      budgetOptional: string;
      budgetPlaceholder: string;
      budgetOptions: string[];
      descriptionLabel: string;
      descriptionPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      successTitle: string;
      successMessage: string;
      devNote: string;
      resetButton: string;
      errors: {
        nameRequired: string;
        emailInvalid: string;
        serviceRequired: string;
        descriptionRequired: string;
        genericError: string;
      };
    };
  };
  footer: {
    statement: string;
    navigationTitle: string;
    servicesTitle: string;
    contactTitle: string;
    location: string;
    rights: string;
  };
}

const en: Dictionary = {
  meta: {
    siteName: "KartagoTech Agency",
    defaultTitle: "KartagoTech Agency — Digital Solutions for Ambitious Businesses",
    defaultDescription:
      "We turn ideas into digital solutions that move businesses forward. Web development, custom software, AI & automation, and digital transformation across France and worldwide.",
  },
  nav: {
    home: "Home",
    services: "Services",
    work: "Work",
    about: "About",
    contact: "Contact",
    menuOpen: "Open navigation menu",
    menuClose: "Close navigation menu",
    startProject: "Start a project",
  },
  home: {
    hero: {
      eyebrow: "KARTAGOTECH AGENCY",
      headlineLine1: "Your business can do",
      headlineLine2: "more with technology.",
      supporting:
        "From manual bottlenecks to connected digital operations—see how intelligent software, AI, and automation transform the way modern organizations work.",
      primaryCta: "Start a project",
      secondaryCta: "Explore our work",
      exploreCta: "Experience the story",
      location: "France · Worldwide",
      scrollLabel: "Scroll to transform",
    },
    story: {
      sectionLabel: "Business Transformation Story",
      chapters: [
        {
          index: "01",
          tag: "THE CHALLENGE",
          title: "Manual friction slows great teams down.",
          headline: "Disconnected tools, repetitive work, missed opportunities.",
          body: "Too many ambitious businesses still rely on fragmented spreadsheets, manual data entry, isolated software, and slow response workflows. Teams spend valuable hours on repetitive tasks while customer opportunities slip through the cracks.",
          highlights: [
            "Manual operations & data re-entry",
            "Disconnected systems & silos",
            "Missed customer response windows",
          ],
        },
        {
          index: "02",
          tag: "THE OPPORTUNITY",
          title: "Intelligence enters the workflow.",
          headline: "AI, automation, and custom software connect your operations.",
          body: "When intelligent software and automation are introduced around your real business logic, isolated tools begin communicating. Data flows cleanly, repetitive bottlenecks are bridged, and your systems start working as one.",
          highlights: [
            "Unified operational architecture",
            "AI grounded in your business knowledge",
            "Automated bridges between tools",
          ],
        },
        {
          index: "03",
          tag: "THE TRANSFORMATION",
          title: "Every layer of operations upgraded.",
          headline: "AI assistants, automated workflows, custom software, and RPA.",
          body: "AI assistants handle customer inquiries and internal research, RPA bots execute repetitive browser and document workflows, custom platforms streamline daily operations, and high-craft websites turn attention into action.",
          highlights: [
            "24/7 AI chat & voice assistants",
            "RPA workflow & document automation",
            "Tailored web & business software",
          ],
        },
        {
          index: "04",
          tag: "THE GROWTH",
          title: "Clarity creates room to scale.",
          headline: "An organized business ready for new opportunities.",
          body: "With cleaner operations and faster, more consistent customer experiences, your team regains focus for high-value work—unlocking stronger operational capacity and new room for sustainable growth.",
          highlights: [
            "Organized, reliable daily execution",
            "Consistent customer experiences",
            "Capacity for new opportunities",
          ],
        },
        {
          index: "05",
          tag: "THE FUTURE",
          title: "Your technology partner for what's next.",
          headline: "KartagoTech builds the systems that move your business forward.",
          body: "We partner with ambitious organizations across France and worldwide to design, engineer, and deploy the web platforms, custom software, AI solutions, and RPA systems that turn operational challenges into lasting capability.",
          highlights: [
            "End-to-end engineering partner",
            "Web · Custom Software · AI · RPA",
            "Built around your real operations",
          ],
        },
      ],
    },
    vision: {
      label: "01 — The Vision",
      headline: "Every great solution starts with an idea.",
      body: "From raw intuition to structured digital architecture, we shape abstract ambitions into resilient software, intelligent automation, and refined user experiences.",
      stages: ["Concept", "Architecture", "Execution"],
    },
    selectedWork: {
      label: "01 — Selected Work",
      title: "Engineered products built for operational clarity.",
      viewAll: "View all work",
      exploreCase: "View case study",
    },
    services: {
      label: "02 — What We Do",
      title: "Focused capabilities for modern organizations.",
      subtitle:
        "From high-craft web platforms to tailored business software and intelligent automation.",
      exploreServices: "Explore all services",
      items: [
        {
          index: "01",
          title: "Web Development",
          description:
            "Fast, accessible corporate websites, conversion-focused landing pages, e-commerce platforms, and responsive web applications.",
          href: "/services#web-development",
        },
        {
          index: "02",
          title: "Custom Software Development",
          description:
            "Tailored management systems, multi-tenant SaaS platforms, operational dashboards, and resilient API integrations.",
          href: "/services#custom-software",
        },
        {
          index: "03",
          title: "AI & Automation",
          description:
            "Knowledge-grounded AI assistants, automated business workflows, and intelligent system integrations that reduce manual overhead.",
          href: "/services#ai-automation",
        },
        {
          index: "04",
          title: "Digital Transformation",
          description:
            "End-to-end process optimization, legacy tool unification, and structured workflow modernization built around your operations.",
          href: "/services#digital-transformation",
        },
        {
          index: "05",
          title: "RPA & Business Process Automation",
          description:
            "Robotic process automation for browser workflows, repetitive tasks, data entry, document processing, and automated operational reporting.",
          href: "/services#rpa-automation",
        },
      ],
    },
    approach: {
      label: "03 — Our Approach",
      title: "A disciplined engineering process from first brief to production.",
      subtitle:
        "Every engagement follows five transparent stages designed to eliminate ambiguity and deliver durable software.",
      steps: [
        {
          number: "01",
          title: "Discover",
          description:
            "We map your business objectives, operational constraints, user needs, and existing technical landscape.",
        },
        {
          number: "02",
          title: "Strategize",
          description:
            "We define architecture, system boundaries, and a pragmatic delivery roadmap before writing code.",
        },
        {
          number: "03",
          title: "Design",
          description:
            "Editorial interfaces, clear information hierarchy, and intentional user flows crafted for clarity.",
        },
        {
          number: "04",
          title: "Build",
          description:
            "Iterative, type-safe engineering with automated checks, performance tuning, and continuous visibility.",
        },
        {
          number: "05",
          title: "Launch",
          description:
            "Controlled production deployment with SEO readiness, security hardening, and ongoing support.",
        },
      ],
    },
    about: {
      label: "04 — About KartagoTech",
      title: "Engineering-led. Built for useful outcomes.",
      paragraph1:
        "KartagoTech is an international digital agency connecting technical rigor with clean, purposeful design. Rather than shipping generic templates, we architect digital products that solve real operational bottlenecks.",
      paragraph2:
        "Operating across France and international markets, we partner with founders, operators, and growing enterprises who value clarity, maintainability, and direct engineering collaboration.",
      cta: "More about us",
      pillars: [
        {
          title: "Clarity over complexity",
          description:
            "Every interface and architecture decision serves a concrete user or business requirement.",
        },
        {
          title: "Built to last",
          description:
            "Modern, well-documented codebases that your team can scale without technical debt.",
        },
        {
          title: "Cross-border execution",
          description:
            "Bilingual EN/FR collaboration built for European and international digital ecosystems.",
        },
      ],
    },
    contactCta: {
      label: "05 — Next Step",
      headline: "Let's build what's next.",
      button: "Start a project",
    },
  },
  servicesPage: {
    metaTitle: "Services — KartagoTech Agency",
    metaDescription:
      "Web development, custom software, AI & automation, and digital transformation services tailored for business value.",
    eyebrow: "Capabilities",
    title: "Technical precision aligned with measurable business value.",
    subtitle:
      "We do not sell isolated deliverables. We build cohesive digital systems that simplify operations, strengthen brand credibility, and support sustainable growth.",
    businessValueLabel: "Business Value",
    deliverablesLabel: "Core Deliverables",
    ctaTitle: "Need a tailored technical scope?",
    ctaDescription:
      "Share your operational goals and we will outline a clear architecture and delivery plan.",
    ctaButton: "Discuss your project",
    sections: [
      {
        id: "web-development",
        index: "01",
        title: "Web Development",
        summary:
          "High-performance digital presence engineered for speed, accessibility, and search visibility.",
        businessValue:
          "Your website is often the first touchpoint for prospective clients and partners. We build clean, fast-loading web experiences that establish immediate credibility, convert qualified leads, and remain effortless for your team to maintain.",
        deliverables: [
          {
            name: "Corporate websites",
            detail:
              "Editorial-grade brand platforms with structured content, multilingual support, and technical SEO foundations.",
          },
          {
            name: "Landing pages",
            detail:
              "Focused, high-clarity campaign and product pages engineered for fast load times and clear conversion paths.",
          },
          {
            name: "E-commerce platforms",
            detail:
              "Streamlined storefronts with reliable checkout flows, inventory sync, and responsive mobile purchasing.",
          },
          {
            name: "Responsive web applications",
            detail:
              "Interactive client portals and browser-based tools designed for desktop, tablet, and mobile workflows.",
          },
        ],
      },
      {
        id: "custom-software",
        index: "02",
        title: "Custom Software Development",
        summary:
          "Purpose-built platforms tailored to the exact workflows that off-the-shelf tools fail to cover.",
        businessValue:
          "Generic software forces your teams into manual workarounds and fragmented spreadsheets. Custom systems centralize your business logic, reduce operational errors, and create a durable asset owned by your company.",
        deliverables: [
          {
            name: "Business management systems",
            detail:
              "Dedicated internal platforms for operations, scheduling, inventory, billing, and multi-site coordination.",
          },
          {
            name: "SaaS platforms",
            detail:
              "Multi-tenant software products with role-based permissions, subscription readiness, and scalable data models.",
          },
          {
            name: "Custom dashboards",
            detail:
              "Real-time operational views that surface the exact metrics decision-makers need without noise.",
          },
          {
            name: "API development and integrations",
            detail:
              "Clean, documented interfaces connecting ERPs, payment providers, CRMs, and third-party services.",
          },
        ],
      },
      {
        id: "ai-automation",
        index: "03",
        title: "AI & Automation",
        summary:
          "Practical artificial intelligence and workflow automation grounded in your actual business data.",
        businessValue:
          "AI delivers value only when integrated into real workflows with reliable guardrails. We implement focused assistants and automated pipelines that eliminate repetitive tasks and accelerate customer response times.",
        deliverables: [
          {
            name: "AI assistants and chatbots",
            detail:
              "Conversational interfaces anchored to your verified documentation to answer inquiries accurately.",
          },
          {
            name: "Business process automation",
            detail:
              "Automated routing, document processing, notifications, and approvals across departments.",
          },
          {
            name: "Workflow automation",
            detail:
              "Event-driven triggers linking forms, databases, messaging, and reporting tools seamlessly.",
          },
          {
            name: "Intelligent integrations",
            detail:
              "Structured LLM and classification pipelines embedded directly into existing software systems.",
          },
        ],
      },
      {
        id: "digital-transformation",
        index: "04",
        title: "Digital Transformation",
        summary:
          "Pragmatic modernization of legacy processes, disconnected tools, and manual operational bottlenecks.",
        businessValue:
          "Modernization does not require disrupting daily business. We audit existing workflows, replace fragile manual steps with unified digital tools, and help teams adopt cleaner ways of working step by step.",
        deliverables: [
          {
            name: "Process optimization",
            detail:
              "Mapping operational bottlenecks and redesigning digital handoffs for speed and accountability.",
          },
          {
            name: "Digital tools integration",
            detail:
              "Consolidating disparate tools into a coherent ecosystem with a single source of truth.",
          },
          {
            name: "Business workflow modernization",
            detail:
              "Replacing paper-based, spreadsheet-heavy, or legacy routines with structured web and mobile tools.",
          },
          {
            name: "Custom digital solutions",
            detail:
              "Targeted software modules built to bridge gaps between existing enterprise systems.",
          },
        ],
      },
      {
        id: "rpa-automation",
        index: "05",
        title: "RPA & Business Process Automation",
        summary:
          "Deterministic robotic process automation for high-volume operational tasks across browsers, documents, and back-office systems.",
        businessValue:
          "Manual data entry, copy-pasting across portals, and repetitive document handling drain team capacity and introduce human error. We automate these workflows reliably so your team can focus on higher-value decisions.",
        deliverables: [
          {
            name: "Browser & repetitive task automation",
            detail:
              "Automated multi-step web portal interactions, form submissions, and scheduled operational routines.",
          },
          {
            name: "Data entry & synchronization",
            detail:
              "Validated, error-checked data transfers between spreadsheets, CRMs, ERPs, and legacy tools.",
          },
          {
            name: "Document processing",
            detail:
              "Automated extraction, structuring, and routing of data from PDFs, invoices, and operational files.",
          },
          {
            name: "Reporting & workflow automation",
            detail:
              "Scheduled report generation, consolidation, and end-to-end business workflow execution.",
          },
        ],
      },
    ],
  },
  workPage: {
    metaTitle: "Work & Case Studies — KartagoTech Agency",
    metaDescription:
      "Explore KartagoTech Agency's software, AI, and enterprise platform engineering projects.",
    eyebrow: "Selected Work",
    title: "Digital systems designed around real operational workflows.",
    subtitle:
      "A curated view of platforms and automation systems across hospitality, applied AI, web, and RPA.",
    viewCaseStudy: "Inspect case study",
    featuresLabel: "Key Capabilities",
    statusLabel: "Project Status",
    mockupLabel: "System Preview",
    backToWork: "Back to all work",
    challengeLabel: "Operational Context",
    solutionLabel: "System Architecture & Approach",
    architectureLabel: "Technical Highlights",
    capabilitiesLabel: "Implemented Modules",
    nextProjectLabel: "Next Project",
    inquireSimilar: "Inquire about a similar system",
  },
  aboutPage: {
    metaTitle: "About — KartagoTech Agency",
    metaDescription:
      "Learn about KartagoTech Agency's engineering-driven mindset, philosophy, and international presence across France and worldwide.",
    eyebrow: "About KartagoTech",
    title: "An engineering-led digital studio built on clarity and execution.",
    subtitle:
      "We partner with ambitious businesses to design, architect, and ship digital products that solve concrete operational problems.",
    whoWeAre: {
      label: "01 — Who We Are",
      title: "Technical rigor meets editorial restraint.",
      body: [
        "KartagoTech Agency is a digital product and software engineering studio focused on building useful, maintainable systems. We work at the intersection of modern web architecture, custom business software, and practical AI integration.",
        "We believe great digital products feel effortless to use because the underlying engineering is disciplined. Instead of overcomplicating interfaces with decorative noise, we prioritize structure, speed, and long-term reliability.",
      ],
    },
    mindset: {
      label: "02 — Engineering Mindset & Philosophy",
      title: "Principles that guide every line of code.",
      body: "Software should reduce friction for your team and your customers—never add to it.",
      principles: [
        {
          index: "01",
          title: "Problem-First Architecture",
          description:
            "We start by understanding the operational reality behind a request before choosing frameworks or patterns.",
        },
        {
          index: "02",
          title: "Swiss-Grade Visual Discipline",
          description:
            "Clean typography, balanced whitespace, and intentional hierarchy ensure interfaces communicate clearly.",
        },
        {
          index: "03",
          title: "Maintainable Craft",
          description:
            "Strong typing, modular components, and clear documentation keep your platform adaptable over time.",
        },
        {
          index: "04",
          title: "Honest Collaboration",
          description:
            "Direct communication, realistic scoping, and transparent progress—without inflated claims or unnecessary jargon.",
        },
      ],
    },
    howWeWork: {
      label: "03 — How We Work",
      title: "Structured, transparent, and collaborative.",
      body: "From initial discovery workshops to production deployment and post-launch support, we work as an integrated technical partner. Every milestone is defined clearly, reviewed collaboratively, and tested thoroughly across devices.",
    },
    international: {
      label: "04 — International Positioning",
      title: "France · Worldwide",
      body: "Operating seamlessly in English and French, KartagoTech combines European business standards with agile software engineering—serving clients locally in France and remotely across international time zones.",
      regions: [
        {
          name: "France",
          role: "European Market & Strategy",
          detail:
            "Aligned with French and European standards for data privacy, accessibility, and enterprise quality.",
        },
        {
          name: "Worldwide",
          role: "Remote-First Delivery",
          detail:
            "Structured asynchronous and live collaboration for ambitious teams across Europe, MENA, and North America.",
        },
      ],
    },
  },
  contactPage: {
    metaTitle: "Contact — KartagoTech Agency",
    metaDescription:
      "Start a conversation with KartagoTech Agency about your web, custom software, AI, or digital transformation project.",
    eyebrow: "Contact",
    title: "Let's discuss what we can build together.",
    subtitle:
      "Tell us about your project, timeline, and goals. We review every inquiry carefully and respond directly.",
    directContactLabel: "Direct Contact",
    emailLabel: "Email",
    emailValue: "kartagotechagency@gmail.com",
    presenceLabel: "Presence",
    presenceValue: "France · Worldwide",
    responseLabel: "Languages",
    responseValue: "English & Français",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your full name",
      emailLabel: "Business email",
      emailPlaceholder: "name@company.com",
      companyLabel: "Company",
      companyPlaceholder: "Company or organization name",
      serviceLabel: "Service required",
      servicePlaceholder: "Select a service",
      serviceOptions: [
        "Web Development",
        "Custom Software Development",
        "AI & Automation",
        "RPA & Business Process Automation",
        "Digital Transformation",
        "Multiple / Advisory",
      ],
      budgetLabel: "Estimated budget",
      budgetOptional: "(optional)",
      budgetPlaceholder: "Select a range",
      budgetOptions: [
        "Under €5,000",
        "€5,000 – €15,000",
        "€15,000 – €35,000",
        "€35,000+",
        "To be defined together",
      ],
      descriptionLabel: "Project description",
      descriptionPlaceholder:
        "Briefly describe your objectives, key features, or operational challenges...",
      submitButton: "Send inquiry",
      submittingButton: "Sending...",
      successTitle: "Inquiry received",
      successMessage:
        "Thank you for reaching out. Your project brief has been recorded and our team will get back to you shortly.",
      devNote:
        "Development mode notice: No external email provider is configured, so this submission was logged cleanly on the server.",
      resetButton: "Send another message",
      errors: {
        nameRequired: "Please enter your name.",
        emailInvalid: "Please enter a valid business email address.",
        serviceRequired: "Please select the service you are looking for.",
        descriptionRequired: "Please provide a brief description of your project.",
        genericError: "Unable to send your inquiry right now. Please try again or email us directly.",
      },
    },
  },
  footer: {
    statement: "Digital solutions for ambitious businesses.",
    navigationTitle: "Navigation",
    servicesTitle: "Services",
    contactTitle: "Connect",
    location: "France · Worldwide",
    rights: "KartagoTech Agency. All rights reserved.",
  },
};

const fr: Dictionary = {
  meta: {
    siteName: "KartagoTech Agency",
    defaultTitle: "KartagoTech Agency — Solutions digitales pour entreprises ambitieuses",
    defaultDescription:
      "Nous transformons vos idées en solutions digitales qui font avancer votre entreprise. Développement web, logiciels sur mesure, IA & automatisation et transformation digitale.",
  },
  nav: {
    home: "Accueil",
    services: "Services",
    work: "Projets",
    about: "À propos",
    contact: "Contact",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    startProject: "Démarrer un projet",
  },
  home: {
    hero: {
      eyebrow: "KARTAGOTECH AGENCY",
      headlineLine1: "Votre entreprise peut accomplir",
      headlineLine2: "davantage grâce à la technologie.",
      supporting:
        "Des tâches manuelles aux opérations digitales connectées : découvrez comment les logiciels intelligents, l'IA et l'automatisation transforment le quotidien des organisations modernes.",
      primaryCta: "Démarrer un projet",
      secondaryCta: "Découvrir nos projets",
      exploreCta: "Découvrir l'histoire",
      location: "France · International",
      scrollLabel: "Défiler pour transformer",
    },
    story: {
      sectionLabel: "Histoire de Transformation Digitale",
      chapters: [
        {
          index: "01",
          tag: "LE DÉFI",
          title: "La friction manuelle freine les équipes ambitieuses.",
          headline: "Outils déconnectés, tâches répétitives, opportunités manquées.",
          body: "Trop d'entreprises reposent encore sur des tableurs fragmentés, des saisies manuelles, des logiciels isolés et des réponses lentes. Les équipes perdent un temps précieux sur des tâches répétitives tandis que des opportunités clients s'échappent.",
          highlights: [
            "Opérations manuelles & ressaisies",
            "Systèmes isolés sans connexion",
            "Opportunités clients manquées",
          ],
        },
        {
          index: "02",
          tag: "L'OPPORTUNITÉ",
          title: "L'intelligence entre dans vos processus.",
          headline: "L'IA, l'automatisation et le logiciel sur mesure connectent vos opérations.",
          body: "Lorsque des logiciels intelligents et l'automatisation s'intègrent à votre logique métier, vos outils isolés commencent à communiquer. Les données circulent proprement et vos systèmes fonctionnent à l'unisson.",
          highlights: [
            "Architecture opérationnelle unifiée",
            "IA ancrée dans votre base de connaissances",
            "Passerelles automatisées entre outils",
          ],
        },
        {
          index: "03",
          tag: "LA TRANSFORMATION",
          title: "Chaque couche opérationnelle est modernisée.",
          headline: "Assistants IA, workflows automatisés, logiciels sur mesure et RPA.",
          body: "Les assistants IA répondent aux clients et accélèrent la recherche, les robots RPA exécutent les tâches répétitives, les logiciels sur mesure structurent le quotidien et les plateformes web convertissent l'attention en action.",
          highlights: [
            "Assistants IA conversationnels & vocaux",
            "Automatisation RPA & traitement documentaire",
            "Sites web & logiciels métier sur mesure",
          ],
        },
        {
          index: "04",
          tag: "LA CROISSANCE",
          title: "La clarté crée l'espace pour évoluer.",
          headline: "Une entreprise organisée, prête pour de nouvelles opportunités.",
          body: "Avec des opérations structurées et une expérience client fluide et réactive, vos équipes retrouvent du temps pour l'essentiel — ouvrant la voie à une capacité opérationnelle renforcée et à de nouvelles opportunités.",
          highlights: [
            "Exécution quotidienne organisée et fiable",
            "Expérience client fluide et cohérente",
            "Capacité libérée pour de nouveaux projets",
          ],
        },
        {
          index: "05",
          tag: "L'AVENIR",
          title: "Votre partenaire technologique pour la suite.",
          headline: "KartagoTech conçoit les systèmes qui font avancer votre entreprise.",
          body: "Nous accompagnons les organisations ambitieuses en France et à l'international pour concevoir, développer et déployer les plateformes web, logiciels sur mesure, solutions IA et systèmes RPA qui transforment vos défis en leviers durables.",
          highlights: [
            "Partenaire d'ingénierie de bout en bout",
            "Web · Logiciels sur Mesure · IA · RPA",
            "Construit autour de vos opérations réelles",
          ],
        },
      ],
    },
    vision: {
      label: "01 — La Vision",
      headline: "Chaque grande solution commence par une idée.",
      body: "De l'intuition brute à l'architecture numérique structurée, nous transformons des ambitions abstraites en logiciels fiables, automatisations intelligentes et expériences maîtrisées.",
      stages: ["Concept", "Architecture", "Exécution"],
    },
    selectedWork: {
      label: "01 — Projets sélectionnés",
      title: "Des produits conçus pour la clarté opérationnelle.",
      viewAll: "Voir tous les projets",
      exploreCase: "Voir l'étude de cas",
    },
    services: {
      label: "02 — Ce que nous faisons",
      title: "Des expertises ciblées pour les organisations modernes.",
      subtitle:
        "Des plateformes web exigeantes aux logiciels métier sur mesure et à l'automatisation intelligente.",
      exploreServices: "Explorer nos services",
      items: [
        {
          index: "01",
          title: "Développement Web",
          description:
            "Sites institutionnels rapides et accessibles, landing pages orientées conversion, plateformes e-commerce et applications web responsives.",
          href: "/services#web-development",
        },
        {
          index: "02",
          title: "Logiciels sur Mesure",
          description:
            "Systèmes de gestion métier, plateformes SaaS multi-locataires, tableaux de bord opérationnels et intégrations API robustes.",
          href: "/services#custom-software",
        },
        {
          index: "03",
          title: "IA & Automatisation",
          description:
            "Assistants IA adossés à vos connaissances, automatisation des processus métier et intégrations intelligentes réduisant la charge manuelle.",
          href: "/services#ai-automation",
        },
        {
          index: "04",
          title: "Transformation Digitale",
          description:
            "Optimisation des processus, unification d'outils existants et modernisation structurée des flux de travail autour de vos opérations.",
          href: "/services#digital-transformation",
        },
        {
          index: "05",
          title: "RPA & Automatisation des Processus Métier",
          description:
            "Automatisation robotisée pour les flux navigateur, tâches répétitives, saisie de données, traitement documentaire et reporting opérationnel.",
          href: "/services#rpa-automation",
        },
      ],
    },
    approach: {
      label: "03 — Notre approche",
      title: "Une méthode d'ingénierie rigoureuse, du premier échange à la mise en production.",
      subtitle:
        "Chaque collaboration suit cinq étapes transparentes pour lever toute ambiguïté et livrer des logiciels durables.",
      steps: [
        {
          number: "01",
          title: "Découvrir",
          description:
            "Nous analysons vos objectifs métier, vos contraintes opérationnelles, les besoins utilisateurs et votre écosystème technique.",
        },
        {
          number: "02",
          title: "Stratégie",
          description:
            "Nous définissons l'architecture, le périmètre système et une feuille de route pragmatique avant de coder.",
        },
        {
          number: "03",
          title: "Design",
          description:
            "Interfaces éditoriales, hiérarchie claire de l'information et parcours utilisateurs pensés pour la lisibilité.",
        },
        {
          number: "04",
          title: "Construire",
          description:
            "Développement itératif et typé avec contrôles automatisés, optimisation des performances et visibilité continue.",
        },
        {
          number: "05",
          title: "Déployer",
          description:
            "Mise en production maîtrisée avec conformité SEO, sécurisation et accompagnement durable.",
        },
      ],
    },
    about: {
      label: "04 — À propos de KartagoTech",
      title: "Guidés par l'ingénierie. Orientés résultats concrets.",
      paragraph1:
        "KartagoTech est une agence digitale internationale qui allie rigueur technique et design épuré. Plutôt que de livrer des modèles génériques, nous concevons des produits numériques qui résolvent de véritables blocages opérationnels.",
      paragraph2:
        "Actifs entre la France et l'international, nous accompagnons dirigeants, fondateurs et entreprises exigeantes qui privilégient la clarté, la maintenabilité et la collaboration directe.",
      cta: "En savoir plus",
      pillars: [
        {
          title: "La clarté avant la complexité",
          description:
            "Chaque choix d'interface ou d'architecture répond à un besoin utilisateur ou métier concret.",
        },
        {
          title: "Conçu pour durer",
          description:
            "Des bases de code modernes et documentées que vos équipes peuvent faire évoluer sans dette technique.",
        },
        {
          title: "Exécution internationale",
          description:
            "Une collaboration bilingue FR/EN adaptée aux écosystèmes digitaux européens et internationaux.",
        },
      ],
    },
    contactCta: {
      label: "05 — Prochaine étape",
      headline: "Construisons la suite.",
      button: "Démarrer un projet",
    },
  },
  servicesPage: {
    metaTitle: "Services — KartagoTech Agency",
    metaDescription:
      "Développement web, logiciels sur mesure, IA & automatisation et transformation digitale orientés valeur métier.",
    eyebrow: "Expertises",
    title: "La précision technique au service d'une valeur métier mesurable.",
    subtitle:
      "Nous ne livrons pas de simples prestations isolées. Nous bâtissons des systèmes digitaux cohérents qui simplifient vos opérations et renforcent votre crédibilité.",
    businessValueLabel: "Valeur Métier",
    deliverablesLabel: "Livrables Clés",
    ctaTitle: "Besoin d'un cadrage technique sur mesure ?",
    ctaDescription:
      "Partagez vos enjeux opérationnels et nous vous proposerons une architecture claire ainsi qu'un plan de livraison.",
    ctaButton: "Parler de votre projet",
    sections: [
      {
        id: "web-development",
        index: "01",
        title: "Développement Web",
        summary:
          "Une présence digitale haute performance conçue pour la rapidité, l'accessibilité et le référencement naturel.",
        businessValue:
          "Votre site web est souvent le premier point de contact avec vos futurs clients et partenaires. Nous créons des expériences rapides et lisibles qui inspirent immédiatement confiance et facilitent la prise de contact.",
        deliverables: [
          {
            name: "Sites institutionnels",
            detail:
              "Plateformes de marque au design éditorial, structurées pour le multilingue et le SEO technique.",
          },
          {
            name: "Landing pages",
            detail:
              "Pages dédiées à vos campagnes ou lancements produits, optimisées pour la vitesse et la clarté du message.",
          },
          {
            name: "Plateformes e-commerce",
            detail:
              "Boutiques en ligne fluides avec parcours d'achat fiables, synchronisation des stocks et ergonomie mobile soignée.",
          },
          {
            name: "Applications web responsives",
            detail:
              "Portails clients interactifs et outils métier accessibles sur ordinateur, tablette et mobile.",
          },
        ],
      },
      {
        id: "custom-software",
        index: "02",
        title: "Logiciels sur Mesure",
        summary:
          "Des plateformes pensées spécifiquement pour les flux métier que les logiciels standards ne couvrent pas.",
        businessValue:
          "Les outils génériques imposent souvent des contournements manuels et des tableurs dispersés. Un logiciel sur mesure centralise votre logique métier, réduit les erreurs et devient un actif durable pour votre entreprise.",
        deliverables: [
          {
            name: "Systèmes de gestion métier",
            detail:
              "Outils internes dédiés à la gestion opérationnelle, la planification, les stocks, la facturation et le suivi multi-sites.",
          },
          {
            name: "Plateformes SaaS",
            detail:
              "Produits logiciels multi-locataires avec gestion fine des rôles, abonnements et modèles de données évolutifs.",
          },
          {
            name: "Tableaux de bord personnalisés",
            detail:
              "Vues opérationnelles en temps réel mettant en avant les indicateurs essentiels pour décider vite.",
          },
          {
            name: "Développement d'API et intégrations",
            detail:
              "Interfaces propres et documentées reliant ERP, prestataires de paiement, CRM et services tiers.",
          },
        ],
      },
      {
        id: "ai-automation",
        index: "03",
        title: "IA & Automatisation",
        summary:
          "Intelligence artificielle appliquée et automatisation des flux ancrées dans vos données métier réelles.",
        businessValue:
          "L'IA n'apporte de valeur que lorsqu'elle s'intègre à des processus concrets avec des garde-fous fiables. Nous déployons des assistants ciblés et des workflows automatisés qui suppriment les tâches répétitives.",
        deliverables: [
          {
            name: "Assistants IA et chatbots",
            detail:
              "Interfaces conversationnelles basées sur votre base documentaire vérifiée pour répondre avec précision.",
          },
          {
            name: "Automatisation des processus métier",
            detail:
              "Routage automatique, traitement de documents, notifications et circuits de validation inter-équipes.",
          },
          {
            name: "Automatisation des workflows",
            detail:
              "Déclencheurs événementiels reliant formulaires, bases de données, messagerie et outils de reporting.",
          },
          {
            name: "Intégrations intelligentes",
            detail:
              "Pipelines LLM structurés et classification intégrés directement au cœur de vos outils existants.",
          },
        ],
      },
      {
        id: "digital-transformation",
        index: "04",
        title: "Transformation Digitale",
        summary:
          "Modernisation pragmatique des processus hérités, outils cloisonnés et goulets d'étranglement manuels.",
        businessValue:
          "Moderniser ne signifie pas perturber votre activité quotidienne. Nous auditons vos flux, remplaçons les étapes manuelles fragiles par des outils unifiés et accompagnons vos équipes pas à pas.",
        deliverables: [
          {
            name: "Optimisation des processus",
            detail:
              "Cartographie des points de friction et refonte des passages de relais numériques pour plus de fluidité.",
          },
          {
            name: "Intégration d'outils digitaux",
            detail:
              "Consolidation d'outils disparates vers un écosystème cohérent doté d'une source de vérité unique.",
          },
          {
            name: "Modernisation des flux de travail",
            detail:
              "Remplacement des routines papier ou tableurs lourds par des applications web et mobiles structurées.",
          },
          {
            name: "Solutions digitales sur mesure",
            detail:
              "Modules logiciels ciblés conçus pour combler les écarts entre vos systèmes d'entreprise existants.",
          },
        ],
      },
      {
        id: "rpa-automation",
        index: "05",
        title: "RPA & Automatisation des Processus Métier",
        summary:
          "Automatisation robotisée déterministe pour les tâches opérationnelles récurrentes sur navigateurs, documents et outils back-office.",
        businessValue:
          "La saisie manuelle, les copier-coller entre portails et le traitement répétitif de documents mobilisent inutilement vos équipes et génèrent des erreurs. Nous automatisons ces flux de manière fiable pour libérer du temps à forte valeur ajoutée.",
        deliverables: [
          {
            name: "Automatisation navigateur & tâches répétitives",
            detail:
              "Exécution automatisée de parcours multi-étapes sur portails web, formulaires et routines planifiées.",
          },
          {
            name: "Saisie & synchronisation de données",
            detail:
              "Transferts contrôlés et validés entre tableurs, CRM, ERP et outils métier sans API.",
          },
          {
            name: "Traitement documentaire",
            detail:
              "Extraction, structuration et routage automatisés de données issues de PDF, factures et dossiers.",
          },
          {
            name: "Reporting & workflows métier",
            detail:
              "Génération planifiée de rapports, consolidation et orchestration complète de processus métier.",
          },
        ],
      },
    ],
  },
  workPage: {
    metaTitle: "Projets & Études de cas — KartagoTech Agency",
    metaDescription:
      "Découvrez les projets de KartagoTech Agency en logiciels métier, intelligence artificielle et plateformes d'entreprise.",
    eyebrow: "Projets Sélectionnés",
    title: "Des systèmes digitaux bâtis autour de flux opérationnels réels.",
    subtitle:
      "Un aperçu de plateformes et systèmes d'automatisation en restauration, IA appliquée, web et RPA.",
    viewCaseStudy: "Voir l'étude de cas",
    featuresLabel: "Fonctionnalités Clés",
    statusLabel: "Statut du projet",
    mockupLabel: "Aperçu Système",
    backToWork: "Retour aux projets",
    challengeLabel: "Contexte Opérationnel",
    solutionLabel: "Architecture & Approche",
    architectureLabel: "Points Clés Techniques",
    capabilitiesLabel: "Modules Implémentés",
    nextProjectLabel: "Projet Suivant",
    inquireSimilar: "Discuter d'un système similaire",
  },
  aboutPage: {
    metaTitle: "À propos — KartagoTech Agency",
    metaDescription:
      "Découvrez l'approche d'ingénierie, la philosophie et le positionnement international de KartagoTech Agency.",
    eyebrow: "À propos de KartagoTech",
    title: "Un studio digital guidé par l'ingénierie, fondé sur la clarté et l'exécution.",
    subtitle:
      "Nous accompagnons les entreprises ambitieuses dans la conception, l'architecture et le déploiement de produits digitaux utiles.",
    whoWeAre: {
      label: "01 — Qui nous sommes",
      title: "La rigueur technique alliée à la sobriété éditoriale.",
      body: [
        "KartagoTech Agency est un studio d'ingénierie logicielle et de produits digitaux dédié à la création de systèmes fiables et maintenables. Nous intervenons à la croisée du web moderne, du logiciel métier sur mesure et de l'IA appliquée.",
        "Nous sommes convaincus qu'un bon produit numérique paraît simple à utiliser parce que son ingénierie est disciplinée. Plutôt que de surcharger les interfaces, nous privilégions la structure, la rapidité et la pérennité.",
      ],
    },
    mindset: {
      label: "02 — Esprit d'ingénierie & Philosophie",
      title: "Des principes qui guident chaque ligne de code.",
      body: "Un logiciel doit réduire la friction pour vos équipes et vos clients — jamais l'inverse.",
      principles: [
        {
          index: "01",
          title: "L'architecture par le besoin",
          description:
            "Nous commençons par comprendre la réalité opérationnelle d'un besoin avant de choisir les technologies.",
        },
        {
          index: "02",
          title: "Discipline visuelle suisse",
          description:
            "Typographie nette, respiration maîtrisée et hiérarchie claire garantissent des interfaces lisibles.",
        },
        {
          index: "03",
          title: "Qualité maintenable",
          description:
            "Typage strict, composants modulaires et documentation claire gardent votre plateforme évolutive.",
        },
        {
          index: "04",
          title: "Collaboration honnête",
          description:
            "Échanges directs, cadrage réaliste et avancement transparent — sans promesses exagérées ni jargon inutile.",
        },
      ],
    },
    howWeWork: {
      label: "03 — Notre façon de travailler",
      title: "Structurée, transparente et collaborative.",
      body: "Des ateliers de découverte initiaux jusqu'au déploiement et au suivi post-lancement, nous intervenons comme un véritable partenaire technique. Chaque jalon est défini clairement, validé ensemble et testé sur chaque support.",
    },
    international: {
      label: "04 — Positionnement International",
      title: "France · International",
      body: "Opérant naturellement en français et en anglais, KartagoTech allie les standards business européens à une ingénierie logicielle agile, pour servir nos clients en France et à distance à l'international.",
      regions: [
        {
          name: "France",
          role: "Marché Européen & Stratégie",
          detail:
            "Alignement avec les exigences françaises et européennes en matière de confidentialité, d'accessibilité et de qualité.",
        },
        {
          name: "International",
          role: "Livraison à distance",
          detail:
            "Collaboration structurée synchrone et asynchrone pour les équipes ambitieuses en Europe, région MENA et Amérique du Nord.",
        },
      ],
    },
  },
  contactPage: {
    metaTitle: "Contact — KartagoTech Agency",
    metaDescription:
      "Contactez KartagoTech Agency pour discuter de votre projet web, logiciel sur mesure, IA ou transformation digitale.",
    eyebrow: "Contact",
    title: "Parlons de ce que nous pouvons bâtir ensemble.",
    subtitle:
      "Présentez-nous votre projet, vos délais et vos objectifs. Chaque demande est étudiée avec attention pour une réponse directe.",
    directContactLabel: "Contact Direct",
    emailLabel: "E-mail",
    emailValue: "kartagotechagency@gmail.com",
    presenceLabel: "Présence",
    presenceValue: "France · International",
    responseLabel: "Langues",
    responseValue: "Français & English",
    form: {
      nameLabel: "Nom complet",
      namePlaceholder: "Votre nom et prénom",
      emailLabel: "E-mail professionnel",
      emailPlaceholder: "nom@entreprise.com",
      companyLabel: "Entreprise",
      companyPlaceholder: "Nom de votre entreprise ou organisation",
      serviceLabel: "Service souhaité",
      servicePlaceholder: "Sélectionner un service",
      serviceOptions: [
        "Développement Web",
        "Logiciel sur Mesure",
        "IA & Automatisation",
        "RPA & Automatisation des Processus Métier",
        "Transformation Digitale",
        "Multiple / Conseil",
      ],
      budgetLabel: "Budget estimé",
      budgetOptional: "(optionnel)",
      budgetPlaceholder: "Sélectionner une fourchette",
      budgetOptions: [
        "Moins de 5 000 €",
        "5 000 € – 15 000 €",
        "15 000 € – 35 000 €",
        "35 000 € +",
        "À définir ensemble",
      ],
      descriptionLabel: "Description du projet",
      descriptionPlaceholder:
        "Décrivez brièvement vos objectifs, fonctionnalités clés ou enjeux opérationnels...",
      submitButton: "Envoyer la demande",
      submittingButton: "Envoi en cours...",
      successTitle: "Demande enregistrée",
      successMessage:
        "Merci pour votre message. Votre brief a bien été transmis et notre équipe reviendra vers vous rapidement.",
      devNote:
        "Note environnement de développement : Aucun fournisseur d'e-mail externe n'est configuré ; l'envoi a été journalisé côté serveur.",
      resetButton: "Envoyer un autre message",
      errors: {
        nameRequired: "Veuillez saisir votre nom.",
        emailInvalid: "Veuillez saisir une adresse e-mail professionnelle valide.",
        serviceRequired: "Veuillez sélectionner le service souhaité.",
        descriptionRequired: "Veuillez décrire brièvement votre projet.",
        genericError:
          "Impossible d'envoyer votre demande pour le moment. Veuillez réessayer ou nous écrire directement.",
      },
    },
  },
  footer: {
    statement: "Des solutions digitales pour les entreprises ambitieuses.",
    navigationTitle: "Navigation",
    servicesTitle: "Services",
    contactTitle: "Contact",
    location: "France · International",
    rights: "KartagoTech Agency. Tous droits réservés.",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return locale === "fr" ? fr : en;
}
