/**
 * @fileoverview Seamless editor with a bunch of default plugins we always
 * use anyway.
 */

goog.provide('cw.editor.DefaultEditor');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.editor.Command');
goog.require('goog.editor.SeamlessField');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.editor.plugins.EnterHandler');
goog.require('goog.editor.plugins.HeaderFormatter');
goog.require('goog.editor.plugins.LinkBubble');
goog.require('goog.editor.plugins.LinkDialogPlugin');
goog.require('goog.editor.plugins.ListTabHandler');
goog.require('goog.editor.plugins.LoremIpsum');
goog.require('goog.editor.plugins.RemoveFormatting');
goog.require('goog.editor.plugins.SpacesTabHandler');
goog.require('goog.editor.plugins.UndoRedo');
goog.require('cw.editor.plugins.DrivePicker');
goog.require('cw.editor.plugins.EditHtml');
goog.require('goog.ui.editor.DefaultToolbar');
goog.require('goog.ui.editor.ToolbarController');


/**
 * This class encapsulates an seamless field with toobar and other goodies.
 * To see events fired by this object, please see goog.editor.Field class.
 *
 * @param {string} id An identifer of the original element, normally 
 *     a textarea. #editor and #toobar elements will be created as siblings
 *     and the original element will be hidden.
 * @param {Document=} opt_doc The document that the element with the given
 *     id can be found it.
 * @constructor
 * @extends {goog.editor.SeamlessField}
 */
cw.editor.DefaultEditor = function(id, opt_doc) {
  var dom = goog.dom.getDomHelper(opt_doc);
  // Store original form element (probably textarea)
  // for when editor is loaded
  this.sourceElem_ = dom.getElement(id);

  // Create editor and toolbar DOM
  var editorElem = dom.createDom(goog.dom.TagName.DIV, {
    'id': id + '_editor',
    'class': cw.editor.DefaultEditor.CSS
  });
  var toolbarElem = dom.createDom(
    goog.dom.TagName.DIV, {'id': id + '_toolbar'});

  dom.insertSiblingAfter(toolbarElem, this.sourceElem_);
  dom.insertSiblingAfter(editorElem, toolbarElem);
  this.sourceElem_.style.display = 'none';

  goog.base(this, editorElem.id, opt_doc);
  this.initDefaults_(toolbarElem);

  // Hook up on delayed changes to update the source element.
  this.addEventListener(
    goog.editor.Field.EventType.DELAYEDCHANGE,
    this.updateSourceElem_, false, this);
};
goog.inherits(cw.editor.DefaultEditor, goog.editor.SeamlessField);

/**
 * CSS class for the #id_editor element
 */
cw.editor.DefaultEditor.CSS = goog.getCssName('cw-editor');

/**
 * @type {goog.ui.editor.ToolbarController}
 * @private
 */
cw.editor.DefaultEditor.prototype.toolbarCtrl_;

/**
 * Original from element, a textarea or something. Will use its value
 * to set the inital contents of the editor when loaded.
 * @type {Element}
 * @private
 */
cw.editor.DefaultEditor.prototype.sourceElem_;

/**
 * Handle the loading of the field (e.g. once the field is ready to setup).
 * @protected
 * @override
 */
cw.editor.DefaultEditor.prototype.handleFieldLoad = function() {
  goog.base(this, 'handleFieldLoad');
  this.setHtml(false, this.sourceElem_.value, true, true);
}

/**
 * Updates original source element (most likely textarea) with the 
 * clean contents of this field.
 */
cw.editor.DefaultEditor.prototype.updateSourceElem_ = function() {
  this.sourceElem_.value = this.getCleanContents();
}

/**
 * Registers a bunch of Field plugins.
 * @param {!Element} toolbarElem Element where the toolbar will be rendered.
 * @private
 */
cw.editor.DefaultEditor.prototype.initDefaults_ = function(toolbarElem) {
  // Plugins
  this.registerPlugin(new goog.editor.plugins.BasicTextFormatter());
  this.registerPlugin(new goog.editor.plugins.RemoveFormatting());
  this.registerPlugin(new goog.editor.plugins.UndoRedo());
  this.registerPlugin(new goog.editor.plugins.ListTabHandler());
  this.registerPlugin(new goog.editor.plugins.SpacesTabHandler());
  this.registerPlugin(new goog.editor.plugins.EnterHandler());
  this.registerPlugin(new goog.editor.plugins.HeaderFormatter());
  this.registerPlugin(
    new goog.editor.plugins.LoremIpsum('Click here to edit'));
  var linkDialog = new goog.editor.plugins.LinkDialogPlugin();
  linkDialog.showRelNoFollow();
  this.registerPlugin(linkDialog);
  this.registerPlugin(new goog.editor.plugins.LinkBubble());
  this.registerPlugin(new cw.editor.plugins.DrivePicker());
  this.registerPlugin(new cw.editor.plugins.EditHtml());

  // Toolbar
  var buttons = [
    goog.editor.Command.BOLD,
    goog.editor.Command.ITALIC,
    goog.editor.Command.UNDERLINE,
    goog.editor.Command.FONT_COLOR,
    goog.editor.Command.BACKGROUND_COLOR,
    goog.editor.Command.FONT_FACE,
    goog.editor.Command.FONT_SIZE,
    goog.editor.Command.LINK,
    goog.editor.Command.IMAGE,
    goog.editor.Command.UNORDERED_LIST,
    goog.editor.Command.ORDERED_LIST,
    goog.editor.Command.INDENT,
    goog.editor.Command.OUTDENT,
    goog.editor.Command.JUSTIFY_LEFT,
    goog.editor.Command.JUSTIFY_CENTER,
    goog.editor.Command.JUSTIFY_RIGHT,
    goog.editor.Command.SUBSCRIPT,
    goog.editor.Command.SUPERSCRIPT,
    goog.editor.Command.STRIKE_THROUGH,
    goog.editor.Command.REMOVE_FORMAT,
    goog.editor.Command.EDIT_HTML
  ];
  var toolbar = goog.ui.editor.DefaultToolbar.makeToolbar(
    buttons, toolbarElem);

  this.toolbarCtrl_ =
    new goog.ui.editor.ToolbarController(this, toolbar);
}

/** @override */
cw.editor.DefaultEditor.prototype.disposeInternal = function() {
  this.toolbarCtrl_.dispose();
  delete this.toolbarCtrl_;
  goog.base(this, 'disposeInternal');
}
