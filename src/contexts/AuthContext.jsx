
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

// Sample user data for demonstration
const SAMPLE_USERS = [
  { id: 1, email: 'user@example.com', password: 'password123', name: 'John Doe', role: 'user' },
  { id: 2, email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 3, email: 'rider@example.com', password: 'rider123', name: 'Rider One', role: 'rider' }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = SAMPLE_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userToSave = { ...foundUser };
      delete userToSave.password; // Don't store password in state or localStorage
      
      setUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userToSave.name}!`,
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid email or password",
    });
    return false;
  };

  const signUp = (name, email, password, role = 'user') => {
    // Check if user already exists
    if (SAMPLE_USERS.some((u) => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Email already in use",
      });
      return false;
    }

    // In a real app, this would send data to a backend
    const newUser = {
      id: SAMPLE_USERS.length + 1,
      email,
      name,
      role,
    };

    SAMPLE_USERS.push({ ...newUser, password }); // Only for demo
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully!",
    });
    return true;
  };

  const googleAuth = () => {
    // Simulate Google auth - in real app would use OAuth
    const googleUser = {
      id: 'google-123',
      name: 'Google User',
      email: 'google@example.com',
      role: 'user',
    };
    
    setUser(googleUser);
    localStorage.setItem('currentUser', JSON.stringify(googleUser));
    
    toast({
      title: "Google login successful",
      description: "You've been signed in with Google",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  const value = {
    user,
    loading,
    login,
    signUp,
    googleAuth,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isRider: user?.role === 'rider',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
