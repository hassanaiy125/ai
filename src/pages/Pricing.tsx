import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.plan.starter'),
      price: '0',
      currency: t('pricing.currency'),
      period: t('pricing.period'),
      desc: t('pricing.starter.desc'),
      features: [
        t('pricing.feature.v2'),
        t('pricing.feature.720p'),
        t('pricing.feature.standardVoices'),
        t('pricing.feature.communitySupport')
      ],
      cta: t('pricing.cta.starter'),
      popular: false,
    },
    {
      name: t('pricing.plan.popular'),
      price: '50',
      currency: t('pricing.currency'),
      period: t('pricing.period'),
      desc: t('pricing.popular.desc'),
      features: [
        t('pricing.feature.v50'),
        t('pricing.feature.1080p'),
        t('pricing.feature.premiumVoices'),
        t('pricing.feature.prioritySupport')
      ],
      cta: t('pricing.cta.popular'),
      popular: true,
    },
    {
      name: t('pricing.plan.pro'),
      price: '100',
      currency: t('pricing.currency'),
      period: t('pricing.period'),
      desc: t('pricing.pro.desc'),
      features: [
        t('pricing.feature.unlimited'),
        t('pricing.feature.4k'),
        t('pricing.feature.allVoices'),
        t('pricing.feature.247Support'),
        t('pricing.feature.noWatermarks')
      ],
      cta: t('pricing.cta.pro'),
      popular: false,
    },
    {
      name: t('pricing.plan.enterprise'),
      price: 'Custom',
      currency: '',
      period: '',
      desc: t('pricing.enterprise.desc'),
      features: [
        t('pricing.feature.customModels'),
        t('pricing.feature.apiAccess'),
        t('pricing.feature.accountManager'),
        t('pricing.feature.sso')
      ],
      cta: t('pricing.cta.enterprise'),
      popular: false,
      whatsapp: 'https://wa.me/201024419931'
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {t('pricing.title')}
        </h1>
        <p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-2xl border flex flex-col ${
              plan.popular 
                ? 'bg-white/10 border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {t('pricing.popular')}
              </span>
            )}

            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-400 text-sm">{plan.currency}{plan.period}</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">{plan.desc}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.whatsapp ? (
              <a 
                href={plan.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold transition-all bg-green-600 text-white hover:bg-green-700 text-center"
              >
                {plan.cta}
              </a>
            ) : (
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                plan.popular 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}>
                {plan.cta}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
