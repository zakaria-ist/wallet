import Screensize from '../lib/screensize';
import styles from '../lib/global_css';

const screensize = new Screensize();
const smallclientpicker = screensize.getSmallScreen() ? styles.client_ss_picker : mediumclientpicker
const mediumclientpicker = screensize.getMediumScreen() ? styles.client_ms_picker : largeclientpicker;
const largeclientpicker = screensize.getLargeScreen() ? styles.client_ls_picker : smallclientpicker;
const smallclientdpicker = screensize.getSmallScreen() ? styles.client_ss_dropdownpicker : mediumclientdpicker;
const mediumclientdpicker = screensize.getMediumScreen() ? styles.client_ms_dropdownpicker : largeclientdpicker;
const largeclientdpicker = screensize.getLargeScreen() ? styles.client_ls_dropdownpicker : smallclientdpicker;
const smalladminpicker = screensize.getSmallScreen() ? styles.picker_ss_admin : mediumadminpicker;
const mediumadminpicker = screensize.getMediumScreen() ? styles.picker_ms_admin : largeadminpicker;
const largeadminpicker = screensize.getLargeScreen() ? styles.picker_ls_admin : smalladminpicker;

class Picker {
  smallclientpicker() { 
    return smallclientpicker
  }
  mediumclientpicker() {
    return mediumclientpicker
  }
  largeclientpicker() {  
    return largeclientpicker
  }
  smallclientdpicker() {  
    return smallclientdpicker
  }
  mediumclientdpicker() {  
    return mediumclientdpicker
  }
  largeclientdpicker() {  
    return largeclientdpicker
  }
  smalladminpicker() {  
    return smalladminpicker
  }
  mediumadminpicker() {  
    return mediumadminpicker
  }
  largeadminpicker() {  
    return largeadminpicker
  }
}

export default Picker
