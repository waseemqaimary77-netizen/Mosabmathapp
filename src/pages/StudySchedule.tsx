/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function StudySchedule() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState(new Date().getDay());
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '10:00', category: 'مراجعة' });
  const [exam, setExam] = useState({ title: 'لم يحدد بعد', daysLeft: '0' });
  const [isEditingExam, setIsEditingExam] = useState(false);

  // Persistence to Firestore could be added here in a useEffect
  // For now, let's make the UI interactive

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: Date.now(),
      ...newTask,
      day: activeDay,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', time: '10:00', category: 'مراجعة' });
    setIsAdding(false);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const dayTasks = tasks.filter(t => t.day === activeDay);
  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">جدول الدراسة الخاص بي</h2>
          <p className="text-slate-500">هون يا بطل بتقدر تنظم وقتك وتضيف دراستك زي ما بدك</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 w-full md:w-auto">
           <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-2">
                 <span>إنجازك العام</span>
                 <span className="text-blue-600">{progress}%</span>
              </div>
              <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-500" 
                 />
              </div>
           </div>
           <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
           >
              <Plus size={18} />
              إضافة مهمة
           </button>
        </div>
      </header>

      {/* Modal for adding task */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <h3 className="text-xl font-bold">إضافة مهمة جديدة</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="شو بدك تدرس؟ (مثلاً: حل تمارين ص 50)"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
                <div className="flex gap-4">
                  <input 
                    type="time" 
                    className="flex-1 p-4 bg-slate-50 rounded-xl"
                    value={newTask.time}
                    onChange={e => setNewTask({...newTask, time: e.target.value})}
                  />
                  <select 
                    className="flex-1 p-4 bg-slate-50 rounded-xl"
                    value={newTask.category}
                    onChange={e => setNewTask({...newTask, category: e.target.value})}
                  >
                    <option>مراجعة</option>
                    <option>واجبات</option>
                    <option>اختبار</option>
                    <option>فيديو تعليمي</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={addTask}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold"
                >
                  حفظ المهمة
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Day Selector */}
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {DAYS.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`min-w-[100px] p-4 rounded-2xl border-2 transition-all text-center ${
              activeDay === i 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
            }`}
          >
             <p className="text-xs opacity-70 mb-1">{i === new Date().getDay() ? 'اليوم' : ''}</p>
             <p className="font-bold">{day}</p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
             مهام يوم {DAYS[activeDay]}
             <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{dayTasks.length} مهام</span>
          </h3>
          
          <AnimatePresence mode="popLayout">
            {dayTasks.length > 0 ? (
              dayTasks.map(task => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={`group bg-white p-5 rounded-2xl border transition-all flex items-center justify-between ${
                    task.completed ? 'border-green-100 bg-green-50/30' : 'border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
                    >
                      {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    <div>
                      <h4 className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Clock size={12} /> {task.time}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-blue-500 font-medium">{task.category}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
                    <CalendarIcon size={32} />
                 </div>
                 <h4 className="font-bold text-slate-600">لا توجد مهام حُفظت لهذا اليوم</h4>
                 <p className="text-slate-400 text-sm">أضف مهامك الدراسية عشان أذكرك فيها يا بطل!</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        <section className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold mb-4">أهدافي الدراسية</h3>
              <p className="text-sm text-slate-500 mb-4 italic">اكتب شو حابب تنجز هذا الأسبوع بالرياضيات</p>
              <textarea 
                className="w-full h-24 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none"
                placeholder="مثلاً: بدي أخلص وحدة التكامل ..."
              />
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs text-blue-400 font-bold mb-1">موعد الاختبار القادم</p>
                {isEditingExam ? (
                  <div className="space-y-2">
                    <input 
                      className="bg-white/10 w-full p-2 rounded text-sm outline-none" 
                      value={exam.title} 
                      onChange={e => setExam({...exam, title: e.target.value})}
                    />
                    <input 
                      type="number"
                      className="bg-white/10 w-full p-2 rounded text-sm outline-none" 
                      value={exam.daysLeft} 
                      onChange={e => setExam({...exam, daysLeft: e.target.value})}
                    />
                    <button onClick={() => setIsEditingExam(false)} className="text-xs bg-blue-600 px-3 py-1 rounded font-bold">تم</button>
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold mb-4">{exam.title}</h4>
                    <div className="flex justify-between items-center text-sm">
                       <span className="opacity-70">باقٍ لليوم</span>
                       <span className="px-3 py-1 bg-blue-600 rounded-md font-mono font-bold">{exam.daysLeft} أيام</span>
                    </div>
                    <button onClick={() => setIsEditingExam(true)} className="mt-4 text-[10px] opacity-40 hover:opacity-100">تعديل الموعد</button>
                  </>
                )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

