/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Zap, Star, ShieldCheck, Target, Gem, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BADGES } from '../constants';
import { motion } from 'motion/react';

export default function Achievements() {
  const { user, progress } = useAuth();

  const achievements = [
    { label: 'النقاط الإجمالية', value: progress?.xp || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'المستوى الحالي', value: progress?.level || 1, icon: Star, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'مسائل محلولة', value: progress?.solvedCount || 0, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'سلسلة انتصارات', value: progress?.streak || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="text-center md:text-right">
        <h2 className="text-3xl font-bold mb-2">لوحة الإنجازات</h2>
        <p className="text-slate-500">تتبع تقدمك وافتح شارات جديدة كلما تعلمت أكثر</p>
      </header>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3"
          >
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{item.value}</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Level Progress */}
      <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-10 -translate-y-10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-primary font-bold text-sm mb-1">تقدمك للمستوى القادم</p>
              <h3 className="text-2xl font-black">مستوى {progress?.level || 1}</h3>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">متبقي</p>
              <p className="font-bold">250 XP</p>
            </div>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              className="h-full math-gradient"
            />
          </div>
          
          <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
             <span>مستوى {progress?.level || 1}</span>
             <span>مستوى {(progress?.level || 1) + 1}</span>
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
           الشارات المحققة
           <Gem className="text-secondary" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {BADGES.map((badge) => {
             const isUnlocked = progress?.badges.includes(badge.id) || false;
             return (
               <div key={badge.id} className={`flex flex-col items-center text-center gap-3 group`}>
                  <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-500 ${
                    isUnlocked 
                      ? 'bg-white border-4 border-amber-400 shadow-lg shadow-amber-100 -rotate-6' 
                      : 'bg-slate-100 border-4 border-slate-200 opacity-40 grayscale'
                  }`}>
                    {badge.icon}
                    {isUnlocked && (
                       <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                          <ShieldCheck size={16} />
                       </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                    {!isUnlocked && <p className="text-[10px] text-slate-500 font-bold">{badge.xp} XP للمهمة</p>}
                  </div>
               </div>
             );
          })}
        </div>
      </section>

      {/* Leaderboard sample */}
      <section className="bg-slate-900 rounded-[40px] p-8 text-white">
         <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Award className="text-amber-400" />
            أوائل الدفعة
         </h3>
         <div className="space-y-4">
            {[
              { name: 'أحمد علي', score: 2450, avatar: '👤', rank: 1 },
              { name: 'سارة خالد', score: 2120, avatar: '👤', rank: 2 },
              { name: 'محمد حسن', score: 1890, avatar: '👤', rank: 3 },
            ].map((p, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${i === 0 ? 'bg-white/10' : ''}`}>
                 <div className="flex items-center gap-4">
                    <span className={`w-6 text-center font-bold ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`}>{p.rank}</span>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">{p.avatar}</div>
                    <span className="font-bold">{p.name} {p.name === user?.displayName ? '(أنت)' : ''}</span>
                 </div>
                 <span className="font-mono text-sm opacity-70 underline underline-offset-4">{p.score} XP</span>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
