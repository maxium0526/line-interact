var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.translate(200, 200);
prepareCoordinate();

var line1 = null;
var line2 = null;

$('#generate-lines').on('click', function(){
	ctx.clearRect(-200, -200, 400, 400);
	prepareCoordinate();
	line1 = randomLine();
	line2 = randomLine();
	if(Line.isIntersected(line1, line2)){
		ctx.strokeStyle = "#FF0000";
		ctx.fillStyle = "#FF0000";
	}
	line1.draw(ctx);
	line2.draw(ctx);
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";
})

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