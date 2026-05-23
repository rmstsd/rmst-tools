import eLogger from 'electron-log'
import type Logger from 'electron-log'

import { isDev } from '../constant'

// c:/Users/rmst/AppData/Roaming/rmst-tools/logs/main.log

if (isDev) {
  eLogger.transports.file.resolvePathFn = () => 'logs/main.log'
}

eLogger.transports.file.level = 'info'

interface InfoAllLogger extends Logger.Logger {
  (...p: any[]): void
}

const loggerFunc = (...p) => {
  eLogger.info(...p)
}
Object.assign(loggerFunc, eLogger)

const logger = loggerFunc as InfoAllLogger

export default logger
