/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "./node_modules/.pnpm/@electron-toolkit+preload@3.0.1_electron@31.2.1/node_modules/@electron-toolkit/preload/dist/index.cjs":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@electron-toolkit+preload@3.0.1_electron@31.2.1/node_modules/@electron-toolkit/preload/dist/index.cjs ***!
  \**********************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



const electron = __webpack_require__(/*! electron */ "electron");

const electronAPI = {
  ipcRenderer: {
    send(channel, ...args) {
      electron.ipcRenderer.send(channel, ...args);
    },
    sendTo(webContentsId, channel, ...args) {
      const electronVer = process.versions.electron;
      const electronMajorVer = electronVer ? parseInt(electronVer.split(".")[0]) : 0;
      if (electronMajorVer >= 28) {
        throw new Error('"sendTo" method has been removed since Electron 28.');
      } else {
        electron.ipcRenderer.sendTo(webContentsId, channel, ...args);
      }
    },
    sendSync(channel, ...args) {
      return electron.ipcRenderer.sendSync(channel, ...args);
    },
    sendToHost(channel, ...args) {
      electron.ipcRenderer.sendToHost(channel, ...args);
    },
    postMessage(channel, message, transfer) {
      electron.ipcRenderer.postMessage(channel, message, transfer);
    },
    invoke(channel, ...args) {
      return electron.ipcRenderer.invoke(channel, ...args);
    },
    on(channel, listener) {
      electron.ipcRenderer.on(channel, listener);
      return () => {
        electron.ipcRenderer.removeListener(channel, listener);
      };
    },
    once(channel, listener) {
      electron.ipcRenderer.once(channel, listener);
      return () => {
        electron.ipcRenderer.removeListener(channel, listener);
      };
    },
    removeListener(channel, listener) {
      electron.ipcRenderer.removeListener(channel, listener);
      return this;
    },
    removeAllListeners(channel) {
      electron.ipcRenderer.removeAllListeners(channel);
    }
  },
  webFrame: {
    insertCSS(css) {
      return electron.webFrame.insertCSS(css);
    },
    setZoomFactor(factor) {
      if (typeof factor === "number" && factor > 0) {
        electron.webFrame.setZoomFactor(factor);
      }
    },
    setZoomLevel(level) {
      if (typeof level === "number") {
        electron.webFrame.setZoomLevel(level);
      }
    }
  },
  process: {
    get platform() {
      return process.platform;
    },
    get versions() {
      return process.versions;
    },
    get env() {
      return { ...process.env };
    }
  }
};
function exposeElectronAPI() {
  if (process.contextIsolated) {
    try {
      electron.contextBridge.exposeInMainWorld("electron", electronAPI);
    } catch (error) {
      console.error(error);
    }
  } else {
    window.electron = electronAPI;
  }
}

exports.electronAPI = electronAPI;
exports.exposeElectronAPI = exposeElectronAPI;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./src/preload/index.ts ***!
  \******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var electron_1 = __webpack_require__(/*! electron */ "electron");
var preload_1 = __webpack_require__(/*! @electron-toolkit/preload */ "./node_modules/.pnpm/@electron-toolkit+preload@3.0.1_electron@31.2.1/node_modules/@electron-toolkit/preload/dist/index.cjs");
// Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is enabled, otherwise just add to the DOM global.
if (process.contextIsolated) {
    try {
        electron_1.contextBridge.exposeInMainWorld('electron', preload_1.electronAPI);
    }
    catch (error) {
        console.error(error);
    }
}
else {
    // @ts-ignore (define in dts)
    window.electron = preload_1.electronAPI;
}
console.log('preload.js');

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FDQWE7O0FBRWIsaUJBQWlCLG1CQUFPLENBQUMsMEJBQVU7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQix5QkFBeUI7Ozs7Ozs7VUMxRnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCLG1CQUFPLENBQUMsMEJBQVU7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsNkpBQTJCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway8uL25vZGVfbW9kdWxlcy8ucG5wbS9AZWxlY3Ryb24tdG9vbGtpdCtwcmVsb2FkQDMuMC4xX2VsZWN0cm9uQDMxLjIuMS9ub2RlX21vZHVsZXMvQGVsZWN0cm9uLXRvb2xraXQvcHJlbG9hZC9kaXN0L2luZGV4LmNqcyIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway8uL3NyYy9wcmVsb2FkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xuXG5jb25zdCBlbGVjdHJvbkFQSSA9IHtcbiAgaXBjUmVuZGVyZXI6IHtcbiAgICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICAgIGVsZWN0cm9uLmlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICBzZW5kVG8od2ViQ29udGVudHNJZCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgICAgY29uc3QgZWxlY3Ryb25WZXIgPSBwcm9jZXNzLnZlcnNpb25zLmVsZWN0cm9uO1xuICAgICAgY29uc3QgZWxlY3Ryb25NYWpvclZlciA9IGVsZWN0cm9uVmVyID8gcGFyc2VJbnQoZWxlY3Ryb25WZXIuc3BsaXQoXCIuXCIpWzBdKSA6IDA7XG4gICAgICBpZiAoZWxlY3Ryb25NYWpvclZlciA+PSAyOCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wic2VuZFRvXCIgbWV0aG9kIGhhcyBiZWVuIHJlbW92ZWQgc2luY2UgRWxlY3Ryb24gMjguJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVjdHJvbi5pcGNSZW5kZXJlci5zZW5kVG8od2ViQ29udGVudHNJZCwgY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZW5kU3luYyhjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgICByZXR1cm4gZWxlY3Ryb24uaXBjUmVuZGVyZXIuc2VuZFN5bmMoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICBzZW5kVG9Ib3N0KGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICAgIGVsZWN0cm9uLmlwY1JlbmRlcmVyLnNlbmRUb0hvc3QoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICBwb3N0TWVzc2FnZShjaGFubmVsLCBtZXNzYWdlLCB0cmFuc2Zlcikge1xuICAgICAgZWxlY3Ryb24uaXBjUmVuZGVyZXIucG9zdE1lc3NhZ2UoY2hhbm5lbCwgbWVzc2FnZSwgdHJhbnNmZXIpO1xuICAgIH0sXG4gICAgaW52b2tlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICAgIHJldHVybiBlbGVjdHJvbi5pcGNSZW5kZXJlci5pbnZva2UoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICBvbihjaGFubmVsLCBsaXN0ZW5lcikge1xuICAgICAgZWxlY3Ryb24uaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgbGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZWxlY3Ryb24uaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgbGlzdGVuZXIpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbCwgbGlzdGVuZXIpIHtcbiAgICAgIGVsZWN0cm9uLmlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgbGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZWxlY3Ryb24uaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgbGlzdGVuZXIpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGxpc3RlbmVyKSB7XG4gICAgICBlbGVjdHJvbi5pcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBsaXN0ZW5lcik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUFsbExpc3RlbmVycyhjaGFubmVsKSB7XG4gICAgICBlbGVjdHJvbi5pcGNSZW5kZXJlci5yZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbCk7XG4gICAgfVxuICB9LFxuICB3ZWJGcmFtZToge1xuICAgIGluc2VydENTUyhjc3MpIHtcbiAgICAgIHJldHVybiBlbGVjdHJvbi53ZWJGcmFtZS5pbnNlcnRDU1MoY3NzKTtcbiAgICB9LFxuICAgIHNldFpvb21GYWN0b3IoZmFjdG9yKSB7XG4gICAgICBpZiAodHlwZW9mIGZhY3RvciA9PT0gXCJudW1iZXJcIiAmJiBmYWN0b3IgPiAwKSB7XG4gICAgICAgIGVsZWN0cm9uLndlYkZyYW1lLnNldFpvb21GYWN0b3IoZmFjdG9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldFpvb21MZXZlbChsZXZlbCkge1xuICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVjdHJvbi53ZWJGcmFtZS5zZXRab29tTGV2ZWwobGV2ZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHJvY2Vzczoge1xuICAgIGdldCBwbGF0Zm9ybSgpIHtcbiAgICAgIHJldHVybiBwcm9jZXNzLnBsYXRmb3JtO1xuICAgIH0sXG4gICAgZ2V0IHZlcnNpb25zKCkge1xuICAgICAgcmV0dXJuIHByb2Nlc3MudmVyc2lvbnM7XG4gICAgfSxcbiAgICBnZXQgZW52KCkge1xuICAgICAgcmV0dXJuIHsgLi4ucHJvY2Vzcy5lbnYgfTtcbiAgICB9XG4gIH1cbn07XG5mdW5jdGlvbiBleHBvc2VFbGVjdHJvbkFQSSgpIHtcbiAgaWYgKHByb2Nlc3MuY29udGV4dElzb2xhdGVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGVsZWN0cm9uLmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoXCJlbGVjdHJvblwiLCBlbGVjdHJvbkFQSSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuZWxlY3Ryb24gPSBlbGVjdHJvbkFQSTtcbiAgfVxufVxuXG5leHBvcnRzLmVsZWN0cm9uQVBJID0gZWxlY3Ryb25BUEk7XG5leHBvcnRzLmV4cG9zZUVsZWN0cm9uQVBJID0gZXhwb3NlRWxlY3Ryb25BUEk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZWxlY3Ryb25fMSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcbnZhciBwcmVsb2FkXzEgPSByZXF1aXJlKFwiQGVsZWN0cm9uLXRvb2xraXQvcHJlbG9hZFwiKTtcbi8vIFVzZSBgY29udGV4dEJyaWRnZWAgQVBJcyB0byBleHBvc2UgRWxlY3Ryb24gQVBJcyB0byByZW5kZXJlciBvbmx5IGlmIGNvbnRleHQgaXNvbGF0aW9uIGlzIGVuYWJsZWQsIG90aGVyd2lzZSBqdXN0IGFkZCB0byB0aGUgRE9NIGdsb2JhbC5cbmlmIChwcm9jZXNzLmNvbnRleHRJc29sYXRlZCkge1xuICAgIHRyeSB7XG4gICAgICAgIGVsZWN0cm9uXzEuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb24nLCBwcmVsb2FkXzEuZWxlY3Ryb25BUEkpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxufVxuZWxzZSB7XG4gICAgLy8gQHRzLWlnbm9yZSAoZGVmaW5lIGluIGR0cylcbiAgICB3aW5kb3cuZWxlY3Ryb24gPSBwcmVsb2FkXzEuZWxlY3Ryb25BUEk7XG59XG5jb25zb2xlLmxvZygncHJlbG9hZC5qcycpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9