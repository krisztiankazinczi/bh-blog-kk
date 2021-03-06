const PostRepository = require('../repository/posts_repository');

class BlogPostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }

    findAllPosts() {
        return this.postRepository.findAllPosts();
    }

    findSearchedFor(searchFor) {
        return this.postRepository.findSearchedFor(searchFor);
    }

    findPostById(id) {
        return this.postRepository.findPostById(id);
    }

    findPostBySlug(slug) {
        return this.postRepository.findPostBySlug(slug);
    }

    createPost(newPost) {
        return this.postRepository.createPost(newPost);
    }

    createDraft(newPost) {
        return this.postRepository.createDraft(newPost);
    }

    updatePost(updatedPost, id) {
        return this.postRepository.updatePost(updatedPost, id);
    }

    updatePostAsDraft(updatedPost, id) {
        return this.postRepository.updatePostAsDraft(updatedPost, id);
    }

    async createArchive() {
        return await this.getArchive();
    }


    async getArchive() {
        try {
            const result = await this.postRepository.findAllPosts();
            const archive = {};
            result.forEach((row, index) => {
                if (!row.published_at) return
                
                const date = new Date(row.published_at);
                const year = date.getFullYear();
                const month = months[date.getMonth()];
    
                if (index === 0) {
                    archive[year] = {}
                    archive[year][month] = [{id: row.id, title: row.title}]
                    return;
                } 
                archive[year] = archive[year] || {}
    
                if (!archive[year][month]) {
                    archive[year][month] = [{id: row.id, title: row.title}]
                    return;
                } 
                    
                archive[year][month].push({id: row.id, title: row.title});
                
            })
            return archive
        } catch (error) {
            console.log(error)
        }
        
    }
}

const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];





module.exports = BlogPostService;