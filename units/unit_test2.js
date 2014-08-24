/*
*
*		Julgodis 2014
*		unit_test.js
*
*/

var UnitTest2 = function(p, x, y, game)
{
	//Unit.init(this, x, y, 'unit1', 0, game.extra.scale);
	var scale = (game.extra.scale/3)-0.5 * game.rnd.frac();

	Unit.apply(this,arguments);
	this.init(p, x, y, 'unit2', 0, scale);

	this.jumpCounter = game.rnd.integerInRange(1000, 3000);
	this.dojump = false;

	this.basicAttackSpeed = 2.9;
	this.basicAttackDamage = 26;
	this.basicAttackTimer = 0;
	this.maxHealth = 200.0;
	this.health = 200.0;

	this.targetRange = 22*scale*0.4;
	this.speed = 0.5 + 0.05*game.rnd.frac();
	this.gold = 20;

	this.size = { width: 22, height: 22 };
};
UnitTest2.prototype = Object.create(Unit.prototype);
UnitTest2.prototype.constructor = UnitTest2;

UnitTest2.prototype.initUnit = function()
{
	this.gravity = true;
	this.usefliping = true;

	//this.sprite.base.parallel = 1.2 + 0.3 * ((this.scale)/(game.extra.scale/3));

};

UnitTest2.prototype.addUnitAnimations = function()
{
	this.sprite.animations.add('idle', [0], 1, true);
	this.sprite.animations.add('walk', [1, 0, 2, 0], 11, true);
	this.sprite.animations.add('basic_attack', [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], 60, false);
	this.sprite.play('walk');
};

UnitTest2.prototype.updateUnit = function()
{
	if(this.target == null)
	{
		this.mode = Mode.Idle;
	}
	else 
	{
		this.mode = Mode.FightUnit;
		var dx = this.target.sprite.base.x - this.sprite.base.x;
		if(Math.abs(dx) > this.basicAttackRange)
		{
			this.target = null;
			this.mode = Mode.Idle;
		}
	}

	if(this.mode == Mode.Idle)
	{
		this.sprite.play('walk');
		this.velocity.x = this.speed;
	}
	else if(this.mode == Mode.FightUnit)
	{
		this.velocity.x = 0;
		if(game.time.now > this.basicAttackTimer)
		{
			this.sprite.animations.stop();
			this.sprite.play('basic_attack');
			this.target.attack(this.basicAttackDamage);
			this.basicAttackTimer = game.time.now + (1/this.basicAttackSpeed)*1000 + game.rnd.integerInRange(-200, 200);

			if(this.target.isDead())
			{
				this.target = null;
				this.mode = Mode.Idle;
			}
		}
	}
	/*if(!this.dojump && Math.abs(this.velocity.y) < 0.005 && game.time.now > this.jumpCounter) {
		this.dojump = true;
	}

	if(this.dojump == true && game.time.now - 400 <= this.jumpCounter)
	{
		this.velocity.y -= 1;
	}
	else if(this.dojump == true)
	{
		this.dojump = false;
		this.jumpCounter = game.time.now + game.rnd.integerInRange(4000, 6000);
	}*/
};
