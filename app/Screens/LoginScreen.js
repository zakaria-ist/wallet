/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  PixelRatio,
  useColorScheme,
  TouchableOpacity,
  InteractionManager,
  Keyboard
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import notificationHelper from "../lib/notificationHelper";
import { RFValue } from "react-native-responsive-fontsize";
import { firebaseConfig } from "../../firebaseConfig.js";
import { Notifications } from 'react-native-notifications'
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';
import { useStateIfMounted } from 'use-state-if-mounted';
import Screensize from '../lib/screensize.js';
import styles from '../lib/global_css.js';
import Spinner from "react-native-loading-spinner-overlay";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const request = new Request();
const screensize = new Screensize();
const alert = new CustomAlert();
const db = firestore();

const LoginScreen = ({navigation}) => {
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: Colors.lighter,
    flex: 1
  };

  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      notification.userInteraction && processNoti(notification)
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      // alert.warning(JSON.stringify(notification))
      processNoti(notification)
      // process the action
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  const processNoti = (remoteMessage) => {
    if (remoteMessage) {
      console.log('remoteMessage', remoteMessage.data);
      // let groupID = remoteMessage.data.groupID;
      // let groupName = remoteMessage.data.groupName;
      // let groupType = remoteMessage.data.groupType;
      // props.navigation.navigate("ChatScreen", {
      //   type: String(groupType),
      //   groupID: String(groupID),
      //   groupName: String(groupName),
      // });
    }
  }

  async function createNotificationChannel() {
    Notifications.setNotificationChannel({
      channelId: 'message',
      name: 'Message Channel',
      description: 'Message Channel',
      importance: 5
    })
  }

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        // alert.warning('on init'+ JSON.stringify(remoteMessage))
        console.log('remoteMessage', 'getInitialNotification', remoteMessage);
        processNoti(remoteMessage)
      });

    messaging()
      .onNotificationOpenedApp((remoteMessage) => {
        console.log('remoteMessage', 'onNotificationOpenedApp', remoteMessage);
        processNoti(remoteMessage)
      });

   messaging()
      .onMessage(({ notification,data, messageId }) => {
        notificationHelper.sendLocalNotification({
          title: notification.title,
          body: notification.body,
          data,
          messageId
        })
      });

    createNotificationChannel();

    InteractionManager.runAfterInteractions( async () => {
      const walletUrl = request.getWalletUrl();  
      await request.get(walletUrl)
        .then(data => {
          AsyncStorage.setItem('walletData', JSON.stringify(Object.values(data['wallets'])));
        })
    })
  }, []);

  const handleLogin = async () => {
    if (!userName.length || !password.length) {
      alert.warning("Field cannot be empty. Check the username or password. ");
      return;
    }
    onSpinnerChanged(true);
    const auth_url = request.getAuthUrl();
    let params = JSON.stringify({username: userName, password: password}); //admin username=kenny & password=KN@July21
    const content = await request.post(auth_url, params);
    //await request.get(auth_url + "?username=" + userName + "&password=" + password)
    console.log('content', content);
    if (content.authorizeToken && content.authorizeToken != '') {
      // update the async storage
      AsyncStorage.setItem('isUser', '1');
      AsyncStorage.setItem('username', userName);
      AsyncStorage.setItem('password', password);
      AsyncStorage.setItem('authType', content.userRole);
      // AsyncStorage.setItem('authType', 'agent');
      AsyncStorage.setItem('token', content.authorizeToken);
      let clientUrl = null;
      if (content.userRole == 'admin') {
        clientUrl = request.getAdminClientListUrl();
      } else if (content.userRole == 'subadmin') {
        clientUrl = request.getSubAdminClientListUrl();
      } else if (content.userRole == 'client') {
        clientUrl = request.getClientUserListUrl();
      } else if (content.userRole == 'agent') {
        clientUrl = request.getAgentUserListUrl();
        AsyncStorage.setItem('superiorClient', JSON.stringify(content.superiorClient));
      } else if (content.userRole == 'user') {
        clientUrl = request.getAgentUserListUrl();
        AsyncStorage.setItem('superiorClient', JSON.stringify(content.superiorClient));
        AsyncStorage.setItem('superiorAgent', JSON.stringify(content.superiorAgent));
      }
      if (clientUrl) {
        await request.get(clientUrl + '?token=' + content.authorizeToken)
          .then(result => {
            if (content.userRole == 'admin' || content.userRole == 'subadmin') {
              AsyncStorage.setItem('groupList', JSON.stringify(Object.values(result['clients'])));
            } else if (content.userRole == 'client' || content.userRole == 'agent') {
              AsyncStorage.setItem('userList', JSON.stringify(Object.values(result['users'])));
            }
          })
      }
      if (content.userRole == 'agent') {
        //get user permission and save user device token
        requestUserPermission(userName);
      }
      onSpinnerChanged(false);
      // navigate to user pages
      navigation.replace('DrawerStack');
    } else {
      alert.warning("Sign in is unsuccessful. Check the username or password. ");
    }
  }

  async function requestUserPermission(userName) {
    await messaging().requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          messaging().getToken()
            .then((deviceToken) => {
              db.collection("users")
                .doc(String(userName))
                .set({
                  deviceId: deviceToken,
                })
                .then(() => {
                  console.log("tokenID successfully written!", deviceToken);
                })
                .catch((error) => {
                  console.error("Error writing tokenID: ", error);
                });
            });
        }
      })
  }

  const handleKeyDown = (e) => {
    if(e.nativeEvent.key == "Enter"){
        Keyboard.dismiss();
    }
  }
  
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        visible={spinner}
        // textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView
        style={backgroundStyle}>
          <View style={styles.view_logo}>
            <View style={styles.view_logo_logo}>
              <Image style={styles.logo} source={screensize.getSmallScreen() || screensize.getMediumScreen() || screensize.getLargeScreen()}/>
            </View>
          </View>
          <View style={styles.login_view_input}>
              <TextInput 
                style={styles.login_text_input}
                onChangeText={setUserName}
                value={userName}
                textAlign={'center'}
                placeholder={'Username'}
                placeholderTextColor={WalletColors.grey}
                multiline={true}
                onSubmitEditing={handleKeyDown}
                blurOnSubmit={true}
                returnKeyLabel='go'
              />
              <TextInput 
                style={styles.login_text_input}
                onChangeText={setPassword}
                value={password}
                textAlign={'center'}
                placeholder={'Password'}
                placeholderTextColor={WalletColors.grey}
                secureTextEntry={true}
                onSubmitEditing={handleKeyDown}
                blurOnSubmit={true}
                returnKeyLabel='go'
              />
              <TouchableOpacity
                onPress={handleLogin}>
                <View style={styles.sign_button}>
                  <Text style={styles.sign_button_text}>
                    Sign In
                  </Text>
                </View>
              </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

screensize.getSmallScreen()
? require('../assets/images/wallet_logo_64.png') : screensize.getMediumScreen();
screensize.getMediumScreen()
? require('../assets/images/wallet_logo_128.png') : screensize.getLargeScreen();
screensize.getLargeScreen()
? require('../assets/images/wallet_logo.png') : screensize.getMediumScreen();


export default LoginScreen;