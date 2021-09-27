/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo} from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
// import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import styles from '../lib/global_css.js';

const format = new Format();

const TableRowEditDeposit = ({header, rowData, type, rejectCallback, acceptCallback}) => {
  const [rowId, setRowId] = useStateIfMounted(rowData.rowId);
  const [amount, setAmount] = useStateIfMounted(format.separator(rowData.amount));
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
 

  useEffect(() => {
    if (header) {
      setCellOne(handleHeaderCell(rowData[0]));
      setCellTwo(handleHeaderCell(rowData[1]));
      setCellThree(handleHeaderCell(rowData[2]));
    } else {
      setRowId(rowData.rowId);
      setAmount(format.separator(rowData.amount));
      handleCell(rowData);
    }
  }, [rowData]);

  const handleHeaderCell = (cellData) => {
    let testCell = [];
    cellData.map((cell) => {
      testCell.push(
        <Text style={header ? styles.cell_text_header : styles.cell_text}>{cell}</Text>
      )
    })
    return testCell;
  }

  const handleCell = (cellData) => {
    let leftCell = [];
    let midCell = [];
    let rightCell = [];

    leftCell.push(
      <View style={{flexDirection:"row"}}>
      <View style={{flexDirection: "column"}}>
        <Text style={styles.cell_text}>{cellData.time}</Text>
        <Text style={styles.cell_text}>{cellData.HDLtime}</Text>
      </View>
    </View>
    )
    setCellOne(leftCell);
    midCell.push(
      <View style={{flexDirection:"row"}}>
        <View style={styles.table_view_column}>
          <Text style={styles.cell_text_ref}>Ref. No.</Text>
          <Text style={styles.cell_text_input}>Amount</Text>
          <Text style={styles.cell_text}>Wallet</Text>
        </View>
        <View style={{flexDirection: "column"}}>
          <View style={{flexDirection: "row"}}>
          <Text style={styles.cell_text}> : </Text>
          <Text style={styles.cell_text}>{cellData.refNo}</Text>
        </View>        
        <View style={{flexDirection: "row"}}>
          <Text style={styles.cell_text_input}> : </Text>
          <TextInput 
            style={styles.text_input}
            // onChangeText={setPinNo}
            onChangeText={text => {console.log('text', text); setAmount(format.separator(text))}}
            value={amount}
            textAlign={'left'}
            placeholderTextColor={WalletColors.grey}
            keyboardType={'numeric'}
          />
        </View>         
        <View style={{flexDirection: "row"}}>
          <Text style={styles.cell_text}> : </Text>
          <Text style={styles.cell_text}>{cellData.wallet}</Text>
         </View>    
        </View>  
      </View>       
    )
  
    setCellTwo(midCell);

    rightCell.push(
      <View style={styles.button_view}>
      <TouchableOpacity
        onPress={onReject}
      >
        <View style={styles.send_button_reject}>
          <Text style={styles.send_button_text}>
            Reject
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAccept}
      >
        <View style={styles.send_button_accept}>
          <Text style={styles.send_button_text}>
            Accept
          </Text>
        </View>
      </TouchableOpacity>
      </View>
    )
    setCellThree(rightCell);
  }

  const onReject = () => {
    console.log('onReject', rowId, amount);
    // rejectCallback(rowId, amount);
  }
  const onAccept = () => {
    console.log('onAccept', rowId, amount);
    // acceptCallback(rowId, amount);
  }

  return useMemo(() => {
    return (
      <View style={styles.table_view_rectangle}>
        <View style={styles.table_view_left}>
          <View style={styles.view_lineNumber}>
            {cellOne}
          </View>
        </View>
        <View style={styles.table_view_center}>
          <View style={styles.view_lineNumber_center}>
            {cellTwo}
          </View>
        </View>
        <View style={styles.table_view_right}>
          <View style={styles.view_lineNumber}>
            {cellThree}
          </View>
        </View>
      </View>
    );
  })

};


export default TableRowEditDeposit;
