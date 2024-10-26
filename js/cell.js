'use strict'
//@ts-check
class Cell {
  #cellParams
  #ctx
  #isAlive
  #lineWidth

  /**
   * constructor description
   * @param {Object} CellProps
   * @param {number} CellProps.col - используется для расчетов в grid, номер столбца
   * @param {number} CellProps.row - используется для расчетов в grid, номер ряда
   * @param {CanvasRenderingContext2D} CellProps.ctx
   * @param {number} CellProps.height
   * @param {number} CellProps.width
   * @param {number} CellProps.lineWidth
   * @param {boolean=} CellProps.isAlive
   */
  constructor({ row, col, ctx, height, width, lineWidth, isAlive = false }) {
    this.row = row
    this.col = col
    this.height = height
    this.width = width
    this.#ctx = ctx
    this.#isAlive = isAlive
    this.#lineWidth = lineWidth
    this.#cellParams = [
      this.row * (this.width + this.#lineWidth),
      this.col * (this.height + this.#lineWidth),
      this.width,
      this.height,
    ]
  }

  get isAlive() {
    return this.#isAlive
  }

  set isAlive(value) {
    this.#isAlive = value

    if (value) {
      this.#drawCell()
    } else {
      this.#clearCell()
    }
  }

  toggleState = () => (this.isAlive = !this.#isAlive)

  resetState = () => (this.isAlive = false)

  setRandomState = () => {
    const randomValue = !!Math.round(Math.random())
    if (randomValue !== this.#isAlive) {
      this.isAlive = !!Math.round(Math.random())
    }
  }

  // @ts-ignore
  #clearCell = () => this.#ctx?.clearRect(...this.#cellParams)

  // @ts-ignore
  #drawCell = () => this.#ctx?.fillRect(...this.#cellParams)
}
