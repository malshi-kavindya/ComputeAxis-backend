import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import type { User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: { name: string; email: string; company: string; role: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSavedProfile(uid: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(`computeaxis_profile_${uid}`) || '{}');
  } catch {
    return {};
  }
}

function saveProfile(uid: string, profile: Record<string, string>) {
  localStorage.setItem(`computeaxis_profile_${uid}`, JSON.stringify(profile));
}

function mapFirebaseUser(fbUser: FirebaseUser): User {
  const saved = getSavedProfile(fbUser.uid);
  const fallbackName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
  return {
    id: fbUser.uid,
    name: saved.name || fallbackName,
    email: fbUser.email || '',
    role: saved.role || 'Infrastructure Operator',
    company: saved.company || 'ComputeAxis',
    avatar: fbUser.photoURL || undefined,
    createdAt: saved.createdAt || fbUser.metadata?.creationTime || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? mapFirebaseUser(fbUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const register = async (data: { name: string; email: string; company: string; role: string; password: string }) => {
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    if (data.name && credential.user) {
      await updateProfile(credential.user, { displayName: data.name });
      saveProfile(credential.user.uid, {
        name: data.name,
        company: data.company,
        role: data.role,
        createdAt: credential.user.metadata?.creationTime || new Date().toISOString(),
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    saveProfile(user.id, {
      name: updated.name,
      company: updated.company,
      role: updated.role,
      createdAt: updated.createdAt,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}