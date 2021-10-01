class Format {
    separator(number){
        if(number){
            number = parseFloat(number).toFixed(0);
            return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return number;
    }
}

export default Format;
