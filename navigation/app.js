import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import DashboardScreen from '../screens/dashboardScreen';

const AppNavigator = createStackNavigator(
  {
    Dashboard: { screen: DashboardScreen },
  },
  {
    initialRouteName: "Dashboard"
  }
);

const AppNavigation = createAppContainer(AppNavigator);
export default AppNavigation;