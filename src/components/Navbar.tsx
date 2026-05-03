/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { signInWithGoogle, logout } from '../services/firebase';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 math-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
          م
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent math-gradient">
          أستاذ مصعب
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-left">
              <p className="text-sm font-semibold">{user.displayName}</p>
              <p className="text-xs text-slate-500">طالب متميز</p>
            </div>
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || ''} 
              className="w-9 h-9 rounded-full border-2 border-primary"
            />
            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
          >
            <LogIn size={18} />
            تسجيل الدخول
          </button>
        )}
      </div>
    </nav>
  );
}
