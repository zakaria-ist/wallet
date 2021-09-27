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
  InteractionManager
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";
import { RFValue } from "react-native-responsive-fontsize";
import { useStateIfMounted } from 'use-state-if-mounted';
import Screensize from '../lib/screensize.js';
import styles from '../lib/global_css.js';

const request = new Request();
const screensize = new Screensize();
const alert = new CustomAlert();

const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: Colors.lighter,
    flex: 1
  };

  useEffect(() => {
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
    const auth_url = request.getAuthUrl();
    //let params = JSON.stringify({username: userName, password: password}); //admin username=kenny & password=KN@July21
    await request.get(auth_url + "?username=" + userName + "&password=" + password)
      .then( async (content) => {
        console.log('content', content);
        if (content.authorizeToken && content.authorizeToken != '') {
          // update the async storage
          AsyncStorage.setItem('isUser', '1');
          AsyncStorage.setItem('authType', content.userRole);
          // AsyncStorage.setItem('authType', 'agent');
          AsyncStorage.setItem('authorizeToken', content.authorizeToken);
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
          // navigate to user pages
          navigation.replace('DrawerStack');
        } else {
          alert.warning("Sign in is unsuccessful. Check the username or password. ");
        }
      })
  }
  const [passwordplaceholder,setpasswordPlaceholder] = useStateIfMounted("password");
  const [usernameplaceholder,setusernamePlaceholder] = useStateIfMounted("username");
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
                placeholder={usernameplaceholder}
                setPlaceholder={setusernamePlaceholder}
                placeholderTextColor={WalletColors.grey}
              />
              <TextInput 
                style={styles.login_text_input}
                onChangeText={setPassword}
                value={password}
                textAlign={'center'}
                placeholder={passwordplaceholder}
                setPlaceholder={setpasswordPlaceholder}
                placeholderTextColor={WalletColors.grey}
                secureTextEntry={true}
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