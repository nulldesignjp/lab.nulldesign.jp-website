/*
	preload bar
	require jQuery
*/

var Preloading = function()
{
	this.view = document.createElement('canvas');
	this.ctx = this.view.getContext('2d')
	this.value = 0;
	this.width = 200;
	this.height = 10;

	this.initialize.apply( this );
}

Preloading.prototype = 
{
	initialize	:	function()
	{
		this.view.width = this.width;
		this.view.height = this.height;
	},
	update	:	function(){},
	complete	:	function(){},
	err	:	function(){}
};