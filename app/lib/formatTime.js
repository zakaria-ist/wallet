

class KTime {
    format(unixTime){
        if(unixTime){
            var date = new Date(unixTime * 1000);
            var hours = date.getHours();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            var minutes = "0" + date.getMinutes();
            return hours + ':' + minutes.substr(-2) + ' ' + ampm
        }
        return '';
    }
}

export default KTime;
