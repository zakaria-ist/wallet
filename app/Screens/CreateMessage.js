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
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import {heightPercentageToDP} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { useStateIfMounted } from "use-state-if-mounted";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import CustomHeader from "../Components/CustomHeader";
import CommonTop from "../Components/CommonTop";
import MessageBlock from "../Components/MessageBlock";
import { WalletColors } from "../assets/Colors.js";
import styles from '../lib/global_css';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const request = new Request();
const alert = new CustomAlert();
const db = firestore();
let notiMessages = [];

const CreateMessage = () => {
  const isFocused = useIsFocused();
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
  const [agentDeviceId, setAgentDeviceId] = useStateIfMounted(null);
  const [disable, setDisable] = React.useState(false);
  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      //clear all auto refresh
      let timeoutLast = setTimeout(() => {}, 0);
      while (timeoutLast--) {
        clearTimeout(timeoutLast);
      }
      AsyncStorage.getItem('walletData').then( async(walletData) => {
        if (walletData == null || walletData == undefined) {
          const walletUrl = request.getWalletUrl();  
          await request.get(walletUrl)
            .then(data => {
              setWalletData(Object.values(data['wallets']));
              AsyncStorage.setItem('walletData', JSON.stringify(Object.values(data['wallets'])));
            })
        }
        else {
          setWalletData(JSON.parse(walletData));
        }
      })
      AsyncStorage.getItem('token').then((token) => {
        setToken(token);
      })
      AsyncStorage.getItem('superiorAgent').then(async(superiorAgent) => {
        setSuperiorAgent(JSON.parse(superiorAgent));
        let agent = JSON.parse(superiorAgent);
        const tokenDB = await getUserTokenPromise(agent.username);
        setAgentDeviceId(tokenDB._data.deviceId);
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

  const sendNotificationToAgent = async () => {
    if (agentDeviceId) {
      let purpose = "deposit";
      if (transType == "Withdrawal") {
        purpose = "withdrawal";
      }
      notiMessages.map( async(message) => {
        const key = 'AAAAFusuHOI:APA91bFmsoK3xCuADeTunV7kCDrI5cBTd-wXN7WTZi-_fxT0NuZtVXkxcjzzZnD_uqeuHEqZ7ojrMK0SjCrNEkWtEewfPV8DTGtAxPeQBPQs_SCZNWlntcTm3bsYVYcuVI2dOY3f1WdI';
        // message build
        let sender = message.fromuser + " (" + purpose + ")";
        let refNo = purpose == "deposit" ? message.refno ? message.refno : "" : "";
        let mobile = purpose == "withdrawal" ? message.mobile ? message.mobile : "" : "";
        let walletName = "";
        walletData.map((wallet) => {
          if (message.payment == wallet.id) {
            walletName = wallet.name;
          }
        })
        let body = "Ref No.: " + refNo + "\r\nMobile No.: " + mobile + "\r\nWallet: " + walletName + "\r\nAmount: " + message.amount;
        const aMessage = {
          sender: sender,
          body: body
        };

        let params = JSON.stringify(
          {
            deviceId: agentDeviceId, 
            message: JSON.stringify(aMessage), 
            key: key
          }
        );
        // call the API to send push notification
        let pushUrl = request.getPushNotificationUrl();
        const results = await request.post(pushUrl, params);
        console.log('results', results);
      })
      notiMessages.length = 0;
    }
  }

  // const sendMessageToAgent = async (message, url) => {
  //   if (token == "") {
  //     token = await AsyncStorage.getItem('token');
  //   }
  //   onSpinnerChanged(true);
  //   if (superiorAgent.username) {
  //     let purpose = "deposit";
  //     if (transType == "Withdrawal") {
  //       purpose = "withdrawal";
  //     }
  //     let params = JSON.stringify(
  //       {
  //         token: token, 
  //         receiveUsername: superiorAgent.username, 
  //         walletId: walletType, 
  //         purpose: purpose,
  //         refNo: message.refCode,
  //         mobile: message.refCode,
  //         amount: message.amount,
  //       }
  //     );
  //     if (url) {
  //       const result = await request.post(url, params);
  //       if (result.ok && result.message) {
  //         notiMessages.push(result.message);
  //         onSpinnerChanged(false);
  //         return true;
  //       }
  //       onSpinnerChanged(false);
  //       return false;
  //     } else {
  //       onSpinnerChanged(false);
  //     }
  //   } else {
  //     onSpinnerChanged(false);
  //     alert.warning("Superior Agent is missing");
  //   }
  //   onSpinnerChanged(false);
  //   return false;
  // }

  const getUserTokenPromise = (userName) => {
    return db.collection("users")
        .doc(String(userName))
        .get()
  }

  const invalidMessage = (message) => {
    let result = false;
    if (message.refCode != "" || message.amount != "")
      if (message.refCode == "" || message.amount <= 99) {
        result = true;
    }
    return result;
  }
  
  const validMessage = (message) => {
    let result = false;
    if (message.refCode != "" || message.amount != "")
      if (message.refCode != "" || message.amount >= 100) {
        result = true;
    }
    return result;
  }

  const handleSubmit = async () => {
    // validate inputs
    if (invalidMessage(messageOne) || invalidMessage(messageTwo) || invalidMessage(messageThree) ||
          invalidMessage(messageFour) || invalidMessage(messageFive)) {
        alert.info("All fields must be filled out and amount at least TK 100.");
        onSpinnerChanged(false);
        setDisable(false);
        return;
    }

    let data = {
      refCode: "",
      amount: ""
    }
    const userSendMultiMessageUrl = request.getUserSendMultiMessageUrl();
    let messageCount = 0;
    if (token == "") {
      token = await AsyncStorage.getItem('token');
    }
    onSpinnerChanged(true);
    // build api params
    let purpose = 1;
    if (transType == "Withdrawal") {
      purpose = 2;
    }
    let messages = [];

    switch (true)
    {
      case validMessage(messageOne):
        messages.push({
          refNo: messageOne.refCode,
          mobile: messageOne.refCode,
          amount: messageOne.amount,
        })
        messageCount++;
        setMessageOne(data);
    }
    switch (true)
    {
      case validMessage(messageTwo):
        messages.push({
          refNo: messageTwo.refCode,
          mobile: messageTwo.refCode,
          amount: messageTwo.amount,
        })
        messageCount++;
        setMessageTwo(data);
    }
    switch (true)
    {
      case validMessage(messageThree):
        messages.push({
          refNo: messageThree.refCode,
          mobile: messageThree.refCode,
          amount: messageThree.amount,
        })
        messageCount++;
        setMessageThree(data);
    }
    switch (true)
    {
      case validMessage(messageFour):
        messages.push({
          refNo: messageFour.refCode,
          mobile: messageFour.refCode,
          amount: messageFour.amount,
        })
        messageCount++;
        setMessageFour(data);
    }
    switch (true)
    {
      case validMessage(messageFive):
        messages.push({
          refNo: messageFive.refCode,
          mobile: messageFive.refCode,
          amount: messageFive.amount,
        })
        messageCount++;
        setMessageFive(data);
    }

    if (messages.length == 0) {
      alert.info("Nothing to send. Please add item first.");
      onSpinnerChanged(false);
      setDisable(false);
      return;
    }
    // call message api
    let params = JSON.stringify(
      {
        token: token,  
        walletId: walletType, 
        purpose: purpose,
        messages: JSON.stringify(messages)
      }
    );
    if (userSendMultiMessageUrl) {
      const result = await request.post(userSendMultiMessageUrl, params);
      // console.log('userSendMultiMessageUrl', result)
      if (result.ok) {
        for(let i=0; i<messageCount; i++) {
          let index = i + 1;
          let key = 'message' + index;
          // console.log(key, result[key])
          notiMessages.push(result[key]);
        }
        onSpinnerChanged(false);
       // alert.info("Messages have been sent.");
      } else {
        onSpinnerChanged(false);
        alert.info("Error, Messages could not be sent.");
      }
    } else {
      onSpinnerChanged(false);
    }
    onSpinnerChanged(false);
    setDisable(false);
    if (notiMessages.length) sendNotificationToAgent();
  }

  // const handleSubmit = async () => {
    // if (invalidMessage(messageOne) || invalidMessage(messageTwo) || invalidMessage(messageThree) ||
    //       invalidMessage(messageFour) || invalidMessage(messageFive)) {
    //     alert.info("All fields must be filled out and amount at least TK 100.");
    //     onSpinnerChanged(false);
    //     setDisable(false);
    //     return;
    // }

  //   let sent = false;
  //   let data = {
  //     refCode: "",
  //     amount: ""
  //   }
  //   const userSendMessageUrl = request.getUserSendMessageUrl();

  //   if (messageOne.refCode != "" && messageOne.amount != "" && messageOne.amount >= 100) {
  //     sent = await sendMessageToAgent(messageOne, userSendMessageUrl);
  //     if (sent) {
  //       setMessageOne(data);
  //     }
  //   } 
  //   if (messageTwo.refCode != "" && messageTwo.amount != "" && messageTwo.amount >= 100) {
  //     sent = await sendMessageToAgent(messageTwo, userSendMessageUrl);
  //     if (sent) {
  //       setMessageTwo(data);
  //     }
  //   } 
  //   if (messageThree.refCode != "" && messageThree.amount != "" && messageThree.amount >= 100) {
  //     sent = await sendMessageToAgent(messageThree, userSendMessageUrl);
  //     if (sent) {
  //       setMessageThree(data);
  //     }
  //   }
  //   if (messageFour.refCode != "" && messageFour.amount != "" && messageFour.amount >= 100) {
  //     sent = await sendMessageToAgent(messageFour, userSendMessageUrl);
  //     if (sent) {
  //       setMessageFour(data);
  //     }
  //   } 
  //   if (messageFive.refCode != "" && messageFive.amount != "" && messageFive.amount >= 100) {
  //     sent = await sendMessageToAgent(messageFive, userSendMessageUrl);
  //     if (sent) {
  //       setMessageFive(data);
  //     }
  //   } 

  //   if (sent) {
  //     onSpinnerChanged(false);
  //     alert.info("Messages have been sent.");
  //   }
  //   onSpinnerChanged(false);
  //   setDisable(false);
  //   if (notiMessages.length) sendNotificationToAgent();
  // }

  const handleQuickInsert = () => {
    Keyboard.dismiss();
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
          switch (index)
          {
            case 0:
              setMessageOne(data);
              break;
            case 1:
              setMessageTwo(data);
              break;
            case 2: 
              setMessageThree(data);
              break;
            case 3:
              setMessageFour(data);  
              break;
            case 4:   
              setMessageFive(data);
              break;
          }
        } catch (e) {
          
        }
      }
    })
  }

  const handleMessageOne = (data) => {
    // console.log('handleMessageOne', data);
    setMessageOne(data);
  }
  
  const handleMessageTwo = (data) => {
    // console.log('handleMessageTwo', data);
    setMessageTwo(data);
  }

  const handleMessageThree = (data) => {
    // console.log('handleMessageThree', data);
    setMessageThree(data);
  }

  const handleMessageFour = (data) => {
    // console.log('handleMessageFour', data);
    setMessageFour(data);
  }

  const handleMessageFive = (data) => {
    // console.log('handleMessageFive', data);
    setMessageFive(data);
  }

  return (
    <SafeAreaView style={styles.header}>
      <KeyboardAvoidingView style={styles.header}
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      contentContainerStyle={styles.header}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : -50}
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
        <View style={styles.create_message_body}>
          <View style={styles.header}>
            <TouchableOpacity onPress={()=> Keyboard.dismiss()}>
                <MessageBlock transType={transType} mData={messageOne} lineNumber={1} key={"lineNumber1"} parentReference={handleMessageOne} />
                <MessageBlock transType={transType} mData={messageTwo} lineNumber={2} key={"lineNumber2"} parentReference={handleMessageTwo} />
                <MessageBlock transType={transType} mData={messageThree} lineNumber={3} key={"lineNumber3"} parentReference={handleMessageThree} />
                <MessageBlock transType={transType} mData={messageFour} lineNumber={4} key={"lineNumber4"} parentReference={handleMessageFour} />
                <MessageBlock transType={transType} mData={messageFive} lineNumber={5} key={"lineNumber5"} parentReference={handleMessageFive} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            disabled={disable}
            style={{flex:0.13}} 
            onPress={() => {
              onSpinnerChanged(true);
              setDisable(true);
              Keyboard.dismiss();
              handleSubmit();
            }}
          >
            <View style={styles.sumbit_button}>
              <Text style={styles.sumbit_confirm_text}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      <Modal isVisible={isModalVisible}
          // onBackdropPress={handleQuickInsert}
      >
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={{ flex: 1, paddingBottom: heightPercentageToDP("3.5%")}}>
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
                  placeholder="Please insert only up to 5 messages only"
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
