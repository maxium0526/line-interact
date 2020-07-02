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

	draw(ctx, x=0, y=0){
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fill();
		return this;
	}

	static get(length, angle){
		return new Vector(length * Math.cos(angle), length * Math.sin(angle));
	}
}