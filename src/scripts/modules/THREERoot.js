import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import './three/postprocessing'

THREE.TrackballControls = TrackballControls

/*!
 * Three.js Wrapper
 * forked from https://github.com/zadvorsky/three.bas/blob/86931253240abadf68b7c62edb934b994693ed4a/examples/_js/root.js
 */
export default class THREERoot {
  constructor (params) {
    // defaults
    const {
      container = document.body,
      fov = 45,
      zNear = 1,
      zFar,
      cameraPosition = [0, 0, 30],
      createCameraControls = false,
      autoStart = true,
      pixelRatio = window.devicePixelRatio,
      antialias = (window.devicePixelRatio === 1),
      alpha = false,
      clearColor = 0x000000,
      aspect,
      canvas = document.createElement('canvas'),
      speed = 60 / 1000,
      interval,
      firstTime = 0,
      isDev = false
    } = params

    this.speed = speed
    this.interval = interval
    this.time = this.firstTime = firstTime
    this.stopTime = 0

    // maps and arrays
    this.updateCallbacks = []
    this.resizeCallbacks = []
    this.objects = {}

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias,
      alpha,
      canvas
    })
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setClearColor(clearColor, alpha ? 0 : 1)
    this.canvas = this.renderer.domElement

    // container
    this.container = (typeof container === 'string') ? document.querySelector(container) : container
    !params.canvas && this.container.appendChild(this.canvas)

    this.aspect = aspect || this.container.clientWidth / this.container.clientHeight
    this.setSize()

    // camera
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.width / this.height,
      zNear,
      zFar
    )
    this.camera.position.set(...cameraPosition)
    this.camera.updateProjectionMatrix()

    // scene
    this.scene = new THREE.Scene()

    // resize handling
    this.resize()
    window.addEventListener('resize', () => {
      this.resize()
    })

    // tick / update / render
    autoStart && this.start()

    // optional camera controls
    createCameraControls && this.createOrbitControls()

    // pointer
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()

    // developer mode
    if (isDev) {
      document.addEventListener('keydown', ({ key }) => {
        if (key === 'Escape') {
          this.toggle()
        }
      })
    }
  }

  setSize () {
    if (this.aspect) {
      if (this.container.clientWidth / this.container.clientHeight > this.aspect) {
        this.width = this.container.clientHeight * this.aspect
        this.height = this.container.clientHeight
      } else {
        this.width = this.container.clientWidth
        this.height = this.container.clientWidth / this.aspect
      }
    } else {
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight
    }
  }

  createOrbitControls () {
    if (!THREE.TrackballControls) {
      console.error('TrackballControls.js file is not loaded.')
      return
    }

    this.controls = new THREE.TrackballControls(this.camera, this.canvas)
    this.addUpdateCallback(() => { this.controls.update() })
  }

  start () {
    const startTime = this.stopTime || this.firstTime
    requestAnimationFrame(timestamp => {
      this.startTime = timestamp - startTime
      this.time = timestamp - this.startTime
    })

    this.tick()
  }

  stop () {
    cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = null
    this.stopTime = this.time
  }

  reset () {
    this.stop()
    this.stopTime = 0
  }

  toggle () {
    this.animationFrameId ? this.stop() : this.start()
  }

  addUpdateCallback (callback) {
    this.updateCallbacks.push(callback)
  }

  addResizeCallback (callback) {
    this.resizeCallbacks.push(callback)
  }

  add (object, key) {
    key && (this.objects[key] = object)
    this.scene.add(object)
  }

  addTo (object, parentKey, key) {
    key && (this.objects[key] = object)
    this.get(parentKey).add(object)
  }

  get (key) {
    return this.objects[key]
  }

  remove (o) {
    let object

    if (typeof o === 'string') {
      object = this.objects[o]
    } else {
      object = o
    }

    if (object) {
      object.parent.remove(object)
      delete this.objects[o]
    }
  }

  tick () {
    this.update()
    this.render()
    this.animationFrameId = requestAnimationFrame(timestamp => {
      this.time = timestamp - this.startTime
      this.tick()
    })
  }

  update () {
    let time = this.time * this.speed
    time = this.interval ? time % this.interval : time

    this.updateCallbacks.forEach(fn => { fn(time) })
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  draw () {
    this.update()
    this.render()
  }

  resize () {
    this.container.style.width = ''
    this.container.style.height = ''
    if (this.aspect) {
      this.aspect = this.container.clientWidth / this.container.clientHeight
    }
    this.setSize()

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.width, this.height)
    this.resizeCallbacks.forEach(callback => { callback() })
  }

  initPostProcessing (passes) {
    const size = this.renderer.getSize()
    const pixelRatio = this.renderer.getPixelRatio()
    size.width *= pixelRatio
    size.height *= pixelRatio

    const composer = this.composer = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }))

    const renderPass = new THREE.RenderPass(this.scene, this.camera)
    composer.addPass(renderPass)

    for (let i = 0; i < passes.length; i++) {
      const pass = passes[i]
      pass.renderToScreen = (i === passes.length - 1)
      composer.addPass(pass)
    }

    this.renderer.autoClear = false
    this.render = () => {
      this.renderer.clear()
      composer.render()
    }

    this.addResizeCallback(() => {
      composer.setSize(this.canvas.clientWidth * pixelRatio, this.canvas.clientHeight * pixelRatio)
    })
  }

  checkPointer ({ x, y }, meshs, handler, nohandler) {
    this.pointer.x = (x / this.canvas.clientWidth) * 2 - 1
    this.pointer.y = -(y / this.canvas.clientHeight) * 2 + 1

    this.raycaster.setFromCamera(this.pointer, this.camera)
    const intersects = this.raycaster.intersectObjects(meshs)

    if (intersects.length > 0) {
      handler(intersects[0].object)

      return true
    } else {
      nohandler && nohandler()

      return false
    }
  }
}
