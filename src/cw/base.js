/**
 * @fileoverview Base for Cloudware lib used in development mode. This should
 * be included before goog/base.js so that this script will override goog's
 * default writeScriptTag_() function.
 *
 * You don't need to include this file when compiling in ADVANCED_OPTIMIZATIONS
 * mode.
 */

/**
 * Basepath for Cloudware lib.
 */
this.CW_BASEPATH = this.CW_BASEPATH || (function(global) {
  if (global.CW_BASEPATH) {
    return global.CW_BASEPATH;
  }

  var doc = global.document;
  var scripts = doc.getElementsByTagName('script');
  // Search backwards since the current script is in almost all cases the one
  // that has base.js.
  for (var i = scripts.length - 1; i >= 0; --i) {
    var src = scripts[i].src;
    var qmark = src.lastIndexOf('?');
    var l = qmark == -1 ? src.length : qmark;
    if (src.substr(l - 10, 10) == 'cw/base.js') {
      return src.substr(0, l - 7);
    }
  }
})(this)

/**
 * Implementation of the import function that distiguishes between goog. and
 * cw. namespaces.
 *
 * @param {string} src The script source.
 * @return {boolean} True if the script was imported, false otherwise.
 * @private
 */
this.CLOSURE_IMPORT_SCRIPT = (function(global) {
  function mapToCloudwarePath(src) {
    var cw = src.lastIndexOf('cw/');
    return global.CW_BASEPATH + src.substr(cw+3);
  }

  return function(src) {
    var doc = global.document;
    // If the user tries to require a new symbol after document load,
    // something has gone terribly wrong. Doing a document.write would
    // wipe out the page.
    if (doc.readyState == 'complete') {
      // Certain test frameworks load base.js multiple times, which tries
      // to write deps.js each time. If that happens, just fail silently.
      // These frameworks wipe the page between each load of base.js, so this
      // is OK.
      var isDeps = /\bdeps.js$/.test(src);
      if (isDeps) {
        return false;
      } else {
        throw Error('Cannot write "' + src + '" after document load');
      }
    }

    if (/\/cw\//.test(src) || /^cw\//.test(src)) {
      src = mapToCloudwarePath(src);
    }
    doc.write(
      '<script type="text/javascript" src="' + src + '"></' + 'script>');
    return true;
  }
})(this);
