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
import { RFValue } from 'react-native-responsive-fontsize';

const TableRow = ({header, rowData}) => {
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
 

  useEffect(() => {
    setCellOne(handleCell(rowData[0]));
    setCellTwo(handleCell(rowData[1]));
    setCellThree(handleCellThree(rowData[2]));
  }, [rowData]);

  const handleCell = (cellData) => {
    let testCell = [];
    cellData.map((cell) => {
      testCell.push(
        <Text style={header ? styles.cell_text_header : styles.cell_text}>{cell}</Text>
      )
    })
    return testCell;
  }
  const handleCellThree = (cellData) => {
    let testCell = [];
    if (cellData.length) {
      if (header) {
        testCell.push(
          <Text style={styles.cell_text_header}>{cellData[0]}</Text>
        )
      } else {
        if (cellData[0] == "Accepted") {
          testCell.push(
            <Text style={styles.text_cell_wgreen}>{cellData[0]}</Text>
          )
        }
        else if (cellData[0] == "Rejected") {
          testCell.push(
            <Text style={styles.text_cell_wred}>{cellData[0]}</Text>
          )
        } else {
          testCell.push(
            <Text style={styles.text_cell_wblack}>{cellData[0]}</Text>
          )
        }
      }
    }
    return testCell;
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
    // alignItems: "center",
    // borderRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    // justifyContent: 'center',
    // alignContent: "space-between",
    // height: heightPercentageToDP("15%"),
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
    justifyContent: "center"
    // padding:widthPercentageToDP("5%")
  },
  cell_text: {
    padding: 1,
    alignSelf: "flex-start",
    fontSize: RFValue(13),
  },
  cell_text_header: {
    alignSelf: "flex-start",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  text_cell_wred: {
    fontSize: RFValue(14), 
    color: WalletColors.Wred
  },
  text_cell_wgreen: {
    fontSize: RFValue(14), 
    color: WalletColors.Wgreen
  },
  text_cell_wblack: {
    fontSize: RFValue(14), 
    color: WalletColors.black
  }
});


export default TableRow;
