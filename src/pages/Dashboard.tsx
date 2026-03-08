import React from 'react';
import { motion } from 'motion/react';
import { Play, Download, Trash2, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Dashboard() {
  const { t } = useLanguage();
  // Mock data for now
  const videos = [
    { id: 1, title: 'Product Demo', duration: '0:30', status: 'Ready', date: '2 hours ago', thumbnail: 'https://picsum.photos/seed/tech/400/225' },
    { id: 2, title: 'Social Media Ad', duration: '0:15', status: 'Processing', date: '5 mins ago', thumbnail: 'https://picsum.photos/seed/social/400/225' },
    { id: 3, title: 'Tutorial Intro', duration: '0:45', status: 'Ready', date: '1 day ago', thumbnail: 'https://picsum.photos/seed/code/400/225' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {t('dashboard.title')}
        </h1>
        <button className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
          {t('dashboard.filter')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <div className="aspect-video bg-black relative">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-1" />
                </button>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-mono">
                {video.duration}
              </span>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg truncate pr-2">{video.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  video.status === 'Ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {video.status}
                </span>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-4 gap-2">
                <Clock className="w-3 h-3" />
                <span>{video.date}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> {t('create.btn.download')}
                </button>
                <button className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add New Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: videos.length * 0.1 }}
          className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
            <Play className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
          </div>
          <h3 className="font-bold text-lg text-gray-400 group-hover:text-white">{t('dashboard.createNew')}</h3>
          <p className="text-sm text-gray-500 mt-2">{t('dashboard.start')}</p>
        </motion.div>
      </div>
    </div>
  );
}
