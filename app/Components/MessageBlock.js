/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  PixelRatio,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { WalletColors } from "../assets/Colors.js";

const MessageBlock = ({transType, mData, lineNumber, parentReference}) => {
  const [refCode, setRefCode] = useStateIfMounted(mData.refCode);
  const [amount, setAmount] = useStateIfMounted(mData.amount);

  useEffect(() => {
    setRefCode(mData.refCode);
    setAmount(mData.amount);
  }, [mData]);

  const handleChange = () => {
    let data = {
      refCode: refCode,
      amount: amount
    }
    parentReference(data);
  }

  return useMemo(() => {
    return (
      <View style={styles.view_rectangle}>
        <View style={styles.view_left}>
          <View style={styles.view_lineNumber}>
            <Text>{lineNumber}. </Text>
          </View>
        </View>
        <View style={styles.view_right}>
          <View style={styles.view_input}>
            {transType == "Deposit" ? (<Text>Ref. Code : </Text>) : (<Text>Mobile No. : </Text>)}
            <TextInput 
              style={styles.text_input}
              onChangeText={setRefCode}
              value={refCode}
              textAlign={'left'}
              onBlur={handleChange}
              placeholderTextColor={WalletColors.grey}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.view_input}>
            <Text>Amount    : </Text>
            <TextInput 
              style={styles.text_input}
              onChangeText={setAmount}
              value={amount}
              textAlign={'left'}
              onBlur={handleChange}
              placeholderTextColor={WalletColors.grey}
              keyboardType={'numeric'}
            />
          </View>
        </View>
      </View>
    );
  })

};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isSmallScreen = (PixelRatio.getPixelSizeForLayoutSize(windowWidth) <330 
&& PixelRatio.getPixelSizeForLayoutSize(windowHeight) <490)

const styles = StyleSheet.create({
  view_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    height: heightPercentageToDP("20%"),
    width: widthPercentageToDP("90%"),
    marginBottom: heightPercentageToDP("3%"),
  },
  view_left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view_right: {
    flex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text_input: {
    width: widthPercentageToDP("50%"),
    height: heightPercentageToDP("8%"),
    // marginTop: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.Wblue,
    // padding: 10,
    fontSize: RFValue(18),
  },
  view_input: {
    flexDirection: "row", 
    alignItems: "center",
    padding:widthPercentageToDP("1%")
  },
  view_lineNumber: {
    flexDirection: "column", 
    // flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    // padding:widthPercentageToDP("5%")
  }
});


export default MessageBlock;
