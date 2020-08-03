class PolygonItem{
	constructor(poly, mass=1){
		this.poly = poly;
		this.mass = mass;
		this.velo = new Vector(0, 0);
		this.angVelo = 0;
		this.acce = new Vector(0, 0);
		this.forc = new Vector(0, 0);
		this.fixed = false;

		this._acce = new Vector(0, 0);
		this._forc = new Vector(0, 0);
	}
	setVelocity(v){
		this.velo = v;
		return this;
	}
	setAngularVelocity(angle){
		this.angVelo = angle;
		return this;
	}
	setAcceleration(a){
		this.acce = a;
		return this;
	}
	setForce(f){
		this.forc = f;
		return this;
	}
	fix(fix = true){
		this.fixed = fix;
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
		this._forc = this.forc;
		this._acce = this._forc.multiply(this.mass).add(this.acce);
		this.velo = this._acce.multiply(1 / fps).add(this.velo);
		this.angVelo = this.angVelo / 1.005;
		this.poly = this.poly
			.translate(this.velo.multiply(1 / fps))
			.rotate(this.getCenter().x, this.getCenter().y, this.angVelo / fps);
		return this;
	}
	draw(ctx){
		this.poly.draw(ctx);
	}
	static touch(a, b){
		if(!Polygon.isIntersected(a.poly, b.poly)) return;
		if(a.fixed && b.fixed) return;

		let intersectedPoints = Polygon.calcIntersectionPoint(a.poly, b.poly);
		let intersectedCentroid = new Polygon(intersectedPoints).getSimpleCentroid();
		
		let x = intersectedCentroid.x;
		let y = intersectedCentroid.y;

		//碰撞點的混合速度
		let av = a.getSumVelocity(x, y);
		let bv = b.getSumVelocity(x, y);

		let intersectedLines = Polygon.getIntersectionLine(a.poly, b.poly);
		let aLines = intersectedLines[0];
		let bLines = intersectedLines[1];

		let surfaceA, surfaceB;
		if(aLines.length==1 && bLines.length>1){
			surfaceA = aLines[0];
			surfaceB = new Line(intersectedPoints[0], intersectedPoints[1]);
		} else if(aLines.length>1 && bLines.length==1){
			surfaceB = bLines[0];
			surfaceA = new Line(intersectedPoints[0], intersectedPoints[1]);
		} else if(aLines.length>1 && bLines.length>1){
			surfaceA = new Line(intersectedPoints[0], intersectedPoints[1]);
			surfaceB = new Line(intersectedPoints[0], intersectedPoints[1]);
		}

		//碰撞後各自得到的速度
		let ax,ay, bx, by;
		if(a.fixed && !b.fixed){
			ax = av.x;
			ay = av.y;
			bx = -bv.x;
			by = -bv.y;

		} else if(!a.fixed && b.fixed){
			ax = -av.x;
			ay = -av.y;
			bx = bv.x;
			by = bv.y;

		} else {
			ax = (av.x * (a.mass - b.mass) + 2 * b.mass * bv.x) / (a.mass + b.mass);		
			ay = (av.y * (a.mass - b.mass) + 2 * b.mass * bv.y) / (a.mass + b.mass);
			bx = (bv.x * (b.mass - a.mass) + 2 * a.mass * av.x) / (a.mass + b.mass);		
			by = (bv.y * (b.mass - a.mass) + 2 * a.mass * av.y) / (a.mass + b.mass);
		}

		if(Math.pow(ax,2)+Math.pow(ay,2)+Math.pow(bx,2)+Math.pow(by,2)<10){			
				ax=0;
				ay=0;
				bx=0;
				by=0;			
		}

		ax *= 0.8;
		ay *= 0.8;
		bx *= 0.8;
		by *= 0.8;

		let getA = new Vector(ax, ay);
		let getB = new Vector(bx, by);

		let ra = new Line(a.getCenter(), new Point(x, y));
		let rb = new Line(b.getCenter(), new Point(x, y));

		//若一方為fixed, 鏡射受到的力
		if(a.fixed || b.fixed){
			getA = getA.mirror(surfaceB.getAngle() + Math.PI / 2);
			getB = getB.mirror(surfaceA.getAngle() + Math.PI / 2);
		}

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
		while(Polygon.isIntersected(a.poly, b.poly)){
			// if(!a.fixed) a.poly = a.poly.translate(new Vector((a.getCenter().x - intersectedCentroid.x) / 1000, (a.getCenter().y - intersectedCentroid.y) / 1000))
			// if(!b.fixed) b.poly = b.poly.translate(new Vector((b.getCenter().x - intersectedCentroid.x) / 1000, (b.getCenter().y - intersectedCentroid.y) / 1000))
			if(!a.fixed) a.poly = a.poly.translate(Vector.get(0.01, new Line(intersectedCentroid, a.getCenter()).getAngle()));
			if(!b.fixed) b.poly = b.poly.translate(Vector.get(0.01, new Line(intersectedCentroid, b.getCenter()).getAngle()));
		}

	}
}