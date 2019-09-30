import React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { styles as registerStyles } from "../styles/styles";
import Loader from "../atoms/loader";
import firebase from 'react-native-firebase';

export default class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      emailAddress: "",
      password: ""
    };
  }

  _register = async () => {
    const { emailAddress, password } = this.state;
    this.setState({loading: !this.state.loading});

    if (emailAddress === "" || password === "") {
      this.setState({loading: !this.state.loading});
      ToastAndroid.show("All fields should be filled!", ToastAndroid.LONG);
    } else {
      try {
        const { user } = await firebase.auth().createUserWithEmailAndPassword(emailAddress, password);
   
        await firebase.database().ref('users/' + user._user.uid).set({
          username: user._user.displayName,
          email: user._user.email,
          profile_picture : user._user.photoURL,
          emailVerified: user._user.emailVerified
        });
        
        ToastAndroid.show("Account created successfully", ToastAndroid.LONG);   
        this.setState({
          loading: !this.state.loading,
          emailAddress: "",
          password: ""
        }, () => this.props.navigation.navigate("Login"));
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
        <View style={registerStyles.viewContainer}>
          <View style={registerStyles.header}>
            <Text style={registerStyles.headerSubText}>Create account</Text>
            <Text style={registerStyles.headerText}>REGISTER</Text>
            <View style={registerStyles.divider}></View>
          </View>
          <View style={registerStyles.inputCoverStyle}>
            <View style={registerStyles.inputInnerStyle}>
              <Text style={registerStyles.textLabels}>Email Address</Text>
              <TextInput
                returnKeyLabel={"next"}
                onChangeText={text => this.setState({ emailAddress: text })}
                placeholder="username@somewhere.com"
                placeholderTextColor="#e3e3e3"
                style={registerStyles.inputStyle}
              />
            </View>
            <View style={registerStyles.inputInnerStyle}>
              <Text style={registerStyles.textLabels}>Password</Text>
              <TextInput
                returnKeyLabel={"next"}
                onChangeText={text => this.setState({ password: text })}
                placeholder="***********"
                placeholderTextColor="#e3e3e3"
                style={registerStyles.inputStyle}
              />
            </View>
            <View style={registerStyles.inputInnerStyle}>
              <TouchableOpacity
                style={registerStyles.loginBtn}
                onPress={this._register}
              >
                <Text style={registerStyles.loginBtnText}>REGISTER</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 50
              }}
            >
              <View style={registerStyles.createAccountContainer}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text style={registerStyles.createAccount}>Access your account?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  }
}
