/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, signInWithGoogle } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, AlertCircle, Zap } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { quickLogin } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/');
    } catch (err: any) {
      setError('فشل إنشاء الحساب. تأكد من البيانات أو أن البريد غير مسجل مسبقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastGuest = async () => {
    if (!name.trim()) {
      setError('اكتب اسمك أولاً للدخول السريع يا بطل!');
      return;
    }
    setLoading(true);
    try {
      await quickLogin(name.trim());
      navigate('/');
    } catch (e) {
      setError('فشل الدخول السريع.');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">انضم لأفواج الأستاذ مصعب! 🎓</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            "سجل اسمك وخلينا نفرجيهم كيف الرياضيات بتنفهم صح بدون هبد!"
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-6 flex items-center gap-2 text-sm font-medium border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block mr-1">الاسم أو اللقب (مثلاً: وسيم البطل)</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-right text-sm font-medium"
                placeholder="اسمك الكريم يا وحش"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

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
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب كامل'}
            {!loading && <UserPlus size={18} />}
          </button>
        </form>

        {/* Quick entry alternative */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleFastGuest}
            disabled={loading}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap size={14} className="fill-amber-500 text-amber-500" />
            دخول فوري سريع بالاسم فقط (بدون كلمة مرور)
          </button>
        </div>

        <p className="text-center mt-6 text-slate-600 text-xs font-medium">
          عندك حساب مسجل؟{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">سجل دخولك من هون</Link>
        </p>
      </motion.div>
    </div>
  );
}
