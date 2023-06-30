class DateUtil {
    static Date(inc = 0){
        let d = new Date()
        d.setUTCHours(0, 0, 0, 0)
        d = new Date(d.setUTCDate(d.getUTCDate() + inc))
        return d
    }

    static StrToDate(str){
        let ld = str.split(".")
        let d = new Date() 
        d.setUTCHours(0, 0, 0, 0)
        d.setUTCFullYear(ld[2], ld[1]-1, ld[0])
        return d
    }

}

module.exports = { DateUtil }