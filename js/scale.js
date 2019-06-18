$(document).ready(function(e) {
    isMobile = function()  {  
        //return 'ontouchstart' in window || 'onmsgesturechange' in window; 
         if( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
     ){
        $(".obj_hover").each(function (index){
            $(this).attr("aria-label","Double tab to reval the of hidden text for blank position "+index);
        });
        return true;
      } else {
        return false;
      }
    };
        //alert(isMobile())
    if (isMobile())
    {
        // window.location.href = "activity.html";
    }
   onResizeFn()

});
$(window).resize(function(e) 
{
	//console.log("add  resize")
	onResizeFn();
});

function onResizeFn()
{
	$("body").css("overflow","hidden");
	 var shellWidth = 1024;
    var shellHeight = 648;
    var newShellHeight;
    var newShellWidth;
    var agent = navigator.userAgent.toLowerCase();
    var is_ipad = ((agent.indexOf('ipad') != -1));
    var actWid = Number($(window).width());
    var actHgt = Number($(window).height())

    

    if(actWid > 1024 && actHgt > 648){
        return;
    }


    if (actHgt < actWid) {
        newShellHeight = actHgt;
        var scale = Number(shellHeight / newShellHeight).toFixed(2);
        newShellWidth = (shellWidth / shellHeight) * newShellHeight;
        var _aleft = ($(window).width() / 2) - (Number(newShellWidth) / 2);
        if (_aleft < 0) {
            newShellWidth = actWid;
            scale = Number(shellWidth / newShellWidth).toFixed(2);
            newShellHeight = (shellHeight / shellWidth) * newShellWidth;
        }
        $('#masterDiv').css({
            "transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)",
            "-ms-transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)",
            "-webkit-transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)"
        });
    } else {
        newShellWidth = actWid;
        var scale = Number(shellWidth / newShellWidth).toFixed(2);
        newShellHeight = (shellHeight / shellWidth) * newShellWidth;
        $('#masterDiv').css({
            "transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)",
            "-ms-transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)",
            "-webkit-transform": "translate(-" + (shellWidth / 2) + "px,-" + (shellHeight / 2) + "px) scale(" + (1 / scale) + "," + (1 / scale) + ") translate(" + (shellWidth / 2) + "px," + (shellHeight / 2) + "px)"
        });
    }
    scaleVal = scale;
    var _left = ($(window).width() / 2) - (Number(newShellWidth) / 2);
    var _top = ($(window).height() / 2) - (Number(newShellHeight) / 2);
    //$('#masterDiv').css("left", _left);
    //$('#masterDiv').css("top", _top);
	
} 