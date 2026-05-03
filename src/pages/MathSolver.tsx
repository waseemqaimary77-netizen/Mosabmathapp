/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Send, Image as ImageIcon, Loader2, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import Mascot from '../components/Mascot';
import { solveMathProblem } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function MathSolver() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { user, refreshProgress } = useAuth();

  const handleSolve = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    
    try {
      const result = await solveMathProblem(input);
      setResponse(result);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(10),
          solvedCount: increment(1)
        });
        await refreshProgress();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">حل المسائل الذكي</h2>
        <p className="text-slate-500">اكتب أي مسألة رياضية وسأقوم بحلها لك خطوة بخطوة</p>
      </section>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6 space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: حل المعادلة 2س + 5 = 13"
            className="w-full h-32 p-4 text-lg border-2 border-slate-100 rounded-2xl focus:border-primary outline-none transition-all resize-none"
          />
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSolve}
              disabled={loading || !input.trim()}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} className="rtl-flip" />}
              أوجد الحل
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all">
              <Camera size={20} />
              تصوير المسألة
            </button>
          </div>
        </div>
      </div>

      {(loading || response) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-10 -translate-y-10">
            <Mascot emotion={loading ? 'thinking' : 'happy'} />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
               <Calculator />
            </div>
            <div>
              <h3 className="font-bold text-xl">تحليل الأستاذ مصعب</h3>
              <p className="text-xs text-slate-400">بواسطة الذكاء الاصطناعي</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 py-8">
               <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
               <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
               <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
               <p className="text-center text-slate-400 text-sm">أفكر في الحل...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none prose-headings:text-primary prose-strong:text-slate-900">
               <ReactMarkdown>{response || ''}</ReactMarkdown>
            </div>
          )}
          
          {!loading && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
               <p className="text-sm text-slate-500">هل كان الشرح مفيداً؟</p>
               <div className="flex gap-2">
                  <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">👍 نعم</button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">👎 ليس تماماً</button>
               </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
