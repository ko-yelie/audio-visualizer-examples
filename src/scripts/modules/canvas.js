/**
 * テキストを描画した canvas を生成する
 *
 * @export
 * @param {Object} option オプション
 * @param {string} option.text テキスト
 * @param {number} option.fontSize font-size
 * @param {string} [option.font='Open sans'] font-family
 * @param {string} [option.color='#000000'] color
 * @param {number} option.width canvas の width
 * @param {number} option.height canvas の height
 * @returns canvas 要素
 */
export function getTextCoordinate (option) {
  let {
    text,
    fontSize,
    letterSpacing = 0,
    font = 'Open sans',
    color = '#000000',
    width = fontSize * text.length + fontSize * letterSpacing * (text.length - 1),
    height = fontSize,
    pixelRatio = window.devicePixelRatio
  } = option

  fontSize *= pixelRatio
  width *= pixelRatio
  height *= pixelRatio

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.fontSize = fontSize + 'px'
  canvas.style.letterSpacing = letterSpacing + 'em'
  canvas.style.display = 'none'
  document.body.appendChild(canvas) // letter-spacing を有効にするために必要

  const ctx = canvas.getContext('2d')
  ctx.font = `${fontSize}px ${font}`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // \n で改行して複数行にする
  const textLines = text.split('\n')
  textLines.forEach((text, i) => {
    const x = width / 2
    const y = height / 2 + fontSize * i - (fontSize / 2 * (textLines.length - 1))
    ctx.fillText(text, x, y)
  })

  return canvas
}
