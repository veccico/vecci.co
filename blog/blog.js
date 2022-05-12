
class BlogController {

    constructor() {
        this.URL_BASE = 'https://gq3ykajn8g.execute-api.us-east-1.amazonaws.com/prod/client'
    }

    loadArticle = () => {
        const parts = location.pathname.split('/')
        let article = parts[parts.length-1].split('.')
        article = article[0]
        console.log("Article: "+article)
    }

}

const blog_controller = new BlogController()
