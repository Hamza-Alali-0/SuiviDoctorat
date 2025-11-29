import { Injectable, signal, computed } from '@angular/core';

type Lang = 'en' | 'fr' | 'ar';

const TRANSLATIONS: Record<Lang, any> = {
  en: {
    hero: {
      badge: 'Next-Generation PhD Management',
      title_pre: 'Transform Your',
      title_highlight: 'Doctoral Journey',
      subtitle: 'AI-powered platform for seamless research management, collaboration, and defense preparation'
    },
    cta: {
      getStarted: 'Get Started Free',
      watchDemo: 'Watch Demo',
      badge: 'Join 15,000+ Researchers',
      title: 'Ready to Transform Your PhD Journey?',
      text: 'Start managing your research like a pro. No credit card required.',
      start: 'Start Free Trial',
      schedule: 'Schedule Demo'
    },
    about: {
      badge: 'About Us',
      title: 'Reimagining the Doctoral Experience',
      text: 'SuiviDoctorat is the first comprehensive platform designed specifically for the modern PhD journey. We bridge the gap between researchers, supervisors, and administration to create a seamless, collaborative, and efficient academic ecosystem.'
    },
    footer: {
      description: 'The complete platform for managing your doctoral journey, from enrollment to defense.'
    }
  },
  fr: {
    hero: {
      badge: 'Gestion de doctorat de nouvelle génération',
      title_pre: 'Transformez votre',
      title_highlight: 'parcours doctoral',
      subtitle: 'Plateforme alimentée par l’IA pour la gestion de la recherche, la collaboration et la préparation à la soutenance'
    },
    cta: {
      getStarted: 'Commencer gratuitement',
      watchDemo: 'Voir la démo',
      badge: "Rejoignez 15 000+ chercheurs",
      title: 'Prêt à transformer votre parcours de doctorat ?',
      text: "Commencez à gérer votre recherche comme un pro. Aucune carte de crédit requise.",
      start: 'Essai gratuit',
      schedule: 'Planifier une démo'
    },
    about: {
      badge: 'À propos',
      title: 'Réinventer l’expérience doctorale',
      text: "SuiviDoctorat est la première plateforme complète conçue spécifiquement pour le parcours doctoral moderne. Nous comblons le fossé entre chercheurs, encadrants et administration pour créer un écosystème académique fluide et collaboratif."
    },
    footer: {
      description: 'La plateforme complète pour gérer votre parcours doctoral, de l’inscription à la soutenance.'
    }
  },
  ar: {
    hero: {
      badge: 'إدارة الدكتوراه الجيل التالي',
      title_pre: 'حوّل',
      title_highlight: 'رحلة الدكتوراه الخاصة بك',
      subtitle: 'منصة مدعومة بالذكاء الاصطناعي لإدارة الأبحاث والتعاون والتحضير للمناقشة'
    },
    cta: {
      getStarted: 'ابدأ مجاناً',
      watchDemo: 'شاهد العرض',
      badge: 'انضم إلى أكثر من 15,000 باحث',
      title: 'هل أنت مستعد لتحويل رحلة الدكتوراه الخاصة بك؟',
      text: 'ابدأ إدارة أبحاثك باحتراف. لا حاجة لبطاقة ائتمان.',
      start: 'ابدأ التجربة المجانية',
      schedule: 'جدولة عرض توضيحي'
    },
    about: {
      badge: 'معلومات عنا',
      title: 'إعادة تصور تجربة الدكتوراه',
      text: 'SuiviDoctorat هي المنصة الشاملة المصممة خصيصًا لرحلة الدكتوراه الحديثة. نجسر الفجوة بين الباحثين والمشرفين والإدارة لإنشاء نظام أكاديمي سلس وتعاوني وفعال.'
    },
    footer: {
      description: 'المنصة الكاملة لإدارة رحلة الدكتوراه الخاصة بك، من التسجيل حتى المناقشة.'
    }
  }
};

// Add shared keys for all languages (extend objects above)
// We'll extend the objects programmatically here to avoid repetition in the literal, but
// since this file is small and static we will patch the maps directly below.

// Extend English
TRANSLATIONS.en.stats = {
  researchers: 'PhD Students Enrolled',
  completion: 'Avg. Completion',
  universities: 'Partner Universities',
  satisfaction: 'User Satisfaction',
  noData: 'No data'
};
TRANSLATIONS.en.about.features = {
  workflow: { title: 'Streamlined Workflow', text: 'From enrollment to defense, every step is digitized and simplified.' },
  collaboration: { title: 'Enhanced Collaboration', text: 'Real-time tools for feedback, document sharing, and mentorship.' }
};
TRANSLATIONS.en.about.secure = { title: 'Secure & Private', text: 'End-to-end encryption' };
TRANSLATIONS.en.how = { title: 'How It Works', subtitle: 'Get started in minutes with our streamlined onboarding', step1: { title: 'Create Your Account', text: 'Sign up in seconds and set up your researcher profile with AI-assisted completion' }, step2: { title: 'Import Your Research', text: 'Upload documents, connect repositories, and sync your bibliography automatically' }, step3: { title: 'Collaborate & Track', text: 'Work with advisors, track milestones, and prepare for defense with real-time insights' }, step4: { title: 'Defend Successfully', text: 'Schedule defense, invite jury members, and complete your journey with confidence' } };
TRANSLATIONS.en.campaigns = { header: { title: 'Featured Doctoral Campaigns', subtitle: 'Discover select public PhD openings now available' }, searchLabel: 'Search campaigns', searchPlaceholder: 'Search campaigns, university or domain', viewAll: 'View all campaigns', funded: 'Funded', details: 'View details', apply: 'Apply', empty: 'No campaigns match your search.' };
TRANSLATIONS.en.features = { header: { badge: 'Platform Features', title: 'Everything You Need for Your Doctorate', subtitle: 'Comprehensive apps designed for large-scale collaboration and research management' }, apps: { campaigns: { title: 'Campaigns & Matching', text: 'Smart matching surfaces best-fit PhD openings; track applications and notifications in one app.' }, defense: { title: 'Defense & Scheduling', text: 'Coordinate committees, send invites, and manage defense logistics with calendar integrations.' }, docs: { title: 'Document Hub', text: 'Versioned storage, AI summarization and citation extraction for every document you upload.' }, collab: { title: 'Collaboration Suite', text: 'Real-time commenting, task assignment, and version tracking across teams and advisors.' } } };
TRANSLATIONS.en.testimonials = { header: { badge: 'Success Stories', title: 'Trusted by Leading Researchers', subtitle: 'See what PhD students say about their experience' }, t1: { quote: 'SuiviDoctorat transformed how I manage my research. The collaboration tools made working with my advisors seamless, and I defended 6 months early!', author: 'Dr. Sarah Chen', title: 'Computer Science PhD, MIT' }, t2: { quote: 'The document management and timeline tracking features are game-changers. I always know exactly where I stand and what\'s next.', author: 'Dr. Michael Kumar', title: 'Biology PhD, Oxford' }, t3: { quote: 'Best investment in my PhD journey. The AI-powered insights helped me identify gaps in my research early and stay on track throughout.', author: 'Dr. Emma Laurent', title: 'Physics PhD, Sorbonne' } };
TRANSLATIONS.en.faq = { header: { badge: 'FAQ', title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about getting started' }, q1: { q: 'How long does it take to set up?', a: 'You can create your account and start managing your research in under 5 minutes. Our AI-assisted onboarding makes it incredibly fast.' }, q2: { q: 'Is my research data secure?', a: 'Absolutely. We use enterprise-grade encryption, comply with GDPR, and store all data on secure servers with regular backups.' }, q3: { q: 'Can I collaborate with my advisors?', a: 'Yes! Invite unlimited advisors and committee members. They get free access to collaborate on your research projects.' }, q4: { q: 'What file formats are supported?', a: 'We support all major formats including PDF, Word, LaTeX, Excel, and can integrate with reference managers like Zotero and Mendeley.' }, q5: { q: 'Is there a mobile app?', a: 'Our platform is fully responsive and works perfectly on mobile. Native iOS and Android apps are coming soon.' }, q6: { q: 'What if I need help?', a: 'We offer 24/7 support via chat, email, and video calls. Plus, access to our knowledge base and community forum anytime.' } };
TRANSLATIONS.en.cta.trust = 'Trusted by universities worldwide • 4.9/5 rating • Free forever plan available';
TRANSLATIONS.en.status = { open: 'Open', 'closing-soon': 'Closing soon', closed: 'Closed' };
TRANSLATIONS.en.footer = Object.assign({}, TRANSLATIONS.en.footer, { col: { platform: 'Platform', resources: 'Resources', contact: 'Contact' }, links: { home: 'Home', campaigns: 'Campaigns', features: 'Features', pricing: 'Pricing', documentation: 'Documentation', help: 'Help Center', community: 'Community', blog: 'Blog' }, contact: { email: 'support@suividoctorat.com', phone: '+212 5 37 77 00 00', location: 'Rabat, Morocco' } });

// Auth, Contact, Reset (English)
TRANSLATIONS.en.auth = {
  brand: { headline: 'Your PhD Journey,\nExpertly Managed', features: ['Track research milestones and deadlines', 'Collaborate with supervisors seamlessly', 'Secure document management'], trusted: 'Trusted by researchers worldwide' },
  tabs: { signin: 'Sign In', signup: 'Sign Up' },
  signin: { title: 'Welcome Back', subtitle: 'Sign in to continue your research journey', emailPlaceholder: 'your.email@university.edu', passwordPlaceholder: 'Enter your password', forgot: 'Forgot password?', btn: 'Sign In' },
  signup: { title: 'Create Your Account', subtitle: 'Join the academic community today', first: 'First Name', last: 'Last Name', phone: 'Phone Number', pass: 'Password', confirm: 'Confirm Password', terms: 'I accept the Terms and Services', btn: 'Create Account' },
  errors: { required: 'Required', email: 'Invalid email', match: 'Passwords do not match', min: 'Min 6 chars' },
  verify: { title: 'Email Verification Required', info: 'Enter the code sent to:', resend: 'Resend Code', btn: 'Verify & Continue' },
  forgot: { title: 'Reset your password', info: 'Enter your email to receive a reset link.', btn: 'Send reset link', cancel: 'Cancel' }
};
TRANSLATIONS.en.contact = {
  hero: { badge: 'Support & Inquiries', title: 'Get in Touch', subtitle: 'Have questions? Need support? We are here to help you succeed.' },
  info: { phone: 'Phone Support', email: 'Email Us', visit: 'Visit Us' },
  form: { title: 'Send us a message', subtitle: 'Fill out the form below and our team will reach out.', first: 'First Name', last: 'Last Name', email: 'Email Address', subject: 'Subject', message: 'Message', btn: 'Send Message' },
  subjects: ['General Inquiry', 'Technical Support', 'Feedback', 'Partnership']
};
TRANSLATIONS.en.reset = {
  title: 'Reset Password',
  descToken: 'Token detected. Set your new password.',
  descCode: 'Enter email and code, or paste token.',
  email: 'Email', token: 'Token', code: 'Code (6 digits)', newPass: 'New Password', confirm: 'Confirm Password',
  btn: 'Validate', cancel: 'Cancel'
};

// About, Campaigns, CampaignDetail (English)
TRANSLATIONS.en.aboutPage = {
  hero: { title: 'Empowering Research', subtitle: 'We are dedicated to advancing academic excellence through innovative technology.' },
  mission: { title: 'Our Mission', text: 'To streamline the doctoral journey for students and institutions worldwide.' },
  vision: { title: 'Our Vision', text: 'A world where research management is effortless and collaborative.' },
  values: { title: 'Our Values', innovation: 'Innovation', integrity: 'Integrity', collaboration: 'Collaboration' }
};
TRANSLATIONS.en.campaignsPage = {
  title: 'Doctoral Campaigns',
  subtitle: 'Your gateway to academic excellence. Explore hundreds of PhD opportunities.',
  stats: { active: 'Active Campaigns', partners: 'Partner Universities', support: 'Support Available' },
  cta: { start: 'Start Now', refresh: 'Refresh Data' },
  filters: { search: 'Search campaigns...', types: 'Campaign Type', status: 'Status', sort: 'Sort by', favorites: 'Favorites only' },
  status: { all: 'All Statuses', active: 'Active', upcoming: 'Upcoming', ended: 'Ended' },
  sort: { relevance: 'Relevance', deadline: 'Deadline', recent: 'Most Recent' },
  card: { deadline: 'Deadline', candidates: 'Candidates', daysLeft: 'Days left', view: 'View Details', apply: 'Apply', applied: 'Applied' },
  empty: { title: 'No campaigns found', text: 'Try adjusting your filters.' },
  typeLabels: { INSCRIPTION: 'Enrollment', REINSCRIPTION: 'Re-enrollment', SOUTENANCE: 'Defense' }
};
TRANSLATIONS.en.campaignDetail = {
  loading: 'Loading campaign...',
  back: 'Back to campaigns',
  hero: { favorite: 'Add to Favorites', unfavorite: 'Remove from Favorites', apply: 'Apply Now', applied: 'Application Submitted' },
  tabs: { description: 'Description', timeline: 'Timeline', documents: 'Documents', requirements: 'Requirements' },
  timeline: { open: 'Opening', close: 'Closing', startsIn: 'Starts in {{days}} days', endsIn: 'Ends in {{days}} days', daysLeft: 'days left' },
  sidebar: { stats: 'Statistics', candidates: 'Candidates', cta: { title: 'Ready to apply?', text: 'Submit your application before the deadline.', btn: 'Apply' }, contact: { title: 'Need Help?', text: 'Contact us for any questions.' } },
  wizard: {
    title: 'Apply to Campaign',
    steps: { personal: 'Personal', academic: 'Academic', research: 'Research', documents: 'Documents' },
    personal: { title: 'Personal Information', first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone', dob: 'Date of Birth', pob: 'Place of Birth', nat: 'Nationality', cin: 'CIN / Passport', address: 'Address', gender: 'Gender' },
    academic: { title: 'Academic Background', degree: 'Highest Degree', institution: 'Institution', details: 'Previous Degrees Details' },
    research: { title: 'Research Project', subject: 'Thesis Subject', director: 'Proposed Director', lab: 'Laboratory' },
    documents: { title: 'Required Documents', cv: 'CV (PDF)', cover: 'Cover Letter', diplomas: 'Diplomas', transcripts: 'Transcripts', photo: 'Photo', cin: 'CIN Scan', upload: 'Click to upload' },
    actions: { cancel: 'Cancel', prev: 'Previous', next: 'Next', submit: 'Submit Application', submitting: 'Sending...' },
    success: 'Application submitted successfully!',
    error: 'Error submitting application.'
  }
};

// Extend French
TRANSLATIONS.fr.stats = {
  researchers: 'Doctorants inscrits',
  completion: 'Durée moyenne',
  universities: 'Universités partenaires',
  satisfaction: 'Satisfaction utilisateur',
  noData: 'Aucune donnée'
};
TRANSLATIONS.fr.about.features = {
  workflow: { title: 'Flux de travail simplifié', text: "De l'inscription à la soutenance, chaque étape est numérisée et simplifiée." },
  collaboration: { title: 'Collaboration améliorée', text: "Outils en temps réel pour les retours, le partage de documents et le mentorat." }
};
TRANSLATIONS.fr.about.secure = { title: 'Sécurisé et privé', text: 'Chiffrement de bout en bout' };
TRANSLATIONS.fr.how = { title: 'Comment ça marche', subtitle: "Commencez en quelques minutes grâce à notre onboarding assisté par l'IA", step1: { title: 'Créez votre compte', text: "Inscrivez-vous en quelques secondes et configurez votre profil de chercheur avec auto-complétion IA" }, step2: { title: 'Importez vos recherches', text: 'Téléversez des documents, connectez des dépôts et synchronisez automatiquement votre bibliographie' }, step3: { title: 'Collaborez et suivez', text: "Travaillez avec des encadrants, suivez les jalons et préparez la soutenance avec des insights en temps réel" }, step4: { title: 'Soutenez avec succès', text: "Planifiez la soutenance, invitez les membres du jury et terminez votre parcours en toute confiance" } };
TRANSLATIONS.fr.campaigns = { header: { title: 'Campagnes doctorales en vedette', subtitle: 'Découvrez des offres publiques de thèses sélectionnées' }, searchLabel: 'Rechercher des campagnes', searchPlaceholder: 'Rechercher campagnes, université ou domaine', viewAll: 'Voir toutes les campagnes', funded: 'Financée', details: 'Voir détails', apply: 'Postuler', empty: 'Aucune campagne ne correspond à votre recherche.' };
TRANSLATIONS.fr.features = { header: { badge: 'Fonctionnalités', title: 'Tout ce dont vous avez besoin pour votre doctorat', subtitle: 'Applications complètes conçues pour la collaboration à grande échelle et la gestion de la recherche' }, apps: { campaigns: { title: 'Campagnes & Matching', text: 'Un matching intelligent met en avant les meilleures offres ; suivez candidatures et notifications.' }, defense: { title: 'Soutenance & Planning', text: "Coordonnez les comités, envoyez des invitations et gérez la logistique de soutenance avec intégration calendrier." }, docs: { title: 'Hub de documents', text: 'Stockage versionné, résumés IA et extraction de citations pour chaque document.' }, collab: { title: 'Suite de collaboration', text: "Commentaires en temps réel, attribution de tâches et suivi des versions pour équipes et encadrants." } } };
TRANSLATIONS.fr.testimonials = { header: { badge: 'Témoignages', title: 'Confiance des chercheurs', subtitle: "Découvrez ce que disent les doctorants" }, t1: { quote: "SuiviDoctorat a transformé la façon dont je gère ma recherche...", author: 'Dr. Sarah Chen', title: 'PhD Informatique, MIT' }, t2: { quote: "La gestion documentaire et le suivi des jalons sont révolutionnaires...", author: 'Dr. Michael Kumar', title: 'PhD Biologie, Oxford' }, t3: { quote: "Meilleur investissement pour mon doctorat...", author: 'Dr. Emma Laurent', title: 'PhD Physique, Sorbonne' } };
TRANSLATIONS.fr.faq = { header: { badge: 'FAQ', title: 'Questions fréquentes', subtitle: "Tout ce qu'il faut savoir pour commencer" }, q1: { q: 'Combien de temps pour la mise en place ?', a: "Vous pouvez créer votre compte et commencer en moins de 5 minutes. Notre onboarding assisté par l'IA est très rapide." }, q2: { q: 'Mes données sont-elles sécurisées ?', a: "Absolument. Nous utilisons un chiffrement de niveau entreprise, conformité RGPD et sauvegardes régulières." }, q3: { q: 'Puis-je collaborer avec mes encadrants ?', a: 'Oui ! Invitez des encadrants et membres de comité ; ils ont un accès gratuit pour collaborer.' }, q4: { q: 'Quels formats sont supportés ?', a: 'PDF, Word, LaTeX, Excel et intégrations avec Zotero, Mendeley.' }, q5: { q: 'Y a-t-il une application mobile ?', a: 'La plateforme est responsive. Apps natives iOS/Android à venir.' }, q6: { q: 'Besoin d’aide ?', a: "Support 24/7 via chat, email et visio ; base de connaissances accessible." } };
TRANSLATIONS.fr.cta = Object.assign({}, TRANSLATIONS.fr.cta, { trust: 'Approuvé par des universités du monde entier • 4.9/5 • Plan gratuit disponible' });
TRANSLATIONS.fr.status = { open: 'Ouverte', 'closing-soon': 'Clôture bientôt', closed: 'Fermée' };
TRANSLATIONS.fr.footer = Object.assign({}, TRANSLATIONS.fr.footer, { col: { platform: 'Plateforme', resources: 'Ressources', contact: 'Contact' }, links: { home: 'Accueil', campaigns: 'Campagnes', features: 'Fonctionnalités', pricing: 'Tarifs', documentation: 'Documentation', help: 'Centre d’aide', community: 'Communauté', blog: 'Blog' }, contact: { email: 'support@suividoctorat.com', phone: '+212 5 37 77 00 00', location: 'Rabat, Maroc' } });

// Auth, Contact, Reset (French)
TRANSLATIONS.fr.auth = {
  brand: { headline: 'Votre Doctorat,\nGéré par des Experts', features: ['Suivez les jalons et échéances', 'Collaborez avec vos encadrants', 'Gestion documentaire sécurisée'], trusted: 'Approuvé par des chercheurs du monde entier' },
  tabs: { signin: 'Connexion', signup: 'Inscription' },
  signin: { title: 'Bon retour', subtitle: 'Connectez-vous pour continuer', emailPlaceholder: 'votre.email@universite.edu', passwordPlaceholder: 'Votre mot de passe', forgot: 'Mot de passe oublié ?', btn: 'Se connecter' },
  signup: { title: 'Créer un compte', subtitle: 'Rejoignez la communauté académique', first: 'Prénom', last: 'Nom', phone: 'Téléphone', pass: 'Mot de passe', confirm: 'Confirmer', terms: "J'accepte les conditions d'utilisation", btn: "S'inscrire" },
  errors: { required: 'Requis', email: 'Email invalide', match: 'Les mots de passe ne correspondent pas', min: 'Min 6 car.' },
  verify: { title: 'Vérification requise', info: 'Entrez le code envoyé à :', resend: 'Renvoyer le code', btn: 'Vérifier & Continuer' },
  forgot: { title: 'Réinitialiser le mot de passe', info: 'Entrez votre email pour recevoir un lien.', btn: 'Envoyer le lien', cancel: 'Annuler' }
};
TRANSLATIONS.fr.contact = {
  hero: { badge: 'Support & Contact', title: 'Contactez-nous', subtitle: 'Des questions ? Besoin d\'aide ? Nous sommes là pour vous aider à réussir.' },
  info: { phone: 'Support Téléphonique', email: 'Envoyez un email', visit: 'Rendez-nous visite' },
  form: { title: 'Envoyez-nous un message', subtitle: 'Remplissez le formulaire et notre équipe vous répondra.', first: 'Prénom', last: 'Nom', email: 'Email', subject: 'Sujet', message: 'Message', btn: 'Envoyer' },
  subjects: ['Question générale', 'Support technique', 'Retour d\'expérience', 'Partenariat']
};
TRANSLATIONS.fr.reset = {
  title: 'Réinitialiser le mot de passe',
  descToken: 'Token détecté. Définissez votre nouveau mot de passe.',
  descCode: 'Entrez email et code, ou collez le token.',
  email: 'Email', token: 'Token', code: 'Code (6 chiffres)', newPass: 'Nouveau mot de passe', confirm: 'Confirmer',
  btn: 'Valider', cancel: 'Annuler'
};

// About, Campaigns, CampaignDetail (French)
TRANSLATIONS.fr.aboutPage = {
  hero: { title: 'Autonomiser la recherche', subtitle: 'Nous nous engageons à faire progresser l\'excellence académique grâce à une technologie innovante.' },
  mission: { title: 'Notre mission', text: 'Simplifier le parcours doctoral pour les étudiants et les institutions du monde entier.' },
  vision: { title: 'Notre vision', text: 'Un monde où la gestion de la recherche est simple et collaborative.' },
  values: { title: 'Nos valeurs', innovation: 'Innovation', integrity: 'Intégrité', collaboration: 'Collaboration' }
};
TRANSLATIONS.fr.campaignsPage = {
  title: 'Campagnes Doctorales',
  subtitle: 'Votre passerelle vers l\'excellence académique. Explorez des centaines d\'opportunités de doctorat.',
  stats: { active: 'Campagnes Actives', partners: 'Universités Partenaires', support: 'Support Disponible' },
  cta: { start: 'Commencer Maintenant', refresh: 'Actualiser les Données' },
  filters: { search: 'Rechercher campagne...', types: 'Type de campagne', status: 'Statut', sort: 'Trier par', favorites: 'Favoris uniquement' },
  status: { all: 'Tous statuts', active: 'Actives', upcoming: 'À venir', ended: 'Terminées' },
  sort: { relevance: 'Pertinence', deadline: 'Date limite', recent: 'Plus récentes' },
  card: { deadline: 'Date limite', candidates: 'Candidats', daysLeft: 'Jours restants', view: 'Voir détails', apply: 'Postuler', applied: 'Candidaté' },
  empty: { title: 'Aucune campagne trouvée', text: 'Essayez d\'ajuster vos filtres.' },
  typeLabels: { INSCRIPTION: 'Inscription', REINSCRIPTION: 'Réinscription', SOUTENANCE: 'Soutenance' }
};
TRANSLATIONS.fr.campaignDetail = {
  loading: 'Chargement de la campagne...',
  back: 'Retour aux campagnes',
  hero: { favorite: 'Ajouter aux favoris', unfavorite: 'Retirer des favoris', apply: 'Postuler maintenant', applied: 'Candidature soumise' },
  tabs: { description: 'Description', timeline: 'Calendrier', documents: 'Documents', requirements: 'Prérequis' },
  timeline: { open: 'Ouverture', close: 'Clôture', startsIn: 'Commence dans {{days}} jours', endsIn: 'Se termine dans {{days}} jours', daysLeft: 'jours restants' },
  sidebar: { stats: 'Statistiques', candidates: 'Candidats', cta: { title: 'Prêt à postuler?', text: 'Soumettez votre candidature avant la date limite.', btn: 'Postuler' }, contact: { title: 'Besoin d\'aide?', text: 'Contactez-nous pour toute question.' } },
  wizard: {
    title: 'Postuler à la campagne',
    steps: { personal: 'Personnel', academic: 'Académique', research: 'Recherche', documents: 'Documents' },
    personal: { title: 'Informations personnelles', first: 'Prénom', last: 'Nom', email: 'Email', phone: 'Téléphone', dob: 'Date de naissance', pob: 'Lieu de naissance', nat: 'Nationalité', cin: 'CIN / Passeport', address: 'Adresse', gender: 'Sexe' },
    academic: { title: 'Parcours académique', degree: 'Dernier diplôme', institution: 'Établissement', details: 'Détails des diplômes précédents' },
    research: { title: 'Projet de recherche', subject: 'Sujet de thèse', director: 'Directeur envisagé', lab: 'Laboratoire' },
    documents: { title: 'Documents requis', cv: 'CV (PDF)', cover: 'Lettre de motivation', diplomas: 'Diplômes', transcripts: 'Relevés de notes', photo: 'Photo', cin: 'Scan CIN', upload: 'Cliquez pour uploader' },
    actions: { cancel: 'Annuler', prev: 'Précédent', next: 'Suivant', submit: 'Soumettre la candidature', submitting: 'Envoi en cours...' },
    success: 'Candidature soumise avec succès !',
    error: 'Erreur lors de l\'envoi de la candidature.'
  }
};

// Extend Arabic
TRANSLATIONS.ar.stats = {
  researchers: 'طلاب الدكتوراه المسجلون',
  completion: 'متوسط الإتمام',
  universities: 'الجامعات الشريكة',
  satisfaction: 'رضا المستخدم',
  noData: 'لا توجد بيانات'
};
TRANSLATIONS.ar.about.features = {
  workflow: { title: 'سير عمل مبسط', text: 'من التسجيل إلى المناقشة، كل خطوة مؤتمتة ومبسطة.' },
  collaboration: { title: 'تعاون محسّن', text: 'أدوات وقتية للتعليقات ومشاركة المستندات والإشراف.' }
};
TRANSLATIONS.ar.about.secure = { title: 'آمن وخاص', text: 'تشفير من طرف إلى طرف' };
TRANSLATIONS.ar.how = { title: 'كيف تعمل', subtitle: 'ابدأ في دقائق عبر عملية التهيئة المدعومة بالذكاء الاصطناعي', step1: { title: 'أنشئ حسابك', text: 'سجّل في ثوانٍ وقم بإعداد ملف الباحث مع اكتمال تلقائي بالذكاء الاصطناعي' }, step2: { title: 'استورد أبحاثك', text: 'حمّل المستندات، وصل المستودعات، ومزامنة المراجع تلقائياً' }, step3: { title: 'تعاون وتتبع', text: 'اعمل مع المشرفين، تتبع الإنجازات، واستعد للمناقشة بمؤشرات فورية' }, step4: { title: 'الدفاع بنجاح', text: 'جدول المناقشة، ادعُ أعضاء اللجنة، وأكمل رحلتك بثقة' } };
TRANSLATIONS.ar.campaigns = { header: { title: 'حملات دكتوراه مميزة', subtitle: 'اكتشف عروض دكتوراه عامة محددة متاحة الآن' }, searchLabel: 'ابحث عن الحملات', searchPlaceholder: 'ابحث عن حملات، جامعة أو مجال', viewAll: 'عرض كل الحملات', funded: 'مُمَوَّلة', details: 'عرض التفاصيل', apply: 'قدّم الطلب', empty: 'لا توجد حملات تطابق بحثك.' };
TRANSLATIONS.ar.features = { header: { badge: 'ميزات المنصة', title: 'كل ما تحتاجه لدكتوراهك', subtitle: 'تطبيقات شاملة للتعاون على نطاق واسع وإدارة الأبحاث' }, apps: { campaigns: { title: 'الحملات والمطابقة', text: 'مطابقة ذكية تعرض أفضل الفرص؛ تتبع الطلبات والإشعارات في تطبيق واحد.' }, defense: { title: 'المنهج والمواعيد', text: 'نسق اللجان، أرسل الدعوات، وادِر لوجستيات المناقشة مع تكامل التقويم.' }, docs: { title: 'مركز المستندات', text: 'تخزين بالإصدارات، تلخيصات بالذكاء الاصطناعي واستخراج الاقتباسات لكل مستند.' }, collab: { title: 'حزمة التعاون', text: 'تعليقات في الوقت الحقيقي، تعيين مهام وتتبع الإصدارات عبر الفرق.' } } };
TRANSLATIONS.ar.testimonials = { header: { badge: 'قصص نجاح', title: 'موثوق من قبل الباحثين', subtitle: 'شاهد آراء طلبة الدكتوراه' }, t1: { quote: 'غيرت SuiviDoctorat طريقتي في إدارة البحث...', author: 'Dr. Sarah Chen', title: 'دكتوراه علوم الحاسوب، MIT' }, t2: { quote: 'إدارة المستندات ومتابعة المراحل غيرت اللعبة...', author: 'Dr. Michael Kumar', title: 'دكتوراه أحياء، Oxford' }, t3: { quote: 'أفضل استثمار لرحلتي في الدكتوراه...', author: 'Dr. Emma Laurent', title: 'دكتوراه فيزياء، Sorbonne' } };
TRANSLATIONS.ar.faq = { header: { badge: 'الأسئلة الشائعة', title: 'الأسئلة المتكررة', subtitle: 'كل ما تحتاج لمعرفته للبدء' }, q1: { q: 'كم يستغرق الإعداد؟', a: 'يمكنك إنشاء حسابك والبدء في أقل من 5 دقائق. عملية التهيئة المدعومة بالذكاء الاصطناعي سريعة جداً.' }, q2: { q: 'هل بياناتي آمنة؟', a: 'نعم. نستخدم تشفيراً بمستوى المؤسسات والالتزام باللوائح وحفظ نسخ احتياطية دورية.' }, q3: { q: 'هل أستطيع التعاون مع المشرفين؟', a: 'نعم! ادعُ المشرفين وأعضاء اللجنة؛ يحصلون على وصول مجاني للتعاون.' }, q4: { q: 'ما صيغ الملفات المدعومة؟', a: 'ندعم الصيغ الرئيسية: PDF، Word، LaTeX، Excel وإمكانيات التكامل مع Zotero وMendeley.' }, q5: { q: 'هل هناك تطبيق للهاتف؟', a: 'المنصة متجاوبة وتعمل على الهاتف. تطبيقات iOS وAndroid قادمة.' }, q6: { q: 'ماذا لو احتجت مساعدة؟', a: 'نوفر دعم 24/7 عبر الدردشة والبريد والمكالمات الفيديو؛ بالإضافة لقاعدة المعرفة والمنتدى.' } };
TRANSLATIONS.ar.cta = Object.assign({}, TRANSLATIONS.ar.cta, { trust: 'موثوقة لدى جامعات حول العالم • 4.9/5 • خطة مجانية متاحة' });
TRANSLATIONS.ar.status = { open: 'مفتوحة', 'closing-soon': 'إغلاق قريب', closed: 'مغلقة' };
TRANSLATIONS.ar.footer = Object.assign({}, TRANSLATIONS.ar.footer, { col: { platform: 'المنصة', resources: 'الموارد', contact: 'اتصل' }, links: { home: 'الرئيسية', campaigns: 'الحملات', features: 'الميزات', pricing: 'الأسعار', documentation: 'التوثيق', help: 'مركز المساعدة', community: 'المجتمع', blog: 'المدونة' }, contact: { email: 'support@suividoctorat.com', phone: '+212 5 37 77 00 00', location: 'الرباط، المغرب' } });

// Auth, Contact, Reset (Arabic)
TRANSLATIONS.ar.auth = {
  brand: { headline: 'رحلة الدكتوراه،\nبإدارة الخبراء', features: ['تتبع مراحل البحث والمواعيد النهائية', 'تعاون مع المشرفين بسلاسة', 'إدارة آمنة للمستندات'], trusted: 'موثوق من باحثين حول العالم' },
  tabs: { signin: 'تسجيل الدخول', signup: 'إنشاء حساب' },
  signin: { title: 'مرحباً بعودتك', subtitle: 'سجل الدخول للمتابعة', emailPlaceholder: 'البريد الإلكتروني الجامعي', passwordPlaceholder: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟', btn: 'دخول' },
  signup: { title: 'إنشاء حساب', subtitle: 'انضم للمجتمع الأكاديمي اليوم', first: 'الاسم الأول', last: 'الاسم العائلي', phone: 'الهاتف', pass: 'كلمة المرور', confirm: 'تأكيد كلمة المرور', terms: 'أوافق على الشروط والأحكام', btn: 'إنشاء حساب' },
  errors: { required: 'مطلوب', email: 'بريد غير صالح', match: 'كلمات المرور غير متطابقة', min: '6 أحرف على الأقل' },
  verify: { title: 'التحقق مطلوب', info: 'أدخل الرمز المرسل إلى:', resend: 'إعادة الإرسال', btn: 'تحقق وتابع' },
  forgot: { title: 'إعادة تعيين كلمة المرور', info: 'أدخل بريدك لاستلام رابط التعيين.', btn: 'إرسال الرابط', cancel: 'إلغاء' }
};
TRANSLATIONS.ar.contact = {
  hero: { badge: 'الدعم والاستفسارات', title: 'تواصل معنا', subtitle: 'لديك أسئلة؟ تحتاج لدعم؟ نحن هنا لمساعدتك على النجاح.' },
  info: { phone: 'دعم هاتفي', email: 'راسلنا', visit: 'زرنا' },
  form: { title: 'أرسل لنا رسالة', subtitle: 'املأ النموذج وسيرد فريقنا عليك.', first: 'الاسم الأول', last: 'الاسم العائلي', email: 'البريد الإلكتروني', subject: 'الموضوع', message: 'الرسالة', btn: 'إرسال' },
  subjects: ['استفسار عام', 'دعم فني', 'ملاحظات', 'شراكة']
};
TRANSLATIONS.ar.reset = {
  title: 'إعادة تعيين كلمة المرور',
  descToken: 'تم اكتشاف الرمز. تعيين كلمة مرور جديدة.',
  descCode: 'أدخل البريد والرمز، أو الصق الرمز.',
  email: 'البريد الإلكتروني', token: 'الرمز (Token)', code: 'الرمز (6 أرقام)', newPass: 'كلمة المرور الجديدة', confirm: 'تأكيد كلمة المرور',
  btn: 'تأكيد', cancel: 'إلغاء'
};

// About, Campaigns, CampaignDetail (Arabic)
TRANSLATIONS.ar.aboutPage = {
  hero: { title: 'تمكين البحث', subtitle: 'نحن ملتزمون بتعزيز التميز الأكاديمي من خلال التكنولوجيا المبتكرة.' },
  mission: { title: 'مهمتنا', text: 'تبسيط رحلة الدكتوراه للطلاب والمؤسسات في جميع أنحاء العالم.' },
  vision: { title: 'رؤيتنا', text: 'عالم تكون فيه إدارة البحث سهلة وتعاونية.' },
  values: { title: 'قيمنا', innovation: 'ابتكار', integrity: 'نزاهة', collaboration: 'تعاون' }
};
TRANSLATIONS.ar.campaignsPage = {
  title: 'حملات الدكتوراه',
  subtitle: 'بوابتك للتميز الأكاديمي. استكشف مئات فرص الدكتوراه.',
  stats: { active: 'حملات نشطة', partners: 'جامعات شريكة', support: 'دعم متاح' },
  cta: { start: 'ابدأ الآن', refresh: 'تحديث البيانات' },
  filters: { search: 'بحث عن حملة...', types: 'نوع الحملة', status: 'الحالة', sort: 'ترتيب حسب', favorites: 'المفضلة فقط' },
  status: { all: 'كل الحالات', active: 'نشطة', upcoming: 'قادمة', ended: 'منتهية' },
  sort: { relevance: 'الصلة', deadline: 'الموعد النهائي', recent: 'الأحدث' },
  card: { deadline: 'الموعد النهائي', candidates: 'مرشحين', daysLeft: 'أيام متبقية', view: 'عرض التفاصيل', apply: 'تقديم', applied: 'تم التقديم' },
  empty: { title: 'لم يتم العثور على حملات', text: 'حاول تعديل المرشحات.' },
  typeLabels: { INSCRIPTION: 'تسجيل', REINSCRIPTION: 'إعادة تسجيل', SOUTENANCE: 'مناقشة' }
};
TRANSLATIONS.ar.campaignDetail = {
  loading: 'جاري تحميل الحملة...',
  back: 'عودة للحملات',
  hero: { favorite: 'إضافة للمفضلة', unfavorite: 'إزالة من المفضلة', apply: 'قدم الآن', applied: 'تم تقديم الطلب' },
  tabs: { description: 'الوصف', timeline: 'الجدول الزمني', documents: 'المستندات', requirements: 'المتطلبات' },
  timeline: { open: 'فتح', close: 'إغلاق', startsIn: 'يبدأ في {{days}} أيام', endsIn: 'ينتهي في {{days}} أيام', daysLeft: 'أيام متبقية' },
  sidebar: { stats: 'إحصائيات', candidates: 'مرشحين', cta: { title: 'جاهز للتقديم؟', text: 'قدم طلبك قبل الموعد النهائي.', btn: 'تقديم' }, contact: { title: 'تحتاج مساعدة؟', text: 'تواصل معنا لأي استفسار.' } },
  wizard: {
    title: 'التقديم للحملة',
    steps: { personal: 'شخصي', academic: 'أكاديمي', research: 'بحث', documents: 'مستندات' },
    personal: { title: 'معلومات شخصية', first: 'الاسم الأول', last: 'الاسم العائلي', email: 'البريد', phone: 'الهاتف', dob: 'تاريخ الميلاد', pob: 'مكان الميلاد', nat: 'الجنسية', cin: 'رقم الهوية / جواز السفر', address: 'العنوان', gender: 'الجنس' },
    academic: { title: 'الخلفية الأكاديمية', degree: 'أعلى درجة', institution: 'المؤسسة', details: 'تفاصيل الدرجات السابقة' },
    research: { title: 'مشروع البحث', subject: 'موضوع الأطروحة', director: 'المشرف المقترح', lab: 'المختبر' },
    documents: { title: 'المستندات المطلوبة', cv: 'سيرة ذاتية (PDF)', cover: 'رسالة تغطية', diplomas: 'شهادات', transcripts: 'كشوف نقاط', photo: 'صورة', cin: 'مسح الهوية', upload: 'انقر للرفع' },
    actions: { cancel: 'إلغاء', prev: 'سابق', next: 'تالي', submit: 'إرسال الطلب', submitting: 'جاري الإرسال...' },
    success: 'تم إرسال الطلب بنجاح!',
    error: 'خطأ في إرسال الطلب.'
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  current = signal<Lang>((localStorage.getItem('lang') as Lang) || 'en');
  translations = computed(() => TRANSLATIONS[this.current()]);

  constructor() {
    this.updateDirection(this.current());
  }

  setLanguage(lang: Lang) {
    this.current.set(lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    this.updateDirection(lang);
  }

  private updateDirection(lang: Lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  t(path: string, params?: Record<string, any>): string {
    const parts = path.split('.');
    let cur: any = this.translations();
    for (const p of parts) {
      if (!cur) return path;
      cur = cur[p];
    }
    let text = typeof cur === 'string' ? cur : path;

    if (params) {
      Object.keys(params).forEach(key => {
        text = text.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(params[key]));
      });
    }
    return text;
  }
}
