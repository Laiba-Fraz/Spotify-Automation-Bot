import React, { useState, useEffect } from "react";

const Theme = React.createContext({
  theme: false,
  toggleTheme: () => {},
});

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    // const storedTheme = localStorage.getItem("theme");
    // const initialTheme = storedTheme ? storedTheme === "dark" : false;
    const initialTheme = true;
    // setTheme(initialTheme);
    document.body.setAttribute("data-theme", initialTheme ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.body.setAttribute("data-theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <Theme.Provider
      value={{
        theme: theme,
        toggleTheme: toggleTheme,
      }}
    >
      {props.children}
    </Theme.Provider>
  );
};

export default Theme;
