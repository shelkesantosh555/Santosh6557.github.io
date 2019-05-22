// navigation.js

/* global
$
*/

/* exported
Navigation
*/


var Navigation = function()
{
    var Evts = new Events();
    var oModeDD, oSettingDiv, oStrokeDD, oLockDiv, baseInput, oAddDiv, oRemoveDiv, oFillDiv, oEmptyDiv, oMoreDiv, oUndoDiv, oRedoDiv, oHelpDiv, oResetDiv;
    var oSetting2Div;

    function init()
    {
        var oDiv = $("<div>", {
            "id":"control_container_inner"
        });

        //Mode DD
        var labelArray = [];

        var i;
        
        for( i in Const.config.Mode)
        {
            labelArray.push(i);
        }
        oModeDD = new DropDownMenu(labelArray,"Mode");
        oModeDD.Evts.addEventListener('OPTION_SELECTED',onDDSelected);

        //Mobile Toolbar Start

        oSettingDiv = $("<div>", {id: "setting_div", class:'control_div', title:'setting'}).bind('click keydown',handleControlEvents);

        //Mobile Toolbar End

        //Border DD
        labelArray = [];

        for( i in Const.config.Border_Colors_Arr)
        {
            labelArray.push(i);
        }
        oStrokeDD = new ColorMenu(labelArray,"Stroke");
        oStrokeDD.Evts.addEventListener('OPTION_SELECTED',onDDSelected);

        var groupLabel = document.createElement('div');
        groupLabel.setAttribute('id',"group-label");
        $(groupLabel).append('<div style="text-align: left;"><label for="Size">Size</label></div>');

        oLockDiv = $("<div>", { id: "lock_div", class: 'control_div buttonSelectedUnLock', title: 'Unlock', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Unlock button, Press enter or space to select Lock button and navigate to the shape using tab key on keyboard."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;
        $(groupLabel).append(oLockDiv);

        var toolBaseSubDiv = document.createElement('div');
        toolBaseSubDiv.setAttribute('id',"toolBasehtDiv");
        toolBaseSubDiv.setAttribute('class',"toolDiv");
        toolBaseSubDiv.setAttribute('style',"display: inline;float: left;margin-right: 15px;");
        toolBaseSubDiv.setAttribute('title', "Quantity");

        $(toolBaseSubDiv).append('<div style="text-align: left;"><label for="Quantity">By Quantity</label></div>');
        baseInput = document.createElement('input');
        baseInput.setAttribute('class', "toolSideInput");
        baseInput.setAttribute('aria-label','Quantity Input, Use arrow keys to change the Quantity or enter the value manually, minimum value 1 and maximum value 999.');
        baseInput.setAttribute('tabindex',Const.tabIndex);
        baseInput.setAttribute('maxlength',5);
        if (Const.config.qLockFlag) {
            baseInput.setAttribute('value', Const.config.lockQuantity);
        } else {
            baseInput.setAttribute('value', 1);
        }
        
        Const.tabIndex++;
        toolBaseSubDiv.appendChild(baseInput);

        $(baseInput).spinner({
            step: 1,
            min : 1,
            max : 999,
            numberFormat: "n",
            spin: function(e,ui){
                spinEvent(ui.value);
            }
        });

        $(baseInput).bind("keyup", function(e) {
            var val = $(this).val();
            if(isNaN(val)){
                val = val.replace(/[^0-9\.]/g,'');
                if(val.split('.').length>2){ 
                    val = val.replace(/\.+$/,"");
                }    
            }

            if(isNaN(val)){
                val = 1;    
            }

            if(Const.msieversion()){
                if(val < 1)
                    val = 1;
                if(val > 999)
                    val = 999;
            }

            $(this).val(val);
            spinEvent(val);
        });     

        $(baseInput).bind("change", function(e) {
            if(this.value < 1)
                this.value = 1;
            if(this.value > 999)
                this.value = 999;

            var val = this.value;
            $(baseInput).val(val);
            spinEvent(val);
        });

        var groupLabelAdd = document.createElement('div');
        groupLabelAdd.setAttribute('id', "group-label-add");
        $(groupLabelAdd).append('<div style="text-align: left;"><label for="Size">Add</label></div>');
        
        oAddDiv = $("<div>", { id: "add_div", class: 'control_div', title: 'Add', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Add Units, Press the enter key to add units to the active object as per selected quantity."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        var groupLabelRemove = document.createElement('div');
        groupLabelRemove.setAttribute('id', "group-label-remove");
        $(groupLabelRemove).append('<div style="text-align: left;"><label for="Size">Remove</label></div>');

        oRemoveDiv = $("<div>", { id: "remove_div", class: 'control_div', title: 'Remove', 'tabindex': '' + Const.tabIndex + '', "aria-label": "Remove Units, Press the enter key to remove units from the active object as per selected quantity."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        var groupLabelFill = document.createElement('div');
        groupLabelFill.setAttribute('id', "group-label-fill");
        $(groupLabelFill).append('<div style="text-align: left;"><label for="Size">Fill</label></div>');

        oFillDiv = $("<div>", { id: "fill_div", class: 'control_div', title: 'Fill', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Fill button, Press the enter key to fill the active object with units completely."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        var groupLabelEmpty = document.createElement('div');
        groupLabelEmpty.setAttribute('id', "group-label-empty");
        $(groupLabelEmpty).append('<div style="text-align: left;"><label for="Size">Empty</label></div>');

        oEmptyDiv = $("<div>", { id: "empty_div", class: 'control_div', title: 'Empty', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Empty button, Press the enter key to remove all units from the active object."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        oMoreDiv = $("<div>", { id: "more_div", class: 'control_div', title: 'Options', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Options button, Press the enter key to open options menu & use tab key to navigate through available options."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        oUndoDiv = $("<div>", { id: "undo_div", class: 'control_div', title: 'Undo', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Undo button. Press enter key to undo your last action."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        oRedoDiv = $("<div>", { id: "redo_div", class: 'control_div', title: 'Redo', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Redo button. Press enter key to redo your last action."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        oResetDiv = $("<div>", { id: "reset_div", class: 'control_div', title: 'Reset', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Reset button. Press enter key to clear the canvas."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        oHelpDiv = $("<div>", { id: "help_div", class: 'control_div', title: 'Help', 'tabindex': '' + Const.tabIndex + '', "aria-label":"Help button. Press enter key to view help."}).bind('click keydown',handleControlEvents);
        Const.tabIndex++;

        $('.shape-div-small').append(oUndoDiv);     
        $('.shape-div-small').append(oRedoDiv);     
        $('.shape-div-small').append(oResetDiv);    
        $('.shape-div-small').append(oHelpDiv);         

        $('#shape-close-span').attr('tabindex',Const.tabIndex);
        Const.tabIndex++;

        oSetting2Div = $("<div>", {id: "setting2_div", class:'control_div', title:'setting'}).bind('click keydown',handleControlEvents);

        $(oDiv).append(oModeDD.getHTML());

        $(oDiv).append(oSettingDiv);
        $(oDiv).append(oStrokeDD.getHTML());            
        $(oDiv).append(groupLabel);
        $(oDiv).append(toolBaseSubDiv);
        $(groupLabelAdd).append(oAddDiv);
        $(oDiv).append(groupLabelAdd);
        $(groupLabelRemove).append(oRemoveDiv);
        $(oDiv).append(groupLabelRemove);
        $(groupLabelFill).append(oFillDiv);
        $(oDiv).append(groupLabelFill);
        $(groupLabelEmpty).append(oEmptyDiv);
        $(oDiv).append(groupLabelEmpty);
        $(oDiv).append(oSetting2Div);
        $(oDiv).append(oMoreDiv);

        $('#controlContainer').append(oDiv);

        $('#shape-close-span').bind('click keydown',handleControlEvents);   
        $('#shape-close-mobile').bind('click keydown',handleControlEvents); 
        // $('#shape-close-span-mobile').bind('click keydown',handleControlEvents);     
        $('#shape-close-mobile2').bind('click keydown',handleControlEvents);    
        // $('#shape-close-span-mobile2').bind('click keydown',handleControlEvents); 

        setTimeout(function(){

            var count = 0;
            if(!Const.config.Undo){
                $('#undo_div').hide();
                count++;
            }
            if (!Const.config.Redo) {
                $('#redo_div').hide();
                count++;
            }
            if(!Const.config.Reset){
                $('#reset_div').hide();
                count++;
            }   
            if (!Const.config.HelpButton) {
                $('#help_div').hide();
                count++;
            }
            
            if (count === 4) { 
                $('#more_div').hide();
            }

            if (!Const.config.LockUnlock) {
                $('#group-label').hide();
            }

            // units
            count = 0;
            if(!Const.config.Add){
                count++;
            }
            if (!Const.config.Remove) {
                count++;
            }
            
            if (count === 2) { 
                $('#toolBasehtDiv').hide();
            }

            // Mode
            count = 0;
            if(!Const.config.Mode.Area){
                $('#Mode_Menu .listArea').hide();
                count++;
            }
            if(!Const.config.Mode.Volume){
                $('#Mode_Menu .listVolume').hide();
                count++;
            }
            if (count === 2){
                $('#Mode_Menu').hide();
            }

            // Border
            if(!Const.config.Border_Colors){
                $('#Stroke_Menu').hide();
            }

            // Units
            if (!Const.config.Units) {
                $('#group-label-add').hide();
                $('#group-label-remove').hide();
                $('#group-label-fill').hide();
                $('#group-label-empty').hide(); 
            }   

            if (!Const.config.Add) {
                $('#group-label-add').hide();
            }   
            if (!Const.config.Remove) {
                $('#group-label-remove').hide();
            }   
            if (!Const.config.Fill) {
                $('#group-label-fill').hide();
            }   
            if (!Const.config.Empty) {
                $('#group-label-empty').hide(); 
            }   

        },100); 

        //Border Color
        setTimeout(function(){
            strokeConfigHandel();
        },100);     
    }

    function strokeConfigHandel(){
        if(!Const.config.Border_Colors){
            $('#Stroke_Menu').hide();
        }

        if(!Const.config.Border_Colors_Arr.Red){
            $('#Stroke_Menu .listRed').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Green){
            $('#Stroke_Menu .listGreen').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Orange){
            $('#Stroke_Menu .listOrange').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Yellow){
            $('#Stroke_Menu .listYellow').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Blue){
            $('#Stroke_Menu .listBlue').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Purple){
            $('#Stroke_Menu .listPurple').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Pink){
            $('#Stroke_Menu .listPink').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Black){
            $('#Stroke_Menu .listBlack').parent().hide(); 
        }
        if(!Const.config.Border_Colors_Arr.Grey){
            $('#Stroke_Menu .listGrey').parent().hide(); 
        }

        for (var i in Const.config.Default_Border_Colors_Arr) {
            if (Const.config.Default_Border_Colors_Arr[i]) {
                Const.currBorderColor = i.toLowerCase();
                var navDiv = $('#Stroke_Menu .navTopSpan div');
                navDiv.css('background-color', Const.colorArray[Const.currBorderColor]);
            }
        }
    }

    function spinEvent(val){
        Evts.dispatchEvent('CONTROL_EVENT',{type:'toolSideInput',value:val});   
    }

    function handleControlEvents(e){

        if(e.type === 'keydown' && (e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 9))
            return false;

        if(e.keyCode !== 9){
            if(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            oModeDD.onWindowClick();
            oStrokeDD.onWindowClick();

            Evts.dispatchEvent('CONTROL_EVENT',{type:$(e.target).attr("id"),dObject:e.target,left:($(e.target).position().left) - 2});
        }   
    }
    
    function onDDSelected(obj, evtName, data)
    {
        var menuId = $(data.currentUL).parent().parent().parent().parent().attr('id');
        Evts.dispatchEvent('CONTROL_EVENT',{'type':menuId,'currentObject':data.selection, 'currentUL': data.currentUL});
    }

    return{
        init:init,
        Evts:Evts
    };
};

// navigation.js
