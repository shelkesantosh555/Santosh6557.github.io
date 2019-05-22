// area.js

/* global
$, mhe, 
evts, Const, Events,mheAreaVolumeTool,config
*/

/* exported
Area
*/


var Area = function(nCount)
{
    var cnt = nCount;
    var sId;
    var resultsData = {};  
    var evts = new Events();
    var pShape;
    var mainHolder;
    var resizeHolder;
    var shadowHolder;

    var startWidth;
    var startHeight;
    var objArr = [];
    
    var brColor = 'black';
    var quantity = 1;
    var unlock = true;
    var presetLockUnlock = false;
    var inputObj = $('.toolSideInput');
    var lockObj = $('#lock_div');
    var areaTransform = {top:0, left:0};
    var closeBtn;
    var isBreak;

    function create()
    {
        pShape = 'area';
        sId = pShape+'_'+cnt;

        //caliper_event ----
        var obj = {};
        obj.type = "SessionEvent";
        obj.action = "Area object Created";
        obj.time = (new Date()).toISOString();
        mhe.caliper(obj);

        mainHolder = document.createElement('div');
        mainHolder.setAttribute('id',"mainHolder_"+pShape+"_"+cnt);
        mainHolder.setAttribute('class', "mainHolder_area");
        
        shadowHolder = document.createElement('div');
        shadowHolder.setAttribute('id',"shadowHolder_"+pShape+"_"+cnt);
        shadowHolder.setAttribute('class',"shadowHolder");

        resizeHolder = document.createElement('div');
        resizeHolder.setAttribute('id',"resizeHolder_"+pShape+"_"+cnt);
        resizeHolder.setAttribute('class',"resizeHolder");
        resizeHolder.setAttribute('aria-label', "Area, Use arrow keys to move the area object on the canvas. If you want to change border color of the selected area object, press space key on keyboard to select this object and navigate to the respective dropdown and choose the color. If you want to check measurement of the selected area object then press M key on keyboard and use tab key to navigate through respective properties of the object.");
        resizeHolder.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        closeBtn = document.createElement('div');
        closeBtn.setAttribute('id', "closeBtn_" + pShape + "_" + cnt);
        closeBtn.setAttribute('class', "closeBtn");
        closeBtn.setAttribute('title', "Remove Area");
        closeBtn.setAttribute('aria-label','Delete. Press enter key to delete the selected Area.');
        closeBtn.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        $(shadowHolder).append(closeBtn);

        $(resizeHolder).on('focus click touchstart',onSetFocus);
        $(closeBtn).on('click touchstart',removeObject);

        $(resizeHolder).resizable({
            grid: [20,20],
            handles: 'ne, se, sw, nw',
            containment: '#areaVolumeTool',
            maxWidth: 240,
            maxHeight: 240,
            start: function(event, ui) {
                startWidth = $(this).width();
                startHeight = $(this).height();
                $(resizeHolder).focus();
                Const.areaResize = true;
            },
            resize: function(event, ui) {
                var wid = $(this).width();
                var hig = $(this).height();
                
                $(shadowHolder).css('width',wid+30);
                $(shadowHolder).css('height',hig+30);

                var left = parseFloat($(this).css('left'));
                var top = parseFloat($(this).css('top'));
                $(shadowHolder).css('left',left-14);
                $(shadowHolder).css('top',top-14);

                areaTransform.top = top;
                areaTransform.left = left;

                showResult();
            },
            stop: function(){
                
                //caliper_event ----
                var obj = {};
                obj.type = "SessionEvent";
                obj.action = "Resize Area";
                obj.time = (new Date()).toISOString();
                mhe.caliper(obj);

                mheAreaVolumeTool.rearange();
                mheAreaVolumeTool.onSaveSteps();
                Const.areaResize = false;
            }
        });
        $(resizeHolder).draggable({
              containment: '',
              start: function(){
                $(resizeHolder).focus();
              },
              drag: function( event, ui ) {
                $(shadowHolder).hide();
              },
              stop: function(event,ui){
                  
                mheAreaVolumeTool.rearange();

                var left = parseFloat($(this).css('left'));
                var top = parseFloat($(this).css('top'));
                $(shadowHolder).css('left',left-14);
                $(shadowHolder).css('top',top-14);

                $(shadowHolder).show();

                areaTransform.top = top;
                areaTransform.left = left;
                
                //caliper_event ----
                var obj = {};
                obj.type = "SessionEvent";
                obj.action = "Drag Area";
                obj.time = (new Date()).toISOString();
                mhe.caliper(obj);

                mheAreaVolumeTool.onSaveSteps();
              }
        });

        $(mainHolder).append(shadowHolder);
        $(mainHolder).append(resizeHolder);

        $(resizeHolder).css("z-index", Const.shapeZindex);
        $(shadowHolder).css("z-index", Const.shapeZindex);
        Const.shapeZindex++;

        $(mainHolder).bind('click keydown', handleMainHolderEvents);
        $(closeBtn).bind('keydown', handleCloseEvents);
        setShapeToCenter();

        setTimeout(function () {
            $("#mainHolder_" + pShape + "_" + cnt + ' .ui-resizable-ne').attr('aria-label','Top right, Use arrow keys to change the length and width of area.');
            $("#mainHolder_" + pShape + "_" + cnt + ' .ui-resizable-se').attr('aria-label', 'Bottom right, Use arrow keys to change the length and width of area.');
            $("#mainHolder_" + pShape + "_" + cnt + ' .ui-resizable-sw').attr('aria-label', 'Bottom left, Use arrow keys to change the length and width of area.');
            $("#mainHolder_" + pShape + "_" + cnt + ' .ui-resizable-nw').attr('aria-label', 'Top left, Use arrow keys to change the length and width of area.');

            $("#mainHolder_" + pShape +"_"+ cnt + ' .ui-resizable-ne').unbind('keydown').bind('keydown', handleResizeEventsNe);
            $("#mainHolder_" + pShape +"_"+ cnt + ' .ui-resizable-se').unbind('click keydown').bind('click keydown', handleResizeEventsSe);
            $("#mainHolder_" + pShape +"_"+ cnt + ' .ui-resizable-sw').unbind('click keydown').bind('click keydown', handleResizeEventsSw);
            $("#mainHolder_" + pShape +"_"+ cnt + ' .ui-resizable-nw').unbind('click keydown').bind('click keydown', handleResizeEventsNw);
        },100);

        return [mainHolder];
    }

    function handleResizeEventsNw(e) {
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            var left = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('left'));
            var top = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('top'));
            var sleft = left;
            var stop = top;
            var widthTemp = $("#resizeHolder_" + pShape + "_" + cnt).width();
            var heightTemp = $("#resizeHolder_" + pShape + "_" + cnt).height();

            // up
            if (e.keyCode === 38) {
                heightTemp = heightTemp + 20;
                stop = stop - 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                    stop = stop + 20;
                }
                if (heightTemp > 240){
                    heightTemp = 240;
                    stop = stop + 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('top', stop);

            }

            // down
            if (e.keyCode === 40) {
                heightTemp = heightTemp - 20;
                stop = stop + 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                    stop = stop + 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('top', stop);

            }

            // right
            if (e.keyCode === 39) {
                widthTemp = widthTemp - 20;
                sleft = sleft + 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                    sleft = sleft - 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('left', sleft);
            }

            // left
            if (e.keyCode === 37) {
                widthTemp = widthTemp + 20;
                sleft = sleft - 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                    sleft = sleft + 20;
                }
                if (widthTemp > 240) {
                    widthTemp = 240;
                    sleft = sleft + 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('left', sleft);
            }

            $("#shadowHolder_" + pShape + "_" + cnt).width(widthTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).height(heightTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).css('top', stop - 14);
            $("#shadowHolder_" + pShape + "_" + cnt).css('left', sleft - 14);

            var wid = Math.round($("#resizeHolder_" + pShape + "_" + cnt).width() / 20);
            var hig = Math.round($("#resizeHolder_" + pShape + "_" + cnt).height() / 20);

            $(event.target).attr('title', 'Length ' + wid + ' units and Width ' + hig + ' units');

            areaTransform.top = stop;
            areaTransform.left = sleft;

            showResult();
            mheAreaVolumeTool.onSaveSteps();
            mheAreaVolumeTool.rearange();
        }
    }

    function handleResizeEventsSw(e) {
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            var left = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('left'));
            var top = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('top'));
            var sleft = left;
            var stop = top;
            var widthTemp = $("#resizeHolder_" + pShape + "_" + cnt).width();
            var heightTemp = $("#resizeHolder_" + pShape + "_" + cnt).height();

            // up
            if (e.keyCode === 38) {
                heightTemp = heightTemp - 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
            }

            // down
            if (e.keyCode === 40) {
                heightTemp = heightTemp + 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                }
                if (heightTemp > 240) {
                    heightTemp = 240;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
            }

            // right
            if (e.keyCode === 39) {
                widthTemp = widthTemp - 20;
                sleft = sleft + 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                    sleft = sleft - 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('left', sleft);
            }

            // left
            if (e.keyCode === 37) {
                widthTemp = widthTemp + 20;
                sleft = sleft - 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                    sleft = sleft + 20;
                }
                if (widthTemp > 240) {
                    widthTemp = 240;
                    sleft = sleft + 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);
                $("#resizeHolder_" + pShape + "_" + cnt).css('left', sleft);
            }

            $("#shadowHolder_" + pShape + "_" + cnt).width(widthTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).height(heightTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).css('top', stop - 14);
            $("#shadowHolder_" + pShape + "_" + cnt).css('left', sleft - 14);

            var wid = Math.round($("#resizeHolder_" + pShape + "_" + cnt).width() / 20);
            var hig = Math.round($("#resizeHolder_" + pShape + "_" + cnt).height() / 20);

            $(event.target).attr('title', 'Length ' + wid + ' units and Width ' + hig + ' units');

            areaTransform.top = stop;
            areaTransform.left = sleft;

            showResult();
            mheAreaVolumeTool.onSaveSteps();
            mheAreaVolumeTool.rearange();
        }
    }

    function handleResizeEventsSe(e) {
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            var left = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('left'));
            var top = parseFloat($("#resizeHolder_" + pShape + "_" + cnt).css('top'));
            var sleft = left;
            var stop = top;
            var widthTemp = $("#resizeHolder_" + pShape + "_" + cnt).width();
            var heightTemp = $("#resizeHolder_" + pShape + "_" + cnt).height();

            // up
            if (e.keyCode === 38) {
                heightTemp = heightTemp - 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
            }

            // down
            if (e.keyCode === 40) {
                heightTemp = heightTemp + 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                }
                if (heightTemp > 240) {
                    heightTemp = 240;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).height(heightTemp);
            }

            // right
            if (e.keyCode === 39) {
                widthTemp = widthTemp + 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                }
                if (widthTemp > 240) {
                    widthTemp = 240;
                }
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);  
            }

            // left
            if (e.keyCode === 37) {
                widthTemp = widthTemp - 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                }   
                $("#resizeHolder_" + pShape + "_" + cnt).width(widthTemp);
            }

            $("#shadowHolder_" + pShape + "_" + cnt).width(widthTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).height(heightTemp + 30);
            $("#shadowHolder_" + pShape + "_" + cnt).css('top', stop - 14);
            $("#shadowHolder_" + pShape + "_" + cnt).css('left', sleft - 14);
            
            var wid = Math.round($("#resizeHolder_" + pShape + "_" + cnt).width() / 20);
            var hig = Math.round($("#resizeHolder_" + pShape + "_" + cnt).height() / 20);

            $(event.target).attr('title', 'Length ' + wid + ' units and Width ' + hig + ' units');
            
            areaTransform.top = stop;
            areaTransform.left = sleft;

            showResult();
            mheAreaVolumeTool.onSaveSteps();
            mheAreaVolumeTool.rearange();
        }
    }

    function handleResizeEventsNe(e) {
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            var left = parseFloat($("#resizeHolder_" + pShape +"_"+ cnt).css('left'));
            var top = parseFloat($("#resizeHolder_" + pShape +"_"+ cnt).css('top'));
            var sleft = left;
            var stop = top;
            var widthTemp = $("#resizeHolder_" + pShape +"_"+ cnt).width();
            var heightTemp = $("#resizeHolder_" + pShape +"_"+ cnt).height();
    
            // up
            if (e.keyCode === 38) {
                heightTemp = heightTemp + 20;
                stop = stop - 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                    stop = stop + 20;
                }
                if (heightTemp > 240) {
                    heightTemp = 240;
                    stop = stop + 20;
                }
                $("#resizeHolder_" + pShape +"_"+ cnt).height(heightTemp);
                $("#resizeHolder_" + pShape +"_"+ cnt).css('top', stop);
            }

            // down
            if (e.keyCode === 40) {
                heightTemp = heightTemp - 20;
                stop = stop + 20;
                if (heightTemp < 20) {
                    heightTemp = 20;
                    stop = stop - 20;
                }
                $("#resizeHolder_" + pShape +"_"+ cnt).height(heightTemp);
                $("#resizeHolder_" + pShape +"_"+ cnt).css('top', stop);    
            }

            // right
            if (e.keyCode === 39) {
                widthTemp = widthTemp + 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                }
                if (widthTemp > 240) {
                    widthTemp = 240;
                }   
                $("#resizeHolder_" + pShape +"_"+ cnt).width(widthTemp);
                    
            }

            // left
            if (e.keyCode === 37) {
                widthTemp = widthTemp - 20;
                if (widthTemp < 20) {
                    widthTemp = 20;
                }   
                $("#resizeHolder_" + pShape +"_"+ cnt).width(widthTemp);
            }

            $("#shadowHolder_" + pShape +"_"+ cnt).width(widthTemp + 30);
            $("#shadowHolder_" + pShape +"_"+ cnt).height(heightTemp + 30);
            $("#shadowHolder_" + pShape +"_"+ cnt).css('top', stop - 14);
            $("#shadowHolder_" + pShape +"_"+ cnt).css('left', sleft - 14);

            var wid = Math.round($("#resizeHolder_" + pShape + "_" + cnt).width() / 20);
            var hig = Math.round($("#resizeHolder_" + pShape + "_" + cnt).height() / 20);

            $(event.target).attr('title', 'Length ' + wid + ' units and Width ' + hig + ' units');

            areaTransform.top = stop;
            areaTransform.left = sleft;

            showResult();
            mheAreaVolumeTool.onSaveSteps();
            mheAreaVolumeTool.rearange();
        }
    }
    
    function handleCloseEvents(e){
        // 13 Enter
        // 32 Space
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9))
            return false;

        if (e.keyCode !== 9) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            removeObject();
        }   
    }

    function handleMainHolderEvents(e){
        
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 77 && e.keyCode !== 32 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            var left = parseFloat($('#' + $(event.target).attr('id')).css('left'));
            var top = parseFloat($('#' + $(event.target).attr('id')).css('top'));
            var sleft = left;
            var stop = top;
            // up
            if (e.keyCode === 38) {
                $('#' + $(event.target).attr('id')).css('top',top - 10);
                $('#' + $(event.target).attr('id')).attr('title', 'Up Position ' + (top - 10));
                sleft = left;
                stop = top - 10;
            }

            // down
            if (e.keyCode === 40) {
                $('#' + $(event.target).attr('id')).css('top', top + 10);
                $('#' + $(event.target).attr('id')).attr('title', 'Down Position ' + (top + 10));
                sleft = left;
                stop = top + 10;
            }

            // right
            if (e.keyCode === 39) {
                $('#' + $(event.target).attr('id')).css('left', left + 10);
                $('#' + $(event.target).attr('id')).attr('title', 'Right Position ' + (left + 10));
                sleft = left + 10;
                stop = top;
            }

            // left
            if (e.keyCode === 37) {
                $('#' + $(event.target).attr('id')).css('left', left - 10);
                $('#' + $(event.target).attr('id')).attr('title', 'Left Position ' + (left - 10));
                sleft = left - 10;
                stop = top;
            }

            $(shadowHolder).css('left', sleft - 14);
            $(shadowHolder).css('top', stop - 14);
            areaTransform.top = stop;
            areaTransform.left = sleft;
            mheAreaVolumeTool.rearange();
            mheAreaVolumeTool.onSaveSteps();
        }

        // Space
        if (e.keyCode === 32) {
            $('#Stroke_Menu .shape_dropdown').focus();
        }
        
        // M
        if (e.keyCode === 77) {
            $('.resultheading').focus();
        }
    }

    function setPresetData(oData){

        $("#resizeHolder_"+pShape+"_"+cnt).width(oData.width * 20);
        $("#resizeHolder_"+pShape+"_"+cnt).height(oData.height * 20);
        
        $(shadowHolder).css('width',(oData.width * 20)+30);
        $(shadowHolder).css('height',(oData.height * 20)+30);

        $("#resizeHolder_"+pShape+"_"+cnt).css('left',oData.left);
        $("#resizeHolder_"+pShape+"_"+cnt).css('top',oData.top);
        $(shadowHolder).css('left',oData.left-14);
        $(shadowHolder).css('top',oData.top-14);

        areaTransform.top = oData.top;
        areaTransform.left = oData.left;

        setResizeBorderColor(oData.color);
        setQuantity(oData.quantity);
        
        if(!oData.lockFlag){
            presetLockUnlock = true;
        }

        lockUnlock(oData.lockFlag);

        if (oData.filled > 0) {
            addBlock(oData.filled, false);
            setRemainingGrey();
        }    

        showResult();
        
        setTimeout(function () {
            $("#resizeHolder_" + pShape + "_" + cnt).focus();
        },100); 
        mheAreaVolumeTool.rearange();
    }

    function setShapeToCenter(){
        var width = $('#areaVolumeTool').width()/2;   
        var height = $('#areaVolumeTool').height()/2;
        var halfX = Math.round($(resizeHolder).width()/2);
        var halfY = Math.round($(resizeHolder).height()/2);

        $(resizeHolder).css('left',width - halfX);
        $(resizeHolder).css('top',height - halfY);   
        
        $(shadowHolder).css('left',width - halfX - 14);
        $(shadowHolder).css('top',height - halfY - 14);

        areaTransform.top = height - halfY;
        areaTransform.left = width - halfX;
    }

    function setResizeBorderColor(color){
        $(resizeHolder).css('border-color', Const.colorArray[color]);
        brColor = color;
    }

    function setQuantity(num){
        quantity = num;
    }

    function getResizeBorderColor(){
        return brColor;
    }

    function getQuantity(){
        return quantity;
    }

    function onSetFocus()
    {
        evts.dispatchEvent('focused',{'currObj':sId});
        $(resizeHolder).css("z-index", Const.shapeZindex);
        $(shadowHolder).css("z-index", Const.shapeZindex);
        Const.shapeZindex++;

        showResult();
    }

    function removeObject(){
        $(mainHolder).remove();
        evts.dispatchEvent('removed',{'currObj':sId});
    }

    function hideResizable(){
        $(resizeHolder).find('.ui-resizable-handle').hide();
        unlock = false;
        setToolbarForObj();
    }

    function showResizable(){
        if(!presetLockUnlock){
            if($(resizeHolder).find('.block').length === 0){
                $(resizeHolder).find('.ui-resizable-handle').show();
                unlock = true;
                setToolbarForObj(); 
            }
        }   
    }

    function setToolbarForObj(){
        // Mode
        var navDiv = $('#Mode_Menu .navTopSpan');
        navDiv.html('Area');

        // Border Color
        navDiv = $('#Stroke_Menu .navTopSpan div');
        navDiv.css('background-color', Const.colorArray[brColor]);   
        navDiv.css('border', '0px');   
        if(brColor == 'white'){
            navDiv.css('border', '1px solid #000000');   
        }

        // Quantity
        if (Const.getIsEdit()) {
            if (config.qLockFlag) {
                quantity = config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                // quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
        } else {
            if (Const.config.qLockFlag) {
                quantity = Const.config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                // quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
        }
        inputObj.val(quantity);

        // Lock
        if(unlock){
            lockObj.removeClass('buttonSelectedLock');
            lockObj.addClass('buttonSelectedUnLock');
            lockObj.attr('title', 'Size Unlock');
            lockObj.attr('aria-label', 'Size Unlock button, Press enter key to lock the Size of selected object on canvas.');
        }else{
            lockObj.addClass('buttonSelectedLock');
            lockObj.removeClass('buttonSelectedUnLock');
            lockObj.attr('title', 'Lock');
            lockObj.attr('title', 'Size Lock');
            lockObj.attr('aria-label', 'Size Lock button, Press enter key to Unlock Size of selected object on canvas.');
        }
    }

    function lockUnlock(flag){
        unlock = flag;
        if(!unlock){
            $(resizeHolder).find('.ui-resizable-handle').hide();
            presetLockUnlock = true;
        }else{
            if($(resizeHolder).find('.block').length > 0){
                
                lockObj.addClass('buttonSelectedLock');
                lockObj.removeClass('buttonSelectedUnLock');    
                
                unlock = false;
                Const.showOkAlertPopup('You cannot unlock a shape that has units in it. Please remove all units to unlock.');   
            }else{
                $(resizeHolder).find('.ui-resizable-handle').show();
                presetLockUnlock = false;
            }
        }
    }

    function getLockUnlock(flag){
        return unlock;
    }

    function removeBlock(flag,allFlag){
        var wid = Math.round($(resizeHolder).width() / 20);
        var hig = Math.round($(resizeHolder).height() / 20);
        var left = 0;
        var bottom = 0;
        
        var AreaByRow;

        if (Const.getIsEdit()) {
            AreaByRow = config.AreaByRow;
        } else {
            AreaByRow = Const.config.AreaByRow;
        }
        
        var firstLoopEnd;
        var lastLoopEnd;
        if(AreaByRow){
            firstLoopEnd = hig;
            lastLoopEnd = wid;  
        }else{
            firstLoopEnd = wid;
            lastLoopEnd = hig;  
        }

        var filled = $(resizeHolder).find('.block').length;

        if (flag > filled || filled === 0){
            Const.showOkAlertPopup('You don’t have that many units to remove. Please choose a smaller number.');    
        }else{
            var flgCnt = 0;

            for (var i = firstLoopEnd; i >= 0; i--) {
                isBreak = false;
                for (var j = lastLoopEnd; j >= 0 ; j--) {
                    if(AreaByRow){
                        left = j * 20;
                        bottom = i * 20;
                    }else{
                        left = i * 20;
                        bottom = j * 20;
                    }    
                    if (objArr['l' + left + 'b' + bottom] === 1) {
                        
                        // console.log('l' + left + 'b' + bottom);
                        
                        setRemainingGrey();
                        
                        $('#block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt).remove();
                        objArr['l' + left + 'b' + bottom] = undefined;
                        flgCnt ++;

                        if(!allFlag){
                            // console.log('flgCnt >= flag', flgCnt >= flag, flgCnt);
                            if(flgCnt >= flag){
                                isBreak = true;
                                break;
                            }
                        }    
                    }    
                }

                if (isBreak) {
                    break;
                }
            }
            showResizable();
            showResult();
        }    
    }

    function addBlock(flag,allFlag) {
        var wid = Math.round($(resizeHolder).width() / 20);
        var hig = Math.round($(resizeHolder).height() / 20);
        var left = 0;
        var bottom = 0;
        
        var firstLoopEnd;
        var lastLoopEnd;
        var AreaByRow;

        if (Const.getIsEdit()) {
            AreaByRow = config.AreaByRow;
        } else {
            AreaByRow = Const.config.AreaByRow;
        }
        
        if(AreaByRow){
            firstLoopEnd = hig;
            lastLoopEnd = wid;  
        }else{
            firstLoopEnd = wid;
            lastLoopEnd = hig;  
        }

        var filled = $(resizeHolder).find('.block').length;
        var unFilled = (wid * hig) - filled;

        if(flag > unFilled){
            Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.'); 
        }else{
            if (flag === 0 && unFilled === 0) {
                Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.');
            }else{
                setRemainingGrey(); 
            }   

            var flgCnt = 0;

            for (var i = 0; i < firstLoopEnd; i++) {
                isBreak = false;
                for (var j = 0; j < lastLoopEnd; j++) {
                    if(AreaByRow){
                        left = j * 20;
                        bottom = i * 20;
                    }else{
                        left = i * 20;
                        bottom = j * 20;
                    }    

                    if (Object.keys(objArr).length === 0) {
                        $(resizeHolder).append('<div class="block blue-b" id="block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt +'"></div>');
                        $('#block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt).css('bottom', bottom);
                        $('#block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt).css('left', left);

                        objArr['l' + left + 'b' + bottom] = 1;
                        flgCnt ++;

                        hideResizable();

                        if(!allFlag){
                            if(flgCnt >= flag){
                                isBreak = true;
                                break;
                            }
                        }    
                    } else {

                        if (objArr['l' + left + 'b' + bottom] === undefined) {
                            $(resizeHolder).append('<div class="block blue-b" id="block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt +'"></div>');
                            $('#block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt).css('bottom', bottom);
                            $('#block-' + 'l' + left + 'b' + bottom + '_' + pShape + '_' + cnt).css('left', left);

                            objArr['l' + left + 'b' + bottom] = 1;

                            flgCnt ++;

                            hideResizable();    

                            if(!allFlag){
                                if(flgCnt >= flag){
                                    isBreak = true;
                                    break;
                                }    
                            }
                        }
                    }
                }

                if (isBreak) {
                    break;
                }
            }
            showResult();
        }    
    }

    function setRemainingGrey(){
        $('#resizeHolder_'+pShape+'_'+cnt+' .block').each(function(){
            $(this).removeClass('blue-b');
            $(this).addClass('grey-b');
        });
    } 

    function showResult(){

        var wid = Math.round($(resizeHolder).width() / 20);
        var hig = Math.round($(resizeHolder).height() / 20);
        var filled = $(resizeHolder).find('.block').length;
        var unFilled = (wid * hig) - filled;
        var peri = (wid + hig)*2;
        resultsData = {
            "length": wid,
            "width": hig,
            "total": (wid * hig),
            "perimeter": peri,
            "filled": filled,
            "unfilled": unFilled,
        };

        $('.resultcontent #height').hide();
        
        if (Const.getIsEdit()){
            if (config.Area_Measures.Perimeter){
                $('.resultcontent #perimeter').show();
            }   
            if (config.Area_Measures.Length) {
                $('.resultcontent #length').show();
            }
            if (config.Area_Measures.Width) {   
                $('.resultcontent #width').show();
            }
            if (config.Area_Measures.Total_Area) {      
                $('.resultcontent #total').show();
            }
            if (config.Area_Measures.Filled_Area) {         
                $('.resultcontent #filled').show();
            }
            if (config.Area_Measures.Unfilled_Area) {           
                $('.resultcontent #unfilled').show();
            }

            // hide
            if (!config.Area_Measures.Perimeter) {
                $('.resultcontent #perimeter').hide();
            }
            if (!config.Area_Measures.Length) {
                $('.resultcontent #length').hide();
            }
            if (!config.Area_Measures.Width) {
                $('.resultcontent #width').hide();
            }
            if (!config.Area_Measures.Total_Area) {
                $('.resultcontent #total').hide();
            }
            if (!config.Area_Measures.Filled_Area) {
                $('.resultcontent #filled').hide();
            }
            if (!config.Area_Measures.Unfilled_Area) {
                $('.resultcontent #unfilled').hide();
            }   
        }else{
            if (!Const.config.Area_Measures.Perimeter) {
                $('.resultcontent #perimeter').hide();
            } else {
                $('.resultcontent #perimeter').show();
            }   
            if (!Const.config.Area_Measures.Length) {
                $('.resultcontent #length').hide();
            } else {
                $('.resultcontent #length').show();
            }
            if (!Const.config.Area_Measures.Width) {
                $('.resultcontent #width').hide();
            } else {
                $('.resultcontent #width').show();
            }
            if (!Const.config.Area_Measures.Total_Area) {
                $('.resultcontent #total').hide();
            } else {
                $('.resultcontent #total').show();
            }
            if (!Const.config.Area_Measures.Filled_Area) {
                $('.resultcontent #filled').hide();
            } else {
                $('.resultcontent #filled').show();
            }
            if (!Const.config.Area_Measures.Unfilled_Area) {
                $('.resultcontent #unfilled').hide();
            } else {
                $('.resultcontent #unfilled').show();
            }   
        }
        var currentDevice = Const.getCurrentDeviceType();
        if (currentDevice.indexOf('tablet') != -1 || currentDevice.indexOf('mobile') != -1) {
            if ($('#measures #result_arrow_span .open-img').css('display') === 'none') {
                $('.resultcontent').show();
            } else {
                $('.resultcontent').hide();
            }
        } else {
            if ($('#measures #result_arrow_span .open-img').css('display') === 'none') {
                $('.resultcontent').show();
            } else {
                $('.resultcontent').hide();
            }
        } 
        
        $('.resultcontent').removeClass('volume-m');
        $('.resultcontent').addClass('area-m');
        var unitsText = 'units';
        // Length
        if (wid > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #length #length-values li').html(wid + ' ' + unitsText);

        // Width
        if (hig > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #width #width-values li').html(hig + ' ' + unitsText);

        // Perimeter
        if (peri > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #perimeter #perimeter-values li').html(peri + ' ' + unitsText);

        // Total 
        if ((wid * hig) > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #total .total-span').html('Total Area');
        $('.resultcontent #total .total-span').attr('aria-label','Total Area');
        $('.resultcontent #total #total-values li').html((wid * hig) + ' square ' + unitsText);

        // Filled
        if (filled > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #filled .filled-span').html('Filled Area');
        $('.resultcontent #filled .filled-span').attr('aria-label', 'Filled Area');
        $('.resultcontent #filled #filled-values li').html(filled + ' square ' + unitsText);

        // UnFilled
        if (unFilled > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #unfilled .unfilled-span').html('Unfilled Area');
        $('.resultcontent #unfilled .unfilled-span').attr('aria-label', 'Unfilled Area');
        $('.resultcontent #unfilled #unfilled-values li').html(unFilled + ' square ' + unitsText);

        var oMeasuresComponent = $('#measures');
        $(oMeasuresComponent.find('.resultcontent')).find('.cb').each(function () {
            var title1;
            if ($(this).attr('title') === 'Total' || $(this).attr('title') === 'Filled' || $(this).attr('title') === 'Unfilled') {
                if ($('.resultcontent').hasClass('volume-m')) {
                    title1 = 'Volume';
                } else {
                    title1 = 'Area';
                }
            }
            if ($(this).hasClass('clicked')) {
                $(this).attr('aria-label', 'Deselect the checkbox to hide the ' + $(this).attr('title') + ' ' + title1 + ' by pressing enter key on keyboard.');
            } else {
                $(this).attr('aria-label', 'Select the checkbox to see the ' + $(this).attr('title') + ' ' + title1 + ' by pressing enter key on keyboard.');
            }
        });
    }

    return{
        evts:evts,
        addBlock:addBlock,
        create:create,
        removeBlock:removeBlock,
        setResizeBorderColor:setResizeBorderColor,
        setQuantity:setQuantity,
        setToolbarForObj:setToolbarForObj,
        setPresetData:setPresetData,

        getResizeBorderColor:getResizeBorderColor,
        getQuantity:getQuantity,
        getLockUnlock:getLockUnlock,
        getTransformDataLeft: function() { return areaTransform.left; },
        getTransformDataTop: function () { return areaTransform.top; },

        lockUnlock:lockUnlock,
        setRemainingGrey:setRemainingGrey,
        pShape:'area',
        resultsData: function() { return resultsData;},
        showResult: showResult,
    };  
};

// area.js
