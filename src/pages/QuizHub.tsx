/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Brain, Trophy, Timer, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateQuizQuestion } from '../services/gemini';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function QuizHub() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('متوسط');
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { user, refreshProgress } = useAuth();

  const startQuiz = async () => {
    setLoading(true);
    setQuestion(null);
    setSelectedOption(null);
    setShowExplanation(false);
    try {
      const q = await generateQuizQuestion(topic || 'عام', level);
      if (q) setQuestion(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    
    if (idx === question?.correctAnswer) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(25),
        });
        await refreshProgress();
      }
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
             <Brain className="text-purple-600" />
             الاختبارات الذكية
          </h2>
          <p className="text-slate-500">اختبر معلوماتك وقوة ذكائك الرياضي</p>
        </div>
        {!question && (
           <div className="flex bg-white rounded-2xl p-4 shadow-sm border border-slate-100 items-center gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                 <Trophy size={20} />
              </div>
              <div>
                 <p className="text-xs text-slate-500">أعلى علامة اليوم</p>
                 <p className="font-bold">85%</p>
              </div>
           </div>
        )}
      </header>

      {!question ? (
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">اختر موضوع الاختبار</label>
            <input 
              type="text" 
              placeholder="مثال: الجبر، الهندسة، التفاضل..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-xl outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">مستوى الصعوبة</label>
            <div className="grid grid-cols-3 gap-3">
              {['سهل', 'متوسط', 'صعب'].map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`p-3 rounded-xl border-2 transition-all font-bold ${
                    level === l ? 'border-primary bg-blue-50 text-primary' : 'border-slate-100 bg-white text-slate-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'جاري تجهيز الأسئلة...' : 'ابدأ التحدي الآن'}
            <ChevronRight className="rtl-flip" />
          </button>
        </section>
      ) : (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-3xl mx-auto space-y-8"
        >
          <div className="flex justify-between items-center pb-6 border-b border-slate-50">
             <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{topic || 'رياضيات عامة'}</span>
             <div className="flex items-center gap-2 text-slate-400">
                <Timer size={16} />
                <span className="text-sm font-mono tracking-wider">00:45</span>
             </div>
          </div>

          <h3 className="text-2xl font-bold leading-relaxed">{question.question}</h3>

          <div className="grid gap-4">
            {question.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === question.correctAnswer;
              
              let statusClass = "bg-slate-50 border-slate-100 hover:border-blue-200";
              if (selectedOption !== null) {
                if (isCorrect) statusClass = "bg-green-50 border-green-500 text-green-700";
                else if (isSelected) statusClass = "bg-red-50 border-red-500 text-red-700";
                else statusClass = "bg-slate-50 border-slate-100 opacity-50";
              }

              return (
                <button
                  key={i}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-6 h-auto text-right rounded-2xl border-2 transition-all flex items-center justify-between font-medium text-lg ${statusClass}`}
                >
                   <span>{opt}</span>
                   {selectedOption !== null && isCorrect && <CheckCircle2 className="text-green-500" />}
                   {selectedOption !== null && isSelected && !isCorrect && <XCircle className="text-red-500" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-2"
              >
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                   <Brain size={18} />
                   شرح الأستاذ مصعب:
                </div>
                <p className="text-blue-900">{question.explanation}</p>
                <button 
                  onClick={startQuiz}
                  className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  سؤال آخر
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </div>
  );
}
