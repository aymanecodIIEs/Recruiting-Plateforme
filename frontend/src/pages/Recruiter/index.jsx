import { useState } from "react"
import {
  Building2,
  Image,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react"
import { useAuth } from "../../context/useAuth"

const recruiterHighlights = [
  {
    title: "Candidats qualifiés",
    description: "Accédez à un vivier de talents présélectionnés selon vos besoins métiers.",
  },
  {
    title: "Accompagnement dédié",
    description: "Nos experts Success Pool vous conseillent à chaque étape du processus de recrutement.",
  },
  {
    title: "Suivi transparent",
    description: "Visualisez en temps réel l'avancée de vos campagnes et les performances de vos annonces.",
  },
]

const protectedMetrics = [
  { label: "Profils en correspondance", value: "128" },
  { label: "Entretiens programmés", value: "36" },
  { label: "Taux de conversion", value: "72%" },
]

const upcomingActions = [
  { time: "09:30", title: "Préqualification candidat", detail: "Pauline, Lead Backend" },
  { time: "11:00", title: "Comité de recrutement", detail: "Roadmap Q1" },
  { time: "15:15", title: "Signature contrat", detail: "Développeur Front - ScaleUp" },
]

const recommendedCandidates = [
  {
    name: "Lina Moreau",
    role: "Data Scientist Senior",
    experience: "7 ans d'expérience · IA & Risk Analytics",
    score: 92,
    availability: "Disponible sous 1 mois",
    note: "Ex-Lead Data chez Crédit Agricole, pilotage de projets anti-fraude IA.",
  },
  {
    name: "Yanis Belkacem",
    role: "Product Manager Digital Banking",
    experience: "9 ans d'expérience · Mobile & Paiements",
    score: 88,
    availability: "Préavis de 2 mois",
    note: "Responsable lancement app paiement instantané SG Afrique.",
  },
  {
    name: "Sarah Ndiaye",
    role: "Compliance Officer",
    experience: "6 ans d'expérience · KYC & LCB-FT",
    score: 85,
    availability: "Disponible immédiatement",
    note: "Pilote la remédiation KYC pour portefeuille grands comptes.",
  },
]

const loginFormInitialState = {
  email: "",
  password: "",
}

const signupFormInitialState = {
  companyName: "",
  recruiterLastName: "",
  recruiterFirstName: "",
  companyEmail: "",
  contactNumber: "",
  profilePhoto: null,
  password: "",
}

export default function RecruiterPortal() {
  const { user, login, logout } = useAuth()
  const [statusMessage, setStatusMessage] = useState(null)
  const [loginForm, setLoginForm] = useState(loginFormInitialState)
  const [signupForm, setSignupForm] = useState(signupFormInitialState)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const isRecruiterAuthenticated = user?.role === "recruiter"
  const isSubscribed = user?.isSubscribed ?? false
  const recruiterCompany = user?.company ?? "Société Générale"

  const statusVariants = {
    success: "border-primary/40 bg-primary/10 text-primary",
    error: "border-destructive/40 bg-destructive/10 text-destructive",
    info: "border-accent/40 bg-accent/10 text-primary",
  }

  const handleCloseModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
  }

  const openLoginModal = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  const openSignupModal = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (event) => {
    const { name, value, files } = event.target
    if (name === "profilePhoto") {
      setSignupForm((prev) => ({ ...prev, profilePhoto: files?.[0] ?? null }))
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    setStatusMessage(null)
    try {
      const account = login(loginForm.email, loginForm.password)
      setLoginForm(loginFormInitialState)
      handleCloseModals()

      if (account.role === "recruiter") {
        setStatusMessage({
          type: "success",
          text: "Authentification réussie. Bienvenue dans l'espace recruteur Success Pool.",
        })
      } else {
        setStatusMessage({
          type: "info",
          text: "Compte candidat connecté. Cet espace reste réservé aux recruteurs. L'espace candidat arrive très prochainement.",
        })
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error?.message ?? "Impossible de vous connecter. Merci de vérifier vos identifiants.",
      })
    }
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault()
    setStatusMessage(null)
    setStatusMessage({
      type: "success",
      text: "Votre demande d'accès recruteur a été enregistrée. Notre équipe vous recontactera sous 24h.",
    })
    setSignupForm(signupFormInitialState)
    handleCloseModals()
  }

  return (
    <main className="bg-background">
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/10 via-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-accent/10 via-background to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {statusMessage && (
            <div
              className={`mb-8 rounded-3xl border px-6 py-4 text-sm font-medium ${
                statusVariants[statusMessage.type] ?? "border-border/70 bg-secondary/80 text-foreground"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {user && (
            <div className="mb-10 flex flex-col justify-between gap-3 rounded-3xl border border-border/70 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Connecté en tant que {user.role === "recruiter" ? "recruteur démo" : "candidat démo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.fullName} · {user.email}
                </p>
                {user.role !== "recruiter" && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Cet espace reste réservé aux recruteurs Success Pool. Conservez ce compte pour tester l'expérience candidat dès qu'elle sera disponible.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                className="self-start rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                Se déconnecter
              </button>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-10">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary" /> Accès exclusif recruteur
                </span>
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
                  Accédez à l'espace recruteur Success Pool
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  Centralisez vos recrutements, suivez vos campagnes et collaborez avec nos experts dans un environnement sécurisé.
                  Connectez-vous ou créez un compte pour déverrouiller votre tableau de bord personnalisé.
                </p>
                <div className="grid gap-4">
                  {recruiterHighlights.map((highlight) => (
                    <div key={highlight.title} className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{highlight.title}</p>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  <ShieldCheck size={16} /> Accès sécurisé
                </span>
                <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Activez votre portail Success Pool</h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Centralisez vos recrutements, obtenez des recommandations intelligentes et collaborez avec nos experts tout en gardant la maîtrise totale de vos données.
                </p>
              </div>

              {isRecruiterAuthenticated && (
                <div className="space-y-5 rounded-3xl border border-border/60 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Recommandés par {recruiterCompany}
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">Candidats mis en avant</h3>
                    <p className="text-sm text-muted-foreground">
                      Trois talents présélectionnés par Success Pool pour vos besoins prioritaires.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {recommendedCandidates.map((candidate) => (
                      <div key={candidate.name} className="rounded-2xl border border-border/60 bg-secondary/60 px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Score {candidate.score}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                        <p className="text-xs text-muted-foreground">{candidate.note}</p>
                        <p className="pt-2 text-xs font-medium text-primary">{candidate.availability}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 px-4 py-3 text-xs text-primary">
                    {isSubscribed
                      ? "Vous êtes abonné Success Pool : accédez à l'ensemble des recommandations Société Générale."
                      : "Pour débloquer davantage de profils recommandés, abonnez-vous directement depuis l'application Success Pool."}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="rounded-4xl border border-border/60 bg-white/98 p-8 shadow-2xl backdrop-blur">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Tableau de bord</p>
                    <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Vue d'ensemble recruteur</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Visualisez vos indicateurs clés, vos prochaines actions et vos priorités Success Pool dans un espace sécurisé et synchronisé en temps réel.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-primary/25 bg-primary/10 px-5 py-4 text-xs text-primary shadow-inner">
                    <p className="font-semibold uppercase tracking-[0.28em]">Société Générale</p>
                    <p className="mt-1 text-[0.78rem] text-primary/80">Accès premium activé · Talent Partner Success Pool</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {protectedMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="group rounded-3xl border border-border/50 bg-secondary/60 px-5 py-6 text-center shadow-lg shadow-primary/5 transition hover:border-primary/40 hover:shadow-primary/20"
                    >
                      <p className="text-3xl font-semibold text-foreground md:text-4xl">{metric.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.26em] text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Actions du jour</p>
                    <span className="text-xs text-muted-foreground">Synchronisé à 08:15 · Data temps réel</span>
                  </div>
                  <div className="space-y-3">
                    {upcomingActions.map((action) => (
                      <div
                        key={action.title}
                        className="group flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-white/90 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{action.time}</p>
                          <p className="text-sm font-semibold text-foreground">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.detail}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                          À suivre
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isRecruiterAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-4xl border border-dashed border-primary/40 bg-background/80 text-center shadow-inner backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock size={22} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">S'abonner pour voir plus de candidats recommandés</p>
                    <p className="text-xs text-muted-foreground">
                      Connectez-vous ou créez votre compte recruteur pour accéder à vos données et actions.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="rounded-full border border-primary px-4 py-2 transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Se connecter
                    </button>
                    <button
                      type="button"
                      onClick={openSignupModal}
                      className="rounded-full border border-primary px-4 py-2 transition hover:bg-primary hover:text-primary-foreground"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showLoginModal && (
        <Modal onClose={handleCloseModals}>
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lock size={18} className="text-primary" /> Connexion recruteur
            </div>
            <p className="text-sm text-muted-foreground">
              Accédez à vos campagnes actives en toute sécurité.
            </p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-sm">
            <label className="block">
              <span className="mb-2 block font-medium text-muted-foreground">Email professionnel</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <Mail size={18} className="text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="prenom.nom@entreprise.com"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block font-medium text-muted-foreground">Mot de passe</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <KeyRound size={18} className="text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl"
            >
              Se connecter
            </button>
          </form>
        </Modal>
      )}

      {showSignupModal && (
        <Modal onClose={handleCloseModals} className="md:max-w-3xl">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <UserPlus size={18} /> Créer un compte recruteur
            </div>
            <p className="text-sm text-muted-foreground">
              Renseignez vos informations pour recevoir vos accès personnalisés sous 24h.
            </p>
          </div>
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Nom de l'entreprise</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Building2 size={18} className="text-primary" />
                  <input
                    type="text"
                    name="companyName"
                    value={signupForm.companyName}
                    onChange={handleSignupChange}
                    placeholder="Success Pool"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block font-medium text-muted-foreground">Nom</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <User size={18} className="text-primary" />
                  <input
                    type="text"
                    name="recruiterLastName"
                    value={signupForm.recruiterLastName}
                    onChange={handleSignupChange}
                    placeholder="Dupont"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block font-medium text-muted-foreground">Prénom</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <User size={18} className="text-primary" />
                  <input
                    type="text"
                    name="recruiterFirstName"
                    value={signupForm.recruiterFirstName}
                    onChange={handleSignupChange}
                    placeholder="Claire"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Email de contact</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Mail size={18} className="text-primary" />
                  <input
                    type="email"
                    name="companyEmail"
                    value={signupForm.companyEmail}
                    onChange={handleSignupChange}
                    placeholder="talents@successpool.com"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Numéro de contact</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <Phone size={18} className="text-primary" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={signupForm.contactNumber}
                    onChange={handleSignupChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Photo de profil</span>
                <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-white px-4 py-3">
                  <Image size={18} className="text-primary" />
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleSignupChange}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-primary file:transition file:hover:bg-primary/20"
                    required
                  />
                </div>
                <span className="mt-1 block text-xs text-muted-foreground/80">Formats acceptés : JPG, PNG (max 5 Mo)</span>
                {signupForm.profilePhoto && (
                  <span className="mt-1 block text-xs text-muted-foreground">{signupForm.profilePhoto.name}</span>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block font-medium text-muted-foreground">Mot de passe</span>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-white px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  <KeyRound size={18} className="text-primary" />
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="Définissez un mot de passe sécurisé"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    required
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full border border-primary bg-primary/90 px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary"
            >
              Demander un accès recruteur
            </button>
          </form>
        </Modal>
      )}
    </main>
  )
}

function Modal({ onClose, className = "", children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-6 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
  className={`relative w-full max-h-[calc(100vh-3rem)] max-w-[min(100%,36rem)] overflow-y-auto rounded-4xl border border-border/70 bg-white/98 p-6 shadow-2xl backdrop-blur-md sm:max-w-[min(100%,40rem)] md:max-w-2xl md:p-8 ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label="Fermer la fenêtre modale"
        >
          <X size={18} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  )
}
