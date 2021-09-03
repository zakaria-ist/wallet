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
  TouchableOpacity
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import { RFValue } from 'react-native-responsive-fontsize';
const format = new Format();

const TableRowEditable = ({header, rowData, type, sendCallback}) => {
  const [rowId, setRowId] = useStateIfMounted('');
  const [pinNo, setPinNo] = useStateIfMounted('');
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
  // const isFocused = useIsFocused();
  let data = {};
 

  useEffect(() => {
    if (header) {
      setCellOne(handleHeaderCell(rowData[0]));
      setCellTwo(handleHeaderCell(rowData[1]));
      setCellThree(handleHeaderCell(rowData[2]));
    } else {
      setRowId(rowData.rowId);
      handleCell(rowData);
    }
  }, [rowData]);

  const handleHeaderCell = (cellData) => {
    let testCell = [];
    for(let i=0; i<cellData.length; i++) {
      testCell.push(
        <Text style={header ? styles.cell_text_header : styles.cell_text}>{cellData[i]}</Text>
      )
    }
    return testCell;
  }

  const handleCell = (cellData) => {
    let leftCell = [];
    let midCell = [];
    let rightCell = [];

    leftCell.push(
      <Text style={styles.cell_text}>{cellData.time}</Text>
    )
    setCellOne(leftCell);

    midCell.push(
      <View style={styles.view_input}>
          <Text>Pin No.         : </Text>
          <TextInput 
              style={styles.text_input}
              onChangeText={setPinNo}
              value={pinNo}
              textAlign={'left'}
              placeholderTextColor={WalletColors.grey}
          />

      </View>
    )
    midCell.push(
      <Text style={styles.cell_text}>Amount      : {format.separator(cellData.amount)}</Text>
    )
    midCell.push(
      <Text style={styles.cell_text}>Wallet         : {cellData.wallet}</Text>
    )
    midCell.push(
      <Text style={styles.cell_text}>Mobile No. : {cellData.mobile}</Text>
    )
    setCellTwo(midCell);

    rightCell.push(
      <TouchableOpacity
        onPress={onSend}
      >
        <View style={styles.send_button}>
          <Text style={styles.send_button_text}>
            Send
          </Text>
        </View>
      </TouchableOpacity>
    )
    setCellThree(rightCell);
  }

  const onSend = () => {
    sendCallback(id, pin);
  }

  return useMemo(() => {
    return (
        <View style={styles.view_rectangle}>
            <View style={styles.view_left}>
                <View style={styles.view_lineNumber}>
                    {/* <Text style={header ? styles.cell_text_header : styles.cell_text}>{cellOne}</Text> */}
                    {cellOne}
                </View>
            </View>
            <View style={styles.view_center}>
                <View style={styles.view_lineNumber_center}>
                    {cellTwo}
                </View>
            </View>
            <View style={styles.view_right}>
                <View style={styles.view_lineNumber}>
                    {cellThree}
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
    // borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignContent: "space-between",
    // height: heightPercentageToDP("15%"),
    width: widthPercentageToDP("85%"),
    marginBottom: heightPercentageToDP("2%"),
  },
  view_left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view_center: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  view_right: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text_input: {
    width: widthPercentageToDP("25%"),
    height: heightPercentageToDP("3%"),
    // marginTop: heightPercentageToDP("4%"),
    borderRadius: 10,
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
    // padding:widthPercentageToDP("2%")
  },
  view_lineNumber: {
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center"
  },
  view_lineNumber_center: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingBottom: heightPercentageToDP("1%"),
  },
  cell_text: {
    fontSize: RFValue(13),
  },
  cell_text_header: {
    fontSize: RFValue(14),
    fontWeight: "bold"
  },
  send_button: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("2%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignItems: 'center'
  },
  send_button_text: {
    color: WalletColors.white,
    fontSize: RFValue(10)
  },
});


export default TableRowEditable;
