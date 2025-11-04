"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, DollarSign, Users, CheckCircle, AlertCircle, Mail, Phone, Globe } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function JobDetailPage() {
  const params = useParams()
  const jobId = Number.parseInt(params.id)

  // Base de données d'offres d'emploi enrichie
  const allJobs = [
    {
      id: 1,
      title: "Designer UX/UI Senior",
      company: "TechFlow",
      location: "Paris, France",
      type: "CDI",
      salary: "50-65k",
      tags: ["Design", "Figma", "User Research"],
      logo: "TF",
      category: "Design",
      level: "Senior",
      description:
        "Rejoignez notre équipe de design pour créer des expériences utilisateur exceptionnelles. Nous cherchons un designer senior passionné par l'innovation et l'user-centered design.",
      missions: [
        "Concevoir des interfaces utilisateur intuitives et esthétiques",
        "Mener des recherches utilisateur et des tests d'usabilité",
        "Collaborer avec les développeurs et les product managers",
        "Créer des design systems et guidelines",
        "Participer aux discussions stratégiques sur le produit",
      ],
      idealProfile: [
        "5+ années d'expérience en UX/UI design",
        "Maîtrise de Figma et des outils de design modernes",
        "Expérience en user research et testing",
        "Excellentes compétences en communication",
        "Portfolio impressionnant démontrant votre travail",
        "Passionné par l'accessibilité et l'inclusivité",
      ],
      companyInfo: {
        name: "TechFlow",
        description:
          "TechFlow est une startup innovante spécialisée dans les solutions de design et de développement. Fondée en 2015, nous comptons 150+ employés répartis entre Paris, Lyon et Toulouse.",
        website: "www.techflow.fr",
        email: "recrutement@techflow.fr",
        phone: "+33 1 23 45 67 89",
        employees: "100-150",
        sector: "Technologie/SaaS",
        founded: "2015",
        culture:
          "Nous valorisons l'innovation, la collaboration et la bienveillance. Nos équipes travaillent en agile et bénéficient d'une grande autonomie.",
      },
      benefits: [
        "Télétravail possible (2 jours/semaine au bureau)",
        "Mutuelle premium + chèques vacances",
        "Budget formation annuel: 2000€",
        "Mac Book Pro fourni",
        "Accès à la salle de sport",
        "Restaurant d'entreprise subventionné",
      ],
      additionalInfo: "Nous recrutons actuellement 5 designers pour renforcer nos équipes. Cette offre est urgente!",
    },
    {
      id: 2,
      title: "Développeur Full Stack",
      company: "StartupX",
      location: "Télétravail",
      type: "CDI",
      salary: "45-60k",
      tags: ["React", "Node.js", "PostgreSQL"],
      logo: "SX",
      category: "Développement",
      level: "Mid",
      description:
        "Créez des applications web innovantes avec notre équipe de développeurs passionnés. Rejoignez une startup en forte croissance.",
      missions: [
        "Développer des fonctionnalités full stack en React et Node.js",
        "Contribuer à l'architecture et la scalabilité de l'application",
        "Écrire du code de qualité et des tests unitaires",
        "Collaborer en pair programming avec l'équipe",
        "Participer aux code reviews et aux discussions techniques",
      ],
      idealProfile: [
        "3-5 années d'expérience en développement",
        "Maîtrise de React, Node.js et PostgreSQL",
        "Bonnes pratiques en développement (TDD, clean code)",
        "Curiosité pour les nouvelles technologies",
        "Esprit d'équipe et communication claire",
        "Autonomie et capacité à apprendre rapidement",
      ],
      companyInfo: {
        name: "StartupX",
        description:
          "StartupX est une scale-up basée à Lyon, spécialisée dans les outils SaaS pour les PME. Nous avons levé 10M€ en série B et connaissons une croissance de 200% année/année.",
        website: "www.startupx.fr",
        email: "jobs@startupx.fr",
        phone: "+33 4 78 90 12 34",
        employees: "50-100",
        sector: "SaaS/B2B",
        founded: "2019",
        culture:
          "Culture startup avec liberté et responsabilité. Environnement collaboratif et d'apprentissage continu.",
      },
      benefits: [
        "100% télétravail possible",
        "Stock options",
        "Mutuelle 100% remboursée",
        "Coaching professionnel",
        "Budget perso de 1000€/an (livres, formations)",
        "Conférences tech et événements",
      ],
      additionalInfo: "Grosse demande pour les développeurs. Nous pouvons accélérer le processus de recrutement.",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "DataCore",
      location: "Lyon, France",
      type: "CDI",
      salary: "48-62k",
      tags: ["Product", "Analytics", "Leadership"],
      logo: "DC",
      category: "Gestion de Produit",
      level: "Senior",
      description:
        "Pilotez la stratégie produit et façonnez l'avenir de notre plateforme de big data. Leadership, vision et impact.",
      missions: [
        "Définir la vision et la stratégie produit",
        "Gérer le backlog produit et les priorités",
        "Animer les découvertes utilisateurs et ateliers",
        "Collaborer avec ingénierie, design et marketing",
        "Analyser les métriques et l'impact des features",
      ],
      idealProfile: [
        "5+ années d'expérience en Product Management",
        "Expérience en analytics et data-driven decision making",
        "Leadership et gestion de projets complexes",
        "Excellentes compétences en communication",
        "Expérience B2B ou big data un plus",
        "Passionné par la création de produits",
      ],
      companyInfo: {
        name: "DataCore",
        description:
          "DataCore est l'un des leaders français de la plateforme de big data et d'analytics. Nous servons des entreprises du CAC40 et notre croissance est en hausse de 45% YoY.",
        website: "www.datacore.fr",
        email: "careers@datacore.fr",
        phone: "+33 4 72 11 22 33",
        employees: "200-500",
        sector: "Data/Big Data",
        founded: "2012",
        culture: "Expertise reconnue, impact client énorme, liberté d'action, apprentissage continu.",
      },
      benefits: [
        "Télétravail 2-3 jours/semaine",
        "Mutuelle premium + tickets resto",
        "RTT (25 jours)",
        "Budget formation: 3000€/an",
        "Comité d'entreprise actif",
        "Séminaires annuels",
      ],
      additionalInfo: "Poste stratégique important pour notre roadmap 2025. Opportunité d'impact direct.",
    },
  ]

  const job = allJobs.find((j) => j.id === jobId)

  if (!job) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Offre non trouvée</h1>
          <Link href="/jobs" className="text-primary hover:underline">
            Retour aux offres
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/jobs" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 mb-4">
            <ArrowLeft size={20} /> Retour aux offres
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold text-2xl">
              {job.logo}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-foreground mb-2">{job.title}</h1>
              <p className="text-primary-foreground/90 text-lg mb-3">{job.company}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-primary-foreground text-primary rounded-full text-sm font-semibold">
                  {job.level}
                </span>
                <span className="px-3 py-1 bg-primary-foreground text-primary rounded-full text-sm font-semibold">
                  {job.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-primary" />
              <span className="text-xs text-muted-foreground">Localisation</span>
            </div>
            <p className="font-semibold text-foreground">{job.location}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-primary" />
              <span className="text-xs text-muted-foreground">Type de contrat</span>
            </div>
            <p className="font-semibold text-foreground">{job.type}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-primary" />
              <span className="text-xs text-muted-foreground">Salaire</span>
            </div>
            <p className="font-semibold text-foreground">{job.salary}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-primary" />
              <span className="text-xs text-muted-foreground">Postes</span>
            </div>
            <p className="font-semibold text-foreground">1 ouvert</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">À propos du poste</h2>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </section>

          {/* Missions */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vos missions</h2>
            <ul className="space-y-3">
              {job.missions.map((mission, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{mission}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Ideal Profile */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Profil idéal</h2>
            <ul className="space-y-3">
              {job.idealProfile.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-border text-foreground rounded-full text-sm font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Company Info Card */}
          <div className="sticky top-4 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">À propos de l'entreprise</h3>

              <div className="mb-4">
                <h4 className="font-semibold text-foreground mb-2">{job.companyInfo.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{job.companyInfo.description}</p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Secteur</p>
                  <p className="text-sm font-semibold text-foreground">{job.companyInfo.sector}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Employés</p>
                  <p className="text-sm font-semibold text-foreground">{job.companyInfo.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fondée</p>
                  <p className="text-sm font-semibold text-foreground">{job.companyInfo.founded}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-2">Culture d'entreprise</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.companyInfo.culture}</p>
              </div>

              <div className="space-y-2">
                <a
                  href={`mailto:${job.companyInfo.email}`}
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Mail size={16} /> {job.companyInfo.email}
                </a>
                <a
                  href={`tel:${job.companyInfo.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Phone size={16} /> {job.companyInfo.phone}
                </a>
                <a
                  href={`https://${job.companyInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <Globe size={16} /> {job.companyInfo.website}
                </a>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Avantages sociaux</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            {job.additionalInfo && (
              <div className="bg-accent/10 border border-accent rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-accent">{job.additionalInfo}</p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-opacity-90 transition text-lg">
              Candidater maintenant
            </button>

            <button className="w-full py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
              Sauvegarder l'offre
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
