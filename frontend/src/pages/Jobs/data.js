export const JOBS = [
  {
    id: 1,
    title: 'Designer UX/UI Senior',
    company: 'TechFlow',
    location: 'Paris, France',
    type: 'CDI',
    salary: '50-65k',
    tags: ['Design', 'Figma', 'User Research'],
    logo: 'TF',
    category: 'Design',
    level: 'Senior',
    description:
      "Rejoignez notre équipe de design pour créer des expériences utilisateur exceptionnelles. Nous cherchons un designer senior passionné par l'innovation et l'user-centered design.",
    missions: [
      'Concevoir des interfaces utilisateur intuitives et esthétiques',
      "Mener des recherches utilisateur et des tests d'usabilité",
      'Collaborer avec les développeurs et les product managers',
      'Créer des design systems et guidelines',
      'Participer aux discussions stratégiques sur le produit',
    ],
    idealProfile: [
      "5+ années d'expérience en UX/UI design",
      'Maîtrise de Figma et des outils de design modernes',
      'Expérience en user research et testing',
      'Excellentes compétences en communication',
      'Portfolio impressionnant démontrant votre travail',
      
      "Passionné par l'accessibilité et l'inclusivité",
    ],
    companyInfo: {
      name: 'TechFlow',
      description:
        'TechFlow est une startup innovante spécialisée dans les solutions de design et de développement. Fondée en 2015, nous comptons 150+ employés répartis entre Paris, Lyon et Toulouse.',
      website: 'www.techflow.fr',
      email: 'recrutement@techflow.fr',
      phone: '+33 1 23 45 67 89',
      employees: '100-150',
      sector: 'Technologie/SaaS',
      founded: '2015',
      culture:
        "Nous valorisons l'innovation, la collaboration et la bienveillance. Nos équipes travaillent en agile et bénéficient d'une grande autonomie.",
    },
    benefits: [
      'Télétravail possible (2 jours/semaine au bureau)',
      'Mutuelle premium + chèques vacances',
      'Budget formation annuel: 2000€',
      'Mac Book Pro fourni',
      'Accès à la salle de sport',
      "Restaurant d'entreprise subventionné",
    ],
    additionalInfo:
      'Nous recrutons actuellement 5 designers pour renforcer nos équipes. Cette offre est urgente!',
  },
  {
    id: 2,
    title: 'Développeur Full Stack',
    company: 'StartupX',
    location: 'Télétravail',
    type: 'CDI',
    salary: '45-60k',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    logo: 'SX',
    category: 'Développement',
    level: 'Mid',
    description:
      'Créez des applications web innovantes avec notre équipe de développeurs passionnés. Rejoignez une startup en forte croissance.',
    missions: [
      'Développer des fonctionnalités full stack en React et Node.js',
      "Contribuer à l'architecture et la scalabilité de l'application",
      'Écrire du code de qualité et des tests unitaires',
      "Collaborer en pair programming avec l'équipe",
      'Participer aux code reviews et aux discussions techniques',
    ],
    idealProfile: [
      "3-5 années d'expérience en développement",
      'Maîtrise de React, Node.js et PostgreSQL',
      'Bonnes pratiques en développement (TDD, clean code)',
      'Curiosité pour les nouvelles technologies',
      'Esprit d’équipe et communication claire',
      'Autonomie et capacité à apprendre rapidement',
    ],
    companyInfo: {
      name: 'StartupX',
      description:
        'StartupX est une scale-up basée à Lyon, spécialisée dans les outils SaaS pour les PME. Nous avons levé 10M€ en série B et connaissons une croissance de 200% année/année.',
      website: 'www.startupx.fr',
      email: 'jobs@startupx.fr',
      phone: '+33 4 78 90 12 34',
      employees: '50-100',
      sector: 'SaaS/B2B',
      founded: '2019',
      culture:
        "Culture startup avec liberté et responsabilité. Environnement collaboratif et d'apprentissage continu.",
    },
    benefits: [
      '100% télétravail possible',
      'Stock options',
      'Mutuelle 100% remboursée',
      'Coaching professionnel',
      'Budget perso de 1000€/an (livres, formations)',
      'Conférences tech et événements',
    ],
    additionalInfo:
      'Grosse demande pour les développeurs. Nous pouvons accélérer le processus de recrutement.',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'DataCore',
    location: 'Lyon, France',
    type: 'CDI',
    salary: '48-62k',
    tags: ['Product', 'Analytics', 'Leadership'],
    logo: 'DC',
    category: 'Gestion de Produit',
    level: 'Senior',
    description:
      "Pilotez la stratégie produit et façonnez l'avenir de notre plateforme de big data. Leadership, vision et impact.",
    missions: [
      'Définir la vision et la stratégie produit',
      'Gérer le backlog produit et les priorités',
      'Animer les découvertes utilisateurs et ateliers',
      'Collaborer avec ingénierie, design et marketing',
      "Analyser les métriques et l'impact des features",
    ],
    idealProfile: [
      "5+ années d'expérience en Product Management",
      'Expérience en analytics et data-driven decision making',
      'Leadership et gestion de projets complexes',
      'Excellentes compétences en communication',
      'Expérience B2B ou big data un plus',
      'Passionné par la création de produits',
    ],
    companyInfo: {
      name: 'DataCore',
      description:
        "DataCore est l'un des leaders français de la plateforme de big data et d'analytics. Nous servons des entreprises du CAC40 et notre croissance est en hausse de 45% YoY.",
      website: 'www.datacore.fr',
      email: 'careers@datacore.fr',
      phone: '+33 4 72 11 22 33',
      employees: '200-500',
      sector: 'Data/Big Data',
      founded: '2012',
      culture:
        "Expertise reconnue, impact client énorme, liberté d'action, apprentissage continu.",
    },
    benefits: [
      'Télétravail 2-3 jours/semaine',
      'Mutuelle premium + tickets resto',
      'RTT (25 jours)',
      'Budget formation: 3000€/an',
      "Comité d'entreprise actif",
      'Séminaires annuels',
    ],
    additionalInfo:
      'Poste stratégique important pour notre roadmap 2025. Opportunité d\'impact direct.',
  },
  // Entries 4-8 minimal fields to keep list working
  { id: 4, title: 'Développeur Backend Python', company: 'CloudSync', location: 'Toulouse, France', type: 'CDI', salary: '42-55k', tags: ['Python', 'AWS', 'Docker'], logo: 'CS', category: 'Développement', level: 'Mid' },
  { id: 5, title: 'Développeur Frontend React', company: 'WebStudio', location: 'Paris, France', type: 'CDI', salary: '40-52k', tags: ['React', 'TypeScript', 'Tailwind'], logo: 'WS', category: 'Développement', level: 'Junior' },
  { id: 6, title: 'Data Scientist', company: 'AICore', location: 'Télétravail', type: 'CDI', salary: '55-70k', tags: ['Python', 'Machine Learning', 'SQL'], logo: 'AC', category: 'Data', level: 'Senior' },
  { id: 7, title: 'Chef de Projet IT', company: 'ConsultTech', location: 'Bordeaux, France', type: 'CDI', salary: '45-55k', tags: ['Agile', 'Leadership', 'Budget'], logo: 'CT', category: 'Gestion de Projet', level: 'Senior' },
  { id: 8, title: 'DevOps Engineer', company: 'CloudInfra', location: 'Télétravail', type: 'CDI', salary: '50-65k', tags: ['Kubernetes', 'AWS', 'Docker'], logo: 'CI', category: 'Infrastructure', level: 'Mid' },
]


