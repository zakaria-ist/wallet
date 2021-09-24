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
          {transType == "Deposit" ? (
            <View style={styles.view_input}>
              <View style={styles.view_input_label}>
                <Text style={styles.view_text}>Ref. Code</Text>
                <Text style={styles.view_text}>Amount</Text>
              </View>
              <View style={styles.view_input_box}>
                <View style={styles.view_input}>
                  <Text style={styles.view_text}> : </Text>
                  <TextInput 
                  style={styles.text_input}
                  onChangeText={setRefCode}
                  value={refCode}
                  onBlur={handleChange}
                  placeholderTextColor={WalletColors.grey}
                  keyboardType={'numeric'}
                />
                </View>
                <View style={styles.view_input}>
                  <Text style={styles.view_text}> : </Text>
                  <TextInput 
                    style={styles.text_input}
                    onChangeText={setAmount}
                    value={amount}
                    onBlur={handleChange}
                    placeholderTextColor={WalletColors.grey}
                    keyboardType={'numeric'}
                  />
                </View>
              </View>
            </View>
            ) : (
              <View style={styles.view_input}>
                <View style={styles.view_input_label}>
                  <Text style={styles.view_text}>Mobile No.</Text>
                  <Text style={styles.view_text}>Amount</Text>
                </View> 
                <View style={styles.view_input_box}>
                <View style={styles.view_input}>
                    <Text style={styles.view_text}> : </Text>
                    <TextInput 
                    style={styles.text_input}
                    onChangeText={setRefCode}
                    value={refCode}
                    onBlur={handleChange}
                    placeholderTextColor={WalletColors.grey}
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.view_input}>
                  <Text style={styles.view_text}> : </Text>
                  <TextInput 
                    style={styles.text_input}
                    onChangeText={setAmount}
                    value={amount}
                    //textAlignVertical={'center'}
                    onBlur={handleChange}
                    placeholderTextColor={WalletColors.grey}
                    keyboardType={'numeric'}
                  />
                </View>
              </View>
           </View>
            )}
        </View>
      </View>
    );
  })

};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  view_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    height: heightPercentageToDP("12%"),
    width: widthPercentageToDP("90%"),
    marginBottom: heightPercentageToDP("1%"),
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
  view_text:{
    margin: heightPercentageToDP("1%"),
  },
  text_input: {
    width: widthPercentageToDP("45%"),
    height: heightPercentageToDP("4%"),
    padding: heightPercentageToDP("1%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center', 
    alignItems: 'center',
    color: WalletColors.Wblue,
    fontSize: RFValue(11),
  },
  view_input_label:{
    flexDirection:"column",
  },
  view_input_box:{
    flexDirection:"column",
    paddingTop: heightPercentageToDP("1%"),
    marginRight:heightPercentageToDP("4%")
  },
  view_input: {
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
  },
  view_lineNumber: {
    flexDirection: "column", 
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
  }
});


export default MessageBlock;
