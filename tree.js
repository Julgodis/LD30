/*
*
*		Julgodis 2014
*		tree.js
*
*/


var Tree = function(game) { };

Tree.prototype = 
{
	type: 0,
	sprite: null,
	scale: 2.0,
	init: function(x1, y1, s, t)
	{
		this.type = t;
		this.scale = s;

		if(this.type == 0) 	// good
			this.sprite = game.add.sprite(x1, y1, 'tree_spritesheet' + (game.rnd.integerInRange(1, 2)), null, game.extra.world);
		else				// evil
			this.sprite = game.add.sprite(x1, y1, 'tree_spritesheet1' + (game.rnd.integerInRange(1, 1) - 1), null, game.extra.world);

		this.sprite.anchor.setTo(0.5, 1.0);

			if(this.type == 0) 	// good
			this.sprite.animations.add('idle', [0, 1], 1+game.rnd.frac()*2, true);
		else	
			this.sprite.animations.add('idle', [0, 1, 2, 3], 0.1+game.rnd.frac()*1, true);

		this.sprite.play('idle');
		var tx = Math.min(((game.extra.scale-this.scale)/7.0)*0.7*255+80, 255);
		this.sprite.tint  = rgbToHexi(255 - tx, 255 - tx, 255 - tx);

		/* Make it comptiable with the moving back ground */
		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;
		this.sprite.base.parallel = 0.8 + -((game.extra.scale-this.scale)/7.0)*0.4;

		this.sprite.scale.setTo((game.rnd.normal() <= 0 ? -1 : 1) * this.scale, this.scale);
		this.sprite.smoothed = false;

		this.sprite.revive();
	}
};