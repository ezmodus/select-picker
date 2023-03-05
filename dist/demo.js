/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/demo.js":
/*!*********************!*\
  !*** ./src/demo.js ***!
  \*********************/
/***/ (() => {

eval("let buttons = document.querySelectorAll('.show-button');\n\nbuttons.forEach(function(button) {\n    button.addEventListener('click', function() {\n        let target = document.getElementById(button.dataset.target);\n        target.classList.toggle('hide');\n\n    });\n});\n\n\n//# sourceURL=webpack://@ezmodus/select-picker/./src/demo.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/demo.js"]();
/******/ 	
/******/ })()
;