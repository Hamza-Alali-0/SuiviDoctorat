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
TRANSLATIONS.en.testimonials = { header: { badge: 'Success Stories', title: 'Trusted by Leading Researchers', subtitle: 'See what PhD students say about their experience' }, t1: { quote: 'SuiviDoctorat transformed how I manage my research. The collaboration tools made working with my advisors seamless, and I defended 6 months early!', author: 'Dr. Sarah Chen', title: 'Computer Science PhD, MIT' }, t2: { quote: 'The document management and timeline tracking features are game-changers. I always know exactly where I stand and what\'s next.', author: 'Dr. Michael Kumar', title: 'Biology PhD, Oxford' }, t3: { quote: 'Best investment in my PhD journey. The AI-powered insights helped me identify gaps in my research early and stay on track throughout.', author: 'Dr. Emma Laurent', title: 'Physics PhD, Sorbonne' }, trust: { researchers: 'Active Researchers', universities: 'Partner Universities', rating: 'Average Rating' } };
TRANSLATIONS.en.faq = { header: { badge: 'FAQ', title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about getting started' }, q1: { q: 'How long does it take to set up?', a: 'You can create your account and start managing your research in under 5 minutes. Our AI-assisted onboarding makes it incredibly fast.' }, q2: { q: 'Is my research data secure?', a: 'Absolutely. We use enterprise-grade encryption, comply with GDPR, and store all data on secure servers with regular backups.' }, q3: { q: 'Can I collaborate with my advisors?', a: 'Yes! Invite unlimited advisors and committee members. They get free access to collaborate on your research projects.' }, q4: { q: 'What file formats are supported?', a: 'We support all major formats including PDF, Word, LaTeX, Excel, and can integrate with reference managers like Zotero and Mendeley.' }, q5: { q: 'Is there a mobile app?', a: 'Our platform is fully responsive and works perfectly on mobile. Native iOS and Android apps are coming soon.' }, q6: { q: 'What if I need help?', a: 'We offer 24/7 support via chat, email, and video calls. Plus, access to our knowledge base and community forum anytime.' } };
TRANSLATIONS.en.cta = { badge: 'Start Today', title: 'Ready to Transform Your Research Journey?', subtitle: 'Join thousands of researchers who have streamlined their doctoral experience with our platform.', getStarted: 'Get Started Free', watchDemo: 'Watch Demo', signIn: 'Sign In', progress: 'Average Completion Rate', features: { free: 'Free Forever Plan', secure: 'Enterprise Security', support: '24/7 Support' }, trust: 'Trusted by universities worldwide' };
TRANSLATIONS.en.status = { open: 'Open', 'closing-soon': 'Closing soon', closed: 'Closed' };
TRANSLATIONS.en.hero.stats = { researchers: 'Active Researchers', success: 'Success Rate', support: 'Support Available' };
TRANSLATIONS.en.features.cards = {
  lifecycle: { title: 'Complete Lifecycle<br>Management of the Doctorate' },
  milestones: { title: 'Key Milestone Tracking', text: 'From enrollment to defense, visualize your progress and never miss an important deadline with our interactive timeline.', btn: 'View my dashboard' },
  paperless: { title: 'Full Digitization', text: 'No more paperwork. Submit your reports, waiver requests, and administrative documents directly online securely.', btn: 'Manage my documents' },
  tags: { secure: 'Secure Exchanges', collab: 'Collaboration' },
  defense: { badge: 'Simplified Defense' },
  reporting: { title: 'Management & Reporting', text: 'For doctoral schools and laboratories, advanced management tools to track key research indicators.', btn: 'Access reports' }
};
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
  descNoToken: 'Enter your reset code or token.',
  descCode: 'Enter email and code, or paste token.',
  email: 'Email', token: 'Token', code: 'Code (6 digits)', password: 'New Password', confirm: 'Confirm Password',
  submit: 'Reset Password', cancel: 'Cancel',
  errors: {
    passRequired: 'Password and confirmation are required',
    passMismatch: 'Passwords do not match',
    tokenRequired: 'Token or email+code required',
    success: 'Password reset successful! Redirecting...',
    failed: 'Failed to reset password'
  }
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
  stats: { active: 'Active Campaigns', partners: 'Partner Universities', support: 'Support Available', visible: 'Visible' },
  cta: { start: 'Start Now', refresh: 'Refresh Data' },
  filters: { search: 'Search campaigns...', types: 'Campaign Type', status: 'Status', sort: 'Sort by', favorites: 'Favorites only' },
  status: { all: 'All Statuses', active: 'Active', upcoming: 'Upcoming', ended: 'Ended' },
  sort: { relevance: 'Relevance', deadline: 'Deadline', recent: 'Most Recent' },
  card: { deadline: 'Deadline', candidates: 'Candidates', daysLeft: 'Days left', view: 'View Details', apply: 'Apply', applied: 'Applied' },
  empty: { title: 'No campaigns found', text: 'Try adjusting your filters.' },
  typeLabels: { INSCRIPTION: 'Enrollment', REINSCRIPTION: 'Re-enrollment', SOUTENANCE: 'Defense' },
  pagination: { showing: 'Showing', of: 'of', campaigns: 'campaigns', prev: 'Previous', next: 'Next' },
  form: { male: 'Male', female: 'Female', select: 'Select...', master: 'Master', engineer: 'Engineer', other: 'Other', institutionPlaceholder: 'University or School', diplomasPlaceholder: 'List your degrees (Year, Title, Institution, Honors)' }
};
TRANSLATIONS.en.campaignDetail = {
  loading: 'Loading campaign...',
  description: 'Description',
  back: 'Back to campaigns',
  hero: { favorite: 'Add to Favorites', unfavorite: 'Remove from Favorites', apply: 'Apply Now', applied: 'Application Submitted' },
  actions: { addFav: 'Add to favorites', removeFav: 'Remove from favorites' },
  tabs: { description: 'Description', timeline: 'Timeline', documents: 'Documents', requirements: 'Requirements' },
  timeline: { open: 'Opening', close: 'Closing', startsIn: 'Starts in {{days}} days', endsIn: 'Ends in {{days}} days', daysLeft: 'days left' },
  sidebar: {
    stats: 'Statistics',
    candidates: 'Candidates',
    ready: 'Ready to apply?',
    submit: 'Submit your application before the deadline.',
    contact: 'Contact us for any questions.',
    cta: { title: 'Ready to apply?', text: 'Submit your application before the deadline.', btn: 'Apply' },
    contactCard: { title: 'Need Help?', text: 'Contact us for any questions.' }
  },
  wizard: {
    title: 'Apply to Campaign',
    steps: { personal: 'Personal', academic: 'Academic', research: 'Research', documents: 'Documents' },
    personal: { title: 'Personal Information', first: 'First Name', last: 'Last Name', email: 'Email', phone: 'Phone', dob: 'Date of Birth', pob: 'Place of Birth', nat: 'Nationality', cin: 'CIN / Passport', address: 'Address', gender: 'Gender' },
    academic: { title: 'Academic Background', degree: 'Highest Degree', institution: 'Institution', details: 'Previous Degrees Details', detailsPlaceholder: 'List your degrees (Year, Title, Institution, Grade)' },
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
TRANSLATIONS.fr.testimonials = { header: { badge: 'Témoignages', title: 'Confiance des chercheurs', subtitle: "Découvrez ce que disent les doctorants" }, t1: { quote: "SuiviDoctorat a transformé la façon dont je gère ma recherche. Les outils de collaboration ont rendu le travail avec mes directeurs fluide, et j'ai soutenu 6 mois plus tôt !", author: 'Dr. Sarah Chen', title: 'PhD Informatique, MIT' }, t2: { quote: "La gestion documentaire et le suivi des jalons sont révolutionnaires. Je sais toujours exactement où j'en suis et quelle est la prochaine étape.", author: 'Dr. Michael Kumar', title: 'PhD Biologie, Oxford' }, t3: { quote: "Meilleur investissement pour mon doctorat. Les analyses IA m'ont aidé à identifier les lacunes de ma recherche tôt et à rester sur la bonne voie.", author: 'Dr. Emma Laurent', title: 'PhD Physique, Sorbonne' }, trust: { researchers: 'Chercheurs actifs', universities: 'Universités partenaires', rating: 'Note moyenne' } };
TRANSLATIONS.fr.faq = { header: { badge: 'FAQ', title: 'Questions fréquentes', subtitle: "Tout ce qu'il faut savoir pour commencer" }, q1: { q: 'Combien de temps pour la mise en place ?', a: "Vous pouvez créer votre compte et commencer en moins de 5 minutes. Notre onboarding assisté par l'IA est très rapide." }, q2: { q: 'Mes données sont-elles sécurisées ?', a: "Absolument. Nous utilisons un chiffrement de niveau entreprise, conformité RGPD et sauvegardes régulières." }, q3: { q: 'Puis-je collaborer avec mes encadrants ?', a: 'Oui ! Invitez des encadrants et membres de comité ; ils ont un accès gratuit pour collaborer.' }, q4: { q: 'Quels formats sont supportés ?', a: 'PDF, Word, LaTeX, Excel et intégrations avec Zotero, Mendeley.' }, q5: { q: 'Y a-t-il une application mobile ?', a: 'La plateforme est responsive. Apps natives iOS/Android à venir.' }, q6: { q: 'Besoin d’aide ?', a: "Support 24/7 via chat, email et visio ; base de connaissances accessible." } };
TRANSLATIONS.fr.cta = { badge: 'Commencez Aujourd\'hui', title: 'Prêt à Transformer Votre Parcours de Recherche ?', subtitle: 'Rejoignez des milliers de chercheurs qui ont optimisé leur expérience doctorale avec notre plateforme.', getStarted: 'Démarrer Gratuitement', watchDemo: 'Voir la démo', signIn: 'Se Connecter', progress: 'Taux de Complétion Moyen', features: { free: 'Plan Gratuit à Vie', secure: 'Sécurité Entreprise', support: 'Support 24/7' }, trust: 'Approuvé par des universités du monde entier' };
TRANSLATIONS.fr.status = { open: 'Ouverte', 'closing-soon': 'Clôture bientôt', closed: 'Fermée' };
TRANSLATIONS.fr.hero.stats = { researchers: 'Chercheurs actifs', success: 'Taux de réussite', support: 'Support disponible' };
TRANSLATIONS.fr.features.cards = {
  lifecycle: { title: 'Gestion complète<br>du cycle de vie du doctorat' },
  milestones: { title: 'Suivi des étapes clés', text: 'De l\'inscription à la soutenance, visualisez votre progression et ne manquez aucune échéance importante grâce à notre timeline interactive.', btn: 'Voir mon tableau de bord' },
  paperless: { title: 'Dématérialisation totale', text: 'Fini la paperasse. Déposez vos rapports, demandes de dérogation et documents administratifs directement en ligne en toute sécurité.', btn: 'Gérer mes documents' },
  tags: { secure: 'Échanges sécurisés', collab: 'Collaboration' },
  defense: { badge: 'Soutenance simplifiée' },
  reporting: { title: 'Pilotage & Reporting', text: 'Pour les écoles doctorales et les laboratoires, des outils de pilotage avancés pour suivre les indicateurs clés de la recherche.', btn: 'Accéder aux rapports' }
};
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
  stats: { active: 'Campagnes Actives', partners: 'Universités Partenaires', support: 'Support Disponible', visible: 'Visibles' },
  cta: { start: 'Commencer Maintenant', refresh: 'Actualiser les Données' },
  filters: { search: 'Rechercher campagne...', types: 'Type de campagne', status: 'Statut', sort: 'Trier par', favorites: 'Favoris uniquement' },
  status: { all: 'Tous statuts', active: 'Actives', upcoming: 'À venir', ended: 'Terminées' },
  sort: { relevance: 'Pertinence', deadline: 'Date limite', recent: 'Plus récentes' },
  card: { deadline: 'Date limite', candidates: 'Candidats', daysLeft: 'Jours restants', view: 'Voir détails', apply: 'Postuler', applied: 'Candidaté' },
  empty: { title: 'Aucune campagne trouvée', text: 'Essayez d\'ajuster vos filtres.' },
  typeLabels: { INSCRIPTION: 'Inscription', REINSCRIPTION: 'Réinscription', SOUTENANCE: 'Soutenance' },
  pagination: { showing: 'Affichage de', of: 'sur', campaigns: 'campagnes', prev: 'Précédent', next: 'Suivant' },
  form: { male: 'Masculin', female: 'Féminin', select: 'Sélectionnez...', master: 'Master', engineer: 'Ingénieur', other: 'Autre', institutionPlaceholder: 'Université ou École', diplomasPlaceholder: 'Listez vos diplômes (Année, Intitulé, Établissement, Mention)' }
};
TRANSLATIONS.fr.campaignDetail = {
  loading: 'Chargement de la campagne...',
  description: 'Description',
  back: 'Retour aux campagnes',
  hero: { favorite: 'Ajouter aux favoris', unfavorite: 'Retirer des favoris', apply: 'Postuler maintenant', applied: 'Candidature soumise' },
  actions: { addFav: 'Ajouter aux favoris', removeFav: 'Retirer des favoris' },
  tabs: { description: 'Description', timeline: 'Calendrier', documents: 'Documents', requirements: 'Prérequis' },
  timeline: { open: 'Ouverture', close: 'Clôture', startsIn: 'Commence dans {{days}} jours', endsIn: 'Se termine dans {{days}} jours', daysLeft: 'jours restants' },
  sidebar: {
    stats: 'Statistiques',
    candidates: 'Candidats',
    ready: 'Prêt à postuler?',
    submit: 'Soumettez votre candidature avant la date limite.',
    contact: 'Contactez-nous pour toute question.',
    cta: { title: 'Prêt à postuler?', text: 'Soumettez votre candidature avant la date limite.', btn: 'Postuler' },
    contactCard: { title: 'Besoin d\'aide?', text: 'Contactez-nous pour toute question.' }
  },
  wizard: {
    title: 'Postuler à la campagne',
    steps: { personal: 'Personnel', academic: 'Académique', research: 'Recherche', documents: 'Documents' },
    personal: { title: 'Informations personnelles', first: 'Prénom', last: 'Nom', email: 'Email', phone: 'Téléphone', dob: 'Date de naissance', pob: 'Lieu de naissance', nat: 'Nationalité', cin: 'CIN / Passeport', address: 'Adresse', gender: 'Sexe' },
    academic: { title: 'Parcours académique', degree: 'Dernier diplôme', institution: 'Établissement', details: 'Détails des diplômes précédents', detailsPlaceholder: 'Listez vos diplômes (Année, Intitulé, Établissement, Mention)' },
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
TRANSLATIONS.ar.testimonials = { header: { badge: 'قصص نجاح', title: 'موثوق من قبل الباحثين', subtitle: 'شاهد آراء طلبة الدكتوراه' }, t1: { quote: 'غيّرت SuiviDoctorat طريقتي في إدارة البحث. أدوات التعاون جعلت العمل مع مشرفي سهلاً، وناقشت رسالتي قبل الموعد بستة أشهر!', author: 'Dr. Sarah Chen', title: 'دكتوراه علوم الحاسوب، MIT' }, t2: { quote: 'إدارة المستندات ومتابعة الجدول الزمني غيّرت كل شيء. أعرف دائماً أين أقف وما الخطوة التالية.', author: 'Dr. Michael Kumar', title: 'دكتوراه أحياء، Oxford' }, t3: { quote: 'أفضل استثمار في رحلتي للدكتوراه. ساعدني الذكاء الاصطناعي على تحديد الثغرات في بحثي مبكراً والبقاء على المسار الصحيح.', author: 'Dr. Emma Laurent', title: 'دكتوراه فيزياء، Sorbonne' }, trust: { researchers: 'باحثون نشطون', universities: 'جامعات شريكة', rating: 'متوسط التقييم' } };
TRANSLATIONS.ar.faq = { header: { badge: 'الأسئلة الشائعة', title: 'الأسئلة المتكررة', subtitle: 'كل ما تحتاج لمعرفته للبدء' }, q1: { q: 'كم يستغرق الإعداد؟', a: 'يمكنك إنشاء حسابك والبدء في أقل من 5 دقائق. عملية التهيئة المدعومة بالذكاء الاصطناعي سريعة جداً.' }, q2: { q: 'هل بياناتي آمنة؟', a: 'نعم. نستخدم تشفيراً بمستوى المؤسسات والالتزام باللوائح وحفظ نسخ احتياطية دورية.' }, q3: { q: 'هل أستطيع التعاون مع المشرفين؟', a: 'نعم! ادعُ المشرفين وأعضاء اللجنة؛ يحصلون على وصول مجاني للتعاون.' }, q4: { q: 'ما صيغ الملفات المدعومة؟', a: 'ندعم الصيغ الرئيسية: PDF، Word، LaTeX، Excel وإمكانيات التكامل مع Zotero وMendeley.' }, q5: { q: 'هل هناك تطبيق للهاتف؟', a: 'المنصة متجاوبة وتعمل على الهاتف. تطبيقات iOS وAndroid قادمة.' }, q6: { q: 'ماذا لو احتجت مساعدة؟', a: 'نوفر دعم 24/7 عبر الدردشة والبريد والمكالمات الفيديو؛ بالإضافة لقاعدة المعرفة والمنتدى.' } };
TRANSLATIONS.ar.cta = { badge: 'ابدأ اليوم', title: 'مستعد لتحويل رحلتك البحثية؟', subtitle: 'انضم إلى آلاف الباحثين الذين طوّروا تجربتهم الدكتورالية مع منصتنا.', getStarted: 'ابدأ مجاناً', watchDemo: 'شاهد العرض', signIn: 'تسجيل الدخول', progress: 'متوسط معدل الإنجاز', features: { free: 'خطة مجانية للأبد', secure: 'أمان مؤسسي', support: 'دعم 24/7' }, trust: 'موثوقة لدى جامعات حول العالم' };
TRANSLATIONS.ar.status = { open: 'مفتوحة', 'closing-soon': 'إغلاق قريب', closed: 'مغلقة' };
TRANSLATIONS.ar.hero.stats = { researchers: 'باحثون نشطون', success: 'معدل النجاح', support: 'دعم متاح' };
TRANSLATIONS.ar.features.cards = {
  lifecycle: { title: 'إدارة شاملة<br>لدورة حياة الدكتوراه' },
  milestones: { title: 'تتبع المراحل الرئيسية', text: 'من التسجيل إلى المناقشة، تصور تقدمك ولا تفوت أي موعد مهم بفضل جدولنا التفاعلي.', btn: 'عرض لوحة التحكم' },
  paperless: { title: 'رقمنة كاملة', text: 'انتهت الأوراق. قدم تقاريرك وطلبات الإعفاء ومستنداتك الإدارية مباشرة عبر الإنترنت بأمان.', btn: 'إدارة مستنداتي' },
  tags: { secure: 'تبادلات آمنة', collab: 'تعاون' },
  defense: { badge: 'مناقشة مبسطة' },
  reporting: { title: 'الإدارة والتقارير', text: 'لمدارس الدكتوراه والمختبرات، أدوات إدارة متقدمة لتتبع مؤشرات البحث الرئيسية.', btn: 'الوصول للتقارير' }
};
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
  stats: { active: 'حملات نشطة', partners: 'جامعات شريكة', support: 'دعم متاح', visible: 'مرئية' },
  cta: { start: 'ابدأ الآن', refresh: 'تحديث البيانات' },
  filters: { search: 'بحث عن حملة...', types: 'نوع الحملة', status: 'الحالة', sort: 'ترتيب حسب', favorites: 'المفضلة فقط' },
  status: { all: 'كل الحالات', active: 'نشطة', upcoming: 'قادمة', ended: 'منتهية' },
  sort: { relevance: 'الصلة', deadline: 'الموعد النهائي', recent: 'الأحدث' },
  card: { deadline: 'الموعد النهائي', candidates: 'مرشحين', daysLeft: 'أيام متبقية', view: 'عرض التفاصيل', apply: 'تقديم', applied: 'تم التقديم' },
  empty: { title: 'لم يتم العثور على حملات', text: 'حاول تعديل المرشحات.' },
  typeLabels: { INSCRIPTION: 'تسجيل', REINSCRIPTION: 'إعادة تسجيل', SOUTENANCE: 'مناقشة' },
  pagination: { showing: 'عرض', of: 'من', campaigns: 'حملات', prev: 'السابق', next: 'التالي' },
  form: { male: 'ذكر', female: 'أنثى', select: 'اختر...', master: 'ماستر', engineer: 'مهندس', other: 'آخر', institutionPlaceholder: 'جامعة أو مدرسة', diplomasPlaceholder: 'قائمة شهاداتك (السنة، العنوان، المؤسسة، الملاحظات)' }
};
TRANSLATIONS.ar.campaignDetail = {
  loading: 'جاري تحميل الحملة...',
  description: 'الوصف',
  back: 'عودة للحملات',
  hero: { favorite: 'إضافة للمفضلة', unfavorite: 'إزالة من المفضلة', apply: 'قدم الآن', applied: 'تم تقديم الطلب' },
  actions: { addFav: 'أضف إلى المفضلة', removeFav: 'إزالة من المفضلة' },
  tabs: { description: 'الوصف', timeline: 'الجدول الزمني', documents: 'المستندات', requirements: 'المتطلبات' },
  timeline: { open: 'فتح', close: 'إغلاق', startsIn: 'يبدأ في {{days}} أيام', endsIn: 'ينتهي في {{days}} أيام', daysLeft: 'أيام متبقية' },
  sidebar: {
    stats: 'إحصائيات',
    candidates: 'مرشحين',
    ready: 'جاهز للتقديم؟',
    submit: 'قدّم طلبك قبل الموعد النهائي.',
    contact: 'تواصل معنا لأي استفسار.',
    cta: { title: 'جاهز للتقديم؟', text: 'قدّم طلبك قبل الموعد النهائي.', btn: 'تقديم' },
    contactCard: { title: 'تحتاج مساعدة؟', text: 'تواصل معنا لأي استفسار.' }
  },
  wizard: {
    title: 'التقديم للحملة',
    steps: { personal: 'شخصي', academic: 'أكاديمي', research: 'بحث', documents: 'مستندات' },
    personal: { title: 'معلومات شخصية', first: 'الاسم الأول', last: 'الاسم العائلي', email: 'البريد', phone: 'الهاتف', dob: 'تاريخ الميلاد', pob: 'مكان الميلاد', nat: 'الجنسية', cin: 'رقم الهوية / جواز السفر', address: 'العنوان', gender: 'الجنس' },
    academic: { title: 'الخلفية الأكاديمية', degree: 'أعلى درجة', institution: 'المؤسسة', details: 'تفاصيل الدرجات السابقة', detailsPlaceholder: 'قائمة شهاداتك (السنة، العنوان، المؤسسة، الملاحظات)' },
    research: { title: 'مشروع البحث', subject: 'موضوع الأطروحة', director: 'المشرف المقترح', lab: 'المختبر' },
    documents: { title: 'المستندات المطلوبة', cv: 'سيرة ذاتية (PDF)', cover: 'رسالة تغطية', diplomas: 'شهادات', transcripts: 'كشوف نقاط', photo: 'صورة', cin: 'مسح الهوية', upload: 'انقر للرفع' },
    actions: { cancel: 'إلغاء', prev: 'سابق', next: 'تالي', submit: 'إرسال الطلب', submitting: 'جاري الإرسال...' },
    success: 'تم إرسال الطلب بنجاح!',
    error: 'خطأ في إرسال الطلب.'
  }
};

// Navbar Translations
TRANSLATIONS.en.navbar = { 
  brand: 'Doctoral Portal', 
  profile: { select: 'Select Profile', logout: 'Logout' },
  links: { home: 'Home', campaigns: 'Campaigns', about: 'About', contact: 'Contact' },
  actions: { signin: 'Sign In', signup: 'Sign Up', search: 'Search...' },
  theme: { light: 'Light', dark: 'Dark', system: 'System' }
};
TRANSLATIONS.fr.navbar = { 
  brand: 'Portail Doctorat', 
  profile: { select: 'Choisir votre profil', logout: 'Se déconnecter' },
  links: { home: 'Accueil', campaigns: 'Campagnes', about: 'À propos', contact: 'Contact' },
  actions: { signin: 'Connexion', signup: 'Inscription', search: 'Rechercher...' },
  theme: { light: 'Clair', dark: 'Sombre', system: 'Système' }
};
TRANSLATIONS.ar.navbar = { 
  brand: 'بوابة الدكتوراه', 
  profile: { select: 'اختر الملف الشخصي', logout: 'تسجيل الخروج' },
  links: { home: 'الرئيسية', campaigns: 'الحملات', about: 'عن المنصة', contact: 'اتصل بنا' },
  actions: { signin: 'دخول', signup: 'تسجيل', search: 'بحث...' },
  theme: { light: 'فاتح', dark: 'داكن', system: 'النظام' }
};

// Fix missing keys in CampaignDetail
// English
TRANSLATIONS.en.campaignDetail.timeline.title = 'Timeline';
TRANSLATIONS.en.campaignDetail.requirements = { title: 'Requirements' };
TRANSLATIONS.en.campaignDetail.sidebar.closed = 'Closed';
TRANSLATIONS.en.campaignDetail.sidebar.help = 'Need Help?';
TRANSLATIONS.en.campaignDetail.noDescription = 'No description available.';

// French
TRANSLATIONS.fr.campaignDetail.timeline.title = 'Calendrier';
TRANSLATIONS.fr.campaignDetail.requirements = { title: 'Prérequis' };
TRANSLATIONS.fr.campaignDetail.sidebar.closed = 'Fermée';
TRANSLATIONS.fr.campaignDetail.sidebar.help = 'Besoin d\'aide ?';
TRANSLATIONS.fr.campaignDetail.noDescription = 'Aucune description disponible.';

// Arabic
TRANSLATIONS.ar.campaignDetail.timeline.title = 'الجدول الزمني';
TRANSLATIONS.ar.campaignDetail.requirements = { title: 'المتطلبات' };
TRANSLATIONS.ar.campaignDetail.sidebar.closed = 'مغلقة';
TRANSLATIONS.ar.campaignDetail.sidebar.help = 'تحتاج مساعدة؟';
TRANSLATIONS.ar.campaignDetail.noDescription = 'لا يوجد وصف متاح.';

// Extended About Page Translations - English
TRANSLATIONS.en.aboutPage = {
  hero: { 
    badge: 'DISCOVER OUR PLATFORM',
    title: 'Where Research Meets Innovation',
    subtitle: 'SuiviDoctorat connects doctoral candidates, supervisors, and institutions in one unified ecosystem — transforming how academic research is managed, tracked, and celebrated.'
  },
  services: {
    campaigns: { title: 'Campaign Management', text: 'Create and manage doctoral admission campaigns with full transparency. Track applications, evaluate candidates, and make data-driven enrollment decisions.' },
    tracking: { title: 'Progress Tracking', text: 'Monitor research milestones, upload documents, and receive real-time feedback from supervisors. Stay on track with automated reminders and status updates.' },
    defense: { title: 'Defense Preparation', text: 'Schedule defenses, coordinate with jury members, and manage all logistics. Complete your doctoral journey with confidence and professional support.' }
  },
  story: {
    badge: 'Our Story',
    title: 'Building the Future of Doctoral Excellence',
    text: 'SuiviDoctorat was founded by a team of researchers and educators passionate about transforming the doctoral journey. United by their belief in the power of technology to streamline research management, they embarked on a mission to create a digital platform accessible to all doctoral candidates. With relentless dedication, they gathered experts and launched this innovative system, creating a global community of researchers connected by the desire to excel and advance academic excellence.'
  },
  stats: {
    years: 'Years of Experience',
    candidates: 'Active Candidates',
    applications: 'Applications Processed',
    success: 'Success Rate'
  },
  mission: { title: 'Our Mission', text: 'To simplify and digitize the doctoral journey, empowering students, supervisors, and institutions with modern tools for research management and collaboration.' },
  vision: { title: 'Our Vision', text: 'A world where every doctoral candidate has access to seamless, efficient, and collaborative research management tools.' },
  values: { title: 'Our Values', text: 'Innovation, integrity, and collaboration drive everything we do. We believe in empowering researchers to achieve their full potential.' },
  features: {
    badge: 'Why Choose Us',
    title: 'Everything You Need to Succeed',
    subtitle: 'A complete platform built for the modern doctoral journey.',
    f1: { title: 'Campaign Management', text: 'Create, publish, and manage admission campaigns with complete transparency. Track applications, filter candidates, and make data-driven decisions.' },
    f2: { title: 'Progress Tracking', text: 'Monitor milestones, upload documents, and get real-time feedback from supervisors. Stay on track with automated reminders and status updates.' },
    f3: { title: 'Collaboration Hub', text: 'Connect with supervisors, committee members, and fellow researchers. Share documents, schedule meetings, and build your academic network.' },
    f4: { title: 'Defense Scheduling', text: 'Coordinate jury members, manage defense logistics, and track all requirements. Complete your doctoral journey with confidence and professional support.' }
  },
  team: {
    badge: 'Our Team',
    title: 'Meet the Experts Behind SuiviDoctorat',
    subtitle: 'A dedicated team of researchers, educators, and technologists committed to your success.',
    roles: {
      founder: 'Founder & CEO',
      research: 'Research Director',
      academic: 'Academic Advisor',
      tech: 'Tech Lead'
    }
  }
};

// Extended About Page Translations - French
TRANSLATIONS.fr.aboutPage = {
  hero: { 
    badge: 'DÉCOUVREZ NOTRE PLATEFORME',
    title: 'Là où la Recherche Rencontre l\'Innovation',
    subtitle: 'SuiviDoctorat connecte les doctorants, les encadrants et les institutions dans un écosystème unifié — transformant la façon dont la recherche académique est gérée, suivie et célébrée.'
  },
  services: {
    campaigns: { title: 'Gestion des Campagnes', text: 'Créez et gérez les campagnes d\'admission doctorales en toute transparence. Suivez les candidatures, évaluez les candidats et prenez des décisions basées sur les données.' },
    tracking: { title: 'Suivi de Progression', text: 'Surveillez les jalons de recherche, téléversez des documents et recevez des retours en temps réel de vos encadrants. Restez sur la bonne voie avec des rappels automatisés.' },
    defense: { title: 'Préparation à la Soutenance', text: 'Planifiez les soutenances, coordonnez avec les membres du jury et gérez toute la logistique. Terminez votre parcours doctoral avec confiance.' }
  },
  story: {
    badge: 'Notre Histoire',
    title: 'Construire l\'Avenir de l\'Excellence Doctorale',
    text: 'SuiviDoctorat a été fondé par une équipe de chercheurs et d\'éducateurs passionnés par la transformation du parcours doctoral. Unis par leur croyance en la puissance de la technologie pour simplifier la gestion de la recherche, ils ont entrepris une mission de créer une plateforme numérique accessible à tous les candidats au doctorat. Avec un dévouement sans relâche, ils ont rassemblé des experts et lancé ce système innovant, créant une communauté mondiale de chercheurs connectés par le désir d\'exceller et de faire progresser l\'excellence académique.'
  },
  stats: {
    years: 'Années d\'Expérience',
    candidates: 'Candidats Actifs',
    applications: 'Candidatures Traitées',
    success: 'Taux de Réussite'
  },
  mission: { title: 'Notre Mission', text: 'Simplifier et numériser le parcours doctoral, en dotant les étudiants, les encadrants et les institutions d\'outils modernes de gestion de la recherche et de collaboration.' },
  vision: { title: 'Notre Vision', text: 'Un monde où chaque candidat au doctorat a accès à des outils de gestion de recherche fluides, efficaces et collaboratifs.' },
  values: { title: 'Nos Valeurs', text: 'L\'innovation, l\'intégrité et la collaboration guident tout ce que nous faisons. Nous croyons en l\'autonomisation des chercheurs pour réaliser leur plein potentiel.' },
  features: {
    badge: 'Pourquoi Nous Choisir',
    title: 'Tout ce Dont Vous Avez Besoin pour Réussir',
    subtitle: 'Une plateforme complète conçue pour le parcours doctoral moderne.',
    f1: { title: 'Gestion des Campagnes', text: 'Créez, publiez et gérez les campagnes d\'admission en toute transparence. Suivez les candidatures, filtrez les candidats et prenez des décisions basées sur les données.' },
    f2: { title: 'Suivi de Progression', text: 'Surveillez les jalons, téléversez des documents et obtenez des retours en temps réel de vos encadrants. Restez sur la bonne voie avec des rappels automatisés.' },
    f3: { title: 'Hub de Collaboration', text: 'Connectez-vous avec les encadrants, les membres du comité et les autres chercheurs. Partagez des documents, planifiez des réunions et développez votre réseau académique.' },
    f4: { title: 'Planification de Soutenance', text: 'Coordonnez les membres du jury, gérez la logistique de soutenance et suivez toutes les exigences. Terminez votre parcours doctoral avec confiance.' }
  },
  team: {
    badge: 'Notre Équipe',
    title: 'Rencontrez les Experts Derrière SuiviDoctorat',
    subtitle: 'Une équipe dédiée de chercheurs, d\'éducateurs et de technologues engagés pour votre succès.',
    roles: {
      founder: 'Fondateur & PDG',
      research: 'Directeur de Recherche',
      academic: 'Conseiller Académique',
      tech: 'Responsable Technique'
    }
  }
};

// Extended About Page Translations - Arabic
TRANSLATIONS.ar.aboutPage = {
  hero: { 
    badge: 'اكتشف منصتنا',
    title: 'حيث يلتقي البحث بالابتكار',
    subtitle: 'يربط SuiviDoctorat طلاب الدكتوراه والمشرفين والمؤسسات في نظام موحد — محولاً طريقة إدارة البحث الأكاديمي وتتبعه والاحتفاء به.'
  },
  services: {
    campaigns: { title: 'إدارة الحملات', text: 'إنشاء وإدارة حملات القبول الدكتوراه بشفافية كاملة. تتبع الطلبات وتقييم المرشحين واتخاذ قرارات مبنية على البيانات.' },
    tracking: { title: 'تتبع التقدم', text: 'مراقبة معالم البحث ورفع المستندات والحصول على ملاحظات فورية من المشرفين. ابق على المسار الصحيح مع التذكيرات التلقائية.' },
    defense: { title: 'التحضير للمناقشة', text: 'جدولة المناقشات والتنسيق مع أعضاء اللجنة وإدارة جميع الخدمات اللوجستية. أكمل رحلتك الدكتوراه بثقة ودعم احترافي.' }
  },
  story: {
    badge: 'قصتنا',
    title: 'بناء مستقبل التميز الدكتوراه',
    text: 'تأسست SuiviDoctorat من قبل فريق من الباحثين والمعلمين المتحمسين لتحويل رحلة الدكتوراه. متحدون بإيمانهم بقوة التكنولوجيا لتبسيط إدارة البحث، انطلقوا في مهمة لإنشاء منصة رقمية متاحة لجميع مرشحي الدكتوراه. بتفانٍ لا يلين، جمعوا الخبراء وأطلقوا هذا النظام المبتكر، مما أنشأ مجتمعًا عالميًا من الباحثين متصلين برغبة التفوق والتقدم في التميز الأكاديمي.'
  },
  stats: {
    years: 'سنوات من الخبرة',
    candidates: 'مرشحين نشطين',
    applications: 'طلبات معالجة',
    success: 'معدل النجاح'
  },
  mission: { title: 'مهمتنا', text: 'تبسيط ورقمنة رحلة الدكتوراه، وتمكين الطلاب والمشرفين والمؤسسات بأدوات حديثة لإدارة البحث والتعاون.' },
  vision: { title: 'رؤيتنا', text: 'عالم يتمتع فيه كل مرشح دكتوراه بإمكانية الوصول إلى أدوات إدارة بحث سلسة وفعالة وتعاونية.' },
  values: { title: 'قيمنا', text: 'الابتكار والنزاهة والتعاون يقودون كل ما نقوم به. نحن نؤمن بتمكين الباحثين لتحقيق إمكاناتهم الكاملة.' },
  features: {
    badge: 'لماذا تختارنا',
    title: 'كل ما تحتاجه للنجاح',
    subtitle: 'منصة كاملة مبنية لرحلة الدكتوراه الحديثة.',
    f1: { title: 'إدارة الحملات', text: 'إنشاء ونشر وإدارة حملات القبول بشفافية كاملة. تتبع الطلبات وتصفية المرشحين واتخاذ قرارات مبنية على البيانات.' },
    f2: { title: 'تتبع التقدم', text: 'مراقبة المعالم ورفع المستندات والحصول على ملاحظات فورية من المشرفين. ابق على المسار الصحيح مع التذكيرات التلقائية.' },
    f3: { title: 'مركز التعاون', text: 'تواصل مع المشرفين وأعضاء اللجنة والباحثين الآخرين. شارك المستندات وجدول الاجتماعات وابني شبكتك الأكاديمية.' },
    f4: { title: 'جدولة المناقشة', text: 'تنسيق أعضاء اللجنة وإدارة لوجستيات المناقشة وتتبع جميع المتطلبات. أكمل رحلتك الدكتوراه بثقة ودعم احترافي.' }
  },
  team: {
    badge: 'فريقنا',
    title: 'تعرف على الخبراء وراء SuiviDoctorat',
    subtitle: 'فريق متفانٍ من الباحثين والمعلمين والتقنيين ملتزم بنجاحك.',
    roles: {
      founder: 'المؤسس والرئيس التنفيذي',
      research: 'مدير البحث',
      academic: 'المستشار الأكاديمي',
      tech: 'قائد التقنية'
    }
  }
};

// Contact Page Translations - English
TRANSLATIONS.en.contactPage = {
  hero: {
    badge: 'CONTACT US',
    title: 'Get in Touch',
    subtitle: "Have questions about SuiviDoctorat? We're here to help you succeed in your doctoral journey."
  },
  info: {
    title: 'Contact Information',
    subtitle: 'Reach out to us through any of the following channels. We typically respond within 24 hours.',
    office: { title: 'Our Office' },
    email: { title: 'Email Us' },
    phone: { title: 'Call Us' },
    hours: { title: 'Office Hours', weekdays: 'Monday – Friday: 9:00 AM – 6:00 PM', weekend: 'Weekend: Closed' },
    social: { title: 'Follow Us' }
  },
  form: {
    title: 'Send us a Message',
    subtitle: 'Fill out the form and our team will get back to you shortly.',
    firstName: 'First Name',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Doe',
    email: 'Email Address',
    emailPlaceholder: 'john.doe@university.edu',
    subject: 'Subject',
    selectTopic: 'Select a topic...',
    topics: {
      general: 'General Inquiry',
      technical: 'Technical Support',
      campaigns: 'Campaigns & Admissions',
      partnership: 'Partnership Opportunity'
    },
    message: 'Your Message',
    messagePlaceholder: 'How can we help you?',
    submit: 'Send Message'
  },
  map: { button: 'View on Google Maps' }
};

// Contact Page Translations - French
TRANSLATIONS.fr.contactPage = {
  hero: {
    badge: 'CONTACTEZ-NOUS',
    title: 'Entrons en Contact',
    subtitle: "Vous avez des questions sur SuiviDoctorat ? Nous sommes là pour vous accompagner dans votre parcours doctoral."
  },
  info: {
    title: 'Informations de Contact',
    subtitle: 'Contactez-nous via l\'un des canaux suivants. Nous répondons généralement sous 24 heures.',
    office: { title: 'Notre Bureau' },
    email: { title: 'Email' },
    phone: { title: 'Téléphone' },
    hours: { title: 'Heures d\'Ouverture', weekdays: 'Lundi – Vendredi : 9h00 – 18h00', weekend: 'Week-end : Fermé' },
    social: { title: 'Suivez-nous' }
  },
  form: {
    title: 'Envoyez-nous un Message',
    subtitle: 'Remplissez le formulaire et notre équipe vous répondra rapidement.',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Jean',
    lastName: 'Nom',
    lastNamePlaceholder: 'Dupont',
    email: 'Adresse Email',
    emailPlaceholder: 'jean.dupont@universite.edu',
    subject: 'Sujet',
    selectTopic: 'Sélectionnez un sujet...',
    topics: {
      general: 'Demande Générale',
      technical: 'Support Technique',
      campaigns: 'Campagnes & Admissions',
      partnership: 'Opportunité de Partenariat'
    },
    message: 'Votre Message',
    messagePlaceholder: 'Comment pouvons-nous vous aider ?',
    submit: 'Envoyer le Message'
  },
  map: { button: 'Voir sur Google Maps' }
};

// Contact Page Translations - Arabic
TRANSLATIONS.ar.contactPage = {
  hero: {
    badge: 'اتصل بنا',
    title: 'تواصل معنا',
    subtitle: 'هل لديك أسئلة حول SuiviDoctorat؟ نحن هنا لمساعدتك في رحلتك الدكتوراه.'
  },
  info: {
    title: 'معلومات الاتصال',
    subtitle: 'تواصل معنا عبر أي من القنوات التالية. نرد عادةً خلال 24 ساعة.',
    office: { title: 'مكتبنا' },
    email: { title: 'البريد الإلكتروني' },
    phone: { title: 'الهاتف' },
    hours: { title: 'ساعات العمل', weekdays: 'الإثنين – الجمعة: 9:00 صباحاً – 6:00 مساءً', weekend: 'عطلة نهاية الأسبوع: مغلق' },
    social: { title: 'تابعنا' }
  },
  form: {
    title: 'أرسل لنا رسالة',
    subtitle: 'املأ النموذج وسيرد فريقنا عليك قريباً.',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'أحمد',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'محمد',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'ahmed@university.edu',
    subject: 'الموضوع',
    selectTopic: 'اختر موضوعاً...',
    topics: {
      general: 'استفسار عام',
      technical: 'الدعم التقني',
      campaigns: 'الحملات والقبول',
      partnership: 'فرصة شراكة'
    },
    message: 'رسالتك',
    messagePlaceholder: 'كيف يمكننا مساعدتك؟',
    submit: 'إرسال الرسالة'
  },
  map: { button: 'عرض على خرائط جوجل' }
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
