const authenticator = require('../service/authenticator');
const NewPost = require('../utils/NewPost');

const validateForm = require('./validation/register-account-validation')

//for file upload, unzipping
const formidable = require('formidable');
const extract = require('extract-zip')
const path = require('path')

// for reading and modifiing the config files
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const fs = require('fs')

const slugify = require('slugify')

module.exports = class AdminController {
  constructor(blogPostService, themeService, userService, archiveService, timeFormatService) {
    this.blogPostService = blogPostService
    this.themeService = themeService
    this.userService = userService
    this.archiveService = archiveService
    this.timeFormatService = timeFormatService
    this.theme = this.themeService.createThemePath()
  }

  getTheme() {
    return this.theme
  }

  getDashboard(req, res) {
    const { authorization } = req.query;
    // I want that the authors see only a few part of the admin page. In the render I will determine what options can be seen depends on the authority of the user
    let isAdmin = 0;
    let isSuperAdmin = 0
    if (req.session.user.isAdmin === 1) isAdmin = 1
    if (req.session.user.isSuperAdmin === 1) isSuperAdmin = 1
    res.render('admin', {
      layout: 'main',
      css: this.getTheme(),
      isAdmin,
      isSuperAdmin,
      authorization
    })
  }

  async getPosts(req, res) {
    let posts = await this.blogPostService.findAllPosts();
    // everyone can see only their own posts or admins can see everyones posts
    const { username, isAdmin } = req.session.user
    posts = posts.map(post => post.author === username || isAdmin === 1 ? { ...post, authorized: true } : { ...post, authorizited: false })

    const { style, createArchive } = this.archiveService.whichArchiveStyleIsActive()

    res.render('admin-post-list', {
      layout: 'blog',
      title: 'Blog Title',
      posts,
      archive: createArchive(await this.blogPostService.findAllPosts()),
      tags: await this.blogPostService.findTags(),
      css: this.getTheme(),
      [style]: true
    });
  }



  async getPost(req, res) {
    const id = req.params.id;
    const post = await this.blogPostService.findPostById(id);
    // I won\t let anyone to edit someone else's posts if just type the correct url in browser
    if (req.session.user.username !== post.author && req.session.user.isAdmin !== 1) {
      res.redirect('/admin?authorization=true')
      return
    }
    let tags = await this.blogPostService.findTags();
    tags = findSelectedTags(post.tags, tags)

    const { style, createArchive } = this.archiveService.whichArchiveStyleIsActive()

    res.render('admin-edit-post', {
      layout: 'summernote',
      title: post.title,
      post,
      archive: createArchive(await this.blogPostService.findAllPosts()),
      tags,
      css: this.getTheme(),
      [style]: true
    })
  }

  async updatePost(req, res) {
    //if there is no tag selected, the findBYId function wont work, since it's an inner join with tags_in_post table
    const id = req.params.id;
    const { title, content, draft } = req.body;
    let { slug, tags } = req.body;

    //if there is only 1 selecterd tag, then I change it to an array => in repository I don\t have to check many possibilities in insert into tags_in_post

    if (typeof tags === 'string') tags = [tags]

    //If an admin edits the post he/she won't become the author of the post!!!!
    let author;
    if (req.session.user.isAdmin === 1) {
      try {
        const postAuthor = await this.blogPostService.findAuthorOfPostById(id)
        console.log(postAuthor)
        author = postAuthor
      } catch (error) {
        console.log(error)
      }
    } else author = req.session.user.username

    // create the necessary slug format if needed

    const correctSlug = checkSlugCorrectness(slug)
    if (!correctSlug && title) slug = slugify(title)
    if (!slug.includes('-') && slug.length > 0) slug += '-'

    // Check if the slug changed or is it exists at all?

    const isSlugExists = await this.blogPostService.checkIfSlugExist(slug)
    if (isSlugExists) {
      res.redirect(`/newPost?error=usedSlug&titleVal=${title}&slugVal=${slug}&contentVal=${content}`)
      return
    }

    let activeSlugInDb = '';
    let isNewActiveSlugNeeded = 0

    try {
      activeSlugInDb = await this.blogPostService.findActiveSlug(id)
      if (!activeSlugInDb || activeSlugInDb !== slug) isNewActiveSlugNeeded = 1
    } catch (error) {
      console.log(error)
    }

    // Check if it was published earlier, because I would not like to change the original published date

    let published_at = 0
    try {
      published_at = await this.blogPostService.checkPublishedStatus(id) // if it's not 0, then it was published out earlier
    } catch (error) {
      console.log(error)
    }





    const updatedPost = (draft)
      ? new NewPost
        (
          id,
          title,
          slug,
          author,
          new Date(),
          published_at,
          content,
          1,
          tags,
          isNewActiveSlugNeeded
        )
      : new NewPost
        (
          id,
          title,
          slug,
          author,
          new Date(),
          published_at == 0 ? new Date() : published_at,
          content,
          0,
          tags,
          isNewActiveSlugNeeded
        );

    if (draft) await this.blogPostService.updatePostAsDraft(updatedPost, id)
    else await this.blogPostService.updatePost(updatedPost, id)
    res.redirect('/adminPostList')
  }

  getConfigView(req, res) {
    const { success, error } = req.query
    res.render('admin-config-view', {
      layout: 'main',
      css: this.theme,
      success,
      error
    })
  }

  setConfig(req, res) {
    const { archiveStyle, date_format } = req.body
    const archiveStyleChange = this.archiveService.selectArchiveStyle(archiveStyle)
    const dateFormatChange = this.timeFormatService.updateTimeFormat(date_format)
    if (archiveStyleChange && dateFormatChange) {
      res.redirect('/config?success=true')
      return
    }
    res.redirect('/config?error=true')
  }

  getDBSettings(req, res) {
    let { success, error } = req.query
    let success1, success2, error1, error2;
    if (success == 1) success1 = 'Please restart the server to start to use the selected database'
    if (error == 1) error1 = 'We are sorry, but we can not change the database'
    if (success == 2) success2 = 'The configuration of MongoDB Connection successfully has been changed'
    if (error == 2) error2 = 'Weare sorry, but the provided details were not correct'
    res.render('select-database', {
      layout: 'main',
      success1,
      error1,
      success2,
      error2,
      css: this.getTheme()
    })
  }

  setDB(req, res) {
    const { db } = req.body

    let configFile = fs.readFileSync('./config.env').toString()
    configFile = configFile.replace(`SELECTED_DB=${process.env.SELECTED_DB}`, `SELECTED_DB=${db}`)
    fs.writeFileSync('./config.env', configFile, err => {
      if (err) {
        console.error(err)
        res.redirect('/setDatabase?error=1')
        return
      }

    })
    res.redirect('/setDatabase?success=1')

  }

  configureMongoDB(req, res) {
    const { url, username, password } = req.body;
    if (url && username && password) {
      let configFile = fs.readFileSync('./config.env').toString()
      configFile = configFile.replace(`DATABASE=${process.env.DATABASE}`, `DATABASE=${url}`)
      configFile = configFile.replace(`DATABASE_USERNAME=${process.env.DATABASE_USERNAME}`, `DATABASE_USERNAME=${username}`)
      configFile = configFile.replace(`DATABASE_PASSWORD=${process.env.DATABASE_PASSWORD}`, `DATABASE_PASSWORD=${password}`)
      fs.writeFileSync('./config.env', configFile, err => {
        if (err) {
          console.error(err)
          res.redirect('/setDatabase?error=2')
          return
        }
      })
      res.redirect('/setDatabase?success=2')
    }
  }

  async findThemes(req, res) {
    const { error, success, serverError } = req.query
    let installError, installSuccess;
    if (error === 'invalid-file-type') installError = 'The uploaded file is not zipped file, we deleted the file. Please upload the above mentioned file structure!'
    if (success === 'install') installSuccess = 'The selected theme was successfully installed'
    let themeList;
    try {
      themeList = await this.themeService.findThemes()
    } catch (error) {
      console.log(error)
      res.redirect('/admin?error=true')
    }
    res.render('select-theme', {
      layout: 'main',
      themeList,
      error,
      installError,
      installSuccess,
      serverError,
      css: this.getTheme()
    })
  }

  setTheme(req, res) {
    const { selectedTheme } = req.body;
    try {
      this.themeService.setTheme(selectedTheme)
      this.theme = this.themeService.createThemePath(selectedTheme)
      res.redirect('/admin')
    } catch (error) {
      console.log(error)
      res.redirect('/admin?error=true')
    }
  }


  installTheme(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
      file.path = path.join(__dirname, '../uploaded/', file.name)
    });

    form.on('file', function (name, file) {
      const fileType = file.type.split('/').pop();

      try {
        if (fileType === 'x-zip-compressed') {
          console.log('Uploaded ' + file.name);
          const targetPath = path.join(__dirname, '../public/themes/')
          extractAndDeleteZippedFolder(file.path, targetPath)
          res.redirect('/selectTheme?success=install');
        }
        else {
          console.log('invalid filetype');
          fs.unlinkSync(file.path);
          console.log('Deleted: ' + file.path);
          res.redirect('/selectTheme?error=invalid-file-type');
        }
      } catch (error) {
        console.log(error)
        res.redirect('/serverError')
        return
      }


    });
  }

  async findAccounts(req, res) {
    let users;
    try {
      users = await this.userService.findUsers()
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
      return
    }

    res.render('accounts', {
      layout: 'main',
      users,
      css: this.getTheme()
    })
  }

  async account(req, res) {
    const { id } = req.params;

    let user = null

    if (id) {
      try {
        user = await this.userService.findUserById(id)
      } catch (error) {
        console.log(error)
        res.redirect('/serverError')
        return
      }
    }
    res.render('account', {
      layout: 'main',
      user,
      superAdmin: req.session.user.isSuperAdmin, // only superAdmins can nominate someone to superAdmin, other won't see this option in the dropdown
      css: this.getTheme()
    })
  }

  async createNewAccount(req, res) {
    const { name, username, pw, pw_confirm, email, authority } = req.body;
    const errorObject = validateForm({ name, username, pw, pw_confirm, email, authority })

    if (!Object.keys(errorObject).length) {
      try {
        const isUsernameOrEmailExists = await this.userService.checkIfUsernameOrEmailExist(username, email)

        if (isUsernameOrEmailExists) {
          let errorString = ''
          errorString = username === isUsernameOrEmailExists.username ? 'This username is used by someone else, please change it' : 'This email is used by someone else, please change it'
          res.json({ error: errorString })
          return
        }
        await this.userService.registerUser({ name, username, pw, email, authority })
        res.json({})
        return
      } catch (error) {
        res.json({ error: 'We are sorry, but something went wrong, please try again later' })
      }
    } else {
      res.json(errorObject)
    }
  }


  async editAccount(req, res) {
    const { id } = req.params;
    const { name, username, pw, email, authority } = req.body;

    const errorObject = validateForm({ name, username, pw, email, authority })

    if (!Object.keys(errorObject).length) {
      try {
        const isNewUsernameOrEmailExists = await this.userService.isNewUsernameOrEmailExists(username, email, id)
        if (isNewUsernameOrEmailExists) {
          let errorString = ''
          errorString = username === isNewUsernameOrEmailExists.username ? 'This username is used by someone else, please change it' : 'This email is used by someone else, please change it'
          res.json({ error: errorString })
          return
        }
        await this.userService.editUserData({ id, name, username, pw, email, authority })
        res.json({})
        return
      } catch (error) {
        res.json({ error: 'We are sorry, but something went wrong, please try again later' })
      }
    } else {
      res.json(errorObject)
    }

  }


}



async function extractAndDeleteZippedFolder(zipPath, targetPath) {
  try {
    await extract(zipPath, { dir: targetPath })
    console.log('Extraction complete')
    await fs.unlink(zipPath, (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Zip file removed')
    })
  } catch (err) {
    throw new Error('extraction or delete was failed' + err)
  }
}



function checkSlugCorrectness(slug) {
  const regexp = /^[a-zA-Z0-9-]+$/;
  if (slug.search(regexp) === -1) return false
  else return true
}


function findSelectedTags(postTags, allTags) {
  if (!Array.isArray(postTags)) return allTags
  for (let i = 0; i < allTags.length; i++) {
    for (let j = 0; j < postTags.length; j++) {
      if (allTags[i].id == postTags[j]) allTags[i]['selected'] = true;
    }
  }
  return allTags;
}