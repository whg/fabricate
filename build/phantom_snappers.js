//this is the script that will be executed by phantomjs

var page = new WebPage();

if (phantom.args.length === 0) {
  console.log("I need a URL");
  phantom.exit();
}

else {
	page.open(phantom.args[0], function (status) {
	  
	  if (status !== "success") {
	    console.log("cannot load address");
	  } 
	  else {
	    var html = page.evaluate(function() {
          return document.documentElement.outerHTML;
      });
	    console.log(html);
	  }
	  phantom.exit();
  });
}