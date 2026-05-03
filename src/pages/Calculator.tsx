/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete, RotateCcw, Equal, Grid, TrendingUp, History } from 'lucide-react';
import { evaluate } from 'mathjs';

const BUTTONS = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', 'DEL', '+'
];

const SCIENTIFIC = [
  { label: 'sin', val: 'sin(' },
  { label: 'cos', val: 'cos(' },
  { label: 'tan', val: 'tan(' },
  { label: '√', val: 'sqrt(' },
  { label: 'log', val: 'log10(' },
  { label: 'π', val: 'pi' },
  { label: '^', val: '^' },
  { label: '(', val: '(' },
  { label: ')', val: ')' },
  { label: 'exp', val: 'exp(' },
];

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleClick = (val: string) => {
    if (val === '=') {
      try {
        const res = evaluate(display);
        const formattedRes = String(Number(res).toLocaleString('ar-EG', { maximumFractionDigits: 4 }));
        setResult(formattedRes);
        setHistory(prev => [display + ' = ' + formattedRes, ...prev.slice(0, 4)]);
      } catch (e) {
        setResult('خطأ');
      }
    } else if (val === 'C') {
      setDisplay('');
      setResult(null);
    } else if (val === 'DEL') {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay(prev => prev + val);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black mb-1">الآلة الحاسبة العلمية</h2>
          <p className="text-slate-500 font-medium">أداة احترافية لحل كافة العمليات الرياضية</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">الوضع المتقدم</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Calculator Main Section */}
        <section className="lg:col-span-2 bg-white p-4 rounded-[32px] shadow-xl border border-slate-100 flex flex-col gap-4">
          {/* Screen */}
          <div className="bg-slate-50 rounded-2xl p-6 min-h-[140px] flex flex-col justify-end items-end gap-1 border border-slate-100">
             <div className="text-slate-400 text-lg font-mono tracking-wider truncate w-full text-right" dir="ltr">{display || '0'}</div>
             <div className="text-slate-900 text-5xl font-black font-mono truncate w-full text-right" dir="ltr">{result || '0'}</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {/* Scientific Buttons Row - Compact */}
            <div className="col-span-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {SCIENTIFIC.map(s => (
                 <button
                    key={s.label}
                    onClick={() => setDisplay(prev => prev + s.val)}
                    className="flex-shrink-0 h-10 px-4 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-all text-xs"
                 >
                    {s.label}
                 </button>
               ))}
            </div>

            {/* Combined Grid */}
            <button 
              onClick={() => { setDisplay(''); setResult(null); }}
              className="h-14 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center"
            >
              C
            </button>
            <button onClick={() => setDisplay(prev => prev + '(')} className="h-14 bg-slate-50 text-slate-600 rounded-xl font-bold">(</button>
            <button onClick={() => setDisplay(prev => prev + ')')} className="h-14 bg-slate-50 text-slate-600 rounded-xl font-bold">)</button>
            <button onClick={() => setDisplay(prev => prev + '/')} className="h-14 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">÷</button>

            {/* Standard Number Pad and Operations */}
            <div className="col-span-3 grid grid-cols-3 gap-3">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'DEL'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleClick(btn)}
                  className={`h-14 rounded-xl text-xl font-bold flex items-center justify-center transition-all ${
                    btn === 'DEL' ? 'bg-slate-100 text-slate-500' : 'bg-white border border-slate-100 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {btn === 'DEL' ? <Delete size={20} /> : btn}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => setDisplay(prev => prev + '*')} className="flex-1 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">×</button>
              <button onClick={() => setDisplay(prev => prev + '-')} className="flex-1 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">-</button>
              <button onClick={() => setDisplay(prev => prev + '+')} className="flex-1 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">+</button>
            </div>

            <button 
              onClick={() => handleClick('=')}
              className="col-span-4 h-16 bg-primary text-white rounded-2xl text-3xl font-black flex items-center justify-center transition-all hover:shadow-lg shadow-blue-200"
            >
               =
            </button>
          </div>
        </section>

        {/* Sidebar: History & Tips */}
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><History size={20} /></div>
                   <h3 className="font-bold">السجل الأخير</h3>
                </div>
                <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-red-500">مسح الكل</button>
             </div>
             
             <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                     <p className="text-sm font-mono text-slate-700" dir="ltr">{h}</p>
                  </div>
                ))}
                {history.length === 0 && (
                   <p className="text-center py-8 text-slate-400 text-sm">لا يوجد عمليات سابقة</p>
                )}
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Grid size={20} /></div>
                <h3 className="font-bold">رسم الدوال</h3>
             </div>
             <div className="h-40 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full opacity-20">
                   <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" />
                   <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="2" />
                   <path d="M0,80 Q50,0 100,80 T200,80" fill="none" stroke="#2563eb" strokeWidth="3" />
                </svg>
                <div className="absolute text-center px-4">
                   <p className="text-slate-500 text-sm font-bold">المخطط البياني</p>
                   <p className="text-slate-400 text-[10px]">قريباً: رسم الدوال بلمسة واحدة</p>
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
