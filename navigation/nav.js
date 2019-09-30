import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/loginScreen';
import RegisterScreen from '../screens/registerScreen';

const AuthNavigator = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },
  },
  {
    initialRouteName: "Login",
    headerMode: 'none'
  }
);

const AuthNavigation = createAppContainer(AuthNavigator);
export default AuthNavigation;