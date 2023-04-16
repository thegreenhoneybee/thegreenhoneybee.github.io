

/*
class Planet extends Vector {
    constructor(pos, vel=new Vector(0, 0), m=5, r=5) {
        super(...pos)
        this.m = m
        this.r = r
        this.v = vel

        this.f = new Vector()
        this.c = [Math.random() * 100 + 155, Math.random() * 100 + 155, Math.random() * 100 + 155]
    }

    get volume() {
        return Math.PI * Math.pow(this.r, 2)
    }
    get density() {
        return this.mass / Math.PI * Math.pow(this.r, 2)
    }

    update(timestep = 1) {
        this.f = planets.reduce((f, p)=>{
            if (p != this) {
                let u = Vector.sub(p, this).unit_vector
                let f_ = this.m * p.m / Vector.dist(this, p)
                return f.add(u.mult(f_))
            }
            return f
        }, new Vector(0, 0))
        this.v.add(Vector.div(this.f, this.m))
        this.add(Vector.mult(this.v, timestep))
    }

    collisions(i) {
        for (; i < planets.length; i++) {
            let planet = planets[i]
            let d = Vector.dist(this, planet)
            if (this.r + planet.r > d) {
                let V = this.volume + planet.volume
                let r_1 = (2 * d + Math.sqrt( -4 * Math.pow(d, 2) + 8 * V / Math.PI)) / 4
                let r_2 = d - r_1

                let a, b = this.density >= planet.density ? [this, planet] : [planet, this]

                let d_m = (1 - Math.pow(r_2, 2) / Math.pow(planets[i].r, 2)) * planets[i].m
                // change the color of the bigger planet on colision

                this.m += d_m
                this.r = r_1
                planets[i].m -= d_m
                planets[i].r = r_2
            }
        }
    }

    draw() {
        ctx.fillStyle = `rgba(${this.c.join(',')})`
        ctx.beginPath()
        ctx.moveTo(this.x + this.r, this.y)
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
    }
}

var width = cnv.width
var height = cnv.height
var ctx = cnv.getContext('2d', { desynchronized: true })
ctx.translate(width / 2, height / 2)

var planets = []
// planets.push(new Planet(new Vector(0, 0), new Vector(0, 0), 333, 20))
// planets.push(new Planet(new Vector(0, -100), new Vector(100, 0), 0.4, 5))
// planets.push(new Planet(new Vector(-100, 5), new Vector(0, -220), 1.2, 15))

planets.push(new Planet(new Vector(0, 0), new Vector(0, 0), 333, 25))
planets.push(new Planet(new Vector(40, 0), new Vector(0, 0), 200, 20))

draw()

function draw() {
    ctx.clearRect(- width / 2, - height / 2, width, height)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    
    // planets.forEach(p => p.update(0.01))
    planets.forEach(p => p.draw())
    planets.forEach((p, i) => p.collisions(i + 1))
    planets.forEach(p => p.draw())

    // let max_mass = planets.reduce((a, p) => a > p.m ? a : p.m, 0)
    // let average_location = planets.reduce((a, p) => a.add(Vector.mult(p, p.m / max_mass)), new Vector(0, 0))
    // planets.forEach(p => p.sub(average_location))
    
    // requestAnimationFrame(draw)
}*/