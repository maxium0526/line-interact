class Engine{
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.items = [];
		this.fps = 100;

		this.timer = null;
	}
	addItems(items){
		this.items = this.items.concat(items);
		return this;
	}
	setFPS(fps){
		this.fps = fps;
		return this;
	}
	start(){
		let _this = this;
		let tick = function(){
			for(let i=0; i<_this.items.length-1; i++){
				for(let j=i; j<_this.items.length; j++){
					PolygonItem.touch(_this.items[i], _this.items[j]);
				}
			}
			for(let item of _this.items){
				item.nxt(_this.fps);
			}

		}

		let ctx = _this.ctx;
		let render = function(){
			ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
			for(let item of _this.items){
				item.draw(ctx);
			}
			requestAnimationFrame(render);
		}

		this.timer = setInterval(tick, 1000 / _this.fps);
		requestAnimationFrame(render);

		return this;
	}
}