import * as builder from 'electron-builder'

const Platform = builder.Platform

build()
function build() {
  const options: builder.Configuration = {
    appId: 'com.electron.rmst-tools',
    productName: 'rmst-tools',
    directories: {
      buildResources: 'build'
    },
    files: [
      '!**/.vscode/*',
      '!src/*',
      '!electron.vite.config.{js,ts,mjs,cjs}',
      '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
      '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
      '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
      '!pkg-script/*',
      '!cfg/*',
      '!env/*'
    ],
    asar: true,
    asarUnpack: ['resources/**'],
    win: {
      target: 'nsis',
      icon: 'resources/icons/win/icon.ico'
    },
    nsis: {
      artifactName: '${name}-test-${version}-setup.${ext}',
      uninstallDisplayName: '${productName}',
      createDesktopShortcut: 'always',
      oneClick: false,
      perMachine: true,
      language: '2052',
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
    //   repo: 'rmst-tools',
    //   vPrefixedTagName: true,
    //   releaseType: 'release'
    // }
  }

  // Promise is returned
  builder
    .build({
      targets: Platform.WINDOWS.createTarget(),
      config: options
    })
    .then(result => {
      console.log(JSON.stringify(result))
    })
    .catch(error => {
      console.error(error)
    })
}
