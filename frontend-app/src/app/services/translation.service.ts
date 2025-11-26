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

@Injectable({ providedIn: 'root' })
export class TranslationService {
  current = signal<Lang>((localStorage.getItem('lang') as Lang) || 'en');
  translations = computed(() => TRANSLATIONS[this.current()]);

  setLanguage(lang: Lang) {
    this.current.set(lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  t(path: string): string {
    const parts = path.split('.');
    let cur: any = this.translations();
    for (const p of parts) {
      if (!cur) return path;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : path;
  }
}
