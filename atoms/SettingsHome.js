import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { View, StyleSheet, NativeModules, findNodeHandle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UIManager = NativeModules.UIManager;

class SettingsHome extends Component {
  onMenuPressed = () => {
    this.props.viewFunc();
  };

  constructor() {
    super();
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            marginLeft: 20,
            marginTop: 25
          }}
          onPress={() => this.onMenuPressed()}
        >
          <Icon name="logout" size={20} color="white" />
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

export default withNavigation(SettingsHome);
