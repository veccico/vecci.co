var fs = require('fs')

const reset = true
const rootPath = './web/blog'

function invalidate() {
    return new Promise((resolve) => {
        fs.readdir(`${rootPath}/posts`, async (err, files) => {
            let posts = files.map(f => {
                const parts = f.split('.')
                return parts.length == 2 && parts[1] == 'md' ? checkBlogPost(f) : null
            }).filter(f => f)
            const first = posts.pop()
            if(first) {
                const original = await readOriginal()
                writeFile(posts, first, original)
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
    fs.writeFile(file, original, () => {
        if(files.length > 0) {
            const next = files.pop()
            writeFile(files, next, original)
        }
    })
}

async function readOriginal() {
    return fs.readFileSync(`${rootPath}/.base.html`, 'utf8')
    .split('\n').map(l => {
        return !l ? null : l.slice(l.search(/\S/), l.length)
    }).filter(l => l && !(l.startsWith('<!--') && l.endsWith('-->'))).join('')
}
