class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	corotate(x = 0, y = 0, angle = 0){
		if(x == this.x && y == this.y) return new Point(x, y);

		let length2 = Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2);//distance between itself and origin
		let length = Math.sqrt(length2);
		let alpha = this.getAngle(x, y);
		let beta = alpha + angle;
		let newx = x + Math.cos(beta) * length;
		let newy = y + Math.sin(beta) * length;

		return new Point(newx, newy);
	}

	translate(x, y){
		return new Point(this.x+x, this.y+y);
	}

	getAngle(x = 0, y = 0){ //angle between the line of 2 points and x-axis
		let angle = Math.atan((this.y-y) / (this.x-x));
		return (angle + Math.PI) % Math.PI; //always return positive
	}

	equals(p){
		return this.x == p.x && this.y == p.y;
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fill();
		return this;
	}
}

class Line{
	constructor(p1, p2){
		this.p1 = p1;
		this.p2 = p2;
	}

	draw(ctx){
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.stroke();
		ctx.lineWidth = 1;
		this.p1.draw(ctx);
		this.p2.draw(ctx);
		return this;
	}

	getAngle(){//the angle between itself and x-axis. In other words, atan(slape).
		return this.p1.getAngle(this.p2.x, this.p2.y);//use getAngle() of Point class, another point as origin point.
	}

	corotate(x = 0, y = 0, angle = 0){
		return new Line(this.p1.corotate(x, y, angle), this.p2.corotate(x, y, angle));//just corotate two points separately.
	}

	translate(x, y){
		return new Line(this.p1.translate(x, y), this.p2.translate(x, y));
	}
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.translate(200, 200);

prepareCoordinate();

var lines = [
	new Line(new Point(50, 50), new Point(70,90)),
	new Line(new Point(-30, 10), new Point(-180, 70))
];

for(let line of lines){
	line.draw(ctx);
}

var line1angle = lines[0].getAngle();
var corotatedLines = lines.map(line=>line.corotate(0, 0, Math.PI / 2 - line1angle));

var line1p1 = corotatedLines[0].p1;
var translatedLines = corotatedLines.map(line=>line.translate(-line1p1.x, -line1p1.y))

ctx.fillStyle = "#0000FF";
ctx.strokeStyle = "#0000FF";

for(let line of translatedLines){
	line.draw(ctx);
}

console.log("Black: Before rotate.");
console.log("Blue: After rotate.")






function prepareCoordinate(){
	ctx.beginPath();
	ctx.moveTo(-200,0);
	ctx.lineTo(200,0);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0,-200);
	ctx.lineTo(0,200);
	ctx.stroke();
}
