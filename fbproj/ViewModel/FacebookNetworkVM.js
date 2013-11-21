
var SceneParams = {
	camera: {
		viewAngle: 45,
		aspect: 500/400,
		near: 0.1,
		far: 10000,
		position: {
			x: 0,
			y: 0,
			z: 600
		}
	},
	renderer: {
		width: 500,
		height: 400
	}
};

var NetworkConstants = {
	initX: 40,
	initY: 20,
	initZ: 0
};

var CubeConstants = {
	width: 50,
	height: 50,
	length: 50
};

var TextPlaneConstants = {
	outX: -10,
	outY: +10,
	outZ: +40,
	font: "Bold 40px Arial",
	fillStyle: "rgba(0,0,0,0.99)"
};

var DetectingIntersectionsParams = {
	x: 0,
	y: 0,
	userHasClicked: false
};

var DirectionVectorCoords = {
	x: (DetectingIntersectionsParams.x / SceneParams.renderer.width) * 2 - 1,
	y: -(DetectingIntersectionsParams.y / SceneParams.renderer.height) * 2 + 1
};

var FacebookNetworkVM = function (data) {
	var self = this;

	self.friends = null;

	self.container = null;
	self.scene = null;
	self.camera = null;
	self.renderer = null;

	var projector, raycaster;
	var directionVector = new THREE.Vector3();

	var mouse = new THREE.Vector2(), INTERSECTED, objArray = new Array();

	var flag = 0;
	var posX, posY;

	self.initializeScene = function () {
		self.scene = new THREE.Scene();
	};
	self.initializeCamera = function () {
		self.camera = new THREE.PerspectiveCamera(SceneParams.camera.viewAngle, SceneParams.camera.aspect, SceneParams.camera.near, SceneParams.camera.far);
		self.camera.position.x = SceneParams.camera.position.x;
		self.camera.position.y = SceneParams.camera.position.y;
		self.camera.position.z = SceneParams.camera.position.z;
	};
	self.initializeRenderer = function () {
		self.renderer = new THREE.CanvasRenderer();
		self.renderer.setSize(SceneParams.renderer.width, SceneParams.renderer.height);
	};
	self.initializeContainer = function () {
		self.container = document.getElementById("container");
		var idk = document.createElement("div");
		self.container.appendChild(idk);

		self.container.addEventListener("mousedown", function (event) { onMouseDown(event); }, false);
		self.container.addEventListener("mousemove", function (event) { onMouseMove(event); }, false);
		self.container.addEventListener("mouseup", function (event) { onMouseUp(event); }, false);
		self.container.addEventListener("mousewheel", function (event) { onMouseWheel(event); }, false);
		self.container.addEventListener("click", function (event) { onMouseClick(event); }, false);
	};

	function render() {
		self.camera.lookAt(self.scene.position);

		directionVector.set(DirectionVectorCoords.x, DirectionVectorCoords.y, 1);

		projector.unprojectVector(directionVector, self.camera);
		directionVector.normalize();

		raycaster.set(self.camera.position, directionVector);

		var intersects = raycaster.intersectObjects(self.scene.children);
		if (intersects.length > 0) {
			drawAndRemoveTextPlane();
		}

		self.renderer.render(self.scene, self.camera);
	};

	function animate() {
		requestAnimationFrame(animate);
		render();
	};

	function onMouseDown(event) {
		flag = 1;

		posX = event.clientX;
		posY = event.clientY;
	};

	function onMouseMove(event) {
		if (flag == 1) {
			var currX = event.clientX, currY = event.clientY;

			if (posX > currX) {
				self.camera.position.x += (posX - currX);
				self.renderer.render(self.scene, self.camera);
			}
			else {
				self.camera.position.x -= (currX - posX);
				self.renderer.render(self.scene, self.camera);
			}
			if (posY > currY) {
				self.camera.position.y -= (posY - currY);
				self.renderer.render(self.scene, self.camera);
			}
			else {
				self.camera.position.y += (currY - posY);
				self.renderer.render(self.scene, self.camera);
			}

			self.camera.updateMatrix();
		}
	};

	function onMouseUp(event) {
		flag = 0;
	};

	function onMouseWheel(event) {
		event.preventDefault();
		self.camera.fov -= event.wheelDeltaY * 0.05;
		self.camera.updateProjectionMatrix();
		//            renderer.render(scene, camera);
	};

	function onMouseClick(event) {
		DetectingIntersectionsParams.userHasClicked = true;
		DetectingIntersectionsParams.x = event.clientX;
		DetectingIntersectionsParams.y = event.clientY;
	};

	function drawCube(outX, outY, outZ, imgSrc, name) {
		var cube = new THREE.Mesh(new THREE.CubeGeometry(CubeConstants.width, CubeConstants.height, CubeConstants.length), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(imgSrc), overdraw: true }));
		cube.overdraw = true;
		cube.position.x = outX;
		cube.position.y = outY;
		cube.position.z = outZ;


		cube.position.needsUpdate = true;
		cube.dynamic = true;
		cube.name = name;

		objArray.push(cube);
		self.scene.add(cube);
	};

	function drawEdge3(vertex0, vertex1, type) {
		var color = (type ? 0x00aaff : 0xff0000);
		var line_geometry = new THREE.Geometry();
		line_geometry.vertices.push(new THREE.Vector3(vertex0[0], vertex0[1], vertex0[2]));
		line_geometry.vertices.push(new THREE.Vector3(vertex1[0], vertex1[1], vertex1[2]));

		var line = new THREE.Line(line_geometry, new THREE.LineBasicMaterial({ color: color, linewidth: 1 }));
		self.scene.add(line);
	};

	function drawAndRemoveTextPlane() {
		var target, plane;
		target = intersects[0].object;

		var canvas1 = document.createElement('canvas');
		var context1 = canvas1.getContext('2d');

		context1.font = TextPlaneConstants.font;
		context1.fillStyle = TextPlaneConstants.fillStyle;
		context1.fillText(target.name, 0, 50);

		var texture1 = new THREE.Texture(canvas1)
		texture1.needsUpdate = true;

		var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
		material1.transparent = true;

		var geometry = new THREE.PlaneGeometry(50, 50);

		plane = new THREE.Mesh(geometry, material1);
		plane.position.x = target.position.x + TextPlaneConstants.outX;
		plane.position.y = target.position.y + TextPlaneConstants.outY;
		plane.position.z = target.position.z + TextPlaneConstants.outZ;
		plane.rotation.x = self.camera.rotation.x;
		plane.rotation.y = self.camera.rotation.y;
		plane.rotation.z = self.camera.rotation.z;

		self.scene.add(plane);

		setTimeout(function () {
			self.scene.remove(plane);
		}, 10);
	};

	function init() {

		self.initializeContainer();
		self.initializeScene();
		self.initializeCamera();
		self.initializeRenderer();

		projector = new THREE.Projector();
		raycaster = new THREE.Raycaster();

		var n = 5;

		var main_pic = "http://profile.ak.fbcdn.net/hprofile-ak-prn2/1117256_100000104723685_1282577297_q.jpg";
		var pic = "http://profile.ak.fbcdn.net/hprofile-ak-ash4/202838_100000138502847_1971065999_q.jpg";

		function drawNetwork(vertices) {

			var cube_hypotenuse = Math.ceil(Math.sqrt(2 * Math.pow(CubeConstants.length, 2)));
			var between_cubes = cube_hypotenuse;
			var circle_length = (vertices - 1) * cube_hypotenuse + (vertices - 2) * between_cubes;
			var radius = Math.ceil((0.5 * circle_length) / Math.PI);

			var cos_theta = (2 * Math.pow(radius, 2) - Math.pow(radius, 2)) / (2 * Math.pow(radius, 2));
			var theta = Math.floor(Math.acos(cos_theta) + Math.PI / 18);

			var pointX, pointY, pointZ, ptX, ptY, ptZ;

			drawCube(NetworkConstants.initX, NetworkConstants.initY, NetworkConstants.initZ, main_pic, "YOANA");

			var arr = ["name0", "name1", "name2", "name3"];
			for (var i = 0; i <= (vertices - 2); i++) {

				//kato dnk

				pointX = NetworkConstants.initX + radius * Math.cos(theta * i) * Math.sin(theta * i);
				pointY = NetworkConstants.initY + radius * Math.sin(theta * i) * Math.sin(theta * i);
				pointZ = NetworkConstants.initZ + radius * Math.cos(theta * i);

				drawCube(pointX, pointY, pointZ, self.friends[i].pic_square, self.friends[i].uid);
				drawEdge3([NetworkConstants.initX, NetworkConstants.initY, NetworkConstants.initZ], [pointX, pointY, pointZ]);
			}
		};

		drawNetwork(n);
		self.container.appendChild(self.renderer.domElement);

	};

	self.initialize = function () {
		data.getFriends(function (friendsData) {
			self.friends = friendsData();
		});
		function helper(callback) {
			$.each(self.friends, function (index, friend) {
				friend.friends = [];
				FacebookCommunication().getMutualFriends(friend.uid, function (mutualFriendsArray) {
					//console.log("mutual friends with ", friend.name, " :  ", mutualFriendsArray);
					$.each(mutualFriendsArray.data, function (index, mutualFriend) {
						if ((!mutualFriend.friends)) { // || (mutualFriend.friends && !mutualFriend.friends.indexOf(friend))) {
							friend.friends.push(mutualFriend);
						}
					});
				});
			});
			$.each(self.friends, function (index, friend) {
				//console.log("mutual friends: ", friend.friends);
			});
			callback();
		};
		helper(function () {
			init();
			animate();
		});
	};

	self.showContentArea = function () {
		data.showContentArea();
	};

	return self;
};