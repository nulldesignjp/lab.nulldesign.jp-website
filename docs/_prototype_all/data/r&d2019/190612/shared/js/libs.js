/*
	libs.js
*/


/*

		//	Load Map
		var guiData = {
			currentURL: '0.svg',
			drawFillShapes: true,
			drawStrokes: true,
			fillShapesWireframe: false,
			strokesWireframe: false
		}

		//	loadSVG( guiData.currentURL );
*/

function loadSVG( guiData, _callback ) {

	var url = guiData.currentURL;
	_callback = _callback==undefined?function(w){}:_callback;

	var loader = new THREE.SVGLoader();
	loader.load( url, function ( data ) {

		var paths = data.paths;

		var group = new THREE.Group();

		var _scale = .1;

		for ( var i = 0; i < paths.length; i ++ ) {

			var path = paths[ i ];

			var fillColor = path.userData.style.fill;
			if ( guiData.drawFillShapes && fillColor !== undefined && fillColor !== 'none') {

				var material = new THREE.MeshBasicMaterial( {
					//color: new THREE.Color().setStyle( fillColor ),
					color: 0xFFFFFF,
					// opacity: path.userData.style.fillOpacity,
					transparent: true,
					side: THREE.DoubleSide,
					//depthWrite: false,
					depthTest: false
					//wireframe: guiData.fillShapesWireframe
				} );

				var shapes = path.toShapes( true );

				for ( var j = 0; j < shapes.length; j ++ ) {

					var shape = shapes[ j ];

					var geometry = new THREE.ShapeBufferGeometry( shape );
					geometry.scale( _scale, _scale, _scale )
					geometry.rotateX( Math.PI * 0.5 );
					var mesh = new THREE.Mesh( geometry, material );
					group.add( mesh );

				}

			}

			var strokeColor = path.userData.style.stroke;

			if ( guiData.drawStrokes && strokeColor !== undefined && strokeColor !== 'none' ) {

				var material = new THREE.MeshBasicMaterial( {
					color: new THREE.Color().setStyle( strokeColor ),
					opacity: path.userData.style.strokeOpacity,
					transparent: path.userData.style.strokeOpacity < 1,
					side: THREE.DoubleSide,
					depthWrite: false,
					wireframe: guiData.strokesWireframe
				} );

				for ( var j = 0, jl = path.subPaths.length; j < jl; j ++ ) {

					subPath = path.subPaths[ j ];

					var geometry = THREE.SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style );

					if ( geometry ) {

						var mesh = new THREE.Mesh( geometry, material );

						group.add( mesh );

					}

				}

			}

		}

		//	_world.add( group );
		_callback( group );

	} );

}



/**
 * @author mrdoob / http://mrdoob.com/
 * @author zz85 / http://joshuakoo.com/
 * @author yomboprime / https://yombo.org
 */

THREE.SVGLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.SVGLoader.prototype = {

	constructor: THREE.SVGLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setPath: function ( value ) {

		this.path = value;
		return this;

	},

	parse: function ( text ) {

		function parseNode( node, style ) {

			if ( node.nodeType !== 1 ) return;

			var transform = getNodeTransform( node );

			var path = null;

			switch ( node.nodeName ) {

				case 'svg':
					break;

				case 'g':
					style = parseStyle( node, style );
					break;

				case 'path':
					style = parseStyle( node, style );
					if ( node.hasAttribute( 'd' ) ) path = parsePathNode( node, style );
					break;

				case 'rect':
					style = parseStyle( node, style );
					path = parseRectNode( node, style );
					break;

				case 'polygon':
					style = parseStyle( node, style );
					path = parsePolygonNode( node, style );
					break;

				case 'polyline':
					style = parseStyle( node, style );
					path = parsePolylineNode( node, style );
					break;

				case 'circle':
					style = parseStyle( node, style );
					path = parseCircleNode( node, style );
					break;

				case 'ellipse':
					style = parseStyle( node, style );
					path = parseEllipseNode( node, style );
					break;

				case 'line':
					style = parseStyle( node, style );
					path = parseLineNode( node, style );
					break;

				default:
					console.log( node );

			}

			if ( path ) {

				if ( style.fill !== undefined && style.fill !== 'none' ) {

					path.color.setStyle( style.fill );

				}

				transformPath( path, currentTransform );

				paths.push( path );

				path.userData = { node: node, style: style };

			}

			var nodes = node.childNodes;

			for ( var i = 0; i < nodes.length; i ++ ) {

				parseNode( nodes[ i ], style );

			}

			if ( transform ) {

				transformStack.pop();

				if ( transformStack.length > 0 ) {

					currentTransform.copy( transformStack[ transformStack.length - 1 ] );

				} else {

					currentTransform.identity();

				}

			}

		}

		function parsePathNode( node, style ) {

			var path = new THREE.ShapePath();

			var point = new THREE.Vector2();
			var control = new THREE.Vector2();

			var firstPoint = new THREE.Vector2();
			var isFirstPoint = true;
			var doSetFirstPoint = false;

			var d = node.getAttribute( 'd' );

			var commands = d.match( /[a-df-z][^a-df-z]*/ig );

			for ( var i = 0, l = commands.length; i < l; i ++ ) {

				var command = commands[ i ];

				var type = command.charAt( 0 );
				var data = command.substr( 1 ).trim();

				if ( isFirstPoint === true ) {
					doSetFirstPoint = true;
					isFirstPoint = false;
				}

				switch ( type ) {

					case 'M':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							if ( j === 0 ) {
								path.moveTo( point.x, point.y );
							} else {
								path.lineTo( point.x, point.y );
							}
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'H':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {
							point.x = numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'V':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {
							point.y = numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'L':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'C':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 6 ) {
							path.bezierCurveTo(
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ],
								numbers[ j + 4 ],
								numbers[ j + 5 ]
							);
							control.x = numbers[ j + 2 ];
							control.y = numbers[ j + 3 ];
							point.x = numbers[ j + 4 ];
							point.y = numbers[ j + 5 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'S':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {
							path.bezierCurveTo(
								getReflection( point.x, control.x ),
								getReflection( point.y, control.y ),
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ]
							);
							control.x = numbers[ j + 0 ];
							control.y = numbers[ j + 1 ];
							point.x = numbers[ j + 2 ];
							point.y = numbers[ j + 3 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'Q':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {
							path.quadraticCurveTo(
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ]
							);
							control.x = numbers[ j + 0 ];
							control.y = numbers[ j + 1 ];
							point.x = numbers[ j + 2 ];
							point.y = numbers[ j + 3 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'T':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							var rx = getReflection( point.x, control.x );
							var ry = getReflection( point.y, control.y );
							path.quadraticCurveTo(
								rx,
								ry,
								numbers[ j + 0 ],
								numbers[ j + 1 ]
							);
							control.x = rx;
							control.y = ry;
							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'A':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 7 ) {
							var start = point.clone();
							point.x = numbers[ j + 5 ];
							point.y = numbers[ j + 6 ];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
							);
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					//

					case 'm':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							point.x += numbers[ j + 0 ];
							point.y += numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							if ( j === 0 ) {
								path.moveTo( point.x, point.y );
							} else {
								path.lineTo( point.x, point.y );
							}
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'h':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {
							point.x += numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'v':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {
							point.y += numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'l':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							point.x += numbers[ j + 0 ];
							point.y += numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'c':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 6 ) {
							path.bezierCurveTo(
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ],
								point.x + numbers[ j + 4 ],
								point.y + numbers[ j + 5 ]
							);
							control.x = point.x + numbers[ j + 2 ];
							control.y = point.y + numbers[ j + 3 ];
							point.x += numbers[ j + 4 ];
							point.y += numbers[ j + 5 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 's':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {
							path.bezierCurveTo(
								getReflection( point.x, control.x ),
								getReflection( point.y, control.y ),
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ]
							);
							control.x = point.x + numbers[ j + 0 ];
							control.y = point.y + numbers[ j + 1 ];
							point.x += numbers[ j + 2 ];
							point.y += numbers[ j + 3 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'q':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {
							path.quadraticCurveTo(
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ]
							);
							control.x = point.x + numbers[ j + 0 ];
							control.y = point.y + numbers[ j + 1 ];
							point.x += numbers[ j + 2 ];
							point.y += numbers[ j + 3 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 't':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {
							var rx = getReflection( point.x, control.x );
							var ry = getReflection( point.y, control.y );
							path.quadraticCurveTo(
								rx,
								ry,
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ]
							);
							control.x = rx;
							control.y = ry;
							point.x = point.x + numbers[ j + 0 ];
							point.y = point.y + numbers[ j + 1 ];
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					case 'a':
						var numbers = parseFloats( data );
						for ( var j = 0, jl = numbers.length; j < jl; j += 7 ) {
							var start = point.clone();
							point.x += numbers[ j + 5 ];
							point.y += numbers[ j + 6 ];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
							);
							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
						}
						break;

					//

					case 'Z':
					case 'z':
						path.currentPath.autoClose = true;
						if ( path.currentPath.curves.length > 0 ) {
							// Reset point to beginning of Path
							point.copy( firstPoint );
							path.currentPath.currentPoint.copy( point );
							isFirstPoint = true;
						}
						break;

					default:
						console.warn( command );

				}

				doSetFirstPoint = false;

			}

			return path;

		}

		/**
		 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
		 * From
		 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
		 * To
		 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
		 */

		function parseArcCommand( path, rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, start, end ) {

			x_axis_rotation = x_axis_rotation * Math.PI / 180;

			// Ensure radii are positive
			rx = Math.abs( rx );
			ry = Math.abs( ry );

			// Compute (x1′, y1′)
			var dx2 = ( start.x - end.x ) / 2.0;
			var dy2 = ( start.y - end.y ) / 2.0;
			var x1p = Math.cos( x_axis_rotation ) * dx2 + Math.sin( x_axis_rotation ) * dy2;
			var y1p = - Math.sin( x_axis_rotation ) * dx2 + Math.cos( x_axis_rotation ) * dy2;

			// Compute (cx′, cy′)
			var rxs = rx * rx;
			var rys = ry * ry;
			var x1ps = x1p * x1p;
			var y1ps = y1p * y1p;

			// Ensure radii are large enough
			var cr = x1ps / rxs + y1ps / rys;

			if ( cr > 1 ) {

				// scale up rx,ry equally so cr == 1
				var s = Math.sqrt( cr );
				rx = s * rx;
				ry = s * ry;
				rxs = rx * rx;
				rys = ry * ry;

			}

			var dq = ( rxs * y1ps + rys * x1ps );
			var pq = ( rxs * rys - dq ) / dq;
			var q = Math.sqrt( Math.max( 0, pq ) );
			if ( large_arc_flag === sweep_flag ) q = - q;
			var cxp = q * rx * y1p / ry;
			var cyp = - q * ry * x1p / rx;

			// Step 3: Compute (cx, cy) from (cx′, cy′)
			var cx = Math.cos( x_axis_rotation ) * cxp - Math.sin( x_axis_rotation ) * cyp + ( start.x + end.x ) / 2;
			var cy = Math.sin( x_axis_rotation ) * cxp + Math.cos( x_axis_rotation ) * cyp + ( start.y + end.y ) / 2;

			// Step 4: Compute θ1 and Δθ
			var theta = svgAngle( 1, 0, ( x1p - cxp ) / rx, ( y1p - cyp ) / ry );
			var delta = svgAngle( ( x1p - cxp ) / rx, ( y1p - cyp ) / ry, ( - x1p - cxp ) / rx, ( - y1p - cyp ) / ry ) % ( Math.PI * 2 );

			path.currentPath.absellipse( cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation );

		}

		function svgAngle( ux, uy, vx, vy ) {

			var dot = ux * vx + uy * vy;
			var len = Math.sqrt( ux * ux + uy * uy ) *  Math.sqrt( vx * vx + vy * vy );
			var ang = Math.acos( Math.max( -1, Math.min( 1, dot / len ) ) ); // floating point precision, slightly over values appear
			if ( ( ux * vy - uy * vx ) < 0 ) ang = - ang;
			return ang;

		}

		/*
		* According to https://www.w3.org/TR/SVG/shapes.html#RectElementRXAttribute
		* rounded corner should be rendered to elliptical arc, but bezier curve does the job well enough
		*/
		function parseRectNode( node, style ) {

			var x = parseFloat( node.getAttribute( 'x' ) || 0 );
			var y = parseFloat( node.getAttribute( 'y' ) || 0 );
			var rx = parseFloat( node.getAttribute( 'rx' ) || 0 );
			var ry = parseFloat( node.getAttribute( 'ry' ) || 0 );
			var w = parseFloat( node.getAttribute( 'width' ) );
			var h = parseFloat( node.getAttribute( 'height' ) );

			var path = new THREE.ShapePath();
			path.moveTo( x + 2 * rx, y );
			path.lineTo( x + w - 2 * rx, y );
			if ( rx !== 0 || ry !== 0 ) path.bezierCurveTo( x + w, y, x + w, y, x + w, y + 2 * ry );
			path.lineTo( x + w, y + h - 2 * ry );
			if ( rx !== 0 || ry !== 0 ) path.bezierCurveTo( x + w, y + h, x + w, y + h, x + w - 2 * rx, y + h );
			path.lineTo( x + 2 * rx, y + h );

			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo( x, y + h, x, y + h, x, y + h - 2 * ry );

			}

			path.lineTo( x, y + 2 * ry );

			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo( x, y, x, y, x + 2 * rx, y );

			}

			return path;

		}

		function parsePolygonNode( node, style ) {

			function iterator( match, a, b ) {

				var x = parseFloat( a );
				var y = parseFloat( b );

				if ( index === 0 ) {
					path.moveTo( x, y );
				} else {
					path.lineTo( x, y );
				}

				index ++;

			}

			var regex = /(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g;

			var path = new THREE.ShapePath();

			var index = 0;

			node.getAttribute( 'points' ).replace(regex, iterator);

			path.currentPath.autoClose = true;

			return path;

		}

		function parsePolylineNode( node, style ) {

			function iterator( match, a, b ) {

				var x = parseFloat( a );
				var y = parseFloat( b );

				if ( index === 0 ) {
					path.moveTo( x, y );
				} else {
					path.lineTo( x, y );
				}

				index ++;

			}

			var regex = /(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g;

			var path = new THREE.ShapePath();

			var index = 0;

			node.getAttribute( 'points' ).replace(regex, iterator);

			path.currentPath.autoClose = false;

			return path;

		}

		function parseCircleNode( node, style ) {

			var x = parseFloat( node.getAttribute( 'cx' ) );
			var y = parseFloat( node.getAttribute( 'cy' ) );
			var r = parseFloat( node.getAttribute( 'r' ) );

			var subpath = new THREE.Path();
			subpath.absarc( x, y, r, 0, Math.PI * 2 );

			var path = new THREE.ShapePath();
			path.subPaths.push( subpath );

			return path;

		}

		function parseEllipseNode( node, style ) {

			var x = parseFloat( node.getAttribute( 'cx' ) );
			var y = parseFloat( node.getAttribute( 'cy' ) );
			var rx = parseFloat( node.getAttribute( 'rx' ) );
			var ry = parseFloat( node.getAttribute( 'ry' ) );

			var subpath = new THREE.Path();
			subpath.absellipse( x, y, rx, ry, 0, Math.PI * 2 );

			var path = new THREE.ShapePath();
			path.subPaths.push( subpath );

			return path;

		}

		function parseLineNode( node, style ) {

			var x1 = parseFloat( node.getAttribute( 'x1' ) );
			var y1 = parseFloat( node.getAttribute( 'y1' ) );
			var x2 = parseFloat( node.getAttribute( 'x2' ) );
			var y2 = parseFloat( node.getAttribute( 'y2' ) );

			var path = new THREE.ShapePath();
			path.moveTo( x1, y1 );
			path.lineTo( x2, y2 );
			path.currentPath.autoClose = false;

			return path;

		}

		//

		function parseStyle( node, style ) {

			style = Object.assign( {}, style ); // clone style

			function addStyle( svgName, jsName, adjustFunction ) {

				if ( adjustFunction === undefined ) adjustFunction = function copy( v ) { return v; };

				if ( node.hasAttribute( svgName ) ) style[ jsName ] = adjustFunction( node.getAttribute( svgName ) );
				if ( node.style[ svgName ] !== '' ) style[ jsName ] = adjustFunction( node.style[ svgName ] );

			}

			function clamp( v ) {

				return Math.max( 0, Math.min( 1, v ) );

			}

			function positive( v ) {

				return Math.max( 0, v );

			}

			addStyle( 'fill', 'fill' );
			addStyle( 'fill-opacity', 'fillOpacity', clamp );
			addStyle( 'stroke', 'stroke' );
			addStyle( 'stroke-opacity', 'strokeOpacity', clamp );
			addStyle( 'stroke-width', 'strokeWidth', positive );
			addStyle( 'stroke-linejoin', 'strokeLineJoin' );
			addStyle( 'stroke-linecap', 'strokeLineCap' );
			addStyle( 'stroke-miterlimit', 'strokeMiterLimit', positive );

			return style;

		}

		// http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes

		function getReflection( a, b ) {

			return a - ( b - a );

		}

		function parseFloats( string ) {

			var array = string.split( /[\s,]+|(?=\s?[+\-])/ );

			for ( var i = 0; i < array.length; i ++ ) {

				var number = array[ i ];

				// Handle values like 48.6037.7.8
				// TODO Find a regex for this

				if ( number.indexOf( '.' ) !== number.lastIndexOf( '.' ) ) {

					var split = number.split( '.' );

					for ( var s = 2; s < split.length; s ++ ) {

						array.splice( i + s - 1, 0, '0.' + split[ s ] );

					}

				}

				array[ i ] = parseFloat( number );

			}

			return array;


		}

		function getNodeTransform( node ) {

			if ( ! node.hasAttribute( 'transform' ) ) {
				return null;
			}

			var transform = parseNodeTransform( node );

			if ( transform ) {

				if ( transformStack.length > 0 ) {
					transform.premultiply( transformStack[ transformStack.length - 1 ] );
				}

				currentTransform.copy( transform );
				transformStack.push( transform );

			}

			return transform;

		}

		function parseNodeTransform( node ) {

			var transform = new THREE.Matrix3();
			var currentTransform = tempTransform0;
			var transformsTexts = node.getAttribute( 'transform' ).split( ')' );

			for ( var tIndex = transformsTexts.length - 1; tIndex >= 0; tIndex -- ) {

				var transformText = transformsTexts[ tIndex ].trim();

				if ( transformText === '' ) continue;

				var openParPos = transformText.indexOf( '(' );
				var closeParPos = transformText.length;

				if ( openParPos > 0 && openParPos < closeParPos ) {

					var transformType = transformText.substr( 0, openParPos );

					var array = parseFloats( transformText.substr( openParPos + 1, closeParPos - openParPos - 1 ) );

					currentTransform.identity();

					switch ( transformType ) {

						case "translate":

							if ( array.length >= 1 ) {

								var tx = array[ 0 ];
								var ty = tx;

								if ( array.length >= 2 ) {

									ty = array[ 1 ];

								}

								currentTransform.translate( tx, ty );

							}

							break;

						case "rotate":

							if ( array.length >= 1 ) {

								var angle = 0;
								var cx = 0;
								var cy = 0;

								// Angle
								angle = - array[ 0 ] * Math.PI / 180;

								if ( array.length >= 3 ) {

									// Center x, y
									cx = array[ 1 ];
									cy = array[ 2 ];

								}

								// Rotate around center (cx, cy)
								tempTransform1.identity().translate( -cx, -cy );
								tempTransform2.identity().rotate( angle );
								tempTransform3.multiplyMatrices( tempTransform2, tempTransform1 );
								tempTransform1.identity().translate( cx, cy );
								currentTransform.multiplyMatrices( tempTransform1, tempTransform3 );

							}

							break;

						case "scale":

							if ( array.length >= 1 ) {

								var scaleX = array[ 0 ];
								var scaleY = scaleX;

								if ( array.length >= 2 ) {
									scaleY = array[ 1 ];
								}

								currentTransform.scale( scaleX, scaleY );

							}

							break;

						case "skewX":

							if ( array.length === 1 ) {

								currentTransform.set(
									1, Math.tan( array[ 0 ] * Math.PI / 180 ), 0,
									0, 1, 0,
									0, 0, 1
								);

							}

							break;

						case "skewY":

							if ( array.length === 1 ) {

								currentTransform.set(
									1, 0, 0,
									Math.tan( array[ 0 ] * Math.PI / 180 ), 1, 0,
									0, 0, 1
								);

							}

							break;

						case "matrix":

							if ( array.length === 6 ) {

								currentTransform.set(
									array[ 0 ], array[ 2 ], array[ 4 ],
									array[ 1 ], array[ 3 ], array[ 5 ],
									0, 0, 1
								);

							}

							break;
					}

				}

				transform.premultiply( currentTransform );

			}

			return transform;

		}

		function transformPath( path, m ) {

			function transfVec2( v2 ) {

				tempV3.set( v2.x, v2.y, 1 ).applyMatrix3( m );

				v2.set( tempV3.x, tempV3.y );

			}

			var isRotated = isTransformRotated( m );

			var subPaths = path.subPaths;

			for ( var i = 0, n = subPaths.length; i < n; i++ ) {

				var subPath = subPaths[ i ];
				var curves = subPath.curves;

				for ( var j = 0; j < curves.length; j++ ) {

					var curve = curves[ j ];

					if ( curve.isLineCurve ) {

						transfVec2( curve.v1 );
						transfVec2( curve.v2 );

					} else if ( curve.isCubicBezierCurve ) {

						transfVec2( curve.v0 );
						transfVec2( curve.v1 );
						transfVec2( curve.v2 );
						transfVec2( curve.v3 );

					} else if ( curve.isQuadraticBezierCurve ) {

						transfVec2( curve.v0 );
						transfVec2( curve.v1 );
						transfVec2( curve.v2 );

					} else if ( curve.isEllipseCurve ) {

						if ( isRotated ) {
							console.warn( "SVGLoader: Elliptic arc or ellipse rotation or skewing is not implemented." );
						}

						tempV2.set( curve.aX, curve.aY );
						transfVec2( tempV2 );
						curve.aX = tempV2.x;
						curve.aY = tempV2.y;

						curve.xRadius *= getTransformScaleX( m );
						curve.yRadius *= getTransformScaleY( m );

					}

				}

			}

		}

		function isTransformRotated( m ) {
			return m.elements[ 1 ] !== 0 || m.elements[ 3 ] !== 0;
		}

		function getTransformScaleX( m ) {
			var te = m.elements;
			return Math.sqrt( te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] )
		}

		function getTransformScaleY( m ) {
			var te = m.elements;
			return Math.sqrt( te[ 3 ] * te[ 3 ] + te[ 4 ] * te[ 4 ] )
		}

		//

		var paths = [];

		var transformStack = [];

		var tempTransform0 = new THREE.Matrix3();
		var tempTransform1 = new THREE.Matrix3();
		var tempTransform2 = new THREE.Matrix3();
		var tempTransform3 = new THREE.Matrix3();
		var tempV2 = new THREE.Vector2();
		var tempV3 = new THREE.Vector3();

		var currentTransform = new THREE.Matrix3();

		var scope = this;

		console.time( 'THREE.SVGLoader: DOMParser' );

		var xml = new DOMParser().parseFromString( text, 'image/svg+xml' ); // application/xml

		console.timeEnd( 'THREE.SVGLoader: DOMParser' );

		console.time( 'THREE.SVGLoader: Parse' );

		parseNode( xml.documentElement, {
			fill: '#000',
			fillOpacity: 1,
			strokeOpacity: 1,
			strokeWidth: 1,
			strokeLineJoin: 'miter',
			strokeLineCap: 'butt',
			strokeMiterLimit: 4
		} );

		var data = { paths: paths, xml: xml.documentElement };

		console.timeEnd( 'THREE.SVGLoader: Parse' );

		return data;

	}

};

THREE.SVGLoader.getStrokeStyle = function ( width, color, opacity, lineJoin, lineCap,  miterLimit ) {

	// Param width: Stroke width
	// Param color: As returned by THREE.Color.getStyle()
	// Param opacity: 0 (transparent) to 1 (opaque)
	// Param lineJoin: One of "round", "bevel", "miter" or "miter-limit"
	// Param lineCap: One of "round", "square" or "butt"
	// Param miterLimit: Maximum join length, in multiples of the "width" parameter (join is truncated if it exceeds that distance)
	// Returns style object

	width = width !== undefined ? width : 1;
	color = color !== undefined ? color : '#000';
	opacity = opacity !== undefined ? opacity : 1;
	lineJoin = lineJoin !== undefined ? lineJoin : 'miter';
	lineCap = lineCap !== undefined ? lineCap : 'butt';
	miterLimit = miterLimit !== undefined ? miterLimit : 4;

	return {
		strokeColor: color,
		strokeWidth: width,
		strokeLineJoin: lineJoin,
		strokeLineCap: lineCap,
		strokeMiterLimit: miterLimit
	};

};

THREE.SVGLoader.pointsToStroke = function ( points, style, arcDivisions, minDistance ) {

	// Generates a stroke with some witdh around the given path.
	// The path can be open or closed (last point equals to first point)
	// Param points: Array of Vector2D (the path). Minimum 2 points.
	// Param style: Object with SVG properties as returned by SVGLoader.getStrokeStyle(), or SVGLoader.parse() in the path.userData.style object
	// Params arcDivisions: Arc divisions for round joins and endcaps. (Optional)
	// Param minDistance: Points closer to this distance will be merged. (Optional)
	// Returns BufferGeometry with stroke triangles (In plane z = 0). UV coordinates are generated ('u' along path. 'v' across it, from left to right)

	var vertices = [];
	var normals = [];
	var uvs = [];

	if ( THREE.SVGLoader.pointsToStrokeWithBuffers( points, style, arcDivisions, minDistance, vertices, normals, uvs ) === 0 ) {

		return null;

	}

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
	geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

	return geometry;

};

THREE.SVGLoader.pointsToStrokeWithBuffers = function () {

	var tempV2_1 = new THREE.Vector2();
	var tempV2_2 = new THREE.Vector2();
	var tempV2_3 = new THREE.Vector2();
	var tempV2_4 = new THREE.Vector2();
	var tempV2_5 = new THREE.Vector2();
	var tempV2_6 = new THREE.Vector2();
	var tempV2_7 = new THREE.Vector2();
	var tempV3_1 = new THREE.Vector3();
	var lastPointL = new THREE.Vector2();
	var lastPointR = new THREE.Vector2();
	var point0L = new THREE.Vector2();
	var point0R = new THREE.Vector2();
	var currentPointL = new THREE.Vector2();
	var currentPointR = new THREE.Vector2();
	var nextPointL = new THREE.Vector2();
	var nextPointR = new THREE.Vector2();
	var innerPoint = new THREE.Vector2();
	var outerPoint = new THREE.Vector2();
	var tempTransform0 = new THREE.Matrix3();
	var tempTransform1 = new THREE.Matrix3();
	var tempTransform2 = new THREE.Matrix3();

	return function ( points, style, arcDivisions, minDistance, vertices, normals, uvs, vertexOffset ) {

		// This function can be called to update existing arrays or buffers.
		// Accepts same parameters as pointsToStroke, plus the buffers and optional offset.
		// Param vertexOffset: Offset vertices to start writing in the buffers (3 elements/vertex for vertices and normals, and 2 elements/vertex for uvs)
		// Returns number of written vertices / normals / uvs pairs
		// if 'vertices' parameter is undefined no triangles will be generated, but the returned vertices count will still be valid (useful to preallocate the buffers)
		// 'normals' and 'uvs' buffers are optional

		arcLengthDivisions = arcDivisions !== undefined ? arcDivisions : 12;
		minDistance = minDistance !== undefined ? minDistance : 0.001;
		vertexOffset = vertexOffset !== undefined ? vertexOffset : 0;

		// First ensure there are no duplicated points
		points = removeDuplicatedPoints( points );

		var numPoints = points.length;

		if ( numPoints < 2 ) return 0;

		var isClosed = points[ 0 ].equals( points[ numPoints - 1 ] );

		var currentPoint;
		var previousPoint = points[ 0 ];
		var nextPoint;

		var strokeWidth2 = style.strokeWidth / 2;

		var deltaU = 1 / ( numPoints - 1 );
		var u0 = 0;

		var innerSideModified;
		var joinIsOnLeftSide;
		var isMiter;
		var initialJoinIsOnLeftSide = false;

		var numVertices = 0;
		var currentCoordinate = vertexOffset * 3;
		var currentCoordinateUV = vertexOffset * 2;

		// Get initial left and right stroke points
		getNormal( points[ 0 ], points[ 1 ], tempV2_1 ).multiplyScalar( strokeWidth2 );
		lastPointL.copy( points[ 0 ] ).sub( tempV2_1 );
		lastPointR.copy( points[ 0 ] ).add( tempV2_1 );
		point0L.copy( lastPointL );
		point0R.copy( lastPointR );

		for ( var iPoint = 1; iPoint < numPoints; iPoint ++ ) {

			currentPoint = points[ iPoint ];

			// Get next point
			if ( iPoint === numPoints - 1 ) {

				if ( isClosed ) {

					// Skip duplicated initial point
					nextPoint = points[ 1 ];

				}
				else nextPoint = undefined;

			}
			else {

				nextPoint = points[ iPoint + 1 ];

			}

			// Normal of previous segment in tempV2_1
			var normal1 = tempV2_1;
			getNormal( previousPoint, currentPoint, normal1 );

			tempV2_3.copy( normal1 ).multiplyScalar( strokeWidth2 );
			currentPointL.copy( currentPoint ).sub( tempV2_3 );
			currentPointR.copy( currentPoint ).add( tempV2_3 );

			var u1 = u0 + deltaU;

			innerSideModified = false;

			if ( nextPoint !== undefined ) {

				// Normal of next segment in tempV2_2
				getNormal( currentPoint, nextPoint, tempV2_2 );

				tempV2_3.copy( tempV2_2 ).multiplyScalar( strokeWidth2 );
				nextPointL.copy( currentPoint ).sub( tempV2_3 );
				nextPointR.copy( currentPoint ).add( tempV2_3 );

				joinIsOnLeftSide = true;
				tempV2_3.subVectors( nextPoint, previousPoint );
				if ( normal1.dot( tempV2_3 ) < 0 ) {

					joinIsOnLeftSide = false;

				}
				if ( iPoint === 1 ) initialJoinIsOnLeftSide = joinIsOnLeftSide;

				tempV2_3.subVectors( nextPoint, currentPoint )
				var maxInnerDistance = tempV2_3.normalize();
				var dot = Math.abs( normal1.dot( tempV2_3 ) );

				// If path is straight, don't create join
				if ( dot !== 0 ) {

					// Compute inner and outer segment intersections
					var miterSide = strokeWidth2 / dot;
					tempV2_3.multiplyScalar( - miterSide );
					tempV2_4.subVectors( currentPoint, previousPoint );
					tempV2_5.copy( tempV2_4 ).setLength( miterSide ).add( tempV2_3 );
					innerPoint.copy( tempV2_5 ).negate();
					var miterLength2 = tempV2_5.length();
					var segmentLengthPrev = tempV2_4.length();
					tempV2_4.divideScalar( segmentLengthPrev );
					tempV2_6.subVectors( nextPoint, currentPoint );
					var segmentLengthNext = tempV2_6.length();
					tempV2_6.divideScalar( segmentLengthNext );
					// Check that previous and next segments doesn't overlap with the innerPoint of intersection
					if ( tempV2_4.dot( innerPoint ) < segmentLengthPrev && tempV2_6.dot( innerPoint ) < segmentLengthNext ) {

						innerSideModified = true;

					}
					outerPoint.copy( tempV2_5 ).add( currentPoint );
					innerPoint.add( currentPoint );

					isMiter = false;

					if ( innerSideModified ) {

						if ( joinIsOnLeftSide ) {

							nextPointR.copy( innerPoint );
							currentPointR.copy( innerPoint );

						}
						else {

							nextPointL.copy( innerPoint );
							currentPointL.copy( innerPoint );

						}

					}
					else {

						// The segment triangles are generated here if there was overlapping

						makeSegmentTriangles();

					}

					switch ( style.strokeLineJoin ) {

						case 'bevel':

							makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );

							break;

						case 'round':

							// Segment triangles

							createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

							// Join triangles

							if ( joinIsOnLeftSide ) {

								makeCircularSector( currentPoint, currentPointL, nextPointL, u1, 0 );

							}
							else {

								makeCircularSector( currentPoint, nextPointR, currentPointR, u1, 1 );

							}

							break;

						case 'miter':
						case 'miter-clip':
						default:

							var miterFraction = ( strokeWidth2 * style.strokeMiterLimit ) / miterLength2;

							if ( miterFraction < 1 ) {

								// The join miter length exceeds the miter limit

								if ( style.strokeLineJoin !== 'miter-clip' ) {

									makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );
									break;

								}
								else {

									// Segment triangles

									createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

									// Miter-clip join triangles

									if ( joinIsOnLeftSide ) {

										tempV2_6.subVectors( outerPoint, currentPointL ).multiplyScalar( miterFraction ).add( currentPointL );
										tempV2_7.subVectors( outerPoint, nextPointL ).multiplyScalar( miterFraction ).add( nextPointL );

										addVertex( currentPointL, u1, 0 );
										addVertex( tempV2_6, u1, 0 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_6, u1, 0 );
										addVertex( tempV2_7, u1, 0 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_7, u1, 0 );
										addVertex( nextPointL, u1, 0 );

									}
									else {

										tempV2_6.subVectors( outerPoint, currentPointR ).multiplyScalar( miterFraction ).add( currentPointR );
										tempV2_7.subVectors( outerPoint, nextPointR ).multiplyScalar( miterFraction ).add( nextPointR );

										addVertex( currentPointR, u1, 1 );
										addVertex( tempV2_6, u1, 1 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_6, u1, 1 );
										addVertex( tempV2_7, u1, 1 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_7, u1, 1 );
										addVertex( nextPointR, u1, 1 );

									}

								}

							}
							else {

								// Miter join segment triangles

								if ( innerSideModified ) {

									// Optimized segment + join triangles

									if ( joinIsOnLeftSide ) {

										addVertex( lastPointR, u0, 1 );
										addVertex( lastPointL, u0, 0 );
										addVertex( outerPoint, u1, 0 );

										addVertex( lastPointR, u0, 1 );
										addVertex( outerPoint, u1, 0 );
										addVertex( innerPoint, u1, 1 );

									}
									else {

										addVertex( lastPointR, u0, 1 );
										addVertex( lastPointL, u0, 0 );
										addVertex( outerPoint, u1, 1 );

										addVertex( lastPointL, u0, 0 );
										addVertex( innerPoint, u1, 0 );
										addVertex( outerPoint, u1, 1 );

									}


									if ( joinIsOnLeftSide ) {

										nextPointL.copy( outerPoint );

									}
									else {

										nextPointR.copy( outerPoint );

									}


								}
								else {

									// Add extra miter join triangles

									if ( joinIsOnLeftSide ) {

										addVertex( currentPointL, u1, 0 );
										addVertex( outerPoint, u1, 0 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( outerPoint, u1, 0 );
										addVertex( nextPointL, u1, 0 );

									}
									else {

										addVertex( currentPointR, u1, 1 );
										addVertex( outerPoint, u1, 1 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( outerPoint, u1, 1 );
										addVertex( nextPointR, u1, 1 );

									}

								}

								isMiter = true;

							}

							break;

					}

				}
				else {

					// The segment triangles are generated here when two consecutive points are collinear

					makeSegmentTriangles();

				}

			}
			else {

				// The segment triangles are generated here if it is the ending segment

				makeSegmentTriangles();

			}

			if ( ! isClosed && iPoint === numPoints - 1 ) {

				// Start line endcap
				addCapGeometry( points[ 0 ], point0L, point0R, joinIsOnLeftSide, true, u0 );

			}

			// Increment loop variables

			u0 = u1;

			previousPoint = currentPoint;

			lastPointL.copy( nextPointL );
			lastPointR.copy( nextPointR );

		}

		if ( ! isClosed ) {

			// Ending line endcap
			addCapGeometry( currentPoint, currentPointL, currentPointR, joinIsOnLeftSide, false, u1 );

		}
		else if ( innerSideModified && vertices ) {

			// Modify path first segment vertices to adjust to the segments inner and outer intersections

			var lastOuter = outerPoint;
			var lastInner = innerPoint;
			if ( initialJoinIsOnLeftSide !== joinIsOnLeftSide) {
				lastOuter = innerPoint;
				lastInner = outerPoint;
			}

			if ( joinIsOnLeftSide ) {

				lastInner.toArray( vertices, 0 * 3 );
				lastInner.toArray( vertices, 3 * 3 );

				if ( isMiter ) {

					lastOuter.toArray( vertices, 1 * 3 );
				}

			}
			else {

				lastInner.toArray( vertices, 1 * 3 );
				lastInner.toArray( vertices, 3 * 3 );

				if ( isMiter ) {

					lastOuter.toArray( vertices, 0 * 3 );
				}

			}

		}

		return numVertices;

		// -- End of algorithm

		// -- Functions

		function getNormal( p1, p2, result ) {

			result.subVectors( p2, p1 );
			return result.set( - result.y, result.x ).normalize();

		}

		function addVertex( position, u, v ) {

			if ( vertices ) {

				vertices[ currentCoordinate ] = position.x;
				vertices[ currentCoordinate + 1 ] = position.y;
				vertices[ currentCoordinate + 2 ] = 0;

				if ( normals ) {

					normals[ currentCoordinate ] = 0;
					normals[ currentCoordinate + 1 ] = 0;
					normals[ currentCoordinate + 2 ] = 1;

				}

				currentCoordinate += 3;

				if ( uvs ) {

					uvs[ currentCoordinateUV ] = u;
					uvs[ currentCoordinateUV + 1 ] = v;

					currentCoordinateUV += 2;

				}

			}

			numVertices += 3;

		}

		function makeCircularSector( center, p1, p2, u, v ) {

			// param p1, p2: Points in the circle arc.
			// p1 and p2 are in clockwise direction.

			tempV2_1.copy( p1 ).sub( center ).normalize();
			tempV2_2.copy( p2 ).sub( center ).normalize();

			var angle = Math.PI;
			var dot = tempV2_1.dot( tempV2_2 );
			if ( Math.abs( dot ) < 1 ) angle = Math.abs( Math.acos( dot ) );

			angle /= arcLengthDivisions;

			tempV2_3.copy( p1 );

			for ( var i = 0, il = arcLengthDivisions - 1; i < il; i++ ) {

				tempV2_4.copy( tempV2_3 ).rotateAround( center, angle );

				addVertex( tempV2_3, u, v );
				addVertex( tempV2_4, u, v );
				addVertex( center, u, 0.5 );

				tempV2_3.copy( tempV2_4 );
			}

			addVertex( tempV2_4, u, v );
			addVertex( p2, u, v );
			addVertex( center, u, 0.5 );

		}

		function makeSegmentTriangles() {

			addVertex( lastPointR, u0, 1 );
			addVertex( lastPointL, u0, 0 );
			addVertex( currentPointL, u1, 0 );

			addVertex( lastPointR, u0, 1 );
			addVertex( currentPointL, u1, 1 );
			addVertex( currentPointR, u1, 0 );

		}

		function makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u ) {

			if ( innerSideModified ) {

				// Optimized segment + bevel triangles

				if ( joinIsOnLeftSide ) {

					// Path segments triangles

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointL, u1, 0 );

					addVertex( lastPointR, u0, 1 );
					addVertex( currentPointL, u1, 0 );
					addVertex( innerPoint, u1, 1 );

					// Bevel join triangle

					addVertex( currentPointL, u, 0 );
					addVertex( nextPointL, u, 0 );
					addVertex( innerPoint, u, 0.5 );

				}
				else {

					// Path segments triangles

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( lastPointL, u0, 0 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPointR, u1, 1 );

					// Bevel join triangle

					addVertex( currentPointR, u, 1 );
					addVertex( nextPointR, u, 0 );
					addVertex( innerPoint, u, 0.5 );

				}

			}
			else {

				// Bevel join triangle. The segment triangles are done in the main loop

				if ( joinIsOnLeftSide ) {

					addVertex( currentPointL, u, 0 );
					addVertex( nextPointL, u, 0 );
					addVertex( currentPoint, u, 0.5 );

				}
				else {

					addVertex( currentPointR, u, 1 );
					addVertex( nextPointR, u, 0 );
					addVertex( currentPoint, u, 0.5 );

				}

			}

		}

		function createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified ) {

			if ( innerSideModified ) {

				if ( joinIsOnLeftSide ) {

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointL, u1, 0 );

					addVertex( lastPointR, u0, 1 );
					addVertex( currentPointL, u1, 0 );
					addVertex( innerPoint, u1, 1 );

					addVertex( currentPointL, u0, 0 );
					addVertex( currentPoint, u1, 0.5 );
					addVertex( innerPoint, u1, 1 );

					addVertex( currentPoint, u1, 0.5 );
					addVertex( nextPointL, u0, 0 );
					addVertex( innerPoint, u1, 1 );

				}
				else {

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( lastPointL, u0, 0 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( currentPointR, u0, 1 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPoint, u1, 0.5 );

					addVertex( currentPoint, u1, 0.5 );
					addVertex( innerPoint, u1, 0 );
					addVertex( nextPointR, u0, 1 );

				}

			}

		}

		function addCapGeometry( center, p1, p2, joinIsOnLeftSide, start, u ) {

			// param center: End point of the path
			// param p1, p2: Left and right cap points

			switch ( style.strokeLineCap ) {

				case 'round':

					if ( start ) {

						makeCircularSector( center, p2, p1, u, 0.5 );

					}
					else {

						makeCircularSector( center, p1, p2, u, 0.5 );

					}

					break;

				case 'square':

					if ( start ) {

						tempV2_1.subVectors( p1, center );
						tempV2_2.set( tempV2_1.y, - tempV2_1.x );

						tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
						tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

						// Modify already existing vertices
						if ( joinIsOnLeftSide ) {

							tempV2_3.toArray( vertices, 1 * 3 );
							tempV2_4.toArray( vertices, 0 * 3 );
							tempV2_4.toArray( vertices, 3 * 3 );

						}
						else {

							tempV2_3.toArray( vertices, 1 * 3 );
							tempV2_3.toArray( vertices, 3 * 3 );
							tempV2_4.toArray( vertices, 0 * 3 );

						}

					}
					else {

						tempV2_1.subVectors( p2, center );
						tempV2_2.set( tempV2_1.y, - tempV2_1.x );

						tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
						tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

						var vl = vertices.length;

						// Modify already existing vertices
						if ( joinIsOnLeftSide ) {

							tempV2_3.toArray( vertices, vl - 1 * 3 );
							tempV2_4.toArray( vertices, vl - 2 * 3 );
							tempV2_4.toArray( vertices, vl - 4 * 3 );

						}
						else {

							tempV2_3.toArray( vertices, vl - 2 * 3 );
							tempV2_4.toArray( vertices, vl - 1 * 3 );
							tempV2_4.toArray( vertices, vl - 4 * 3 );

						}

					}

					break;

				case 'butt':
				default:

					// Nothing to do here
					break;

			}

		}

		function removeDuplicatedPoints( points ) {

			// Creates a new array if necessary with duplicated points removed.
			// This does not remove duplicated initial and ending points of a closed path.

			var dupPoints = false;
			for ( var i = 1, n = points.length - 1; i < n; i ++ ) {

				if ( points[ i ].distanceTo( points[ i + 1 ] ) < minDistance ) {

					dupPoints = true;
					break;

				}

			}

			if ( ! dupPoints ) return points;

			var newPoints = [];
			newPoints.push( points[ 0 ] );

			for ( var i = 1, n = points.length - 1; i < n; i ++ ) {

				if ( points[ i ].distanceTo( points[ i + 1 ] ) >= minDistance ) {

					newPoints.push( points[ i ] );

				}
			}

			newPoints.push( points[ points.length - 1 ] );

			return newPoints;

		}
	};

}();



/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
// supported.
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the control orbits around
	// and where it pans with respect to.
	this.target = new THREE.Vector3();

	// center is old, deprecated; use "target" instead
	this.center = this.target;

	// This option actually enables dollying in and out; left as "zoom" for
	// backwards compatibility
	this.noZoom = false;
	this.zoomSpeed = 1.0;

	// Limits to how far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// Limits to how far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// Set to true to disable this control
	this.noRotate = false;
	this.rotateSpeed = 1.0;

	// Set to true to disable this control
	this.noPan = false;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to disable use of the keys
	this.noKeys = false;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	////////////
	// internals

	var scope = this;

	var EPS = 0.000001;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();
	var panOffset = new THREE.Vector3();

	var offset = new THREE.Vector3();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	var theta;
	var phi;
	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;
	var pan = new THREE.Vector3();

	var lastPosition = new THREE.Vector3();
	var lastQuaternion = new THREE.Quaternion();

	var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

	var state = STATE.NONE;

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	// so camera.up is the orbit axis

	var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
	var quatInverse = quat.clone().inverse();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	// pass in distance in world space to move left
	this.panLeft = function ( distance ) {

		var te = this.object.matrix.elements;

		// get X column of matrix
		panOffset.set( te[ 0 ], te[ 1 ], te[ 2 ] );
		panOffset.multiplyScalar( - distance );

		pan.add( panOffset );

	};

	// pass in distance in world space to move up
	this.panUp = function ( distance ) {

		var te = this.object.matrix.elements;

		// get Y column of matrix
		panOffset.set( te[ 4 ], te[ 5 ], te[ 6 ] );
		panOffset.multiplyScalar( distance );

		pan.add( panOffset );

	};

	// pass in x,y of change desired in pixel space,
	// right and down are positive
	this.pan = function ( deltaX, deltaY ) {

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			// perspective
			var position = scope.object.position;
			var offset = position.clone().sub( scope.target );
			var targetDistance = offset.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

			// we actually don't use screenWidth, since perspective camera is fixed to screen height
			scope.panLeft( 2 * deltaX * targetDistance / element.clientHeight );
			scope.panUp( 2 * deltaY * targetDistance / element.clientHeight );

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			// orthographic
			scope.panLeft( deltaX * (scope.object.right - scope.object.left) / element.clientWidth );
			scope.panUp( deltaY * (scope.object.top - scope.object.bottom) / element.clientHeight );

		} else {

			// camera neither orthographic or perspective
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );

		}

	};

	this.dollyIn = function ( dollyScale ) {

		if ( dollyScale === undefined ) {

			dollyScale = getZoomScale();

		}

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );

		}

	};

	this.dollyOut = function ( dollyScale ) {

		if ( dollyScale === undefined ) {

			dollyScale = getZoomScale();

		}

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );

		}

	};

	this.update = function () {

		var position = this.object.position;

		offset.copy( position ).sub( this.target );

		// rotate offset to "y-axis-is-up" space
		offset.applyQuaternion( quat );

		// angle from z-axis around y-axis

		theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate && state === STATE.NONE ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict theta to be between desired limits
		theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, theta ) );

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		// move target to panned location
		this.target.add( pan );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		// rotate offset back to "camera-up-vector-is-up" space
		offset.applyQuaternion( quatInverse );

		position.copy( this.target ).add( offset );

		this.object.lookAt( this.target );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;
		pan.set( 0, 0, 0 );

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if ( lastPosition.distanceToSquared( this.object.position ) > EPS
		    || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );
			lastQuaternion.copy (this.object.quaternion );

		}

	};


	this.reset = function () {

		state = STATE.NONE;

		this.target.copy( this.target0 );
		this.object.position.copy( this.position0 );
		this.object.zoom = this.zoom0;

		this.object.updateProjectionMatrix();
		this.dispatchEvent( changeEvent );

		this.update();

	};

	this.getPolarAngle = function () {

		return phi;

	};

	this.getAzimuthalAngle = function () {

		return theta

	};

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		event.preventDefault();

		if ( event.button === scope.mouseButtons.ORBIT ) {
			if ( scope.noRotate === true ) return;

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === scope.mouseButtons.ZOOM ) {
			if ( scope.noZoom === true ) return;

			state = STATE.DOLLY;

			dollyStart.set( event.clientX, event.clientY );

		} else if ( event.button === scope.mouseButtons.PAN ) {
			if ( scope.noPan === true ) return;

			state = STATE.PAN;

			panStart.set( event.clientX, event.clientY );

		}

		if ( state !== STATE.NONE ) {
			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );
			scope.dispatchEvent( startEvent );
		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( state === STATE.ROTATE ) {

			if ( scope.noRotate === true ) return;

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			// rotating across whole screen goes 360 degrees around
			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.DOLLY ) {

			if ( scope.noZoom === true ) return;

			dollyEnd.set( event.clientX, event.clientY );
			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				scope.dollyIn();

			} else if ( dollyDelta.y < 0 ) {

				scope.dollyOut();

			}

			dollyStart.copy( dollyEnd );

		} else if ( state === STATE.PAN ) {

			if ( scope.noPan === true ) return;

			panEnd.set( event.clientX, event.clientY );
			panDelta.subVectors( panEnd, panStart );

			scope.pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		if ( state !== STATE.NONE ) scope.update();

	}

	function onMouseUp( /* event */ ) {

		if ( scope.enabled === false ) return;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		scope.dispatchEvent( endEvent );
		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.noZoom === true || state !== STATE.NONE ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail !== undefined ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.dollyOut();

		} else if ( delta < 0 ) {

			scope.dollyIn();

		}

		scope.update();
		scope.dispatchEvent( startEvent );
		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.noKeys === true || scope.noPan === true ) return;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				scope.pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				scope.pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				scope.pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	}

	function touchstart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.noRotate === true ) return;

				state = STATE.TOUCH_ROTATE;

				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.noZoom === true ) return;

				state = STATE.TOUCH_DOLLY;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );
				dollyStart.set( 0, distance );
				break;

			case 3: // three-fingered touch: pan

				if ( scope.noPan === true ) return;

				state = STATE.TOUCH_PAN;

				panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) scope.dispatchEvent( startEvent );

	}

	function touchmove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.noRotate === true ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return;

				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				// rotating across whole screen goes 360 degrees around
				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
				// rotating up and down along whole screen attempts to go 360, but limited to 180
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

				rotateStart.copy( rotateEnd );

				scope.update();
				break;

			case 2: // two-fingered touch: dolly

				if ( scope.noZoom === true ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );

				dollyEnd.set( 0, distance );
				dollyDelta.subVectors( dollyEnd, dollyStart );

				if ( dollyDelta.y > 0 ) {

					scope.dollyOut();

				} else if ( dollyDelta.y < 0 ) {

					scope.dollyIn();

				}

				dollyStart.copy( dollyEnd );

				scope.update();
				break;

			case 3: // three-fingered touch: pan

				if ( scope.noPan === true ) return;
				if ( state !== STATE.TOUCH_PAN ) return;

				panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				panDelta.subVectors( panEnd, panStart );

				scope.pan( panDelta.x, panDelta.y );

				panStart.copy( panEnd );

				scope.update();
				break;

			default:

				state = STATE.NONE;

		}

	}

	function touchend( /* event */ ) {

		if ( scope.enabled === false ) return;

		scope.dispatchEvent( endEvent );
		state = STATE.NONE;

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start
	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;




//	スプライン曲線の中心処理
function SplineCurve3D(p, interpolate)
{
	var num = p.length;
	var l = [];
	var _A = [];
	var _B = [];
	var _C = [];

	for (i=0; i < num-1; i++) {
		var p0 = p[i];
		var p1 = p[i+1];
		l[i] = Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y) + (p0.z - p1.z) * (p0.z - p1.z));
	}

	_A[0] = [0, 1, 0.5];
	_B[0] = {
		x:(3 / (2 * l[0])) * (p[1].x - p[0].x),
		y:(3 / (2 * l[0])) * (p[1].y - p[0].y),
		z:(3 / (2 * l[0])) * (p[1].z - p[0].z)
	};
	_A[num-1] = [1, 2, 0];
	_B[num-1] = {
		x:(3 / l[num - 2]) * (p[num - 1].x - p[num - 2].x),
		y:(3 / l[num - 2]) * (p[num - 1].y - p[num - 2].y),
		z:(3 / l[num - 2]) * (p[num - 1].z - p[num - 2].z)
	};

	for (i=1; i < num-1; i++) {
		var a = l[i-1];
		var b = l[i];
		_A[i] = [b, 2.0 * (b + a), a];
		_B[i] = {
			x:(3.0 * (a * a * (p[i + 1].x - p[i].x)) + 3.0 * b * b * (p[i].x - p[i - 1].x)) / (b * a),
			y:(3.0 * (a * a * (p[i + 1].y - p[i].y)) + 3.0 * b * b * (p[i].y - p[i - 1].y)) / (b * a),
			z:(3.0 * (a * a * (p[i + 1].z - p[i].z)) + 3.0 * b * b * (p[i].z - p[i - 1].z)) / (b * a)
		};
	}
	for (i=1; i < num; i++) {
		var d = _A[i-1][1] / _A[i][0];

		_A[i] = [0, _A[i][1]*d-_A[i-1][2], _A[i][2]*d];
		_B[i].x = _B[i].x * d - _B[i - 1].x;
		_B[i].y = _B[i].y * d - _B[i - 1].y;
		_B[i].z = _B[i].z * d - _B[i - 1].z;

		_A[i][2] /= _A[i][1];
		_B[i].x /= _A[i][1];
		_B[i].y /= _A[i][1];
		_B[i].z /= _A[i][1];
		_A[i][1] = 1;
	}

	_C[num-1] = {x:_B[num-1].x, y:_B[num-1].y, z:_B[num-1].z};
	for (j=num-1; j > 0; j--) {
		_C[j-1] = {
			x:_B[j - 1].x-_A[j - 1][2] * _C[j].x,
			y:_B[j - 1].y-_A[j - 1][2] * _C[j].y,
			z:_B[j - 1].z-_A[j - 1][2] * _C[j].z
		};
	}

	var out = [];
	count = 0;
	for (i=0; i < num-1; i++) {
		var a = l[i];
		var _00 = p[i].x;
		var _01 = _C[i].x;
		var _02 = (p[i + 1].x - p[i].x) * 3 / (a * a) - (_C[i + 1].x + 2 * _C[i].x) / a;
		var _03 = (p[i + 1].x - p[i].x) * (-2/(a * a * a)) + (_C[i + 1].x + _C[i].x) * (1 / (a * a));

		var _10 = p[i].y;
		var _11 = _C[i].y;
		var _12 = (p[i + 1].y - p[i].y) * 3 / (a * a) - (_C[i + 1].y + 2 * _C[i].y) / a;
		var _13 = (p[i + 1].y - p[i].y) * (-2/(a * a * a)) + (_C[i + 1].y + _C[i].y) * (1 / (a * a));

		var _20 = p[i].z;
		var _21 = _C[i].z;
		var _22 = (p[i + 1].z - p[i].z) * 3 / (a * a) - (_C[i + 1].z + 2 * _C[i].z) / a;
		var _23 = (p[i + 1].z - p[i].z) * (-2/(a * a * a)) + (_C[i + 1].z + _C[i].z) * (1 / (a * a));

		var t = 0;
		for (j=0; j < interpolate; j++) {
			out[count] = {
				x:((_03 * t + _02) * t + _01) * t + _00,
				y:((_13 * t + _12) * t + _11) * t + _10,
				z:((_23 * t + _22) * t + _21) * t + _20
			};
			count++;
			t += a / interpolate;
		}
	}
	out[count] = {
		x:p[num-1].x,
		y:p[num-1].y,
		z:p[num-1].z
	};

	return out;
}


//	スプライン曲線の中心処理
function SplineCurve(p, interpolate)
{
	var num = p.length;
	var l = [];
	var _A = [];
	var _B = [];
	var _C = [];

	for (i=0; i < num-1; i++) {
		var p0 = p[i];
		var p1 = p[i+1];
		l[i] = Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y));
	}

	_A[0] = [0, 1, 0.5];
	_B[0] = {
		x:(3 / (2 * l[0])) * (p[1].x - p[0].x),
		y:(3 / (2 * l[0])) * (p[1].y - p[0].y)
	};
	_A[num-1] = [1, 2, 0];
	_B[num-1] = {
		x:(3 / l[num - 2]) * (p[num - 1].x - p[num - 2].x),
		y:(3 / l[num - 2]) * (p[num - 1].y - p[num - 2].y)
	};

	for (i=1; i < num-1; i++) {
		var a = l[i-1];
		var b = l[i];
		_A[i] = [b, 2.0 * (b + a), a];
		_B[i] = {
			x:(3.0 * (a * a * (p[i + 1].x - p[i].x)) + 3.0 * b * b * (p[i].x - p[i - 1].x)) / (b * a),
			y:(3.0 * (a * a * (p[i + 1].y - p[i].y)) + 3.0 * b * b * (p[i].y - p[i - 1].y)) / (b * a)
		};
	}
	for (i=1; i < num; i++) {
		var d = _A[i-1][1] / _A[i][0];

		_A[i] = [0, _A[i][1]*d-_A[i-1][2], _A[i][2]*d];
		_B[i].x = _B[i].x * d - _B[i - 1].x;
		_B[i].y = _B[i].y * d - _B[i - 1].y;

		_A[i][2] /= _A[i][1];
		_B[i].x /= _A[i][1];
		_B[i].y /= _A[i][1];
		_A[i][1] = 1;
	}

	_C[num-1] = {x:_B[num-1].x, y:_B[num-1].y};
	for (j=num-1; j > 0; j--) {
		_C[j-1] = {
			x:_B[j - 1].x-_A[j - 1][2] * _C[j].x,
			y:_B[j - 1].y-_A[j - 1][2] * _C[j].y
		};
	}

	var out = [];
	count = 0;
	for (i=0; i < num-1; i++) {
		var a = l[i];
		var _00 = p[i].x;
		var _01 = _C[i].x;
		var _02 = (p[i + 1].x - p[i].x) * 3 / (a * a) - (_C[i + 1].x + 2 * _C[i].x) / a;
		var _03 = (p[i + 1].x - p[i].x) * (-2/(a * a * a)) + (_C[i + 1].x + _C[i].x) * (1 / (a * a));
		var _10 = p[i].y;
		var _11 = _C[i].y;
		var _12 = (p[i + 1].y - p[i].y) * 3 / (a * a) - (_C[i + 1].y + 2 * _C[i].y) / a;
		var _13 = (p[i + 1].y - p[i].y) * (-2/(a * a * a)) + (_C[i + 1].y + _C[i].y) * (1 / (a * a));

		var t = 0;
		for (j=0; j < interpolate; j++) {
			out[count] = {
				x:((_03 * t + _02) * t + _01) * t + _00,
				y:((_13 * t + _12) * t + _11) * t + _10
			};
			count++;
			t += a / interpolate;
		}
	}
	out[count] = {
		x:p[num-1].x,
		y:p[num-1].y
	};

	return out;
}



var NullDesignCamera = (function(){

	var _targetRotation = new THREE.Vector3();
	var _targetDistance = 0;

	function NullDesignCamera( _camera, _domElement ){
		this.camera;
		this.domElement;
		this.rotation;
		this.distance;
		this.speed;
		this.focus;
		this.center;
		this.isClick;
		this.pMouse;

		this.enabled = true;
		this.target;

		this.autoRotate = true;
		this.autoRotateSpeed = 0.025;
		
		this.enableDamping = true;
		this.dampingFactor = 0.5;
		this.enableZoom = false;

		this.minDistance = 10;
		this.maxDistance = 500;

		this.minPolarAngle = Math.PI * 0.15;
		this.maxPolarAngle = Math.PI * 0.5;

		this.init( _camera, _domElement );
	}
	NullDesignCamera.prototype = {
		init : function( _camera, _domElement ){
			this.camera = _camera;
			this.domElement = _domElement;
			this.rotation = new THREE.Vector3();
			this.rotation.x = ( this.maxPolarAngle + this.maxPolarAngle + this.minPolarAngle ) / 3;
			this.rotation.y = 0;
			this.distance = 25;
			this.speed = 0.01;

			this.focus = this.camera.focus;
			this.target = this.camera.focus;
			this.center = this.camera.focus;

			this.isClick = false;
			this.pMouse = {x:0,y:0};

			_targetRotation.x = this.rotation.x;
			_targetRotation.y = this.rotation.y;
			_targetDistance = this.distance;

			var _t = this;
			this.domElement.addEventListener( 'contextmenu',	function(e){	e.preventDefault();	});
			this.domElement.addEventListener( 'mousedown',		function(e){	_t.onMouseDown(e);	}, false );
			this.domElement.addEventListener( 'mouseup',		function(e){	_t.onMouseUp(e);	}, false );
			this.domElement.addEventListener( 'mousemove',		function(e){	_t.onMouseMove(e);	}, false );
			this.domElement.addEventListener( 'mousewheel',		function(e){	_t.onMouseWheel(e);	}, false );
			this.domElement.addEventListener( 'DOMMouseScroll',	function(e){	_t.onMouseWheel(e);	}, false );
			window.addEventListener( 'mouseup',		function(e){	_t.onMouseUp(e);	}, false );

			this.update();
		},
		update : function(){

			if( this.autoRotate )
			{
				_targetRotation.y += this.autoRotateSpeed / 60;
			}

			//	easeing
			this.distance += ( _targetDistance - this.distance ) * 0.16;
			this.rotation.x += ( _targetRotation.x - this.rotation.x ) * 0.16;
			this.rotation.y += ( _targetRotation.y - this.rotation.y ) * 0.16;

			var spherical = new THREE.Spherical();
			var phi = this.rotation.x;
			var theta = this.rotation.y - 90;
			var object = new THREE.Object3D();

			spherical.set( this.distance, phi, theta );
			object.position.setFromSpherical( spherical );

			var x = object.position.x + this.target.x;
			var y = object.position.y + this.target.y;
			var z = object.position.z + this.target.z;
			this.camera.position.set( x, y, z );
			this.camera.lookAt( this.focus );
		},
		onMouseDown : function(e){
			this.pMouse.x = e.pageX;
			this.pMouse.y = e.pageY;
			this.isClick = true;
		},
		onMouseUp : function(e){
			this.isClick = false;
		},
		onMouseMove : function(e){

			if( !this.isClick )	return;

			var _x = e.pageX;
			var _y = e.pageY;
			var _dx = this.pMouse.x - _x;
			var _dy = this.pMouse.y - _y;

			_targetRotation.y += _dx * this.speed;
			_targetRotation.x += _dy * this.speed;

			if( _targetRotation.x < this.minPolarAngle )
			{
				_targetRotation.x = this.minPolarAngle;
			} else if( _targetRotation.x > this.maxPolarAngle ){
				_targetRotation.x = this.maxPolarAngle;
			}

			this.pMouse.x = _x;
			this.pMouse.y = _y;
		},
		onMouseWheel : function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			var delta = 0;
			if ( e.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9
				delta = e.wheelDelta;
			} else if ( e.detail !== undefined ) { // Firefox
				delta = - e.detail;
			}

			if ( delta > 0 ) {
				_targetDistance ++;
				_targetDistance = _targetDistance > this.maxDistance? this.maxDistance : _targetDistance;
			} else if ( delta < 0 ) {
				_targetDistance --;
				_targetDistance = _targetDistance < this.minDistance? this.minDistance : _targetDistance;
			}
		}
	}
	return NullDesignCamera;
})();



var Sky = (function(){
	function Sky( v3 ){
		this.mesh;
		this.init( v3 );
	}
	Sky.prototype = {
		init : function( v3 ){
			//var _g = new THREE.IcosahedronGeometry( 3200, 2 );
			var _g = new THREE.BoxBufferGeometry( 1, 1, 1 );
			var _vertexShader = [
				"const int NUM_DATA = 6;",
				"uniform vec3 colors[NUM_DATA];",
				"uniform float intervals[NUM_DATA];",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",
				"void main()	{",
				"	vPosition = position;",
				"	for( int i = 0; i < NUM_DATA; i++ )",
				"	{",
				"		vColors[i] = colors[i];",
				"		vIntervals[i] = intervals[i];",
				"	}",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}",
			].join( "\n" );
			var _fragmentShader = [
				"const int NUM_DATA = 6;",
				"uniform float time;",
				"uniform vec3 light;",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",

				"vec3 mod289(vec3 x) {	return x - floor(x * (1.0 / 289.0)) * 289.0;	}",
				"vec4 mod289(vec4 x) {	return x - floor(x * (1.0 / 289.0)) * 289.0;	}",
				"vec4 permute(vec4 x) {	return mod289(((x*34.0)+1.0)*x);	}",
				"vec4 taylorInvSqrt(vec4 r) {	return 1.79284291400159 - 0.85373472095314 * r;	}",
				"float snoise(vec3 v) {",
				"	const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;",
				"	const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

				"	// First corner",
				"	vec3 i  = floor(v + dot(v, C.yyy) );",
				"	vec3 x0 =   v - i + dot(i, C.xxx) ;",

				"	// Other corners",
				"	vec3 g = step(x0.yzx, x0.xyz);",
				"	vec3 l = 1.0 - g;",
				"	vec3 i1 = min( g.xyz, l.zxy );",
				"	vec3 i2 = max( g.xyz, l.zxy );",
				"	vec3 x1 = x0 - i1 + C.xxx;",
				"	vec3 x2 = x0 - i2 + C.yyy;",
				"	vec3 x3 = x0 - D.yyy;",

				"	// Permutations",
				"	i = mod289(i);",
				"	vec4 p = permute( permute( permute(",
				"	i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
				"	+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
				"	+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

				"	float n_ = 0.142857142857; // 1.0/7.0",
				"	vec3  ns = n_ * D.wyz - D.xzx;",

				"	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)",

				"	vec4 x_ = floor(j * ns.z);",
				"	vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)",

				"	vec4 x = x_ *ns.x + ns.yyyy;",
				"	vec4 y = y_ *ns.x + ns.yyyy;",
				"	vec4 h = 1.0 - abs(x) - abs(y);",

				"	vec4 b0 = vec4( x.xy, y.xy );",
				"	vec4 b1 = vec4( x.zw, y.zw );",

				"	// vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;",
				"	// vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;",
				"	vec4 s0 = floor(b0)*2.0 + 1.0;",
				"	vec4 s1 = floor(b1)*2.0 + 1.0;",
				"	vec4 sh = -step(h, vec4(0.0));",

				"	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;",
				"	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;",

				"	vec3 p0 = vec3(a0.xy,h.x);",
				"	vec3 p1 = vec3(a0.zw,h.y);",
				"	vec3 p2 = vec3(a1.xy,h.z);",
				"	vec3 p3 = vec3(a1.zw,h.w);",

				"	// Normalise gradients",
				"	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
				"	p0 *= norm.x;",
				"	p1 *= norm.y;",
				"	p2 *= norm.z;",
				"	p3 *= norm.w;",

				"	// Mix final noise value",
				"	vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
				"	m = m * m;",
				"	return 42.0 * dot(m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );",
				"}",

				"void main()	{",
				"	vec3 pos = normalize( vPosition );",
				"	pos = ( pos + 1.0 ) * 0.5;",
				"	float _p = pos.y;",

				//	"	if( _p < 0.5 )_p += snoise( pos * 20.0 + vec3(0,- time * 0.0125,0) ) * 0.0125;",

				"	float i0 = vIntervals[0];",
				"	float i1 = vIntervals[1];",
				"	float i2 = vIntervals[2];",
				"	float i3 = vIntervals[3];",
				"	float i4 = vIntervals[4];",
				"	float i5 = vIntervals[5];",

				"	vec4 _c0 = vec4( vColors[0] / 255.0, 1.0 );",
				"	vec4 _c1 = vec4( vColors[1] / 255.0, 1.0 );",
				"	vec4 _c2 = vec4( vColors[2] / 255.0, 1.0 );",
				"	vec4 _c3 = vec4( vColors[3] / 255.0, 1.0 );",
				"	vec4 _c4 = vec4( vColors[4] / 255.0, 1.0 );",
				"	vec4 _c5 = vec4( vColors[5] / 255.0, 1.0 );",

				"	if( _p < i1 ){",
				"		_c0 *= 1.0 - ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c1 *= ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i2 && _p > i1 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 1.0 - ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c2 *= ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i3 && _p > i2 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 1.0 - ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c3 *= ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i4 && _p > i3 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 1.0 - ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c4 *= ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c5 *= 0.0;",
				"	} else {",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 1.0 - ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"		_c5 *= ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"	}",
				"	vec4 color = _c0 + _c1 + _c2 + _c3 + _c4 + _c5;",

				//	THE SUN
				"	float _d = distance( normalize( light ), normalize( vPosition ) )*100.0;",
				"	color += vec4( 1.0,1.0,1.0,0.1) * 3.0/_d;",

				"	gl_FragColor = color;",
				"}",
			].join( "\n" );
			var _m = new THREE.ShaderMaterial({
				uniforms: {
					"time": { value: 0.0},
					"light": { value: v3},
					"colors" : {	type: "v4v", 
									value: [
										new THREE.Color(0,0,0),
										new THREE.Color(51,51,51),
										// new THREE.Color(0,90,117),
										new THREE.Color(255,255,255),
										new THREE.Color(255,255,255),
										new THREE.Color(92,169,199),
										new THREE.Color(86,183,226)
									]},
					"intervals": {
						value: [
							0.0,
							0.48,
							0.49,
							0.5,
							0.65,
							1.0
						]
					}
				},
				vertexShader: _vertexShader,
				fragmentShader: _fragmentShader,
				transparent: true,
				//blending: THREE.MultiplyBlending,
				side: THREE.BackSide
			});

			this.mesh = new THREE.Mesh( _g, _m );
		}
	};
	return Sky;
})();
