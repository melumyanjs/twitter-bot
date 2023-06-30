require('dotenv').config({path: __dirname + '/../.config/.env'})
const fs = require('fs');
const { DateUtil } = require('./date');
const path = require('path')
class FileManager{
    constructor(){
        this.pathConfig = path.resolve(__dirname, '..', process.env.CONFIG_FILE)
    }

    async Write(data, pathfile){
        let json = JSON.stringify(data)
        fs.writeFileSync(pathfile, json, 'utf8', (err) => {
            if (err) throw err;
        })
    }

    async Read(pathfile){
        let data = fs.readFileSync(pathfile, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                return data
            }
        })
        return JSON.parse(data)
    }
    
    async WriteConfig(data){
        this.Write(data, this.pathConfig)
    }
    
    async ReadConfig(){
       return this.Read(this.pathConfig)
    }
    
    async SaveTimeStart(){
        let dateObj = await this.ReadConfig()
        dateObj.time_start = new Date().toISOString()
        dateObj.time_end = dateObj.time_end || DateUtil.Date(-1).toISOString()
        await this.WriteConfig(dateObj)
    }

    async SaveTimeStop(){
        let dateObj = await this.ReadConfig()
        dateObj.time_start = dateObj.time_start || DateUtil.Date().toISOString()
        dateObj.time_end = new Date().toISOString()
        await this.WriteConfig(dateObj)
    }
}

module.exports = new FileManager()