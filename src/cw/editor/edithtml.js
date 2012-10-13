/**
 * @fileoverview Plugin for editing raw HTML
 */

goog.provide('cw.editor.plugins.EditHtml');

goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.AbstractDialogPlugin');
goog.require('goog.ui.editor.AbstractDialog.EventType');
goog.require('goog.functions');
goog.require('cw.ui.editor.EditHtmlDialog');

/**
 * A plugin that opens raw HTML editing dialog.
 * @constructor
 * @extends {goog.editor.plugins.AbstractDialogPlugin}
 */
cw.editor.plugins.EditHtml = function() {
  goog.base(this, goog.editor.Command.EDIT_HTML);

  /**
   * Event handler for this object.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);
}
goog.inherits(cw.editor.plugins.EditHtml,
  goog.editor.plugins.AbstractDialogPlugin);

/** @override */
cw.editor.plugins.EditHtml.prototype.getTrogClassId =
    goog.functions.constant('EditHtml');

/**
 * Handles execCommand by opening the dialog.
 * @param {string} command The command to execute.
 * @param {*=} opt_arg Unused
 * @return {*} Always returns true, indicating the dialog was shown.
 * @protected
 * @override
 */
cw.editor.plugins.EditHtml.prototype.execCommandInternal = 
    function(command, opt_arg) {
  var rawHtml = this.getFieldObject().getCleanContents();
  return goog.base(this, 'execCommandInternal', command, rawHtml);
};

/**
 * @return {goog.events.EventHandler} The event handler.
 * @protected
 */
cw.editor.plugins.EditHtml.prototype.getEventHandler = function() {
  return this.eventHandler_;
};

/**
 * @param {*=} html Raw HTML (should be a string).
 * @override
 * @protected
 */
cw.editor.plugins.EditHtml.prototype.createDialog = function(
    dialogDomHelper, html) {
  var dialog = new cw.ui.editor.EditHtmlDialog(dialogDomHelper,
    /** @type {string} */ (html || ''));

  this.eventHandler_.
    listen(dialog, goog.ui.editor.AbstractDialog.EventType.OK, this.handleOk);

  return dialog;
};

/**
 * Handles the OK event from the dialog by replacing HTML code in the field.
 * @param {cw.ui.editor.EditHtmlDialog.OkEvent} e OK event object.
 * @protected
 */
cw.editor.plugins.EditHtml.prototype.handleOk = function(e) {
  // We're not restoring the original selection, so clear it out.
  this.disposeOriginalSelection();

  var field = this.getFieldObject();
  field.setHtml(
    false, /* addParas */
    e.rawHtml,
    false, /* opt_dontFireDelayedChange */
    true /* opt_applyLorem */
  );
  field.focus();

  this.eventHandler_.removeAll();
};

/** @override */
cw.editor.plugins.EditHtml.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.eventHandler_.dispose();
};
