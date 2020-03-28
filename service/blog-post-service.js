const PostRepository = require('../repository/posts_repository');

const postRepository = new PostRepository();

class BlogPostService {
    findAllPosts() {
        return postRepository.findAllPosts();
    }

    findSearchedFor(searchFor) {
        return postRepository.findSearchedFor(searchFor);
    }

    findPostById(id) {
        return postRepository.findPostById(id);
    }

    findPostBySlug(slug) {
        return postRepository.findPostBySlug(slug);
    }

    createPost(newPost) {
        return postRepository.createPost(newPost);
    }

    createDraft(newPost) {
        return postRepository.createDraft(newPost);
    }

    updatePost(updatedPost, id) {
        return postRepository.updatePost(updatedPost, id);
    }

    updatePostAsDraft(updatedPost, id) {
        return postRepository.updatePostAsDraft(updatedPost, id);
    }

    async createArchive() {
        return await getArchive();
    }
}

const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

async function getArchive() {
    try {
        const result = await postRepository.findAllPosts();
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



module.exports = BlogPostService;