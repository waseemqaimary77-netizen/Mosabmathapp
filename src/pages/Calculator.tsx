/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete, History, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { evaluate } from 'mathjs';

interface SpecialVal {
  exact: string;
  approx: string;
  arabicName: string;
}

const COMMON_TRIG_MAP: Record<string, SpecialVal> = {
  'sin(30)': { exact: '1/2', approx: '0.5', arabicName: 'جيب الـ 30°' },
  'sin(45)': { exact: '√2 / 2', approx: '0.7071', arabicName: 'جيب الـ 45°' },
  'sin(60)': { exact: '√3 / 2', approx: '0.8660', arabicName: 'جيب الـ 60°' },
  'sin(90)': { exact: '1', approx: '1', arabicName: 'جيب الـ 90°' },
  'sin(0)': { exact: '0', approx: '0', arabicName: 'جيب الـ 0°' },

  'cos(30)': { exact: '√3 / 2', approx: '0.8660', arabicName: 'جيب تمام الـ 30°' },
  'cos(45)': { exact: '√2 / 2', approx: '0.7071', arabicName: 'جيب تمام الـ 45°' },
  'cos(60)': { exact: '1/2', approx: '0.5', arabicName: 'جيب تمام الـ 60°' },
  'cos(90)': { exact: '0', approx: '0', arabicName: 'جيب تمام الـ 90°' },
  'cos(0)': { exact: '1', approx: '1', arabicName: 'جيب تمام الـ 0°' },

  'tan(30)': { exact: '1 / √3 (أو √3 / 3)', approx: '0.5773', arabicName: 'ظل الـ 30°' },
  'tan(45)': { exact: '1', approx: '1', arabicName: 'ظل الـ 45°' },
  'tan(60)': { exact: '√3', approx: '1.7320', arabicName: 'ظل الـ 60°' },

  'sqrt(2)': { exact: '√2', approx: '1.4142', arabicName: 'جذر 2' },
  'sqrt(3)': { exact: '√3', approx: '1.7320', arabicName: 'جذر 3' },
  'sqrt(4)': { exact: '2', approx: '2', arabicName: 'جذر 4' },
  'sqrt(9)': { exact: '3', approx: '3', arabicName: 'جذر 9' },
  'sqrt(16)': { exact: '4', approx: '4', arabicName: 'جذر 16' },
  'sqrt(25)': { exact: '5', approx: '5', arabicName: 'جذر 25' },
};

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [exactValue, setExactValue] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [history, setHistory] = useState<Array<{ expr: string; res: string; exact?: string }>>([]);

  const cleanExpressionForMathJs = (expr: string) => {
    let formatted = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√\(/g, 'sqrt(')
      .replace(/√(\d+)/g, 'sqrt($1)');

    if (angleMode === 'DEG') {
      // transform sin(30) -> sin(30 deg), cos(60) -> cos(60 deg), tan(45) -> tan(45 deg)
      formatted = formatted.replace(/(sin|cos|tan)\(([^)]+)\)/g, '$1(($2) deg)');
    }

    return formatted;
  };

  const calculateResult = () => {
    if (!display.trim()) return;

    // Check special values table first (e.g. sin(30), cos(30), tan(45))
    const normalized = display.replace(/\s+/g, '').toLowerCase();
    const special = COMMON_TRIG_MAP[normalized];

    try {
      const parsedExpr = cleanExpressionForMathJs(display);
      const rawRes = evaluate(parsedExpr);
      const numRes = typeof rawRes === 'number' ? rawRes : Number(rawRes);
      
      let formattedRes = '';
      if (Number.isInteger(numRes)) {
        formattedRes = numRes.toString();
      } else {
        // Fix float precision issues like 0.49999999999999994 -> 0.5
        formattedRes = Number(numRes.toFixed(6)).toString();
      }

      const exact = special ? special.exact : null;
      setResult(formattedRes);
      setExactValue(exact);

      setHistory(prev => [
        { expr: display, res: formattedRes, exact: exact || undefined },
        ...prev.slice(0, 7)
      ]);
    } catch (e) {
      setResult('خطأ في الصياغة');
      setExactValue(null);
    }
  };

  const handleInput = (val: string) => {
    setDisplay(prev => prev + val);
  };

  const handleClear = () => {
    setDisplay('');
    setResult(null);
    setExactValue(null);
  };

  const handleDelete = () => {
    setDisplay(prev => prev.slice(0, -1));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800">الآلة الحاسبة العلمية والمثلثية</h2>
          <p className="text-slate-500 font-medium">حساب القيم الدقيقة (مثل جيب 30° = 1/2 أو جتا 30° = √3/2) والعمليات الجبرية</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setAngleMode('DEG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              angleMode === 'DEG' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            درجات DEG (30°)
          </button>
          <button
            onClick={() => setAngleMode('RAD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              angleMode === 'RAD' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            راديان RAD (π)
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Calculator */}
        <section className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 flex flex-col gap-5">
          {/* Screen */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 min-h-[160px] flex flex-col justify-between border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="px-2 py-1 bg-slate-800 rounded-md text-blue-400 font-bold">{angleMode} MODE</span>
              <span className="truncate max-w-[200px]" dir="ltr">{display || '0'}</span>
            </div>

            <div className="text-right space-y-1">
              {exactValue && (
                <div className="text-amber-400 text-lg font-bold flex items-center justify-end gap-2" dir="ltr">
                  <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-sans">القيمة الدقيقة</span>
                  <span className="text-2xl font-mono">{exactValue}</span>
                </div>
              )}
              <div className="text-white text-4xl sm:text-5xl font-black font-mono truncate" dir="ltr">
                {result !== null ? `= ${result}` : display || '0'}
              </div>
            </div>
          </div>

          {/* Quick Trig & Special Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>دوال مثلثية وعلمية (اضغط للتعويض السريع):</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'جا sin', val: 'sin(' },
                { label: 'جتا cos', val: 'cos(' },
                { label: 'ظا tan', val: 'tan(' },
                { label: 'جذر √', val: 'sqrt(' },
                { label: 'أس ^', val: '^' },
                { label: 'جا 30°', val: 'sin(30)' },
                { label: 'جتا 30°', val: 'cos(30)' },
                { label: 'جتا 60°', val: 'cos(60)' },
                { label: 'ظا 45°', val: 'tan(45)' },
                { label: 'باي π', val: 'π' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleInput(item.val)}
                  className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center text-center shadow-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={handleClear}
              className="h-14 bg-red-50 text-red-600 rounded-2xl font-bold text-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw size={18} /> C
            </button>
            <button onClick={() => handleInput('(')} className="h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xl">(</button>
            <button onClick={() => handleInput(')')} className="h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xl">)</button>
            <button onClick={() => handleInput('÷')} className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-2xl">÷</button>

            {['7', '8', '9'].map(n => (
              <button key={n} onClick={() => handleInput(n)} className="h-14 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-2xl transition-all">
                {n}
              </button>
            ))}
            <button onClick={() => handleInput('×')} className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-2xl">×</button>

            {['4', '5', '6'].map(n => (
              <button key={n} onClick={() => handleInput(n)} className="h-14 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-2xl transition-all">
                {n}
              </button>
            ))}
            <button onClick={() => handleInput('-')} className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-2xl">-</button>

            {['1', '2', '3'].map(n => (
              <button key={n} onClick={() => handleInput(n)} className="h-14 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-2xl transition-all">
                {n}
              </button>
            ))}
            <button onClick={() => handleInput('+')} className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-2xl">+</button>

            <button onClick={() => handleInput('0')} className="h-14 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-2xl">
              0
            </button>
            <button onClick={() => handleInput('.')} className="h-14 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60 rounded-2xl font-bold text-2xl">
              .
            </button>
            <button onClick={handleDelete} className="h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center">
              <Delete size={22} />
            </button>
            <button
              onClick={calculateResult}
              className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-3xl transition-all shadow-lg shadow-emerald-200"
            >
              =
            </button>
          </div>
        </section>

        {/* History & Key Values Sheet */}
        <section className="space-y-6">
          {/* Common Trig Angles Quick Reference */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <BookOpen size={20} />
              <h3>جدول الزوايا الشهيرة</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">جا 30° (sin 30°)</span>
                <span className="font-mono font-bold text-blue-700">1/2 = 0.5</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">جتا 30° (cos 30°)</span>
                <span className="font-mono font-bold text-blue-700">√3 / 2 ≈ 0.866</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">جا 45° (sin 45°)</span>
                <span className="font-mono font-bold text-blue-700">√2 / 2 ≈ 0.707</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">ظا 45° (tan 45°)</span>
                <span className="font-mono font-bold text-blue-700">1</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">جتا 60° (cos 60°)</span>
                <span className="font-mono font-bold text-blue-700">1/2 = 0.5</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-blue-50/60 rounded-xl">
                <span className="font-bold text-slate-700">جا 60° (sin 60°)</span>
                <span className="font-mono font-bold text-blue-700">√3 / 2 ≈ 0.866</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <History size={18} className="text-slate-500" />
                <h3>سجل العمليات</h3>
              </div>
              {history.length > 0 && (
                <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:underline">
                  مسح
                </button>
              )}
            </div>

            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => { setDisplay(h.expr); setResult(h.res); }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 cursor-pointer transition-colors text-right space-y-1"
                >
                  <p className="text-xs text-slate-500 font-mono" dir="ltr">{h.expr}</p>
                  <p className="text-sm font-bold text-slate-900 font-mono" dir="ltr">
                    = {h.res} {h.exact ? `(${h.exact})` : ''}
                  </p>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs">لا توجد عمليات سابقة بعد</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
