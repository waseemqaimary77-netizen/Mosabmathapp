/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, User as UserIcon, Zap } from 'lucide-react';
import { logout } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, progress } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 math-gradient rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
          م
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black bg-clip-text text-transparent math-gradient">
            الأستاذ مصعب فشافشة
          </h1>
          <p className="text-[10px] text-slate-400 font-bold hidden sm:block">نهفة الرياضيات وتوجيهي فلسطين 😂</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200/60 text-xs font-bold text-amber-900">
              <Zap size={14} className="fill-amber-500 text-amber-500" />
              <span>{progress?.xp || 25} XP</span>
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800">{user.displayName || 'طالب الأستاذ مصعب'}</p>
              <p className="text-[10px] text-emerald-600 font-bold">بطل زي وسيم 🌟</p>
            </div>

            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || ''} 
                className="w-9 h-9 rounded-full border-2 border-primary object-cover shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center text-primary border border-blue-200 shadow-sm font-bold text-sm">
                {user.displayName ? user.displayName.slice(0, 1) : <UserIcon size={18} />}
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-xs sm:text-sm shadow-md shadow-blue-200"
          >
            <LogIn size={16} />
            تسجيل دخول سريع
          </Link>
        )}
      </div>
    </nav>
  );
}
