/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row pt-16">
        <Sidebar />
        <main className="flex-1 md:mr-64 mb-20 md:mb-0 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
