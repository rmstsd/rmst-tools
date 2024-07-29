module.exports = {
  appId: 'com.electron.rmst-tools-wpk',
  productName: 'rmst-tools-wpk',
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  ],
  asar: true,
  asarUnpack: ['resources/**'],
  win: {
    executableName: 'rmst-tools-wpk',
    icon: 'resources/icons/win/icon.ico'
  },
  nsis: {
    artifactName: '${name}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always',
    oneClick: false,
    language: '2052',
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true
  },
  npmRebuild: false

  // publish: {
  //   provider: 'generic',
  //   url: 'http://127.0.0.1:1666/public/latest'
  // }

  // publish: {
  //   provider: 'github',
  //   owner: 'rmstsd',
  //   repo: 'rmst-tools-wpk',
  //   vPrefixedTagName: true,
  //   releaseType: 'release'
  // }
}
