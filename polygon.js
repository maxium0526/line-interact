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

class PolygonItem{
	constructor(poly, mass=1){
		this.poly = poly;
		this.mass = mass;
		this.velo = new Vector(0, 0);
		this.angVelo = 0;
	}
	setVelocity(v){
		this.velo = v;
		return this;
	}
	setAngularVelocity(angle){
		this.angVelo = angle;
		return this;
	}
	getCenter(){
		return this.poly.getSimpleCentroid();
	}
	getLinearVelocity(x, y){
		let r = new Line(this.getCenter(), new Point(x, y));
		let linearVelo = this.angVelo * r.getLength();
		let angle = r.getAngle() + Math.PI / 2;
		return Vector.get(linearVelo, angle);
	}
	getSumVelocity(x, y){
		return this.getLinearVelocity(x, y).add(this.velo);
	}
	nxt(fps){
		this.poly = this.poly
			.translate(this.velo.x / fps, this.velo.y / fps)
			.rotate(this.getCenter().x, this.getCenter().y, this.angVelo / fps);
		return this;
	}
	draw(ctx){
		this.poly.draw(ctx);
	}
	static touch(a, b){
		if(!Polygon.isIntersected(a.poly, b.poly)) return;

		let intersectedPoints = Polygon.calcIntersectionPoint(a.poly, b.poly);
		let intersectedCentroid = new Polygon(intersectedPoints).getSimpleCentroid();

		// let ax = (a.velo.x * (a.mass - b.mass) + 2 * b.mass * b.velo.x) / (a.mass + b.mass);		
		// let ay = (a.velo.y * (a.mass - b.mass) + 2 * b.mass * b.velo.y) / (a.mass + b.mass);
		// let bx = (b.velo.x * (b.mass - a.mass) + 2 * a.mass * a.velo.x) / (a.mass + b.mass);
		// let by = (b.velo.y * (b.mass - a.mass) + 2 * a.mass * a.velo.y) / (a.mass + b.mass);
		// a.velo = new Vector(ax, ay);
		// b.velo = new Vector(bx, by); 
		
		let x = intersectedCentroid.x;
		let y = intersectedCentroid.y;

		//碰撞點的混合速度
		let av = a.getSumVelocity(x, y);
		let bv = b.getSumVelocity(x, y);

		//碰撞後各自得到的速度
		let ax = (av.x * (a.mass - b.mass) + 2 * b.mass * bv.x) / (a.mass + b.mass);		
		let ay = (av.y * (a.mass - b.mass) + 2 * b.mass * bv.y) / (a.mass + b.mass);
		let bx = (bv.x * (b.mass - a.mass) + 2 * a.mass * av.x) / (a.mass + b.mass);		
		let by = (bv.y * (b.mass - a.mass) + 2 * a.mass * av.y) / (a.mass + b.mass);

		let getA = new Vector(ax, ay);
		let getB = new Vector(bx, by);

		let ra = new Line(a.getCenter(), new Point(x, y));
		let rb = new Line(b.getCenter(), new Point(x, y));

		//轉到十字架和座標軸平行
		getA = getA.rotate(-ra.getAngle());
		getB = getB.rotate(-rb.getAngle());

		//開拆
		let getALinearVelo = new Vector(0, getA.y);
		let getAAngVelo = getALinearVelo.y / ra.getLength();
		let getAVelo = new Vector(getA.x, 0).rotate(ra.getAngle());

		let getBLinearVelo = new Vector(0, getB.y);
		let getBAngVelo = getBLinearVelo.y / rb.getLength();
		let getBVelo = new Vector(getB.x, 0).rotate(rb.getAngle());

		a.velo = getAVelo;
		a.angVelo = getAAngVelo;	

		b.velo = getBVelo;
		b.angVelo = getBAngVelo;

		//碰撞後立即分開, 防止多次碰撞
		// while(Polygon.isIntersected(a.poly, b.poly)){
		// 	a.poly = a.poly.translate((a.getCenter().x - intersectedCentroid.x) / 100, (a.getCenter().y - intersectedCentroid.y) / 100)
		// 	b.poly = b.poly.translate((b.getCenter().x - intersectedCentroid.x) / 100, (b.getCenter().y - intersectedCentroid.y) / 100)
		// }

	}
}