'use strict'
//@ts-check
new (class GameOfLife {
  #controls
  #grid
  #interval

  constructor() {
    this.BASE_SPEED = 1000
    this.isPlaying = false
    this.speed = 0
    this.#grid = null
    this.#interval = null
    this.#controls = {}

    this.init()
  }

  init = () => {
    this.#setControls()
    this.#grid = new Grid()
  }

  // Start region controls
  #setControls = () => {
    const startButton = document.getElementById('play-button')
    startButton?.addEventListener('click', this.#onStartButtonClick)

    const resetButton = document.getElementById('reset-button')
    resetButton?.addEventListener('click', this.#onResetButtonClick)

    const randomizeButton = document.getElementById('randomize-button')
    randomizeButton?.addEventListener('click', this.#randomize)

    const speedSlider = document.getElementById('speed-slider')
    speedSlider?.addEventListener('input', this.#onChangeSpeed)

    const sizeInput = document.getElementById('size-input')

    const sizeButton = document.getElementById('size-button')
    sizeButton?.addEventListener('click', this.#onChangeSize)

    this.#controls = {
      startButton,
      resetButton,
      randomizeButton,
      speedSlider,
      sizeInput,
      sizeButton,
    }
  }

  #resetControls = () => {
    this.#resetPlayBtn()
    this.#controls.speedSlider.value = 0
    this.#controls.sizeButton.disabled = false
  }

  #updateControls = isPlaying => {
    if (isPlaying) {
      this.#controls.startButton.textContent = 'Pause'
      this.#controls.startButton.title = 'Stop the game'
      this.#controls.randomizeButton.disabled = true
      this.#controls.sizeButton.disabled = true
    } else {
      this.#resetPlayBtn()
      this.#controls.randomizeButton.disabled = false
      this.#controls.sizeButton.disabled = false
    }
  }

  #resetPlayBtn = () => {
    this.#controls.startButton.textContent = 'Play'
    this.#controls.startButton.title = 'Start the game'
  }
  // END REGION

  // START REGION Controls' handlers

  #onChangeSize = () => {
    if (!this.isPlaying) this.#changeSize(this.#controls.sizeInput.value)
  }

  #onChangeSpeed = event => {
    this.#stopInterval()
    this.speed = event.target.value
    this.#startInterval()
  }

  #onResetButtonClick = () => {
    this.#reset()
    this.#resetControls()
  }

  #onStartButtonClick = () => {
    this.#toggle()
    this.#updateControls(this.isPlaying)
  }

  // END REGION

  #play = () => {
    this.isPlaying = true
    this.#startInterval()
  }

  #pause = () => {
    this.isPlaying = false
    this.#stopInterval()
    this.#controls.randomizeButton.disabled = false
  }

  #reset = () => {
    this.#pause()
    this.#grid?.resetCells()
  }

  #toggle = () => {
    if (this.isPlaying) this.#pause()
    else this.#play()
  }

  #randomize = () => {
    if (!this.isPlaying) this.#grid?.randomize()
  }

  #changeSize = value => {
    this.#pause()
    this.#grid?.updateSize(value)
  }

  #startInterval = () => {
    if (this.isPlaying) this.#interval = setInterval(this.#grid?.next, this.BASE_SPEED - this.speed)
  }

  #stopInterval = () => {
    if (this.#interval) clearInterval(this.#interval)
  }
})()
