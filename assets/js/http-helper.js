/* HTTP helpers */

/**
 * Execute GET, POST or any other HTTP methods
 * @param {*} method GET, POST, PUT, DELETE
 * @param {*} url Resource
 * @param {*} data Query params for GET and body for other methods
 * @param {*} headers Custom additional headers
 * @returns 
 */
async function fetchCustom(method, url = '', data = {}, headers = {Authorization: "aaa"}) {
    method = method.toUpperCase()
    let payload = {
        method,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }
    if(method == 'GET') {
        let keys = Object.keys(data)
        if(keys.length > 0) {
            let queryString = '?' + keys.map(k => k+'='+data[k]).join('&')
            url += queryString
        }
    } else {
        payload['body'] = JSON.stringify(data)
    }
    const response = await fetch(url, payload)
    return response.json()
}
