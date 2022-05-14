var fs = require('fs')
const marked = require('./assets/js/marked.min.js')

const reset = true
const rootPath = './web/blog'

function invalidate() {
    return new Promise((resolve) => {
        fs.readdir(`${rootPath}/posts`, async (err, files) => {
            let posts = files.map(f => {
                const parts = f.split('.')
                return parts.length == 2 && parts[1] == 'md' ? checkBlogPost(f) : null
            }).filter(f => f)

            let postsWithInfo = filterBlogPosts(posts)
            const postsWithMeta = posts.map(p => {
                try {
                    const pp = p.split('/').pop().split('.')[0]
                    return {
                        page: p,
                        meta: postsWithInfo.filter(p => p.link == pp).pop()
                    }
                } catch {}
                return {
                    page: p,
                    meta: null,
                }
            })

            createBlogHome(postsWithInfo)
            const first = postsWithMeta.pop()
            if(first) {
                const original = await readOriginal()
                writeFile(postsWithMeta, first, original)
            }
        })
    })
}

invalidate()

function checkBlogPost(path) {
    const name = path.split('.')[0]
    const html = `${rootPath}/${name}.html`
    const exists = fs.existsSync(html)
    if(exists && reset) fs.unlinkSync(html)
    return !exists || reset ? html : null
}

function writeFile(files, file, original) {
    fs.writeFile(file.page, original, () => {
        if(files.length > 0) {
            const next = files.pop()
            writeFile(files, next, original)
        }
    })
}

function createBlogHome(posts) {
    const jsonHome = fs.readFileSync(`${rootPath}/posts/home.json`, 'utf8')
    const homePath = `${rootPath}/posts/posts.json`
    try { fs.unlinkSync(homePath) } catch {}
    fs.writeFile(homePath, JSON.stringify({
        ...JSON.parse(jsonHome),
        posts,
    }), () => {})
}

function filterBlogPosts(posts) {
    return posts.map(p => {
        const filename = p.split('\/').pop().split('.')[0]
        return fs.existsSync(`${rootPath}/posts/${filename}.md`) ? formatPost(filename, p) : null
    })
    .filter(f => f)
}
function formatPost(link) {
    const text = fs.readFileSync(`${rootPath}/posts/${link}.md`, 'utf-8') || ''
    if(text.includes(`<meta name="date"`)) {
        const lines = text.split('\n')
        return {
            topic: findTopic(lines),
            link,
            title: findTitle(lines),
            image: findImage(lines),
        }
    }
    return null
}
function findTopic(html) {
    const prefix = '<meta name="topic" content='
    const meta = html.filter(l => l.startsWith(prefix)).pop()
    if(meta) {
        let matches = meta.slice(prefix.length, meta.length).match(/"([^"]+)"/)
        if(matches.length > 1) return matches[1]
    }
    return "Actualidad"
}
function findTitle(html) {
    const h1s = html.filter(l => l.startsWith('# '))
    return h1s.length > 0 ? h1s[0].slice(2, 50) : '(Sin título)'
}
function findImage(html) {
    const imgs = html.filter(l => l.startsWith('![') && l.includes('('))
    if(imgs.length > 0) {
        const img = imgs[0]
        const index = img.indexOf('(')+1
        return img.slice(index, img.length-1)
    }
    return ''
}

async function readOriginal() {
    return fs.readFileSync(`${rootPath}/.base.html`, 'utf8')
    .split('\n').map(l => {
        return !l ? null : l.slice(l.search(/\S/), l.length)
    }).filter(l => l && !(l.startsWith('<!--') && l.endsWith('-->'))).join('')
}
