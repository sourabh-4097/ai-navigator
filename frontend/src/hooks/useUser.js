import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('ai_navigator_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('ai_navigator_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('ai_navigator_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('ai_navigator_user');
    }
  };

  const getUserEmail = () => {
    return user?.email || 'demo@example.com'; // Fallback for demo
  };

  const value = {
    user,
    setUser: setUserData,
    getUserEmail,
    isLoggedIn: !!user,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};