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
  useColorScheme,
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import { RFValue } from 'react-native-responsive-fontsize';
const format = new Format();

const TableRow = ({header, rowData}) => {
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
 

  useEffect(() => {
    if (header) {
      setCellOne(handleHeaderCell(rowData[0]));
      setCellTwo(handleHeaderCell(rowData[1]));
      setCellThree(handleHeaderCell(rowData[2]));
    } else {
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
      <View style={{flexDirection:"row"}}>
        <View style={{flexDirection: "column"}}>
          <Text style={styles.cell_text}>Ref. No.</Text>
          <Text style={styles.cell_text}>Amount</Text>
          <Text style={styles.cell_text}>Wallet</Text>
        </View>
        <View style={{flexDirection: "column"}}>
          <View style={{flexDirection: "row"}}>
          <Text style={styles.cell_text}> : </Text>
          <Text style={styles.cell_text}>{cellData.refNo}</Text>
        </View>        
        <View style={{flexDirection: "row"}}>
          <Text style={styles.cell_text}> : </Text>
          <Text style={styles.cell_text}>{format.separator(cellData.amount)}</Text>
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
      <View style={{flexDirection:"row"}}>
        <Text style={(cellData.status == "Accepted")? styles.text_cell_wgreen: 
        ((cellData.status == "Rejected") ? styles.text_cell_wred : 
        styles.text_cell_wblack) }>{cellData.status}</Text>
      </View>  
    )
    setCellThree(rightCell);
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
          <View style={styles.view_lineNumber}>
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
    flex:1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    width: widthPercentageToDP("85%"),
    marginBottom: heightPercentageToDP("1%"),
  },
  view_left: {
    flex: 0.7,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  view_center: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  view_right: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  text_input: {
    width: widthPercentageToDP("60%"),
    height: heightPercentageToDP("5%"),
    // marginTop: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    // justifyContent: 'center',
    color: WalletColors.Wblue,
    padding: 10,
    fontSize: RFValue(10),
  },
  view_input: {
    flexDirection: "row", 
    alignItems: "center",
    padding:widthPercentageToDP("2%")
  },
  view_lineNumber: {
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
  },
  cell_text: {
    padding: 1,
    alignSelf: "flex-start",
    fontSize: RFValue(13),
  },
  cell_text_header: {
    alignSelf: "flex-start",
    fontSize: RFValue(13),
    fontWeight: "bold",
  },
  text_cell_wred: {
    fontSize: RFValue(13), 
    color: WalletColors.Wred
  },
  text_cell_wgreen: {
    fontSize: RFValue(13), 
    color: WalletColors.Wgreen
  },
  text_cell_wblack: {
    fontSize: RFValue(13), 
    color: WalletColors.black
  }
});


export default TableRow;
