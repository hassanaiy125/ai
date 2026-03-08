import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Video, Play, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080?blur=8')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/create" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              {t('home.cta.start')}
            </Link>
            <Link 
              to="/pricing" 
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              {t('home.cta.pricing')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            {t('home.features.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('home.feature.scenes'), desc: t('home.feature.scenes.desc'), icon: Video },
              { title: t('home.feature.voice'), desc: t('home.feature.voice.desc'), icon: Play },
              { title: t('home.feature.export'), desc: t('home.feature.export.desc'), icon: CheckCircle },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
