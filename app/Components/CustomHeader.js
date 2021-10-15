/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect, useMemo} from 'react';
import {useNavigation, DrawerActions } from '@react-navigation/native';
import {useStateIfMounted} from "use-state-if-mounted";
import {RFValue} from "react-native-responsive-fontsize";
import {View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-elements';
import {WalletColors} from "../assets/Colors.js";
import Screensize from '../lib/screensize.js';
import styles from '../lib/global_css.js';

const screensize = new Screensize();

const CustomHeader = ({title}) => {
  const navigation = useNavigation();
  const [headerTitle, setHeaderTitle] = useStateIfMounted(title);

  const isSmallRF = screensize.getSmallScreen() ? RFValue(9) : isMediumRF;
  const isMediumRF = screensize.getMediumScreen() ? RFValue(17) : isLargeRF;
  const isLargeRF = screensize.getLargeScreen() ? RFValue(32) : isSmallRF;

  useEffect(() => {
    setHeaderTitle(title)
  }, [title]);

  return useMemo(() => {
    return (
      <View style={styles.view_header_root}>
        <View style={{flex: 2, alignItems:"flex-start", justifyContent: 'center',}}>
          <Button 
            onPress={ e => {
              e.preventDefault();
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            icon={<Feather name="menu" color={WalletColors.Wblue} size={isSmallRF || isMediumRF || isLargeRF} />}
            buttonStyle={{backgroundColor: "white"}}
          />
        </View>
        <View style={{flex: 8, alignItems:"center", justifyContent: 'center',}}>
          <Text style={styles.header_text}>{headerTitle}</Text>
        </View>
      </View>
    );
  })
};


export default CustomHeader;
