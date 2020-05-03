const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];




  /**
   * SINGLETON SERVICE!!!!
   */
module.exports = new class ArchiveService {
  constructor() {
    this.selectedStyle = process.env.ARCHIVE_STYLE
  }

  getSelectedStyle() {
    return this.selectedStyle
  }

  setSelectedStyle(newStyle) {
    this.selectedStyle = newStyle
  }

  whichArchiveStyleIsActive() {
    const selectedStyle = this.getSelectedStyle()

    if (selectedStyle === 'tree') {
      return { style: 'tree', createArchive: this.createTreeArchive }
    } 
    else if (selectedStyle === 'list') {
      return { style: 'list', createArchive: this.createListArchive }
    } 
    else {
      return { style: 'styleError', createArchive: this.createNoArchive }
    } 
  }

  // I have created it because of the same return values in whichArchiveStyleIsActive function!!!!!!
  createNoArchive() {
    return null
  }

  createTreeArchive(allPosts) {

    const archive = {};
    allPosts.forEach(post => {
      if (post.draft == 1) return

      const date = new Date(post.published_at);
      const year = date.getFullYear();
      const month = months[date.getMonth()];

      archive[year] = archive[year] || {}

      if (!archive[year][month]) {
        archive[year][month] = [{ id: post.id, title: post.title }]
        return;
      }

      archive[year][month].push({ id: post.id, title: post.title });

    })

    let orderedArchive = []

    orderedArchive = Object.entries(archive).sort( (a, b) => {
      return b[0] - a[0]
    })
    // I want to send back only an array of Objects
    orderedArchive = orderedArchive.map(post => { return {[post[0]]: post[1]}})

    return orderedArchive
  }


  createListArchive(allPosts) {
    const archive = {}

    allPosts.forEach(post => {

      if (post.draft == 1) return

      const date = new Date(post.published_at);
      const year = date.getFullYear();
      const month = months[date.getMonth()];

      if (!archive[`${year} - ${month}`]) {
        archive[`${year} - ${month}`] = []
      }
      archive[`${year} - ${month}`].push({ id: post.id, title: post.title })

    })
    return archive
  }

  selectArchiveStyle(style) {
    let configFile = fs.readFileSync('./config.env').toString()
    configFile = configFile.replace(`ARCHIVE_STYLE=${process.env.ARCHIVE_STYLE}`, `ARCHIVE_STYLE=${style}`)
    fs.writeFileSync('./config.env', configFile, err => {
      if (err) {
        console.log(err)
        return false
      }
    })
    // reload the config file values - if this service would not be a Singleton!!!!!
    // const envConfig = dotenv.parse(fs.readFileSync('./config.env'))
    // for (const k in envConfig) {
    //   process.env[k] = envConfig[k]
    // }

    this.setSelectedStyle(style)

    return true

  }




}