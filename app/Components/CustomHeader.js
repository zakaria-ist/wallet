/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PixelRatio
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'react-native-elements';
import { WalletColors } from "../assets/Colors.js";
import Screensize from '../lib/screensize.js';

const screensize = new Screensize();

const CustomHeader = ({title}) => {
  const navigation = useNavigation();
  const [headerTitle, setHeaderTitle] = useStateIfMounted(title);

  useEffect(() => {
    setHeaderTitle(title)
  }, [title]);

  return useMemo(() => {
    return (
        <View 
          style={styles.view_root}
        >
          <View style={{flex: 2, marginTop: heightPercentageToDP("-1%")}}>
            <Button 
              onPress={() => navigation.openDrawer()}
              icon={<Feather name="menu" color={WalletColors.Wblue} size={isSmallRF || isMediumRF || isLargeRF} />}
              buttonStyle={{backgroundColor: "white"}}
            />
          </View>
          <View style={{flex: 10, alignItems: 'center'}}>
            <Text style={styles.header_text}>{headerTitle}</Text>
          </View>
        </View>
    );
  })

};

// size={screensize.getSmallScreen() || screensize.getMediumScreen() || screensize.getLargeScreen} />}

// screensize.getSmallScreen()
// ? RFValue(12) : screensize.getMediumScreen();
// screensize.getMediumScreen()
// ? RFValue(19) : screensize.getLargeScreen();
// screensize.getLargeScreen()
// ? RFValue(32) : screensize.getSmallScreen();

const isSmallRF = screensize.getSmallScreen() ? RFValue(14) : isMediumRF;
const isMediumRF = screensize.getMediumScreen() ? RFValue(19) : isLargeRF;
const isLargeRF = screensize.getLargeScreen() ? RFValue(32) : isSmallRF;

const styles = StyleSheet.create({
  view_root: {
    flexDirection: "row", 
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    alignItems: 'center',
    height: heightPercentageToDP("5%"),
    backgroundColor: '#fff',
  },
  header_text: {
    fontSize: RFValue(16), 
    fontWeight: 'bold', 
    color: WalletColors.Wblue, 
    justifyContent: 'center', 
    marginRight: widthPercentageToDP('18%')
  },
});


export default CustomHeader;
