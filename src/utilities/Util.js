const IsEmail = require("isemail");

class Util{
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    getRndColorHex(){
         return Math.floor(Math.random()*16777215).toString(16);
    }

    getDataSlug(data){
        let str = data.toLowerCase();
        let tokens = str.split(" ");
        return tokens.join("-");
    }

    getImageName(url){
        const startIndex = url.search("/o/") + 3;
        const endIndex = url.search("?");
        return url.subString(startIndex, endIndex);
    }

    isVietnamesePhoneNumber(number) {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    isEmail(email){
        return IsEmail.validate(email);
    }

    
}

module.exports = new Util;