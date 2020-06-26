var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.translate(200, 200);

prepareCoordinate();

var line1 = randomLine().draw(ctx);
var line2 = randomLine().draw(ctx);

console.log(Line.isIntersected(line1, line2));

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