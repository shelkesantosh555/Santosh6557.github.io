function readDeviceOrientation() {           
  if (Math.abs(window.orientation) === 90) {
  // Landscape=""
    $('meta#viewport').attr('content','width=device-width, initial-scale=0.999, maximum-scale=1,user-scalable=no');  
 } else {
  // Portrait  
  $('meta#viewport').attr('content','width=device-width, initial-scale=0.75, maximum-scale=1,user-scalable=no');
 }
}

$(document).ready(function() {
	
	readDeviceOrientation();

	var hiddenTextLbl=[
		"2000 pound load at 5 degree is 6 multiplied by load",
		"2000 pound load at 10 degree is 3 multiplied by load",
		"2000 pound load at 20 degree is one half multiplied by load",
		"2000 pound load at 30 degree is stress equals load",
		"2000 pound load at 45 degree is 41 percent increase",
		"2000 pound load at 60 degree is 15 percent increase"
	];
			// new  code start
			if (Math.abs(window.orientation) === 90) {
				// Landscape		
			   $('meta[name=viewport]').attr('content','width=device-width, initial-scale=1, maximum-scale=1');	 
			   
			} else {
				// Portrait  
				$('meta[name=viewport]').attr('content','width=device-width, initial-scale=0.75, maximum-scale=1');
				
			}
			
			$(window).bind('orientationchange', function(event) {
				readDeviceOrientation();
			});
		
		// new code end

		//updated code start
		$(".obj_hover").next().find('span').addClass('tabindex');
		$(".obj_hover").attr("aria-label","");
		$(".main_container").attr("id","masterDiv").attr("role","region").attr('aria-label',"activity container");
		$("#masterDiv").css({"margin": "0 auto !important","display": "block !important"})
		$("#wrapper").attr("role","application");
		$("#wrapper").append('<div id="liveRegion" role="region" aria-live="polite" style="position: absolute; z-index:100; width: 0px; height: 0px; top:100px; left:-1000px;"></div>');
		if(typeof hiddenTextLbl !== 'undefined' && typeof hiddenTextLbl.lenth){
			$(".all").each(function(index){
				if(hiddenTextLbl[index].length){
					$(this).attr('aria-hidden','true').attr("aria-label",hiddenTextLbl[index]);
				}
				else{
					$(this).attr('aria-hidden','true').attr("aria-label",$(this).text());
				}
				updateLiveText("");
				// $(this).parent().find('span').html("&nbsp;");
			})
		}
		$('#reset').click(function() {
			location.reload();
		});	

		function handleKeyDown(e) {
			var altPressed=0;
			var evt = (e==null ? event:e);
			altPressed  =evt.altKey;
			self.status=""
			+", altKey="  +altPressed
			if ((altPressed) && (evt.keyCode<16 || evt.keyCode>18)) 
			if(evt.keyCode == 82){
				//console.log("reload.........")
				window.location.reload();
			}
			// if(evt.keyCode == 83){onSubmitClick();}
			// if(evt.keyCode == 65){
			// 	if(checkSolutionEnable == true){
			// 	showAns();
			// 	}
			// }
			return true;
		}
		document.onkeydown = handleKeyDown;
		//updated code end
});


function updateLiveText(_msg, _strength, _atomic)
{
	if (_atomic == undefined)
	{
		_atomic = "true";
	}
	if (_strength == undefined)
	{
		_strength = "polite";
	}
	$("#liveRegion").attr("aria-atomic", _atomic);
	$("#liveRegion").attr("aria-live", _strength);
	$("#liveRegion").text(_msg);
}

