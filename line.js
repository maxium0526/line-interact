class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	rotate(x, y, angle){
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
		let raw = Math.atan((this.y-y) / (this.x-x));//this is just raw angle, not considering the position relationship of two points

		let angle = null;
		let xOffset = this.x - x;
		let yOffset = this.y - y;
		if(xOffset>0 && yOffset>0) angle = raw;//第一象限
		if(xOffset<0 && yOffset>0) angle = Math.PI + raw;//第二象限
		if(xOffset<0 && yOffset<0) angle = Math.PI + raw;//第三象限
		if(xOffset>0 && yOffset<0) angle = 2 * Math.PI + raw;//第四象限
		if(xOffset>0 && yOffset==0) angle = 0;//正x軸
		if(xOffset<0 && yOffset==0) angle = Math.PI; //負x軸
		if(xOffset==0 && yOffset>0) angle = Math.PI / 2;//正y軸
		if(xOffset==0 && yOffset<0) angle = Math.PI * 3 / 2;//負y軸
		if(xOffset==0 && yOffset==0) angle = null;
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

	rotate(x = 0, y = 0, angle = 0){
		return new Line(this.p1.rotate(x, y, angle), this.p2.rotate(x, y, angle));//just rotate two points separately.
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
		return this.p2.getAngle(this.p1.x, this.p1.y);//use getAngle() of Point class, another point as origin point.
	}

	getSlape(){
		return Math.tan(this.getAngle());
	}

	getLength(){
		return Math.sqrt(Math.pow(this.p1.x-this.p2.x, 2) + Math.pow(this.p1.y-this.p2.y, 2));
	}

	getInterceptX(asStraightLine = false){
		if(!asStraightLine && this.p1.y * this.p2.y>0) return null;
		return this.p1.x - this.p1.y / this.getSlape();
	}

	getInterceptY(asStraightLine = false){
		if(!asStraightLine && this.p1.x * this.p2.x>0) return null;
		return this.p1.y - this.p1.x * this.getSlape();
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
		let rotatedLine = line.rotate(rotatePoint.x, rotatePoint.y, -rotateAngle);
		let rotatedReferenceLine = referenceLine.rotate(rotatePoint.x, rotatePoint.y, -rotateAngle);

		return Line.isOverlappedOnAxis(rotatedLine, rotatedReferenceLine, 'y');
	}

	static calcIntersectionPoint(a, b, asStraightLine = false){
		if(!asStraightLine && !Line.isIntersected(a, b)) return null;
		let aSlape = a.getSlape();
		let aInterceptY = a.getInterceptY(true);
		let bSlape = b.getSlape();
		let bInterceptY = b.getInterceptY(true);

		let x = - (aInterceptY - bInterceptY) / (aSlape - bSlape);
		let y = aSlape * x + aInterceptY;

		return new Point(x,y);
	}
}


/**
 * Quick use, test if 2 lines are intersected.
 *
 * @param      {<float>}  x1      Line A -> Point A -> x coordinate
 * @param      {<float>}  y1      Line A -> Point A -> y coordinate
 * @param      {<float>}  x2      Line A -> Point B -> x coordinate
 * @param      {<float>}  y2      Line A -> Point B -> y coordinate
 * @param      {<float>}  x3      Line B -> Point A -> x coordinate
 * @param      {<float>}  y3      Line B -> Point A -> y coordinate
 * @param      {<float>}  x4      Line B -> Point B -> x coordinate
 * @param      {<float>}  y4      Line B -> Point B -> y coordinate
 * @return     {<boolean>}  { if 2 lines are intersected, true, otherwise false. }
 */
function testIntersect(x1, y1, x2, y2, x3, y3, x4, y4){
	return Line.isIntersected(
		new Line(new Point(x1, y1), new Point(x2, y2)).draw(ctx),
		new Line(new Point(x3, y3), new Point(x4, y4)).draw(ctx)
		);
}

/**
 * Quick use, calculate the intersection point of 2 line segments.
 *
 * @param      {<float>}  x1      Line A -> Point A -> x coordinate
 * @param      {<float>}  y1      Line A -> Point A -> y coordinate
 * @param      {<float>}  x2      Line A -> Point B -> x coordinate
 * @param      {<float>}  y2      Line A -> Point B -> y coordinate
 * @param      {<float>}  x3      Line B -> Point A -> x coordinate
 * @param      {<float>}  y3      Line B -> Point A -> y coordinate
 * @param      {<float>}  x4      Line B -> Point B -> x coordinate
 * @param      {<float>}  y4      Line B -> Point B -> y coordinate
 * @return     {<Point>}  { If 2 line segments are intersected, return a Point object that represents the intersection point of 2 line segments. Use ['x'] and ['y'] to get the coordinate; If they are not interseted, return null. }
 */
function calcIntersectPoint(x1, y1, x2, y2, x3, y3, x4, y4){
	return point = Line.calcIntersectionPoint(
		new Line(new Point(x1, y1), new Point(x2, y2)).draw(ctx),
		new Line(new Point(x3, y3), new Point(x4, y4)).draw(ctx)
		);
}