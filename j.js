console.log("heeeee")
setTimeout(function() {
	
	var imgs = document.getElementsByTagName("img")
	
	for (var i = 0; i < imgs.length; i++) {
		if(imgs[i].getAttribute("type") == "ascii") {
			imgs[i].onmousedown = function() {
				if(this.getAttribute("type") == "ascii")  {
					this.src = "/new/images/atoi/" + this.name + "_img.jpg"
					this.setAttribute("type", "img")
				}
				else {
					this.src = "/new/images/atoi/" + this.name + "_ascii.png"
					this.setAttribute("type", "ascii")
				}
			}
		}
	}

}, 500)