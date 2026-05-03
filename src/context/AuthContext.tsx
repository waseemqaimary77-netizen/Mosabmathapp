/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  loading: boolean;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProgress(docSnap.data() as UserProgress);
      } else {
        const initialProgress: UserProgress = {
          uid,
          xp: 0,
          level: 1,
          badges: [],
          solvedCount: 0,
          quizScores: {},
          lastDailyChallenge: null,
          streak: 0,
        };
        await setDoc(docRef, initialProgress);
        setProgress(initialProgress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchProgress(user.uid);
      } else {
        setProgress(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProgress = async () => {
    if (user) await fetchProgress(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, progress, loading, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
