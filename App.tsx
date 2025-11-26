import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
