/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useMemo} from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
// import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import styles from '../lib/global_css.js';
import { RFValue } from 'react-native-responsive-fontsize';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const format = new Format();
const request = new Request();
const alert = new CustomAlert();

const TableRowEditWithdra = ({rowData}) => {
  const [token, setToken] = useStateIfMounted("");
  const [rowId, setRowId] = useStateIfMounted(rowData.id);
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
  
  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      setToken(token);
    });

    setRowId(rowData.id);
    handleCell(rowData);
  }, [rowData]);
  
  const ctime = ((cellData) => {
    return cellData.HDLTime == "";
  }
  );

  const handleCell = (cellData) => {
    let leftCell = [];
    let midCell = [];
    let rightCell = [];

    leftCell.push(
      <View style={{flexDirection:"row"}}> 
        <View style={{flexDirection: "column"}}>
          {cellData.hasOwnProperty("Header") ? 
            <>
              <Text style={styles.cell_text_header}>{cellData.Time}</Text>
              <Text style={styles.cell_text_header}>{cellData.HDLTime}</Text>
            </>
          :
            <>
            {ctime ? <Text style={styles.cell_text}>{cellData.time}</Text> :
              <>
                <Text style={styles.cell_text}>{cellData.time}</Text>
                <Text style={styles.cell_text}>{cellData.HDLtime}</Text>
              </>
            }
            </>
          }
        </View>
    </View>
    )
    setCellOne(leftCell);
    
    midCell.push(
      <View style={{flexDirection:"row"}}>
        <View style={styles.table_view_column}>
          {cellData.hasOwnProperty("Header") ? 
            (<Text style={styles.cell_text_header}>{cellData.Message}</Text>) 
          : 
            <>
              <Text style={styles.cell_text_pin}>Pin No.</Text>
              <Text style={styles.cell_text}>Amount</Text>
              <Text style={styles.cell_text}>Wallet</Text>
              <Text style={styles.cell_text}>Mobile No.</Text>
            </>
          }
        </View>
        {cellData.hasOwnProperty("Header") ? <></> :
          <View style={{flexDirection: "column"}}>
            <View style={{flexDirection: "row"}}>
              <Text style={styles.cell_text_input_colon}> : </Text>
              <TextInput 
                style={styles.text_input}
                onChangeText={pinNo => { rowData.pinNo = pinNo; handleCell(rowData); }}
                value={rowData.pinNo}
                textAlign={'left'}
                placeholderTextColor={WalletColors.grey}
                keyboardType={'numeric'}
              />
            </View>        
            <View style={{flexDirection: "row"}}>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text}>{format.separator(cellData.amount)}</Text>
            </View>         
            <View style={{flexDirection: "row"}}>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text}>{cellData.wallet}</Text>
            </View>         
            <View style={{flexDirection: "row"}}>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text}>{cellData.mobile}</Text>
            </View>         
          </View>
        }
      </View>
    )
    setCellTwo(midCell);

    if (cellData.hasOwnProperty("Header")) {
      rightCell.push(
      <Text style={styles.cell_text_header}>{cellData.Status}</Text>
      );
    }
    else if (rowData.sent) {
      rightCell.push([]);
    } else {
      rightCell.push(
        <TouchableOpacity
          onPress={ () => alert.ask('Are you sure?', ()=>{ onSend(); }) }
        >
          <View style={styles.send_button}>
            <Text style={styles.send_button_text}>
              Send
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
    setCellThree(rightCell);
  }

  const onSend = async () => {
    const sendUrl = request.getAgentReplyMessageUrl();
    let params = JSON.stringify(
      {
        token: token,
        action: 'sent',
        message_id: rowData.rowId, 
        amount: rowData.amount,
        pinNo: rowData.pinNo
      }
    );

    const result = await request.post(sendUrl, params);
    console.log('result', result);
    if (result.ok) {
      rowData['sent'] = true;
      handleCell(rowData);
    }
  }

  return useMemo(() => {
    return (
      <KeyboardAvoidingView style={styles.header}
      //behavior='padding' 
     // behavior={Platform.OS === "ios" ? "position" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      enabled={true}>  
      <View style={styles.table_view_rectangle}>
        <View style={styles.table_view_left}>
          <View style={styles.view_lineNumber}>
            {cellOne}
          </View>
        </View>
        <View style={styles.table_view_center}>
          <View style={styles.view_lineNumber_center}>
            {cellTwo}
          </View>
        </View>
        <View style={styles.table_view_right}>
          <View style={styles.view_lineNumber}>
            {cellThree}
          </View>
        </View>
      </View>
     </KeyboardAvoidingView> 
    );
  })
};


export default TableRowEditWithdra;
