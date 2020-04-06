const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


module.exports = class ThemeService {

    findThemes() {
        const themesPath = path.join(__dirname, '../public/themes/')
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
            }
        })

    }

    loadTheme() {
        return process.env.SELECTED_THEME
    }

    createThemePath(selectedTheme) {
        if (!selectedTheme) selectedTheme = process.env.SELECTED_THEME
        const themePath = `/themes/${selectedTheme}/bootstrap.css`
        return themePath;
    }


    

}



