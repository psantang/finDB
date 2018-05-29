function validateFields(user_name,user_email,user_pwd,user_pwd_confirm,t_and_c) {
  var errMsg="";
  if (user_name.length<4) {
    console.log('invalid user_name');
    errMsg+="<li>User Name must be atleast 4 characters.</li>";
  }
  if (!validEmail(user_email)) {
    console.log('invalid user_email');
    errMsg+="<li>Email address is not valid.</li>";
  }
  if (user_pwd.length<6) {
    console.log('invalid pwd='+user_pwd);
    errMsg+="<li>Password must be atleast 6 characters.</li>";
  } else if (user_pwd != user_pwd_confirm) {
    errMsg+="<li>Password does not match Confirm Password.</li>";
  }
  if (t_and_c != 1) {
    console.log('invalid t_and_c');
    errMsg+="<li>Terms and Conditions must be checked.</li>";
  }
  return errMsg;
}

function validEmail(user_email) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)) {
    return true;
  } else {
    return false;
  }
}

function registerUser() {
    console.log('running registerUser function');
    if (offline) return onOffline();

    var user_name=$$(".page #user_name_reg").val().trim();
    var user_email=$$(".page #user_email").val().trim();
    var user_pwd=$$(".page #user_pwd").val().trim();
    var user_pwd_confirm=$$(".page #user_pwd_confirm").val().trim();
    var t_and_c=$$('.page #t_and_c').val();

    var validationMsg=validateFields(user_name,user_email,user_pwd,user_pwd_confirm,t_and_c);
    if ( validationMsg!="") {
      validationMsg="<ul class='alignLeft'>"+validationMsg+"</ul>";
      console.log('Fields not validated');
      myApp.dialog.alert(
        validationMsg,
        'Field Validation Failed',
        function () {
          return null;
        }
      );
      return false;
    } else {

      myApp.dialog.confirm(
        user_email,
        'Confirm Email Address',
        function () {
          submitNewUser(user_name,user_email,user_pwd,user_pwd_confirm,t_and_c);
          return null;
        },
        function () {
          return false;
        }
      );
    }
}

function submitNewUser(user_name,user_email,user_pwd,user_pwd_confirm,t_and_c) {
      var url=wsURL+'ws_add_register_user_ret_json.php';
      var returnCode;
      myApp.request({url:url,data:{ user_name:user_name,user_email:user_email,user_pwd:user_pwd,user_pwd_confirm:user_pwd_confirm,t_and_c:t_and_c},type:'POST',dataType: 'json',success:function(jsonObj) {

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
            myApp.dialog.alert(
              'The email address is not a valid format.',
              'Email Address',
              function () {
                return null;
              }
            );
          break;

          case -2: //username not long enough
            myApp.dialog.alert(
              'The user name must be at least 4 characters in length.',
              'User Name',
              function () {
                return null;
              }
            );
          break;

          case -3: // password mismatch
            myApp.dialog.alert(
              'The passwords you provided do not match and/or they must be at least 6 characters in length.',
              'Password Mismatch',
              function () {
                return null;
              }
            );
          break;
        //} else if (jsonObj[0].RETURN_CODE==1062) { // user already in system

        case -4: // T&C not selected
          myApp.dialog.alert(
            'You much check the box to approve the terms and conditions.',
            'T&Cs Not Checked',
            function () {
              return null;
            }
          );
        break;

        case 1062:
          myApp.dialog.alert(
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
            myApp.dialog.alert(
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

          myApp.preloader.show();

        }, complete: function() {

            console.log('in complete registerUser');
            myApp.preloader.hide();
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
    myApp.dialog.prompt('An email has been sent with an activation code. Please enter the activation code below.', 'Activation Code', function (value) {
        validateActivationCode(pendingUserName,value);
    });
  }
}


function validateActivationCode(pendingUserName,activation_code) {
    console.log('running validateActivationCode function');
    if (offline) return onOffline();

    var url=wsURL+'ws_get_activation_code_ret_json.php';
    var passed;
    myApp.request({url:url,data:{ user_name:pendingUserName,activation_code:activation_code},type:'POST',dataType: 'json',success:function(jsonObj) {
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

        myApp.preloader.show();

      }, complete: function(jsonObj) {

          console.log('in complete validateActivationCode');
          myApp.preloader.hide();
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
  myApp.dialog.confirm("The activation code " + activation_code + " is not valid.  Press OK to try again or Cancel.",
  "Incorrect Activation Code",
  function () {
        console.log('in confirm OK');
        showActivationPrompt(pendingUserName);
      },
  function () {
        myApp.dialog.alert(
          'You can try to activate the account at a later time from the start page.',
          'Cancel Activation',
          function () {
            //mainView.router.load( { url:'index.html' });
            myApp.views.main.router.navigate('/'); //V2
          }
        );
    }
  );
}

function passedValidation () {
  myApp.dialog.alert(
    'Your account is activated.  Please login with your user_name and password.',
    'Congratulations!',
    function () {
      //mainView.router.load( { url:'index.html' });
      myApp.views.main.router.navigate('/'); //V2
    }
  );
}




function viewTerms() {
  				console.log('viewTerms function');

          var url=wsURL+'ws_get_terms_conditions_ret_text.php';

        	myApp.request({url:url,data:{  },type:'POST',dataType: 'text'
  				,success:function(htmlString) {
  						console.log('ajax success.');
  						if (htmlString.length>0) { // RETURNED RESULTS

                  console.log('json_Obj is ' + htmlString);

                  var popupHTML = '<div class="popup popup-terms">';
                      popupHTML+='<div class="page">';

                      popupHTML+='<div class="navbar">';
                      popupHTML+='<div class="navbar-inner">';
                      popupHTML+='<div class="title">Terms and Conditions</div>';
                      popupHTML+='<div class="right"><a href="#" class="link popup-close">Close</a></div>';
                      popupHTML+='</div>';
                      popupHTML+='</div>';

                      popupHTML+='<div class="page-content">';
                      popupHTML+='<div class="block">';

                      //popupHTML+='<div class="closePopup"><a href="#" class="link popup-close"><i class="icon f7-icons">close_round</i></a></div>';
                      //popupHTML+='<div class="content-block">';
                      //popupHTML+='<div class="content-block-title">Terms and Conditions</div>';
                      popupHTML+= htmlString;
                      //popupHTML+='<div><a href="#" class="link popup-close">Close</a></div>';
                      popupHTML+='</div>'; // END  block
                      popupHTML+='</div>'; // END  page content

                      popupHTML+='</div>'; // end class page
                      popupHTML+='</div>'; // end class popup
                      myApp.popup.open(popupHTML);

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
