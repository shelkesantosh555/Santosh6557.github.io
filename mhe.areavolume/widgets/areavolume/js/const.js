// const.js

/* global
$
*/

(function(app)
{

    app.msieversion = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        var msie = ua.indexOf("msie ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      
            return true;
        return false;
    };

    app.shapeCount = 0;

    app.isMobileView = false;
    app.resizeRatioInit = 1;
    app.tabIndex = 600;
    app.currMode = '';
    app.currentTrial = 1;
    app.shapeTabIndex = 10;
    app.isKeyEvent = false;
    app.tabIndex = 100;
    app.isPreset = false;
    app.shapeZindex = 100;
    app.presetFlag = false;
    app.areaResize = false;
    app.helpDocument = 'help.pdf';
    app.currBorderColor = 'blue';
    app.colorArray = {'red':'#c80000','orange':'#f7931e','yellow':'#fecf0a','green':'#8cc33f','blue':'#01bad8','purple':'#7a51a1','pink':'#d8268c','black':'#000000','grey':'#BBBDBF'};
    app.config = {
        'currentState':'',
        'applicationHeight':600,
        'lockQuantity': 1,
        'qLockFlag': false,
        'HelpButton':false,
        'Mode':{'Area':true,'Volume':true}, 
        'Border_Colors':true,
        'Border_Colors_Arr': {'Red':true,'Orange':true,'Yellow':true,'Green':true,'Blue':true,'Purple':true,'Pink':true,'Black':true,'Grey':true},
        'Default_Border_Colors_Arr': { 'Red': false, 'Orange': false, 'Yellow': false, 'Green': false, 'Blue': true, 'Purple': false, 'Pink': false, 'Black': false, 'Grey': false },
        'LockUnlock':false,
        'Units':true,
        'Add':true,
        'Remove':true,
        'Fill':true,
        'Empty':true,
        'Measures':true,
        'Area_Measures':{'Length':true,'Width':true,'Perimeter':true,'Total_Area':true,'Filled_Area':true,'Unfilled_Area':true},
        'Volume_Measures': { 'Length': true, 'Width': true,'Height':true,'Total_Volume':true,'Filled_Volume':true,'Unfilled_Volume':true},
        'Undo':true,
        'Redo':true,
        'Reset':true,
        'AreaByColumn':false,
        'AreaByRow':true,
        'VolumeByColumn':true,
        'VolumeByRow':false
    };

    app.getWorkingEvent = function(e)
    {
        if (e.touches !== undefined)
        {
          if (e.pageX === undefined || e.pageY === undefined)
          {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
          }
        }
        if (e.originalEvent+"" !== "undefined")
        {
            if (e.originalEvent.touches+"" !== "undefined")
            {
              if (e.pageX === undefined || e.pageY === undefined)
              {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
              }
            }
        }
        if (e.pageX === undefined || e.pageY === undefined)
        {
          e.pageX = e.originalEvent.pageX;
          e.pageY = e.originalEvent.pageY;
        }
        return e;
    };

    app.toRadian = function(angle) {
        return angle * (Math.PI / 180);
    };

    app.toDegree = function(angle) {
        return angle * (180 / Math.PI);
    };

    app.getMobileOperatingSystem = function() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPod/.test(userAgent) && !window.MSStream) {
            return "iPad";
        }

        if (/iPhone/.test(userAgent) && !window.MSStream) {
            return "iPhone";
        }

        return "unknown";
    };

    app.getCurrentDeviceType = function()
    {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var sType;
        
        if (windowWidth > 568 && windowWidth <= 779)
        {
            sType = "tablet";
        }
        else if (windowWidth < 568)
        {
            sType = "mobile_portait";
        }
        else{
            sType = "desktop";
        }

        var isMobile = false;
        if( /webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            isMobile = true;
        }else{
            isMobile = false;
        }
        if(isMobile)
        {
            if (windowHeight < windowWidth)
            {
                if (Math.abs(window.orientation) === 90) // Landscape
                {
                    sType = "mobile_landscape";
                }
                else
                {
                    sType = "mobile_portait";
                }   
            }
        }  
        // sType = "mobile_landscape";
        return sType;  
    };

    app.showAlertPopup = function(instruction){
        $("#confirmOverlay").show();
        $(".tabIndex").removeAttr("tabIndex");
        $("#confirmOverlay #overlayAlertText").html(instruction);
        $('#confirmButtons .btn_cancel').show();
        $('#confirmButtons .btn_ok').show();
        $('#confirmButtons .btn_o').hide();
        setTimeout(function(){
            $("#confirmOverlay #overlayAlertText").focus();
        },100); 
    };
    
    app.showOkAlertPopup = function(instruction){
        $("#confirmOverlay").show();
        $(".tabIndex").removeAttr("tabIndex");
        $("#confirmOverlay #overlayAlertText").text(instruction);
        $('#confirmButtons .btn_cancel').hide();
        $('#confirmButtons .btn_ok').hide();
        $('#confirmButtons .btn_o').show();
        setTimeout(function(){
            $("#confirmOverlay #overlayAlertText").focus();
        },100); 
    };

    app.getIsEdit = function (){
        if ($('#isEdit').val() === 'false') {
            return false;
        }else{
            return true;
        }
    };

})(Const=Const||{});
var Const;

// const.js