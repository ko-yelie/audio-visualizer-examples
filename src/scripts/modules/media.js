import { getFirstValue } from './utils.js'
// import { Webcam } from './webcam.js'
// import { getUrl } from '../../../../modules/url'

export default class Media {
  constructor (option) {
    const { size, bufferLength } = option
    // this.size = size
    this.bufferLength = bufferLength

    // this.video = document.createElement('video')
    // this.video.width = this.size
    // this.video.height = this.size
    // this.video.loop = true
    // this.video.muted = true

    // this.currentVideo = this.video

    // this.videoDevices = {}
    // this.videoFiles = {}
    this.audioDevices = {}
    // this.videoSource = false
    this.audioSource = false

    this.audioCtx = new AudioContext()

    // this.initWebcam()
    // this.initVideoFiles()
    // this.loadSmartphone()
  }

  // initWebcam () {
  //   this.webcam = new Webcam(this.currentVideo)
  //   // await this.webcam.setup()
  //   this.webcam.adjustVideoSize(this.currentVideo.videoWidth || this.currentVideo.naturalWidth, this.currentVideo.videoHeight || this.currentVideo.naturalHeight)
  // }

  // initVideoFiles () {
  //   ;['Dance-4428'].forEach(videoId => {
  //     const video = document.createElement('video')
  //     video.src = getUrl(`/src/visual/assets/video/${videoId}.mp4`)
  //     video.width = this.size
  //     video.height = this.size
  //     video.loop = true
  //     video.muted = true

  //     const id = `file:${videoId}`
  //     this.videoDevices[`File: ${videoId}`] = id
  //     this.videoFiles[id] = video
  //   })

  //   this.videoSource = getFirstValue(this.videoDevices)
  // }

  // // smartphone webcam
  // loadSmartphone () {
  //   const smartphone = document.getElementById('smartphone')
  //   if (!smartphone) return

  //   this.smartphone = smartphone
  //   this.smartphone.width = this.size
  //   this.smartphone.height = this.size

  //   this.videoDevices['Smartphone'] = 'smartphone'
  // }

  enumerateDevices () {
    return navigator.mediaDevices.enumerateDevices().then(mediaDeviceInfos => {
      let webcamCount = 0
      let audioCount = 0
      // const videoDevices = {}
      const audioDevices = {}

      mediaDeviceInfos.forEach(mediaDeviceInfo => {
        switch (mediaDeviceInfo.kind) {
          // case 'videoinput':
          //   videoDevices[mediaDeviceInfo.label.replace(/ \(.+?\)/, '')] = mediaDeviceInfo.deviceId
          //   webcamCount++
          //   break
          case 'audioinput':
            audioDevices[mediaDeviceInfo.label.replace(/ \(.+?\)/, '')] = mediaDeviceInfo.deviceId
            audioCount++
            break
        }
      })

      if (webcamCount > 1) {
        // delete videoDevices['FaceTime HD Camera']
      } else if (webcamCount === 0) {
        this.noWebcam = true
      }

      if (webcamCount === 0 && audioCount === 0) {
        this.noMedia = true
      } else {
        // this.videoSource = videoDevices['HD Pro Webcam C920'] || getFirstValue(videoDevices)
        this.audioSource = audioDevices['HD Pro Webcam C920'] || getFirstValue(audioDevices)
        // Object.assign(this.videoDevices, videoDevices)
        Object.assign(this.audioDevices, audioDevices)
      }
    })
  }

  setAudio (audioSource) {
    const audio = new Audio(audioSource)
    audio.loop = true
    this.source = this.audioCtx.createMediaElementSource(audio)
    const gain = this.audioCtx.createGain()
    gain.gain.value = 0.4
    gain.connect(this.audioCtx.destination)
    this.source.connect(gain)
    this.setAnalyser()
    audio.play()
  }

  getUserMedia (sources = {}) {
    // let videoFile, smartphoneFile
    // if (/^file:/.test(sources.video)) {
    //   videoFile = this.videoFiles[sources.video]
    // } else if (sources.video === 'smartphone') {
    //   smartphoneFile = this.smartphone
    // }
    // this.videoSource = sources.video || this.videoSource
    this.audioSource = sources.audio || this.audioSource

    return new Promise(resolve => {
      // if (this.noMedia) {
      //   this.currentVideo = videoFile || this.videoFiles[this.videoSource]
      // } else {
        // get webcam
        navigator.mediaDevices
          .getUserMedia({
            // video: this.videoSource && { deviceId: this.videoSource },
            audio: this.audioSource && { deviceId: this.audioSource }
          })
          .then(stream => {
            // on webcam enabled
            // if (videoFile) {
            //   this.currentVideo = videoFile
            // } else if (this.noWebcam) {
            //   this.currentVideo = this.videoFiles[this.videoSource]
            // } else if (smartphoneFile) {
            //   this.currentVideo = smartphoneFile
            // } else {
            //   this.video.srcObject = stream
            //   this.currentVideo = this.video
            // }

            this.source = this.audioCtx.createMediaStreamSource(stream)
            // this.source = this.audioCtx.createMediaElementSource(this.currentVideo)
            this.setAnalyser()

            resolve()
          })
          .catch(e => {
            console.error(e)
          })
      // }

      // const playVideo = () => {
      //   // 複数回呼ばれないようにイベントを削除
      //   this.currentVideo.removeEventListener('canplay', playVideo)
      //   // video 再生開始をコール
      //   this.currentVideo.play()

      //   this.initWebcam()

      //   resolve(this.currentVideo)
      // }

      // if (smartphoneFile) {
      //   resolve(this.currentVideo)
      // } else if (this.currentVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      //   playVideo()
      // } else {
      //   this.currentVideo.addEventListener('canplay', playVideo)
      // }
    })
  }

  setAnalyser () {
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = this.bufferLength
    this.source.connect(this.analyser)
    this.array = new Uint8Array(this.bufferLength)
  }

  getVolumeArray (fn) {
    if (this.noMedia) return 1

    this.analyser.getByteTimeDomainData(this.array)
    return this.array
  }

  getVolume () {
    if (this.noMedia) return 1

    let sum = 0
    this.analyser.getByteTimeDomainData(this.array)
    for (let i = 0; i < this.bufferLength; ++i) {
      sum += Math.abs(this.array[i] / 255 * 2 - 1)
    }
    return sum / this.bufferLength
  }

  getWrongVolume () {
    if (this.noMedia) return 1

    let sum = 0
    this.analyser.getByteTimeDomainData(this.array)
    for (let i = 0; i < this.bufferLength; ++i) {
      sum += this.array[i]
    }
    return sum / this.bufferLength / 255
  }
}
