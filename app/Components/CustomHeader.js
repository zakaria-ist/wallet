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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isSmallRF = (PixelRatio.getPixelSizeForLayoutSize(windowWidth) <320 
&& PixelRatio.getPixelSizeForLayoutSize(windowHeight) <480)
? RFValue(12) : isMediumRF;
const isMediumRF = (320 <= PixelRatio.getPixelSizeForLayoutSize(windowWidth) <999 
&& 480 <= PixelRatio.getPixelSizeForLayoutSize(windowHeight) <1000)
? RFValue(19) : isLargeRF;
const isLargeRF = (PixelRatio.getPixelSizeForLayoutSize(windowWidth)>=999 
&& PixelRatio.getPixelSizeForLayoutSize(windowHeight)>=1000)
? RFValue(32) : isSmallRF;

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
