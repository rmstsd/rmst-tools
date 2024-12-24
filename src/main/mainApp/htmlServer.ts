import liveServer from 'live-server'
import path from 'path'

liveServer.start({
  port: 8083,
  root: path.join(__dirname, '../../resources/htmlDist'),
  open: false,
  logLevel: 0
})
