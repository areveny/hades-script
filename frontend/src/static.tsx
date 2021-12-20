var url = 'localhost:4000'

if (process.env.NODE_ENV === 'development') {
    url = 'http://api.thixotrofic.com:4000'
}
url = 'http://localhost:4000'

export const serverUrl = url;