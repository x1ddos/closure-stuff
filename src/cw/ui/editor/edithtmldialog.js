/**
 * @fileoverview A dialog for editing raw HTML in plain text.
 */

goog.provide('cw.ui.editor.EditHtmlDialog');
goog.provide('cw.ui.editor.EditHtmlDialog.OkEvent');

goog.require('goog.dom.TagName');
goog.require('goog.ui.editor.AbstractDialog');
goog.require('goog.ui.editor.AbstractDialog.Builder');
goog.require('goog.ui.editor.AbstractDialog.EventType');

/**
 * A type of goog.ui.editor.AbstractDialog for editing raw HTML.
 * @param {goog.dom.DomHelper} domHelper DomHelper to be used to create the
 *     dialog's dom structure.
 * @param {string} html
 * @constructor
 * @extends {goog.ui.editor.AbstractDialog}
 */
cw.ui.editor.EditHtmlDialog = function(domHelper, html) {
  goog.base(this, domHelper);
  this.rawHtml_ = html;
};
goog.inherits(cw.ui.editor.EditHtmlDialog, goog.ui.editor.AbstractDialog);


/**
 * OK event object for the dialog.
 * @param {string} html The html edited in a textarea or something.
 * @constructor
 * @extends {goog.events.Event}
 */
cw.ui.editor.EditHtmlDialog.OkEvent = function(html) {
  goog.base(this, goog.ui.editor.AbstractDialog.EventType.OK);

  /**
   * Edited raw HTML
   * @type {string}
   */
  this.rawHtml = html;
};
goog.inherits(cw.ui.editor.EditHtmlDialog.OkEvent, goog.events.Event);


/**
 * @desc CSS class for dialog's textarea where raw HTML is being edited
 */
cw.ui.editor.EditHtmlDialog.TEXTAREA_CSS = goog.getCssName('cw-edithtml');

/**
 * @desc Title for the dialog that edits raw HTML
 */
cw.ui.editor.EditHtmlDialog.MSG_TITLE = goog.getMsg('Edit raw HTML');

/**
 * Raw HTML initially passed in the constructor
 * @type {string}
 * @private
 */
cw.ui.editor.EditHtmlDialog.prototype.rawHtml_;

/**
 * Textarea where raw HTML is being edited.
 * @type {Element}
 * @private
 */
cw.ui.editor.EditHtmlDialog.prototype.textarea_ = null;

/**
 * Creates and returns the event object to be used when dispatching the OK
 * event to listeners.
 * @return {cw.ui.editor.EditHtmlDialog.OkEvent}
 * @protected
 * @override
 */
cw.ui.editor.EditHtmlDialog.prototype.createOkEvent = function() {
  return new cw.ui.editor.EditHtmlDialog.OkEvent(this.textarea_.value);
}

/**
 * Causes the dialog box to appear, centered on the screen. Lazily creates the
 * dialog if needed.
 * @override
 */
cw.ui.editor.EditHtmlDialog.prototype.show = function() {
  goog.base(this, 'show');
  goog.editor.focus.focusInputField(this.textarea_);
}

/**
 * @protected
 * @override
 */
cw.ui.editor.EditHtmlDialog.prototype.createDialogControl = function() {
  if (!this.textarea_) {
    this.textarea_ = this.dom.createDom(goog.dom.TagName.TEXTAREA, {
      'class': cw.ui.editor.EditHtmlDialog.TEXTAREA_CSS
    });
  }
  this.textarea_.value = this.rawHtml_;

  var builder = new goog.ui.editor.AbstractDialog.Builder(this);
  builder.
    setTitle(cw.ui.editor.EditHtmlDialog.MSG_TITLE).
    setContent(this.textarea_);

  return builder.build();
};

/** @override */
cw.ui.editor.EditHtmlDialog.prototype.disposeInternal = function() {
  this.textarea_ = null;
  goog.base(this, 'disposeInternal');
}
