/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Filter, ClipboardList, Grid } from 'lucide-react';
import { motion } from 'motion/react';
import { FORMULAS_DATA } from '../constants';

export default function FormulaSheet() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');

  const categories = ['الكل', ...new Set(FORMULAS_DATA.map(f => f.category))];
  
  const filteredFormulas = FORMULAS_DATA.filter(f => {
    const matchesSearch = f.title.includes(search) || f.formula.includes(search);
    const matchesCategory = category === 'الكل' || f.category === category;
    return matchesSearch && matchesCategory;
  });

  const geometryLaws = FORMULAS_DATA.filter(f => f.category === 'الهندسة');

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2">مكتبة القوانين</h2>
          <p className="text-slate-500 text-lg">مرجعك الدائم لكل القوانين الرياضية الهامة</p>
        </div>
        <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
           {geometryLaws.slice(0, 3).map((l, i) => (
             <div key={i} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm">
                {l.title[0]}
             </div>
           ))}
        </div>
      </header>

      {/* Featured Section for Geometry */}
      <section id="geometry-section">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black">قوانين الهندسة (المساحات والمحيطات)</h3>
            <p className="text-slate-500 text-sm">كل ما تحتاجه لحساب الأشكال الهندسية</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {geometryLaws.map(f => (
            <motion.div 
              key={f.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all border-b-4 border-b-amber-400 group"
            >
              <h4 className="font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">{f.title}</h4>
              <div className="bg-slate-50 p-4 rounded-xl mb-3 text-center">
                <p className="text-xl font-black text-slate-900" dir="ltr">{f.formula}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{f.explanation}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-px bg-slate-100 my-12" />

      {/* Controls */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="بحث عن قانون أو موضوع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-primary shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(c => (
             <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-6 py-2 rounded-xl border-2 whitespace-nowrap font-bold transition-all ${
                category === c ? 'bg-primary border-primary text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-500'
              }`}
             >
               {c}
             </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredFormulas.map((f) => (
          <div key={f.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">{f.category}</span>
                   <h4 className="text-xl font-bold">{f.title}</h4>
                </div>
                <BookOpen className="text-slate-200 group-hover:text-primary transition-colors" />
             </div>
             
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-center">
                <code className="text-2xl font-bold text-slate-800 font-mono tracking-tight">{f.formula}</code>
             </div>

             <div className="flex gap-3 items-start">
                <div className="mt-1"><ClipboardList size={16} className="text-slate-400" /></div>
                <p className="text-slate-500 text-sm leading-relaxed">{f.explanation}</p>
             </div>
          </div>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
         <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <Filter size={40} />
            </div>
            <p className="text-slate-500 font-bold">لم نجد أي نتائج لبحثك..</p>
         </div>
      )}
    </div>
  );
}
