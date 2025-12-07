/*
	libs.js
*/

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



/**
 * @author Kyle-Larson https://github.com/Kyle-Larson
 * @author Takahiro https://github.com/takahirox
 * @author Lewy Blue https://github.com/looeee
 *
 * Loader loads FBX file and generates Group representing FBX scene.
 * Requires FBX file to be >= 7.0 and in ASCII or >= 6400 in Binary format
 * Versions lower than this may load but will probably have errors
 *
 * Needs Support:
 *  Morph normals / blend shape normals
 *  Animation tracks for morph targets
 *
 *	Euler rotation order
 *
 * FBX format references:
 * 	https://wiki.blender.org/index.php/User:Mont29/Foundation/FBX_File_Structure
 * 	http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_index_html (C++ SDK reference)
 *
 * 	Binary format specification:
 *		https://code.blender.org/2013/08/fbx-binary-file-format-specification/
 */


( function () {

	THREE.FBXLoader = function ( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	};

	Object.assign( THREE.FBXLoader.prototype, {

		load: function ( url, onLoad, onProgress, onError ) {

			var self = this;

			var resourceDirectory = THREE.LoaderUtils.extractUrlBase( url );

			var loader = new THREE.FileLoader( this.manager );
			loader.setResponseType( 'arraybuffer' );
			loader.load( url, function ( buffer ) {

				try {

					var scene = self.parse( buffer, resourceDirectory );
					onLoad( scene );

				} catch ( error ) {

					window.setTimeout( function () {

						if ( onError ) onError( error );

						self.manager.itemError( url );

					}, 0 );

				}

			}, onProgress, onError );

		},

		parse: function ( FBXBuffer, resourceDirectory ) {

			var FBXTree;

			if ( isFbxFormatBinary( FBXBuffer ) ) {

				FBXTree = new BinaryParser().parse( FBXBuffer );

			} else {

				var FBXText = convertArrayBufferToString( FBXBuffer );

				if ( ! isFbxFormatASCII( FBXText ) ) {

					throw new Error( 'THREE.FBXLoader: Unknown format.' );

				}

				if ( getFbxVersion( FBXText ) < 7000 ) {

					throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

				}

				FBXTree = new TextParser().parse( FBXText );

			}

			// console.log( FBXTree );

			var connections = parseConnections( FBXTree );
			var images = parseImages( FBXTree );
			var textures = parseTextures( FBXTree, new THREE.TextureLoader( this.manager ).setPath( resourceDirectory ), images, connections );
			var materials = parseMaterials( FBXTree, textures, connections );
			var deformers = parseDeformers( FBXTree, connections );
			var geometryMap = parseGeometries( FBXTree, connections, deformers );
			var sceneGraph = parseScene( FBXTree, connections, deformers.skeletons, geometryMap, materials );

			return sceneGraph;

		}

	} );

	// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
	// and details the connection type
	function parseConnections( FBXTree ) {

		var connectionMap = new Map();

		if ( 'Connections' in FBXTree ) {

			var rawConnections = FBXTree.Connections.connections;

			rawConnections.forEach( function ( rawConnection ) {

				var fromID = rawConnection[ 0 ];
				var toID = rawConnection[ 1 ];
				var relationship = rawConnection[ 2 ];

				if ( ! connectionMap.has( fromID ) ) {

					connectionMap.set( fromID, {
						parents: [],
						children: []
					} );

				}

				var parentRelationship = { ID: toID, relationship: relationship };
				connectionMap.get( fromID ).parents.push( parentRelationship );

				if ( ! connectionMap.has( toID ) ) {

					connectionMap.set( toID, {
						parents: [],
						children: []
					} );

				}

				var childRelationship = { ID: fromID, relationship: relationship };
				connectionMap.get( toID ).children.push( childRelationship );

			} );

		}

		return connectionMap;

	}

	// Parse FBXTree.Objects.Video for embedded image data
	// These images are connected to textures in FBXTree.Objects.Textures
	// via FBXTree.Connections.
	function parseImages( FBXTree ) {

		var images = {};
		var blobs = {};

		if ( 'Video' in FBXTree.Objects ) {

			var videoNodes = FBXTree.Objects.Video;

			for ( var nodeID in videoNodes ) {

				var videoNode = videoNodes[ nodeID ];

				var id = parseInt( nodeID );

				images[ id ] = videoNode.RelativeFilename || videoNode.Filename;

				// raw image data is in videoNode.Content
				if ( 'Content' in videoNode ) {

					var arrayBufferContent = ( videoNode.Content instanceof ArrayBuffer ) && ( videoNode.Content.byteLength > 0 );
					var base64Content = ( typeof videoNode.Content === 'string' ) && ( videoNode.Content !== '' );

					if ( arrayBufferContent || base64Content ) {

						var image = parseImage( videoNodes[ nodeID ] );

						blobs[ videoNode.RelativeFilename || videoNode.Filename ] = image;

					}

				}

			}

		}

		for ( var id in images ) {

			var filename = images[ id ];

			if ( blobs[ filename ] !== undefined ) images[ id ] = blobs[ filename ];
			else images[ id ] = images[ id ].split( '\\' ).pop();

		}

		return images;

	}

	// Parse embedded image data in FBXTree.Video.Content
	function parseImage( videoNode ) {

		var content = videoNode.Content;
		var fileName = videoNode.RelativeFilename || videoNode.Filename;
		var extension = fileName.slice( fileName.lastIndexOf( '.' ) + 1 ).toLowerCase();

		var type;

		switch ( extension ) {

			case 'bmp':

				type = 'image/bmp';
				break;

			case 'jpg':
			case 'jpeg':

				type = 'image/jpeg';
				break;

			case 'png':

				type = 'image/png';
				break;

			case 'tif':

				type = 'image/tiff';
				break;

 			case 'tga':

				if ( typeof THREE.TGALoader !== 'function' ) {

					console.warn( 'FBXLoader: THREE.TGALoader is required to load TGA textures' );
					return;

				} else {

					if ( THREE.Loader.Handlers.get( '.tga' ) === null ) {

						THREE.Loader.Handlers.add( /\.tga$/i, new THREE.TGALoader() );

					}

					type = 'image/tga';
					break;

				}

			default:

				console.warn( 'FBXLoader: Image type "' + extension + '" is not supported.' );
				return;

		}

		if ( typeof content === 'string' ) { // ASCII format

			return 'data:' + type + ';base64,' + content;

		} else { // Binary Format

			var array = new Uint8Array( content );
			return window.URL.createObjectURL( new Blob( [ array ], { type: type } ) );

		}

	}

	// Parse nodes in FBXTree.Objects.Texture
	// These contain details such as UV scaling, cropping, rotation etc and are connected
	// to images in FBXTree.Objects.Video
	function parseTextures( FBXTree, loader, images, connections ) {

		var textureMap = new Map();

		if ( 'Texture' in FBXTree.Objects ) {

			var textureNodes = FBXTree.Objects.Texture;
			for ( var nodeID in textureNodes ) {

				var texture = parseTexture( textureNodes[ nodeID ], loader, images, connections );
				textureMap.set( parseInt( nodeID ), texture );

			}

		}

		return textureMap;

	}

	// Parse individual node in FBXTree.Objects.Texture
	function parseTexture( textureNode, loader, images, connections ) {

		var texture = loadTexture( textureNode, loader, images, connections );

		texture.ID = textureNode.id;

		texture.name = textureNode.attrName;

		var wrapModeU = textureNode.WrapModeU;
		var wrapModeV = textureNode.WrapModeV;

		var valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
		var valueV = wrapModeV !== undefined ? wrapModeV.value : 0;

		// http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
		// 0: repeat(default), 1: clamp

		texture.wrapS = valueU === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
		texture.wrapT = valueV === 0 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

		if ( 'Scaling' in textureNode ) {

			var values = textureNode.Scaling.value;

			texture.repeat.x = values[ 0 ];
			texture.repeat.y = values[ 1 ];

		}

		return texture;

	}

	// load a texture specified as a blob or data URI, or via an external URL using THREE.TextureLoader
	function loadTexture( textureNode, loader, images, connections ) {

		var fileName;

		var currentPath = loader.path;

		var children = connections.get( textureNode.id ).children;

		if ( children !== undefined && children.length > 0 && images[ children[ 0 ].ID ] !== undefined ) {

			fileName = images[ children[ 0 ].ID ];

			if ( fileName.indexOf( 'blob:' ) === 0 || fileName.indexOf( 'data:' ) === 0 ) {

				loader.setPath( undefined );

			}

		}

		var texture;

		if ( textureNode.FileName.slice( -3 ).toLowerCase() === 'tga' ) {

 			texture = THREE.Loader.Handlers.get( '.tga' ).load( fileName );

 		} else {

 			texture = loader.load( fileName );

 		}

		loader.setPath( currentPath );

		return texture;

	}

	// Parse nodes in FBXTree.Objects.Material
	function parseMaterials( FBXTree, textureMap, connections ) {

		var materialMap = new Map();

		if ( 'Material' in FBXTree.Objects ) {

			var materialNodes = FBXTree.Objects.Material;

			for ( var nodeID in materialNodes ) {

				var material = parseMaterial( FBXTree, materialNodes[ nodeID ], textureMap, connections );

				if ( material !== null ) materialMap.set( parseInt( nodeID ), material );

			}

		}

		return materialMap;

	}

	// Parse single node in FBXTree.Objects.Material
	// Materials are connected to texture maps in FBXTree.Objects.Textures
	// FBX format currently only supports Lambert and Phong shading models
	function parseMaterial( FBXTree, materialNode, textureMap, connections ) {

		var ID = materialNode.id;
		var name = materialNode.attrName;
		var type = materialNode.ShadingModel;

		//Case where FBX wraps shading model in property object.
		if ( typeof type === 'object' ) {

			type = type.value;

		}

		// Ignore unused materials which don't have any connections.
		if ( ! connections.has( ID ) ) return null;

		var parameters = parseParameters( FBXTree, materialNode, textureMap, ID, connections );

		var material;

		switch ( type.toLowerCase() ) {

			case 'phong':
				material = new THREE.MeshPhongMaterial();
				break;
			case 'lambert':
				material = new THREE.MeshLambertMaterial();
				break;
			default:
				console.warn( 'THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type );
				material = new THREE.MeshPhongMaterial( { color: 0x3300ff } );
				break;

		}

		material.setValues( parameters );
		material.name = name;

		return material;

	}

	// Parse FBX material and return parameters suitable for a three.js material
	// Also parse the texture map and return any textures associated with the material
	function parseParameters( FBXTree, properties, textureMap, ID, connections ) {

		var parameters = {};

		if ( properties.BumpFactor ) {

			parameters.bumpScale = properties.BumpFactor.value;

		}
		if ( properties.Diffuse ) {

			parameters.color = new THREE.Color().fromArray( properties.Diffuse.value );

		} else if ( properties.DiffuseColor && properties.DiffuseColor.type === 'Color' ) {

			// The blender exporter exports diffuse here instead of in properties.Diffuse
			parameters.color = new THREE.Color().fromArray( properties.DiffuseColor.value );

		}
		if ( properties.DisplacementFactor ) {

			parameters.displacementScale = properties.DisplacementFactor.value;

		}
		if ( properties.Emissive ) {

			parameters.emissive = new THREE.Color().fromArray( properties.Emissive.value );

		} else if ( properties.EmissiveColor && properties.EmissiveColor.type === 'Color' ) {

			// The blender exporter exports emissive color here instead of in properties.Emissive
			parameters.emissive = new THREE.Color().fromArray( properties.EmissiveColor.value );

		}
		if ( properties.EmissiveFactor ) {

			parameters.emissiveIntensity = parseFloat( properties.EmissiveFactor.value );

		}
		if ( properties.Opacity ) {

			parameters.opacity = parseFloat( properties.Opacity.value );

		}
		if ( parameters.opacity < 1.0 ) {

			parameters.transparent = true;

		}
		if ( properties.ReflectionFactor ) {

			parameters.reflectivity = properties.ReflectionFactor.value;

		}
		if ( properties.Shininess ) {

			parameters.shininess = properties.Shininess.value;

		}
		if ( properties.Specular ) {

			parameters.specular = new THREE.Color().fromArray( properties.Specular.value );

		} else if ( properties.SpecularColor && properties.SpecularColor.type === 'Color' ) {

			// The blender exporter exports specular color here instead of in properties.Specular
			parameters.specular = new THREE.Color().fromArray( properties.SpecularColor.value );

		}

		connections.get( ID ).children.forEach( function ( child ) {

			var type = child.relationship;

			switch ( type ) {

				case 'Bump':
					parameters.bumpMap = textureMap.get( child.ID );
					break;

				case 'DiffuseColor':
					parameters.map = getTexture( FBXTree, textureMap, child.ID, connections );
					break;

				case 'DisplacementColor':
					parameters.displacementMap = getTexture( FBXTree, textureMap, child.ID, connections );
					break;


				case 'EmissiveColor':
					parameters.emissiveMap = getTexture( FBXTree, textureMap, child.ID, connections );
					break;

				case 'NormalMap':
					parameters.normalMap = getTexture( FBXTree, textureMap, child.ID, connections );
					break;

				case 'ReflectionColor':
					parameters.envMap = getTexture( FBXTree, textureMap, child.ID, connections );
					parameters.envMap.mapping = THREE.EquirectangularReflectionMapping;
					break;

				case 'SpecularColor':
					parameters.specularMap = getTexture( FBXTree, textureMap, child.ID, connections );
					break;

				case 'TransparentColor':
					parameters.alphaMap = getTexture( FBXTree, textureMap, child.ID, connections );
					parameters.transparent = true;
					break;

				case 'AmbientColor':
				case 'ShininessExponent': // AKA glossiness map
				case 'SpecularFactor': // AKA specularLevel
				case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor
				default:
					console.warn( 'THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type );
					break;

			}

		} );

		return parameters;

	}

	// get a texture from the textureMap for use by a material.
	function getTexture( FBXTree, textureMap, id, connections ) {

		// if the texture is a layered texture, just use the first layer and issue a warning
		if ( 'LayeredTexture' in FBXTree.Objects && id in FBXTree.Objects.LayeredTexture ) {

			console.warn( 'THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.' );
			id = connections.get( id ).children[ 0 ].ID;

		}

		return textureMap.get( id );

	}

	// Parse nodes in FBXTree.Objects.Deformer
	// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
	// Generates map of Skeleton-like objects for use later when generating and binding skeletons.
	function parseDeformers( FBXTree, connections ) {

		var skeletons = {};
		var morphTargets = {};

		if ( 'Deformer' in FBXTree.Objects ) {

			var DeformerNodes = FBXTree.Objects.Deformer;

			for ( var nodeID in DeformerNodes ) {

				var deformerNode = DeformerNodes[ nodeID ];

				var relationships = connections.get( parseInt( nodeID ) );

				if ( deformerNode.attrType === 'Skin' ) {

					var skeleton = parseSkeleton( relationships, DeformerNodes );
					skeleton.ID = nodeID;

					if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: skeleton attached to more than one geometry is not supported.' );
					skeleton.geometryID = relationships.parents[ 0 ].ID;

					skeletons[ nodeID ] = skeleton;

				} else if ( deformerNode.attrType === 'BlendShape' ) {

					var morphTarget = {
						id: nodeID,
					};

					morphTarget.rawTargets = parseMorphTargets( relationships, deformerNode, DeformerNodes, connections, FBXTree );
					morphTarget.id = nodeID;

					if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: morph target attached to more than one geometry is not supported.' );
					morphTarget.parentGeoID = relationships.parents[ 0 ].ID;

					morphTargets[ nodeID ] = morphTarget;

				}

			}

		}

		return {

			skeletons: skeletons,
			morphTargets: morphTargets,

		};

	}

	// Parse single nodes in FBXTree.Objects.Deformer
	// The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
	// Each skin node represents a skeleton and each cluster node represents a bone
	function parseSkeleton( connections, deformerNodes ) {

		var rawBones = [];

		connections.children.forEach( function ( child ) {

			var boneNode = deformerNodes[ child.ID ];

			if ( boneNode.attrType !== 'Cluster' ) return;

			var rawBone = {

				ID: child.ID,
				indices: [],
				weights: [],
				transform: new THREE.Matrix4().fromArray( boneNode.Transform.a ),
				transformLink: new THREE.Matrix4().fromArray( boneNode.TransformLink.a ),
				linkMode: boneNode.Mode,

			};

			if ( 'Indexes' in boneNode ) {

				rawBone.indices = boneNode.Indexes.a;
				rawBone.weights = boneNode.Weights.a;

			}

			rawBones.push( rawBone );

		} );

		return {

			rawBones: rawBones,
			bones: []

		};

	}

	// The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
	function parseMorphTargets( relationships, deformerNode, deformerNodes, connections ) {

		var rawMorphTargets = [];

		for ( var i = 0; i < relationships.children.length; i ++ ) {

			if ( i === 8 ) {

				console.warn( 'FBXLoader: maximum of 8 morph targets supported. Ignoring additional targets.' );

				break;

			}

			var child = relationships.children[ i ];

			var morphTargetNode = deformerNodes[ child.ID ];

			var rawMorphTarget = {

				name: morphTargetNode.attrName,
				initialWeight: morphTargetNode.DeformPercent,
				id: morphTargetNode.id,
				fullWeights: morphTargetNode.FullWeights.a

			};

			if ( morphTargetNode.attrType !== 'BlendShapeChannel' ) return;

			var targetRelationships = connections.get( parseInt( child.ID ) );

			targetRelationships.children.forEach( function ( child ) {

				if ( child.relationship === 'DeformPercent' ) {

					// TODO: animation of morph targets is currently unsupported
					rawMorphTarget.weightCurveID = child.ID;
					// weightCurve = FBXTree.Objects.AnimationCurveNode[ weightCurveID ];

				} else {

					rawMorphTarget.geoID = child.ID;
					// morphGeo = FBXTree.Objects.Geometry[ geoID ];

				}

			} );

			rawMorphTargets.push( rawMorphTarget );

		}

		return rawMorphTargets;

	}

	// Parse nodes in FBXTree.Objects.Geometry
	function parseGeometries( FBXTree, connections, deformers ) {

		var geometryMap = new Map();

		if ( 'Geometry' in FBXTree.Objects ) {

			var geoNodes = FBXTree.Objects.Geometry;

			for ( var nodeID in geoNodes ) {

				var relationships = connections.get( parseInt( nodeID ) );
				var geo = parseGeometry( FBXTree, relationships, geoNodes[ nodeID ], deformers );

				geometryMap.set( parseInt( nodeID ), geo );

			}

		}

		return geometryMap;

	}

	// Parse single node in FBXTree.Objects.Geometry
	function parseGeometry( FBXTree, relationships, geoNode, deformers ) {

		switch ( geoNode.attrType ) {

			case 'Mesh':
				return parseMeshGeometry( FBXTree, relationships, geoNode, deformers );
				break;

			case 'NurbsCurve':
				return parseNurbsGeometry( geoNode );
				break;

		}

	}

	// Parse single node mesh geometry in FBXTree.Objects.Geometry
	function parseMeshGeometry( FBXTree, relationships, geoNode, deformers ) {

		var skeletons = deformers.skeletons;
		var morphTargets = deformers.morphTargets;

		var modelNodes = relationships.parents.map( function ( parent ) {

			return FBXTree.Objects.Model[ parent.ID ];

		} );

		// don't create geometry if it is not associated with any models
		if ( modelNodes.length === 0 ) return;

		var skeleton = relationships.children.reduce( function ( skeleton, child ) {

			if ( skeletons[ child.ID ] !== undefined ) skeleton = skeletons[ child.ID ];

			return skeleton;

		}, null );

		var morphTarget = relationships.children.reduce( function ( morphTarget, child ) {

			if ( morphTargets[ child.ID ] !== undefined ) morphTarget = morphTargets[ child.ID ];

			return morphTarget;

		}, null );

		var preTransform = new THREE.Matrix4();

		// TODO: if there is more than one model associated with the geometry, AND the models have
		// different geometric transforms, then this will cause problems
		// if ( modelNodes.length > 1 ) { }

		// For now just assume one model and get the preRotations from that
		var modelNode = modelNodes[ 0 ];

		if ( 'GeometricRotation' in modelNode ) {

			var array = modelNode.GeometricRotation.value.map( THREE.Math.degToRad );
			array[ 3 ] = 'ZYX';

			preTransform.makeRotationFromEuler( new THREE.Euler().fromArray( array ) );

		}

		if ( 'GeometricTranslation' in modelNode ) {

			preTransform.setPosition( new THREE.Vector3().fromArray( modelNode.GeometricTranslation.value ) );

		}

		if ( 'GeometricScaling' in modelNode ) {

			preTransform.scale( new THREE.Vector3().fromArray( modelNode.GeometricScaling.value ) );

		}

		return genGeometry( FBXTree, geoNode, skeleton, morphTarget, preTransform );

	}

	// Generate a THREE.BufferGeometry from a node in FBXTree.Objects.Geometry
	function genGeometry( FBXTree, geoNode, skeleton, morphTarget, preTransform ) {

		var geo = new THREE.BufferGeometry();
		if ( geoNode.attrName ) geo.name = geoNode.attrName;

		var geoInfo = getGeoInfo( geoNode, skeleton );

		var buffers = genBuffers( geoInfo );

		var positionAttribute = new THREE.Float32BufferAttribute( buffers.vertex, 3 );

		preTransform.applyToBufferAttribute( positionAttribute );

		geo.addAttribute( 'position', positionAttribute );

		if ( buffers.colors.length > 0 ) {

			geo.addAttribute( 'color', new THREE.Float32BufferAttribute( buffers.colors, 3 ) );

		}

		if ( skeleton ) {

			geo.addAttribute( 'skinIndex', new THREE.Uint16BufferAttribute( buffers.weightsIndices, 4 ) );

			geo.addAttribute( 'skinWeight', new THREE.Float32BufferAttribute( buffers.vertexWeights, 4 ) );

			// used later to bind the skeleton to the model
			geo.FBX_Deformer = skeleton;

		}

		if ( buffers.normal.length > 0 ) {

			var normalAttribute = new THREE.Float32BufferAttribute( buffers.normal, 3 );

			var normalMatrix = new THREE.Matrix3().getNormalMatrix( preTransform );
			normalMatrix.applyToBufferAttribute( normalAttribute );

			geo.addAttribute( 'normal', normalAttribute );

		}

		buffers.uvs.forEach( function ( uvBuffer, i ) {

			// subsequent uv buffers are called 'uv1', 'uv2', ...
			var name = 'uv' + ( i + 1 ).toString();

			// the first uv buffer is just called 'uv'
			if ( i === 0 ) {

				name = 'uv';

			}

			geo.addAttribute( name, new THREE.Float32BufferAttribute( buffers.uvs[ i ], 2 ) );

		} );

		if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

			// Convert the material indices of each vertex into rendering groups on the geometry.
			var prevMaterialIndex = buffers.materialIndex[ 0 ];
			var startIndex = 0;

			buffers.materialIndex.forEach( function ( currentIndex, i ) {

				if ( currentIndex !== prevMaterialIndex ) {

					geo.addGroup( startIndex, i - startIndex, prevMaterialIndex );

					prevMaterialIndex = currentIndex;
					startIndex = i;

				}

			} );

			// the loop above doesn't add the last group, do that here.
			if ( geo.groups.length > 0 ) {

				var lastGroup = geo.groups[ geo.groups.length - 1 ];
				var lastIndex = lastGroup.start + lastGroup.count;

				if ( lastIndex !== buffers.materialIndex.length ) {

					geo.addGroup( lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex );

				}

			}

			// case where there are multiple materials but the whole geometry is only
			// using one of them
			if ( geo.groups.length === 0 ) {

				geo.addGroup( 0, buffers.materialIndex.length, buffers.materialIndex[ 0 ] );

			}

		}

		addMorphTargets( FBXTree, geo, geoNode, morphTarget, preTransform );

		return geo;

	}

	function getGeoInfo( geoNode, skeleton ) {

		var geoInfo = {};

		geoInfo.vertexPositions = ( geoNode.Vertices !== undefined ) ? geoNode.Vertices.a : [];
		geoInfo.vertexIndices = ( geoNode.PolygonVertexIndex !== undefined ) ? geoNode.PolygonVertexIndex.a : [];

		if ( geoNode.LayerElementColor ) {

			geoInfo.color = getColors( geoNode.LayerElementColor[ 0 ] );

		}

		if ( geoNode.LayerElementMaterial ) {

			geoInfo.material = getMaterials( geoNode.LayerElementMaterial[ 0 ] );

		}

		if ( geoNode.LayerElementNormal ) {

			geoInfo.normal = getNormals( geoNode.LayerElementNormal[ 0 ] );

		}

		if ( geoNode.LayerElementUV ) {

			geoInfo.uv = [];

			var i = 0;
			while ( geoNode.LayerElementUV[ i ] ) {

				geoInfo.uv.push( getUVs( geoNode.LayerElementUV[ i ] ) );
				i ++;

			}

		}

		geoInfo.weightTable = {};

		if ( skeleton !== null ) {

			geoInfo.skeleton = skeleton;

			skeleton.rawBones.forEach( function ( rawBone, i ) {

				// loop over the bone's vertex indices and weights
				rawBone.indices.forEach( function ( index, j ) {

					if ( geoInfo.weightTable[ index ] === undefined ) geoInfo.weightTable[ index ] = [];

					geoInfo.weightTable[ index ].push( {

						id: i,
						weight: rawBone.weights[ j ],

					} );

				} );

			} );

		}

		return geoInfo;

	}

	function genBuffers( geoInfo ) {

		var buffers = {
			vertex: [],
			normal: [],
			colors: [],
			uvs: [],
			materialIndex: [],
			vertexWeights: [],
			weightsIndices: [],
		};

		var polygonIndex = 0;
		var faceLength = 0;
		var displayedWeightsWarning = false;

		// these will hold data for a single face
		var facePositionIndexes = [];
		var faceNormals = [];
		var faceColors = [];
		var faceUVs = [];
		var faceWeights = [];
		var faceWeightIndices = [];

		geoInfo.vertexIndices.forEach( function ( vertexIndex, polygonVertexIndex ) {

			var endOfFace = false;

			// Face index and vertex index arrays are combined in a single array
			// A cube with quad faces looks like this:
			// PolygonVertexIndex: *24 {
			//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
			//  }
			// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
			// to find index of last vertex bit shift the index: ^ - 1
			if ( vertexIndex < 0 ) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;

			}

			var weightIndices = [];
			var weights = [];

			facePositionIndexes.push( vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2 );

			if ( geoInfo.color ) {

				var data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );

				faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.skeleton ) {

				if ( geoInfo.weightTable[ vertexIndex ] !== undefined ) {

					geoInfo.weightTable[ vertexIndex ].forEach( function ( wt ) {

						weights.push( wt.weight );
						weightIndices.push( wt.id );

					} );


				}

				if ( weights.length > 4 ) {

					if ( ! displayedWeightsWarning ) {

						console.warn( 'THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.' );
						displayedWeightsWarning = true;

					}

					var wIndex = [ 0, 0, 0, 0 ];
					var Weight = [ 0, 0, 0, 0 ];

					weights.forEach( function ( weight, weightIndex ) {

						var currentWeight = weight;
						var currentIndex = weightIndices[ weightIndex ];

						Weight.forEach( function ( comparedWeight, comparedWeightIndex, comparedWeightArray ) {

							if ( currentWeight > comparedWeight ) {

								comparedWeightArray[ comparedWeightIndex ] = currentWeight;
								currentWeight = comparedWeight;

								var tmp = wIndex[ comparedWeightIndex ];
								wIndex[ comparedWeightIndex ] = currentIndex;
								currentIndex = tmp;

							}

						} );

					} );

					weightIndices = wIndex;
					weights = Weight;

				}

				// if the weight array is shorter than 4 pad with 0s
				while ( weights.length < 4 ) {

					weights.push( 0 );
					weightIndices.push( 0 );

				}

				for ( var i = 0; i < 4; ++ i ) {

					faceWeights.push( weights[ i ] );
					faceWeightIndices.push( weightIndices[ i ] );

				}

			}

			if ( geoInfo.normal ) {

				var data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal );

				faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				var materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material )[ 0 ];

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv, i ) {

					var data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

					if ( faceUVs[ i ] === undefined ) {

						faceUVs[ i ] = [];

					}

					faceUVs[ i ].push( data[ 0 ] );
					faceUVs[ i ].push( data[ 1 ] );

				} );

			}

			faceLength ++;

			if ( endOfFace ) {

				genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );

				polygonIndex ++;
				faceLength = 0;

				// reset arrays for the next face
				facePositionIndexes = [];
				faceNormals = [];
				faceColors = [];
				faceUVs = [];
				faceWeights = [];
				faceWeightIndices = [];

			}

		} );

		return buffers;

	}

	// Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
	function genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength ) {

		for ( var i = 2; i < faceLength; i ++ ) {

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 0 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 2 ] ] );

			if ( geoInfo.skeleton ) {

				buffers.vertexWeights.push( faceWeights[ 0 ] );
				buffers.vertexWeights.push( faceWeights[ 1 ] );
				buffers.vertexWeights.push( faceWeights[ 2 ] );
				buffers.vertexWeights.push( faceWeights[ 3 ] );

				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 1 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 2 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 3 ] );

				buffers.vertexWeights.push( faceWeights[ i * 4 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 1 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 2 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ 0 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ i * 4 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 3 ] );

			}

			if ( geoInfo.color ) {

				buffers.colors.push( faceColors[ 0 ] );
				buffers.colors.push( faceColors[ 1 ] );
				buffers.colors.push( faceColors[ 2 ] );

				buffers.colors.push( faceColors[ ( i - 1 ) * 3 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );

				buffers.colors.push( faceColors[ i * 3 ] );
				buffers.colors.push( faceColors[ i * 3 + 1 ] );
				buffers.colors.push( faceColors[ i * 3 + 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );

			}

			if ( geoInfo.normal ) {

				buffers.normal.push( faceNormals[ 0 ] );
				buffers.normal.push( faceNormals[ 1 ] );
				buffers.normal.push( faceNormals[ 2 ] );

				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 1 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 2 ] );

				buffers.normal.push( faceNormals[ i * 3 ] );
				buffers.normal.push( faceNormals[ i * 3 + 1 ] );
				buffers.normal.push( faceNormals[ i * 3 + 2 ] );

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv, j ) {

					if ( buffers.uvs[ j ] === undefined ) buffers.uvs[ j ] = [];

					buffers.uvs[ j ].push( faceUVs[ j ][ 0 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 + 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 + 1 ] );

				} );

			}

		}

	}

	function addMorphTargets( FBXTree, parentGeo, parentGeoNode, morphTarget, preTransform ) {

		if ( morphTarget === null ) return;

		parentGeo.morphAttributes.position = [];
		parentGeo.morphAttributes.normal = [];

		morphTarget.rawTargets.forEach( function ( rawTarget ) {

			var morphGeoNode = FBXTree.Objects.Geometry[ rawTarget.geoID ];

			if ( morphGeoNode !== undefined ) {

				genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform );

			}

		} );

	}

	// a morph geometry node is similar to a standard  node, and the node is also contained
	// in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
	// and a special attribute Index defining which vertices of the original geometry are affected
	// Normal and position attributes only have data for the vertices that are affected by the morph
	function genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform ) {

		var morphGeo = new THREE.BufferGeometry();
		if ( morphGeoNode.attrName ) morphGeo.name = morphGeoNode.attrName;

		var vertexIndices = ( parentGeoNode.PolygonVertexIndex !== undefined ) ? parentGeoNode.PolygonVertexIndex.a : [];

		// make a copy of the parent's vertex positions
		var vertexPositions = ( parentGeoNode.Vertices !== undefined ) ? parentGeoNode.Vertices.a.slice() : [];

		var morphPositions = ( morphGeoNode.Vertices !== undefined ) ? morphGeoNode.Vertices.a : [];
		var indices = ( morphGeoNode.Indexes !== undefined ) ? morphGeoNode.Indexes.a : [];

		for ( var i = 0; i < indices.length; i ++ ) {

			var morphIndex = indices[ i ] * 3;

			// FBX format uses blend shapes rather than morph targets. This can be converted
			// by additively combining the blend shape positions with the original geometry's positions
			vertexPositions[ morphIndex ] += morphPositions[ i * 3 ];
			vertexPositions[ morphIndex + 1 ] += morphPositions[ i * 3 + 1 ];
			vertexPositions[ morphIndex + 2 ] += morphPositions[ i * 3 + 2 ];

		}

		// TODO: add morph normal support
		var morphGeoInfo = {
			vertexIndices: vertexIndices,
			vertexPositions: vertexPositions,
		};

		var morphBuffers = genBuffers( morphGeoInfo );

		var positionAttribute = new THREE.Float32BufferAttribute( morphBuffers.vertex, 3 );
		positionAttribute.name = morphGeoNode.attrName;

		preTransform.applyToBufferAttribute( positionAttribute );

		parentGeo.morphAttributes.position.push( positionAttribute );

	}

	// Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
	function getNormals( NormalNode ) {

		var mappingType = NormalNode.MappingInformationType;
		var referenceType = NormalNode.ReferenceInformationType;
		var buffer = NormalNode.Normals.a;
		var indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			if ( 'NormalIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalIndex.a;

			} else if ( 'NormalsIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalsIndex.a;

			}

		}

		return {
			dataSize: 3,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
	function getUVs( UVNode ) {

		var mappingType = UVNode.MappingInformationType;
		var referenceType = UVNode.ReferenceInformationType;
		var buffer = UVNode.UV.a;
		var indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = UVNode.UVIndex.a;

		}

		return {
			dataSize: 2,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
	function getColors( ColorNode ) {

		var mappingType = ColorNode.MappingInformationType;
		var referenceType = ColorNode.ReferenceInformationType;
		var buffer = ColorNode.Colors.a;
		var indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = ColorNode.ColorIndex.a;

		}

		return {
			dataSize: 4,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
	function getMaterials( MaterialNode ) {

		var mappingType = MaterialNode.MappingInformationType;
		var referenceType = MaterialNode.ReferenceInformationType;

		if ( mappingType === 'NoMappingInformation' ) {

			return {
				dataSize: 1,
				buffer: [ 0 ],
				indices: [ 0 ],
				mappingType: 'AllSame',
				referenceType: referenceType
			};

		}

		var materialIndexBuffer = MaterialNode.Materials.a;

		// Since materials are stored as indices, there's a bit of a mismatch between FBX and what
		// we expect.So we create an intermediate buffer that points to the index in the buffer,
		// for conforming with the other functions we've written for other data.
		var materialIndices = [];

		for ( var i = 0; i < materialIndexBuffer.length; ++ i ) {

			materialIndices.push( i );

		}

		return {
			dataSize: 1,
			buffer: materialIndexBuffer,
			indices: materialIndices,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	var dataArray = [];

	function getData( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

		var index;

		switch ( infoObject.mappingType ) {

			case 'ByPolygonVertex' :
				index = polygonVertexIndex;
				break;
			case 'ByPolygon' :
				index = polygonIndex;
				break;
			case 'ByVertice' :
				index = vertexIndex;
				break;
			case 'AllSame' :
				index = infoObject.indices[ 0 ];
				break;
			default :
				console.warn( 'THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType );

		}

		if ( infoObject.referenceType === 'IndexToDirect' ) index = infoObject.indices[ index ];

		var from = index * infoObject.dataSize;
		var to = from + infoObject.dataSize;

		return slice( dataArray, infoObject.buffer, from, to );

	}

	// Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
	function parseNurbsGeometry( geoNode ) {

		if ( THREE.NURBSCurve === undefined ) {

			console.error( 'THREE.FBXLoader: The loader relies on THREE.NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
			return new THREE.BufferGeometry();

		}

		var order = parseInt( geoNode.Order );

		if ( isNaN( order ) ) {

			console.error( 'THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id );
			return new THREE.BufferGeometry();

		}

		var degree = order - 1;

		var knots = geoNode.KnotVector.a;
		var controlPoints = [];
		var pointsValues = geoNode.Points.a;

		for ( var i = 0, l = pointsValues.length; i < l; i += 4 ) {

			controlPoints.push( new THREE.Vector4().fromArray( pointsValues, i ) );

		}

		var startKnot, endKnot;

		if ( geoNode.Form === 'Closed' ) {

			controlPoints.push( controlPoints[ 0 ] );

		} else if ( geoNode.Form === 'Periodic' ) {

			startKnot = degree;
			endKnot = knots.length - 1 - startKnot;

			for ( var i = 0; i < degree; ++ i ) {

				controlPoints.push( controlPoints[ i ] );

			}

		}

		var curve = new THREE.NURBSCurve( degree, knots, controlPoints, startKnot, endKnot );
		var vertices = curve.getPoints( controlPoints.length * 7 );

		var positions = new Float32Array( vertices.length * 3 );

		vertices.forEach( function ( vertex, i ) {

			vertex.toArray( positions, i * 3 );

		} );

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		return geometry;

	}

	// create the main THREE.Group() to be returned by the loader
	function parseScene( FBXTree, connections, skeletons, geometryMap, materialMap ) {

		var sceneGraph = new THREE.Group();

		var modelMap = parseModels( FBXTree, skeletons, geometryMap, materialMap, connections );

		var modelNodes = FBXTree.Objects.Model;

		modelMap.forEach( function ( model ) {

			var modelNode = modelNodes[ model.ID ];
			setLookAtProperties( FBXTree, model, modelNode, connections, sceneGraph );

			var parentConnections = connections.get( model.ID ).parents;

			parentConnections.forEach( function ( connection ) {

				var parent = modelMap.get( connection.ID );
				if ( parent !== undefined ) parent.add( model );

			} );

			if ( model.parent === null ) {

				sceneGraph.add( model );

			}


		} );

		bindSkeleton( FBXTree, skeletons, geometryMap, modelMap, connections );

		addAnimations( FBXTree, connections, sceneGraph );

		createAmbientLight( FBXTree, sceneGraph );

		return sceneGraph;

	}

	// parse nodes in FBXTree.Objects.Model
	function parseModels( FBXTree, skeletons, geometryMap, materialMap, connections ) {

		var modelMap = new Map();
		var modelNodes = FBXTree.Objects.Model;

		for ( var nodeID in modelNodes ) {

			var id = parseInt( nodeID );
			var node = modelNodes[ nodeID ];
			var relationships = connections.get( id );

			var model = buildSkeleton( relationships, skeletons, id, node.attrName );

			if ( ! model ) {

				switch ( node.attrType ) {

					case 'Camera':
						model = createCamera( FBXTree, relationships );
						break;
					case 'Light':
						model = createLight( FBXTree, relationships );
						break;
					case 'Mesh':
						model = createMesh( FBXTree, relationships, geometryMap, materialMap );
						break;
					case 'NurbsCurve':
						model = createCurve( relationships, geometryMap );
						break;
					case 'LimbNode': // usually associated with a Bone, however if a Bone was not created we'll make a Group instead
					case 'Null':
					default:
						model = new THREE.Group();
						break;

				}

				model.name = THREE.PropertyBinding.sanitizeNodeName( node.attrName );
				model.ID = id;

			}

			setModelTransforms( FBXTree, model, node );
			modelMap.set( id, model );

		}

		return modelMap;

	}

	function buildSkeleton( relationships, skeletons, id, name ) {

		var bone = null;

		relationships.parents.forEach( function ( parent ) {

			for ( var ID in skeletons ) {

				var skeleton = skeletons[ ID ];

				skeleton.rawBones.forEach( function ( rawBone, i ) {

					if ( rawBone.ID === parent.ID ) {

						var subBone = bone;
						bone = new THREE.Bone();
						bone.matrixWorld.copy( rawBone.transformLink );

						// set name and id here - otherwise in cases where "subBone" is created it will not have a name / id
						bone.name = THREE.PropertyBinding.sanitizeNodeName( name );
						bone.ID = id;

						skeleton.bones[ i ] = bone;

						// In cases where a bone is shared between multiple meshes
						// duplicate the bone here and and it as a child of the first bone
						if ( subBone !== null ) {

							bone.add( subBone );

						}

					}

				} );

			}

		} );

		return bone;

	}

	// create a THREE.PerspectiveCamera or THREE.OrthographicCamera
	function createCamera( FBXTree, relationships ) {

		var model;
		var cameraAttribute;

		relationships.children.forEach( function ( child ) {

			var attr = FBXTree.Objects.NodeAttribute[ child.ID ];

			if ( attr !== undefined ) {

				cameraAttribute = attr;

			}

		} );

		if ( cameraAttribute === undefined ) {

			model = new THREE.Object3D();

		} else {

			var type = 0;
			if ( cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1 ) {

				type = 1;

			}

			var nearClippingPlane = 1;
			if ( cameraAttribute.NearPlane !== undefined ) {

				nearClippingPlane = cameraAttribute.NearPlane.value / 1000;

			}

			var farClippingPlane = 1000;
			if ( cameraAttribute.FarPlane !== undefined ) {

				farClippingPlane = cameraAttribute.FarPlane.value / 1000;

			}


			var width = window.innerWidth;
			var height = window.innerHeight;

			if ( cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined ) {

				width = cameraAttribute.AspectWidth.value;
				height = cameraAttribute.AspectHeight.value;

			}

			var aspect = width / height;

			var fov = 45;
			if ( cameraAttribute.FieldOfView !== undefined ) {

				fov = cameraAttribute.FieldOfView.value;

			}

			var focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;

			switch ( type ) {

				case 0: // Perspective
					model = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
					if ( focalLength !== null ) model.setFocalLength( focalLength );
					break;

				case 1: // Orthographic
					model = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, nearClippingPlane, farClippingPlane );
					break;

				default:
					console.warn( 'THREE.FBXLoader: Unknown camera type ' + type + '.' );
					model = new THREE.Object3D();
					break;

			}

		}

		return model;

	}

	// Create a THREE.DirectionalLight, THREE.PointLight or THREE.SpotLight
	function createLight( FBXTree, relationships ) {

		var model;
		var lightAttribute;

		relationships.children.forEach( function ( child ) {

			var attr = FBXTree.Objects.NodeAttribute[ child.ID ];

			if ( attr !== undefined ) {

				lightAttribute = attr;

			}

		} );

		if ( lightAttribute === undefined ) {

			model = new THREE.Object3D();

		} else {

			var type;

			// LightType can be undefined for Point lights
			if ( lightAttribute.LightType === undefined ) {

				type = 0;

			} else {

				type = lightAttribute.LightType.value;

			}

			var color = 0xffffff;

			if ( lightAttribute.Color !== undefined ) {

				color = new THREE.Color().fromArray( lightAttribute.Color.value );

			}

			var intensity = ( lightAttribute.Intensity === undefined ) ? 1 : lightAttribute.Intensity.value / 100;

			// light disabled
			if ( lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0 ) {

				intensity = 0;

			}

			var distance = 0;
			if ( lightAttribute.FarAttenuationEnd !== undefined ) {

				if ( lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0 ) {

					distance = 0;

				} else {

					distance = lightAttribute.FarAttenuationEnd.value;

				}

			}

			// TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?
			var decay = 1;

			switch ( type ) {

				case 0: // Point
					model = new THREE.PointLight( color, intensity, distance, decay );
					break;

				case 1: // Directional
					model = new THREE.DirectionalLight( color, intensity );
					break;

				case 2: // Spot
					var angle = Math.PI / 3;

					if ( lightAttribute.InnerAngle !== undefined ) {

						angle = THREE.Math.degToRad( lightAttribute.InnerAngle.value );

					}

					var penumbra = 0;
					if ( lightAttribute.OuterAngle !== undefined ) {

						// TODO: this is not correct - FBX calculates outer and inner angle in degrees
						// with OuterAngle > InnerAngle && OuterAngle <= Math.PI
						// while three.js uses a penumbra between (0, 1) to attenuate the inner angle
						penumbra = THREE.Math.degToRad( lightAttribute.OuterAngle.value );
						penumbra = Math.max( penumbra, 1 );

					}

					model = new THREE.SpotLight( color, intensity, distance, angle, penumbra, decay );
					break;

				default:
					console.warn( 'THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a THREE.PointLight.' );
					model = new THREE.PointLight( color, intensity );
					break;

			}

			if ( lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1 ) {

				model.castShadow = true;

			}

		}

		return model;

	}

	function createMesh( FBXTree, relationships, geometryMap, materialMap ) {

		var model;
		var geometry = null;
		var material = null;
		var materials = [];

		// get geometry and materials(s) from connections
		relationships.children.forEach( function ( child ) {

			if ( geometryMap.has( child.ID ) ) {

				geometry = geometryMap.get( child.ID );

			}

			if ( materialMap.has( child.ID ) ) {

				materials.push( materialMap.get( child.ID ) );

			}

		} );

		if ( materials.length > 1 ) {

			material = materials;

		} else if ( materials.length > 0 ) {

			material = materials[ 0 ];

		} else {

			material = new THREE.MeshPhongMaterial( { color: 0xcccccc } );
			materials.push( material );

		}

		if ( 'color' in geometry.attributes ) {

			materials.forEach( function ( material ) {

				material.vertexColors = THREE.VertexColors;

			} );

		}

		if ( geometry.FBX_Deformer ) {

			materials.forEach( function ( material ) {

				material.skinning = true;

			} );

			model = new THREE.SkinnedMesh( geometry, material );

		} else {

			model = new THREE.Mesh( geometry, material );

		}

		return model;

	}

	function createCurve( relationships, geometryMap ) {

		var geometry = relationships.children.reduce( function ( geo, child ) {

			if ( geometryMap.has( child.ID ) ) geo = geometryMap.get( child.ID );

			return geo;

		}, null );

		// FBX does not list materials for Nurbs lines, so we'll just put our own in here.
		var material = new THREE.LineBasicMaterial( { color: 0x3300ff, linewidth: 1 } );
		return new THREE.Line( geometry, material );

	}

	// Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
	function createAmbientLight( FBXTree, sceneGraph ) {

		if ( 'GlobalSettings' in FBXTree && 'AmbientColor' in FBXTree.GlobalSettings ) {

			var ambientColor = FBXTree.GlobalSettings.AmbientColor.value;
			var r = ambientColor[ 0 ];
			var g = ambientColor[ 1 ];
			var b = ambientColor[ 2 ];

			if ( r !== 0 || g !== 0 || b !== 0 ) {

				var color = new THREE.Color( r, g, b );
				sceneGraph.add( new THREE.AmbientLight( color, 1 ) );

			}

		}

	}

	function setLookAtProperties( FBXTree, model, modelNode, connections, sceneGraph ) {

		if ( 'LookAtProperty' in modelNode ) {

			var children = connections.get( model.ID ).children;

			children.forEach( function ( child ) {

				if ( child.relationship === 'LookAtProperty' ) {

					var lookAtTarget = FBXTree.Objects.Model[ child.ID ];

					if ( 'Lcl_Translation' in lookAtTarget ) {

						var pos = lookAtTarget.Lcl_Translation.value;

						// DirectionalLight, SpotLight
						if ( model.target !== undefined ) {

							model.target.position.fromArray( pos );
							sceneGraph.add( model.target );

						} else { // Cameras and other Object3Ds

							model.lookAt( new THREE.Vector3().fromArray( pos ) );

						}

					}

				}

			} );

		}

	}

	// parse the model node for transform details and apply them to the model
	function setModelTransforms( FBXTree, model, modelNode ) {

		// http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html
		if ( 'RotationOrder' in modelNode ) {

			var enums = [
				'XYZ', // default
				'XZY',
				'YZX',
				'ZXY',
				'YXZ',
				'ZYX',
				'SphericXYZ',
			];

			var value = parseInt( modelNode.RotationOrder.value, 10 );

			if ( value > 0 && value < 6 ) {

				// model.rotation.order = enums[ value ];

				// Note: Euler order other than XYZ is currently not supported, so just display a warning for now
				console.warn( 'THREE.FBXLoader: unsupported Euler Order: %s. Currently only XYZ order is supported. Animations and rotations may be incorrect.', enums[ value ] );

			} else if ( value === 6 ) {

				console.warn( 'THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.' );

			}

		}

		if ( 'Lcl_Translation' in modelNode ) {

			model.position.fromArray( modelNode.Lcl_Translation.value );

		}

		if ( 'Lcl_Rotation' in modelNode ) {

			var rotation = modelNode.Lcl_Rotation.value.map( THREE.Math.degToRad );
			rotation.push( 'ZYX' );
			model.quaternion.setFromEuler( new THREE.Euler().fromArray( rotation ) );

		}

		if ( 'Lcl_Scaling' in modelNode ) {

			model.scale.fromArray( modelNode.Lcl_Scaling.value );

		}

		if ( 'PreRotation' in modelNode ) {

			var array = modelNode.PreRotation.value.map( THREE.Math.degToRad );
			array[ 3 ] = 'ZYX';

			var preRotations = new THREE.Euler().fromArray( array );

			preRotations = new THREE.Quaternion().setFromEuler( preRotations );
			model.quaternion.premultiply( preRotations );

		}

	}

	function bindSkeleton( FBXTree, skeletons, geometryMap, modelMap, connections ) {

		var bindMatrices = parsePoseNodes( FBXTree );

		for ( var ID in skeletons ) {

			var skeleton = skeletons[ ID ];

			var parents = connections.get( parseInt( skeleton.ID ) ).parents;

			parents.forEach( function ( parent ) {

				if ( geometryMap.has( parent.ID ) ) {

					var geoID = parent.ID;
					var geoRelationships = connections.get( geoID );

					geoRelationships.parents.forEach( function ( geoConnParent ) {

						if ( modelMap.has( geoConnParent.ID ) ) {

							var model = modelMap.get( geoConnParent.ID );

							model.bind( new THREE.Skeleton( skeleton.bones ), bindMatrices[ geoConnParent.ID ] );

						}

					} );

				}

			} );

		}

	}

	function parsePoseNodes( FBXTree ) {

		var bindMatrices = {};

		if ( 'Pose' in FBXTree.Objects ) {

			var BindPoseNode = FBXTree.Objects.Pose;

			for ( var nodeID in BindPoseNode ) {

				if ( BindPoseNode[ nodeID ].attrType === 'BindPose' ) {

					var poseNodes = BindPoseNode[ nodeID ].PoseNode;

					if ( Array.isArray( poseNodes ) ) {

						poseNodes.forEach( function ( poseNode ) {

							bindMatrices[ poseNode.Node ] = new THREE.Matrix4().fromArray( poseNode.Matrix.a );

						} );

					} else {

						bindMatrices[ poseNodes.Node ] = new THREE.Matrix4().fromArray( poseNodes.Matrix.a );

					}

				}

			}

		}

		return bindMatrices;

	}

	function parseAnimations( FBXTree, connections ) {

		// since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
		// if this is undefined we can safely assume there are no animations
		if ( FBXTree.Objects.AnimationCurve === undefined ) return undefined;

		var curveNodesMap = parseAnimationCurveNodes( FBXTree );

		parseAnimationCurves( FBXTree, connections, curveNodesMap );

		var layersMap = parseAnimationLayers( FBXTree, connections, curveNodesMap );
		var rawClips = parseAnimStacks( FBXTree, connections, layersMap );

		return rawClips;

	}

	// parse nodes in FBXTree.Objects.AnimationCurveNode
	// each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
	// and is referenced by an AnimationLayer
	function parseAnimationCurveNodes( FBXTree ) {

		var rawCurveNodes = FBXTree.Objects.AnimationCurveNode;

		var curveNodesMap = new Map();

		for ( var nodeID in rawCurveNodes ) {

			var rawCurveNode = rawCurveNodes[ nodeID ];

			if ( rawCurveNode.attrName.match( /S|R|T/ ) !== null ) {

				var curveNode = {

					id: rawCurveNode.id,
					attr: rawCurveNode.attrName,
					curves: {},

				};

				curveNodesMap.set( curveNode.id, curveNode );

			}

		}

		return curveNodesMap;

	}

	// parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
	// previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
	// axis ( e.g. times and values of x rotation)
	function parseAnimationCurves( FBXTree, connections, curveNodesMap ) {

		var rawCurves = FBXTree.Objects.AnimationCurve;

		for ( var nodeID in rawCurves ) {

			var animationCurve = {

				id: rawCurves[ nodeID ].id,
				times: rawCurves[ nodeID ].KeyTime.a.map( convertFBXTimeToSeconds ),
				values: rawCurves[ nodeID ].KeyValueFloat.a,

			};

			var relationships = connections.get( animationCurve.id );

			if ( relationships !== undefined ) {

				var animationCurveID = relationships.parents[ 0 ].ID;
				var animationCurveRelationship = relationships.parents[ 0 ].relationship;

				if ( animationCurveRelationship.match( /X/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'x' ] = animationCurve;

				} else if ( animationCurveRelationship.match( /Y/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'y' ] = animationCurve;

				} else if ( animationCurveRelationship.match( /Z/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'z' ] = animationCurve;

				}

			}

		}

	}

	// parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
	// to various AnimationCurveNodes and is referenced by an AnimationStack node
	// note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
	function parseAnimationLayers( FBXTree, connections, curveNodesMap ) {

		var rawLayers = FBXTree.Objects.AnimationLayer;

		var layersMap = new Map();

		for ( var nodeID in rawLayers ) {

			var layerCurveNodes = [];

			var connection = connections.get( parseInt( nodeID ) );

			if ( connection !== undefined ) {

				// all the animationCurveNodes used in the layer
				var children = connection.children;

				children.forEach( function ( child, i ) {

					if ( curveNodesMap.has( child.ID ) ) {

						var curveNode = curveNodesMap.get( child.ID );

						// check that the curves are defined for at least one axis, otherwise ignore the curveNode
						if ( curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined ) {

							if ( layerCurveNodes[ i ] === undefined ) {

								var modelID;

								connections.get( child.ID ).parents.forEach( function ( parent ) {

									if ( parent.relationship !== undefined ) modelID = parent.ID;

								} );

								var rawModel = FBXTree.Objects.Model[ modelID.toString() ];

								var node = {

									modelName: THREE.PropertyBinding.sanitizeNodeName( rawModel.attrName ),
									initialPosition: [ 0, 0, 0 ],
									initialRotation: [ 0, 0, 0 ],
									initialScale: [ 1, 1, 1 ],

								};

								if ( 'Lcl_Translation' in rawModel ) node.initialPosition = rawModel.Lcl_Translation.value;

								if ( 'Lcl_Rotation' in rawModel ) node.initialRotation = rawModel.Lcl_Rotation.value;

								if ( 'Lcl_Scaling' in rawModel ) node.initialScale = rawModel.Lcl_Scaling.value;

								// if the animated model is pre rotated, we'll have to apply the pre rotations to every
								// animation value as well
								if ( 'PreRotation' in rawModel ) node.preRotations = rawModel.PreRotation.value;

								layerCurveNodes[ i ] = node;

							}

							layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

						}



					}

				} );

				layersMap.set( parseInt( nodeID ), layerCurveNodes );

			}

		}

		return layersMap;

	}

	// parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
	// hierarchy. Each Stack node will be used to create a THREE.AnimationClip
	function parseAnimStacks( FBXTree, connections, layersMap ) {

		var rawStacks = FBXTree.Objects.AnimationStack;

		// connect the stacks (clips) up to the layers
		var rawClips = {};

		for ( var nodeID in rawStacks ) {

			var children = connections.get( parseInt( nodeID ) ).children;

			if ( children.length > 1 ) {

				// it seems like stacks will always be associated with a single layer. But just in case there are files
				// where there are multiple layers per stack, we'll display a warning
				console.warn( 'THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.' );

			}

			var layer = layersMap.get( children[ 0 ].ID );

			rawClips[ nodeID ] = {

				name: rawStacks[ nodeID ].attrName,
				layer: layer,

			};

		}

		return rawClips;

	}

	// take raw animation data from parseAnimations and connect it up to the loaded models
	function addAnimations( FBXTree, connections, sceneGraph ) {

		sceneGraph.animations = [];

		var rawClips = parseAnimations( FBXTree, connections );

		if ( rawClips === undefined ) return;


		for ( var key in rawClips ) {

			var rawClip = rawClips[ key ];

			var clip = addClip( rawClip );

			sceneGraph.animations.push( clip );

		}

	}

	function addClip( rawClip ) {

		var tracks = [];

		rawClip.layer.forEach( function ( rawTracks ) {

			tracks = tracks.concat( generateTracks( rawTracks ) );

		} );

		return new THREE.AnimationClip( rawClip.name, - 1, tracks );

	}

	function generateTracks( rawTracks ) {

		var tracks = [];

		if ( rawTracks.T !== undefined && Object.keys( rawTracks.T.curves ).length > 0 ) {

			var positionTrack = generateVectorTrack( rawTracks.modelName, rawTracks.T.curves, rawTracks.initialPosition, 'position' );
			if ( positionTrack !== undefined ) tracks.push( positionTrack );

		}

		if ( rawTracks.R !== undefined && Object.keys( rawTracks.R.curves ).length > 0 ) {

			var rotationTrack = generateRotationTrack( rawTracks.modelName, rawTracks.R.curves, rawTracks.initialRotation, rawTracks.preRotations );
			if ( rotationTrack !== undefined ) tracks.push( rotationTrack );

		}

		if ( rawTracks.S !== undefined && Object.keys( rawTracks.S.curves ).length > 0 ) {

			var scaleTrack = generateVectorTrack( rawTracks.modelName, rawTracks.S.curves, rawTracks.initialScale, 'scale' );
			if ( scaleTrack !== undefined ) tracks.push( scaleTrack );

		}

		return tracks;

	}

	function generateVectorTrack( modelName, curves, initialValue, type ) {

		var times = getTimesForAllAxes( curves );
		var values = getKeyframeTrackValues( times, curves, initialValue );

		return new THREE.VectorKeyframeTrack( modelName + '.' + type, times, values );

	}

	function generateRotationTrack( modelName, curves, initialValue, preRotations ) {

		if ( curves.x !== undefined ) {

			interpolateRotations( curves.x );
			curves.x.values = curves.x.values.map( THREE.Math.degToRad );

		}
		if ( curves.y !== undefined ) {

			interpolateRotations( curves.y );
			curves.y.values = curves.y.values.map( THREE.Math.degToRad );

		}
		if ( curves.z !== undefined ) {

			interpolateRotations( curves.z );
			curves.z.values = curves.z.values.map( THREE.Math.degToRad );

		}

		var times = getTimesForAllAxes( curves );
		var values = getKeyframeTrackValues( times, curves, initialValue );

		if ( preRotations !== undefined ) {

			preRotations = preRotations.map( THREE.Math.degToRad );
			preRotations.push( 'ZYX' );

			preRotations = new THREE.Euler().fromArray( preRotations );
			preRotations = new THREE.Quaternion().setFromEuler( preRotations );

		}

		var quaternion = new THREE.Quaternion();
		var euler = new THREE.Euler();

		var quaternionValues = [];

		for ( var i = 0; i < values.length; i += 3 ) {

			euler.set( values[ i ], values[ i + 1 ], values[ i + 2 ], 'ZYX' );

			quaternion.setFromEuler( euler );

			if ( preRotations !== undefined )quaternion.premultiply( preRotations );

			quaternion.toArray( quaternionValues, ( i / 3 ) * 4 );

		}

		return new THREE.QuaternionKeyframeTrack( modelName + '.quaternion', times, quaternionValues );

	}

	function getKeyframeTrackValues( times, curves, initialValue ) {

		var prevValue = initialValue;

		var values = [];

		var xIndex = - 1;
		var yIndex = - 1;
		var zIndex = - 1;

		times.forEach( function ( time ) {

			if ( curves.x ) xIndex = curves.x.times.indexOf( time );
			if ( curves.y ) yIndex = curves.y.times.indexOf( time );
			if ( curves.z ) zIndex = curves.z.times.indexOf( time );

			// if there is an x value defined for this frame, use that
			if ( xIndex !== - 1 ) {

				var xValue = curves.x.values[ xIndex ];
				values.push( xValue );
				prevValue[ 0 ] = xValue;

			} else {

				// otherwise use the x value from the previous frame
				values.push( prevValue[ 0 ] );

			}

			if ( yIndex !== - 1 ) {

				var yValue = curves.y.values[ yIndex ];
				values.push( yValue );
				prevValue[ 1 ] = yValue;

			} else {

				values.push( prevValue[ 1 ] );

			}

			if ( zIndex !== - 1 ) {

				var zValue = curves.z.values[ zIndex ];
				values.push( zValue );
				prevValue[ 2 ] = zValue;

			} else {

				values.push( prevValue[ 2 ] );

			}

		} );

		return values;

	}

	// For all animated objects, times are defined separately for each axis
	// Here we'll combine the times into one sorted array without duplicates
	function getTimesForAllAxes( curves ) {

		var times = [];

		// first join together the times for each axis, if defined
		if ( curves.x !== undefined ) times = times.concat( curves.x.times );
		if ( curves.y !== undefined ) times = times.concat( curves.y.times );
		if ( curves.z !== undefined ) times = times.concat( curves.z.times );

		// then sort them and remove duplicates
		times = times.sort( function ( a, b ) {

			return a - b;

		} ).filter( function ( elem, index, array ) {

			return array.indexOf( elem ) == index;

		} );

		return times;

	}

	// Rotations are defined as Euler angles which can have values  of any size
	// These will be converted to quaternions which don't support values greater than
	// PI, so we'll interpolate large rotations
	function interpolateRotations( curve ) {

		for ( var i = 1; i < curve.values.length; i ++ ) {

			var initialValue = curve.values[ i - 1 ];
			var valuesSpan = curve.values[ i ] - initialValue;

			var absoluteSpan = Math.abs( valuesSpan );

			if ( absoluteSpan >= 180 ) {

				var numSubIntervals = absoluteSpan / 180;

				var step = valuesSpan / numSubIntervals;
				var nextValue = initialValue + step;

				var initialTime = curve.times[ i - 1 ];
				var timeSpan = curve.times[ i ] - initialTime;
				var interval = timeSpan / numSubIntervals;
				var nextTime = initialTime + interval;

				var interpolatedTimes = [];
				var interpolatedValues = [];

				while ( nextTime < curve.times[ i ] ) {

					interpolatedTimes.push( nextTime );
					nextTime += interval;

					interpolatedValues.push( nextValue );
					nextValue += step;

				}

				curve.times = inject( curve.times, i, interpolatedTimes );
				curve.values = inject( curve.values, i, interpolatedValues );

			}

		}

	}

	// parse an FBX file in ASCII format
	function TextParser() {}

	Object.assign( TextParser.prototype, {

		getPrevNode: function () {

			return this.nodeStack[ this.currentIndent - 2 ];

		},

		getCurrentNode: function () {

			return this.nodeStack[ this.currentIndent - 1 ];

		},

		getCurrentProp: function () {

			return this.currentProp;

		},

		pushStack: function ( node ) {

			this.nodeStack.push( node );
			this.currentIndent += 1;

		},

		popStack: function () {

			this.nodeStack.pop();
			this.currentIndent -= 1;

		},

		setCurrentProp: function ( val, name ) {

			this.currentProp = val;
			this.currentPropName = name;

		},

		parse: function ( text ) {

			this.currentIndent = 0;
			this.allNodes = new FBXTree();
			this.nodeStack = [];
			this.currentProp = [];
			this.currentPropName = '';

			var self = this;

			var split = text.split( '\n' );

			split.forEach( function ( line, i ) {

				var matchComment = line.match( /^[\s\t]*;/ );
				var matchEmpty = line.match( /^[\s\t]*$/ );

				if ( matchComment || matchEmpty ) return;

				var matchBeginning = line.match( '^\\t{' + self.currentIndent + '}(\\w+):(.*){', '' );
				var matchProperty = line.match( '^\\t{' + ( self.currentIndent ) + '}(\\w+):[\\s\\t\\r\\n](.*)' );
				var matchEnd = line.match( '^\\t{' + ( self.currentIndent - 1 ) + '}}' );

				if ( matchBeginning ) {

					self.parseNodeBegin( line, matchBeginning );

				} else if ( matchProperty ) {

					self.parseNodeProperty( line, matchProperty, split[ ++ i ] );

				} else if ( matchEnd ) {

					self.popStack();

				} else if ( line.match( /^[^\s\t}]/ ) ) {

					// large arrays are split over multiple lines terminated with a ',' character
					// if this is encountered the line needs to be joined to the previous line
					self.parseNodePropertyContinued( line );

				}

			} );

			return this.allNodes;

		},

		parseNodeBegin: function ( line, property ) {

			var nodeName = property[ 1 ].trim().replace( /^"/, '' ).replace( /"$/, '' );

			var nodeAttrs = property[ 2 ].split( ',' ).map( function ( attr ) {

				return attr.trim().replace( /^"/, '' ).replace( /"$/, '' );

			} );

			var node = { name: nodeName };
			var attrs = this.parseNodeAttr( nodeAttrs );

			var currentNode = this.getCurrentNode();

			// a top node
			if ( this.currentIndent === 0 ) {

				this.allNodes.add( nodeName, node );

			} else { // a subnode

				// if the subnode already exists, append it
				if ( nodeName in currentNode ) {

				// special case Pose needs PoseNodes as an array
					if ( nodeName === 'PoseNode' ) {

						currentNode.PoseNode.push( node );

					} else if ( currentNode[ nodeName ].id !== undefined ) {

						currentNode[ nodeName ] = {};
						currentNode[ nodeName ][ currentNode[ nodeName ].id ] = currentNode[ nodeName ];

					}

					if ( attrs.id !== '' ) currentNode[ nodeName ][ attrs.id ] = node;

				} else if ( typeof attrs.id === 'number' ) {

					currentNode[ nodeName ] = {};
					currentNode[ nodeName ][ attrs.id ] = node;

				} else if ( nodeName !== 'Properties70' ) {

					if ( nodeName === 'PoseNode' )	currentNode[ nodeName ] = [ node ];
					else currentNode[ nodeName ] = node;

				}

			}

			if ( typeof attrs.id === 'number' ) node.id = attrs.id;
			if ( attrs.name !== '' ) node.attrName = attrs.name;
			if ( attrs.type !== '' ) node.attrType = attrs.type;

			this.pushStack( node );

		},

		parseNodeAttr: function ( attrs ) {

			var id = attrs[ 0 ];

			if ( attrs[ 0 ] !== '' ) {

				id = parseInt( attrs[ 0 ] );

				if ( isNaN( id ) ) {

					id = attrs[ 0 ];

				}

			}

			var name = '', type = '';

			if ( attrs.length > 1 ) {

				name = attrs[ 1 ].replace( /^(\w+)::/, '' );
				type = attrs[ 2 ];

			}

			return { id: id, name: name, type: type };

		},

		parseNodeProperty: function ( line, property, contentLine ) {

			var propName = property[ 1 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();
			var propValue = property[ 2 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();

			// for special case: base64 image data follows "Content: ," line
			//	Content: ,
			//	 "/9j/4RDaRXhpZgAATU0A..."
			if ( propName === 'Content' && propValue === ',' ) {

				propValue = contentLine.replace( /"/g, '' ).replace( /,$/, '' ).trim();

			}

			var currentNode = this.getCurrentNode();
			var parentName = currentNode.name;

			if ( parentName === 'Properties70' ) {

				this.parseNodeSpecialProperty( line, propName, propValue );
				return;

			}

			// Connections
			if ( propName === 'C' ) {

				var connProps = propValue.split( ',' ).slice( 1 );
				var from = parseInt( connProps[ 0 ] );
				var to = parseInt( connProps[ 1 ] );

				var rest = propValue.split( ',' ).slice( 3 );

				rest = rest.map( function ( elem ) {

					return elem.trim().replace( /^"/, '' );

				} );

				propName = 'connections';
				propValue = [ from, to ];
				append( propValue, rest );

				if ( currentNode[ propName ] === undefined ) {

					currentNode[ propName ] = [];

				}

			}

			// Node
			if ( propName === 'Node' ) currentNode.id = propValue;

			// connections
			if ( propName in currentNode && Array.isArray( currentNode[ propName ] ) ) {

				currentNode[ propName ].push( propValue );

			} else {

				if ( propName !== 'a' ) currentNode[ propName ] = propValue;
				else currentNode.a = propValue;

			}

			this.setCurrentProp( currentNode, propName );

			// convert string to array, unless it ends in ',' in which case more will be added to it
			if ( propName === 'a' && propValue.slice( - 1 ) !== ',' ) {

				currentNode.a = parseNumberArray( propValue );

			}

		},

		parseNodePropertyContinued: function ( line ) {

			var currentNode = this.getCurrentNode();

			currentNode.a += line;

			// if the line doesn't end in ',' we have reached the end of the property value
			// so convert the string to an array
			if ( line.slice( - 1 ) !== ',' ) {

				currentNode.a = parseNumberArray( currentNode.a );

			}

		},

		// parse "Property70"
		parseNodeSpecialProperty: function ( line, propName, propValue ) {

			// split this
			// P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
			// into array like below
			// ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
			var props = propValue.split( '",' ).map( function ( prop ) {

				return prop.trim().replace( /^\"/, '' ).replace( /\s/, '_' );

			} );

			var innerPropName = props[ 0 ];
			var innerPropType1 = props[ 1 ];
			var innerPropType2 = props[ 2 ];
			var innerPropFlag = props[ 3 ];
			var innerPropValue = props[ 4 ];

			// cast values where needed, otherwise leave as strings
			switch ( innerPropType1 ) {

				case 'int':
				case 'enum':
				case 'bool':
				case 'ULongLong':
				case 'double':
				case 'Number':
				case 'FieldOfView':
					innerPropValue = parseFloat( innerPropValue );
					break;

				case 'Color':
				case 'ColorRGB':
				case 'Vector3D':
				case 'Lcl_Translation':
				case 'Lcl_Rotation':
				case 'Lcl_Scaling':
					innerPropValue = parseNumberArray( innerPropValue );
					break;

			}

			// CAUTION: these props must append to parent's parent
			this.getPrevNode()[ innerPropName ] = {

				'type': innerPropType1,
				'type2': innerPropType2,
				'flag': innerPropFlag,
				'value': innerPropValue

			};

			this.setCurrentProp( this.getPrevNode(), innerPropName );

		},

	} );

	// Parse an FBX file in Binary format
	function BinaryParser() {}

	Object.assign( BinaryParser.prototype, {

		parse: function ( buffer ) {

			var reader = new BinaryReader( buffer );
			reader.skip( 23 ); // skip magic 23 bytes

			var version = reader.getUint32();

			console.log( 'THREE.FBXLoader: FBX binary version: ' + version );

			var allNodes = new FBXTree();

			while ( ! this.endOfContent( reader ) ) {

				var node = this.parseNode( reader, version );
				if ( node !== null ) allNodes.add( node.name, node );

			}

			return allNodes;

		},

		// Check if reader has reached the end of content.
		endOfContent: function ( reader ) {

			// footer size: 160bytes + 16-byte alignment padding
			// - 16bytes: magic
			// - padding til 16-byte alignment (at least 1byte?)
			//	(seems like some exporters embed fixed 15 or 16bytes?)
			// - 4bytes: magic
			// - 4bytes: version
			// - 120bytes: zero
			// - 16bytes: magic
			if ( reader.size() % 16 === 0 ) {

				return ( ( reader.getOffset() + 160 + 16 ) & ~ 0xf ) >= reader.size();

			} else {

				return reader.getOffset() + 160 + 16 >= reader.size();

			}

		},

		// recursively parse nodes until the end of the file is reached
		parseNode: function ( reader, version ) {

			var node = {};

			// The first three data sizes depends on version.
			var endOffset = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();
			var numProperties = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

			// note: do not remove this even if you get a linter warning as it moves the buffer forward
			var propertyListLen = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

			var nameLen = reader.getUint8();
			var name = reader.getString( nameLen );

			// Regards this node as NULL-record if endOffset is zero
			if ( endOffset === 0 ) return null;

			var propertyList = [];

			for ( var i = 0; i < numProperties; i ++ ) {

				propertyList.push( this.parseProperty( reader ) );

			}

			// Regards the first three elements in propertyList as id, attrName, and attrType
			var id = propertyList.length > 0 ? propertyList[ 0 ] : '';
			var attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
			var attrType = propertyList.length > 2 ? propertyList[ 2 ] : '';

			// check if this node represents just a single property
			// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
			node.singleProperty = ( numProperties === 1 && reader.getOffset() === endOffset ) ? true : false;

			while ( endOffset > reader.getOffset() ) {

				var subNode = this.parseNode( reader, version );

				if ( subNode !== null ) this.parseSubNode( name, node, subNode );

			}

			node.propertyList = propertyList; // raw property list used by parent

			if ( typeof id === 'number' ) node.id = id;
			if ( attrName !== '' ) node.attrName = attrName;
			if ( attrType !== '' ) node.attrType = attrType;
			if ( name !== '' ) node.name = name;

			return node;

		},

		parseSubNode: function ( name, node, subNode ) {

			// special case: child node is single property
			if ( subNode.singleProperty === true ) {

				var value = subNode.propertyList[ 0 ];

				if ( Array.isArray( value ) ) {

					node[ subNode.name ] = subNode;

					subNode.a = value;

				} else {

					node[ subNode.name ] = value;

				}

			} else if ( name === 'Connections' && subNode.name === 'C' ) {

				var array = [];

				subNode.propertyList.forEach( function ( property, i ) {

					// first Connection is FBX type (OO, OP, etc.). We'll discard these
					if ( i !== 0 ) array.push( property );

				} );

				if ( node.connections === undefined ) {

					node.connections = [];

				}

				node.connections.push( array );

			} else if ( subNode.name === 'Properties70' ) {

				var keys = Object.keys( subNode );

				keys.forEach( function ( key ) {

					node[ key ] = subNode[ key ];

				} );

			} else if ( name === 'Properties70' && subNode.name === 'P' ) {

				var innerPropName = subNode.propertyList[ 0 ];
				var innerPropType1 = subNode.propertyList[ 1 ];
				var innerPropType2 = subNode.propertyList[ 2 ];
				var innerPropFlag = subNode.propertyList[ 3 ];
				var innerPropValue;

				if ( innerPropName.indexOf( 'Lcl ' ) === 0 ) innerPropName = innerPropName.replace( 'Lcl ', 'Lcl_' );
				if ( innerPropType1.indexOf( 'Lcl ' ) === 0 ) innerPropType1 = innerPropType1.replace( 'Lcl ', 'Lcl_' );

				if ( innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf( 'Lcl_' ) === 0 ) {

					innerPropValue = [
						subNode.propertyList[ 4 ],
						subNode.propertyList[ 5 ],
						subNode.propertyList[ 6 ]
					];

				} else {

					innerPropValue = subNode.propertyList[ 4 ];

				}

				// this will be copied to parent, see above
				node[ innerPropName ] = {

					'type': innerPropType1,
					'type2': innerPropType2,
					'flag': innerPropFlag,
					'value': innerPropValue

				};

			} else if ( node[ subNode.name ] === undefined ) {

				if ( typeof subNode.id === 'number' ) {

					node[ subNode.name ] = {};
					node[ subNode.name ][ subNode.id ] = subNode;

				} else {

					node[ subNode.name ] = subNode;

				}

			} else {

				if ( subNode.name === 'PoseNode' ) {

					if ( ! Array.isArray( node[ subNode.name ] ) ) {

						node[ subNode.name ] = [ node[ subNode.name ] ];

					}

					node[ subNode.name ].push( subNode );

				} else if ( node[ subNode.name ][ subNode.id ] === undefined ) {

					node[ subNode.name ][ subNode.id ] = subNode;

				}

			}

		},

		parseProperty: function ( reader ) {

			var type = reader.getString( 1 );

			switch ( type ) {

				case 'C':
					return reader.getBoolean();

				case 'D':
					return reader.getFloat64();

				case 'F':
					return reader.getFloat32();

				case 'I':
					return reader.getInt32();

				case 'L':
					return reader.getInt64();

				case 'R':
					var length = reader.getUint32();
					return reader.getArrayBuffer( length );

				case 'S':
					var length = reader.getUint32();
					return reader.getString( length );

				case 'Y':
					return reader.getInt16();

				case 'b':
				case 'c':
				case 'd':
				case 'f':
				case 'i':
				case 'l':

					var arrayLength = reader.getUint32();
					var encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
					var compressedLength = reader.getUint32();

					if ( encoding === 0 ) {

						switch ( type ) {

							case 'b':
							case 'c':
								return reader.getBooleanArray( arrayLength );

							case 'd':
								return reader.getFloat64Array( arrayLength );

							case 'f':
								return reader.getFloat32Array( arrayLength );

							case 'i':
								return reader.getInt32Array( arrayLength );

							case 'l':
								return reader.getInt64Array( arrayLength );

						}

					}

					if ( window.Zlib === undefined ) {

						console.error( 'THREE.FBXLoader: External library Inflate.min.js required, obtain or import from https://github.com/imaya/zlib.js' );

					}

					var inflate = new Zlib.Inflate( new Uint8Array( reader.getArrayBuffer( compressedLength ) ) ); // eslint-disable-line no-undef
					var reader2 = new BinaryReader( inflate.decompress().buffer );

					switch ( type ) {

						case 'b':
						case 'c':
							return reader2.getBooleanArray( arrayLength );

						case 'd':
							return reader2.getFloat64Array( arrayLength );

						case 'f':
							return reader2.getFloat32Array( arrayLength );

						case 'i':
							return reader2.getInt32Array( arrayLength );

						case 'l':
							return reader2.getInt64Array( arrayLength );

					}

				default:
					throw new Error( 'THREE.FBXLoader: Unknown property type ' + type );

			}

		}

	} );


	function BinaryReader( buffer, littleEndian ) {

		this.dv = new DataView( buffer );
		this.offset = 0;
		this.littleEndian = ( littleEndian !== undefined ) ? littleEndian : true;

	}

	Object.assign( BinaryReader.prototype, {

		getOffset: function () {

			return this.offset;

		},

		size: function () {

			return this.dv.buffer.byteLength;

		},

		skip: function ( length ) {

			this.offset += length;

		},

		// seems like true/false representation depends on exporter.
		// true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
		// then sees LSB.
		getBoolean: function () {

			return ( this.getUint8() & 1 ) === 1;

		},

		getBooleanArray: function ( size ) {

			var a = [];

			for ( var i = 0; i < size; i ++ ) {

				a.push( this.getBoolean() );

			}

			return a;

		},

		getUint8: function () {

			var value = this.dv.getUint8( this.offset );
			this.offset += 1;
			return value;

		},

		getInt16: function () {

			var value = this.dv.getInt16( this.offset, this.littleEndian );
			this.offset += 2;
			return value;

		},

		getInt32: function () {

			var value = this.dv.getInt32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		},

		getInt32Array: function ( size ) {

			var a = [];

			for ( var i = 0; i < size; i ++ ) {

				a.push( this.getInt32() );

			}

			return a;

		},

		getUint32: function () {

			var value = this.dv.getUint32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		},

		// JavaScript doesn't support 64-bit integer so calculate this here
		// 1 << 32 will return 1 so using multiply operation instead here.
		// There's a possibility that this method returns wrong value if the value
		// is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
		// TODO: safely handle 64-bit integer
		getInt64: function () {

			var low, high;

			if ( this.littleEndian ) {

				low = this.getUint32();
				high = this.getUint32();

			} else {

				high = this.getUint32();
				low = this.getUint32();

			}

			// calculate negative value
			if ( high & 0x80000000 ) {

				high = ~ high & 0xFFFFFFFF;
				low = ~ low & 0xFFFFFFFF;

				if ( low === 0xFFFFFFFF ) high = ( high + 1 ) & 0xFFFFFFFF;

				low = ( low + 1 ) & 0xFFFFFFFF;

				return - ( high * 0x100000000 + low );

			}

			return high * 0x100000000 + low;

		},

		getInt64Array: function ( size ) {

			var a = [];

			for ( var i = 0; i < size; i ++ ) {

				a.push( this.getInt64() );

			}

			return a;

		},

		// Note: see getInt64() comment
		getUint64: function () {

			var low, high;

			if ( this.littleEndian ) {

				low = this.getUint32();
				high = this.getUint32();

			} else {

				high = this.getUint32();
				low = this.getUint32();

			}

			return high * 0x100000000 + low;

		},

		getFloat32: function () {

			var value = this.dv.getFloat32( this.offset, this.littleEndian );
			this.offset += 4;
			return value;

		},

		getFloat32Array: function ( size ) {

			var a = [];

			for ( var i = 0; i < size; i ++ ) {

				a.push( this.getFloat32() );

			}

			return a;

		},

		getFloat64: function () {

			var value = this.dv.getFloat64( this.offset, this.littleEndian );
			this.offset += 8;
			return value;

		},

		getFloat64Array: function ( size ) {

			var a = [];

			for ( var i = 0; i < size; i ++ ) {

				a.push( this.getFloat64() );

			}

			return a;

		},

		getArrayBuffer: function ( size ) {

			var value = this.dv.buffer.slice( this.offset, this.offset + size );
			this.offset += size;
			return value;

		},

		getString: function ( size ) {

			var a = new Uint8Array( size );

			for ( var i = 0; i < size; i ++ ) {

				a[ i ] = this.getUint8();

			}

			var nullByte = a.indexOf( 0 );
			if ( nullByte >= 0 ) a = a.slice( 0, nullByte );

			return THREE.LoaderUtils.decodeText( a );

		}

	} );

	// FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
	// and BinaryParser( FBX Binary format)
	function FBXTree() {}

	Object.assign( FBXTree.prototype, {

		add: function ( key, val ) {

			this[ key ] = val;

		},

	} );

	function isFbxFormatBinary( buffer ) {

		var CORRECT = 'Kaydara FBX Binary  \0';

		return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString( buffer, 0, CORRECT.length );

	}

	function isFbxFormatASCII( text ) {

		var CORRECT = [ 'K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\' ];

		var cursor = 0;

		function read( offset ) {

			var result = text[ offset - 1 ];
			text = text.slice( cursor + offset );
			cursor ++;
			return result;

		}

		for ( var i = 0; i < CORRECT.length; ++ i ) {

			var num = read( 1 );
			if ( num === CORRECT[ i ] ) {

				return false;

			}

		}

		return true;

	}

	function getFbxVersion( text ) {

		var versionRegExp = /FBXVersion: (\d+)/;
		var match = text.match( versionRegExp );
		if ( match ) {

			var version = parseInt( match[ 1 ] );
			return version;

		}
		throw new Error( 'THREE.FBXLoader: Cannot find the version number for the file given.' );

	}

	// Converts FBX ticks into real time seconds.
	function convertFBXTimeToSeconds( time ) {

		return time / 46186158000;

	}


	// Parses comma separated list of numbers and returns them an array.
	// Used internally by the TextParser
	function parseNumberArray( value ) {

		var array = value.split( ',' ).map( function ( val ) {

			return parseFloat( val );

		} );

		return array;

	}

	function convertArrayBufferToString( buffer, from, to ) {

		if ( from === undefined ) from = 0;
		if ( to === undefined ) to = buffer.byteLength;

		return THREE.LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) );

	}

	function append( a, b ) {

		for ( var i = 0, j = a.length, l = b.length; i < l; i ++, j ++ ) {

			a[ j ] = b[ i ];

		}

	}

	function slice( a, b, from, to ) {

		for ( var i = from, j = 0; i < to; i ++, j ++ ) {

			a[ j ] = b[ i ];

		}

		return a;

	}

	// inject array a2 into array a1 at index
	function inject( a1, index, a2 ) {

		return a1.slice( 0, index ).concat( a2 ).concat( a1.slice( index ) );

	}

} )();



/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';var l=void 0,aa=this;function r(c,d){var a=c.split("."),b=aa;!(a[0]in b)&&b.execScript&&b.execScript("var "+a[0]);for(var e;a.length&&(e=a.shift());)!a.length&&d!==l?b[e]=d:b=b[e]?b[e]:b[e]={}};var t="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function v(c){var d=c.length,a=0,b=Number.POSITIVE_INFINITY,e,f,g,h,k,m,n,p,s,x;for(p=0;p<d;++p)c[p]>a&&(a=c[p]),c[p]<b&&(b=c[p]);e=1<<a;f=new (t?Uint32Array:Array)(e);g=1;h=0;for(k=2;g<=a;){for(p=0;p<d;++p)if(c[p]===g){m=0;n=h;for(s=0;s<g;++s)m=m<<1|n&1,n>>=1;x=g<<16|p;for(s=m;s<e;s+=k)f[s]=x;++h}++g;h<<=1;k<<=1}return[f,a,b]};function w(c,d){this.g=[];this.h=32768;this.d=this.f=this.a=this.l=0;this.input=t?new Uint8Array(c):c;this.m=!1;this.i=y;this.r=!1;if(d||!(d={}))d.index&&(this.a=d.index),d.bufferSize&&(this.h=d.bufferSize),d.bufferType&&(this.i=d.bufferType),d.resize&&(this.r=d.resize);switch(this.i){case A:this.b=32768;this.c=new (t?Uint8Array:Array)(32768+this.h+258);break;case y:this.b=0;this.c=new (t?Uint8Array:Array)(this.h);this.e=this.z;this.n=this.v;this.j=this.w;break;default:throw Error("invalid inflate mode");
}}var A=0,y=1,B={t:A,s:y};
w.prototype.k=function(){for(;!this.m;){var c=C(this,3);c&1&&(this.m=!0);c>>>=1;switch(c){case 0:var d=this.input,a=this.a,b=this.c,e=this.b,f=d.length,g=l,h=l,k=b.length,m=l;this.d=this.f=0;if(a+1>=f)throw Error("invalid uncompressed block header: LEN");g=d[a++]|d[a++]<<8;if(a+1>=f)throw Error("invalid uncompressed block header: NLEN");h=d[a++]|d[a++]<<8;if(g===~h)throw Error("invalid uncompressed block header: length verify");if(a+g>d.length)throw Error("input buffer is broken");switch(this.i){case A:for(;e+
g>b.length;){m=k-e;g-=m;if(t)b.set(d.subarray(a,a+m),e),e+=m,a+=m;else for(;m--;)b[e++]=d[a++];this.b=e;b=this.e();e=this.b}break;case y:for(;e+g>b.length;)b=this.e({p:2});break;default:throw Error("invalid inflate mode");}if(t)b.set(d.subarray(a,a+g),e),e+=g,a+=g;else for(;g--;)b[e++]=d[a++];this.a=a;this.b=e;this.c=b;break;case 1:this.j(ba,ca);break;case 2:for(var n=C(this,5)+257,p=C(this,5)+1,s=C(this,4)+4,x=new (t?Uint8Array:Array)(D.length),S=l,T=l,U=l,u=l,M=l,F=l,z=l,q=l,V=l,q=0;q<s;++q)x[D[q]]=
C(this,3);if(!t){q=s;for(s=x.length;q<s;++q)x[D[q]]=0}S=v(x);u=new (t?Uint8Array:Array)(n+p);q=0;for(V=n+p;q<V;)switch(M=E(this,S),M){case 16:for(z=3+C(this,2);z--;)u[q++]=F;break;case 17:for(z=3+C(this,3);z--;)u[q++]=0;F=0;break;case 18:for(z=11+C(this,7);z--;)u[q++]=0;F=0;break;default:F=u[q++]=M}T=t?v(u.subarray(0,n)):v(u.slice(0,n));U=t?v(u.subarray(n)):v(u.slice(n));this.j(T,U);break;default:throw Error("unknown BTYPE: "+c);}}return this.n()};
var G=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],D=t?new Uint16Array(G):G,H=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],I=t?new Uint16Array(H):H,J=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],K=t?new Uint8Array(J):J,L=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],da=t?new Uint16Array(L):L,ea=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,
13,13],N=t?new Uint8Array(ea):ea,O=new (t?Uint8Array:Array)(288),P,fa;P=0;for(fa=O.length;P<fa;++P)O[P]=143>=P?8:255>=P?9:279>=P?7:8;var ba=v(O),Q=new (t?Uint8Array:Array)(30),R,ga;R=0;for(ga=Q.length;R<ga;++R)Q[R]=5;var ca=v(Q);function C(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h;b<d;){if(f>=g)throw Error("input buffer is broken");a|=e[f++]<<b;b+=8}h=a&(1<<d)-1;c.f=a>>>d;c.d=b-d;c.a=f;return h}
function E(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h=d[0],k=d[1],m,n;b<k&&!(f>=g);)a|=e[f++]<<b,b+=8;m=h[a&(1<<k)-1];n=m>>>16;if(n>b)throw Error("invalid code length: "+n);c.f=a>>n;c.d=b-n;c.a=f;return m&65535}
w.prototype.j=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length-258,f,g,h,k;256!==(f=E(this,c));)if(256>f)b>=e&&(this.b=b,a=this.e(),b=this.b),a[b++]=f;else{g=f-257;k=I[g];0<K[g]&&(k+=C(this,K[g]));f=E(this,d);h=da[f];0<N[f]&&(h+=C(this,N[f]));b>=e&&(this.b=b,a=this.e(),b=this.b);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
w.prototype.w=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length,f,g,h,k;256!==(f=E(this,c));)if(256>f)b>=e&&(a=this.e(),e=a.length),a[b++]=f;else{g=f-257;k=I[g];0<K[g]&&(k+=C(this,K[g]));f=E(this,d);h=da[f];0<N[f]&&(h+=C(this,N[f]));b+k>e&&(a=this.e(),e=a.length);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
w.prototype.e=function(){var c=new (t?Uint8Array:Array)(this.b-32768),d=this.b-32768,a,b,e=this.c;if(t)c.set(e.subarray(32768,c.length));else{a=0;for(b=c.length;a<b;++a)c[a]=e[a+32768]}this.g.push(c);this.l+=c.length;if(t)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];this.b=32768;return e};
w.prototype.z=function(c){var d,a=this.input.length/this.a+1|0,b,e,f,g=this.input,h=this.c;c&&("number"===typeof c.p&&(a=c.p),"number"===typeof c.u&&(a+=c.u));2>a?(b=(g.length-this.a)/this.o[2],f=258*(b/2)|0,e=f<h.length?h.length+f:h.length<<1):e=h.length*a;t?(d=new Uint8Array(e),d.set(h)):d=h;return this.c=d};
w.prototype.n=function(){var c=0,d=this.c,a=this.g,b,e=new (t?Uint8Array:Array)(this.l+(this.b-32768)),f,g,h,k;if(0===a.length)return t?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);f=0;for(g=a.length;f<g;++f){b=a[f];h=0;for(k=b.length;h<k;++h)e[c++]=b[h]}f=32768;for(g=this.b;f<g;++f)e[c++]=d[f];this.g=[];return this.buffer=e};
w.prototype.v=function(){var c,d=this.b;t?this.r?(c=new Uint8Array(d),c.set(this.c.subarray(0,d))):c=this.c.subarray(0,d):(this.c.length>d&&(this.c.length=d),c=this.c);return this.buffer=c};function W(c,d){var a,b;this.input=c;this.a=0;if(d||!(d={}))d.index&&(this.a=d.index),d.verify&&(this.A=d.verify);a=c[this.a++];b=c[this.a++];switch(a&15){case ha:this.method=ha;break;default:throw Error("unsupported compression method");}if(0!==((a<<8)+b)%31)throw Error("invalid fcheck flag:"+((a<<8)+b)%31);if(b&32)throw Error("fdict flag is not supported");this.q=new w(c,{index:this.a,bufferSize:d.bufferSize,bufferType:d.bufferType,resize:d.resize})}
W.prototype.k=function(){var c=this.input,d,a;d=this.q.k();this.a=this.q.a;if(this.A){a=(c[this.a++]<<24|c[this.a++]<<16|c[this.a++]<<8|c[this.a++])>>>0;var b=d;if("string"===typeof b){var e=b.split(""),f,g;f=0;for(g=e.length;f<g;f++)e[f]=(e[f].charCodeAt(0)&255)>>>0;b=e}for(var h=1,k=0,m=b.length,n,p=0;0<m;){n=1024<m?1024:m;m-=n;do h+=b[p++],k+=h;while(--n);h%=65521;k%=65521}if(a!==(k<<16|h)>>>0)throw Error("invalid adler-32 checksum");}return d};var ha=8;r("Zlib.Inflate",W);r("Zlib.Inflate.prototype.decompress",W.prototype.k);var X={ADAPTIVE:B.s,BLOCK:B.t},Y,Z,$,ia;if(Object.keys)Y=Object.keys(X);else for(Z in Y=[],$=0,X)Y[$++]=Z;$=0;for(ia=Y.length;$<ia;++$)Z=Y[$],r("Zlib.Inflate.BufferType."+Z,X[Z]);}).call(this);



/*

	EffectComposers.js

	marge ....
		ShaderPass.js
		RenderPass.js
		MaskPass.js
		EffectComposer.js
		CopyShader.js

*/




/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity":  { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};




/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};

		var size = renderer.getDrawingBufferSize( new THREE.Vector2() );
		renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, parameters );
		renderTarget.texture.name = 'EffectComposer.rt1';

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();
	this.renderTarget2.texture.name = 'EffectComposer.rt2';

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.renderToScreen = true;

	this.passes = [];

	// dependencies

	if ( THREE.CopyShader === undefined ) {

		console.error( 'THREE.EffectComposer relies on THREE.CopyShader' );

	}

	if ( THREE.ShaderPass === undefined ) {

		console.error( 'THREE.EffectComposer relies on THREE.ShaderPass' );

	}

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

	this._previousFrameTime = Date.now();

};

Object.assign( THREE.EffectComposer.prototype, {

	swapBuffers: function () {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

		var size = this.renderer.getDrawingBufferSize( new THREE.Vector2() );
		pass.setSize( size.width, size.height );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	isLastEnabledPass: function ( passIndex ) {

		for ( var i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	},

	render: function ( deltaTime ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = ( Date.now() - this._previousFrameTime ) * 0.001;

		}

		this._previousFrameTime = Date.now();

		var currentRenderTarget = this.renderer.getRenderTarget();

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( THREE.MaskPass !== undefined ) {

				if ( pass instanceof THREE.MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof THREE.ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			var size = this.renderer.getDrawingBufferSize( new THREE.Vector2() );

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( size.width, size.height );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );

		for ( var i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( width, height );

		}

	}

} );


THREE.Pass = function () {

	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass indicates to swap read and write buffer after rendering
	this.needsSwap = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
	this.renderToScreen = false;

};

Object.assign( THREE.Pass.prototype, {

	setSize: function ( width, height ) {},

	render: function ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

} );

// Helper for passes that need to fill the viewport with a single quad.
THREE.Pass.FullScreenQuad = ( function () {

	var camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	var FullScreenQuad = function ( material ) {

		this._mesh = new THREE.Mesh( geometry, material );

	};

	Object.defineProperty( FullScreenQuad.prototype, 'material', {

		get: function () {

			return this._mesh.material;

		},

		set: function ( value ) {

			this._mesh.material = value;

		}

	} );

	Object.assign( FullScreenQuad.prototype, {

		render: function ( renderer ) {

			renderer.render( this._mesh, camera );

		}

	} );

	return FullScreenQuad;

} )();


/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: Object.assign( {}, shader.defines ),
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.fsQuad = new THREE.Pass.FullScreenQuad( this.material );
};

THREE.ShaderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.fsQuad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	}

} );



/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

	this.clear = true;
	this.clearDepth = false;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.RenderPass,

	render: function ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		this.scene.overrideMaterial = this.overrideMaterial;

		var oldClearColor, oldClearAlpha;

		if ( this.clearColor ) {

			oldClearColor = renderer.getClearColor().getHex();
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		if ( this.clearDepth ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
		if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
		renderer.render( this.scene, this.camera );

		if ( this.clearColor ) {

			renderer.setClearColor( oldClearColor, oldClearAlpha );

		}

		this.scene.overrideMaterial = null;
		renderer.autoClear = oldAutoClear;

	}

} );



/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.clear = true;
	this.needsSwap = false;

	this.inverse = false;

};

THREE.MaskPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.MaskPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var context = renderer.context;
		var state = renderer.state;

		// don't update color or depth

		state.buffers.color.setMask( false );
		state.buffers.depth.setMask( false );

		// lock buffers

		state.buffers.color.setLocked( true );
		state.buffers.depth.setLocked( true );

		// set up stencil

		var writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		state.buffers.stencil.setTest( true );
		state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
		state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
		state.buffers.stencil.setClear( clearValue );

		// draw into the stencil buffer

		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		// unlock color and depth buffer for subsequent rendering

		state.buffers.color.setLocked( false );
		state.buffers.depth.setLocked( false );

		// only render where stencil is set to 1

		state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );

	}

} );


THREE.ClearMaskPass = function () {

	THREE.Pass.call( this );

	this.needsSwap = false;

};

THREE.ClearMaskPass.prototype = Object.create( THREE.Pass.prototype );

Object.assign( THREE.ClearMaskPass.prototype, {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		renderer.state.buffers.stencil.setTest( false );

	}

} );




/**
 * @author bhouston / http://clara.io/
 *
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

THREE.LuminosityHighPassShader = {

	shaderID: "luminosityHighPass",

	uniforms: {

		"tDiffuse": { value: null },
		"luminosityThreshold": { value: 1.0 },
		"smoothWidth": { value: 1.0 },
		"defaultColor": { value: new THREE.Color( 0x000000 ) },
		"defaultOpacity": { value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec3 defaultColor;",
		"uniform float defaultOpacity;",
		"uniform float luminosityThreshold;",
		"uniform float smoothWidth;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",

			"float v = dot( texel.xyz, luma );",

			"vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );",

			"float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );",

			"gl_FragColor = mix( outputColor, texel, alpha );",

		"}"

	].join("\n")

};



/**
 * @author spidersharma / http://eduperiment.com/
 *
 * Inspired from Unreal Engine
 * https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */

THREE.UnrealBloomPass = function ( resolution, strength, radius, threshold ) {

	THREE.Pass.call( this );

	this.strength = ( strength !== undefined ) ? strength : 1;
	this.radius = radius;
	this.threshold = threshold;
	this.resolution = ( resolution !== undefined ) ? new THREE.Vector2( resolution.x, resolution.y ) : new THREE.Vector2( 256, 256 );

	// create color only once here, reuse it later inside the render function
	this.clearColor = new THREE.Color( 0, 0, 0 );

	// render targets
	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
	this.renderTargetsHorizontal = [];
	this.renderTargetsVertical = [];
	this.nMips = 5;
	var resx = Math.round( this.resolution.x / 2 );
	var resy = Math.round( this.resolution.y / 2 );

	this.renderTargetBright = new THREE.WebGLRenderTarget( resx, resy, pars );
	this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
	this.renderTargetBright.texture.generateMipmaps = false;

	for ( var i = 0; i < this.nMips; i ++ ) {

		var renderTargetHorizonal = new THREE.WebGLRenderTarget( resx, resy, pars );

		renderTargetHorizonal.texture.name = "UnrealBloomPass.h" + i;
		renderTargetHorizonal.texture.generateMipmaps = false;

		this.renderTargetsHorizontal.push( renderTargetHorizonal );

		var renderTargetVertical = new THREE.WebGLRenderTarget( resx, resy, pars );

		renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;
		renderTargetVertical.texture.generateMipmaps = false;

		this.renderTargetsVertical.push( renderTargetVertical );

		resx = Math.round( resx / 2 );

		resy = Math.round( resy / 2 );

	}

	// luminosity high pass material

	if ( THREE.LuminosityHighPassShader === undefined )
		console.error( "THREE.UnrealBloomPass relies on THREE.LuminosityHighPassShader" );

	var highPassShader = THREE.LuminosityHighPassShader;
	this.highPassUniforms = THREE.UniformsUtils.clone( highPassShader.uniforms );

	this.highPassUniforms[ "luminosityThreshold" ].value = threshold;
	this.highPassUniforms[ "smoothWidth" ].value = 0.01;

	this.materialHighPassFilter = new THREE.ShaderMaterial( {
		uniforms: this.highPassUniforms,
		vertexShader: highPassShader.vertexShader,
		fragmentShader: highPassShader.fragmentShader,
		defines: {}
	} );

	// Gaussian Blur Materials
	this.separableBlurMaterials = [];
	var kernelSizeArray = [ 3, 5, 7, 9, 11 ];
	var resx = Math.round( this.resolution.x / 2 );
	var resy = Math.round( this.resolution.y / 2 );

	for ( var i = 0; i < this.nMips; i ++ ) {

		this.separableBlurMaterials.push( this.getSeperableBlurMaterial( kernelSizeArray[ i ] ) );

		this.separableBlurMaterials[ i ].uniforms[ "texSize" ].value = new THREE.Vector2( resx, resy );

		resx = Math.round( resx / 2 );

		resy = Math.round( resy / 2 );

	}

	// Composite material
	this.compositeMaterial = this.getCompositeMaterial( this.nMips );
	this.compositeMaterial.uniforms[ "blurTexture1" ].value = this.renderTargetsVertical[ 0 ].texture;
	this.compositeMaterial.uniforms[ "blurTexture2" ].value = this.renderTargetsVertical[ 1 ].texture;
	this.compositeMaterial.uniforms[ "blurTexture3" ].value = this.renderTargetsVertical[ 2 ].texture;
	this.compositeMaterial.uniforms[ "blurTexture4" ].value = this.renderTargetsVertical[ 3 ].texture;
	this.compositeMaterial.uniforms[ "blurTexture5" ].value = this.renderTargetsVertical[ 4 ].texture;
	this.compositeMaterial.uniforms[ "bloomStrength" ].value = strength;
	this.compositeMaterial.uniforms[ "bloomRadius" ].value = 0.1;
	this.compositeMaterial.needsUpdate = true;

	var bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
	this.compositeMaterial.uniforms[ "bloomFactors" ].value = bloomFactors;
	this.bloomTintColors = [ new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ),
							 new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 1, 1, 1 ) ];
	this.compositeMaterial.uniforms[ "bloomTintColors" ].value = this.bloomTintColors;

	// copy material
	if ( THREE.CopyShader === undefined ) {

		console.error( "THREE.UnrealBloomPass relies on THREE.CopyShader" );

	}

	var copyShader = THREE.CopyShader;

	this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );
	this.copyUniforms[ "opacity" ].value = 1.0;

	this.materialCopy = new THREE.ShaderMaterial( {
		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,
		transparent: true
	} );

	this.enabled = true;
	this.needsSwap = false;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.basic = new THREE.MeshBasicMaterial();

	this.fsQuad = new THREE.Pass.FullScreenQuad( null );

};

THREE.UnrealBloomPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.UnrealBloomPass,

	dispose: function () {

		for ( var i = 0; i < this.renderTargetsHorizontal.length; i ++ ) {

			this.renderTargetsHorizontal[ i ].dispose();

		}

		for ( var i = 0; i < this.renderTargetsVertical.length; i ++ ) {

			this.renderTargetsVertical[ i ].dispose();

		}

		this.renderTargetBright.dispose();

	},

	setSize: function ( width, height ) {

		var resx = Math.round( width / 2 );
		var resy = Math.round( height / 2 );

		this.renderTargetBright.setSize( resx, resy );

		for ( var i = 0; i < this.nMips; i ++ ) {

			this.renderTargetsHorizontal[ i ].setSize( resx, resy );
			this.renderTargetsVertical[ i ].setSize( resx, resy );

			this.separableBlurMaterials[ i ].uniforms[ "texSize" ].value = new THREE.Vector2( resx, resy );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );

		}

	},

	render: function ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		this.oldClearColor.copy( renderer.getClearColor() );
		this.oldClearAlpha = renderer.getClearAlpha();
		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( this.clearColor, 0 );

		if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

		// Render input to screen

		if ( this.renderToScreen ) {

			this.fsQuad.material = this.basic;
			this.basic.map = readBuffer.texture;

			renderer.setRenderTarget( null );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		// 1. Extract Bright Areas

		this.highPassUniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.highPassUniforms[ "luminosityThreshold" ].value = this.threshold;
		this.fsQuad.material = this.materialHighPassFilter;

		renderer.setRenderTarget( this.renderTargetBright );
		renderer.clear();
		this.fsQuad.render( renderer );

		// 2. Blur All the mips progressively

		var inputRenderTarget = this.renderTargetBright;

		for ( var i = 0; i < this.nMips; i ++ ) {

			this.fsQuad.material = this.separableBlurMaterials[ i ];

			this.separableBlurMaterials[ i ].uniforms[ "colorTexture" ].value = inputRenderTarget.texture;
			this.separableBlurMaterials[ i ].uniforms[ "direction" ].value = THREE.UnrealBloomPass.BlurDirectionX;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			this.separableBlurMaterials[ i ].uniforms[ "colorTexture" ].value = this.renderTargetsHorizontal[ i ].texture;
			this.separableBlurMaterials[ i ].uniforms[ "direction" ].value = THREE.UnrealBloomPass.BlurDirectionY;
			renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			inputRenderTarget = this.renderTargetsVertical[ i ];

		}

		// Composite All the mips

		this.fsQuad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms[ "bloomStrength" ].value = this.strength;
		this.compositeMaterial.uniforms[ "bloomRadius" ].value = this.radius;
		this.compositeMaterial.uniforms[ "bloomTintColors" ].value = this.bloomTintColors;

		renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
		renderer.clear();
		this.fsQuad.render( renderer );

		// Blend it additively over the input texture

		this.fsQuad.material = this.materialCopy;
		this.copyUniforms[ "tDiffuse" ].value = this.renderTargetsHorizontal[ 0 ].texture;

		if ( maskActive ) renderer.state.buffers.stencil.setTest( true );

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( readBuffer );
			this.fsQuad.render( renderer );

		}

		// Restore renderer settings

		renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	},

	getSeperableBlurMaterial: function ( kernelRadius ) {

		return new THREE.ShaderMaterial( {

			defines: {
				"KERNEL_RADIUS": kernelRadius,
				"SIGMA": kernelRadius
			},

			uniforms: {
				"colorTexture": { value: null },
				"texSize": { value: new THREE.Vector2( 0.5, 0.5 ) },
				"direction": { value: new THREE.Vector2( 0.5, 0.5 ) }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"#include <common>\
				varying vec2 vUv;\n\
				uniform sampler2D colorTexture;\n\
				uniform vec2 texSize;\
				uniform vec2 direction;\
				\
				float gaussianPdf(in float x, in float sigma) {\
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
				}\
				void main() {\n\
					vec2 invSize = 1.0 / texSize;\
					float fSigma = float(SIGMA);\
					float weightSum = gaussianPdf(0.0, fSigma);\
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\
						float x = float(i);\
						float w = gaussianPdf(x, fSigma);\
						vec2 uvOffset = direction * invSize * x;\
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\
						diffuseSum += (sample1 + sample2) * w;\
						weightSum += 2.0 * w;\
					}\
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n\
				}"
		} );

	},

	getCompositeMaterial: function ( nMips ) {

		return new THREE.ShaderMaterial( {

			defines: {
				"NUM_MIPS": nMips
			},

			uniforms: {
				"blurTexture1": { value: null },
				"blurTexture2": { value: null },
				"blurTexture3": { value: null },
				"blurTexture4": { value: null },
				"blurTexture5": { value: null },
				"dirtTexture": { value: null },
				"bloomStrength": { value: 1.0 },
				"bloomFactors": { value: null },
				"bloomTintColors": { value: null },
				"bloomRadius": { value: 0.0 }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"varying vec2 vUv;\
				uniform sampler2D blurTexture1;\
				uniform sampler2D blurTexture2;\
				uniform sampler2D blurTexture3;\
				uniform sampler2D blurTexture4;\
				uniform sampler2D blurTexture5;\
				uniform sampler2D dirtTexture;\
				uniform float bloomStrength;\
				uniform float bloomRadius;\
				uniform float bloomFactors[NUM_MIPS];\
				uniform vec3 bloomTintColors[NUM_MIPS];\
				\
				float lerpBloomFactor(const in float factor) { \
					float mirrorFactor = 1.2 - factor;\
					return mix(factor, mirrorFactor, bloomRadius);\
				}\
				\
				void main() {\
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + \
													 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + \
													 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + \
													 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + \
													 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );\
				}"
		} );

	}

} );

THREE.UnrealBloomPass.BlurDirectionX = new THREE.Vector2( 1.0, 0.0 );
THREE.UnrealBloomPass.BlurDirectionY = new THREE.Vector2( 0.0, 1.0 );
