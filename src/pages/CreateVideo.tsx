import React, { useState } from 'react';
import { motion } from 'motion/react';
import { generateVideo, generateScript, promptApiKey } from '../lib/gemini';
import { Loader2, Video, Wand2, Play, AlertCircle, ArrowRight, FileText, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function CreateVideo() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'prompt' | 'script' | 'video'>('prompt');

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

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateScript(prompt);
      setScript(result || '');
      setStep('script');
    } catch (err: any) {
      setError(err.message || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async (isRetry = false) => {
    setLoading(true);
    setError(null);
    try {
      // Use the prompt directly for video generation as Veo takes a prompt
      // We use the original prompt as the base, but user can edit script/prompt if they want (not implemented fully here for simplicity)
      // For Veo, we need a descriptive prompt.
      const videoPrompt = `${prompt}, cinematic, 4k, highly detailed, photorealistic`;
      const url = await generateVideo(videoPrompt);
      if (url) {
        setVideoUrl(url);
        setStep('video');
      } else {
        throw new Error("No video URI returned");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || '';
      const isApiKeyError = errorMessage === 'API_KEY_MISSING' || 
                            errorMessage.includes('API key not valid') ||
                            errorMessage.includes('Requested entity was not found');

      if (isApiKeyError && !isRetry) {
        try {
          await promptApiKey();
          // Retry once after key selection
          await handleGenerateVideo(true);
          return; 
        } catch (e) {
          setError('Failed to select API Key');
        }
      } else {
        setError(errorMessage || 'Failed to generate video. Please try again.');
      }
    } finally {
      // Only turn off loading if this is the top-level call or if the retry finished
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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {t('create.title')}
        </h1>
        <p className="text-gray-400">{t('create.subtitle')}</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          {['prompt', 'script', 'video'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s || (step === 'video' && s !== 'video') || (step === 'script' && s === 'prompt')
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-gray-500'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className={`w-16 h-1 bg-white/10 mx-2 ${
                (step === 'script' && i === 0) || step === 'video' ? 'bg-purple-600' : ''
              }`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {step === 'prompt' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('create.prompt.label')}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('create.prompt.placeholder')}
              className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerateScript}
                disabled={loading || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {t('create.btn.generateScript')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'script' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-300">
                {t('create.script.label')}
              </label>
              <button 
                onClick={() => setStep('prompt')}
                className="text-sm text-gray-400 hover:text-white"
              >
                {t('create.btn.editPrompt')}
              </button>
            </div>
            
            <div className="bg-black/30 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {script}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleGenerateScript()}
                disabled={loading}
                className="px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                {t('create.btn.regenerate')}
              </button>
              <button
                onClick={() => handleGenerateVideo(false)}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                {t('create.btn.generateVideo')}
              </button>
            </div>
            <p className="text-xs text-center mt-4 text-gray-500">
              {t('create.note')}
            </p>
          </motion.div>
        )}

        {step === 'video' && videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep('prompt')}
                className="px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                {t('create.btn.createAnother')}
              </button>
              <a
                href={videoUrl}
                download="veogen-video.mp4"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <Video className="w-5 h-5" />
                {t('create.btn.download')}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
