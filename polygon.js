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

	draw(ctx){
		for(let point of this.points){
			point.draw(ctx);
		}
		for(let line of this.getLines()){
			line.draw(ctx);
		}
		return this;
	}
}