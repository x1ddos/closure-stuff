/**
 * @fileoverview Externs for various Google APIs (e.g. Drive Picker)
 * @externs
 */

var google = {}

/**
 * Drive Picker client
 */
google.picker = {};

/** @constructor */
google.picker.Picker = function(){};
/**
 * Shows or hides the picker
 * @param {boolean} show
 */
google.picker.Picker.prototype.setVisible = function(show) {};

/** @constructor */
google.picker.View = function(){};

/**
 * Predefined Views definitions
 * @typedef {Object}
 */
google.picker.ViewId;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DOCS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DOCS_IMAGES;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DOCS_VIDEOS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DOCUMENTS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.DRAWINGS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.FOLDERS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.FORMS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.IMAGE_SEARCH;
/** @type {google.picker.ViewId} */
google.picker.ViewId.MAPS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.PDFS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.PHOTOS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.PHOTO_ALBUMS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.PHOTO_UPLOAD;
/** @type {google.picker.ViewId} */
google.picker.ViewId.PRESENTATIONS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.RECENTLY_PICKED;
/** @type {google.picker.ViewId} */
google.picker.ViewId.SPREADSHEETS;
/** @type {google.picker.ViewId} */
google.picker.ViewId.VIDEO_SEARCH;
/** @type {google.picker.ViewId} */
google.picker.ViewId.WEBCAM;
/** @type {google.picker.ViewId} */
google.picker.ViewId.YOUTUBE;

/**
 * @param {(google.picker.View|google.picker.ViewId)} view
 * @constructor
 */
google.picker.ViewGroup = function(view) {};

/**
 * @param {(google.picker.View|google.picker.ViewId)} view
 */
google.picker.ViewGroup.prototype.addView = function(view) {};

/** @typedef {Object} */
google.picker.WebCamViewType;
/** @type {google.picker.WebCamViewType} */
google.picker.WebCamViewType.STANDARD;
/** @type {google.picker.WebCamViewType} */
google.picker.WebCamViewType.VIDEO;

/**
 * @constructor
 * @param {google.picker.WebCamViewType} view
 */
google.picker.WebCamView = function(view){};

/** @constructor */
google.picker.DocsUploadView = function(){};

/** @constructor */
google.picker.Document = function() {};
/** @type {string} */
google.picker.Document.THUMBNAILS;

/** @constructor */
google.picker.Response = function() {};
/**
 * @type {string}
 * @const
 */
google.picker.Response.DOCUMENTS;
/**
 * @type {string}
 * @const
 */
google.picker.Response.ACTION;

/** @constructor */
google.picker.Thumbnail = function() {};
/** @type {string} */
google.picker.Thumbnail.HEIGHT;
/** @type {string} */
google.picker.Thumbnail.URL;

/** @constructor */
google.picker.Action = function() {};
/** @type {string} */
google.picker.Action.PICKED;
/** @type {string} */
google.picker.Action.CANCEL;

/** @constructor */
google.picker.PickerBuilder = function(){};
/** @param {google.picker.View|google.picker.ViewId} v */
google.picker.PickerBuilder.prototype.addView = function(v){}
/** @param {google.picker.ViewGroup} g */
google.picker.PickerBuilder.prototype.addViewGroup = function(g){}
/** @param {function(Object)} fn */
google.picker.PickerBuilder.prototype.setCallback = function(fn){}
/** @return {google.picker.Picker} */
google.picker.PickerBuilder.prototype.build = function(){}
