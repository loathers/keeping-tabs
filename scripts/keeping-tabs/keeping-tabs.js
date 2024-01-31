/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 8257:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isCallable = __webpack_require__(9212);
var tryToString = __webpack_require__(5637);
var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};

/***/ }),

/***/ 2569:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isObject = __webpack_require__(794);
var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};

/***/ }),

/***/ 5766:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toIndexedObject = __webpack_require__(2977);
var toAbsoluteIndex = __webpack_require__(6782);
var lengthOfArrayLike = __webpack_require__(1825);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function createMethod(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};
module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

/***/ }),

/***/ 9624:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);
module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

/***/ }),

/***/ 3058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var TO_STRING_TAG_SUPPORT = __webpack_require__(8191);
var isCallable = __webpack_require__(9212);
var classofRaw = __webpack_require__(9624);
var wellKnownSymbol = __webpack_require__(3649);
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (error) {/* empty */}
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
  // builtinTag case
  : CORRECT_ARGUMENTS ? classofRaw(O)
  // ES3 arguments fallback
  : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

/***/ }),

/***/ 3478:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hasOwn = __webpack_require__(2870);
var ownKeys = __webpack_require__(929);
var getOwnPropertyDescriptorModule = __webpack_require__(6683);
var definePropertyModule = __webpack_require__(4615);
module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

/***/ }),

/***/ 926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var fails = __webpack_require__(6544);
module.exports = !fails(function () {
  function F() {/* empty */}
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

/***/ }),

/***/ 57:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var definePropertyModule = __webpack_require__(4615);
var createPropertyDescriptor = __webpack_require__(4677);
module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),

/***/ 4677:
/***/ ((module) => {



module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),

/***/ 5999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toPropertyKey = __webpack_require__(8734);
var definePropertyModule = __webpack_require__(4615);
var createPropertyDescriptor = __webpack_require__(4677);
module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
};

/***/ }),

/***/ 3746:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isCallable = __webpack_require__(9212);
var definePropertyModule = __webpack_require__(4615);
var makeBuiltIn = __webpack_require__(9594);
var defineGlobalProperty = __webpack_require__(2296);
module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
    } catch (error) {/* empty */}
    if (simple) O[key] = value;else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  }
  return O;
};

/***/ }),

/***/ 2296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
module.exports = function (key, value) {
  try {
    defineProperty(global, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    global[key] = value;
  }
  return value;
};

/***/ }),

/***/ 8494:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var fails = __webpack_require__(6544);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function get() {
      return 7;
    }
  })[1] != 7;
});

/***/ }),

/***/ 2952:
/***/ ((module) => {



var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;
module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};

/***/ }),

/***/ 6668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var isObject = __webpack_require__(794);
var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

/***/ }),

/***/ 6918:
/***/ ((module) => {



module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

/***/ }),

/***/ 4061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var userAgent = __webpack_require__(6918);
var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}
module.exports = version;

/***/ }),

/***/ 5690:
/***/ ((module) => {



// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

/***/ }),

/***/ 7263:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var getOwnPropertyDescriptor = (__webpack_require__(6683).f);
var createNonEnumerableProperty = __webpack_require__(57);
var defineBuiltIn = __webpack_require__(3746);
var defineGlobalProperty = __webpack_require__(2296);
var copyConstructorProperties = __webpack_require__(3478);
var isForced = __webpack_require__(4451);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

/***/ }),

/***/ 6544:
/***/ ((module) => {



module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/***/ }),

/***/ 2938:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(6887);
var aCallable = __webpack_require__(8257);
var NATIVE_BIND = __webpack_require__(8987);
var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

/***/ }),

/***/ 8987:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var fails = __webpack_require__(6544);
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () {/* empty */}.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

/***/ }),

/***/ 8262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var NATIVE_BIND = __webpack_require__(8987);
var call = Function.prototype.call;
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

/***/ }),

/***/ 4340:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var hasOwn = __webpack_require__(2870);
var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

/***/ }),

/***/ 6887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var classofRaw = __webpack_require__(9624);
var uncurryThis = __webpack_require__(7386);
module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};

/***/ }),

/***/ 7386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var NATIVE_BIND = __webpack_require__(8987);
var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};

/***/ }),

/***/ 5897:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var isCallable = __webpack_require__(9212);
var aFunction = function aFunction(argument) {
  return isCallable(argument) ? argument : undefined;
};
module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

/***/ }),

/***/ 8272:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var classof = __webpack_require__(3058);
var getMethod = __webpack_require__(911);
var isNullOrUndefined = __webpack_require__(8505);
var Iterators = __webpack_require__(339);
var wellKnownSymbol = __webpack_require__(3649);
var ITERATOR = wellKnownSymbol('iterator');
module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR) || getMethod(it, '@@iterator') || Iterators[classof(it)];
};

/***/ }),

/***/ 6307:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var call = __webpack_require__(8262);
var aCallable = __webpack_require__(8257);
var anObject = __webpack_require__(2569);
var tryToString = __webpack_require__(5637);
var getIteratorMethod = __webpack_require__(8272);
var $TypeError = TypeError;
module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};

/***/ }),

/***/ 911:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var aCallable = __webpack_require__(8257);
var isNullOrUndefined = __webpack_require__(8505);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

/***/ }),

/***/ 7583:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



var check = function check(it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
// eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
// eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == 'object' && self) || check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
// eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || this || Function('return this')();

/***/ }),

/***/ 2870:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var toObject = __webpack_require__(1324);
var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

/***/ }),

/***/ 4639:
/***/ ((module) => {



module.exports = {};

/***/ }),

/***/ 275:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var fails = __webpack_require__(6544);
var createElement = __webpack_require__(6668);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

/***/ }),

/***/ 5044:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var fails = __webpack_require__(6544);
var classof = __webpack_require__(9624);
var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;

/***/ }),

/***/ 9734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var isCallable = __webpack_require__(9212);
var store = __webpack_require__(1314);
var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}
module.exports = store.inspectSource;

/***/ }),

/***/ 2743:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var NATIVE_WEAK_MAP = __webpack_require__(5307);
var global = __webpack_require__(7583);
var isObject = __webpack_require__(794);
var createNonEnumerableProperty = __webpack_require__(57);
var hasOwn = __webpack_require__(2870);
var shared = __webpack_require__(1314);
var sharedKey = __webpack_require__(9137);
var hiddenKeys = __webpack_require__(4639);
var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;
var enforce = function enforce(it) {
  return has(it) ? get(it) : set(it, {});
};
var getterFor = function getterFor(TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function set(it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function get(it) {
    return store.get(it) || {};
  };
  has = function has(it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function set(it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function get(it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function has(it) {
    return hasOwn(it, STATE);
  };
}
module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

/***/ }),

/***/ 114:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var wellKnownSymbol = __webpack_require__(3649);
var Iterators = __webpack_require__(339);
var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

/***/ }),

/***/ 9212:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var $documentAll = __webpack_require__(2952);
var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

/***/ }),

/***/ 4451:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var fails = __webpack_require__(6544);
var isCallable = __webpack_require__(9212);
var replacement = /#|\.prototype\./;
var isForced = function isForced(feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

/***/ }),

/***/ 8505:
/***/ ((module) => {



// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};

/***/ }),

/***/ 794:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isCallable = __webpack_require__(9212);
var $documentAll = __webpack_require__(2952);
var documentAll = $documentAll.all;
module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

/***/ }),

/***/ 6268:
/***/ ((module) => {



module.exports = false;

/***/ }),

/***/ 5871:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var getBuiltIn = __webpack_require__(5897);
var isCallable = __webpack_require__(9212);
var isPrototypeOf = __webpack_require__(2447);
var USE_SYMBOL_AS_UID = __webpack_require__(7786);
var $Object = Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

/***/ }),

/***/ 4026:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var bind = __webpack_require__(2938);
var call = __webpack_require__(8262);
var anObject = __webpack_require__(2569);
var tryToString = __webpack_require__(5637);
var isArrayIteratorMethod = __webpack_require__(114);
var lengthOfArrayLike = __webpack_require__(1825);
var isPrototypeOf = __webpack_require__(2447);
var getIterator = __webpack_require__(6307);
var getIteratorMethod = __webpack_require__(8272);
var iteratorClose = __webpack_require__(7093);
var $TypeError = TypeError;
var Result = function Result(stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var ResultPrototype = Result.prototype;
module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;
  var stop = function stop(condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };
  var callFn = function callFn(value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    }
    return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      }
      return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }
  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  }
  return new Result(false);
};

/***/ }),

/***/ 7093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var call = __webpack_require__(8262);
var anObject = __webpack_require__(2569);
var getMethod = __webpack_require__(911);
module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

/***/ }),

/***/ 339:
/***/ ((module) => {



module.exports = {};

/***/ }),

/***/ 1825:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toLength = __webpack_require__(97);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

/***/ }),

/***/ 9594:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var fails = __webpack_require__(6544);
var isCallable = __webpack_require__(9212);
var hasOwn = __webpack_require__(2870);
var DESCRIPTORS = __webpack_require__(8494);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(4340).CONFIGURABLE);
var inspectSource = __webpack_require__(9734);
var InternalStateModule = __webpack_require__(2743);
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);
var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () {/* empty */}, 'length', {
    value: 8
  }).length !== 8;
});
var TEMPLATE = String(String).split('String');
var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
    if (DESCRIPTORS) defineProperty(value, 'name', {
      value: name,
      configurable: true
    });else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', {
      value: options.arity
    });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', {
        writable: false
      });
      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) {/* empty */}
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  }
  return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

/***/ }),

/***/ 9021:
/***/ ((module) => {



var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

/***/ }),

/***/ 4615:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var IE8_DOM_DEFINE = __webpack_require__(275);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(7670);
var anObject = __webpack_require__(2569);
var toPropertyKey = __webpack_require__(8734);
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ 6683:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var call = __webpack_require__(8262);
var propertyIsEnumerableModule = __webpack_require__(112);
var createPropertyDescriptor = __webpack_require__(4677);
var toIndexedObject = __webpack_require__(2977);
var toPropertyKey = __webpack_require__(8734);
var hasOwn = __webpack_require__(2870);
var IE8_DOM_DEFINE = __webpack_require__(275);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) {/* empty */}
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

/***/ }),

/***/ 9275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var internalObjectKeys = __webpack_require__(8356);
var enumBugKeys = __webpack_require__(5690);
var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

/***/ }),

/***/ 4012:
/***/ ((__unused_webpack_module, exports) => {



// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

/***/ }),

/***/ 729:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hasOwn = __webpack_require__(2870);
var isCallable = __webpack_require__(9212);
var toObject = __webpack_require__(1324);
var sharedKey = __webpack_require__(9137);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(926);
var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }
  return object instanceof $Object ? ObjectPrototype : null;
};

/***/ }),

/***/ 2447:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
module.exports = uncurryThis({}.isPrototypeOf);

/***/ }),

/***/ 8356:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var hasOwn = __webpack_require__(2870);
var toIndexedObject = __webpack_require__(2977);
var indexOf = (__webpack_require__(5766).indexOf);
var hiddenKeys = __webpack_require__(4639);
var push = uncurryThis([].push);
module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

/***/ }),

/***/ 5432:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var internalObjectKeys = __webpack_require__(8356);
var enumBugKeys = __webpack_require__(5690);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

/***/ }),

/***/ 112:
/***/ ((__unused_webpack_module, exports) => {



var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
  1: 2
}, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

/***/ }),

/***/ 9953:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var fails = __webpack_require__(6544);
var uncurryThis = __webpack_require__(7386);
var objectGetPrototypeOf = __webpack_require__(729);
var objectKeys = __webpack_require__(5432);
var toIndexedObject = __webpack_require__(2977);
var $propertyIsEnumerable = (__webpack_require__(112).f);
var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// in some IE versions, `propertyIsEnumerable` returns incorrect result on integer keys
// of `null` prototype objects
var IE_BUG = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-create -- safe
  var O = Object.create(null);
  O[2] = 2;
  return !propertyIsEnumerable(O, 2);
});

// `Object.{ entries, values }` methods implementation
var createMethod = function createMethod(TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var IE_WORKAROUND = IE_BUG && objectGetPrototypeOf(O) === null;
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || (IE_WORKAROUND ? key in O : propertyIsEnumerable(O, key))) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};
module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

/***/ }),

/***/ 6252:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var call = __webpack_require__(8262);
var isCallable = __webpack_require__(9212);
var isObject = __webpack_require__(794);
var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ 929:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var getBuiltIn = __webpack_require__(5897);
var uncurryThis = __webpack_require__(7386);
var getOwnPropertyNamesModule = __webpack_require__(9275);
var getOwnPropertySymbolsModule = __webpack_require__(4012);
var anObject = __webpack_require__(2569);
var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

/***/ }),

/***/ 3955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isNullOrUndefined = __webpack_require__(8505);
var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};

/***/ }),

/***/ 9137:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var shared = __webpack_require__(7836);
var uid = __webpack_require__(8284);
var keys = shared('keys');
module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/***/ }),

/***/ 1314:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var defineGlobalProperty = __webpack_require__(2296);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});
module.exports = store;

/***/ }),

/***/ 7836:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var IS_PURE = __webpack_require__(6268);
var store = __webpack_require__(1314);
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.32.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.32.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

/***/ }),

/***/ 4193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(4061);
var fails = __webpack_require__(6544);
var global = __webpack_require__(7583);
var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/***/ }),

/***/ 6782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toIntegerOrInfinity = __webpack_require__(7486);
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

/***/ }),

/***/ 2977:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(5044);
var requireObjectCoercible = __webpack_require__(3955);
module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

/***/ }),

/***/ 7486:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var trunc = __webpack_require__(9021);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

/***/ }),

/***/ 97:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toIntegerOrInfinity = __webpack_require__(7486);
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

/***/ }),

/***/ 1324:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var requireObjectCoercible = __webpack_require__(3955);
var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

/***/ }),

/***/ 2670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var call = __webpack_require__(8262);
var isObject = __webpack_require__(794);
var isSymbol = __webpack_require__(5871);
var getMethod = __webpack_require__(911);
var ordinaryToPrimitive = __webpack_require__(6252);
var wellKnownSymbol = __webpack_require__(3649);
var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

/***/ }),

/***/ 8734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var toPrimitive = __webpack_require__(2670);
var isSymbol = __webpack_require__(5871);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

/***/ }),

/***/ 8191:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var wellKnownSymbol = __webpack_require__(3649);
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
module.exports = String(test) === '[object z]';

/***/ }),

/***/ 5637:
/***/ ((module) => {



var $String = String;
module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};

/***/ }),

/***/ 8284:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var uncurryThis = __webpack_require__(7386);
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

/***/ }),

/***/ 7786:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(4193);
module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';

/***/ }),

/***/ 7670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var DESCRIPTORS = __webpack_require__(8494);
var fails = __webpack_require__(6544);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () {/* empty */}, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

/***/ }),

/***/ 5307:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var isCallable = __webpack_require__(9212);
var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

/***/ }),

/***/ 3649:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var global = __webpack_require__(7583);
var shared = __webpack_require__(7836);
var hasOwn = __webpack_require__(2870);
var uid = __webpack_require__(8284);
var NATIVE_SYMBOL = __webpack_require__(4193);
var USE_SYMBOL_AS_UID = __webpack_require__(7786);
var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;
module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name) ? Symbol[name] : createWellKnownSymbol('Symbol.' + name);
  }
  return WellKnownSymbolsStore[name];
};

/***/ }),

/***/ 6737:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {



var $ = __webpack_require__(7263);
var $entries = (__webpack_require__(9953).entries);

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({
  target: 'Object',
  stat: true
}, {
  entries: function entries(O) {
    return $entries(O);
  }
});

/***/ }),

/***/ 5809:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {



var $ = __webpack_require__(7263);
var iterate = __webpack_require__(4026);
var createProperty = __webpack_require__(5999);

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$({
  target: 'Object',
  stat: true
}, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, {
      AS_ENTRIES: true
    });
    return obj;
  }
});

/***/ }),

/***/ 9628:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {



var $ = __webpack_require__(7263);
var $values = (__webpack_require__(9953).values);

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$({
  target: 'Object',
  stat: true
}, {
  values: function values(O) {
    return $values(O);
  }
});

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  main: () => (/* binding */ main)
});

;// CONCATENATED MODULE: external "kolmafia"
const external_kolmafia_namespaceObject = require("kolmafia");
;// CONCATENATED MODULE: ./src/types.ts
var ALL_TAB_TITLES = ["mall", "display", "use", "autosell", "kmail", "sell", "closet", "fuel", "smash", "collection", "low", "coinmaster"];
function isTabTitle(value) {
  return ALL_TAB_TITLES.includes(value);
}
var ALL_ACTION_OPTIONS = (/* unused pure expression or super */ null && (["keep", "stock", "limit", "price", "target"]));
function isActionOption(value) {
  return ALL_ACTION_OPTIONS.includes(value);
}
;// CONCATENATED MODULE: ./src/options.ts
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Options = /*#__PURE__*/function () {
  function Options() {
    _classCallCheck(this, Options);
    _defineProperty(this, "keep", void 0);
    _defineProperty(this, "stock", void 0);
    _defineProperty(this, "limit", void 0);
    _defineProperty(this, "price", void 0);
    _defineProperty(this, "target", void 0);
    _defineProperty(this, "body", void 0);
    _defineProperty(this, "priceUpperThreshold", void 0);
    _defineProperty(this, "priceLowerThreshold", void 0);
    _defineProperty(this, "default", void 0);
    _defineProperty(this, "best", void 0);
    _defineProperty(this, "collections", new Map());
    _defineProperty(this, "coinmasters", new Map());
  }
  _createClass(Options, [{
    key: "toString",
    value: function toString() {
      var optionsStr = [];
      if (this.keep) {
        optionsStr.push("keep: ".concat(this.keep));
      }
      if (this.stock) {
        optionsStr.push("stock: ".concat(this.stock));
      }
      if (this.limit) {
        optionsStr.push("limit: ".concat(this.limit));
      }
      if (this.price) {
        optionsStr.push("price: ".concat(this.price));
      }
      if (this.target) {
        optionsStr.push("target: ".concat(this.target));
      }
      if (this.body) {
        optionsStr.push("body: ".concat(this.body));
      }
      if (this.priceUpperThreshold) {
        optionsStr.push("price upper threshold: ".concat(this.priceUpperThreshold));
      }
      if (this.priceLowerThreshold) {
        optionsStr.push("price lower threshold: ".concat(this.priceLowerThreshold));
      }
      return optionsStr.join(";");
    }
  }, {
    key: "empty",
    value: function empty() {
      return this.toString() === "";
    }
  }], [{
    key: "parse",
    value: function parse(optionsStr, params) {
      var options = new Options();
      if (params) {
        options.collections = params.collections;
        options.coinmasters = params.coinmasters;
      }
      var _iterator = _createForOfIteratorHelper(optionsStr),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var optionStr = _step.value;
          var keep = optionStr.match(/keep(\d+)/);
          if (keep && keep[1]) {
            options.keep = parseInt(keep[1]);
            continue;
          }
          var stock = optionStr.match(/stock(\d+)/);
          if (stock && stock[1]) {
            options.stock = parseInt(stock[1]);
            continue;
          }
          var limit = optionStr.match(/limit(\d+)/);
          if (limit && limit[1]) {
            options.limit = parseInt(limit[1]);
            continue;
          }
          var price = optionStr.match(/price(\d+)/);
          if (price && price[1]) {
            options.price = parseInt(price[1]);
            continue;
          }
          var target = optionStr.match(/#(.*)/);
          if (target && target[1]) {
            options.target = target[1];
            continue;
          }
          var upperThreshold = optionStr.match(/<(\d+)/);
          if (upperThreshold && upperThreshold[1]) {
            options.priceUpperThreshold = parseInt(upperThreshold[1]);
            continue;
          }
          var lowerThreshold = optionStr.match(/>(\d+)/);
          if (lowerThreshold && lowerThreshold[1]) {
            options.priceUpperThreshold = parseInt(lowerThreshold[1]);
            continue;
          }
          var body = optionStr.match(/body=(.*)/);
          if (body && body[1]) {
            options.body = body[1];
            continue;
          }
          var best = optionStr.match(/best/);
          if (best) {
            options.best = true;
            continue;
          }
          if (optionStr.length > 0) {
            throw "Unsupported Option: ".concat(optionStr);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return options;
    }
  }]);
  return Options;
}();
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.entries.js
var es_object_entries = __webpack_require__(6737);
;// CONCATENATED MODULE: ./node_modules/libram/dist/utils.js
function utils_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = utils_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || utils_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || utils_unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function utils_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return utils_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return utils_arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return utils_arrayLikeToArray(arr); }
function utils_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function notNull(value) {
  return value !== null;
}
function parseNumber(n) {
  return Number.parseInt(n.replace(/,/g, ""));
}
/**
 * Clamp a number between lower and upper bounds.
 *
 * @param n Number to clamp.
 * @param min Lower bound.
 * @param max Upper bound.
 */
function utils_clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
/**
 * Split an {@param array} into {@param chunkSize} sized chunks
 *
 * @param array Array to split
 * @param chunkSize Size of chunk
 */
function chunk(array, chunkSize) {
  var result = [];
  for (var i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
function arrayToCountedMap(array) {
  if (!Array.isArray(array)) return array;
  var map = new Map();
  array.forEach(item => {
    map.set(item, (map.get(item) || 0) + 1);
  });
  return map;
}
function countedMapToArray(map) {
  var _ref;
  return (_ref = []).concat.apply(_ref, _toConsumableArray(_toConsumableArray(map).map(_ref2 => {
    var _ref3 = _slicedToArray(_ref2, 2),
      item = _ref3[0],
      quantity = _ref3[1];
    return Array(quantity).fill(item);
  })));
}
function countedMapToString(map) {
  return _toConsumableArray(map).map(_ref4 => {
    var _ref5 = _slicedToArray(_ref4, 2),
      item = _ref5[0],
      quantity = _ref5[1];
    return "".concat(quantity, " x ").concat(item);
  }).join(", ");
}
/**
 * Sum an array of numbers.
 * @param addends Addends to sum.
 * @param mappingFunction function to turn elements into numbers
 */
function sum(addends, mappingFunction) {
  return addends.reduce((subtotal, element) => subtotal + mappingFunction(element), 0);
}
function sumNumbers(addends) {
  return sum(addends, x => x);
}
/**
 * Checks if a given item is in a readonly array, acting as a typeguard.
 * @param item Needle
 * @param array Readonly array haystack
 * @returns Whether the item is in the array, and narrows the type of the item.
 */
function arrayContains(item, array) {
  return array.includes(item);
}
/**
 * Checks if two arrays contain the same elements in the same quantity.
 * @param a First array for comparison
 * @param b Second array for comparison
 * @returns Whether the two arrays are equal, irrespective of order.
 */
function setEqual(a, b) {
  var sortedA = _toConsumableArray(a).sort();
  var sortedB = _toConsumableArray(b).sort();
  return a.length === b.length && sortedA.every((item, index) => item === sortedB[index]);
}
/**
 * Reverses keys and values for a given map
 * @param map Map to invert
 */
function invertMap(map) {
  var returnValue = new Map();
  var _iterator = utils_createForOfIteratorHelper(map),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        key = _step$value[0],
        value = _step$value[1];
      returnValue.set(value, key);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return returnValue;
}
/**
 * Creates a Type Guard function for a string union type defined via an array as const.
 */
function createStringUnionTypeGuardFunction(array) {
  return function (x) {
    return array.includes(x);
  };
}
/**
 * Splits a string by commas while also respecting escaping commas with a backslash
 * @param str String to split
 * @returns List of tokens
 */
function splitByCommasWithEscapes(str) {
  var returnValue = [];
  var ignoreNext = false;
  var currentString = "";
  var _iterator2 = utils_createForOfIteratorHelper(str.split("")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var char = _step2.value;
      if (char === "\\") {
        ignoreNext = true;
      } else {
        if (char == "," && !ignoreNext) {
          returnValue.push(currentString.trim());
          currentString = "";
        } else {
          currentString += char;
        }
        ignoreNext = false;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  returnValue.push(currentString.trim());
  return returnValue;
}
;// CONCATENATED MODULE: ./node_modules/libram/dist/Kmail.js
function Kmail_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = Kmail_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function Kmail_toConsumableArray(arr) { return Kmail_arrayWithoutHoles(arr) || Kmail_iterableToArray(arr) || Kmail_unsupportedIterableToArray(arr) || Kmail_nonIterableSpread(); }
function Kmail_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function Kmail_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function Kmail_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return Kmail_arrayLikeToArray(arr); }
function Kmail_slicedToArray(arr, i) { return Kmail_arrayWithHoles(arr) || Kmail_iterableToArrayLimit(arr, i) || Kmail_unsupportedIterableToArray(arr, i) || Kmail_nonIterableRest(); }
function Kmail_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function Kmail_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Kmail_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Kmail_arrayLikeToArray(o, minLen); }
function Kmail_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function Kmail_iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function Kmail_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function Kmail_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Kmail_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, Kmail_toPropertyKey(descriptor.key), descriptor); } }
function Kmail_createClass(Constructor, protoProps, staticProps) { if (protoProps) Kmail_defineProperties(Constructor.prototype, protoProps); if (staticProps) Kmail_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function Kmail_defineProperty(obj, key, value) { key = Kmail_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function Kmail_toPropertyKey(arg) { var key = Kmail_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function Kmail_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var Kmail = /*#__PURE__*/function () {
  function Kmail(rawKmail) {
    Kmail_classCallCheck(this, Kmail);
    Kmail_defineProperty(this, "id", void 0);
    Kmail_defineProperty(this, "date", void 0);
    Kmail_defineProperty(this, "type", void 0);
    Kmail_defineProperty(this, "senderId", void 0);
    Kmail_defineProperty(this, "senderName", void 0);
    Kmail_defineProperty(this, "rawMessage", void 0);
    var date = new Date(rawKmail.localtime);
    // Date come from KoL formatted with YY and so will be parsed 19YY, which is wrong.
    // We can safely add 100 because if 19YY was a leap year, 20YY will be too!
    date.setFullYear(date.getFullYear() + 100);
    this.id = Number(rawKmail.id);
    this.date = date;
    this.type = rawKmail.type;
    this.senderId = Number(rawKmail.fromid);
    this.senderName = rawKmail.fromname;
    this.rawMessage = rawKmail.message;
  }
  /**
   * Delete the kmail
   *
   * @returns Whether the kmail was deleted
   */
  Kmail_createClass(Kmail, [{
    key: "delete",
    value: function _delete() {
      return Kmail.delete([this]) === 1;
    }
    /**
     * Message contents without any HTML from items or meat
     */
  }, {
    key: "message",
    get: function get() {
      var match = this.rawMessage.match(/^([\s\S]*?)</);
      return match ? match[1] : this.rawMessage;
    }
    /**
     * Get items attached to the kmail
     *
     * @returns Map of items attached to the kmail and their quantities
     */
  }, {
    key: "items",
    value: function items() {
      return new Map(Object.entries((0,external_kolmafia_namespaceObject.extractItems)(this.rawMessage)).map(_ref => {
        var _ref2 = Kmail_slicedToArray(_ref, 2),
          itemName = _ref2[0],
          quantity = _ref2[1];
        return [external_kolmafia_namespaceObject.Item.get(itemName), quantity];
      }));
    }
    /**
     * Get meat attached to the kmail
     *
     * @returns Meat attached to the kmail
     */
  }, {
    key: "meat",
    value: function meat() {
      return (0,external_kolmafia_namespaceObject.extractMeat)(this.rawMessage);
    }
    /**
     * Reply to kmail
     *
     * @see Kmail.send
     *
     * @returns True if the kmail was successfully sent
     */
  }, {
    key: "reply",
    value: function reply() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var meat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return Kmail.send(this.senderId, message, items, meat);
    }
  }], [{
    key: "parse",
    value:
    /**
     * Parses a kmail from KoL's native format
     *
     * @param rawKmail Kmail in the format supplies by api.php
     * @returns Parsed kmail
     */
    function parse(rawKmail) {
      return new Kmail(rawKmail);
    }
    /**
     * Returns all of the player's kmails
     *
     * @param count Number of kmails to fetch
     * @returns Parsed kmails
     */
  }, {
    key: "inbox",
    value: function inbox() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      return JSON.parse((0,external_kolmafia_namespaceObject.visitUrl)("api.php?what=kmail&for=libram&count=".concat(count))).map(Kmail.parse);
    }
    /**
     * Bulk delete kmails
     *
     * @param kmails Kmails to delete
     * @returns Number of kmails deleted
     */
  }, {
    key: "delete",
    value: function _delete(kmails) {
      var _results$match$, _results$match;
      var results = (0,external_kolmafia_namespaceObject.visitUrl)("messages.php?the_action=delete&box=Inbox&pwd&".concat(kmails.map(k => "sel".concat(k.id, "=on")).join("&")));
      return Number((_results$match$ = (_results$match = results.match(/<td>(\d) messages? deleted.<\/td>/)) === null || _results$match === void 0 ? void 0 : _results$match[1]) !== null && _results$match$ !== void 0 ? _results$match$ : 0);
    }
  }, {
    key: "_genericSend",
    value: function _genericSend(to, message, items, meat, chunkSize, constructUrl, successString) {
      var m = meat;
      var sendableItems = Kmail_toConsumableArray(arrayToCountedMap(items).entries()).filter(_ref3 => {
        var _ref4 = Kmail_slicedToArray(_ref3, 1),
          item = _ref4[0];
        return (0,external_kolmafia_namespaceObject.isGiftable)(item);
      });
      var result = true;
      var chunks = chunk(sendableItems, chunkSize);
      // Split the items to be sent into chunks of max 11 item types
      var _iterator = Kmail_createForOfIteratorHelper(chunks.length > 0 ? chunks : [null]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          var itemsQuery = c === null ? [] : c.map((_ref5, index) => {
            var _ref6 = Kmail_slicedToArray(_ref5, 2),
              item = _ref6[0],
              quantity = _ref6[1];
            return "whichitem".concat(index + 1, "=").concat((0,external_kolmafia_namespaceObject.toInt)(item), "&howmany").concat(index + 1, "=").concat(quantity);
          });
          var r = (0,external_kolmafia_namespaceObject.visitUrl)(constructUrl(m, itemsQuery.join("&"), itemsQuery.length));
          if (r.includes("That player cannot receive Meat or items")) {
            return Kmail.gift(to, message, items, meat);
          }
          // Make sure we don't send the same batch of meat with every chunk
          m = 0;
          result && (result = r.includes(successString));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }
    /**
     * Sends a kmail to a player
     *
     * Sends multiple kmails if more than 11 unique item types are attached.
     * Ignores any ungiftable items.
     * Sends a gift package to players in run
     *
     * @param to The player name or id to receive the kmail
     * @param message The text contents of the message
     * @param items The items to be attached
     * @param meat The quantity of meat to be attached
     * @returns True if the kmail was successfully sent
     */
  }, {
    key: "send",
    value: function send(to) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var items = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var meat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      return Kmail._genericSend(to, message, items, meat, 11, (meat, itemsQuery) => "sendmessage.php?action=send&pwd&towho=".concat(to, "&message=").concat(message).concat(itemsQuery ? "&".concat(itemsQuery) : "", "&sendmeat=").concat(meat), ">Message sent.</");
    }
    /**
     * Sends a gift to a player
     *
     * Sends multiple kmails if more than 3 unique item types are attached.
     * Ignores any ungiftable items.
     *
     * @param to The player name or id to receive the gift
     * @param note The note on the outside of the gift
     * @param items The items to be attached
     * @param meat The quantity of meat to be attached
     * @param insideNode The note on the inside of the gift
     * @returns True if the gift was successfully sent
     */
  }, {
    key: "gift",
    value: function gift(to) {
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var items = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var meat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var insideNote = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
      var baseUrl = "town_sendgift.php?action=Yep.&pwd&fromwhere=0&note=".concat(message, "&insidenote=").concat(insideNote, "&towho=").concat(to);
      return Kmail._genericSend(to, message, items, meat, 3, (m, itemsQuery, chunkSize) => "".concat(baseUrl, "&whichpackage=").concat(chunkSize).concat(itemsQuery ? "&".concat(itemsQuery) : "", "&sendmeat=").concat(m), ">Package sent.</");
    }
  }]);
  return Kmail;
}();

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.values.js
var es_object_values = __webpack_require__(9628);
;// CONCATENATED MODULE: ./node_modules/libram/dist/template-string.js


var concatTemplateString = function concatTemplateString(literals) {
  for (var _len = arguments.length, placeholders = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    placeholders[_key - 1] = arguments[_key];
  }
  return literals.raw.reduce((acc, literal, i) => {
    var _placeholders$i;
    return acc + literal + ((_placeholders$i = placeholders[i]) !== null && _placeholders$i !== void 0 ? _placeholders$i : "");
  }, "");
};
var createSingleConstant = Type => {
  var tagFunction = function tagFunction(literals) {
    for (var _len2 = arguments.length, placeholders = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      placeholders[_key2 - 1] = arguments[_key2];
    }
    var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
    return Type.get(input);
  };
  tagFunction.none = Type.none;
  return tagFunction;
};
var createPluralConstant = Type => function (literals) {
  for (var _len3 = arguments.length, placeholders = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    placeholders[_key3 - 1] = arguments[_key3];
  }
  var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
  if (input === "") {
    return Type.all();
  }
  return Type.get(splitByCommasWithEscapes(input));
};
/**
 * A Bounty specified by name.
 *
 * @category In-game constant
 */
var $bounty = createSingleConstant(external_kolmafia_namespaceObject.Bounty);
/**
 * A list of Bounties specified by a comma-separated list of names.
 * For a list of all possible Bounties, leave the template string blank.
 *
 * @category In-game constant
 */
var $bounties = createPluralConstant(external_kolmafia_namespaceObject.Bounty);
/**
 * A Class specified by name.
 *
 * @category In-game constant
 */
var $class = createSingleConstant(external_kolmafia_namespaceObject.Class);
/**
 * A list of Classes specified by a comma-separated list of names.
 * For a list of all possible Classes, leave the template string blank.
 *
 * @category In-game constant
 */
var $classes = createPluralConstant(external_kolmafia_namespaceObject.Class);
/**
 * A Coinmaster specified by name.
 *
 * @category In-game constant
 */
var $coinmaster = createSingleConstant(external_kolmafia_namespaceObject.Coinmaster);
/**
 * A list of Coinmasters specified by a comma-separated list of names.
 * For a list of all possible Coinmasters, leave the template string blank.
 *
 * @category In-game constant
 */
var $coinmasters = createPluralConstant(external_kolmafia_namespaceObject.Coinmaster);
/**
 * An Effect specified by name.
 *
 * @category In-game constant
 */
var $effect = createSingleConstant(external_kolmafia_namespaceObject.Effect);
/**
 * A list of Effects specified by a comma-separated list of names.
 * For a list of all possible Effects, leave the template string blank.
 *
 * @category In-game constant
 */
var $effects = createPluralConstant(external_kolmafia_namespaceObject.Effect);
/**
 * An Element specified by name.
 *
 * @category In-game constant
 */
var $element = createSingleConstant(external_kolmafia_namespaceObject.Element);
/**
 * A list of Elements specified by a comma-separated list of names.
 * For a list of all possible Elements, leave the template string blank.
 *
 * @category In-game constant
 */
var $elements = createPluralConstant(external_kolmafia_namespaceObject.Element);
/**
 * A Familiar specified by name.
 *
 * @category In-game constant
 */
var $familiar = createSingleConstant(external_kolmafia_namespaceObject.Familiar);
/**
 * A list of Familiars specified by a comma-separated list of names.
 * For a list of all possible Familiars, leave the template string blank.
 *
 * @category In-game constant
 */
var $familiars = createPluralConstant(external_kolmafia_namespaceObject.Familiar);
/**
 * An Item specified by name.
 *
 * @category In-game constant
 */
var template_string_$item = createSingleConstant(external_kolmafia_namespaceObject.Item);
/**
 * A list of Items specified by a comma-separated list of names.
 * For a list of all possible Items, leave the template string blank.
 *
 * @category In-game constant
 */
var template_string_$items = createPluralConstant(external_kolmafia_namespaceObject.Item);
/**
 * A Location specified by name.
 *
 * @category In-game constant
 */
var $location = createSingleConstant(external_kolmafia_namespaceObject.Location);
/**
 * A list of Locations specified by a comma-separated list of names.
 * For a list of all possible Locations, leave the template string blank.
 *
 * @category In-game constant
 */
var $locations = createPluralConstant(external_kolmafia_namespaceObject.Location);
/**
 * A Monster specified by name.
 *
 * @category In-game constant
 */
var $monster = createSingleConstant(external_kolmafia_namespaceObject.Monster);
/**
 * A list of Monsters specified by a comma-separated list of names.
 * For a list of all possible Monsters, leave the template string blank.
 *
 * @category In-game constant
 */
var $monsters = createPluralConstant(external_kolmafia_namespaceObject.Monster);
/**
 * A Phylum specified by name.
 *
 * @category In-game constant
 */
var $phylum = createSingleConstant(external_kolmafia_namespaceObject.Phylum);
/**
 * A list of Phyla specified by a comma-separated list of names.
 * For a list of all possible Phyla, leave the template string blank.
 *
 * @category In-game constant
 */
var $phyla = createPluralConstant(external_kolmafia_namespaceObject.Phylum);
/**
 * A Servant specified by name.
 *
 * @category In-game constant
 */
var $servant = createSingleConstant(external_kolmafia_namespaceObject.Servant);
/**
 * A list of Servants specified by a comma-separated list of names.
 * For a list of all possible Servants, leave the template string blank.
 *
 * @category In-game constant
 */
var $servants = createPluralConstant(external_kolmafia_namespaceObject.Servant);
/**
 * A Skill specified by name.
 *
 * @category In-game constant
 */
var $skill = createSingleConstant(external_kolmafia_namespaceObject.Skill);
/**
 * A list of Skills specified by a comma-separated list of names.
 * For a list of all possible Skills, leave the template string blank.
 *
 * @category In-game constant
 */
var $skills = createPluralConstant(external_kolmafia_namespaceObject.Skill);
/**
 * A Slot specified by name.
 *
 * @category In-game constant
 */
var $slot = createSingleConstant(external_kolmafia_namespaceObject.Slot);
/**
 * A list of Slots specified by a comma-separated list of names.
 * For a list of all possible Slots, leave the template string blank.
 *
 * @category In-game constant
 */
var $slots = createPluralConstant(external_kolmafia_namespaceObject.Slot);
/**
 * A Stat specified by name.
 *
 * @category In-game constant
 */
var $stat = createSingleConstant(external_kolmafia_namespaceObject.Stat);
/**
 * A list of Stats specified by a comma-separated list of names.
 * For a list of all possible Stats, leave the template string blank.
 *
 * @category In-game constant
 */
var $stats = createPluralConstant(external_kolmafia_namespaceObject.Stat);
/**
 * A Thrall specified by name.
 *
 * @category In-game constant
 */
var $thrall = createSingleConstant(external_kolmafia_namespaceObject.Thrall);
/**
 * A list of Thralls specified by a comma-separated list of names.
 * For a list of all possible Thralls, leave the template string blank.
 *
 * @category In-game constant
 */
var $thralls = createPluralConstant(external_kolmafia_namespaceObject.Thrall);
;// CONCATENATED MODULE: ./node_modules/libram/dist/resources/2017/AsdonMartin.js
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }





var PriceAge;
(function (PriceAge) {
  PriceAge[PriceAge["HISTORICAL"] = 0] = "HISTORICAL";
  PriceAge[PriceAge["RECENT"] = 1] = "RECENT";
  PriceAge[PriceAge["TODAY"] = 2] = "TODAY";
})(PriceAge || (PriceAge = {}));
/**
 * Returns whether or not we have the Asdon installed in the workshed at present.
 */
function installed() {
  return (0,external_kolmafia_namespaceObject.getWorkshed)() === template_string_$item(_templateObject || (_templateObject = _taggedTemplateLiteral(["Asdon Martin keyfob"])));
}
/**
 * Returns true if we have the Asdon or if it's installed.
 */
function have() {
  return installed() || haveItem($item(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Asdon Martin keyfob"]))));
}
var fuelSkiplist = template_string_$items(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["cup of \"tea\", thermos of \"whiskey\", Lucky Lindy, Bee's Knees, Sockdollager, Ish Kabibble, Hot Socks, Phonus Balonus, Flivver, Sloppy Jalopy, glass of \"milk\""])));
function priceTooOld(item) {
  return historicalPrice(item) === 0 || historicalAge(item) >= 7;
}
// Return mall max if historicalPrice returns -1.
function historicalPriceOrMax(item) {
  var historical = historicalPrice(item);
  return historical < 0 ? 999999999 : historical;
}
// Return mall max if mallPrice returns -1.
function mallPriceOrMax(item) {
  var mall = mallPrice(item);
  return mall < 0 ? 999999999 : mall;
}
function price(item, priceAge) {
  switch (priceAge) {
    case PriceAge.HISTORICAL:
      {
        var historical = historicalPriceOrMax(item);
        return historical === 0 ? mallPriceOrMax(item) : historical;
      }
    case PriceAge.RECENT:
      return priceTooOld(item) ? mallPriceOrMax(item) : historicalPriceOrMax(item);
    case PriceAge.TODAY:
      return mallPriceOrMax(item);
  }
}
function inventoryItems() {
  return Item.all().filter(isFuelItem).filter(item => haveItem(item) && [100, autosellPrice(item)].includes(price(item, PriceAge.RECENT)));
}
// Efficiency in meat per fuel.
function calculateFuelUnitCost(it, targetUnits) {
  var priceAge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PriceAge.RECENT;
  var units = getAverageAdventures(it);
  return price(it, priceAge) / Math.min(targetUnits, units);
}
function isFuelItem(it) {
  return !isNpcItem(it) && it.fullness + it.inebriety > 0 && getAverageAdventures(it) > 0 && it.tradeable && it.discardable && !fuelSkiplist.includes(it);
}
function getBestFuel(targetUnits) {
  // Three stages.
  // 1. Filter to reasonable items using historical cost (within 5x of historical best).
  var allFuel = $items(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral([""]))).filter(isFuelItem);
  if (allFuel.filter(item => historicalPrice(item) === 0).length > 100) {
    mallPrices("food");
    mallPrices("booze");
  }
  var keyHistorical = item => calculateFuelUnitCost(item, targetUnits, PriceAge.HISTORICAL);
  allFuel.sort((x, y) => keyHistorical(x) - keyHistorical(y));
  var bestUnitCost = keyHistorical(allFuel[0]);
  var firstBadIndex = allFuel.findIndex(item => keyHistorical(item) > 5 * bestUnitCost);
  var potentialFuel = firstBadIndex > 0 ? allFuel.slice(0, firstBadIndex) : allFuel;
  // 2. Filter to top 10 candidates using prices at most a week old.
  if (potentialFuel.filter(item => priceTooOld(item)).length > 100) {
    mallPrices("food");
    mallPrices("booze");
  }
  var key1 = item => -getAverageAdventures(item);
  var key2 = item => calculateFuelUnitCost(item, targetUnits, PriceAge.RECENT);
  potentialFuel.sort((x, y) => key1(x) - key1(y));
  potentialFuel.sort((x, y) => key2(x) - key2(y));
  // 3. Find result using precise price for those top candidates.
  var candidates = potentialFuel.slice(0, 10);
  var key3 = item => calculateFuelUnitCost(item, targetUnits, PriceAge.TODAY);
  candidates.sort((x, y) => key3(x) - key3(y));
  if (calculateFuelUnitCost(candidates[0], targetUnits, PriceAge.TODAY) > 100) {
    throw new Error("Could not identify any fuel with efficiency better than 100 meat per fuel. " + "This means something went wrong.");
  }
  return candidates[0];
}
/**
 * Fuel your Asdon Martin with a given quantity of a given item
 * @param it Item to fuel with.
 * @param quantity Number of items to fuel with.
 * @returns Whether we succeeded at fueling with the given items.
 */
function insertFuel(it) {
  var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var result = visitUrl("campground.php?action=fuelconvertor&pwd&qty=".concat(quantity, "&iid=").concat(toInt(it), "&go=Convert%21"));
  return result.includes("The display updates with a");
}
/**
 * Fill your Asdon Martin to the given fuel level in the cheapest way possible
 * @param targetUnits Fuel level to attempt to reach.
 * @returns Whether we succeeded at filling to the target fuel level.
 */
function fillTo(targetUnits) {
  if (!installed()) return false;
  while (getFuel() < targetUnits) {
    var remaining = targetUnits - getFuel();
    // if in Hardcore/ronin, skip the price calculation and just use soda bread
    var fuel = void 0;
    if (canInteract()) fuel = getBestFuel(remaining);else fuel = $item(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["loaf of soda bread"])));
    var count = Math.ceil(targetUnits / getAverageAdventures(fuel));
    retrieveItem(count, fuel);
    if (!insertFuel(fuel, count)) {
      throw new Error("Failed to fuel Asdon Martin.");
    }
  }
  return getFuel() >= targetUnits;
}
function fillWithBestInventoryItem(targetUnits) {
  var options = inventoryItems().sort((a, b) => getAverageAdventures(b) / autosellPrice(b) - getAverageAdventures(a) / autosellPrice(a));
  if (options.length === 0) return false;
  var best = options[0];
  if (autosellPrice(best) / getAverageAdventures(best) > 100) return false;
  var amountToUse = clamp(Math.ceil(targetUnits / getAverageAdventures(best)), 0, itemAmount(best));
  return insertFuel(best, amountToUse);
}
/**
 * Fill your Asdon Martin by prioritizing mallmin items in your inventory. Default to the behavior of fillTo.
 * @param targetUnits Fuel level to attempt to reach.
 * @returns Whether we succeeded at filling to the target fuel level.
 */
function fillWithInventoryTo(targetUnits) {
  if (!installed()) return false;
  var continueFuelingFromInventory = true;
  while (getFuel() < targetUnits && continueFuelingFromInventory) {
    continueFuelingFromInventory && (continueFuelingFromInventory = fillWithBestInventoryItem(targetUnits));
  }
  return fillTo(targetUnits);
}
/**
 * Object consisting of the various Asdon driving styles
 */
var Driving = {
  Obnoxiously: $effect(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["Driving Obnoxiously"]))),
  Stealthily: $effect(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["Driving Stealthily"]))),
  Wastefully: $effect(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["Driving Wastefully"]))),
  Safely: $effect(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["Driving Safely"]))),
  Recklessly: $effect(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["Driving Recklessly"]))),
  Intimidatingly: $effect(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["Driving Intimidatingly"]))),
  Quickly: $effect(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["Driving Quickly"]))),
  Observantly: $effect(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["Driving Observantly"]))),
  Waterproofly: $effect(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["Driving Waterproofly"])))
};
/**
 * Attempt to drive with a particular style for a particular number of turns.
 * @param style The driving style to use.
 * @param turns The number of turns to attempt to get.
 * @param preferInventory Whether we should preferentially value items currently in our inventory.
 * @returns Whether we have at least as many turns as requested of said driving style.
 */
function drive(style) {
  var turns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var preferInventory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!Object.values(Driving).includes(style)) return false;
  if (!installed()) return false;
  if (haveEffect(style) >= turns) return true;
  var fuelNeeded = 37 * Math.ceil((turns - haveEffect(style)) / 30);
  (preferInventory ? fillWithInventoryTo : fillTo)(fuelNeeded);
  while (getFuel() >= 37 && haveEffect(style) < turns) {
    cliExecute("asdonmartin drive ".concat(style.name.replace("Driving ", "")));
  }
  return haveEffect(style) >= turns;
}
;// CONCATENATED MODULE: ./src/coinmaster.ts
var coinmaster_templateObject, coinmaster_templateObject2;
function coinmaster_toConsumableArray(arr) { return coinmaster_arrayWithoutHoles(arr) || coinmaster_iterableToArray(arr) || coinmaster_unsupportedIterableToArray(arr) || coinmaster_nonIterableSpread(); }
function coinmaster_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function coinmaster_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return coinmaster_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return coinmaster_arrayLikeToArray(o, minLen); }
function coinmaster_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function coinmaster_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return coinmaster_arrayLikeToArray(arr); }
function coinmaster_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function coinmaster_taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }


function coinmasterBuyAll(coinmaster, target, availableCoins) {
  var toBuy = Math.floor(availableCoins / (0,external_kolmafia_namespaceObject.sellPrice)(coinmaster, target));
  if (toBuy > 0) {
    (0,external_kolmafia_namespaceObject.buy)(coinmaster, toBuy, target);
  }
}
function getSellableItem(item) {
  if (item === template_string_$item(coinmaster_templateObject || (coinmaster_templateObject = coinmaster_taggedTemplateLiteral(["Merc Core deployment orders"])))) {
    return template_string_$item(coinmaster_templateObject2 || (coinmaster_templateObject2 = coinmaster_taggedTemplateLiteral(["one-day ticket to Conspiracy Island"])));
  }
  return item;
}
function coinmasterBest(coin) {
  var coinmasters = external_kolmafia_namespaceObject.Coinmaster.all().filter(c => c.item === coin);
  var price = (c, i) => (0,external_kolmafia_namespaceObject.mallPrice)(i) / (0,external_kolmafia_namespaceObject.sellPrice)(c, i);
  var availablePurchases = coinmasters.map(c => external_kolmafia_namespaceObject.Item.all().filter(i => (0,external_kolmafia_namespaceObject.sellsItem)(c, i) && getSellableItem(i).tradeable).map(i => [c, getSellableItem(i)])).reduce((arr, results) => [].concat(coinmaster_toConsumableArray(arr), coinmaster_toConsumableArray(results)), []);
  if (availablePurchases.length > 0) {
    var best = availablePurchases.reduce((best, current) => price.apply(void 0, coinmaster_toConsumableArray(best)) < price.apply(void 0, coinmaster_toConsumableArray(current)) ? current : best);
    if (!coin.tradeable || price.apply(void 0, coinmaster_toConsumableArray(best)) > (0,external_kolmafia_namespaceObject.mallPrice)(coin)) {
      return best;
    }
  }
  return;
}
;// CONCATENATED MODULE: ./src/lib.ts

function warn(message) {
  (0,external_kolmafia_namespaceObject.print)(message, "red");
}
;// CONCATENATED MODULE: ./src/actions.ts
function actions_slicedToArray(arr, i) { return actions_arrayWithHoles(arr) || actions_iterableToArrayLimit(arr, i) || actions_unsupportedIterableToArray(arr, i) || actions_nonIterableRest(); }
function actions_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function actions_iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function actions_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function actions_toConsumableArray(arr) { return actions_arrayWithoutHoles(arr) || actions_iterableToArray(arr) || actions_unsupportedIterableToArray(arr) || actions_nonIterableSpread(); }
function actions_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function actions_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return actions_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return actions_arrayLikeToArray(o, minLen); }
function actions_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function actions_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return actions_arrayLikeToArray(arr); }
function actions_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }




function amount(item, options) {
  if (options.keep) {
    return Math.max(0, (0,external_kolmafia_namespaceObject.itemAmount)(item) - options.keep);
  } else {
    return (0,external_kolmafia_namespaceObject.itemAmount)(item);
  }
}
function filters(options) {
  if (options.priceUpperThreshold && options.priceLowerThreshold) {
    var between = (x, lower, upper) => lower < x && x < upper;
    var upperThreshold = options.priceUpperThreshold;
    var lowerThreshold = options.priceLowerThreshold;
    return item => between((0,external_kolmafia_namespaceObject.mallPrice)(item), lowerThreshold, upperThreshold);
  }
  return item => true;
}
var actions = {
  mall: options => {
    if (options.stock) {
      return {
        action: item => {
          var _options$price, _options$limit, _options$stock;
          return (0,external_kolmafia_namespaceObject.putShop)((_options$price = options.price) !== null && _options$price !== void 0 ? _options$price : 0, (_options$limit = options.limit) !== null && _options$limit !== void 0 ? _options$limit : 0, Math.min(Math.max(0, ((_options$stock = options.stock) !== null && _options$stock !== void 0 ? _options$stock : 0) - (0,external_kolmafia_namespaceObject.shopAmount)(item)), amount(item, options)), item);
        }
      };
    }
    return {
      action: item => {
        var _options$price2, _options$limit2;
        return (0,external_kolmafia_namespaceObject.putShop)((_options$price2 = options.price) !== null && _options$price2 !== void 0 ? _options$price2 : 0, (_options$limit2 = options.limit) !== null && _options$limit2 !== void 0 ? _options$limit2 : 0, amount(item, options), item);
      }
    };
  },
  sell: options => {
    return {
      action: item => {
        if ((0,external_kolmafia_namespaceObject.wellStocked)("".concat(item), 1000, Math.max(100, (0,external_kolmafia_namespaceObject.autosellPrice)(item) * 2)) || !item.tradeable) {
          (0,external_kolmafia_namespaceObject.autosell)(amount(item, options), item);
        } else {
          var _options$price3, _options$limit3;
          (0,external_kolmafia_namespaceObject.putShop)((_options$price3 = options.price) !== null && _options$price3 !== void 0 ? _options$price3 : 0, (_options$limit3 = options.limit) !== null && _options$limit3 !== void 0 ? _options$limit3 : 0, amount(item, options), item);
        }
      }
    };
  },
  low: options => {
    return {
      action: item => {
        var _options$limit4;
        (0,external_kolmafia_namespaceObject.putShop)((0,external_kolmafia_namespaceObject.mallPrice)(item), (_options$limit4 = options.limit) !== null && _options$limit4 !== void 0 ? _options$limit4 : 0, amount(item, options), item);
      }
    };
  },
  display: options => {
    if (options.stock) {
      return {
        action: item => {
          var _options$stock2;
          return (0,external_kolmafia_namespaceObject.putDisplay)(Math.min(Math.max(0, ((_options$stock2 = options.stock) !== null && _options$stock2 !== void 0 ? _options$stock2 : 0) - (0,external_kolmafia_namespaceObject.displayAmount)(item)), amount(item, options)), item);
        }
      };
    }
    return {
      action: item => (0,external_kolmafia_namespaceObject.putDisplay)(amount(item, options), item)
    };
  },
  use: options => {
    return {
      action: item => (0,external_kolmafia_namespaceObject.use)(amount(item, options), item)
    };
  },
  autosell: options => {
    return {
      action: item => (0,external_kolmafia_namespaceObject.autosell)(amount(item, options), item)
    };
  },
  kmail: options => {
    var items = [];
    return {
      action: item => items.push(item),
      finalize: () => {
        var _options$target, _options$body;
        var target = (_options$target = options.target) !== null && _options$target !== void 0 ? _options$target : options.default;
        if (!target) {
          throw "You must specify a User # to Kmail!";
        }
        var itemQuantities = new Map(items.map(i => [i, amount(i, options)]));
        (0,external_kolmafia_namespaceObject.print)("Sending Kmail to ".concat(target));
        Kmail.send(target, (_options$body = options.body) !== null && _options$body !== void 0 ? _options$body : "", itemQuantities);
      }
    };
  },
  closet: options => {
    if (options.stock) {
      return {
        action: item => {
          var _options$stock3;
          return (0,external_kolmafia_namespaceObject.putDisplay)(Math.min(Math.max(0, ((_options$stock3 = options.stock) !== null && _options$stock3 !== void 0 ? _options$stock3 : 0) - (0,external_kolmafia_namespaceObject.closetAmount)(item)), amount(item, options)), item);
        }
      };
    }
    return {
      action: item => (0,external_kolmafia_namespaceObject.putCloset)(amount(item, options), item)
    };
  },
  fuel: options => {
    if (!installed()) {
      warn("Asdon martin not installed, skipping fuel action");
      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        action: item => {}
      };
    }
    return {
      action: item => (0,external_kolmafia_namespaceObject.cliExecute)("asdonmartin fuel ".concat(amount(item, options), " ").concat(item))
    };
  },
  smash: options => {
    return {
      action: item => (0,external_kolmafia_namespaceObject.cliExecute)("smash ".concat(amount(item, options), " ").concat(item))
    };
  },
  collection: options => {
    var kmails = new Map();
    return {
      action: item => {
        options.collections.forEach((colItems, target) => {
          if (colItems.includes(item)) {
            var items = kmails.get(target);
            if (items) {
              kmails.set(target, [].concat(actions_toConsumableArray(items), [item]));
            } else {
              kmails.set(target, [item]);
            }
          }
        });
      },
      finalize: () => {
        actions_toConsumableArray(kmails.entries()).map(v => {
          var _options$body2;
          var _v = actions_slicedToArray(v, 2),
            target = _v[0],
            items = _v[1];
          var itemQuantities = new Map(items.map(i => [i, amount(i, options)]));
          (0,external_kolmafia_namespaceObject.print)("Sending Kmail to ".concat(target));
          Kmail.send(target, (_options$body2 = options.body) !== null && _options$body2 !== void 0 ? _options$body2 : "For your collection, courtesy of keeping-tabs", itemQuantities);
        });
      }
    };
  },
  coinmaster: options => ({
    action: item => {
      var targetPair = options.coinmasters.get(item);
      var availableCoins = amount(item, options);
      if (targetPair) {
        var _targetPair = actions_slicedToArray(targetPair, 2),
          coinmaster = _targetPair[0],
          targetItem = _targetPair[1];
        coinmasterBuyAll(coinmaster, targetItem, availableCoins);
      } else if (options.best) {
        var best = coinmasterBest(item);
        if (best && best[1] !== item) {
          (0,external_kolmafia_namespaceObject.print)("Computed best for ".concat(item, " is ").concat(best[1], " from ").concat(best[0]));
          coinmasterBuyAll.apply(void 0, actions_toConsumableArray(best).concat([availableCoins]));
        }
      }
    }
  })
};
;// CONCATENATED MODULE: ./src/parse.ts



function favoriteTabs(aliases) {
  // visit the consumables tab to ensure that you get clickable links for
  // all favorite tabs
  var inventory = (0,external_kolmafia_namespaceObject.visitUrl)("inventory.php?which=1");
  var tabRegex = /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?<\/a>/g;
  var tabs = [];
  var match;
  var aliasMatch;
  while ((match = tabRegex.exec(inventory)) !== null) {
    var title = match[2];
    var options = match[3];
    var alias = aliases.get(title);
    var id = parseInt(match[1]);
    if (isTabTitle(title)) {
      tabs.push({
        title: title,
        id: id,
        options: (options !== null && options !== void 0 ? options : ":").substring(1).split(","),
        type: "inventory"
      });
    } else if (alias && (aliasMatch = /([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?/g.exec(alias))) {
      var aliasTitle = aliasMatch[1];
      var _options = aliasMatch[2];
      if (isTabTitle(aliasTitle)) {
        tabs.push({
          title: aliasTitle,
          id: parseInt(match[1]),
          options: (_options !== null && _options !== void 0 ? _options : ":").substring(1).split(","),
          type: "inventory",
          alias: title
        });
      }
    }
  }
  return tabs;
}
function parseItems(tabId, type) {
  var tab = (0,external_kolmafia_namespaceObject.visitUrl)("".concat(type, ".php?which=f").concat(tabId));
  var regexp = /ic(\d+)/g;
  var items = [];
  var match;
  while ((match = regexp.exec(tab)) !== null) {
    var item = (0,external_kolmafia_namespaceObject.toItem)((0,external_kolmafia_namespaceObject.toInt)(match[1]));
    items.push(item);
  }
  return items;
}
function notesText() {
  var questLogNotesHtml = (0,external_kolmafia_namespaceObject.visitUrl)("questlog.php?which=4");
  return questLogNotesHtml.substring(questLogNotesHtml.indexOf(">", questLogNotesHtml.indexOf("<textarea")) + 1, questLogNotesHtml.indexOf("</textarea"));
}
function parseAliases(notes) {
  var questLogAliases = notes.split("\n").map(s => /^keeping-tabs: ?([A-Za-z0-9\- ]+)=(.*)/g.exec(s)).filter(r => r !== null);
  var values = questLogAliases.map(r => [r[1], r[2]]);
  return new Map(values);
}
function parseCollections(notes) {
  var questLogEntries = notes.split("\n").map(s => /^keeping-tabs-collection: ?'([^']*)'=(.*)\s*/g.exec(s)).filter(r => r !== null && r.length > 1);
  var values = questLogEntries.map(r => [r[1], r[2].split(",").map(i => (0,external_kolmafia_namespaceObject.toItem)((0,external_kolmafia_namespaceObject.toInt)(i)))]);
  return new Map(values);
}
function parseCoinmasters(notes) {
  var questLogEntries = notes.split("\n").map(s => /^keeping-tabs-coinmaster: ?([0-9]+)=([0-9]+)/g.exec(s)).filter(r => r !== null);
  var values = questLogEntries.map(r => {
    var coin = (0,external_kolmafia_namespaceObject.toItem)((0,external_kolmafia_namespaceObject.toInt)(r[1]));
    var item = (0,external_kolmafia_namespaceObject.toItem)((0,external_kolmafia_namespaceObject.toInt)(r[2]));
    var coinmaster = external_kolmafia_namespaceObject.Coinmaster.all().find(c => c.item === coin && (0,external_kolmafia_namespaceObject.sellsItem)(c, item));
    if (!(0,external_kolmafia_namespaceObject.isCoinmasterItem)(item)) {
      warn("KoLmafia doesn't believe it can purchase ".concat(item, " (").concat(r[2], ") with currency. Maybe you need to update?"));
      return [external_kolmafia_namespaceObject.Item.none, [external_kolmafia_namespaceObject.Coinmaster.none, external_kolmafia_namespaceObject.Item.none]];
    } else if (!coinmaster) {
      warn("".concat(item, " (").concat(r[2], ") can't be bought with ").concat(coin, " (").concat(r[1], ")"));
      return [external_kolmafia_namespaceObject.Item.none, [external_kolmafia_namespaceObject.Coinmaster.none, external_kolmafia_namespaceObject.Item.none]];
    } else {
      return [coin, [coinmaster, item]];
    }
  });
  return new Map(values.filter(value => value[0] !== external_kolmafia_namespaceObject.Item.none));
}
function parseNotes() {
  var notes = notesText();
  return {
    aliases: parseAliases(notes),
    collections: parseCollections(notes),
    coinmasters: parseCoinmasters(notes)
  };
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.from-entries.js
var es_object_from_entries = __webpack_require__(5809);
;// CONCATENATED MODULE: ./node_modules/libram/dist/property.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { property_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function property_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function property_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, property_toPropertyKey(descriptor.key), descriptor); } }
function property_createClass(Constructor, protoProps, staticProps) { if (protoProps) property_defineProperties(Constructor.prototype, protoProps); if (staticProps) property_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function property_defineProperty(obj, key, value) { key = property_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function property_toPropertyKey(arg) { var key = property_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function property_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function property_slicedToArray(arr, i) { return property_arrayWithHoles(arr) || property_iterableToArrayLimit(arr, i) || property_unsupportedIterableToArray(arr, i) || property_nonIterableRest(); }
function property_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function property_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return property_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return property_arrayLikeToArray(o, minLen); }
function property_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function property_iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function property_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var createPropertyGetter = transform => (property, default_) => {
  var value = (0,external_kolmafia_namespaceObject.getProperty)(property);
  if (default_ !== undefined && value === "") {
    return default_;
  }
  return transform(value, property);
};
var createMafiaClassPropertyGetter = (Type, toType) => createPropertyGetter(value => {
  if (value === "") return null;
  var v = toType(value);
  return v === Type.none ? null : v;
});
var getString = createPropertyGetter(value => value);
var getCommaSeparated = createPropertyGetter(value => value.split(/, ?/));
var getBoolean = createPropertyGetter(value => value === "true");
var getNumber = createPropertyGetter(value => Number(value));
var getBounty = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Bounty, external_kolmafia_namespaceObject.toBounty);
var getClass = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Class, external_kolmafia_namespaceObject.toClass);
var getCoinmaster = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Coinmaster, external_kolmafia_namespaceObject.toCoinmaster);
var getEffect = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Effect, external_kolmafia_namespaceObject.toEffect);
var getElement = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Element, external_kolmafia_namespaceObject.toElement);
var getFamiliar = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Familiar, external_kolmafia_namespaceObject.toFamiliar);
var getItem = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Item, external_kolmafia_namespaceObject.toItem);
var getLocation = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Location, external_kolmafia_namespaceObject.toLocation);
var getMonster = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Monster, external_kolmafia_namespaceObject.toMonster);
var getPhylum = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Phylum, external_kolmafia_namespaceObject.toPhylum);
var getServant = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Servant, external_kolmafia_namespaceObject.toServant);
var getSkill = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Skill, external_kolmafia_namespaceObject.toSkill);
var getSlot = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Slot, external_kolmafia_namespaceObject.toSlot);
var getStat = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Stat, external_kolmafia_namespaceObject.toStat);
var getThrall = createMafiaClassPropertyGetter(external_kolmafia_namespaceObject.Thrall, external_kolmafia_namespaceObject.toThrall);
function get(property, _default) {
  var value = getString(property);
  // Handle known properties.
  if (isBooleanProperty(property)) {
    var _getBoolean;
    return (_getBoolean = getBoolean(property, _default)) !== null && _getBoolean !== void 0 ? _getBoolean : false;
  } else if (isNumericProperty(property)) {
    var _getNumber;
    return (_getNumber = getNumber(property, _default)) !== null && _getNumber !== void 0 ? _getNumber : 0;
  } else if (isNumericOrStringProperty(property)) {
    return value.match(/^\d+$/) ? parseInt(value) : value;
  } else if (isLocationProperty(property)) {
    return getLocation(property, _default);
  } else if (isMonsterProperty(property)) {
    return getMonster(property, _default);
  } else if (isFamiliarProperty(property)) {
    return getFamiliar(property, _default);
  } else if (isStatProperty(property)) {
    return getStat(property, _default);
  } else if (isPhylumProperty(property)) {
    return getPhylum(property, _default);
  } else if (isStringProperty(property)) {
    return value;
  }
  // Not a KnownProperty from here on out.
  if (_default instanceof Location) {
    return getLocation(property, _default);
  } else if (_default instanceof Monster) {
    return getMonster(property, _default);
  } else if (_default instanceof Familiar) {
    return getFamiliar(property, _default);
  } else if (_default instanceof Stat) {
    return getStat(property, _default);
  } else if (_default instanceof Phylum) {
    return getPhylum(property, _default);
  } else if (typeof _default === "boolean") {
    return value === "true" ? true : value === "false" ? false : _default;
  } else if (typeof _default === "number") {
    return value === "" ? _default : parseInt(value);
  } else if (value === "") {
    return _default === undefined ? "" : _default;
  } else {
    return value;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _set(property, value) {
  var stringValue = value === null ? "" : value.toString();
  (0,external_kolmafia_namespaceObject.setProperty)(property, stringValue);
}

function setProperties(properties) {
  for (var _i = 0, _Object$entries = Object.entries(properties); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = property_slicedToArray(_Object$entries[_i], 2),
      prop = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    _set(prop, value);
  }
}
function withProperties(properties, callback) {
  var propertiesBackup = Object.fromEntries(Object.entries(properties).map(_ref => {
    var _ref2 = property_slicedToArray(_ref, 1),
      prop = _ref2[0];
    return [prop, get(prop)];
  }));
  setProperties(properties);
  try {
    callback();
  } finally {
    setProperties(propertiesBackup);
  }
}
function withProperty(property, value, callback) {
  withProperties(property_defineProperty({}, property, value), callback);
}
function withChoices(choices, callback) {
  var properties = Object.fromEntries(Object.entries(choices).map(_ref3 => {
    var _ref4 = property_slicedToArray(_ref3, 2),
      choice = _ref4[0],
      option = _ref4[1];
    return ["choiceAdventure".concat(choice), option];
  }));
  withProperties(properties, callback);
}
function withChoice(choice, value, callback) {
  withChoices(property_defineProperty({}, choice, value), callback);
}
var PropertiesManager = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function PropertiesManager() {
    property_classCallCheck(this, PropertiesManager);
    property_defineProperty(this, "properties", {});
  }
  property_createClass(PropertiesManager, [{
    key: "storedValues",
    get: function get() {
      return this.properties;
    }
    /**
     * Sets a collection of properties to the given values, storing the old values.
     * @param propertiesToSet A Properties object, keyed by property name.
     */
  }, {
    key: "set",
    value: function set(propertiesToSet) {
      for (var _i2 = 0, _Object$entries2 = Object.entries(propertiesToSet); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = property_slicedToArray(_Object$entries2[_i2], 2),
          propertyName = _Object$entries2$_i[0],
          propertyValue = _Object$entries2$_i[1];
        if (this.properties[propertyName] === undefined) {
          this.properties[propertyName] = get(propertyName);
        }
        _set(propertyName, propertyValue);
      }
    }
    /**
     * Sets a collection of choice adventure properties to the given values, storing the old values.
     * @param choicesToSet An object keyed by choice adventure number.
     */
  }, {
    key: "setChoices",
    value: function setChoices(choicesToSet) {
      this.set(Object.fromEntries(Object.entries(choicesToSet).map(_ref5 => {
        var _ref6 = property_slicedToArray(_ref5, 2),
          choiceNumber = _ref6[0],
          choiceValue = _ref6[1];
        return ["choiceAdventure".concat(choiceNumber), choiceValue];
      })));
    }
    /**
     * Sets a single choice adventure property to the given value, storing the old value.
     * @param choiceToSet The number of the choice adventure to set the property for.
     * @param value The value to assign to that choice adventure.
     */
  }, {
    key: "setChoice",
    value: function setChoice(choiceToSet, value) {
      this.setChoices(property_defineProperty({}, choiceToSet, value));
    }
    /**
     * Resets the given properties to their original stored value. Does not delete entries from the manager.
     * @param properties Collection of properties to reset.
     */
  }, {
    key: "reset",
    value: function reset() {
      for (var _len = arguments.length, properties = new Array(_len), _key = 0; _key < _len; _key++) {
        properties[_key] = arguments[_key];
      }
      for (var _i3 = 0, _properties = properties; _i3 < _properties.length; _i3++) {
        var property = _properties[_i3];
        var value = this.properties[property];
        if (value) {
          _set(property, value);
        }
      }
    }
    /**
     * Iterates over all stored values, setting each property back to its original stored value. Does not delete entries from the manager.
     */
  }, {
    key: "resetAll",
    value: function resetAll() {
      setProperties(this.properties);
    }
    /**
     * Stops storing the original values of inputted properties.
     * @param properties Properties for the manager to forget.
     */
  }, {
    key: "clear",
    value: function clear() {
      for (var _len2 = arguments.length, properties = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        properties[_key2] = arguments[_key2];
      }
      for (var _i4 = 0, _properties2 = properties; _i4 < _properties2.length; _i4++) {
        var property = _properties2[_i4];
        if (this.properties[property]) {
          delete this.properties[property];
        }
      }
    }
    /**
     * Clears all properties.
     */
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.properties = {};
    }
    /**
     * Increases a numeric property to the given value if necessary.
     * @param property The numeric property we want to potentially raise.
     * @param value The minimum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMinimumValue",
    value: function setMinimumValue(property, value) {
      if (get(property, 0) < value) {
        this.set(property_defineProperty({}, property, value));
        return true;
      }
      return false;
    }
    /**
     * Decrease a numeric property to the given value if necessary.
     * @param property The numeric property we want to potentially lower.
     * @param value The maximum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMaximumValue",
    value: function setMaximumValue(property, value) {
      if (get(property, 0) > value) {
        this.set(property_defineProperty({}, property, value));
        return true;
      }
      return false;
    }
    /**
     * Creates a new PropertiesManager with identical stored values to this one.
     * @returns A new PropertiesManager, with identical stored values to this one.
     */
  }, {
    key: "clone",
    value: function clone() {
      var newGuy = new PropertiesManager();
      newGuy.properties = this.storedValues;
      return newGuy;
    }
    /**
     * Clamps a numeric property, modulating it up or down to fit within a specified range
     * @param property The numeric property to clamp
     * @param min The lower bound for what we want the property to be allowed to be.
     * @param max The upper bound for what we want the property to be allowed to be.
     * @returns Whether we ended up changing the property or not.
     */
  }, {
    key: "clamp",
    value: function clamp(property, min, max) {
      if (max < min) return false;
      var start = get(property);
      this.setMinimumValue(property, min);
      this.setMaximumValue(property, max);
      return start !== get(property);
    }
    /**
     * Determines whether this PropertiesManager has identical stored values to another.
     * @param other The PropertiesManager to compare to this one.
     * @returns Whether their StoredValues are identical.
     */
  }, {
    key: "equals",
    value: function equals(other) {
      var thisProps = Object.entries(this.storedValues);
      var otherProps = new Map(Object.entries(other.storedValues));
      if (thisProps.length !== otherProps.size) return false;
      for (var _i5 = 0, _thisProps = thisProps; _i5 < _thisProps.length; _i5++) {
        var _thisProps$_i = property_slicedToArray(_thisProps[_i5], 2),
          propertyName = _thisProps$_i[0],
          propertyValue = _thisProps$_i[1];
        if (otherProps.get(propertyName) === propertyValue) return false;
      }
      return true;
    }
    /**
     * Merges a PropertiesManager onto this one, letting the input win in the event that both PropertiesManagers have a value stored.
     * @param other The PropertiesManager to be merged onto this one.
     * @returns A new PropertiesManager with stored values from both its parents.
     */
  }, {
    key: "merge",
    value: function merge(other) {
      var newGuy = new PropertiesManager();
      newGuy.properties = _objectSpread(_objectSpread({}, this.properties), other.properties);
      return newGuy;
    }
    /**
     * Merges an arbitrary collection of PropertiesManagers, letting the rightmost PropertiesManager win in the event of verlap.
     * @param mergees The PropertiesManagers to merge together.
     * @returns A PropertiesManager that is just an amalgam of all the constituents.
     */
  }], [{
    key: "merge",
    value: function merge() {
      for (var _len3 = arguments.length, mergees = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        mergees[_key3] = arguments[_key3];
      }
      if (mergees.length === 0) return new PropertiesManager();
      return mergees.reduce((a, b) => a.merge(b));
    }
  }]);
  return PropertiesManager;
}()));
;// CONCATENATED MODULE: ./src/main.ts
function main_slicedToArray(arr, i) { return main_arrayWithHoles(arr) || main_iterableToArrayLimit(arr, i) || main_unsupportedIterableToArray(arr, i) || main_nonIterableRest(); }
function main_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function main_iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function main_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function main_toConsumableArray(arr) { return main_arrayWithoutHoles(arr) || main_iterableToArray(arr) || main_unsupportedIterableToArray(arr) || main_nonIterableSpread(); }
function main_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function main_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function main_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return main_arrayLikeToArray(arr); }
function main_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = main_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function main_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return main_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return main_arrayLikeToArray(o, minLen); }
function main_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }







var HIGHLIGHT = (0,external_kolmafia_namespaceObject.isDarkMode)() ? "yellow" : "blue";
var DEFAULT_ACTIONS = "closet use coinmaster mall autosell display sell kmail fuel collection low";
function items(tabId, type) {
  var tab = visitUrl("".concat(type, ".php?which=f").concat(tabId));
  var regexp = /ic(\d+)/g;
  var items = [];
  var match;
  while ((match = regexp.exec(tab)) !== null) {
    var item = toItem(toInt(match[1]));
    items.push(item);
  }
  return items;
}
function main_notesText() {
  var questLogNotesHtml = visitUrl("questlog.php?which=4");
  return questLogNotesHtml.substring(questLogNotesHtml.indexOf(">", questLogNotesHtml.indexOf("<textarea")) + 1, questLogNotesHtml.indexOf("</textarea"));
}
function tabAliases() {
  var questLogAliases = main_notesText().split("\n").map(s => /keeping-tabs: ?([A-Za-z0-9\- ]+)=(.*)/g.exec(s)).filter(r => r !== null);
  var values = questLogAliases.map(r => [r[1], r[2]]);
  return new Map(values);
}
function tabCollections() {
  var questLogEntries = main_notesText().split("\n").map(s => /keeping-tabs-collection: ?'(.*)'=([0-9,]+)/g.exec(s)).filter(r => r !== null);
  var values = questLogEntries.map(r => [r[1], r[2].split(",").map(i => toItem(toInt(i)))]);
  return new Map(values);
}
function tabString(tab) {
  var options = Options.parse(tab.options);
  var title = tab.alias ? "".concat(tab.title, " (alias ").concat(tab.alias, ")") : tab.title;
  return options.empty() ? title : "".concat(title, " with ").concat(options);
}
function help(mode) {
  switch (mode) {
    case "execute":
      (0,external_kolmafia_namespaceObject.print)("keeping-tabs help | debug [command] | [...actions]", HIGHLIGHT);
      (0,external_kolmafia_namespaceObject.print)("help - print this dialog");
      (0,external_kolmafia_namespaceObject.print)("debug - run debugging commands (use \"debug help\" to see available commands)");
      (0,external_kolmafia_namespaceObject.print)("actions");
      (0,external_kolmafia_namespaceObject.print)("Any of ".concat(ALL_TAB_TITLES.join(", ")));
      (0,external_kolmafia_namespaceObject.print)(" - execute all tabs matching that title");
      (0,external_kolmafia_namespaceObject.print)(" - default actions: ".concat(DEFAULT_ACTIONS));
      break;
    case "debug":
      (0,external_kolmafia_namespaceObject.print)("keeping-tabs debug [command]", HIGHLIGHT);
      (0,external_kolmafia_namespaceObject.print)("alias - print all parsed aliases from notes");
      (0,external_kolmafia_namespaceObject.print)("collections - print all item target collections from notes");
      (0,external_kolmafia_namespaceObject.print)("coinmasters - print all coinmaster items, target items (and best option based on mall price) from notes");
      break;
  }
}
function execute(splitArgs) {
  var parsedNotes = parseNotes();
  (0,external_kolmafia_namespaceObject.cliExecute)("refresh inventory");
  var tabs = favoriteTabs(parsedNotes.aliases);
  var commands = splitArgs.filter(isTabTitle);
  var _iterator = main_createForOfIteratorHelper(commands),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var command = _step.value;
      var _iterator2 = main_createForOfIteratorHelper(tabs),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var tab = _step2.value;
          if (tab.title === command) {
            var _tabForOptions$finali;
            var options = Options.parse(tab.options, parsedNotes);
            var tabForOptions = actions[tab.title](options);
            (0,external_kolmafia_namespaceObject.print)("Running ".concat(tabString(tab)), HIGHLIGHT);
            parseItems(tab.id, tab.type).filter(filters(options)).map(tabForOptions.action);
            (_tabForOptions$finali = tabForOptions.finalize) === null || _tabForOptions$finali === void 0 ? void 0 : _tabForOptions$finali.call(tabForOptions);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  _set("_keepingTabs", ["keeping-tabs", splitArgs].join(" "));
}
function debug(option) {
  var parsedNotes = parseNotes();
  if (option === "alias") {
    (0,external_kolmafia_namespaceObject.print)("Parsed aliases:", HIGHLIGHT);
    main_toConsumableArray(parsedNotes.aliases.entries()).forEach(v => {
      var _v = main_slicedToArray(v, 2),
        alias = _v[0],
        title = _v[1];
      (0,external_kolmafia_namespaceObject.print)("Alias ".concat(alias, " for action ").concat(title), HIGHLIGHT);
    });
  } else if (option === "collections") {
    (0,external_kolmafia_namespaceObject.print)("Parsed collections:", HIGHLIGHT);
    main_toConsumableArray(parsedNotes.collections.entries()).forEach(v => {
      var _v2 = main_slicedToArray(v, 2),
        item = _v2[0],
        target = _v2[1];
      (0,external_kolmafia_namespaceObject.print)("Send ".concat(item, " to ").concat(target));
    });
  } else if (option === "coinmasters") {
    (0,external_kolmafia_namespaceObject.print)("Parsed coinmasters:", HIGHLIGHT);
    main_toConsumableArray(parsedNotes.coinmasters.entries()).forEach(v => {
      var _v3 = main_slicedToArray(v, 2),
        coin = _v3[0],
        _v3$ = main_slicedToArray(_v3[1], 2),
        coinmaster = _v3$[0],
        target = _v3$[1];
      (0,external_kolmafia_namespaceObject.print)("Buy ".concat(target, " from ").concat(coinmaster, " using ").concat((0,external_kolmafia_namespaceObject.sellPrice)(coinmaster, target), " ").concat(coin, " ").concat((0,external_kolmafia_namespaceObject.isAccessible)(coinmaster) ? "" : "(currently unaccessible)"));
      var best = coinmasterBest(coin);
      if (best) {
        var _best = main_slicedToArray(best, 2),
          _coinmaster = _best[0],
          _target = _best[1];
        (0,external_kolmafia_namespaceObject.print)("Best: Buy ".concat(_target, " from ").concat(_coinmaster, " using ").concat((0,external_kolmafia_namespaceObject.sellPrice)(_coinmaster, _target), " ").concat(coin, " ").concat((0,external_kolmafia_namespaceObject.isAccessible)(_coinmaster) ? "" : "(currently unaccessible)"));
      }
    });
  } else {
    (0,external_kolmafia_namespaceObject.print)("Invalid debug option '".concat(option, "'"));
  }
}
function main() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ACTIONS;
  var splitArgs = args.split(" ");
  if (splitArgs[0] === "debug") {
    if (splitArgs.length !== 2 || splitArgs[1] === "help") {
      help("debug");
    } else {
      debug(splitArgs[1]);
    }
  } else if (splitArgs[0] === "help") {
    help("execute");
  } else {
    execute(splitArgs);
  }
}
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;