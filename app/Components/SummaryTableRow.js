/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect, useMemo} from 'react';
import {useStateIfMounted} from "use-state-if-mounted";
import {View, Text} from 'react-native';
import Format from "../lib/format";
import styles from '../lib/global_css.js';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const format = new Format();

const SummaryTableRow = ({rowData}) => {
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);

  useEffect(() => {
    if (rowData.hasOwnProperty("Header")) {
      handleHeaderCell(rowData);
    } else {
      handleDataCell(rowData);
    }
  }, [rowData]);

    const handleHeaderCell = (group) => {
      let cellLeft = [];
      let cellRight = [];
      cellLeft.push(
        <Text style={styles.cell_summary_text_header}>{group.Group}</Text>
      )
      setCellOne(cellLeft);
      cellRight.push(
        <Text style={styles.cell_summary_text_header}>{group.Total}</Text>
      )
      setCellTwo(cellRight);
    }

  const handleDataCell = (group) => {
    let cellLeft = [];
    let cellRight = [];
    cellLeft.push(
      <View style={styles.view_summary_border_line}>
        <View style={styles.view_sub_row}>
          <Text style={styles.cell_text_bold_start}>{group.group}</Text>
          <Text style={styles.cell_text_bold_center_sub}></Text>
          <Text style={styles.cell_text_bold_center}>Count</Text>
          <Text style={styles.cell_text_bold_end}>Amount</Text>
        </View> 
      </View>
    )

    cellLeft.push(
      <View style={styles.view_summary_border_line}>
        <View style={styles.view_sub_row}>
          {group.walletData.map((wallet) => {
            cellLeft.push(
              <View style={styles.view_summary_border_line}>
                <View style={styles.view_sub_row}>
                  <View style={styles.view_sub_column}>
                  <Text style={styles.cell_text_start}>{wallet.wallet}</Text>
                  </View> 
                  <View style={{flex:1, alignSelf:"flex-start"}}>
                    <View style={styles.view_sub_sub_row}>
                      <Text style={styles.cell_text_start}>:</Text>
                      <Text style={styles.cell_text_start}>(D)</Text>
                    </View>
                    <View style={styles.view_sub_sub_row}>
                      <Text style={styles.cell_text_start}>:</Text>
                      <Text style={styles.cell_text_start}>(W)</Text> 
                    </View>
                  </View>
                  <View style={{alignSelf:"flex-end"}}>
                    <Text style={styles.cell_text_center}>{format.separator(wallet.deposit.count)}</Text>
                    <Text style={styles.cell_text_center}>{format.separator(wallet.withdrawal.count)}</Text>
                  </View> 
                  <View style={{flex:1.5}}>
                    <Text style={styles.cell_text_end}>{format.separator(wallet.deposit.amount)}</Text>
                    <Text style={styles.cell_text_end}>{format.separator(wallet.withdrawal.amount)}</Text>
                  </View>
                </View>
              </View>
            )
          })}
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>Sub-Total</Text>
          </View>
          <View style={styles.view_sub_column}>
          <View style={{flex:1, alignSelf:"flex-start"}}>
            <View style={styles.view_sub_sub_row}>
              <Text style={styles.cell_text_bold}>:</Text>
              <Text style={styles.cell_text_bold}>(D)</Text>
            </View>
            <View style={styles.view_sub_sub_row}>
              <Text style={styles.cell_text_bold}>:</Text>
              <Text style={styles.cell_text_bold}>(W)</Text>
            </View>
            </View>
          </View> 
          <View style={{flex:1.6}}>
            <Text style={styles.cell_text_bold_end}>{format.separator(group.subtotal.deposit)}</Text>
            <Text style={styles.cell_text_bold_end}>{format.separator(group.subtotal.withdrawal)}</Text>
          </View>
        </View>
      </View>
    )
    setCellOne(cellLeft);

    cellRight.push(
      <Text style={styles.cell_text_bold_end}>{format.separator(group.total)}</Text>
    );
    setCellTwo(cellRight);
  }

  return useMemo(() => {
    return (
      <View style={styles.view_summary_rectangle}>
        <View style={styles.view_summary_left}>
          <View style={styles.view_summary_lineNumber}>
            {cellOne}
          </View>
        </View>
        <View style={styles.view_summary_right}>
            {cellTwo}
        </View>
      </View> 
    );
  })
};


export default SummaryTableRow;
