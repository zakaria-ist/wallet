/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import { WalletColors } from "../assets/Colors.js";

const CommonTop = ({
    admin,
    LeftButton,
    RightButton,
    handleLeftButton,
    handleRightButton,
    handleWalLeftButton,
    handleWalMidButton,
    handleWalRightButton,
}) => {
  const [topLeftFocused, setTopLeftFocused] = useStateIfMounted(false);
  const [topRightFocused, setTopRightFocused] = useStateIfMounted(true);
  const [walLeftFocused, setWalLeftFocused] = useStateIfMounted(true);
  const [walMidFocused, setWalMidFocused] = useStateIfMounted(false);
  const [walRightFocused, setWalRightFocused] = useStateIfMounted(false);
  const [walletData, setWalletData] = useStateIfMounted([]);
  const [walLeftButton, setWalLeftButton] = useStateIfMounted('');
  const [walMidButton, setWalMidButton] = useStateIfMounted('');
  const [walRightButton, setWalRightButton] = useStateIfMounted('');


  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('walletData').then((wallet_data) => {
        let wData = JSON.parse(wallet_data);
        setWalletData(wData);
        setWalLeftButton(wData[0].name);
        setWalMidButton(wData[1].name);
        setWalRightButton(wData[2].name);
      })
    })
  }, []);

  return (
    // <SafeAreaView>
        <View style={admin ? styles.view_root_admin : styles.view_root}>
            <View style={styles.view_top_button}>
                <TouchableOpacity
                    onPress={ () => {
                        setTopLeftFocused(true), 
                        setTopRightFocused(false), 
                        handleLeftButton()
                    }}
                >
                    <View style={topLeftFocused ? styles.left_button_focus : styles.left_button}>
                        <Text style={topLeftFocused ? styles.button_text_focus : styles.button_text}>{LeftButton}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => {
                        setTopRightFocused(true), 
                        setTopLeftFocused(false), 
                        handleRightButton()
                    }}
                >
                    <View style={topRightFocused ? styles.right_button_focus : styles.right_button}>
                        <Text style={topRightFocused ? styles.button_text_focus : styles.button_text}>{RightButton}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {!admin ? 
                <View style={styles.view_bottom_button}>
                    <TouchableOpacity
                        onPress={ () => {
                            setWalLeftFocused(true), 
                            setWalMidFocused(false),
                            setWalRightFocused(false),
                            handleWalLeftButton()
                        }}
                    >
                        <View style={walLeftFocused ? styles.wal_left_button_focus : styles.wal_left_button}>
                            <Text style={walLeftFocused ? styles.button_text_focus : styles.button_text}>{walLeftButton}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ () => {
                            setWalMidFocused(true), 
                            setWalRightFocused(false), 
                            setWalLeftFocused(false), 
                            handleWalMidButton()
                        }}
                    >
                        <View style={walMidFocused ? styles.wal_right_button_focus : styles.wal_right_button}>
                            <Text style={walMidFocused ? styles.button_text_focus : styles.button_text}>{walMidButton}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ () => {
                            setWalRightFocused(true), 
                            setWalMidFocused(false), 
                            setWalLeftFocused(false), 
                            handleWalRightButton()
                        }}
                    >
                        <View style={walRightFocused ? styles.wal_right_button_focus : styles.wal_right_button}>
                            <Text style={walRightFocused ? styles.button_text_focus : styles.button_text}>{walRightButton}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                : <View style={{height: 0}}></View>}
        </View>
    // </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  view_root: {
    flexDirection: "column", 
    // flex: 1, 
    alignItems: "center",
  },
  view_root_admin: {
    flexDirection: "column", 
    // flex: 1, 
    alignItems: "center", 
  },
  view_top_button: {
    flexDirection: "row", 
    flex: 1,
  //  top: heightPercentageToDP("1%"),
    justifyContent: "space-evenly",
  },
  view_bottom_button: {
    flexDirection: "row", 
    flex: 1,
    // bottom: heightPercentageToDP("1%"),
   // top: heightPercentageToDP("3%"),
    justifyContent: "space-evenly",
  },
  left_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("2%")
  },
  left_button_focus: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("2%")
  },
  right_button: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("2%")
  },
  right_button_focus: {
    width: widthPercentageToDP("30%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("2%")
  },
  button_text_focus: {
    fontSize: RFValue(15),
    color: WalletColors.white,
  },
  button_text: {
    fontSize: RFValue(15),
    color: WalletColors.Wblue,
  },
  wal_left_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_left_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_mid_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_mid_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_right_button: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.white,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
  wal_right_button_focus: {
    width: widthPercentageToDP("28%"),
    height: heightPercentageToDP("4%"),
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: WalletColors.Wblue,
    borderStyle: 'solid',
    justifyContent: 'center',
    backgroundColor: WalletColors.Wblue,
    alignItems: 'center',
    margin: widthPercentageToDP("1%"),
  },
});


export default CommonTop;
