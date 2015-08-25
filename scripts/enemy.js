/*!
 * Our LD33 game
 * Copyright 2015 SKTeam/SKT Games.
 * Licensed under the MIT license
 */
"use scrict";
LD33.Enemy = function(gameState,x,y,key)
{
	this.gameState = gameState;
	this.game = gameState.game;
	this.key = key;
	this.sprite = null;
	this.walkSec = 5;
	this.repopX = x;
	this.repopY = y;
	this.velocityX = 225;
	this.velocityY = 0;
	this.gravityY = 400;
	this.left = false;
	this.reflexion = true;
	this.map = null;
	this.collWorld = true;
	this.framePause = null;
	this.reflexionSec = 0;
	this.reflexionTime = null;
	this.init(key);
};

LD33.Enemy.prototype =
{
	init: function() //options are initialized
	{
		this.map = this.gameState.map;
        this.sprite = this.game.add.sprite(this.repopX,this.repopY,"enemy");
		this.choiceEnemy(this.key);
		
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.game.physics.arcade.enable(this.sprite);
		this.sprite.body.bounce.y = 0;
		this.sprite.body.gravity.y = this.gravityY;
		this.sprite.body.collideWorldBounds = this.collWorld;

		this.sprite.body.velocity.y = this.velocityY;
		
		this.spawn();
    }, // INIT
    spawn: function(){},
	pattern: function(){},//we call this function in each updates
	goLeft: function(){}, // OVERWRITED IN CHOICEENEMY
	goRight: function(){}, // OVERWRITED IN CHOICEENEMY
	decision: function(){}, // OVERWRITED IN CHOICEENEMY
	arret: function(){},
	hit: function(){
		return true;
	},
	rat: function()
	{
		// Enemy specific values
		this.walkSec = 5;
		this.velocityY = 0;
		this.framePause = "rat2";
		this.sprite.animations.add('walk',['rat0','rat1','rat2','rat1']);
		this.spawn();
		//--------------------------------------------------
		this.spawn= function()
		{
			this.left = false;
			this.sprite.scale.x = 1;
			this.sprite.position.setTo(this.repopX,this.repopY);
			this.velocityX = 215 + Math.random() * 15;
			this.reflexionTime = Math.random()/2 + 0.5;
			this.arret();
		},
		this.arret = function()
		{
			this.reflexion = true;
			this.reflexionSec = LD33.sec;
			this.sprite.animations.stop();
			this.sprite.frameName = this.framePause;
			this.left=!this.left;
			this.sprite.body.velocity.x = 0;
		}
		this.goLeft = function()
		{
			var tileX = Math.floor((this.sprite.x-25)/40);
			var tileY = Math.floor(this.sprite.y/40);
			var tmp1 = this.map.getTile(tileX,tileY+1,0);
			var tmp2 = this.map.getTile(tileX-1,tileY,0);

			if(tmp1 === null || tmp2 === null || !tmp1.collides || tmp2.collides)
				this.arret();
		}; // GO LEFT

		this.goRight = function()
		{
			var tileX = Math.floor((this.sprite.x+25)/40);
			var tileY = Math.floor(this.sprite.y/40);
			var tmp1 = this.map.getTile(tileX,tileY+1,0);
			var tmp2 = this.map.getTile(tileX+1,tileY,0);

			if(tmp1 === null || tmp2 === null || !tmp1.collides || tmp2.collides)
				this.arret();
		}; // GO RIGHT

		this.decision = function()
		{
			this.reflexion = false;
			if(this.left)
			{
				this.sprite.body.velocity.x = this.velocityX * -1;
				this.sprite.scale.x = 1;
			}
			else
			{
				this.sprite.body.velocity.x = this.velocityX;
				this.sprite.scale.x = -1;
			}
			this.sprite.animations.play('walk',this.walkSec,true);
		};
		this.pattern= function()//we call this function in each updates
		{
			if(!this.reflexion)//only if he does not think
				if(this.left)
					this.goLeft();
				else
					this.goRight();
			else
				if(this.reflexionSec + this.reflexionTime < LD33.sec)
					this.decision();
		};
	},// END RAT
	bat:function()
	{
		// Enemy specific values
		this.walkSec = 5;
		this.velocityY = 0;
		this.sprite.animations.add('fly',['bat1','bat2']);
		this.collWorld = false;
		this.gravityY = 0;
		//--------------------------------------------------
		this.spawn= function()
		{
			this.left = false;
			this.sprite.scale.x = 1;
			this.velocityX = 250 + Math.random()*50;
			this.sprite.position.setTo(this.repopX,this.repopY);
			this.sprite.body.velocity.x = this.velocityX * -1;
			this.sprite.animations.play('fly',this.walkSec,true);
		};
		this.arret = function(){};
		this.goRight = function(){};
		this.goLeft = function()
		{
			if(this.sprite.x < -40)
				this.spawn();
		};
		this.decision = function(){};
		this.pattern= function()
		{
			this.goLeft();
		};
	},
	heart:function()
	{
		this.walkSec = 5;
		this.velocityX = 100;
		this.fastVelocityX = 200;
		this.slowVelocityX = 100;
		this.hp = 2;
		this.velocityY = 0;
		this.framePause = 'heart1';
		this.sprite.animations.add('walk',['heart2','heart3']);
		this.sprite.frameName = this.framePause;
		this.vulnerable = true;
		this.vulSec = 0;
		this.isTrap = false;
		this.spawn();
		this.spawn = function()
		{
			var tileX = Math.floor((this.sprite.x)/40);
			var tileY = Math.floor(this.sprite.y/40);
			this.hp = 2;
			this.left = true;
			this.sprite.scale.x = 1;
			this.sprite.position.setTo(this.repopX,this.repopY);
			//this.sprite.body.y -= 40;
			this.vulnerable = true;
			this.arret();
		}
		this.arret = function()
		{
			this.reflexion = true;
			this.sprite.animations.stop();
			this.sprite.frameName = this.framePause;
			this.sprite.body.velocity.x = 0;			
		}
		this.goLeft = function()
		{
			var tileX = Math.floor((this.sprite.x)/40);
			var tileY = Math.floor(this.sprite.y/40);
			var tmp1 = this.map.getTile(tileX-1,tileY+1,0);
			var tmp2 = this.map.getTile(tileX-1,tileY,0);
			if(tmp1 === null || tmp2 === null || !tmp1.collides || tmp2.collides)
			{
				this.sprite.body.velocity.x = this.velocityX;
				this.sprite.scale.x = -1;
				this.left = false;
			}
		}; // GO LEFT
		this.goRight = function()
		{
			var tileX = Math.floor((this.sprite.x)/40);
			var tileY = Math.floor(this.sprite.y/40);
			var tmp1 = this.map.getTile(tileX,tileY+1,0);
			var tmp2 = this.map.getTile(tileX+1,tileY,0);
			if(tmp1 === null || tmp2 === null || !tmp1.collides || tmp2.collides)
			{
				this.sprite.body.velocity.x = this.velocityX*-1;
				this.sprite.scale.x = 1;
				this.left = true;
			}
		}; // GO RIGHT
		this.decision = function()
		{
			this.reflexion = false;
			this.sprite.animations.play('walk',5,true);
			if(this.left == true)
				this.sprite.body.velocity.x = this.velocityX*-1;
			else
				this.sprite.body.velocity.x = this.velocityX;
		};
		this.pattern= function()
		{
			if(!this.vulnerable && this.vulSec+0.5 < LD33.sec)
			{
				this.sprite.alpha = 1;
				this.vulnerable = true;
			}			
			
			if(this.gameState.runing)
				this.velocityX = this.fastVelocityX;
			else
				this.velocityX = this.slowVelocityX;
			
			if(this.gameState.cursors != null){
				if(this.reflexion && (this.gameState.cursors.left.isDown||this.gameState.cursors.right.isDown))
					this.decision();
				else if (!this.reflexion && !this.gameState.cursors.left.isDown && !this.gameState.cursors.right.isDown)
					this.arret();
			}
			
			if(!this.reflexion)
			{
				if(this.left)
					this.goLeft();
				else
					this.goRight();
			}
		};
		this.hit = function()
		{
			if(!this.vulnerable)
				return false;
			if(this.hp <= 1)
				return true;
			
			this.vulnerable = false;
			this.hp--;
			this.vulSec = LD33.sec;
			this.sprite.alpha = 0.4;
			return false;
		}
		
	},
	choiceEnemy: function()
	{
		if(this.key == 'rat')
		{
			this.rat();
		} // RAT
		else if(this.key == 'bat')
		{
			this.bat();
		} // BAT
		else if(this.key == 'heart')
		{
			this.heart();
		} // Heart
	} // CHOICE ENEMY
}


