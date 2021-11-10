/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useMemo} from 'react';
import {useStateIfMounted} from "use-state-if-mounted";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
} from 'react-native';
import {WalletColors} from "../assets/Colors.js";
import styles from '../lib/global_css.js';

const MessageBlock = ({transType, mData, lineNumber, parentReference}) => {
  const [refCode, setRefCode] = useStateIfMounted(mData.refCode);
  const [amount, setAmount] = useStateIfMounted(mData.amount);

  useEffect(() => {
    if (mData.refCode == "" && mData.amount == "") {
      setRefCode(mData.refCode);
      setAmount(mData.amount);
    }
  }, [mData]);

  const handleChange = async () => {
    let data = {
      refCode: refCode,
      amount: amount
    }
    await parentReference(data);
  }

  return useMemo(() => {
    return (
      <KeyboardAvoidingView style={styles.header}>
        <View style={styles.view_message_rectangle}>
          <View style={styles.view_message_left}>
            <View style={styles.view_lineNumber}>
              <Text style={styles.view_message_dot}>{lineNumber}. </Text>
            </View>
          </View>
          <View style={styles.view_message_right}>
            <View style={styles.view_input}>
              {transType == "Deposit" ? 
                (<View style={styles.view_message_input_label}>
                    <Text style={styles.view_message_text}>Ref. Code</Text>
                    <Text style={styles.view_message_text}>Amount</Text>
                  </View>)
                :
                (<View style={styles.view_message_input_label}>
                    <Text style={styles.view_message_text}>Mobile No.</Text>
                    <Text style={styles.view_message_text}>Amount</Text>
                  </View>)}
              <View style={styles.view_message_input_box}>
                <View style={styles.view_input}>
                  <Text style={styles.view_message_text}> : </Text>
                  <TextInput 
                    style={styles.text_message_input}
                    onChangeText={e => setRefCode(e.replace(/[^0-9]+/g, ''))}
                    value={refCode}
                    onEndEditing={handleChange}
                    inputMode="numeric"
                    keyboardType={'numeric'}
                  />
                </View>
                <View style={styles.view_input}>
                  <Text style={styles.view_message_text}> : </Text>
                  <TextInput 
                    style={styles.text_message_input}
                    onChangeText={e => setAmount(e.replace(/[^0-9]+/g, ''))}
                    value={amount}
                    onEndEditing={handleChange}
                    inputMode="numeric"
                    keyboardType={'numeric'}
                    />
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  })
};


export default MessageBlock;
