import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { generateImage, promptApiKey } from '../lib/gemini';
import { Loader2, Image as ImageIcon, AlertCircle, Download, ArrowRight, Upload, X, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function CreateImage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-sm"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('common.signInRequired')}</h2>
          <p className="text-gray-400 mb-8">{t('common.signInToCreate')}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            {t('common.signIn')}
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async (isRetry = false) => {
    if (!prompt.trim() || !user) return;
    
    // Check limits
    const usageKey = `veogen_image_usage_${user.uid}`;
    const currentUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);
    
    // Assuming default Starter plan (3 images limit)
    // In a real app, you would check the user's actual subscription tier from a database
    const userPlan = 'starter'; // 'starter', 'popular', 'pro'
    const limits = {
      starter: 3,
      popular: 100,
      pro: Infinity
    };
    
    if (currentUsage >= limits[userPlan as keyof typeof limits]) {
      setError(t('image.limitReached'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = await generateImage(prompt, uploadedImage || undefined);
      setImageUrl(url);
      
      // Increment usage
      localStorage.setItem(usageKey, (currentUsage + 1).toString());
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || '';
      const isApiKeyError = errorMessage === 'API_KEY_MISSING' || 
                            errorMessage.includes('API key not valid') ||
                            errorMessage.includes('Requested entity was not found');

      if (isApiKeyError && !isRetry) {
        try {
          await promptApiKey();
          await handleGenerateImage(true);
          return;
        } catch (e) {
          setError('Failed to select API Key');
        }
      } else {
        setError(errorMessage || 'Failed to generate image. Please try again.');
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent leading-normal pb-2">
          {t('image.title')}
        </h1>
        <p className="text-gray-400">{t('image.subtitle')}</p>
      </motion.div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!imageUrl ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('image.upload.label')}
              </label>
              
              {!uploadedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">{t('image.upload.placeholder')}</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/20 group">
                  <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {
                      setUploadedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('create.prompt.label')}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('image.prompt.placeholder')}
              className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleGenerateImage(false)}
                disabled={loading || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                {t('image.btn.generate')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10 shadow-2xl relative group">
              <img 
                src={imageUrl} 
                alt="Generated" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setImageUrl(null)}
                className="px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                {t('create.btn.createAnother')}
              </button>
              <a
                href={imageUrl}
                download="veogen-image.png"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <Download className="w-5 h-5" />
                {t('create.btn.download')}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
