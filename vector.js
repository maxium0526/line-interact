class Vector{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	add(v){
		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtract(v){
		return new Vector(this.x - v.x, this.y - v.y);
	}

	dot(v){
		return this.x * v.x + this.y * v.y;
	}
	
}