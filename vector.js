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

	multiply(constant){
		return new Vector(this.x * constant, this.y * constant);
	}

	dot(v){
		return this.x * v.x + this.y * v.y;
	}

	rotate(angle){
		let newp = new Point(this.x, this.y).rotate(0, 0, angle);
		return new Vector(newp.x, newp.y);
	}

	mirror(angle){
		let diff = angle - this.getAngle();
		let newAngle = diff * 2 + this.getAngle();
		return Vector.get(this.getLength(), newAngle);
	}

	getLength(){
		return new Line(new Point(0, 0), new Point(this.x, this.y)).getLength();
	}

	getAngle(){
		return new Point(this.x, this.y).getAngle(0, 0);
	}

	draw(ctx, x=0, y=0){
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(this.x + x, this.y + y);
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