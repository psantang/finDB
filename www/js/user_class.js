class User {
  constructor(id, user_name, user_email, last_login, user_vers) {
    this.id = id;
    this.user_name = user_name;
    this.user_email = user_email;
    this.last_login = last_login;
    this.user_vers = user_vers;
  }

  validProfile(userObj) {
    var reqArray = ["measure_binding", "measure_length", "measure_depth", "measure_dft", "measure_water_temp"];
    var missing =[];
    reqArray.forEach(function(property) {
      console.log(property);
      if (!userObj[property]) {
        console.log('userObj.property is ' + userObj[property]);
        console.log(" ---- Missing: " + property);
        missing.push(property);
       }
    });
    console.log("missing.length is " + missing.length);
    if (missing.length>0) {
      return false;
    } else {
      return true;
    }
  }

  profile(json_Obj) {
    this.first_name = json_Obj[0].first_name;
    this.last_name = json_Obj[0].last_name;
    this.dob_year = json_Obj[0].dob_year;
    this.capability_level = json_Obj[0].capability_level;
    this.weight = json_Obj[0].weight;
    this.height = json_Obj[0].height;
    this.ski_speed = json_Obj[0].ski_speed;
    this.ski_country = json_Obj[0].ski_country;
    this.ski_city = json_Obj[0].ski_city;
    this.ski_state = json_Obj[0].ski_state;
    this.measure_binding = json_Obj[0].measure_binding;
    this.measure_length = json_Obj[0].measure_length;
    this.measure_depth = json_Obj[0].measure_depth;
    this.measure_dft = json_Obj[0].measure_dft;
    this.measure_water_temp = json_Obj[0].measure_water_temp;
    this.speed_units = json_Obj[0].speed_units;
    this.profileActivated = json_Obj[0].profileActivated;
  }

  validateUser() {

  }

} // END class User


// VALIDATE THE USER
function loginUser() {
		console.log('submit login button clicked');
        if (offline) return onOffline();

        var user_name=$$('.page #user_name').val();
        var pwd=$$('.page #pwd').val();
        var loginTime=getLocalDateTimeString(null,"ISO");

        $$(".page #loginError").html("");
        if (user_name=='' || pwd =='') {
          $$(".page #loginError").html("Please enter a User Name and Password.");
          return;
        }

        var url=wsURL+'ws_login_ret_json.php';
        //var url='http://finDB.paulsantangelo.com/ws/ws_login_ret_json.php';
        console.log("url is " + url);
        var returnCode;

      	//$$.ajax({url:url,data:{
        myApp.request({url:url,data:{ user_name:user_name,pwd:pwd,api_vers:api_vers,device_manufacturer:deviceManufacturer,device_platform:devicePlatform,device_model:deviceModel,device_version:deviceVersion,last_login:loginTime }, type:'POST',dataType: 'json'
				,success:function(json_Obj) {
						console.log('ajax success function for loginUser.');
						if (json_Obj.length>0) { // RETURNED RESULTS
              console.log('return code is ' + json_Obj[0].RETURN_CODE);

          		if (json_Obj[0].RETURN_CODE == 1) {
            		returnCode=1;

								console.log('user_name is ' + json_Obj[0].user_name);
								console.log('id is ' + json_Obj[0].id);
								console.log('json_Obj length is ' + json_Obj.length);

                const thisUser = new User(json_Obj[0].id,json_Obj[0].user_name,json_Obj[0].user_email,json_Obj[0].last_login,json_Obj[0].user_vers);
                window.thisUser = thisUser;
                console.log(thisUser);
                console.log(thisUser.validation);

							}
              else if (json_Obj[0].RETURN_CODE == -1 || json_Obj[0].RETURN_CODE == -2) {
                returnCode=-1;
                console.log('sql success, but no user found');
                delete thisUser;
                //$$(".page #loginError").html("Invalid Login.  Please try again.");
              } else {
                returnCode=json_Obj[0].RETURN_CODE;
                delete thisUser;
              }
						} else { // NO JSON OBJECT RETURNED
              console.log('NO return code ');
            }
      		}, complete: function() {
              console.log('ajax complete....with loginEventStr = '+loginEventStr);
              console.log('ajax complete.');

              if (returnCode==1) {
                localStorage.setItem("user_name", user_name);
                localStorage.setItem("pwd", pwd);
                $$("#userNameInPanel").html(thisUser.user_name);
                $$("#userLastLogin").html( getLocalDateTimeString(thisUser.last_login,"pretty"));
                getProfile(thisUser.user_name);
              } else if (returnCode==-1 || returnCode==-2) {
                $$(".page #loginError").html("Invalid Login.  Please try again.");
                //myApp.hidePreloader();
                myApp.preloader.hide();
              } else {
                $$(".page #loginError").html("Database error.  Please try again or contact paul@paulsantangelo.com .");
                console.log('invalid credentials...thisUser deleted');
                //myApp.hidePreloader();
                myApp.preloader.hide();
              }

      	  }, // end COMPLETE
					timeout: 5000,
					error: function(json_Obj, status, err) {
						if (status == "timeout") {
								console.log("Timeout Error. " + json_Obj + status + err);
						} else {
							console.log("non-timeout error: " + json_Obj + status + err);
						}
          }, // end error
            beforeSend: function() {
              console.log('user_name='+user_name+ ' pwd='+pwd);
              $$(".page #loginError").html('');

              //myApp.showPreloader('Validating User...');
              myApp.preloader.show('Validating User...');
						} // END before Send
        }); // END AJAX REQUEST
} // end loginUser function



// LOAD USERS PROFILE INTO USER object
function getProfile (user_name) {
				console.log('getProfile triggered');
        if (offline) return onOffline();

        var url=wsURL+'ws_get_user_profile_ret_json.php';
        var returnCode;

      	//$$.ajax({url:url,data:{ user_name: user_name },type:'POST',dataType: 'json'
				myApp.request({url:url,data:{ user_name: user_name },type:'POST',dataType: 'json'
        ,success:function(json_Obj) {
						console.log('ajax success.');
						if (json_Obj.length>0) { // RETURNED RESULTS
          		if (json_Obj[0].RETURN_CODE==1) {
            		returnCode=1;
                console.log('thisUser is ' + thisUser);
                //thisUser.profile = json_Obj;
                thisUser.profile(json_Obj); // set thisUser with profile properties
                //const thisUser = new User(user_name, pwd);
                //console.log(thisUser.validation);
                //$("#profileBtn").show();
							} else {
                returnCode=json_Obj[0].RETURN_CODE;
                thisUser.profileActivated=0;
                console.log('user not returned from profile');
              }
						}
      		}, complete: function(){
      				console.log('ajax complete for getProfile call...now get current ski.');
              if (returnCode==1) {
                if (thisUser.validProfile(thisUser)) {
                  getCurrentSki(user_name,null); // THIS IS IN THE skiClass.php file
                } else {
                  myApp.closeModal('.login-screen', true);
                  firstTimeEntry(); // FOR FIRST TIME ENTRY AND WHEN PROFILE IS NOT COMPLETE/REQURIED ITEMS ADDED
                  //myApp.hidePreloader();
                  myApp.preloader.hide();
                }

              } else if (returnCode=-1) { // FIRST TIME USER FORCE partial profile completion


                /* first solution was to push to profile page below
                mainView.router.load( { url:'profile.html' , query:-1 });
                myApp.closeModal('.login-screen', true);
                $$("#editProfileBtn").click();
                // first solution to push to profile page above */

                // second solution , use modals to just get essential information of how they measure
                //myApp.closeModal('.login-screen', true);
                firstTimeEntry();


                //myApp.hidePreloader();
                myApp.preloader.hide();
              } else {

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
              //myApp.showPreloader('Retrieving Profile...');
                //jQuery('.upd').remove();
                //jQuery('#submit_unassigned_results').html('');
                //jQuery('#unassigned_list').html('<span class="upd">Retrieving data...</span>');
							} // END before Send
        });

} // END getProfile function
