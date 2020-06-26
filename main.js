class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fill();
	}
}

class Line{
	constructor(x1, y1, x2, y2){
		this.p1 = new Point(x1, y1);
		this.p2 = new Point(x2, y2);
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
	}
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var p = new Point(10,10);
p.draw(ctx);

var line = new Line(50, 60, 170, 180);
line.draw(ctx);