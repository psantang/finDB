// only needed for ios/android interface differences
// Determine theme depending on device
//'use strict'; //NOTE: GOOD FOR TROUBLESHOOTING
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

var api_vers="2_0_1";
var app_vers="2_0_9";
var user_vers=app_vers.replace(/_/g,".");
var wsURL="http://finDB.paulsantangelo.com/ws/"+api_vers+"/"; // A2 Hosting
//var wsURL="http://paulsan1.wwwss52.a2hosted.com/finDB/ws/"+api_vers+"/"; // A2 pre prod

// Set Template7 global devices flags
Template7.global = {
    android: isAndroid,
    ios: isIos
};

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
//console.log("$$ is " + $$);

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// only needed for ios/android interface differences to apply material design
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');

    console.log('**** in isAndroid to alter css properties ****');
}


// Init App

var myApp = new Framework7({
    id: 'com.paulsantangelo.finDB',
    root: '#app',
    material: isAndroid ? true : false,//,
    dynamicNavbar: true,
    // Enable Template7 pages
    template7Pages: true,
    animatePages:true,
    routes: routes,
    on: {
      pageInit(page) {
       console.log('myApp - on pageInit for page ' +page)
     }
   }

});

// LISTENER / SUBSCRIBER for when user selects a ski and ski count is displayed in nav
myApp.on('skiUsageCount', function (thisSki) {
  console.log("emitted function skiUsageCount");
  if (thisSki) {
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
});
// 2nd LISTENER/SUBSCRIBER TO THE skiUsageCount emitter
myApp.on('skiUsageCount', function (skiCount) {
  console.log("emitted function skiUsageCount");
  if (thisSki) {
    console.log("This is an emitted function with skiCount="+thisSki.ski_count);
  }
});



var offline = true;
var deviceManufacturer,devicePlatform,deviceModel,deviceVersion;
window.loginEventStr="";









// THIS WILL SUPPRESS ALL console.log output
var console = {};
console.log = function(){};









appLinkiOS="https://itunes.apple.com/us/app/fin-db/id1234631397?mt=8";
appLinkAndroid="https://play.google.com/store/apps/details?id=com.paulsantangelo.finDB";

G_LOOKUP_TYPE='';

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!  ");

    loginEventStr += "\r\ndevice ready\r\n";
    window.deviceManufacturer = device.manufacturer;
    window.devicePlatform=device.platform;
    window.deviceModel=device.model;
    window.deviceVersion=device.version;

    var deviceInfo=deviceManufacturer+ " " +devicePlatform+ " " +deviceModel+ " " + deviceVersion;
    loginEventStr += "\r\n" + deviceInfo +  "\r\n";
    console.log("Device Data: " +deviceInfo );


    if (navigator.connection && navigator.connection.type == Connection.NONE) {
          console.log('NO NETWORK CONNECTION');
      } else {
          console.log('NETWORK CONNECTION ESTABLISHED.');
          offline=false;
      }

  document.addEventListener("offline", onOffline, false);
  document.addEventListener("online", onOnline, false);



    // NOTE: THIS is call live/delegated event handling and is used for dynamic content added to dom (IE. doing document.write or jQuery appends, etc.)

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
              myApp.dialog.alert('Item removed');
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





// Capture "RENAME SKI" event and handle
  //$$('.swipeout').on('swipeout', function (e) {
  $$(document).on('swipeout', 'a', function (e) {
    console.log('Item opened on: ' + e.detail.progress + '%');
  });

    $$(document).on('click', '#saved_ski_list a.renameSki', function (e) {
      console.log('captured swipe to rename ski');
      var theID=$$(this).attr("id")
      theID=theID.substring(theID.lastIndexOf("_")+1, theID.length);
      console.log('the rename id is ' + theID);
      changeSkiName(theID);
    });



    //$$('.create-picker').on('click', function () { // THIS BINDS IT IF ALREADY IN DOB
    $$(document).on('click', '.create-sheet', function () { // THIS BINDS IT IF DYNAMICALLY CREATED AFTER DOM INTIALLY LOADS
      // Check first, if we already have opened picker
      console.log($$(this).attr('class'));

      console.log("this id is " + $$(this).attr('id') );

      var theBrand=getBrandByClass(this);
      console.log('theBrand=' + theBrand);

      if (measureObj[0][theBrand].binding!='Unknown') {
      //if ($$('.picker-modal.modal-in').length > 0) {
      //  myApp.closeModal('.picker-modal.modal-in');
      //}
      console.log('theBrand is ' + theBrand);
      //myApp.pickerModal(
      var measureSheet=myApp.sheet.create({
        content:'<div class="sheet-modal" id="measure_sheet">' +
          '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
              '<div class="left bold">Measuring for ' +theBrand+'</div>' +
              '<div class="right"><a href="#" class="sheet-close"><i class="f7-icons">close_round_fill</i></a></div>' +
            '</div>' +
          '</div>' +
          '<div class="sheet-modal-inner">' +
            '<div class="block">' +
              //'<div class="row measure_table"><div class="col-25 bold">Binding</div><div class="col-75">'+measureObj[theBrand].binding+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Binding</div><div class="col-75">'+measureObj[0][theBrand].binding+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Length</div><div class="col-75">'+measureObj[0][theBrand].length+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Depth</div><div class="col-75">'+measureObj[0][theBrand].depth+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">DFT</div><div class="col-75">'+measureObj[0][theBrand].dft+'</div></div>' +
              '<div class="row measure_table"><div class="col-25 bold">Wing</div><div class="col-75">'+measureObj[0][theBrand].wing+'</div></div>' +
            '</div>' +
          '</div>' +
        '</div>'
      });
      measureSheet.open();
    } else {
      var measurePopover=myApp.popover.create({
            targetEl: '#'+$$(this).attr('id'),
            content:'<div class="popover">'+
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
                  '</div>'
              });
      measurePopover.open();
    }
    });

}); // end DeviceReady


// NOTE: this function did not work with IOS as it didn't return a date format STRING that an new Date object could be created from
function globalDateTimeString () {
  // this is one of the formats needed by IOS/Safari:  Sat Aug 26 2017 11:12:13 GMT-0400 (EDT)
  navigator.globalization.dateToString(
    new Date(),
    function (date) { window.dtString = date.value; },
    function () { console.log('Error getting dateString\n'); },
    { formatLength: 'short', selector: 'date and time' }
    );
  }


function getLocalDateTimeString (inputTime,outputFormat) {
  if (inputTime=='' || typeof inputTime === "undefined" || inputTime==null) {
//    globalDateTimeString();
//    if (typeof dtString === "undefined") {
      console.log('dtString determined from JS in browser');
      window.d=new Date();
//    } else {
//      console.log('dtString is DEFINED from device');
//      window.d=new Date(dtString);
//    }
  } else {
    dt=inputTime.split(/[- :]/);
    //console.log('dt is ' + dt);
    //inputTime=inputTime.replace(/-| |:/gi,',');
    //window.d=new Date(inputTime);
    window.d=new Date(dt[0],dt[1],dt[2],dt[3],dt[4],dt[5]);
  }

  if (outputFormat=="ISO") {
    y=d.getFullYear();
    m=d.getMonth();
    da=d.getDate();
    h=d.getHours();
    mi=d.getMinutes();
    s=d.getSeconds();
    localDateTimeString=y+'-'+m+'-'+da+' '+h+':'+mi+':'+s;
  //  console.log('local date time from device is ' + localDateTimeString);
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
    // console.log('local date time from device is NOW FORMATTED AS ' + localDateTimeString);
    return localDateTimeString;
  }
}



function onOffline() {
      offline = true;
      /*
      myApp.addNotification({
         title: 'Connection Status',
         message: 'No network connection established.  Ski lookup requires network access.'
      });
      */
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



// MY SETTINGS LIVE EVENT HANDLERS...outside if pag init
$$(document).on('click', '#cancelSaveBtn', function (e) {
    console.log("cancelSaveBtn clicked");
    cancelSave();
});

$$(document).on('click', '.view_history', function (e) {
  viewHistory();
});

/*
$$(document).on('click', '.navbar #newSettingNote', function (e) {
  console.log("newSettingNote clicked");
  AddNotePopUp();
});
*/


//$$('#newSettingNote').click(function() {
$$(document).on('click', '#newSettingNote', function (e) {
  console.log("newSettingNote clicked root js file");
  AddNotePopUp();
});


$$(document).on('click', '.popup #addNoteBtn', function (e) {
    console.log("addNote clicked");
    addNote();
});

$$(document).on('closed', '.popup-history', function (e) {
  console.log('History - Popup is closed')
  var popupHTML;

});

$$(document).on('closed', '.popup-notes', function (e) {
  console.log('popup-notes is closed')

});

$$(document).on('click', '.panel-left', function (e) {
  myApp.panel.open("left", true);
});



// Option 2. Using one LIVE 'pageInit' event handler for ALL pages

var pageCounter=0;
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    pageCounter++;
    var page = myApp.views.main.router.currentPageEl.getAttribute('data-page');

    console.log('  ');
    console.log('------------ data-page = ' + page + ' : count: ' + pageCounter + ' -------------');
    console.log('  ');

});


$$(document).on('click','#logoutBtn',function(page) {
  if (typeof thisUser != "undefined") delete thisUser;
  if (typeof thisSki != "undefined") delete thisSki;
  if (typeof thisSetting != "undefined") delete thisSetting;

  console.log('  ');
  console.log('############# USER LOGGED OUT #############');
  console.log('  ');
  //mainView.router.load( { url:'index.html' });
  myApp.views.main.router.navigate('/'); //V2
  //myApp.panel.close("left", true);
});


function getBrandByClass (clickedObj) {
  for (i=0; i<Object.keys(measureObj[0]).length; i++) {
    var brandVar='brand_'+Object.keys(measureObj[0])[i];
    if ( $$(clickedObj).hasClass(brandVar) ) return Object.keys(measureObj[0])[i];
  }

}



function getHowToMeasure() {
console.log('inside getHowToMeasure');
if (offline) return onOffline();

 var url=wsURL+'ws_get_how_to_measure_ret_json.php';
 myApp.request({url:url,data:{ source:'mobileApp'},type:'POST',dataType: 'json',success:function(measure_Obj) {
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

      var url=wsURL+'ws_set_forgot_pw_code_ret_json.php';
      var passed;
      myApp.request({url:url,data:{user_input:userNameOrEmail},type:'POST',dataType: 'json',success:function(jsonObj) {
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
          //myApp.showIndicator();
          myApp.preloader.show();
        }, complete: function(jsonObj) {
            console.log('in complete generatePwResetCode');
            //myApp.hideIndicator();
            myApp.preloader.hide();
            if (passed) {

                myApp.dialog.alert(
                  'An email has been sent to ' +userNameOrEmail+'.  Please get the code from your email account and supply to the following prompt to reset your password.',
                  'Email Sent',
                  function () {
                    validatePwResetCode(userNameOrEmail);
                  }
                );

            } else {
              myApp.dialog.alert(
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


function requestUserName(user_email) {
  console.log("requesting username with " + user_email);
  var url=wsURL+'ws_get_username_ret_json.php';

  myApp.request({url:url,data:{ user_email:user_email },type:'POST',dataType: 'json',success:function(jsonObj) {
    if (jsonObj[0].RETURN_CODE==1) { // Do nothing, since we don't want to give away if email was valid
      console.log('return code 1...success for requestUserName!');
    } else {
      console.log('return code NOT 1...no luck requestUserName');
    }
  }, timeout: 5000
    , beforeSend: function() {
      console.log('beforeSend requestUserName');
      //myApp.showIndicator();
      myApp.preloader.show();
    }, complete: function(jsonObj) {
        console.log('in complete requestUserName');
        //myApp.hideIndicator();
        myApp.preloader.hide();
          myApp.dialog.alert("If the email address <span class='bold'>" + user_email + "</span> is associated with your account, you will receive an email with your User Name.","Email Sent");
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

      myApp.dialog.prompt('Enter the verification code sent to your email.', 'Reset Password Code', function (value) {
        console.log('running validatePwResetCode function');
        if (offline) return onOffline();

        var url=wsURL+'ws_get_forgot_pw_code_ret_json.php';
        var passed;
        myApp.request({url:url,data:{ userNameOrEmail:userNameOrEmail,code:value},type:'POST',dataType: 'json',success:function(jsonObj) {
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
            //myApp.showIndicator();
            myApp.preloader.show();
          }, complete: function(jsonObj) {
              console.log('in complete validatePwResetCode');
              //myApp.hideIndicator();
              myApp.preloader.hide();
              if (passed) {
                setNewPw(userNameOrEmail);
              } else {
                myApp.dialog.confirm("The Code " +value+ " is not valid.  Press OK to try again or Cancel.",
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
  myApp.dialog.prompt('Successful validation.<p>Enter a new password.</p>', 'Reset Password', function (value) {
    console.log('running validatePwResetCode function');
    if (offline) return onOffline();

    if (value.length<6) {
      myApp.dialog.alert(
        'Password must be atleast 6 characters.',
        'Password failed',
        function () {
          setNewPw(userNameOrEmail);
        }
      );
      return;
    }

    var url=wsURL+'ws_set_reset_password_ret_json.php';
    var passed;
    myApp.request({url:url,data:{ userNameOrEmail:userNameOrEmail,user_pwd:value},type:'POST',dataType: 'json',success:function(jsonObj) {
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
        //myApp.showIndicator();
        myApp.preloader.show();
      }, complete: function(jsonObj) {
          console.log('in complete setNewPw');
          //myApp.hideIndicator();
          myApp.preloader.hide();
          if (passed) {
            localStorage.removeItem("pwd");
            myApp.dialog.alert(
              'Password reset has been complete.  Please login with your new password.',
              'Success!',
              function () {
                return null;
              }
            );
          } else {
            myApp.dialog.alert(
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


// RE-USE of the ski lookup functions IN and OUT of session have to route to different locations.
function routeSkiLookup() {
  console.log("In routeSkiLookup Function");

  if (G_LOOKUP_TYPE=='findSki') { // THIS IS FOR OUT OF SESSION
    myApp.router.navigate('/lookup/');
  } else { // ALL IN SESSIONS ROUTE BACK TO SPECIFIC PAGE
    myApp.router.navigate('/mySkis/');
    promptSkiName(myApp.data.lookup.skiYear);
  }

}


$$(document).once('deviceready', function (page) {
  console.log(" ^^^^^^^^^^^^ pageinit only once ^^^^^^^^^ making call to CallMethod to get data..... ");
  var url=wsURL+'get_user_version_status_ret_json.php';
  //data="user_vers="+thisUser.user_vers;
  data="user_vers="+app_vers.replace(/_/g,".");
  CallMethod(url, data , onSuccess);
});


function CallMethod(url, parameters, successCallback) {
                console.log("in CallMethod function");
                if (offline) return onOffline();

                myApp.request({
                    type: 'POST',
                    url: url,
                    data: parameters,
                    //contentType: 'application/json;',
                    dataType: 'json',
                    success: successCallback,
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('---------- ------- -------- error from CallMethod');
                    }
                });
            }


function onSuccess(vers_Obj) {
    console.log("++++++++++ +++++++++ +++++++++ this is onSuccess function with param="+vers_Obj);

    vers_Obj = {user_vers:user_vers,latest_vers:vers_Obj[0].latest_vers,vers_features:vers_Obj[0].vers_features,vers_update:vers_Obj[0].vers_update};
    window.vers_Obj=vers_Obj;

    notify_text="Your version: "+ vers_Obj.user_vers+ ". Latest version: "+vers_Obj.latest_vers;
    if (isIos) {
      update_link="<a class='external' href='"+appLinkiOS+"' target='_system'>Learn More <i class='icon f7-icons color-blue'>info_fill</i></a>";
    }
    if (isAndroid) {
      update_link="<a class='external' href='"+appLinkAndroid+"' target='_system'>Learn More <i class='icon f7-icons color-blue'>info_fill</i></a>";
    }


    if (typeof vers_Obj != "undefined" && vers_Obj.vers_update<0) {
      console.log('need an update available');
      var notificationClickToClose = myApp.notification.create({
        icon: '<img src="../res/icon/ios/icon-40.png" width="24" height="24" />',
        title: 'finDB version ' + vers_Obj.user_vers,
        titleRightText: 'now',
        subtitle: 'Update available. Version: ' +vers_Obj.latest_vers,
        text: update_link,
        closeButton: true,
        closeOnClick: true,
      });
      notificationClickToClose.open();
    }
}
