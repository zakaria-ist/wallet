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
      <Text style={styles.cell_text}>{cellData.time}</Text>
    )
    setCellOne(leftCell);

    midCell.push(
      <Text style={styles.cell_text}>Ref. No.  : {cellData.refNo}</Text>
    )
    midCell.push(
      <View style={styles.view_input}>
          <Text>Amount  : </Text>
          <TextInput 
              style={styles.text_input}
              // onChangeText={setPinNo}
              onChangeText={text => {console.log('text', text); setAmount(format.separator(text))}}
              value={amount}
              textAlign={'right'}
              placeholderTextColor={WalletColors.grey}
              keyboardType={'numeric'}
          />

      </View>
    )
    midCell.push(
      <Text style={styles.cell_text}>Wallet    : {cellData.wallet}</Text>
    )
    
    setCellTwo(midCell);

    rightCell.push(
      <View style={styles.button_view}>
      <TouchableOpacity
        onPress={onReject}
      >
        <View style={styles.send_button}>
          <Text style={styles.send_button_text}>
            Reject
          </Text>
        </View>
      </TouchableOpacity>
      </View>
    )
    rightCell.push(
      <View style={styles.button_view}>
      <TouchableOpacity
        onPress={onAccept}
      >
        <View style={styles.send_button}>
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
        <View style={styles.view_rectangle}>
            <View style={styles.view_left}>
                <View style={styles.view_lineNumber}>
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
    width: widthPercentageToDP("18%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    color: WalletColors.Wblue,
    fontSize: RFValue(10),
  },
  view_input: {
    flexDirection: "row", 
    alignItems: "center",
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
  button_view: {
    paddingTop: heightPercentageToDP("1%"),
    paddingBottom: heightPercentageToDP("1%"),
  },
  send_button: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("-1%"),
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


export default TableRowEditDeposit;
