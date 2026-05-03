/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Mascot({ 
  className, 
  emotion = 'happy' 
}: { 
  className?: string; 
  emotion?: 'happy' | 'thinking' | 'surprised' | 'proud' 
}) {
  return (
    <motion.div 
      className={cn("relative", className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
        <img 
          src="/input_file_0.png" 
          alt="الأستاذ مصعب" 
          className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl shadow-blue-500/40 aspect-square"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback if the image doesn't load
            e.currentTarget.src = "https://ui-avatars.com/api/?name=Musab&background=2563eb&color=fff";
          }}
        />
        {emotion === 'thinking' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg border border-slate-100"
          >
            <span className="text-2xl">🤔</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
