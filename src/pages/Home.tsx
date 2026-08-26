/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  HelpCircle, 
  BrainCircuit, 
  Calendar as CalendarIcon,
  ChevronLeft,
  Star,
  Zap,
  TrendingUp,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mascot from '../components/Mascot';
import { MATH_QUOTES } from '../constants';

const QUICK_ACTIONS = [
  { label: 'حل المسائل الذكي', path: '/solve', icon: HelpCircle, color: 'bg-blue-600', desc: 'صور أو اكتب مسألتك وخلي مصعب يحلها' },
  { label: 'تحدي واختبارات', path: '/quiz', icon: BrainCircuit, color: 'bg-purple-600', desc: 'أسئلة نهفة وفشافشة مع تصحيح فوري' },
  { label: 'الآلة الحاسبة المثلثية', path: '/calculator', icon: Calculator, color: 'bg-amber-600', desc: 'قيم دقيقة للزوايا وجيب وجتا وظا' },
  { label: 'جدول دراسة التوجيهي', path: '/schedule', icon: CalendarIcon, color: 'bg-emerald-600', desc: 'نظم جدولك بدون تسويف وهبد' },
];

export default function Home() {
  const { user, progress } = useAuth();
  const quote = MATH_QUOTES[new Date().getDay() % MATH_QUOTES.length];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Hero Welcome with Professor Mosaab Identity */}
      <section className="relative overflow-hidden rounded-[32px] math-gradient p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 md:w-2/3 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
            <Sparkles size={14} className="text-amber-300" /> أكاديمية الأستاذ مصعب فشافشة للرياضيات
          </div>

          <motion.h2 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl sm:text-5xl font-black leading-tight"
          >
            يا هلا {user?.displayName ? `بالبطل ${user.displayName}` : 'بطلابنا الجدعان'}! 👋
          </motion.h2>
          
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-medium">
            هون بتتعلم الرياضيات صح.. بدون لف ودوران وبدون هبد زي أكرم! حل مسائل، آلة حاسبة دقيقة، واختبارات فكاهية ترفع راسك!
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              to="/solve" 
              className="px-6 py-3.5 bg-white text-blue-700 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
            >
              ابدأ حل مسألة مع الأستاذ ✍️
            </Link>
            <Link 
              to="/quiz" 
              className="px-6 py-3.5 bg-blue-800/60 border border-white/30 text-white rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all"
            >
              تحدي الكويز السريع ⚡
            </Link>
          </div>
        </div>
        
        <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-64 h-64 opacity-25 md:opacity-100 md:left-8 pointer-events-none">
          <Mascot emotion="happy" />
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المستوى الحالي', value: progress?.level || 1, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'نقاط XP الفخر', value: progress?.xp || 25, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'مسائل تم حلها', value: progress?.solvedCount || 0, icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'سلسلة الالتزام', value: `${progress?.streak || 1} يوم 🔥`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-400 font-bold">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quote of the day from Professor Mosaab */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-sm">
          <Star size={18} fill="currentColor" />
          <span>حكمة ونهفة اليوم من الأستاذ مصعب:</span>
        </div>
        <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed">
          "{quote}"
        </p>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            أقسام وتحديات الأستاذ مصعب
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link 
              key={i} 
              to={action.path}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <action.icon size={24} />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">{action.label}</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">{action.desc}</p>
              </div>
              <div className="flex items-center text-primary text-xs font-bold gap-1 group-hover:translate-x-[-4px] transition-transform">
                افتح القسم <ChevronLeft size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Funny Daily Challenge Card */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              قوانين ذهبية لازم تكون حافظها صم
            </h3>
            <Link to="/formulas" className="text-xs text-primary font-bold hover:underline">عرض الكل</Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-blue-700 mb-1">الفرق بين مربعين</p>
              <p className="text-sm font-mono font-bold text-slate-800" dir="ltr">س² - ص² = (س - ص)(س + ص)</p>
              <p className="text-[11px] text-slate-400 mt-1">بتحللك نص مسائل التوجيهي!</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-blue-700 mb-1">متطابقة فيثاغورس المثلثية</p>
              <p className="text-sm font-mono font-bold text-slate-800" dir="ltr">جا²(س) + جتا²(س) = 1</p>
              <p className="text-[11px] text-slate-400 mt-1">ثابتة زي الجبل ما بتتغير!</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
              <Award size={16} /> تحدي وسيم السريع
            </div>
            <h4 className="font-black text-lg">سؤال للي بفهموا بس! 🎯</h4>
            <p className="text-blue-200 text-xs mt-2 leading-relaxed">
              إذا كان جيب زاوية حادة جا(س) = 0.5، فما هي قيمة الزاوية س بالدرجات؟
            </p>
          </div>

          <div className="space-y-2">
            <Link 
              to="/calculator" 
              className="block text-center py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-xs transition-colors shadow"
            >
              افتح الحاسبة وتأكد (30°)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
