/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var electron_1 = __webpack_require__(/*! electron */ "electron");
var node_path_1 = __importDefault(__webpack_require__(/*! node:path */ "node:path"));
console.log(electron_1.app.isPackaged);
console.log("development");
var preloadPath = node_path_1.default.join(__dirname, '../preload/index.js');
electron_1.app.whenReady().then(function () {
    var win = new electron_1.BrowserWindow({
        webPreferences: { preload: preloadPath }
    });
    win.loadURL('http://localhost:10000/');
});
electron_1.app.on('browser-window-created', function (_, window) {
    var webContents = window.webContents;
    webContents.on('before-input-event', function (evt, input) {
        if (input.code === 'F12') {
            if (webContents.isDevToolsOpened()) {
                webContents.closeDevTools();
            }
            else {
                webContents.openDevTools({ mode: 'undocked' });
            }
        }
        if (input.code == 'F5') {
            webContents.reloadIgnoringCache();
        }
    });
});


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:path");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCLG1CQUFPLENBQUMsMEJBQVU7QUFDbkMsa0NBQWtDLG1CQUFPLENBQUMsNEJBQVc7QUFDckQ7QUFDQSxZQUFZLGFBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxrQkFBa0I7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7OztBQy9CRDs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm1zdC10b29scy13cGsvLi9zcmMvbWFpbi9pbmRleC50cyIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwibm9kZTpwYXRoXCIiLCJ3ZWJwYWNrOi8vcm1zdC10b29scy13cGsvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcm1zdC10b29scy13cGsvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9ybXN0LXRvb2xzLXdway93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vcm1zdC10b29scy13cGsvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGVsZWN0cm9uXzEgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XG52YXIgbm9kZV9wYXRoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm5vZGU6cGF0aFwiKSk7XG5jb25zb2xlLmxvZyhlbGVjdHJvbl8xLmFwcC5pc1BhY2thZ2VkKTtcbmNvbnNvbGUubG9nKHByb2Nlc3MuZW52Lk5PREVfRU5WKTtcbnZhciBwcmVsb2FkUGF0aCA9IG5vZGVfcGF0aF8xLmRlZmF1bHQuam9pbihfX2Rpcm5hbWUsICcuLi9wcmVsb2FkL2luZGV4LmpzJyk7XG5lbGVjdHJvbl8xLmFwcC53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd2luID0gbmV3IGVsZWN0cm9uXzEuQnJvd3NlcldpbmRvdyh7XG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7IHByZWxvYWQ6IHByZWxvYWRQYXRoIH1cbiAgICB9KTtcbiAgICB3aW4ubG9hZFVSTCgnaHR0cDovL2xvY2FsaG9zdDoxMDAwMC8nKTtcbn0pO1xuZWxlY3Ryb25fMS5hcHAub24oJ2Jyb3dzZXItd2luZG93LWNyZWF0ZWQnLCBmdW5jdGlvbiAoXywgd2luZG93KSB7XG4gICAgdmFyIHdlYkNvbnRlbnRzID0gd2luZG93LndlYkNvbnRlbnRzO1xuICAgIHdlYkNvbnRlbnRzLm9uKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBmdW5jdGlvbiAoZXZ0LCBpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuY29kZSA9PT0gJ0YxMicpIHtcbiAgICAgICAgICAgIGlmICh3ZWJDb250ZW50cy5pc0RldlRvb2xzT3BlbmVkKCkpIHtcbiAgICAgICAgICAgICAgICB3ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB3ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoeyBtb2RlOiAndW5kb2NrZWQnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dC5jb2RlID09ICdGNScpIHtcbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnJlbG9hZElnbm9yaW5nQ2FjaGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlOnBhdGhcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4vaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=