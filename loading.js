/*
*
*  Julgodis 2014
*  loading.js
*
*/

var Start = function (game) { };
var Loader = function (game) { };

Start.prototype = 
{
	preload: function()
	{
		game.stage.backgroundColor = '#0094FF';

		game.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');
		//game.load.bitmapFont('pixel_font_blue', 'assets/fontBlue.png', 'assets/font.xml');

	},
	create: function()
	{
		game.state.start('loading');
	}
};

Loader.prototype = 
{
	preload: function ()
	{
		var w = game.width;
		var h = game.height;

		var text = game.add.bitmapText(w / 2, (h / 2) - 10, 'pixel_font', 'Loading...', 18);
		text.position.x = (w / 2) - 100;	

		/* TOWERS */
		game.load.image('evil_tower1', 'assets/evil_tower1.png');
		game.load.image('good_tower1', 'assets/good_tower1.png');

		/* GROUND */
		game.load.image('ground_tile', 'assets/ground_tile.png');

		/* TREES */
		game.load.spritesheet('tree_spritesheet1', 'assets/tree_spritesheet1.png', 16, 16);


	},
	create: function()
	{
		game.state.start('game');
	}
};
