import {getStoredItem} from '@utils/storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import {ColorSchemeName, useColorScheme} from 'react-native';
import {
  darkColors,
  lightColors,
  themeKey,
} from '@contexts/libs/theme/constants';
import {ThemeColorsType} from '@contexts/libs/theme/types';

type ThemeContextType = {
  colors: ThemeColorsType;
  defaultSchema: ColorSchemeName;
  changeTheme: () => void;
};

const ThemeContext = createContext({} as ThemeContextType);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const colorScheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState(colorScheme);
  const [colors, setColors] = useState<ThemeColorsType>(
    selectedTheme === 'dark' ? darkColors : lightColors,
  );

  const changeTheme = useCallback(() => {
    if (selectedTheme === 'dark') {
      setSelectedTheme('light');
      setColors(lightColors);
    } else {
      setSelectedTheme('dark');
      setColors(darkColors);
    }
  }, [selectedTheme]);

  const getThemeFromStorage = async () => {
    const theme = await getStoredItem(themeKey);
    if (theme) {
      setSelectedTheme(theme);
      setColors(theme === 'dark' ? darkColors : lightColors);
    }
  };

  useLayoutEffect(() => {
    getThemeFromStorage();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        defaultSchema: colorScheme,
        changeTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
