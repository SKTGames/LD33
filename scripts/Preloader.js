/*
 * Our LD33 game
 * Copyright 2015 SKTeam/SKT Games.
 * Licensed under the MIT license
 */
"use scrict";
LD33.Preloader = function(game)
{
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

LD33.Preloader.prototype = {
	
	preload: function () 
	{
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.game.load.setPreloadSprite(this.preloadBar);


		// Load the assets
		//Menu
        this.game.load.image('startBg', './assets/images/menuBg.png');
		this.game.load.image('start', './assets/images/startBtn.png');
		
		//Audio
        this.game.load.audio('menuMusic', ['./assets/audio/menuTheme.ogg','./assets/audio/menuTheme.mp3']);
		this.game.load.audio('gameMusic', ['./assets/audio/mainTheme.ogg','./assets/audio/mainTheme.mp3']);

		this.game.load.audio('death' , './assets/audio/death.wav');
		this.game.load.audio('getBonus', './assets/audio/getBonus.wav');
		this.game.load.audio('gotHit', './assets/audio/gotHit.wav');
		this.game.load.audio('hitMob', './assets/audio/hitMob.wav');
		this.game.load.audio('jump', './assets/audio/jump.wav');
		
		this.game.load.tilemap('lvl1','./assets/data/lvl1.json',null,Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('lvl2','./assets/data/lvl2.json',null,Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('lvl3','./assets/data/lvl3.json',null,Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('lvl4','./assets/data/lvl4.json',null,Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('lvl5','./assets/data/lvl5.json',null,Phaser.Tilemap.TILED_JSON);
		this.game.load.image('mapTs','./assets/images/mapTs.png');
		
		//Hero 
		this.game.load.atlas('hero','./assets/images/spritesheets/hero.png','./assets/data/hero.json');
		//Enemy
		this.game.load.atlas('enemy','./assets/images/spritesheets/enemy.png','./assets/data/enemy.json');
		//Atlas
		this.game.load.atlas('atlas','./assets/images/atlas.png','./assets/data/atlas.json');
		//Bd
		this.game.load.image('BD1','./assets/images/BD1.jpg');
		this.game.load.image('BD2','./assets/images/BD2.jpg');
		this.game.load.image('BD3','./assets/images/BD3.jpg');
		this.game.load.image('BD4','./assets/images/BD4.jpg');
		this.game.load.image('BD5','./assets/images/BD5.jpg');
		this.game.load.image('BD6','./assets/images/finalBD.jpg');
		this.game.load.image('gameOver','./assets/images/gameOver.png');
		
	},

	create: function () 
	{
		this.preloadBar.cropEnabled = false; // On a fini de charger, on ne crop pas la barre (full)
	},

	update: function () {
        if(this.cache.isSoundDecoded('menuMusic') && this.cache.isSoundDecoded('gameMusic') && this.ready == false) //En + de charger la musique il faut la décoder
		{ 
            this.ready = true;
            this.game.state.start('StartMenu');
        }
	}
};