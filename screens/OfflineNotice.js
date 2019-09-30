import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
const { width } = Dimensions.get('window');

class OfflineNotice extends React.Component {
    constructor() {
        super();
        this.state = {
            connected: true
        };
    }

    componentDidMount = () => {
        NetInfo.addEventListener(state => {
            this.handleConnectivityChange(state.isConnected);
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
        });

        // Unsubscribe
        // unsubscribe();
    };

    handleConnectivityChange = isConnected => {
        this.setState({ connected: isConnected });
    };

  render() {
        return !this.state.connected ? (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>No Internet Connection</Text>
            </View>
        ) : null
    }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -30,
    width,
    position: 'absolute',
    top: 30
  },
  offlineText: { 
    color: '#fff'
  }
});
export default OfflineNotice;