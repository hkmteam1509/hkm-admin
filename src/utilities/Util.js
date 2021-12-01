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

    
}

module.exports = new Util;