var url = 'http://api.thixotrofic.com:4000'

if (process.env.NODE_ENV === 'development') {
    url = 'localhost:4000'
}

export const serverUrl = url;