import React, { useEffect, useState } from 'react';

const ThemeManager = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // You can add a function to toggle the theme
  // const toggleTheme = () => {
  //   setTheme(theme === 'light' ? 'dark' : 'light');
  // };

  return <>{children}</>;
};

export default ThemeManager;
