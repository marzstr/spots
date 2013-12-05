// Spots
// Author: Maria Strnal
// Game uses HTML5 Quintus Game Engine (more details on the engine can be found at HTML5Quintus.com)

/// <reference path="quintus-all.js" />
var APP_SCALE = 1;
var SPOT_SIZE = 120;
// Score of this level, kept track of in a global variable
var score = 0;

var Q = Quintus().include("Sprites, Scenes, Touch, UI");
// Q.setup("Spots");
Q.setup({maximize: true});
Q.touch(Q.SPRITE_ALL);

// Q.debug = true;
// Q.debugFill = true;

// need to calculate the height and width of the canvas and calculate number of spots
// and needed spacing of the indexes
// game canvas id= quintus
var APP_WIDTH = $("#quintus").attr("width");
var APP_HEIGHT = $("#quintus").attr("height");
console.log(APP_WIDTH +", "+ APP_HEIGHT);

var SPOT_HEIGHT_COUNT = Math.floor(APP_HEIGHT / SPOT_SIZE);
var SPOT_WIDTH_COUNT = Math.floor(APP_WIDTH / SPOT_SIZE);

console.log(SPOT_WIDTH_COUNT + ", "+ SPOT_HEIGHT_COUNT);

var index = function (x, width) {
    var i;
    var space = 1;
    if (width) {
        space = APP_WIDTH / SPOT_WIDTH_COUNT ;
        //console.log("Width space: "+ space);
        i= Math.floor(space / 2) + (x * space);
    } else {
        space = APP_HEIGHT / SPOT_HEIGHT_COUNT;
        //console.log("Height space: " + space);
        i = Math.floor(space / 2) + (x * space);
    }
    //console.log("Space between: " + space + ", index: " + i);
    return i;
};

var randomIndex = function(max) {
    var x = Math.floor((Math.random() * max));
    return x;
};

Q.Sprite.extend("SpotContainer", {
	init: function(p) {
		this._super(p);
		this.add("SpotsAI");
	}
});

Q.component("SpotsAI", {
	// AI component adding and deleting spots
	added: function(){
		//this.entity.p.spots = [];
		this.entity.p.canHaveNewSpot = true;
		this.entity.on("step", "newSpot");
	},

	extend: {
		newSpot: function () {
		    var entity = this;
	
			if(!entity.p.canHaveNewSpot)
				return;

			var randomSpot = randomIndex(4) + 1;
			var spot;
			if(randomSpot == 3){
				spot = Q.stage().insert(new Q.SpotGood());
			} 
			else {
				spot = Q.stage().insert(new Q.SpotBad());
			}
			entity.p.canHaveNewSpot = false;
			setTimeout(function() {
				entity.p.canHaveNewSpot = true;
			}, 800);

		}
	}
});

// Set up each spot as a sprite 
// each spot is 101 x 101 px 
// there are good spots and bad spots (depends on their colour) 
// each sprite will have a random timeout function that will allow it to disapear after a few seconds
Q.Sprite.extend("SpotGood", {
	init: function(p) {
		this._super(p, {
			// set the colour image
			asset: "SpotsGood.png",
            // scale: APP_SCALE,
            scale: 0.8,
			// set the random x
		    // set the random y
            x: index(randomIndex(SPOT_WIDTH_COUNT), true),
			y: index(randomIndex(SPOT_HEIGHT_COUNT), false),
		});

		this.on("touch");
	},

	touch: function (touch) {
	    // increase the score and show it
	    score += 10;
	    $("#score").text("Score: " + score);

	    // if the score is greater than 1000, then level is won
	    if (score >= 100) {
	        Q.clearStages();
            $("#pause").attr("style", "display:none");
	        $("#score").attr("style", "display:none");
	        $("#youwon").attr("style", "display:block");
	        Q.stageScene("GameOver", 1, { label: "Play Again" });
	    }
        //this.destroy();
	},

	step: function() {
		var entity = this;
		var randomSec = (randomIndex(5) + 1) * 1000;
		setTimeout(function() {
			// after the timers runs out, the spot automatically self destructs 
		    entity.destroy();
		}, randomSec);
	}
});

// Set up each spot as a sprite 
// each spot is 101 x 101 px 
// there are good spots and bad spots (depends on their colour) 
// each sprite will have a random timeout function that will allow it to disapear after a few seconds
Q.Sprite.extend("SpotBad", {
    init: function (p) {
        this._super(p, {
            // set the colour image
            asset: "SpotsBad.png",
            // scale: APP_SCALE,
            scale: 0.8,
            // set the random x
            // set the random y
            x: index(randomIndex(SPOT_WIDTH_COUNT), true),
            y: index(randomIndex(SPOT_HEIGHT_COUNT), false),
        });
        this.on("touch");
    },

    touch: function (touch) {
        // increase the score and show it
        score -= 10;
        $("#score").text("Score: " + score);

        // if the score is greater than 1000, then level is won
        if (score < 0) {
            Q.clearStages();
            $("#pause").attr("style", "display:none");
            $("#score").attr("style", "display:none");
            $("#gameover").attr("style", "display:block");
            Q.stageScene("GameOver", 1, { label: "Play Again" });
        }
        //this.destroy();
    },
    step: function () {
        var entity = this;
        var randomSec = (randomIndex(5) + 1) * 1000;
        setTimeout(function () {
            // After the time runs out, the spot self destructs 
            entity.destroy();
        }, randomSec);
    }
});

// Levels are determined by the scenes 
// Level variables include the random timers of the spots and the number of spots 
Q.scene("level1", function (stage) {
    $("#pause").attr("style", "display:block");
    $("#score").attr("style", "display:block");
	Q.gravity = 0;
	stage.insert(new Q.SpotContainer());

});

Q.scene("GameOver", function (stage) {
    
    var container = stage.insert(new Q.UI.Container({
        x: Q.el.width / 2,
        y: Q.el.height / 2
    }));

    var button = container.insert(new Q.UI.Button({
        // and link to "Play"
        scale: 1.5,
        label: stage.options.label,
        fontColor: "rgba(236, 240, 241, 1.0)",
        x: 0,
        y: -(Q.el.height/2 -45)

    }));

    button.on("click", function () {
        console.log("Touched");
        $(".notice").attr("style", "display:none");
        Q.clearStages();

         Q.stageScene("level1");

        score = 0;
        $("#score").text("Score: " + score);
    })

    container.fit(100, 100);
});

 
Q.load(["SpotsGood.png", "SpotsBad.png", "SpotsTitle.png"], function() {
    Q.stageScene("GameOver", 1, { label: "Play" });
    // $(".notice").attr("style", "display:none");
    // Q.stageScene("level1");
});

