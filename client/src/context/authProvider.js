import { createContext, useState, useEffect } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token") ;
    // const superadmin = localStorage.getItem("super-admin") ;
    return token ? { token } : {};
  });

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("token", true);
    //   localStorage.setItem("super-admin", auth.superadmin);
    } else {
      localStorage.removeItem("token");
    //   localStorage.removeItem("super-admin");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
