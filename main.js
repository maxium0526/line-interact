class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	corotate(x, y, angle){
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

	getAngle(x, y){ //angle between the line of 2 points and x-axis
		let slape = Math.atan((this.y-y) / (this.x-x));//this is just slape

		let angle = null;
		let xOffset = this.x - x;
		let yOffset = this.y - y;
		if(xOffset>0 && yOffset>0) angle = slape;//第一象限
		if(xOffset<0 && yOffset>0) angle = Math.PI + slape;//第二象限
		if(xOffset<0 && yOffset<0) angle = Math.PI + slape;//第三象限
		if(xOffset>0 && yOffset<0) angle = 2 * Math.PI + slape;//第四象限
		return angle;
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

	corotate(x = 0, y = 0, angle = 0){
		return new Line(this.p1.corotate(x, y, angle), this.p2.corotate(x, y, angle));//just corotate two points separately.
	}

	translate(x, y){
		return new Line(this.p1.translate(x, y), this.p2.translate(x, y));
	}

	project(axis){
		if(axis = 'x') return new Line(new Point(this.p1.x, 0), new Point(this.p2.x, 0));
		if(axis = 'y') return new Line(new Point(0, this.p1.y), new Point(0, this.p2.y));
		return null;
	}

	getAngle(){//the angle between itself and x-axis. In other words, atan(slape).
		return this.p1.getAngle(this.p2.x, this.p2.y);//use getAngle() of Point class, another point as origin point.
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

	static isOverlappedOnAxis(a, b, axis){
		if(!['x', 'y'].includes(axis)) return null;
		let pa = a.project(axis);
		let pb = b.project(axis);

		//find the max and min of two line in order to compare
		let amax, amin, bmax, bmin;
		if(axis == 'x'){
			amax = Math.max(a.p1.x, a.p2.x);
			amin = Math.min(a.p1.x, a.p2.x);
			bmax = Math.max(b.p1.x, b.p2.x);
			bmin = Math.min(b.p1.x, b.p2.x);
		} else {
			amax = Math.max(a.p1.y, a.p2.y);
			amin = Math.min(a.p1.y, a.p2.y);
			bmax = Math.max(b.p1.y, b.p2.y);
			bmin = Math.min(b.p1.y, b.p2.y);
		}

		if(amax < bmin || bmax < amin){
			return false;
		} else {
			return true;
		}
	}

	static isIntersected(a, b){
		if(Line.__isOverLappedOnRotatedAxis__(a, b) && Line.__isOverLappedOnRotatedAxis__(b, a)){
			return true;
		} else {
			return false;
		}
	}

	static __isOverLappedOnRotatedAxis__(line, referenceLine){
		//rotation process
		let rotatePoint = new Point(0, 0);
		let rotateAngle = referenceLine.getAngle();
		let rotatedLine = line.corotate(rotatePoint.x, rotatePoint.y, -rotateAngle);
		let rotatedReferenceLine = referenceLine.corotate(rotatePoint.x, rotatePoint.y, -rotateAngle);

		//translation process
		// let tnsPoint = rotatedReferenceLine.p1;
		// let tnsedLine = rotatedLine.translate(-tnsPoint.x, -tnsPoint.y);
		// let tnsedReferenceLine = rotatedReferenceLine.translate(-tnsPoint.x, -tnsPoint.y);
		//有沒有都一樣啦所以註解了

		return Line.isOverlappedOnAxis(rotatedLine, rotatedReferenceLine, 'y');
	}
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.translate(200, 200);

prepareCoordinate();

var line1 = randomLine().draw(ctx);
var line2 = randomLine().draw(ctx);

console.log(Line.isIntersected(line1, line2));

console.log("Black: Before rotate.");
console.log("Blue: After rotate.");

// var line = randomLine().draw(ctx);

// ctx.fillStyle = "#0000FF";
// ctx.strokeStyle = "#0000FF";
// line.corotate(0,0,Math.PI / 4).draw(ctx);




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

function randomLine(){
	return new Line(
		new Point(Math.random()*200-100, Math.random()*200-100),
		new Point(Math.random()*200-100, Math.random()*200-100),
		);
}