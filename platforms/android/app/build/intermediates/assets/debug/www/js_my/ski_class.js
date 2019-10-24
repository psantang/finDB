class Ski {
  constructor(ski_id, user_name, my_ski_name, stock_ski_id, brand, model, ski_length, year, stockArray, /*stock_binding_location, stock_fin_length, stock_fin_depth, stock_fin_dft, stock_wing_angle,*/ measure_binding, measure_length, measure_depth, measure_dft, ski_count) {
    this.id = ski_id; // this is the ski_id for thisSetting.ski_id
    this.user_name = user_name;
    this.my_ski_name = my_ski_name;
    this.stock_ski_id = stock_ski_id;
    this.brand = brand;
    this.model = model;
    this.length = ski_length;
    this.year = year;
    this.stockArray = stockArray;
    /*this.stock_binding_location = stock_binding_location;
    this.stock_fin_length = stock_fin_length;
    this.stock_fin_depth = stock_fin_depth;
    this.stock_fin_dft = stock_fin_dft;
    this.stock_wing_angle = stock_wing_angle;*/
    this.measure_binding = measure_binding;
    this.measure_length = measure_length;
    this.measure_depth = measure_depth;
    this.measure_dft = measure_dft;
    this.ski_count = ski_count;
  }
} // END class Ski




function getCurrentSki(user_name, ski_id) {
				console.log('getCurrentSki function');
        if (offline) return onOffline();

        var url=wsURL+'ws_get_stock_and_cur_settings_ret_json.php';
        var returnCode;

      	myApp.request({url:url,data:{ user_name:user_name, ski_id:ski_id },type:'POST',dataType: 'json'
				,success:function(json_Obj) {
						console.log('ajax success.');
            window.json_Obj=json_Obj;
            if (json_Obj.status=='success') { // RETURNED RESULTS
						//if (json_Obj.length>0) { // RETURNED RESULTS
          		if (json_Obj.RETURN_CODE==1) {
            		returnCode=1;
								console.log('my_ski_name is ' + json_Obj.data[0].my_ski_name);
								console.log('ski_id is ' + json_Obj.data[0].ski_id);


                //var stockArray={"status":"success","RETURN_CODE":1,"data":[{"setting_name":"Long & Shallow","stock_binding_location":"30.125","stock_fin_length":"6.975","stock_fin_depth":"2.450","stock_fin_dft":"0.765","stock_wing_angle":"9.0"},{"setting_name":"Deep & Short","stock_binding_location":"30.000","stock_fin_length":"6.840","stock_fin_depth":"2.510","stock_fin_dft":"0.775","stock_wing_angle":"9.0"}]}

                // CREATE THE SKI OBJECT
                const thisSki = new Ski(json_Obj.data[0].ski_id, json_Obj.data[0].user_name, json_Obj.data[0].my_ski_name,json_Obj.data[0].stock_ski_id,json_Obj.data[0].brand, json_Obj.data[0].model, json_Obj.data[0].ski_length, json_Obj.data[0].year, json_Obj.stock_info,/* json_Obj.data[0].stock_binding_location, json_Obj.data[0].stock_fin_length, json_Obj.data[0].stock_fin_depth, json_Obj.data[0].stock_fin_dft, json_Obj.data[0].stock_wing_angle,*/ json_Obj.data[0].how_to_measure_binding, json_Obj.data[0].how_to_measure_length, json_Obj.data[0].how_to_measure_depth, json_Obj.data[0].how_to_measure_dft, json_Obj.data[0].ski_count);
                window.thisSki = thisSki;

                //getCurrentSettings(thisSki.user_name, thisSki.id);
                // CREATE THE SETTINGS OBJECT IF ANY SETTINGS ARE CURRENTLY SAVED
                if (json_Obj.data[0].setting_id) {
                  const thisSetting = new Settings(json_Obj.data[0].setting_id, json_Obj.data[0].user_name, json_Obj.data[0].ski_id, json_Obj.data[0].front_binding, json_Obj.data[0].length, json_Obj.data[0].depth, json_Obj.data[0].dft, json_Obj.data[0].wing_angle, json_Obj.data[0].leading_edge, json_Obj.data[0].binding_to_le, json_Obj.data[0].measure_binding, json_Obj.data[0].measure_length, json_Obj.data[0].measure_depth, json_Obj.data[0].measure_dft, json_Obj.data[0].date_time_created);
                  window.thisSetting = thisSetting;
                } else {
                  delete thisSetting;
                }

							} else {
                returnCode=json_Obj.RETURN_CODE;
                delete thisSki;
                console.log('return code is NOT 1');
              }
						}
      		}, complete: function(){
              console.log('ajax complete for getCurrentSki.')
              if (typeof thisSki != "undefined") {
                myApp.emit('skiUsageCount', thisSki);
              }
              if (returnCode!=1) {
                myApp.router.navigate('/mySettings/?ski=0');
                myApp.preloader.hide();
              } else {
                myApp.views.main.router.navigate('/mySettings/'); //V2
                myApp.preloader.hide();
              }
      	  }, // end COMPLETE
					timeout: 5000,
					error: function(json_Obj, status, err) {
						if (status == "timeout") {
								console.log("Timeout Error. " + json_Obj + status + err);
						} else {
								console.log("error: " + json_Obj + status + err);
						}
          }, // end error
            beforeSend: function(){
							console.log('ajax beforeSend.')
							} // END before Send
        });
      } // END  function

// GET CURRENT SKI SKIER IS USING
// INPUT: user_name
// OUTPUT: return code, ski specs, stock setting data, how measured, custom ski name, number of skiers on ski
/*
function getCurrentSki_OLD(user_name) {
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
								console.log('ski_id is ' + json_Obj[0].ski_id);


                const thisSki = new Ski(json_Obj[0].ski_id, json_Obj[0].user_name, json_Obj[0].my_ski_name,json_Obj[0].stock_ski_id,json_Obj[0].brand, json_Obj[0].model, json_Obj[0].length, json_Obj[0].year, json_Obj[0].stock_binding_location, json_Obj[0].stock_fin_length, json_Obj[0].stock_fin_depth, json_Obj[0].stock_fin_dft, json_Obj[0].stock_wing_angle,json_Obj[0].how_to_measure_binding,json_Obj[0].how_to_measure_length,json_Obj[0].how_to_measure_depth,json_Obj[0].how_to_measure_dft,json_Obj[0].ski_count);
                window.thisSki = thisSki;

                getCurrentSettings(thisSki.user_name, thisSki.id);

							} else {
                returnCode=json_Obj[0].RETURN_CODE;
                delete thisSki;
                console.log('return code is NOT 1');
              }
						}
      		}, complete: function(){
              console.log('ajax complete for getCurrentSki.')
              if (typeof thisSki != "undefined") {
                myApp.emit('skiUsageCount', thisSki.ski_count);
              }
              if (returnCode!=1) {
                myApp.router.navigate('/mySettings/?ski=0');
                myApp.preloader.hide();
              }
      	  }, // end COMPLETE
					timeout: 5000,
					error: function(json_Obj, status, err) {
						if (status == "timeout") {
								console.log("Timeout Error. " + json_Obj + status + err);
						} else {
								console.log("error: " + json_Obj + status + err);
						}
          }, // end error
            beforeSend: function(){
							console.log('ajax beforeSend.')
							} // END before Send
        });
      } // END  function
*/

function setCurrentSki(user_name, ski_id) {
  console.log('setCurrentSki function with ski_id='+ski_id);
  getCurrentSki(user_name, ski_id);
}

      // SET/UPDATE CURRENT SKI FOR USER
      // INPUT: user_name , ski_id: ski id number
      // OUTPUT: return code only
      function setCurrentSki_OLD(user_name, ski_id) {
      				console.log('setCurrentSki function to change users current ski');
              if (offline) return onOffline();

              var url=wsURL+'ws_set_cur_ski_ret_json.php';
              var success;

            	myApp.request({url:url,data:{ user_name:user_name, ski_id:ski_id },type:'POST',dataType: 'json'
      				,success:function(json_Obj) {
      						console.log('ajax success.');
      						if (json_Obj.length>0) { // RETURNED RESULTS
                		if (json_Obj[0].RETURN_CODE==1) {
                      //if (success) {
                        delete thisSki; // first delete the thisSki Object so it can be recraeated in getCurrentSki function
                        getCurrentSki(user_name);

                      console.log("success update of current ski with user_name: "+user_name+ " and ski_id: " + ski_id);
                      success=true;
      							} else {
                      console.log('CURRENT SKI DID NOT GET UPDATED!!!');
                      success=false;
                    }
      						}
            		}, complete: function(){
                    console.log('ajax complete for setCurrentSki.')
                    window.loginPreLoader = myApp.preloader.hide();
            	  }, // end COMPLETE
      					timeout: 5000,
      					error: function(json_Obj, status, err) {
      						if (status == "timeout") {
      								console.log("Timeout Error. " + json_Obj + status + err);
      						} else {
      								console.log("error: " + json_Obj + status + err);
      						}
                }, // end error
                  beforeSend: function(){
      							console.log('ajax beforeSend.')
                    console.log('user_name='+user_name+ ' ski_id='+ski_id);
                    window.loginPreLoader = myApp.preloader.show('Changing ski...');
      							} // END before Send
              });
            } // END  function
