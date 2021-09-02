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
// import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";

const MessageBlock = ({transType, mData, lineNumber, parentReference}) => {
  const [refCode, setRefCode] = useStateIfMounted(mData.refCode);
  const [amount, setAmount] = useStateIfMounted(mData.amount);
  // const isFocused = useIsFocused();
  let data = {};
 

  useEffect(() => {
    setRefCode(mData.refCode);
    setAmount(mData.amount);
  }, [mData]);

  const handleChange = () => {
    data = {
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
                    />

                </View>
                <View style={styles.view_input}>
                    <Text>Amount    : </Text>
                    <TextInput 
                        style={styles.text_input}
                        onChangeText={setAmount}
                        value={amount}
                        textAlign={'right'}
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

const styles = StyleSheet.create({
  view_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    height: heightPercentageToDP("15%"),
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
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("5%"),
    // marginTop: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.Wblue,
    padding: 10
  },
  view_input: {
    flexDirection: "row", 
    alignItems: "center",
    padding:widthPercentageToDP("2%")
  },
  view_lineNumber: {
    flexDirection: "column", 
    // flex: 1, 
    alignItems: "center",
    justifyContent: "center"
    // padding:widthPercentageToDP("5%")
  }
});


export default MessageBlock;
