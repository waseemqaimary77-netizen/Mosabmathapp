/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, Send, Image as ImageIcon, Loader2, Calculator, X, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Mascot from '../components/Mascot';
import { solveMathProblem } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

const QUICK_EXAMPLES = [
  "حل المعادلة: 2س² + 5س - 3 = 0",
  "ما هو جيب الزاوية 30° وجتا 60° مع الشرح؟",
  "أوجد المشتقة الأولى للدالة: د(س) = 3س³ - 5س + 7",
  "احسب مساحة دائرة نصف قطرها نق = 7 سم",
];

export default function MathSolver() {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshProgress } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSolve = async () => {
    if (!input.trim() && !selectedImage) return;
    setLoading(true);
    setResponse(null);
    
    try {
      const result = await solveMathProblem(input, selectedImage || undefined);
      setResponse(result);
      
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            xp: increment(10),
            solvedCount: increment(1)
          });
          await refreshProgress();
        } catch (dbErr) {
          console.warn("Could not update XP:", dbErr);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
          <Sparkles size={16} /> مساعد الأستاذ مصعب الفوري
        </div>
        <h2 className="text-3xl font-black text-slate-800">حل المسائل الذكي</h2>
        <p className="text-slate-500 font-medium">اكتب مسألتك أو صور الدفتر، والأستاذ مصعب بشرحلك الحل من طقطق للسلام عليكم!</p>
      </section>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب مسألتك هون... مثلاً: حل المعادلة 3س + 9 = 24 أو احسب جيب الـ 30"
          className="w-full h-32 p-4 text-lg border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-slate-50/50 outline-none transition-all resize-none text-right"
          dir="rtl"
        />

        {selectedImage && (
          <div className="relative inline-block border-2 border-blue-200 rounded-2xl overflow-hidden p-1 bg-slate-50">
            <img src={selectedImage} alt="مسألة مرفقة" className="h-32 object-cover rounded-xl" />
            <button
              onClick={removeImage}
              className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          capture="environment" 
          onChange={handleImageChange} 
          className="hidden" 
        />
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSolve}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} className="rtl-flip" />}
            {loading ? 'الأستاذ مصعب عم بحل...' : 'أوجد الحل والشرح'}
          </button>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <Camera size={20} />
            {selectedImage ? 'تغيير الصورة' : 'تصوير مسألة من الدفتر'}
          </button>
        </div>

        {/* Quick Example Pills */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 mb-2">أمثلة سريعة للتجربة:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(ex)}
                className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-xl border border-slate-100 transition-all text-right"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(loading || response) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-primary shadow-sm">
               <Calculator size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">شرح الأستاذ مصعب</h3>
              <p className="text-xs text-slate-400 font-medium">حل مفصل بالرموز العربية مع لمسة فلسطينية كوميدية</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 py-8 text-center">
               <div className="h-4 bg-slate-100 rounded-full w-3/4 mx-auto animate-pulse" />
               <div className="h-4 bg-slate-100 rounded-full w-full mx-auto animate-pulse" />
               <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-auto animate-pulse" />
               <p className="text-slate-500 font-bold text-sm mt-4 animate-bounce">
                 "استنى شوي يا وحش، عم بجهزلك شرح مرتب ترفع راسنا فيه!"
               </p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none prose-headings:text-primary prose-headings:font-bold prose-strong:text-slate-900 prose-p:leading-relaxed text-right font-medium">
               <ReactMarkdown>{response || ''}</ReactMarkdown>
            </div>
          )}
          
          {!loading && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
               <p className="text-sm text-slate-500 font-medium">فهمت الشرح يا زلمة؟</p>
               <div className="flex gap-2">
                  <button className="px-4 py-2 hover:bg-green-50 rounded-xl text-green-700 bg-green-50/50 font-bold text-sm transition-colors">👍 كفو يسعد دينك</button>
                  <button className="px-4 py-2 hover:bg-amber-50 rounded-xl text-amber-700 bg-amber-50/50 font-bold text-sm transition-colors">🤔 لسه بدها تركيز</button>
               </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
