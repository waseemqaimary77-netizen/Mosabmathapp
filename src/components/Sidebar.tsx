/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BrainCog, 
  Calculator, 
  Calendar, 
  Award, 
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'الرئيسية', path: '/' },
  { icon: Search, label: 'حل المسائل', path: '/solve' },
  { icon: BrainCog, label: 'الاختبارات', path: '/quiz' },
  { icon: Calculator, label: 'الآلة الحاسبة', path: '/calculator' },
  { icon: Calendar, label: 'جدول الدراسة', path: '/schedule' },
  { icon: Award, label: 'الإنجازات', path: '/achievements' },
  { icon: BookOpen, label: 'القوانين', path: '/formulas' },
];

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 right-0 md:top-16 md:right-0 md:w-64 bg-white border-t md:border-t-0 md:border-l border-slate-200 z-40 md:h-[calc(100vh-64px)]">
      <nav className="flex md:flex-col h-full overflow-x-auto md:overflow-y-auto p-2 md:p-4 gap-1 no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col md:flex-row items-center gap-2 px-4 py-3 rounded-xl transition-all min-w-[80px] md:min-w-0",
              isActive 
                ? "bg-blue-50 text-blue-600 font-bold" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={22} />
            <span className="text-[10px] md:text-sm whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
