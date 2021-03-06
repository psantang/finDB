class Settings {
  constructor(id, user_name, ski_id, front_binding, length, depth, dft, wing_angle, leading_edge, binding_to_le, measure_binding, measure_length, measure_depth, measure_dft, date_time_created) {
    this.id = id;
    this.user_name = user_name;
    this.ski_id = ski_id;
    this.front_binding = front_binding;
    this.length = length;
    this.depth = depth;
    this.dft = dft;
    this.wing_angle = wing_angle;
    this.leading_edge = leading_edge;
    this.binding_to_le = binding_to_le;
    this.measure_binding = measure_binding;
    this.measure_length = measure_length;
    this.measure_depth = measure_depth;
    this.measure_dft = measure_dft;
    this.date_time_created = date_time_created;
  }

  currentSettings(json_Obj) {

  }

  updateSettings(json_Obj) {

  }

} // END class Ski


// GET SETTINGS OF THE CURRENTLY ACTIVE SKI
// INPUT: user_name, ski id number
// OUTPUT: Return code, ski settings, date settings saved, how measured
function getCurrentSettings(user_name, ski_id) {
				console.log('getCurrentSettings function');
        if (offline) return onOffline();

        var url=wsURL+'ws_get_current_settings_ret_json.php';

      	myApp.request({url:url,data:{ user_name:user_name, ski_id:ski_id },type:'POST',dataType: 'json'
				,success:function(json_Obj) {
						console.log('ajax success.');
						if (json_Obj.length>0) { // RETURNED RESULTS
          		if (json_Obj[0].RETURN_CODE==1) {
            		//alert('response :' + json_Obj);
								console.log('ski_id is ' + json_Obj[0].ski_id);
								console.log('id is ' + json_Obj[0].id);

                // TODO !IMPORTANT ABSTRACT THIS TO A FUNCTION
                const thisSetting = new Settings(json_Obj[0].id, json_Obj[0].user_name, json_Obj[0].ski_id, json_Obj[0].front_binding, json_Obj[0].length, json_Obj[0].depth, json_Obj[0].dft, json_Obj[0].wing_angle, json_Obj[0].leading_edge, json_Obj[0].binding_to_le, json_Obj[0].measure_binding, json_Obj[0].measure_length, json_Obj[0].measure_depth, json_Obj[0].measure_dft, json_Obj[0].date_time_created);
                window.thisSetting = thisSetting;

							} else {
                delete thisSetting;
                //$("#profileBtn").hide();
                console.log('return code is NOT 1');
              }
						}
      		}, complete: function(){
      				//alert('complete function called');
              console.log('ajax complete for getCurrentSettings.')
              //mainView.router.load( { url:'mySettings.html' });
              //mainView.router.navigate('mySettings.html'); // v2???
              //myApp.router.navigate('mySettings.html'); // V2
              //mainView.router.navigate('mySettings.html');
              //myApp.router.navigate('/mySettings/'); //V2
              myApp.views.main.router.navigate('/mySettings/'); //V2
              //myApp.closeModal('.login-screen', true);
              //modal.close();
              myApp.preloader.hide();
      	  }, // end COMPLETE
					timeout: 5000,
					error: function(json_Obj, status, err) {
						if (status == "timeout") {
								console.log("Timeout Error. " + json_Obj + status + err);
								//$( "#error_login").html("Timeout error.  Please retry.")
								//$(popDiv).html('TimeOut Error:   Please retry.');
						} else {
								// another error occured
								//$( "#error_login").html('Error occurred.  Please retry.');
								console.log("error in get settings:  " + json_Obj + status + err);
						}
          }, // end error
            beforeSend: function(){
							console.log('ajax beforeSend.')
              console.log('user_name='+user_name);
                //jQuery('.upd').remove();
                //jQuery('#submit_unassigned_results').html('');
                //jQuery('#unassigned_list').html('<span class="upd">Retrieving data...</span>');
							} // END before Send
        });

} // END  function
