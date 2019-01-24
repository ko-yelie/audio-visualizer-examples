/**
 * ファイル名を指定してダウンロード
 * https://blog.leko.jp/post/how-to-download-with-a-tag-without-file-server/
 */
export function download (uri, filename = 'file') {
  const link = document.createElement('a')
  link.download = filename
  link.href = uri
  link.click()
}

export function downloadFile (content, filename) {
  const blob = new Blob([content], { 'type': 'text/plain' })
  const fileUrl = window.URL.createObjectURL(blob)
  download(fileUrl, filename)
}
