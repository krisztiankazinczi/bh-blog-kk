module.exports = {
    validateNewPost(title, slug, content) {
        if (!content && !title && !slug || !content && title.length < 5 && slug.length < 5 || !title && content.length < 5 && slug.length < 5 || !slug && content.length < 5 && title.length < 5 || title.length < 5 && content.length < 5 && slug.length < 5) {
            return ['title_slug_content', title, slug, content] 
        }
        else if (!title && !slug || !title  && slug.length < 5 || !slug && title.length < 5 || title.length < 5 && slug.length < 5) {
            return ['title_slug', title, slug, content]  
        }
        else if (!title && !content || !title  && content.length < 5 || !content && title.length < 5 || title.length < 5 && content.length < 5) {
            return ['title_content', title, slug, content]  
        }
        else if (!content && !slug || !content  && slug.length < 5 || !slug && content.length < 5 || content.length < 5 && slug.length < 5) {
            return ['slug_content', title, slug, content]  
        }
        else if (!title || title.length < 5) {
            return ['title', title, slug, content]  
        }
        else if (!slug || slug.length < 5) {
            return ['slug', title, slug, content]  
        }
        else if (!content || content.length < 5) {
            return ['content', title, slug, content]  
        }
        return false;
    }

}


