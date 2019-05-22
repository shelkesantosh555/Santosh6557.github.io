/* tracer.js */

(function(player){

    player.debug = false;
    
    player.log = function(arg)
    {
        if(player.debug){console.log(arg);}
    };

})(Tracer = Tracer || {});
var Tracer;

/* tracer.js */

// player.js

/* global
$, mhe
*/

var oNavigation;
(function(player) {

    // var nWidgetHeight = 600;
    var nWidgetHeight = 650;
    var nWidgetWidth = '';
    var shapeArray = [];
    var undoFlag = false;
    var cnt = 0;
    var figure;
    var currentFocusedObject;
    var aSaveAndUndo = [];
    var aSaveAndRedo = [];
    var studentData = null;

    mhe.onDataRestore(function (data) {
        studentData = data;
    });    

    function init() {
        if (mhe.initialParams && mhe.initialParams.configFile) {
            setTimeout(function () {
                var configFileUrl = mhe.initialParams.configFile;
                mhe.getConfigFile(configFileUrl, onConfigLoadSuccess, onConfigLoadError);
            }, 850);    
        } else {
            setTimeout(function () {
                startApplication();
            }, 860);    
        }

        setTimeout(function () {
            mhe.onResize(OnWidgetResize);
        }, 880);

        setTimeout(function () {
            setWidgetSize();
        }, 870);
        
        // mhe.onResize(OnWidgetResize);
        mhe.addLinkToThemeCss();
    }

    function isEmpty(myObject) {
        for (var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    var bRun = true;
    function startApplication() {
        if (bRun) {
            $(document).ready(function() {
                oNavigation = new Navigation();
                oNavigation.init();
                oNavigation.Evts.addEventListener('CONTROL_EVENT', fnEventFromNavigation);
                
                //New Object
                addWindowEvents();

                if (Const.getIsEdit() === false && studentData !== null && !isEmpty(studentData)) {
                    setTimeout(function () {
                        mheAreaVolumeTool.setupPreset(studentData);
                        mheAreaVolumeTool.rearange();
                    }, 100);
                }else{    
                    if (Const.config.currentState !== '' && Const.config.currentState !== undefined) {
                        setTimeout(function () {
                            mheAreaVolumeTool.setupPreset(Const.config.currentState);
                            mheAreaVolumeTool.rearange();
                        },100);    
                    }
                }    
                
                $("#confirmOverlay .btn_ok").off("click keyup").on("click keyup", closeAlertPopup);
                $("#confirmOverlay .btn_cancel").off("click keyup").on("click keyup", closeAlertPopup1);
                $("#confirmOverlay .btn_o").off("click keyup").on("click keyup", closeAlertPopupOk);

                // Remove and add tab indexing of disable buttons 
                disableUpStartControls();

                var oMeasuresComponent = $('#measures');
                $(oMeasuresComponent.find('.resultcontent')).find('.cb').each(function(){
                    var title1;
                    if ($(this).attr('title') === 'Total'){
                        if ($('.resultcontent').hasClass('volume-m')){
                            title1 = 'Volume';
                        }else{
                            title1 = 'Area';
                        }
                    }
                    $(this).attr('aria-label', 'Deselect the checkbox to hide the ' + $(this).attr('title') + ' ' + title1 +' by pressing enter key on keyboard.');
                    $(this).bind("click keyup",handleCheckBoxEvents);
                });
                // $('#areaVolumeTool').bind("click", hideAllSelected);
                setupControlUI();
            });
            bRun = false;
        }
    }

    function handleCheckBoxEvents(e)
    {
        if(e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;

        var oMeasuresComponent = $('#measures');

        var title1 = '';
        if($(e.target).hasClass('clicked'))
        {
            title1 = '';
            if ($(e.target).attr('title') === 'Total') {
                if ($('.resultcontent').hasClass('volume-m')) {
                    title1 = 'Volume';
                } else {
                    title1 = 'Area';
                }
            }
            $('#'+$(e.target).attr('title').toLowerCase()+'-values').hide();
            $(oMeasuresComponent.find('.resultcontent')).find(e.target).removeClass('clicked');
            $(e.target).attr('aria-label', 'Select the checkbox to see the ' + $(e.target).attr('title') + ' ' + title1 +' by pressing enter key on keyboard.');
        }
        else
        {
            title1 = '';
            if ($(e.target).attr('title') === 'Total') {
                if ($('.resultcontent').hasClass('volume-m')) {
                    title1 = 'Volume';
                } else {
                    title1 = 'Area';
                }
            }
            $('#'+$(e.target).attr('title').toLowerCase()+'-values').show();
            $(oMeasuresComponent.find('.resultcontent')).find(e.target).addClass('clicked');
            $(e.target).attr('aria-label', 'Deselect the checkbox to hide the ' + $(e.target).attr('title') + ' ' + title1 +' by pressing enter key on keyboard.');
        }
    }

    function disableUpStartControls(){
        $('#undo_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        }); 
        $('#reset_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        
        $('#redo_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#lock_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#toolBasehtDiv .ui-spinner').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#add_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#remove_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#fill_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });
        $('#empty_div').css({
            'opacity':'0.4',
            'pointer-events':'none'
        });

        var oldTab = $('#undo_div').attr('tabindex');
        $('#undo_div').removeAttr('tabindex'); 
        $('#undo_div').attr('data-tabindex',oldTab);

        oldTab = $('#reset_div').attr('tabindex');
        $('#reset_div').removeAttr('tabindex'); 
        $('#reset_div').attr('data-tabindex',oldTab);

        oldTab = $('#redo_div').attr('tabindex');
        $('#redo_div').removeAttr('tabindex'); 
        $('#redo_div').attr('data-tabindex',oldTab);

        oldTab = $('#lock_div').attr('tabindex');
        $('#lock_div').removeAttr('tabindex'); 
        $('#lock_div').attr('data-tabindex',oldTab);

        oldTab = $('#toolBasehtDiv .toolSideInput').attr('tabindex');
        $('#toolBasehtDiv .toolSideInput').attr('tabindex',-1); 
        $('#toolBasehtDiv .toolSideInput').attr('data-tabindex',oldTab);

        oldTab = $('#add_div').attr('tabindex');
        $('#add_div').removeAttr('tabindex'); 
        $('#add_div').attr('data-tabindex',oldTab);

        oldTab = $('#remove_div').attr('tabindex');
        $('#remove_div').removeAttr('tabindex'); 
        $('#remove_div').attr('data-tabindex',oldTab);

        oldTab = $('#fill_div').attr('tabindex');
        $('#fill_div').removeAttr('tabindex'); 
        $('#fill_div').attr('data-tabindex',oldTab);

        oldTab = $('#empty_div').attr('tabindex');
        $('#empty_div').removeAttr('tabindex'); 
        $('#empty_div').attr('data-tabindex',oldTab);

        var navDiv = $('#Mode_Menu .navTopSpan');
        navDiv.html('Select');
    }  

    function setUpStartControls(){
        $('#undo_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        }); 
        $('#reset_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });

        // $('#redo_div').css({
        //     'opacity':'1',
        //     'pointer-events':'auto'
        // });

        $('#lock_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });

        if (Const.getIsEdit()) {
            if (config.qLockFlag) {
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
                oldTab = $('#toolBasehtDiv .toolSideInput').attr('tabindex');
                $('#toolBasehtDiv .toolSideInput').attr('tabindex',-1);
                $('#toolBasehtDiv .toolSideInput').attr('data-tabindex', oldTab);
            } else {
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
                oldTab = $('#toolBasehtDiv .toolSideInput').attr('data-tabindex');
                $('#toolBasehtDiv .toolSideInput').removeAttr('data-tabindex');
                $('#toolBasehtDiv .toolSideInput').attr('tabindex', oldTab);
            }
        } else {
            if (Const.config.qLockFlag) {
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
                oldTab = $('#toolBasehtDiv .toolSideInput').attr('tabindex');
                $('#toolBasehtDiv .toolSideInput').attr('tabindex',-1);
                $('#toolBasehtDiv .toolSideInput').attr('data-tabindex', oldTab);
            } else {
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
                oldTab = $('#toolBasehtDiv .toolSideInput').attr('data-tabindex');
                $('#toolBasehtDiv .toolSideInput').removeAttr('data-tabindex');
                $('#toolBasehtDiv .toolSideInput').attr('tabindex', oldTab);
            }
        }

        $('#add_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });
        $('#remove_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });
        $('#fill_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });
        $('#empty_div').css({
            'opacity':'1',
            'pointer-events':'auto'
        });

        var oldTab = $('#undo_div').attr('data-tabindex');
        $('#undo_div').removeAttr('data-tabindex'); 
        $('#undo_div').attr('tabindex',oldTab);

        oldTab = $('#reset_div').attr('data-tabindex');
        $('#reset_div').removeAttr('data-tabindex'); 
        $('#reset_div').attr('tabindex',oldTab);

        // oldTab = $('#redo_div').attr('data-tabindex');
        // $('#redo_div').removeAttr('data-tabindex'); 
        // $('#redo_div').attr('tabindex',oldTab);

        oldTab = $('#lock_div').attr('data-tabindex');
        $('#lock_div').removeAttr('data-tabindex'); 
        $('#lock_div').attr('tabindex',oldTab);

        oldTab = $('#add_div').attr('data-tabindex');
        $('#add_div').removeAttr('data-tabindex'); 
        $('#add_div').attr('tabindex',oldTab);

        oldTab = $('#remove_div').attr('data-tabindex');
        $('#remove_div').removeAttr('data-tabindex'); 
        $('#remove_div').attr('tabindex',oldTab);

        oldTab = $('#fill_div').attr('data-tabindex');
        $('#fill_div').removeAttr('data-tabindex'); 
        $('#fill_div').attr('tabindex',oldTab);

        oldTab = $('#empty_div').attr('data-tabindex');
        $('#empty_div').removeAttr('data-tabindex'); 
        $('#empty_div').attr('tabindex',oldTab);
    }   

    function undoRedoEnable(){
        $('#undo_div').css({
            'opacity': '1',
            'pointer-events': 'auto'
        });

        var oldTab = $('#undo_div').attr('data-tabindex');
        $('#undo_div').removeAttr('data-tabindex');
        $('#undo_div').attr('tabindex', oldTab);
    }

    function closeAlertPopup(e) {

        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;

        $("#confirmOverlay").hide();
        resetTool();
        $('#Mode_Menu .shape_dropdown').focus();
    }

    function closeAlertPopup1(e) {

        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;

        $("#confirmOverlay").hide();
        $('#reset_div').focus();
    }

    function closeAlertPopupOk(e) {

        if (e.type === 'keyup' && (e.keyCode !== 13 && e.keyCode !== 32))
            return false;

        $("#confirmOverlay").hide();
        
        var j = 0;
        var current;
        for (var i in shapeArray) {
            current = i;
            j++;
        }
        if (j !== 0) {
            $("#resizeHolder_" + current).focus();
            $("#mainHCanvasDiv_" + current).focus();
        }
    }

    mheAreaVolumeTool.onSaveSteps = function(){
        var oData = {};
        var keyLength = 0;

        for(var i in shapeArray)
        {
            var dataObj = {};
            dataObj.pShape = shapeArray[i].pShape;
            dataObj.shapeTransformLeft = shapeArray[i].getTransformDataLeft();
            dataObj.shapeTransformTop = shapeArray[i].getTransformDataTop();
            dataObj.result = shapeArray[i].resultsData();
            dataObj.unlock = shapeArray[i].getLockUnlock();
            dataObj.quantity = shapeArray[i].getQuantity();
            dataObj.color = shapeArray[i].getResizeBorderColor();
            if(shapeArray[i].pShape === 'volume'){
                dataObj.zoomScale = shapeArray[i].getZoomScale();
                dataObj.isRotate = shapeArray[i].getisRotate();
            }
            
            oData[i] = dataObj;
            keyLength++;
        }
        
        undoRedoEnable();

        if (!Const.getIsEdit()) {   
            mhe.saveData(oData);
        }
        if (undoFlag) {
            undoFlag = false;
        } else {
            aSaveAndUndo.push(oData);
        }

        try
        {
            config.currentState = oData;
            mhe.updateConfigFile(config);
        }
        catch(e){}
    };

    function resetTool() {
        shapeArray = [];
        currentFocusedObject = '';
        
        for (var i in Const.config.Default_Border_Colors_Arr) {
            if (Const.config.Default_Border_Colors_Arr[i]) {
                Const.currBorderColor = i.toLowerCase();
            }
        }

        aSaveAndUndo = [];
        aSaveAndRedo = [];
        cnt = 0;

        if (!Const.getIsEdit()) {
            mhe.saveData('');
        }

        // Border Color
        var navDiv = $('#Stroke_Menu .navTopSpan div');
        setMenuColor(navDiv, Const.currBorderColor, 'Stroke_Menu');

        // Lock
        if ($('#lock_div').hasClass('buttonSelectedLock')) {
            $('#lock_div').removeClass('buttonSelectedLock');
            $('#lock_div').addClass('buttonSelectedUnLock');
        }

        // Quantity
        var quantity;
        if (Const.getIsEdit()) {
            if (config.qLockFlag) {
                quantity = config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
            $('.toolSideInput').val(quantity);
        } else {
            if (Const.config.qLockFlag) {
                quantity = Const.config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
            $('.toolSideInput').val(quantity);
        }
        

        // Canvas
        $('#areaVolumeTool').html('');

        // Mode
        navDiv = $('#Mode_Menu .navTopSpan');
        navDiv.html('');

        // Mesure Hide
        $('.resultcontent').hide();

        // Preset
        if (Const.config.currentState !== '') {
            mheAreaVolumeTool.setupPreset(Const.config.currentState);
        }

        disableUpStartControls();
        if ($('#more_div').hasClass('buttonSelected')) {
            $('#more_div').removeClass('buttonSelected');
            $('.mobile_controls-shape').hide();
        }
        mheAreaVolumeTool.rearange();
        mheAreaVolumeTool.setupUiForMorePop();
    }

    function undoShape(){
        
        shapeArray = [];
        cnt = 0;
        var oldTab;
        $('#areaVolumeTool').html('');

        var nStepNum = aSaveAndUndo.length - 1;
        var currentData = aSaveAndUndo[nStepNum];

        if (aSaveAndUndo.length > 0) { 
            aSaveAndRedo.push(currentData);
            
            $('#redo_div').css({
                'opacity': '1',
                'pointer-events': 'auto'
            });

            oldTab = $('#redo_div').attr('data-tabindex');
            $('#redo_div').removeAttr('data-tabindex');
            $('#redo_div').attr('tabindex', oldTab);
        }    
        aSaveAndUndo.pop();

        var dataObj;
        var i;
        if (aSaveAndUndo.length > 0) { 
            nStepNum = aSaveAndUndo.length - 1;
            currentData = aSaveAndUndo[nStepNum];

            for (i in currentData) {
                if (currentData[i].pShape === 'volume') {
                    
                    undoFlag = true;
                    createVolume();
                    
                    dataObj = { depth: currentData[i].result.width, width: currentData[i].result.length, height: currentData[i].result.height, left: currentData[i].shapeTransformLeft, top: currentData[i].shapeTransformTop, color: currentData[i].color, filled: currentData[i].result.filled, quantity: currentData[i].quantity, lockFlag: currentData[i].unlock, zoomScale: currentData[i].zoomScale, isRotate: currentData[i].isRotate };
                    
                    undoFlag = true;
                    Const.presetFlag = true;
                    shapeArray[currentFocusedObject].setPresetData(dataObj);

                    setTimeout(function () {
                        undoFlag = true;
                        mheAreaVolumeTool.onSaveSteps();
                    },151);    

                } else {
                    undoFlag = true;
                    createArea();     
                    dataObj = { width: currentData[i].result.length, height: currentData[i].result.width, left: currentData[i].shapeTransformLeft, top: currentData[i].shapeTransformTop, color: currentData[i].color, filled: currentData[i].result.filled, quantity: currentData[i].quantity, lockFlag: currentData[i].unlock };
                    shapeArray[currentFocusedObject].setPresetData(dataObj);
                    undoFlag = true;
                    mheAreaVolumeTool.onSaveSteps();
                }    
            }
            setTimeout(function () {
                $('#undo_div').focus();
            },152);    
        }else{

            shapeArray = [];
            currentFocusedObject = '';
            for (i in Const.config.Default_Border_Colors_Arr) {
                if (Const.config.Default_Border_Colors_Arr[i]) {
                    Const.currBorderColor = i.toLowerCase();
                }
            }
            aSaveAndUndo = [];

            // Border Color
            var navDiv = $('#Stroke_Menu .navTopSpan div');
            setMenuColor(navDiv, Const.currBorderColor, 'Stroke_Menu');

            // Lock
            if ($('#lock_div').hasClass('buttonSelectedLock')) {
                $('#lock_div').removeClass('buttonSelectedLock');
                $('#lock_div').addClass('buttonSelectedUnLock');
            }

            // Quantity
            var quantity;
            if (Const.getIsEdit()) {
                if (config.qLockFlag) {
                    quantity = config.lockQuantity;
                    $('#toolBasehtDiv .ui-spinner').css({
                        'opacity': '0.4',
                        'pointer-events': 'none'
                    });
                } else {
                    quantity = 1;
                    $('#toolBasehtDiv .ui-spinner').css({
                        'opacity': '1',
                        'pointer-events': 'auto'
                    });
                }
                $('.toolSideInput').val(quantity);
            } else {
                if (Const.config.qLockFlag) {
                    quantity = Const.config.lockQuantity;
                    $('#toolBasehtDiv .ui-spinner').css({
                        'opacity': '0.4',
                        'pointer-events': 'none'
                    });
                } else {
                    quantity = 1;
                    $('#toolBasehtDiv .ui-spinner').css({
                        'opacity': '1',
                        'pointer-events': 'auto'
                    });
                }
                $('.toolSideInput').val(quantity);
            }

            // Canvas
            $('#areaVolumeTool').html('');

            // Mode
            navDiv = $('#Mode_Menu .navTopSpan');
            navDiv.html('Select');

            // Mesure Hide
            $('.resultcontent').hide();

            $('#undo_div').css({
                'opacity': '0.4',
                'pointer-events': 'none'
            });
            
            oldTab = $('#undo_div').attr('tabindex');
            $('#undo_div').removeAttr('tabindex');
            $('#undo_div').attr('data-tabindex', oldTab);

            OnRemoveAndUndoReset();
            $('#Mode_Menu .shape_dropdown').focus();
            mheAreaVolumeTool.setupUiForMorePop();
        }
    }

    function redoShape() {

        var nStepNum = aSaveAndRedo.length - 1;
        var currentData = aSaveAndRedo[nStepNum];

        var dataObj;
        var i;

        if (aSaveAndRedo.length > 0) {

            aSaveAndUndo.push(currentData);
            shapeArray = [];
            cnt = 0;
            $('#areaVolumeTool').html('');

            nStepNum = aSaveAndRedo.length - 1;
            currentData = aSaveAndRedo[nStepNum];

            for (i in currentData) {
                if (currentData[i].pShape === 'volume') {
                    
                    undoFlag = true;
                    createVolume();
                    
                    dataObj = { depth: currentData[i].result.width, width: currentData[i].result.length, height: currentData[i].result.height, left: currentData[i].shapeTransformLeft, top: currentData[i].shapeTransformTop, color: currentData[i].color, filled: currentData[i].result.filled, quantity: currentData[i].quantity, lockFlag: currentData[i].unlock, zoomScale: currentData[i].zoomScale, isRotate: currentData[i].isRotate };
                    
                    undoFlag = true;
                    Const.presetFlag = true;
                    shapeArray[currentFocusedObject].setPresetData(dataObj);

                    setTimeout(function () {
                        undoFlag = true;
                        mheAreaVolumeTool.onSaveSteps();
                    }, 151);

                } else {
                    undoFlag = true;
                    createArea();
                    dataObj = { width: currentData[i].result.length, height: currentData[i].result.width, left: currentData[i].shapeTransformLeft, top: currentData[i].shapeTransformTop, color: currentData[i].color, filled: currentData[i].result.filled, quantity: currentData[i].quantity, lockFlag: currentData[i].unlock };
                    shapeArray[currentFocusedObject].setPresetData(dataObj);
                    undoFlag = true;
                    mheAreaVolumeTool.onSaveSteps();
                }
            }

            setTimeout(function () {
                $('#redo_div').focus();
            }, 152);    

        }else{
            $('#redo_div').css({
                'opacity': '0.4',
                'pointer-events': 'none'
            });
            var oldTab = $('#redo_div').attr('tabindex');
            $('#redo_div').removeAttr('tabindex');
            $('#redo_div').attr('data-tabindex', oldTab);
        }
        aSaveAndRedo.pop();
    }

    player.setupPreset = function(data) {
        shapeArray = [];
        cnt = 0;
        var dataObj;
        for (var i in data) {
            if (data[i].pShape === 'volume'){

                createVolume();
                dataObj = { depth: data[i].result.width, width: data[i].result.length, height: data[i].result.height, left: data[i].shapeTransformLeft, top: data[i].shapeTransformTop, color: data[i].color, filled: data[i].result.filled, quantity: data[i].quantity, lockFlag: data[i].unlock, zoomScale: data[i].zoomScale, isRotate: data[i].isRotate };
                shapeArray[currentFocusedObject].setPresetData(dataObj);
                setTimeout(function () {
                    mheAreaVolumeTool.onSaveSteps();
                }, 151);    

            }else{

                createArea();
                dataObj = { width: data[i].result.length, height: data[i].result.width, left: data[i].shapeTransformLeft, top: data[i].shapeTransformTop, color: data[i].color, filled: data[i].result.filled, quantity: data[i].quantity, lockFlag: data[i].unlock};
                shapeArray[currentFocusedObject].setPresetData(dataObj);
                mheAreaVolumeTool.onSaveSteps();
            }
        }
        
        setTimeout(function () {
            $('#redo_div').css({
                'opacity': '0.4',
                'pointer-events': 'none'
            });
            var oldTab = $('#redo_div').attr('tabindex');
            $('#redo_div').removeAttr('tabindex');
            $('#redo_div').attr('data-tabindex', oldTab);

            $('#undo_div').css({
                'opacity': '0.4',
                'pointer-events': 'none'
            });
            
            oldTab = $('#undo_div').attr('tabindex');
            $('#undo_div').removeAttr('tabindex');
            $('#undo_div').attr('data-tabindex', oldTab);
        },100);    

        aSaveAndUndo = [];
        aSaveAndRedo = [];
    };

    function createArea(){
        figure = new window.Area(cnt);
        var areaHtml = figure.create();
        $('#areaVolumeTool').append(areaHtml);

        figure.evts.addEventListener('focused',onAreaFocused);
        figure.evts.addEventListener('removed',onFigureRemove);

        hideVolumeLayer();
        $('.shadowHolder').hide();

        currentFocusedObject = 'area_'+cnt;
        $('#shadowHolder_'+currentFocusedObject).show();

        shapeArray['area_'+cnt] = figure;
        shapeArray[currentFocusedObject].setResizeBorderColor(Const.currBorderColor);
        shapeArray[currentFocusedObject].showResult();
        cnt++;

        mheAreaVolumeTool.onSaveSteps();
        $("#resizeHolder_" + currentFocusedObject).focus();
        
        $("#mainHolder_" + currentFocusedObject + ' .ui-resizable-ne').attr('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;
        
        $("#mainHolder_" + currentFocusedObject + ' .ui-resizable-se').attr('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        $("#mainHolder_" + currentFocusedObject + ' .ui-resizable-sw').attr('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        $("#mainHolder_" + currentFocusedObject + ' .ui-resizable-nw').attr('tabindex', Const.shapeTabIndex);
        Const.shapeTabIndex++;

        setUpStartControls();
    }

    function createVolume(){
        figure = new window.Volume(cnt);
        var volumeHtml = figure.create();
        $('#areaVolumeTool').append(volumeHtml);

        figure.evts.addEventListener('focused',onVolumeFocused);
        figure.evts.addEventListener('removed',onFigureRemove);

        hideVolumeLayer();
        $('.shadowHolder').hide();

        currentFocusedObject = 'volume_'+cnt;
        $('#mainHCanvasDiv_'+currentFocusedObject).css('background','rgba(195,240,254,.3)');
        $('#mainHCanvasDiv_'+currentFocusedObject).css('border','1px solid #000000');
        $('#closeBtnVolume_'+currentFocusedObject).show();   
        $('#rotateBtnVolume_'+currentFocusedObject).show();   
  
        shapeArray['volume_'+cnt] = figure;
        shapeArray[currentFocusedObject].setResizeBorderColor(Const.currBorderColor);
        shapeArray[currentFocusedObject].showResult();
        cnt++;

        mheAreaVolumeTool.onSaveSteps();
        $("#mainHCanvasDiv_" + currentFocusedObject).focus();
        setUpStartControls();
    }

    function onAreaFocused(obj, evtName, data)
    {
        hideVolumeLayer();
        $('.shadowHolder').hide();

        currentFocusedObject = data.currObj;
        $('#shadowHolder_'+currentFocusedObject).show();
        shapeArray[currentFocusedObject].setToolbarForObj();
        setUpStartControls();
    }

    // function hideAllSelected(e){
    //     currentFocusedObject = null;
    //     hideVolumeLayer();
    //     $('.shadowHolder').hide();
    //     disableUpStartControls();
    //     // Mesure Hide
    //     $('.resultcontent').hide();
    // }

    function onVolumeFocused(obj, evtName, data)
    {
        hideVolumeLayer();
        $('.shadowHolder').hide();
        currentFocusedObject = data.currObj;
        
        $('#mainHCanvasDiv_'+currentFocusedObject).css('background','rgba(195,240,254,.3)');
        // $('#mainHCanvasDiv_'+currentFocusedObject).css('border','1px solid #000000');
        // $('#closeBtnVolume_'+currentFocusedObject).show();    
        $('#rotateBtnVolume_'+currentFocusedObject).show();

        shapeArray[currentFocusedObject].setToolbarForObj();
        setUpStartControls();
    }

    function hideVolumeLayer(){
        $('.mainHCanvasDiv').css('background','transparent');
        // $('.mainHCanvasDiv').css('border','0px');
        // $('.closeBtnVolume').hide();
        $('.rotateBtnVolume').hide();
        $('.zoomInBtnVolume').hide();
        $('.zoomOutBtnVolume').hide();
        $('.resetBtnVolume').hide();
        $('.zoomLabelBtnVolume').hide();
    }

    function onFigureRemove(obj, evtName, data){
        var oTempFig = {};
        var j = 0;
        for(var i in shapeArray)
        {
            if(i !== data.currObj)
            {
                oTempFig[i] = shapeArray[i];
                currentFocusedObject = i;
                j++;
            }
        }   

        shapeArray = oTempFig;
        
        if(j !== 0)
        {
            $("#resizeHolder_"+currentFocusedObject).focus();
            $("#mainHCanvasDiv_"+currentFocusedObject).focus();
        }
        else
        {
            shapeArray = [];
            currentFocusedObject = '';
            OnRemoveAndUndoReset();
            $('#Mode_Menu .shape_dropdown').focus();
        }
        
        //caliper_event ----
        var obj1 = {};
        obj1.type = "SessionEvent";
        obj1.action = "Delete Object";
        obj1.time = (new Date()).toISOString();
        mhe.caliper(obj1);

        mheAreaVolumeTool.onSaveSteps();
    }

    function OnRemoveAndUndoReset(){
        for (var i in Const.config.Default_Border_Colors_Arr) {
            if (Const.config.Default_Border_Colors_Arr[i]) {
                Const.currBorderColor = i.toLowerCase();
            }
        }

        // Border Color
        var navDiv = $('#Stroke_Menu .navTopSpan div');
        setMenuColor(navDiv, Const.currBorderColor, 'Stroke_Menu');

        // Lock
        if ($('#lock_div').hasClass('buttonSelectedLock')) {
            $('#lock_div').removeClass('buttonSelectedLock');
            $('#lock_div').addClass('buttonSelectedUnLock');
        }

        // Quantity
        var quantity;
        if (Const.getIsEdit()) {
            if (config.qLockFlag) {
                quantity = config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
            $('.toolSideInput').val(quantity);
        } else {
            if (Const.config.qLockFlag) {
                quantity = Const.config.lockQuantity;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
            } else {
                quantity = 1;
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '1',
                    'pointer-events': 'auto'
                });
            }
            $('.toolSideInput').val(quantity);
        }

        // Canvas
        $('#areaVolumeTool').html('');

        // Mode
        navDiv = $('#Mode_Menu .navTopSpan');
        navDiv.html('Select');

        // Mesure Hide
        $('.resultcontent').hide();

        $('#lock_div').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        $('#toolBasehtDiv .ui-spinner').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        $('#add_div').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        $('#remove_div').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        $('#fill_div').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        $('#empty_div').css({
            'opacity': '0.4',
            'pointer-events': 'none'
        });

        var oldTab = $('#lock_div').attr('tabindex');
        $('#lock_div').removeAttr('tabindex');
        $('#lock_div').attr('data-tabindex', oldTab);

        oldTab = $('#toolBasehtDiv .toolSideInput').attr('tabindex');
        $('#toolBasehtDiv .toolSideInput').attr('tabindex',-1);
        $('#toolBasehtDiv .toolSideInput').attr('data-tabindex', oldTab);

        oldTab = $('#add_div').attr('tabindex');
        $('#add_div').removeAttr('tabindex');
        $('#add_div').attr('data-tabindex', oldTab);

        oldTab = $('#remove_div').attr('tabindex');
        $('#remove_div').removeAttr('tabindex');
        $('#remove_div').attr('data-tabindex', oldTab);

        oldTab = $('#fill_div').attr('tabindex');
        $('#fill_div').removeAttr('tabindex');
        $('#fill_div').attr('data-tabindex', oldTab);

        oldTab = $('#empty_div').attr('tabindex');
        $('#empty_div').removeAttr('tabindex');
        $('#empty_div').attr('data-tabindex', oldTab);

        if ($('#more_div').hasClass('buttonSelected')) {
            $('#more_div').removeClass('buttonSelected');
            $('.mobile_controls-shape').hide();
        }
    }

    function fnEventFromNavigation(obj, evtName, data) {
        var obj1;
        var navDiv;
        var tool;
        var boxCount;
        switch (data.type) {
            case "Mode_Menu":              
                navDiv = $('#'+data.type+' .navTopSpan');
                tool = String(data.currentObject);
                navDiv.html(tool);
                if(tool === 'Volume'){
                    createVolume();
                }else{
                    createArea();
                }
            break;
            case "more_div":

                if($("#setting2_div").hasClass('buttonSelected')){    
                    $("#setting2_div").trigger('click');
                }
                if($("#setting_div").hasClass('buttonSelected')){    
                    $("#setting_div").trigger('click');
                }

                if($(data.dObject).hasClass('buttonSelected')){
                    $(data.dObject).removeClass('buttonSelected');
                    $('.mobile_controls-shape').hide();
                }else{
                    $(data.dObject).addClass('buttonSelected');
                    $('.mobile_controls-shape').show();
                    $('.arrow_container').css('left',data.left);
                }

                mheAreaVolumeTool.setupUiForMorePop();

            break;
            case 'shape-close-span':
                if ($("#setting2_div").hasClass('buttonSelected')) {
                    $("#setting2_div").trigger('click');
                }
                if ($("#setting_div").hasClass('buttonSelected')) {
                    $("#setting_div").trigger('click');
                }

                $('#more_div').removeClass('buttonSelected');
                $('.mobile_controls-shape').hide();

                mheAreaVolumeTool.setupUiForMorePop();
                break;

            case 'shape-close-mobile':
                // if ($("#setting2_div").hasClass('buttonSelected')) {
                //     $("#setting2_div").trigger('click');
                // }
                // if ($("#setting_div").hasClass('buttonSelected')) {
                //     $("#setting_div").trigger('click');
                // }

                $('#setting_div').removeClass('buttonSelected');
                $('.mobile_controls-shape-mobile').hide();

                mheAreaVolumeTool.setupUiForMorePop();
                break;
            case 'shape-close-mobile2':
                // if ($("#setting2_div").hasClass('buttonSelected')) {
                //     $("#setting2_div").trigger('click');
                // }
                // if ($("#setting_div").hasClass('buttonSelected')) {
                //     $("#setting_div").trigger('click');
                // }

                $('#setting2_div').removeClass('buttonSelected');
                $('.mobile_controls-shape-mobile2').hide();

                mheAreaVolumeTool.setupUiForMorePop();
                break;        
            case "shape-close":

                if ($("#setting2_div").hasClass('buttonSelected')) {
                    $("#setting2_div").trigger('click');
                }
                if ($("#setting_div").hasClass('buttonSelected')) {
                    $("#setting_div").trigger('click');
                }

                $('#more_div').removeClass('buttonSelected');
                $('.mobile_controls-shape').hide();

                mheAreaVolumeTool.setupUiForMorePop();

            break;
            case "setting_div":
                
                if($("#setting2_div").hasClass('buttonSelected')){    
                    $("#setting2_div").trigger('click');
                }
                if($("#more_div").hasClass('buttonSelected')){    
                    $("#more_div").trigger('click');
                }

                if($(data.dObject).hasClass('buttonSelected')){
                    $(data.dObject).removeClass('buttonSelected');
                    $('.mobile_controls-shape-mobile').hide();
                }else{
                    $(data.dObject).addClass('buttonSelected');
                    $('.mobile_controls-shape-mobile').show();
                    $('.arrow_container-mobile').css('left',data.left);
                }

                mheAreaVolumeTool.setupUiForMorePop();

            break;
            case "setting2_div":
                if($("#setting_div").hasClass('buttonSelected')){    
                    $("#setting_div").trigger('click');
                }
                if($("#more_div").hasClass('buttonSelected')){    
                    $("#more_div").trigger('click');
                }

                if($(data.dObject).hasClass('buttonSelected')){
                    
                    $(data.dObject).removeClass('buttonSelected');
                    $('.mobile_controls-shape-mobile2').hide();

                }else{
                    
                    $(data.dObject).addClass('buttonSelected');
                    $('.mobile_controls-shape-mobile2').show();
                    $('.arrow_container-mobile2').css('left',data.left);

                }

                mheAreaVolumeTool.setupUiForMorePop();

            break;
            case "lock_div":
                var flag;
                if($(data.dObject).hasClass('buttonSelectedLock')){
                    $(data.dObject).removeClass('buttonSelectedLock');
                    $(data.dObject).addClass('buttonSelectedUnLock');
                    flag = true;
                    $(data.dObject).attr('title', 'Size Unlock');
                    $(data.dObject).attr('aria-label','Size Unlock button, Press enter key to lock the Size of selected object on canvas.');
                    //caliper_event ----
                    obj1 = {};
                    obj1.type = "SessionEvent";
                    obj1.action = "Size Unlock";
                    obj1.time = (new Date()).toISOString();
                    mhe.caliper(obj1);
                }else{
                    $(data.dObject).addClass('buttonSelectedLock');
                    $(data.dObject).removeClass('buttonSelectedUnLock');
                    flag = false;
                    $(data.dObject).attr('title', 'Size Lock');
                    $(data.dObject).attr('aria-label', 'Size Lock button, Press enter key to Unlock Size of selected object on canvas.');
                    //caliper_event ----
                    obj1 = {};
                    obj1.type = "SessionEvent";
                    obj1.action = "Size Lock";
                    obj1.time = (new Date()).toISOString();
                    mhe.caliper(obj1);
                }                

                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].lockUnlock(flag);
                    mheAreaVolumeTool.onSaveSteps();
                }
                

            break; 
            case "undo_div":
                undoShape();
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Undo";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);

            break; 
            case "redo_div":
                redoShape();
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Redo";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);

            break; 
            case "reset_div":

                Const.showAlertPopup('Are you sure you want to reset the tool? <br> All work will be lost.');
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Reset button";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
                
            break;
            case "help_div":

                window.open(Const.helpDocument);
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Help button";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);

                break;
            case "Stroke_Menu":
                
                navDiv = $('#'+data.type+' .navTopSpan div');
                tool = String(data.currentObject).toLowerCase();
                setMenuColor(navDiv,tool,'Stroke_Menu');   
                Const.currBorderColor = tool;
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].setResizeBorderColor(tool);
                    mheAreaVolumeTool.onSaveSteps();
                }

            break;
            case "add_div":
                boxCount = Number($('.toolSideInput').val());
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].addBlock(boxCount,false);
                    mheAreaVolumeTool.onSaveSteps();
                }    
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Add Units";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
            break;
            case "fill_div":
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].addBlock(0,true);
                    mheAreaVolumeTool.onSaveSteps();
                }    
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Fill all Units";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
            break;
            case "remove_div":
                boxCount = Number($('.toolSideInput').val());
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].removeBlock(boxCount,false);
                    mheAreaVolumeTool.onSaveSteps();
                }    
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Remove Units";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
            break;
            case "empty_div":
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].removeBlock(0,true);
                    mheAreaVolumeTool.onSaveSteps();
                }    
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Remove all Units";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
            break;
            case "toolSideInput":
                if(currentFocusedObject){
                    shapeArray[currentFocusedObject].setQuantity(data.value);
                    mheAreaVolumeTool.onSaveSteps();
                }
                //caliper_event ----
                obj1 = {};
                obj1.type = "SessionEvent";
                obj1.action = "Change Quantity";
                obj1.time = (new Date()).toISOString();
                mhe.caliper(obj1);
            break;
        }
    }

    function setMenuColor(navDiv,tool){
        navDiv.css('background-color', Const.colorArray[tool]);   
        navDiv.css('border', '0px');   
    }

    mheAreaVolumeTool.rearange = function (){
        var windowWidth = $(window).width();
        if(windowWidth > 392){
            $('.ui-resizable').each(function(){
                var oElement = $(this);
                var nCurrentCanvasWidth = $('#areaVolumeTool').width() - 35;
                var nCurrentCanvasHeight = $('#areaVolumeTool').height() - 15;

                var nOffsetLeft = oElement.offset().left + oElement.outerWidth(true);
                var nOffsetTop = oElement.offset().top + oElement.outerHeight(true);
                var nUpdatedLeft;
                var nUpdatedTop;
                    
                if(nOffsetLeft > nCurrentCanvasWidth)
                {
                    nUpdatedLeft = oElement.offset().left - (nOffsetLeft - nCurrentCanvasWidth);
                }
                if(nOffsetTop > nCurrentCanvasHeight)
                {
                    nUpdatedTop = oElement.offset().top - (nOffsetTop - nCurrentCanvasHeight);
                }
                if(oElement.offset().left <= 15)
                {
                    nUpdatedLeft = 15;
                }
                if(oElement.offset().top <= 35)
                {
                    nUpdatedTop = 35;
                }

                oElement.css('left',nUpdatedLeft);
                oElement.css('top',nUpdatedTop);

                var currObj = oElement.attr('id').split('resizeHolder')[1];

                // $('.shadowHolder').css('left',nUpdatedLeft - 14);
                // $('.shadowHolder').css('top',nUpdatedTop - 14);
                
                $('#shadowHolder' + currObj).css('left', nUpdatedLeft - 14);
                $('#shadowHolder' + currObj).css('top', nUpdatedTop - 14);
            });
            $('.mainHCanvasDiv').each(function(){
                var oElement = $(this);
                var nCurrentCanvasWidth = $('#areaVolumeTool').width() - 18;
                var nCurrentCanvasHeight = $('#areaVolumeTool').height() - 10;

                var nOffsetLeft = oElement.offset().left + oElement.outerWidth(true);
                var nOffsetTop = oElement.offset().top + oElement.outerHeight(true);
                var nUpdatedLeft;
                var nUpdatedTop;

                if(nOffsetLeft > nCurrentCanvasWidth)
                {
                    nUpdatedLeft = oElement.offset().left - (nOffsetLeft - nCurrentCanvasWidth);
                }
                if(nOffsetTop > nCurrentCanvasHeight)
                {
                    nUpdatedTop = oElement.offset().top - (nOffsetTop - nCurrentCanvasHeight);
                }
                if(oElement.offset().left <= 0)
                {
                    nUpdatedLeft = 0;
                }
                if(oElement.offset().top <= 18)
                {
                    nUpdatedTop = 18;
                }

                oElement.css('left',nUpdatedLeft);
                oElement.css('top',nUpdatedTop);
            });
        }    
    };

    // function setStopWatchUi(){
        
    // }

    function setWidgetSize() {
        if (Const.config.applicationHeight !== null) {
            nWidgetHeight = Const.config.applicationHeight - 50;
        } else {
            Const.config.applicationHeight = 600;
            nWidgetHeight = Const.config.applicationHeight - 50;
        }
        mhe.setSize({
            'width': '100%',
            'height': nWidgetHeight + 'px'
        });
    }

    function onConfigLoadError(e) {
        if (Const.getMobileOperatingSystem() !== 'unknown') {
            startApplication();
        } else {
            alert('Failed to get config file.');
        }
    }

    function onConfigLoadSuccess(config) {
        if (config.currentState !== undefined) {
            Const.config = config;
        }
        startApplication();
        return false;
    }

    function OnWidgetResize(width, height) {
        nWidgetWidth = width;
        nWidgetHeight = height;
        
        $(window).on("orientationchange", function() { 
            onOrientationchangeUi();
            setupControlUI();

            setTopPosForStatArea();
        });

        hideOnResize();
        setTopPosForStatArea();
        mheAreaVolumeTool.setupUiForMorePop();
        setupControlUI();    
        mheAreaVolumeTool.rearange();
    }

    function hideOnResize(){
        if($('#more_div').hasClass('buttonSelected')){
            $('#more_div').trigger('click');    
        }
        if($("#setting2_div").hasClass('buttonSelected')){    
            $("#setting2_div").trigger('click');
        }
        if($("#setting_div").hasClass('buttonSelected')){    
            $("#setting_div").trigger('click');
        }
    }

    mheAreaVolumeTool.setupUiForMorePop = function(){
        var currentDevice = Const.getCurrentDeviceType();

        var morePopHeight;
        if(currentDevice.indexOf('mobile_landscape') !== -1)
        {

        }else{
            morePopHeight = 0 - $('.shape-div-small').height();
            $('.mobile_controls-shape').css('top',morePopHeight);

            morePopHeight = 0 - $('.shape-div-small-mobile').height();
            $('.mobile_controls-shape-mobile').css('top',morePopHeight);

            morePopHeight = 0 - $('.shape-div-small-mobile2').height();
            $('.mobile_controls-shape-mobile2').css('top',morePopHeight);
        }
        if (currentDevice.indexOf('tablet') !== -1 || currentDevice.indexOf('mobile') !== -1) {
            setTopPosForStatArea();
        }
    };

    function setupControlUI()
    {
        var currentDevice = Const.getCurrentDeviceType();
        if(currentDevice.indexOf('mobile_landscape') !== -1)
        {   
            $('#stopwatch_tool_container').addClass('landscape');
        }
        else
        {
            $('#stopwatch_tool_container').removeClass('landscape');
        }

        currentDevice = Const.getCurrentDeviceType();
        if(currentDevice.indexOf('mobile') !== -1)
        {   
            $('#stopwatch_tool_container').addClass('mobile-div');
            // console.log('show setting_div', $("#setting_div"));
            $("#setting_div").show();
            $("#setting2_div").show();

            $('.shape-div-small-mobile').append($("#Stroke_Menu").detach());
            $('.shape-div-small-mobile').append($("#group-label").detach());
            $('.shape-div-small-mobile').append($("#toolBasehtDiv").detach());

            $('.shape-div-small-mobile2').append($("#group-label-add").detach());
            $('.shape-div-small-mobile2').append($("#group-label-remove").detach()); 
            $('.shape-div-small-mobile2').append($("#group-label-fill").detach()); 
            $('.shape-div-small-mobile2').append($("#group-label-empty").detach()); 
        }
        else
        {
            $('#stopwatch_tool_container').removeClass('mobile-div');
            // console.log('hide setting_div', $("#setting_div"));
            $("#setting_div").hide();
            $("#setting2_div").hide();

            $('#control_container_inner').append($("#Mode_Menu").detach());
            $('#control_container_inner').append($("#setting_div").detach());
            $('#control_container_inner').append($("#Stroke_Menu").detach());
            $('#control_container_inner').append($("#group-label").detach());
            $('#control_container_inner').append($("#setting2_div").detach());
            $('#control_container_inner').append($("#toolBasehtDiv").detach());
            $('#control_container_inner').append($("#group-label-add").detach());
            $('#control_container_inner').append($("#group-label-remove").detach());
            $('#control_container_inner').append($("#group-label-fill").detach());
            $('#control_container_inner').append($("#group-label-empty").detach()); 
            $('#control_container_inner').append($('#more_div').detach()); 
        }   
    }

    function setTopPosForStatArea() {
        var currentDevice = Const.getCurrentDeviceType();
        var nTotalOtherHeight = $('#measure_area').height();
        $('#measures #result_arrow_span .close-img').hide();

        var morePopHeight = $('.shape-div-small').height();
        var morePopHeight1 = $('.shape-div-small-mobile').height();
        var morePopHeight2 = $('.shape-div-small-mobile2').height();

        if(currentDevice.indexOf('mobile_landscape') !== -1)
        {
            $('#areaVolumeTool').css('width', '85%');
            $('#areaVolumeTool').css('height', nWidgetHeight);
            $('#measures').css('width','87.2%');
            $('#measures').css('height','150px');
            $('#measures .resultcontent').css('height','120px');
            $('#measures').css('left','unset');
            $('#measures').css('right','0%');
            
            $('#measures').css('top',nWidgetHeight-32);
            
            $('#measures #result_arrow_span').show();
            $('#measures #result_arrow_span .open-img').show(); 
            $('.resultheading').unbind('click keydown').bind('click keydown',handleMesureHideShow);
        }
        else if(currentDevice.indexOf('tablet') !== -1 || currentDevice.indexOf('mobile_portait') !== -1)
        {
            if(!Const.areaResize){
                $('#measures').css('width','100%');
                $('#measures').css('height','150px');
                $('#measures .resultcontent').css('height','120px');
                $('#measures').css('left','0%');
                $('#measures').css('top',nWidgetHeight-nTotalOtherHeight-32-morePopHeight - morePopHeight1 - morePopHeight2);
                $('#measures #result_arrow_span').show();
                $('.resultheading').unbind('click keydown').bind('click keydown',handleMesureHideShow);

                $('#measures #result_arrow_span .open-img').show(); 
                $('#measures').attr('aria-label',"Press Enter or space button to hide or view measures");

                $('#areaVolumeTool').css('width','100%');
                $('#areaVolumeTool').css('height',nWidgetHeight-nTotalOtherHeight);
            }    
        }
        else
        {
            $('#measures #result_arrow_span .close-img').show();
            $('#measures #result_arrow_span .open-img').hide();
            $('#measures').css('height',nWidgetHeight-nTotalOtherHeight);
            $('#measures .resultcontent').css('height',nWidgetHeight-nTotalOtherHeight - 30);
            $('#measures').css('left','75%');
            $('#measures').css('top','0');
            $('#measures').css('width','25%');
            // $('#measures #result_arrow_span').hide();
            $('.resultheading').unbind('click keydown').bind('click keydown', handleMesureHideShowDes);

            $('#areaVolumeTool').css('width','75%');
            $('#areaVolumeTool').css('height',nWidgetHeight-nTotalOtherHeight);
        }
        if(!Const.config.Measures){
            $('#measures').hide();
            $('#areaVolumeTool').css('width', '100%');
        }
    }

    function handleMesureHideShowDes(e){
        if (e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9))
            return false;

        if (e.keyCode !== 9) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            // var currentDevice = Const.getCurrentDeviceType();
            var nTotalOtherHeight = $('#measure_area').height();

            // var morePopHeight = $('.shape-div-small').height();
            // var morePopHeight1 = $('.shape-div-small-mobile').height();
            // var morePopHeight2 = $('.shape-div-small-mobile2').height();

            if ($('#measures #result_arrow_span .open-img').css('display') === 'none') {
                $('#measures #result_arrow_span .open-img').show();
                $('#measures #result_arrow_span .close-img').hide();

                $('.resultcontent').hide();
                $('#measures').css('top', nWidgetHeight - nTotalOtherHeight - 32);
                $('#measures').css('height', '32px');
                $('#areaVolumeTool').css('width', '100%');
                $('.resultheading').attr('aria-label', 'Measurement panel, press enter key to maximise the measurement panel');
                $('#result_arrow_span').attr('aria-label','View measurement, Press enter key to view the measurements.');    
                
            } else {
                $('#measures #result_arrow_span .open-img').hide();
                $('#measures #result_arrow_span .close-img').show();

                var j = 0;
                var current;
                for (var i in shapeArray) {
                    current = i;
                    j++;
                }
                if (j !== 0) {
                    $('.resultcontent').show();
                }
                
                $('#measures').css('top', 0);
                $('#measures').css('height', nWidgetHeight - nTotalOtherHeight);
                $('#areaVolumeTool').css('width', '75%');
                $('.resultheading').attr('aria-label', 'Measurement panel, press enter key to minimize the measurement panel.');
                $('#result_arrow_span').attr('aria-label','Hide measurement, Press enter key to hide the measurements.');
            }
            mheAreaVolumeTool.rearange();
        }    
    }

    function handleMesureHideShow(e){
        if(e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9))
            return false;
         
        if(e.keyCode !== 9){
            if(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            var currentDevice = Const.getCurrentDeviceType();
            var nTotalOtherHeight = $('#measure_area').height();
            
            var morePopHeight = $('.shape-div-small').height();
            var morePopHeight1 = $('.shape-div-small-mobile').height();
            var morePopHeight2 = $('.shape-div-small-mobile2').height();

            if($('#measures #result_arrow_span .open-img').css('display') === 'none'){
                $('#measures #result_arrow_span .open-img').show(); 
                $('#measures #result_arrow_span .close-img').hide();
                $('.resultcontent').hide();
                if(currentDevice.indexOf('mobile_landscape') !== -1)
                {
                    $('#measures').css('top',nWidgetHeight-32);
                }else if(currentDevice.indexOf('tablet') !== -1 || currentDevice.indexOf('mobile_portait') !== -1)
                {    
                    // console.log('close');
                    $('#measures').css('top',nWidgetHeight-nTotalOtherHeight-32-morePopHeight - morePopHeight1 - morePopHeight2);
                }else{
                    $('#measures').css('top', 0);
                    $('#measures').css('height', nWidgetHeight - nTotalOtherHeight);
                    $('#areaVolumeTool').css('width', '75%');
                    $('.resultcontent').show();
                    $('.resultheading').attr('aria-label','Measurement panel, press enter key to minimize the measurement panel.');
                    $('#result_arrow_span').attr('aria-label','Hide measurement, Press enter key to hide the measurements.');
                }
            }else{
                $('#measures #result_arrow_span .open-img').hide(); 
                $('#measures #result_arrow_span .close-img').show();
                
                var j = 0;
                var current;
                for (var i in shapeArray) {
                    current = i;
                    j++;
                }
                if (j !== 0) {
                    $('.resultcontent').show();
                }

                if(currentDevice.indexOf('mobile_landscape') !== -1)
                {
                    $('#measures').css('top',nWidgetHeight-150);
                }else if(currentDevice.indexOf('tablet') !== -1 || currentDevice.indexOf('mobile_portait') !== -1)
                {   
                    // console.log('open'); 
                    $('#measures').css('top',nWidgetHeight-nTotalOtherHeight-150-morePopHeight - morePopHeight1 - morePopHeight2);
                }else{
                    $('#measures').css('top', nWidgetHeight - nTotalOtherHeight - 32);
                    $('#measures').css('height', '32px');
                    $('#areaVolumeTool').css('width', '100%');
                    $('.resultcontent').hide();
                    $('.resultheading').attr('aria-label', 'Measurement panel, press enter key to maximise the measurement panel');
                    $('#result_arrow_span').attr('aria-label','View measurement, Press enter key to view the measurements.');
                }
            }
            mheAreaVolumeTool.rearange();
        }    
    }

    function onOrientationchangeUi() {
        hideOnResize();    
    }

    function addWindowEvents() {
        $(window).click(function(e) {
            $('body').removeClass('show-focus-outlines');
        });

        $(window).on('keydown', function(e) {
            if (e.keyCode === 9) {
                $('body').addClass('show-focus-outlines');
            }
        });
        document.addEventListener('click', function(e) {
            $('body').removeClass('show-focus-outlines');
        });
    }

    mhe.onWidgetReady(init);

})(mheAreaVolumeTool = mheAreaVolumeTool || {});
var mheAreaVolumeTool;

// player.js