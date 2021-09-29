/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo} from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
import {

  View,
  Text,
  TextInput,
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import styles from '../lib/global_css.js';

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
      <View style={styles.view_message_rectangle}>
        <View style={styles.view_message_left}>
          <View style={styles.view_lineNumber}>
            <Text style={styles.view_message_text}>{lineNumber}. </Text>
          </View>
        </View>
        <View style={styles.view_message_right}>
          {transType == "Deposit" ? (
            <View style={styles.view_input}>
              <View style={styles.view_message_input_label}>
                <Text style={styles.view_message_text}>Ref. Code</Text>
                <Text style={styles.view_message_text}>Amount</Text>
              </View>
              <View style={styles.view_message_input_box}>
                <View style={styles.view_input}>
                  <Text style={styles.view_message_text}> : </Text>
                  <TextInput 
                  style={styles.text_message_input}
                  onChangeText={setRefCode}
                  value={refCode}
                  onBlur={handleChange}
                  placeholderTextColor={WalletColors.grey}
                  keyboardType={'numeric'}
                />
                </View>
                <View style={styles.view_input}>
                  <Text style={styles.view_message_text}> : </Text>
                  <TextInput 
                    style={styles.text_message_input}
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
                <View style={styles.view_message_input_label}>
                  <Text style={styles.view_message_text}>Mobile No.</Text>
                  <Text style={styles.view_message_text}>Amount</Text>
                </View> 
                <View style={styles.view_message_input_box}>
                <View style={styles.view_input}>
                    <Text style={styles.view_message_text}> : </Text>
                    <TextInput 
                    style={styles.text_message_input}
                    onChangeText={setRefCode}
                    value={refCode}
                    onBlur={handleChange}
                    placeholderTextColor={WalletColors.grey}
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.view_input}>
                  <Text style={styles.view_message_text}> : </Text>
                  <TextInput 
                    style={styles.text_message_input}
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


export default MessageBlock;
