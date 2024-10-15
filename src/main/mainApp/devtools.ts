import { BrowserWindow } from 'electron'

export function modifyFont(window: BrowserWindow) {
  const css = `
      :root {
          --sys-color-base: var(--ref-palette-neutral100);
          --source-code-font-family: consolas;
          --source-code-font-size: 14px;
          --monospace-font-family: consolas;
          --monospace-font-size: 14px;
          --default-font-family: system-ui, sans-serif;
          --default-font-size: 14px;
      }
      .-theme-with-dark-background {
          --sys-color-base: var(--ref-palette-secondary25);
      }
      body {
          --default-font-family: system-ui,sans-serif;
      }`

  window.webContents.devToolsWebContents.executeJavaScript(`
      const overriddenStyle = document.createElement('style');
      overriddenStyle.innerHTML = '${css.replaceAll('\n', ' ')}';
      document.body.append(overriddenStyle);
      document.body.classList.remove('platform-windows');`)
}
