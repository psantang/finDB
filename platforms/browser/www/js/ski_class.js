class Ski {
  constructor(id, user_name, my_ski_name, stock_ski_id, brand, model, length, year, stock_binding_location, stock_fin_length, stock_fin_depth, stock_fin_dft, stock_wing_angle, measure_binding, measure_length, measure_depth, measure_dft, ski_count) {
    this.id = id; // this is the ski_id for thisSetting.ski_id
    this.user_name = user_name;
    this.my_ski_name = my_ski_name;
    this.stock_ski_id = stock_ski_id;
    this.brand = brand;
    this.model = model;
    this.length = length;
    this.year = year;
    this.stock_binding_location = stock_binding_location;
    this.stock_fin_length = stock_fin_length;
    this.stock_fin_depth = stock_fin_depth;
    this.stock_fin_dft = stock_fin_dft;
    this.stock_wing_angle = stock_wing_angle;
    this.measure_binding = measure_binding;
    this.measure_length = measure_length;
    this.measure_depth = measure_depth;
    this.measure_dft = measure_dft;
    this.ski_count = ski_count;
  }

  currentSki(json_Obj) {

  }

} // END class Ski


// GET CURRENT SKI SKIER IS USING
function getCurrentSki(user_name) {
				console.log('getCurrentSki function');
        if (offline) return onOffline();

        var url=wsURL+'ws_get_cur_stock_ret_json.php';
        var returnCode;

      	myApp.request({url:url,data:{ user_name:user_name },type:'POST',dataType: 'json'
				,success:function(json_Obj) {
						console.log('ajax success.');
						if (json_Obj.length>0) { // RETURNED RESULTS
          		if (json_Obj[0].RETURN_CODE==1) {
            		returnCode=1;
								console.log('my_ski_name is ' + json_Obj[0].my_ski_name);
								console.log('id is ' + json_Obj[0].id);

                const thisSki = new Ski(json_Obj[0].id, json_Obj[0].user_name, json_Obj[0].my_ski_name,json_Obj[0].stock_ski_id,json_Obj[0].brand, json_Obj[0].model, json_Obj[0].length, json_Obj[0].year, json_Obj[0].stock_binding_location, json_Obj[0].stock_fin_length, json_Obj[0].stock_fin_depth, json_Obj[0].stock_fin_dft, json_Obj[0].stock_wing_angle,json_Obj[0].measure_binding,json_Obj[0].measure_length,json_Obj[0].measure_depth,json_Obj[0].measure_dft,json_Obj[0].ski_count);
                window.thisSki = thisSki;

							} else {
                returnCode=json_Obj[0].RETURN_CODE;
                delete thisSki;
                console.log('return code is NOT 1');
              }
						}
      		}, complete: function(){
              console.log('ajax complete for getCurrentSki.')
              if (typeof thisSki != "undefined") {
                if (thisSki.ski_count==0) {
                  $$("#skiCount").html("You are the only member currently riding the " + thisSki.brand + " " + thisSki.model);
                } else {
                  if (thisSki.ski_count==1) {
                    $$("#skiCount").html(thisSki.ski_count + " other member is currently riding the " + thisSki.brand + " " + thisSki.model);
                  } else {
                    $$("#skiCount").html(thisSki.ski_count + " other members are currently riding the " + thisSki.brand + " " + thisSki.model);
                  }
                }
              }

              if (typeof thisSki != "undefined" && thisSki.ski_count==0) {
                $$("#skiCount").html("You are the only member currently riding the " + thisSki.brand + " " + thisSki.model);
              }

              if (returnCode==1) {
                getCurrentSettings(thisSki.user_name, thisSki.id);
              } else { // PS need to figure out what to do here.
                //mainView.router.load( { url:'mySettings.html' , query:{ski:0} });
                myApp.router.navigate('/mySettings/?ski=0');
              //  myApp.closeModal('.login-screen', true);
                myApp.preloader.hide();
              }
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
								console.log("error: " + json_Obj + status + err);
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




      // SET/UPDATE CURRENT SKI FOR USER
      function setCurrentSki(user_name, ski_id) {
      				console.log('setCurrentSki function to change users current ski');
              if (offline) return onOffline();

              var url=wsURL+'ws_set_cur_ski_ret_json.php';
              var success;

            	myApp.request({url:url,data:{ user_name:user_name, ski_id:ski_id },type:'POST',dataType: 'json'
      				,success:function(json_Obj) {
      						console.log('ajax success.');
      						if (json_Obj.length>0) { // RETURNED RESULTS
                		if (json_Obj[0].RETURN_CODE==1) {
                  		//alert('response :' + json_Obj);
      								//console.log('my_ski_name is ' + json_Obj[0].my_ski_name);
      								//console.log('id is ' + json_Obj[0].id);
                      console.log("success update of current ski with user_name: "+user_name+ " and ski_id: " + ski_id);
                      success=true;
                      //const thisSki = new Ski(json_Obj[0].id, json_Obj[0].user_name, json_Obj[0].my_ski_name,json_Obj[0].brand, json_Obj[0].model, json_Obj[0].length, json_Obj[0].year, json_Obj[0].stock_binding_location, json_Obj[0].stock_fin_length, json_Obj[0].stock_fin_depth, json_Obj[0].stock_fin_dft, json_Obj[0].stock_wing_angle);
                      //window.thisSki = thisSki;

      							} else {
                      //delete thisSki;
                      //$("#profileBtn").hide();
                      console.log('CURRENT SKI DID NOT GET UPDATED!!!');
                      success=false;
                    }
      						}
            		}, complete: function(){
            				//alert('complete function called');
                    console.log('ajax complete for setCurrentSki.')
                    if (success) {
                      delete thisSki; // first delete the thisSki Object so it can be recraeated in getCurrentSki function
                      getCurrentSki(user_name);
                    } else {
                      console.log("alert user update failed");
                    }
                    window.loginPreLoader = myApp.preloader.hide();
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
      								console.log("error: " + json_Obj + status + err);
      						}
                }, // end error
                  beforeSend: function(){
      							console.log('ajax beforeSend.')
                    console.log('user_name='+user_name+ ' ski_id='+ski_id);
                    window.loginPreLoader = myApp.preloader.show('Changing ski...');
                      //jQuery('.upd').remove();
                      //jQuery('#submit_unassigned_results').html('');
                      //jQuery('#unassigned_list').html('<span class="upd">Retrieving data...</span>');
      							} // END before Send
              });

            } // END  function
