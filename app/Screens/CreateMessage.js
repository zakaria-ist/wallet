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
  ScrollView,
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
import {
  heightPercentageToDP,
} from "react-native-responsive-screen";
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
import { alignContent, fontWeight } from 'styled-system';
import styles from '../lib/global_css';

const request = new Request();
const alert = new CustomAlert();
const windowHeight = Dimensions.get('window').height;
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

  const backgroundStyle = {
    backgroundColor: Colors.white
  };

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
    onSpinnerChanged(true);
    if (token) {
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
        console.log('result', result);
        if (result.ok && result.message) {
          let agentName = result.myAgent;
          if (agentName && agentName != "") {
            const tokenDB = await getUserTokenPromise(agentName);
            console.log('agentToken', tokenDB._data.deviceId);
            const deviceId = tokenDB._data.deviceId;
            const key = 'AAAAFusuHOI:APA91bFmsoK3xCuADeTunV7kCDrI5cBTd-wXN7WTZi-_fxT0NuZtVXkxcjzzZnD_uqeuHEqZ7ojrMK0SjCrNEkWtEewfPV8DTGtAxPeQBPQs_SCZNWlntcTm3bsYVYcuVI2dOY3f1WdI';
            // message build
            let sender = result.message.fromuser + " (" + purpose + ")";
            let refNo = result.message.refNo ? result.message.refNo : "";
            let mobile = result.message.mobile ? result.message.mobile : "";
            let body = "fromuser: " + result.message.fromuser + ", toagent: " + result.message.toagent + ", refno: " + refNo + ", mobile: " + mobile + ", walletId: " + result.message.payment + ", amount: " + result.message.amount;
            // body += ", belongclient: " + result.message.belongclient + ", cct_status: " + result.message.cct_status + ", cct_author_id: " + result.message.cct_author_id + ", status: " + result.message.status;
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
        }
        return false;
      }
    } else {
      alert.warning("Empty token or Superior Agent is missing");
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
      alert.warning("Messages are sent.");
    }
  }

  const handleQuickInsert = () => {
    setIsModalVisible(!isModalVisible);
    console.log('handleQuickInsert')
  }

  const handleConfirmInsert = () => {
    setIsModalVisible(!isModalVisible);
    let messages = quickMessages.replace('==', ',').replace('=', ',').replace('--', ',').replace('-', ',');
    let blocks = messages.split(',');
    if (blocks.length && blocks[0] != "") {
      let count = 1;
      for(let i=0; i< blocks.length; i++) {
        let code = blocks[i].trim();
        i++;
        let amount = blocks[i].trim();
        let data = {
            refCode: code,
            amount: amount
        }
        if (count == 1) setMessageOne(data);
        else if (count == 2) setMessageTwo(data);
        else if (count == 3) setMessageThree(data);
        else if (count == 4) setMessageFour(data);
        else if (count == 5) setMessageFive(data);

        count++;
      }
    }
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

  // const DATA = [
  //   <ScrollView>
  //   <MessageBlock transType={transType} mData={messageOne} lineNumber={1} key={"lineNumber1"} parentReference={handleMessageOne} />
  //   <MessageBlock transType={transType} mData={messageTwo} lineNumber={2} key={"lineNumber2"} parentReference={handleMessageTwo} />
  //   <MessageBlock transType={transType} mData={messageThree} lineNumber={3} key={"lineNumber3"} parentReference={handleMessageThree} />
  //   <MessageBlock transType={transType} mData={messageFour} lineNumber={4} key={"lineNumber4"} parentReference={handleMessageFour} />
  //   <MessageBlock transType={transType} mData={messageFive} lineNumber={5} key={"lineNumber5"} parentReference={handleMessageFive} />
  //   </ScrollView>
  // ];

  return (
    <View style={styles.header}>
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
        <View
          style={styles.create_message_body}>
          <TouchableOpacity
            onPress={handleQuickInsert}
          >
            <View style={styles.insert_button}>
              <Text style={styles.insert_button_text}>
                Quick Insert
              </Text>
            </View>
          </TouchableOpacity>
          <FlatList data={[{key: 'item1' }]}
           style={{height: heightPercentageToDP("57%")}}
           renderItem={({ item, index, separators }) => (
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
              <Text style={styles.sumbit_button_text}>
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
                  <View
                    style={styles.modal_title}
                  >
                    <Text
                      style={{
                        marginTop: -10,
                        marginLeft: 5,
                        color: WalletColors.black,
                        fontSize: RFValue(18),
                        fontWeight: "bold"
                      }}
                    >
                      Data Insert
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleQuickInsert()
                    }}
                  >
                    <View
                      style={styles.modal_close,{alignSelf:"flex-end",marginTop:-heightPercentageToDP("3%")}}>
                      <Fontisto name="close" color={WalletColors.red} size={30} />
                    </View>
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
                    setQuickMessages(value);
                  }}
                  textAlignVertical="top"
                  style={styles.modal_text_input}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    handleConfirmInsert()
                  }}
                >
                  <View
                    backgroundColor={WalletColors.Wgreen}
                    style={styles.confirm}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: WalletColors.white,
                        fontSize: RFValue(14)
                      }}
                    >
                      Confirm
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </Modal>
    </View>
  );
};


export default CreateMessage;
