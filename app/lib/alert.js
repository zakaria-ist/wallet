import axios from "axios";
import { Alert } from "react-native";
class CustomAlert {
  async warning(text, func) {
    if (func) {
      Alert.alert(
        "warning",
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
        "warning",
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
      "warning",
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
