import React, { createContext, useState, useEffect } from 'react';

const LogInfoContext = createContext();

const LogInfoProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Leer el valor de isLoggedIn desde localStorage
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false; // convierte el string a booleano
  });

  useEffect(() => {
    // Guarda el valor de isLoggedIn en localStorage cuando cambie
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);
  
  return (
    <LogInfoContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LogInfoContext.Provider>
  );
};

export { LogInfoContext, LogInfoProvider };
