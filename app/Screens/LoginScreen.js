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
  const [placeholder,setPlaceholder] = useState("password");
  const [placeholder1,setPlaceholder1] = useState("username");
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={backgroundStyle}>
          <View style={styles.view_logo}>
            <View style={styles.view_logo_logo}>
              <Image style={styles.logo} source={isSmallScreen || isMediumScreen || isLargeScreen}/>
            </View>
          </View>
          <View style={styles.view_input}>
              <TextInput 
                placeholder={placeholder1}
                style={styles.text_input}
                onChangeText={setUserName}
                value={userName}
                setPlaceholder={setPlaceholder1}
                multiline={true}
                textAlign={'center'}
                placeholderTextColor={WalletColors.grey}
              />
              <TextInput 
                style={styles.text_input}
                onChangeText={setPassword}
                value={password}
                textAlign={'center'}
                placeholder={placeholder}
                setPlaceholder={setPlaceholder}
                //placeholder="password"
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isSmallScreen = (PixelRatio.getPixelSizeForLayoutSize(windowWidth) <330 
&& PixelRatio.getPixelSizeForLayoutSize(windowHeight) <490)
? require('../assets/images/wallet_logo_64.png') : isMediumScreen;
const isMediumScreen = (330 <= PixelRatio.getPixelSizeForLayoutSize(windowWidth) <999 
&& 490 <= PixelRatio.getPixelSizeForLayoutSize(windowHeight) <1000)
? require('../assets/images/wallet_logo_128.png') : isLargeScreen;
const isLargeScreen = (PixelRatio.getPixelSizeForLayoutSize(windowWidth)>=999 
&& PixelRatio.getPixelSizeForLayoutSize(windowHeight)>=1000)
? require('../assets/images/wallet_logo.png') : isSmallScreen;

const styles = StyleSheet.create({
  text_input: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("6.5%"),
    marginTop: heightPercentageToDP("2.5%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.black,
    flex: 1, 
    fontSize: RFValue(14),
    textAlignVertical: 'top'
  },
  sign_button: {
    width: widthPercentageToDP("35%"),
    height: heightPercentageToDP("8%"),
    marginTop: heightPercentageToDP("8%"),
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center'
  },
  sign_button_text: {
    color: WalletColors.white,
    fontSize: RFValue(18)
  },
  logo:{
    width: windowHeight / 2 - heightPercentageToDP("37%"),
    height: windowHeight / 2 - heightPercentageToDP("37%"),
  },
  view_logo: {
     flexDirection: "column", 
     alignItems: "center", 
     marginTop: heightPercentageToDP("4%"),
  },
  view_logo_logo: {
    width: windowHeight / 2 - heightPercentageToDP("30%"),
    height: windowHeight / 2 - heightPercentageToDP("30%"),
    flex: 1,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
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
  }
});


export default LoginScreen;