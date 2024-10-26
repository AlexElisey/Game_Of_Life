import { Cell } from './cell.js'
export class Grid {
  #cellHeight
  #cellWidth
  #ctx
  #grid
  #gridHeight
  #gridWidth
  #gridLine
  #nextSnapshot
  #size
  #canvas

  constructor() {
    this.DEFAULT_SIZE = 8
    this.MAX_SIZE = 1000
    this.#gridHeight = 0
    this.#gridWidth = 0
    this.#size = this.DEFAULT_SIZE
    this.#cellHeight = 0
    this.#cellWidth = 0
    this.#grid = []
    this.#nextSnapshot = []
    this.#ctx = null
    this.#gridLine = 1

    this.#setSize()
    this.#initCanvas()
    this.#drawGrid()
    this.#init()
  }

  next = () => {
    this.#forEachCell(cell => {
      const numberOfNeighbors = this.#countNeighbors(cell)
      if (cell.isAlive) {
        if (numberOfNeighbors < 2 || numberOfNeighbors > 3)
          this.#nextSnapshot[cell.row][cell.col] = false
        else if (numberOfNeighbors === 2 || numberOfNeighbors === 3)
          this.#nextSnapshot[cell.row][cell.col] = true
      } else {
        if (numberOfNeighbors === 3)
          this.#nextSnapshot[cell.row][cell.col] = true
      }
    })

    this.#forEachCell(cell => {
      const isAlive = this.#nextSnapshot[cell.row][cell.col]
      if (cell.isAlive !== isAlive) {
        cell.isAlive = isAlive ? this.#nextSnapshot[cell.row][cell.col] : false
      }

      this.#nextSnapshot[cell.row][cell.col] = false
    })
  }

  randomize = () => {
    this.#forEachCell(cell => cell.setRandomState())
  }

  reset = () => {
    this.#clearGrid()
    this.#drawGrid()
  }

  resetCells = () => {
    this.#forEachCell(cell => {
      if (cell.isAlive) {
        cell.resetState()
      }
    })
  }

  updateSize = value => {
    let newSize = value || this.DEFAULT_SIZE
    if (value !== this.#size) {
      if (newSize % 2 !== 0) newSize--
      else if (newSize <= this.DEFAULT_SIZE) newSize = this.DEFAULT_SIZE
      else if (newSize > this.MAX_SIZE) newSize = this.MAX_SIZE

      this.#size = newSize
      this.#setSize()
      this.#setCanvasParams()
      this.#init()
      this.reset()
    }
  }

  #init = () => {
    for (let row = 0; row < this.#size; row++) {
      this.#grid[row] = []
      this.#nextSnapshot[row] = []

      for (let col = 0; col < this.#size; col++) {
        const cell = new Cell({
          row,
          col,
          ctx: this.#ctx,
          height: this.#cellHeight,
          width: this.#cellWidth,
          lineWidth: this.#gridLine,
        })

        this.#grid[row][col] = cell
        this.#nextSnapshot[row][col] = false
      }
    }
  }

  #setCanvasParams = () => {
    this.#canvas.width = this.#gridWidth
    this.#canvas.height = this.#gridHeight

    this.#ctx = this.#canvas.getContext('2d')
    this.#ctx.fillStyle = '#e87272'
  }

  #initCanvas = () => {
    this.#canvas = document.getElementById('canvas')
    this.#canvas.addEventListener('click', event => {
      const { offsetX, offsetY } = event
      this.#getCellPositionFromCoords({ offsetX, offsetY })
    })

    this.#setCanvasParams()
  }

  #getCellPositionFromCoords = ({ offsetX, offsetY }) => {
    const col = Math.floor(offsetY / (this.#cellHeight + this.#gridLine))
    const row = Math.floor(offsetX / (this.#cellWidth + this.#gridLine))
    this.#toggleCellState({ col, row })
  }

  #clearGrid = () => {
    this.#ctx.clearRect(0, 0, this.#gridWidth, this.#gridHeight)
  }

  #drawGrid = () => {
    if (!this.#gridLine) return

    const gap = this.#gridLine / 2
    this.#ctx.lineWidth = 1
    this.#ctx.strokeStyle = '#bebebe'

    for (let row = 1; row < this.#size; row++) {
      const y = (this.#cellHeight + this.#gridLine) * row - gap
      this.#drawLine(0, y, this.#gridWidth, y)
    }

    for (let col = 1; col < this.#size; col++) {
      const x = (this.#cellWidth + this.#gridLine) * col - gap
      this.#drawLine(x, 0, x, this.#gridHeight)
    }
  }

  #drawLine(x1, y1, x2, y2) {
    this.#ctx.beginPath()
    this.#ctx.moveTo(x1, y1)
    this.#ctx.lineTo(x2, y2)
    this.#ctx.stroke()
  }

  #toggleCellState = ({ col, row }) => {
    const cell = this.#grid[row][col]
    cell.toggleState()
  }

  #setSize = () => {
    this.#gridLine = 1
    const windowWidth = Math.round(window.innerWidth * 0.4)
    
    let lineWidth = this.#size * this.#gridLine - 1
    if (lineWidth * 2 > windowWidth) {
      this.#gridLine = 0
      lineWidth = 0
    }
    // this.#cellHeight = Math.round((windowHeight - lineWidth) / this.#size)
    
    this.#cellWidth = Math.ceil((windowWidth - lineWidth) / this.#size) || 1
    this.#cellHeight = this.#cellWidth

    // this.#gridHeight = lineWidth + this.#cellHeight * this.#size
    this.#gridWidth = lineWidth + this.#cellWidth * this.#size
    this.#gridHeight = this.#gridWidth
  }

  #countNeighbors = ({ row, col }) => {
    let count = 0

    if (this.#isCellAlive(row - 1, col - 1)) count++ // top left
    if (this.#isCellAlive(row - 1, col)) count++ // top
    if (this.#isCellAlive(row - 1, col + 1)) count++ // top right
    if (this.#isCellAlive(row, col + 1)) count++ // right
    if (this.#isCellAlive(row + 1, col + 1)) count++ // bottom right
    if (this.#isCellAlive(row + 1, col)) count++ // bottom
    if (this.#isCellAlive(row + 1, col - 1)) count++ // bottom left
    if (this.#isCellAlive(row, col - 1)) count++ // left

    return count
  }

  #isCellAlive = (row, col) => {
    if (!this.#grid[row] || !this.#grid[row][col]) return false

    return this.#grid[row][col].isAlive
  }

  #forEachCell = callback => {
    for (let row = 0; row < this.#size; row++) {
      for (let col = 0; col < this.#size; col++) {
        callback(this.#grid[row][col])
      }
    }
  }
}
