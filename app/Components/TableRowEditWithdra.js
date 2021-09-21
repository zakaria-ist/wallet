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
  Dimensions,
  PixelRatio,
  useColorScheme,
  TouchableOpacity
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import { RFValue } from 'react-native-responsive-fontsize';

const format = new Format();

const TableRowEditWithdra = ({header, rowData, type, sendCallback}) => {
  const [rowId, setRowId] = useStateIfMounted(rowData.rowId);
  const [pinNo, setPinNo] = useStateIfMounted("");
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
      // setPinNo(String(rowData.rowId));
      handleCell(rowData);
    }
  }, [rowData]);

  const handleChange = () => {
    console.log('handleChange', 'pinNo', pinNo);
  }

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
      <View style={styles.view_input}>
        <Text style={{fontSize: RFValue(13)}}>Pin No.      :  </Text>
        <TextInput 
          style={styles.text_input}
          onChangeText={setPinNo}
          // onChangeText={text => {console.log('text', text); setPinNo(String(text))}}
          value={pinNo}
          textAlign={'left'}
          placeholderTextColor={WalletColors.grey}
          keyboardType={'numeric'}
          onBlur={handleChange}
        />
      </View>
    )
    midCell.push(
      <Text style={styles.cell_text}>Amount      :  {format.separator(cellData.amount)}</Text>
    )
    midCell.push(
      <Text style={styles.cell_text}>Wallet         :  {cellData.wallet}</Text>
    )
    midCell.push(
      <Text style={styles.cell_text}>Mobile No. :  {cellData.mobile}</Text>
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
    console.log('send', rowId, pinNo);
    // sendCallback(rowId, pinNo);
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  view_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
     borderRadius: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    justifyContent: "flex-start",
    alignContent: "space-between",
    // height: heightPercentageToDP("15%"),
    width: widthPercentageToDP("85%"),
    marginBottom: heightPercentageToDP("2%"),
    //height: heightPercentageToDP("63%"),
  },
  view_left: {
    flex: 0.9,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  view_center: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  view_right: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text_input: {
    width: heightPercentageToDP("10%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 6,
    padding: 3,
    textAlign: "left",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    //justifyContent: "flex-start",
    color: WalletColors.Wblue,
    fontSize: RFValue(10),
  },
  view_input: {
   // alignItems: "flex-start",
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
    textAlign: "left",
    alignSelf: "flex-start",
    fontSize: RFValue(13),
  },
  cell_text_header: {
    alignSelf: "flex-start",
    fontSize: RFValue(14),
    fontWeight: "bold"
  },
  send_button: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("-2%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
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


export default TableRowEditWithdra;
