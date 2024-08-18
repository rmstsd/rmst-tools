import liveServer from 'live-server'
import path from 'path'

const params = { port: 8083, root: path.join(__dirname, '../../resources/dist'), open: false }
liveServer.start(params)
