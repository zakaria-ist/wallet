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
import { RFValue } from 'react-native-responsive-fontsize';

const TableRow = ({header, rowData}) => {
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
  // const isFocused = useIsFocused();
  let data = {};
 

  useEffect(() => {
    setCellOne(handleCell(rowData[0]));
    setCellTwo(handleCell(rowData[1]));
    setCellThree(handleCellThree(rowData[2]));
  }, [rowData]);

  const handleCell = (cellData) => {
    let testCell = [];
    for(let i=0; i<cellData.length; i++) {
      testCell.push(
        <Text style={header ? styles.cell_text_header : styles.cell_text}>{cellData[i]}</Text>
      )
    }
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
            <Text style={{color: WalletColors.Wgreen}}>{cellData[0]}</Text>
          )
        }
        else if (cellData[0] == "Rejected") {
          testCell.push(
            <Text style={{color: WalletColors.Wred}}>{cellData[0]}</Text>
          )
        } else {
          testCell.push(
            <Text style={{color: WalletColors.black}}>{cellData[0]}</Text>
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
                    {/* <Text style={header ? styles.cell_text_header : styles.cell_text}>{cellOne}</Text> */}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view_right: {
    flex: 1,
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
  },
  cell_text: {
    fontSize: RFValue(14),
  },
  cell_text_header: {
    fontSize: RFValue(14),
    fontWeight: "bold"
  }
});


export default TableRow;
