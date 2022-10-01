
class VideosController {

    constructor() {
        this.url = ''
        this.videos = [
            '731984075',
            '733090690',
            '731985798',
            '743620449',
        ]
        this.vimeoVideos = []
        this.hasLoaded = false
        this.checkIfEmbeeded()
    }

    checkIfEmbeeded = () => {
        if ( window.location !== window.parent.location ) {
            const h = document.querySelector('header')
            h.parentElement.removeChild(h)
        }
    }

    onTapVideo = (id) => {
        window.scrollTo(0, 0);
        const single = this.vimeoVideos.filter(v => v.id == id).pop()
        this.vimeoVideos = [single, ...this.vimeoVideos.filter(v => v.id != id)]
        this.hasLoaded = false
        this.renderVideos()
    }

    fixTime = (duration) => {
        let minutes = parseInt(duration/60)
        let seconds = duration % 60
        return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`
    }

    queryThumbnail = (id) => {
        const url = "https://vimeo.com/api/v2/video/" + id + ".json";
        return new Promise((resolve) => {
            simpleFetch(url)
            .then(response => {
                console.log(response)
                const vm = response.pop() || {}
                // console.log(vm)
                resolve({
                    id,
                    title: vm.title || '(Vecci video)',
                    image: vm.thumbnail_medium || '',
                    duration: this.fixTime(vm.duration || 29)
                })
            })
        })
    }

    loadVideos = () => {
        setTimeout(() => {
            this.renderVideos()
        }, 1500)
        setTimeout(() => {
            this.renderVideos()
        }, 3000)
        setTimeout(() => {
            this.renderVideos()
        }, 5000)
        this.videos.forEach((v) => {
            this.queryThumbnail(v)
            .then((video) => {
                // console.log(video)
                this.vimeoVideos.push(video)
            })
        })
    }

    renderVideos = () => {
        if(this.hasLoaded) return
        // this.vimeoVideos.push(...this.vimeoVideos)
        this.hasLoaded = this.vimeoVideos.length > 0
        let first = true
        document.querySelector('#videos-list').innerHTML = this.vimeoVideos
        .map(v => {
            let f = first
            first = false
            return this.insertVideoItem(v, f)
        }).join('')
        first = true
        document.querySelector('#tab-content').innerHTML = this.vimeoVideos
        .map(v => {
            let f = first
            first = false
            return this.insertVideoContent(v, f)
        }).join('')
    }

    insertVideoItem = (video, active) => {
        return `<li class="nav-item">
            <a onclick="tapVideo('${video.id}')" class="nav-link ${active ? 'active' : ''}" id="post-${video.id}-tab" data-toggle="pill" href="#post-${video.id}" role="tab" aria-controls="post-1" aria-selected="true">
                <!-- Single Blog Post -->
                <div class="single-blog-post style-2 d-flex align-items-center">
                    <div class="post-thumbnail">
                        <img src="${video.image}" alt="">
                    </div>
                    <div class="post-content">
                        <h6 class="post-title">${video.title}</h6>
                        <div class="post-meta d-flex justify-content-between">
                            <span class="video-duration">${video.duration}</span>
                            <!-- <span><i class="fa fa-comments-o" aria-hidden="true"></i> 25</span>
                            <span><i class="fa fa-eye" aria-hidden="true"></i> 11</span>
                            <span><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> 19</span> -->
                        </div>
                    </div>
                </div>
            </a>
        </li>`
    }
    insertVideoContent = (video, active) => {
        return `<div class="tab-pane fade ${active ? 'show active' : ''}" id="post-${video.id}" role="tabpanel" aria-labelledby="post-${video.id}-tab">
            <div class="video-title-mobile"><h3>${video.title}</h3></div>
            <div style="padding:150% 0 0 0;position:relative;">
                <iframe src="https://player.vimeo.com/video/${video.id}?h=7e34c37c2b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                    frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="video-iframe" title=${video.title}"></iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
        </div>`
    }
}

/* Extensions */
String.prototype.replaceAll = function(find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
}

function simpleFetch(url) {
    return new Promise(async (resolve) => {
        const response = await fetch(url)
        const res = await response.json()
        resolve(res)
    })
}

function tapVideo(id) {
    videos_controller.onTapVideo(id)
}

const videos_controller = new VideosController()
