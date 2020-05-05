const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


module.exports = new class ThemeService {
  constructor() {
    this.theme = process.env.SELECTED_THEME
  }

  getTheme() {
    return this.theme
  }

  setTheme(selectedTheme) {
    this.theme = selectedTheme
  }

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

  changeTheme(selectedTheme) {
    let configFile;
    try {
      configFile = fs.readFileSync('./config.env').toString()
    } catch (error) {
      throw new Error(`setTheme() in theme-service.js. Function argument: selectedTheme: ${selectedTheme}. err: ${error}`)
    }
    configFile = configFile.replace(`SELECTED_THEME=${process.env.SELECTED_THEME}`, `SELECTED_THEME=${selectedTheme}`)
    fs.writeFileSync('./config.env', configFile, err => {
      if (err) {
        console.log(err)
        throw new error(`changeTheme function in theme-service. selectedTheme: ${selectedTheme} - writeFileSync was not successfull, err: ${err}`)
      }
    })

    this.setTheme(selectedTheme)

    // reload the config file values
    // const envConfig = dotenv.parse(fs.readFileSync('./config.env'))
    // for (const k in envConfig) {
    //   process.env[k] = envConfig[k]
    // }

  }

  loadTheme() {
    return process.env.SELECTED_THEME
  }

  createThemePath(selectedTheme) {
    if (!selectedTheme) selectedTheme = this.getTheme()
    const themePath = `/themes/${selectedTheme}/bootstrap.css`
    return themePath;
  }




}



