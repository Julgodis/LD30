/*
*
*		Julgodis 2014
*		unit.js
*
*/

var Mode = {
  Idle: 0, 
  FightUnit: 1, 
  FightCastle: 2
};

var rgbToHex = function (r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var rgbToHexi = function (r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b);
}

var Unit = function(game) { };

Unit.prototype = 
{
	player: 0,
	type: -1,
	scale: 1.0,

	group: null,
	sprite: null,
	healthbar: null,

	gravity: true,
	usefliping: false,

	velocity: { x: 0, y: 0},
	size: { width: 0, height: 0},
	speed: 0.5,

	health: 100.0,
	lastHealth: 0.0,
	maxHealth: 100.0,

	mode: Mode.Idle,
	target: null,
	targetRange: 0,
	gold: 0,

	init: function(player, x, y, image, type, scale)
	{
		this.player = player;
		type.type = type;
		this.scale = scale;

		this.sprite = game.add.sprite(x, y, image, null, game.extra.world);
		this.group = game.add.group();
		this.sprite.anchor.setTo(0.5, 1.0);

		this.sprite.base = {};
		this.sprite.base.x = this.sprite.x;
		this.sprite.base.y = this.sprite.y;
		this.sprite.base.parallel = 1.0;
		this.sprite.base.unit = this;

		this.sprite.scale.setTo(this.scale, this.scale);
		this.sprite.smoothed = false;

		this.sprite.revive();

		this.healthbar1 = game.add.sprite(0, 0, 'green', null, this.ground);
		this.healthbar2 = game.add.sprite(0, 0, 'red', null, this.ground);

		this.healthbar1.scale.setTo(12*this.scale, 2);
		this.healthbar2.scale.setTo(0, 4);

		if (this.lastHealth !== this.health) 
		{
		    this.healthbar2.scale.setTo((this.health / this.lastHealth), 2);
		}

		this.lastHealth = this.health;

		this.initUnit();
		this.addUnitAnimations();
	},
	initUnit: function() {},
	updateUnit: function() {},
	addUnitAnimations: function() { },
	update: function()
	{
		if(this.isDead()) return;
		this.updateUnit();

		if(this.gravity)
		{
			if(this.sprite.y < game.height-8*game.extra.scale)
				this.velocity.y += 0.5*(game.time.elapsed/6);
		}

		//console.log(game.time.elapsed);
		this.sprite.base.x += this.velocity.x*(game.time.elapsed/12);
		this.sprite.base.y += this.velocity.y*(game.time.elapsed/12);
		this.velocity.x *= 0.95;
		this.velocity.y *= 0.95;

		if(this.sprite.base.y >= game.height-8*game.extra.scale)
			this.sprite.base.y = game.height-8*game.extra.scale;
		if(this.sprite.y >= game.height-8*game.extra.scale)
			this.sprite.y = game.height-8*game.extra.scale;

		if(this.usefliping)
		{
			if(this.velocity.x < 0){
				this.sprite.scale.x = this.scale;
			}
			else if(this.velocity.x > 0){
				this.sprite.scale.x = -this.scale;

			}
		}

		if (this.lastHealth !== this.health) 
		{
		    this.healthbar2.scale.setTo(12*this.scale - (this.health / this.maxHealth)*12*this.scale, 2);
		    this.lastHealth = this.health;
		}

		this.healthbar1.x = this.sprite.x - (12*this.scale)/2;// + (this.sprite.scale.x<0?0:12*this.scale);
		this.healthbar1.y = this.sprite.y - (this.size.height + 2)*this.scale;
		this.healthbar2.x = this.sprite.x - (12*this.scale)/2;// + (this.sprite.scale.x<0?0:12*this.scale);
		this.healthbar2.y = this.sprite.y - (this.size.height + 2)*this.scale;

	},
	attack: function (damage)
	{
		game.extra.ingame.showDamage(damage, { x: this.sprite.x - (12*this.scale)/2, y: this.sprite.y - (this.size.height + 12)*this.scale},
			{ x: this.sprite.x - (12*this.scale)/2, y: this.sprite.y - (this.size.height-6)*this.scale});
		this.health -= damage;
		if(this.health <= 0)
		{
			game.extra.ingame.showDead({ x: this.sprite.x - (12*this.scale)/2, y: this.sprite.y - (this.size.height-6)*this.scale});
			if(this.player == 1)
			{
				game.score.gold += this.gold;
				game.extra.ingame.showGold({ x: this.sprite.x - (12*this.scale)/2, y: this.sprite.y - (this.size.height +12)*this.scale, gold:this.gold});
			}
			this.kill();
		}
	},
	isDead: function()
	{
		return this.health <= 0;
	},
	kill: function()
	{
		this.health = -1;
		this.sprite.kill();
		this.healthbar1.kill();
		this.healthbar2.kill();
	}
}