/*
*
*		Julgodis 2014
*		cloud.js
*
*/

var Cloud = function(game) { };

Cloud.prototype = 
{
	sprite: null,
	scale: 2.0,
	direction: 1.0,
	init: function(x1, y1, s, d, f)
	{
		this.scale = s;
		this.direction = d;

		this.sprite = game.add.sprite(x1, y1, 'cloud' + game.rnd.integerInRange(1, 2), null, game.extra.world);
		this.sprite.anchor.setTo(0.5, 0.5);

		var tx = Math.min(f*0.2*255+10, 255);
		this.sprite.tint  = rgbToHexi(255 - tx, 255 - tx, 255 - tx);

		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;
		this.sprite.base.parallel = 0.1+f*0.5;

		this.sprite.scale.setTo((game.rnd.normal() <= 0 ? -1 : 1) * this.scale, this.scale);
		this.sprite.smoothed = false;

		this.sprite.revive();

		this.r = game.rnd.integerInRange(0, 10000);
	},
	update: function()
	{
		this.direction += Math.cos((this.r+game.time.now)/1000.0)*0.001;
		this.direction = Math.max(-1, Math.min(1, this.direction));

		this.sprite.base.x += this.direction*game.time.elapsed*0.05;
		this.sprite.base.y += Math.cos((this.r+game.time.now)/1000.0)*game.time.elapsed*0.01;

		if(this.sprite.base.x >= game.extra.length + 100)
			this.direction *= -1;

		if(this.sprite.base.x <= -100)
			this.direction *= -1;

		//this.sprite.base.parallel += Math.cos(game.time.now/100.0)*.0005;
	}
};