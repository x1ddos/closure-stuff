/**
 * @fileoverview Standalone version of cw.editor.DefaultEditor
 */

goog.provide('nodeps.htmlEditor');

goog.require('cw.editor.DefaultEditor');

/**
 * Creates a new cw.editor.DefaultEditor instance and makes it editable
 * right away.
 * @param  {string} id Element #id
 */
nodeps.htmlEditor = function(id) {
  new cw.editor.DefaultEditor(id).makeEditable();
}

goog.exportSymbol('nodeps.htmlEditor', nodeps.htmlEditor);
