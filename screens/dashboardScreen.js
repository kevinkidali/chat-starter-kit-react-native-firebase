import React from "react";
import {
  StyleSheet,
  PermissionsAndroid,
  TextInput,
  Button,
  Dimensions,
  Image,
  ToastAndroid,
  TouchableOpacity,
  Text,
  View,
  ScrollView
} from "react-native";
import firebase from "react-native-firebase";
import { ListItem, Overlay, SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFetchBlob from "react-native-fetch-blob";
import Moment from "react-moment";
import "moment-timezone";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

{
  /* --------------------- NEW IMAGE IMPLEMENTATION---------------------------------- */
}
// import CameraRoll from "@react-native-community/cameraroll";

{
  /* ----------------- OLD IMPLEMENTATION ----------------------------- */
}
import CameraRollPicker from "react-native-camera-roll-picker";

const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  }
];

export default class DashboardScreen extends React.Component {
  static navigationOptions = ({ navigation, state }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Kidali~chat~box",
      headerStyle: {
        backgroundColor: "#2F55C0"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "normal",
        fontSize: 17
      },
      headerRight: (
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            marginLeft: 20,
            marginTop: 25
          }}
          onPress={async () => {
            await firebase.auth().signOut();
            navigation.navigate("Login");
          }}
        >
          <Icon name="logout" size={20} color="white" />
        </TouchableOpacity>
      )
    };
  };

  constructor() {
    super();
    this.state = {
      footerMenu: false,
      isVisible: false,
      chatVisible: false,
      photos: [],
      userId: null,
      username: "",
      btnStatus: "DONE",
      search: "",
      usersReplica: [],
      latestMessages: [],
      message: "",
      btnUpdate: "UPDATE",
      user: {},
      messages: [],
      users: [],
      selectedUser: {},
      selectedIndex: 0
    };
  }

  async componentDidMount() {
    const { uid } = firebase.auth().currentUser;

    this.setState({
      userId: uid
    });

    this.getUserInfo(uid);
    this.getUsers(uid);
    this.getLatestMessage(uid);
  }

  getUsers = (userId = "") => {
    const users = firebase.database().ref("users");

    users.on("value", snap => {
      const groupsObject = snap.val();

      if (groupsObject) {
        const users = Object.keys(groupsObject).map(key => ({
          ...groupsObject[key],
          uid: key
        }));

        const filteredUsers = users.filter(user => user.uid !== userId)

        this.setState({
          ...this.state,
          users: filteredUsers,
          usersReplica: filteredUsers
        });


      } else {
        this.setState({
          ...this.state,
          users: [],
          usersReplica: []
        });
      }
    });
  };
  // {/* --------------------- NEW IMAGE UPLOAD IMPLEMENTATION---------------------------------- */}
  // _handleButtonPress = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       {
  //         'title': 'Access Storage',
  //         'message': 'Access Storage for the pictures'
  //       }
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       CameraRoll.getPhotos({
  //         first: 20,
  //         assetType: 'Photos',
  //       })
  //         .then(r => {
  //           this.setState({ photos: r.edges });
  //           console.log(r.edges);
  //         })
  //         .catch((err) => {
  //           //Error Loading Images
  //           console.log('ERR', err);
  //         });
  //     } else {
  //       console.log("Storage permission denied");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  getSelectedImages = (selectedImages, currentImage) => {
    this.setState({
      btnStatus: "IN PROGRESS ..."
    });
    const image = currentImage.uri;

    var filename = image.substring(image.lastIndexOf("/") + 1);

    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    let uploadBlob = null;
    const imageRef = firebase
      .storage()
      .ref("gallery")
      .child(filename);
    let mime = "image/jpg";
    fs.readFile(image, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(image, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        this.updateUserProfile(url);
      })
      .catch(error => {
        ToastAndroid.show("Issue uploading image!", ToastAndroid.LONG);
      });
  };

  updateP = () => {
    const { username, user } = this.state;

    if (username !== "") {
      user.username = username;

      this.setState({
        btnUpdate: "IN PROGRESS .."
      });

      this.userUPdate(user);
    } else {
      ToastAndroid.show("Username cannot be empty", ToastAndroid.LONG);
    }
  };

  updateUserProfile = async (url = "") => {
    const { user } = this.state;
    user.profile_picture = url;
    this.userUPdate(user);
  };

  userUPdate = async user => {
    const { userId } = this.state;

    try {
      await firebase
        .database()
        .ref("users/" + userId)
        .update(user);
      ToastAndroid.show("Profile updated successfully ;)", ToastAndroid.LONG);
      this.getUserInfo(userId);
      this.setState({
        btnStatus: "DONE",
        btnUpdate: "UPDATE"
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      this.setState({
        btnStatus: "DONE",
        btnUpdate: "UPDATE"
      });
    }
  };

  getUserInfo = async uid => {
    const user = await firebase.database().ref("users/" + uid);
    user.on("value", snapshot => {
      this.setState({
        user: snapshot.val()
      });
    });
  };

  switchSection(index) {
    this.setState({
      selectedIndex: index
    });
  }

  handleChoosePhoto = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  manageChatBox = (user) => {
    this.setState({
      selectedUser: user,
      chatVisible: !this.state.chatVisible
    });

    this.getChatMessage(user.uid);
  };

  closeChatBox = () => {
    this.setState({
      chatVisible: !this.state.chatVisible
    });
  };

  updateSearch = search => {
    const { users, usersReplica } = this.state;

    let filtered;
    let searchString = search.trim().toLowerCase();

    if (searchString.length > 0) {
      filtered = users.filter(function (i) {
        return i.username.toLowerCase().match(searchString);
      });

      this.setState({ users: filtered, search });
    } else {
      this.setState({ users: usersReplica, search });
    }
  };

  getChatMessage = (receiverId) => {
    const { userId } = this.state;

    const thread = (userId < receiverId) ? userId + receiverId : receiverId + userId;

    const messages = firebase.database().ref("chat/" + thread);

    messages.on("value", snap => {
      const groupsObject = snap.val();

      if (groupsObject) {
        const msg = Object.keys(groupsObject).map(key => ({
          ...groupsObject[key],
          uid: key
        }));
        this.setState({
          ...this.state,
          messages: msg
        });
      } else {
        this.setState({
          ...this.state,
          messages: []
        });
      }
    });
  }

  getLatestMessage = (userId) => {
    const messages = firebase.database().ref("latest-messages/" + userId);

    messages.on("value", snap => {
      const groupsObject = snap.val();

      if (groupsObject) {
        const msg = Object.keys(groupsObject).map(key => ({
          ...groupsObject[key],
          uid: key
        }));

        this.refinedLatestMessages(msg);
        // this.setState({
        //   ...this.state,
        //   latestMessages: msg
        // }, () => console.log(this.state.latestMessages));
      } else {
        this.setState({
          ...this.state,
          latestMessages: []
        }, () => console.log(this.state.latestMessages));
      }
    });
  }

  refinedLatestMessages = (messages) => {
    messages.forEach(message => {
      const msg = firebase.database().ref("users/" + message.senderId);

      msg.on("value", snap => {
        const textMsg = snap.val();

          message.profile_picture = textMsg.profile_picture;
          message.username = textMsg.username;

          this.setState({
            ...this.state,
            latestMessages: [...this.state.latestMessages, message]
          });
      });
    });
  }

  sendMessage = async (image = "") => {
    const { userId, selectedUser, message } = this.state;

    const thread = (userId < selectedUser.uid) ? userId + selectedUser.uid : selectedUser.uid + userId;

    try {
      const msg = {
        message: message,
        senderId: userId,
        receiverId: selectedUser.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      await firebase.database().ref("chat/" + thread).push(msg);

      await firebase.database().ref("latest-messages/" + selectedUser.uid).child(userId).update(msg);

      this.setState({
        message: ""
      });

      ToastAndroid.show('Message sent ✓', ToastAndroid.LONG);
    } catch (error) {
      // console.log('ERR: ', error);
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }

  };

  render() {
    const { selectedIndex, user, btnStatus, btnUpdate, users, search, selectedUser, messages, latestMessages } = this.state;

    const selectedUseruid = selectedUser ? selectedUser.uid : null;

    return (
      <React.Fragment>
        <Overlay fullScreen isVisible={this.state.isVisible} windowBackgroundColor="rgba(255, 255, 255, .5)" width="auto" height="auto">
          <ScrollView>
            <Button title={btnStatus} onPress={this.handleChoosePhoto} />
            {/* ----------------- OLD IMPLEMENTATION ----------------------------- */}
            <View style={styles.gallery}>
              <CameraRollPicker selected={[]} maximum={1} callback={this.getSelectedImages} />
              <Text style={styles.welcome}>Image Gallery</Text>
            </View>
          </ScrollView>

          {/* --------------------- NEW IMAGE IMPLEMENTATION---------------------------------- */}
          {/* <TouchableOpacity onPress={this._handleButtonPress}>
              <Text>LOAD IMAGES</Text>
            </TouchableOpacity>
            <ScrollView>
              {this.state.photos.map((p, i) => {
                return (
                  <Image
                    key={i}
                    style={{
                      width: 300,
                      height: 100,
                    }}
                    source={{ uri: p.node.image.uri }}
                  />
                );
              })}
            </ScrollView> */}
        </Overlay>

        {/* CHAT BOX OVERLAY */}
        <Overlay fullScreen isVisible={this.state.chatVisible} windowBackgroundColor="rgba(255, 255, 255, .5)" width="auto" height="auto">
          <React.Fragment>
            <View style={styles.headerChatBox}>
              <TouchableOpacity
                style={{
                  ...styles.bottomButtons,
                  borderRightWidth: 1,
                  position: "absolute",
                  left: 0,
                  marginTop: 0,
                  borderRightColor: "rgba(255, 255, 255, 0.2)"
                }}
                onPress={() => this.closeChatBox()}
              >
                <Icon name="keyboard-backspace" style={styles.backArrow} size={30} color="#999" />
              </TouchableOpacity>

              <Text style={{ textAlign: "center", color: "#666", marginTop: 5 }}>{selectedUser && selectedUser.username}</Text>
            </View>
            <ScrollView>
              <View style={styles.chatBoxArea}>
                {messages && messages.map((msg) => (<React.Fragment key={msg.uid}>
                  {msg.receiverId !== selectedUseruid ? (<View style={styles.chatBoxRow}>
                    <View style={{ flexDirection: "row", }}>
                      <Image source={{ uri: selectedUser.profile_picture }} style={styles.profilePicture} />
                      <View style={{ ...styles.leftChatBox, borderWidth: 1, borderColor: "#e3e3e3", backgroundColor: "#fff", width: "90%" }}>
                        <Text style={styles.chatText}>{msg.message}</Text>
                        {/* <Text style={styles.author}>- {selectedUser.username}</Text> */}
                        <Moment style={styles.timeStamp} element={Text} fromNow>{msg.timestamp}</Moment>
                      </View>
                    </View>
                    <View style={{ ...styles.rightChatBox }}></View>
                  </View>) : (<View style={styles.chatBoxRow}>
                    <View style={{ ...styles.leftChatBox, width: "10%" }}></View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ ...styles.rightChatBox, borderWidth: 1, width: "90%", borderColor: "#e3e3e3", backgroundColor: "#e3e3e3" }}>
                        <Text style={styles.chatText}>{msg.message}</Text>
                        <Text style={styles.author}>- {user.username}</Text>
                        <Moment style={{ ...styles.timeStamp, textAlign: "right" }} element={Text} fromNow>{msg.timestamp}</Moment>
                      </View>
                      <Image source={{ uri: user.profile_picture }} style={styles.profilePicture} />
                    </View>
                  </View>)}
                </React.Fragment>))}
              </View>
            </ScrollView>
            <View style={{ flex: 1, flexDirection: "row", ...styles.footerChatBox }}>
              <View style={{ ...styles.messageArea, flex: 1, flexDirection: "row" }}>
                <TouchableOpacity style={styles.sendImage}>
                  <Icon name="camera-wireless" style={styles.sendImageIcon} size={25} color="gray" />
                </TouchableOpacity>
                <TextInput
                  returnKeyLabel={"next"}
                  onChangeText={text => this.setState({ message: text })}
                  placeholder="say something ..."
                  placeholderTextColor="#e3e3e3"
                  value={this.state.message}
                  style={styles.inputStyleChatBox}
                />
              </View>
              <View style={{ width: "20%" }}>
                <TouchableOpacity onPress={() => this.sendMessage()}>
                  <Icon name="send" style={{ textAlign: "right", marginBottom: 11, marginRight: 10 }} size={30} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </React.Fragment>
        </Overlay>

        <ScrollView>
          {selectedIndex === 0 && (
            <View style={styles.container}>
              <View>
                {latestMessages.map((l, i) => (
                  <ListItem
                    key={i}
                    leftAvatar={{ source: { uri: l.profile_picture } }}
                    title={l.username}
                    subtitleStyle={{ fontSize: 12, fontWeight: "bold" }}
                    subtitle={
                      <View>
                        <Text style={{...styles.subtitle, fontSize: 14}}>{l.message}</Text>
                        <Moment style={{ ...styles.timeStamp, textAlign: "right", fontWeight: "bold" }} element={Text} fromNow>{l.timestamp}</Moment>                        
                      </View>
                    }
                    bottomDivider
                  />
                ))}
              </View>
            </View>
          )}

          {selectedIndex === 1 && (
            <View style={styles.container}>
              <SearchBar
                placeholder="Search contact..."
                containerStyle={{
                  backgroundColor: "#fff",
                  borderBottomWidth: 1,
                  borderBottomColor: "#e3e3e3",
                  borderTopWidth: 0
                }}
                inputStyle={{ color: "#999" }}
                inputContainerStyle={{ backgroundColor: "#fff" }}
                onChangeText={this.updateSearch}
                value={search}
              />
              {users.map((l, i) => (
                <ListItem
                  key={i}
                  leftAvatar={{ source: { uri: l.profile_picture } }}
                  title={l.username}
                  subtitleStyle={{ fontSize: 12 }}
                  onPress={() => this.manageChatBox(l)}
                  subtitle={
                    <View>
                      <Text style={styles.subTitleStyle}>{l.email}</Text>
                    </View>
                  }
                  bottomDivider
                  chevron
                />
              ))}
            </View>
          )}

          {selectedIndex === 2 && (
            <View style={styles.container}>
              {!user.profile_picture && (
                <TouchableOpacity onPress={this.handleChoosePhoto}>
                  <View style={styles.imageSelectArea}>
                    <Icon name="camera-wireless-outline" style={styles.imageSelectorIcon} size={20} color="red" />
                    <Text style={styles.imageSelectAreaText}>Profile Image</Text>
                  </View>
                </TouchableOpacity>
              )}

              {user.profile_picture && (
                <React.Fragment>
                  <TouchableOpacity style={styles.floatingIconImage} onPress={this.handleChoosePhoto}>
                    <Icon name="camera-wireless" style={styles.imageSelectorIcon} size={30} color="red" />
                  </TouchableOpacity>
                  <Image source={{ uri: user.profile_picture }} style={styles.imageSelected} />
                </React.Fragment>
              )}

              <View style={styles.inputInnerStyle}>
                <Text style={styles.textLabels}>Username</Text>
                <TextInput
                  returnKeyLabel={"next"}
                  onChangeText={text => this.setState({ username: text })}
                  placeholder="john doe"
                  placeholderTextColor="#e3e3e3"
                  value={user.username ? user.username : this.state.username}
                  style={styles.inputStyle}
                />
              </View>
              <View style={styles.inputInnerStyle}>
                <TouchableOpacity style={styles.Btn} onPress={this.updateP}>
                  <Text style={styles.BtnText}>{btnUpdate}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={{
              ...styles.bottomButtons,
              borderRightWidth: 1,
              borderRightColor: "rgba(255, 255, 255, 0.2)"
            }}
            onPress={() => this.switchSection(0)}
          >
            <Text style={selectedIndex === 0 ? { ...styles.footerText, ...styles.activeTab } : styles.footerText}>
              {/* MESSAGES */}
              <Icon name="android-messages" size={20} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButtons} onPress={() => this.switchSection(1)}>
            <Text style={selectedIndex === 1 ? { ...styles.footerText, ...styles.activeTab } : styles.footerText}>
              CONTACTS
              {/* <Icon name="contacts" size={20} color="white" /> */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.bottomButtons,
              borderLeftWidth: 1,
              borderLeftColor: "rgba(255, 255, 255, 0.2)"
            }}
            onPress={() => this.switchSection(2)}
          >
            <Text style={selectedIndex === 2 ? { ...styles.footerText, ...styles.activeTab } : styles.footerText}>
              {/* SETTINGS */}
              <Icon name="settings" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 13,
    color: "#666"
  },
  timeAgo: {
    fontSize: 9,
    color: "#999",
    marginTop: 10
  },
  activeTab: {
    color: "rgba(255, 255, 255, 0.3)"
  },
  footerMenuShow: {
    display: "none"
  },
  mainviewStyle: {
    flex: 1,
    flexDirection: "column"
  },
  footer: {
    position: "absolute",
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor: "#2F55C0",
    flexDirection: "row",
    height: 60,
    alignItems: "center"
  },
  footerChatBox: {
    position: "absolute",
    flex: 0.1,
    left: 10,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 60,
    alignItems: "center"
  },
  bottomButtons: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  bottomButtonsActive: {
    color: "#2F55C0"
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    alignItems: "center",
    fontSize: 10
  },
  gallery: {
    fontSize: 20,
    textAlign: "center",
    height: HEIGHT - 10
  },
  imageSelectAreaText: {
    fontSize: 9,
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    fontWeight: "bold"
  },
  imageSelectorIcon: {
    marginHorizontal: 50
  },
  imageSelectArea: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginHorizontal: 125,
    marginTop: 70,
    paddingLeft: 0,
    borderColor: "#e3e3e3",
    paddingTop: 25,
    borderWidth: 1
  },
  imageSelected: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    overflow: "hidden",
    marginTop: 70,
    marginHorizontal: 125,
    borderWidth: 2,
    borderColor: "#e3e3e3"
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    overflow: "hidden",
    // marginTop: 70,
    // marginHorizontal: 125,
    borderWidth: 2,
    borderColor: "#e3e3e3"
  },
  floatingIconImage: {
    position: "absolute",
    marginHorizontal: 65,
    marginTop: 90,
    zIndex: 100
  },
  Btn: {
    height: 45,
    backgroundColor: "#e3e3e3",
    marginTop: 20,
    borderRadius: 30
  },
  BtnText: {
    textAlign: "center",
    marginTop: 12,
    color: "#666"
  },
  inputInnerStyle: {
    marginTop: 16,
    width: WIDTH - 200,
    marginHorizontal: 99
  },
  inputStyle: {
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
    color: "red",
    textAlign: "center",
    fontStyle: "italic"
  },
  inputStyleChatBox: {
    fontStyle: "italic",
    paddingLeft: 10
  },
  textLabels: {
    color: "#666",
    textAlign: "center"
  },
  subTitleStyle: {
    color: "#999",
    fontStyle: "italic"
  },
  headerChatBox: {
    marginBottom: 10,
    paddingBottom: 10
  },
  chatBoxArea: {
    borderColor: "#e3e3e3",
    backgroundColor: "#f5f6fa",
    borderWidth: 1,
    padding: 10,
    height: HEIGHT - 150
  },
  messageArea: {
    width: "80%",
    borderRadius: 10,
    marginBottom: 10
  },
  backArrow: {
    // position: "absolute",
    // marginTop: -5
  },
  chatBoxRow: {
    // flex: 1,
    flexDirection: "row",
    width: WIDTH - 67,
    marginBottom: 2
  },
  leftChatBox: {
    width: "50%",
    height: "auto",
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 10
  },
  rightChatBox: {
    width: "50%",
    height: "auto",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    marginBottom: 10
  },
  chatText: {
    fontSize: 12,
    color: "#666"
  },
  timeStamp: {
    color: "orange",
    fontSize: 9,
    marginTop: 10,
    fontStyle: "italic"
  },
  sendImage: {
    marginTop: 10
  },
  sendImageIcon: {
    //
  },
  author: {
    color: "#999",
    fontSize: 10
  }
});
