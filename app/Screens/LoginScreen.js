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
import { height, width } from 'styled-system';
import { Icon } from 'react-native-elements/dist/icons/Icon';

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
          <View style={ styles.view_logo}>
            <View style={isSmallScreen ? styles.view_small_logo_logo : styles.view_large_logo_logo}>
              {/* <Text style={styles.view_logo_logo_text}>LOGO</Text> */}
              <Image source={isLargeScreen}/>
            </View>
          </View>
          <View style={styles.view_input}>
              <TextInput 
                style={isSmallScreen ? styles.small_text_input : 
                  styles.large_text_input}
                onChangeText={setUserName}
                value={userName}
                textAlign={'center'}
                placeholder="Username"
                placeholderTextColor={WalletColors.grey}
              />

              <TextInput 
                style={isSmallScreen ? styles.small_text_input : 
                  styles.large_text_input}
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
                  <Text style={isSmallScreen ? styles.small_sign_button_text:
                  styles.large_sign_button_text}>
                    Sign In
                  </Text>
                </View>
              </TouchableOpacity>
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );

};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 const isSmallScreen = PixelRatio.getPixelSizeForLayoutSize(windowWidth)<1000 
 && PixelRatio.getPixelSizeForLayoutSize(windowHeight)<=1500;
 const isLargeScreen = PixelRatio.getPixelSizeForLayoutSize(windowWidth)>=1000 
 && PixelRatio.getPixelSizeForLayoutSize(windowHeight)>=1500
 ? require('../assets/images/wallet_logo_128.png')
 : require('../assets/images/wallet_logo_64.png');
const styles = StyleSheet.create({
   small_text_input: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("8%"),
    marginTop: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.black,
    flex: 1, 
  },
  large_text_input: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("6%"),
    marginTop: heightPercentageToDP("4%"),
    borderRadius: 30,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.black,
    flex: 1, 
  },
  sign_button: {
    width: widthPercentageToDP("35%"),
    //height: 60,
    height: heightPercentageToDP("8%"),
    marginTop: heightPercentageToDP("8%"),
    borderRadius: 30,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center'
  },
  small_sign_button_text: {
    color: WalletColors.white,
    fontSize: 15,
    //flex: 1
  },
  large_sign_button_text: {
    color: WalletColors.white,
    fontSize: 20,
    //flex: 1
  },
  view_logo: {
     flexDirection: "column", 
     alignItems: "center", 
     marginTop: heightPercentageToDP("4%"),
   // flex: 1
  },
  view_small_logo_logo: {
      // width: 200,
      // height: 200,
        // width: screenWidth,
    // height: screenHeight,
    // width: widthPercentageToDP("50%"),
    // height: heightPercentageToDP("50%"),
    //  width: swidth,
    //  height: sheight,
    // width: 200,
    // height: 200,
    width: 100,
    height: 100,
    flex: 1,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    marginTop: heightPercentageToDP("8%"),
   justifyContent: 'center',
   alignItems: 'center'
  },
  view_large_logo_logo: {
    width: 200,
    height: 200,
  // width: widthPercentageToDP("30%"),
  // height: heightPercentageToDP("22%"),
  flex: 1,
  borderRadius: 100,
  borderWidth: 2,
  borderColor: WalletColors.Wblue,
  borderStyle: 'solid',
  marginTop: heightPercentageToDP("8%"),
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
    marginTop: heightPercentageToDP("8%"),
    // top: widthPercentageToDP("10%"),
  }
});


export default LoginScreen;
