const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];


/**
 * SINGLETON SERVICE!!!!!
 */
module.exports = new class TimeFormatService {
  constructor() {
    /**
     * Date formats
     *  1: YYYY-MM-DD H:M:S
        2: YYYY-Month-DD H:M:S
        3: DD/MM/YYYY H:M:S
        4: DD/Month/YYYY H:M:S
     */
    this.dateFormat = process.env.DATE_FORMAT
  }

  setDateFormat(format) {
    this.dateFormat = format
  }

  /**
   * 
   * @param {Date} unixTimeStamp 
   */
  setTimeFormat(unixTimeStamp) {

    if (!unixTimeStamp) return 0 

    const convertedToNewDate =  new Date(unixTimeStamp)

    const year = convertedToNewDate.getFullYear()
    const month = convertedToNewDate.getMonth()
    const day = convertedToNewDate.getDate()
    const hour = convertedToNewDate.getHours()
    const min = convertedToNewDate.getMinutes()
    const sec = convertedToNewDate.getSeconds()

    let date;

    switch (this.dateFormat) {
      case '1':
        date = `${year}-${month + 1}-${day}  ${hour}:${min}:${sec}`
        break;
      case '2':
        date = `${year}-${months[month]}-${day}  ${hour}:${min}:${sec}`
        break;
      case '3':
        date = `${day}/${month + 1}/${year}  ${hour}:${min}:${sec}`
        break;
      case '4':
        date = `${day}/${months[month]}/${year}  ${hour}:${min}:${sec}`
        break;
      default:
        break;
    }
    return date

  }


  updateTimeFormat(date_format) {
    let configFile = fs.readFileSync('./config.env').toString()
    configFile = configFile.replace(`DATE_FORMAT=${process.env.DATE_FORMAT}`, `DATE_FORMAT=${date_format}`)
    fs.writeFileSync('./config.env', configFile, err => {
      if (err) {
        console.log(err)
        return false
      }
    })

    this.setDateFormat(date_format)
    return true
  }


}

