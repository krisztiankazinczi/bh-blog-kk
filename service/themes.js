const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


module.exports = class Themes {

    findThemes() {
        const themesPath = path.join(__dirname, '../public/themes/')
        console.log(themesPath)
        return new Promise((resolve, reject) => {
            fs.readdir(themesPath, (err, themes) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(themes)

            });
        })

    }

    setTheme(selectedTheme) {
        let configFile = fs.readFileSync('./config.env').toString()
        configFile = configFile.replace(`SELECTED_THEME=${process.env.SELECTED_THEME}`, `SELECTED_THEME=${selectedTheme}`)
        fs.writeFileSync('./config.env', configFile, err => {
            if (err) {
                console.log(err)
                return false
            }
            return true
        })

    }

    loadTheme() {
        return process.env.SELECTED_THEME
    }

}



