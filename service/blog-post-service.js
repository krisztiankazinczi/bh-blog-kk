
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

    findAuthorOfPostById(id) {
      return this.postRepository.findAuthorOfPostById(id)
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

    async findTags() {
        return await this.postRepository.findTags()
    }

    async findPostsByTag(id) {
        return await this.postRepository.findPostsByTag(id)
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