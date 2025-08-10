import { createContext, ReactNode, useContext } from "react";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  error: Error | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}