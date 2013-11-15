// Spots Game using HTML5 Quintus
var index = function(x) {
	return 35 + (x * 84);
};

var randomIndex = function(max) {
	var x = Math.floor((Math.random() * max));
	return x;

};

var maxNumberSpots = 10;

var Q = Quintus()
		.include("Sprites, Scenes, Touch")
		.setup("spots")
		.touch();

Q.Sprite.extend("SpotContainer", {
	init: function(p) {
		this._super(p, {
			type: Q.SPRITE_FRIENDLY
		});

		this.add("SpotsAI");
	}
});

Q.component("SpotsAI", {
	// AI component adding and deleting spots
	added: function(){
		this.entity.p.spots = [];
		this.entity.p.canHaveNewSpot = true;
		this.entity.on("step", "checkSpots");
	},

	extend: {
		checkSpots: function(){
			var entity = this;

			for (var i = entity.p.spots.length -1; i >= 0; i--){
				if(entity.p.spots[i].isDestroyed) {
					entity.p.spots.splice(i,1);
				}
			}

			entity.newSpot();

		},

		newSpot: function () {
			var entity = this;
			
			if(!entity.p.canHaveNewSpot || entity.p.spots.length > maxNumberSpots)
				return;

			var randomSpot = randomIndex(4) + 1;
			var spot;
			if(randomSpot == 3){
				spot = Q.stage().insert(new Q.SpotGood());

			} 
			else {
				//spot = Q.stage().insert(new Q.SpotBad());
			}
			entity.p.spots.push(spot);
			entity.p.canHaveNewSpot = false;
			setTimeout(function() {
				entity.p.canHaveNewSpot = true;
			}, 1000);

		}
	}
});

// Set up each spot as a sprite 
// each spot is 69 x 69 px 
// there are good spots and bad spots (depends on their colour) 
// each sprite will have a random timeout function that will allow it to disapear after a few seconds
Q.Sprite.extend("SpotGood", {
	init: function(p) {
		this._super(p, {
			// set the colour image
			asset: "SpotGood.png",

			// set the random x
			// set the random y
			 x: index(randomIndex(6)),
			 y: index(randomIndex(4)),
		});
	},
	step: function() {
		var entity = this;
		var randomSec = (randomIndex(5) + 1) * 1000;
		setTimeout(function() {
			// what to do? 
			entity.destroy();
			
		}, randomSec);
	}
});

// Levels are determined by the scenes 
// Level variables include the random timers of the spots and the number of spots 
Q.scene("level1", function (stage) {
	Q.gravity = 0;
	stage.insert(new Q.SpotContainer());

});
// The user uses the Touch() to trigger a destroy of a spot and a change in the score
// Use the "obj" variable in Touch() to modify the touched spot
// use on "touch" event

Q.load(["SpotGood.png", "SpotBad.png"], function() {
	Q.stageScene("level1");
});