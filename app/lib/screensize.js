import {
    Dimensions,
    PixelRatio,
  } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class Screensize {
    getSmallScreen(){
        return (PixelRatio.getPixelSizeForLayoutSize(windowWidth) <330 
    && PixelRatio.getPixelSizeForLayoutSize(windowHeight) <490)
    } 
    getMediumScreen(){
        return (330 <= PixelRatio.getPixelSizeForLayoutSize(windowWidth) <999 
    && 490 <= PixelRatio.getPixelSizeForLayoutSize(windowHeight) <1000)
    } 
    getLargeScreen(){
        return (PixelRatio.getPixelSizeForLayoutSize(windowWidth)>=999 
    && PixelRatio.getPixelSizeForLayoutSize(windowHeight)>=1000)
    } 
}


export default Screensize;
