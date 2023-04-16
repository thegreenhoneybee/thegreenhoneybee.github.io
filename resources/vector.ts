class Vector extends Array {
    get x() { return this[0] }
    set x(x) { this[0] = x }
    get y() { return this[1] }
    set y(y) { this[1] = y }
    get z() { return this[2] }
    set z(z) { this[2] = z }

    get mag() { return Math.sqrt(this.reduce((a, e) => a + e*e, 0)) }
    get unit_vector() { return Vector.div(this, this.mag) }

    copy() { return new Vector(...this) }

    static  add(v: Vector, b: number | Vector) { return v.copy().add(b) }
    static  sub(v: Vector, b: number | Vector) { return v.copy().sub(b) }
    static mult(v: Vector, b: number) { return v.copy().mult(b) }
    static  div(v: Vector, b: number) { return v.copy().div(b) }
    
     add(b: number | Vector) { if (b instanceof Vector) {return this.#add_v(b)} else if (typeof(b) == 'number') {return this.#add_s(b)} else {throw TypeError('asd')} }
     sub(b: number | Vector) { if (b instanceof Vector) {return this.#sub_v(b)} else if (typeof(b) == 'number') {return this.#sub_s(b)} else {throw TypeError('asd')} }
    mult(n: number) { if (typeof(n) == 'number') {return this.#mult(n)} else {throw TypeError('asd')} }  
     div(n: number) { if (typeof(n) == 'number') {return this.#div(n)} else {throw TypeError('asd')} }


    //Vectors
    #add_v(v: Vector) { for (let i = 0; i < this.length; i++) { this[i] += v[i] }; return this }
    #sub_v(v: Vector) { for (let i = 0; i < this.length; i++) { this[i] -= v[i] }; return this }

    //Scalars
    #add_s(n: number) { for (let i = 0; i < this.length; i++) { this[i] += n }; return this }
    #sub_s(n: number) { for (let i = 0; i < this.length; i++) { this[i] -= n }; return this }
     #mult(n: number) { for (let i = 0; i < this.length; i++) { this[i] *= n }; return this }
      #div(n: number) { for (let i = 0; i < this.length; i++) { this[i] /= n }; return this }

    static dist(v, u) { return Vector.sub(v, u).mag }
}