/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle, Zap, Sparkles, UserCheck } from 'lucide-react';

const QUICK_PROFILES = [
  { name: 'وسيم - الطالب الشاطر الجدع 🌟', role: 'طالب متفوق', avatar: '👨‍🎓', quote: 'جاهز أرفع راس الأستاذ مصعب' },
  { name: 'طالب توجيهي قدها 💪', role: 'جاهز للامتحانات', avatar: '🦁', quote: 'بدنا الـ 100 بالرياضيات' },
  { name: 'أكرم التائب من الهبد 😅', role: 'تحت التدريب', avatar: '🦥', quote: 'توبت من الهبد يا أستاذ!' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'email'>('quick');
  const navigate = useNavigate();
  const { quickLogin } = useAuth();

  const handleQuickLogin = async (selectedName: string) => {
    setLoading(true);
    setError('');
    try {
      await quickLogin(selectedName);
      navigate('/');
    } catch (err: any) {
      setError('صار خلل بالدخول السريع، جرب مرة تانية يا وحش!');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError('فشل تسجيل الدخول. تأكد من البريد وكلمة المرور يا زلمة.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('فشل تسجيل الدخول باستخدام Google.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl w-full max-w-lg border border-slate-100"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 math-gradient rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-3 shadow-lg shadow-blue-500/20">
            م
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">أهلاً بك عند الأستاذ مصعب! 👋</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            "سجل دخولك يا بطل وخليك جدع زي وسيم.. بلاش تطلع زي أكرم وتجيب العيد! 😂"
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-6 flex items-center gap-2 text-sm font-medium border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'quick'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            تسجيل دخول سريع (بنقرة واحدة)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail size={16} />
            بريد وكلمة مرور
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400">اختر شخصيتك وادخل فوراً بدون تعقيد:</p>
            
            <div className="grid gap-2.5">
              {QUICK_PROFILES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(p.name)}
                  disabled={loading}
                  className="p-3.5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-right flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-slate-100 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      {p.avatar}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{p.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">"{p.quote}"</p>
                    </div>
                  </div>
                  <UserCheck size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>

            {/* Or custom nickname */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-600 block mb-2">أو ادخل باسمك الخاص مباشرة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب اسمك يا بطل..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm text-right font-medium"
                />
                <button
                  type="button"
                  disabled={loading || !customName.trim()}
                  onClick={() => handleQuickLogin(customName.trim())}
                  className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200 flex items-center gap-1"
                >
                  <Sparkles size={16} /> دخول
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-right text-sm font-medium"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block mr-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-right text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'جاري الدخول يا بطل...' : 'تسجيل الدخول بالبريد'}
              {!loading && <LogIn size={18} />}
            </button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs text-slate-400 font-bold">
            <span className="px-3 bg-white">أو عبر حساب Google</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm text-slate-700"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          الدخول السريع بحساب Google
        </button>

        <p className="text-center mt-6 text-slate-600 text-xs font-medium">
          بدك تسجل حساب دائم جديد؟{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">انضم لطلاب الأستاذ مصعب الآن</Link>
        </p>
      </motion.div>
    </div>
  );
}
