/*
 * Our LD33 game
 * Copyright 2015 SKTeam/SKT Games.
 * Licensed under the MIT license
 */
"use scrict";
LD33.StartMenu = function(game) 
{
    this.startBG = null;
    this.startPrompt = null;
    this.music = null;
}

LD33.StartMenu.prototype = 
{
	create: function () 
	{
		this.background = this.game.add.image(0,0,"startBg");
		this.Startbutton = this.game.add.button(245,132,"start",this.startGame,this);
		this.music = this.game.add.audio('menuMusic');
        this.music.loopFull();
	},

	startGame: function (pointer) 
	{
		this.music.stop();
		this.game.state.start('Game');
	}
};