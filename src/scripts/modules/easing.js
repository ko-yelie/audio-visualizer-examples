/*!
 * Terms of Use: Easing Functions (Equations)
 *
 * Open source under the MIT License and the 3-Clause BSD License.
 * Copyright © 2001 Robert Penner
 * http://robertpenner.com/easing_terms_of_use.html
 */

/**
 * linear
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function linear (t, b, c, d) {
  return (c * t) / d + b
}

/**
 * easeInQuad
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInQuad (t, b, c, d) {
  return c * (t /= d) * t + b
}

/**
 * easeOutQuad
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutQuad (t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b
}

/**
 * easeInOutQuad
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutQuad (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * t * t + b
  return (-c / 2) * (--t * (t - 2) - 1) + b
}

/**
 * easeInCubic
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInCubic (t, b, c, d) {
  return c * Math.pow(t / d, 3) + b
}

/**
 * easeOutCubic
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutCubic (t, b, c, d) {
  return c * (Math.pow(t / d - 1, 3) + 1) + b
}

/**
 * easeInOutCubic
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutCubic (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 3) + b
  return (c / 2) * (Math.pow(t - 2, 3) + 2) + b
}

/**
 * easeInQuart
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInQuart (t, b, c, d) {
  return c * Math.pow(t / d, 4) + b
}

/**
 * easeOutQuart
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutQuart (t, b, c, d) {
  return -c * (Math.pow(t / d - 1, 4) - 1) + b
}

/**
 * easeInOutQuart
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutQuart (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 4) + b
  return (-c / 2) * (Math.pow(t - 2, 4) - 2) + b
}

/**
 * easeInQuint
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInQuint (t, b, c, d) {
  return c * Math.pow(t / d, 5) + b
}

/**
 * easeOutQuint
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutQuint (t, b, c, d) {
  return c * (Math.pow(t / d - 1, 5) + 1) + b
}

/**
 * easeInOutQuint
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutQuint (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 5) + b
  return (c / 2) * (Math.pow(t - 2, 5) + 2) + b
}

/**
 * easeInSine
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInSine (t, b, c, d) {
  return c * (1 - Math.cos((t / d) * (Math.PI / 2))) + b
}

/**
 * easeOutSine
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutSine (t, b, c, d) {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b
}

/**
 * easeInOutSine
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutSine (t, b, c, d) {
  return (c / 2) * (1 - Math.cos((Math.PI * t) / d)) + b
}

/**
 * easeInExpo
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInExpo (t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1)) + b
}

/**
 * easeOutExpo
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutExpo (t, b, c, d) {
  return c * (-Math.pow(2, (-10 * t) / d) + 1) + b
}

/**
 * easeInOutExpo
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutExpo (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
  return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
}

/**
 * easeInCirc
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInCirc (t, b, c, d) {
  return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b
}

/**
 * easeOutCirc
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeOutCirc (t, b, c, d) {
  return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
}

/**
 * easeInOutCirc
 *
 * @param {number} t time: 現在時刻 (0 ~ duration)
 * @param {number} b begin: 開始位置
 * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
 * @param {number} d duration: 全体時間
 * @returns {number} 現在位置
 */
export function easeInOutCirc (t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * (1 - Math.sqrt(1 - t * t)) + b
  return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
}

export const easingList = [
  'linear',
  'easeInSine',
  'easeOutSine',
  'easeInOutSine',
  'easeInQuad',
  'easeOutQuad',
  'easeInOutQuad',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'easeInQuart',
  'easeOutQuart',
  'easeInOutQuart',
  'easeInQuint',
  'easeOutQuint',
  'easeInOutQuint',
  'easeInExpo',
  'easeOutExpo',
  'easeInOutExpo',
  'easeInCirc',
  'easeOutCirc',
  'easeInOutCirc'
]
