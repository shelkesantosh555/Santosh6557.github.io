// colordd.js

/* global
$, mhe
*/

/* exported
ColorMenu
*/

var ColorMenu = function(labelArray, menuName){
    var oDropDown, isOpen = false,Evts;
    var oDropDownLabel = null;
    function generate(labelArray, menuName)
    {
        Evts = new Events();
        var menuID = menuName.replace(/ /g, "_");
        var Lclass = menuName;
        var menuNameMain = menuName;
        var menuNameLabel = menuName;
        var itemMenuName = '';
        if(menuName === 'Stroke'){
            menuNameLabel = 'Border';
            menuNameMain = 'Border Color menu';
            itemMenuName = 'Border Color menu';
        }
        var i;
        for (i in Const.config.Default_Border_Colors_Arr) {
            if (Const.config.Default_Border_Colors_Arr[i]) {
                Const.currBorderColor = i.toLowerCase();
            }
        }
        oDropDownLabel = 'Press the enter key to open dropdown menu and press the tab key to switch options from the menu and press enter key to make a selection. selected ' + menuNameMain.replace(" menu", "") + ' is ' + Const.currBorderColor + '.';
        var navClass = '';
        oDropDown = $('<div class="dd-color-main-container" id="'+menuID+'_Menu"><nav style=""><ul><li>'+
                        '<div style="text-align: left;" class="label-div">'+
                        '<label id="'+menuID+'_label" for="select-input" >'+menuNameLabel+'</label>'+
                        '</div><div class="shape_dropdown" aria-label="'+itemMenuName+'. '+ oDropDownLabel +'" title="'+menuNameMain+'" tabindex="'+Const.tabIndex+'" >'+
                        '<div class="navTopSpan '+navClass+'"><div></div></div>'+
                        '<div class="shape_dd_arrows '+Lclass+'-arrow">'+
                        '<img class="img_top" id="shape_dd_img" src="images/up_arrow.svg">'+
                        '</div>'+
                        '<ul class="topUL '+Lclass+'-ul" id="dd-'+Lclass+'">'+              
                        '</ul>'+
                      '</div></li></ul></nav></div>');

        Const.tabIndex++;
        oDropDown.find('.shape_dropdown').attr('tabindex', Const.tabIndex);
        Const.tabIndex++;
        
        oDropDown.find('.shape_dropdown').on('click keyup', function(e){
            keyboardAccessibility(e, this);
        }); 

        // var tab = 142;
        var LabelMain;
        var titleName;
        for(i=0;i<labelArray.length;i++)
        {
            LabelMain = labelArray[i];
            titleName = labelArray[i].replace(/_/g, " ");

            var figureLi = ('<li  class="listItemscolor" style="display: list-item;">'+
            '<div tabindex="'+Const.tabIndex+'" aria-label="'+titleName+'" shapeType="'+LabelMain+'" title="'+titleName+'" class="listdivcolor list'+LabelMain+'"></div>'+
            '</li>');
            Const.tabIndex++;
            oDropDown.find('ul.topUL').append(figureLi);
        }
        // add button events
        oDropDown.find('ul.topUL li').bind('click keyup',handleButtonEvents);
        window.addEventListener("click", onWindowClick);
    }

    function keyboardAccessibility(e, DropDown)
    {
      if(e.type === 'keyup' && (e.keyCode !== 13))
        return false;

        var topUL = $(DropDown).find('.topUL');
        var shapeDDImg = $(DropDown).find('#shape_dd_img');
        $('.img_top').each(function(){
            if($(this) !== shapeDDImg)
            {
                //$(this).attr('src','images/up_arrow.svg');
                //isOpen = false;
            }
        });

        $('.img_top').attr('src','images/up_arrow.svg');
        $('.topUL').css('display','none');  

        if ($('#more_div').hasClass('buttonSelected')) {
            $('#more_div').removeClass('buttonSelected');
            $('.mobile_controls-shape').hide();
            mheAreaVolumeTool.setupUiForMorePop();
        }

         if(isOpen === false)
         {
            $(topUL).css('display','block');
            $(shapeDDImg).attr('src','images/down_arrow.svg');
            isOpen = true;
         }
         else
         {
            $(topUL).css('display','none');
            $(shapeDDImg).attr('src','images/up_arrow.svg');
            isOpen = false;
         }
         e.stopPropagation();
    }
    function onWindowClick()
    {
        if(isOpen === true)
        {
            $('.img_top').each(function(){
                $(this).attr('src','images/up_arrow.svg');
            });
            $('.topUL').css('display','none');
        }   
        isOpen = false;
    }
    function handleButtonEvents(e)
    {
        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
        return false;

        //caliper_event ----
        var caliper_obj = {};
        caliper_obj.type = "SessionEvent";
        caliper_obj.action = "Color Changed";
        caliper_obj.time = (new Date()).toISOString();
        mhe.caliper(caliper_obj);

        var currentUL = $(e.target).parent().parent().parent();     

        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;

        // var currentDDLlabel = currentUL.attr('aria-label').split(' ');
        var titleName = $(e.target).attr('shapeType').replace('_',' ');
        var menuNameMain = currentUL.attr('title').replace(" menu","");

        var ariaName = 'Press the enter key to open dropdown menu and press the tab key to switch options from the menu and press enter key to make a selection. selected '+menuNameMain+' is '+titleName+'.';
        currentUL.attr('aria-label',ariaName);
        
        setTimeout(function(){
            $(".topUL").css("display","none");
        },5);
        $(".img_top ").attr('src','images/up_arrow.svg');
        $(".shape_dropdown").removeClass("dropDown_open");
        $('#mobile_controls').css('z-index','999999');
        
        $(e.target).parents('.dd-color-main-container').find('.shape_dropdown').focus();    
        Evts.dispatchEvent('OPTION_SELECTED',{'selection':$(e.target).attr('shapeType'), 'currentUL': currentUL});

    }
    generate(labelArray, menuName);
    
    return{
        getHTML:function(){return oDropDown;},
        onWindowClick:onWindowClick,
        Evts:Evts
    };
};

// colordd.js
