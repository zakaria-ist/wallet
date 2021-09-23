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
  StatusBar,
  TextInput,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import { RFValue } from 'react-native-responsive-fontsize';
import Format from "../lib/format";
import { ScreenHeight } from 'react-native-elements/dist/helpers';

const format = new Format();
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const SummaryTableRow = ({header, rowData}) => {
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  // const isFocused = useIsFocused();
 

  useEffect(() => {
    if (header) {
      setCellOne(handleHeaderCell(rowData[0]));
      setCellTwo(handleHeaderCell(rowData[1]));
    } else {
      handleDataCell(rowData);
    }
  }, [rowData]);

  const handleHeaderCell = (cellData) => {
    let testCell = [];
    testCell.push(
      <Text style={styles.cell_text_header}>{cellData[0]}</Text> 
    )
    return testCell;
  }
  const handleDataCell = (cellData) => {
    let cellLeft = [];
    let cellRight = [];
    
    cellData.map((group) => {
      cellLeft.push(
        <View style={styles.view_sub_row}>
          <Text style={styles.cell_text_bold}>{group.group}</Text>
          <Text style={styles.cell_text_bold}>     </Text>
          <Text style={styles.cell_text_bold}>Count</Text>
          <Text style={styles.cell_text_bold}>Amount</Text>
        </View>
      )
      
      group.walletData.map((wallet) => {
        cellLeft.push(
          <View style={styles.view_sub_row}>
            <View style={styles.view_sub_column}>
              <Text style={styles.cell_text_end}>{wallet.wallet}</Text>
            </View>
            <View style={styles.view_sub_column}>
              <Text style={styles.cell_text}>:(D)</Text>
              <Text style={styles.cell_text}> :(W)</Text>
            </View>
            <View style={styles.view_sub_column}>
              <Text style={styles.cell_text_end}>{format.separator(wallet.deposit.count)}</Text>
              <Text style={styles.cell_text_end}>{format.separator(wallet.withdrawal.count)}</Text>
            </View>
            <View style={styles.view_sub_column}>
              <Text style={styles.cell_text_end}>{format.separator(wallet.deposit.amount)}</Text>
              <Text style={styles.cell_text_end}>{format.separator(wallet.withdrawal.amount)}</Text>
            </View>
          </View>
        )
      });
      cellLeft.push(
        <View style={styles.view_sub_row}>
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>Sub-Total</Text>
          </View>
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold_center}>:(D)</Text>
            <Text style={styles.cell_text_bold_center}> :(W)</Text>
          </View>
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>                  </Text>
            <Text style={styles.cell_text_bold}>                  </Text>
          </View>
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>{format.separator(group.subtotal.deposit)}</Text>
            <Text style={styles.cell_text_bold}>{format.separator(group.subtotal.withdrawal)}</Text>
          </View>
        </View>
      )
      
      setCellOne(cellLeft);
      cellRight.push(
        <Text style={styles.cell_text_bold}>{format.separator(group.total)}</Text>
      );
      setCellTwo(cellRight)
    });
    
  }

  return useMemo(() => {
    return (
      <View style={styles.view_rectangle}>
        <View style={styles.view_left}>
          <View style={styles.view_lineNumber}>
            {cellOne}
          </View>
        </View>
        <View style={styles.view_right}>
          <View style={styles.view_lineNumber}>
            {cellTwo}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignContent: "space-between",
    width: widthPercentageToDP("92%"),
    padding:heightPercentageToDP("1%"),
  },
  view_border_line:{
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
  },
  view_left: {
    flex: 3,
    justifyContent: "space-between",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
  },
  view_right: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view_lineNumber: {
    flexDirection: "column",
    justifyContent: "center",
    margin: widthPercentageToDP("1%"),
  },
  view_sub_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  view_sub_column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  cell_text_end: {
    fontSize: RFValue(14),
    alignSelf: "flex-end"
  },
  cell_text: {
    fontSize: RFValue(14),
    alignSelf: "center"
  },
  cell_text_header: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    alignSelf: "center",
  },
  cell_text_bold: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    alignSelf: "flex-end"
  },
  cell_text_bold_center: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    alignSelf: "center"
  }
});


export default SummaryTableRow;
