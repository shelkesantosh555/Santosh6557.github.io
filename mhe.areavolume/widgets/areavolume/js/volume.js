// volume.js

/* global
$, mhe, THREE, THREEx
*/

/* exported
Volume
*/


var Volume = function(nCount)
{
    var cnt = nCount;
    var sId;
    var resultsData = {};  
    var evts = new Events();
    var pShape;
    var mainHolder;
    var mainSubHolder;

    var objArr = [];

    var brColor = 'black';
    var quantity = 1;
    var unlock = true;
    var inputObj = $('.toolSideInput');
    var lockObj = $('#lock_div');

    // Volume 

    var container;
    var camera, scene, renderer;
    var cube;
    var domEvents;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;
    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var dragMultiplier = 400;
    var mainWidth;
    var mainHeight;
    var windowHalfX;
    var windowHalfY;

    var materialMain;
    
    var width = 80;
    var height = 60;
    var depth = 80;

    var startWidth = 80;
    var startHeight = 60;
    var startDepth = 80;
    var wireframe;
    
    var isRotate = false;
    
    var mouse = new THREE.Vector2();
    var SELECTED;
    var mouseDown = false;
    var startMouse = {};
    var smallCubeArr = [];
    var zoomScale = 1;
    var keyRotate = false;

    var focusVert;

    var volumeTransform = {top:0, left:0};

    var presetLockUnlock = false;
    var closeBtn;
    var headBtn;
    var resizePoint1;
    var resizePoint2;
    var resizePoint3;
    var resizePoint4;
    var resizePoint7;
    var zoomLabelBtn;
    var zoomInBtn;
    var zoomOutBtn;
    var resetBtn;
    var isBreak;

    function create()
    {
        pShape = 'volume';
        sId = pShape+'_'+cnt;

        //caliper_event ----
        var obj = {};
        obj.type = "SessionEvent";
        obj.action = "Volume object Created";
        obj.time = (new Date()).toISOString();
        mhe.caliper(obj);

        mainHolder = document.createElement('div');
        mainHolder.setAttribute('id',"mainHCanvasDiv_"+pShape+"_"+cnt);
        mainHolder.setAttribute('class',"mainHCanvasDiv");
        mainHolder.setAttribute('aria-label', "Volume, Use arrow keys to move the Volume object on the canvas. If you want to change border color of the selected volume object, press space key on keyboard to select this object and navigate to the respective dropdown and choose the color. If you want to check measurement of the selected volume object then press M key on keyboard and use tab key to navigate through respective properties of the object.");
        mainHolder.setAttribute('style',"width:350px;height:390px;");
        mainHolder.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        closeBtn = document.createElement('div');
        closeBtn.setAttribute('id', "closeBtnVolume_" + pShape + "_" + cnt);
        closeBtn.setAttribute('class', "closeBtnVolume");
        closeBtn.setAttribute('title', "Remove Volume");
        closeBtn.setAttribute('aria-label', 'Delete. Press enter key to delete the selected Volume.');
        closeBtn.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        headBtn = document.createElement('div');
        headBtn.setAttribute('id', "headBtnVolume_" + pShape + "_" + cnt);
        headBtn.setAttribute('class', "headBtnVolume");

        mainSubHolder = document.createElement('div');
        mainSubHolder.setAttribute('id',"mainCanvasDiv_"+pShape+"_"+cnt);
        mainSubHolder.setAttribute('class',"mainCanvasDiv");
        mainSubHolder.setAttribute('aria-label', "Rotate volume. If you have enabled rotation of volume then use left or right arrow keys to rotate the selected volume.");
        mainSubHolder.setAttribute('style',"width:350px;height:390px;");
        mainSubHolder.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        resizePoint1 = document.createElement('div');
        resizePoint1.setAttribute('id', "resizePoint1Volume_" + pShape + "_" + cnt);
        resizePoint1.setAttribute('class', "resizePoint1Volume resizePointVolume");
        resizePoint1.setAttribute('aria-label','Front Top right, Use arrow keys to change the length and height of volume.');
        resizePoint1.setAttribute('data-class', "resizeVertex-0");
        resizePoint1.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        resizePoint2 = document.createElement('div');
        resizePoint2.setAttribute('id', "resizePoint2Volume_" + pShape + "_" + cnt);
        resizePoint2.setAttribute('class', "resizePoint2Volume resizePointVolume");
        resizePoint2.setAttribute('aria-label', 'Front Bottom right, Use arrow keys to change the length and height of volume.');
        resizePoint2.setAttribute('data-class', "resizeVertex-2");
        resizePoint2.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        resizePoint3 = document.createElement('div');
        resizePoint3.setAttribute('id', "resizePoint3Volume_" + pShape + "_" + cnt);
        resizePoint3.setAttribute('class', "resizePoint3Volume resizePointVolume");
        resizePoint3.setAttribute('aria-label', 'Front Bottom left, Use arrow keys to change the length and height of volume.');
        resizePoint3.setAttribute('data-class', "resizeVertex-7");
        resizePoint3.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        resizePoint4 = document.createElement('div');
        resizePoint4.setAttribute('id', "resizePoint4Volume_" + pShape + "_" + cnt);
        resizePoint4.setAttribute('class', "resizePoint4Volume resizePointVolume");
        resizePoint4.setAttribute('aria-label', 'Front Top left, Use arrow keys to change the length and height of volume.');
        resizePoint4.setAttribute('data-class', "resizeVertex-5");
        resizePoint4.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        resizePoint7 = document.createElement('div');
        resizePoint7.setAttribute('id', "resizePoint7Volume_" + pShape + "_" + cnt);
        resizePoint7.setAttribute('class', "resizePoint7Volume resizePointVolume");
        resizePoint7.setAttribute('aria-label', 'Rear Bottom left, Use Up and Down arrow keys to change the width of volume.');
        resizePoint7.setAttribute('data-class', "resizeVertex-6");
        resizePoint7.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        zoomLabelBtn = document.createElement('div');
        zoomLabelBtn.setAttribute('id', "zoomLabelBtnVolume_" + pShape + "_" + cnt);
        zoomLabelBtn.setAttribute('class', "zoomLabelBtnVolume");
        $(zoomLabelBtn).append('Zoom');

        zoomInBtn = document.createElement('div');
        zoomInBtn.setAttribute('id',"zoomInBtnVolume_"+pShape+"_"+cnt);
        zoomInBtn.setAttribute('class',"zoomInBtnVolume");
        zoomInBtn.setAttribute('aria-label',"Zoom In, Press enter key to zoom in the volume object.");
        zoomInBtn.setAttribute('title', "Zoom In");
        zoomInBtn.setAttribute('tabindex', Const.shapeTabIndex);
        $(zoomInBtn).append('+');
        Const.shapeTabIndex++;

        zoomOutBtn = document.createElement('div');
        zoomOutBtn.setAttribute('id',"zoomOutBtnVolume_"+pShape+"_"+cnt);
        zoomOutBtn.setAttribute('class',"zoomOutBtnVolume");
        zoomOutBtn.setAttribute('aria-label', "Zoom Out, Press enter key to zoom out the volume object.");
        zoomOutBtn.setAttribute('title', "Zoom Out");
        zoomOutBtn.setAttribute('tabindex', Const.shapeTabIndex);
        $(zoomOutBtn).append('-');
        Const.shapeTabIndex++;

        resetBtn = document.createElement('div');
        resetBtn.setAttribute('id',"resetBtnVolume_"+pShape+"_"+cnt);
        resetBtn.setAttribute('class',"resetBtnVolume");
        resetBtn.setAttribute('aria-label', "Reset Zoom, Press enter key to reset the zoom level of volume object.");
        resetBtn.setAttribute('title', "Reset Zoom");
        resetBtn.setAttribute('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        $(mainHolder).append(headBtn);
        $(mainHolder).append(resizePoint1);
        $(mainHolder).append(resizePoint2);
        $(mainHolder).append(resizePoint3);
        $(mainHolder).append(resizePoint4);
        $(mainHolder).append(resizePoint7);

        $(mainHolder).append(closeBtn);
        $(mainHolder).append(mainSubHolder);
        
        $(mainHolder).append(zoomLabelBtn);
        $(mainHolder).append(zoomInBtn);
        $(mainHolder).append(zoomOutBtn);
        $(mainHolder).append(resetBtn);

        $(mainHolder).on('focus click touchstart',onSetFocus);
        $(closeBtn).on('click touchstart',removeObject);

        $(closeBtn).bind('keydown', handleCloseEvents);
        $(mainHolder).bind('keydown', handleMainHolderEvents);
        $(mainSubHolder).bind('keydown', handleRotateByKeyEvents);
        $(mainSubHolder).bind('focusout', handleUpRotateByKeyEvents);
        
        // Front (Height, Width)
        $(resizePoint1).bind('keydown', handleResizeFrontEvents);
        $(resizePoint2).bind('keydown', handleResizeFrontEvents);
        $(resizePoint3).bind('keydown', handleResizeFrontEvents);
        $(resizePoint4).bind('keydown', handleResizeFrontEvents);

        $(resizePoint1).bind('focus', handleResizeFrontFocusEvents);
        $(resizePoint2).bind('focus', handleResizeFrontFocusEvents);
        $(resizePoint3).bind('focus', handleResizeFrontFocusEvents);
        $(resizePoint4).bind('focus', handleResizeFrontFocusEvents);

        $(resizePoint1).bind('focusout', handleResizeFrontFocusOutEvents);
        $(resizePoint2).bind('focusout', handleResizeFrontFocusOutEvents);
        $(resizePoint3).bind('focusout', handleResizeFrontFocusOutEvents);
        $(resizePoint4).bind('focusout', handleResizeFrontFocusOutEvents);

        // Back (Depth)
        $(resizePoint7).bind('keydown', handleResizeBackEvents);
        $(resizePoint7).bind('focus', handleResizeFrontFocusEvents);
        $(resizePoint7).bind('focusout', handleResizeFrontFocusOutEvents);

        mainWidth = $(mainSubHolder).width();
        mainHeight = $(mainSubHolder).height();

        windowHalfX = mainWidth / 2;
        windowHalfY = mainHeight / 2;

        init();
        animate();

        $(mainHolder).css("z-index", Const.shapeZindex);
        Const.shapeZindex++;    

        setShapeToCenter();

        setTimeout(function() {
            $(mainHolder).draggable({
                // containment: '#areaVolumeTool',
                containment: '',
                start:function(){
                    $(mainHolder).focus();
                },
                stop: function(event,ui){
                    
                    mheAreaVolumeTool.rearange();

                    var left = parseFloat($(this).css('left'));
                    var top = parseFloat($(this).css('top'));
                    
                    volumeTransform.left = left;
                    volumeTransform.top = top;

                    //caliper_event ----
                    var obj = {};
                    obj.type = "SessionEvent";
                    obj.action = "Drag Volume";
                    obj.time = (new Date()).toISOString();
                    mhe.caliper(obj);

                    mheAreaVolumeTool.onSaveSteps();
                },
            });
            // showResult();
            // $('#rotateBtnVolume_'+sId).on('click keydown touchstart',rotateObject);
            $('#zoomInBtnVolume_' + sId).on('click keydown touchstart',zoomInObject);
            $('#zoomOutBtnVolume_' + sId).on('click keydown touchstart',zoomOutObject);
            $('#resetBtnVolume_' + sId).on('click keydown touchstart',resetObject);
            rotateDisable();

            $('#undo_div').unbind('mouseout touchend').bind('mouseout touchend', updatePresetFlag);
            $('#redo_div').unbind('mouseout touchend').bind('mouseout touchend', updatePresetFlag);

        },100); 

        return [mainHolder];
    }

    function updatePresetFlag(e){
        Const.presetFlag = false;
    }

    function handleResizeFrontFocusEvents(e) {
        focusVert = $(e.target).attr('data-class');
        cube.getObjectByName(focusVert).material.color.setHex("0xf7931e");
    }
    
    function handleResizeFrontFocusOutEvents(e) {
        focusVert = null;
        cube.getObjectByName($(e.target).attr('data-class')).material.color.setHex("0xFFFFFF");
    }
    
    function handleResizeBackEvents(e){
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

            // up
            if (e.keyCode === 38) {
                depth = depth + 20;
                updateGroupGeometry(width, height, depth);
            }

            // down
            if (e.keyCode === 40) {
                depth = depth - 20;
                updateGroupGeometry(width, height, depth);
            }

            $(event.target).attr('title', 'Length ' + width/20 + ' units, Width ' + depth/20 + ' units and Height ' + height/20 + ' units');

            showResult();
            cube.getObjectByName(focusVert).material.color.setHex("0xf7931e");
            mheAreaVolumeTool.onSaveSteps();
        }
    }

    function handleResizeFrontEvents(e){
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
            
            // up
            if (e.keyCode === 38) {
                if ($(e.target).attr('data-class') === 'resizeVertex-2' || $(e.target).attr('data-class') === 'resizeVertex-7') {
                    height = height - 20;
                    updateGroupGeometry(width, height, depth); 
                }else{
                    height = height + 20;
                    updateGroupGeometry(width, height, depth); 
                }
            }

            // down
            if (e.keyCode === 40) {
                if ($(e.target).attr('data-class') === 'resizeVertex-2' || $(e.target).attr('data-class') === 'resizeVertex-7') {
                    height = height + 20;
                    updateGroupGeometry(width, height, depth);
                }else{
                    height = height - 20;
                    updateGroupGeometry(width, height, depth);
                }    
            }

            // right
            if (e.keyCode === 39) {
                if ($(e.target).attr('data-class') === 'resizeVertex-7' || $(e.target).attr('data-class') === 'resizeVertex-5'){
                    width = width - 20;
                    updateGroupGeometry(width, height, depth); 
                }else{
                    width = width + 20;
                    updateGroupGeometry(width, height, depth); 
                }
            }

            // left
            if (e.keyCode === 37) {
                if ($(e.target).attr('data-class') === 'resizeVertex-7' || $(e.target).attr('data-class') === 'resizeVertex-5') {
                    width = width + 20;
                    updateGroupGeometry(width, height, depth); 
                }else{
                    width = width - 20;
                    updateGroupGeometry(width, height, depth); 
                }
            }

            $(event.target).attr('title', 'Length ' + width / 20 + ' units, Width ' + depth / 20 + ' units and Height ' + height / 20 + ' units');

            showResult();
            cube.getObjectByName(focusVert).material.color.setHex("0xf7931e");
            mheAreaVolumeTool.onSaveSteps();
        }
    }

    function handleUpRotateByKeyEvents(e){
        keyRotate = false;
    }

    function handleRotateByKeyEvents(e){
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39)) {
            return false;
        }

        if (e) {
            if (e.keyCode !== 9) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        if (e.keyCode === 37 || e.keyCode === 39) {
            keyRotate = true;
            // right
            if (e.keyCode === 39) {
                if (isRotate) {
                    cube.rotation.y = cube.rotation.y + 0.1;
                }   
            }

            // left
            if (e.keyCode === 37) {
                if (isRotate) {
                    cube.rotation.y = cube.rotation.y - 0.1;
                }   
            }
        }
    }

    function handleCloseEvents(e) {
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
                $('#' + $(event.target).attr('id')).css('top', top - 10);
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

            volumeTransform.top = stop;
            volumeTransform.left = sleft;

            mheAreaVolumeTool.onSaveSteps();
            mheAreaVolumeTool.rearange();
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

    function setPresetData(oData) {

        updateGroupGeometry(oData.width * 20, oData.height * 20, oData.depth * 20);

        $("#mainHCanvasDiv_" + pShape + "_" + cnt).css('left', oData.left);
        $("#mainHCanvasDiv_" + pShape + "_" + cnt).css('top', oData.top);

        volumeTransform.top = oData.top;
        volumeTransform.left = oData.left;

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

        setTimeout(function () {
            cube.scale.set(oData.zoomScale, oData.zoomScale, oData.zoomScale);
            zoomScale = oData.zoomScale;
            // if (!oData.isRotate) {
            //     isRotate = false;
            //     $('#rotateBtnVolume_' + sId).css('background-color', '#FFFFFF');
            //     $(mainHolder).draggable({ disabled: false });
            //     // cube.rotation.y = Math.PI * 0.1;
            //     cube.rotation.y = Math.PI * 0.1;
            // } else {
            //     isRotate = true;
            //     $('#rotateBtnVolume_' + sId).css('background-color', '#93A5AC');
            //     $(mainHolder).draggable({ disabled: true });
            //     targetRotation = 0.8200000000000001;
            //     rotateEnable();
            // }

            if (!oData.lockFlag) {
                isRotate = true;
                rotateEnable();
                targetRotation = 0.8200000000000001;
            }else{
                isRotate = false;
                cube.rotation.y = Math.PI * 0.1;
            }    

            $("#mainHCanvasDiv_" + pShape + "_" + cnt).focus();
        },150);

        showResult();
        mheAreaVolumeTool.rearange();
    }

    function resetObject(e){
        // 13 Enter
        // 32 Space
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9))
            return false;

        if (e.keyCode !== 9) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            zoomScale = 1;
            cube.scale.set(zoomScale, zoomScale, zoomScale);
            
            //caliper_event ----
            var obj = {};
            obj.type = "SessionEvent";
            obj.action = "Reset Zoom State";
            obj.time = (new Date()).toISOString();
            mhe.caliper(obj);

            mheAreaVolumeTool.onSaveSteps();
        }
    }

    function zoomInObject(e){
        // 13 Enter
        // 32 Space
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9))
            return false;

        if (e.keyCode !== 9) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (zoomScale < 1.4) {
                zoomScale = zoomScale + 0.1;
                cube.scale.set(zoomScale, zoomScale, zoomScale);

                //caliper_event ----
                var obj = {};
                obj.type = "SessionEvent";
                obj.action = "Zoom In Volume";
                obj.time = (new Date()).toISOString();
                mhe.caliper(obj);

                mheAreaVolumeTool.onSaveSteps();
            }    
        }
    }

    function zoomOutObject(e){
        // 13 Enter
        // 32 Space
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9))
            return false;

        if (e.keyCode !== 9) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (zoomScale > 0.7) {
                zoomScale = zoomScale - 0.1;
                cube.scale.set(zoomScale, zoomScale, zoomScale);

                //caliper_event ----
                var obj = {};
                obj.type = "SessionEvent";
                obj.action = "Zoom Out Volume";
                obj.time = (new Date()).toISOString();
                mhe.caliper(obj);

                mheAreaVolumeTool.onSaveSteps();
            }
        }    
    }

    function setShapeToCenter(){
        var width = $('#areaVolumeTool').width()/2;   
        var height = $('#areaVolumeTool').height()/2;

        $(mainHolder).css('left',width - windowHalfX);
        $(mainHolder).css('top',height - windowHalfY);   

        volumeTransform.left = width - windowHalfX;
        volumeTransform.top = height - windowHalfY;
    }

    function setResizeBorderColor(color){
        brColor = color;
        cube.children[ 0 ].material.color.setHex(Const.colorArray[color].replace("#", "0x"));
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
        $(mainHolder).css("z-index", Const.shapeZindex);
        Const.shapeZindex++;

        if (!unlock){
            $('#zoomInBtnVolume_' + sId).show();
            $('#zoomOutBtnVolume_' + sId).show();
            $('#resetBtnVolume_' + sId).show();    
            $('#zoomLabelBtnVolume_' + sId).show();    
        }    

        showResult();
    }

    function removeObject(){
        $(mainHolder).remove();
        evts.dispatchEvent('removed',{'currObj':sId});
    }

    // function rotateObject(e){
        // 13 Enter
        // 32 Space

        // if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 9))
        //     return false;

        // if (e.keyCode !== 9) {
        //     if (e) {
        //         e.stopPropagation();
        //         e.preventDefault();
        //     }
        //     if (!unlock){
        //         if (isRotate) {
        //             isRotate = false;
        //             $('#rotateBtnVolume_' + sId).css('background-color', '#FFFFFF');
        //             $(mainHolder).draggable({ disabled: false });
        //             // cube.rotation.y = Math.PI * 0.1;
        //             cube.rotation.y = Math.PI * 0.1;
        //             targetRotation = 0.8200000000000001;
        //             $('#rotateBtnVolume_' + sId).attr('aria-label', "Volume Rotation OFF, press enter key to turn on the rotation of volume.");
        //         } else {
        //             isRotate = true;
        //             $('#rotateBtnVolume_' + sId).css('background-color', '#93A5AC');
        //             $(mainHolder).draggable({ disabled: true });
        //             targetRotation = 0.8200000000000001;
        //             $('#rotateBtnVolume_' + sId).attr('aria-label', "Volume Rotation ON, press enter key to turn off the rotation of volume.");
        //             $('#mainCanvasDiv_' + sId).focus();
        //         }

        //         mheAreaVolumeTool.onSaveSteps();
        //         evts.dispatchEvent('rotate', { 'currObj': sId });
        //     }    
        // }   
    // }

    function rotateDisable(){
        // $('#rotateBtnVolume_'+sId).css('pointer-events','none');  
        // $('#rotateBtnVolume_'+sId).css('opacity','0.8'); 
        
        // $('#rotateBtnVolume_' + sId).attr('aria-label', "Rotate button disabled, to enable the rotate button navigate to the toolbar & lock the size of volume using size lock button.");

        isRotate = false;
        cube.rotation.y = Math.PI * 0.1;
        targetRotation = 0.8200000000000001;
        
        // $('#rotateBtnVolume_'+sId).css('background-color','#FFFFFF');    
        // $(mainHolder).draggable({ disabled: false });
        // cube.rotation.y = Math.PI * 0.1 
        cube.rotation.y = Math.PI * 0.1;

        $('#zoomInBtnVolume_'+sId).hide();
        $('#zoomOutBtnVolume_'+sId).hide();
        $('#resetBtnVolume_'+sId).hide();
        $('.resizePointVolume').show();
        $('#zoomLabelBtnVolume_' + sId).hide();

        zoomScale = 1;
        cube.scale.set(zoomScale, zoomScale, zoomScale);
    }

    function rotateEnable(){
        isRotate = true;
        targetRotation = 0.8200000000000001;
        $('#mainCanvasDiv_' + sId).focus();
        $('#zoomInBtnVolume_'+sId).show();
        $('#zoomOutBtnVolume_'+sId).show();
        $('#resetBtnVolume_'+sId).show();
        $('#zoomLabelBtnVolume_' + sId).show();
        $('.resizePointVolume').hide();
    }

    function hideResizableFirst(){
        removeCorners();
        unlock = false;
        setToolbarForObj();
        rotateEnable();
    }

    function hideResizable() {
        removeCorners();
        unlock = false;
        setToolbarForObj();

        isRotate = true;
        // targetRotation = 0.8200000000000001;
        $('#mainCanvasDiv_' + sId).focus();
        $('#zoomInBtnVolume_' + sId).show();
        $('#zoomOutBtnVolume_' + sId).show();
        $('#resetBtnVolume_' + sId).show();
        $('#zoomLabelBtnVolume_' + sId).show();
        $('.resizePointVolume').hide();
    }

    function showResizable(){
        if(!presetLockUnlock){
            if(smallCubeArr.length === 0){
                updateGroupGeometry(width,height,depth);
                unlock = true;
                setToolbarForObj(); 
                rotateDisable();
            }
        }    
    }

    function setToolbarForObj(){
        // Mode
        var navDiv = $('#Mode_Menu .navTopSpan');
        navDiv.html('Volume');

        // Border Color
        navDiv = $('#Stroke_Menu .navTopSpan div');
        navDiv.css('background-color', Const.colorArray[brColor]);   
        navDiv.css('border', '0px');   
        if(brColor == 'white'){
            navDiv.css('border', '1px solid #000000');   
        }

        // Quantity
        if (Const.getIsEdit()) {
            if (config.qLockFlag){
                quantity = config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });  
            }else{
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
            lockObj.attr('title', 'Size Lock');
            lockObj.attr('aria-label', 'Size Lock button, Press enter key to Unlock Size of selected object on canvas.');
        }
    }

    function lockUnlock(flag){
        unlock = flag;
        if(!unlock){
            removeCorners();
            rotateEnable(); 
            presetLockUnlock = true; 
        }else{
            if(smallCubeArr.length > 0){
                
                lockObj.addClass('buttonSelectedLock');
                lockObj.removeClass('buttonSelectedUnLock');    
                
                unlock = false;

                Const.showOkAlertPopup('You cannot unlock a shape that has units in it. Please remove all units to unlock.');   
            }else{
                if(smallCubeArr.length === 0){
                    updateGroupGeometry(width,height,depth);
                    rotateDisable();
                    presetLockUnlock = false; 
                }
            }
        }
    }

    function getLockUnlock(flag){
        return unlock;
    }


    function init() {          
        
        container = $(mainSubHolder)[0];

        // scene
        scene = new THREE.Scene();
        
        // camera
        // camera = new THREE.PerspectiveCamera( cameraPerspective, mainWidth / mainHeight, 1, 1000 );
        camera = new THREE.OrthographicCamera(mainWidth / - 2, mainWidth / 2, mainHeight / 2, mainHeight / - 2, 1, 100000);
        camera.position.set(0,150,500);

        // renderer
        renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( mainWidth, mainHeight );
        container.appendChild( renderer.domElement );

        addEvents();
        createCube();
    }

    function createCube(){
        // Cube
        domEvents = new THREEx.DomEvents(camera, renderer.domElement);
        var geometry = new THREE.BoxGeometry( width, height, depth, 0, 0, 0);
        materialMain = new THREE.MeshBasicMaterial({ 
            color:"#FFFFFF", 
            wireframe: false,
            transparent: true,
            opacity: 0.001,
            side: THREE.BackSide
        });

        cube = new THREE.Mesh( geometry, materialMain );
        cube.position.y = 150;
        scene.add(cube);

        var geo = new THREE.EdgesGeometry( cube.geometry );

        var mat = new THREE.LineBasicMaterial({color: brColor, linewidth: 2});
        wireframe = new THREE.LineSegments( geo, mat );
        cube.add(wireframe);

        cube.rotation.y = Math.PI * 0.1;
        cube.rotation.x = Math.PI * 0.1;

        addCorners(cube.geometry);
        addCornerEvents();
    }

    function addCorners(geo){
        var vertexHelpers=[];
        var sphere;
        for(var i = 0; i < geo.vertices.length; i++){
            if (i === 0 || i === 6 || i === 2 || i === 7 || i === 5){
                
                if(i === 6){
                    var texture = new THREE.TextureLoader().load('images/vertical-flip.png');
                    sphere = new THREE.Mesh(
                        new THREE.CircleGeometry(15, 36),
                        new THREE.MeshBasicMaterial({ map: texture })
                    );
                }else{
                    var currentDevice = Const.getCurrentDeviceType();
                    if (currentDevice.indexOf('tablet') != -1 || currentDevice.indexOf('mobile') != -1){
                        sphere = new THREE.Mesh(
                            new THREE.CircleGeometry(15, 36),
                            new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
                        );
                    }else{
                        sphere = new THREE.Mesh(
                            new THREE.CircleGeometry(15, 36),
                            new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
                        );
                    }    
                    
                    // var currentDevice = Const.getCurrentDeviceType();
                    // if (currentDevice.indexOf('tablet') != -1 || currentDevice.indexOf('mobile') != -1){
                    //     var geometry1 = new THREE.BoxGeometry(80, 80, 0, 0, 0, 0);
                    // }
                }    

                var vertexHelper = sphere;
                vertexHelper.name = 'resizeVertex-' + i;
                var vertexPosition = geo.vertices[i];
                vertexHelper.position.copy(vertexPosition);
                vertexHelper.position.z = vertexHelper.position.z + 10;
                if (i === 6) {
                    vertexHelper.position.y = vertexHelper.position.y + 13;
                    vertexHelper.rotation.z = 0.6;
                }    
                if (SELECTED) {
                    vertexHelper.visible = false;
                }else{
                    vertexHelper.visible = true;
                }    
                vertexHelper.data = {index:i};
                cube.add(vertexHelper);
                vertexHelpers.push(vertexHelper);
                
                var geoS = new THREE.EdgesGeometry(sphere.geometry);
                var mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});
                var wireframe1 = new THREE.LineSegments(geoS, mat);
                sphere.add(wireframe1);
            }    
        }
    }

    function addCornerEvents(){
        cube.children.forEach(function(mesh){
            if(mesh.name.indexOf('resizeVertex') !== -1){
                domEvents.addEventListener(mesh,'mousedown',onDocumentMouseDown); 
                domEvents.addEventListener(mesh,'touchstart',onDocumentMouseDown);
                domEvents.addEventListener(mesh, 'mousemove', onCursorMouseMove); 
            }
        });
    }

    function onCursorMouseMove(){
        $(mainSubHolder).css('cursor','pointer');
    }

    function addEvents(){
        // Rotate Events
        $(mainSubHolder).unbind('mousedown').bind('mousedown',onRotateMouseDown);
        $(mainSubHolder).unbind('touchstart').bind('touchstart',onRotateTouchStart);
        $(mainSubHolder).unbind('touchmove').bind('touchmove',onRotateTouchMove);
        $(headBtn).unbind('mousedown').bind('mousedown', onHeadTouchMove);
        $(headBtn).unbind('touchstart').bind('touchstart', onHeadTouchMove);

        // Resize Events
        renderer.domElement.addEventListener('mousemove',onDocumentMouseMove); 
        renderer.domElement.addEventListener('mousedown',onDocumentOrMouseDown); 
        renderer.domElement.addEventListener('mouseup',onDocumentMouseUp);
        renderer.domElement.addEventListener('touchmove',onDocumentMouseMove); 
        renderer.domElement.addEventListener('touchend',onDocumentMouseUp);  
    }

    function onDocumentMouseMove(e){
        e.preventDefault();

        var offset = $(mainSubHolder).offset();
        var varClientX;
        var varClientY;

        if(e.type === "touchmove"){
            varClientX = e.touches[0].clientX;
            varClientY = e.touches[0].clientY;
        }else{
            varClientX = e.clientX;
            varClientY = e.clientY;
        }

        mouse.x =((varClientX - offset.left)/renderer.domElement.width)*2-1;
        mouse.y = -((varClientY - offset.top)/renderer.domElement.height)*2+1;

        var newHeight = 0;
        var newWidth = 0;
        var newDepth = 0;
        var diffX = 0;
        var diffY = 0;

        if(SELECTED){

            diffY = mouse.y - startMouse.y;
            diffX = mouse.x - startMouse.x;

            if(SELECTED.name === "resizeVertex-0")
            {
                newWidth = Math.round((startWidth+(diffX*dragMultiplier))/20)*20;
                newHeight = Math.round((startHeight+(diffY*dragMultiplier))/20)*20;
                newDepth = depth;
            }
            else if(SELECTED.name === "resizeVertex-2")
            {
                newWidth = Math.round((startWidth+(diffX*dragMultiplier))/20)*20;
                newHeight = Math.round((startHeight-(diffY*dragMultiplier))/20)*20;                         
                newDepth = depth;
            }
            else if(SELECTED.name === "resizeVertex-7")
            {
                newWidth = Math.round((startWidth-(diffX*dragMultiplier))/20)*20;
                newHeight = Math.round((startHeight-(diffY*dragMultiplier))/20)*20;                         
                newDepth = depth;
            }
            else if(SELECTED.name === "resizeVertex-5")
            {
                newWidth = Math.round((startWidth-(diffX*dragMultiplier))/20)*20;
                newHeight = Math.round((startHeight+(diffY*dragMultiplier))/20)*20;                         
                newDepth = depth;
            }
            else 
            {
                var dist = diffY;
                newWidth = width;
                newHeight = height;                         
                newDepth = Math.round((startDepth+(dist*dragMultiplier))/20)*20;
            }

            if(newWidth > 240){
                newWidth = 240;
            }
            if(newHeight > 240){
                newHeight = 240;
            }
            if(newDepth > 240){
                newDepth = 240;
            }
            updateGroupGeometry(newWidth,newHeight,newDepth);
            showResult();
        }
        $(mainSubHolder).css('cursor', 'auto');
    }

    function onDocumentMouseDown(e){
        SELECTED = e.target;
        $(mainHolder).focus();
        mouseDown = true;
    }

    function onHeadTouchMove(e){
        $(mainHolder).draggable({ disabled: false });
    }

    function onDocumentOrMouseDown(e){

        $(mainHolder).draggable({ disabled: true });

        var offset = $(mainSubHolder).offset();

        var varClientX;
        var varClientY;

        if(e.type === "touchstart"){
            varClientX = e.touches[0].clientX;
            varClientY = e.touches[0].clientY;
        }else{
            varClientX = e.clientX;
            varClientY = e.clientY;
        }

        startMouse.x = ((varClientX - offset.left ) / renderer.domElement.width )*2-1;
        startMouse.y = -((varClientY - offset.top ) / renderer.domElement.height)*2+1;

        startHeight = height;
        startWidth = width;
        startDepth = depth;
    }

    $('#areaVolumeTool').unbind('mouseover').bind('mouseover',function(){
        if (SELECTED) {
            mheAreaVolumeTool.onSaveSteps();
        }
        cube.children.forEach(function (mesh) {
            if (mesh.name.indexOf('resizeVertex') !== -1) {
                mesh.visible = true;
            }
        });
        SELECTED = null;
        document.body.style.cursor = 'auto';
        mouseDown = false;
    });

    function onDocumentMouseUp(e){
        if (SELECTED){
            mheAreaVolumeTool.onSaveSteps();
        }
        cube.children.forEach(function (mesh) {
            if (mesh.name.indexOf('resizeVertex') !== -1) {
                mesh.visible = true;
            }
        });
        SELECTED = null;
        document.body.style.cursor = 'auto';
        mouseDown = false;
    }

    function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
        return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
    }

    function removeBlock(flag,allFlag){
        var flgCnt = 0;
        var objArrIndex;
        if (flag > smallCubeArr.length){
            Const.showOkAlertPopup('You don’t have that many units to remove. Please choose a smaller number.');
        }else{
            if(smallCubeArr.length > 0){
                for (var i=smallCubeArr.length-1; i>=0; i--) {
                    if(!allFlag){
                        if(flgCnt < flag){
                            objArrIndex = 'x' + smallCubeArr[i].position.x + 'y' + smallCubeArr[i].position.y + 'z' + smallCubeArr[i].position.z;

                            cube.remove(smallCubeArr[i]);
                            objArr[objArrIndex] = undefined;    
                            smallCubeArr.pop(); 
                            flgCnt++;   
                        }
                    }else{
                        objArrIndex = 'x' + smallCubeArr[i].position.x + 'y' + smallCubeArr[i].position.y + 'z' + smallCubeArr[i].position.z;
                        cube.remove(smallCubeArr[i]);   
                        smallCubeArr.pop();
                        objArr[objArrIndex] = undefined;
                    }   
                }

                setRemainingGrey();    
                showResizable();
                showResult();
            }else{
                Const.showOkAlertPopup('You don’t have that many units to remove. Please choose a smaller number.');
            }
        }        
    }

    function addBlockByHeight(flag, allFlag) {
        var i;
        var wid = width / 20;
        var hig = height / 20;
        var dep = depth / 20;

        var posX = scaleBetween(depth, -10, -40, 40, 100);
        var posY = scaleBetween(width, -10, -40, 40, 100);
        var posZ = scaleBetween(height, -10, -40, 40, 100);

        var posX1 = scaleBetween(depth, -10, -40, 40, 100);
        var posY1 = scaleBetween(width, -10, -40, 40, 100);
        var posZ1 = scaleBetween(height, -10, -40, 40, 100);

        var flgCnt = 0;

        var filled;

        if (Object.keys(objArr).length === 0) {
            filled = 0;
        } else {
            var fillCnt = 0;
            for (i in objArr) {
                if (objArr[i] === 1) {
                    fillCnt++;
                }
            }
            filled = fillCnt;
        }
        var unFilled = (wid * hig * dep) - filled;

        if (flag > unFilled) {
            Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.');
        } else {
            if (flag === 0 && unFilled === 0) {
                Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.');
            } else {
                setRemainingGrey();
            }
            for (i = 0; i < hig; i++) {
                if (i > 0) {
                    posZ = posZ + 20;
                } else {
                    posZ = posZ1;
                }

                for (var j = 0; j < dep; j++) {
                    if (j > 0) {
                        posX = posX + 20;
                    } else {
                        posX = posX1;
                    }
                    isBreak = false;

                    for (var k = 0; k < wid; k++) {
                        if (k > 0) {
                            posY = posY + 20;
                        } else {
                            posY = posY1;
                        }

                        if (Object.keys(objArr).length === 0) {

                            addColorBlocks(posY, posZ, posX);
                            objArr['x' + posY + 'y' + posZ + 'z' + posX] = 1;
                            flgCnt++;

                            hideResizableFirst();
                            if (!allFlag) {
                                if (flgCnt >= flag) {
                                    isBreak = true;
                                    break;
                                }
                            }

                        } else {

                            if (objArr['x' + posY + 'y' + posZ + 'z' + posX] === undefined) {

                                addColorBlocks(posY, posZ, posX);
                                objArr['x' + posY + 'y' + posZ + 'z' + posX] = 1;
                                flgCnt++;

                                hideResizable();
                                if (!allFlag) {
                                    if (flgCnt >= flag) {
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
                if (isBreak) {
                    break;
                }
            }
            showResult();
        }
    }

    function addBlockByWidth(flag, allFlag) {
        var wid = width / 20;
        var hig = height / 20;
        var dep = depth / 20;
        
        var firstLoopEnd = wid;
        var lastLoopEnd = hig;

        var posX = scaleBetween(width, -10, -40, 40, 100);
        var posY = scaleBetween(height, -10, -40, 40, 100);
        var posZ = scaleBetween(depth, -10, -40, 40, 100);

        var posX1 = scaleBetween(width, -10, -40, 40, 100);
        var posY1 = scaleBetween(height, -10, -40, 40, 100);
        var posZ1 = scaleBetween(depth, -10, -40, 40, 100);

        var flgCnt = 0;
        var i;

        var filled;
        if (Object.keys(objArr).length === 0) {
            filled = 0;
        } else {
            var fillCnt = 0;
            for (i in objArr) {
                if (objArr[i] === 1) {
                    fillCnt++;
                }
            }
            filled = fillCnt;
        }
        var unFilled = (wid * hig * dep) - filled;

        if (flag > unFilled) {
            Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.');
        } else {
            if (flag === 0 && unFilled === 0) {
                Const.showOkAlertPopup('You don’t have space to add that many units. Please choose a smaller number.');
            } else {
                setRemainingGrey();
            }
            for (i = 0; i < dep; i++) {
                if (i > 0) {
                    posZ = posZ + 20;
                } else {
                    posZ = posZ1;
                }

                for (var j = 0; j < firstLoopEnd; j++) {
                    if (j > 0) {
                        posX = posX + 20;
                    } else {
                        posX = posX1;
                    }
                    isBreak = false;

                    for (var k = 0; k < lastLoopEnd; k++) {
                        if (k > 0) {
                            posY = posY + 20;
                        } else {
                            posY = posY1;
                        }

                        if (Object.keys(objArr).length === 0) {

                            addColorBlocks(posX, posY, posZ);
                            objArr['x' + posX + 'y' + posY + 'z' + posZ] = 1;
                            flgCnt++;

                            hideResizableFirst();
                            if (!allFlag) {
                                if (flgCnt >= flag) {
                                    isBreak = true;
                                    break;
                                }
                            }

                        } else {

                            if (objArr['x' + posX + 'y' + posY + 'z' + posZ] === undefined) {

                                addColorBlocks(posX, posY, posZ);
                                objArr['x' + posX + 'y' + posY + 'z' + posZ] = 1;
                                flgCnt++;

                                hideResizable();
                                if (!allFlag) {
                                    if (flgCnt >= flag) {
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
                if (isBreak) {
                    break;
                }
            }
            showResult();
        }
    }

    function addBlock(flag, allFlag) {
        var VolumeByRow;
        if (Const.getIsEdit()) {
            VolumeByRow = config.VolumeByRow;
        } else {
            VolumeByRow = Const.config.VolumeByRow;
        }

        if (VolumeByRow) {
            addBlockByHeight(flag, allFlag);
        } else {
            addBlockByWidth(flag, allFlag);
        }
    }

    function addColorBlocks(posX,posY,posZ){
        var geometry1 = new THREE.BoxGeometry(20, 20, 20, 0, 0, 0);
        var material1 = new THREE.MeshBasicMaterial({ 
            color:"skyblue", 
            wireframe: false,
            transparent: true,
            opacity: 0.8,
            side: THREE.FrontSide
        });

        var cube1 = new THREE.Mesh( geometry1, material1 );
        cube1.position.y = posY;
        cube1.position.x = posX;
        cube1.position.z = posZ;
        cube.add(cube1);

        cube1.name = 'colorCubes-' + Math.random();

        var geo = new THREE.EdgesGeometry( cube1.geometry );
        var mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});
        var wireframe1 = new THREE.LineSegments(geo, mat);
        cube1.add(wireframe1);

        smallCubeArr.push(cube1);
    }

    function removeCorners(){
        cube.children.forEach(function(mesh){
            if(mesh.name.indexOf('resizeVertex') !== -1){
                domEvents.removeEventListener(mesh,'mousedown',onDocumentMouseDown); 
                domEvents.removeEventListener(mesh,'touchstart',onDocumentMouseDown);
                domEvents.removeEventListener(mesh, 'mousemove', onCursorMouseMove); 
            }
        });

        cube.remove(cube.getObjectByName("resizeVertex-0"));
        cube.remove(cube.getObjectByName("resizeVertex-1"));
        cube.remove(cube.getObjectByName("resizeVertex-2"));
        cube.remove(cube.getObjectByName("resizeVertex-3"));
        cube.remove(cube.getObjectByName("resizeVertex-4"));
        cube.remove(cube.getObjectByName("resizeVertex-5"));
        cube.remove(cube.getObjectByName("resizeVertex-6"));
        cube.remove(cube.getObjectByName("resizeVertex-7"));
    }

    function updateGroupGeometry(width1,height1,depth1) {
        removeCorners();
        cube.children[ 0 ].geometry.dispose();

        if(width1 < 20){
            width = width;
        }else{
            width = width1;
        }
        
        if(height1 < 20){
            height = height;
        }else{
            height = height1;
        }

        if(depth1 < 20){
            depth = depth;
        }else{
            depth = depth1;
        }

        if (width > 240) {
            width = 240;
        }
        if (height > 240) {
            height = 240;
        }
        if (depth > 240) {
            depth = 240;
        }

        var geometry = new THREE.BoxGeometry( width, height, depth, 0, 0, 0);
        cube.geometry = geometry;    
        var cube123 = new THREE.Mesh( geometry, materialMain );
        cube.children[ 0 ].geometry = new THREE.EdgesGeometry(cube123.geometry);

        addCorners(cube123.geometry);
        addCornerEvents();
    }

    function onRotateMouseDown( event ) {
        event.preventDefault();

        $(mainSubHolder).unbind('mousemove').bind('mousemove', onRotateMouseMove);
        $(mainSubHolder).unbind('mouseup').bind('mouseup', onRotateMouseUp);
        $(mainSubHolder).unbind('mouseout').bind('mouseout', onRotateMouseOut);

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
        $(mainHolder).focus();
    }

    function onRotateMouseMove( event ) {
        mouseX = event.clientX - windowHalfX;
        if (isRotate) {
            targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
        }    
    }

    function onRotateMouseUp( event ) {
        $(mainSubHolder).unbind('mousemove', onRotateMouseMove);
        $(mainSubHolder).unbind('mouseup', onRotateMouseUp);
        $(mainSubHolder).unbind('mouseout', onRotateMouseOut);
    }

    function onRotateMouseOut( event ) {
        $(mainSubHolder).unbind('mousemove', onRotateMouseMove);
        $(mainSubHolder).unbind('mouseup', onRotateMouseUp);
        $(mainSubHolder).unbind('mouseout', onRotateMouseOut);
    }

    function onRotateTouchStart( event ) {
        if (event.touches !== undefined){
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
                targetRotationOnMouseDown = targetRotation;
            }
        }else{
            if (event.originalEvent.touches.length === 1) {
                event.preventDefault();
                mouseXOnMouseDown = event.originalEvent.touches[0].pageX - windowHalfX;
                targetRotationOnMouseDown = targetRotation;
            }
        }
    }

    function onRotateTouchMove( event ) {
        if (event.touches !== undefined) {
            if (event.touches.length === 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
            }
        } else {
            if (event.originalEvent.touches.length === 1) {
                event.preventDefault();
                mouseX = event.originalEvent.touches[0].pageX - windowHalfX;
                targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        if (!Const.presetFlag) {
            if(isRotate){
                if (!keyRotate){
                    cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
                }    
            }
        }    
        renderer.render( scene, camera );
    }

    function setRemainingGrey(){
        cube.children.forEach(function (mesh) {
            if (mesh.name.indexOf('colorCubes') !== -1) {
                mesh.material.color.setHex("0xCBCBCB");
            }
        });
    } 

    function showResult(){
        var wid = width/20;
        var hig = height/20;
        var dep = depth/20;

        var filled;
        if(Object.keys(objArr).length === 0){
            filled = 0;
        }else{
            var fillCnt = 0;
            for(var i in objArr){
                if(objArr[i] === 1){
                    fillCnt++;
                }
            }
            filled = fillCnt;
        }
        var unFilled = (wid * hig * dep) - filled;

        resultsData = {
            "length": wid,
            "height": hig,
            "width": dep,
            "total": (wid * hig * dep),
            "filled": filled,
            "unfilled": unFilled,
        };

        $('.resultcontent #perimeter').hide();  
        
        if (Const.getIsEdit()) {
            if (config.Volume_Measures.Height) {
                $('.resultcontent #height').show();
            }
            if (config.Volume_Measures.Length) {
                $('.resultcontent #length').show();
            }
            if (config.Volume_Measures.Width) {
                $('.resultcontent #width').show();
            }
            if (config.Volume_Measures.Total_Volume) {
                $('.resultcontent #total').show();
            }
            if (config.Volume_Measures.Filled_Volume) {
                $('.resultcontent #filled').show();
            }
            if (config.Volume_Measures.Unfilled_Volume) {
                $('.resultcontent #unfilled').show();
            }

            // hide
            if (!config.Volume_Measures.Height) {
                $('.resultcontent #height').hide();
            }
            if (!config.Volume_Measures.Length) {
                $('.resultcontent #length').hide();
            }
            if (!config.Volume_Measures.Width) {
                $('.resultcontent #width').hide();
            }
            if (!config.Volume_Measures.Total_Volume) {
                $('.resultcontent #total').hide();
            }
            if (!config.Volume_Measures.Filled_Volume) {
                $('.resultcontent #filled').hide();
            }
            if (!config.Volume_Measures.Unfilled_Volume) {
                $('.resultcontent #unfilled').hide();
            }
        } else {
            if (!Const.config.Volume_Measures.Height) {
                $('.resultcontent #height').hide();
            }else{
                $('.resultcontent #height').show();
            }
            if (!Const.config.Volume_Measures.Length) {
                $('.resultcontent #length').hide();
            } else {
                $('.resultcontent #length').show();
            }
            if (!Const.config.Volume_Measures.Width) {
                $('.resultcontent #width').hide();
            } else {
                $('.resultcontent #width').show();
            }
            if (!Const.config.Volume_Measures.Total_Volume) {
                $('.resultcontent #total').hide();
            } else {
                $('.resultcontent #total').show();
            }
            if (!Const.config.Volume_Measures.Filled_Volume) {
                $('.resultcontent #filled').hide();
            } else {
                $('.resultcontent #filled').show();
            }
            if (!Const.config.Volume_Measures.Unfilled_Volume) {
                $('.resultcontent #unfilled').hide();
            } else {
                $('.resultcontent #unfilled').show();
            }
        }
        var currentDevice = Const.getCurrentDeviceType();
        if (currentDevice.indexOf('tablet') != -1 || currentDevice.indexOf('mobile') != -1){
            if ($('#measures #result_arrow_span .open-img').css('display') === 'none') {
                $('.resultcontent').show();
            } else {
                $('.resultcontent').hide();
            }
        }else{
            if ($('#measures #result_arrow_span .open-img').css('display') === 'none') {
                $('.resultcontent').show();
            } else {
                $('.resultcontent').hide();
            }
        }    
        $('.resultcontent').addClass('volume-m');
        $('.resultcontent').removeClass('area-m');
        var unitsText = 'units';
        // Length
        if(wid > 1){
            unitsText = 'units';
        }else{
            unitsText = 'unit';
        }
        $('.resultcontent #length #length-values li').html(wid + ' ' + unitsText);

        // Width
        if (dep > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #width #width-values li').html(dep + ' ' + unitsText);

        // Height
        if (hig > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #height #height-values li').html(hig + ' ' + unitsText);

        // Total 
        if ((wid * hig * dep) > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #total .total-span').html('Total Volume');
        $('.resultcontent #total .total-span').attr('aria-label', 'Total Volume');
        $('.resultcontent #total #total-values li').html((wid * hig * dep) + ' cubic ' + unitsText);

        // Filled
        if (filled > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #filled .filled-span').html('Filled Volume');
        $('.resultcontent #filled .filled-span').attr('aria-label', 'Filled Volume');
        $('.resultcontent #filled #filled-values li').html(filled + ' cubic ' + unitsText);

        // UnFilled
        if (unFilled > 1) {
            unitsText = 'units';
        } else {
            unitsText = 'unit';
        }
        $('.resultcontent #unfilled .unfilled-span').html('Unfilled Volume');
        $('.resultcontent #unfilled .unfilled-span').attr('aria-label', 'Unfilled Volume');
        $('.resultcontent #unfilled #unfilled-values li').html(unFilled + ' cubic ' + unitsText);

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
        
        getResizeBorderColor:getResizeBorderColor,
        getQuantity:getQuantity,
        getLockUnlock:getLockUnlock,
        getTransformDataLeft: function () { return volumeTransform.left; },
        getTransformDataTop: function () { return volumeTransform.top; },

        getZoomScale: function() { return zoomScale; },
        getisRotate: function() { return isRotate; },
        
        lockUnlock:lockUnlock,
        pShape:'volume',
        setRemainingGrey:setRemainingGrey,
        resultsData: function() { return resultsData; },
        setPresetData: setPresetData,
        showResult: showResult,
    };  
};

// volume.js
