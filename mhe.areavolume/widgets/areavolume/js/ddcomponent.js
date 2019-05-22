// ddcomponent.js

/* global
$, mhe
*/

/* exported
DropDownMenu
*/

var DropDownMenu = function(labelArray, menuName){
    
    var oDropDown, isOpen = false,Evts;
    function generate(labelArray, menuName)
    {
        Evts = new Events();
        var menuID = menuName.replace(/ /g, "_");
        var Lclass = menuName;
        oDropDown = $('<div class="dd-main-container" id="'+menuID+'_Menu"><nav style=""><ul><li>'+
                        '<div style="text-align: left;">'+
                        '<label id="'+menuID+'_label" tabindex="" for="select-input" >'+menuName+'</label>'+
            '</div><div class="shape_dropdown" aria-label="Mode menu. Press the enter key to open ' + menuName +' menu and press the tab key to switch options from the menu and press enter key to make a selection" title="'+menuName+'" tabindex="'+ Const.tabIndex+'" >'+
                        '<div class="navTopSpan"></div>'+
                        '<div class="shape_dd_arrows '+Lclass+'-arrow">'+
                        '<img class="img_top" id="shape_dd_img" src="images/up_arrow.svg">'+
                        '</div>'+
                        '<ul class="topUL '+Lclass+'-ul" id="dd-'+Lclass+'">'+              
                        '</ul>'+
                      '</div></li></ul></nav></div>');

            oDropDown.find('.shape_dropdown').on('click keydown', function(e){
                keyboardAccessibility(e, this);
            });
            Const.tabIndex++;

            var i;
            var LabelMain;
            var titleName;
            var lLabel;
            for(i=0;i<labelArray.length;i++)
            {
                LabelMain = labelArray[i];
                titleName = labelArray[i].replace(/_/g, " ");

                lLabel = titleName;
                
                var figureLi = ('<li  class="listItems">'+
                '<div tabindex="'+ Const.tabIndex+'" aria-label="'+lLabel+'" shapeType="'+LabelMain+'" title="'+lLabel+'" class="listdiv list'+LabelMain+'">'+LabelMain+'</div>'+
                '</li>');
                Const.tabIndex++;
                oDropDown.find('ul.topUL').append(figureLi);
            }


        // add button events
        oDropDown.find('ul.topUL li').bind('click keydown',handleButtonEvents);
        window.addEventListener("click", onWindowClick);
    }

    function keyboardAccessibility(e, DropDown)
    {
      if(e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32))
        return false;

        var topUL = $(DropDown).find('.topUL');
        var shapeDDImg = $(DropDown).find('#shape_dd_img');
        // $('.img_top').each(function(){
        //  if($(this) !== shapeDDImg)
        //  {
        //      //$(this).attr('src','images/up_arrow.svg');
        //      //isOpen = false;
        //  }
        // });

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
        var currentUL = $(e.target).parent().parent().parent();
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9))
            return false;
        
        if (e.keyCode !== 9) {  
            //caliper_event ----
            var caliper_obj = {};
            caliper_obj.type = "SessionEvent";
            caliper_obj.action = "Mode Changed";
            caliper_obj.time = (new Date()).toISOString();
            mhe.caliper(caliper_obj);   

            var titleName = $(e.target).attr('shapeType').replace('_', ' ');

            var ariaName = 'Mode menu. Press enter to open dropdown menu and press the tab key to switch options from the menu and press enter key to make a selection. selected mode is ' + titleName + '.';
            currentUL.attr('aria-label', ariaName);

            $(e.target).parents('.dd-color-main-container').find('.shape_dropdown').focus();    
            Evts.dispatchEvent('OPTION_SELECTED',{'selection':$(e.target).attr('shapeType'), 'currentUL': currentUL});
        }   

    }
    generate(labelArray, menuName);
    
    return{
        getHTML:function(){return oDropDown;},
        onWindowClick:onWindowClick,
        Evts:Evts
    };
};

// ddcomponent.js
