/*
*
*		Julgodis 2014
*		tree.js
*
*/


var Tree = function(game) { };

Tree.prototype = 
{
	sprite: null,
	scale: 2.0,
	init: function(x1, y1, s)
	{
		this.scale = s;

		this.sprite = game.add.sprite(x1, y1, 'tree_spritesheet1', null, game.extra.world);
		this.sprite.anchor.setTo(0.5, 1.0);

		this.sprite.animations.add('idle', [0, 1], 2+((game.rnd.integerInRange(0,100)-50)/100.0)*5, true);
		this.sprite.play('idle');

		/* Make it comptiable with the moving back ground */
		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;

		this.sprite.scale.setTo(this.scale, this.scale);
		this.sprite.smoothed = false;

		this.sprite.revive();
	}
};