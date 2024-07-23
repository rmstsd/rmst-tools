import fse from 'fs-extra'
import path from 'node:path'
import wpkPaths from './wpk.paths'

fse.removeSync(path.join(wpkPaths.rootPath, 'dist'))
