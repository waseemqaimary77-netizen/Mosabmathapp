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
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mascot from '../components/Mascot';
import { MATH_QUOTES } from '../constants';

const QUICK_ACTIONS = [
  { label: 'حل سؤال', path: '/solve', icon: HelpCircle, color: 'bg-blue-500', desc: 'صور أو اكتب سؤالك' },
  { label: 'اختبار سريع', path: '/quiz', icon: BrainCircuit, color: 'bg-purple-500', desc: 'تحدى نفسك الآن' },
  { label: 'آلة حاسبة', path: '/calculator', icon: Calculator, color: 'bg-amber-500', desc: 'ذكية ومتطورة' },
  { label: 'جدول الدراسة', path: '/schedule', icon: CalendarIcon, color: 'bg-emerald-500', desc: 'نظم وقتك بذكاء' },
];

export default function Home() {
  const { user, progress } = useAuth();
  const quote = MATH_QUOTES[new Date().getDay() % MATH_QUOTES.length];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-3xl math-gradient p-8 text-white shadow-xl">
        <div className="relative z-10 md:w-2/3">
          <motion.h2 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-black mb-4 leading-tight"
          >
            مرحباً بك في تطبيق <br />
            الأستاذ مصعب الذكي 👋
          </motion.h2>
          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
            أنا هنا لأجعل الرياضيات أسهل وأمتع بالنسبة لك. لنبدأ رحلة التفوق معاً!
          </p>
          <div className="flex gap-4">
            <Link 
              to="/solve" 
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              ابدأ حل المسائل
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-72 h-72 opacity-20 md:opacity-100 md:left-12">
          <Mascot />
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المستوى', value: progress?.level || 1, icon: Star, color: 'text-amber-500' },
          { label: 'نقاط XP', value: progress?.xp || 0, icon: Zap, color: 'text-purple-500' },
          { label: 'مسائل محلولة', value: progress?.solvedCount || 0, icon: HelpCircle, color: 'text-blue-500' },
          { label: 'أعلى سلسلة', value: progress?.streak || 0, icon: TrendingUp, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={stat.color}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quote of the day */}
      <section className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2 text-amber-600">
          <Star size={20} fill="currentColor" />
          <h3 className="font-bold">حكمة اليوم الرياضية</h3>
        </div>
        <p className="text-lg text-slate-700 italic font-medium">"{quote}"</p>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          أدوات سريعة
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link 
              key={i} 
              to={action.path}
              className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">{action.label}</h4>
              <p className="text-slate-500 text-sm mb-4">{action.desc}</p>
              <div className="flex items-center text-primary text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                ادخل الآن <ChevronLeft size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Tasks / Lessons placeholder */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-2">أحدث الدروس</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600">
                  {i}
                </div>
                <div>
                  <h5 className="font-bold">المعادلات من الدرجة الثانية</h5>
                  <p className="text-xs text-slate-500">الجبر - متقدم</p>
                </div>
              </div>
              <ChevronLeft className="text-slate-300" />
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
           <h3 className="font-bold mb-4">تحدي اليوم</h3>
           <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center space-y-3">
              <p className="text-sm font-medium text-blue-800">ما هي مساحة مثلث طول قاعدته 10 سم وارتفاعه 5 سم؟</p>
              <Link to="/solve" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold w-full">إرسال الحل (+20 XP)</Link>
           </div>
        </div>
      </section>
    </div>
  );
}
