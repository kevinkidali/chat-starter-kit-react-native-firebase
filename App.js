import React from 'react';
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AuthNavigation from "./navigation/nav";
import { View } from 'react-native';
import AppNavigation from './navigation/app';
import OfflineNotice from './screens/OfflineNotice';

const SwitchNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigation,
    App: AppNavigation
  },
  {
    initialRouteName: "Auth"
  }
);

const SwitchContainer = createAppContainer(SwitchNavigator);

export default class App extends React.Component {
  render() {
    return <View style={{ height: "100%" }}><SwitchContainer /><OfflineNotice /></View>

  }
}
