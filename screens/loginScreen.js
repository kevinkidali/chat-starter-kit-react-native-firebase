import React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { styles as loginStyles } from "../styles/styles";
import Loader from "../atoms/loader";
import firebase from 'react-native-firebase';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      emailAddress: "",
      password: ""
    };
  }

  _login = async () => {
    const { emailAddress, password } = this.state;
    this.setState({loading: !this.state.loading});

    if (emailAddress === "" || password === "") {
      this.setState({loading: !this.state.loading});
      ToastAndroid.show("All fields should be filled!", ToastAndroid.LONG);
    } else {
      try {
        await firebase.auth().signInWithEmailAndPassword(emailAddress, password);       
        ToastAndroid.show("Login successful", ToastAndroid.LONG);   
        this.setState({
          loading: !this.state.loading,
          emailAddress: "",
          password: ""
        }, () => this.props.navigation.navigate("Dashboard"));
      } catch (error) {
        this.setState({loading: !this.state.loading});
        ToastAndroid.show(error.message, ToastAndroid.LONG); 
      }  
    }
  }

  render() {
    return (
      <React.Fragment>
        <Loader loading={this.state.loading} />
        <Icon name="wechat" style={loginStyles.logoStyle} size={80} color="#999"/>
        <View style={loginStyles.viewContainer}>
          <View style={loginStyles.header}>
            <Text style={loginStyles.headerSubText}>Welcome back</Text>
            <Text style={loginStyles.headerText}>LOGIN</Text>
            <View style={loginStyles.divider}></View>
          </View>
          <View style={loginStyles.inputCoverStyle}>
            <View style={loginStyles.inputInnerStyle}>
              <Text style={loginStyles.textLabels}>Email Address</Text>
              <TextInput
                returnKeyLabel={"next"}
                onChangeText={text => this.setState({ emailAddress: text })}
                placeholder="username@somewhere.com"
                placeholderTextColor="#e3e3e3"
                style={loginStyles.inputStyle}
              />
            </View>
            <View style={loginStyles.inputInnerStyle}>
              <Text style={loginStyles.textLabels}>Password</Text>
              <TextInput
                returnKeyLabel={"next"}
                onChangeText={text => this.setState({ password: text })}
                placeholder="***********"
                placeholderTextColor="#e3e3e3"
                style={loginStyles.inputStyle}
              />
            </View>
            <View style={loginStyles.inputInnerStyle}>
              <TouchableOpacity
                style={loginStyles.loginBtn}
                onPress={this._login}
              >
                <Text style={loginStyles.loginBtnText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                height: 140,
                marginTop: 50
              }}
            >
              <View style={loginStyles.createAccountContainer}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text style={loginStyles.createAccount}>Create account?</Text>
                </TouchableOpacity>
              </View>
              <View style={loginStyles.forgotPassContainer}>
                <TouchableOpacity>
                  <Text style={loginStyles.forgoPssText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  }
}