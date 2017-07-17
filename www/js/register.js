

function registerUser() {
    console.log('running registerUser function');
    if (offline) return onOffline();

    var user_name=$$(".page #user_name_reg").val();
    var user_email=$$(".page #user_email").val();
    var user_pwd=$$(".page #user_pwd").val();
    var user_pwd_confirm=$$(".page #user_pwd_confirm").val();
    var t_and_c=0;
    if ( $$('.page .label-switch input[type=checkbox]').prop('checked') ) {
      console.log('checked');
      t_and_c=1;
    } else {
      console.log('NOT checked');
      t_and_c=0;
    }

    var url=wsURL+'ws_add_register_user_ret_json.php';
    var returnCode;
    $$.ajax({url:url,data:{ user_name:user_name,user_email:user_email,user_pwd:user_pwd,user_pwd_confirm:user_pwd_confirm,t_and_c:t_and_c},type:'POST',dataType: 'json',success:function(jsonObj) {

      returnCode=jsonObj[0].RETURN_CODE;
      //if (jsonObj[0].RETURN_CODE==1) {
      switch (returnCode) {

        case 1:
        console.log('return code 1...success')
        localStorage.setItem('activation_code', true);
        localStorage.setItem('pending_user_name', user_name);
        showActivationPrompt(user_name);
        break;

        case -1: //not well formed email address
          myApp.alert(
            'The email address is not a valid format.',
            'Email Address',
            function () {
              return null;
            }
          );
        break;

        case -2: //username not long enough
          myApp.alert(
            'The user name must be at least 4 characters in length.',
            'User Name',
            function () {
              return null;
            }
          );
        break;

        case -3: // password mismatch
          myApp.alert(
            'The passwords you provided do not match and/or they must be at least 6 characters in length.',
            'Password Mismatch',
            function () {
              return null;
            }
          );
        break;
      //} else if (jsonObj[0].RETURN_CODE==1062) { // user already in system
      case 1062:
        myApp.alert(
          'This user name or email is already registered.  Please try another user name and/or email address OR login with this user name.',
          'Already Registered',
          function () {
            return null;
          }
        );
        break;
      //  } else {
      default:
          console.log('return code NOT 1 or 1062...no luck')
          myApp.alert(
            'Please be sure all fields above are populated.  If so, and you are not successful registering, please contact the administrator at paul@paulsantangelo.com',
            'Unsuccessful Registration',
            function () {
              return null;
            }
          );
          break;
        }
    }, timeout: 5000
      , beforeSend: function() {
        console.log('beforeSend registerUser');

        myApp.showIndicator();

      }, complete: function() {

          console.log('in complete registerUser');
          myApp.hideIndicator();
          // NOW REFRESH INTERFACE, but mySki list and mySettings page.


      }, error: function(jsonObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + jsonObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }) // END ajax function for models
  }






function showActivationPrompt(user_name) {
  var pendingActivation=localStorage.getItem('activation_code');
  var pendingUserName=localStorage.getItem('pending_user_name');

  if (pendingActivation) {
    myApp.prompt('An email has been sent with an activation code. Please enter the activation code below.', 'Activation Code', function (value) {
        validateActivationCode(pendingUserName,value);
    });
  }
}


function validateActivationCode(pendingUserName,activation_code) {
    console.log('running validateActivationCode function');
    if (offline) return onOffline();

    var url=wsURL+'ws_get_activation_code_ret_json.php';
    var passed;
    $$.ajax({url:url,data:{ user_name:pendingUserName,activation_code:activation_code},type:'POST',dataType: 'json',success:function(jsonObj) {
      if (jsonObj[0].RETURN_CODE==1) {
        console.log('return code 1...success for activation!')
        localStorage.removeItem('activation_code');
        localStorage.removeItem('pending_user_name');
        passed=true;
      } else {
        console.log('return code NOT 1...no luck activating account')
        passed=false;
      }
    }, timeout: 5000
      , beforeSend: function() {
        console.log('beforeSend validateActivationCode');

        myApp.showIndicator();

      }, complete: function(jsonObj) {

          console.log('in complete validateActivationCode');
          myApp.hideIndicator();
          if (passed) {
            passedValidation();
          } else {
            activationFailedConfirmation(pendingUserName,activation_code);
          }
          // NOW REFRESH INTERFACE, but mySki list and mySettings page.


      }, error: function(jsonObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + jsonObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }) // END ajax function for models
  }



function activationFailedConfirmation (pendingUserName,activation_code) {
  console.log('in activationFailedConfirmation function with user_name:'+ pendingUserName + ' and activation_code:' + activation_code);
  myApp.confirm("The activation code " + activation_code + " is not valid.  Press OK to try again or Cancel.",
  "Incorrect Activation Code",
  function () {
        console.log('in confirm OK');
        showActivationPrompt(pendingUserName);
      },
  function () {
        myApp.alert(
          'You can try to activate the account at a later time from the start page.',
          'Cancel Activation',
          function () {
            mainView.router.load( { url:'index.html' });
          }
        );
    }
  );
}

function passedValidation () {
  myApp.alert(
    'Your account is activated.  Please login with your user_name and password.',
    'Congratulations!',
    function () {
      mainView.router.load( { url:'index.html' });
    }
  );
}




function viewTerms() {
  				console.log('viewTerms function');

          var url=wsURL+'ws_get_terms_conditions_ret_text.php';

        	$$.ajax({url:url,data:{  },type:'POST',dataType: 'text'
  				,success:function(htmlString) {
  						console.log('ajax success.');
  						if (htmlString.length>0) { // RETURNED RESULTS

                  console.log('json_Obj is ' + htmlString);

                  var popupHTML = '<div class="popup popup-terms">';
                      popupHTML+='<div class="closePopup"><a href="#" class="close-popup"><i class="icon f7-icons">close_round</i></a></div>';
                      popupHTML+='<div class="content-block">';
                      popupHTML+='<div class="content-block-title">Terms and Conditions</div>';
                      popupHTML+= htmlString;
                      popupHTML+='<div><a href="#" class="close-popup">Close</a></div>';
                      popupHTML+='</div>'; // END CONTENT block

                      popupHTML+='</div>'; // end class popup
                      myApp.popup(popupHTML);

  							} else {
                  console.log('no text string returned');
                }

        		}, complete: function(){
                console.log('ajax complete for viewTerms.')

        	  }, // end COMPLETE
  					timeout: 5000,
  					error: function(htmlString, status, err) {
  						if (status == "timeout") {
  								console.log("Timeout Error. " + htmlString + status + err);
  								//$( "#error_login").html("Timeout error.  Please retry.")
  								//$(popDiv).html('TimeOut Error:   Please retry.');
  						} else {
  								// another error occured
  								//$( "#error_login").html('Error occurred.  Please retry.');
  								console.log("error: " + htmlString + status + err);
  						}
            }, // end error
              beforeSend: function(){
  							console.log('ajax beforeSend.')
  							} // END before Send
          });
} // END FUNCTION
