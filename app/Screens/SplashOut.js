import React, {useState, useEffect} from 'react';
import {
  heightPercentageToDP,
} from "react-native-responsive-screen";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const SplashOut = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('isUser').then((value) =>
        navigation.replace(
          value === null ? 'Auth' : 'DrawerStack'
        ),
      );
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/walletSplash.jpeg')}
        style={{resizeMode: 'cover', margin: 0}}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashOut;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    //height: 80,
    height: windowHeight / 2 - heightPercentageToDP("60%"),
  },
});