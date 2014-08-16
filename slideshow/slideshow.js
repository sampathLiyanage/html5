
function Animation(animationMetaData){
	var slideManager = animationMetaData;
	this.animate = function(image, context, properties){
		slideManager.pre.animate(slideManager, image, context, properties);
	}
}

function ImageManager() {
	this.getImageProperties = function(img, canvas){
		var maxWidth = canvas.width;
		var maxHeight = canvas.height;
		var width, height;
		if(maxWidth >= img.width && maxHeight < img.height) {
			width = (img.width*maxHeight)/img.height;
			height = maxHeight;
		} else if(maxWidth < img.width && maxHeight >= img.height) {
			width = maxWidth;
			height = (img.height*maxWidth)/img.width;
		} else  {
			width = (img.width*maxHeight)/img.height;
			height = maxHeight;
			if (width > maxWidth){
				height = (img.height*maxWidth)/img.width;
				width = maxWidth;
			}
		} 
		
		var top = (maxHeight - height)/2 ;
		var left = (maxWidth - width)/2 ;
		return {'width':width, 'height':height, 'top':top, 'left':left, 'maxWidth':maxWidth, 'maxHeight':maxHeight};
	}
	
	this.showImage = function(canvas, imageSrc, animation){
		var img = new Image();
		var that = this;
		var context = canvas.getContext("2d");
		var maxWidth = canvas.width;
		var maxHeight = canvas.height;
		img.src = imageSrc;
	
		img.onload = function(){
			var properties = that.getImageProperties(this, canvas);
			context.drawImage(this, properties.left, properties.top, properties.width, properties.height); 
			animation.animate(this,context, properties);
		}
	}
}

function SlideShow(canvasId, imageSources){
	var canvas = document.getElementById(canvasId);
	var im = new ImageManager();
	var slideManager = {
				'pre':{'animate':Animations.pre.drawImage255to0, 'time':1000},
				'live':{'animate':Animations.live.zoomAndMove, 'time':3000},
				'post':{'animate':Animations.post.eraseImage0to255, 'time':1000}
				}
	
	slideManager.count = 0;
	slideManager.imageSources = imageSources;
	slideManager.startNext = function(){
			if (this.imageSources.length == this.count){
				this.count=0;
			}
			var anm = new Animation(slideManager);
			im.showImage(canvas,
				imageSources[slideManager.count],
				anm);
			this.count++;
	}
	slideManager.startNext();
}