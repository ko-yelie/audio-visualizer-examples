import * as easingFunctions from './easing'

/**
 * アニメーション関数
 *
 * @param {AnimationCallback} fn アニメーションフレーム毎に実行するコールバック
 * @param {Object} [options={}] オプション
 * @param {number} [options.begin=0] 開始位置
 * @param {number} [options.finish=1] 終了位置
 * @param {number} [options.duration=500] 全体時間
 * @param {string} [options.easing='easeInOutCubic'] Easing function
 */
export function animate (fn, options = {}) {
  const {
    begin = 0,
    finish = 1,
    duration = 500,
    easing = 'easeInOutCubic',
    isRoop = false,
    onAfter
  } = options

  const change = finish - begin
  const easingFunction = easingFunctions[easing]
  let startTime

  function tick (timestamp) {
    const time = Math.min(duration, timestamp - startTime)
    const position = easingFunction(time, begin, change, duration)

    fn(position, time)

    if (time === duration) {
      if (isRoop) {
        startTime = timestamp
        requestAnimationFrame(tick)
      } else {
        onAfter && onAfter()
      }
    } else {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(timestamp => {
    startTime = timestamp
    tick(timestamp)
  })
}

export class Animation {
  constructor (fn, options) {
    const {
      begin = 0,
      finish = 1,
      duration = 500,
      easing = 'easeInOutCubic',
      isRoop = false,
      isAuto = true,
      onBefore,
      onAfter,
      onStop
    } = options

    this.fn = fn
    this.duration = duration
    this.easingFunction = easingFunctions[easing]
    this.originalFrom = begin
    this.originalTo = finish
    this.isRoop = isRoop
    this.onBefore = onBefore
    this.onAfter = onAfter
    this.onStop = onStop

    isAuto && this.start()
  }

  set easing (easing) {
    this.easingFunction = easingFunctions[easing]
  }

  tick (timestamp) {
    const time = Math.min(this.duration, timestamp - this.startTime)
    const position = this.easingFunction(time, this.begin, this.change, this.duration)

    this.fn(position, time)

    if (time === this.duration) {
      if (this.isRoop) {
        this.animate()
      } else {
        this.onAfter && this.onAfter()
      }
    } else {
      this.id = requestAnimationFrame(this.tick.bind(this))
    }
  }

  animate () {
    this.id = requestAnimationFrame(timestamp => {
      this.startTime = timestamp
      this.tick(timestamp)
    })
  }

  start () {
    this.onBefore && this.onBefore()
    this.begin = this.originalFrom
    this.finish = this.originalTo
    this.change = this.finish - this.begin

    this.id && this.stop()
    this.animate()
  }

  reverse () {
    this.onBefore && this.onBefore()
    this.begin = this.originalTo
    this.finish = this.originalFrom
    this.change = this.finish - this.begin

    this.id && this.stop()
    this.animate()
  }

  play () {
    this.animate()
  }

  stop () {
    cancelAnimationFrame(this.id)
    this.id = null
    this.onStop && this.onStop()
  }
}

/**
 * @typedef {function} AnimationCallback
 * @param {number} position 現在位置
 * @param {number} time 現在時刻 (0 ~ duration)
 */
