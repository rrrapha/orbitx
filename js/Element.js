function Element(tag, attribs){
	this.elem = document.createElement(tag);
	//this.elem.innerHTML="go";
	for(attrib in attribs){
		this.elem.setAttribute(attrib, attribs[attrib]);
	}

	this.insert=function(node){
		node.appendChild(this.elem);
	}
	this.setXY=function(x,y){
		this.elem.setAttribute('style', 'left:'+x+'px;top:'+y+'px;');
	}
	this.setX=function(x){
		this.elem.setAttribute('style', 'left:'+x+'px;');
	}
	this.setY=function(y){
		this.elem.setAttribute('style', 'top:'+y+'px;');
	}
	this.setContent=function(c){
		this.elem.innerHTML=c;
	}
}
