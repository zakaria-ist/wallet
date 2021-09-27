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
const CreateMessage = () => {
  const isDarkMode = useColorScheme() === 'dark';
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
      AsyncStorage.getItem('authorizeToken').then((token) => {
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
    if (token && superiorAgent && superiorAgent.username) {
      let walletId = walletType;
      let purpose = "deposit";
      if (transType == "Withdrawal") {
        purpose = "withdrawal";
      }

      let messageUrl = "";
      if (purpose == "deposit") {
        messageUrl = url + "?token=" + token + "&purpose=" + purpose + "&refNo=" + message.refCode + 
          "&amount=" + message.amount + "&walletId=" + walletId + "&receiveUsername=" + superiorAgent.username
      } else {
        messageUrl = url + "?token=" + token + "&purpose=" + purpose + "&mobile=" + message.refCode + 
          "&amount=" + message.amount + "&walletId=" + walletId + "&receiveUsername=" + superiorAgent.username
      }

      if (messageUrl) {
        console.log('messageUrl', messageUrl);
        await request.get(messageUrl)
          .then(result => {
            console.log('result', result);
          })
      }
    } else {
      alert.warning("Empty token or Superior Agent is missing");
    }
    
  }

  const handleSubmit = () => {
    console.log('handleSubmit');
    const userSendMessageUrl = request.getUserSendMessageUrl();
    if (messageOne.refCode != "" && messageOne.amount != "") {
      sendMessageToAgent(messageOne, userSendMessageUrl);
    }
    if (messageTwo.refCode != "" && messageTwo.amount != "") {
      sendMessageToAgent(messageTwo, userSendMessageUrl);
    }
    if (messageThree.refCode != "" && messageThree.amount != "") {
      sendMessageToAgent(messageThree, userSendMessageUrl);
    }
    if (messageFour.refCode != "" && messageFour.amount != "") {
      sendMessageToAgent(messageFour, userSendMessageUrl);
    }
    if (messageFive.refCode != "" && messageFive.amount != "") {
      sendMessageToAgent(messageFive, userSendMessageUrl);
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

  return (
    <SafeAreaView style={styles.header}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
          <ScrollView>
          <MessageBlock transType={transType} mData={messageOne} lineNumber={1} key={"lineNumber1"} parentReference={handleMessageOne} />
          <MessageBlock transType={transType} mData={messageTwo} lineNumber={2} key={"lineNumber2"} parentReference={handleMessageTwo} />
          <MessageBlock transType={transType} mData={messageThree} lineNumber={3} key={"lineNumber3"} parentReference={handleMessageThree} />
          <MessageBlock transType={transType} mData={messageFour} lineNumber={4} key={"lineNumber4"} parentReference={handleMessageFour} />
          <MessageBlock transType={transType} mData={messageFive} lineNumber={5} key={"lineNumber5"} parentReference={handleMessageFive} />
          </ScrollView>
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
                      <Fontisto name="close" color={WalletColors.red} size={20} />
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
    </SafeAreaView>
  );
};


export default CreateMessage;
