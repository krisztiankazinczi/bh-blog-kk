module.exports = {
    validateNewPost(title, content) {
        if (!content && !title || !content && title && title.length < 5 || !title && content && content.length < 5 || content && title && content.length < 5 && title.length < 5) {
            return ['title_content', title, content] 
        }
        else if (!title || title.length < 5) {
            return ['title', title, content]  
        }
        else if (!content || content.length < 5) {
            return ['content', title, content]  
        }
        return false;
    }

}


