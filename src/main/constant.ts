import { app } from 'electron'

export const isDev = !app.isPackaged
export const isProd = app.isPackaged
