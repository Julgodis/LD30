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
	health: 100.0,

/* group contains all the sprite that the castle uses */
	group: null,
	sprite: null,

	init: function()
	{
		
		this.group = game.add.group(game.extra.world);
		if(this.type == 0)
		{
			this.sprite = game.add.sprite(0, game.height - /* ground height */ 8*game.extra.scale, 'evil_tower1', null, game.extra.world);
			this.sprite.anchor.setTo(0.0, 1.0);
		}
		else
		{
			this.sprite = game.add.sprite(game.extra.length - 64, game.height - /* ground height */ 8*game.extra.scale, 'good_tower1', null, game.extra.world);
			this.sprite.anchor.setTo(1.0, 1.0);
		}


		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;
		this.sprite.base.parallel = 0.9;

		this.sprite.scale.setTo(game.extra.scale, game.extra.scale);
		this.sprite.smoothed = false;


		game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.revive();
	}

};