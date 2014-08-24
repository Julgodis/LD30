/*
*
*  Julgodis 2014
*  castle.js
*
*/

var Castle = function(game) { };

Castle.prototype = 
{
	type: 0,
	player: 0,
	health: 100.0,
	maxHealth: 1000.0,
	lastHealth: 0,

	healthbar1: null,
	healthbar2: null,

/* group contains all the sprite that the castle uses */
	group: null,
	sprite: null,

	init: function()
	{
		
		if(this.player == 0)
		{
			this.sprite = game.add.sprite(0, game.height - /* ground height */ 8*game.extra.scale, 'evil_tower1', null, game.extra.world);
			this.sprite.anchor.setTo(0.0, 1.0);
			this.group = game.add.group(game.extra.world);
			this.healthbar1 = game.add.sprite(16, 20*game.extra.scale, 'green', null, game.extra.world);
			this.healthbar2 = game.add.sprite(16, 20*game.extra.scale, 'red', null, game.extra.world);

			this.healthbar1.scale.setTo(16*game.extra.scale, 8);
			this.healthbar2.scale.setTo(0, 8);

			if (this.lastHealth !== this.health) 
			{
			    this.healthbar2.scale.setTo(16*game.extra.scale - (this.health / this.maxHealth)*16*game.extra.scale, 8);
			}

			this.lastHealth = this.health;

		}
		else
		{
			this.sprite = game.add.sprite(game.extra.length - 64, game.height - /* ground height */ 8*game.extra.scale, 'good_tower1', null, game.extra.world);
			this.sprite.anchor.setTo(1.0, 1.0);
			this.group = game.add.group(game.extra.world);
			this.healthbar1 = game.add.sprite(game.extra.length-16-16*game.extra.scale, 20*game.extra.scale, 'green', null, game.extra.world);
			this.healthbar2 = game.add.sprite(game.extra.length-16-16*game.extra.scale, 20*game.extra.scale, 'red', null, game.extra.world);

			this.healthbar1.scale.setTo(16*game.extra.scale, 8);
			this.healthbar2.scale.setTo(0, 8);

			if (this.lastHealth !== this.health) 
			{
			   this.healthbar2.scale.setTo(16*game.extra.scale - (this.health / this.maxHealth)*16*game.extra.scale, 8);
			}

			this.lastHealth = this.health;

		}

		this.healthbar1.base = {};
		this.healthbar1.base.x = this.healthbar1.x;
		this.healthbar1.base.y = this.healthbar1.y;
		this.healthbar1.base.parallel = 1.0;

		this.healthbar2.base = {};
		this.healthbar2.base.x = this.healthbar2.x;
		this.healthbar2.base.y = this.healthbar2.y;
		this.healthbar2.base.parallel = 1.0;

		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;
		this.sprite.base.parallel = 0.9;

		this.sprite.scale.setTo(game.extra.scale, game.extra.scale);
		this.sprite.smoothed = false;


		//game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.revive();

	},
	update: function()
	{
		if (this.lastHealth !== this.health) 
		{
		    this.healthbar2.scale.setTo(16*game.extra.scale - (this.health / this.maxHealth)*16*game.extra.scale, 8);
		    this.lastHealth = this.health;
		}


	},
	attack: function(damage)
	{
		if(this.health <= 0) return;
		this.health -= damage;
		if(this.health <= 0) {
			game.extra.ingame.gameover = true;
			game.extra.ingame.loser = this.player;
			game.extra.ingame.expos = this;
			this.health = 0;
			game.extra.ingame.explode(this);
		}

	},
	isDead: function()
	{
		return this.health <= 0;
	}
	,
	explodePosition: function()
	{
		if(this.player == 0)
			return { x: 64 + 4*game.extra.scale, y: game.height-24*game.extra.scale};
		else
			return { x: game.extra.length - game.extra.ingame.map.x - (64 + 4*game.extra.scale), y: game.height-24*game.extra.scale};
	},
	kill: function()
	{
		this.health = -1;
		this.sprite.kill();
		this.healthbar1.kill();
		this.healthbar2.kill();
	}
	,
	removeBar: function()
	{
		this.healthbar1.kill();
		this.healthbar2.kill();
	}
};