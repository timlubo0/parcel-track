import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from './src/store/store';
import StackNavigator from './src/navigation/StackNavigator';
import appTheme from './src/theme/appTheme';
import { RootSiblingParent } from 'react-native-root-siblings';
import "./i18n.config";
 
function App(){
  return (
    <PaperProvider theme={appTheme()}>
      <ReduxProvider store={Store}>
        <NavigationContainer theme={appTheme()}>
          <RootSiblingParent>
            <StackNavigator/>
          </RootSiblingParent>
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
}
export default App;