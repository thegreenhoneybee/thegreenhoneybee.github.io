class Controller() {
  contructor(canvas) {
    this.canvas = canvas
    this.scenes = []
    this.currentScene = null
    this.fontLoader = new FontLoader()
  }

  loadFont(text, url) {
    this.fontLoader.load(text, url)
  }

  start() {
    if (!this.fontLoader.ready) {
      this.fontLoader.onReady = this.start
      return 0
    }
    this.canvas.addEventListener('click', this.currentScene.mouseClick)
    this.canvas.addEventListener('mousedown', this.currentScene.mouseDown)
    this.canvas.addEventListener('mouseup', this.currentScene.mouseUp)
    this.canvas.addEventListener('mousemove', this.currentScene.mouseMove)

    this.canvas.addEventListener('keypressed', this.currentScene.keyPressed)
    this.canvas.addEventListener('keydown', this.currentScene.keyDown)
    this.canvas.addEventListener('keyup', this.currentScene.keyUp)

    this.currentScene.start()
    return 1
  }

  // handleEvent(event)
}

class FontLoader {
  constructor() {
    this.fonts = {}
    this.done = 0
    this.onready = function() {}
  }

  load(text, url) {
    this.fonts[text] = new FontFace('fff-forward', 'url(../resources/fff-forward.regular.ttf)');
    this.fonts[text].load().then(done.bind(this))
  }

  done() {
    if (Object.keys(this.fonts).length == ++this.done && this.onready) {
      this.onready()
    }
  }
}

class Scene {
  constructor() {
    this.uiElements = []
  }

  activate() {}

  draw() {}

  mouseClick(event) {}
  mouseDown(event) {}
  mouseUp(event) {}
  mouseMove(event) {
    for (var i = 0; i < this.uiElements.length; i++) {
      this.uiElements[i].mouseMove(event)
    }
  }
  keyPressed(event) {}
  keyDown(event) {}
  keyUp(event) {}
}

class UIElement {
  constructor(text, x, y) {
    this.hovered = false
    this.active = false

    this.fontStyle = null
    this.baseline = null
    this.align = null
  }
}

class Button {
  constructor(text, x, y) {
    super(text, x, y)
  }
}
