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

    getQuarter(d){
        d = d || new Date();
        const month = d.getMonth() + 1;
        let quarter = 1;
        if (month < 4)
            quarter = 1;
        else if (month < 7)
            quarter = 2;
        else if (month < 10)
            quarter = 3;
        else if (month < 13)
            quarter = 4;
        return quarter;
    }

    getQuarterString(quarter){
        if(quarter === 1){
            return "1st Quarter";
        }else if(quarter === 2){
            return "2nd Quarter";
        }else if (quarter === 3){
            return "3rd Quarter";
        }else{
            return "4th Quarter";
        }
    }

    getWeekYear(d){
        d = d || new Date();
        const oneJan = new Date( d.getFullYear(),0,1);
        const numberOfDays = Math.floor(( d - oneJan) / (24 * 60 * 60 * 1000))+1;
        const result = Math.ceil(numberOfDays / 7);
        return result
    }

    getStartDateOfWeek(week, year){
        let start = (week - 1)*7 + 1;
        let startYear = new Date(year, 0, 1);
        for(let d = new Date(year, 0, 1); d <= new Date(year, 11,31); d.setDate(d.getDate() + 1)){
            let diff = (d - startYear) + ((startYear.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
            let oneday = 1000*60*60*24;
            let day = Math.floor(diff/oneday);
            if(day+1 === start){
                return new Date(d);
            }
        }
    }
    getEndDateOfWeek(week, year){
        let start = week*7;
        let startYear = new Date(year, 0, 1);
        for(let d = new Date(year, 0, 1); d <= new Date(year, 11,31); d.setDate(d.getDate() + 1)){
            let diff = (d - startYear) + ((startYear.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
            let oneday = 1000*60*60*24;
            let day = Math.floor(diff/oneday);
            if(day+1 === start){
                return new Date(d);
            }
        }
    }

    
}

module.exports = new Util;