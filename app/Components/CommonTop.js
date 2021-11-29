/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import {useStateIfMounted} from "use-state-if-mounted";
import AsyncStorage from "@react-native-community/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import { Badge } from 'react-native-elements';
import styles from '../lib/global_css.js';

const CommonTop = ({
  admin,
  LeftButton,
  RightButton,
  handleLeftButton,
  handleRightButton,
  handleWalLeftButton,
  handleWalMidButton,
  handleWalRightButton,
  badgeCount
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
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      console.log('badgeCount', badgeCount)
    })
  }, [badgeCount]);

  return (
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
                {badgeCount ?
                  <Badge
                    value={badgeCount[0]} status="error"
                    containerStyle={styles.badgeStyle}
                  />
                :
                  <></>
                }
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
                 {badgeCount ?
                    <Badge
                      value={badgeCount[1]} status="error"
                      containerStyle={styles.badgeStyle}
                    />
                  :
                    <></>
                  }
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
                {badgeCount ?
                  <Badge
                    value={badgeCount[2]} status="error"
                    containerStyle={styles.badgeStyle}
                  />
                :
                  <></>
                }
              </View>
            </TouchableOpacity>
          </View>
          : <View style={{height: 0}}></View>
        }
    </View>
  );
};


export default CommonTop;
