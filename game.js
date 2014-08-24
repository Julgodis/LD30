/*
*
*  Julgodis 2014
*  game.js
*
*/

var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game');
game.extra = {
	world: null,
	scale: 8.0,
	treeCount: 80,
	cloudCount: 10,
	length: 0,
	ingame: null
};

game.score = {
	gold: 100.0,
	total: 100,
	goldPP: 0,
};

costs = [15, 60, 100, 800];
cds = [1.2, 2.1, 2.8, 10.0];

game.state.add('start', Start);
game.state.add('loading', Loader);

game.state.add('intro', Intro);
game.state.add('game', InGame);

// Run game!
game.state.start('start');


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function OpenInNewTab(url) {
	window.location = url;
}

/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39491934-3', 'github.com');
ga('send', 'pageview');*/
