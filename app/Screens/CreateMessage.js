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
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  InteractionManager,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { useStateIfMounted } from "use-state-if-mounted";
import { RFValue } from "react-native-responsive-fontsize";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from "@react-native-community/async-storage";

import CommonTop from "../Components/CommonTop";
import MessageBlock from "../Components/MessageBlock";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WalletColors } from "../assets/Colors.js";

const CreateMessage = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [transType, setTransType] = useStateIfMounted("Deposit");
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
    backgroundColor: Colors.white,
    borderTopColor: WalletColors.Wblue,
    borderWidth: 1,
    borderStyle: 'solid',
  };

  const LeftButton = "Deposit";
  const RightButton = "Withdrawal";

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((walletData) => {
        setWalletData(JSON.parse(walletData));
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

  const handleSubmit = () => {
    console.log('handleSubmit');
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
    console.log('data', data);
    setMessageOne(data);
  }
  
  const handleMessageTwo = (data) => {
    console.log('data', data);
    setMessageTwo(data);
  }

  const handleMessageThree = (data) => {
    console.log('data', data);
    setMessageThree(data);
  }

  const handleMessageFour = (data) => {
    console.log('data', data);
    setMessageFour(data);
  }

  const handleMessageFive = (data) => {
    console.log('data', data);
    setMessageFive(data);
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
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

        <View
          style={styles.body}>
          <TouchableOpacity
            onPress={handleQuickInsert}
          >
              <View style={styles.insert_button}>
                <Text style={styles.insert_button_text}>
                  Quick Insert
                </Text>
              </View>
          </TouchableOpacity>
          <MessageBlock transType={transType} mData={messageOne} lineNumber={1} key={"lineNumber1"} parentReference={handleMessageOne} />
          <MessageBlock transType={transType} mData={messageTwo} lineNumber={2} key={"lineNumber2"} parentReference={handleMessageTwo} />
          <MessageBlock transType={transType} mData={messageThree} lineNumber={3} key={"lineNumber3"} parentReference={handleMessageThree} />
          <MessageBlock transType={transType} mData={messageFour} lineNumber={4} key={"lineNumber4"} parentReference={handleMessageFour} />
          <MessageBlock transType={transType} mData={messageFive} lineNumber={5} key={"lineNumber5"} parentReference={handleMessageFive} />

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
      </ScrollView>

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
                  <Text styles={{ fontSize: 25 }}>                                               Data Insert</Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleQuickInsert()
                    }}
                  >
                    <Fontisto name="close" color={WalletColors.black} size={35} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholderTextColor="gray"
                  backgroundColor="white"
                  placeholder="Please insert only upto 5 messages only"
                  maxLength={500}
                  multiline={true}
                  value={quickMessages}
                  onChangeText={(value) => {
                    setQuickMessages(value);
                  }}
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
                        fontSize: RFValue(16)
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

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    alignItems: "center",
    paddingBottom: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("4%"),
  },
  sumbit_button: {
    width: widthPercentageToDP("40%"),
    height: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("2%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wgreen,
    alignItems: 'center'
  },
  sumbit_button_text: {
    color: WalletColors.white,
    fontSize: 20
  },
  insert_button: {
    width: widthPercentageToDP("35%"),
    height: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("-2%"),
    marginBottom: heightPercentageToDP("1%"),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Worange,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Worange,
    alignItems: 'center',
    marginLeft: widthPercentageToDP("55%"),
  },
  insert_button_text: {
    color: WalletColors.white,
    fontSize: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    borderWidth: 5,
    borderRadius: 20,
    padding: 15,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal_header: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  modal_text_input: {
    fontSize: RFValue(15),
    color: "black",
    alignSelf: "center",
    width: widthPercentageToDP("85%"),
    height: heightPercentageToDP("30%"),
    marginLeft: widthPercentageToDP("1%"),
    marginTop: heightPercentageToDP("5%"),
    borderColor: WalletColors.Wblue,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  confirm: {
    width: widthPercentageToDP("30%"),
    alignSelf: "center",
    backgroundColor: WalletColors.Wgreen,
    color: WalletColors.white,
    textAlign: "center",
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: WalletColors.Wgreen,
    borderStyle: 'solid',
    marginTop: 10
  }
});

export default CreateMessage;
