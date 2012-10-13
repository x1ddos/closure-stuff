/**
 * @fileoverview Plugin for picking or uploading images using
 * Google Drive Pickger.
 */

goog.provide('cw.editor.plugins.DrivePicker');

goog.require('goog.dom.TagName');
goog.require('goog.dom.Range');
goog.require('goog.editor.Command');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.range');
goog.require('goog.functions');
goog.require('goog.net.jsloader');

/**
 * Editor plugin for Google Drive Picker.
 *
 * @constructor
 * @extends {goog.editor.Plugin}
 */
cw.editor.plugins.DrivePicker = function() {
  goog.base(this);

  /**
   * Reusable instance of Drive Picker dialog
   * @type {google.picker.Picker}
   * @private
   */
  this.picker_ = null;

  /**
   * Last user selection before Picker dialog dispatching
   * @type {?goog.dom.SavedCaretRange}
   * @private
   */
  this.savedRange_ = null;

  /**
   * True if Google JSAPI and Drive Picker scripts are loaded and we're ready
   * to create a picker object.
   * @type {boolean}
   * @private
   */
  this.loaded_ = false;
}
goog.inherits(cw.editor.plugins.DrivePicker, goog.editor.Plugin);

/** Drive Picker command (image-related) */
cw.editor.plugins.DrivePicker.COMMAND = goog.editor.Command.IMAGE;

/** @override */
cw.editor.plugins.DrivePicker.prototype.getTrogClassId =
  goog.functions.constant(cw.editor.plugins.DrivePicker.COMMAND);

/** @override */
cw.editor.plugins.DrivePicker.prototype.isSupportedCommand =
    function(command) {
  return command == cw.editor.plugins.DrivePicker.COMMAND;
}

/**
 * Creates and show Picker dialog.
 * 
 * @param {string} command Command to execute. Should be IMAGE
 * @param {...*} opt_arg Any additional params.
 * @return {Object|null|boolean} The result of the command, if any.
 * @override
 */
cw.editor.plugins.DrivePicker.prototype.execCommandInternal = 
    function(command, opt_arg) {
  if (!this.loaded_) {
    return false;
  }

  var f = this.getFieldObject();
  // Save current range for Picker callback
  var r = f.getRange();
  this.savedRange_ = r && goog.editor.range.saveUsingNormalizedCarets(r);

  // Create picker if needed
  if (!this.picker_) {
    this.picker_ = this.createPicker();
  }
  goog.dom.Range.clearSelection(f.getEditableDomHelper().getWindow());

  f.setModalMode(true);
  this.picker_.setVisible(true);
  // Since the selection has left the document, dispatch a selection
  // change event.
  f.dispatchSelectionChangeEvent();

  return true;
}

/**
 * Hook Google Picker loading via JSAPI loader asynchronously right away.
 * @param {goog.editor.Field} field The editable field object.
 * @override
 */
cw.editor.plugins.DrivePicker.prototype.registerFieldObject = 
    function(field) {
  goog.base(this, 'registerFieldObject', field);
  this.loadGooglePicker_();
}

/**
 * Loads both JSAPI and Picker, if not already loaded by other scripts.
 * @private
 */
cw.editor.plugins.DrivePicker.prototype.loadGooglePicker_ = function() {
  if (!window['google'] || !window['google']['loader']) {
    // load Google JSAPI loader if there isn't one
    goog.net.jsloader.
      load("https://www.google.com/jsapi").
      addCallback(this.onJsapiLoaderReady_, this)
  } else {
    this.onJsapiLoaderReady_();
  }
}

/**
 * Callback when JSAPI loader is ready
 * @private
 */
cw.editor.plugins.DrivePicker.prototype.onJsapiLoaderReady_ = function() {
  if (!window['google']['picker']) {
    google.load('picker', '1', {
      "callback" : goog.bind(this.onPickerApiReady_, this)
    });
  } else {
    this.onPickerApiReady_();
  }
}

/**
 * Callback for JSAPI loader when Picker API is ready.
 * @private
 */
cw.editor.plugins.DrivePicker.prototype.onPickerApiReady_ = function() {
  this.loaded_ = true;
}

/**
 * Creates a new Picker instance.
 * @return {google.picker.Picker}
 */
cw.editor.plugins.DrivePicker.prototype.createPicker = function() {
  var gdocs = new google.picker.ViewGroup(google.picker.ViewId.DOCS_IMAGES).
    addView(new google.picker.DocsUploadView());

  var picasa = new google.picker.ViewGroup(google.picker.ViewId.PHOTOS).
    addView(google.picker.ViewId.PHOTO_UPLOAD);

  var webcam = new google.picker.WebCamView(
    google.picker.WebCamViewType.STANDARD);

  return new google.picker.PickerBuilder().
    addViewGroup(gdocs).
    addViewGroup(picasa).
    addView(webcam).
    addView(google.picker.ViewId.RECENTLY_PICKED).
    addView(google.picker.ViewId.IMAGE_SEARCH).
    setCallback(goog.bind(this.handlePickerHide_, this)).
    build();
}

/**
 * Callback for google.picker.PickerBuilder.
 * 
 * @param {Object=} data Selected image
 * @private
 */
cw.editor.plugins.DrivePicker.prototype.handlePickerHide_ = function(data) {
  var action = data[google.picker.Response.ACTION];
  if (action != google.picker.Action.PICKED &&
      action != google.picker.Action.CANCEL) {
    return
  }

  var field = this.getFieldObject();

  field.setModalMode(false);
  field.focus();
  if (this.savedRange_) {
    this.savedRange_.restore(); // this also disposes the range
    this.savedRange_ = null;
  }

  if (action == google.picker.Action.PICKED) {
    var doc = data[google.picker.Response.DOCUMENTS][0];
    var thumbs = doc[google.picker.Document.THUMBNAILS];
    
    var h = 0, th, url;
    for (var i=0; i < thumbs.length; i++) {
      th = thumbs[i];
      if (th[google.picker.Thumbnail.HEIGHT] > h) {
        url = th[google.picker.Thumbnail.URL];
      }
    }

    if (url) {
      // Notify the editor that we are about to make changes.
      field.dispatchBeforeChange();

      var dom = this.getFieldDomHelper();
      var img = dom.createDom(goog.dom.TagName.IMG, {
          'src': url
        });
      img = field.getRange().insertNode(img, false)

      // Done making changes, notify the editor.
      field.dispatchChange();

      goog.editor.range.placeCursorNextTo(img, false);
    }
  }

  // Since the selection has returned to the document, dispatch a selection
  // change event.
  field.dispatchSelectionChangeEvent();

  // When the dialog closes due to pressing enter or escape, that happens on
  // the keydown event. But the browser will still fire a keyup event after
  // that, which is caught by the editable field and causes it to try to fire a
  // selection change event. To avoid that, we "debounce" the selection change
  // event, meaning the editable field will not fire that event if the keyup
  // that caused it immediately after this dialog was hidden ("immediately"
  // means a small number of milliseconds defined by the editable field).
  field.debounceEvent(goog.editor.Field.EventType.SELECTIONCHANGE);
}

/** @override */
cw.editor.plugins.DrivePicker.prototype.disposeInternal = function() {
  delete this.picker_;
  this.picker_ = null;

  if (this.savedRange_) {
    this.savedRange_.dispose();
    this.savedRange_ = null;
  }

  goog.base(this, 'disposeInternal');
}
