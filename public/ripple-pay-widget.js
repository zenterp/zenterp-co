/*! jQuery v1.7.1 jquery.com | jquery.org/license */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2012, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;

		var cur = a.nextSibling;
		}

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.2";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return arguments.length<2||r?n[j.random(n.length-1)]:j.shuffle(n).slice(0,Math.max(0,t))};var k=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=k(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={},i=null==r?j.identity:k(r);return A(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};j.groupBy=F(function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=w||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
(function(){var t=this;var e=t.Backbone;var i=[];var r=i.push;var s=i.slice;var n=i.splice;var a;if(typeof exports!=="undefined"){a=exports}else{a=t.Backbone={}}a.VERSION="1.1.0";var h=t._;if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},off:function(t,e,i){var r,s,n,a,o,u,c,f;if(!this._events||!l(this,"off",t,[e,i]))return this;if(!t&&!e&&!i){this._events={};return this}a=t?[t]:h.keys(this._events);for(o=0,u=a.length;o<u;o++){t=a[o];if(n=this._events[t]){this._events[t]=r=[];if(e||i){for(c=0,f=n.length;c<f;c++){s=n[c];if(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context){r.push(s)}}}if(!r.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)c(i,e);if(r)c(r,arguments);return this},stopListening:function(t,e,i){var r=this._listeningTo;if(!r)return this;var s=!e&&!i;if(!i&&typeof e==="object")i=this;if(t)(r={})[t._listenId]=t;for(var n in r){t=r[n];t.off(e,i,this);if(s||h.isEmpty(t._events))delete this._listeningTo[n]}return this}};var u=/\s+/;var l=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(u.test(i)){var n=i.split(u);for(var a=0,h=n.length;a<h;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var c=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,h);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e)}};var f={listenTo:"on",listenToOnce:"once"};h.each(f,function(t,e){o[e]=function(e,i,r){var s=this._listeningTo||(this._listeningTo={});var n=e._listenId||(e._listenId=h.uniqueId("l"));s[n]=e;if(!r&&typeof i==="object")r=this;e[t](i,r,this);return this}});o.bind=o.on;o.unbind=o.off;h.extend(a,o);var d=a.Model=function(t,e){var i=t||{};e||(e={});this.cid=h.uniqueId("c");this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)i=this.parse(i,e)||{};i=h.defaults({},i,h.result(this,"defaults"));this.set(i,e);this.changed={};this.initialize.apply(this,arguments)};h.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return h.clone(this.attributes)},sync:function(){return a.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,i){var r,s,n,a,o,u,l,c;if(t==null)return this;if(typeof t==="object"){s=t;i=e}else{(s={})[t]=e}i||(i={});if(!this._validate(s,i))return false;n=i.unset;o=i.silent;a=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=h.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(r in s){e=s[r];if(!h.isEqual(c[r],e))a.push(r);if(!h.isEqual(l[r],e)){this.changed[r]=e}else{delete this.changed[r]}n?delete c[r]:c[r]=e}if(!o){if(a.length)this._pending=true;for(var f=0,d=a.length;f<d;f++){this.trigger("change:"+a[f],this,c[a[f]],i)}}if(u)return this;if(!o){while(this._pending){this._pending=false;this.trigger("change",this,i)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:true}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!h.isEmpty(this.changed);return h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):false;var e,i=false;var r=this._changing?this._previousAttributes:this.attributes;for(var s in t){if(h.isEqual(r[s],e=t[s]))continue;(i||(i={}))[s]=e}return i},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var i=t.success;t.success=function(r){if(!e.set(e.parse(r,t),t))return false;if(i)i(e,r,t);e.trigger("sync",e,r,t)};M(this,t);return this.sync("read",this,t)},save:function(t,e,i){var r,s,n,a=this.attributes;if(t==null||typeof t==="object"){r=t;i=e}else{(r={})[t]=e}i=h.extend({validate:true},i);if(r&&!i.wait){if(!this.set(r,i))return false}else{if(!this._validate(r,i))return false}if(r&&i.wait){this.attributes=h.extend({},a,r)}if(i.parse===void 0)i.parse=true;var o=this;var u=i.success;i.success=function(t){o.attributes=a;var e=o.parse(t,i);if(i.wait)e=h.extend(r||{},e);if(h.isObject(e)&&!o.set(e,i)){return false}if(u)u(o,t,i);o.trigger("sync",o,t,i)};M(this,i);s=this.isNew()?"create":i.patch?"patch":"update";if(s==="patch")i.attrs=r;n=this.sync(s,this,i);if(r&&i.wait)this.attributes=a;return n},destroy:function(t){t=t?h.clone(t):{};var e=this;var i=t.success;var r=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(s){if(t.wait||e.isNew())r();if(i)i(e,s,t);if(!e.isNew())e.trigger("sync",e,s,t)};if(this.isNew()){t.success();return false}M(this,t);var s=this.sync("delete",this,t);if(!t.wait)r();return s},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||U();if(this.isNew())return t;return t+(t.charAt(t.length-1)==="/"?"":"/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return this.id==null},isValid:function(t){return this._validate({},h.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;if(!i)return true;this.trigger("invalid",this,i,h.extend(e,{validationError:i}));return false}});var p=["keys","values","pairs","invert","pick","omit"];h.each(p,function(t){d.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.attributes);return h[t].apply(h,e)}});var v=a.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,h.extend({silent:true},e))};var g={add:true,remove:true,merge:true};var m={add:true,remove:false};h.extend(v.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return a.sync.apply(this,arguments)},add:function(t,e){return this.set(t,h.extend({merge:false},e,m))},remove:function(t,e){var i=!h.isArray(t);t=i?[t]:h.clone(t);e||(e={});var r,s,n,a;for(r=0,s=t.length;r<s;r++){a=t[r]=this.get(t[r]);if(!a)continue;delete this._byId[a.id];delete this._byId[a.cid];n=this.indexOf(a);this.models.splice(n,1);this.length--;if(!e.silent){e.index=n;a.trigger("remove",a,this,e)}this._removeReference(a)}return i?t[0]:t},set:function(t,e){e=h.defaults({},e,g);if(e.parse)t=this.parse(t,e);var i=!h.isArray(t);t=i?t?[t]:[]:h.clone(t);var r,s,n,a,o,u,l;var c=e.at;var f=this.model;var p=this.comparator&&c==null&&e.sort!==false;var v=h.isString(this.comparator)?this.comparator:null;var m=[],y=[],_={};var w=e.add,b=e.merge,x=e.remove;var E=!p&&w&&x?[]:false;for(r=0,s=t.length;r<s;r++){o=t[r];if(o instanceof d){n=a=o}else{n=o[f.prototype.idAttribute]}if(u=this.get(n)){if(x)_[u.cid]=true;if(b){o=o===a?a.attributes:o;if(e.parse)o=u.parse(o,e);u.set(o,e);if(p&&!l&&u.hasChanged(v))l=true}t[r]=u}else if(w){a=t[r]=this._prepareModel(o,e);if(!a)continue;m.push(a);a.on("all",this._onModelEvent,this);this._byId[a.cid]=a;if(a.id!=null)this._byId[a.id]=a}if(E)E.push(u||a)}if(x){for(r=0,s=this.length;r<s;++r){if(!_[(a=this.models[r]).cid])y.push(a)}if(y.length)this.remove(y,e)}if(m.length||E&&E.length){if(p)l=true;this.length+=m.length;if(c!=null){for(r=0,s=m.length;r<s;r++){this.models.splice(c+r,0,m[r])}}else{if(E)this.models.length=0;var T=E||m;for(r=0,s=T.length;r<s;r++){this.models.push(T[r])}}}if(l)this.sort({silent:true});if(!e.silent){for(r=0,s=m.length;r<s;r++){(a=m[r]).trigger("add",a,this,e)}if(l||E&&E.length)this.trigger("sort",this,e)}return i?t[0]:t},reset:function(t,e){e||(e={});for(var i=0,r=this.models.length;i<r;i++){this._removeReference(this.models[i])}e.previousModels=this.models;this._reset();t=this.add(t,h.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,h.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){return this.add(t,h.extend({at:0},e))},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(){return s.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t.id]||this._byId[t.cid]||this._byId[t]},at:function(t){return this.models[t]},where:function(t,e){if(h.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(h.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(h.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return h.invoke(this.models,"get",t)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var i=this;t.success=function(r){var s=t.reset?"reset":"set";i[s](r,t);if(e)e(i,r,t);i.trigger("sync",i,r,t)};M(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?h.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var i=this;var r=e.success;e.success=function(t,e,s){if(s.wait)i.add(t,s);if(r)r(t,e,s)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof d){if(!t.collection)t.collection=this;return t}e=e?h.clone(e):{};e.collection=this;var i=new this.model(t,e);if(!i.validationError)return i;this.trigger("invalid",this,i.validationError,e);return false},_removeReference:function(t){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var y=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(y,function(t){v.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.models);return h[t].apply(h,e)}});var _=["groupBy","countBy","sortBy"];h.each(_,function(t){v.prototype[t]=function(e,i){var r=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,r,i)}});var w=a.View=function(t){this.cid=h.uniqueId("view");t||(t={});h.extend(this,h.pick(t,x));this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var b=/^(\S+)\s*(.*)$/;var x=["model","collection","el","id","attributes","className","tagName","events"];h.extend(w.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,e){if(this.$el)this.undelegateEvents();this.$el=t instanceof a.$?t:a.$(t);this.el=this.$el[0];if(e!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=h.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(!h.isFunction(i))i=this[t[e]];if(!i)continue;var r=e.match(b);var s=r[1],n=r[2];i=h.bind(i,this);s+=".delegateEvents"+this.cid;if(n===""){this.$el.on(s,i)}else{this.$el.on(s,n,i)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_ensureElement:function(){if(!this.el){var t=h.extend({},h.result(this,"attributes"));if(this.id)t.id=h.result(this,"id");if(this.className)t["class"]=h.result(this,"className");var e=a.$("<"+h.result(this,"tagName")+">").attr(t);this.setElement(e,false)}else{this.setElement(h.result(this,"el"),false)}}});a.sync=function(t,e,i){var r=T[t];h.defaults(i||(i={}),{emulateHTTP:a.emulateHTTP,emulateJSON:a.emulateJSON});var s={type:r,dataType:"json"};if(!i.url){s.url=h.result(e,"url")||U()}if(i.data==null&&e&&(t==="create"||t==="update"||t==="patch")){s.contentType="application/json";s.data=JSON.stringify(i.attrs||e.toJSON(i))}if(i.emulateJSON){s.contentType="application/x-www-form-urlencoded";s.data=s.data?{model:s.data}:{}}if(i.emulateHTTP&&(r==="PUT"||r==="DELETE"||r==="PATCH")){s.type="POST";if(i.emulateJSON)s.data._method=r;var n=i.beforeSend;i.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",r);if(n)return n.apply(this,arguments)}}if(s.type!=="GET"&&!i.emulateJSON){s.processData=false}if(s.type==="PATCH"&&E){s.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var o=i.xhr=a.ajax(h.extend(s,i));e.trigger("request",e,o,i);return o};var E=typeof window!=="undefined"&&!!window.ActiveXObject&&!(window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent);var T={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};a.ajax=function(){return a.$.ajax.apply(a.$,arguments)};var k=a.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var S=/\((.*?)\)/g;var $=/(\(\?)?:\w+/g;var H=/\*\w+/g;var A=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(k.prototype,o,{initialize:function(){},route:function(t,e,i){if(!h.isRegExp(t))t=this._routeToRegExp(t);if(h.isFunction(e)){i=e;e=""}if(!i)i=this[e];var r=this;a.history.route(t,function(s){var n=r._extractParameters(t,s);i&&i.apply(r,n);r.trigger.apply(r,["route:"+e].concat(n));r.trigger("route",e,n);a.history.trigger("route",r,e,n)});return this},navigate:function(t,e){a.history.navigate(t,e);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=h.result(this,"routes");var t,e=h.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(A,"\\$&").replace(S,"(?:$1)?").replace($,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)");return new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return h.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=a.History=function(){this.handlers=[];h.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var P=/msie [\w.]+/;var C=/\/$/;var j=/[?#].*$/;I.started=false;h.extend(I.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.slice(i.length)}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(I.started)throw new Error("Backbone.history has already been started");I.started=true;this.options=h.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment();var i=document.documentMode;var r=P.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(O,"/");if(r&&this._wantsHashChange){this.iframe=a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;this.navigate(e)}if(this._hasPushState){a.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!r){a.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=e;var s=this.location;var n=s.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!n){this.fragment=this.getFragment(null,true);this.location.replace(this.root+this.location.search+"#"+this.fragment);return true}else if(this._hasPushState&&n&&s.hash){this.fragment=this.getHash().replace(N,"");this.history.replaceState({},document.title,this.root+this.fragment+s.search)}}if(!this.options.silent)return this.loadUrl()},stop:function(){a.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);I.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){t=this.fragment=this.getFragment(t);return h.any(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!I.started)return false;if(!e||e===true)e={trigger:!!e};var i=this.root+(t=this.getFragment(t||""));t=t.replace(j,"");if(this.fragment===t)return;this.fragment=t;if(t===""&&i!=="/")i=i.slice(0,-1);if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});a.history=new I;var R=function(t,e){var i=this;var r;if(t&&h.has(t,"constructor")){r=t.constructor}else{r=function(){return i.apply(this,arguments)}}h.extend(r,i,e);var s=function(){this.constructor=r};s.prototype=i.prototype;r.prototype=new s;if(t)h.extend(r.prototype,t);r.__super__=i.prototype;return r};d.extend=v.extend=k.extend=w.extend=I.extend=R;var U=function(){throw new Error('A "url" property or function must be specified')};var M=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}}}).call(this);
var ripple=function(t){function e(i){if(r[i])return r[i].exports;var n=r[i]={exports:{},id:i,loaded:!1};return t[i].call(null,n,n.exports,e),n.loaded=!0,n.exports}var r={};return e.e=function(t,r){r.call(null,e)},e.modules=t,e.cache=r,e(0)}({c:"",0:function(t,e,r){e.Remote=r(1).Remote,e.Amount=r(2).Amount,e.Currency=r(3).Currency,e.Base=r(4).Base,e.UInt160=r(2).UInt160,e.Seed=r(2).Seed,e.Transaction=r(5).Transaction,e.Meta=r(6).Meta,e.SerializedObject=r(7).SerializedObject,e.binformat=r(8),e.utils=r(9),e.Server=r(10).Server,e.sjcl=r(9).sjcl,e.config=r(11)},1:function(t,e,r){function i(t){function e(t){"transaction_all"===t&&(!i._transaction_subs&&i._connected&&i.request_subscribe("transactions").request(),i._transaction_subs+=1)}function r(t){"transaction_all"===t&&(i._transaction_subs-=1,!i._transaction_subs&&i._connected&&i.request_unsubscribe("transactions").request())}n.call(this);var i=this;this.trusted=Boolean(t.trusted),this.local_sequence=Boolean(t.local_sequence),this.local_fee="undefined"==typeof t.local_fee?!0:Boolean(t.local_fee),this.local_signing="undefined"==typeof t.local_signing?!0:Boolean(t.local_signing),this.fee_cushion="undefined"==typeof t.fee_cushion?1.2:Number(t.fee_cushion),this.max_fee="undefined"==typeof t.max_fee?1/0:Number(t.max_fee),this.id=0,this.trace=Boolean(t.trace),this._server_fatal=!1,this._ledger_current_index=void 0,this._ledger_hash=void 0,this._ledger_time=void 0,this._stand_alone=void 0,this._testnet=void 0,this._transaction_subs=0,this.online_target=!1,this._online_state="closed",this.state="offline",this.retry_timer=void 0,this.retry=void 0,this._load_base=256,this._load_factor=256,this._fee_ref=10,this._fee_base=10,this._reserve_base=void 0,this._reserve_inc=void 0,this._connection_count=0,this._connected=!1,this._connection_offset=1e3*("number"==typeof t.connection_offset?t.connection_offset:5),this._submission_timeout=1e3*("number"==typeof t.submission_timeout?t.submission_timeout:10),this._received_tx={},this._cur_path_find=null,this.local_signing&&(this.local_sequence=!0,this.local_fee=!0),this._servers=[],this._primary_server=void 0,this.accounts={},this._accounts={},this._books={},this.secrets={},this.ledgers={current:{account_root:{}}},t.hasOwnProperty("servers")||(t.servers=[{host:t.websocket_ip,port:t.websocket_port,secure:t.websocket_ssl,trusted:t.trusted}]),t.servers.forEach(function(t){for(var e=Number(t.pool)||1;e--;)i.add_server(t)});var s=t.maxListeners||t.max_listeners||0;this._servers.concat(this).forEach(function(t){t.setMaxListeners(s)}),this.on("newListener",e),this.on("removeListener",r)}var n=r(24).EventEmitter,s=r(25),o=r(13).Request,a=r(10).Server,c=r(2).Amount,u=r(3).Currency,h=r(14).UInt160,f=r(5).Transaction,l=r(15).Account,_=r(6).Meta,p=r(16).OrderBook,d=r(17).PathFind,y=r(18).RippleError,m=r(9),v=r(11),g=r(9).sjcl;s.inherits(i,n),i.flags={account_root:{PasswordSpent:65536,RequireDestTag:131072,RequireAuth:262144,DisallowXRP:524288,DisableMaster:1048576},offer:{Passive:65536,Sell:131072},state:{LowReserve:65536,HighReserve:131072,LowAuth:262144,HighAuth:524288,LowNoRipple:1048576,HighNoRipple:2097152}},i.from_config=function(t,e){function r(t){var e=v.accounts[t];"object"==typeof e&&e.secret&&(s.set_secret(t,e.secret),s.set_secret(e.account,e.secret))}var n="string"==typeof t?v.servers[t]:t,s=new i(n,e);if("object"==typeof v.accounts)for(var o in v.accounts)r(o);return s},i.create_remote=function(t,e){var r=i.from_config(t);return r.connect(e),r},i.prototype.add_server=function(t){function e(t){n._handle_message(t,s)}function r(){n._connection_count++,n._set_state("online"),(t.primary||!n._primary_server)&&n._set_primary_server(s),n._connection_count===n._servers.length&&n.emit("ready")}function i(){n._connection_count--,n._connection_count||n._set_state("offline")}var n=this,s=new a(this,{host:t.host||t.websocket_ip,port:t.port||t.websocket_port,secure:t.secure||t.websocket_ssl});return s.on("message",e),s.on("connect",r),s.on("disconnect",i),this._servers.push(s),this},i.prototype.server_fatal=function(){this._server_fatal=!0},i.prototype._set_state=function(t){if(this._trace("remote: set_state: %s",t),this.state!==t)switch(this.state=t,this.emit("state",t),t){case"online":this._online_state="open",this._connected=!0,this.emit("connect"),this.emit("connected");break;case"offline":this._online_state="closed",this._connected=!1,this.emit("disconnect"),this.emit("disconnected")}},i.prototype.set_trace=function(t){return this.trace=void 0===t||t,this},i.prototype._trace=function(){this.trace&&m.logObject.apply(m,arguments)},i.prototype.connect=function(t){if(!this._servers.length)throw new Error("No servers available.");switch(typeof t){case"undefined":break;case"function":this.once("connect",t);break;default:if(!Boolean(t))return this.disconnect()}var e=this;return function r(t){var i=e._servers[t];i.connect(),i._sid=++t,t<e._servers.length&&setTimeout(function(){r(t)},e._connection_offset)}(0),this},i.prototype.disconnect=function(){if(!this._servers.length)throw new Error("No servers available, not disconnecting");return this._servers.forEach(function(t){t.disconnect()}),this._set_state("offline"),this},i.prototype._handle_message=function(t,e){var r=this;try{t=JSON.parse(t)}catch(i){}var n="object"!=typeof t||"string"!=typeof t.type;if(n)return this.emit("error",new y("remoteUnexpected","Unexpected response from remote")),void 0;switch(t.type){case"response":break;case"ledgerClosed":this._ledger_time=t.ledger_time,this._ledger_hash=t.ledger_hash,this._ledger_current_index=t.ledger_index+1,this.emit("ledger_closed",t,e);break;case"transaction":var s=t.transaction.hash;if(this._received_tx.hasOwnProperty(s))break;this._received_tx[s]=!0,this._trace("remote: tx: %s",t),t.mmeta=new _(t.meta),t.mmeta.getAffectedAccounts().forEach(function(e){e=r._accounts[e],e&&e.notify(t)}),t.mmeta.getAffectedBooks().forEach(function(e){e=r._books[e],e&&e.notify(t)}),this.emit("transaction",t),this.emit("transaction_all",t);break;case"path_find":this._cur_path_find&&this._cur_path_find.notify_update(t),this.emit("path_find_all",t);break;case"serverStatus":r.emit("server_status",t);var o=t.hasOwnProperty("load_base")&&t.hasOwnProperty("load_factor")&&(t.load_base!==r._load_base||t.load_factor!==r._load_factor);if(o){r._load_base=t.load_base,r._load_factor=t.load_factor;var a={load_base:r._load_base,load_factor:r._load_factor,fee_units:r.fee_tx_unit()};r.emit("load",a),r.emit("load_changed",a)}break;default:this._trace("remote: "+t.type+": %s",t),this.emit("net_"+t.type,t)}},i.prototype.ledger_hash=function(){return this._ledger_hash},i.prototype._set_primary_server=function(t){this._primary_server&&(this._primary_server._primary=!1),this._primary_server=t,this._primary_server._primary=!0},i.prototype._server_is_available=function(t){return t&&t._connected},i.prototype._next_server=function(){for(var t=null,e=0,r=this._servers.length;r>e;e++){var i=this._servers[e];if(this._server_is_available(i)){t=i;break}}return t},i.prototype._get_server=function(){var t;return this._server_is_available(this._primary_server)?t=this._primary_server:(t=this._next_server(),t&&this._set_primary_server(t)),t},i.prototype.request=function(t){if(this._servers.length)if(this._connected)if(null===t.server)t.emit("error",new Error("Server does not exist"));else{var e=t.server||this._get_server();e?e.request(t):t.emit("error",new Error("No servers available"))}else this.once("connect",this.request.bind(this,t));else t.emit("error",new Error("No servers available"))},i.prototype.request_server_info=function(t){return new o(this,"server_info").callback(t)},i.prototype.request_ledger=function(t,e,r){var i=new o(this,"ledger");t&&(i.message.ledger=t);var n=["full","expand","transactions","accounts"];switch(typeof e){case"object":for(var s in e)~n.indexOf(s)&&(i.message[s]=!0);break;case"function":r=e,e=void 0;break;default:this._trace("request_ledger: full parameter is deprecated"),i.message.full=!0}return i.callback(r),i},i.prototype.request_ledger_hash=function(t){return new o(this,"ledger_closed").callback(t)},i.prototype.request_ledger_header=function(t){return new o(this,"ledger_header").callback(t)},i.prototype.request_ledger_current=function(t){return new o(this,"ledger_current").callback(t)},i.prototype.request_ledger_entry=function(t,e){var r=this,i=new o(this,"ledger_entry");return"account_root"===t&&(i.request_default=i.request,i.request=function(){var e=!0;if(!r._ledger_hash&&"account_root"===t){var n=r.ledgers.current.account_root;n||(n=r.ledgers.current.account_root={});var s=r.ledgers.current.account_root[i.message.account_root];if(s)i.emit("success",{node:s}),e=!1;else switch(t){case"account_root":i.once("success",function(t){r.ledgers.current.account_root[t.node.Account]=t.node})}}e&&i.request_default()}),i.callback(e),i},i.prototype.request_subscribe=function(t,e){var r=new o(this,"subscribe");return t&&(r.message.streams=Array.isArray(t)?t:[t]),r.callback(e),r},i.prototype.request_unsubscribe=function(t,e){var r=new o(this,"unsubscribe");return t&&(r.message.streams=Array.isArray(t)?t:[t]),r.callback(e),r},i.prototype.request_transaction=i.prototype.request_transaction_entry=function(t,e,r){var i=new o(this,"transaction_entry");switch(i.tx_hash(t),typeof e){case"string":i.ledger_hash(e);break;default:i.ledger_index("validated"),r=e}return i.callback(r),i},i.prototype.request_tx=function(t,e){var r=new o(this,"tx");return r.message.transaction=t,r.callback(e),r},i.prototype.request_account_info=function(t,e){var r=new o(this,"account_info"),i=h.json_rewrite(t);return r.message.ident=i,r.message.account=i,r.callback(e),r},i.prototype.request_account_currencies=function(t,e){var r=new o(this,"account_currencies"),i=h.json_rewrite(t);return r.message.ident=i,r.message.account=i,r.callback(e),r},i.account_request=function(t,e,r,i,n){if("object"==typeof e){var s=e;n=r,i=s.ledger,r=s.account_index,accoutID=s.accountID}var a=new o(this,t);return a.message.account=h.json_rewrite(e),r&&(a.message.index=r),a.ledger_choose(i),a.callback(n),a},i.prototype.request_account_lines=function(){var t=Array.prototype.slice.call(arguments);return t.unshift("account_lines"),i.account_request.apply(this,t)},i.prototype.request_account_offers=function(){var t=Array.prototype.slice.call(arguments);return t.unshift("account_offers"),i.account_request.apply(this,t)},i.prototype.request_account_tx=function(t,e){var r=new o(this,"account_tx"),i=["account","ledger_index_min","ledger_index_max","binary","count","descending","offset","limit","forward","marker"];for(var n in t)~i.indexOf(n)&&(r.message[n]=t[n]);return r.callback(e),r},i.prototype.request_tx_history=function(t,e){var r=new o(this,"tx_history");return r.message.start=t,r.callback(e),r},i.prototype.request_book_offers=function(t,e,r,i){var n=new o(this,"book_offers");return n.message.taker_gets={currency:u.json_rewrite(t.currency)},"XRP"!==n.message.taker_gets.currency&&(n.message.taker_gets.issuer=h.json_rewrite(t.issuer)),n.message.taker_pays={currency:u.json_rewrite(e.currency)},"XRP"!==n.message.taker_pays.currency&&(n.message.taker_pays.issuer=h.json_rewrite(e.issuer)),n.message.taker=r?r:h.ACCOUNT_ONE,n.callback(i),n},i.prototype.request_wallet_accounts=function(t,e){m.assert(this.trusted);var r=new o(this,"wallet_accounts");return r.message.seed=t,r.callback(e)},i.prototype.request_sign=function(t,e,r){m.assert(this.trusted);var i=new o(this,"sign");return i.message.secret=t,i.message.tx_json=e,i.callback(r),i},i.prototype.request_submit=function(t){return new o(this,"submit").callback(t)},i.prototype._server_prepare_subscribe=function(t){var e=this,r=["ledger","server"];this._transaction_subs&&r.push("transactions");var i=this.request_subscribe(r);return i.once("success",function(t){if(e._stand_alone=!!t.stand_alone,e._testnet=!!t.testnet,"string"==typeof t.random){for(var r=t.random.match(/[0-9A-F]{8}/gi);r&&r.length;)g.random.addEntropy(parseInt(r.pop(),16));e.emit("random",m.hexToArray(t.random))}t.ledger_hash&&t.ledger_index&&(e._ledger_time=t.ledger_time,e._ledger_hash=t.ledger_hash,e._ledger_current_index=t.ledger_index+1,e.emit("ledger_closed",t)),e._load_base=t.load_base||256,e._load_factor=t.load_factor||256,e._fee_ref=t.fee_ref,e._fee_base=t.fee_base,e._reserve_base=t.reserve_base,e._reserve_inc=t.reserve_inc,e.emit("subscribed")}),e.emit("prepare_subscribe",i),i.callback(t),i},i.prototype.ledger_accept=function(t){if(this._stand_alone){var e=new o(this,"ledger_accept");e.request(),e.callback(t)}else this.emit("error",new y("notStandAlone"));return this},i.prototype.request_account_balance=function(t,e,r){"object"==typeof t&&(r=e,e=t.ledger,t=t.account);var i=this.request_ledger_entry("account_root");return i.account_root(t),i.ledger_choose(e),i.once("success",function(t){i.emit("account_balance",c.from_json(t.node.Balance))}),i.callback(r,"account_balance"),i},i.prototype.request_account_flags=function(t,e,r){"object"==typeof t&&(r=e,e=t.ledger,t=t.account);var i=this.request_ledger_entry("account_root");return i.account_root(t),i.ledger_choose(e),i.once("success",function(t){i.emit("account_flags",t.node.Flags)}),i.callback(r,"account_flags"),i},i.prototype.request_owner_count=function(t,e,r){"object"==typeof t&&(r=e,e=t.ledger,t=t.account);var i=this.request_ledger_entry("account_root");return i.account_root(t),i.ledger_choose(e),i.once("success",function(t){i.emit("owner_count",t.node.OwnerCount)}),i.callback(r,"owner_count"),i},i.prototype.get_account=function(t){return this._accounts[h.json_rewrite(t)]},i.prototype.add_account=function(t){var e=new l(this,t);return e.is_valid()&&(this._accounts[t]=e),e},i.prototype.account=function(t){var e=this.get_account(t);return e?e:this.add_account(t)},i.prototype.path_find=function(t,e,r,i){if("object"==typeof t){var n=t;i=n.src_currencies,r=n.dst_amount,e=n.dst_account,t=n.src_account}var s=new d(this,t,e,r,i);return this._cur_path_find&&this._cur_path_find.notify_superceded(),s.create(),this._cur_path_find=s,s},i.prepare_trade=function(t,e){return t+("XRP"===t?"":"/"+e)},i.prototype.book=function(t,e,r,n){if("object"==typeof t){var s=t;n=s.issuer_pays,r=s.currency_pays,e=s.issuer_gets,t=s.currency_gets}var o,a=i.prepare_trade(t,e),c=i.prepare_trade(r,n),u=a+":"+c;return this._books.hasOwnProperty(u)||(o=new p(this,t,e,r,n),o.is_valid()&&(this._books[u]=o)),this._books[u]},i.prototype.account_seq=function(t,e){var r,t=h.json_rewrite(t),i=this.accounts[t];if(i&&i.seq){r=i.seq;var n={ADVANCE:1,REWIND:-1}[e.toUpperCase()]||0;i.seq+=n}return r},i.prototype.set_account_seq=function(t,e){var t=h.json_rewrite(t);this.accounts.hasOwnProperty(t)||(this.accounts[t]={}),this.accounts[t].seq=e},i.prototype.account_seq_cache=function(t,e,r){function i(t){delete o.caching_seq_request;var e=t.node.Sequence;o.seq=e,a.emit("success_account_seq_cache",t)}function n(t){delete o.caching_seq_request,a.emit("error_account_seq_cache",t)}if("object"==typeof t){var s=t;r=e,e=s.ledger,t=s.account}this.accounts.hasOwnProperty(t)||(this.accounts[t]={});var o=this.accounts[t],a=o.caching_seq_request;return a||(a=this.request_ledger_entry("account_root"),a.account_root(t),a.ledger_choose(e),a.once("success",i),a.once("error",n),o.caching_seq_request=a),a.callback(r,"success_account_seq_cache","error_account_seq_cache"),a},i.prototype.dirty_account_root=function(t){var t=h.json_rewrite(t);delete this.ledgers.current.account_root[t]},i.prototype.set_secret=function(t,e){this.secrets[t]=e},i.prototype.request_ripple_balance=function(t,e,r,i,n){if("object"==typeof t){var s=t;n=e,i=s.ledger,r=s.currency,e=s.issuer,t=s.account}var o=this.request_ledger_entry("ripple_state");return o.ripple_state(t,e,r),o.ledger_choose(i),o.once("success",function(r){var i=r.node,n=c.from_json(i.LowLimit),s=c.from_json(i.HighLimit),a=c.from_json(i.Balance),u=h.from_json(t).equals(s.issuer());o.emit("ripple_state",{account_balance:(u?a.negate():a.clone()).parse_issuer(t),peer_balance:(u?a.clone():a.negate()).parse_issuer(e),account_limit:(u?s:n).clone().parse_issuer(e),peer_limit:(u?n:s).clone().parse_issuer(t),account_quality_in:u?i.HighQualityIn:i.LowQualityIn,peer_quality_in:u?i.LowQualityIn:i.HighQualityIn,account_quality_out:u?i.HighQualityOut:i.LowQualityOut,peer_quality_out:u?i.LowQualityOut:i.HighQualityOut})}),o.callback(n,"ripple_state"),o},i.prepare_currencies=function(t){var e={};return t.hasOwnProperty("issuer")&&(e.issuer=h.json_rewrite(t.issuer)),t.hasOwnProperty("currency")&&(e.currency=u.json_rewrite(t.currency)),e},i.prototype.request_ripple_path_find=function(t,e,r,n,s){if("object"==typeof t){var a=t;s=e,n=a.src_currencies,r=a.dst_amount,e=a.dst_account,t=a.src_account}var u=new o(this,"ripple_path_find");return u.message.source_account=h.json_rewrite(t),u.message.destination_account=h.json_rewrite(e),u.message.destination_amount=c.json_rewrite(r),n&&(u.message.source_currencies=n.map(i.prepare_currencies)),u.callback(s),u},i.prototype.request_path_find_create=function(t,e,r,n,s){if("object"==typeof t){var a=t;s=e,n=a.src_currencies,r=a.dst_amount,e=a.dst_account,t=a.src_account}var u=new o(this,"path_find");return u.message.subcommand="create",u.message.source_account=h.json_rewrite(t),u.message.destination_account=h.json_rewrite(e),u.message.destination_amount=c.json_rewrite(r),n&&(u.message.source_currencies=n.map(i.prepare_currencies)),u.callback(s),u},i.prototype.request_path_find_close=function(){var t=new o(this,"path_find");return t.message.subcommand="close",t},i.prototype.request_unl_list=function(t){return new o(this,"unl_list").callback(t)},i.prototype.request_unl_add=function(t,e,r){var i=new o(this,"unl_add");return i.message.node=t,e&&(i.message.comment=note),i.callback(r),i},i.prototype.request_unl_delete=function(t,e){var r=new o(this,"unl_delete");return r.message.node=t,r.callback(e),r},i.prototype.request_peers=function(t){return new o(this,"peers").callback(t)},i.prototype.request_connect=function(t,e,r){var i=new o(this,"connect");return i.message.ip=t,e&&(i.message.port=e),i.callback(r),i},i.prototype.transaction=function(t,e,r,i){var n=new f(this);return arguments.length>=3&&(n=n.payment(t,e,r),"function"==typeof i&&n.submit(i)),n},i.prototype.fee_tx=function(t){var e=this.fee_tx_unit();return c.from_json(String(Math.ceil(t*e)))},i.prototype.fee_tx_unit=function(){var t=this._fee_base/this._fee_ref;return t*=this._load_factor/this._load_base,t*=this.fee_cushion},i.prototype.reserve=function(t){var e=c.from_json(String(this._reserve_base)),r=c.from_json(String(this._reserve_inc)),t=t||0;if(0>t)throw new Error("Owner count must not be negative.");return e.add(r.product_human(t))},i.prototype.ping=function(t,e){var r=new o(this,"ping");switch(typeof t){case"function":e=t;break;case"string":r.set_server(t)}var i=Date.now();return r.once("success",function(){r.emit("pong",Date.now()-i)}),r.callback(e,"pong"),r},e.Remote=i},2:function(t,e,r){function i(){this._value=new o,this._offset=0,this._is_native=!0,this._is_negative=!1,this._currency=new u,this._issuer=new a}var n=r(9),s=n.sjcl;s.bn;var o=n.jsbn.BigInteger,a=r(14).UInt160,c=r(19).Seed,u=r(3).Currency,h=e.consts={currency_xns:0,currency_one:1,xns_precision:6,bi_5:new o("5"),bi_7:new o("7"),bi_10:new o("10"),bi_1e14:new o(String(1e14)),bi_1e16:new o(String(1e16)),bi_1e17:new o(String(1e17)),bi_1e32:new o("100000000000000000000000000000000"),bi_man_max_value:new o("9999999999999999"),bi_man_min_value:new o("1000000000000000"),bi_xns_max:new o("9000000000000000000"),bi_xns_min:new o("-9000000000000000000"),bi_xns_unit:new o("1000000"),cMinOffset:-96,cMaxOffset:80};i.text_full_rewrite=function(t){return i.from_json(t).to_text_full()},i.json_rewrite=function(t){return i.from_json(t).to_json()},i.from_number=function(t){return(new i).parse_number(t)},i.from_json=function(t){return(new i).parse_json(t)},i.from_quality=function(t,e,r){return(new i).parse_quality(t,e,r)},i.from_human=function(t){return(new i).parse_human(t)},i.is_valid=function(t){return i.from_json(t).is_valid()},i.is_valid_full=function(t){return i.from_json(t).is_valid_full()},i.NaN=function(){var t=new i;return t._value=0/0,t},i.prototype.abs=function(){return this.clone(this.is_negative())},i.prototype.add=function(t){var e;if(t=i.from_json(t),this.is_comparable(t))if(t.is_zero())e=this;else if(this.is_zero())e=t.clone(),e._is_native=this._is_native,e._currency=this._currency,e._issuer=this._issuer;else if(this._is_native){e=new i;var r=this._is_negative?this._value.negate():this._value,n=t._is_negative?t._value.negate():t._value,s=r.add(n);e._is_negative=s.compareTo(o.ZERO)<0,e._value=e._is_negative?s.negate():s,e._currency=this._currency,e._issuer=this._issuer}else{for(var r=this._is_negative?this._value.negate():this._value,a=this._offset,n=t._is_negative?t._value.negate():t._value,c=t._offset;c>a;)r=r.divide(h.bi_10),a+=1;for(;a>c;)n=n.divide(h.bi_10),c+=1;e=new i,e._is_native=!1,e._offset=a,e._value=r.add(n),e._is_negative=e._value.compareTo(o.ZERO)<0,e._is_negative&&(e._value=e._value.negate()),e._currency=this._currency,e._issuer=this._issuer,e.canonicalize()}else e=i.NaN();return e},i.prototype.canonicalize=function(){if(this._value instanceof o)if(this._is_native)if(this._value.equals(o.ZERO))this._offset=0,this._is_negative=!1;else{for(;this._offset<0;)this._value=this._value.divide(h.bi_10),this._offset+=1;for(;this._offset>0;)this._value=this._value.multiply(h.bi_10),this._offset-=1}else if(this.is_zero())this._offset=-100,this._is_negative=!1;else{for(;this._value.compareTo(h.bi_man_min_value)<0;)this._value=this._value.multiply(h.bi_10),this._offset-=1;for(;this._value.compareTo(h.bi_man_max_value)>0;)this._value=this._value.divide(h.bi_10),this._offset+=1}else;return this},i.prototype.clone=function(t){return this.copyTo(new i,t)},i.prototype.compareTo=function(t){var e;return this.is_comparable(t)?this._is_negative!==t._is_negative?e=this._is_negative?-1:1:this._value.equals(o.ZERO)?e=t._value.equals(o.ZERO)?0:-1:t._value.equals(o.ZERO)?e=1:!this._is_native&&this._offset>t._offset?e=this._is_negative?-1:1:!this._is_native&&this._offset<t._offset?e=this._is_negative?1:-1:(e=this._value.compareTo(t._value),e>0?e=this._is_negative?-1:1:0>e&&(e=this._is_negative?1:-1)):e=i.NaN(),e},i.prototype.copyTo=function(t,e){return"object"==typeof this._value?this._value.copyTo(t._value):t._value=this._value,t._offset=this._offset,t._is_native=this._is_native,t._is_negative=e?!this._is_negative:this._is_negative,t._currency=this._currency,t._issuer=this._issuer,t.is_zero()&&(t._is_negative=!1),t},i.prototype.currency=function(){return this._currency},i.prototype.equals=function(t,e){if("string"==typeof t)return this.equals(i.from_json(t));var r=!0;return r=!!(this.is_valid()&&t.is_valid()&&this._is_native===t._is_native&&this._value.equals(t._value)&&this._offset===t._offset&&this._is_negative===t._is_negative&&(this._is_native||this._currency.equals(t._currency)&&(e||this._issuer.equals(t._issuer))))},i.prototype.divide=function(t){var e;if(t.is_zero())throw"divide by zero";if(this.is_zero())e=this;else{if(!this.is_valid())throw new Error("Invalid dividend");if(!t.is_valid())throw new Error("Invalid divisor");var r=this;if(r.is_native())for(r=r.clone();r._value.compareTo(h.bi_man_min_value)<0;)r._value=r._value.multiply(h.bi_10),r._offset-=1;var n=t;if(n.is_native())for(n=n.clone();n._value.compareTo(h.bi_man_min_value)<0;)n._value=n._value.multiply(h.bi_10),n._offset-=1;e=new i,e._offset=r._offset-n._offset-17,e._value=r._value.multiply(h.bi_1e17).divide(n._value).add(h.bi_5),e._is_native=r._is_native,e._is_negative=r._is_negative!==n._is_negative,e._currency=r._currency,e._issuer=r._issuer,e.canonicalize()}return e},i.prototype.ratio_human=function(t){t="number"==typeof t&&parseInt(t,10)===t?i.from_json(""+t+".0"):i.from_json(t);var e=this;return t=i.from_json(t),e.is_valid()&&t.is_valid()?(t._is_native&&(e=e.clone(),e._value=e._value.multiply(h.bi_xns_unit),e.canonicalize()),e.divide(t)):i.NaN()},i.prototype.product_human=function(t){if(t="number"==typeof t&&parseInt(t,10)===t?i.from_json(String(t)+".0"):i.from_json(t),!this.is_valid()||!t.is_valid())return i.NaN();var e=this.multiply(t);return t._is_native&&(e._value=e._value.divide(h.bi_xns_unit),e.canonicalize()),e},i.prototype.is_comparable=function(t){return this._value instanceof o&&t._value instanceof o&&this._is_native===t._is_native},i.prototype.is_native=function(){return this._is_native},i.prototype.is_negative=function(){return this._value instanceof o?this._is_negative:!1},i.prototype.is_positive=function(){return!this.is_zero()&&!this.is_negative()},i.prototype.is_valid=function(){return this._value instanceof o},i.prototype.is_valid_full=function(){return this.is_valid()&&this._currency.is_valid()&&this._issuer.is_valid()},i.prototype.is_zero=function(){return this._value instanceof o?this._value.equals(o.ZERO):!1},i.prototype.issuer=function(){return this._issuer},i.prototype.multiply=function(t){var e;if(this.is_zero())e=this;else if(t.is_zero())e=this.clone(),e._value=o.ZERO;else{var r=this._value,n=this._offset,s=t._value,a=t._offset;if(this.is_native())for(;r.compareTo(h.bi_man_min_value)<0;)r=r.multiply(h.bi_10),n-=1;if(t.is_native())for(;s.compareTo(h.bi_man_min_value)<0;)s=s.multiply(h.bi_10),a-=1;e=new i,e._offset=n+a+14,e._value=r.multiply(s).divide(h.bi_1e14).add(h.bi_7),e._is_native=this._is_native,e._is_negative=this._is_negative!==t._is_negative,e._currency=this._currency,e._issuer=this._issuer,e.canonicalize()}return e},i.prototype.negate=function(){return this.clone("NEGATE")},i.prototype.invert=function(){var t=this.clone();return t._value=o.ONE,t._offset=0,t._is_negative=!1,t.canonicalize(),t.ratio_human(this)},i.human_RE=/^\s*([a-z]{3})?\s*(-)?(\d+)(?:\.(\d*))?\s*([a-z]{3})?\s*$/i,i.prototype.parse_human=function(t){var e=String(t).match(i.human_RE);if(e){var r=e[1]||e[5]||"XRP",n=e[3]||"0",s=e[4]||"",a=null;if(r=r.toUpperCase(),this._value=new o(n),this.set_currency(r),"XRP"===r){for(s=s.slice(0,6);s.length<6;)s+="0";this._is_native=!0,this._value=this._value.multiply(h.bi_xns_unit).add(new o(s))}else{s=s.replace(/0+$/,""),a=s.length,this._is_native=!1;var c=h.bi_10.clone().pow(a);this._value=this._value.multiply(c).add(new o(s)),this._offset=-a,this.canonicalize()}this._is_negative=!!e[2]}else this._value=0/0;return this},i.prototype.parse_issuer=function(t){return this._issuer=a.from_json(t),this},i.prototype.parse_quality=function(t,e,r){return this._is_negative=!1,this._value=new o(t.substring(t.length-14),16),this._offset=parseInt(t.substring(t.length-16,t.length-14),16)-100,this._currency=u.from_json(e),this._issuer=a.from_json(r),this._is_native=this._currency.is_native(),this.canonicalize(),this},i.prototype.parse_number=function(t){return this._is_native=!1,this._currency=u.from_json(1),this._issuer=a.from_json(1),this._is_negative=0>t?1:0,this._value=new o(String(this._is_negative?-t:t)),this._offset=0,this.canonicalize(),this},i.prototype.parse_json=function(t){switch(typeof t){case"string":var e=t.match(/^([^/]+)\/(...)(?:\/(.+))?$/);e?(this._currency=u.from_json(e[2]),this._issuer=e[3]?a.from_json(e[3]):a.from_json("1"),this.parse_value(e[1])):(this.parse_native(t),this._currency=u.from_json("0"),this._issuer=a.from_json("0"));break;case"number":this.parse_json(String(t));break;case"object":if(null===t)break;t instanceof i?t.copyTo(this):t.hasOwnProperty("value")&&(this._currency.parse_json(t.currency),"string"==typeof t.issuer&&this._issuer.parse_json(t.issuer),this.parse_value(t.value));break;default:this._value=0/0}return this},i.prototype.parse_native=function(t){var e;if("string"==typeof t&&(e=t.match(/^(-?)(\d*)(\.\d{0,6})?$/)),e){if(void 0===e[3])this._value=new o(e[2]);else{var r=new o(e[2]).multiply(h.bi_xns_unit),i=new o(e[3]).multiply(new o(String(Math.pow(10,1+h.xns_precision-e[3].length))));this._value=r.add(i)}this._is_native=!0,this._offset=0,this._is_negative=!!e[1]&&0!==this._value.compareTo(o.ZERO),this._value.compareTo(h.bi_xns_max)>0&&(this._value=0/0)}else this._value=0/0;return this},i.prototype.parse_value=function(t){switch(this._is_native=!1,typeof t){case"number":this._is_negative=0>t,this._value=new o(Math.abs(t)),this._offset=0,this.canonicalize();break;case"string":var e=t.match(/^(-?)(\d+)$/),r=!e&&t.match(/^(-?)(\d*)\.(\d*)$/),i=!i&&t.match(/^(-?)(\d*)e(-?\d+)$/);if(i)this._value=new o(i[2]),this._offset=parseInt(i[3]),this._is_negative=!!i[1],this.canonicalize();else if(r){var n=new o(r[2]),s=new o(r[3]),a=r[3].length;this._value=n.multiply(h.bi_10.clone().pow(a)).add(s),this._offset=-a,this._is_negative=!!r[1],this.canonicalize()}else e?(this._value=new o(e[2]),this._offset=0,this._is_negative=!!e[1],this.canonicalize()):this._value=0/0;break;default:this._value=t instanceof o?t:0/0}return this},i.prototype.set_currency=function(t){return this._currency=u.from_json(t),this._is_native=this._currency.is_native(),this},i.prototype.set_issuer=function(t){return this._issuer=t instanceof a?t:a.from_json(t),this},i.prototype.subtract=function(t){return this.add(i.from_json(t).negate())},i.prototype.to_number=function(t){var e=this.to_text(t);return"string"==typeof e?Number(e):e},i.prototype.to_text=function(t){var e=0/0;if(this._is_native)this.is_valid()&&this._value.compareTo(h.bi_xns_max)<=0&&(e=this._value.toString());else if(this.is_zero())e="0";else if(this._offset&&(this._offset<-25||this._offset>-4))e=this._value.toString()+"e"+this._offset;else{var r="000000000000000000000000000"+this._value.toString()+"00000000000000000000000",i=r.substring(0,this._offset+43),n=r.substring(this._offset+43),s=i.match(/[1-9].*$/),o=n.match(/[1-9]0*$/);e=""+(s?s[0]:"0")+(o?"."+n.substring(0,1+n.length-o[0].length):"")}return!t&&"number"==typeof e&&isNaN(e)?e="0":this._is_negative&&(e="-"+e),e},i.prototype.to_human=function(t){var t=t||{};if(!this.is_valid())return"";"undefined"==typeof t.signed&&(t.signed=!0),"undefined"==typeof t.group_sep&&(t.group_sep=!0),t.group_width=t.group_width||3;for(var e=this._is_native?h.xns_precision:-this._offset,r=h.bi_10.clone().pow(e),i=this._value.divide(r).toString(),s=this._value.mod(r).toString();s.length<e;)s="0"+s;if(i=i.replace(/^0*/,""),s=s.replace(/0*$/,""),s.length||!t.skip_empty_fraction){if("number"==typeof t.precision&&(0===t.precision&&s.charCodeAt(0)>=53&&(i=(Number(i)+1).toString()),s=s.slice(0,t.precision)),"number"==typeof t.max_sig_digits){var o=0===+i,a=o?0:i.length,c=o?s.replace(/^0*/,""):s;a+=c.length;var u=a-t.max_sig_digits;u=Math.max(u,0),u=Math.min(u,s.length),u>0&&(s=s.slice(0,-u))}if("number"==typeof t.min_precision)for(;s.length<t.min_precision;)s+="0"}t.group_sep&&("string"!=typeof t.group_sep&&(t.group_sep=","),i=n.chunkString(i,t.group_width,!0).join(t.group_sep));var f="";return t.signed&&this._is_negative&&("string"!=typeof t.signed&&(t.signed="-"),f+=t.signed),f+=i.length?i:"0",f+=s.length?"."+s:""},i.prototype.to_human_full=function(t){var t=t||{},e=this.to_human(t),r=this._currency.to_human(),i=this._issuer.to_json(t),n=n=this.is_native?e+"/"+r:e+"/"+r+"/"+i;return n},i.prototype.to_json=function(){var t;if(this._is_native)t=this.to_text();else{var e={value:this.to_text(),currency:this._currency.to_json()};this._issuer.is_valid()&&(e.issuer=this._issuer.to_json()),t=e}return t},i.prototype.to_text_full=function(t){return this._value instanceof o?this._is_native?this.to_human()+"/XRP":this.to_text()+"/"+this._currency.to_json()+"/"+this._issuer.to_json(t):0/0},i.prototype.not_equals_why=function(t,e){var r=!1;if("string"==typeof t)r=this.not_equals_why(i.from_json(t));else if(t instanceof i)if(this.is_valid()&&t.is_valid())if(this._is_native!==t._is_native)r="Native mismatch.";else{var n=this._is_native?"XRP":"Non-XRP";this._value.equals(t._value)&&this._offset===t._offset?this._is_negative!==t._is_negative?r=n+" sign differs.":this._is_native||(this._currency.equals(t._currency)?e||this._issuer.equals(t._issuer)||(r="Non-XRP issuer differs: "+t._issuer.to_json()+"/"+this._issuer.to_json()):r="Non-XRP currency differs."):r=n+" value differs."
}else r="Invalid amount.";else r="Wrong constructor.";return r},e.Amount=i,e.Currency=u,e.Seed=c,e.UInt160=a},3:function(t,e){function r(){this._value=0/0}r.json_rewrite=function(t){return r.from_json(t).to_json()},r.from_json=function(t){return t instanceof r?t.clone():(new r).parse_json(t)},r.from_bytes=function(t){return t instanceof r?t.clone():(new r).parse_bytes(t)},r.is_valid=function(t){return r.from_json(t).is_valid()},r.prototype.clone=function(){return this.copyTo(new r)},r.prototype.copyTo=function(t){return t._value=this._value,t},r.prototype.equals=function(t){var e="string"!=typeof this._value&&isNaN(this._value)||"string"!=typeof t._value&&isNaN(t._value);return e?!1:this._value===t._value},r.prototype.parse_json=function(t){var e=0/0;switch(typeof t){case"string":!t||/^(0|XRP)$/.test(t)?e=0:/^[a-zA-Z0-9]{3}$/.test(t)&&(e=t);break;case"number":isNaN(t)||(e=t);break;case"object":t instanceof r&&(e=t.copyTo({})._value)}return this._value=e,this},r.prototype.parse_bytes=function(t){if(Array.isArray(t)&&20===t.length){for(var e=!0,r=0;20>r;r++)e=e&&(12===r||13===r||14===r||0===t[0]);if(e){var i=String.fromCharCode(t[12])+String.fromCharCode(t[13])+String.fromCharCode(t[14]);this._value=/^[A-Z0-9]{3}$/.test(i)&&"XRP"!==i?i:"\0\0\0"===i?0:0/0}else this._value=0/0}else this._value=0/0;return this},r.prototype.is_native=function(){return!isNaN(this._value)&&!this._value},r.prototype.is_valid=function(){return"string"==typeof this._value||!isNaN(this._value)},r.prototype.to_json=function(){return this._value?this._value:"XRP"},r.prototype.to_human=function(){return this._value?this._value:"XRP"},e.Currency=r},4:function(t,e,r){function i(t){return s.codec.bytes.fromBits(s.hash.sha256.hash(s.codec.bytes.toBits(t)))}function n(t){return i(i(t))}var s=r(9).sjcl,o=r(9),a=r(29),c=o.jsbn.BigInteger,u={},h=u.alphabets={ripple:"rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",tipple:"RPShNAF39wBUDnEGHJKLM4pQrsT7VWXYZ2bcdeCg65jkm8ofqi1tuvaxyz",bitcoin:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"};a(u,{VER_NONE:1,VER_NODE_PUBLIC:28,VER_NODE_PRIVATE:32,VER_ACCOUNT_ID:0,VER_ACCOUNT_PUBLIC:35,VER_ACCOUNT_PRIVATE:34,VER_FAMILY_GENERATOR:41,VER_FAMILY_SEED:33}),u.encode=function(t,e){for(var r=h[e||"ripple"],i=new c(String(r.length)),n=new c,s=new c,o=new c(t),a=[];o.compareTo(c.ZERO)>0;)o.divRemTo(i,n,s),n.copyTo(o),a.push(r[s.intValue()]);for(var u=0;u!==t.length&&!t[u];u+=1)a.push(r[0]);return a.reverse().join("")},u.decode=function(t,e){if("string"!=typeof t)return void 0;var r,i=h[e||"ripple"],n=new c(String(i.length)),s=new c;for(r=0;r!=t.length&&t[r]===i[0];r+=1);for(;r!==t.length;r+=1){var a=i.indexOf(t[r]);if(0>a)return void 0;var u=new c;u.fromInt(a),s=s.multiply(n).add(u)}for(var f=s.toByteArray().map(function(t){return t?0>t?256+t:t:0}),l=0;l!=f.length&&!f[l];)l+=1;l&&(f=f.slice(l));for(var _=0;_!==t.length&&t[_]===i[0];)_+=1;return[].concat(o.arraySet(_,0),f)},u.verify_checksum=function(t){for(var e=n(t.slice(0,-4)).slice(0,4),r=t.slice(-4),i=!0,s=0;4>s;s++)if(e[s]!==r[s]){i=!1;break}return i},u.encode_check=function(t,e,r){var n=[].concat(t,e),s=i(i(n)).slice(0,4);return u.encode([].concat(n,s),r)},u.decode_check=function(t,e,r){var i=u.decode(e,r);if(!i||i.length<5)return 0/0;if("number"==typeof t&&i[0]!==t)return 0/0;if(Array.isArray(t)){for(var n=!1,s=0,o=t.length;o>s;s++)n|=t[s]===i[0];if(!n)return 0/0}return u.verify_checksum(i)?(i[0]=0,new c(i.slice(0,-4),256)):0/0},e.Base=u},5:function(t,e,r){function i(t){n.call(this),this.remote=t,this._secret=void 0,this._build_path=!1,this.tx_json={Flags:0},this.submit_index=void 0,this.state=void 0,this.finalized=!1,this._previous_signing_hash=void 0}var n=r(24).EventEmitter,s=r(25),o=r(9).sjcl,a=r(2).Amount,c=r(2).Currency,u=r(2).UInt160,h=r(19).Seed,f=r(7).SerializedObject,l=r(18).RippleError,_=r(11);s.inherits(i,n),i.fee_units={"default":10},i.flags={AccountSet:{RequireDestTag:65536,OptionalDestTag:131072,RequireAuth:262144,OptionalAuth:524288,DisallowXRP:1048576,AllowXRP:2097152},TrustSet:{SetAuth:65536,NoRipple:131072,ClearNoRipple:262144},OfferCreate:{Passive:65536,ImmediateOrCancel:131072,FillOrKill:262144,Sell:524288},Payment:{NoRippleDirect:65536,PartialPayment:131072,LimitQuality:262144}},i.formats=r(8).tx,i.HASH_TXID=1415073280,i.HASH_SIGN=1398036480,i.HASH_SIGN_TESTNET=1937012736,i.prototype.consts={telLOCAL_ERROR:-399,temMALFORMED:-299,tefFAILURE:-199,terRETRY:-99,tesSUCCESS:0,tecCLAIMED:100},i.from_json=function(t){return(new i).parse_json(t)},i.prototype.isTelLocal=function(t){return t>=this.consts.telLOCAL_ERROR&&t<this.consts.temMALFORMED},i.prototype.isTemMalformed=function(t){return t>=this.consts.temMALFORMED&&t<this.consts.tefFAILURE},i.prototype.isTefFailure=function(t){return t>=this.consts.tefFAILURE&&t<this.consts.terRETRY},i.prototype.isTerRetry=function(t){return t>=this.consts.terRETRY&&t<this.consts.tesSUCCESS},i.prototype.isTepSuccess=function(t){return t>=this.consts.tesSUCCESS},i.prototype.isTecClaimed=function(t){return t>=this.consts.tecCLAIMED},i.prototype.isRejected=function(t){return this.isTelLocal(t)||this.isTemMalformed(t)||this.isTefFailure(t)},i.prototype.set_state=function(t){this.state!==t&&(this.state=t,this.emit("state",t))},i.prototype.get_fee=function(){return i.fees["default"].to_json()},i.prototype.complete=function(){if(this.remote&&"undefined"==typeof this.tx_json.Fee&&(this.remote.local_fee||!this.remote.trusted)&&(this.tx_json.Fee=this.remote.fee_tx(this.fee_units()).to_json()),"undefined"==typeof this.tx_json.SigningPubKey&&(!this.remote||this.remote.local_signing)){var t=h.from_json(this._secret),e=t.get_key(this.tx_json.Account);this.tx_json.SigningPubKey=e.to_hex_pub()}return this.tx_json},i.prototype.serialize=function(){return f.from_json(this.tx_json)},i.prototype.signing_hash=function(){return this.hash(_.testnet?"HASH_SIGN_TESTNET":"HASH_SIGN")},i.prototype.hash=function(t,e){if("string"==typeof t){if("undefined"==typeof i[t])throw new Error("Unknown hashing prefix requested.");t=i[t]}else t||(t=i.HASH_TXID);var r=f.from_json(this.tx_json).hash(t);return e?r:r.to_hex()},i.prototype.sign=function(){var t=h.from_json(this._secret);delete this.tx_json.TxnSignature;var e=this.signing_hash();if(e!==this._previous_signing_hash){var r=t.get_key(this.tx_json.Account),i=r.sign(e,0),n=o.codec.hex.fromBits(i).toUpperCase();this.tx_json.TxnSignature=n,this._previous_signing_hash=e}},i.prototype.build_path=function(t){return this._build_path=t,this},i.prototype.destination_tag=function(t){return void 0!==t&&(this.tx_json.DestinationTag=t),this},i._path_rewrite=function(t){var e=t.map(function(t){var e={};return t.hasOwnProperty("account")&&(e.account=u.json_rewrite(t.account)),t.hasOwnProperty("issuer")&&(e.issuer=u.json_rewrite(t.issuer)),t.hasOwnProperty("currency")&&(e.currency=c.json_rewrite(t.currency)),e});return e},i.prototype.path_add=function(t){return this.tx_json.Paths=this.tx_json.Paths||[],this.tx_json.Paths.push(i._path_rewrite(t)),this},i.prototype.paths=function(t){for(var e=0,r=t.length;r>e;e++)this.path_add(t[e]);return this},i.prototype.secret=function(t){this._secret=t},i.prototype.send_max=function(t){return t&&(this.tx_json.SendMax=a.json_rewrite(t)),this},i.prototype.source_tag=function(t){return t&&(this.tx_json.SourceTag=t),this},i.prototype.transfer_rate=function(t){if(this.tx_json.TransferRate=Number(t),this.tx_json.TransferRate<1e9)throw new Error("invalidTransferRate");return this},i.prototype.set_flags=function(t){if(!t)return this;var e=i.flags[this.tx_json.TransactionType],r=Array.isArray(t)?t:Array.prototype.slice.call(arguments);void 0===this.tx_json.Flags&&(this.tx_json.Flags=0);for(var n=0,s=r.length;s>n;n++){var o=r[n];e.hasOwnProperty(o)&&(this.tx_json.Flags+=e[o])}return this},i.prototype._account_secret=function(t){return this.remote.secrets[t]},i.prototype.account_set=function(t){if("object"==typeof t){var e=t;t=e.source||e.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="AccountSet",this.tx_json.Account=u.json_rewrite(t),this},i.prototype.claim=function(t,e,r,i){if("object"==typeof t){var n=t;i=n.signature,r=n.public_key,e=n.generator,t=n.source||n.from}return this._secret=this._account_secret(t),this.tx_json.TransactionType="Claim",this.tx_json.Generator=e,this.tx_json.PublicKey=r,this.tx_json.Signature=i,this},i.prototype.offer_cancel=function(t,e){if("object"==typeof t){var r=t;e=r.sequence,t=r.source||r.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="OfferCancel",this.tx_json.Account=u.json_rewrite(t),this.tx_json.OfferSequence=Number(e),this},i.prototype.offer_create=function(t,e,r,i,n){if("object"==typeof t){var s=t;n=s.cancel_sequence,i=s.expiration,r=s.taker_gets||s.sell,e=s.taker_pays||s.buy,t=s.source||s.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="OfferCreate",this.tx_json.Account=u.json_rewrite(t),this.tx_json.TakerPays=a.json_rewrite(e),this.tx_json.TakerGets=a.json_rewrite(r),this.remote.local_fee,i&&(this.tx_json.Expiration=i instanceof Date?i.getTime():Number(i)),n&&(this.tx_json.OfferSequence=Number(n)),this},i.prototype.password_fund=function(t,e){if("object"==typeof t){var r=t;e=r.destination||r.to,t=r.source||r.from}if(!u.is_valid(e))throw new Error("Destination address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="PasswordFund",this.tx_json.Destination=u.json_rewrite(e),this},i.prototype.password_set=function(t,e,r,i,n){if("object"==typeof t){var s=t;n=s.signature,i=s.public_key,r=s.generator,e=s.authorized_key,t=s.source||s.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="PasswordSet",this.tx_json.RegularKey=e,this.tx_json.Generator=r,this.tx_json.PublicKey=i,this.tx_json.Signature=n,this},i.prototype.payment=function(t,e,r){if("object"==typeof t){var i=t;r=i.amount,e=i.destination||i.to,t=i.source||i.from}if(!u.is_valid(t))throw new Error("Payment source address invalid");if(!u.is_valid(e))throw new Error("Payment destination address invalid");return/^[\d]+[A-Z]{3}$/.test(r)&&(r=a.from_human(r)),this._secret=this._account_secret(t),this.tx_json.TransactionType="Payment",this.tx_json.Account=u.json_rewrite(t),this.tx_json.Amount=a.json_rewrite(r),this.tx_json.Destination=u.json_rewrite(e),this},i.prototype.ripple_line_set=function(t,e,r,i){if("object"==typeof t){var n=t;i=n.quality_out,r=n.quality_in,e=n.limit,t=n.source||n.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="TrustSet",this.tx_json.Account=u.json_rewrite(t),void 0!==e&&(this.tx_json.LimitAmount=a.json_rewrite(e)),r&&(this.tx_json.QualityIn=r),i&&(this.tx_json.QualityOut=i),this},i.prototype.wallet_add=function(t,e,r,i,n){if("object"==typeof t){var s=t;n=s.signature,i=s.public_key,r=s.authorized_key,e=s.amount,t=s.source||s.from}if(!u.is_valid(t))throw new Error("Source address invalid");return this._secret=this._account_secret(t),this.tx_json.TransactionType="WalletAdd",this.tx_json.Amount=a.json_rewrite(e),this.tx_json.RegularKey=r,this.tx_json.PublicKey=i,this.tx_json.Signature=n,this},i.prototype.fee_units=function(){return i.fee_units["default"]},i.prototype.submit=function(t){function e(t,e){t instanceof l||(t=new l(t,e)),i.callback(t)}function r(t){i.callback(null,t)}var i=this;this.callback="function"==typeof t?t:function(){},this.on("error",function(){}),this.once("error",e),this.once("success",r);var n=this.tx_json.Account;return"string"!=typeof n?this.emit("error",new l("tejInvalidAccount","Account is unspecified")):this.remote.account(n).submit(this),this},i.prototype.abort=function(t){if(!this.finalized){var t="function"==typeof t?t:function(){};this.once("final",t),this.emit("abort")}},i.prototype.parse_json=function(t){return this.tx_json=t,this},e.Transaction=i},6:function(t,e,r){function i(t){var e=this;this.nodes=[],this.node_types=["CreatedNode","ModifiedNode","DeletedNode"];for(var r=0,i=t.AffectedNodes.length;i>r;r++){var s=t.AffectedNodes[r],o={};if(e.node_types.forEach(function(t){s.hasOwnProperty(t)&&(o.diffType=t)}),!o.diffType)return null;s=s[o.diffType],o.entryType=s.LedgerEntryType,o.ledgerIndex=s.LedgerIndex,o.fields=n({},s.PreviousFields,s.NewFields,s.FinalFields),o.fieldsPrev=s.PreviousFields||{},o.fieldsNew=s.NewFields||{},o.fieldsFinal=s.FinalFields||{},this.nodes.push(o)}}var n=r(29),s=r(9),o=r(14).UInt160,a=r(2).Amount;i.prototype.each=function(t){for(var e=0,r=this.nodes.length;r>e;e++)t(this.nodes[e],e)},["forEach","map","filter","every","reduce"].forEach(function(t){i.prototype[t]=function(){return Array.prototype[t].apply(this.nodes,arguments)}});var c=["LowLimit","HighLimit","TakerPays","TakerGets"];i.prototype.getAffectedAccounts=function(){var t=[];return this.nodes.forEach(function(e){var r="CreatedNode"===e.diffType?e.fieldsNew:e.fieldsFinal;for(var i in r){var n=r[i];if("string"==typeof n&&o.is_valid(n))t.push(n);else if(-1!==c.indexOf(i)){var s=a.from_json(n),u=s.issuer();u.is_valid()&&!u.is_zero()&&t.push(u.to_json())}}}),s.arrayUnique(t)},i.prototype.getAffectedBooks=function(){var t=[];return this.nodes.forEach(function(e){if("Offer"===e.entryType){var r=a.from_json(e.fields.TakerGets),i=a.from_json(e.fields.TakerPays),n=r.currency().to_json();"XRP"!==n&&(n+="/"+r.issuer().to_json());var s=i.currency().to_json();"XRP"!==s&&(s+="/"+i.issuer().to_json());var o=n+":"+s;t.push(o)}}),s.arrayUnique(t)},e.Meta=i},7:function(t,e,r){!function(t,r){function i(t){if(Array.isArray(t)||r&&r.isBuffer(t))this.buffer=t;else if("string"==typeof t)this.buffer=o.codec.bytes.fromBits(o.codec.hex.toBits(t));else{if(t)throw new Error("Invalid buffer passed.");this.buffer=[]}this.pointer=0}function n(t){return function(e){var r=this.pointer,i=r+e;if(i>this.buffer.length)throw new Error("Buffer length exceeded");var n=this.buffer.slice(r,i);return t&&(this.pointer=i),n}}var s=t(8),o=t(9).sjcl,a=t(29),c=t(20),u=t(21).UInt256,h=t(26),f={0:"Payment",3:"AccountSet",5:"SetRegularKey",7:"OfferCreate",8:"OfferCancel",9:"Contract",10:"RemoveContract",20:"TrustSet",100:"EnableFeature",101:"SetFee"},l={97:"AccountRoot",99:"Contract",100:"DirectoryNode",102:"Features",103:"GeneratorMap",104:"LedgerHashes",110:"Nickname",111:"Offer",114:"RippleState",115:"FeeSettings"},_={0:"tesSUCCESS",100:"tecCLAIM",101:"tecPATH_PARTIAL",102:"tecUNFUNDED_ADD",103:"tecUNFUNDED_OFFER",104:"tecUNFUNDED_PAYMENT",105:"tecFAILED_PROCESSING",121:"tecDIR_FULL",122:"tecINSUF_RESERVE_LINE",123:"tecINSUF_RESERVE_OFFER",124:"tecNO_DST",125:"tecNO_DST_INSUF_XRP",126:"tecNO_LINE_INSUF_RESERVE",127:"tecNO_LINE_REDUNDANT",128:"tecPATH_DRY",129:"tecUNFUNDED",130:"tecMASTER_DISABLED",131:"tecNO_REGULAR_KEY",132:"tecOWNERS"},p={};Object.keys(s.tx).forEach(function(t){p[t[0]]=t}),i.from_json=function(t){var e,t=a({},t),r=new i;switch(typeof t.TransactionType){case"number":if(t.TransactionType=i.lookup_type_tx(t.TransactionType),!t.TransactionType)throw new Error("Transaction type ID is invalid.");break;case"string":if(e=s.tx[t.TransactionType],!Array.isArray(e))throw new Error("Transaction type is invalid");e=e.slice(),t.TransactionType=e.shift();break;default:throw"undefined"!=typeof t.LedgerEntryType?new Error("Ledger entry binary format not yet implemented."):new Error("Object to be serialized must contain either TransactionType or LedgerEntryType.")}return r.serialize(e,t),r},i.prototype.append=function(t){this.buffer=this.buffer.concat(t),this.pointer+=t.length},i.prototype.resetPointer=function(){this.pointer=0},i.prototype.read=n(!0),i.prototype.peek=n(!1),i.prototype.to_bits=function(){return o.codec.bytes.toBits(this.buffer)},i.prototype.to_hex=function(){return o.codec.hex.fromBits(this.to_bits()).toUpperCase()},i.prototype.to_json=function(){var t=this.pointer;this.resetPointer();for(var e={};this.pointer<this.buffer.length;){var r=c.parse(this),n=r[0],s=r[1];e[n]=i.jsonify_structure(s,n)}return this.pointer=t,e},i.jsonify_structure=function(t,e){var r;switch(typeof t){case"number":switch(e){case"LedgerEntryType":r=l[t]||thing;break;case"TransactionResult":r=_[t]||thing;break;case"TransactionType":r=f[t]||thing;break;default:r=t}break;case"object":if(!t)break;if("function"==typeof t.to_json)r=t.to_json();else{r=new t.constructor;for(var n=Object.keys(t),s=0,o=n.length;o>s;s++){var a=n[s];r[a]=i.jsonify_structure(t[a],a)}}break;default:r=t}return r},i.prototype.serialize=function(t,e){for(var t=i.sort_typedef(t),r=0,n=t.length;n>r;r++)this.serialize_field(t[r],e)},i.prototype.hash=function(t){var e=new i;return c.Int32.serialize(e,t),e.append(this.buffer),e.hash_sha512_half()},i.prototype.signing_hash=i.prototype.hash,i.prototype.hash_sha512_half=function(){var t=o.codec.bytes.toBits(this.buffer),e=o.bitArray.bitSlice(o.hash.sha512.hash(t),0,256);return u.from_hex(o.codec.hex.fromBits(e))},i.prototype.serialize_field=function(t,e){var r=t[0],n=t[1],o=t[2],a=t[3];if("undefined"!=typeof e[r]){this.append(i.get_field_header(a.id,o));try{a.serialize(this,e[r])}catch(c){throw c.message='Error serializing "'+r+'": '+c.message,c}}else if(n===s.REQUIRED)throw new Error("Missing required field "+r)},i.get_field_header=function(t,e){var r=[0];return t>15?r.push(255&t):r[0]+=(15&t)<<4,e>15?r.push(255&e):r[0]+=15&e,r},i.sort_typedef=function(t){function e(t,e){return t[3].id!==e[3].id?t[3].id-e[3].id:t[2]-e[2]}return h(Array.isArray(t)),t.sort(e)},i.lookup_type_tx=function(t){return h("string"==typeof t),p[t]},e.SerializedObject=i}(r,r(22).Buffer)},8:function(t,e,r){var i=r(20),n=e.REQUIRED=0,s=e.OPTIONAL=1,o=e.DEFAULT=2;i.Int16.id=1,i.Int32.id=2,i.Int64.id=3,i.Hash128.id=4,i.Hash256.id=5,i.Amount.id=6,i.VariableLength.id=7,i.Account.id=8,i.Object.id=14,i.Array.id=15,i.Int8.id=16,i.Hash160.id=17,i.PathSet.id=18,i.Vector256.id=19;var a=[["TransactionType",n,2,i.Int16],["Flags",s,2,i.Int32],["SourceTag",s,3,i.Int32],["Account",n,1,i.Account],["Sequence",n,4,i.Int32],["Fee",n,8,i.Amount],["OperationLimit",s,29,i.Int32],["SigningPubKey",n,3,i.VariableLength],["TxnSignature",s,4,i.VariableLength]];e.tx={AccountSet:[3].concat(a,[["EmailHash",s,1,i.Hash128],["WalletLocator",s,7,i.Hash256],["WalletSize",s,12,i.Int32],["MessageKey",s,2,i.VariableLength],["Domain",s,7,i.VariableLength],["TransferRate",s,11,i.Int32]]),TrustSet:[20].concat(a,[["LimitAmount",s,3,i.Amount],["QualityIn",s,20,i.Int32],["QualityOut",s,21,i.Int32]]),OfferCreate:[7].concat(a,[["TakerPays",n,4,i.Amount],["TakerGets",n,5,i.Amount],["Expiration",s,10,i.Int32]]),OfferCancel:[8].concat(a,[["OfferSequence",n,25,i.Int32]]),SetRegularKey:[5].concat(a,[["RegularKey",n,8,i.Account]]),Payment:[0].concat(a,[["Destination",n,3,i.Account],["Amount",n,1,i.Amount],["SendMax",s,9,i.Amount],["Paths",o,1,i.PathSet],["InvoiceID",s,17,i.Hash256],["DestinationTag",s,14,i.Int32]]),Contract:[9].concat(a,[["Expiration",n,10,i.Int32],["BondAmount",n,23,i.Int32],["StampEscrow",n,22,i.Int32],["RippleEscrow",n,17,i.Amount],["CreateCode",s,11,i.VariableLength],["FundCode",s,8,i.VariableLength],["RemoveCode",s,9,i.VariableLength],["ExpireCode",s,10,i.VariableLength]]),RemoveContract:[10].concat(a,[["Target",n,7,i.Account]]),EnableFeature:[100].concat(a,[["Feature",n,19,i.Hash256]]),SetFee:[101].concat(a,[["Features",n,9,i.Array],["BaseFee",n,5,i.Int64],["ReferenceFeeUnits",n,30,i.Int32],["ReserveBase",n,31,i.Int32],["ReserveIncrement",n,32,i.Int32]])}},9:function(t,e,r){var e=t.exports=r(12);e.logObject=function(t,e){/MSIE/.test(navigator.userAgent)?console.log(t,JSON.stringify(e)):console.log(t,"",e)}},10:function(t,e,r){function i(t,e){if(n.call(this),"object"!=typeof e)throw new Error("Invalid server configuration.");var r=this;this._remote=t,this._opts=e,this._host=e.host,this._port=e.port,this._secure="boolean"==typeof e.secure?e.secure:!0,this._ws=void 0,this._connected=!1,this._should_connect=!1,this._state=void 0,this._id=0,this._retry=0,this._requests={},this._opts.url=(e.secure?"wss://":"ws://")+e.host+":"+e.port,this.on("message",function(t){r._handle_message(t)}),this.on("response_subscribe",function(t){r._handle_response_subscribe(t)})}var n=r(24).EventEmitter,s=r(25),o=r(9);s.inherits(i,n),i.online_states=["syncing","tracking","proposing","validating","full"],i.prototype._is_online=function(t){return-1!==i.online_states.indexOf(t)},i.prototype._set_state=function(t){if(t!==this._state)switch(this._state=t,this.emit("state",t),t){case"online":this._connected=!0,this.emit("connect");break;case"offline":this._connected=!1,this.emit("disconnect")}},i.prototype._trace=function(){this._remote.trace&&o.logObject.apply(o,arguments)},i.prototype._remote_address=function(){try{var t=this._ws._socket.remoteAddress}catch(e){}return t},i.prototype.websocket_constructor=function(){return r(23)},i.prototype.connect=function(){function t(){e.emit("socket_close"),e._set_state("offline"),i.onopen=i.onerror=i.onclose=i.onmessage=function(){},e._should_connect&&(e._retry+=1,e._retry_timer=setTimeout(function(){e._trace("server: retry"),e._should_connect&&e.connect()},e._retry<40?50:e._retry<100?1e3:e._retry<160?1e4:3e4))}var e=this;if(!this._connected){this._trace("server: connect: %s",this._opts.url),this._ws&&this._ws.close();var r=this.websocket_constructor(),i=this._ws=new r(this._opts.url);this._should_connect=!0,e.emit("connecting"),i.onopen=function(){if(i===e._ws){e.emit("socket_open");var t=e._remote._server_prepare_subscribe();e.request(t)}},i.onerror=function(r){i===e._ws&&(e._trace("server: onerror: %s",r.data||r),t())},i.onclose=function(){i===e._ws&&(e._trace("server: onclose: %s",i.readyState),t())},i.onmessage=function(t){e.emit("before_message_for_non_mutators",t.data),e.emit("message",t.data)}}},i.prototype.disconnect=function(){this._should_connect=!1,this._set_state("offline"),this._ws&&this._ws.close()},i.prototype.send_message=function(t){this._ws&&(this.emit("before_send_message_for_non_mutators",t),this._ws.send(JSON.stringify(t)))},i.prototype.request=function(t){function e(){r._trace("server: request: %s",t.message),r.send_message(t.message)}var r=this;if(this._ws){t.server=this,t.message.id=this._id,this._requests[t.message.id]=t,this._id++;var i=this._connected||"subscribe"===t.message.command&&1===this._ws.readyState;i?(this._trace("server: request: %s",t.message),this.send_message(t.message)):this.once("connect",e)}else this._trace("server: request: DROPPING: %s",t.message)},i.prototype._handle_message=function(t){var e=this;try{t=JSON.parse(t)}catch(r){}var i="object"!=typeof t||"string"!=typeof t.type;if(!i)switch(t.type){case"response":var n=e._requests[t.id];delete e._requests[t.id],n?"success"===t.status?(this._trace("server: response: %s",t),n.emit("success",t.result),[e,e._remote].forEach(function(e){e.emit("response_"+n.message.command,t.result,n,t)})):t.error&&(this._trace("server: error: %s",t),n.emit("error",{error:"remoteError",error_message:"Remote reported an error.",remote:t})):this._trace("server: UNEXPECTED: %s",t);break;case"path_find":e._remote.trace&&o.logObject("server: path_find: %s",t);break;case"serverStatus":this._set_state(this._is_online(t.server_status)?"online":"offline")}},i.prototype._handle_response_subscribe=function(t){this._server_status=t.server_status,this._is_online(t.server_status)&&this._set_state("online")},e.Server=i},11:function(t,e,r){var i=r(29),n=t.exports={load:function(t){return i(n,t),n}}},12:function(t,e,r){function i(t,e){return function(){console.log("%s: %s",i,arguments.toString),e(arguments)}}function n(t,e){for(var r=new Array(t),i=0;t>i;i++)r[i]=e;return r}function s(t){var e=[],r=0;for(t.length%2&&(e.push(String.fromCharCode(parseInt(t.substring(0,1),16))),r=1);r<t.length;r+=2)e.push(String.fromCharCode(parseInt(t.substring(r,r+2),16)));return e.join("")}function o(t){for(var e="",r=0;r<t.length;r++){var i=t.charCodeAt(r);e+=16>i?"0"+i.toString(16):i.toString(16)}return e}function a(t){for(var e=new Array(t.length),r=0;r<e.length;r+=1)e[r]=t.charCodeAt(r);return e}function c(t){return a(s(t))}function u(t,e,r){var i=[],n=0,s=t.length;for(r&&(n=t.length%e,n&&i.push(t.slice(0,n)));s>n;n+=e)i.push(t.slice(n,e+n));return i}function h(t,e){console.log(t,JSON.stringify(e,null,2))}function f(t,e){if(!t)throw new Error("Assertion failed"+(e?": "+e:"."))}function l(t){for(var e={},r=[],i=0,n=t.length;n>i;i++){var s=t[i];e[s]||(r.push(s),e[s]=!0)}return r}function _(t){return 1e3*(t+946684800)}Function.prototype.method=function(t,e){return this.prototype[t]=e,this},e.trace=i,e.arraySet=n,e.hexToString=s,e.hexToArray=c,e.stringToArray=a,e.stringToHex=o,e.chunkString=u,e.logObject=h,e.assert=f,e.arrayUnique=l,e.toTimestamp=_,e.sjcl=r(27),e.jsbn=r(28)},13:function(t,e,r){function i(t,e){n.call(this),this.remote=t,this.requested=!1,this.message={command:e,id:void 0}}var n=r(24).EventEmitter,s=r(25),o=r(14).UInt160,a=r(3).Currency;r(5).Transaction,r(15).Account,r(6).Meta,r(16).OrderBook;var c=r(18).RippleError;s.inherits(i,n),i.prototype.broadcast=function(){return this._broadcast=!0,this.request()},i.prototype.request=function(t){return this.requested?void 0:(this.requested=!0,this.on("error",new Function),this.emit("request",t),this._broadcast?this.remote._servers.forEach(function(t){this.set_server(t),this.remote.request(this)},this):this.remote.request(this),this)},i.prototype.callback=function(t,e,r){function i(e){t.call(s,null,e)}function n(e){e instanceof c||(e=new c(e)),t.call(s,e)}if(t&&"function"==typeof t){var s=this;this.once(e||"success",i),this.once(r||"error",n),this.request()}return this},i.prototype.timeout=function(t,e){function r(){i.timeout(t,e)}var i=this;if(!this.requested)return this.once("request",r),void 0;var n=this.emit,s=!1,o=setTimeout(function(){s=!0,"function"==typeof e&&e(),n.call(i,"timeout")},t);return this.emit=function(){s||(clearTimeout(o),n.apply(i,arguments))},this},i.prototype.set_server=function(t){var e=null;switch(typeof t){case"object":e=t;break;case"string":for(var r,i=0;r=this.remote._servers[i];i++)if(r._host===t){e=r;break}}this.server=e},i.prototype.build_path=function(t){return t&&(this.message.build_path=!0),this},i.prototype.ledger_choose=function(t){return t?this.message.ledger_index=this.remote._ledger_current_index:this.message.ledger_hash=this.remote._ledger_hash,this},i.prototype.ledger_hash=function(t){return this.message.ledger_hash=t,this},i.prototype.ledger_index=function(t){return this.message.ledger_index=t,this},i.prototype.ledger_select=function(t){switch(t){case"current":case"closed":case"verified":this.message.ledger_index=t;break;default:Number(t)?this.message.ledger_index=t:this.message.ledger_hash=t}return this},i.prototype.account_root=function(t){return this.message.account_root=o.json_rewrite(t),this},i.prototype.index=function(t){return this.message.index=t,this},i.prototype.offer_id=function(t,e){return this.message.offer={account:o.json_rewrite(t),seq:e},this},i.prototype.offer_index=function(t){return this.message.offer=t,this},i.prototype.secret=function(t){return t&&(this.message.secret=t),this},i.prototype.tx_hash=function(t){return this.message.tx_hash=t,this},i.prototype.tx_json=function(t){return this.message.tx_json=t,this},i.prototype.tx_blob=function(t){return this.message.tx_blob=t,this},i.prototype.ripple_state=function(t,e,r){return this.message.ripple_state={currency:r,accounts:[o.json_rewrite(t),o.json_rewrite(e)]},this},i.prototype.accounts=function(t,e){Array.isArray(t)||(t=[t]);var r=t.map(function(t){return o.json_rewrite(t)});return e?this.message.rt_accounts=r:this.message.accounts=r,this},i.prototype.add_account=function(t,e){var r=o.json_rewrite(t);return e?this.message.rt_accounts=(this.message.rt_accounts||[]).concat(r):this.message.accounts=(this.message.accounts||[]).concat(r),this},i.prototype.rt_accounts=function(t){return this.accounts(t,!0)},i.prototype.books=function(t,e){function r(t){if(!c[t])throw new Error("Missing "+t);var e=u[t]={currency:a.json_rewrite(c[t].currency)};"XRP"!==e.currency&&(e.issuer=o.json_rewrite(c[t].issuer))}for(var i=[],n=0,s=t.length;s>n;n++){var c=t[n],u={};r("taker_gets"),r("taker_pays"),e&&(u.snapshot=!0),c.both&&(u.both=!0),i.push(u)}return this.message.books=i,this},e.Request=i},14:function(t,e,r){r(9).sjcl;var i=r(9),n=r(11),s=r(29),o=i.jsbn.BigInteger,a=r(30).UInt,c=r(4).Base,u=s(function(){this._value=0/0},a);u.width=20,u.prototype=s({},a.prototype),u.prototype.constructor=u,u.ACCOUNT_ZERO="rrrrrrrrrrrrrrrrrrrrrhoLvTp",u.ACCOUNT_ONE="rrrrrrrrrrrrrrrrrrrrBZbvji";var h=u.HEX_ZERO="0000000000000000000000000000000000000000",f=u.HEX_ONE="0000000000000000000000000000000000000001";u.STR_ZERO=i.hexToString(h),u.STR_ONE=i.hexToString(f),u.prototype.parse_json=function(t){return n.accounts&&t in n.accounts&&(t=n.accounts[t].account),this._value="number"!=typeof t||isNaN(t)?"string"!=typeof t?0/0:"r"===t[0]?c.decode_check(c.VER_ACCOUNT_ID,t):0/0:new o(String(t)),this},u.prototype.to_json=function(t){var t=t||{},e=0/0;return this._value instanceof o&&(e=c.encode_check(c.VER_ACCOUNT_ID,this.to_bytes()),t.gateways&&e in t.gateways&&(e=t.gateways[e])),e},e.UInt160=u},15:function(t,e,r){function i(t,e){function r(t){~i.subscribe_events.indexOf(t)&&(!h._subs&&h._remote._connected&&h._remote.request_subscribe().add_account(h._account_id).broadcast(),h._subs+=1)}function s(t){~i.subscribe_events.indexOf(t)&&(h._subs-=1,!h._subs&&h._remote._connected&&h._remote.request_unsubscribe().add_account(h._account_id).broadcast())}function c(t){h._account.is_valid()&&h._subs&&t.add_account(h._account_id)}function u(t){var e=!1;t.mmeta.each(function(t){var r="AccountRoot"===t.entryType&&t.fields.Account===h._account_id;r&&(o(h._entry,t.fieldsNew,t.fieldsFinal),e=!0)}),e&&h.emit("entry",h._entry)}n.call(this);var h=this;return this._remote=t,this._account=a.from_json(e),this._account_id=this._account.to_json(),this._subs=0,this._entry={},this.on("newListener",r),this.on("removeListener",s),this._remote.on("prepare_subscribe",c),this.on("transaction",u),this}var n=r(24).EventEmitter,s=r(25),o=r(29);r(2).Amount;var a=r(14).UInt160,c=r(31).TransactionManager;s.inherits(i,n),i.subscribe_events=["transaction","entry"],i.prototype.to_json=function(){return this._account.to_json()},i.prototype.is_valid=function(){return this._account.is_valid()},i.prototype.get_info=function(t){var t="function"==typeof t?t:function(){},e=this._remote.request_account_info(this._account_id,t);return e},i.prototype.entry=function(t){var e=this,t="function"==typeof t?t:function(){};return this.get_info(function(r,i){r?t(r):(o(e._entry,i.account_data),e.emit("entry",e._entry),t(null,i))}),this},i.prototype.get_next_sequence=function(t){var t="function"==typeof t?t:function(){};return this.get_info(function(e,r){e?t(e):t(null,r.account_data.Sequence)}),this},i.prototype.lines=function(t){function e(e,i){e?t(e):(r._lines=i.lines,r.emit("lines",r._lines),t(null,i))}var r=this,t="function"==typeof t?t:function(){};return this._remote.request_account_lines(this._account_id,e),this},i.prototype.notify=i.prototype.notifyTx=function(t){if(this._subs){this.emit("transaction",t);var e=t.transaction.Account;if(!e)return;e===this._account_id?this.emit("transaction-outbound",t):this.emit("transaction-inbound",t)}},i.prototype.submit=function(t){this._tx_manager||(this._tx_manager=new c(this)),this._tx_manager.submit(t)},e.Account=i},16:function(t,e,r){function i(t,e,r,s,o){n.call(this);var a=this;return this._remote=t,this._currency_gets=e,this._issuer_gets=r,this._currency_pays=s,this._issuer_pays=o,this._subs=0,this._sync=!1,this._offers=[],this.on("newListener",function(t){~i.subscribe_events.indexOf(t)&&(!a._subs&&a._remote._connected&&a._subscribe(),a._subs+=1)}),this.on("removeListener",function(t){~i.subscribe_events.indexOf(t)&&(a._subs-=1,!a._subs&&a._remote._connected&&(a._sync=!1,a._remote.request_unsubscribe().books([a.to_json()]).request()))
}),this._remote.on("connect",function(){a._subs&&a._subscribe()}),this._remote.on("disconnect",function(){a._sync=!1}),this}var n=r(24).EventEmitter,s=r(25),o=r(29),a=r(2).Amount,c=r(14).UInt160,u=r(3).Currency;s.inherits(i,n),i.subscribe_events=["transaction","model","trade"],i.prototype._subscribe=function(){var t=this,e=t._remote.request_subscribe();e.books([t.to_json()],!0),e.callback(function(e,r){e||(t._sync=!0,t._offers=r.offers,t.emit("model",t._offers))})},i.prototype.to_json=function(){var t={taker_gets:{currency:this._currency_gets},taker_pays:{currency:this._currency_pays}};return"XRP"!==this._currency_gets&&(t.taker_gets.issuer=this._issuer_gets),"XRP"!==this._currency_pays&&(t.taker_pays.issuer=this._issuer_pays),t},i.prototype.is_valid=function(){return u.is_valid(this._currency_pays)&&("XRP"===this._currency_pays||c.is_valid(this._issuer_pays))&&u.is_valid(this._currency_gets)&&("XRP"===this._currency_gets||c.is_valid(this._issuer_gets))&&!("XRP"===this._currency_pays&&"XRP"===this._currency_gets)},i.prototype.trade=function(t){var e="0"+("XRP"===this["_currency_"+t]?"":"/"+this["_currency_"+t]+"/"+this["_issuer_"+t]);return a.from_json(e)},i.prototype.notify=i.prototype.notifyTx=function(t){var e=this,r=!1,i=this.trade("gets"),n=this.trade("pays");t.mmeta.each(function(s){if("Offer"===s.entryType){var c,u,h;switch(s.diffType){case"DeletedNode":case"ModifiedNode":var f="DeletedNode"===s.diffType;for(c=0,u=e._offers.length;u>c;c++)if(h=e._offers[c],h.index===s.ledgerIndex){f?e._offers.splice(c,1):o(h,s.fieldsFinal),r=!0;break}if("OfferCancel"===t.transaction.TransactionType)return;i=i.add(s.fieldsPrev.TakerGets),n=n.add(s.fieldsPrev.TakerPays),f||(i=i.subtract(s.fieldsFinal.TakerGets),n=n.subtract(s.fieldsFinal.TakerPays));break;case"CreatedNode":var l=a.from_json(s.fields.TakerPays).ratio_human(s.fields.TakerGets);for(c=0,u=e._offers.length;u>c;c++){h=e._offers[c];var _=a.from_json(h.TakerPays).ratio_human(h.TakerGets);if(l.compareTo(_)<=0){var p=s.fields;p.index=s.ledgerIndex,e._offers.splice(c,0,s.fields),r=!0;break}}}}}),this._subs&&(this.emit("transaction",t),r&&this.emit("model",this._offers),i.is_zero()||this.emit("trade",n,i))},i.prototype.offers=function(t){return"function"==typeof t&&(this._sync?t(this._offers):this.once("model",t)),this},i.prototype.offersSync=function(){return this._offers},e.OrderBook=i},17:function(t,e,r){function i(t,e,r,i,s){n.call(this),this.remote=t,this.src_account=e,this.dst_account=r,this.dst_amount=i,this.src_currencies=s}var n=r(24).EventEmitter,s=r(25),o=r(2).Amount;r(29),s.inherits(i,n),i.prototype.create=function(){function t(t,r){t?e.emit("error",t):e.notify_update(r)}var e=this,r=this.remote.request_path_find_create(this.src_account,this.dst_account,this.dst_amount,this.src_currencies,t);r.request()},i.prototype.close=function(){this.remote.request_path_find_close().request(),this.emit("end"),this.emit("close")},i.prototype.notify_update=function(t){var e=t.source_account,r=t.destination_account,i=o.from_json(t.destination_amount);this.src_account===e&&this.dst_account===r&&this.dst_amount.equals(i)&&this.emit("update",t)},i.prototype.notify_superceded=function(){this.emit("end"),this.emit("superceded")},e.PathFind=i},18:function(t,e,r){function i(t,e){switch(typeof t){case"object":s(this,t);break;case"string":this.result=t,this.result_message=e}this.result=this.result||this.engine_result||this.error||"Error",this.result_message=this.result_message||this.engine_result_message||this.error_message||"Error",this.message=this.result_message;var r;Error.captureStackTrace?Error.captureStackTrace(this,t||this):(r=(new Error).stack)&&(this.stack=r)}var n=r(25),s=r(29);n.inherits(i,Error),i.prototype.name="RippleError",e.RippleError=i},19:function(t,e,r){function i(t,e){return[].concat(t,e>>24,255&e>>16,255&e>>8,255&e)}function n(t){return o.bitArray.bitSlice(o.hash.sha512.hash(o.codec.bytes.toBits(t)),0,256)}var s=r(9),o=s.sjcl,a=r(29),c=s.jsbn.BigInteger,u=r(4).Base,h=r(30).UInt;r(21).UInt256;var f=r(32).KeyPair,l=a(function(){this._curve=o.ecc.curves.c256,this._value=0/0},h);l.width=16,l.prototype=a({},h.prototype),l.prototype.constructor=l,l.prototype.parse_json=function(t){return"string"==typeof t?t.length?"s"===t[0]?this._value=u.decode_check(u.VER_FAMILY_SEED,t):32===t.length?this._value=this.parse_hex(t):this.parse_passphrase(t):this._value=0/0:this._value=0/0,this},l.prototype.parse_passphrase=function(t){if("string"!=typeof t)throw new Error("Passphrase must be a string");var e=o.hash.sha512.hash(o.codec.utf8String.toBits(t)),r=o.bitArray.bitSlice(e,0,128);return this.parse_bits(r),this},l.prototype.to_json=function(){if(!(this._value instanceof c))return 0/0;var t=u.encode_check(u.VER_FAMILY_SEED,this.to_bytes());return t},l.prototype.get_key=function(){if(!this.is_valid())throw new Error("Cannot generate keys from invalid seed!");var t,e,r=this._curve,s=0,a=0;do t=o.bn.fromBits(n(i(this.to_bytes(),a))),a++;while(!r.r.greaterEquals(t));e=r.G.mult(t);var c;a=0;do c=o.bn.fromBits(n(i(i(e.toBytesCompressed(),s),a))),a++;while(!r.r.greaterEquals(c));return c=c.add(t).mod(r.r),f.from_bn_secret(c)},e.Seed=l},20:function(t,e,r){function i(t){return"number"==typeof t&&isFinite(t)}function n(t){return"string"==typeof t}function s(t){return n(t)&&/^[0-9A-F]{0,16}$/i.test(t)}function o(t){return n(t)&&/^[A-Z]{3}$/.test(t)}function a(t){return t instanceof S}function c(t,e,r){var i=T.fromBits(k.toBits(e));r||A.serialize_varint(t,i.length),t.append(i)}function u(t){return m.codec.hex.fromBits(m.codec.bytes.toBits(t)).toUpperCase()}function h(t,e,r){if(!i(e))throw new Error("Value is not a number");if(0>e||e>=Math.pow(256,r))throw new Error("Value out of bounds");for(var n=[],s=0;r>s;s++)n.unshift(255&e>>>8*s);t.append(n)}function f(t,e){for(var r=0,i=0;e>i;i++)r+=t.read(1)[0]<<8*(e-i-1);return r}function l(t,e,r){var i=G[e],n=i[0],s=i[1],o=(16>n?n<<4:0)|(16>s?s:0);j.serialize(t,o),n>=16&&j.serialize(t,n),s>=16&&j.serialize(t,s);var a=V[n];a.serialize(t,r)}function _(t){var e=t.read(1)[0],r=e>>4;0===r&&(r=t.read(1)[0]);var i=V[r];p(i,"Unknown type: "+r);var n=15&e,s=s=0===n?H[r][t.read(1)[0]]:H[r][n];return p(s,"Unknown field: "+e),[s,i.parse(t)]}var p=r(26),d=r(29),y=r(9),m=y.sjcl,v=r(33).UInt128,g=r(14).UInt160,b=r(21).UInt256,w=r(2),E=w.Amount,x=w.Currency,k=m.codec.hex,T=m.codec.bytes,S=y.jsbn.BigInteger,A=function(t){d(this,t)};A.serialize_varint=function(t,e){if(0>e)throw new Error("Variable integers are unsigned.");if(192>=e)t.append([e]);else if(12480>=e)e-=193,t.append([193+(e>>>8),255&e]);else{if(!(918744>=e))throw new Error("Variable integer overflow.");e-=12481,t.append([241+(e>>>16),255&e>>>8,255&e])}},A.prototype.parse_varint=function(t){var e,r,i,n=t.read(1)[0];if(n>254)throw new Error("Invalid varint length indicator");return 192>=n?i=n:240>=n?(e=t.read(1)[0],i=193+256*(n-193)+e):254>=n&&(e=t.read(1)[0],r=t.read(1)[0],i=12481+65536*(n-241)+256*e+r),i};var j=e.Int8=new A({serialize:function(t,e){h(t,e,1)},parse:function(t){return f(t,1)}}),B=e.Int16=new A({serialize:function(t,e){h(t,e,2)},parse:function(t){return f(t,2)}}),q=e.Int32=new A({serialize:function(t,e){h(t,e,4)},parse:function(t){return f(t,4)}}),I=e.Int64=new A({serialize:function(t,e){var r;if(i(e)){if(e=Math.floor(e),0>e)throw new Error("Negative value for unsigned Int64 is invalid.");r=new S(String(e),10)}else if(n(e)){if(!s(e))throw new Error("Not a valid hex Int64.");r=new S(e,16)}else{if(!a(e))throw new Error("Invalid type for Int64");if(e.compareTo(S.ZERO)<0)throw new Error("Negative value for unsigned Int64 is invalid.");r=e}var o=r.toString(16);if(o.length>16)throw new Error("Int64 is too large");for(;o.length<16;)o="0"+o;return c(t,o,!0)},parse:function(t){var e=f(t,4),r=f(t,4),i=new S(String(e));return i.shiftLeft(32),i.add(r),i}}),R=e.Hash128=new A({serialize:function(t,e){var r=v.from_json(e);if(!r.is_valid())throw new Error("Invalid Hash128");c(t,r.to_hex(),!0)},parse:function(t){return v.from_bytes(t.read(16))}}),D=e.Hash256=new A({serialize:function(t,e){var r=b.from_json(e);if(!r.is_valid())throw new Error("Invalid Hash256");c(t,r.to_hex(),!0)},parse:function(t){return b.from_bytes(t.read(32))}}),O=e.Hash160=new A({serialize:function(t,e){var r=g.from_json(e);if(!r.is_valid())throw new Error("Invalid Hash160");c(t,r.to_hex(),!0)},parse:function(t){return g.from_bytes(t.read(20))}}),M=new A({serialize:function(t,e){var r=e.to_json().toUpperCase();if(!o(r))throw new Error("Tried to serialize invalid/unimplemented currency type.");if("XRP"===r)c(t,g.HEX_ZERO,!0);else{var i=r.toUpperCase(),n=y.arraySet(20,0);n[12]=255&i.charCodeAt(0),n[13]=255&i.charCodeAt(1),n[14]=255&i.charCodeAt(2),t.append(n)}},parse:function(t){var e=t.read(20),r=x.from_bytes(e);return r}}),L=e.Amount=new A({serialize:function(t,e){var r=E.from_json(e);if(!r.is_valid())throw new Error("Not a valid Amount object.");var i=y.arraySet(8,0);if(r.is_native()){var n=r._value.toString(16);if(n.length>16)throw new Error("Value out of bounds");for(;n.length<16;)n="0"+n;i=T.fromBits(k.toBits(n)),i[0]&=63,r.is_negative()||(i[0]|=64)}else{var s=0,o=0;s|=1<<31,r.is_zero()||(r.is_negative()||(s|=1<<30),s|=(255&97+r._offset)<<22,s|=4194303&r._value.shiftRight(32).intValue(),o=4294967295&r._value.intValue()),i=m.codec.bytes.fromBits([s,o])}if(t.append(i),!r.is_native()){var a=r.currency();M.serialize(t,a),t.append(r.issuer().to_bytes())}},parse:function(t){for(var e=new E,r=t.read(8),i=!(127&r[0]),n=1;8>n;n++)i=i&&!r[n];if(128&r[0]){var s=M.parse(t),o=t.read(20),a=g.from_bytes(o),c=((63&r[0])<<2)+(r[1]>>>6)-97,u=r.slice(1);u[0]&=63;var h=new S(u,256);if(h.equals(S.ZERO)&&!i)throw new Error("Invalid zero representation");e._value=h,e._offset=c,e._currency=s,e._issuer=a,e._is_native=!1}else{var f=r.slice();f[0]&=63,e._value=new S(f,256),e._is_native=!0}return e._is_negative=!(i||64&r[0]),e}}),C=e.VariableLength=new A({serialize:function(t,e){if("string"!=typeof e)throw new Error("Unknown datatype.");c(t,e)},parse:function(t){var e=this.parse_varint(t);return u(t.read(e))}}),N=e.Account=new A({serialize:function(t,e){var r=g.from_json(e);if(!r.is_valid())throw new Error("Invalid account!");c(t,r.to_hex())},parse:function(t){var e=this.parse_varint(t);if(20!==e)throw new Error("Non-standard-length account ID");var r=g.from_bytes(t.read(e));return r}}),F=e.PathSet=new A({typeBoundary:255,typeEnd:0,typeAccount:1,typeCurrency:16,typeIssuer:32,serialize:function(t,e){for(var r=0,i=e.length;i>r;r++){r&&j.serialize(t,this.typeBoundary);for(var n=0,s=e[r].length;s>n;n++){var o=e[r][n],a=0;if(o.account&&(a|=this.typeAccount),o.currency&&(a|=this.typeCurrency),o.issuer&&(a|=this.typeIssuer),j.serialize(t,a),o.account&&t.append(g.from_json(o.account).to_bytes()),o.currency){var c=x.from_json(o.currency);M.serialize(t,c)}o.issuer&&t.append(g.from_json(o.issuer).to_bytes())}}j.serialize(t,this.typeEnd)},parse:function(t){for(var e,r=[],i=[];(e=t.read(1)[0])!==this.typeEnd;)if(e===this.typeBoundary)i&&r.push(i),i=[];else{var n={};if(e&this.typeAccount&&(n.account=O.parse(t)),e&this.typeCurrency&&(n.currency=M.parse(t)),e&this.typeIssuer&&(n.issuer=O.parse(t)),!(n.account||n.currency||n.issuer))throw new Error("Invalid path entry");i.push(n)}return i&&r.push(i),r}}),P=e.Vector256=new A({serialize:function(t,e){A.serialize_varint(t,e.length);for(var r=0,i=e.length;i>r;r++)D.serialize(t,e[r])},parse:function(t){for(var e=this.parse_varint(t),r=[],i=0;e>i;i++)r.push(D.parse(t));return r}});e.serialize=e.serialize_whatever=l,e.parse=e.parse_whatever=_;var z=e.Object=new A({serialize:function(t,e){for(var r=Object.keys(e),i=0;i<r.length;i++)l(t,r[i],e[r[i]]);j.serialize(t,225)},parse:function(t){for(var e={};225!==t.peek(1)[0];){var r=_(t);e[r[0]]=r[1]}return t.read(1),e}}),U=e.Array=new A({serialize:function(t,e){for(var r=0,i=e.length;i>r;r++){var n=Object.keys(e[r]);if(1!==n.length)throw Error("Cannot serialize an array containing non-single-key objects");var s=n[0],o=e[r][s];l(t,s,o)}j.serialize(t,241)},parse:function(t){for(var e=[];241!==t.peek(1)[0];){var r=_(t),i={};i[r[0]]=r[1],e.push(i)}return t.read(1),e}}),V=[void 0,B,q,I,R,D,L,C,N,void 0,void 0,void 0,void 0,void 0,z,U,j,O,F,P],H={1:{1:"LedgerEntryType",2:"TransactionType"},2:{2:"Flags",3:"SourceTag",4:"Sequence",5:"PreviousTxnLgrSeq",6:"LedgerSequence",7:"CloseTime",8:"ParentCloseTime",9:"SigningTime",10:"Expiration",11:"TransferRate",12:"WalletSize",13:"OwnerCount",14:"DestinationTag",16:"HighQualityIn",17:"HighQualityOut",18:"LowQualityIn",19:"LowQualityOut",20:"QualityIn",21:"QualityOut",22:"StampEscrow",23:"BondAmount",24:"LoadFee",25:"OfferSequence",26:"FirstLedgerSequence",27:"LastLedgerSequence",28:"TransactionIndex",29:"OperationLimit",30:"ReferenceFeeUnits",31:"ReserveBase",32:"ReserveIncrement",33:"SetFlag",34:"ClearFlag"},3:{1:"IndexNext",2:"IndexPrevious",3:"BookNode",4:"OwnerNode",5:"BaseFee",6:"ExchangeRate",7:"LowNode",8:"HighNode"},4:{1:"EmailHash"},5:{1:"LedgerHash",2:"ParentHash",3:"TransactionHash",4:"AccountHash",5:"PreviousTxnID",6:"LedgerIndex",7:"WalletLocator",8:"RootIndex",16:"BookDirectory",17:"InvoiceID",18:"Nickname",19:"Feature"},6:{1:"Amount",2:"Balance",3:"LimitAmount",4:"TakerPays",5:"TakerGets",6:"LowLimit",7:"HighLimit",8:"Fee",9:"SendMax",16:"MinimumOffer",17:"RippleEscrow"},7:{1:"PublicKey",2:"MessageKey",3:"SigningPubKey",4:"TxnSignature",5:"Generator",6:"Signature",7:"Domain",8:"FundCode",9:"RemoveCode",10:"ExpireCode",11:"CreateCode"},8:{1:"Account",2:"Owner",3:"Destination",4:"Issuer",7:"Target",8:"RegularKey"},14:{1:void 0,2:"TransactionMetaData",3:"CreatedNode",4:"DeletedNode",5:"ModifiedNode",6:"PreviousFields",7:"FinalFields",8:"NewFields",9:"TemplateEntry"},15:{1:void 0,2:"SigningAccounts",3:"TxnSignatures",4:"Signatures",5:"Template",6:"Necessary",7:"Sufficient",8:"AffectedNodes"},16:{1:"CloseResolution",2:"TemplateEntryType",3:"TransactionResult"},17:{1:"TakerPaysCurrency",2:"TakerPaysIssuer",3:"TakerGetsCurrency",4:"TakerGetsIssuer"},18:{1:"Paths"},19:{1:"Indexes",2:"Hashes",3:"Features"}},G={};Object.keys(H).forEach(function(t){Object.keys(H[t]).forEach(function(e){G[H[t][e]]=[Number(t),Number(e)]})})},21:function(t,e,r){r(9).sjcl;var i=r(9);r(11);var n=r(29);i.jsbn.BigInteger;var s=r(30).UInt;r(4).Base;var o=n(function(){this._value=0/0},s);o.width=32,o.prototype=n({},s.prototype),o.prototype.constructor=o;var a=o.HEX_ZERO="0000000000000000000000000000000000000000000000000000000000000000",c=o.HEX_ONE="0000000000000000000000000000000000000000000000000000000000000001";o.STR_ZERO=i.hexToString(a),o.STR_ONE=i.hexToString(c),e.UInt256=o},22:function(t,e,r){!function(t,r){function i(t){this.length=t}function n(t){return 16>t?"0"+t.toString(16):t.toString(16)}function s(t){for(var e=[],r=0;r<t.length;r++)if(t.charCodeAt(r)<=127)e.push(t.charCodeAt(r));else for(var i=encodeURIComponent(t.charAt(r)).substr(1).split("%"),n=0;n<i.length;n++)e.push(parseInt(i[n],16));return e}function o(t){for(var e=[],r=0;r<t.length;r++)e.push(255&t.charCodeAt(r));return e}function a(e){return t(43).toByteArray(e)}function c(t,e,r,i){for(var n=0;i>n&&!(n+r>=e.length||n>=t.length);)e[n+r]=t[n],n++;return n}function u(t){try{return decodeURIComponent(t)}catch(e){return String.fromCharCode(65533)}}function h(t){return t=~~Math.ceil(+t),0>t?0:t}function r(t,e,n){if(!(this instanceof r))return new r(t,e,n);var s;if("number"==typeof n)this.length=h(e),this.parent=t,this.offset=n;else{switch(s=typeof t){case"number":this.length=h(t);break;case"string":this.length=r.byteLength(t,e);break;case"object":this.length=h(t.length);break;default:throw new Error("First argument needs to be a number, array or string.")}if(this.length>r.poolSize?(this.parent=new i(this.length),this.offset=0):((!B||B.length-B.used<this.length)&&l(),this.parent=B,this.offset=B.used,B.used+=this.length),f(t))for(var o=0;o<this.length;o++)this.parent[o+this.offset]=t[o];else"string"==s&&(this.length=this.write(t,0,e))}}function f(t){return Array.isArray(t)||r.isBuffer(t)||t&&"object"==typeof t&&"number"==typeof t.length}function l(){B=new i(r.poolSize),B.used=0}function _(t,e,r,i){var n=0;return i||(j.ok("boolean"==typeof r,"missing or invalid endian"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e+1<t.length,"Trying to read beyond buffer length")),r?(n=t.parent[t.offset+e]<<8,n|=t.parent[t.offset+e+1]):(n=t.parent[t.offset+e],n|=t.parent[t.offset+e+1]<<8),n}function p(t,e,r,i){var n=0;return i||(j.ok("boolean"==typeof r,"missing or invalid endian"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e+3<t.length,"Trying to read beyond buffer length")),r?(n=t.parent[t.offset+e+1]<<16,n|=t.parent[t.offset+e+2]<<8,n|=t.parent[t.offset+e+3],n+=t.parent[t.offset+e]<<24>>>0):(n=t.parent[t.offset+e+2]<<16,n|=t.parent[t.offset+e+1]<<8,n|=t.parent[t.offset+e],n+=t.parent[t.offset+e+3]<<24>>>0),n}function d(t,e,r,i){var n,s;return i||(j.ok("boolean"==typeof r,"missing or invalid endian"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e+1<t.length,"Trying to read beyond buffer length")),s=_(t,e,r,i),n=32768&s,n?-1*(65535-s+1):s}function y(t,e,r,i){var n,s;return i||(j.ok("boolean"==typeof r,"missing or invalid endian"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e+3<t.length,"Trying to read beyond buffer length")),s=p(t,e,r,i),n=2147483648&s,n?-1*(4294967295-s+1):s}function m(e,r,i,n){return n||(j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(r+3<e.length,"Trying to read beyond buffer length")),t(34).readIEEE754(e,r,i,23,4)}function v(e,r,i,n){return n||(j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(r+7<e.length,"Trying to read beyond buffer length")),t(34).readIEEE754(e,r,i,52,8)}function g(t,e){j.ok("number"==typeof t,"cannot write a non-number as a number"),j.ok(t>=0,"specified a negative value for writing an unsigned value"),j.ok(e>=t,"value is larger than maximum value for type"),j.ok(Math.floor(t)===t,"value has a fractional component")}function b(t,e,r,i,n){n||(j.ok(void 0!==e&&null!==e,"missing value"),j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(void 0!==r&&null!==r,"missing offset"),j.ok(r+1<t.length,"trying to write beyond buffer length"),g(e,65535)),i?(t.parent[t.offset+r]=(65280&e)>>>8,t.parent[t.offset+r+1]=255&e):(t.parent[t.offset+r+1]=(65280&e)>>>8,t.parent[t.offset+r]=255&e)}function w(t,e,r,i,n){n||(j.ok(void 0!==e&&null!==e,"missing value"),j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(void 0!==r&&null!==r,"missing offset"),j.ok(r+3<t.length,"trying to write beyond buffer length"),g(e,4294967295)),i?(t.parent[t.offset+r]=255&e>>>24,t.parent[t.offset+r+1]=255&e>>>16,t.parent[t.offset+r+2]=255&e>>>8,t.parent[t.offset+r+3]=255&e):(t.parent[t.offset+r+3]=255&e>>>24,t.parent[t.offset+r+2]=255&e>>>16,t.parent[t.offset+r+1]=255&e>>>8,t.parent[t.offset+r]=255&e)}function E(t,e,r){j.ok("number"==typeof t,"cannot write a non-number as a number"),j.ok(e>=t,"value larger than maximum allowed value"),j.ok(t>=r,"value smaller than minimum allowed value"),j.ok(Math.floor(t)===t,"value has a fractional component")}function x(t,e,r){j.ok("number"==typeof t,"cannot write a non-number as a number"),j.ok(e>=t,"value larger than maximum allowed value"),j.ok(t>=r,"value smaller than minimum allowed value")}function k(t,e,r,i,n){n||(j.ok(void 0!==e&&null!==e,"missing value"),j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(void 0!==r&&null!==r,"missing offset"),j.ok(r+1<t.length,"Trying to write beyond buffer length"),E(e,32767,-32768)),e>=0?b(t,e,r,i,n):b(t,65535+e+1,r,i,n)}function T(t,e,r,i,n){n||(j.ok(void 0!==e&&null!==e,"missing value"),j.ok("boolean"==typeof i,"missing or invalid endian"),j.ok(void 0!==r&&null!==r,"missing offset"),j.ok(r+3<t.length,"Trying to write beyond buffer length"),E(e,2147483647,-2147483648)),e>=0?w(t,e,r,i,n):w(t,4294967295+e+1,r,i,n)}function S(e,r,i,n,s){s||(j.ok(void 0!==r&&null!==r,"missing value"),j.ok("boolean"==typeof n,"missing or invalid endian"),j.ok(void 0!==i&&null!==i,"missing offset"),j.ok(i+3<e.length,"Trying to write beyond buffer length"),x(r,3.4028234663852886e38,-3.4028234663852886e38)),t(34).writeIEEE754(e,r,i,n,23,4)}function A(e,r,i,n,s){s||(j.ok(void 0!==r&&null!==r,"missing value"),j.ok("boolean"==typeof n,"missing or invalid endian"),j.ok(void 0!==i&&null!==i,"missing offset"),j.ok(i+7<e.length,"Trying to write beyond buffer length"),x(r,1.7976931348623157e308,-1.7976931348623157e308)),t(34).writeIEEE754(e,r,i,n,52,8)}var j=t(26);e.INSPECT_MAX_BYTES=50,i.byteLength=function(t,e){switch(e||"utf8"){case"hex":return t.length/2;case"utf8":case"utf-8":return s(t).length;case"ascii":return t.length;case"base64":return a(t).length;default:throw new Error("Unknown encoding")}},i.prototype.utf8Write=function(t,e,r){return i._charsWritten=c(s(t),this,e,r)},i.prototype.asciiWrite=function(t,e,r){return i._charsWritten=c(o(t),this,e,r)},i.prototype.base64Write=function(t,e,r){return i._charsWritten=c(a(t),this,e,r)},i.prototype.base64Slice=function(){var e=Array.prototype.slice.apply(this,arguments);return t(43).fromByteArray(e)},i.prototype.utf8Slice=function(){for(var t=Array.prototype.slice.apply(this,arguments),e="",r="",i=0;i<t.length;)t[i]<=127?(e+=u(r)+String.fromCharCode(t[i]),r=""):r+="%"+t[i].toString(16),i++;return e+u(r)},i.prototype.asciiSlice=function(){for(var t=Array.prototype.slice.apply(this,arguments),e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},i.prototype.inspect=function(){for(var t=[],r=this.length,i=0;r>i;i++)if(t[i]=n(this[i]),i==e.INSPECT_MAX_BYTES){t[i+1]="...";break}return"<SlowBuffer "+t.join(" ")+">"},i.prototype.hexSlice=function(t,e){var r=this.length;(!t||0>t)&&(t=0),(!e||0>e||e>r)&&(e=r);for(var i="",s=t;e>s;s++)i+=n(this[s]);return i},i.prototype.toString=function(t,e,r){if(t=String(t||"utf8").toLowerCase(),e=+e||0,"undefined"==typeof r&&(r=this.length),+r==e)return"";switch(t){case"hex":return this.hexSlice(e,r);case"utf8":case"utf-8":return this.utf8Slice(e,r);case"ascii":return this.asciiSlice(e,r);case"binary":return this.binarySlice(e,r);case"base64":return this.base64Slice(e,r);case"ucs2":case"ucs-2":return this.ucs2Slice(e,r);default:throw new Error("Unknown encoding")}},i.prototype.hexWrite=function(t,e,r){e=+e||0;var n=this.length-e;r?(r=+r,r>n&&(r=n)):r=n;var s=t.length;if(s%2)throw new Error("Invalid hex string");r>s/2&&(r=s/2);for(var o=0;r>o;o++){var a=parseInt(t.substr(2*o,2),16);if(isNaN(a))throw new Error("Invalid hex string");this[e+o]=a}return i._charsWritten=2*o,o},i.prototype.write=function(t,e,r,i){if(isFinite(e))isFinite(r)||(i=r,r=void 0);else{var n=i;i=e,e=r,r=n}e=+e||0;var s=this.length-e;switch(r?(r=+r,r>s&&(r=s)):r=s,i=String(i||"utf8").toLowerCase()){case"hex":return this.hexWrite(t,e,r);case"utf8":case"utf-8":return this.utf8Write(t,e,r);case"ascii":return this.asciiWrite(t,e,r);case"binary":return this.binaryWrite(t,e,r);case"base64":return this.base64Write(t,e,r);case"ucs2":case"ucs-2":return this.ucs2Write(t,e,r);default:throw new Error("Unknown encoding")}},i.prototype.slice=function(t,e){if(void 0===e&&(e=this.length),e>this.length)throw new Error("oob");if(t>e)throw new Error("oob");return new r(this,e-t,+t)},i.prototype.copy=function(t,e,r,i){for(var n=[],s=r;i>s;s++)j.ok("undefined"!=typeof this[s],"copying undefined buffer bytes!"),n.push(this[s]);for(var s=e;s<e+n.length;s++)t[s]=n[s-e]},e.SlowBuffer=i,e.Buffer=r,r.poolSize=8192;var B;r.isBuffer=function(t){return t instanceof r||t instanceof i},r.concat=function(t,e){if(!Array.isArray(t))throw new Error("Usage: Buffer.concat(list, [totalLength])\n 	      list should be an Array.");if(0===t.length)return new r(0);if(1===t.length)return t[0];if("number"!=typeof e){e=0;for(var i=0;i<t.length;i++){var n=t[i];e+=n.length}}for(var s=new r(e),o=0,i=0;i<t.length;i++){var n=t[i];n.copy(s,o),o+=n.length}return s},r.prototype.inspect=function(){for(var t=[],r=this.length,i=0;r>i;i++)if(t[i]=n(this.parent[i+this.offset]),i==e.INSPECT_MAX_BYTES){t[i+1]="...";break}return"<Buffer "+t.join(" ")+">"},r.prototype.get=function(t){if(0>t||t>=this.length)throw new Error("oob");return this.parent[this.offset+t]},r.prototype.set=function(t,e){if(0>t||t>=this.length)throw new Error("oob");return this.parent[this.offset+t]=e},r.prototype.write=function(t,e,n,s){if(isFinite(e))isFinite(n)||(s=n,n=void 0);else{var o=s;s=e,e=n,n=o}e=+e||0;var a=this.length-e;n?(n=+n,n>a&&(n=a)):n=a,s=String(s||"utf8").toLowerCase();var c;switch(s){case"hex":c=this.parent.hexWrite(t,this.offset+e,n);break;case"utf8":case"utf-8":c=this.parent.utf8Write(t,this.offset+e,n);break;case"ascii":c=this.parent.asciiWrite(t,this.offset+e,n);break;case"binary":c=this.parent.binaryWrite(t,this.offset+e,n);break;case"base64":c=this.parent.base64Write(t,this.offset+e,n);break;case"ucs2":case"ucs-2":c=this.parent.ucs2Write(t,this.offset+e,n);break;default:throw new Error("Unknown encoding")}return r._charsWritten=i._charsWritten,c},r.prototype.toString=function(t,e,r){switch(t=String(t||"utf8").toLowerCase(),"undefined"==typeof e||0>e?e=0:e>this.length&&(e=this.length),"undefined"==typeof r||r>this.length?r=this.length:0>r&&(r=0),e+=this.offset,r+=this.offset,t){case"hex":return this.parent.hexSlice(e,r);case"utf8":case"utf-8":return this.parent.utf8Slice(e,r);case"ascii":return this.parent.asciiSlice(e,r);case"binary":return this.parent.binarySlice(e,r);case"base64":return this.parent.base64Slice(e,r);case"ucs2":case"ucs-2":return this.parent.ucs2Slice(e,r);default:throw new Error("Unknown encoding")}},r.byteLength=i.byteLength,r.prototype.fill=function(t,e,r){if(t||(t=0),e||(e=0),r||(r=this.length),"string"==typeof t&&(t=t.charCodeAt(0)),"number"!=typeof t||isNaN(t))throw new Error("value is not a number");if(e>r)throw new Error("end < start");if(r===e)return 0;if(0==this.length)return 0;if(0>e||e>=this.length)throw new Error("start out of bounds");if(0>r||r>this.length)throw new Error("end out of bounds");return this.parent.fill(t,e+this.offset,r+this.offset)},r.prototype.copy=function(t,e,r,i){var n=this;if(r||(r=0),i||(i=this.length),e||(e=0),r>i)throw new Error("sourceEnd < sourceStart");if(i===r)return 0;if(0==t.length||0==n.length)return 0;if(0>e||e>=t.length)throw new Error("targetStart out of bounds");if(0>r||r>=n.length)throw new Error("sourceStart out of bounds");if(0>i||i>n.length)throw new Error("sourceEnd out of bounds");return i>this.length&&(i=this.length),t.length-e<i-r&&(i=t.length-e+r),this.parent.copy(t.parent,e+t.offset,r+this.offset,i+this.offset)},r.prototype.slice=function(t,e){if(void 0===e&&(e=this.length),e>this.length)throw new Error("oob");if(t>e)throw new Error("oob");return new r(this.parent,e-t,+t+this.offset)},r.prototype.utf8Slice=function(t,e){return this.toString("utf8",t,e)},r.prototype.binarySlice=function(t,e){return this.toString("binary",t,e)},r.prototype.asciiSlice=function(t,e){return this.toString("ascii",t,e)},r.prototype.utf8Write=function(t,e){return this.write(t,e,"utf8")},r.prototype.binaryWrite=function(t,e){return this.write(t,e,"binary")},r.prototype.asciiWrite=function(t,e){return this.write(t,e,"ascii")},r.prototype.readUInt8=function(t,e){var r=this;return e||(j.ok(void 0!==t&&null!==t,"missing offset"),j.ok(t<r.length,"Trying to read beyond buffer length")),r.parent[r.offset+t]},r.prototype.readUInt16LE=function(t,e){return _(this,t,!1,e)},r.prototype.readUInt16BE=function(t,e){return _(this,t,!0,e)},r.prototype.readUInt32LE=function(t,e){return p(this,t,!1,e)},r.prototype.readUInt32BE=function(t,e){return p(this,t,!0,e)},r.prototype.readInt8=function(t,e){var r,i=this;return e||(j.ok(void 0!==t&&null!==t,"missing offset"),j.ok(t<i.length,"Trying to read beyond buffer length")),r=128&i.parent[i.offset+t],r?-1*(255-i.parent[i.offset+t]+1):i.parent[i.offset+t]},r.prototype.readInt16LE=function(t,e){return d(this,t,!1,e)},r.prototype.readInt16BE=function(t,e){return d(this,t,!0,e)},r.prototype.readInt32LE=function(t,e){return y(this,t,!1,e)},r.prototype.readInt32BE=function(t,e){return y(this,t,!0,e)},r.prototype.readFloatLE=function(t,e){return m(this,t,!1,e)},r.prototype.readFloatBE=function(t,e){return m(this,t,!0,e)},r.prototype.readDoubleLE=function(t,e){return v(this,t,!1,e)},r.prototype.readDoubleBE=function(t,e){return v(this,t,!0,e)},r.prototype.writeUInt8=function(t,e,r){var i=this;r||(j.ok(void 0!==t&&null!==t,"missing value"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e<i.length,"trying to write beyond buffer length"),g(t,255)),i.parent[i.offset+e]=t},r.prototype.writeUInt16LE=function(t,e,r){b(this,t,e,!1,r)},r.prototype.writeUInt16BE=function(t,e,r){b(this,t,e,!0,r)},r.prototype.writeUInt32LE=function(t,e,r){w(this,t,e,!1,r)},r.prototype.writeUInt32BE=function(t,e,r){w(this,t,e,!0,r)},r.prototype.writeInt8=function(t,e,r){var i=this;r||(j.ok(void 0!==t&&null!==t,"missing value"),j.ok(void 0!==e&&null!==e,"missing offset"),j.ok(e<i.length,"Trying to write beyond buffer length"),E(t,127,-128)),t>=0?i.writeUInt8(t,e,r):i.writeUInt8(255+t+1,e,r)},r.prototype.writeInt16LE=function(t,e,r){k(this,t,e,!1,r)},r.prototype.writeInt16BE=function(t,e,r){k(this,t,e,!0,r)},r.prototype.writeInt32LE=function(t,e,r){T(this,t,e,!1,r)},r.prototype.writeInt32BE=function(t,e,r){T(this,t,e,!0,r)},r.prototype.writeFloatLE=function(t,e,r){S(this,t,e,!1,r)},r.prototype.writeFloatBE=function(t,e,r){S(this,t,e,!0,r)},r.prototype.writeDoubleLE=function(t,e,r){A(this,t,e,!1,r)},r.prototype.writeDoubleBE=function(t,e,r){A(this,t,e,!0,r)},i.prototype.readUInt8=r.prototype.readUInt8,i.prototype.readUInt16LE=r.prototype.readUInt16LE,i.prototype.readUInt16BE=r.prototype.readUInt16BE,i.prototype.readUInt32LE=r.prototype.readUInt32LE,i.prototype.readUInt32BE=r.prototype.readUInt32BE,i.prototype.readInt8=r.prototype.readInt8,i.prototype.readInt16LE=r.prototype.readInt16LE,i.prototype.readInt16BE=r.prototype.readInt16BE,i.prototype.readInt32LE=r.prototype.readInt32LE,i.prototype.readInt32BE=r.prototype.readInt32BE,i.prototype.readFloatLE=r.prototype.readFloatLE,i.prototype.readFloatBE=r.prototype.readFloatBE,i.prototype.readDoubleLE=r.prototype.readDoubleLE,i.prototype.readDoubleBE=r.prototype.readDoubleBE,i.prototype.writeUInt8=r.prototype.writeUInt8,i.prototype.writeUInt16LE=r.prototype.writeUInt16LE,i.prototype.writeUInt16BE=r.prototype.writeUInt16BE,i.prototype.writeUInt32LE=r.prototype.writeUInt32LE,i.prototype.writeUInt32BE=r.prototype.writeUInt32BE,i.prototype.writeInt8=r.prototype.writeInt8,i.prototype.writeInt16LE=r.prototype.writeInt16LE,i.prototype.writeInt16BE=r.prototype.writeInt16BE,i.prototype.writeInt32LE=r.prototype.writeInt32LE,i.prototype.writeInt32BE=r.prototype.writeInt32BE,i.prototype.writeFloatLE=r.prototype.writeFloatLE,i.prototype.writeFloatBE=r.prototype.writeFloatBE,i.prototype.writeDoubleLE=r.prototype.writeDoubleLE,i.prototype.writeDoubleBE=r.prototype.writeDoubleBE}(r,r(22).Buffer)},23:function(t){try{t.exports=WebSocket}catch(e){t.exports=MozWebSocket}},24:function(t,e,r){var i=e.EventEmitter=function(){},n=r(35);r(36);var s=10;i.prototype.setMaxListeners=function(t){this._events||(this._events={}),this._maxListeners=t},i.prototype.emit=function(t){if("error"===t&&(!this._events||!this._events.error||n(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var e=this._events[t];if(!e)return!1;if("function"==typeof e){switch(arguments.length){case 1:e.call(this);break;case 2:e.call(this,arguments[1]);break;case 3:e.call(this,arguments[1],arguments[2]);break;default:var r=Array.prototype.slice.call(arguments,1);e.apply(this,r)}return!0}if(n(e)){for(var r=Array.prototype.slice.call(arguments,1),i=e.slice(),s=0,o=i.length;o>s;s++)i[s].apply(this,r);return!0}return!1},i.prototype.addListener=function(t,e){if("function"!=typeof e)throw new Error("addListener only takes instances of Function");if(this._events||(this._events={}),this.emit("newListener",t,e),this._events[t]?n(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,n(this._events[t])&&!this._events[t].warned){var r;
r=void 0!==this._maxListeners?this._maxListeners:s,r&&r>0&&this._events[t].length>r&&(this._events[t].warned=!0,console.error("(events) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),console.trace())}return this},i.prototype.on=i.prototype.addListener,i.prototype.once=function(t,e){function r(){i.removeListener(t,r),e.apply(this,arguments)}if("function"!=typeof e)throw new Error(".once only takes instances of Function");var i=this;return r.listener=e,i.on(t,r),this},i.prototype.removeListener=function(t,e){if("function"!=typeof e)throw new Error("removeListener only takes instances of Function");if(!this._events||!this._events[t])return this;var r=this._events[t];if(n(r)){for(var i=-1,s=0,o=r.length;o>s;s++)if(r[s]===e||r[s].listener&&r[s].listener===e){i=s;break}if(0>i)return this;r.splice(i,1),0==r.length&&delete this._events[t]}else(r===e||r.listener&&r.listener===e)&&delete this._events[t];return this},i.prototype.removeAllListeners=function(t){return 0===arguments.length?(this._events={},this):(t&&this._events&&this._events[t]&&(this._events[t]=null),this)},i.prototype.listeners=function(t){return this._events||(this._events={}),this._events[t]||(this._events[t]=[]),n(this._events[t])||(this._events[t]=[this._events[t]]),this._events[t]}},25:function(t,e,r){function i(t){if(t instanceof Date)return!0;if("object"!=typeof t)return!1;var e=Date.prototype&&o(Date.prototype),r=t.__proto__&&o(t.__proto__);return JSON.stringify(r)===JSON.stringify(e)}r(24);var n=r(35),s=r(37),o=r(38),a=r(39),c=r(40);e.isArray=n,e.isDate=i,e.isRegExp=c,e.print=function(){},e.puts=function(){},e.debug=function(){},e.inspect=function(t,r,a,u){function h(t,a){if(t&&"function"==typeof t.inspect&&t!==e&&(!t.constructor||t.constructor.prototype!==t))return t.inspect(a);switch(typeof t){case"undefined":return l("undefined","undefined");case"string":var u="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return l(u,"string");case"number":return l(""+t,"number");case"boolean":return l(""+t,"boolean")}if(null===t)return l("null","null");var _=s(t),p=r?o(t):_;if("function"==typeof t&&0===p.length){if(c(t))return l(""+t,"regexp");var d=t.name?": "+t.name:"";return l("[Function"+d+"]","special")}if(i(t)&&0===p.length)return l(t.toUTCString(),"date");var y,m,v;if(n(t)?(m="Array",v=["[","]"]):(m="Object",v=["{","}"]),"function"==typeof t){var g=t.name?": "+t.name:"";y=c(t)?" "+t:" [Function"+g+"]"}else y="";if(i(t)&&(y=" "+t.toUTCString()),0===p.length)return v[0]+y+v[1];if(0>a)return c(t)?l(""+t,"regexp"):l("[Object]","special");f.push(t);var b=p.map(function(e){var r,i;if(t.__lookupGetter__&&(t.__lookupGetter__(e)?i=t.__lookupSetter__(e)?l("[Getter/Setter]","special"):l("[Getter]","special"):t.__lookupSetter__(e)&&(i=l("[Setter]","special"))),_.indexOf(e)<0&&(r="["+e+"]"),i||(f.indexOf(t[e])<0?(i=null===a?h(t[e]):h(t[e],a-1),i.indexOf("\n")>-1&&(i=n(t)?i.split("\n").map(function(t){return"  "+t}).join("\n").substr(2):"\n"+i.split("\n").map(function(t){return"   "+t}).join("\n"))):i=l("[Circular]","special")),"undefined"==typeof r){if("Array"===m&&e.match(/^\d+$/))return i;r=JSON.stringify(""+e),r.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(r=r.substr(1,r.length-2),r=l(r,"name")):(r=r.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),r=l(r,"string"))}return r+": "+i});f.pop();var w=0,E=b.reduce(function(t,e){return w++,e.indexOf("\n")>=0&&w++,t+e.length+1},0);return b=E>50?v[0]+(""===y?"":y+"\n ")+" "+b.join(",\n  ")+" "+v[1]:v[0]+y+" "+b.join(", ")+" "+v[1]}var f=[],l=function(t,e){var r={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i={special:"cyan",number:"blue","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"}[e];return i?][0]+"m"+t+][1]+"m":t};return u||(l=function(t){return t}),h(t,"undefined"==typeof a?2:a)},e.log=function(){},e.pump=null,e.inherits=function(t,e){t.super_=e,t.prototype=a(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})};var u=/%[sdj%]/g;e.format=function(t){if("string"!=typeof t){for(var r=[],i=0;i<arguments.length;i++)r.push(e.inspect(arguments[i]));return r.join(" ")}for(var i=1,n=arguments,s=n.length,o=String(t).replace(u,function(t){if("%%"===t)return"%";if(i>=s)return t;switch(t){case"%s":return String(n[i++]);case"%d":return Number(n[i++]);case"%j":return JSON.stringify(n[i++]);default:return t}}),a=n[i];s>i;a=n[++i])o+=null===a||"object"!=typeof a?" "+a:" "+e.inspect(a);return o}},26:function(t,e,r){function i(t,e){return void 0===e?""+e:"number"!=typeof e||!isNaN(e)&&isFinite(e)?"function"==typeof e||e instanceof RegExp?e.toString():e:e.toString()}function n(t,e){return"string"==typeof t?t.length<e?t:t.slice(0,e):t}function s(t,e,r,i,n){throw new m.AssertionError({message:r,actual:t,expected:e,operator:i,stackStartFunction:n})}function o(t,e){t||s(t,!0,e,"==",m.ok)}function a(t,e){if(t===e)return!0;if(r(22).Buffer.isBuffer(t)&&r(22).Buffer.isBuffer(e)){if(t.length!=e.length)return!1;for(var i=0;i<t.length;i++)if(t[i]!==e[i])return!1;return!0}return t instanceof Date&&e instanceof Date?t.getTime()===e.getTime():y(t)&&y(e)?t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase:"object"!=typeof t&&"object"!=typeof e?t==e:h(t,e)}function c(t){return null===t||void 0===t}function u(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function h(t,e){if(c(t)||c(e))return!1;if(t.prototype!==e.prototype)return!1;if(u(t))return u(e)?(t=p.call(t),e=p.call(e),a(t,e)):!1;try{var r,i,n=d(t),s=d(e)}catch(o){return!1}if(n.length!=s.length)return!1;for(n.sort(),s.sort(),i=n.length-1;i>=0;i--)if(n[i]!=s[i])return!1;for(i=n.length-1;i>=0;i--)if(r=n[i],!a(t[r],e[r]))return!1;return!0}function f(t,e){return t&&e?y(e)?e.test(t):t instanceof e?!0:e.call({},t)===!0?!0:!1:!1}function l(t,e,r,i){var n;"string"==typeof r&&(i=r,r=null);try{e()}catch(o){n=o}if(i=(r&&r.name?" ("+r.name+").":".")+(i?" "+i:"."),t&&!n&&s(n,r,"Missing expected exception"+i),!t&&f(n,r)&&s(n,r,"Got unwanted exception"+i),t&&n&&r&&!f(n,r)||!t&&n)throw n}var _=r(25),p=Array.prototype.slice,d=r(37),y=r(40),m=t.exports=o;m.AssertionError=function(t){this.name="AssertionError",this.message=t.message,this.actual=t.actual,this.expected=t.expected,this.operator=t.operator;var e=t.stackStartFunction||s;Error.captureStackTrace&&Error.captureStackTrace(this,e)},_.inherits(m.AssertionError,Error),m.AssertionError.prototype.toString=function(){return this.message?[this.name+":",this.message].join(" "):[this.name+":",n(JSON.stringify(this.actual,i),128),this.operator,n(JSON.stringify(this.expected,i),128)].join(" ")},m.AssertionError.__proto__=Error.prototype,m.fail=s,m.ok=o,m.equal=function(t,e,r){t!=e&&s(t,e,r,"==",m.equal)},m.notEqual=function(t,e,r){t==e&&s(t,e,r,"!=",m.notEqual)},m.deepEqual=function(t,e,r){a(t,e)||s(t,e,r,"deepEqual",m.deepEqual)},m.notDeepEqual=function(t,e,r){a(t,e)&&s(t,e,r,"notDeepEqual",m.notDeepEqual)},m.strictEqual=function(t,e,r){t!==e&&s(t,e,r,"===",m.strictEqual)},m.notStrictEqual=function(t,e,r){t===e&&s(t,e,r,"!==",m.notStrictEqual)},m.throws=function(){l.apply(this,[!0].concat(p.call(arguments)))},m.doesNotThrow=function(){l.apply(this,[!1].concat(p.call(arguments)))},m.ifError=function(t){if(t)throw t}},27:function(t,e,r){!function(t,e){"use strict";function r(t){var e,r=1;return 0!=(e=t>>>16)&&(t=e,r+=16),0!=(e=t>>8)&&(t=e,r+=8),0!=(e=t>>4)&&(t=e,r+=4),0!=(e=t>>2)&&(t=e,r+=2),0!=(e=t>>1)&&(t=e,r+=1),r}var i={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(t){this.toString=function(){return"CORRUPT: "+this.message},this.message=t},invalid:function(t){this.toString=function(){return"INVALID: "+this.message},this.message=t},bug:function(t){this.toString=function(){return"BUG: "+this.message},this.message=t},notReady:function(t){this.toString=function(){return"NOT READY: "+this.message},this.message=t}}};"undefined"!=typeof e&&e.exports&&(e.exports=i),i.cipher.aes=function(t){this._tables[0][0][0]||this._precompute();var e,r,n,s,o,a=this._tables[0][4],c=this._tables[1],u=t.length,h=1;if(4!==u&&6!==u&&8!==u)throw new i.exception.invalid("invalid aes key size");for(this._key=[s=t.slice(0),o=[]],e=u;4*u+28>e;e++)n=s[e-1],(0===e%u||8===u&&4===e%u)&&(n=a[n>>>24]<<24^a[255&n>>16]<<16^a[255&n>>8]<<8^a[255&n],0===e%u&&(n=n<<8^n>>>24^h<<24,h=h<<1^283*(h>>7))),s[e]=s[e-u]^n;for(r=0;e;r++,e--)n=s[3&r?e:e-4],o[r]=4>=e||4>r?n:c[0][a[n>>>24]]^c[1][a[255&n>>16]]^c[2][a[255&n>>8]]^c[3][a[255&n]]},i.cipher.aes.prototype={encrypt:function(t){return this._crypt(t,0)},decrypt:function(t){return this._crypt(t,1)},_tables:[[[],[],[],[],[]],[[],[],[],[],[]]],_precompute:function(){var t,e,r,i,n,s,o,a,c,u=this._tables[0],h=this._tables[1],f=u[4],l=h[4],_=[],p=[];for(t=0;256>t;t++)p[(_[t]=t<<1^283*(t>>7))^t]=t;for(e=r=0;!f[e];e^=i||1,r=p[r]||1)for(o=r^r<<1^r<<2^r<<3^r<<4,o=99^(o>>8^255&o),f[e]=o,l[o]=e,s=_[n=_[i=_[e]]],c=16843009*s^65537*n^257*i^16843008*e,a=257*_[o]^16843008*o,t=0;4>t;t++)u[t][e]=a=a<<24^a>>>8,h[t][o]=c=c<<24^c>>>8;for(t=0;5>t;t++)u[t]=u[t].slice(0),h[t]=h[t].slice(0)},_crypt:function(t,e){if(4!==t.length)throw new i.exception.invalid("invalid aes block size");var r,n,s,o,a=this._key[e],c=t[0]^a[0],u=t[e?3:1]^a[1],h=t[2]^a[2],f=t[e?1:3]^a[3],l=a.length/4-2,_=4,p=[0,0,0,0],d=this._tables[e],y=d[0],m=d[1],v=d[2],g=d[3],b=d[4];for(o=0;l>o;o++)r=y[c>>>24]^m[255&u>>16]^v[255&h>>8]^g[255&f]^a[_],n=y[u>>>24]^m[255&h>>16]^v[255&f>>8]^g[255&c]^a[_+1],s=y[h>>>24]^m[255&f>>16]^v[255&c>>8]^g[255&u]^a[_+2],f=y[f>>>24]^m[255&c>>16]^v[255&u>>8]^g[255&h]^a[_+3],_+=4,c=r,u=n,h=s;for(o=0;4>o;o++)p[e?3&-o:o]=b[c>>>24]<<24^b[255&u>>16]<<16^b[255&h>>8]<<8^b[255&f]^a[_++],r=c,c=u,u=h,h=f,f=r;return p}},i.bitArray={bitSlice:function(t,e,r){return t=i.bitArray._shiftRight(t.slice(e/32),32-(31&e)).slice(1),void 0===r?t:i.bitArray.clamp(t,r-e)},extract:function(t,e,r){var i,n=Math.floor(31&-e-r);return i=-32&(e+r-1^e)?t[0|e/32]<<32-n^t[0|e/32+1]>>>n:t[0|e/32]>>>n,i&(1<<r)-1},concat:function(t,e){if(0===t.length||0===e.length)return t.concat(e);var r=t[t.length-1],n=i.bitArray.getPartial(r);return 32===n?t.concat(e):i.bitArray._shiftRight(e,n,0|r,t.slice(0,t.length-1))},bitLength:function(t){var e,r=t.length;return 0===r?0:(e=t[r-1],32*(r-1)+i.bitArray.getPartial(e))},clamp:function(t,e){if(32*t.length<e)return t;t=t.slice(0,Math.ceil(e/32));var r=t.length;return e=31&e,r>0&&e&&(t[r-1]=i.bitArray.partial(e,t[r-1]&2147483648>>e-1,1)),t},partial:function(t,e,r){return 32===t?e:(r?0|e:e<<32-t)+1099511627776*t},getPartial:function(t){return Math.round(t/1099511627776)||32},equal:function(t,e){if(i.bitArray.bitLength(t)!==i.bitArray.bitLength(e))return!1;var r,n=0;for(r=0;r<t.length;r++)n|=t[r]^e[r];return 0===n},_shiftRight:function(t,e,r,n){var s,o,a=0;for(void 0===n&&(n=[]);e>=32;e-=32)n.push(r),r=0;if(0===e)return n.concat(t);for(s=0;s<t.length;s++)n.push(r|t[s]>>>e),r=t[s]<<32-e;return a=t.length?t[t.length-1]:0,o=i.bitArray.getPartial(a),n.push(i.bitArray.partial(31&e+o,e+o>32?r:n.pop(),1)),n},_xor4:function(t,e){return[t[0]^e[0],t[1]^e[1],t[2]^e[2],t[3]^e[3]]}},i.codec.utf8String={fromBits:function(t){var e,r,n="",s=i.bitArray.bitLength(t);for(e=0;s/8>e;e++)0===(3&e)&&(r=t[e/4]),n+=String.fromCharCode(r>>>24),r<<=8;return decodeURIComponent(escape(n))},toBits:function(t){t=unescape(encodeURIComponent(t));var e,r=[],n=0;for(e=0;e<t.length;e++)n=n<<8|t.charCodeAt(e),3===(3&e)&&(r.push(n),n=0);return 3&e&&r.push(i.bitArray.partial(8*(3&e),n)),r}},i.codec.hex={fromBits:function(t){var e,r="";for(e=0;e<t.length;e++)r+=((0|t[e])+0xf00000000000).toString(16).substr(4);return r.substr(0,i.bitArray.bitLength(t)/4)},toBits:function(t){var e,r,n=[];for(t=t.replace(/\s|0x/g,""),r=t.length,t+="00000000",e=0;e<t.length;e+=8)n.push(0^parseInt(t.substr(e,8),16));return i.bitArray.clamp(n,4*r)}},i.codec.base64={_chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(t,e,r){var n,s="",o=0,a=i.codec.base64._chars,c=0,u=i.bitArray.bitLength(t);for(r&&(a=a.substr(0,62)+"-_"),n=0;6*s.length<u;)s+=a.charAt((c^t[n]>>>o)>>>26),6>o?(c=t[n]<<6-o,o+=26,n++):(c<<=6,o-=6);for(;3&s.length&&!e;)s+="=";return s},toBits:function(t,e){t=t.replace(/\s|=/g,"");var r,n,s=[],o=0,a=i.codec.base64._chars,c=0;for(e&&(a=a.substr(0,62)+"-_"),r=0;r<t.length;r++){if(n=a.indexOf(t.charAt(r)),0>n)throw new i.exception.invalid("this isn't base64!");o>26?(o-=26,s.push(c^n>>>o),c=n<<32-o):(o+=6,c^=n<<32-o)}return 56&o&&s.push(i.bitArray.partial(56&o,c,1)),s}},i.codec.base64url={fromBits:function(t){return i.codec.base64.fromBits(t,1,1)},toBits:function(t){return i.codec.base64.toBits(t,1)}},i.codec.bytes={fromBits:function(t){var e,r,n=[],s=i.bitArray.bitLength(t);for(e=0;s/8>e;e++)0===(3&e)&&(r=t[e/4]),n.push(r>>>24),r<<=8;return n},toBits:function(t){var e,r=[],n=0;for(e=0;e<t.length;e++)n=n<<8|t[e],3===(3&e)&&(r.push(n),n=0);return 3&e&&r.push(i.bitArray.partial(8*(3&e),n)),r}},i.hash.sha256=function(t){this._key[0]||this._precompute(),t?(this._h=t._h.slice(0),this._buffer=t._buffer.slice(0),this._length=t._length):this.reset()},i.hash.sha256.hash=function(t){return(new i.hash.sha256).update(t).finalize()},i.hash.sha256.prototype={blockSize:512,reset:function(){return this._h=this._init.slice(0),this._buffer=[],this._length=0,this},update:function(t){"string"==typeof t&&(t=i.codec.utf8String.toBits(t));var e,r=this._buffer=i.bitArray.concat(this._buffer,t),n=this._length,s=this._length=n+i.bitArray.bitLength(t);for(e=-512&512+n;s>=e;e+=512)this._block(r.splice(0,16));return this},finalize:function(){var t,e=this._buffer,r=this._h;for(e=i.bitArray.concat(e,[i.bitArray.partial(1,1)]),t=e.length+2;15&t;t++)e.push(0);for(e.push(Math.floor(this._length/4294967296)),e.push(0|this._length);e.length;)this._block(e.splice(0,16));return this.reset(),r},_init:[],_key:[],_precompute:function(){function t(t){return 0|4294967296*(t-Math.floor(t))}var e,r=0,i=2;t:for(;64>r;i++){for(e=2;i>=e*e;e++)if(0===i%e)continue t;8>r&&(this._init[r]=t(Math.pow(i,.5))),this._key[r]=t(Math.pow(i,1/3)),r++}},_block:function(t){var e,r,i,n,s=t.slice(0),o=this._h,a=this._key,c=o[0],u=o[1],h=o[2],f=o[3],l=o[4],_=o[5],p=o[6],d=o[7];for(e=0;64>e;e++)16>e?r=s[e]:(i=s[15&e+1],n=s[15&e+14],r=s[15&e]=0|(i>>>7^i>>>18^i>>>3^i<<25^i<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+s[15&e]+s[15&e+9]),r=r+d+(l>>>6^l>>>11^l>>>25^l<<26^l<<21^l<<7)+(p^l&(_^p))+a[e],d=p,p=_,_=l,l=0|f+r,f=h,h=u,u=c,c=0|r+(u&h^f&(u^h))+(u>>>2^u>>>13^u>>>22^u<<30^u<<19^u<<10);o[0]=0|o[0]+c,o[1]=0|o[1]+u,o[2]=0|o[2]+h,o[3]=0|o[3]+f,o[4]=0|o[4]+l,o[5]=0|o[5]+_,o[6]=0|o[6]+p,o[7]=0|o[7]+d}},i.hash.sha512=function(t){this._key[0]||this._precompute(),t?(this._h=t._h.slice(0),this._buffer=t._buffer.slice(0),this._length=t._length):this.reset()},i.hash.sha512.hash=function(t){return(new i.hash.sha512).update(t).finalize()},i.hash.sha512.prototype={blockSize:1024,reset:function(){return this._h=this._init.slice(0),this._buffer=[],this._length=0,this},update:function(t){"string"==typeof t&&(t=i.codec.utf8String.toBits(t));var e,r=this._buffer=i.bitArray.concat(this._buffer,t),n=this._length,s=this._length=n+i.bitArray.bitLength(t);for(e=-1024&1024+n;s>=e;e+=1024)this._block(r.splice(0,32));return this},finalize:function(){var t,e=this._buffer,r=this._h;for(e=i.bitArray.concat(e,[i.bitArray.partial(1,1)]),t=e.length+4;31&t;t++)e.push(0);for(e.push(0),e.push(0),e.push(Math.floor(this._length/4294967296)),e.push(0|this._length);e.length;)this._block(e.splice(0,32));return this.reset(),r},_init:[],_initr:[12372232,13281083,9762859,1914609,15106769,4090911,4308331,8266105],_key:[],_keyr:[2666018,15689165,5061423,9034684,4764984,380953,1658779,7176472,197186,7368638,14987916,16757986,8096111,1480369,13046325,6891156,15813330,5187043,9229749,11312229,2818677,10937475,4324308,1135541,6741931,11809296,16458047,15666916,11046850,698149,229999,945776,13774844,2541862,12856045,9810911,11494366,7844520,15576806,8533307,15795044,4337665,16291729,5553712,15684120,6662416,7413802,12308920,13816008,4303699,9366425,10176680,13195875,4295371,6546291,11712675,15708924,1519456,15772530,6568428,6495784,8568297,13007125,7492395,2515356,12632583,14740254,7262584,1535930,13146278,16321966,1853211,294276,13051027,13221564,1051980,4080310,6651434,14088940,4675607],_precompute:function(){function t(t){return 0|4294967296*(t-Math.floor(t))}function e(t){return 255&1099511627776*(t-Math.floor(t))}var r,i=0,n=2;t:for(;80>i;n++){for(r=2;n>=r*r;r++)if(0===n%r)continue t;8>i&&(this._init[2*i]=t(Math.pow(n,.5)),this._init[2*i+1]=e(Math.pow(n,.5))<<24|this._initr[i]),this._key[2*i]=t(Math.pow(n,1/3)),this._key[2*i+1]=e(Math.pow(n,1/3))<<24|this._keyr[i],i++}},_block:function(t){var e,r,i,n=t.slice(0),s=this._h,o=this._key,a=s[0],c=s[1],u=s[2],h=s[3],f=s[4],l=s[5],_=s[6],p=s[7],d=s[8],y=s[9],m=s[10],v=s[11],g=s[12],b=s[13],w=s[14],E=s[15],x=a,k=c,T=u,S=h,A=f,j=l,B=_,q=p,I=d,R=y,D=m,O=v,M=g,L=b,C=w,N=E;for(e=0;80>e;e++){if(16>e)r=n[2*e],i=n[2*e+1];else{var F=n[2*(e-15)],P=n[2*(e-15)+1],z=(P<<31|F>>>1)^(P<<24|F>>>8)^F>>>7,U=(F<<31|P>>>1)^(F<<24|P>>>8)^(F<<25|P>>>7),V=n[2*(e-2)],H=n[2*(e-2)+1],G=(H<<13|V>>>19)^(V<<3|H>>>29)^V>>>6,X=(V<<13|H>>>19)^(H<<3|V>>>29)^(V<<26|H>>>6),Z=n[2*(e-7)],W=n[2*(e-7)+1],K=n[2*(e-16)],J=n[2*(e-16)+1];i=U+W,r=z+Z+(U>>>0>i>>>0?1:0),i+=X,r+=G+(X>>>0>i>>>0?1:0),i+=J,r+=K+(J>>>0>i>>>0?1:0)}n[2*e]=r|=0,n[2*e+1]=i|=0;var Q=I&D^~I&M,Y=R&O^~R&L,$=x&T^x&A^T&A,te=k&S^k&j^S&j,ee=(k<<4|x>>>28)^(x<<30|k>>>2)^(x<<25|k>>>7),re=(x<<4|k>>>28)^(k<<30|x>>>2)^(k<<25|x>>>7),ie=(R<<18|I>>>14)^(R<<14|I>>>18)^(I<<23|R>>>9),ne=(I<<18|R>>>14)^(I<<14|R>>>18)^(R<<23|I>>>9),se=o[2*e],oe=o[2*e+1],ae=N+ne,ce=C+ie+(N>>>0>ae>>>0?1:0);ae+=Y,ce+=Q+(Y>>>0>ae>>>0?1:0),ae+=oe,ce+=se+(oe>>>0>ae>>>0?1:0),ae+=i,ce+=r+(i>>>0>ae>>>0?1:0);var ue=re+te,he=ee+$+(re>>>0>ue>>>0?1:0);C=M,N=L,M=D,L=O,D=I,O=R,R=0|q+ae,I=0|B+ce+(q>>>0>R>>>0?1:0),B=A,q=j,A=T,j=S,T=x,S=k,k=0|ae+ue,x=0|ce+he+(ae>>>0>k>>>0?1:0)}c=s[1]=0|c+k,s[0]=0|a+x+(k>>>0>c>>>0?1:0),h=s[3]=0|h+S,s[2]=0|u+T+(S>>>0>h>>>0?1:0),l=s[5]=0|l+j,s[4]=0|f+A+(j>>>0>l>>>0?1:0),p=s[7]=0|p+q,s[6]=0|_+B+(q>>>0>p>>>0?1:0),y=s[9]=0|y+R,s[8]=0|d+I+(R>>>0>y>>>0?1:0),v=s[11]=0|v+O,s[10]=0|m+D+(O>>>0>v>>>0?1:0),b=s[13]=0|b+L,s[12]=0|g+M+(L>>>0>b>>>0?1:0),E=s[15]=0|E+N,s[14]=0|w+C+(N>>>0>E>>>0?1:0)}},i.hash.sha1=function(t){t?(this._h=t._h.slice(0),this._buffer=t._buffer.slice(0),this._length=t._length):this.reset()},i.hash.sha1.hash=function(t){return(new i.hash.sha1).update(t).finalize()},i.hash.sha1.prototype={blockSize:512,reset:function(){return this._h=this._init.slice(0),this._buffer=[],this._length=0,this},update:function(t){"string"==typeof t&&(t=i.codec.utf8String.toBits(t));var e,r=this._buffer=i.bitArray.concat(this._buffer,t),n=this._length,s=this._length=n+i.bitArray.bitLength(t);for(e=this.blockSize+n&-this.blockSize;s>=e;e+=this.blockSize)this._block(r.splice(0,16));return this},finalize:function(){var t,e=this._buffer,r=this._h;for(e=i.bitArray.concat(e,[i.bitArray.partial(1,1)]),t=e.length+2;15&t;t++)e.push(0);for(e.push(Math.floor(this._length/4294967296)),e.push(0|this._length);e.length;)this._block(e.splice(0,16));return this.reset(),r},_init:[1732584193,4023233417,2562383102,271733878,3285377520],_key:[1518500249,1859775393,2400959708,3395469782],_f:function(t,e,r,i){return 19>=t?e&r|~e&i:39>=t?e^r^i:59>=t?e&r|e&i|r&i:79>=t?e^r^i:void 0},_S:function(t,e){return e<<t|e>>>32-t},_block:function(t){var e,r,i,n,s,o,a,c=t.slice(0),u=this._h;for(this._key,i=u[0],n=u[1],s=u[2],o=u[3],a=u[4],e=0;79>=e;e++)e>=16&&(c[e]=this._S(1,c[e-3]^c[e-8]^c[e-14]^c[e-16])),r=0|this._S(5,i)+this._f(e,n,s,o)+a+c[e]+this._key[Math.floor(e/20)],a=o,o=s,s=this._S(30,n),n=i,i=r;u[0]=0|u[0]+i,u[1]=0|u[1]+n,u[2]=0|u[2]+s,u[3]=0|u[3]+o,u[4]=0|u[4]+a}},i.mode.ccm={name:"ccm",encrypt:function(t,e,r,n,s){var o,a,c=e.slice(0),u=i.bitArray,h=u.bitLength(r)/8,f=u.bitLength(c)/8;if(s=s||64,n=n||[],7>h)throw new i.exception.invalid("ccm: iv must be at least 7 bytes");for(o=2;4>o&&f>>>8*o;o++);return 15-h>o&&(o=15-h),r=u.clamp(r,8*(15-o)),a=i.mode.ccm._computeTag(t,e,r,n,s,o),c=i.mode.ccm._ctrMode(t,c,r,a,s,o),u.concat(c.data,c.tag)},decrypt:function(t,e,r,n,s){s=s||64,n=n||[];var o,a,c=i.bitArray,u=c.bitLength(r)/8,h=c.bitLength(e),f=c.clamp(e,h-s),l=c.bitSlice(e,h-s);if(h=(h-s)/8,7>u)throw new i.exception.invalid("ccm: iv must be at least 7 bytes");for(o=2;4>o&&h>>>8*o;o++);if(15-u>o&&(o=15-u),r=c.clamp(r,8*(15-o)),f=i.mode.ccm._ctrMode(t,f,r,l,s,o),a=i.mode.ccm._computeTag(t,f.data,r,n,s,o),!c.equal(f.tag,a))throw new i.exception.corrupt("ccm: tag doesn't match");return f.data},_computeTag:function(t,e,r,n,s,o){var a,c,u,h=[],f=i.bitArray,l=f._xor4;if(s/=8,s%2||4>s||s>16)throw new i.exception.invalid("ccm: invalid tag length");if(n.length>4294967295||e.length>4294967295)throw new i.exception.bug("ccm: can't deal with 4GiB or more data");if(a=[f.partial(8,(n.length?64:0)|s-2<<2|o-1)],a=f.concat(a,r),a[3]|=f.bitLength(e)/8,a=t.encrypt(a),n.length)for(c=f.bitLength(n)/8,65279>=c?h=[f.partial(16,c)]:4294967295>=c&&(h=f.concat([f.partial(16,65534)],[c])),h=f.concat(h,n),u=0;u<h.length;u+=4)a=t.encrypt(l(a,h.slice(u,u+4).concat([0,0,0])));for(u=0;u<e.length;u+=4)a=t.encrypt(l(a,e.slice(u,u+4).concat([0,0,0])));return f.clamp(a,8*s)},_ctrMode:function(t,e,r,n,s,o){var a,c,u,h=i.bitArray,f=h._xor4,l=e.length,_=h.bitLength(e);if(u=h.concat([h.partial(8,o-1)],r).concat([0,0,0]).slice(0,4),n=h.bitSlice(f(n,t.encrypt(u)),0,s),!l)return{tag:n,data:[]};for(c=0;l>c;c+=4)u[3]++,a=t.encrypt(u),e[c]^=a[0],e[c+1]^=a[1],e[c+2]^=a[2],e[c+3]^=a[3];return{tag:n,data:h.clamp(e,_)}}},i.misc.hmac=function(t,e){this._hash=e=e||i.hash.sha256;var r,n=[[],[]],s=e.prototype.blockSize/32;for(this._baseHash=[new e,new e],t.length>s&&(t=e.hash(t)),r=0;s>r;r++)n[0][r]=909522486^t[r],n[1][r]=1549556828^t[r];this._baseHash[0].update(n[0]),this._baseHash[1].update(n[1])},i.misc.hmac.prototype.encrypt=i.misc.hmac.prototype.mac=function(t){var e=new this._hash(this._baseHash[0]).update(t).finalize();return new this._hash(this._baseHash[1]).update(e).finalize()},i.misc.pbkdf2=function(t,e,r,n,s){if(r=r||1e3,0>n||0>r)throw i.exception.invalid("invalid params to pbkdf2");"string"==typeof t&&(t=i.codec.utf8String.toBits(t)),s=s||i.misc.hmac;var o,a,c,u,h,f=new s(t),l=[],_=i.bitArray;for(h=1;32*l.length<(n||1);h++){for(o=a=f.encrypt(_.concat(e,[h])),c=1;r>c;c++)for(a=f.encrypt(a),u=0;u<a.length;u++)o[u]^=a[u];l=l.concat(o)}return n&&(l=_.clamp(l,n)),l},i.prng=function(t){this._pools=[new i.hash.sha256],this._poolEntropy=[0],this._reseedCount=0,this._robins={},this._eventId=0,this._collectorIds={},this._collectorIdNext=0,this._strength=0,this._poolStrength=0,this._nextReseed=0,this._key=[0,0,0,0,0,0,0,0],this._counter=[0,0,0,0],this._cipher=void 0,this._defaultParanoia=t,this._collectorsStarted=!1,this._callbacks={progress:{},seeded:{}},this._callbackI=0,this._NOT_READY=0,this._READY=1,this._REQUIRES_RESEED=2,this._MAX_WORDS_PER_BURST=65536,this._PARANOIA_LEVELS=[0,48,64,96,128,192,256,384,512,768,1024],this._MILLISECONDS_PER_RESEED=3e4,this._BITS_PER_RESEED=80},i.prng.prototype={randomWords:function(t,e){var r,n,s=[],o=this.isReady(e);if(o===this._NOT_READY)throw new i.exception.notReady("generator isn't seeded");for(o&this._REQUIRES_RESEED&&this._reseedFromPools(!(o&this._READY)),r=0;t>r;r+=4)0===(r+1)%this._MAX_WORDS_PER_BURST&&this._gate(),n=this._gen4words(),s.push(n[0],n[1],n[2],n[3]);return this._gate(),s.slice(0,t)},setDefaultParanoia:function(t){this._defaultParanoia=t},addEntropy:function(t,e,r){r=r||"user";var n,s,o,a=(new Date).valueOf(),c=this._robins[r],u=this.isReady(),h=0;switch(n=this._collectorIds[r],void 0===n&&(n=this._collectorIds[r]=this._collectorIdNext++),void 0===c&&(c=this._robins[r]=0),this._robins[r]=(this._robins[r]+1)%this._pools.length,typeof t){case"number":void 0===e&&(e=1),this._pools[c].update([n,this._eventId++,1,e,a,1,0|t]);break;case"object":var f=Object.prototype.toString.call(t);if("[object Uint32Array]"===f){for(o=[],s=0;s<t.length;s++)o.push(t[s]);t=o}else for("[object Array]"!==f&&(h=1),s=0;s<t.length&&!h;s++)"number"!=typeof t[s]&&(h=1);if(!h){if(void 0===e)for(e=0,s=0;s<t.length;s++)for(o=t[s];o>0;)e++,o>>>=1;this._pools[c].update([n,this._eventId++,2,e,a,t.length].concat(t))}break;case"string":void 0===e&&(e=t.length),this._pools[c].update([n,this._eventId++,3,e,a,t.length]),this._pools[c].update(t);break;default:h=1}if(h)throw new i.exception.bug("random: addEntropy only supports number, array of numbers or string");this._poolEntropy[c]+=e,this._poolStrength+=e,u===this._NOT_READY&&(this.isReady()!==this._NOT_READY&&this._fireEvent("seeded",Math.max(this._strength,this._poolStrength)),this._fireEvent("progress",this.getProgress()))},isReady:function(t){var e=this._PARANOIA_LEVELS[void 0!==t?t:this._defaultParanoia];return this._strength&&this._strength>=e?this._poolEntropy[0]>this._BITS_PER_RESEED&&(new Date).valueOf()>this._nextReseed?this._REQUIRES_RESEED|this._READY:this._READY:this._poolStrength>=e?this._REQUIRES_RESEED|this._NOT_READY:this._NOT_READY},getProgress:function(t){var e=this._PARANOIA_LEVELS[t?t:this._defaultParanoia];return this._strength>=e?1:this._poolStrength>e?1:this._poolStrength/e},startCollectors:function(){if(!this._collectorsStarted){if(window.addEventListener)window.addEventListener("load",this._loadTimeCollector,!1),window.addEventListener("mousemove",this._mouseCollector,!1);else{if(!document.attachEvent)throw new i.exception.bug("can't attach event");document.attachEvent("onload",this._loadTimeCollector),document.attachEvent("onmousemove",this._mouseCollector)}this._collectorsStarted=!0}},stopCollectors:function(){this._collectorsStarted&&(window.removeEventListener?(window.removeEventListener("load",this._loadTimeCollector,!1),window.removeEventListener("mousemove",this._mouseCollector,!1)):window.detachEvent&&(window.detachEvent("onload",this._loadTimeCollector),window.detachEvent("onmousemove",this._mouseCollector)),this._collectorsStarted=!1)},addEventListener:function(t,e){this._callbacks[t][this._callbackI++]=e},removeEventListener:function(t,e){var r,i,n=this._callbacks[t],s=[];for(i in n)n.hasOwnProperty(i)&&n[i]===e&&s.push(i);for(r=0;r<s.length;r++)i=s[r],delete n[i]},_gen4words:function(){for(var t=0;4>t&&(this._counter[t]=0|this._counter[t]+1,!this._counter[t]);t++);return this._cipher.encrypt(this._counter)},_gate:function(){this._key=this._gen4words().concat(this._gen4words()),this._cipher=new i.cipher.aes(this._key)},_reseed:function(t){this._key=i.hash.sha256.hash(this._key.concat(t)),this._cipher=new i.cipher.aes(this._key);for(var e=0;4>e&&(this._counter[e]=0|this._counter[e]+1,!this._counter[e]);e++);},_reseedFromPools:function(t){var e,r=[],n=0;for(this._nextReseed=r[0]=(new Date).valueOf()+this._MILLISECONDS_PER_RESEED,e=0;16>e;e++)r.push(0|4294967296*Math.random());for(e=0;e<this._pools.length&&(r=r.concat(this._pools[e].finalize()),n+=this._poolEntropy[e],this._poolEntropy[e]=0,t||!(this._reseedCount&1<<e));e++);this._reseedCount>=1<<this._pools.length&&(this._pools.push(new i.hash.sha256),this._poolEntropy.push(0)),this._poolStrength-=n,n>this._strength&&(this._strength=n),this._reseedCount++,this._reseed(r)},_mouseCollector:function(t){var e=t.x||t.clientX||t.offsetX||0,r=t.y||t.clientY||t.offsetY||0;i.random.addEntropy([e,r],2,"mouse")},_loadTimeCollector:function(){i.random.addEntropy((new Date).valueOf(),2,"loadtime")},_fireEvent:function(t,e){var r,n=i.random._callbacks[t],s=[];for(r in n)n.hasOwnProperty(r)&&s.push(n[r]);for(r=0;r<s.length;r++)s[r](e)}},i.random=new i.prng(6),function(){try{var t=new Uint32Array(32);crypto.getRandomValues(t),i.random.addEntropy(t,1024,"crypto.getRandomValues")}catch(e){}}(),i.json={defaults:{v:1,iter:1e3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(t,e,r,n){r=r||{},n=n||{};var s,o,a,c=i.json,u=c._add({iv:i.random.randomWords(4,0)},c.defaults);if(c._add(u,r),a=u.adata,"string"==typeof u.salt&&(u.salt=i.codec.base64.toBits(u.salt)),"string"==typeof u.iv&&(u.iv=i.codec.base64.toBits(u.iv)),!i.mode[u.mode]||!i.cipher[u.cipher]||"string"==typeof t&&u.iter<=100||64!==u.ts&&96!==u.ts&&128!==u.ts||128!==u.ks&&192!==u.ks&&256!==u.ks||u.iv.length<2||u.iv.length>4)throw new i.exception.invalid("json encrypt: invalid parameters");return"string"==typeof t?(s=i.misc.cachedPbkdf2(t,u),t=s.key.slice(0,u.ks/32),u.salt=s.salt):i.ecc&&t instanceof i.ecc.elGamal.publicKey&&(s=t.kem(),u.kemtag=s.tag,t=s.key.slice(0,u.ks/32)),"string"==typeof e&&(e=i.codec.utf8String.toBits(e)),"string"==typeof a&&(a=i.codec.utf8String.toBits(a)),o=new i.cipher[u.cipher](t),c._add(n,u),n.key=t,u.ct=i.mode[u.mode].encrypt(o,e,u.iv,a,u.ts),c.encode(u)},decrypt:function(t,e,r,n){r=r||{},n=n||{};var s,o,a,c=i.json,u=c._add(c._add(c._add({},c.defaults),c.decode(e)),r,!0),h=u.adata;if("string"==typeof u.salt&&(u.salt=i.codec.base64.toBits(u.salt)),"string"==typeof u.iv&&(u.iv=i.codec.base64.toBits(u.iv)),!i.mode[u.mode]||!i.cipher[u.cipher]||"string"==typeof t&&u.iter<=100||64!==u.ts&&96!==u.ts&&128!==u.ts||128!==u.ks&&192!==u.ks&&256!==u.ks||!u.iv||u.iv.length<2||u.iv.length>4)throw new i.exception.invalid("json decrypt: invalid parameters");return"string"==typeof t?(o=i.misc.cachedPbkdf2(t,u),t=o.key.slice(0,u.ks/32),u.salt=o.salt):i.ecc&&t instanceof i.ecc.elGamal.secretKey&&(t=t.unkem(i.codec.base64.toBits(u.kemtag)).slice(0,u.ks/32)),"string"==typeof h&&(h=i.codec.utf8String.toBits(h)),a=new i.cipher[u.cipher](t),s=i.mode[u.mode].decrypt(a,u.ct,u.iv,h,u.ts),c._add(n,u),n.key=t,i.codec.utf8String.fromBits(s)},encode:function(t){var e,r="{",n="";for(e in t)if(t.hasOwnProperty(e)){if(!e.match(/^[a-z0-9]+$/i))throw new i.exception.invalid("json encode: invalid property name");switch(r+=n+'"'+e+'":',n=",",typeof t[e]){case"number":case"boolean":r+=t[e];break;case"string":r+='"'+escape(t[e])+'"';break;case"object":r+='"'+i.codec.base64.fromBits(t[e],0)+'"';break;default:throw new i.exception.bug("json encode: unsupported type")}}return r+"}"},decode:function(t){if(t=t.replace(/\s/g,""),!t.match(/^\{.*\}$/))throw new i.exception.invalid("json decode: this isn't json!");var e,r,n=t.replace(/^\{|\}$/g,"").split(/,/),s={};for(e=0;e<n.length;e++){if(!(r=n[e].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))throw new i.exception.invalid("json decode: this isn't json!");s[r[2]]=r[3]?parseInt(r[3],10):r[2].match(/^(ct|salt|iv)$/)?i.codec.base64.toBits(r[4]):unescape(r[4])}return s},_add:function(t,e,r){if(void 0===t&&(t={}),void 0===e)return t;var n;for(n in e)if(e.hasOwnProperty(n)){if(r&&void 0!==t[n]&&t[n]!==e[n])throw new i.exception.invalid("required parameter overridden");t[n]=e[n]}return t},_subtract:function(t,e){var r,i={};for(r in t)t.hasOwnProperty(r)&&t[r]!==e[r]&&(i[r]=t[r]);return i},_filter:function(t,e){var r,i={};for(r=0;r<e.length;r++)void 0!==t[e[r]]&&(i[e[r]]=t[e[r]]);return i}},i.encrypt=i.json.encrypt,i.decrypt=i.json.decrypt,i.misc._pbkdf2Cache={},i.misc.cachedPbkdf2=function(t,e){var r,n,s,o,a=i.misc._pbkdf2Cache;return e=e||{},o=e.iter||1e3,n=a[t]=a[t]||{},r=n[o]=n[o]||{firstSalt:e.salt&&e.salt.length?e.salt.slice(0):i.random.randomWords(2,0)},s=void 0===e.salt?r.firstSalt:e.salt,r[s]=r[s]||i.misc.pbkdf2(t,s,e.iter),{key:r[s].slice(0),salt:s.slice(0)}},i.bn=function(t){this.initWith(t)},i.bn.prototype={radix:24,maxMul:8,_class:i.bn,copy:function(){return new this._class(this)},initWith:function(t){var e,r=0;switch(typeof t){case"object":this.limbs=t.limbs.slice(0);break;case"number":this.limbs=[t],this.normalize();break;case"string":for(t=t.replace(/^0x/,""),this.limbs=[],e=this.radix/4,r=0;r<t.length;r+=e)this.limbs.push(parseInt(t.substring(Math.max(t.length-r-e,0),t.length-r),16));
break;default:this.limbs=[0]}return this},equals:function(t){"number"==typeof t&&(t=new this._class(t));var e,r=0;for(this.fullReduce(),t.fullReduce(),e=0;e<this.limbs.length||e<t.limbs.length;e++)r|=this.getLimb(e)^t.getLimb(e);return 0===r},getLimb:function(t){return t>=this.limbs.length?0:this.limbs[t]},greaterEquals:function(t){"number"==typeof t&&(t=new this._class(t));var e,r,i,n=0,s=0;for(e=Math.max(this.limbs.length,t.limbs.length)-1;e>=0;e--)r=this.getLimb(e),i=t.getLimb(e),s|=i-r&~n,n|=r-i&~s;return(s|~n)>>>31},toString:function(){this.fullReduce();var t,e,r="",i=this.limbs;for(t=0;t<this.limbs.length;t++){for(e=i[t].toString(16);t<this.limbs.length-1&&e.length<6;)e="0"+e;r=e+r}return"0x"+r},addM:function(t){"object"!=typeof t&&(t=new this._class(t));var e,r=this.limbs,i=t.limbs;for(e=r.length;e<i.length;e++)r[e]=0;for(e=0;e<i.length;e++)r[e]+=i[e];return this},doubleM:function(){var t,e,r=0,i=this.radix,n=this.radixMask,s=this.limbs;for(t=0;t<s.length;t++)e=s[t],e=e+e+r,s[t]=e&n,r=e>>i;return r&&s.push(r),this},halveM:function(){var t,e,r=0,i=this.radix,n=this.limbs;for(t=n.length-1;t>=0;t--)e=n[t],n[t]=e+r>>1,r=(1&e)<<i;return n[n.length-1]||n.pop(),this},subM:function(t){"object"!=typeof t&&(t=new this._class(t));var e,r=this.limbs,i=t.limbs;for(e=r.length;e<i.length;e++)r[e]=0;for(e=0;e<i.length;e++)r[e]-=i[e];return this},mod:function(t){var e=!this.greaterEquals(new i.bn(0));t=new i.bn(t).normalize();var r=new i.bn(this).normalize(),n=0;for(e&&(r=new i.bn(0).subM(r).normalize());r.greaterEquals(t);n++)t.doubleM();for(e&&(r=t.sub(r).normalize());n>0;n--)t.halveM(),r.greaterEquals(t)&&r.subM(t).normalize();return r.trim()},inverseMod:function(t){var e,r,n=new i.bn(1),s=new i.bn(0),o=new i.bn(this),a=new i.bn(t),c=1;if(!(1&t.limbs[0]))throw new i.exception.invalid("inverseMod: p must be odd");do for(1&o.limbs[0]&&(o.greaterEquals(a)||(e=o,o=a,a=e,e=n,n=s,s=e),o.subM(a),o.normalize(),n.greaterEquals(s)||n.addM(t),n.subM(s)),o.halveM(),1&n.limbs[0]&&n.addM(t),n.normalize(),n.halveM(),r=c=0;r<o.limbs.length;r++)c|=o.limbs[r];while(c);if(!a.equals(1))throw new i.exception.invalid("inverseMod: p and x must be relatively prime");return s},add:function(t){return this.copy().addM(t)},sub:function(t){return this.copy().subM(t)},mul:function(t){"number"==typeof t&&(t=new this._class(t));var e,r,i,n=this.limbs,s=t.limbs,o=n.length,a=s.length,c=new this._class,u=c.limbs,h=this.maxMul;for(e=0;e<this.limbs.length+t.limbs.length+1;e++)u[e]=0;for(e=0;o>e;e++){for(i=n[e],r=0;a>r;r++)u[e+r]+=i*s[r];--h||(h=this.maxMul,c.cnormalize())}return c.cnormalize().reduce()},square:function(){return this.mul(this)},power:function(t){"number"==typeof t?t=[t]:void 0!==t.limbs&&(t=t.normalize().limbs);var e,r,i=new this._class(1),n=this;for(e=0;e<t.length;e++)for(r=0;r<this.radix;r++)t[e]&1<<r&&(i=i.mul(n)),n=n.square();return i},mulmod:function(t,e){return this.mod(e).mul(t.mod(e)).mod(e)},powermod:function(t,e){for(var r=new i.bn(1),n=new i.bn(this),s=new i.bn(t);;){if(1&s.limbs[0]&&(r=r.mulmod(n,e)),s.halveM(),s.equals(0))break;n=n.mulmod(n,e)}return r.normalize().reduce()},trim:function(){var t,e=this.limbs;do t=e.pop();while(e.length&&0===t);return e.push(t),this},reduce:function(){return this},fullReduce:function(){return this.normalize()},normalize:function(){var t,e,r,i=0,n=(this.placeVal,this.ipv),s=this.limbs,o=s.length,a=this.radixMask;for(t=0;o>t||0!==i&&-1!==i;t++)e=(s[t]||0)+i,r=s[t]=e&a,i=(e-r)*n;return-1===i&&(s[t-1]-=this.placeVal),this},cnormalize:function(){var t,e,r,i=0,n=this.ipv,s=this.limbs,o=s.length,a=this.radixMask;for(t=0;o-1>t;t++)e=s[t]+i,r=s[t]=e&a,i=(e-r)*n;return s[t]+=i,this},toBits:function(t){this.fullReduce(),t=t||this.exponent||this.bitLength();var e=Math.floor((t-1)/24),r=i.bitArray,n=(-8&t+7)%this.radix||this.radix,s=[r.partial(n,this.getLimb(e))];for(e--;e>=0;e--)s=r.concat(s,[r.partial(Math.min(this.radix,t),this.getLimb(e))]),t-=this.radix;return s},bitLength:function(){this.fullReduce();for(var t=this.radix*(this.limbs.length-1),e=this.limbs[this.limbs.length-1];e;e>>>=1)t++;return-8&t+7}},i.bn.fromBits=function(t){var e=this,r=new e,n=[],s=i.bitArray,o=this.prototype,a=Math.min(this.bitLength||4294967296,s.bitLength(t)),c=a%o.radix||o.radix;for(n[0]=s.extract(t,0,c);a>c;c+=o.radix)n.unshift(s.extract(t,c,o.radix));return r.limbs=n,r},i.bn.prototype.ipv=1/(i.bn.prototype.placeVal=Math.pow(2,i.bn.prototype.radix)),i.bn.prototype.radixMask=(1<<i.bn.prototype.radix)-1,i.bn.pseudoMersennePrime=function(t,e){function r(t){this.initWith(t)}var n,s,o,a=r.prototype=new i.bn;for(o=a.modOffset=Math.ceil(s=t/a.radix),a.exponent=t,a.offset=[],a.factor=[],a.minOffset=o,a.fullMask=0,a.fullOffset=[],a.fullFactor=[],a.modulus=r.modulus=new i.bn(Math.pow(2,t)),a.fullMask=0|-Math.pow(2,t%a.radix),n=0;n<e.length;n++)a.offset[n]=Math.floor(e[n][0]/a.radix-s),a.fullOffset[n]=Math.ceil(e[n][0]/a.radix-s),a.factor[n]=e[n][1]*Math.pow(.5,t-e[n][0]+a.offset[n]*a.radix),a.fullFactor[n]=e[n][1]*Math.pow(.5,t-e[n][0]+a.fullOffset[n]*a.radix),a.modulus.addM(new i.bn(Math.pow(2,e[n][0])*e[n][1])),a.minOffset=Math.min(a.minOffset,-a.offset[n]);return a._class=r,a.modulus.cnormalize(),a.reduce=function(){var t,e,r,i,n=this.modOffset,s=this.limbs,o=this.offset,a=this.offset.length,c=this.factor;for(t=this.minOffset;s.length>n;){for(r=s.pop(),i=s.length,e=0;a>e;e++)s[i+o[e]]-=c[e]*r;t--,t||(s.push(0),this.cnormalize(),t=this.minOffset)}return this.cnormalize(),this},a._strongReduce=-1===a.fullMask?a.reduce:function(){var t,e,r=this.limbs,i=r.length-1;if(this.reduce(),i===this.modOffset-1){for(e=r[i]&this.fullMask,r[i]-=e,t=0;t<this.fullOffset.length;t++)r[i+this.fullOffset[t]]-=this.fullFactor[t]*e;this.normalize()}},a.fullReduce=function(){var t,e;for(this._strongReduce(),this.addM(this.modulus),this.addM(this.modulus),this.normalize(),this._strongReduce(),e=this.limbs.length;e<this.modOffset;e++)this.limbs[e]=0;for(t=this.greaterEquals(this.modulus),e=0;e<this.limbs.length;e++)this.limbs[e]-=this.modulus.limbs[e]*t;return this.cnormalize(),this},a.inverse=function(){return this.power(this.modulus.sub(2))},r.fromBits=i.bn.fromBits,r},i.bn.prime={p127:i.bn.pseudoMersennePrime(127,[[0,-1]]),p25519:i.bn.pseudoMersennePrime(255,[[0,-19]]),p192:i.bn.pseudoMersennePrime(192,[[0,-1],[64,-1]]),p224:i.bn.pseudoMersennePrime(224,[[0,1],[96,-1]]),p256:i.bn.pseudoMersennePrime(256,[[0,-1],[96,1],[192,1],[224,-1]]),p384:i.bn.pseudoMersennePrime(384,[[0,-1],[32,1],[96,-1],[128,-1]]),p521:i.bn.pseudoMersennePrime(521,[[0,-1]])},i.bn.random=function(t,e){"object"!=typeof t&&(t=new i.bn(t));for(var r,n,s=t.limbs.length,o=t.limbs[s-1]+1,a=new i.bn;;){do r=i.random.randomWords(s,e),r[s-1]<0&&(r[s-1]+=4294967296);while(Math.floor(r[s-1]/o)===Math.floor(4294967296/o));for(r[s-1]%=o,n=0;s-1>n;n++)r[n]&=t.radixMask;if(a.limbs=r,!a.greaterEquals(t))return a}},i.ecc={},i.ecc.point=function(t,e,r){void 0===e?this.isIdentity=!0:(this.x=e,this.y=r,this.isIdentity=!1),this.curve=t},i.ecc.point.prototype={toJac:function(){return new i.ecc.pointJac(this.curve,this.x,this.y,new this.curve.field(1))},mult:function(t){return this.toJac().mult(t,this).toAffine()},mult2:function(t,e,r){return this.toJac().mult2(t,this,e,r).toAffine()},multiples:function(){var t,e,r;if(void 0===this._multiples)for(r=this.toJac().doubl(),t=this._multiples=[new i.ecc.point(this.curve),this,r.toAffine()],e=3;16>e;e++)r=r.add(this),t.push(r.toAffine());return this._multiples},isValid:function(){return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))))},toBits:function(){return i.bitArray.concat(this.x.toBits(),this.y.toBits())}},i.ecc.pointJac=function(t,e,r,i){void 0===e?this.isIdentity=!0:(this.x=e,this.y=r,this.z=i,this.isIdentity=!1),this.curve=t},i.ecc.pointJac.prototype={add:function(t){var e,r,n,s,o,a,c,u,h,f,l,_=this;if(_.curve!==t.curve)throw"sjcl.ecc.add(): Points must be on the same curve to add them!";return _.isIdentity?t.toJac():t.isIdentity?_:(e=_.z.square(),r=t.x.mul(e).subM(_.x),r.equals(0)?_.y.equals(t.y.mul(e.mul(_.z)))?_.doubl():new i.ecc.pointJac(_.curve):(n=t.y.mul(e.mul(_.z)).subM(_.y),s=r.square(),o=n.square(),a=r.square().mul(r).addM(_.x.add(_.x).mul(s)),c=o.subM(a),u=_.x.mul(s).subM(c).mul(n),h=_.y.mul(r.square().mul(r)),f=u.subM(h),l=_.z.mul(r),new i.ecc.pointJac(this.curve,c,f,l)))},doubl:function(){if(this.isIdentity)return this;var t=this.y.square(),e=t.mul(this.x.mul(4)),r=t.square().mul(8),n=this.z.square(),s=this.x.sub(n).mul(3).mul(this.x.add(n)),o=s.square().subM(e).subM(e),a=e.sub(o).mul(s).subM(r),c=this.y.add(this.y).mul(this.z);return new i.ecc.pointJac(this.curve,o,a,c)},toAffine:function(){if(this.isIdentity||this.z.equals(0))return new i.ecc.point(this.curve);var t=this.z.inverse(),e=t.square();return new i.ecc.point(this.curve,this.x.mul(e).fullReduce(),this.y.mul(e.mul(t)).fullReduce())},mult:function(t,e){"number"==typeof t?t=[t]:void 0!==t.limbs&&(t=t.normalize().limbs);var r,n,s=new i.ecc.point(this.curve).toJac(),o=e.multiples();for(r=t.length-1;r>=0;r--)for(n=i.bn.prototype.radix-4;n>=0;n-=4)s=s.doubl().doubl().doubl().doubl().add(o[15&t[r]>>n]);return s},mult2:function(t,e,r,n){"number"==typeof t?t=[t]:void 0!==t.limbs&&(t=t.normalize().limbs),"number"==typeof r?r=[r]:void 0!==r.limbs&&(r=r.normalize().limbs);var s,o,a,c,u=new i.ecc.point(this.curve).toJac(),h=e.multiples(),f=n.multiples();for(s=Math.max(t.length,r.length)-1;s>=0;s--)for(a=0|t[s],c=0|r[s],o=i.bn.prototype.radix-4;o>=0;o-=4)u=u.doubl().doubl().doubl().doubl().add(h[15&a>>o]).add(f[15&c>>o]);return u},isValid:function(){var t=this.z.square(),e=t.square(),r=e.mul(t);return this.y.square().equals(this.curve.b.mul(r).add(this.x.mul(this.curve.a.mul(e).add(this.x.square()))))}},i.ecc.curve=function(t,e,r,n,s,o){this.field=t,this.r=t.prototype.modulus.sub(e),this.a=new t(r),this.b=new t(n),this.G=new i.ecc.point(this,new t(s),new t(o))},i.ecc.curve.prototype.fromBits=function(t){var e=i.bitArray,r=-8&this.field.prototype.exponent+7,n=new i.ecc.point(this,this.field.fromBits(e.bitSlice(t,0,r)),this.field.fromBits(e.bitSlice(t,r,2*r)));if(!n.isValid())throw new i.exception.corrupt("not on the curve!");return n},i.ecc.curves={c192:new i.ecc.curve(i.bn.prime.p192,"0x662107c8eb94364e4b2dd7ce",-3,"0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1","0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012","0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),c224:new i.ecc.curve(i.bn.prime.p224,"0xe95c1f470fc1ec22d6baa3a3d5c4",-3,"0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4","0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21","0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),c256:new i.ecc.curve(i.bn.prime.p256,"0x4319055358e8617b0c46353d039cdaae",-3,"0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b","0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296","0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),c384:new i.ecc.curve(i.bn.prime.p384,"0x389cb27e0bc8d21fa7e5f24cb74f58851313e696333ad68c",-3,"0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef","0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7","0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")},i.ecc._dh=function(t){i.ecc[t]={publicKey:function(t,e){this._curve=t,this._curveBitLength=t.r.bitLength(),this._point=e instanceof Array?t.fromBits(e):e,this.get=function(){var t=this._point.toBits(),e=i.bitArray.bitLength(t),r=i.bitArray.bitSlice(t,0,e/2),n=i.bitArray.bitSlice(t,e/2);return{x:r,y:n}}},secretKey:function(t,e){this._curve=t,this._curveBitLength=t.r.bitLength(),this._exponent=e,this.get=function(){return this._exponent.toBits()}},generateKeys:function(e,r,n){if(void 0===e&&(e=256),"number"==typeof e&&(e=i.ecc.curves["c"+e],void 0===e))throw new i.exception.invalid("no such curve");if(void 0===n)var n=i.bn.random(e.r,r);var s=e.G.mult(n);return{pub:new i.ecc[t].publicKey(e,s),sec:new i.ecc[t].secretKey(e,n)}}}},i.ecc._dh("elGamal"),i.ecc.elGamal.publicKey.prototype={kem:function(t){var e=i.bn.random(this._curve.r,t),r=this._curve.G.mult(e).toBits(),n=i.hash.sha256.hash(this._point.mult(e).toBits());return{key:n,tag:r}}},i.ecc.elGamal.secretKey.prototype={unkem:function(t){return i.hash.sha256.hash(this._curve.fromBits(t).mult(this._exponent).toBits())},dh:function(t){return i.hash.sha256.hash(t._point.mult(this._exponent).toBits())}},i.ecc._dh("ecdsa"),i.ecc.ecdsa.secretKey.prototype={sign:function(t,e,r,n){i.bitArray.bitLength(t)>this._curveBitLength&&(t=i.bitArray.clamp(t,this._curveBitLength));var s=this._curve.r,o=s.bitLength(),a=n||i.bn.random(s.sub(1),e).add(1),c=this._curve.G.mult(a).x.mod(s),u=i.bn.fromBits(t).add(c.mul(this._exponent)),h=r?u.inverseMod(s).mul(a).mod(s):u.mul(a.inverseMod(s)).mod(s);return i.bitArray.concat(c.toBits(o),h.toBits(o))}},i.ecc.ecdsa.publicKey.prototype={verify:function(t,e,r){i.bitArray.bitLength(t)>this._curveBitLength&&(t=i.bitArray.clamp(t,this._curveBitLength));var n=i.bitArray,s=this._curve.r,o=this._curveBitLength,a=i.bn.fromBits(n.bitSlice(e,0,o)),c=i.bn.fromBits(n.bitSlice(e,o,2*o)),u=r?c:c.inverseMod(s),h=i.bn.fromBits(t).mul(u).mod(s),f=a.mul(u).mod(s),l=this._curve.G.mult2(h,f,this._point).x;if(a.equals(0)||c.equals(0)||a.greaterEquals(s)||c.greaterEquals(s)||!l.equals(a)){if(void 0===r)return this.verify(t,e,!0);throw new i.exception.corrupt("signature didn't check out")}return!0}},i.keyexchange.srp={makeVerifier:function(t,e,r,n){var s;return s=i.keyexchange.srp.makeX(t,e,r),s=i.bn.fromBits(s),n.g.powermod(s,n.N)},makeX:function(t,e,r){var n=i.hash.sha1.hash(t+":"+e);return i.hash.sha1.hash(i.bitArray.concat(r,n))},knownGroup:function(t){return"string"!=typeof t&&(t=t.toString()),i.keyexchange.srp._didInitKnownGroups||i.keyexchange.srp._initKnownGroups(),i.keyexchange.srp._knownGroups[t]},_didInitKnownGroups:!1,_initKnownGroups:function(){var t,e,r;for(t=0;t<i.keyexchange.srp._knownGroupSizes.length;t++)e=i.keyexchange.srp._knownGroupSizes[t].toString(),r=i.keyexchange.srp._knownGroups[e],r.N=new i.bn(r.N),r.g=new i.bn(r.g);i.keyexchange.srp._didInitKnownGroups=!0},_knownGroupSizes:[1024,1536,2048],_knownGroups:{1024:{N:"EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3",g:2},1536:{N:"9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA9614B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F84380B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0BE3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF56EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734AF7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB",g:2},2048:{N:"AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB694B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73",g:2}}},i.ecc.curves.c256=new i.ecc.curve(i.bn.pseudoMersennePrime(256,[[0,-1],[4,-1],[6,-1],[7,-1],[8,-1],[9,-1],[32,-1]]),"0x14551231950b75fc4402da1722fc9baee",0,7,"0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"),i.ecc.pointJac.prototype.add=function(t){var e=this;if(e.curve!==t.curve)throw"sjcl.ecc.add(): Points must be on the same curve to add them!";if(e.isIdentity)return t.toJac();if(t.isIdentity)return e;var r=e.z.square(),n=t.x.mul(r).subM(e.x),s=t.y.mul(e.z).mul(r);if(n.equals(0))return e.y.equals(t.y.mul(r.mul(e.z)))?e.doubl():new i.ecc.pointJac(e.curve);var o=n.square(),a=o.copy().doubleM().doubleM(),c=n.mul(a),u=s.sub(e.y).doubleM(),h=e.x.mul(a),f=u.square().subM(c).subM(h.copy().doubleM()),l=u.mul(h.sub(f)).subM(e.y.mul(c).doubleM()),_=e.z.add(n).square().subM(r).subM(o);return new i.ecc.pointJac(this.curve,f,l,_)},i.ecc.pointJac.prototype.doubl=function(){if(this.isIdentity)return this;var t=this.x.square(),e=this.y.square(),r=e.square(),n=this.x.add(e).square().subM(t).subM(r).doubleM(),s=t.mul(3),o=s.square(),a=o.sub(n.copy().doubleM()),c=s.mul(n.sub(a)).subM(r.doubleM().doubleM().doubleM()),u=this.y.mul(this.z).doubleM();return new i.ecc.pointJac(this.curve,a,c,u)},i.ecc.point.prototype.toBytesCompressed=function(){var t="0x0"==this.y.mod(2).toString()?2:3;return[t].concat(i.codec.bytes.fromBits(this.x.toBits()))},function(){function t(t,e,r){return t^e^r}function e(t,e,r){return t&e|~t&r}function r(t,e,r){return(t|~e)^r}function n(t,e,r){return t&r|e&~r}function s(t,e,r){return t^(e|~r)}function o(t,e){return t<<e|t>>>32-e}function a(t){return(255&t)<<24|(65280&t)<<8|(t&255<<16)>>>8|(t&255<<24)>>>24}function c(i){for(var a,c=this._h[0],u=this._h[1],l=this._h[2],_=this._h[3],v=this._h[4],g=this._h[0],b=this._h[1],w=this._h[2],E=this._h[3],x=this._h[4],k=0;16>k;++k)a=o(c+t(u,l,_)+i[p[k]]+h[k],y[k])+v,c=v,v=_,_=o(l,10),l=u,u=a,a=o(g+s(b,w,E)+i[d[k]]+f[k],m[k])+x,g=x,x=E,E=o(w,10),w=b,b=a;for(;32>k;++k)a=o(c+e(u,l,_)+i[p[k]]+h[k],y[k])+v,c=v,v=_,_=o(l,10),l=u,u=a,a=o(g+n(b,w,E)+i[d[k]]+f[k],m[k])+x,g=x,x=E,E=o(w,10),w=b,b=a;for(;48>k;++k)a=o(c+r(u,l,_)+i[p[k]]+h[k],y[k])+v,c=v,v=_,_=o(l,10),l=u,u=a,a=o(g+r(b,w,E)+i[d[k]]+f[k],m[k])+x,g=x,x=E,E=o(w,10),w=b,b=a;for(;64>k;++k)a=o(c+n(u,l,_)+i[p[k]]+h[k],y[k])+v,c=v,v=_,_=o(l,10),l=u,u=a,a=o(g+e(b,w,E)+i[d[k]]+f[k],m[k])+x,g=x,x=E,E=o(w,10),w=b,b=a;for(;80>k;++k)a=o(c+s(u,l,_)+i[p[k]]+h[k],y[k])+v,c=v,v=_,_=o(l,10),l=u,u=a,a=o(g+t(b,w,E)+i[d[k]]+f[k],m[k])+x,g=x,x=E,E=o(w,10),w=b,b=a;a=this._h[1]+l+E,this._h[1]=this._h[2]+_+x,this._h[2]=this._h[3]+v+g,this._h[3]=this._h[4]+c+b,this._h[4]=this._h[0]+u+w,this._h[0]=a}i.hash.ripemd160=function(t){t?(this._h=t._h.slice(0),this._buffer=t._buffer.slice(0),this._length=t._length):this.reset()},i.hash.ripemd160.hash=function(t){return(new i.hash.ripemd160).update(t).finalize()},i.hash.ripemd160.prototype={reset:function(){return this._h=u.slice(0),this._buffer=[],this._length=0,this},update:function(t){"string"==typeof t&&(t=i.codec.utf8String.toBits(t));var e,r=this._buffer=i.bitArray.concat(this._buffer,t),n=this._length,s=this._length=n+i.bitArray.bitLength(t);for(e=-512&512+n;s>=e;e+=512){for(var o=r.splice(0,16),u=0;16>u;++u)o[u]=a(o[u]);c.call(this,o)}return this},finalize:function(){var t=i.bitArray.concat(this._buffer,[i.bitArray.partial(1,1)]),e=(this._length+1)%512,r=(e>448?512:448)-e%448,n=r%32;for(n>0&&(t=i.bitArray.concat(t,[i.bitArray.partial(n,0)]));r>=32;r-=32)t.push(0);for(t.push(a(0|this._length)),t.push(a(Math.floor(this._length/4294967296)));t.length;){for(var s=t.splice(0,16),o=0;16>o;++o)s[o]=a(s[o]);c.call(this,s)}var u=this._h;this.reset();for(var o=0;5>o;++o)u[o]=a(u[o]);return u}};for(var u=[1732584193,4023233417,2562383102,271733878,3285377520],h=[0,1518500249,1859775393,2400959708,2840853838],f=[1352829926,1548603684,1836072691,2053994217,0],l=4;l>=0;--l)for(var _=1;16>_;++_)h.splice(l,0,h[l]),f.splice(l,0,f[l]);var p=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],d=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],y=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],m=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]}(),i.bn.ZERO=new i.bn(0),i.bn.prototype.divRem=function(t){"object"!=typeof t&&(t=new this._class(t));var e=this.abs(),r=t.abs(),n=new this._class(0),s=0;if(!e.greaterEquals(r))return[new i.bn(0),this.copy()];if(e.equals(r))return[new i.bn(1),new i.bn(0)];for(;e.greaterEquals(r);s++)r.doubleM();for(;s>0;s--)n.doubleM(),r.halveM(),e.greaterEquals(r)&&(n.addM(1),e.subM(t).normalize());return[n,e]},i.bn.prototype.divRound=function(t){var e=this.divRem(t),r=e[0],i=e[1];return i.doubleM().greaterEquals(t)&&r.addM(1),r},i.bn.prototype.div=function(t){var e=this.divRem(t);return e[0]},i.bn.prototype.sign=function(){return this.greaterEquals(i.bn.ZERO)?1:-1},i.bn.prototype.neg=function(){return i.bn.ZERO.sub(this)},i.bn.prototype.abs=function(){return-1===this.sign()?this.neg():this},i.bn.prototype.shiftRight=function(t){if("number"!=typeof t)throw new Error("shiftRight expects a number");if(t=+t,0>t)return this.shiftLeft(t);for(var e=new i.bn(this);t>=this.radix;)e.limbs.shift(),t-=this.radix;for(;t--;)e.halveM();return e},i.bn.prototype.shiftLeft=function(t){if("number"!=typeof t)throw new Error("shiftLeft expects a number");if(t=+t,0>t)return this.shiftRight(t);for(var e=new i.bn(this);t>=this.radix;)e.limbs.unshift(0),t-=this.radix;for(;t--;)e.doubleM();return e},i.bn.prototype.toNumber=function(){return 0|this.limbs[0]},i.bn.prototype.testBit=function(t){var e=Math.floor(t/this.radix),r=t%this.radix;return e>=this.limbs.length?0:1&this.limbs[e]>>>r},i.bn.prototype.setBitM=function(t){for(var e=Math.floor(t/this.radix),r=t%this.radix;e>=this.limbs.length;)this.limbs.push(0);return this.limbs[e]|=1<<r,this.cnormalize(),this},i.bn.prototype.modInt=function(t){return this.toNumber()%t},i.bn.prototype.invDigit=function(){var t=1+this.radixMask;if(this.limbs.length<1)return 0;var e=this.limbs[0];if(0==(1&e))return 0;var r=3&e;return r=15&r*(2-(15&e)*r),r=255&r*(2-(255&e)*r),r=65535&r*(2-(65535&(65535&e)*r)),r=r*(2-e*r%t)%t,r>0?t-r:-r},i.bn.prototype.am=function(t,e,r,i,n,s){for(var o=4095&e,a=e>>12;--s>=0;){var c=4095&this.limbs[t],u=this.limbs[t++]>>12,h=a*c+u*o;c=o*c+((4095&h)<<12)+r.limbs[i]+n,n=(c>>24)+(h>>12)+a*u,r.limbs[i++]=16777215&c}return n};var n=function(t){this.m=t,this.mt=t.limbs.length,this.mt2=2*this.mt,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.radix-15)-1};n.prototype.reduce=function(t){for(var e=t.radixMask+1;t.limbs.length<=this.mt2;)t.limbs[t.limbs.length]=0;for(var r=0;r<this.mt;++r){var i=32767&t.limbs[r],n=i*this.mpl+((i*this.mph+(t.limbs[r]>>15)*this.mpl&this.um)<<15)&t.radixMask;for(i=r+this.mt,t.limbs[i]+=this.m.am(0,n,t,r,0,this.mt);t.limbs[i]>=e;)t.limbs[i]-=e,t.limbs[++i]++}return t.trim(),t=t.shiftRight(this.mt*this.m.radix),t.greaterEquals(this.m)&&(t=t.sub(this.m)),t.trim().normalize().reduce()},n.prototype.square=function(t){return this.reduce(t.square())},n.prototype.multiply=function(t,e){return this.reduce(t.mul(e))},n.prototype.convert=function(t){return t.abs().shiftLeft(this.mt*this.m.radix).mod(this.m)},n.prototype.revert=function(t){return this.reduce(t.copy())},i.bn.prototype.powermodMontgomery=function(t,e){var i,s=t.bitLength(),o=new this._class(1);if(0>=s)return o;if(i=18>s?1:48>s?3:144>s?4:768>s?5:6,8>s||!e.testBit(0))return this.powermod(t,e);var a=new n(e);t.trim().normalize();var c=new Array,u=3,h=i-1,f=(1<<i)-1;if(c[1]=a.convert(this),i>1)for(var l=a.square(c[1]);f>=u;)c[u]=a.multiply(l,c[u-2]),u+=2;var _,p,d=t.limbs.length-1,y=!0,m=new this._class;for(s=r(t.limbs[d])-1;d>=0;){for(s>=h?_=t.limbs[d]>>s-h&f:(_=(t.limbs[d]&(1<<s+1)-1)<<h-s,d>0&&(_|=t.limbs[d-1]>>this.radix+s-h)),u=i;0==(1&_);)_>>=1,--u;if((s-=u)<0&&(s+=this.radix,--d),y)o=c[_].copy(),y=!1;else{for(;u>1;)m=a.square(o),o=a.square(m),u-=2;u>0?m=a.square(o):(p=o,o=m,m=p),o=a.multiply(m,c[_])}for(;d>=0&&0==(t.limbs[d]&1<<s);)m=a.square(o),p=o,o=m,m=p,--s<0&&(s=this.radix-1,--d)}return a.revert(o)},i.ecc.ecdsa.secretKey.prototype={sign:function(t,e){var r=this._curve.r,n=r.bitLength(),s=i.bn.random(r.sub(1),e).add(1),o=this._curve.G.mult(s).x.mod(r),a=i.bn.fromBits(t).add(o.mul(this._exponent)).mul(s.inverseMod(r)).mod(r);return i.bitArray.concat(o.toBits(n),a.toBits(n))}},i.ecc.ecdsa.publicKey.prototype={verify:function(t,e){var r=i.bitArray,n=this._curve.r,s=n.bitLength(),o=i.bn.fromBits(r.bitSlice(e,0,s)),a=i.bn.fromBits(r.bitSlice(e,s,2*s)),c=a.modInverse(n),u=i.bn.fromBits(t).mul(c).mod(n),h=o.mul(c).mod(n),f=this._curve.G.mult2(u,h,this._point).x;if(o.equals(0)||a.equals(0)||o.greaterEquals(n)||a.greaterEquals(n)||!f.equals(o))throw new i.exception.corrupt("signature didn't check out");return!0}},i.ecc.ecdsa.secretKey.prototype.signDER=function(t,e){return this.encodeDER(this.sign(t,e))},i.ecc.ecdsa.secretKey.prototype.encodeDER=function(t){for(var e=i.bitArray,r=this._curve.r,n=r.bitLength(),s=i.codec.bytes.fromBits(e.bitSlice(t,0,n)),o=i.codec.bytes.fromBits(e.bitSlice(t,n,2*n));!s[0]&&s.length;)s.shift();for(;!o[0]&&o.length;)o.shift();128&s[0]&&s.unshift(0),128&o[0]&&o.unshift(0);var a=[].concat(48,4+s.length+o.length,2,s.length,s,2,o.length,o);return i.codec.bytes.toBits(a)},i.bn.prototype.jacobi=function(t){var e=this;if(t=new i.bn(t),-1!==t.sign()){if(e.equals(0))return 0;if(e.equals(1))return 1;for(var r=0,n=0;!e.testBit(n);)n++;var s=e.shiftRight(n);if(0===(1&n))r=1;else{var o=t.modInt(8);1===o||7===o?r=1:(3===o||5===o)&&(r=-1)}return 3===t.modInt(4)&&3===s.modInt(4)&&(r=-r),s.equals(1)?r:r*t.mod(s).jacobi(s)}}}(r,r(41)(t))},28:function(t,e){function r(t,e,r){null!=t&&("number"==typeof t?this.fromNumber(t,e,r):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}function i(){return new r(null)}function n(t,e,r,i,n,s){for(;--s>=0;){var o=e*this[t++]+r[i]+n;n=Math.floor(o/67108864),r[i++]=67108863&o}return n}function s(t,e,r,i,n,s){for(var o=32767&e,a=e>>15;--s>=0;){var c=32767&this[t],u=this[t++]>>15,h=a*c+u*o;c=o*c+((32767&h)<<15)+r[i]+(1073741823&n),n=(c>>>30)+(h>>>15)+a*u+(n>>>30),r[i++]=1073741823&c}return n}function o(t,e,r,i,n,s){for(var o=16383&e,a=e>>14;--s>=0;){var c=16383&this[t],u=this[t++]>>14,h=a*c+u*o;c=o*c+((16383&h)<<14)+r[i]+n,n=(c>>28)+(h>>14)+a*u,r[i++]=268435455&c}return n}function a(t){return or.charAt(t)}function c(t,e){var r=ar[t.charCodeAt(e)];return null==r?-1:r}function u(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e];t.t=this.t,t.s=this.s}function h(t){this.t=1,this.s=0>t?-1:0,t>0?this[0]=t:-1>t?this[0]=t+this.DV:this.t=0}function f(t){var e=i();return e.fromInt(t),e}function l(t,e){var i;if(16==e)i=4;else if(8==e)i=3;else if(256==e)i=8;else if(2==e)i=1;else if(32==e)i=5;else{if(4!=e)return this.fromRadix(t,e),void 0;i=2}this.t=0,this.s=0;for(var n=t.length,s=!1,o=0;--n>=0;){var a=8==i?255&t[n]:c(t,n);0>a?"-"==t.charAt(n)&&(s=!0):(s=!1,0==o?this[this.t++]=a:o+i>this.DB?(this[this.t-1]|=(a&(1<<this.DB-o)-1)<<o,this[this.t++]=a>>this.DB-o):this[this.t-1]|=a<<o,o+=i,o>=this.DB&&(o-=this.DB))}8==i&&0!=(128&t[0])&&(this.s=-1,o>0&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),s&&r.ZERO.subTo(this,this)}function _(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t}function p(t){if(this.s<0)return"-"+this.negate().toString(t);var e;if(16==t)e=4;else if(8==t)e=3;else if(2==t)e=1;else if(32==t)e=5;else{if(4!=t)return this.toRadix(t);e=2}var r,i=(1<<e)-1,n=!1,s="",o=this.t,c=this.DB-o*this.DB%e;if(o-->0)for(c<this.DB&&(r=this[o]>>c)>0&&(n=!0,s=a(r));o>=0;)e>c?(r=(this[o]&(1<<c)-1)<<e-c,r|=this[--o]>>(c+=this.DB-e)):(r=this[o]>>(c-=e)&i,0>=c&&(c+=this.DB,--o)),r>0&&(n=!0),n&&(s+=a(r));return n?s:"0"}function d(){var t=i();return r.ZERO.subTo(this,t),t}function y(){return this.s<0?this.negate():this}function m(t){var e=this.s-t.s;if(0!=e)return e;var r=this.t;if(e=r-t.t,0!=e)return this.s<0?-e:e;for(;--r>=0;)if(0!=(e=this[r]-t[r]))return e;return 0}function v(t){var e,r=1;return 0!=(e=t>>>16)&&(t=e,r+=16),0!=(e=t>>8)&&(t=e,r+=8),0!=(e=t>>4)&&(t=e,r+=4),0!=(e=t>>2)&&(t=e,r+=2),0!=(e=t>>1)&&(t=e,r+=1),r}function g(){return this.t<=0?0:this.DB*(this.t-1)+v(this[this.t-1]^this.s&this.DM)}function b(t,e){var r;for(r=this.t-1;r>=0;--r)e[r+t]=this[r];for(r=t-1;r>=0;--r)e[r]=0;e.t=this.t+t,e.s=this.s}function w(t,e){for(var r=t;r<this.t;++r)e[r-t]=this[r];e.t=Math.max(this.t-t,0),e.s=this.s}function E(t,e){var r,i=t%this.DB,n=this.DB-i,s=(1<<n)-1,o=Math.floor(t/this.DB),a=this.s<<i&this.DM;for(r=this.t-1;r>=0;--r)e[r+o+1]=this[r]>>n|a,a=(this[r]&s)<<i;for(r=o-1;r>=0;--r)e[r]=0;e[o]=a,e.t=this.t+o+1,e.s=this.s,e.clamp()}function x(t,e){e.s=this.s;var r=Math.floor(t/this.DB);if(r>=this.t)return e.t=0,void 0;var i=t%this.DB,n=this.DB-i,s=(1<<i)-1;e[0]=this[r]>>i;for(var o=r+1;o<this.t;++o)e[o-r-1]|=(this[o]&s)<<n,e[o-r]=this[o]>>i;i>0&&(e[this.t-r-1]|=(this.s&s)<<n),e.t=this.t-r,e.clamp()}function k(t,e){for(var r=0,i=0,n=Math.min(t.t,this.t);n>r;)i+=this[r]-t[r],e[r++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i-=t.s;r<this.t;)i+=this[r],e[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<t.t;)i-=t[r],e[r++]=i&this.DM,i>>=this.DB;i-=t.s}e.s=0>i?-1:0,-1>i?e[r++]=this.DV+i:i>0&&(e[r++]=i),e.t=r,e.clamp()}function T(t,e){var i=this.abs(),n=t.abs(),s=i.t;for(e.t=s+n.t;--s>=0;)e[s]=0;for(s=0;s<n.t;++s)e[s+i.t]=i.am(0,n[s],e,s,0,i.t);e.s=0,e.clamp(),this.s!=t.s&&r.ZERO.subTo(e,e)}function S(t){for(var e=this.abs(),r=t.t=2*e.t;--r>=0;)t[r]=0;for(r=0;r<e.t-1;++r){var i=e.am(r,e[r],t,2*r,0,1);(t[r+e.t]+=e.am(r+1,2*e[r],t,2*r+1,i,e.t-r-1))>=e.DV&&(t[r+e.t]-=e.DV,t[r+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(r,e[r],t,2*r,0,1)),t.s=0,t.clamp()}function A(t,e,n){var s=t.abs();if(!(s.t<=0)){var o=this.abs();if(o.t<s.t)return null!=e&&e.fromInt(0),null!=n&&this.copyTo(n),void 0;null==n&&(n=i());var a=i(),c=this.s,u=t.s,h=this.DB-v(s[s.t-1]);h>0?(s.lShiftTo(h,a),o.lShiftTo(h,n)):(s.copyTo(a),o.copyTo(n));var f=a.t,l=a[f-1];if(0!=l){var _=l*(1<<this.F1)+(f>1?a[f-2]>>this.F2:0),p=this.FV/_,d=(1<<this.F1)/_,y=1<<this.F2,m=n.t,g=m-f,b=null==e?i():e;for(a.dlShiftTo(g,b),n.compareTo(b)>=0&&(n[n.t++]=1,n.subTo(b,n)),r.ONE.dlShiftTo(f,b),b.subTo(a,a);a.t<f;)a[a.t++]=0;for(;--g>=0;){var w=n[--m]==l?this.DM:Math.floor(n[m]*p+(n[m-1]+y)*d);if((n[m]+=a.am(0,w,n,g,0,f))<w)for(a.dlShiftTo(g,b),n.subTo(b,n);n[m]<--w;)n.subTo(b,n)}null!=e&&(n.drShiftTo(f,e),c!=u&&r.ZERO.subTo(e,e)),n.t=f,n.clamp(),h>0&&n.rShiftTo(h,n),0>c&&r.ZERO.subTo(n,n)}}}function j(t){var e=i();return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(r.ZERO)>0&&t.subTo(e,e),e}function B(t){this.m=t}function q(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t}function I(t){return t}function R(t){t.divRemTo(this.m,null,t)}function D(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function O(t,e){t.squareTo(e),this.reduce(e)}function M(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return e=15&e*(2-(15&t)*e),e=255&e*(2-(255&t)*e),e=65535&e*(2-(65535&(65535&t)*e)),e=e*(2-t*e%this.DV)%this.DV,e>0?this.DV-e:-e}function L(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function C(t){var e=i();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(r.ZERO)>0&&this.m.subTo(e,e),e}function N(t){var e=i();return t.copyTo(e),this.reduce(e),e}function F(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var r=32767&t[e],i=r*this.mpl+((r*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(r=e+this.m.t,t[r]+=this.m.am(0,i,t,e,0,this.m.t);t[r]>=t.DV;)t[r]-=t.DV,t[++r]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)}function P(t,e){t.squareTo(e),this.reduce(e)}function z(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function U(){return 0==(this.t>0?1&this[0]:this.s)}function V(t,e){if(t>4294967295||1>t)return r.ONE;var n=i(),s=i(),o=e.convert(this),a=v(t)-1;
for(o.copyTo(n);--a>=0;)if(e.sqrTo(n,s),(t&1<<a)>0)e.mulTo(s,o,n);else{var c=n;n=s,s=c}return e.revert(n)}function H(t,e){var r;return r=256>t||e.isEven()?new B(e):new L(e),this.exp(t,r)}function G(){var t=i();return this.copyTo(t),t}function X(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function Z(){return 0==this.t?this.s:this[0]<<24>>24}function W(){return 0==this.t?this.s:this[0]<<16>>16}function K(t){return Math.floor(Math.LN2*this.DB/Math.log(t))}function J(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1}function Q(t){if(null==t&&(t=10),0==this.signum()||2>t||t>36)return"0";var e=this.chunkSize(t),r=Math.pow(t,e),n=f(r),s=i(),o=i(),a="";for(this.divRemTo(n,s,o);s.signum()>0;)a=(r+o.intValue()).toString(t).substr(1)+a,s.divRemTo(n,s,o);return o.intValue().toString(t)+a}function Y(t,e){this.fromInt(0),null==e&&(e=10);for(var i=this.chunkSize(e),n=Math.pow(e,i),s=!1,o=0,a=0,u=0;u<t.length;++u){var h=c(t,u);0>h?"-"==t.charAt(u)&&0==this.signum()&&(s=!0):(a=e*a+h,++o>=i&&(this.dMultiply(n),this.dAddOffset(a,0),o=0,a=0))}o>0&&(this.dMultiply(Math.pow(e,o)),this.dAddOffset(a,0)),s&&r.ZERO.subTo(this,this)}function $(t,e,i){if("number"==typeof e)if(2>t)this.fromInt(1);else for(this.fromNumber(t,i),this.testBit(t-1)||this.bitwiseTo(r.ONE.shiftLeft(t-1),ae,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(r.ONE.shiftLeft(t-1),this);else{var n=new Array,s=7&t;n.length=(t>>3)+1,e.nextBytes(n),s>0?n[0]&=(1<<s)-1:n[0]=0,this.fromString(n,256)}}function te(){var t=this.t,e=new Array;e[0]=this.s;var r,i=this.DB-t*this.DB%8,n=0;if(t-->0)for(i<this.DB&&(r=this[t]>>i)!=(this.s&this.DM)>>i&&(e[n++]=r|this.s<<this.DB-i);t>=0;)8>i?(r=(this[t]&(1<<i)-1)<<8-i,r|=this[--t]>>(i+=this.DB-8)):(r=255&this[t]>>(i-=8),0>=i&&(i+=this.DB,--t)),0!=(128&r)&&(r|=-256),0==n&&(128&this.s)!=(128&r)&&++n,(n>0||r!=this.s)&&(e[n++]=r);return e}function ee(t){return 0==this.compareTo(t)}function re(t){return this.compareTo(t)<0?this:t}function ie(t){return this.compareTo(t)>0?this:t}function ne(t,e,r){var i,n,s=Math.min(t.t,this.t);for(i=0;s>i;++i)r[i]=e(this[i],t[i]);if(t.t<this.t){for(n=t.s&this.DM,i=s;i<this.t;++i)r[i]=e(this[i],n);r.t=this.t}else{for(n=this.s&this.DM,i=s;i<t.t;++i)r[i]=e(n,t[i]);r.t=t.t}r.s=e(this.s,t.s),r.clamp()}function se(t,e){return t&e}function oe(t){var e=i();return this.bitwiseTo(t,se,e),e}function ae(t,e){return t|e}function ce(t){var e=i();return this.bitwiseTo(t,ae,e),e}function ue(t,e){return t^e}function he(t){var e=i();return this.bitwiseTo(t,ue,e),e}function fe(t,e){return t&~e}function le(t){var e=i();return this.bitwiseTo(t,fe,e),e}function _e(){for(var t=i(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t}function pe(t){var e=i();return 0>t?this.rShiftTo(-t,e):this.lShiftTo(t,e),e}function de(t){var e=i();return 0>t?this.lShiftTo(-t,e):this.rShiftTo(t,e),e}function ye(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function me(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+ye(this[t]);return this.s<0?this.t*this.DB:-1}function ve(t){for(var e=0;0!=t;)t&=t-1,++e;return e}function ge(){for(var t=0,e=this.s&this.DM,r=0;r<this.t;++r)t+=ve(this[r]^e);return t}function be(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)}function we(t,e){var i=r.ONE.shiftLeft(t);return this.bitwiseTo(i,e,i),i}function Ee(t){return this.changeBit(t,ae)}function xe(t){return this.changeBit(t,fe)}function ke(t){return this.changeBit(t,ue)}function Te(t,e){for(var r=0,i=0,n=Math.min(t.t,this.t);n>r;)i+=this[r]+t[r],e[r++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i+=t.s;r<this.t;)i+=this[r],e[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<t.t;)i+=t[r],e[r++]=i&this.DM,i>>=this.DB;i+=t.s}e.s=0>i?-1:0,i>0?e[r++]=i:-1>i&&(e[r++]=this.DV+i),e.t=r,e.clamp()}function Se(t){var e=i();return this.addTo(t,e),e}function Ae(t){var e=i();return this.subTo(t,e),e}function je(t){var e=i();return this.multiplyTo(t,e),e}function Be(){var t=i();return this.squareTo(t),t}function qe(t){var e=i();return this.divRemTo(t,e,null),e}function Ie(t){var e=i();return this.divRemTo(t,null,e),e}function Re(t){var e=i(),r=i();return this.divRemTo(t,e,r),new Array(e,r)}function De(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()}function Oe(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}}function Me(){}function Le(t){return t}function Ce(t,e,r){t.multiplyTo(e,r)}function Ne(t,e){t.squareTo(e)}function Fe(t){return this.exp(t,new Me)}function Pe(t,e,r){var i=Math.min(this.t+t.t,e);for(r.s=0,r.t=i;i>0;)r[--i]=0;var n;for(n=r.t-this.t;n>i;++i)r[i+this.t]=this.am(0,t[i],r,i,0,this.t);for(n=Math.min(t.t,e);n>i;++i)this.am(0,t[i],r,i,0,e-i);r.clamp()}function ze(t,e,r){--e;var i=r.t=this.t+t.t-e;for(r.s=0;--i>=0;)r[i]=0;for(i=Math.max(e-this.t,0);i<t.t;++i)r[this.t+i-e]=this.am(e-i,t[i],r,0,0,this.t+i-e);r.clamp(),r.drShiftTo(1,r)}function Ue(t){this.r2=i(),this.q3=i(),r.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}function Ve(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=i();return t.copyTo(e),this.reduce(e),e}function He(t){return t}function Ge(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)}function Xe(t,e){t.squareTo(e),this.reduce(e)}function Ze(t,e,r){t.multiplyTo(e,r),this.reduce(r)}function We(t,e){var r,n,s=t.bitLength(),o=f(1);if(0>=s)return o;r=18>s?1:48>s?3:144>s?4:768>s?5:6,n=8>s?new B(e):e.isEven()?new Ue(e):new L(e);var a=new Array,c=3,u=r-1,h=(1<<r)-1;if(a[1]=n.convert(this),r>1){var l=i();for(n.sqrTo(a[1],l);h>=c;)a[c]=i(),n.mulTo(l,a[c-2],a[c]),c+=2}var _,p,d=t.t-1,y=!0,m=i();for(s=v(t[d])-1;d>=0;){for(s>=u?_=t[d]>>s-u&h:(_=(t[d]&(1<<s+1)-1)<<u-s,d>0&&(_|=t[d-1]>>this.DB+s-u)),c=r;0==(1&_);)_>>=1,--c;if((s-=c)<0&&(s+=this.DB,--d),y)a[_].copyTo(o),y=!1;else{for(;c>1;)n.sqrTo(o,m),n.sqrTo(m,o),c-=2;c>0?n.sqrTo(o,m):(p=o,o=m,m=p),n.mulTo(m,a[_],o)}for(;d>=0&&0==(t[d]&1<<s);)n.sqrTo(o,m),p=o,o=m,m=p,--s<0&&(s=this.DB-1,--d)}return n.revert(o)}function Ke(t){var e=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone();if(e.compareTo(r)<0){var i=e;e=r,r=i}var n=e.getLowestSetBit(),s=r.getLowestSetBit();if(0>s)return e;for(s>n&&(s=n),s>0&&(e.rShiftTo(s,e),r.rShiftTo(s,r));e.signum()>0;)(n=e.getLowestSetBit())>0&&e.rShiftTo(n,e),(n=r.getLowestSetBit())>0&&r.rShiftTo(n,r),e.compareTo(r)>=0?(e.subTo(r,e),e.rShiftTo(1,e)):(r.subTo(e,r),r.rShiftTo(1,r));return s>0&&r.lShiftTo(s,r),r}function Je(t){if(0>=t)return 0;var e=this.DV%t,r=this.s<0?t-1:0;if(this.t>0)if(0==e)r=this[0]%t;else for(var i=this.t-1;i>=0;--i)r=(e*r+this[i])%t;return r}function Qe(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return r.ZERO;for(var i=t.clone(),n=this.clone(),s=f(1),o=f(0),a=f(0),c=f(1);0!=i.signum();){for(;i.isEven();)i.rShiftTo(1,i),e?(s.isEven()&&o.isEven()||(s.addTo(this,s),o.subTo(t,o)),s.rShiftTo(1,s)):o.isEven()||o.subTo(t,o),o.rShiftTo(1,o);for(;n.isEven();)n.rShiftTo(1,n),e?(a.isEven()&&c.isEven()||(a.addTo(this,a),c.subTo(t,c)),a.rShiftTo(1,a)):c.isEven()||c.subTo(t,c),c.rShiftTo(1,c);i.compareTo(n)>=0?(i.subTo(n,i),e&&s.subTo(a,s),o.subTo(c,o)):(n.subTo(i,n),e&&a.subTo(s,a),c.subTo(o,c))}return 0!=n.compareTo(r.ONE)?r.ZERO:c.compareTo(t)>=0?c.subtract(t):c.signum()<0?(c.addTo(t,c),c.signum()<0?c.add(t):c):c}function Ye(t){var e,r=this.abs();if(1==r.t&&r[0]<=cr[cr.length-1]){for(e=0;e<cr.length;++e)if(r[0]==cr[e])return!0;return!1}if(r.isEven())return!1;for(e=1;e<cr.length;){for(var i=cr[e],n=e+1;n<cr.length&&ur>i;)i*=cr[n++];for(i=r.modInt(i);n>e;)if(0==i%cr[e++])return!1}return r.millerRabin(t)}function $e(t){var e=this.subtract(r.ONE),n=e.getLowestSetBit();if(0>=n)return!1;var s=e.shiftRight(n);t=t+1>>1,t>cr.length&&(t=cr.length);for(var o=i(),a=0;t>a;++a){o.fromInt(cr[Math.floor(Math.random()*cr.length)]);var c=o.modPow(s,this);if(0!=c.compareTo(r.ONE)&&0!=c.compareTo(e)){for(var u=1;u++<n&&0!=c.compareTo(e);)if(c=c.modPowInt(2,this),0==c.compareTo(r.ONE))return!1;if(0!=c.compareTo(e))return!1}}return!0}var tr,er=0xdeadbeefcafe,rr=15715070==(16777215&er);rr&&"undefined"!=typeof navigator&&"Microsoft Internet Explorer"==navigator.appName?(r.prototype.am=s,tr=30):rr&&"undefined"!=typeof navigator&&"Netscape"!=navigator.appName?(r.prototype.am=n,tr=26):(r.prototype.am=o,tr=28),r.prototype.DB=tr,r.prototype.DM=(1<<tr)-1,r.prototype.DV=1<<tr;var ir=52;r.prototype.FV=Math.pow(2,ir),r.prototype.F1=ir-tr,r.prototype.F2=2*tr-ir;var nr,sr,or="0123456789abcdefghijklmnopqrstuvwxyz",ar=new Array;for(nr="0".charCodeAt(0),sr=0;9>=sr;++sr)ar[nr++]=sr;for(nr="a".charCodeAt(0),sr=10;36>sr;++sr)ar[nr++]=sr;for(nr="A".charCodeAt(0),sr=10;36>sr;++sr)ar[nr++]=sr;B.prototype.convert=q,B.prototype.revert=I,B.prototype.reduce=R,B.prototype.mulTo=D,B.prototype.sqrTo=O,L.prototype.convert=C,L.prototype.revert=N,L.prototype.reduce=F,L.prototype.mulTo=z,L.prototype.sqrTo=P,Me.prototype.convert=Le,Me.prototype.revert=Le,Me.prototype.mulTo=Ce,Me.prototype.sqrTo=Ne,Ue.prototype.convert=Ve,Ue.prototype.revert=He,Ue.prototype.reduce=Ge,Ue.prototype.mulTo=Ze,Ue.prototype.sqrTo=Xe;var cr=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],ur=(1<<26)/cr[cr.length-1];r.prototype.chunkSize=K,r.prototype.toRadix=Q,r.prototype.fromRadix=Y,r.prototype.fromNumber=$,r.prototype.bitwiseTo=ne,r.prototype.changeBit=we,r.prototype.addTo=Te,r.prototype.dMultiply=De,r.prototype.dAddOffset=Oe,r.prototype.multiplyLowerTo=Pe,r.prototype.multiplyUpperTo=ze,r.prototype.modInt=Je,r.prototype.millerRabin=$e,r.prototype.copyTo=u,r.prototype.fromInt=h,r.prototype.fromString=l,r.prototype.clamp=_,r.prototype.dlShiftTo=b,r.prototype.drShiftTo=w,r.prototype.lShiftTo=E,r.prototype.rShiftTo=x,r.prototype.subTo=k,r.prototype.multiplyTo=T,r.prototype.squareTo=S,r.prototype.divRemTo=A,r.prototype.invDigit=M,r.prototype.isEven=U,r.prototype.exp=V,r.prototype.toString=p,r.prototype.negate=d,r.prototype.abs=y,r.prototype.compareTo=m,r.prototype.bitLength=g,r.prototype.mod=j,r.prototype.modPowInt=H,r.prototype.clone=G,r.prototype.intValue=X,r.prototype.byteValue=Z,r.prototype.shortValue=W,r.prototype.signum=J,r.prototype.toByteArray=te,r.prototype.equals=ee,r.prototype.min=re,r.prototype.max=ie,r.prototype.and=oe,r.prototype.or=ce,r.prototype.xor=he,r.prototype.andNot=le,r.prototype.not=_e,r.prototype.shiftLeft=pe,r.prototype.shiftRight=de,r.prototype.getLowestSetBit=me,r.prototype.bitCount=ge,r.prototype.testBit=be,r.prototype.setBit=Ee,r.prototype.clearBit=xe,r.prototype.flipBit=ke,r.prototype.add=Se,r.prototype.subtract=Ae,r.prototype.multiply=je,r.prototype.divide=qe,r.prototype.remainder=Ie,r.prototype.divideAndRemainder=Re,r.prototype.modPow=We,r.prototype.modInverse=Qe,r.prototype.pow=Fe,r.prototype.gcd=Ke,r.prototype.isProbablePrime=Ye,r.prototype.square=Be,r.ZERO=f(0),r.ONE=f(1),r.valueOf=i,e.BigInteger=r},29:function(t){function e(t){if(!t||"[object Object]"!==i.call(t)||t.nodeType||t.setInterval)return!1;var e=r.call(t,"constructor"),n=r.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!n)return!1;var s;for(s in t);return void 0===s||r.call(t,s)}var r=Object.prototype.hasOwnProperty,i=Object.prototype.toString;t.exports=function n(){var t,r,i,s,o,a,c=arguments[0]||{},u=1,h=arguments.length,f=!1;for("boolean"==typeof c&&(f=c,c=arguments[1]||{},u=2),"object"!=typeof c&&"function"!=typeof c&&(c={});h>u;u++)if(null!=(t=arguments[u]))for(r in t)i=c[r],s=t[r],c!==s&&(f&&s&&(e(s)||(o=Array.isArray(s)))?(o?(o=!1,a=i&&Array.isArray(i)?i:[]):a=i&&e(i)?i:{},c[r]=n(f,a,s)):void 0!==s&&(c[r]=s));return c}},30:function(t,e,r){var i=r(9),n=i.sjcl,s=r(11),o=i.jsbn.BigInteger,a=r(4).Base,c=function(){this._value=0/0};c.json_rewrite=function(t,e){return this.from_json(t).to_json(e)},c.from_generic=function(t){return t instanceof this?t.clone():(new this).parse_generic(t)},c.from_hex=function(t){return t instanceof this?t.clone():(new this).parse_hex(t)},c.from_json=function(t){return t instanceof this?t.clone():(new this).parse_json(t)},c.from_bits=function(t){return t instanceof this?t.clone():(new this).parse_bits(t)},c.from_bytes=function(t){return t instanceof this?t.clone():(new this).parse_bytes(t)},c.from_bn=function(t){return t instanceof this?t.clone():(new this).parse_bn(t)},c.is_valid=function(t){return this.from_json(t).is_valid()},c.prototype.clone=function(){return this.copyTo(new this.constructor)},c.prototype.copyTo=function(t){return t._value=this._value,t},c.prototype.equals=function(t){return this._value instanceof o&&t._value instanceof o&&this._value.equals(t._value)},c.prototype.is_valid=function(){return this._value instanceof o},c.prototype.is_zero=function(){return this._value.equals(o.ZERO)},c.prototype.parse_generic=function(t){switch(s.accounts&&t in s.accounts&&(t=s.accounts[t].account),t){case void 0:case"0":case this.constructor.STR_ZERO:case this.constructor.ACCOUNT_ZERO:case this.constructor.HEX_ZERO:this._value=o.valueOf();break;case"1":case this.constructor.STR_ONE:case this.constructor.ACCOUNT_ONE:case this.constructor.HEX_ONE:this._value=new o([1]);break;default:this._value="string"!=typeof t?0/0:"r"===t[0]?a.decode_check(a.VER_ACCOUNT_ID,t):this.constructor.width===t.length?new o(i.stringToArray(t),256):2*this.constructor.width===t.length?new o(t,16):0/0}return this},c.prototype.parse_hex=function(t){return this._value="string"==typeof t&&t.length===2*this.constructor.width?new o(t,16):0/0,this},c.prototype.parse_bits=function(t){if(n.bitArray.bitLength(t)!==8*this.constructor.width)this._value=0/0;else{var e=n.codec.bytes.fromBits(t);this.parse_bytes(e)}return this},c.prototype.parse_bytes=function(t){return this._value=Array.isArray(t)&&t.length===this.constructor.width?new o(t,256):0/0,this},c.prototype.parse_json=c.prototype.parse_hex,c.prototype.parse_bn=function(t){if(t instanceof n.bn&&t.bitLength()<=8*this.constructor.width){var e=n.codec.bytes.fromBits(t.toBits());this._value=new o(e,256)}else this._value=0/0;return this},c.prototype.to_bytes=function(){if(!(this._value instanceof o))return null;var t=this._value.toByteArray();t=t.map(function(t){return(t+256)%256});var e=this.constructor.width;for(t=t.slice(-e);t.length<e;)t.unshift(0);return t},c.prototype.to_hex=function(){if(!(this._value instanceof o))return null;var t=this.to_bytes();return n.codec.hex.fromBits(n.codec.bytes.toBits(t)).toUpperCase()},c.prototype.to_json=c.prototype.to_hex,c.prototype.to_bits=function(){if(!(this._value instanceof o))return null;var t=this.to_bytes();return n.codec.bytes.toBits(t)},c.prototype.to_bn=function(){if(!(this._value instanceof o))return null;var t=this.to_bits();return n.bn.fromBits(t)},e.UInt=c},31:function(t,e,r){function i(t){function e(t){var t=i.normalize_transaction(t),e=t.tx_json.Sequence,r=t.hash;h._sequence_cache[e]=t;var n=h._pending.get("hash",r);n?n.emit("success",t):h._cache[r]=t}function r(){h._pending.forEach(function(t){if(h.remote.local_fee&&t.tx_json.Fee){var e=t.tx_json.Fee,r=h.remote.fee_tx(t.fee_units()).to_json();t.tx_json.Fee=r,t.emit("fee_adjusted",e,r)}})}function n(t){h._pending.forEach(function(e){switch(e.last_ledger=t,t.ledger_index-e.submit_index){case 8:e.emit("lost",t),e.emit("error",new o("tejLost","Transaction lost"));break;case 4:e.set_state("client_missing"),e.emit("missing",t)}})}function c(){var t={account:h.account._account_id,ledger_index_min:-1,ledger_index_max:-1,limit:10};h.remote.request_account_tx(t,function(t,r){!t&&r.transactions&&r.transactions.forEach(e),h.remote.on("ledger_closed",n)}),h._load_sequence(function(){h._resubmit(3)})}function u(){h.remote.once("connect",c),h.remote.removeListener("ledger_closed",n)}s.call(this);var h=this;this.account=t,this.remote=t._remote,this._timeout=void 0,this._pending=new a,this._next_sequence=void 0,this._cache={},this._sequence_cache={},this._max_fee=this.remote.max_fee,this._submission_timeout=this.remote._submission_timeout,this._load_sequence(),this.account.on("transaction-outbound",e),this.remote.on("load_changed",r),this.remote.on("ledger_closed",n),this.remote.on("disconnect",u)}var n=r(25),s=r(24).EventEmitter,o=r(18).RippleError,a=r(42).TransactionQueue;r(2),n.inherits(i,s),i.normalize_transaction=function(t){t.tx&&(t.transaction=t.tx);var e=t.transaction.hash;t.transaction.Sequence;var r={ledger_hash:t.ledger_hash||t.transaction.ledger_hash,ledger_index:t.ledger_index||t.transaction.ledger_index,metadata:t.meta,tx_json:t.transaction};return r.hash=e,r.tx_json.ledger_index=r.ledger_index,r.tx_json.inLedger=r.ledger_index,r},i.prototype._fill_sequence=function(t,e){var r=this.remote.transaction();r.account_set(this.account._account_id),r.tx_json.Sequence=t.tx_json.Sequence-1,r.submit(e)},i.prototype._load_sequence=function(t){function e(e,i){return"number"!=typeof i?setTimeout(function(){r._load_sequence(t)},3e3):(r._next_sequence=i,r.emit("sequence_loaded",i),"function"==typeof t&&t(e,i),void 0)}var r=this;this.account.get_next_sequence(e)},i.prototype._resubmit=function(t,e){function r(t){if(t&&!t.finalized){var e=i._cache[t.hash],r=i._sequence_cache[t.tx_json.Sequence];e?t.emit("success",e):r?(t.tx_json.Sequence++,t.once("submitted",function(){i._load_sequence()}),i._request(t)):i._request(t)}}var i=this,e=e?[e]:this._pending;if(t){var n=Number(t)||3;this._wait_ledgers(n,function(){e.forEach(r)})}else e.forEach(r)},i.prototype._wait_ledgers=function(t,e){function r(){++n===t&&(e(),i.remote.removeListener("ledger_closed",r))}var i=this,n=0;this.remote.on("ledger_closed",r)},i.prototype._request=function(t){function e(e){t.set_state("client_proposed"),e.rejected=t.isRejected(e.engine_result_code),t.emit("proposed",e)}function r(e){switch(e.engine_result){case"tefPAST_SEQ":a._resubmit(2,t);break;default:n(e)}}function i(e){switch(e.engine_result){case"terPRE_SEQ":a._fill_sequence(t,function(){a._resubmit(2,t)});break;default:a._resubmit(1,t)}}function n(e){a._is_too_busy(e)?a._resubmit(1,t):(a._next_sequence--,t.set_state("remoteError"),t.emit("submitted",e),t.emit("error",e))}function s(s){switch(s.tx_json.hash&&(t.hash=s.tx_json.hash),s.result=s.engine_result||"",t.emit("submitted",s),s.result.slice(0,3)){case"tec":t.emit("error",s);break;case"tes":e(s);break;case"tef":r(s);break;case"ter":i(s);break;default:n(s)}}var a=this,c=this.remote;if(t.attempts>10)return t.emit("error",new o("tejAttemptsExceeded")),void 0;var u=c.request_submit();return u.build_path(t._build_path),c.local_signing?(t.sign(),u.tx_blob(t.serialize().to_hex())):(u.secret(t._secret),u.tx_json(t.tx_json)),u.once("success",s),u.once("error",n),u.request(),u.timeout(this._submission_timeout,function(){t.emit("timeout"),a.remote._connected&&a._resubmit(1,t)}),t.set_state("client_submitted"),t.attempts++,u},i.prototype._is_remote_error=function(t){return t&&"object"==typeof t&&"remoteError"===t.error&&"object"==typeof t.remote},i.prototype._is_not_found=function(t){return this._is_remote_error(t)&&/^(txnNotFound|transactionNotFound)$/.test(t.remote.error)},i.prototype._is_too_busy=function(t){return this._is_remote_error(t)&&"tooBusy"===t.remote.error},i.prototype.submit=function(t){function e(e){t.finalized||(r._pending.removeHash(t.hash),t.finalized=!0,t.emit("final",e))}var r=this;if("undefined"==typeof this._next_sequence)return this.once("sequence_loaded",function(){r.submit(t)}),void 0;"number"!=typeof t.tx_json.Sequence&&(t.tx_json.Sequence=this._next_sequence++),t.submit_index=this.remote._ledger_current_index,t.last_ledger=void 0,t.attempts=0,t.complete(),t.on("error",e),t.once("success",e),t.once("abort",function(){t.emit("error",new o("tejAbort","Transaction aborted"))});var i=Number(t.tx_json.Fee),n=this.remote;t._secret||t.tx_json.TxnSignature?n.trusted||n.local_signing?i&&i>this._max_fee?t.emit("error",new o("tejMaxFeeExceeded","Max fee exceeded")):(this._pending.push(t),this._request(t)):t.emit("error",new o("tejServerUntrusted","Attempt to give secret to untrusted server")):t.emit("error",new o("tejSecretUnknown","Missing secret"))},e.TransactionManager=i},32:function(t,e,r){function i(){this._curve=s.ecc.curves.c256,this._secret=null,this._pubkey=null}function n(t){return s.hash.ripemd160.hash(s.hash.sha256.hash(t))}var s=r(9).sjcl,o=r(14).UInt160,a=r(21).UInt256;i.from_bn_secret=function(t){return t instanceof this?t.clone():(new this).parse_bn_secret(t)},i.prototype.parse_bn_secret=function(t){return this._secret=new s.ecc.ecdsa.secretKey(s.ecc.curves.c256,t),this},i.prototype._pub=function(){var t=this._curve;if(!this._pubkey&&this._secret){var e=this._secret._exponent;this._pubkey=new s.ecc.ecdsa.publicKey(t,t.G.mult(e))}return this._pubkey},i.prototype._pub_bits=function(){var t=this._pub();if(!t)return null;var e=t._point,r=e.y.mod(2).equals(0);return s.bitArray.concat([s.bitArray.partial(8,r?2:3)],e.x.toBits(this._curve.r.bitLength()))},i.prototype.to_hex_pub=function(){var t=this._pub_bits();return t?s.codec.hex.fromBits(t).toUpperCase():null},i.prototype.get_address=function(){var t=this._pub_bits();if(!t)return null;var e=n(t);return o.from_bits(e)},i.prototype.sign=function(t){var t=a.from_json(t);return this._secret.signDER(t.to_bits(),0)},e.KeyPair=i},33:function(t,e,r){r(9).sjcl;var i=r(9);r(11);var n=r(29);i.jsbn.BigInteger;var s=r(30).UInt;r(4).Base;var o=n(function(){this._value=0/0},s);o.width=16,o.prototype=n({},s.prototype),o.prototype.constructor=o;var a=o.HEX_ZERO="00000000000000000000000000000000",c=o.HEX_ONE="00000000000000000000000000000000";o.STR_ZERO=i.hexToString(a),o.STR_ONE=i.hexToString(c),e.UInt128=o},34:function(t,e){e.readIEEE754=function(t,e,r,i,n){var s,o,a=8*n-i-1,c=(1<<a)-1,u=c>>1,h=-7,f=r?0:n-1,l=r?1:-1,_=t[e+f];for(f+=l,s=_&(1<<-h)-1,_>>=-h,h+=a;h>0;s=256*s+t[e+f],f+=l,h-=8);for(o=s&(1<<-h)-1,s>>=-h,h+=i;h>0;o=256*o+t[e+f],f+=l,h-=8);if(0===s)s=1-u;else{if(s===c)return o?0/0:1/0*(_?-1:1);o+=Math.pow(2,i),s-=u}return(_?-1:1)*o*Math.pow(2,s-i)},e.writeIEEE754=function(t,e,r,i,n,s){var o,a,c,u=8*s-n-1,h=(1<<u)-1,f=h>>1,l=23===n?Math.pow(2,-24)-Math.pow(2,-77):0,_=i?s-1:0,p=i?-1:1,d=0>e||0===e&&0>1/e?1:0;for(e=Math.abs(e),isNaN(e)||1/0===e?(a=isNaN(e)?1:0,o=h):(o=Math.floor(Math.log(e)/Math.LN2),e*(c=Math.pow(2,-o))<1&&(o--,c*=2),e+=o+f>=1?l/c:l*Math.pow(2,1-f),e*c>=2&&(o++,c/=2),o+f>=h?(a=0,o=h):o+f>=1?(a=(e*c-1)*Math.pow(2,n),o+=f):(a=e*Math.pow(2,f-1)*Math.pow(2,n),o=0));n>=8;t[r+_]=255&a,_+=p,a/=256,n-=8);for(o=o<<n|a,u+=n;u>0;t[r+_]=255&o,_+=p,o/=256,u-=8);t[r+_-p]|=128*d}},35:function(t){t.exports="function"==typeof Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)}},36:function(t){t.exports=function(t,e){if(t.indexOf)return t.indexOf(e);for(var r=0;r<t.length;r++)if(e===t[r])return r;return-1}},37:function(t){t.exports=Object.keys||function(t){if(t!==Object(t))throw new TypeError("Invalid object");var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},38:function(t){t.exports=Object.getOwnPropertyNames||function(t){var e=[];for(var r in t)Object.hasOwnProperty.call(t,r)&&e.push(r);return e}},39:function(t){t.exports=Object.create||function(t,e){var r;if(null===t)r={__proto__:null};else{if("object"!=typeof t)throw new TypeError("typeof prototype["+typeof t+"] != 'object'");var i=function(){};i.prototype=t,r=new i,r.__proto__=t}return"undefined"!=typeof e&&Object.defineProperties&&Object.defineProperties(r,e),r}},40:function(t){t.exports=function(t){return t instanceof RegExp||"object"==typeof t&&"[object RegExp]"===Object.prototype.toString.call(t)}},41:function(t){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},42:function(t,e){function r(){var t=this;this._queue=[],Object.defineProperty(this,"_length",{get:function(){return t._queue.length}})}r.prototype.length=function(){return this._queue.length},r.prototype.indexOf=function(t,e){for(var r,i=-1,n=0;r=this._queue[n];n++)if(r[t]===e){i=n;break}return i},r.prototype.hasHash=function(t){return-1!==this.indexOf("hash",t)},r.prototype.get=function(t,e){var r=this.indexOf(t,e);return r>-1?this._queue[r]:!1},r.prototype.removeSequence=function(t){for(var e,r=[],i=0;e=this._queue[i];i++)e.tx_json&&e.tx_json.Sequence!==t&&r.push(e);this._queue=r},r.prototype.removeHash=function(t){for(var e,r=[],i=0;e=this._queue[i];i++)e.tx_json&&e.hash!==t&&r.push(e);this._queue=r},r.prototype.forEach=function(){Array.prototype.forEach.apply(this._queue,arguments)},r.prototype.push=function(){Array.prototype.push.apply(this._queue,arguments)},e.TransactionQueue=r},43:function(t){!function(){"use strict";function e(t){var e,r,n,s,o,a;if(t.length%4>0)throw"Invalid string. Length must be a multiple of 4";for(o=t.indexOf("="),o=o>0?t.length-o:0,a=[],n=o>0?t.length-4:t.length,e=0,r=0;n>e;e+=4,r+=3)s=i.indexOf(t[e])<<18|i.indexOf(t[e+1])<<12|i.indexOf(t[e+2])<<6|i.indexOf(t[e+3]),a.push((16711680&s)>>16),a.push((65280&s)>>8),a.push(255&s);return 2===o?(s=i.indexOf(t[e])<<2|i.indexOf(t[e+1])>>4,a.push(255&s)):1===o&&(s=i.indexOf(t[e])<<10|i.indexOf(t[e+1])<<4|i.indexOf(t[e+2])>>2,a.push(255&s>>8),a.push(255&s)),a}function r(t){function e(t){return i[63&t>>18]+i[63&t>>12]+i[63&t>>6]+i[63&t]}var r,n,s,o=t.length%3,a="";for(r=0,s=t.length-o;s>r;r+=3)n=(t[r]<<16)+(t[r+1]<<8)+t[r+2],a+=e(n);switch(o){case 1:n=t[t.length-1],a+=i[n>>2],a+=i[63&n<<4],a+="==";break;case 2:n=(t[t.length-2]<<8)+t[t.length-1],a+=i[n>>10],a+=i[63&n>>4],a+=i[63&n<<2],a+="="}return a}var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";t.exports.toByteArray=e,t.exports.fromByteArray=r}()}});
var editRecipientTemplate = " \
<section id='editPage'> \
  <p>Send money to another Ripple account</p> \
    <label>Recipient</label><br/> \
    <div class='row'> \
      <input class='full' id='recipient_address_input' type='text'/><br/> \
      <p class='error recipient'></p> \
    </div> \
    <label>Amount</label><br/> \
    <div class='row'> \
      <input id='recipient_amount_input' class='span2' type='text'/> \
      <select id='recipient_currency_select' class='styled-select small-select'> \
        <option val='eur'>EUR</option> \
        <option val='usd'>USD</option> \
        <option val='btc'>BTC</option> \
        <option val='xrp'>XRP</option> \
      </select><br/> \
      <p class='error amount'>please enter a number greater than zero</p> \
    </div> \
    <br/> \
    <button class='positive span3'>next</button> \
</section>";
var confirmTemplate = " \
  <section id='editPage'> \
      <p style='margin:1em 0 0.3em 0'><%= name %> will receive</p> \
      <p class='well'><%= amount %> <%= currency %></p> \
      <label>You can pay with:</label><br/> \
      <div class='row'> \
        <select id='pathsSelect' class='span3 styled-select'> \
        </select><br/> \
        <p class='positive alert'>Exchange rate 125 xrp per usd</p> \
      </div> \
      <table> \
        <tr> \
          <td>Max cost to you:</td> \
          <td class='text-right'><%= max %> <span>USD</span></td> \
        </tr> \
        <tr> \
          <td>Fee:</td> \
          <td class='text-right'><%= fee %> <span>USD</span></td> \
        </tr> \
        <tr> \
          <td><div class='break'></div></td> \
          <td><div class='break'></div></td> \
        </tr> \
        <tr> \
          <td>Cost to you:</td> \
          <td class='text-right'><%= total %> <span>XRP</span></td> \
        </tr> \
      </table> \
      <button id='nextButton' class='positive span2 right'>next</button> \
      <button id='backButton' class='plain span1 left'>back</button> \
  </section> \
";
var containerTemplate = " \
  <div class='main-container' id='bbb'> \
    <div class='header-container'> \
      <header class='wrapper clearfix'> \
        <h1 class='title'>ripple<span>pay</span></h1> \
      </header> \
      <div class='full-mask loading'> \
        <img src='/img/loader.gif'/> \
      </div> \
    </div> \
    <div class='main wrapper clearfix'> \
      <div id='pay-widget-container'></div> \
    </div> \
  </div> \
";









$('body').append(containerTemplate);
var options = {
  server: {
    trace :         true,
    trusted:        true,
    local_signing:  true,

    connection_offset: 0
  },
  servers: [
    { host: 's_west.ripple.com', port: 443, secure: true },
    { host: 's_east.ripple.com', port: 443, secure: true }
  ],
  host: 's_west.ripple.com', port: 443, secure: true,
  blobvault : 'https://blobvault.payward.com',
  persistent_auth : false,
  transactions_per_page: 50,
  bridge: {
    out: {
    }
  },
  secure: true
};

var remote = new ripple.Remote(options);


var Recipient = Backbone.Model.extend({
  validate: function(attr, options) {
    if (!(attr.address && attr.amount && attr.currency)) {
      return 'address and amount are required'
    }
  },
  validAmount: function() {
    amount = this.get('amount');
 	  return (typeof amount == "number") && (amount > 0);
  }
});

var EditReceiptView = Backbone.View.extend({
  el: '#pay-widget-container',
  template: _.template(editRecipientTemplate),
  events: {
    'click button': 'submit',
    'keydown #recipient_amount_input': 'isNumber'
  },
  isNumber: function (evt) {
    console.log('is number');
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  },
  submit: function (e) {
    e.preventDefault();
    vent.trigger('submit:recipient');
  },
  initialize: function () {
    this.render();
    this.$('#recipient_amount_input').on('keydown', this.isNumber);
  },
  render: function () {
    return this.template();
  },
  show: function () {
    this.$el.html(this.render());
  }
});

var ConfirmView = Backbone.View.extend({
  el: '#pay-widget-container',
  template: _.template(confirmTemplate),
  events: {
    'click #backButton': 'back',
    'click #nextButton': 'submit',
    'change select': 'select'
  },
  submit: function (e) {
    e.preventDefault();
    vent.trigger('submit:payment');
  },
  back: function () {
    vent.trigger('navigate', '/');
  },
  select: function (e) {
    vent.trigger('payment:selected', $(e.target).val());
  },
  initialize: function () {
    this.render();
    this.model.on('change', this.render);
  },
  render: function () {
    return this.template({
      name: this.model.get('address'),
      amount: this.model.get('amount'),
      currency: this.model.get('currency'),
      max: this.model.get('amount'),
      fee: this.model.get('amount') * 0.0003,
      total: this.model.get('amount') * 1.0003
    });
  },
  show: function () {
    this.$el.html(this.render());
  }
});

var Path = Backbone.Model.extend();
var Paths = Backbone.Collection.extend({
  model: Path
});

var sender = new Backbone.Model;

var PathOptionView = Backbone.View.extend({
  tagName: 'option',
  initialize: function () {
    this.model.on('change', this.render, this);
  },
  template: _.template($('#pathOptionTemplate').html()),
  render: function () {
    return this.$el.html(this.template(this.model.attributes));
  }
});

var PathsSelectView = Backbone.View.extend({
  el: '#pathsSelect',
  initialize: function () {
    this.collection.on('add', function (model) {
      view = new PathOptionView({ model: model });
      view.render();
      $('select').append(view.el);
    })
  }
});

window.paths = new Paths();
var pathsSelectView = new PathsSelectView({ collection: paths });

var Router = Backbone.Router.extend({
  routes: {
    '': 'edit',
    'confirm': 'confirm'
  },
  edit: function () {
    $('.error').hide();
    editReceiptView.show();
  },
  confirm: function () {
    console.log('confirm');
    if (recipient.isValid()) {
      confirmView.show();
      api.getPaths('r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk', 'USD', 1, 'rHKueQebtVU9cEamhBbMV8AEViqKjXcBcB', {
        success: function(resp) {
          // Here we need to cross-reference the paths found with the sender's
          // Account balances to prevent them from spending more than they have
          _.each(resp.alternatives, function(alt) {
            paths.add(alt.source_amount);
          });
        },
        error: function(resp) { console.log(resp) }
      });
    } else {
      this.navigate('/', { trigger: true })
    }
  }
});

var vent = _.extend({}, Backbone.Events);
var recipient = new Recipient();
var editReceiptView = new EditReceiptView();
var confirmView = new ConfirmView({ model: recipient })
var router = new Router;

var api = (function(){
  function getAccountInfo(account, callbacks) {
    remote.request_account_info(account)
    .on('error', function (response) {
      vent.trigger('request_account_info:error', response);
      if (callbacks && callbacks.error) { callbacks.error(response) }
    })
    .on('success', function (response) {
      vent.trigger('request_account_info:success', response);
      if (callbacks && callbacks.success) { callbacks.success(response) }
    })
    .request();
  }

  function getAccountLines(account, callbacks) {
    remote.request_account_lines(account)
    .on('success', function (result) {
      vent.trigger('get_account_lines:success', result);
      if (callbacks && callbacks.success) { callbacks.success(result) }
    })
    .on('error', function (result) {
      vent.trigger('get_account_lines:error', result);
      if (callbacks && callbacks.error) { callbacks.error(result) }
    })
    .request();
  }

  function getAccountLines(account, callbacks) {
    remote.request_account_lines(account)
    .on('success', function (result) {
      vent.trigger('get_account_lines:success', result);
      if (callbacks && callbacks.success) { callbacks.success(result) }
    })
    .on('error', function (result) {
      vent.trigger('get_account_lines:error', result);
      if (callbacks && callbacks.error) { callbacks.error(result) }
    })
    .request();
  }

  function getAccountTransactions(account, callbacks) {
    //remote.set_secret(data.account, data.secret);
    remote.request_account_tx(account)
    .on('success', function (result) {
      vent.trigger('request_account_tx:success', result);
      if (callbacks && callbacks.success) { callbacks.success(result) }
    })
    .on('error', function (result) {
      vent.trigger('request_account_tx:error', result);
      if (callbacks && callbacks.error) { callbacks.error(result) }
    })
    .request();
  }


  function getPaths(account, currency, amount, recipient_address, callbacks) {
    //remote.set_secret(data.account, data.secret);
    currency = currency.slice(0, 3).toUpperCase();
    amount = ripple.Amount.from_human(""+amount+" "+currency)
    amount.set_issuer(recipient_address);
    remote.request_ripple_path_find(account, recipient_address, amount)
    .on('success', function (response) {
      vent.trigger('request_ripple_path_find:success', response);
      if (callbacks && callbacks.success) { callbacks.success(response) }
    })
    .on('error', function (response_find_path) {
      vent.trigger('request_ripple_path_find:error', response);
      if (callbacks && callbacks.error) { callbacks.error(response) }
    })
    .request();
  }

  return {
    getAccountInfo: getAccountInfo,
    getAccountLines: getAccountLines,
    getAccountTransactions: getAccountTransactions,
    getPaths: getPaths
	}
})();

remote.connect(function () {
  recipient.set({});

  vent.on('request_account_info:error', function(payload) {
    console.log('request_account_info:error');
    console.log(payload);
  });

  vent.on('request_account_info:success', function(payload) {
    console.log('request_account_info:success');
    console.log(payload);
  });

  Backbone.history.start({
    silent: false
  });

  vent.on('navigate', function (route) {
    router.navigate(route, { trigger: true });
  });

  vent.on('submit:payment', function () {
    alert('payment submitted');
  });

  vent.on('payment:selected', function (val) {
    console.log('payment selected', val);
  });

  vent.on('request_account_lines:error', function (payload) {
    console.log('request_account_lines:error');
    console.log(payload);
  });

  vent.on('request_ripple_path_find:success', function (payload) {
    console.log('request_ripple_path_find:success');
    console.log(payload);
  });

  vent.on('request_ripple_path_find:error', function (payload) {
    console.log('request_ripple_path_find:error');
    console.log(payload);
  });

  vent.on('submit:recipient', function () {
    $('.loading').show();
    var address = $('#recipient_address_input').val();

    api.getAccountInfo(address, {
      success: function (resp) {
        $('.error.recipient').hide();
        $('.loading').hide();
        recipient.set({
          address: resp.account_data.Account,
          amount: parseInt($('#recipient_amount_input').val()),
          currency: $('#recipient_currency_select').val()
        });

        if (recipient.validAmount()) {
          router.navigate('/confirm', { trigger: true });
        } else {
          $('.error.amount').show();
        }
      },
      error: function (resp) {
        $('.loading').hide();
        $('.error.recipient').text('please enter a valid ripple address').show();
      }
    });
  });

  $('header').on('click', function () {
    router.navigate('/', { trigger: true });
  });

  window.api = api;
});

$(function () {
  RipplePay = (function () {
    var launched = false,
        configured = false,
        transactionUrl,
        userAccountBalances;

    function validateConfiguration(opts) {
      keys = [];
      for (key in opts.userAccountBalances) { keys.push(key) }
      if (keys.length > 0 && opts.transactionUrl) {
        return true
      } else {
        return false
      }
    }

    function configure(opts) {
      configured = validateConfiguration(opts);
      return configured;
    }

    function getTransactionUrl () {
      return transactionUrl;
    }

    function getUserAccountBalances () {
      return userAccountBalances;
    }

    function launch () {
      if (configured) {
        $('.main-container').show();
        $('.main-container').addClass('alive');
        launched = true;
      }
    }

    function dismiss () {
      if (configured) {
        $('.main-container').removeClass('alive');
        launched = false;
      }
    }

    function toggle () {
      launched ? dismiss() : launch();
    }

    return {
      launch: launch,
      dismiss: dismiss,
      toggle: toggle,
      configure: configure
    }
  })();

  RipplePay.configure({
    transactionUrl: '/ripple/transactions',
    userAccountBalances: { 'USD': 22}
  });


  $('body').click(function(e){
    if ( !$(e.target).closest("#bbb").length ) {
      console.log('is the target');
      RipplePay.toggle();
      e.stopPropagation();
    }
  });

  $('#launch-ripple-pay').on('click', function (e) {
    RipplePay.toggle();
    e.stopPropagation();
  });
});

window.RipplePay = RipplePay;
