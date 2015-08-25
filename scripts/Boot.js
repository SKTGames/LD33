/*!
 * Our LD33 game
 * Copyright 2015 SKTeam/SKT Games.
 * Licensed under the MIT license
 */
"use scrict";
var LD33 = 
{
	sec : 0.0,
	chrono: setInterval(function() 
	{
		LD33.sec +=0.1;
	}, 100),
};

LD33.Boot = function(game)
{
	
};



LD33.Boot.prototype =
{
    preload: function() 
	{
        this.game.load.image('preloaderBar', './assets/images/loader_bar.png');
    },
    
    create: function() 
	{
        this.game.stage.disableVisibilityChange = false;
        this.game.stage.forcePortrait = true;
        this.game.stage.backgroundColor = '#000';

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.parentIsWindow = true;
		this.game.scale.minWidth = 600; /* (minimum 75% de la taile du jeu)*/
        this.game.scale.minHeight = 450; /* (minimum 75% de la taile du jeu)*/
        this.game.scale.maxWidth = 1000; /* (maximum 125% de la taile du jeu)*/
        this.game.scale.maxHeight = 750; /* (maximum 125% de la taile du jeu)*/

        this.game.input.maxPointers = 1; //un seul pointeur max (ecrans tactiles)
		this.game.input.addPointer();
        
		//this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preloader');
    }
}