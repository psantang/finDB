// only needed for ios/android interface differences
// Determine theme depending on device
//'use strict'; //NOTE: GOOD FOR TROUBLESHOOTING
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
var serverEnv="finDBdev";

// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos
};

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
//console.log("$$ is " + $$);
// only needed for ios/android interface differences to apply material design
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');

    console.log('**** in isAndroid to alter css properties ****');
}


// only needed for ios/android interface differences if using Template7
/*
Template7.global = {
    android: isAndroid,
    ios: isIos
};
*/
// Init App
var myApp = new Framework7({
  //uniqueHistory:true,
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,//,
    dynamicNavbar: true,
    // Enable Template7 pages
    template7Pages: true,
    animatePages:true

});



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    //uniqueHistory:true,
    dynamicNavbar: true,
    domCache: false
});

var offline = true;
var deviceManufacturer,devicePlatform,deviceModel,deviceVersion;
window.loginEventStr="";

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    alert("Device is ready!  ");
    loginEventStr += "\r\ndevice ready\r\n";
    window.deviceManufacturer = device.manufacturer;
    window.devicePlatform=device.platform;
    window.deviceModel=device.model;
    window.deviceVersion=device.version;

    var deviceInfo=deviceManufacturer+ " " +devicePlatform+ " " +deviceModel+ " " + deviceVersion;
    loginEventStr += "\r\n" + deviceInfo +  "\r\n";
    alert("Device Data: " +deviceInfo );

    // prefill username fields if saved in local storage
    $$("#user_name").val(localStorage.getItem("user_name"));
    $$("#pwd").val(localStorage.getItem("pwd"));

    $$('.page #loginBtn').click(function() {
      alert('initiating LOGIN from onDeviceReady');
      loginEventStr += "\r\nlogin initiated from device ready\r\n";
      loginUser();
    });

    //$$(".navbar").hide();
    //$$(".view-main").append("<div class='navbar'></div>");

    if (navigator.connection && navigator.connection.type == Connection.NONE) {
          console.log('NO NETWORK CONNECTION');
      } else {
          console.log('NETWORK CONNECTION ESTABLISHED.');
          offline=false;
      }

  document.addEventListener("offline", onOffline, false);
  document.addEventListener("online", onOnline, false);


  if (localStorage.getItem('activation_code') ) { // check to see if there is any pending activation of a user account
    var pendingUserName=localStorage.getItem('pending_user_name');
    $$(".page #registerBtn").text('Pending Activation for '+ pendingUserName);
  } else {
    $$(".page #registerBtn").text('Register to Begin');
  }




    // NOTE: THIS is call live/delegated event handling and is used for dynamic content added to dom (IE. doing document.write or jQuery appends, etc.)

        //$$(document).on('click', '.deleteStockSki, .swipeout', function (e) {
        $$(document).on('click', '#ul_saved_list li a.swipeout-delete', function (e) {

          //var theID=e.target.parentNode.id;
          console.log('tagname of click was ' + e.target.tagName);
          console.log('parentNode id ' + e.target.parentNode.id);
          console.log('className is ' + e.target.className);
          console.log('style is ' + e.target.style);
          console.log('this attr id ' + $$(this).attr("id"));
          //var theID=e.target.id;
          var theID=$$(this).attr("id")
          console.log('in deleteStockSki to run deleteStockSki function with target id = ' + theID);
          deleteStockSki(theID); // deletes the indexed ski
          getLocalSettings(); // redraws screen so index's stay aligned for deletion
        });

        $$('.swipeout').on('swipeout:deleted', function (e) {
              //var theID=e.target.parentNode.id;
              var theID=e.target.id;
              console.log('in swipeout:deleted with target id='+theID);
              //deleteStockSki(theID);
              myApp.alert('Item removed');
              console.log('in swipeout:deleted');
            });

        $$('.swipeout').on('swipeout', function (e) {
          //e.preventDefault();
          console.log('Item opened on: ' + e.detail.progress + '%');
          });


    $$(document).on('click', '#saveStock', function () {
      console.log('clicked saveStock to run');
      document.getElementById("factory_brand").setAttribute("style", "height:220px")
      console.log('factory_brand height is ' + document.getElementById('factory_brand').style.height );
      $$('.page #factory_brand, .page #skiSelected, .page #saveStock').attr('style','opacity:0;height:0px;margin-top:0px').transition(750);

      storeSettingsLocally();

      $$('#saveStock').transitionEnd(function(){
        console.log('TRANSITION ENDED.......');
        $$('.page #factory_brand, .page #skiSelected').hide();
      });

      //$$('#saveStock').parent().remove();// removes the save buttons so can't duplicate saving
      $$('.page #skiLookup').show();
      getLocalSettings(); // this redraws screen for saved settings
      $$('#ul_saved_list>li:first-child').addClass('lightBlueBG'); //.css('background-color','#cfc');
    });






    //$$('.create-picker').on('click', function () { // THIS BINDS IT IF ALREADY IN DOB
    $$(document).on('click', '.create-picker', function () { // THIS BINDS IT IF DYNAMICALLY CREATED AFTER DOM INTIALLY LOADS
      // Check first, if we already have opened picker
      console.log($$(this).attr('class'));
      //var theBrand=getBrandByClass($$(this).attr('class'));
      var theBrand=getBrandByClass(this);
      console.log('theBrand=' + theBrand);

      if (theBrand) {
      if ($$('.picker-modal.modal-in').length > 0) {
        myApp.closeModal('.picker-modal.modal-in');
      }
      console.log('theBrand is ' + theBrand);
      myApp.pickerModal(
        '<div class="picker-modal" id="measure_picker">' +
          '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
              '<div class="left bold">Measuring for ' +theBrand+'</div>' +
              '<div class="right"><a href="#" class="close-picker"><i class="f7-icons">close_round_fill</i></a></div>' +
            '</div>' +
          '</div>' +
          '<div class="picker-modal-inner">' +
            '<div class="content-block">' +
              //'<div class="row measure_table"><div class="col-25 bold">Binding</div><div class="col-75">'+measureObj[theBrand].binding+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Binding</div><div class="col-75">'+measureObj[0][theBrand].binding+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Length</div><div class="col-75">'+measureObj[0][theBrand].length+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Depth</div><div class="col-75">'+measureObj[0][theBrand].depth+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">DFT</div><div class="col-75">'+measureObj[0][theBrand].dft+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Wing</div><div class="col-75">'+measureObj[0][theBrand].wing+'</div></div>' +
            '</div>' +
          '</div>' +
        '</div>'
      )
    } else {
      var popoverHTML = '<div class="popover">'+
                    '<div class="popover-inner">'+
                      '<div class="content-block">'+
                        '<p>No measurement data for this ski is documented.  However, standard practice is:</p>'+
                        '<ul><li>Binding: From front heel</li>'+
                        '<li>Length: Tips</li>'+
                        '<li>Depth: Flat</li>'+
                        '<li>DFT: Flat</li>'+
                        '<li>Wing: Screws above</li>'+
                        '</ul>'+
                      '</div>'+
                    '</div>'+
                  '</div>';
      myApp.popover(popoverHTML, this,  true);
    }
    });


    $$(document).on('click', '#forgotPwBtn', function () {
        myApp.prompt('Please enter your User Name or Email Address.', 'Forgot Password', function (value) {
            generatePwResetCode(value);
        });
        // wait until prompt is generated, then populate with username if available
        if (typeof localStorage.getItem("user_name") !== "undefined") {
          $$(".modal .modal-text-input").val(localStorage.getItem("user_name"));
        }

    });



}); // end DeviceReady



function globalDateTimeString () {
  navigator.globalization.dateToString(
    new Date(),
    function (date) { window.dtString = date.value; },
    function () { console.log('Error getting dateString\n'); },
    { formatLength: 'medium', selector: 'date and time' }
    );
  }


function getLocalDateTimeString (inputTime,outputFormat) {
  if (inputTime=='' || typeof inputTime === "undefined" || inputTime==null) {
    globalDateTimeString();
    if (typeof dtString === "undefined") {
      console.log('dtString is undefined from device');
      window.d=new Date();
    } else {
      console.log('dtString is DEFINED from device');
      window.d=new Date(dtString);
    }
  } else {
    window.d=new Date(inputTime);
  }

  if (outputFormat=="ISO") {
    y=d.getFullYear();
    m=d.getMonth();
    da=d.getDate();
    h=d.getHours();
    mi=d.getMinutes();
    s=d.getSeconds();
    localDateTimeString=y+'-'+m+'-'+da+' '+h+':'+mi+':'+s;
    console.log('local date time from device is ' + localDateTimeString);
    return localDateTimeString;
  } else {
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];

    ampm='AM';
    y=d.getFullYear();
    m=monthNames[d.getMonth()];
    da=d.getDate();
    h=d.getHours();
      if (h>12) h=h-12; ampm='PM';
    mi=d.getMinutes();
      if (mi<10) mi="0"+mi;
    //s=d.getSeconds();
    localDateTimeString=m+' '+da+', '+y+' '+h+':'+mi + ' ' + ampm;
    console.log('local date time from device is NOW FORMATTED AS ' + localDateTimeString);
    return localDateTimeString;
  }
}



function onOffline() {
      offline = true;
      myApp.addNotification({
         title: 'Connection Status',
         message: 'No network connection established.  Ski lookup requires network access.'
      });
        //if (isIos) $$('.fa-wifi').removeClass('color-green').addClass('color-gray');
         //else $$('.fa-wifi').removeClass('color-white').addClass('color-gray');
         //$$('.left').html('Offline');
         return false;
  }

  function onOnline() {
      offline = false;
      if ($$('.close-notification')) {
        $$('.close-notification').click();
      }

          // Show a toast notification to indicate the change
      /*
          myApp.addNotification({
              title: 'Connection Status',
              message: 'A previously connected device has come back online'
          });
      */
          // Set the wifi icon colors to reflect the change
          //if (isIos) $$('.fa-wifi').removeClass('color-gray').addClass('color-green');
          //else $$('.fa-wifi').removeClass('color-gray').addClass('color-white');
          //$$('.left').html('Online');

      }



myApp.onPageInit('about', function (page) {
    console.log('in myApp.onPageInit for ABOUT PAGE');

    if ( getLocalStorage('stockSkis') ) {
        getLocalSettings();
    } else { // show message on front page so user knows how to get started
      $$('<div class="center">Start by selecting the link below, then choose a ski brand, model, length and year (optional).<p>Save for quick access in the future.</div>').insertAfter('#indexTitle');
    }

    console.log('triggering getHowToMeasure function');
    var measureObj={}; // make object global
    getHowToMeasure();
});








// PAGE INITS HERE

myApp.onPageInit('login', function (page) {
    alert('login onPageInit fired');
    loginEventStr += "In pageInit for login";
    // prefill username fields if saved in local storage
    $$("#user_name").val(localStorage.getItem("user_name"));
    $$("#pwd").val(localStorage.getItem("pwd"));

    if (localStorage.getItem('activation_code') ) { // check to see if there is any pending activation of a user account
      var pendingUserName=localStorage.getItem('pending_user_name');
      $$(".page #registerBtn").text('Pending Activation for '+ pendingUserName);
    } else {
      $$(".page #registerBtn").text('Register to Begin');
    }

    $$('.page #loginBtn').click(function() {
      alert('initiating LOGIN from onPageInit');
      loginEventStr += "\r\nlogin initiated from onPageInit for login page";
      loginUser();
    });
});


myApp.onPageInit('register', function (page) {
    //alert('index page');
    console.log("register page initialized");

    $$('.create-popup').on('click', function () {
      viewTerms();
    });

    $$('.page #registerBtn').click(function() {
      registerUser();
    });

    if (localStorage.getItem('activation_code') ) { // check to see if there is any pending activation of a user account
      var pendingUserName=localStorage.getItem('pending_user_name');
      console.log("pendActivation initiated");
      showActivationPrompt(localStorage.getItem('pending_user_name'));
    }
});

myApp.onPageInit('mySettings', function (page) {
    window.page=page;
    console.log('mySettings onPageInit fired');
    console.log('   page.name: ' + page.name);
    console.log('      page.view: ' + page.view);
    console.log('         page.container: ' + page.container);


    //populateCurrentSki();
    //populateCurrentSettings();
    init_ski();

    $$('.page #viewStockBtn').click(function() {
      toggleViewStock();
    });

    $$('.create-popup').on('click', function () {
      viewHistory();
    });

    $$('.page #editFinBtn').click(function() {
      console.log("editFinBtn clicked");
      init_slider();
    });

    $$(document).on('click', '#cancelSaveBtn', function (e) {
        console.log("cancelSaveBtn clicked");
        cancelSave();
    });


    /* FOR CHANGING BINDING SETTINGS...INITIALIZING
    theVal=$$(".page #myCurrentBinding").text();

    console.log("initial value of binding is " + theVal );

    minVal=Number(theVal) - Number(.750);
    maxVal=Number(theVal) + Number(.750);
    $$(".page #bindVal").attr("value", theVal);
    $$(".page #bindVal").attr("min", minVal );
    $$(".page #bindVal").attr("max", maxVal );
    $$(".page #bindVal").attr("step", ".0625");
*/

});


myApp.onPageInit('mySkis', function (page) {
    console.log('mySkis onPageInit fired');

      getMySkis(thisUser.user_name);

    $$('.page #ul_mySkis_list').change(function() {
      var ski_id=$$("input[name='my-radio']:checked"). val();
      console.log('change current ski triggered with ski_id ' + ski_id);
      setCurrentSki(thisUser.user_name, ski_id);
    });

    $$(document).on('click', '#addSkiBtn', function () {
      addSki();
    });

});



myApp.onPageInit('profile', function (page) {
    console.log('profile onPageInit fired');

    init_profile();

    $$('#editProfileBtn').click(function() {
      toggleEditSave();
    });


        $$('#profileMeasureId').click(function() {
          var measurePopover = '<div class="popover">'+
                        '<div class="popover-inner">'+
                          '<div class="content-block">'+
                            '<p class="bold">Why offer this data?</p>' +
                            '<p>How you measure your settings will be stored with each setting saved. If you change how you measure, change this profile.</p>'+
                          '</div>'+
                        '</div>'+
                      '</div>';
          myApp.popover(measurePopover, this,  true);
        });



        $$('#profileDemographicId').click(function() {
          var demographicPopoverHTML = '<div class="popover">'+
                        '<div class="popover-inner">'+
                          '<div class="content-block">'+
                            '<p class="bold">Why offer this data?</p>' +
                            '<p>As the systems gathers more data, you will be able to view the averages of other users settings for your demographic.</p>'+
                          '</div>'+
                        '</div>'+
                      '</div>';
          myApp.popover(demographicPopoverHTML, this,  true);
        });


    console.log (page.query + " is page.query");
    if (page.query == -1) {
      $$('#editProfileBtn').click(); // make form editable on load

      myApp.alert(
        'we have to create your profile for how your measure your settings and get your ability level so you can view settings of others in your ability range as the system gathers more data.',
        'Before you can begin...',
        function () {
          return null;
        }
      );

      console.log ("inside of page.query is -1");

    }
});



// Option 2. Using one 'pageInit' event handler for ALL pages
var pageCounter=0;
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    pageCounter++;
    var page = e.detail.page;
    console.log('  ');
    console.log('------------ data-page = ' + page.name + ' : count: ' + pageCounter + ' -------------');
    console.log('  ');

    $$('.navbar #logoutBtn').click(function() {
      //delete thisUser; // delete all objects - NOTE DELETE NOT ALLOWED IN STRICT MODE
      /*
      if (typeof thisUser != "undefined") thisUser={};
      if (typeof thisSki != "undefined") thisSki={};
      if (typeof thisSetting != "undefined") thisSetting={};
      */
      if (typeof thisUser != "undefined") delete thisUser;
      if (typeof thisSki != "undefined") delete thisSki;
      if (typeof thisSetting != "undefined") delete thisSetting;

      console.log('  ');
      console.log('############# USER LOGGED OUT #############');
      console.log('  ');
      mainView.router.load( { url:'index.html' });
    });
});

// TESTING TO SEE HOW TO ACCESS DYNAMIC SMART SELECT page











// TESTING TO SEE HOW TO ACCESS DYNAMIC SMART SELECT page
$$(document).on('pageInit', '.page[data-select-name="brand"]', function (e) {
    console.log('brands smart select initialized');

    $$('.page .smart-select #brand_select_id').change(getModels); // run getModels function

  //  if ($$('.page[data-select-name="brand"]').find(("input[type='radio']:checked")) ) {
    //  var theName=$$('.page[data-select-name="brand"]').find(("input[type='radio']:checked"))[0].name;
    //  alert(theName);
      $$('.page[data-select-name="brand"]').find(("input[type='radio']:checked")).prop('checked', false);
    //}

});

$$(document).on('pageInit', '.page[data-select-name="model"]', function (e) {
    console.log('model smart select initialized');
    $$('.smart-select #model_select_id').change(getLengths);
    $$('.page[data-select-name="model"]').find(("input[type='radio']:checked")).prop('checked', false);
});

/*
$$(document).on('onPageBeforeRemove', '.page[data-select-name="model"]', function (e) {
  console.log('onPageAfterAnimation to GET YEARS NEXT');
  $$('.smart-select #model_select_id').change(getYears);
})
*/


$$(document).on('pageInit', '.page[data-select-name="year"]', function (e) {
    console.log('year smart select initialized');
    $$('.smart-select #year_select_id').change(getStockSettings);
    $$('.page[data-select-name="year"]').find(("input[type='radio']:checked")).prop('checked', false);

})

$$(document).on('pageInit', '.page[data-select-name="length"]', function (e) {
    console.log('length smart select initialized');
    $$('.smart-select #length_select_id').change(getYears);
    $$('.page[data-select-name="length"]').find(("input[type='radio']:checked")).prop('checked', false);


})


function getBrandByClass (clickedObj) {
  for (i=0; i<Object.keys(measureObj[0]).length; i++) {
    var brandVar='brand_'+Object.keys(measureObj[0])[i];
    if ( $$(clickedObj).hasClass(brandVar) ) return Object.keys(measureObj[0])[i];
  }

}



function getHowToMeasure() {
console.log('inside getHowToMeasure');
if (offline) return onOffline();

 var url='http://finDB.paulsantangelo.com/ws/ws_get_how_to_measure_ret_json.php';
 $$.ajax({url:url,data:{ source:'mobileApp'},type:'POST',dataType: 'json',success:function(measure_Obj) {
   measureObj=measure_Obj;
   console.log(Object.keys(measureObj[0]).length);
   if (measureObj.length>0) { // RETURNED RESULTS
     if (Object.keys(measureObj[0]).length>0) { // results have values
       console.log('success in getting measured object');
       console.log(measureObj);
     } else {
       console.log('No data found');
     }
   } else {
     console.log('No object found');
   }
   console.log('measure_Obj.length is ' + measure_Obj.length);
   console.log('measure_Obj[1].length is ' + measure_Obj[0].binding);
 }
});
}


$$(document).on('click', '#skiLookup', function () {
  //$$('.page .smart-select #brand_select_id').remove();
  skiLookup();
});



$$(document).on('click', '#goHome', function (e) {
    console.log('goHome via live pageInit');
});

//$$(document).on('onPageBack', '.page[data-page="about"]', function (e) {
//    console.log('onPageBack about page via live pageInit');
//});


function generatePwResetCode(userNameOrEmail) {
      console.log('running generatePwResetCode function with value of ' + userNameOrEmail);
      if (offline) return onOffline();

      var url='http://finDB.paulsantangelo.com/ws/ws_set_forgot_pw_code_ret_json.php';
      var passed;
      $$.ajax({url:url,data:{user_input:userNameOrEmail},type:'POST',dataType: 'json',success:function(jsonObj) {
        if (jsonObj[0].RETURN_CODE==1) {
          console.log('return code 1...success for pw reset code!');
          passed=true;
        } else {
          console.log('return code NOT 1...no luck activating account');
          passed=false;
        }
      }, timeout: 5000
        , beforeSend: function() {
          console.log('beforeSend generatePwResetCode');
          myApp.showIndicator();
        }, complete: function(jsonObj) {
            console.log('in complete generatePwResetCode');
            myApp.hideIndicator();
            if (passed) {

                myApp.alert(
                  'An email has been sent to ' +userNameOrEmail+'.  Please get the code from your email account and supply to the following prompt to reset your password.',
                  'Email Sent',
                  function () {
                    validatePwResetCode(userNameOrEmail);
                  }
                );

            } else {
              myApp.alert(
                'The User Name or Email address was not found in the system.',
                'Failed',
                function () {
                  return null;
                }
              );
            }
        }, error: function(jsonObj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + jsonObj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function for models
}


function validatePwResetCode (userNameOrEmail) {

      myApp.prompt('Enter the verification code sent to your email.', 'Reset Password Code', function (value) {
        console.log('running validatePwResetCode function');
        if (offline) return onOffline();

        var url='http://finDB.paulsantangelo.com/ws/ws_get_forgot_pw_code_ret_json.php';
        var passed;
        $$.ajax({url:url,data:{ userNameOrEmail:userNameOrEmail,code:value},type:'POST',dataType: 'json',success:function(jsonObj) {
          if (jsonObj[0].RETURN_CODE==1) {
            console.log('return code 1...success for pw reset code!');
            passed=true;
          } else {
            console.log('return code NOT 1...no luck activating account');
            passed=false;
          }
        }, timeout: 5000
          , beforeSend: function() {
            console.log('beforeSend validatePwResetCode');
            myApp.showIndicator();
          }, complete: function(jsonObj) {
              console.log('in complete validatePwResetCode');
              myApp.hideIndicator();
              if (passed) {
                setNewPw(userNameOrEmail);
              } else {
                myApp.confirm("The Code " +value+ " is not valid.  Press OK to try again or Cancel.",
                "Incorrect Code",
                function () {
                      console.log('in confirm OK');
                      validatePwResetCode(userNameOrEmail);
                    },
                function () {
                      return null;
                  }
                );
              }

          }, error: function(jsonObj, status, err) {
              if (status == "timeout") {
                console.log("Timeout Error. " + jsonObj + status + err);
              } else {
                console.log("error: "  + status + err);
              }
          }
      }) // END ajax function for models

    }); // END PROMPT
}

function setNewPw(userNameOrEmail) {
  myApp.prompt('Successful validation.<p>Enter a new password.</p>', 'Reset Password', function (value) {
    console.log('running validatePwResetCode function');
    if (offline) return onOffline();

    if (value.length<6) {
      myApp.alert(
        'Password must be atleast 6 characters.',
        'Password failed',
        function () {
          setNewPw(userNameOrEmail);
        }
      );
      return;
    }

    var url='http://finDB.paulsantangelo.com/ws/ws_set_reset_password_ret_json.php';
    var passed;
    $$.ajax({url:url,data:{ userNameOrEmail:userNameOrEmail,user_pwd:value},type:'POST',dataType: 'json',success:function(jsonObj) {
      if (jsonObj[0].RETURN_CODE==1) {
        console.log('return code 1...success for pw reset!');
        passed=true;
      } else {
        console.log('return code NOT 1...failed password reset');
        passed=false;
      }
    }, timeout: 5000
      , beforeSend: function() {
        console.log('beforeSend setNewPw');
        myApp.showIndicator();
      }, complete: function(jsonObj) {
          console.log('in complete setNewPw');
          myApp.hideIndicator();
          if (passed) {
            localStorage.removeItem("pwd");
            myApp.alert(
              'Password reset has been complete.  Please login with your new password.',
              'Success!',
              function () {
                return null;
              }
            );
          } else {
            myApp.alert(
              'Password reset was not successful.  Please try again.',
              'Password Reset Failed',
              function () {
                return null;
              }
            );
          }
      }, error: function(jsonObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + jsonObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }); // END ajax function for models
  });

  $$(".modal-in input").prop("type","password"); // change input type to password since it defaults to text
}
