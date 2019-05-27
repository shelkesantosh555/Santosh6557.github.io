var app  = app  ||  {};
app =  {
	current_item:"",
	is_iPad:navigator.userAgent.match(/iPad/i) != null,
    set_tabindex:function() {
        var tabindex = 0;
        $(".tabindex").each(function() {
            $(this).attr("tabindex",tabindex);
            // tabindex++;
        });
        $(".courseTittle").removeClass('tabindex').removeAttr('tabindex');
    }, 
    set_clickbutton_effect:function() {
        $(data_object.is_clickable.classes).on("mouseover mousedown mouseup mouseout",function(e) {
            //console.log(e.type);
            if(e.type == "mouseover"  || e.type == "mouseup") {
                $(this).removeClass("btn_msdown_color");
                $(this).addClass("btn_hover_color");
            } else if(e.type == "mousedown") {
                $(this).removeClass("btn_hover_color");
                $(this).addClass("btn_msdown_color");
            }
            if(e.type == "mouseout") {
                $(this).removeClass("btn_hover_color");
                $(this).removeClass("btn_msdown_color");
            }
        });
    },
	click_to_show:function() {
		var i=1;
		//assign ids to clickable item.
		$(data_object.is_clickable.classes).each(function(){
			if(data_object.is_clickable.is_toggle=="yes"){
				$(this).attr("data-toggle",1);
			}else{
				$(this).attr("data-toggle","");
			}
			$(this).attr("id","clickable-"+i);
			i++;
		});
		data_object.is_clickable.is_toggle
        $(data_object.is_clickable.classes).on("keydown click",function(e) {
			console.log(e.type);
            if(e.type == "click"  || e.keyCode == 32  || e.keyCode == 13) {
				if(data_object.is_clickable.is_toggle=="yes"){
					//if toogle yes
					if($(this).attr("data-toggle") % 2!=0){
						if($(this).data('target')!=""){
							$($(this).data('target')).show();
							app.current_item=$(this).attr("id");
							app.play_animation();
						}
						$(this).attr("data-toggle",parseInt($(this).attr("data-toggle"))+1)
					}else{
						if($(this).data('target')!=""){
							$($(this).data('target')).hide();
							app.current_item=$(this).attr("id");
							//app.play_animation();
						}
						$(this).attr("data-toggle",parseInt($(this).attr("data-toggle"))-1)
					}
				}else{
					$(".obj_hidden").hide();
					if($(this).data('target')!=""){
						$($(this).data('target')).show();
						app.current_item=$(this).attr("id");
						app.play_animation();
					}
				}
            }
        });
    },
	play_animation:function(){	
		animation_play();
	},
	focus_to_show:function()
	{
		$(data_object.is_hover.classes).on("focus",function () {
			if(data_object.is_hover.fill_color=="yes"){
				$(this).find("span").hide();
				updateLiveText($(this).find('p').attr('aria-label'));
				return;
			}
			if(data_object.is_hover.is_toggle=="yes"){
				$(".obj_hidden").hide();
			}
			if($(this).data('target')!=""){
				$($(this).data('target')).show();
				app.current_item=$(this).attr("id");
				app.play_animation();
			}
			updateLiveText($(this).find('p').attr('aria-label'));

		});
		$(data_object.is_hover.classes).on("blur",function () {
				if(data_object.is_hover.fill_color=="yes"){
					$(this).find("span").hide();
					return;
				}
				if(data_object.is_hover.is_toggle=="yes"){
					$(".obj_hidden").hide();
				}
			});
		updateLiveText($(this).find('p').attr('aria-label'));
	},
	hover_to_show:function(){
		var i=1;
		//assign ids to clickable item.
		console.log("ok")
		$(data_object.is_hover.classes).each(function(){
			$(this).attr("id","hoverable-"+i);
			i++;
		});
		if(app.is_iPad==true){
			$(data_object.is_hover.classes).toggle(function (){
				if(data_object.is_hover.fill_color=="yes"){
					$(this).find("span").hide();
					updateLiveText($(this).find('p').attr('aria-label'));
					return;
				}
				if(data_object.is_hover.is_toggle=="no"){
					$(".obj_hidden").show();
				}
				if($(this).data('target')!=""){
					$($(this).data('target')).hide();
					app.current_item=$(this).attr("id");
					app.play_animation();
				}

			}, function () {
				if(data_object.is_hover.fill_color=="yes"){
					$(this).find("span").hide();
					updateLiveText($(this).find('p').attr('aria-label'));
					return;
				}
				if(data_object.is_hover.is_toggle=="yes"){
					$(".obj_hidden").hide();
				}
				updateLiveText($(this).find('p').attr('aria-label'));
			});
		}else{
			$(data_object.is_hover.classes).hover(function () {
				if(data_object.is_hover.fill_color=="yes"){
					$(this).find("span").hide();
					updateLiveText($(this).find('p').attr('aria-label'));
					return;
				}
				if(data_object.is_hover.is_toggle=="yes"){
					$(".obj_hidden").hide();
				}
				if($(this).data('target')!=""){
					$($(this).data('target')).show();
					app.current_item=$(this).attr("id");
					app.play_animation();
				}
			}, function () {
				if(data_object.is_hover.fill_color=="yes"){
					$(this).find("span").hide();
					return;
				}
				if(data_object.is_hover.is_toggle=="yes"){
					$(".obj_hidden").hide();
				}
			});
		}
		updateLiveText($(this).find('p').attr('aria-label'));
	}
}
$(document).ready(function() {
	
    app.click_to_show();
	if(data_object.set_tabindex == "yes"){
		app.set_tabindex();
	}
    if(data_object.is_clickable.flag == "yes") {
        if(data_object.is_clickable.set_clickbutton_effect == "yes") {
            app.set_clickbutton_effect();
        }
    }
	if(data_object.is_hover.flag == "yes"){
		app.hover_to_show();
		app.focus_to_show();
	}
	$("#reset_btn").click(function(){
		window.location.reload();
	})

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
	
});