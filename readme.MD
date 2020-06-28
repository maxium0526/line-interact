A javaScript function that tests if 2 line segments are intersected.

### How to use ###

	<head>
		<script src="line.js"></script>		
	</head>

##### Function: #####

	testIntersect(x1, y1, x2, y2, x3, y3, x4, y4)

###### Arguments:
* All are numbers.
* Line 1: (`x1`, `y1`)------------(`x2`,`y2`)
* Line 2: (`x3`, `y3`)------------(`x4`,`y4`)

###### Returns:
A boolean.

---

	calcIntersectPoint(x1, y1, x2, y2, x3, y3, x4, y4)

###### Arguments:
* All are numbers.
* Line 1: (`x1`, `y1`)------------(`x2`,`y2`)
* Line 2: (`x3`, `y3`)------------(`x4`,`y4`)

###### Returns:
If intersected, return a `Point` object which represents the intersection point. Use Point.x, Point.y to get the coordinate.
If not intersected, return `null`.

---

### How it works ###

A stupid method. May be written in my [blog][1] later. I do not know whether this method exists before. If yes, let me know, I will put it into references.

---

### References ###

The following are just what I have read, not the method I have used.

只看不用。

http://www.csie.ntnu.edu.tw/~u91029/Point.html
https://silverwind1982.pixnet.net/blog/post/165223625



[1]: https://maxium0526.github.io/blog