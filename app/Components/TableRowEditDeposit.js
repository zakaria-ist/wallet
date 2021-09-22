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
  TouchableOpacity
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";
import Format from "../lib/format";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import AsyncStorage from "@react-native-community/async-storage";
import { RFValue } from 'react-native-responsive-fontsize';

const format = new Format();
const request = new Request();
const alert = new CustomAlert();

const TableRowEditDeposit = ({header, rowData, type, rejectCallback, acceptCallback}) => {
  const [token, setToken] = useStateIfMounted("");
  const [rowId, setRowId] = useStateIfMounted(rowData.rowId);
  const [amount, setAmount] = useState('');
  const [cellOne, setCellOne] = useStateIfMounted([]);
  const [cellTwo, setCellTwo] = useStateIfMounted([]);
  const [cellThree, setCellThree] = useStateIfMounted([]);
 

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      setToken(token);
    });
    if (header) {
      setCellOne(handleHeaderCell(rowData[0]));
      setCellTwo(handleHeaderCell(rowData[1]));
      setCellThree(handleHeaderCell(rowData[2]));
    } else {
      setRowId(rowData.rowId);
      rowData.amount = format.separator(String(rowData.amount).split(',').join(''));
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
      <Text style={styles.cell_text}>Ref. No.   : {cellData.refNo}</Text>
    )
    midCell.push(
      <View style={styles.view_input}>
        <Text style={{fontSize: RFValue(13)}}>Amount   : </Text>
        <TextInput 
          style={styles.text_input}
          onChangeText={amount => { 
            rowData.amount = format.separator(String(amount).split(',').join('')); 
            handleCell(rowData); 
          }}
          value={rowData.amount}
          textAlign={'right'}
          placeholderTextColor={WalletColors.grey}
          keyboardType={'numeric'}
        />
      </View>
    )
    midCell.push(
        <Text style={styles.cell_text}>Wallet      : {cellData.wallet}</Text>

    )
    
    setCellTwo(midCell);

    if (rowData.sent) {
      rightCell.push([]);
    } else {
      rightCell.push(
        <View style={styles.button_view}>
        <TouchableOpacity
          onPress={onReject}
        >
          <View style={styles.reject_button}>
            <Text style={styles.send_button_text}>
              Reject
            </Text>
          </View>
        </TouchableOpacity>
        </View>
      )
      rightCell.push(
        <View style={styles.button_view}>
        <TouchableOpacity
          onPress={onAccept}
        >
          <View style={styles.accept_button}>
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
        token: token,
        action: action,
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

const styles = StyleSheet.create({
  view_rectangle: {
    flexDirection: "row", 
    alignItems: "center",
    // borderRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.black,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignContent: "space-between",
    // height: heightPercentageToDP("15%"),
    width: widthPercentageToDP("85%"),
    marginBottom: heightPercentageToDP("1%"),
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
    alignItems: "flex-end",
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
    flexDirection: "row", 
    alignItems: "center",
  },
  view_lineNumber: {
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center"
  },
  view_lineNumber_center: {
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: heightPercentageToDP("1%"),
  },
  cell_text: {
    alignSelf: "flex-start",
    textAlign: "left",
    fontSize: RFValue(13),
  },
  cell_text_header: {
    alignSelf: "flex-start",
    fontSize: RFValue(14),
    fontWeight: "bold"
  },
  button_view: {
    paddingTop: heightPercentageToDP("1%"),
    paddingBottom: heightPercentageToDP("1%"),
  },
  reject_button: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("-1%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.red,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.red,
    alignItems: 'center'
  },
  accept_button: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("4%"),
    marginTop: heightPercentageToDP("-1%"),
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


export default TableRowEditDeposit;
