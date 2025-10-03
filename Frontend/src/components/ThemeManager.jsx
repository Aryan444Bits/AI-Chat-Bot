import React, { useEffect, useState } from 'react';

const ThemeManager = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeManager;
