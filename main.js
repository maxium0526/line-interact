var canvas = document.getElementById('canvas-main');
var ctx = canvas.getContext('2d');
ctx.translate(200, 200);
prepareCoordinate(ctx);

var r1canvas = document.getElementById('canvas-r1');
var r1 = r1canvas.getContext('2d');
r1.translate(200, 200);
prepareCoordinate(r1);

var r2canvas = document.getElementById('canvas-r2');
var r2 = r2canvas.getContext('2d');
r2.translate(200, 200);
prepareCoordinate(r2);

var line1 = null;
var line2 = null;

$('#generate-lines').on('click', function(){
	ctx.clearRect(-200, -200, 400, 400);
	prepareCoordinate(ctx);
	line1 = randomLine();
	line2 = randomLine();
	if(Line.isIntersected(line1, line2)){
		ctx.strokeStyle = "#FF0000";
		ctx.fillStyle = "#FF0000";
		let intersectionPoint = Line.calcIntersectionPoint(line1, line2).draw(ctx);
		$('#intersect-text').text("They are intersected at (" + (Math.floor(intersectionPoint.x * 100) / 100) + ', ' + (Math.floor(intersectionPoint.y * 100) / 100) + ')!');
	} else {
		$('#intersect-text').text('They are NOT intersected.');
	}
	line1.draw(ctx);
	line2.draw(ctx);
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";

	//r1
	r1.clearRect(-200, -200, 400, 400);
	prepareCoordinate(r1);
	let r1n1 = line1.rotate(0, 0, -line1.getAngle());
	let r1n2 = line2.rotate(0, 0, -line1.getAngle());
	r1n1.draw(r1);
	r1n2.draw(r1);
	if(Line.__isOverLappedOnRotatedAxis__(line2, line1)){
		r1.fillStyle = "rgba(255, 0, 0, 0.2)";
		$('#result-r1').text("Overlapped");
		$('#result').text("= Intersected");
	} else {
		r1.fillStyle = "rgba(0, 255, 0, 0.2)";
		$('#result-r1').text("NOT overlapped");
		$('#result').text("= Not intersected");
	}
	r1.fillRect(-200, r1n2.p1.y, 400, r1n2.p2.y - r1n2.p1.y);
	r1.fillStyle = "#000000";

	//r2
	r2.clearRect(-200, -200, 400, 400);
	prepareCoordinate(r2);
	let r2n1 = line1.rotate(0, 0, -line2.getAngle());
	let r2n2 = line2.rotate(0, 0, -line2.getAngle());
	r2n1.draw(r2);
	r2n2.draw(r2);
	if(Line.__isOverLappedOnRotatedAxis__(line1, line2)){
		r2.fillStyle = "rgba(255, 0, 0, 0.2)";
		$('#result-r2').text("Overlapped");
	} else {
		r2.fillStyle = "rgba(0, 255, 0, 0.2)";
		$('#result-r2').text("NOT overlapped");
	}
	r2.fillRect(-200, r2n1.p1.y, 400, r2n1.p2.y - r2n1.p1.y);
	r2.fillStyle = "#000000";
})

function prepareCoordinate(gx){
	gx.beginPath();
	gx.moveTo(-200,0);
	gx.lineTo(200,0);
	gx.stroke();
	gx.beginPath();
	gx.moveTo(0,-200);
	gx.lineTo(0,200);
	gx.stroke();
}

function randomLine(){
	return new Line(
		new Point(Math.random()*200-100, Math.random()*200-100),
		new Point(Math.random()*200-100, Math.random()*200-100),
		);
}