/*
 * Our LD33 game
 * Copyright 2015 SKTeam/SKT Games.
 * Licensed under the MIT license
 */
"use scrict";
LD33.Game = function(game) 
{
	//GAME (PSEUDO)CONSTANTS
	this.INITIAL_LIFE = 3;
	this.INITIAL_FULL_HP = 3;

	//OBJECTS
    this.music1 = null;
    this.music2 = null;
    this.GOSprite = null;
	this.map = null;
	this.hero = null;
	this.cursor = null;
	this.GUI = null;
	this.enemyHit = null;
	this.bd = null;

	//SFX
	this.deathSound = null;
	this.getBonusSound = null;
	this.gotHitSound = null;
	this.hitMobSound = null;
	this.jumpSound = null;

	//ARRAYS
	this.item = [];
	this.layer = [];
	this.enemy = [];
	this.tuto = [];
	this.heroKey = "";

	//BOOLEAN
	this.isLeft = false;
	this.isFallingToDeath = false;
	this.isFight = false;
	this.isVulnerable = true;
	this.jumping=false;
	this.changeLevel = false;
	this.attack = false;
	this.canAttack = true;

	// HERO VARIABLES
	this.gravityY = 400;
	this.velocityX = 175;
	this.velocityY = -350;
	this.chuteX = -35;
	this.chuteY = 5;
	this.walkSec = 10; // WALK ANIMATION
	this.runSec = 12; // RUN ANIMATION
	this.repopX = 60;
	this.repopY = 430;
	this.oldY=0;
	this.heroState = 1;
	this.attackSec = 0;
	this.vulSec = 0;

	//GAME VARIABLES
	this.hp = 3;
	this.life = 1;
	this.fullHP = 3;
	//------------------------------------------
	this.currentBd = 1;
	//-----------------------------------------
	this.state = 0;

	//KEYS
	this.spaceKey = null;
	this.ctrlKey = null;
	this.xKey = null;
	this.majKey = null;
	this.wKey = null;

};

LD33.Game.prototype = 
{
    create: function()
	{
		// PUT NOTHING BEFORE THAT
        this.GUI = {
        	hpBar :{
        		game : null,
        		sprites : [],
        		x : 0,
        		y : 0,
        		init:function(game){
        			if(this.sprites.length > 0){
        				var len = this.sprites.length;
        				for(var i = 0; i < len ; i++ ){
        					this.sprites[i].destroy(true);
        				}
        				this.sprites = [];
        			}
        			this.game = game;
        			this.x = 30;
        			this.y = 20;
        			var len = 0;
        			for(var i = 0; i<this.game.hp;i++){
        				this.sprites.push(this.game.add.sprite(this.x+(i*19),this.y,'atlas'));
        				len = this.sprites.length -1;
        				this.sprites[len].frameName = "hpToken";
        				this.sprites[len].fixedToCamera = true;
        			}
        		},
        		update:function(){
        			var len = this.sprites.length;
	        		while(len-1 >= 0 && this.game.hp < len){
        				this.sprites[len-1].destroy(true);
        				this.sprites.splice(len-1 , 1);
        				len = this.sprites.length;
        			}
        			while(this.game.hp > len){
        				this.sprites.push(this.game.add.sprite(this.x+(len*19),this.y,'atlas'));
        				this.sprites[this.sprites.length -1].frameName = "hpToken";
        				this.sprites[this.sprites.length -1].fixedToCamera = true;
        				len = this.sprites.length;
        			}
        			
        		}
        	},// HPBAR OBJECT------------
        	lifeBar :{
        		game : null,
        		sprites : [],
        		x : 0,
        		y : 0,
        		init:function(game){
        			if(this.sprites.length > 0){
        				var len = this.sprites.length;
        				for(var i = 0; i < len ; i++ ){
        					this.sprites[i].destroy(true);
        				}
        				this.sprites = [];
        			}
        			this.game = game;
        			this.x = 750;
        			this.y = 20;
        			var len = 0;
        			for(var i = 0; i<this.game.life;i++){
        				this.sprites.push(this.game.add.sprite(this.x-(i*30),this.y,'atlas'));
        				len = this.sprites.length -1;
        				this.sprites[len].frameName = "lifeToken";
        				this.sprites[len].fixedToCamera = true;
        			}
        		},
        		update:function(){
        			var len = this.sprites.length;
	        		while(len-1 >= 0 && this.game.life < len){
        				this.sprites[len-1].destroy(true);
        				this.sprites.splice(len-1 , 1);
        				len = this.sprites.length;
        			}
        			while(this.game.life > len){
        				this.sprites.push(this.game.add.sprite(this.x+(len*19),this.y,'atlas'));
        				this.sprites[this.sprites.length -1].frameName = "lifeToken";
        				this.sprites[this.sprites.length -1].fixedToCamera = true;
        				len = this.sprites.length;
        			}
        			
        		}
        	}// LIFEBAR OBJECT------------
        }; //GUI OBJECT--------------------

        // BEGIN HERE
        this.initGame();

        // KEYS SETUP
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.ctrlKey = this.game.input.keyboard.addKey(17);
		this.xKey = this.game.input.keyboard.addKey(88);
		this.majKey = this.game.input.keyboard.addKey(16);
		this.wKey = this.game.input.keyboard.addKey(87);


        this.music1 = this.game.add.audio('gameMusic');
        this.music2 = this.game.add.audio('menuMusic');

        this.deathSound = this.game.add.audio("death");
        this.deathSound.volume = 0.65;
        this.getBonusSound = this.game.add.audio("getBonus");
        this.gotHitSound = this.game.add.audio("gotHit");
        this.hitMobSound = this.game.add.audio("hitMob");
        this.hitMobSound.volume = 0.5;
        this.jumpSound = this.game.add.audio("jump");
        this.jumpSound .volume = 0.60;


                		
    },//-CREATE-----------------------------------------------
    initGame:function(){
    	this.fullHP = this.INITIAL_FULL_HP;
    	this.hp = this.INITIAL_FULL_HP;
    	this.life = this.INITIAL_LIFE;

    	this.state = 0;
		this.isLeft = false;
		this.isFallingToDeath = false;
		this.isVulnerable = true;
		this.jumping=false;
		this.changeLevel = false;
		this.oldY=0;
		this.states = 0;
		this.canAttack = true;
		this.attack = false;
		this.attackSec = 0;
		this.vulSec = 0;
    },//-INIT GAME---------------------------------------------
    update: function() 
	{	
		switch(this.state)
		{
			case 0: // IF BD
				this.bdPop();
			break;
			case 1: // IF NOT GAMEOVER AND NOT BD
				this.checkTime();
				this.gamePsx();
				this.animation();
				this.keys();
				this.checkFight();
				this.checkDying();
				this.checkLevelChange();
				this.oldY = this.hero.body.y;
			break;
			case 2: // IF A GAMEOVER
				this.stopToGameOver();
			break;
			default:
				break;
		}
    },//-UPDATE-----------------------------------------------
	checkTime: function()
	{
		if(!this.canAttack && this.attackSec + 1 < LD33.sec)
			this.canAttack = true;
			
		if(this.attack && this.attackSec+0.3 < LD33.sec)
		{
			this.hero.body.setSize(this.hero.body.width-10,this.hero.body.height,0,0);
			this.attack = false;
		}
		if(!this.isVulnerable && this.vulSec+2 < LD33.sec)
		{
			this.isVulnerable = true;
			this.hero.alpha = 1;
		}
	},
    gamePsx:function(){
    	//HANDLE THE ENEMIES
		var len = this.enemy.length;
		for(var i=0 ; i< len; i++){
			if(this.enemy[i].key != "bat")
				this.game.physics.arcade.collide(this.enemy[i].sprite, this.layer[0]);
			if(!this.isFight && this.game.physics.arcade.overlap(this.hero, this.enemy[i].sprite))
			{
				this.enemyHit = i;
				this.isFight = true;
			}
			this.enemy[i].pattern(); // enemy pattern
		}

		// HANDLE THE ITEMS
		len = this.item.length;
		for(var i = 0; i<len; i++){
			if(this.game.physics.arcade.overlap(this.hero, this.item[i].sprite)){
				switch(this.item[i].name){
					case "hp":
						if(this.hp + 1 <= this.fullHP){ // TAKE A POTION
							this.getBonusSound.play();
							this.hp ++;
							this.item[i].sprite.destroy(true);
							this.item.splice(i,1);
							this.GUI.hpBar.update();
							len = -1;//splice means get outta here
						}
					break;
				}
			}
		}
		this.game.physics.arcade.collide(this.hero, this.layer[0]); // COLLIDE WITH MAP
    },//-GAME PSX-----------------------------------------------

    checkLevelChange:function(){
		if(this.changeLevel)
		{
			this.state = 0;
			this.changeLevel = false;
		}
    },//-CHECK LEVEL CHANGE-----------------------------------------------

    checkDying:function(){
		if(this.isFallingToDeath) // IS FALLING TO DEATH !
		{	
			this.hero.position.y += 10;
			if(this.hero.position.y > this.map.heightInPixels + 200) // DONE DYING
				this.killHero();
		}
		else if(this.hp < 1) // HAS LOST ALL HP
			this.killHero();
    },//-CHECK DYING-----------------------------------------------

    killHero:function(){
    	this.deathSound.play();
		this.canAttack = true;
		if(this.life > 0){ // STILL ENOUGH LIFE
			this.life --;
			this.GUI.lifeBar.update();
			this.spawn();
			this.hp = this.fullHP;
			this.GUI.hpBar.update();
			for(var i = 0 ; i< this.enemy.length ; i++){
				this.enemy[i].spawn();
			}
		}
		else{
			this.state = 2;
		}
    }, // KILL HERO-----------------------------------------------------

	checkFight:function()
	{
		if(this.isFight)
		{
			this.isFight = false;
			if(!this.attack || (!this.left && this.enemy[this.enemyHit].sprite.x < this.hero.x) || (this.left && this.enemy[this.enemyHit].sprite.x > this.hero.x))
			{
				if(this.isVulnerable)
				{
					this.gotHitSound.play();
					this.hp--;
					this.GUI.hpBar.update();
					this.isVulnerable = false;
					this.hero.alpha = 0.4;
					this.vulSec = LD33.sec;
					
					if(this.enemy[this.enemyHit].sprite.x)
						this.hero.x -= 10;
					else
						this.hero.x += 10;
					this.hero.y -= 5;
				}
			}
			else {
				if(this.enemy[this.enemyHit].hit()){
					this.enemy[this.enemyHit].sprite.destroy(true);
					this.enemy.splice(this.enemyHit,1);
				}
			}
			
		}
	},//-CHECK FIGHT-----------------------------------------------------

    keys:function(){
		// Keys
		if(this.cursors.left.isDown)
			this.goLeft();
		else if(this.cursors.right.isDown)
			this.goRight();
		else if(!this.jumping && !this.attack){
			this.hero.frameName = this.heroState + "idle";
			this.hero.body.velocity.x = 0;
		}
		/*else if(this.attack && this.hero.body.onFloor())
				this.hero.body.velocity.x = 0;*/

		if(this.hero.body.onFloor())
			(this.cursors.up.isDown || this.spaceKey.isDown) && this.goUp();
		else
		{
			this.hero.body.velocity.y += this.chuteY;
			if(this.cursors.right.isDown)
				this.hero.body.velocity.x += this.chuteX;
			else if(this.cursors.left.isDown)
				this.hero.body.velocity.x -= this.chuteX;
		}
		
		if((this.ctrlKey.isDown||this.xKey.isDown) && this.canAttack && this.heroState > 1)
		{
			this.hitMobSound.play();
			this.canAttack = false;
			this.attack = true;
			this.attackSec = LD33.sec;

			if(!this.isLeft){ // FACING LEFT

				this.hero.body.setSize(this.hero.body.width+10,this.hero.body.height,+5,0);
			}
			else{ // FACING RIGHT
				this.hero.body.setSize(this.hero.body.width+10,this.hero.body.height,-5,0);		
			}
		}
		//------------------------------------------------------------
		if((this.majKey.isDown || this.wKey.isDown) && this.heroState > 3 ){
			this.velocityX = 260;
			this.velocityY = -390;
			this.runing = true;
		}else{
			this.velocityX = 175;
			this.velocityY = -350;
			this.runing = false;	
		}
		
    },//---KEYS------------------------------------------

    animation:function(){
		//jump animation
		if(this.attack)
		{
			this.hero.frameName =this.heroState + "punch";
			if(this.hero.body.onFloor())
				this.hero.body.velocity.x = 0;
			
		}
		else if(this.jumping){

			if(this.hero.body.onFloor()){
				this.jumping = false;
				this.hero.frameName = this.heroState + "idle";
			}
			else if(this.hero.body.y < this.oldY)
			{
				this.hero.animations.stop();
				this.hero.frameName = this.heroState + "jump01";
			}
			else
			{
				this.hero.animations.stop();
				this.hero.frameName = this.heroState + "jump02";
			}
		}
    }, // ANIMATION ------------

    stopToGameOver:function(){
		//STOP EVERYTHING
		if(this.hero != null)
		{
			this.currentBd = 1;
			this.cursors = null
			this.hero.destroy(true);
			this.gameOverPop();
			this.hero = null;
		}
		
		for(var i=0 ;i<this.enemy.length ; i++){ // STILL SHOW THE ENEMIS AND MAKE THEM MOVE
			this.game.physics.arcade.collide(this.enemy[i].sprite, this.layer[0]);
			this.enemy[i].pattern(); // enemy pattern
		}
    },// STOP TO GAMEOVER------------------------------

    //Game over---------
    gameOverPop:function(){
    	this.GOSprite = this.game.add.button(0,0,"gameOver",this.restart,this);
    	this.GOSprite.fixedToCamera = true;
    },

    restart:function(pointer){
    	this.GOSprite.destroy(true);
    	this.initGame();
    },
    //--------------------------------------------

    // Comics--------
	bdPop:function()
	{
		if(this.bd == null)
		{
			if(this.currentBd <= 5)
				this.bd = this.game.add.button(0,0,"BD"+this.currentBd,this.bdEnd,this);
			else
				this.bd = this.game.add.sprite(0,0,"BD6");
			this.bd.fixedToCamera = true;
			
			this.music1.restart();
			this.music1.stop();
			this.music2.loopFull();
		}
	},
	bdEnd:function()
	{
		this.music2.restart();
		this.music2.stop();
		this.music1.loopFull();
		this.bd.destroy(true);
		this.bd = null;
		this.state = 1;
		this.loadMap("lvl"+this.currentBd);
		this.currentBd++;
	},
	//---------------------------------------------

    //Load a map
    loadMap:function(key){
    	if(key != undefined){
	    	//init
	    	var len = this.layer.length;

	    	for(var i = 0; i < len ; i++)
	    		this.layer[i].destroy(true);

	    	len = this.enemy.length;
	    	for(var i = 0; i < len ; i++)
	    		this.enemy[i].sprite.destroy(true);

	    	len = this.tuto.length;
	    	for(var i = 0; i < len ; i++)
	    		this.tuto[i].destroy(true);

	    	len = this.item.length;
	    	for(var i = 0; i < len ; i++)
	    		this.item[i].sprite.destroy(true);

	    	this.layer = [];
			this.enemy = [];
			this.tuto = [];
			this.item = [];

	    	if(this.map !=null){
	    		this.map.destroy(true);
	    	}
	    	this.map = null;
	    	this.map = this.game.add.tilemap(key);
	    	this.map.addTilesetImage('tileset','mapTs');
	    	this.map.setCollisionBetween(0,2); 
	    	this.map.setCollisionBetween(9,10); 
	    	this.map.setCollisionBetween(16,16); 
	    	this.heroKey = "hero";

	    	//level-specific values
	    	if(key == "lvl1"){
	    		this.repopX = 60;
	    		this.repopY = 430;
	    		this.heroState = 1;
	    		this.fullHP = 3;
	    	}
	    	else if(key == "lvl2"){
	    		this.repopX = 60;
	    		this.repopY = 400;
	    		this.heroState = 2;
	    		this.fullHP = 3;
	    	}
	    	else if(key == "lvl3"){
	    		this.repopX = 60;
	    		this.repopY = 200;
	    		this.heroState = 3;
	    		this.fullHP = 5;
	    		this.hp = 5;
	    	}
	    	else if(key == "lvl4"){
	    		this.repopX = 60;
	    		this.repopY = 400;
	    		this.heroState = 4;
	    		this.fullHP = 5;
	    	}
	    	else if(key == "lvl5"){
	    		this.repopX = 60;
	    		this.repopY = 1870;
	    		//this.repopX = 3330;
	    		//this.repopY = 30;
	    		this.heroState = 5;
	    		this.fullHP = 7;
	    	}//LEVEL SPECIFIC VALUES-------------------------

	    	//Load layers
	    	for(var i = 0 ; i < this.map.layers.length ; i++){
	    		this.layer[i] = this.map.createLayer(this.map.layers[i].name);
	    	}
			//----------- 
			this.layer[0].resizeWorld();

			//Collision callbacks
			this.map.setTileIndexCallback(6,this.finishLevel,this); // Hit a door

			this.map.setTileIndexCallback(8,this.fallToDeath,this); // Hit a hole
			this.map.setTileIndexCallback(15,this.fallToDeath,this); // Hit a hole

			//Load objects
			len = this.map.objects.objects.length;
			for(var i = 0; i < len; i++){
				var tmp = this.map.objects.objects[i];
				if(tmp.type == "enemy");
				else if(tmp.type == "item"){
					this.item.push({
						sprite: this.game.add.sprite(tmp.x,tmp.y,'atlas'),
						name:tmp.name,
						init:function(){
							switch(this.name){
								case "hp":
									this.sprite.frameName = "potion";
								break;
								default:break;
							}
						},
					});
					this.item[this.item.length -1].init();
				} // LOAD ITEMS-----------
				else if(tmp.type == "tuto"){
					this.tuto.push(this.game.add.sprite(tmp.x,tmp.y,'atlas'));
					switch(tmp.name){
						case '1' : this.tuto[this.tuto.length-1].frameName = "tuto1"; break;
						case '2' : this.tuto[this.tuto.length-1].frameName = "tuto2"; break;
						case '3' : this.tuto[this.tuto.length-1].frameName = "tuto3"; break;
						case '4' : this.tuto[this.tuto.length-1].frameName = "tuto4"; break;
					}
					
				}// LOAD TUTOS -----------
			}
			for(var i=0 ; i<this.item.length; i++)
				this.game.physics.arcade.enable(this.item[i].sprite);
			//Spawn the hero
			this.spawn();
			// Print the gui
			this.GUI.hpBar.init(this);
	        this.GUI.lifeBar.init(this);
    	}
    },//-LOADMAP-----------------------------------------------
	//LeftKey
	goLeft: function()
	{
		this.hero.body.velocity.x = this.velocityX * -1;

		if(!this.isLeft){
			this.hero.scale.x = 1;
			this.isLeft = true;
		}
		if(!this.jumping){
			if(!this.runing)
				this.hero.animations.play('walk',this.walkSec);
			else
				this.hero.animations.play('run',this.runSec);
		}
	},
	//RightKey
	goRight: function()
	{
		this.hero.body.velocity.x = this.velocityX;

		if(this.isLeft){
			this.isLeft = false;
			this.hero.scale.x = -1;
		}
		if(!this.jumping){
			if(!this.runing)
				this.hero.animations.play('walk',this.walkSec);
			else
				this.hero.animations.play('run',this.runSec);
		}
	},
	//Jump
	goUp: function()
	{
		this.hero.body.velocity.y = this.velocityY;
		this.jumping = true;
		this.jumpSound.play();
	},
	//Go trough a door
	finishLevel: function(sprite,tile)
	{
		if(this.hero!= null && this.cursors.up.isDown && sprite.key == this.heroKey)
			this.changeLevel = true;

	},
	//Hitting a hole :
	fallToDeath: function(sprite,tile)
	{
		if(sprite.key == this.heroKey) // If the hero hit a hole
		{
			if(this.isFallingToDeath == false)
			{
				this.isFallingToDeath = true;
				this.hero.body.moves = false;
			}
		}

	},
	//Spawn the hero
	spawn: function()
	{
		// init
		//enemy
		var len1 = this.enemy.length;
	    for(var i = 0; i < len1 ; i++)
	    		this.enemy[i].sprite.destroy(true);
		this.enemy = [];

		var len2 = this.map.objects.objects.length;

		for(var i = 0; i < len2; i++)
		{
			var tmp = this.map.objects.objects[i];
			if(tmp.type == "enemy")
			{
				this.enemy.push(new LD33.Enemy(this, tmp.x, tmp.y, tmp.name));
			}
		}
		this.oldY=0;
		this.isLeft = false;
		this.isFallingToDeath = false;
		this.isVulnerable = true;
		this.jumping=false;
		this.cursors = this.game.input.keyboard.createCursorKeys();
		if(this.hero != null)
			this.hero.destroy(true);
		this.hero = null;

		this.hero = this.game.add.sprite(this.repopX,this.repopY,this.heroKey);//Load the hero spritesheet depending on the key
		this.game.physics.arcade.enable(this.hero);
		// Animations
		this.hero.animations.add('still',[String(this.heroState + "idle")]);
		this.hero.animations.add('walk',[String(this.heroState + "walk01"),String(this.heroState + "walk02"),String(this.heroState + "walk02"),String(this.heroState + "walk03")]);
		this.hero.animations.add('run',[String(this.heroState + "run01"),String(this.heroState + "run02"),String(this.heroState + "run02"),String(this.heroState + "run03")]);

		this.hero.frameName = this.heroState + "idle";
		this.hero.scale.x = -1; // turn right
		this.hero.anchor.setTo(0.5,0.5);

		this.hero.body.bounce.y = 0;
		this.hero.body.gravity.y = this.gravityY;
		this.hero.body.collideWorldBounds = true;

		// Camera
		this.game.camera.reset();
		this.game.camera.follow(this.hero);

	}//-SPAWN-----------------------------------------------
}
