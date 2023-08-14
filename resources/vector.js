export default class Vector extends Array {
    get x() { return this[0] }
    set x(x) { this[0] = x }
    get y() { return this[1] }
    set y(y) { this[1] = y }
    get z() { return this[2] }
    set z(z) { this[2] = z }

    get mag() { return Math.sqrt(this.reduce((a, e) => a + e*e, 0)) }
    get unit_vector() { return Vector.div(this, this.mag) }

    copy() { return new Vector(...this) }

    static  add(v, b) { return v.copy().add(b) }
    static  sub(v, b) { return v.copy().sub(b) }
    static mult(v, b) { return v.copy().mult(b) }
    static  div(v, b) { return v.copy().div(b) }
    
     add(b) { if (b instanceof Vector) {return  this.#add_v(b)} else if (typeof(b) == 'number') {return  this.#add_s(b)} else {throw TypeError('Expecting Vector or Number')} }
     sub(b) { if (b instanceof Vector) {return  this.#sub_v(b)} else if (typeof(b) == 'number') {return  this.#sub_s(b)} else {throw TypeError('Expecting Vector or Number')} }
    mult(b) { if (b instanceof Vector) {return this.#mult_v(b)} else if (typeof(b) == 'number') {return this.#mult_s(b)} else {throw TypeError('Expecting Vector or Number')} }  
     div(b) { if (b instanceof Vector) {return  this.#div_v(b)} else if (typeof(b) == 'number') {return  this.#div_s(b)} else {throw TypeError('Expecting Vector or Number')} }
     dot(v) { if (b instanceof Vector) {return  this.#dot(v)} else {throw TypeError('Expecting Vector')} }

    //Vectors
     #add_v(v) { for (let i = 0; i < this.length; i++) { this[i] += v[i] }; return this }
     #sub_v(v) { for (let i = 0; i < this.length; i++) { this[i] -= v[i] }; return this }
    #mult_v(v) { for (let i = 0; i < this.length; i++) { this[i] *= v[i] }; return this }
     #div_v(v) { for (let i = 0; i < this.length; i++) { this[i] /= v[i] }; return this }
       #dot(v) { let a = 0; for (let i = 0; i < this.length; i++) { a += this[i] * v[i] }; return a }

    //Scalars
     #add_s(n) { for (let i = 0; i < this.length; i++) { this[i] += n }; return this }
     #sub_s(n) { for (let i = 0; i < this.length; i++) { this[i] -= n }; return this }
    #mult_s(n) { for (let i = 0; i < this.length; i++) { this[i] *= n }; return this }
     #div_s(n) { for (let i = 0; i < this.length; i++) { this[i] /= n }; return this }

    static dist(v, u) { return Vector.sub(v, u).mag }
}