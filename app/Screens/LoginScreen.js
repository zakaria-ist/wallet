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
  useColorScheme,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import CustomAlert from "../lib/alert";
import Request from "../lib/request";

const request = new Request();
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
    InteractionManager.runAfterInteractions(() => {
      let walletData = [
        {
          id: 1,
          name: "Alipay"
        },
        {
          id: 2,
          name: "Touch & Go"
        },
        {
          id: 3,
          name: "Wechat"
        },
      ];
      walletData = JSON.stringify(walletData);
      AsyncStorage.setItem('walletData', walletData);
      // check if user already logged in
      AsyncStorage.getItem('isUser').then((isUser) => {
          if (isUser != null) {
            AsyncStorage.getItem('authType').then((authType) => {
              if (authType != null) {
                navigation.replace('DrawerStack');
              }
            })
          }
        }
      );
    });
    
  }, []);

  const handleLogin = async () => {
    if (!userName.length || !password.length) {
      alert.warning("Field cannot be empty. Check the username or password. ");
      return;
    }
    let auth_url = request.getAuthUrl();
    let params = JSON.stringify({username: userName, password: password}); //admin username=kenny & password=KN@July21
    const content = await request.post(auth_url, params);
    console.log(content);
    if (content.authorizeToken && content.authorizeToken != '') {
        // update the async storage
        AsyncStorage.setItem('isUser', '1');
        AsyncStorage.setItem('authType', content.userRole);
        // AsyncStorage.setItem('authType', 'agent');
        AsyncStorage.setItem('authorizeToken', content.authorizeToken);
        // navigate to user pages
        navigation.replace('DrawerStack');
    } else {
      alert.warning("Sign in is unsuccessful. Check the username or password. ");
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={backgroundStyle}>
          <View style={styles.view_logo}>
            <View style={styles.view_logo_logo}>
              {/* <Text style={styles.view_logo_logo_text}>LOGO</Text> */}
              <Image
                source={require('../assets/images/wallet_logo_128.png')}
              />
            </View>
          </View>
          <View style={styles.view_input}>
              <TextInput 
                style={styles.text_input}
                onChangeText={setUserName}
                value={userName}
                textAlign={'center'}
                placeholder="Username"
                placeholderTextColor={WalletColors.grey}
              />

              <TextInput 
                style={styles.text_input}
                onChangeText={setPassword}
                value={password}
                textAlign={'center'}
                placeholder="Password"
                placeholderTextColor={WalletColors.grey}
              />

              <TouchableOpacity
                onPress={handleLogin}
              >
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

const styles = StyleSheet.create({
  text_input: {
    width: widthPercentageToDP("70%"),
    height: 50,
    marginTop: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.black
  },
  sign_button: {
    width: widthPercentageToDP("40%"),
    height: 60,
    marginTop: heightPercentageToDP("8%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center'
  },
  sign_button_text: {
    color: WalletColors.white,
    fontSize: 20
  },
  view_logo: {
    flexDirection: "column", 
    flex: 1, 
    alignItems: "center", 
    height: heightPercentageToDP("40%")
  },
  view_logo_logo: {
    width: 200,
    height: 200,
    top: widthPercentageToDP("25%"),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center'
  },
  view_logo_logo_text: {
    fontSize: 30, 
    fontWeight: "bold", 
    textAlign: 'center'
  },
  view_input: {
    flexDirection: "column", 
    flex: 1, 
    alignItems: "center", 
    height: heightPercentageToDP("60%"),
    top: widthPercentageToDP("10%"),
  }
});


export default LoginScreen;
