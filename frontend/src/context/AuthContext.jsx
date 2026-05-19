import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // درنا بجوج باش نرضيو الديزاين الجديد والقديم وميكراشيش الكود
  const [isLoading, setIsLoading] = useState(true); 

  // تـحقق من الـ Token والـ User ملي يشعل السيت
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // 🔑 دالة الـ Login الحقيقية مع Django
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      // صيفطنا الـ username والـ password لـ api.js
      const data = await loginRequest(username, password);
      
      // Django JWT غالباً كيرجع الـ User ف الـ response، نـحطوه ف الـ State
      const userData = data.user || { username, role: data.role || 'client' }; 
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // الـ Token ديجا كيتسجل وسط دالة loginRequest ف الـ api.js
      
      return userData;
    } catch (error) {
      console.error('Erreur de connexion Django:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 دالة الـ Register الحقيقية متناسقة مع UserSerializer
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // userData غاتكون فيها (username, email, password, first_name, last_name, role)
      const data = await registerRequest(userData);
      return data;
    } catch (error) {
      console.error('Erreur d\'inscription Django:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 دالة الـ Logout د النقاية
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null,
    isLoading: isLoading, // للـ AI
    loading: isLoading   // للقديم
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};