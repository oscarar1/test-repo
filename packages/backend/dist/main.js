/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2c950fbd606138ad1ca4";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9oYXJtb255LW1vZHVsZS5qcy5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWxNb2R1bGUpIHtcblx0aWYgKCFvcmlnaW5hbE1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHR2YXIgbW9kdWxlID0gT2JqZWN0LmNyZWF0ZShvcmlnaW5hbE1vZHVsZSk7XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiZXhwb3J0c1wiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../node_modules/webpack/buildin/harmony-module.js\n");

/***/ }),

/***/ "../../node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"../../node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy1hcHBseS1yZXN1bHQuanMuanMiLCJzb3VyY2VzIjpbImZpbGU6Ly8vL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy1hcHBseS1yZXN1bHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiXG5cdFx0XHQpO1xuXHR9XG59O1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///../../node_modules/webpack/hot/log-apply-result.js\n");

/***/ }),

/***/ "../../node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\nmodule.exports.formatError = function(err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + \"\\n\" + stack;\n\t} else {\n\t\treturn stack;\n\t}\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy5qcy5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../node_modules/webpack/hot/log.js\n");

/***/ }),

/***/ "../../node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"../../node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"../../node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + log.formatError(err));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L3BvbGwuanM/MTAwLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzPzEwMCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUVBOztBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../node_modules/webpack/hot/poll.js?100\n");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var express_promise_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-promise-router */ \"express-promise-router\");\n/* harmony import */ var express_promise_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_promise_router__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @backstage/backend-common */ \"@backstage/backend-common\");\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _plugins_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plugins/app */ \"./src/plugins/app.ts\");\n/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins/auth */ \"./src/plugins/auth.ts\");\n/* harmony import */ var _plugins_catalog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugins/catalog */ \"./src/plugins/catalog.ts\");\n/* harmony import */ var _plugins_scaffolder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins/scaffolder */ \"./src/plugins/scaffolder.ts\");\n/* harmony import */ var _plugins_proxy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugins/proxy */ \"./src/plugins/proxy.ts\");\n/* harmony import */ var _plugins_techdocs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugins/techdocs */ \"./src/plugins/techdocs.ts\");\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/*\n * Hi!\n *\n * Note that this is an EXAMPLE Backstage backend. Please check the README.\n *\n * Happy hacking!\n */\n\n\n\n\n\n\n\n\n\n\n\n\nfunction makeCreateEnv(config) {\n  const root = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"getRootLogger\"])();\n  const reader = _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"UrlReaders\"].default({ logger: root, config });\n  const discovery = _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"SingleHostDiscovery\"].fromConfig(config);\n\n  root.info(`Created UrlReader ${reader}`);\n\n  const databaseManager = _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"SingleConnectionDatabaseManager\"].fromConfig(config);\n  const cacheManager = _backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"CacheManager\"].fromConfig(config);\n\n  return (plugin) => {\n    const logger = root.child({ type: 'plugin', plugin });\n    const database = databaseManager.forPlugin(plugin);\n    const cache = cacheManager.forPlugin(plugin);\n    return { logger, database, cache, config, reader, discovery };\n  };\n}\n\nasync function main() {\n  const config = await Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"loadBackendConfig\"])({\n    argv: process.argv,\n    logger: Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"getRootLogger\"])(),\n  });\n  const createEnv = makeCreateEnv(config);\n\n  const catalogEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('catalog'));\n  const scaffolderEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('scaffolder'));\n  const authEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('auth'));\n  const proxyEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('proxy'));\n  const techdocsEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('techdocs'));\n  const appEnv = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"useHotMemoize\"])(module, () => createEnv('app'));\n\n  const apiRouter = express_promise_router__WEBPACK_IMPORTED_MODULE_0___default()();\n  apiRouter.use('/catalog', await Object(_plugins_catalog__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(catalogEnv));\n  apiRouter.use('/scaffolder', await Object(_plugins_scaffolder__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(scaffolderEnv));\n  apiRouter.use('/auth', await Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(authEnv));\n  apiRouter.use('/techdocs', await Object(_plugins_techdocs__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(techdocsEnv));\n  apiRouter.use('/proxy', await Object(_plugins_proxy__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(proxyEnv));\n  apiRouter.use(Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"notFoundHandler\"])());\n\n  const service = Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_1__[\"createServiceBuilder\"])(module)\n    .loadConfig(config)\n    .addRouter('/api', apiRouter)\n    .addRouter('', await Object(_plugins_app__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(appEnv));\n\n  await service.start().catch(err => {\n    console.log(err);\n    process.exit(1);\n  });\n}\n\n_optionalChain([module, 'access', _ => _.hot, 'optionalAccess', _2 => _2.accept, 'call', _3 => _3()]);\nmain().catch(error => {\n  console.error(`Backend failed to start up, ${error}`);\n  process.exit(1);\n});\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(makeCreateEnv, \"makeCreateEnv\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/index.ts\");\n  reactHotLoader.register(main, \"main\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/index.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXgudHMuanMiLCJzb3VyY2VzIjpbImZpbGU6Ly8vL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHsgdmFyIGVudGVyTW9kdWxlID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmVudGVyTW9kdWxlOyBlbnRlck1vZHVsZSAmJiBlbnRlck1vZHVsZShtb2R1bGUpOyB9KSgpOyBmdW5jdGlvbiBfb3B0aW9uYWxDaGFpbihvcHMpIHsgbGV0IGxhc3RBY2Nlc3NMSFMgPSB1bmRlZmluZWQ7IGxldCB2YWx1ZSA9IG9wc1swXTsgbGV0IGkgPSAxOyB3aGlsZSAoaSA8IG9wcy5sZW5ndGgpIHsgY29uc3Qgb3AgPSBvcHNbaV07IGNvbnN0IGZuID0gb3BzW2kgKyAxXTsgaSArPSAyOyBpZiAoKG9wID09PSAnb3B0aW9uYWxBY2Nlc3MnIHx8IG9wID09PSAnb3B0aW9uYWxDYWxsJykgJiYgdmFsdWUgPT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGlmIChvcCA9PT0gJ2FjY2VzcycgfHwgb3AgPT09ICdvcHRpb25hbEFjY2VzcycpIHsgbGFzdEFjY2Vzc0xIUyA9IHZhbHVlOyB2YWx1ZSA9IGZuKHZhbHVlKTsgfSBlbHNlIGlmIChvcCA9PT0gJ2NhbGwnIHx8IG9wID09PSAnb3B0aW9uYWxDYWxsJykgeyB2YWx1ZSA9IGZuKCguLi5hcmdzKSA9PiB2YWx1ZS5jYWxsKGxhc3RBY2Nlc3NMSFMsIC4uLmFyZ3MpKTsgbGFzdEFjY2Vzc0xIUyA9IHVuZGVmaW5lZDsgfSB9IHJldHVybiB2YWx1ZTsgfS8qXG4gKiBIaSFcbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBpcyBhbiBFWEFNUExFIEJhY2tzdGFnZSBiYWNrZW5kLiBQbGVhc2UgY2hlY2sgdGhlIFJFQURNRS5cbiAqXG4gKiBIYXBweSBoYWNraW5nIVxuICovXG5cbmltcG9ydCBSb3V0ZXIgZnJvbSAnZXhwcmVzcy1wcm9taXNlLXJvdXRlcic7XG5pbXBvcnQge1xuICBjcmVhdGVTZXJ2aWNlQnVpbGRlcixcbiAgbG9hZEJhY2tlbmRDb25maWcsXG4gIGdldFJvb3RMb2dnZXIsXG4gIHVzZUhvdE1lbW9pemUsXG4gIG5vdEZvdW5kSGFuZGxlcixcbiAgQ2FjaGVNYW5hZ2VyLFxuICBTaW5nbGVDb25uZWN0aW9uRGF0YWJhc2VNYW5hZ2VyLFxuICBTaW5nbGVIb3N0RGlzY292ZXJ5LFxuICBVcmxSZWFkZXJzLFxufSBmcm9tICdAYmFja3N0YWdlL2JhY2tlbmQtY29tbW9uJztcblxuaW1wb3J0IGFwcCBmcm9tICcuL3BsdWdpbnMvYXBwJztcbmltcG9ydCBhdXRoIGZyb20gJy4vcGx1Z2lucy9hdXRoJztcbmltcG9ydCBjYXRhbG9nIGZyb20gJy4vcGx1Z2lucy9jYXRhbG9nJztcbmltcG9ydCBzY2FmZm9sZGVyIGZyb20gJy4vcGx1Z2lucy9zY2FmZm9sZGVyJztcbmltcG9ydCBwcm94eSBmcm9tICcuL3BsdWdpbnMvcHJveHknO1xuaW1wb3J0IHRlY2hkb2NzIGZyb20gJy4vcGx1Z2lucy90ZWNoZG9jcyc7XG5cblxuZnVuY3Rpb24gbWFrZUNyZWF0ZUVudihjb25maWcpIHtcbiAgY29uc3Qgcm9vdCA9IGdldFJvb3RMb2dnZXIoKTtcbiAgY29uc3QgcmVhZGVyID0gVXJsUmVhZGVycy5kZWZhdWx0KHsgbG9nZ2VyOiByb290LCBjb25maWcgfSk7XG4gIGNvbnN0IGRpc2NvdmVyeSA9IFNpbmdsZUhvc3REaXNjb3ZlcnkuZnJvbUNvbmZpZyhjb25maWcpO1xuXG4gIHJvb3QuaW5mbyhgQ3JlYXRlZCBVcmxSZWFkZXIgJHtyZWFkZXJ9YCk7XG5cbiAgY29uc3QgZGF0YWJhc2VNYW5hZ2VyID0gU2luZ2xlQ29ubmVjdGlvbkRhdGFiYXNlTWFuYWdlci5mcm9tQ29uZmlnKGNvbmZpZyk7XG4gIGNvbnN0IGNhY2hlTWFuYWdlciA9IENhY2hlTWFuYWdlci5mcm9tQ29uZmlnKGNvbmZpZyk7XG5cbiAgcmV0dXJuIChwbHVnaW4pID0+IHtcbiAgICBjb25zdCBsb2dnZXIgPSByb290LmNoaWxkKHsgdHlwZTogJ3BsdWdpbicsIHBsdWdpbiB9KTtcbiAgICBjb25zdCBkYXRhYmFzZSA9IGRhdGFiYXNlTWFuYWdlci5mb3JQbHVnaW4ocGx1Z2luKTtcbiAgICBjb25zdCBjYWNoZSA9IGNhY2hlTWFuYWdlci5mb3JQbHVnaW4ocGx1Z2luKTtcbiAgICByZXR1cm4geyBsb2dnZXIsIGRhdGFiYXNlLCBjYWNoZSwgY29uZmlnLCByZWFkZXIsIGRpc2NvdmVyeSB9O1xuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBjb25maWcgPSBhd2FpdCBsb2FkQmFja2VuZENvbmZpZyh7XG4gICAgYXJndjogcHJvY2Vzcy5hcmd2LFxuICAgIGxvZ2dlcjogZ2V0Um9vdExvZ2dlcigpLFxuICB9KTtcbiAgY29uc3QgY3JlYXRlRW52ID0gbWFrZUNyZWF0ZUVudihjb25maWcpO1xuXG4gIGNvbnN0IGNhdGFsb2dFbnYgPSB1c2VIb3RNZW1vaXplKG1vZHVsZSwgKCkgPT4gY3JlYXRlRW52KCdjYXRhbG9nJykpO1xuICBjb25zdCBzY2FmZm9sZGVyRW52ID0gdXNlSG90TWVtb2l6ZShtb2R1bGUsICgpID0+IGNyZWF0ZUVudignc2NhZmZvbGRlcicpKTtcbiAgY29uc3QgYXV0aEVudiA9IHVzZUhvdE1lbW9pemUobW9kdWxlLCAoKSA9PiBjcmVhdGVFbnYoJ2F1dGgnKSk7XG4gIGNvbnN0IHByb3h5RW52ID0gdXNlSG90TWVtb2l6ZShtb2R1bGUsICgpID0+IGNyZWF0ZUVudigncHJveHknKSk7XG4gIGNvbnN0IHRlY2hkb2NzRW52ID0gdXNlSG90TWVtb2l6ZShtb2R1bGUsICgpID0+IGNyZWF0ZUVudigndGVjaGRvY3MnKSk7XG4gIGNvbnN0IGFwcEVudiA9IHVzZUhvdE1lbW9pemUobW9kdWxlLCAoKSA9PiBjcmVhdGVFbnYoJ2FwcCcpKTtcblxuICBjb25zdCBhcGlSb3V0ZXIgPSBSb3V0ZXIoKTtcbiAgYXBpUm91dGVyLnVzZSgnL2NhdGFsb2cnLCBhd2FpdCBjYXRhbG9nKGNhdGFsb2dFbnYpKTtcbiAgYXBpUm91dGVyLnVzZSgnL3NjYWZmb2xkZXInLCBhd2FpdCBzY2FmZm9sZGVyKHNjYWZmb2xkZXJFbnYpKTtcbiAgYXBpUm91dGVyLnVzZSgnL2F1dGgnLCBhd2FpdCBhdXRoKGF1dGhFbnYpKTtcbiAgYXBpUm91dGVyLnVzZSgnL3RlY2hkb2NzJywgYXdhaXQgdGVjaGRvY3ModGVjaGRvY3NFbnYpKTtcbiAgYXBpUm91dGVyLnVzZSgnL3Byb3h5JywgYXdhaXQgcHJveHkocHJveHlFbnYpKTtcbiAgYXBpUm91dGVyLnVzZShub3RGb3VuZEhhbmRsZXIoKSk7XG5cbiAgY29uc3Qgc2VydmljZSA9IGNyZWF0ZVNlcnZpY2VCdWlsZGVyKG1vZHVsZSlcbiAgICAubG9hZENvbmZpZyhjb25maWcpXG4gICAgLmFkZFJvdXRlcignL2FwaScsIGFwaVJvdXRlcilcbiAgICAuYWRkUm91dGVyKCcnLCBhd2FpdCBhcHAoYXBwRW52KSk7XG5cbiAgYXdhaXQgc2VydmljZS5zdGFydCgpLmNhdGNoKGVyciA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH0pO1xufVxuXG5fb3B0aW9uYWxDaGFpbihbbW9kdWxlLCAnYWNjZXNzJywgXyA9PiBfLmhvdCwgJ29wdGlvbmFsQWNjZXNzJywgXzIgPT4gXzIuYWNjZXB0LCAnY2FsbCcsIF8zID0+IF8zKCldKTtcbm1haW4oKS5jYXRjaChlcnJvciA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoYEJhY2tlbmQgZmFpbGVkIHRvIHN0YXJ0IHVwLCAke2Vycm9yfWApO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcblxuOyhmdW5jdGlvbiAoKSB7XG4gIHZhciByZWFjdEhvdExvYWRlciA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5kZWZhdWx0O1xuICB2YXIgbGVhdmVNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykubGVhdmVNb2R1bGU7XG4gIGlmICghcmVhY3RIb3RMb2FkZXIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVhY3RIb3RMb2FkZXIucmVnaXN0ZXIobWFrZUNyZWF0ZUVudiwgXCJtYWtlQ3JlYXRlRW52XCIsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvaW5kZXgudHNcIik7XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKG1haW4sIFwibWFpblwiLCBcIi9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvc3JjL2luZGV4LnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/index.ts\n");

/***/ }),

/***/ "./src/plugins/app.ts":
/*!****************************!*\
  !*** ./src/plugins/app.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_plugin_app_backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/plugin-app-backend */ \"@backstage/plugin-app-backend\");\n/* harmony import */ var _backstage_plugin_app_backend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_app_backend__WEBPACK_IMPORTED_MODULE_0__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\nasync function createPlugin({\n  logger,\n  config,\n}) {\n  return await Object(_backstage_plugin_app_backend__WEBPACK_IMPORTED_MODULE_0__[\"createRouter\"])({\n    logger,\n    config,\n    appPackageName: 'app',\n  });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/app.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9hcHAudHMuanMiLCJzb3VyY2VzIjpbImZpbGU6Ly8vL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHsgdmFyIGVudGVyTW9kdWxlID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmVudGVyTW9kdWxlOyBlbnRlck1vZHVsZSAmJiBlbnRlck1vZHVsZShtb2R1bGUpOyB9KSgpO2ltcG9ydCB7IGNyZWF0ZVJvdXRlciB9IGZyb20gJ0BiYWNrc3RhZ2UvcGx1Z2luLWFwcC1iYWNrZW5kJztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbih7XG4gIGxvZ2dlcixcbiAgY29uZmlnLFxufSkge1xuICByZXR1cm4gYXdhaXQgY3JlYXRlUm91dGVyKHtcbiAgICBsb2dnZXIsXG4gICAgY29uZmlnLFxuICAgIGFwcFBhY2thZ2VOYW1lOiAnYXBwJyxcbiAgfSk7XG59XG5cbjsoZnVuY3Rpb24gKCkge1xuICB2YXIgcmVhY3RIb3RMb2FkZXIgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZGVmYXVsdDtcbiAgdmFyIGxlYXZlTW9kdWxlID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmxlYXZlTW9kdWxlO1xuICBpZiAoIXJlYWN0SG90TG9hZGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKGNyZWF0ZVBsdWdpbiwgXCJjcmVhdGVQbHVnaW5cIiwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL2FwcC50c1wiKTtcbiAgbGVhdmVNb2R1bGUobW9kdWxlKTtcbn0pKCk7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/plugins/app.ts\n");

/***/ }),

/***/ "./src/plugins/auth.ts":
/*!*****************************!*\
  !*** ./src/plugins/auth.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_plugin_auth_backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/plugin-auth-backend */ \"@backstage/plugin-auth-backend\");\n/* harmony import */ var _backstage_plugin_auth_backend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_auth_backend__WEBPACK_IMPORTED_MODULE_0__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\nasync function createPlugin({\n  logger,\n  database,\n  config,\n  discovery,\n}) {\n  return await Object(_backstage_plugin_auth_backend__WEBPACK_IMPORTED_MODULE_0__[\"createRouter\"])({ logger, config, database, discovery });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/auth.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9hdXRoLnRzLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkgeyB2YXIgZW50ZXJNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZW50ZXJNb2R1bGU7IGVudGVyTW9kdWxlICYmIGVudGVyTW9kdWxlKG1vZHVsZSk7IH0pKCk7aW1wb3J0IHsgY3JlYXRlUm91dGVyIH0gZnJvbSAnQGJhY2tzdGFnZS9wbHVnaW4tYXV0aC1iYWNrZW5kJztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbih7XG4gIGxvZ2dlcixcbiAgZGF0YWJhc2UsXG4gIGNvbmZpZyxcbiAgZGlzY292ZXJ5LFxufSkge1xuICByZXR1cm4gYXdhaXQgY3JlYXRlUm91dGVyKHsgbG9nZ2VyLCBjb25maWcsIGRhdGFiYXNlLCBkaXNjb3ZlcnkgfSk7XG59XG5cbjsoZnVuY3Rpb24gKCkge1xuICB2YXIgcmVhY3RIb3RMb2FkZXIgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZGVmYXVsdDtcbiAgdmFyIGxlYXZlTW9kdWxlID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmxlYXZlTW9kdWxlO1xuICBpZiAoIXJlYWN0SG90TG9hZGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKGNyZWF0ZVBsdWdpbiwgXCJjcmVhdGVQbHVnaW5cIiwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL2F1dGgudHNcIik7XG4gIGxlYXZlTW9kdWxlKG1vZHVsZSk7XG59KSgpOyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/plugins/auth.ts\n");

/***/ }),

/***/ "./src/plugins/catalog.ts":
/*!********************************!*\
  !*** ./src/plugins/catalog.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/backend-common */ \"@backstage/backend-common\");\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @backstage/plugin-catalog-backend */ \"@backstage/plugin-catalog-backend\");\n/* harmony import */ var _backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\n\nasync function createPlugin(env) {\n  const builder = new _backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1__[\"CatalogBuilder\"](env);\n  const {\n    entitiesCatalog,\n    locationsCatalog,\n    higherOrderOperation,\n    locationAnalyzer,\n  } = await builder.build();\n\n  Object(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__[\"useHotCleanup\"])(\n    module,\n    Object(_backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1__[\"runPeriodically\"])(() => higherOrderOperation.refreshAllLocations(), 100000),\n  );\n\n  return await Object(_backstage_plugin_catalog_backend__WEBPACK_IMPORTED_MODULE_1__[\"createRouter\"])({\n    entitiesCatalog,\n    locationsCatalog,\n    higherOrderOperation,\n    locationAnalyzer,\n    logger: env.logger,\n    config: env.config,\n  });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/catalog.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9jYXRhbG9nLnRzLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvY2F0YWxvZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkgeyB2YXIgZW50ZXJNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZW50ZXJNb2R1bGU7IGVudGVyTW9kdWxlICYmIGVudGVyTW9kdWxlKG1vZHVsZSk7IH0pKCk7aW1wb3J0IHsgdXNlSG90Q2xlYW51cCB9IGZyb20gJ0BiYWNrc3RhZ2UvYmFja2VuZC1jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2F0YWxvZ0J1aWxkZXIsXG4gIGNyZWF0ZVJvdXRlcixcbiAgcnVuUGVyaW9kaWNhbGx5XG59IGZyb20gJ0BiYWNrc3RhZ2UvcGx1Z2luLWNhdGFsb2ctYmFja2VuZCc7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQbHVnaW4oZW52KSB7XG4gIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQ2F0YWxvZ0J1aWxkZXIoZW52KTtcbiAgY29uc3Qge1xuICAgIGVudGl0aWVzQ2F0YWxvZyxcbiAgICBsb2NhdGlvbnNDYXRhbG9nLFxuICAgIGhpZ2hlck9yZGVyT3BlcmF0aW9uLFxuICAgIGxvY2F0aW9uQW5hbHl6ZXIsXG4gIH0gPSBhd2FpdCBidWlsZGVyLmJ1aWxkKCk7XG5cbiAgdXNlSG90Q2xlYW51cChcbiAgICBtb2R1bGUsXG4gICAgcnVuUGVyaW9kaWNhbGx5KCgpID0+IGhpZ2hlck9yZGVyT3BlcmF0aW9uLnJlZnJlc2hBbGxMb2NhdGlvbnMoKSwgMTAwMDAwKSxcbiAgKTtcblxuICByZXR1cm4gYXdhaXQgY3JlYXRlUm91dGVyKHtcbiAgICBlbnRpdGllc0NhdGFsb2csXG4gICAgbG9jYXRpb25zQ2F0YWxvZyxcbiAgICBoaWdoZXJPcmRlck9wZXJhdGlvbixcbiAgICBsb2NhdGlvbkFuYWx5emVyLFxuICAgIGxvZ2dlcjogZW52LmxvZ2dlcixcbiAgICBjb25maWc6IGVudi5jb25maWcsXG4gIH0pO1xufVxuXG47KGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlYWN0SG90TG9hZGVyID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmRlZmF1bHQ7XG4gIHZhciBsZWF2ZU1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5sZWF2ZU1vZHVsZTtcbiAgaWYgKCFyZWFjdEhvdExvYWRlcikge1xuICAgIHJldHVybjtcbiAgfVxuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihjcmVhdGVQbHVnaW4sIFwiY3JlYXRlUGx1Z2luXCIsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9jYXRhbG9nLnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/plugins/catalog.ts\n");

/***/ }),

/***/ "./src/plugins/proxy.ts":
/*!******************************!*\
  !*** ./src/plugins/proxy.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_plugin_proxy_backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/plugin-proxy-backend */ \"@backstage/plugin-proxy-backend\");\n/* harmony import */ var _backstage_plugin_proxy_backend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_proxy_backend__WEBPACK_IMPORTED_MODULE_0__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\nasync function createPlugin({\n  logger,\n  config,\n  discovery,\n}) {\n  return await Object(_backstage_plugin_proxy_backend__WEBPACK_IMPORTED_MODULE_0__[\"createRouter\"])({ logger, config, discovery });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/proxy.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9wcm94eS50cy5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL3Byb3h5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7IHZhciBlbnRlck1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5lbnRlck1vZHVsZTsgZW50ZXJNb2R1bGUgJiYgZW50ZXJNb2R1bGUobW9kdWxlKTsgfSkoKTtpbXBvcnQgeyBjcmVhdGVSb3V0ZXIgfSBmcm9tICdAYmFja3N0YWdlL3BsdWdpbi1wcm94eS1iYWNrZW5kJztcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbih7XG4gIGxvZ2dlcixcbiAgY29uZmlnLFxuICBkaXNjb3ZlcnksXG59KSB7XG4gIHJldHVybiBhd2FpdCBjcmVhdGVSb3V0ZXIoeyBsb2dnZXIsIGNvbmZpZywgZGlzY292ZXJ5IH0pO1xufVxuXG47KGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlYWN0SG90TG9hZGVyID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmRlZmF1bHQ7XG4gIHZhciBsZWF2ZU1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5sZWF2ZU1vZHVsZTtcbiAgaWYgKCFyZWFjdEhvdExvYWRlcikge1xuICAgIHJldHVybjtcbiAgfVxuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihjcmVhdGVQbHVnaW4sIFwiY3JlYXRlUGx1Z2luXCIsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9wcm94eS50c1wiKTtcbiAgbGVhdmVNb2R1bGUobW9kdWxlKTtcbn0pKCk7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/plugins/proxy.ts\n");

/***/ }),

/***/ "./src/plugins/scaffolder.ts":
/*!***********************************!*\
  !*** ./src/plugins/scaffolder.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/backend-common */ \"@backstage/backend-common\");\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @backstage/catalog-client */ \"@backstage/catalog-client\");\n/* harmony import */ var _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @backstage/plugin-scaffolder-backend */ \"@backstage/plugin-scaffolder-backend\");\n/* harmony import */ var _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var dockerode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dockerode */ \"dockerode\");\n/* harmony import */ var dockerode__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dockerode__WEBPACK_IMPORTED_MODULE_3__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\n\n\n\nasync function createPlugin({\n  logger,\n  config,\n  database,\n  reader,\n}) {\n  const dockerClient = new dockerode__WEBPACK_IMPORTED_MODULE_3___default.a();\n  const containerRunner = new _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__[\"DockerContainerRunner\"]({ dockerClient });\n\n  const cookiecutterTemplater = new _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"CookieCutter\"]({ containerRunner });\n  const craTemplater = new _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"CreateReactAppTemplater\"]({ containerRunner });\n  const templaters = new _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"Templaters\"]();\n\n  templaters.register('cookiecutter', cookiecutterTemplater);\n  templaters.register('cra', craTemplater);\n\n  const preparers = await _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"Preparers\"].fromConfig(config, { logger });\n  const publishers = await _backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"Publishers\"].fromConfig(config, { logger });\n\n  const discovery = _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__[\"SingleHostDiscovery\"].fromConfig(config);\n  const catalogClient = new _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__[\"CatalogClient\"]({ discoveryApi: discovery });\n\n  return await Object(_backstage_plugin_scaffolder_backend__WEBPACK_IMPORTED_MODULE_2__[\"createRouter\"])({\n    preparers,\n    templaters,\n    publishers,\n    logger,\n    config,\n    database,\n    catalogClient,\n    reader,\n  });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/scaffolder.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyLnRzLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvc3JjL3BsdWdpbnMvc2NhZmZvbGRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkgeyB2YXIgZW50ZXJNb2R1bGUgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZW50ZXJNb2R1bGU7IGVudGVyTW9kdWxlICYmIGVudGVyTW9kdWxlKG1vZHVsZSk7IH0pKCk7aW1wb3J0IHtcbiAgRG9ja2VyQ29udGFpbmVyUnVubmVyLFxuICBTaW5nbGVIb3N0RGlzY292ZXJ5LFxufSBmcm9tICdAYmFja3N0YWdlL2JhY2tlbmQtY29tbW9uJztcbmltcG9ydCB7IENhdGFsb2dDbGllbnQgfSBmcm9tICdAYmFja3N0YWdlL2NhdGFsb2ctY2xpZW50JztcbmltcG9ydCB7XG4gIENvb2tpZUN1dHRlcixcbiAgQ3JlYXRlUmVhY3RBcHBUZW1wbGF0ZXIsXG4gIGNyZWF0ZVJvdXRlcixcbiAgUHJlcGFyZXJzLFxuICBQdWJsaXNoZXJzLFxuICBUZW1wbGF0ZXJzLFxufSBmcm9tICdAYmFja3N0YWdlL3BsdWdpbi1zY2FmZm9sZGVyLWJhY2tlbmQnO1xuaW1wb3J0IERvY2tlciBmcm9tICdkb2NrZXJvZGUnO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUGx1Z2luKHtcbiAgbG9nZ2VyLFxuICBjb25maWcsXG4gIGRhdGFiYXNlLFxuICByZWFkZXIsXG59KSB7XG4gIGNvbnN0IGRvY2tlckNsaWVudCA9IG5ldyBEb2NrZXIoKTtcbiAgY29uc3QgY29udGFpbmVyUnVubmVyID0gbmV3IERvY2tlckNvbnRhaW5lclJ1bm5lcih7IGRvY2tlckNsaWVudCB9KTtcblxuICBjb25zdCBjb29raWVjdXR0ZXJUZW1wbGF0ZXIgPSBuZXcgQ29va2llQ3V0dGVyKHsgY29udGFpbmVyUnVubmVyIH0pO1xuICBjb25zdCBjcmFUZW1wbGF0ZXIgPSBuZXcgQ3JlYXRlUmVhY3RBcHBUZW1wbGF0ZXIoeyBjb250YWluZXJSdW5uZXIgfSk7XG4gIGNvbnN0IHRlbXBsYXRlcnMgPSBuZXcgVGVtcGxhdGVycygpO1xuXG4gIHRlbXBsYXRlcnMucmVnaXN0ZXIoJ2Nvb2tpZWN1dHRlcicsIGNvb2tpZWN1dHRlclRlbXBsYXRlcik7XG4gIHRlbXBsYXRlcnMucmVnaXN0ZXIoJ2NyYScsIGNyYVRlbXBsYXRlcik7XG5cbiAgY29uc3QgcHJlcGFyZXJzID0gYXdhaXQgUHJlcGFyZXJzLmZyb21Db25maWcoY29uZmlnLCB7IGxvZ2dlciB9KTtcbiAgY29uc3QgcHVibGlzaGVycyA9IGF3YWl0IFB1Ymxpc2hlcnMuZnJvbUNvbmZpZyhjb25maWcsIHsgbG9nZ2VyIH0pO1xuXG4gIGNvbnN0IGRpc2NvdmVyeSA9IFNpbmdsZUhvc3REaXNjb3ZlcnkuZnJvbUNvbmZpZyhjb25maWcpO1xuICBjb25zdCBjYXRhbG9nQ2xpZW50ID0gbmV3IENhdGFsb2dDbGllbnQoeyBkaXNjb3ZlcnlBcGk6IGRpc2NvdmVyeSB9KTtcblxuICByZXR1cm4gYXdhaXQgY3JlYXRlUm91dGVyKHtcbiAgICBwcmVwYXJlcnMsXG4gICAgdGVtcGxhdGVycyxcbiAgICBwdWJsaXNoZXJzLFxuICAgIGxvZ2dlcixcbiAgICBjb25maWcsXG4gICAgZGF0YWJhc2UsXG4gICAgY2F0YWxvZ0NsaWVudCxcbiAgICByZWFkZXIsXG4gIH0pO1xufVxuXG47KGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlYWN0SG90TG9hZGVyID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmRlZmF1bHQ7XG4gIHZhciBsZWF2ZU1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5sZWF2ZU1vZHVsZTtcbiAgaWYgKCFyZWFjdEhvdExvYWRlcikge1xuICAgIHJldHVybjtcbiAgfVxuICByZWFjdEhvdExvYWRlci5yZWdpc3RlcihjcmVhdGVQbHVnaW4sIFwiY3JlYXRlUGx1Z2luXCIsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9zcmMvcGx1Z2lucy9zY2FmZm9sZGVyLnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUpBR0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/plugins/scaffolder.ts\n");

/***/ }),

/***/ "./src/plugins/techdocs.ts":
/*!*********************************!*\
  !*** ./src/plugins/techdocs.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return createPlugin; });\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @backstage/backend-common */ \"@backstage/backend-common\");\n/* harmony import */ var _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @backstage/plugin-techdocs-backend */ \"@backstage/plugin-techdocs-backend\");\n/* harmony import */ var _backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var dockerode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dockerode */ \"dockerode\");\n/* harmony import */ var dockerode__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dockerode__WEBPACK_IMPORTED_MODULE_2__);\n(function () { var enterModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").enterModule; enterModule && enterModule(module); })();\n\n\n\n\n\nasync function createPlugin({\n  logger,\n  config,\n  discovery,\n  reader,\n}) {\n  // Preparers are responsible for fetching source files for documentation.\n  const preparers = await _backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__[\"Preparers\"].fromConfig(config, {\n    logger,\n    reader,\n  });\n\n  // Docker client (conditionally) used by the generators, based on techdocs.generators config.\n  const dockerClient = new dockerode__WEBPACK_IMPORTED_MODULE_2___default.a();\n  const containerRunner = new _backstage_backend_common__WEBPACK_IMPORTED_MODULE_0__[\"DockerContainerRunner\"]({ dockerClient });\n\n  // Generators are used for generating documentation sites.\n  const generators = await _backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__[\"Generators\"].fromConfig(config, {\n    logger,\n    containerRunner,\n  });\n\n  // Publisher is used for\n  // 1. Publishing generated files to storage\n  // 2. Fetching files from storage and passing them to TechDocs frontend.\n  const publisher = await _backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__[\"Publisher\"].fromConfig(config, {\n    logger,\n    discovery,\n  });\n\n  // checks if the publisher is working and logs the result\n  await publisher.getReadiness();\n\n  return await Object(_backstage_plugin_techdocs_backend__WEBPACK_IMPORTED_MODULE_1__[\"createRouter\"])({\n    preparers,\n    generators,\n    publisher,\n    logger,\n    config,\n    discovery,\n  });\n}\n\n;(function () {\n  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").default;\n  var leaveModule = __webpack_require__(/*! react-hot-loader */ \"react-hot-loader\").leaveModule;\n  if (!reactHotLoader) {\n    return;\n  }\n  reactHotLoader.register(createPlugin, \"createPlugin\", \"/home/oscar/Escritorio/test1/test-repo/packages/backend/src/plugins/techdocs.ts\");\n  leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ \"../../node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy90ZWNoZG9jcy50cy5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL3RlY2hkb2NzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7IHZhciBlbnRlck1vZHVsZSA9IHJlcXVpcmUoJ3JlYWN0LWhvdC1sb2FkZXInKS5lbnRlck1vZHVsZTsgZW50ZXJNb2R1bGUgJiYgZW50ZXJNb2R1bGUobW9kdWxlKTsgfSkoKTtpbXBvcnQgeyBEb2NrZXJDb250YWluZXJSdW5uZXIgfSBmcm9tICdAYmFja3N0YWdlL2JhY2tlbmQtY29tbW9uJztcbmltcG9ydCB7XG4gIGNyZWF0ZVJvdXRlcixcbiAgR2VuZXJhdG9ycyxcbiAgUHJlcGFyZXJzLFxuICBQdWJsaXNoZXIsXG59IGZyb20gJ0BiYWNrc3RhZ2UvcGx1Z2luLXRlY2hkb2NzLWJhY2tlbmQnO1xuaW1wb3J0IERvY2tlciBmcm9tICdkb2NrZXJvZGUnO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUGx1Z2luKHtcbiAgbG9nZ2VyLFxuICBjb25maWcsXG4gIGRpc2NvdmVyeSxcbiAgcmVhZGVyLFxufSkge1xuICAvLyBQcmVwYXJlcnMgYXJlIHJlc3BvbnNpYmxlIGZvciBmZXRjaGluZyBzb3VyY2UgZmlsZXMgZm9yIGRvY3VtZW50YXRpb24uXG4gIGNvbnN0IHByZXBhcmVycyA9IGF3YWl0IFByZXBhcmVycy5mcm9tQ29uZmlnKGNvbmZpZywge1xuICAgIGxvZ2dlcixcbiAgICByZWFkZXIsXG4gIH0pO1xuXG4gIC8vIERvY2tlciBjbGllbnQgKGNvbmRpdGlvbmFsbHkpIHVzZWQgYnkgdGhlIGdlbmVyYXRvcnMsIGJhc2VkIG9uIHRlY2hkb2NzLmdlbmVyYXRvcnMgY29uZmlnLlxuICBjb25zdCBkb2NrZXJDbGllbnQgPSBuZXcgRG9ja2VyKCk7XG4gIGNvbnN0IGNvbnRhaW5lclJ1bm5lciA9IG5ldyBEb2NrZXJDb250YWluZXJSdW5uZXIoeyBkb2NrZXJDbGllbnQgfSk7XG5cbiAgLy8gR2VuZXJhdG9ycyBhcmUgdXNlZCBmb3IgZ2VuZXJhdGluZyBkb2N1bWVudGF0aW9uIHNpdGVzLlxuICBjb25zdCBnZW5lcmF0b3JzID0gYXdhaXQgR2VuZXJhdG9ycy5mcm9tQ29uZmlnKGNvbmZpZywge1xuICAgIGxvZ2dlcixcbiAgICBjb250YWluZXJSdW5uZXIsXG4gIH0pO1xuXG4gIC8vIFB1Ymxpc2hlciBpcyB1c2VkIGZvclxuICAvLyAxLiBQdWJsaXNoaW5nIGdlbmVyYXRlZCBmaWxlcyB0byBzdG9yYWdlXG4gIC8vIDIuIEZldGNoaW5nIGZpbGVzIGZyb20gc3RvcmFnZSBhbmQgcGFzc2luZyB0aGVtIHRvIFRlY2hEb2NzIGZyb250ZW5kLlxuICBjb25zdCBwdWJsaXNoZXIgPSBhd2FpdCBQdWJsaXNoZXIuZnJvbUNvbmZpZyhjb25maWcsIHtcbiAgICBsb2dnZXIsXG4gICAgZGlzY292ZXJ5LFxuICB9KTtcblxuICAvLyBjaGVja3MgaWYgdGhlIHB1Ymxpc2hlciBpcyB3b3JraW5nIGFuZCBsb2dzIHRoZSByZXN1bHRcbiAgYXdhaXQgcHVibGlzaGVyLmdldFJlYWRpbmVzcygpO1xuXG4gIHJldHVybiBhd2FpdCBjcmVhdGVSb3V0ZXIoe1xuICAgIHByZXBhcmVycyxcbiAgICBnZW5lcmF0b3JzLFxuICAgIHB1Ymxpc2hlcixcbiAgICBsb2dnZXIsXG4gICAgY29uZmlnLFxuICAgIGRpc2NvdmVyeSxcbiAgfSk7XG59XG5cbjsoZnVuY3Rpb24gKCkge1xuICB2YXIgcmVhY3RIb3RMb2FkZXIgPSByZXF1aXJlKCdyZWFjdC1ob3QtbG9hZGVyJykuZGVmYXVsdDtcbiAgdmFyIGxlYXZlTW9kdWxlID0gcmVxdWlyZSgncmVhY3QtaG90LWxvYWRlcicpLmxlYXZlTW9kdWxlO1xuICBpZiAoIXJlYWN0SG90TG9hZGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlYWN0SG90TG9hZGVyLnJlZ2lzdGVyKGNyZWF0ZVBsdWdpbiwgXCJjcmVhdGVQbHVnaW5cIiwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL3NyYy9wbHVnaW5zL3RlY2hkb2NzLnRzXCIpO1xuICBsZWF2ZU1vZHVsZShtb2R1bGUpO1xufSkoKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/plugins/techdocs.ts\n");

/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi webpack/hot/poll?100 ./src/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?100 */"../../node_modules/webpack/hot/poll.js?100");
module.exports = __webpack_require__(/*! /home/oscar/Escritorio/test1/test-repo/packages/backend/src/index.ts */"./src/index.ts");


/***/ }),

/***/ "@backstage/backend-common":
/*!******************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/backend-common/dist/index.cjs.js" ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/backend-common/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9iYWNrZW5kLWNvbW1vbi5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvYmFja2VuZC1jb21tb24vZGlzdC9pbmRleC5janMuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9iYWNrZW5kLWNvbW1vbi9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/backend-common\n");

/***/ }),

/***/ "@backstage/catalog-client":
/*!******************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/catalog-client/dist/index.cjs.js" ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/catalog-client/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9jYXRhbG9nLWNsaWVudC5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvY2F0YWxvZy1jbGllbnQvZGlzdC9pbmRleC5janMuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9jYXRhbG9nLWNsaWVudC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/catalog-client\n");

/***/ }),

/***/ "@backstage/plugin-app-backend":
/*!**********************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-app-backend/dist/index.cjs.js" ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-app-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tYXBwLWJhY2tlbmQuanMiLCJzb3VyY2VzIjpbImZpbGU6Ly8vL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vcGFja2FnZXMvYmFja2VuZC9leHRlcm5hbCBcIi9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL25vZGVfbW9kdWxlcy9AYmFja3N0YWdlL3BsdWdpbi1hcHAtYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL25vZGVfbW9kdWxlcy9AYmFja3N0YWdlL3BsdWdpbi1hcHAtYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-app-backend\n");

/***/ }),

/***/ "@backstage/plugin-auth-backend":
/*!***********************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-auth-backend/dist/index.cjs.js" ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-auth-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tYXV0aC1iYWNrZW5kLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvZXh0ZXJuYWwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9wbHVnaW4tYXV0aC1iYWNrZW5kL2Rpc3QvaW5kZXguY2pzLmpzXCIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvcGx1Z2luLWF1dGgtYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-auth-backend\n");

/***/ }),

/***/ "@backstage/plugin-catalog-backend":
/*!**************************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-catalog-backend/dist/index.cjs.js" ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-catalog-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tY2F0YWxvZy1iYWNrZW5kLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvZXh0ZXJuYWwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9wbHVnaW4tY2F0YWxvZy1iYWNrZW5kL2Rpc3QvaW5kZXguY2pzLmpzXCIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvcGx1Z2luLWNhdGFsb2ctYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-catalog-backend\n");

/***/ }),

/***/ "@backstage/plugin-proxy-backend":
/*!************************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-proxy-backend/dist/index.cjs.js" ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-proxy-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tcHJveHktYmFja2VuZC5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvcGx1Z2luLXByb3h5LWJhY2tlbmQvZGlzdC9pbmRleC5janMuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9wbHVnaW4tcHJveHktYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-proxy-backend\n");

/***/ }),

/***/ "@backstage/plugin-scaffolder-backend":
/*!*****************************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-scaffolder-backend/dist/index.cjs.js" ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-scaffolder-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tc2NhZmZvbGRlci1iYWNrZW5kLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvZXh0ZXJuYWwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9wbHVnaW4tc2NhZmZvbGRlci1iYWNrZW5kL2Rpc3QvaW5kZXguY2pzLmpzXCIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvcGx1Z2luLXNjYWZmb2xkZXItYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-scaffolder-backend\n");

/***/ }),

/***/ "@backstage/plugin-techdocs-backend":
/*!***************************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-techdocs-backend/dist/index.cjs.js" ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/@backstage/plugin-techdocs-backend/dist/index.cjs.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGJhY2tzdGFnZS9wbHVnaW4tdGVjaGRvY3MtYmFja2VuZC5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL0BiYWNrc3RhZ2UvcGx1Z2luLXRlY2hkb2NzLWJhY2tlbmQvZGlzdC9pbmRleC5janMuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvQGJhY2tzdGFnZS9wbHVnaW4tdGVjaGRvY3MtYmFja2VuZC9kaXN0L2luZGV4LmNqcy5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@backstage/plugin-techdocs-backend\n");

/***/ }),

/***/ "dockerode":
/*!**********************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/dockerode/lib/docker.js" ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/dockerode/lib/docker.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyb2RlLmpzIiwic291cmNlcyI6WyJmaWxlOi8vLy9ob21lL29zY2FyL0VzY3JpdG9yaW8vdGVzdDEvdGVzdC1yZXBvL3BhY2thZ2VzL2JhY2tlbmQvZXh0ZXJuYWwgXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvZG9ja2Vyb2RlL2xpYi9kb2NrZXIuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvZG9ja2Vyb2RlL2xpYi9kb2NrZXIuanNcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///dockerode\n");

/***/ }),

/***/ "express-promise-router":
/*!***************************************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/express-promise-router/lib/express-promise-router.js" ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/express-promise-router/lib/express-promise-router.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy1wcm9taXNlLXJvdXRlci5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL2V4cHJlc3MtcHJvbWlzZS1yb3V0ZXIvbGliL2V4cHJlc3MtcHJvbWlzZS1yb3V0ZXIuanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvZXhwcmVzcy1wcm9taXNlLXJvdXRlci9saWIvZXhwcmVzcy1wcm9taXNlLXJvdXRlci5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///express-promise-router\n");

/***/ }),

/***/ "react-hot-loader":
/*!************************************************************************************************!*\
  !*** external "/home/oscar/Escritorio/test1/test-repo/node_modules/react-hot-loader/index.js" ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"/home/oscar/Escritorio/test1/test-repo/node_modules/react-hot-loader/index.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtaG90LWxvYWRlci5qcyIsInNvdXJjZXMiOlsiZmlsZTovLy8vaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9wYWNrYWdlcy9iYWNrZW5kL2V4dGVybmFsIFwiL2hvbWUvb3NjYXIvRXNjcml0b3Jpby90ZXN0MS90ZXN0LXJlcG8vbm9kZV9tb2R1bGVzL3JlYWN0LWhvdC1sb2FkZXIvaW5kZXguanNcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIvaG9tZS9vc2Nhci9Fc2NyaXRvcmlvL3Rlc3QxL3Rlc3QtcmVwby9ub2RlX21vZHVsZXMvcmVhY3QtaG90LWxvYWRlci9pbmRleC5qc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///react-hot-loader\n");

/***/ })

/******/ });