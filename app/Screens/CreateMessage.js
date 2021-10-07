/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect}  from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  Text,
  Dimensions,
  TextInput,
  useColorScheme,
  View,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import Request from "../lib/request";
import CustomAlert from "../lib/alert";

import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import MessageBlock from "../Components/MessageBlock";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";
import styles from '../lib/global_css';

const request = new Request();
const alert = new CustomAlert();
const db = firestore();

const CreateMessage = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [transType, setTransType] = useStateIfMounted("Withdrawal");
  const [token, setToken] = useStateIfMounted("");
  const [superiorAgent, setSuperiorAgent] = useStateIfMounted("");
  const [walletType, setWalletType] = useStateIfMounted(1);
  const [messageOne, setMessageOne] = useStateIfMounted({refCode: "", amount: ""});
  const [messageTwo, setMessageTwo] = useStateIfMounted({refCode: "", amount: ""});
  const [messageThree, setMessageThree] = useStateIfMounted({refCode: "", amount: ""});
  const [messageFour, setMessageFour] = useStateIfMounted({refCode: "", amount: ""});
  const [messageFive, setMessageFive] = useStateIfMounted({refCode: "", amount: ""});
  const [isModalVisible, setIsModalVisible] = useStateIfMounted(false);
  const [quickMessages, setQuickMessages] = useStateIfMounted("");
  const [walletData, setWalletData] = useStateIfMounted([]);
  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
      })
      AsyncStorage.getItem('token').then((token) => {
        setToken(token);
      })
      AsyncStorage.getItem('superiorAgent').then((superiorAgent) => {
        setSuperiorAgent(JSON.parse(superiorAgent));
      })
    })
  }, []);

  const handleLeftButton = () => {
    setTransType("Deposit");
  }

  const handleRightButton = () => {
    setTransType("Withdrawal");
  }

  const handleWalLeftButton = () => {
    setWalletType(1);
  }

  const handleWalMidButton = () => {
    setWalletType(2);
  }

  const handleWalRightButton = () => {
    setWalletType(3);
  }

  const sendMessageToAgent = async (message, url) => {
    if (token == "") {
      token = await AsyncStorage.getItem('token');
    }
    onSpinnerChanged(true);
    if (superiorAgent.username) {
      let purpose = "deposit";
      if (transType == "Withdrawal") {
        purpose = "withdrawal";
      }
      let params = JSON.stringify(
        {
          token: token, 
          receiveUsername: superiorAgent.username, 
          walletId: walletType, 
          purpose: purpose,
          refNo: message.refCode,
          mobile: message.refCode,
          amount: message.amount,
        }
      );
      if (url) {
        const result = await request.post(url, params);
        if (result.ok && result.message) {
          let agentName = result.myAgent;
          if (agentName && agentName != "") {
            const tokenDB = await getUserTokenPromise(agentName);
            console.log('agentToken', tokenDB._data.deviceId);
            const deviceId = tokenDB._data.deviceId;
            const key = 'AAAAFusuHOI:APA91bFmsoK3xCuADeTunV7kCDrI5cBTd-wXN7WTZi-_fxT0NuZtVXkxcjzzZnD_uqeuHEqZ7ojrMK0SjCrNEkWtEewfPV8DTGtAxPeQBPQs_SCZNWlntcTm3bsYVYcuVI2dOY3f1WdI';
            // message build
            let sender = result.message.fromuser + " (" + purpose + ")";
            let refNo = purpose == "deposit" ? result.message.refno ? result.message.refno : "" : "";
            let mobile = purpose == "withdrawal" ? result.message.mobile ? result.message.mobile : "" : "";
            let walletName = "";
            walletData.map((wallet) => {
              if (result.message.payment == wallet.id) {
                walletName = wallet.name;
              }
            })
            let body = "Ref No.: " + refNo + "\r\nMobile No.: " + mobile + "\r\nWallet: " + walletName + "\r\nAmount: " + result.message.amount;
            const message = {
              sender: sender,
              body: body
            };

            let params = JSON.stringify(
              {
                deviceId: deviceId, 
                message: JSON.stringify(message), 
                key: key
              }
            );
            // call the API to send push notification
            let pushUrl = request.getPushNotificationUrl();
            const results = await request.post(pushUrl, params);
            console.log('results', results);
            return true;
          }
        } else {
          onSpinnerChanged(false);
        }
        return false;
      } else {
        onSpinnerChanged(false);
      }
    } else {
      onSpinnerChanged(false);
      alert.warning("Superior Agent is missing");
    }
    onSpinnerChanged(false);
    return false;
  }

  const getUserTokenPromise = (userName) => {
    return db.collection("users")
        .doc(String(userName))
        .get()
  }

  const handleSubmit = async () => {
    let sent = false;
    const userSendMessageUrl = request.getUserSendMessageUrl();
    if (messageOne.refCode != "" && messageOne.amount != "") {
      sent = await sendMessageToAgent(messageOne, userSendMessageUrl);
    }
    if (messageTwo.refCode != "" && messageTwo.amount != "") {
      sent = await sendMessageToAgent(messageTwo, userSendMessageUrl);
    }
    if (messageThree.refCode != "" && messageThree.amount != "") {
      sent = await sendMessageToAgent(messageThree, userSendMessageUrl);
    }
    if (messageFour.refCode != "" && messageFour.amount != "") {
      sent = await sendMessageToAgent(messageFour, userSendMessageUrl);
    }
    if (messageFive.refCode != "" && messageFive.amount != "") {
      sent = await sendMessageToAgent(messageFive, userSendMessageUrl);
    }

    if (sent) {
      onSpinnerChanged(false);
      alert.info("Messages have been sent.");
      let data = {
        refCode: "",
        amount: ""
      }
      setMessageOne(data);
      setMessageTwo(data);
      setMessageThree(data);
      setMessageFour(data);
      setMessageFive(data);
    } else {
      onSpinnerChanged(false);
    }
  }

  const handleQuickInsert = () => {
    setIsModalVisible(!isModalVisible);
    setQuickMessages("");
  }

  const handleConfirmInsert = () => {
    setIsModalVisible(!isModalVisible);
    var lines = quickMessages.split(/[\n\r]+/);
    lines.map((line, index) => {
      let messages = line.replace('==', ',').replace('=', ',').replace('--', ',').replace('-', ',');
      let blocks = messages.split(',');
      if (blocks.length && blocks[0] != "" && blocks[1] != "") {
        try{
          let code = blocks[0].trim();
          let amount = blocks[1].trim();
          let data = {
            refCode: code,
            amount: amount
          }
          if (index == 0) setMessageOne(data);
          else if (index == 1) setMessageTwo(data);
          else if (index == 2) setMessageThree(data);
          else if (index == 3) setMessageFour(data);
          else if (index == 4) setMessageFive(data);
        } catch (e) {
          
        }
      }
    })
  }

  const handleMessageOne = (data) => {
    console.log('handleMessageOne', data);
    setMessageOne(data);
  }
  
  const handleMessageTwo = (data) => {
    console.log('handleMessageTwo', data);
    setMessageTwo(data);
  }

  const handleMessageThree = (data) => {
    console.log('handleMessageThree', data);
    setMessageThree(data);
  }

  const handleMessageFour = (data) => {
    console.log('handleMessageFour', data);
    setMessageFour(data);
  }

  const handleMessageFive = (data) => {
    console.log('handleMessageFive', data);
    setMessageFive(data);
  }

  return (
    <SafeAreaView style={styles.header}>
      <KeyboardAvoidingView style={styles.header}
      behavior={Platform.OS === "ios" ? "padding" : "absolute"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      enabled={true}>   
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Spinner
        visible={spinner}
        // textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.header}>
        <CustomHeader title={"Create Message"}/>
        <View style={styles.message_nav_top}>
          <CommonTop
            admin={false}
            LeftButton={LeftButton}
            RightButton={RightButton}
            handleLeftButton={handleLeftButton}
            handleRightButton={handleRightButton}
            handleWalLeftButton={handleWalLeftButton}
            handleWalMidButton={handleWalMidButton}
            handleWalRightButton={handleWalRightButton}
          />
        </View>
        </View>
        <View style={{flex:0.3}}>
        <View style={styles.message_quick_insert}>
          <TouchableOpacity
            style={styles.insert_button}
            onPress={handleQuickInsert}
          >
            <Text style={styles.insert_button_text}>
              Quick Insert
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        <View
          style={styles.create_message_body}>
          <FlatList data={[{key: 'item1' }]}
           style={{height: heightPercentageToDP("57%")}}
           renderItem={() => (
            <TouchableOpacity>
              <View style={styles.header}>
                <MessageBlock transType={transType} mData={messageOne} lineNumber={1} key={"lineNumber1"} parentReference={handleMessageOne} />
                <MessageBlock transType={transType} mData={messageTwo} lineNumber={2} key={"lineNumber2"} parentReference={handleMessageTwo} />
                <MessageBlock transType={transType} mData={messageThree} lineNumber={3} key={"lineNumber3"} parentReference={handleMessageThree} />
                <MessageBlock transType={transType} mData={messageFour} lineNumber={4} key={"lineNumber4"} parentReference={handleMessageFour} />
                <MessageBlock transType={transType} mData={messageFive} lineNumber={5} key={"lineNumber5"} parentReference={handleMessageFive} />
              </View>
            </TouchableOpacity>)}
          />
          <TouchableOpacity
            onPress={handleSubmit}
          >
            <View style={styles.sumbit_button}>
              <Text style={styles.sumbit_confirm_text}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
    
      <Modal 
          isVisible={isModalVisible}
          // onBackdropPress={handleQuickInsert}
        >
          <KeyboardAvoidingView
            style={{flex: 1}}
          >
          <View style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View styles={styles.modal_header}>
                  <Text style={styles.modal_title}>Data Insert</Text>
                  <TouchableOpacity
                    style={styles.modal_close}
                    onPress={() => {
                      handleQuickInsert()
                    }}
                  >
                      <Fontisto name="close" color={WalletColors.red} size={heightPercentageToDP("3.5%")} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholderTextColor="gray"
                  backgroundColor="white"
                  placeholder="Please insert only upto 5 messages only"
                  maxLength={300}
                  multiline={true}
                  value={quickMessages}
                  onChangeText={(value) => {
                    setQuickMessages(value.replace(/[^/\r/\n/\s0-9,=-]/g, ''));
                  }}
                  textAlignVertical="top"
                  style={styles.modal_text_input}
                ></TextInput>
                <TouchableOpacity
                  style={styles.confirm}
                  onPress={() => {
                    handleConfirmInsert()
                  }}
                >
                  <Text style={styles.sumbit_confirm_text}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default CreateMessage;
