import Screensize from '../lib/screensize';
import styles from '../lib/global_css';

const screensize = new Screensize();

class Picker {
    smallclientpicker() { 
    return screensize.getSmallScreen() ? styles.client_ss_picker : mediumclientpicker;
    }
    mediumclientpicker() { 
    return screensize.getMediumScreen() ? styles.client_ms_picker : largeclientpicker;
    }
    largeclientpicker() {  
    return screensize.getLargeScreen() ? styles.client_ls_picker : smallclientpicker;
    }

    smallclientdpicker() {  
    return screensize.getSmallScreen() ? styles.client_ss_dropdownpicker : mediumclientdpicker;
    }
    mediumclientdpicker() {  
    return screensize.getMediumScreen() ? styles.client_ms_dropdownpicker : largeclientdpicker;
    }
    largeclientdpicker() {  
    return screensize.getLargeScreen() ? styles.client_ls_dropdownpicker : smallclientdpicker;
    }
    smalladminpicker() {  
        return screensize.getSmallScreen() ? styles.picker_ss_admin : mediumadminpicker;
    }
    mediumadminpicker() {  
        return screensize.getMediumScreen() ? styles.picker_ms_admin : largeadminpicker;
    }
    largeadminpicker() {  
        return screensize.getLargeScreen() ? styles.picker_ls_admin : smalladminpicker;
    }
}

export default Picker
