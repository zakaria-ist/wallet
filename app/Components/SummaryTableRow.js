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
import Screensize from '../lib/screensize.js';

const format = new Format();
const screensize = new Screensize();
const smallwidth = screensize.getSmallScreen() ? styles.text_ss_width : mediumwidth;
const mediumwidth = screensize.getMediumScreen() ? styles.text_ms_width : largewidth;
const largewidth = screensize.getLargeScreen() ? styles.text_ls_width : smallwidth;
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
          <Text style={styles.cell_text_bold}>{group.group}</Text>
          <Text style={styles.cell_text_bold}>     </Text>
          <Text style={styles.cell_text_bold}>Count</Text>
          <Text style={styles.cell_text_bold}>Amount</Text>
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
                    <Text style={styles.cell_text_end}>{wallet.wallet}</Text>
                  </View>
                  <View style={styles.view_sub_column}>
                    <View style={styles.view_sub_sub_row}>
                      <Text style={styles.cell_text}>:</Text>
                      <Text style={styles.cell_text}>(D)</Text>
                    </View>
                    <View style={styles.view_sub_sub_row}>
                      <Text style={styles.cell_text}>:</Text>
                      <Text style={styles.cell_text}>(W)</Text> 
                    </View>
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
              </View>
            )
          })}
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>Sub-Total</Text>
          </View>
          <View style={smallwidth || mediumwidth || largewidth}>
            <View style={styles.view_sub_sub_row}>
              <Text style={styles.cell_text_bold_start}>:</Text>
              <Text style={styles.cell_text_bold_start}>(D)</Text>
            </View>
            <View style={styles.view_sub_sub_row}>
              <Text style={styles.cell_text_bold_start}>:</Text>
              <Text style={styles.cell_text_bold_start}>(W)</Text>
            </View>
          </View> 
          <View style={styles.view_sub_column}>
            <Text style={styles.cell_text_bold}>{format.separator(group.subtotal.deposit)}</Text>
            <Text style={styles.cell_text_bold}>{format.separator(group.subtotal.withdrawal)}</Text>
          </View>
        </View>
      </View>
    )
    setCellOne(cellLeft);

    cellRight.push(
      <Text style={styles.cell_text_bold}>{format.separator(group.total)}</Text>
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
          <View style={styles.view_summary_lineNumber}>
            {cellTwo}
          </View>
        </View>
      </View> 
    );
  })
};


export default SummaryTableRow;
