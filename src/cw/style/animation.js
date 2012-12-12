// Copyright 2012 Cloudware Srl. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility methods to deal with CSS3 animations
 * programmatically.
 */

goog.provide('cw.style.animation');
goog.provide('cw.style.animation.Css3Property');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.userAgent');


/**
 * A typedef to represent a CSS3 animation property. Duration and delay
 * are both in seconds. Timing is CSS3 timing function string, such as
 * 'ease-in', 'linear', 'ease-out'.
 *
 * Direction can be 'normal', 'alternate', ecc:
 * https://developer.mozilla.org/en-US/docs/CSS/animation-direction
 *
 * Alternatively, specifying string in the form of '<name> <duration>
 * <timing_function> <delay> <iteration_count> <direction>' as specified
 * in CSS3 animation is fine too.
 *
 * @typedef { {
 *   name: string,
 *   duration: number,
 *   timing: string,
 *   delay: number,
 *   count: string,
 *   dir: string
 * } | string }
 */
cw.style.animation.Css3Property;


/**
 * Sets the element CSS3 transition to properties.
 * @param {Element} element The element to set transition on.
 * @param {cw.style.animation.Css3Property|
 *     Array.<cw.style.animation.Css3Property>} properties A single CSS3
 *     transition property or array of properties.
 */
cw.style.animation.set = function(element, properties) {
  if (!goog.isArray(properties)) {
    properties = [properties];
  }
  goog.asserts.assert(
      properties.length > 0, 'At least one Css3Property should be specified.');

  var values = goog.array.map(
      properties, function(p) {
        if (goog.isString(p)) {
          return p;
        } else {
          goog.asserts.assertObject(p,
              'Expected css3 property to be an object.');
          var propString = p.name + ' ' + p.duration + 's ' + p.timing +
              ' ' + p.delay + 's ' + (p.count || 'infinite') + ' ' +
              (p.dir || 'normal');
          goog.asserts.assert(p.name && goog.isNumber(p.duration) &&
              p.timing && goog.isNumber(p.delay),
              'Unexpected css3 property value: %s', propString);
          return propString;
        }
      });
  cw.style.animation.setPropertyValue_(element, values.join(','));
};


/**
 * Removes any programmatically-added CSS3 transition in the given element.
 * @param {Element} element The element to remove transition from.
 */
cw.style.animation.removeAll = function(element) {
  cw.style.animation.setPropertyValue_(element, '');
};


/**
 * @return {boolean} Whether CSS3 transition is supported.
 */
cw.style.animation.isSupported = function() {
  if (!goog.isDef(cw.style.animation.css3AnimationSupported_)) {
    // Since IE would allow any attribute, we need to explicitly check the
    // browser version here instead.
    if (goog.userAgent.IE) {
      cw.style.animation.css3AnimationSupported_ =
          goog.userAgent.isVersion('10.0');
    } else {
      // We create a test element with style=-webkit-animation, etc.
      // We then detect whether those style properties are recognized and
      // available from js.
      var el = document.createElement('div');
      el.innerHTML = '<div style="-webkit-animation:test;' +
          '-moz-transition:test; -o-transition:test;' +
          'transition:test">';

      var testElement = /** @type {Element} */ (el.firstChild);
      goog.asserts.assert(testElement.nodeType == Node.ELEMENT_NODE);

      cw.style.animation.css3AnimationSupported_ =
          goog.isDef(testElement.style.animation) ||
          goog.isDef(testElement.style.WebkitAnimation) ||
          goog.isDef(testElement.style.MozAnimation) ||
          goog.isDef(testElement.style.OAnimation);
    }
  }

  return cw.style.animation.css3AnimationSupported_;
};


/**
 * Whether CSS3 transition is supported.
 * @type {boolean}
 * @private
 */
cw.style.animation.css3AnimationSupported_;


/**
 * Sets CSS3 transition property value to the given value.
 * @param {Element} element The element to set transition on.
 * @param {string} transitionValue The CSS3 transition property value.
 * @private
 */
cw.style.animation.setPropertyValue_ = function(element, animationValue) {
  element.style.WebkitAnimation = animationValue;
  element.style.MozAnimation = animationValue;
  element.style.MSAnimation = animationValue;
  element.style.OAnimation = animationValue;
  element.style.animation = animationValue;
};
