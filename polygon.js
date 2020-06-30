class Polygon{
	constructor(points){
		this.points = points;
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

	draw(ctx){
		for(let point of this.points){
			point.draw(ctx);
		}
		for(let i=0; i<this.points.length; i++){
			new Line(this.points[i], this.points[(i+1)%(this.points.length)]).draw(ctx);
		}
		return this;
	}
}