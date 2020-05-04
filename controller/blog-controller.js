const NewPost = require('../utils/NewPost');
const { validateNewPost } = require('./validation/new-post-validation');

const slugify = require('slugify')

module.exports = class BlogController {
  constructor(blogPostService, themeService, authenticator, archiveService) {
    this.blogPostService = blogPostService;
    this.themeService = themeService
    this.authenticator = authenticator
    this.archiveService = archiveService
  }

  async get(req, res) {
    const { searchFor } = req.query;
    const blogs = (searchFor) ? await this.blogPostService.findSearchedFor(searchFor) : await this.blogPostService.findAllPosts()
    if (!blogs) {
      res.redirect('/serverError')
      return
    }
    /**
     * @param {string} style - Name of ArchiveStyle or error
     * @param {function} createArchive - the callable archive function to get archive!!!
     */
    const { style, createArchive } = this.archiveService.whichArchiveStyleIsActive()

    try {
      res.render('post-list', {
        layout: 'blog',
        title: 'Blog Title',
        blogs: blogs,
        archive: createArchive(await this.blogPostService.findAllPosts()),
        tags: await this.blogPostService.findTags(),
        css: this.themeService.createThemePath(),
        [style]: true // general property adding - style will always contain a string and accorsing to this string handlebars will render the proper style or error
      });
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
    }


  }

  async getPost(req, res) {
    const { idOrSlug } = req.params;
    try {
      let post = (idOrSlug.includes('-')) ? await this.blogPostService.findPostBySlug(idOrSlug, 1) : await this.blogPostService.findPostById(idOrSlug);
      // if slug have been changed since it was bookmarked, I will try to find the new slug and load that page
      if (!post) {
        post = await this.blogPostService.findPostBySlug(idOrSlug, 0)
        if (post) {
          post = await this.blogPostService.findPostById(post.id)
          res.redirect(`/post/${post.slug}`)
          return
        }
        else {
          res.redirect('/404')
          return
        }
      }

      const { style, createArchive } = this.archiveService.whichArchiveStyleIsActive()


      res.render('read-post-view', {
        layout: 'blog',
        title: post.title,
        post,
        archive: createArchive(await this.blogPostService.findAllPosts()),
        tags: await this.blogPostService.findTags(),
        css: this.themeService.createThemePath(),
        [style]: true
      })
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
    }


  }

  async getAddPost(req, res) {
    const error = createErrorObjectForAddPost(req.query);

    try {
      res.render('add-new-post', {
        layout: 'summernote',
        error,
        tags: await this.blogPostService.findTags(),
        css: this.themeService.createThemePath()
      });
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
    }

  }


  async post(req, res) {
    const { title, content } = req.body;

    let { slug, tags } = req.body;

    if (typeof tags === 'string') tags = [tags]

    const author = this.authenticator.findUserBySession(req.cookies.ssid).username;

    const validateForm = validateNewPost(title, slug, content)

    if (validateForm) res.redirect(`/newPost?error=${validateForm[0]}&titleVal=${validateForm[1]}&slugVal=${validateForm[2]}&contentVal=${validateForm[3]}`);
    else {
      const correctSlug = checkSlugCorrectness(slug)
      if (!correctSlug) {
        slug = slugify(title)
      }
      if (!slug.includes('-') && slug.length > 0) {
        slug += '-'  // I need this dash, because of getPost(idOrSlug) function needs a dash to identify if it's a slug or id
      }

      try {
        const isSlugExists = await this.blogPostService.checkIfSlugExist(slug)
        if (isSlugExists) {
          res.redirect(`/newPost?error=usedSlug&titleVal=${title}&slugVal=${slug}&contentVal=${content}`)
          return
        }

        const newPost = new NewPost
          (
            undefined,
            title,
            slug,
            author,
            new Date(),
            new Date(),
            content,
            0,
            tags
          )
        await this.blogPostService.createPost(newPost);
        res.redirect('/postList')
      } catch (error) {
        console.log(error)
        res.redirect('/serverError')
      }


    }
  }

  async draft(req, res) {
    const { title, slug, content } = req.body;
    let { tags } = req.body;

    if (typeof tags === 'string') tags = [tags]

    try {
      const isSlugExists = await this.blogPostService.checkIfSlugExist(slug)
      if (isSlugExists) {
        res.redirect(`/newPost?error=usedSlug&titleVal=${title}&slugVal=${slug}&contentVal=${content}`)
        return
      }

      const author = this.authenticator.findUserBySession(req.cookies.ssid).username;
      const newPost = new NewPost
        (
          undefined,
          title,
          slug,
          author,
          new Date(),
          0,
          content,
          1,
          tags
        )
      await this.blogPostService.createDraft(newPost);
      res.redirect('/adminPostList');
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
    }
  }


  async getPostsByTag(req, res) {
    const { id } = req.params

    const { style, createArchive } = this.archiveService.whichArchiveStyleIsActive()

    try {
      res.render('post-list', {
        layout: 'blog',
        title: 'Post Title',
        blogs: await this.blogPostService.findPostsByTag(id),
        archive: createArchive(await this.blogPostService.findAllPosts()),
        tags: await this.blogPostService.findTags(),
        css: this.themeService.createThemePath(),
        [style]: true
      })
    } catch (error) {
      console.log(error)
      res.redirect('/serverError')
    }
  }

  render404Page(req, res) {
    res.render('404', { layout: '404' })
  }

  serverErrorPage(req, res) {
    res.render('server-error', { layout: 'blog' })
  }



}


/**
 * 
 * @param {req.query} query 
 */
function createErrorObjectForAddPost(query) {
  const errorAndValue = {
    title_slug_content: false,
    title_slug: false,
    slug_content: false,
    title_content: false,
    title: false,
    titleValue: false,
    slug: false,
    slugValue: false,
    content: false,
    contentValue: false
  }
  if (query.error) {
    if (query.error === 'title_slug_content') errorAndValue.title_content = 'Error! Title, Slug and Content are mandatory and the minimum length of these are 5 characters!';
    else if (query.error === 'title_slug') errorAndValue.title_content = 'Error! Both Title and Slug are mandatory and the minimum length of these are 5 character!';
    else if (query.error === 'title_content') errorAndValue.title_content = 'Error! Both Title and Content are mandatory and the minimum length of these are 5 character!';
    else if (query.error === 'slug_content') errorAndValue.title_content = 'Error! Both Content and Slug are mandatory and the minimum length of these are 5 character!';
    else if (query.error === 'title') errorAndValue.title = 'Error! Title is mandatory and the minimum length is 5 character!';
    else if (query.error === 'slug') errorAndValue.title = 'Error! Slug is mandatory and the minimum length is 5 character!';
    else if (query.error === 'content') errorAndValue.content = 'Error! Content is mandatory and the minimum length is 5 character!';
    else if (query.error === 'usedSlug') errorAndValue.content = 'Error! This slug is used for an other post, please select an other one!';
    errorAndValue.titleValue = query.titleVal;
    errorAndValue.slugValue = query.slugVal;
    errorAndValue.contentValue = query.contentVal;
  }
  return errorAndValue;
}

function checkSlugCorrectness(slug) {
  const regexp = /^[a-zA-Z0-9-]+$/;
  if (slug.search(regexp) === -1) return false
  else return true
}