//https://themindcafe.com.sg/wp-content/uploads/2018/07/Gobblet-Gobblers.pdf
var cnv

window.onload = function() {
  cnv = document.getElementById('cnv')
  cnv.width = 100
  cnv.height = 120

  var loader = new FontLoader()
  loader.load('fff-forward', )

  const myFont = new FontFace('fff-forward', 'url(../resources/fff-forward.regular.ttf)');
  myFont.load().then((font) => {
    document.fonts.add(font)
    new Controller(cnv)
  })
}

class FontLoader() {
  constructor() {
    this.fonts = {}
  }

  add(name, url) {
    var f = new FontFace('fff-forward', 'url(../resources/fff-forward.regular.ttf)')
  }
}

class Controller {
  constructor(cnv) {
    this.ctx = cnv.getContext('2d', { alpha: false })
    this.activeScreen = null

    this.menu = new Menu(this)
    this.start()
  }

  start() {
    this.activeScreen = this.menu
    this.menu.activate()
  }
}

class Menu {
  constructor(controller) {
    this.controller = controller
    this.mode = 'normal'
    this.modes = ['normal', 'Tik Tok']

    this.buttons = [new Button('BEGIN', 50, 60, this.begin, 'center', 'middle', '20px fff-forward')]
  }

  activate() {
    this.draw()
  }

  draw() {
    var ctx = this.controller.ctx
    ctx.fillStyle = '#CCC'

    ctx.textAlign = 'center'

    ctx.font = `12px fff-forward`
    ctx.textBaseline = 'hanging'
    ctx.fillText('Tic Tac Toe', 50, 5);

    ctx.font = `20px fff-forward`
    ctx.textBaseline = 'middle'
    ctx.fillText('BEGIN', 50, 60);

    ctx.font = `8px fff-forward`
    ctx.textBaseline = 'bottom'
    ctx.fillText('ruleset:', 50, 103);

    ctx.font = `8px fff-forward`
    ctx.textBaseline = 'bottom'
    ctx.fillText('normal', 50, 115);
  }

  begin() {
    console.log(`Begin as ${this.mode}`)
  }

  changeMode() {
    console.log(`Mode from ${this.mode}`)
  }
}

class Button {
  constructor(text, x, y, func, ) {
    console.log(func, arguments)
  }

  draw() {

  }
}
