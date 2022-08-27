
class BlogController {

    constructor() {
        this.THIS_PAGE = "vecci.co"
    }

    loadBlog = () => {
        let rootPath = ''
        this.loadPost(`${rootPath}/blog/posts/posts.json`, async (jsonString) => {
            const json = JSON.parse(jsonString)
            document.querySelector('#content').innerHTML = `
                ${marked(json.md_start)}
                <br />
                ${await (new BlogHomeRender()).renderNews(json.posts.map(p => {
                    return {
                        ...p,
                        link: `/blog/${p.link}.html`
                    }
                }))}
                <br />
                ${marked(json.md_end)}
            `
            this.fixAll()
        })
    }

    loadArticle = () => {
        const {pathname} = location
        const parts = pathname.split('/')
        let article = parts[parts.length-1].split('.')
        if(article.length == 1) location.replace(this.fixKnownPaths(pathname)+'.html')
        article = article[0]
        const fixedArticle = this.fixKnownPaths(article)
        if(article != fixedArticle) {
            location.replace(fixedArticle+'.html')
        }

        if(!article) article = 'error'
        let rootPath = ''
        rootPath = location.hostname == 'localhost' ? '' : 'https://raw.githubusercontent.com/cjortegon/vecci.co/master'
        this.loadPost(`${rootPath}/blog/posts/${article}.md`, (md) => {
            document.querySelector('#content').innerHTML = marked(md);
            this.fixAll()
        })
    }

    fixKnownPaths = (pathname) => {
        let parts = (pathname || '').split('/')
        let lastPart = parts.pop()
        if(lastPart.indexOf('.') != -1) {
            lastPart = lastPart.split('.').shift()
        }
        switch(lastPart) {
            case "tutoriales":
            case "tutorial":
                return parts.join('/')+"/tutorials"
            case "precios":
            case "precio":
                return parts.join('/')+"/pricing"
        }
        return pathname
    }

    fixAll = () => {
        fixImages()
        this.fixLinks()
        addIds()
        setTitle()
        const metadata = findMetadata()
        console.log('metadata', metadata)
        insertAuthor(metadata)
        addStyleToCodeBlocks()
        setupGist()
        
        blog_analytics.reportPostOpen()
        blog_analytics.setupAdvancedAnalytics()
    }

    loadPost = (mdFilePath, callback) => {
        fetch(mdFilePath, {cache: "no-store"})
        .then((response) => response.text())
        .then((md) => {
            callback(md);
        })
        .catch((error) => {
            console.warn(error);
        });
    }

    /* Fixing functions */

    fixLinks = () => {
        var elms = document.querySelectorAll('a');
        for(var i = 0; i < elms.length; i++) {
            const elm = elms[i]
            if(!elm.classList.contains('same-page') || elm.href.includes(this.THIS_PAGE)) {
                elm.target = '_blank'
            }
        }
    }
}

class BlogHomeRender {

    constructor() {}

    renderNews = async (posts) => {
        return `<div class="hide-in-small">
            ${await this.postToPairMd(posts)
            .then(posts => this.divideInColumns(posts, 2))
            .then(posts => this.postToCardsStyle2(posts))}
        </div>
        <div class="hide-in-large">
            ${await this.postToMd(posts)
            .then(posts => this.divideInColumns(posts, 2))
            .then(posts => this.postToCardsStyle1(posts))}
        </div>`
    }

    postToPairMd = (posts) => {
        return new Promise(resolve => {
            resolve(posts.map(p => {
                return {
                    link: p.link,
                    content: [
    `[![100;;l](${p.image})](${p.link})`,
    `### ${p.topic}\n## ${p.title}`
                    ]
                }
            }))
        })
    }
    divideInColumns(list, size) {
        return new Promise(resolve => {
            resolve(list.reduce(function(result, value, index, array) {
                if (index % size === 0)
                  result.push(array.slice(index, index + size));
                return result;
              }, []))
        })
    }
    postToMd = (posts) => {
        return new Promise(resolve => {
            resolve(posts.map(p => {
                return {
                    link: p.link,
                    content: `[![100;;l](${p.image})](${p.link})\n### ${p.topic}\n## ${p.title}`
                }
            }))
        })
    }
    postToPairMd = (posts) => {
        return new Promise(resolve => {
            resolve(posts.map(p => {
                return {
                    link: p.link,
                    content: [
    `[![100;;l](${p.image})](${p.link})`,
    `### ${p.topic}\n## ${p.title}`
                    ]
                }
            }))
        })
    }

    /* For small devices */
    postToCardsStyle1(grouped) {
        return new Promise(resolve => {
            resolve(`<table>
                ${grouped.map(r => {
                    return `<tr>
                        ${r.map(p => `<td class="news-card">
                            <a href="${p.link}">${marked(p.content)}</a>
                        </td>`).join('')}
                    </tr>`
                }).join('\n')}
            </table>`)
        })
    }
    /* For large devices */
    postToCardsStyle2 = (grouped) => {
        return new Promise(resolve => {
            resolve(`<table>
                ${grouped.map(r => {
                    return `<tr>
                        ${r.map(p => `<td class="news-card">
                            <table><tr>
                                ${p.content.map(item => `<td style="width: 40%; padding-right: 1vw;">
                                    ${`<a href="${p.link}">${marked(item)}</a>`}
                                </td>`).join('')}
                            </tr></table>
                        </td>`).join('')}
                    </tr>`
                }).join('\n')}
            </table>`)
        })
    }
}

function findMetadata() {
    let author = {
        img: readMetadata('profile_img'),
        name: readMetadata('profile_name'),
        date: readMetadata('profile_date'),
    }
    var elms = document.querySelectorAll('meta');
    for(var i = 0; i < elms.length; i++) {
        switch(elms[i].name) {
            case 'date': author.date = elms[i].content; break;
            case 'author': author.name = elms[i].content; break;
            case 'pp': author.img = elms[i].content; break;
        }
    }
    return author
}

function readMetadata(name) {
    let node = document.getElementById(name)
    return node != null ? node.value : ''
}

function fixImages() {
    var elms = document.querySelectorAll('img');
    for(var i = 0; i < elms.length; i++) {
        let attributes = elms[i].alt.split(';')
        
        // Width
        try {
            let w = parseInt(attributes[0])
            elms[i].style.width = w+'%';
        } catch {}

        // Hight
        try {
            let h = parseInt(attributes[1])
            elms[i].style.height = h+'px'
        } catch {}

        // Alignment
        try {
            switch(attributes[2]) {
                case 'l': elms[i].style.marginLeft = 0
                break
                case 'r': elms[i].style.marginRight = 0
                break
            }
        } catch {}

    }
}

function addIds() {
    var elms = document.querySelectorAll('h1');
    for(var i = 0; i < elms.length; i++) {
        elms[i].id = 'title'
    }
}

function setTitle() {
    let title = document.getElementById('title')
    if(title != null)
        document.title = 'Vecci - '+title.innerHTML
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
function formatedDate(date) {
    const d = new Date(date)
    if(`${d.getTime()}` == 'NaN') return ''
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function insertAuthor(author) {
    let node = document.getElementById('title');
    if(node != null)
        node.insertAdjacentHTML('afterend', `<div class="profile">
            ${author.img ? `<div class="pp-container">
                <img src="${author.img}" />
            </div>` : ''}
            <div class="metadata">
                <span class="author">${author.name}</span>
                <span class="date">${formatedDate(author.date)}</span>
            </div>
        </div>`);
}

function setupGist() {
    var elms = document.querySelectorAll('blockquote');
    for(var i = 0; i < elms.length; i++) {
        let children = elms[i].children
        if(children.length > 0) {
            let p = children[0]
            if(p.innerHTML.startsWith('gist:')) {
                let path = p.children[0].href
                let blockquote = elms[i]
                elms[i].innerHTML = ''

                fetch(path)
                .then((response) => response.text())
                .then((source) => {
                    let pre = document.createElement('pre')
                    let code = document.createElement('code')
                    code.innerHTML = setCodeStyle(source)
                    pre.appendChild(code)
                    blockquote.appendChild(pre)
                })
                .catch((error) => {
                    console.warn(error);
                });
            }
        }
    }
}

function addStyleToCodeBlocks() {
    blocks = document.querySelectorAll('code')
    blocks.forEach(b => {
        b.innerHTML = setCodeStyle(b.innerHTML)
    })
}

function setCodeStyle(text) {
    text = text.replaceAll('<', '&#60;')
    text = text.replaceAll('>', '&#62;')
    let strings = /(["'])(?:(?=(\\?))\2.)*?\1/g
    match(strings, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-string">${w}</span>`)
    })
    let properties = /(this.*?\s|self.*?\s)/g
    match(properties, text).forEach(w => {
        let parts = w.split(/[\(\)\.]+/)
        let s = parts[1]
        let i = text.indexOf(w)
        if(i >= 0) {
            let first = i+parts[0].length+1
            let last = first+s.length
            text = text.substring(0, first)+`<span kkkkk="code-property">${s}</span>`+text.substring(last, text.length)
        }
    })
    let reserved = /\bthis\b|\bself\b|\breturn\b|\bvoid\b|\bfinal\b|\bvar\b|\blet\b|\bimport\b|\bclass|\b if|\belse|\b is |\b in |\b new |\b typeof |\b instanceof |\bwhile|\b for/g
    match(reserved, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-reserved-word">${w}</span>`)
    })
    text = text.replaceAll('=&#62;', `<span kkkkk="code-reserved-operator">=&#62;</span>`)
    text = text.replaceAll('===', `<span kkkkk="code-reserved-operator">===</span>`)
    text = text.replaceAll('==', `<span kkkkk="code-reserved-operator">==</span>`)
    let annotations = /^@+[a-z|A-Z]*/gm
    match(annotations, text).forEach(w => {
        text = text.replaceAll(w, `<span kkkkk="code-annotation">${w}</span>`)
    })
    return text.replaceAll('kkkkk=', 'class=')
}

/* Utils */

function match(regex, text) {
    let match = text.match(regex)
    return match == null ? [] : match
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Analytics */

class BlogAnalytics {
    constructor() {
        this.hasEngaged = false
        this.timeOpen = new Date()
        this.engageTimestamp = new Date()
    }

    setupAdvancedAnalytics = () => {
        window.onscroll = function (e) {
            let engage = getLastEngageTime()
            if(!this.hasEngaged && getElapsedTime() > 30000 && engage > 5000 && engage < 30000) {
                reportPostEngage()
            }
        }
        let debouncedScroll = debounce(onScrollAction, 1000)
        window.addEventListener('scroll', debouncedScroll);
    }
    reportBlogEvent = (action) => {
        let title = getPostId()
        if(title != undefined && title != null && title.length > 0)
            sendGAEvent('blog', action, title)
    }
    reportPostOpen = () => {
        reportBlogEvent('post-open')
    }
    reportPostEngage = () => {
        this.hasEngaged = true
        reportBlogEvent('post-engage')
    }

    debounce = (func, wait, immediate) => {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    getPostId = () => {
        let postId = document.getElementById('post_id')
        return postId != null ? postId.value : null
    }
    getElapsedTime = () => {
        let now = new Date()
        return now.getTime() - this.timeOpen.getTime()
    }
    getLastEngageTime = () => {
        let now = new Date()
        return now.getTime() - this.engageTimestamp.getTime()
    }
}
function onScrollAction(e) {
    engageTimestamp = new Date()
}

const blog_controller = new BlogController()
const blog_analytics = new BlogAnalytics()
