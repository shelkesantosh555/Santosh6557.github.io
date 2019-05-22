// editor.js

/*global
$
*/
/* exported
ValidateSingleInput,HandleBrowseClick,RemoveImage,showHideConfig,toggleLayoutGrid
*/

var config = {};

/* global mhe */

mhe.onWidgetReady(function () {

    var lastDefaulHeight;
    var lastQuantity;
    var timerP = false;
    // var rP = false;

    function listenForConfigChanges() {
        // setDefaultVal();

        lastDefaulHeight = config.applicationHeight;
        lastQuantity = config.lockQuantity;

        $("#applicationHeightNumber").change(function () {
            setApplicationHeight();
        });

        // For Quantity
        $("#lockQuantityNumber").change(function () {
            setLockUnlockQuantity();
        });

        function setLockUnlockQuantity(){
            if ($("#qLockFlag").prop("checked")) {
                config.lockQuantity = Number($("#lockQuantityNumber").val());
                $('.toolSideInput').val(config.lockQuantity);
                $('#toolBasehtDiv .ui-spinner').css({
                    'opacity': '0.4',
                    'pointer-events': 'none'
                });
                $("#lockQuantityNumber").removeAttr("disabled");
                if (config.lockQuantity < 1) {
                    config.lockQuantity = 1;
                }
                if (config.lockQuantity > 999){
                    config.lockQuantity = 999;
                }
            } else {
                config.lockQuantity = 1;
                $('.toolSideInput').val(config.lockQuantity);
                
                if($('#areaVolumeTool').children().length !== 0){
                    $('#toolBasehtDiv .ui-spinner').css({
                        'opacity': '1',
                        'pointer-events': 'auto'
                    });
                }

                $("#lockQuantityNumber").attr("disabled", "true");
            }
            mhe.updateConfigFile(config);
        }

        function setApplicationHeight() {
            if ($("#applicationHeightCHK").prop("checked")) {
                config.applicationHeight = Number($("#applicationHeightNumber").val());
                $("#applicationHeightNumber").removeAttr("disabled");
                if (config.applicationHeight < 400) {
                    config.applicationHeight = 400;
                }
            } else {
                config.applicationHeight = null;
                $("#applicationHeightNumber").attr("disabled", "true");
            }
            mhe.updateConfigFile(config);
        }

        $("#map_instr_text").change(function () {
            config.map_instr_text = $("#map_instr_text").val();
            $("#m_instructionText").text($("#map_instr_text").val());
            mhe.updateConfigFile(config);
        });

        $('#mhe-area-volume-editor input[type]').off("click").on('click', function () {
            var currentID = $(this).attr('id');
            var valueA;
            var i;
            var navDiv;
            switch (currentID) {
                case 'applicationHeightCHK':
                    if ($(this).prop("checked")) {
                        valueA = $("#applicationHeightNumber").attr("data-value");
                        $("#applicationHeightNumber").val(lastDefaulHeight);
                        config.applicationHeight = Number($("#applicationHeightNumber").val());
                        $("#applicationHeightNumber").removeAttr("disabled");
                    } else {
                        config.applicationHeight = null;
                        valueA = $("#applicationHeightNumber").val();
                        $("#applicationHeightNumber").attr("data-value", valueA);
                        $("#applicationHeightNumber").attr("disabled", "true");
                    }
                    setApplicationHeight();
                    break;
                case 'qLockFlag':
                    // For Quantity
                    if ($(this).prop("checked")) {
                        valueA = $("#lockQuantityNumber").attr("data-value");
                        $("#lockQuantityNumber").val(lastQuantity);
                        config.lockQuantity = Number($("#lockQuantityNumber").val());
                        $("#lockQuantityNumber").removeAttr("disabled");
                    } else {
                        config.lockQuantity = 1;
                        valueA = $("#lockQuantityNumber").val();
                        $("#lockQuantityNumber").attr("data-value", valueA);
                        $("#lockQuantityNumber").attr("disabled", "true");
                    }
                    setLockUnlockQuantity();
                    config.qLockFlag = $(this).prop("checked");
                    break;      
                case 'Area':
                    if ($(this).prop("checked")) {
                        $('#Mode_Menu').show();
                        $('#Mode_Menu .listArea').show();
                    } else {
                        $('#Mode_Menu .listArea').hide();
                        if ($('#Mode_Menu .listVolume').css('display') === 'none') {
                            $('#Mode_Menu').hide();
                        }
                    }
                    config.Mode[currentID] = $(this).prop("checked");
                    break;

                case 'Volume':
                      if ($(this).prop("checked")) {
                          $('#Mode_Menu').show();
                          $('#Mode_Menu .listVolume').show();
                      } else {
                          $('#Mode_Menu .listVolume').hide();
                          if ($('#Mode_Menu .listArea').css('display') === 'none') {
                              $('#Mode_Menu').hide();
                          }
                      }
                      config.Mode[currentID] = $(this).prop("checked");
                      break;

                case 'Border_Colors':
                      if ($(this).prop("checked")) {
                          $(".Border_Colors-p").removeAttr("disabled");
                          $(".Colors_Available-p").prop("checked", true);
                          $('#Blue.Default_Colors-p').prop("checked", true);
                          $(".Default_Colors-p").removeAttr("disabled");
                          $("#Border_Colors_s_d").text("Deselect All");
                          
                          $('#Stroke_Menu').show();

                          Const.currBorderColor = 'blue';
                          navDiv = $('#Stroke_Menu .navTopSpan div');
                          navDiv.css('background-color', Const.colorArray[Const.currBorderColor]);    

                          onBorderColorSetConfig(true);
                      } else {
                          $(".Border_Colors-p").attr("disabled", "disabled");
                          $(".Border_Colors-p").prop("checked", false);
                          $(".Default_Colors-p").attr("disabled", "disabled");
                          $('.Default_Colors-p').prop("checked", false);
                          $("#Border_Colors_s_d").text("Select All");
                          
                          $('#Stroke_Menu').hide();
                          onBorderColorSetConfig(false);
                      }

                      config[currentID] = $(this).prop("checked");
                      break;

                case 'LockUnlock':
                      if ($(this).prop("checked")) {
                          $("#group-label").show();
                      } else {
                          $("#group-label").hide();
                      }
                      config[currentID] = $(this).prop("checked");
                      break;

                case 'Units':
                      if ($(this).prop("checked")) {
                          $(".Units-p").removeAttr("disabled");
                          $(".Units-p").prop("checked", true);
                          $("#Units_s_d").text("Deselect All");
                          $('#group-label-add').show();
                          $('#group-label-remove').show();
                          $('#group-label-fill').show();
                          $('#group-label-empty').show(); 

                          onUnitSetConfig(true);
                      } else {
                          $(".Units-p").attr("disabled", "disabled");
                          $(".Units-p").prop("checked", false);
                          $("#Units_s_d").text("Select All");
                          $('#group-label-add').hide();
                          $('#group-label-remove').hide();
                          $('#group-label-fill').hide();
                          $('#group-label-empty').hide();   

                          onUnitSetConfig(false);
                      }
                      config[currentID] = $(this).prop("checked");
                      break;

                case 'Measures':

                      if ($(this).prop("checked")) {
                          $(".Measures-p").removeAttr("disabled");
                          $(".Measures-p").prop("checked", true);
                          $("#Measures_s_d").text("Deselect All");
                          $('#measures').show();
                          $('#areaVolumeTool').css('width','75%');

                          for (i in config.Area_Measures) {
                              if (i === 'Total_Area' || i === 'Filled_Area' || i === 'Unfilled_Area'){    
                                  $('#' + i.toLowerCase().replace('_area', '')).show();
                              }else{
                                  $('#' + i.toLowerCase()).show();
                              }  
                          }
                          for (i in config.Volume_Measures) {
                              if (i === 'Total_Volume' || i === 'Filled_Volume' || i === 'Unfilled_Volume') {
                                  $('#' + i.toLowerCase().replace('_volume', '')).show();
                              } else {
                                  $('#' + i.toLowerCase()).show();
                              }
                          }

                          onMeasureSetConfig(true);
                      } else {
                          $(".Measures-p").attr("disabled", "disabled");
                          $(".Measures-p").prop("checked", false);
                          $("#Measures_s_d").text("Select All");
                          
                          $('#measures').hide();
                          $('#areaVolumeTool').css('width', '100%');

                          onMeasureSetConfig(false);
                      }

                      config[currentID] = $(this).prop("checked");
                      break;

                case 'Reset':
                      if ($(this).prop("checked")) {
                          $('#reset_div').show();
                      } else {
                          $('#reset_div').hide();
                      }
                      config[currentID] = $(this).prop("checked");
                      break;

                case 'Undo':
                      if ($(this).prop("checked")) {
                          $('#undo_div').show();
                      } else {
                          $('#undo_div').hide();
                      }
                      config[currentID] = $(this).prop("checked");
                      break;
                case 'Redo':
                      if ($(this).prop("checked")) {
                          $('#redo_div').show();
                      } else {
                          $('#redo_div').hide();
                      }
                      config[currentID] = $(this).prop("checked");
                      break; 
                case 'HelpButton':
                      if ($(this).prop("checked")) {
                          $('#help_div').show();
                      } else {
                          $('#help_div').hide();
                      }
                      config[currentID] = $(this).prop("checked");
                      break;
                case 'AreaByRow':
                        if ($(this).prop("checked")) {
                            config.AreaByColumn = false;  
                        }
                        config[currentID] = $(this).prop("checked");
                      break;     
                case 'AreaByColumn':
                        if ($(this).prop("checked")) {
                            config.AreaByRow = false;
                        }
                        config[currentID] = $(this).prop("checked");
                        break;            
                case 'VolumeByRow':
                        if ($(this).prop("checked")) {
                            config.VolumeByColumn = false;
                        }
                        config[currentID] = $(this).prop("checked");
                      break;     
                case 'VolumeByColumn':
                        if ($(this).prop("checked")) {
                            config.VolumeByRow = false;
                        }
                        config[currentID] = $(this).prop("checked");
                        break;           

            }

            checkUncheckValidator($(".Border_Colors-p"), $("#Border_Colors"), $("#Border_Colors_s_d"));
            checkUncheckValidator($(".Units-p"), $("#Units"), $("#Units_s_d"));
            checkUncheckValidator($(".Measures-p"), $("#Measures"), $("#Measures_s_d"));

            var cnt = 0;

            if (!config.Undo && !config.Redo && !config.HelpButton && !config.Reset){
                if ($('#more_div').hasClass('buttonSelected')) {
                    $('#more_div').trigger('click');
                }  
                $('#more_div').hide();
            }else{
                $('#more_div').show();
            }

            if ($(this).hasClass("Measures-p")) {
                if ($(this).hasClass("Area-p")) {
                    config.Area_Measures[currentID] = $(this).prop("checked");
                    if (currentID === 'Total_Area' || currentID === 'Filled_Area' || currentID === 'Unfilled_Area') {
                        SetFunction(currentID, $(this).prop("checked"), $('.area-m #' + currentID.toLowerCase().replace('_area', '')));
                    } else {
                        SetFunction(currentID, $(this).prop("checked"), $('.area-m #' + currentID.toLowerCase()));
                    }
                }
                if ($(this).hasClass("Volume-p")) {
                    config.Volume_Measures[currentID] = $(this).prop("checked");
                    if (currentID === 'Total_Volume' || currentID === 'Filled_Volume' || currentID === 'Unfilled_Volume') {
                        SetFunction(currentID, $(this).prop("checked"), $('.volume-m #' + currentID.toLowerCase().replace('_volume', '')));
                    } else {
                        SetFunction(currentID, $(this).prop("checked"), $('.volume-m #' + currentID.toLowerCase()));
                    }
                } 
                
                for (i in config.Area_Measures) {
                    if (config.Area_Measures[i]) {
                        cnt++;
                    }
                } 
                for (i in config.Volume_Measures) {
                    if (config.Volume_Measures[i]) {
                        cnt++;
                    }
                }
                if (cnt === 0) { 
                    $(".Measures-p").attr("disabled", "disabled");
                    $(".Measures-p").prop("checked", false);
                    $("#Measures").prop("checked", false);
                    $("#Measures_s_d").text("Select All");

                    $('#measures').hide();
                    $('#areaVolumeTool').css('width', '100%');

                    onMeasureSetConfig(false);
                    config.Measures = false;
                }
            }

            if ($(this).hasClass("Units-p")) {
                config[currentID] = $(this).prop("checked");  
                SetFunction(currentID, $(this).prop("checked"), $('#group-label-' + currentID.toLowerCase()));
                
                var spCnt = 0;
                if (config.Add){
                    cnt++;
                    spCnt++;
                }
                if (config.Remove) {
                    cnt++;
                    spCnt++;
                }
                if (config.Fill) {
                    cnt++;
                }
                if (config.Empty) {
                    cnt++;
                }
                if(cnt === 0){
                    $("#Units").prop("checked", false);
                    $(".Units-p").attr("disabled", "disabled");
                    $(".Units-p").prop("checked", false);
                    $("#Units_s_d").text("Select All");
                    $('#group-label-add').hide();
                    $('#group-label-remove').hide();
                    $('#group-label-fill').hide();
                    $('#group-label-empty').hide();

                    onUnitSetConfig(false);
                    config.Units = false;      
                }
            }

            if (!config.Add && !config.Remove){
                $('#toolBasehtDiv').hide();
                $("#qLockFlag").prop("checked",false);
                $("#qLockFlag").attr("disabled", "true");

                config.qLockFlag = false;
                config.lockQuantity = 1;
                $('.toolSideInput').val(config.lockQuantity);
                $("#lockQuantityNumber").attr("disabled", "true");    
            }else{

                $('#toolBasehtDiv').show();
                $("#qLockFlag").removeAttr("disabled");
                if($('#areaVolumeTool').children().length !== 0){
                    if(!config.qLockFlag){
                        $('#toolBasehtDiv .ui-spinner').css({
                            'opacity': '1',
                            'pointer-events': 'auto'
                        });
                    }    
                }
            }


            if ($(this).hasClass("Colors_Available-p")) {
                config.Border_Colors_Arr[currentID] = $(this).prop("checked");
                SetFunction(currentID, $(this).prop("checked"), $('#Stroke_Menu .list' + currentID).parent());
                if (!$(this).prop("checked")){
                    setDefaultColor(currentID);
                    $('#' + currentID + '.Default_Colors-p').attr("disabled", "disabled"); 
                }else{
                    $('#' + currentID + '.Default_Colors-p').removeAttr("disabled");
                }
                
                for (i in config.Border_Colors_Arr) {
                    if (config.Border_Colors_Arr[i]) {  
                        cnt++;
                    }  
                } 
                if(cnt === 0){
                    $(".Border_Colors-p").attr("disabled", "disabled");
                    $(".Border_Colors-p").prop("checked", false);
                    $(".Default_Colors-p").attr("disabled", "disabled");
                    $('.Default_Colors-p').prop("checked", false);
                    $("#Border_Colors_s_d").text("Select All");
                    $("#Border_Colors").prop("checked", false);

                    config.Border_Colors = false;
                  
                    Const.currBorderColor = 'blue';
                    navDiv = $('#Stroke_Menu .navTopSpan div');
                    navDiv.css('background-color', Const.colorArray[Const.currBorderColor]);

                    $('#Stroke_Menu').hide();
                    onBorderColorSetConfig(false);
                } 
            }

            if ($(this).hasClass("Default_Colors-p")) {
                for (i in config.Default_Border_Colors_Arr) {
                    if (config.Default_Border_Colors_Arr[i]) {
                        config.Default_Border_Colors_Arr[i] = false;
                        break;  
                    }
                }
                if (config.Border_Colors_Arr[currentID]) {
                    config.Default_Border_Colors_Arr[currentID] = true;
                    Const.currBorderColor = currentID.toLowerCase();
                    navDiv = $('#Stroke_Menu .navTopSpan div');
                    navDiv.css('background-color', Const.colorArray[Const.currBorderColor]);   
                }  
            }

            mhe.updateConfigFile(config);
        });
    }

    function setDefaultColor(Obj){
        if(config.Default_Border_Colors_Arr[Obj]){
            config.Default_Border_Colors_Arr[Obj] = false;
            $('#'+Obj+'.Default_Colors-p').prop("checked", false); 
            for (var i in config.Default_Border_Colors_Arr){
                if(i !== Obj){
                    if (config.Border_Colors_Arr[i]){
                        config.Default_Border_Colors_Arr[i] = true; 
                        Const.currBorderColor = i.toLowerCase();     
                        $('#' + i + '.Default_Colors-p').prop("checked", true); 
                        $('#' + i + '.Default_Colors-p').removeAttr("disabled");
                        var navDiv = $('#Stroke_Menu .navTopSpan div');
                        navDiv.css('background-color', Const.colorArray[Const.currBorderColor]);   
                        break;
                    }  
                }
            }
        } 
    }

    function onUnitSetConfig(flag) {
        if (flag) {
            config.Add = true;
            config.Remove = true;
            config.Fill = true;
            config.Empty = true;
        } else {
            config.Add = false;
            config.Remove = false;
            config.Fill = false;
            config.Empty = false;
        }
    }

    function onMeasureSetConfig(flag) {
        var i;
        if (flag) {
            config.Measures = true;
            for (i in config.Area_Measures) {
                config.Area_Measures[i] = true;
            }
            for (i in config.Volume_Measures) {
                config.Volume_Measures[i] = true;
            }
        } else {
            config.Measures = false;
            for (i in config.Area_Measures) {
                config.Area_Measures[i] = true;
            }
            for (i in config.Volume_Measures) {
                config.Volume_Measures[i] = true;
            }
        }
    }

    function onBorderColorSetConfig(flag) {
        if (flag) {
            onStrokeSetConfig(true);
            onDefaultColorSetConfig(true);
        } else {
            onStrokeSetConfig(false);
            onDefaultColorSetConfig(false);
        }
    }

    function onStrokeSetConfig(flag) {
        if (flag) {
            config.Border_Colors_Arr.Red = true;
            config.Border_Colors_Arr.Orange = true;
            config.Border_Colors_Arr.Yellow = true;
            config.Border_Colors_Arr.Green = true;
            config.Border_Colors_Arr.Blue = true;
            config.Border_Colors_Arr.Purple = true;
            config.Border_Colors_Arr.Pink = true;
            config.Border_Colors_Arr.Black = true;
            config.Border_Colors_Arr.Grey = true;
        } else {
            config.Border_Colors_Arr.Red = false;
            config.Border_Colors_Arr.Orange = false;
            config.Border_Colors_Arr.Yellow = false;
            config.Border_Colors_Arr.Green = false;
            config.Border_Colors_Arr.Blue = false;
            config.Border_Colors_Arr.Purple = false;
            config.Border_Colors_Arr.Pink = false;
            config.Border_Colors_Arr.Black = false;
            config.Border_Colors_Arr.Grey = false;
        }
    }

    function onDefaultColorSetConfig(flag) {
        if (flag) {
            config.Default_Border_Colors_Arr.Black = false;
            config.Default_Border_Colors_Arr.Red = false;
            config.Default_Border_Colors_Arr.Orange = false;
            config.Default_Border_Colors_Arr.Yellow = false;
            config.Default_Border_Colors_Arr.Green = false;
            config.Default_Border_Colors_Arr.Blue = true;
            config.Default_Border_Colors_Arr.Purple = false;
            config.Default_Border_Colors_Arr.Pink = false;
            config.Default_Border_Colors_Arr.Grey = false;
        } else {
            config.Default_Border_Colors_Arr.Red = false;
            config.Default_Border_Colors_Arr.Orange = false;
            config.Default_Border_Colors_Arr.Yellow = false;
            config.Default_Border_Colors_Arr.Green = false;
            config.Default_Border_Colors_Arr.Blue = false;
            config.Default_Border_Colors_Arr.Purple = false;
            config.Default_Border_Colors_Arr.Pink = false;
            config.Default_Border_Colors_Arr.Black = false;
            config.Default_Border_Colors_Arr.Grey = false;
        }
    }

    function SetFunction(mainObj, flag, subObj) {
        if (flag) {
            subObj.show();
        } else {
            subObj.hide();
        }
    }

    function checkUncheckValidator(classPObj, mainObj, sdObj) {
        var ti = 0;
        classPObj.each(function (ind) {
            if (!$(this).prop("checked")) {
                timerP = true;
                ti++;
            } else {
                mainObj.prop("checked", true);
            }
        });

        if (timerP) {
            sdObj.text("Select All");
            if (ti === 21) {
                mainObj.prop("checked", false);
            }
            timerP = false;
        } else {
            sdObj.text("Deselect All");
        }
    }

    function setDefaultVal() {
        config = {
            'currentState': '',
            'applicationHeight': 600,
            'lockQuantity': 1,
            'qLockFlag': false,
            'HelpButton': false,
            'Mode': {
                'Area': true,
                'Volume': true
            },
            'Border_Colors': true,
            'Border_Colors_Arr': {
                'Red': true,
                'Orange': true,
                'Yellow': true,
                'Green': true,
                'Blue': true,
                'Purple': true,
                'Pink': true,
                'Black': true,
                'Grey': true
            },
          'Default_Border_Colors_Arr': {
            'Red': false,
            'Orange': false,
            'Yellow': false,
            'Green': false,
            'Blue': true,
            'Purple': false,
            'Pink': false,
            'Black': false,
            'Grey': false
          },
          'LockUnlock': false,
          'Units': true,
          'Add': true,
          'Remove': true,
          'Fill': true,
          'Empty': true,
          'Measures': true,
          'Area_Measures': {
            'Length': true,
            'Width': true,
            'Perimeter': true,
            'Total_Area': true,
            'Filled_Area': true,
            'Unfilled_Area': true
          },
          'Volume_Measures': {
            'Length': true,
            'Width': true,
            'Height': true,
            'Total_Volume': true,
            'Filled_Volume': true,
            'Unfilled_Volume': true
          },
          'Undo': true,
          'Redo': true,
          'Reset': true,
          'AreaByColumn': false,
          'AreaByRow': true,
          'VolumeByColumn': true,
          'VolumeByRow': false
        };
      }

    // function showImage(path) {
    //     if (path) {
    //         var img = $('<img/>').attr({
    //             src: path,
    //             'style': 'width:25%;'
    //         });
    //         $('#image-holder').empty().append(img);
    //         $('#canvas #bgMiddlediv1').empty();
    //         $('#canvas').prepend('<div id="bgMiddlediv1"><div id="bgMiddlediv2"><img src=' + path + ' /></div></div>');
    //     }
    // }

    function setupConfigEditorView() {

        $.each(config, function (index, value) {
            if (config[index]) {
                $("#" + index).prop('checked', 'checked');
                if (index === "Mode") {
                    $.each(config[index], function (index1, value1) {
                        if (config[index][index1]) {
                            $("#" + index1).prop('checked', 'checked');
                        } else {
                            $("#" + index).removeAttr('checked');
                        }
                    });
                } else if (index === "Border_Colors_Arr") {
                    $.each(config[index], function (index1, value1) {
                        if (config[index][index1]) {
                            $(".Colors_Available-p#" + index1).prop('checked', 'checked');
                        } else {
                            $(".Colors_Available-p#" + index).removeAttr('checked');
                        }
                    });
                } else if (index === "Default_Border_Colors_Arr") {
                    $.each(config[index], function (index1, value1) {
                        if (config[index][index1]) {
                            $(".Default_Colors-p#" + index1).prop('checked', 'checked');
                        } else {
                            $(".Default_Colors-p#" + index).removeAttr('checked');
                        }
                    });
                } else if (index === "Area_Measures") {
                    $.each(config[index], function (index1, value1) {
                        if (config[index][index1]) {
                            $(".Area-p#" + index1).prop('checked', 'checked');
                        } else {
                            $(".Area-p#" + index).removeAttr('checked');
                        }
                    });
                } else if (index === "Volume_Measures") {
                    $.each(config[index], function (index1, value1) {
                        if (config[index][index1]) {
                            $(".Volume-p#" + index1).prop('checked', 'checked');
                        } else {
                            $(".Volume-p#" + index).removeAttr('checked');
                        }
                    });
                }
            } else {
                $("#mhe-area-volume-editor #" + index).removeAttr('checked');
            }
        });

        if (config.applicationHeight !== null && config.applicationHeight !== undefined) {
            $('#applicationHeightNumber').val(config.applicationHeight);
            config.applicationHeight = Number(config.applicationHeight);
        } else {
            $("#applicationHeightCHK").removeAttr("checked");
        }

        // For Quantity
        if (config.lockQuantity !== null && config.lockQuantity !== undefined) {
            $('#lockQuantityNumber').val(config.lockQuantity);
            config.lockQuantity = Number(config.lockQuantity);
        } else {
            $("#qLockFlag").removeAttr("checked");
        }

        checkUncheckValidator($(".Border_Colors-p"), $("#Border_Colors"), $("#Border_Colors_s_d"));
        checkUncheckValidator($(".Units-p"), $("#Units"), $("#Units_s_d"));
        checkUncheckValidator($(".Measures-p"), $("#Measures"), $("#Measures_s_d"));

        if ($("#qLockFlag").prop("checked")) {
            $('#lockQuantityNumber').removeAttr("disabled");
        }
        if (!$('#Border_Colors').prop("checked")) {
            $(".Border_Colors-p").attr("disabled", "disabled");
            $(".Border_Colors-p").prop("checked", false);
            $(".Default_Colors-p").attr("disabled", "disabled");
            $(".Default_Colors-p").prop("checked", false);
        }
        if (!$('#Units').prop("checked")) {
            $(".Units-p").attr("disabled", "disabled");
            $(".Units-p").prop("checked", false);
        }
        // console.log("$('#Measures')", $('#Measures').prop("checked"), config);
        if (!config.Measures) {
            $(".Measures-p").attr("disabled", "disabled");
            $(".Measures-p").prop("checked", false);
            $("#Measures").prop("checked", false);
        }
    }

    //to get config object
    function getConfigFile() {

      function onSuccess(configIn) {
        if (configIn.currentState !== undefined) {
          config = configIn;
        } else {
          setDefaultVal();
        }
        setupConfigEditorView();
        listenForConfigChanges();
      }

      function onError() {
        alert('Failed to get config file.');
      }
      if (mhe.initialParams && mhe.initialParams.configFile) {
        var configFileUrl = mhe.initialParams.configFile;
        mhe.getConfigFile(configFileUrl, onSuccess, onError);
      } else {
        setDefaultVal(); // change
        setupConfigEditorView();
        listenForConfigChanges();
      }
    }

    getConfigFile();
});

var configTabFlag = false;

function showHideConfig() {
  if (configTabFlag) {
    $('#tabsOpen').show();
    $('.tabsLayOut').show();
    $('#tabs').css('display', 'none');
    $('#closeButton').hide();
    configTabFlag = false;
  } else {
    $('#tabsOpen').hide();
    $('.tabsLayOut').hide();
    $('#closeButton').show();
    $('#tabs').css('display', 'block');

    configTabFlag = true;
  }
}

function toggleLayoutGrid() {
  $(".tabsLayOut").toggleClass("highlight");
  $(".layoutDisplayGrid").toggle();
}

// editor.js
