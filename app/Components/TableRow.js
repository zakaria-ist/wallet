/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo} from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
import {
  View,
  Text,
} from 'react-native';
import Format from "../lib/format";
import styles from '../lib/global_css.js';

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
      <View style={styles.table_view_rectangle}>
        <View style={styles.table_view_left}>
          <View style={styles.view_lineNumber}>
            {cellOne}
          </View>
        </View>
        <View style={styles.table_view_center}>
          <View style={styles.view_lineNumber}>
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


export default TableRow;
