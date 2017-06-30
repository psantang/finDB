class User {
  constructor(id, user_name, user_email) {
    this.id = id;
    this.user_name = user_name;
    this.user_email = user_email;
  }

  get validation() {
    return this.validateUser();
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
    this.speed_units = json_Obj[0].speed_units;
    this.profileActivated = json_Obj[0].profileActivated;
  }

  validateUser() {
    if (this.user_name == 'psantang') {
      return true;
    } else {
      return false
    }
  }

} // END class User


// VALIDATE THE USER
//$$('.view #loginBtn').click(function() {
function loginUser() {
				console.log('submit login button clicked');
        $$(".page #loginError").html("");
        //createNewUser();
        //return;
//        var rememberMe=jQuery("#rememberMe").val();
        var user_name=$$('#user_name').val();
        var pwd=$$('#pwd').val();

        if (user_name=='' || pwd =='') {
          $$(".page #loginError").html("Please enter a User Name and Password.");
          return;
        }
				//var user_name='psantang';
				//var pwd='calgary1';

				//var url='classes/userClass.php';
        var url='http://finDB.paulsantangelo.com/ws/ws_login_ret_json.php';
        var returnCode;

      	$$.ajax({url:url,data:{ user_name: user_name , pwd: pwd },type:'POST',dataType: 'json'
				,success:function(json_Obj) {
						console.log('ajax success.');
						if (json_Obj.length>0) { // RETURNED RESULTS
          		if (json_Obj[0].RETURN_CODE == 1) {
            		returnCode=1;

								console.log('user_name is ' + json_Obj[0].user_name);
								console.log('id is ' + json_Obj[0].id);
								console.log('json_Obj length is ' + json_Obj.length)

                const thisUser = new User(json_Obj[0].id, json_Obj[0].user_name, json_Obj[0].user_email);
                window.thisUser = thisUser;
                console.log(thisUser);
                console.log(thisUser.validation);
                getProfile(thisUser.user_name);
							}
              else if (json_Obj[0].RETURN_CODE == -1) {
                returnCode=-1;
                console.log('sql success, but no user found');
                delete thisUser;
                //$$(".page #loginError").html("Invalid Login.  Please try again.");
              } else {
                returnCode=json_Obj[0].RETURN_CODE;
                delete thisUser;

              }
						}
      		}, complete: function(){
              console.log('ajax complete.')
              if (returnCode==1) {
                localStorage.setItem("user_name", user_name);
                localStorage.setItem("pwd", pwd);
              } else if (returnCode==-1) {
                $$(".page #loginError").html("Invalid Login.  Please try again.");
                window.loginPreLoader = myApp.hidePreloader();
              } else {
                $$(".page #loginError").html("Database error.  Please try again or contact paul@paulsantangel.com .");
                console.log('invalid credentials...thisUser deleted');
                window.loginPreLoader = myApp.hidePreloader();
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
              console.log('user_name='+user_name+ ' pwd='+pwd);
              $$("#loginError").html('');
              //var window.loginPreLoader;
              window.loginPreLoader = myApp.showPreloader('Validating User...');
                //jQuery('.upd').remove();
                //jQuery('#submit_unassigned_results').html('');
                //jQuery('#unassigned_list').html('<span class="upd">Retrieving data...</span>');
							} // END before Send
        });
//      }); // END CHANGE function
}



// LOAD USERS PROFILE INTO USER object
function getProfile (user_name) {
				console.log('getProfile triggered');

        var url='http://finDB.paulsantangelo.com/ws/ws_get_user_profile_ret_json.php';
        var returnCode;

      	$$.ajax({url:url,data:{ user_name: user_name },type:'POST',dataType: 'json'
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
                getCurrentSki(user_name); // THIS IS IN THE skiClass.php file
              } else if (returnCode=-1) { // need to figure this out
                mainView.router.load( { url:'profile.html' , query:-1 });
                myApp.closeModal('.login-screen', true);
                $$("#editProfileBtn").click();
                myApp.hidePreloader();
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
