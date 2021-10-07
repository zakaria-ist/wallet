import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Screensize {
  getSmallScreen(){
   return (windowWidth <320 && windowHeight <480)
  } 
  getMediumScreen(){
    return (320 <= windowWidth <999 && 480 <= windowHeight <1000)
  } 
  getLargeScreen(){
    return (windowWidth>=999 && windowHeight>=1000)
  } 
}


export default Screensize;
