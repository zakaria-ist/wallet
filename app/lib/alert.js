import axios from "axios";
import { Alert } from "react-native";

class CustomAlert {
  async warning(text, func) {
    if (func) {
      Alert.alert(
        "Warning",
        text,
        [
          {
            text: "OK",
            onPress: () => {
              func();
            },
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Warning",
        text,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  async info(text, func) {
    if (func) {
      Alert.alert(
        "Information",
        text,
        [
          {
            text: "OK",
            onPress: () => {
              func();
            },
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Information",
        text,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  async ask(text, func) {
    Alert.alert(
      "Warning",
      text,
      [
        {
          text: "OK",
          onPress: () => {
            func();
          },
        },
        {
          text: "Cancel",
          onPress: () => {
          },
        },
      ],
      { cancelable: false }
    );
  }
}

export default CustomAlert;
