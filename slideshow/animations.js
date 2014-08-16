var Animations = {
	'pre':{}, 'live':{}, 'post':{}
};

Animations.pre.drawImage255to0 = function(slideManager, img, context, properties){
	var imageData=context.getImageData(properties.left,properties.top,properties.width,properties.height);
	var temp=context.getImageData(properties.left,properties.top,properties.width,properties.height);
	// Iterating imageData and obtaining pixel.
	for (var i=0;i<temp.data.length;i+=4)
	{
	  var red = temp.data[i];
	  var green = temp.data[i+1];
	  var blue = temp.data[i+2];
	  var alpha = temp.data[i+3]; 
	  var v = 0.2126*red + 0.7152*green + 0.0722*blue;
	  temp.data[i] = 255;
	  temp.data[i+1] = 255;
	  temp.data[i+2] = 255;
	}
	context.putImageData(temp, 0, 0,properties.left,properties.top, properties.width, properties.height); 
	
	var timeInterval = slideManager.pre.time/256;
	var x = 255;
	var to = setInterval(function(){
		for (var i=0;i<imageData.data.length;i+=4){
			var red = imageData.data[i];
			var green = imageData.data[i+1];
			var blue = imageData.data[i+2];
			var alpha = imageData.data[i+3]; 
			var v = 0.2126*red + 0.7152*green + 0.0722*blue;
			
			if (Math.round(v) == x){
				temp.data[i] = red;
				temp.data[i+1] = green;
				temp.data[i+2] = blue;
				temp.data[i+3] = alpha;
			}
		}
		context.putImageData(temp, properties.left, properties.top,0,0, properties.width, properties.height); 
		x--;
		if (x==-1){
			clearInterval(to);
			slideManager.live.animate(slideManager, img, context, properties);	
		}}
	,timeInterval);
}

Animations.live.zoomAndMove = function(slideManager, img, context, properties){
	var timeInterval = slideManager.live.time;
	var a = 0;
	var tempWidth, tempHeight,tempLeft, tempTop;
	if (properties.maxHeight == properties.height && properties.maxWidth != properties.width){
		var to = setInterval(function(){
			if (a<=timeInterval/2){
				tempWidth = ((properties.maxWidth - properties.width)/(timeInterval/2)) * a + properties.width;
				tempHeight = (properties.maxHeight/tempWidth)*img.width;
				tempLeft = (properties.maxWidth - tempWidth)/2;
				context.drawImage(img, 0, 0, img.width, tempHeight,tempLeft,0,tempWidth, properties.maxHeight); 
			}
			else if (a>timeInterval/2 && a<timeInterval){
				tempTop = ((a-timeInterval/2) * (img.height - tempHeight))/(timeInterval/2);
				context.drawImage(img, 0, tempTop, img.width, tempHeight,0,0,properties.maxWidth, properties.maxHeight);
			}
			else if (a>=timeInterval){
				clearInterval(to);
				slideManager.post.animate(slideManager, img, context, properties);
			}
			a++;
		}, 1);
	} else if (properties.maxWidth == properties.width && properties.maxHeight != properties.height){
		var to = setInterval(function(){
			if (a<=timeInterval/2){
				tempHeight = ((properties.maxHeight - properties.height)/(timeInterval/2)) * a + properties.height;
				tempWidth = (properties.maxWidth/tempHeight)*img.height;
				tempTop = (properties.maxHeight - tempHeight)/2;
				context.drawImage(img, 0, 0, tempWidth, img.height, 0,tempTop,properties.maxWidth, tempHeight); 
			}
			else if (a>timeInterval/2 && a<timeInterval){
				tempLeft = ((a-timeInterval/2) * (img.width - tempWidth))/(timeInterval/2);
				context.drawImage(img, tempLeft, 0, tempWidth, img.height,0,0,properties.maxWidth, properties.maxHeight);
			}
			else if (a>=timeInterval){
				clearInterval(to);
				slideManager.post.animate(slideManager, img, context, properties);
			}
			a++;
		}, 1);
	} else {
		setTimeout(function(){
			slideManager.post.animate(slideManager, img, context, properties);
		}, timeInterval);
	}
}

Animations.post.eraseImage0to255 = function(slideManager, img, context, properties){
	var imageData=context.getImageData(0,0,properties.maxWidth,properties.maxHeight);
	
	var timeInterval = slideManager.post.time/256;
	var x = 0;
	var to = setInterval(function(){
		for (var i=0;i<imageData.data.length;i+=4){
			var red = imageData.data[i];
			var green = imageData.data[i+1];
			var blue = imageData.data[i+2];
			var alpha = imageData.data[i+3]; 
			var v = 0.2126*red + 0.7152*green + 0.0722*blue;
			
			if (Math.round(v) == x){
				imageData.data[i] = 255;
				imageData.data[i+1] = 255;
				imageData.data[i+2] = 255;
				imageData.data[i+3] = 255;
			}
		}
		context.putImageData(imageData, 0,0,0,0, properties.maxWidth,properties.maxHeight); 
		x++;
		if (x==256){
			clearInterval(to)
			slideManager.startNext();
		}}
	,timeInterval);
}