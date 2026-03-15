import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    'app.name': 'VeoGen',
    'nav.dashboard': 'Dashboard',
    'nav.createVideo': 'Create Video',
    'nav.createImage': 'Create Image',
    'nav.pricing': 'Pricing',
    'nav.signOut': 'Sign Out',
    'nav.signIn': 'Sign In',
    'home.hero.title': 'Create Cinematic AI Videos & Images',
    'home.hero.subtitle': 'Turn your text into stunning videos and photos with custom voiceovers, music, and visuals using the power of Veo AI.',
    'home.cta.start': 'Start Creating Free',
    'home.cta.pricing': 'View Pricing',
    'home.features.title': 'Why Choose VeoGen?',
    'home.feature.scenes': 'AI-Powered Scenes',
    'home.feature.scenes.desc': 'Generate realistic scenes from simple text prompts using Veo 3.1.',
    'home.feature.voice': 'Custom Voiceovers',
    'home.feature.voice.desc': 'Choose from a variety of AI voices to narrate your story.',
    'home.feature.export': 'Instant Export',
    'home.feature.export.desc': 'Download your videos in HD quality instantly.',
    'create.title': 'Create Your Masterpiece',
    'create.subtitle': 'Transform your ideas into stunning videos with AI.',
    'create.step.prompt': 'Prompt',
    'create.step.script': 'Script',
    'create.step.video': 'Video',
    'create.prompt.label': 'What do you want to create?',
    'create.prompt.placeholder': 'Describe your idea... e.g., A futuristic city with flying cars at sunset.',
    'create.btn.generateScript': 'Generate Script',
    'create.script.label': 'AI Generated Script',
    'create.btn.editPrompt': 'Edit Prompt',
    'create.btn.regenerate': 'Regenerate',
    'create.btn.generateVideo': 'Generate Video',
    'create.note': 'Note: Generation may take a few minutes. Please be patient.',
    'create.btn.createAnother': 'Create Another',
    'create.btn.download': 'Download',
    'dashboard.title': 'Your Dashboard',
    'dashboard.filter': 'Filter: All Items',
    'dashboard.empty': 'No items yet. Start creating!',
    'dashboard.createNew': 'Create New',
    'dashboard.start': 'Start from scratch',
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to continue creating',
    'login.btn.google': 'Sign in with Google',
    'login.error': 'Failed to sign in',
    'login.error.cancelled': 'Sign in cancelled',
    'image.title': 'Create AI Images',
    'image.subtitle': 'Generate high-quality images from text descriptions.',
    'image.btn.generate': 'Generate Image',
    'image.prompt.placeholder': 'Describe your image... e.g., A cyberpunk street at night.',
    'image.upload.label': 'Reference Image (Optional)',
    'image.upload.placeholder': 'Click to upload a face or reference image',
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.subtitle': 'Choose the plan that fits your needs.',
    'pricing.plan.starter': 'Starter',
    'pricing.plan.popular': 'Popular',
    'pricing.plan.pro': 'Pro',
    'pricing.plan.enterprise': 'Enterprise',
    'pricing.period': '/month',
    'pricing.currency': 'EGP',
    'pricing.cta.starter': 'Get Started',
    'pricing.cta.popular': 'Get Popular',
    'pricing.cta.pro': 'Upgrade to Pro',
    'pricing.cta.enterprise': 'Contact on WhatsApp',
    'pricing.popular': 'Most Popular',
    'pricing.starter.desc': '2 videos per month',
    'pricing.popular.desc': '50 videos per month',
    'pricing.pro.desc': 'Unlimited videos',
    'pricing.enterprise.desc': 'For teams and businesses',
    'pricing.feature.v2': '2 videos per month',
    'pricing.feature.v50': '50 videos per month',
    'pricing.feature.unlimited': 'Unlimited videos',
    'pricing.feature.720p': '720p resolution',
    'pricing.feature.1080p': '1080p resolution',
    'pricing.feature.4k': '4K resolution',
    'pricing.feature.standardVoices': 'Standard voices',
    'pricing.feature.premiumVoices': 'Premium voices',
    'pricing.feature.allVoices': 'All premium voices',
    'pricing.feature.communitySupport': 'Community support',
    'pricing.feature.prioritySupport': 'Priority support',
    'pricing.feature.247Support': '24/7 Support',
    'pricing.feature.noWatermarks': 'No watermarks',
    'pricing.feature.customModels': 'Custom AI models',
    'pricing.feature.apiAccess': 'API access',
    'pricing.feature.accountManager': 'Dedicated account manager',
    'pricing.feature.sso': 'SSO integration',
    'pricing.feature.img3': '3 free images',
    'pricing.feature.img100': '100 images per month',
    'pricing.feature.imgUnlimited': 'Unlimited images',
    'image.limitReached': 'You have reached your free image limit. Please upgrade to continue.',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.signInRequired': 'Sign in required',
    'common.signInToCreate': 'Please sign in to create content.',
    'common.signIn': 'Sign In',
  },
  ar: {
    'app.name': 'فيوجين',
    'nav.dashboard': 'لوحة التحكم',
    'nav.createVideo': 'إنشاء فيديو',
    'nav.createImage': 'إنشاء صورة',
    'nav.pricing': 'الأسعار',
    'nav.signOut': 'تسجيل الخروج',
    'nav.signIn': 'تسجيل الدخول',
    'home.hero.title': 'أنشئ فيديوهات وصور سينمائية بالذكاء الاصطناعي',
    'home.hero.subtitle': 'حول نصوصك إلى فيديوهات وصور مذهلة مع تعليق صوتي مخصص وموسيقى ومشاهد بصرية باستخدام قوة Veo AI.',
    'home.cta.start': 'ابدأ مجاناً',
    'home.cta.pricing': 'عرض الأسعار',
    'home.features.title': 'لماذا تختار فيوجين؟',
    'home.feature.scenes': 'مشاهد مدعومة بالذكاء الاصطناعي',
    'home.feature.scenes.desc': 'قم بإنشاء مشاهد واقعية من نصوص بسيطة باستخدام Veo 3.1.',
    'home.feature.voice': 'تعليق صوتي مخصص',
    'home.feature.voice.desc': 'اختر من بين مجموعة متنوعة من الأصوات لسرد قصتك.',
    'home.feature.export': 'تصدير فوري',
    'home.feature.export.desc': 'قم بتنزيل فيديوهاتك بجودة HD فوراً.',
    'create.title': 'اصنع تحفتك الفنية',
    'create.subtitle': 'حول أفكارك إلى فيديوهات مذهلة بالذكاء الاصطناعي.',
    'create.step.prompt': 'الوصف',
    'create.step.script': 'السيناريو',
    'create.step.video': 'الفيديو',
    'create.prompt.label': 'ماذا تريد أن تنشئ؟',
    'create.prompt.placeholder': 'صف فكرتك... مثال: مدينة مستقبلية مع سيارات طائرة عند الغروب.',
    'create.btn.generateScript': 'توليد السيناريو',
    'create.script.label': 'السيناريو المولد بالذكاء الاصطناعي',
    'create.btn.editPrompt': 'تعديل الوصف',
    'create.btn.regenerate': 'إعادة التوليد',
    'create.btn.generateVideo': 'توليد الفيديو',
    'create.note': 'ملاحظة: قد يستغرق التوليد بضع دقائق. يرجى الانتظار.',
    'create.btn.createAnother': 'إنشاء آخر',
    'create.btn.download': 'تنزيل',
    'dashboard.title': 'لوحة التحكم الخاصة بك',
    'dashboard.filter': 'تصفية: كل العناصر',
    'dashboard.empty': 'لا توجد عناصر بعد. ابدأ الإنشاء!',
    'dashboard.createNew': 'إنشاء جديد',
    'dashboard.start': 'ابدأ من الصفر',
    'login.title': 'مرحباً بعودتك',
    'login.subtitle': 'سجل الدخول للمتابعة',
    'login.btn.google': 'تسجيل الدخول باستخدام Google',
    'login.error': 'فشل تسجيل الدخول',
    'login.error.cancelled': 'تم إلغاء تسجيل الدخول',
    'image.title': 'إنشاء صور بالذكاء الاصطناعي',
    'image.subtitle': 'توليد صور عالية الجودة من الأوصاف النصية.',
    'image.btn.generate': 'توليد الصورة',
    'image.prompt.placeholder': 'صف صورتك... مثال: شارع سايبربانك في الليل.',
    'image.upload.label': 'صورة مرجعية (اختياري)',
    'image.upload.placeholder': 'انقر لرفع صورة وجه أو صورة مرجعية',
    'pricing.title': 'أسعار بسيطة وشفافة',
    'pricing.subtitle': 'اختر الخطة التي تناسب احتياجاتك.',
    'pricing.plan.starter': 'البداية',
    'pricing.plan.popular': 'الشائع',
    'pricing.plan.pro': 'المحترف',
    'pricing.plan.enterprise': 'المؤسسات',
    'pricing.period': '/شهر',
    'pricing.currency': 'ج.م',
    'pricing.cta.starter': 'ابدأ الآن',
    'pricing.cta.popular': 'اشترك في الشائع',
    'pricing.cta.pro': 'ترقية للمحترف',
    'pricing.cta.enterprise': 'تواصل عبر واتساب',
    'pricing.popular': 'الأكثر شيوعاً',
    'pricing.starter.desc': 'فيديوهان شهرياً',
    'pricing.popular.desc': '50 فيديو شهرياً',
    'pricing.pro.desc': 'فيديوهات غير محدودة',
    'pricing.enterprise.desc': 'للفرق والشركات',
    'pricing.feature.v2': 'فيديوهان شهرياً',
    'pricing.feature.v50': '50 فيديو شهرياً',
    'pricing.feature.unlimited': 'فيديوهات غير محدودة',
    'pricing.feature.720p': 'دقة 720p',
    'pricing.feature.1080p': 'دقة 1080p',
    'pricing.feature.4k': 'دقة 4K',
    'pricing.feature.standardVoices': 'أصوات قياسية',
    'pricing.feature.premiumVoices': 'أصوات مميزة',
    'pricing.feature.allVoices': 'جميع الأصوات المميزة',
    'pricing.feature.communitySupport': 'دعم مجتمعي',
    'pricing.feature.prioritySupport': 'دعم ذو أولوية',
    'pricing.feature.247Support': 'دعم 24/7',
    'pricing.feature.noWatermarks': 'بدون علامة مائية',
    'pricing.feature.customModels': 'نماذج ذكاء اصطناعي مخصصة',
    'pricing.feature.apiAccess': 'وصول للواجهة البرمجية (API)',
    'pricing.feature.accountManager': 'مدير حساب مخصص',
    'pricing.feature.sso': 'تكامل SSO',
    'pricing.feature.img3': '3 صور مجانية',
    'pricing.feature.img100': '100 صورة شهرياً',
    'pricing.feature.imgUnlimited': 'صور غير محدودة',
    'image.limitReached': 'لقد وصلت إلى الحد الأقصى للصور المجانية. يرجى الترقية للاستمرار.',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.signInRequired': 'تسجيل الدخول مطلوب',
    'common.signInToCreate': 'يرجى تسجيل الدخول لإنشاء محتوى.',
    'common.signIn': 'تسجيل الدخول',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
