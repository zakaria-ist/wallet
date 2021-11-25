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
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP,
} from "react-native-responsive-screen";
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import styles from '../lib/global_css.js';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import AsyncStorage from "@react-native-community/async-storage";
import { RFValue } from 'react-native-responsive-fontsize';

const format = new Format();
const request = new Request();
const alert = new CustomAlert();

let authToken = "";

const TableRowEditDeposit = ({rowData, parentRefresh, resetBadgeCount}) => {
  const [rowId, setRowId] = useStateIfMounted(rowData.id);
  const [amount, setAmount] = useState('');
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
 

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      authToken = token;
    });
    
    setRowId(rowData.id);
    rowData.amount = format.separator(String(rowData.amount).split(',').join(''));
    handleCell(rowData);
  }, [rowData]);

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
            <Text style={styles.cell_text}>{cellData.time}</Text>
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
              {/* <Text style={styles.cell_text_ref}>Ref. No.</Text>
              <Text style={styles.cell_text_input}>Amount</Text> */}
              {/* <Text style={styles.cell_text}>Wallet</Text> */}
            </>
          }
        </View>
        {cellData.hasOwnProperty("Header") ? <></> :
          <View style={{flexDirection: "column"}}>
            <View style={{flexDirection: "row", flex: 1, flexWrap: 'wrap'}}>
              <Text style={styles.cell_text}>Ref. No.</Text>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text_value}>{cellData.refNo}</Text>
            </View>        
            <View style={{flexDirection: "row", flex: 1, flexWrap: 'wrap'}}>
              <Text style={styles.cell_text_input}>Amount</Text>
              <Text style={styles.cell_text_input}> : </Text>
              <TextInput 
                style={styles.text_input}
                onChangeText={amount => { 
                  rowData.amount = format.separator(String(amount).split(',').join('')); 
                  handleCell(rowData); 
                }}
                value={rowData.amount}
                textAlign={'left'}
                placeholderTextColor={WalletColors.grey}
                keyboardType={'numeric'}
              />
            </View>
            <View style={{flexDirection: "row", flex: 1, flexWrap: 'wrap'}}>
              <Text style={styles.cell_text}>User</Text>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text_value}>{cellData.user}</Text>
            </View>           
            {/* <View style={{flexDirection: "row"}}>
              <Text style={styles.cell_text}> : </Text>
              <Text style={styles.cell_text}>{cellData.wallet}</Text>
            </View>     */}
          </View>
        }
      </View>       
    )
    setCellTwo(midCell);

    if (cellData.hasOwnProperty("Header")) {
      rightCell.push(<Text style={styles.cell_text_header}>{cellData.Status}</Text>);
    }
    else if (rowData.sent) {
      rightCell.push([]);
    } else {
      rightCell.push(
        <View style={styles.button_view}>
          <TouchableOpacity
            onPress={onReject}
          >
            <View style={styles.send_button_reject}>
              <Text style={styles.send_button_text}>
                Reject
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
          >
            <View style={styles.send_button_accept}>
              <Text style={styles.send_button_text}>
                Accept
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    setCellThree(rightCell);
  }

  const onReject = () => {
    alert.ask('Are you sure, you want to reject?', ()=>{
      onSend('reject');
    })
  }

  const onAccept = () => {
    alert.ask('Are you sure, you want to accept?', ()=>{
      onSend('accept');
    })
  }

  const onSend = async (action) => {
    const sendUrl = request.getAgentReplyMessageUrl();
    let params = JSON.stringify(
      {
        token: authToken,
        action: action,
        messageId: rowData.id, 
        amount: String(rowData.amount).replace(",", ""),
        pinNo: rowData.pinNo
      }
    );

    const result = await request.post(sendUrl, params);
    console.log('result', result);
    if (result.ok) {
      rowData['sent'] = true;
      handleCell(rowData);
      resetBadgeCount();
      setTimeout(() => {
        // parentRefresh();
      }, 100);
    }
  }

  return useMemo(() => {
    return (
      <KeyboardAvoidingView 
        enabled={true}
        style={styles.header}
      >
        {rowData['sent'] == false ? 
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
        :
          <></>
        }
    </KeyboardAvoidingView>
    );
  })

};


export default TableRowEditDeposit;
