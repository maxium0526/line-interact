class Polygon{
	constructor(points){
		this.points = points;
	}

	getLines(){
		let lines = [];
		for(let i=0; i<this.points.length; i++){
			lines.push(new Line(this.points[i], this.points[(i+1)%(this.points.length)]));
		}
		return lines;
	}

	rotate(x, y, angle){
		return new Polygon(this.points.map(p=>p.rotate(x, y, angle)));
	}

	translate(x, y){
		return new Polygon(this.points.map(p=>p.translate(x, y)));
	}

	getAngle(lineNum){
		return new Line(this.points[lineNum], this.points[lineNum+1]).getAngle();
	}

	getSlape(lineNum){
		return new Line(this.points[lineNum], this.points[lineNum+1]).getSlape();
	}

	getInterceptX(){
		let intercepts = this.getLines().map(line=>line.getInterceptX()).filter(p=>p!=null);
		return [...new Set(intercepts)];
	}

	getInterceptY(){
		let intercepts = this.getLines().map(line=>line.getInterceptY()).filter(p=>p!=null);
		return [...new Set(intercepts)];
	}

	getSimpleCentroid(){
		let sumx = 0;
		let sumy = 0;
		let numPoints = this.points.length;
		for(let point of this.points){
			sumx += point.x;
			sumy += point.y;
		}
		return new Point(sumx / numPoints, sumy / numPoints);
	}

	draw(ctx){
		for(let point of this.points){
			point.draw(ctx);
		}
		for(let line of this.getLines()){
			line.draw(ctx);
		}
		return this;
	}

	static isIntersected(a, b){
		for(let lineA of a.getLines()){
			for(let lineB of b.getLines()){
				if(Line.isIntersected(lineA, lineB)){
					return true;
				}
			}
		}
		return false;
	}

	static calcIntersectionPoint(a, b){
		let points = [];
		for(let lineA of a.getLines()){
			for(let lineB of b.getLines()){
				let point = Line.calcIntersectionPoint(lineA, lineB);
				if(point!=null) points.push(point);
			}
		}
		return points;
	}
}

class RectangleBuilder{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.angle = 0;
	}
	xy(x, y){
		this.x = x;
		this.y = y;
		return this;
	}
	wt(width, height){
		this.width = width;
		this.height = height;
		return this;
	}
	rotate(angle){
		this.angle = angle;
		return this;
	}
	build(){
		let p1 = new Point(this.x, this.y);
		let p2 = new Point(this.x + this.width, this.y);
		let p3 = new Point(this.x + this.width, this.y + this.height);
		let p4 = new Point(this.x, this.y + this.height);
		return new Polygon([p1, p2, p3, p4]).rotate(this.x, this.y, this.angle);
	}
}

class PolygonItem extends Polygon{
	constructor(poly, mass){
		super(poly.points);
	}
}