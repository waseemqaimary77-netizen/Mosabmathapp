/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously, updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  loading: boolean;
  quickLogin: (displayName: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'mosaab_guest_user';

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
          xp: 25,
          level: 1,
          badges: ['طالب جديد مع مصعب 🎓'],
          solvedCount: 0,
          quizScores: {},
          lastDailyChallenge: null,
          streak: 1,
        };
        try {
          await setDoc(docRef, initialProgress);
        } catch (e) {
          console.warn("Could not save to firestore:", e);
        }
        setProgress(initialProgress);
      }
    } catch (error) {
      console.warn("Error fetching progress from db:", error);
      // Fallback local progress
      setProgress(prev => prev || {
        uid,
        xp: 25,
        level: 1,
        badges: ['طالب جديد مع مصعب 🎓'],
        solvedCount: 0,
        quizScores: {},
        lastDailyChallenge: null,
        streak: 1,
      });
    }
  };

  useEffect(() => {
    // Check local guest first if saved
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchProgress(firebaseUser.uid);
      } else if (savedGuest) {
        try {
          const parsed = JSON.parse(savedGuest);
          setUser(parsed as unknown as User);
          await fetchProgress(parsed.uid);
        } catch (e) {
          setUser(null);
          setProgress(null);
        }
      } else {
        setUser(null);
        setProgress(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const quickLogin = async (displayName: string) => {
    setLoading(true);
    try {
      // Try anonymous firebase auth
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, { displayName });
      setUser(cred.user);
      await fetchProgress(cred.user.uid);
    } catch (err) {
      console.warn("Firebase anon login failed, using fast guest mode:", err);
      const mockUid = 'guest_' + Math.random().toString(36).substring(2, 9);
      const guestObj = {
        uid: mockUid,
        displayName: displayName || 'وسيم البطل',
        email: `${mockUid}@mosaab.math`,
        isAnonymous: true,
        photoURL: null,
      };
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestObj));
      setUser(guestObj as unknown as User);
      await fetchProgress(mockUid);
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = async () => {
    if (user) await fetchProgress(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, progress, loading, quickLogin, refreshProgress }}>
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
