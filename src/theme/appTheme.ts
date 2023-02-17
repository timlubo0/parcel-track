import * as React from 'react';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { Appearance, ColorSchemeName } from 'react-native';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export const custom = {
  secondary: '#FFC422',
  blue: '#04299C',
  white: '#fff',
  descText: '#fff',
}

const appTheme = () => {
  const colorScheme: ColorSchemeName = Appearance.getColorScheme();
  const isDarkMode: boolean = colorScheme === 'dark' ? true : false;
  const [isThemeDark] = React.useState(isDarkMode);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  theme = {
    ...theme,
    roundness: 2,
    colors: {
      ...theme.colors,
      primary: '#04299C',
      accent: '#FFC422',
      ...custom
    },
  };

  return theme;
}

export default appTheme;