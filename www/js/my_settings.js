function init_ski() {
  console.log('in init');

  if (!thisUser.profileActivated) { // see if user profile is populated
    myApp.alert(
      'your user profile must be complete.  Select OK below to continue.',
      'Before you can begin...',
      function () {
        mainView.router.load( { url:'profile.html' });
      }
    );
  } else {
    populateCurrentSki();
    populateCurrentSettings();
    console.log('page query is ' + page.query.ski)
  }
}

var viewCounter=0;
function populateCurrentSki() {
  console.log('in populateCurrentSki with viewCounter=' + viewCounter);
  if (typeof thisSki !== "undefined") {
    if (thisSki.my_ski_name) {
      $$(".page #myCurrentSki").text(thisSki.my_ski_name);
    } else {
      var skiName=thisSki.length + " " + thisSki.brand + " " + thisSki.model + " " + thisSki.year;
      $$(".page #myCurrentSki").text(skiName);
    }
  } else { // IF USER HAS NO SKI's SELECTED, Like first time entry, direct to ski selection page
    $$(".page #myCurrentSki").text("Add Ski");
    if (viewCounter<1) {
      viewCounter++;
      console.log("first select a ski with viewCounter=" + viewCounter);
      var modalFirstSki = myApp.modal({
        title: 'Welcome!',
        text: 'Before you save any settings, you must select a ski to apply these to.',
        afterText:  '',
        buttons: [
          {
            text: 'Select My Ski',
            bold: true,
            onClick: function () {
              mainView.router.load( { url:'mySkis.html' });
            }
          },
        ]
      });
      /*
      myApp.alert(
        'Before you save any settings, you must select a ski to apply these to.',
        'Welcome!',
        function () {
          mainView.router.load( { url:'mySkis.html' });
        }
      );*/
    }
  }
}

function populateCurrentSettings() {
  if (typeof thisSetting !== "undefined") {
    console.log("ObjectthisSetting IS DEFINED");
    if (thisSetting.ski_id) {
      $$(".page #dateCreated").html(thisSetting.date_time_created);
      $$(".page #myCurrentBinding").html(thisSetting.front_binding);
      $$(".page #myCurrentLength").html(thisSetting.length);
      $$(".page #myCurrentDepth").html(thisSetting.depth);
      $$(".page #myCurrentDFT").html(thisSetting.dft);
      $$(".page #myCurrentWingAngle").html(thisSetting.wing_angle);
      $$(".page #myCurrentLE").html(thisSetting.leading_edge);
      $$(".page #myCurrentBindToLE").html(thisSetting.binding_to_le);
      myCurrentBindToLE

      //$$(".page #mySettingsBinding").html(thisSetting.measure_binding);
      $$(".page #stockBinding").html(thisSetting.measure_binding);
      $$(".page #stockLength").html(thisSetting.measure_length);
      $$(".page #stockDepth").html(thisSetting.measure_depth);
      $$(".page #stockDFT").html(thisSetting.measure_dft);
      $$(".page #stockWingAngle").html("");

      if ( $$(".page #dateCreated , .page .measureOverlay").hasClass('redText') ) { // redText class is for stock settings only when initially loaded
        $$(".page #dateCreated , .page .measureOverlay").removeClass('redText');
      }
    }
  } else {
    console.log("object thisSetting is undefined");
    if (typeof thisSki !== "undefined") {
      $$(".page #dateCreated").html('Stock Settings');
      $$(".page #myCurrentBinding").html(thisSki.stock_binding_location);
      $$(".page #myCurrentLength").html(thisSki.stock_fin_length);
      $$(".page #myCurrentDepth").html(thisSki.stock_fin_depth);
      $$(".page #myCurrentDFT").html(thisSki.stock_fin_dft);
      $$(".page #myCurrentWingAngle").html(thisSki.stock_wing_angle);
      $$(".page #myCurrentLE").html( (Number(thisSki.stock_fin_dft) + Number(thisSki.stock_fin_length)).toFixed(3));
      $$(".page #myCurrentBindToLE").html( (Number(thisSki.stock_binding_location) - (Number(thisSki.stock_fin_dft) + Number(thisSki.stock_fin_length))).toFixed(4));

      //BELOW SHOW HOW STOCK IS MEASURED IF THERE IS A VALUE FOR EACH OF THE SETTINGS FROM THE FACTORY
      thisSki.stock_binding_location>0 ? $$(".page #stockBinding").html("<span class='redText'>"+thisSki.measure_binding+"</span>") : $$(".page #stockBinding").html("");
      thisSki.stock_fin_length>0 ? $$(".page #stockLength").html("<span class='redText'>"+thisSki.measure_length+"</span>") : $$(".page #stockLength").html("");
      thisSki.stock_fin_depth>0 ? $$(".page #stockDepth").html("<span class='redText'>"+thisSki.measure_depth+"</span>") : $$(".page #stockDepth").html("");
      thisSki.stock_fin_dft>0 ? $$(".page #stockDFT").html("<span class='redText'>"+thisSki.measure_dft+"</span>") : $$(".page #stockDFT").html("");
      $$(".page #stockWingAngle").html("");

      $$(".page #dateCreated").addClass('redText');
      //$$("#viewStockBtn").hide();
    }
  }
}


function toggleViewStock() {
    //if ($$(".page #viewStockBtn i").text() == "more_vertical_round") {
    if ($$(".page #viewStockBtn").text() == "STOCK") {

      if (     parseFloat(thisSki.stock_binding_location) <= 0
        && parseFloat(thisSki.stock_fin_length) <= 0
        && parseFloat(thisSki.stock_fin_depth) <= 0
        && parseFloat(thisSki.stock_fin_dft) <= 0
        && parseFloat(thisSki.stock_wing_angle) <= 0
      ) {
        stockHTML ='<div id="stockSettings">';
        stockHTML+='<div class="stockName center">No stock data is available.</div>';
        stockHTML+='</div>';
    } else {
      stockHTML ='<div id="stockSettings">';
      stockHTML+='<div class="data-table">';
      stockHTML+='<div class="stockName center">'+thisSki.length + ' ' + thisSki.brand + ' ' + thisSki.model + ' ' + thisSki.year + '</div>';
      stockHTML+='<table>';
      stockHTML+='<thead>';
      stockHTML+='<tr>';
      stockHTML+='<th class="numeric-cell">Binding</th>';
      stockHTML+='<th class="numeric-cell">Length</th>';
      stockHTML+='<th class="numeric-cell">Depth</th>';
      stockHTML+='<th class="numeric-cell">DFT</th>';
      stockHTML+='<th class="numeric-cell">Wing</th>';
      stockHTML+='</tr>';
      stockHTML+='</thead>';
      stockHTML+='<tbody>';
      stockHTML+='<tr>';
      stockHTML+='<td class="numeric-cell">' +thisSki.stock_binding_location+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.stock_fin_length+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.stock_fin_depth+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.stock_fin_dft+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.stock_wing_angle+ '</td>';
      stockHTML+='</tr>';
      stockHTML+='<tr>';
      stockHTML+='<td class="numeric-cell">' +thisSki.measure_binding+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.measure_length+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.measure_depth+ '</td>';
      stockHTML+='<td class="numeric-cell">' +thisSki.measure_dft+ '</td>';
      stockHTML+='<td class="numeric-cell"></td>';
      stockHTML+='</tr>';
      stockHTML+='</tbody>';
      stockHTML+='</table>';
      stockHTML+='</div>';
      stockHTML+='</div>';
    }

      //$$("#stockSettingsDiv").css("height","100%");

      $$("#stockSettingsDiv").animate(
        /* CSS properties to animate, e.g.: */
        {
            'height': 70,
            'opacity': 1
        },
        {
            // Animation duraion in ms, optional (default to 300)
            duration: 500,
            // Animation easing, optional (default to 'swing'), can be also 'linear'
            easing: 'swing',
            /* Callbacks */
            // Animation begins, optional
            begin: function (elements) {
                console.log('animation began');
                $$("#stockSettingsDiv").html(stockHTML);
            },
            // Animation completed, optional
            complete: function (elements) {
                console.log('animation completed');
            },
            // Animation in progress, optional
            progress: function (elements, complete, remaining, start) {
                /* Where
                complete - The call's completion percentage (as a decimal value)
                remaining - How much time remains until the call completes (in ms)
                start - The absolute time at which the call began (in ms)
                */
                console.log('animation in progress');
            }
        }
      );

      //$$(".page #viewStockBtn i").text("more_vertical_round_fill");
      $$(".page #viewStockBtn").text("HIDE");

    } else {
      //$$(".page #stockBinding, .page #stockLength, .page #stockDepth, .page #stockDFT, .page #stockWingAngle").text("");
      //$$(".page #viewStockBtn i").text("more_vertical_round");
      $$(".page #viewStockBtn").text("STOCK");

      $$('#stockSettingsDiv').animate(
        /* CSS properties to animate, e.g.: */
        {
          'height': '0px',
          'opacity': 0
        },
        /* Animation parameters */
        {
            // Animation duraion in ms, optional (default to 300)
            duration: 200,
            // Animation easing, optional (default to 'swing'), can be also 'linear'
            easing: 'swing',
            /* Callbacks */
            // Animation begins, optional
            begin: function (elements) {
                console.log('animation began');
            },
            // Animation completed, optional
            complete: function (elements) {
                console.log('animation completed');
                $$("#stockSettingsDiv").html('');
            },
            // Animation in progress, optional
            progress: function (elements, complete, remaining, start) {
                /* Where
                complete - The call's completion percentage (as a decimal value)
                remaining - How much time remains until the call completes (in ms)
                start - The absolute time at which the call began (in ms)
                */
                console.log('animation in progress');
            }
        }
      );



    }
  //}
}







//$$('.create-popup').on('click', function () {

function viewHistory() {
  var metaNotes=false;
  var notesIdArray=[];
	console.log('viewHistory function');
  if (offline) return onOffline();

          if (typeof thisSetting === "undefined") {
            myApp.alert(
              'No History is available yet.  After you make your first settings change, you will be able to view all setting changes here.',
              'No History Available.',
              function () {
                null;
              }
            );
            return null;
          }

          var url=wsURL+'ws_get_settings_history_ret_json.php';

        	$$.ajax({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSetting.ski_id },type:'POST',dataType: 'json'
  				,success:function(json_Obj) {
  						console.log('ajax success.');
  						if (json_Obj.length>0) { // RETURNED RESULTS
                console.log('json length is ' + json_Obj.length);

            		if (json_Obj[0].RETURN_CODE==1) {

                  console.log('json_Obj is ' + json_Obj);

                  window.popupHTML = '<div class="popup popup-history">';
                      popupHTML+='<div class="closePopup"><a href="#" class="close-popup"><i class="icon f7-icons">close_round</i></a></div>';
                      popupHTML+='<div class="content-block"></div>';
                      //popupHTML+='<p><a href="#" class="close-popup">Close me</a></p>';
                      popupHTML+='<div class="content-block-title">Setup History for '+thisSki.my_ski_name+'</div>';
                      popupHTML+='<div class="list-block">';
                      popupHTML+='<ul id="ulHistory">';

                  $$.each(json_Obj, function( index, value ) {
                    popupHTML+='<li class="accordion-item item_'+index+'"><a href="#" class="item-content item-link lightOrangeBG">';
                    popupHTML+='<div class="item-inner">';
                    popupHTML+='<div class="item-title">'+value.date_time_created;
                    if (value.current==1) {
                      popupHTML+='<span class="smallText">(current)</span></div>';
                    } else {
                      popupHTML+='</div>';
                    }
                    popupHTML+='</div></a>';
                    popupHTML+='<div class="accordion-item-content">';
                    //popupHTML+='<div class="content-block"></div>';

                      popupHTML+='<div class="data-table">';
                      popupHTML+='<table>';
                      popupHTML+='<thead>';
                      popupHTML+='<tr>';
                      popupHTML+='<th class="numeric-cell">Binding</th>';
                      popupHTML+='<th class="numeric-cell">Length</th>';
                      popupHTML+='<th class="numeric-cell">Depth</th>';
                      popupHTML+='<th class="numeric-cell">DFT</th>';
                      popupHTML+='<th class="numeric-cell">Wing</th>';
                      popupHTML+='</tr>';
                      popupHTML+='</thead>';
                      popupHTML+='<tbody>';
                      popupHTML+='<tr>';
                      popupHTML+='<td class="numeric-cell">' +value.front_binding+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.length+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.depth+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.dft+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.wing_angle+ '</td>';
                      popupHTML+='</tr>';
                      popupHTML+='<tr>';
                      popupHTML+='<td class="numeric-cell">' +value.measure_binding+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.measure_length+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.measure_depth+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +value.measure_dft+ '</td>';
                      popupHTML+='<td class="numeric-cell"></td>';
                      popupHTML+='</tr>';
                      popupHTML+='</tbody>';
                      popupHTML+='</table>';
                      popupHTML+='</div>';

                      popupHTML+='<div class="center">';
                      if (value.leading_edge>0) {
                        popupHTML+='<div class="chip">';
                        popupHTML+='<div class="chip-label">LE: '+value.leading_edge+'</div>';
                        popupHTML+='</div> ';
                      }
                      if (value.binding_to_le>0) {
                        popupHTML+=' <div class="chip">';
                        popupHTML+='<div class="chip-label">B-LE: '+value.binding_to_le+'</div>';
                        popupHTML+='</div>';
                      }
                      popupHTML+='</div>';

                      if (value.notes) {
                        popupHTML+='<div class="metaNotes" id="note_'+value.notes+'"></div>';
                        notesIdArray.push(value.notes);
                        metaNotes=true;
                      }
                    //popupHTML+='<div class="notesPopUpHistory">Notes:</div><div class="notesPopUpDetails">' +value.notes+ '</div>';
                    /*
                      if (value.notes_array) {
                        window.theString=value.notes_array;
                        window.stringArray='['+theString+']';
                        window.notesObj = JSON.parse(stringArray);
                        $$.each(notesObj, function( index, value ) {
                          popupHTML+="<div class='historyNotesHdr'>"+getLocalDateTimeString(value.date_time,'pretty')+"<span class='floatRight'>"+value.water_temp+"</span></div>";
                          popupHTML+="<div class='historyNotes'>"+value.notes+"</div>";
                        });
                      }
                      */

//var objA = JSON.parse('{"notes":"Another note for diff settings.  Note 1.", "water_temp":"72"},{"notes":"And yet another note for the 2nd setting.  Take 2", "water_temp":"68"}');


// THIS STRUCURE WORKED
//var objA = JSON.parse('[{"notes":"Another note for diff settings.  Note 1.", "water_temp":"72"},{"notes":"Another note for diff settings.  Note 2.", "water_temp":"552"}]');


                    //popupHTML+='</div>'; // END CONTENT block
                    popupHTML+='</div>'; // END accordian
                    popupHTML+='</li>';
            			});

                  popupHTML+='</div>'; // end class popup
                  myApp.popup(popupHTML,true);


  							} else {
                  //delete thisSetting;
                  //$("#profileBtn").hide();
                  console.log('return code is NOT 1');
                }
  						}
        		}, complete: function(xhr, status){
                console.log('ajax complete for viewHistory.')
        				console.log('status is ' + status + ' xhr is ' + xhr.responseText);
                var jsonObjLength=JSON.parse(xhr.responseText).length;

                myApp.accordionOpen('.item_0');
                //if ($$("#ulHistory li").hasClass("item_1")) {
                if (jsonObjLength>1) {
                  myApp.accordionOpen('.item_1');
                }
                if (metaNotes) { // THERE ARE NOTES IN THIS HISTORY
                  getHistoryNotes(notesIdArray);
                }
                //mainView.router.load( { url:'mySettings.html' });
                //myApp.closeModal('.login-screen', true);
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
                console.log('user_name='+thisUser.user_name);
                  //jQuery('.upd').remove();
                  //jQuery('#submit_unassigned_results').html('');
                  //jQuery('#unassigned_list').html('<span class="upd">Retrieving data...</span>');
  							} // END before Send
          });
} // END FUNCTION


function getHistoryNotes(notesIdArray) {
  console.log("in history notes " + notesIdArray.toString() );
  var setting_id=notesIdArray.toString();
  if (offline) return onOffline();

  var url=wsURL+'ws_get_settings_history_notes_ret_json.php';

  $$.ajax({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSetting.ski_id, setting_id:setting_id },type:'POST',dataType: 'json'
  ,success:function(json_Obj) {
      console.log('ajax success.');
      if (json_Obj.length>0) { // RETURNED RESULTS
        console.log('json length is ' + json_Obj.length);

        if (json_Obj[0].RETURN_CODE==1) {

          console.log('json_Obj is ' + json_Obj);

          $$.each(json_Obj, function( index, value ) {
            var noteStr='';
            noteStr+="<div class='historyNotesHdr'>"+getLocalDateTimeString(value.date_time,'pretty');
            if (value.water_temp>0){
              noteStr+="<span class='floatRight'>Water: "+value.water_temp+"&deg; "+value.water_temp_scale+"</span>";
            }
            noteStr+="</div>";
            noteStr+="<div class='historyNotes'>"+value.notes+"</div>";
            console.log(noteStr);
            $$("#note_"+value.setting_id).append(noteStr);
          });



        } else {
          console.log('return code is NOT 1');
        }
      }
    }, complete: function(xhr, status){
        console.log('ajax complete for viewNotes.')
        console.log('status is ' + status + ' xhr is ' + xhr.responseText);
        var jsonObjLength=JSON.parse(xhr.responseText).length;
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
}


function cancelSave () {
  populateCurrentSettings();
  $$(".page .slideAdjust").css('display','none');
  $$(".page #editFinBtn").text("Edit");
  $$("#mySettingsBinding, #mySettingsLength, #mySettingsDepth, #mySettingsDFT, #myNewLE, #myNewBindToLE, #LE_diff, #B_LE_diff").html('');
  $$(".page #summary_POS").hide();
}


function toggleEditFin () {
  if ( $$(".page .slideAdjust").css('display') == 'none' )  {// Makes the settings editable
    if (isAndroid) {
      $$(".overFlowHidden").css('width','initial');
    }
    $$(".page .slideAdjust").css('display','inline-block');
    $$(".page #editFinBtn").text("Save");
    $$("#dateCreated").html("<a href='#' id='cancelSaveBtn'>Cancel</a>");
    $$(".page #summary_POS").show();

    $$(".page #mySettingsBinding").html(thisUser.measure_binding);
    $$(".page #mySettingsLength").html(thisUser.measure_length);
    $$(".page #mySettingsDepth").html(thisUser.measure_depth);
    $$(".page #mySettingsDFT").html(thisUser.measure_dft);

    // BLOCKS below address cases where there are NO stock settings in the database...set to base defaults
    if (parseFloat($$("#myCurrentBinding").text() ) <= 0 ) { $$("#myCurrentBinding").text("29.50"); $$(".page #stockBinding").html("Estimated"); }
    if (parseFloat($$("#myCurrentLength").text() ) <= 0 ) { $$("#myCurrentLength").text("6.900"); $$(".page #stockLength").html("Estimated"); }
    if (parseFloat($$("#myCurrentDepth").text() ) <= 0 ) { $$("#myCurrentDepth").text("2.500"); $$(".page #stockDepth").html("Estimated"); }
    if (parseFloat($$("#myCurrentDFT").text() ) <= 0 ) { $$("#myCurrentDFT").text("0.750"); $$(".page #stockDFT").html("Estimated"); }
    if (parseFloat($$("#myCurrentWingAngle").text() ) <= 0 ) { $$("#myCurrentWingAngle").text("7.00"); $$(".page #stockWingAngle").html("Estimated"); }

  } else { // Changes mode back to disabled and saves the settings
    $$(".page .slideAdjust").css('display','none');
    $$(".page #editFinBtn").text("Edit");

    $$(".page #summary_POS").hide();
    $$("#mySettingsBinding, #mySettingsLength, #mySettingsDepth, #mySettingsDFT").html('');
    //$$(".page #editFinBtn").removeClass('saveClass');
    // NOTE, but a check here to see if any settings have been changed before saving

    var front_binding=$$("#myCurrentBinding").text();
    var length=$$("#myCurrentLength").text();
    var depth=$$("#myCurrentDepth").text();
    var dft=$$("#myCurrentDFT").text();
    var wing_angle=$$("#myCurrentWingAngle").text();
    var leading_edge=$$("#myNewLE").text() ? $$("#myNewLE").text() : $$(".page #myCurrentLE").text();
    var binding_to_le=$$("#myNewBindToLE").text() ? $$("#myNewBindToLE").text() : $$(".page #myCurrentBindToLE").text();
    var measure_binding = thisUser.measure_binding;
    var measure_length = thisUser.measure_length;
    var measure_depth = thisUser.measure_depth;
    var measure_dft = thisUser.measure_dft
    var date_time_created=getLocalDateTimeString(null,"ISO");
    var date_time_created_pretty=getLocalDateTimeString(null,"pretty");

    // SEE IF ANY SETTINGS HAVE CHANGED BEFORE saving
    //console.log("fb" + front_binding + " l " + length + " w " + wing_angle);
    if (
      parseFloat(front_binding).toFixed(4)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.front_binding : thisSki.stock_binding_location)).toFixed(4) &&
      parseFloat(length).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.length : thisSki.stock_fin_length)).toFixed(3) &&
      parseFloat(depth).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.depth : thisSki.stock_fin_depth)).toFixed(3) &&
      parseFloat(dft).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.dft : thisSki.stock_fin_dft)).toFixed(3) &&
      parseFloat(wing_angle).toFixed(2)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.wing_angle : thisSki.stock_wing_angle)).toFixed(2)
    ) {
      myApp.alert(
        'No settings have been changed.  Save has been canceled.',
        'No Setting Changes.',
        function () {
          null;
        }
      );
      return false;
    }


    console.log('date time is: ' + date_time_created);
    if (offline) return onOffline();

    var url=wsURL+'ws_add_cur_settings_ret_json.php';

    $$.ajax({url:url,data:{ user_name:thisUser.user_name,ski_id:thisSki.id,front_binding:front_binding,length:length,depth:depth,dft:dft,wing_angle:wing_angle,leading_edge:leading_edge,binding_to_le:binding_to_le,measure_binding:measure_binding,measure_length:measure_length,measure_depth:measure_depth,measure_dft:measure_dft,date_time_created:date_time_created},type:'POST',dataType: 'json'
    ,success:function(json_Obj) {
        console.log('ajax success.');
        if (json_Obj.length>0) { // RETURNED RESULTS
          if (json_Obj[0].RETURN_CODE==1) {
            console.log('settings saved');
            console.log('json_Obj is ' + json_Obj);
            console.log('insertid is ' + json_Obj[0].INSERT_ID);

            if (typeof thisSetting === "undefined") {
              const thisSetting = new Settings(json_Obj[0].INSERT_ID, thisUser.user_name, thisSki.id, front_binding, length, depth, dft, wing_angle, leading_edge, binding_to_le, measure_binding, measure_length, measure_depth, measure_dft, date_time_created);
              window.thisSetting = thisSetting;
            } else {
              thisSetting.id=json_Obj[0].INSERT_ID;
              thisSetting.front_binding = front_binding;
              thisSetting.length = length;
              thisSetting.depth = depth;
              thisSetting.dft = dft;
              thisSetting.wing_angle = wing_angle;
              thisSetting.leading_edge = leading_edge;
              thisSetting.binding_to_le = binding_to_le;

              thisSetting.measure_binding = thisUser.measure_binding;
              thisSetting.measure_length = thisUser.measure_length;
              thisSetting.measure_depth = thisUser.measure_depth;
              thisSetting.measure_dft = thisUser.measure_dft;

              thisSetting.date_time_created = date_time_created_pretty;
            }
          } else {
            //delete thisSetting;
            //$("#profileBtn").hide();
            console.log('NOT SAVED: return code is NOT 1');
          }
        }
      }, complete: function(){
          console.log('ajax complete for save Settings.');
          populateCurrentSettings();
          //$$("#stockBinding, #stockLength, #stockDepth, #stockDFT, #stockWingAngle").text('');
          $$("#mySettingsBinding, #mySettingsLength, #mySettingsDepth, #mySettingsDFT, #myNewLE, #myNewBindToLE").html('');
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
          console.log('user_name='+thisUser.user_name);
          } // END before Send
    }); // END SAVE via AJAX

  }

}


// INITIALIZE slider
function init_slider() {
  toggleEditFin();
bVal=$$(".page #myCurrentBinding").text();

minVal=Number(bVal) - Number(.500);
maxVal=Number(bVal) + Number(.500);
$$(".page #bindingRange").attr("value", bVal);
$$(".page #bindingRange").attr("min", minVal );
$$(".page #bindingRange").attr("max", maxVal );


lVal=$$(".page #myCurrentLength").text();
lminVal=Number(lVal) - Number(.012);
lmaxVal=Number(lVal) + Number(.012);
$$(".page #lengthRange").attr("value", lVal);
$$(".page #lengthRange").attr("min", lminVal );
$$(".page #lengthRange").attr("max", lmaxVal );


dVal=$$(".page #myCurrentDepth").text();
dminVal=Number(dVal) - Number(.012);
dmaxVal=Number(dVal) + Number(.012);
$$(".page #depthRange").attr("value", dVal);
$$(".page #depthRange").attr("min", dminVal );
$$(".page #depthRange").attr("max", dmaxVal );


dftVal=$$(".page #myCurrentDFT").text();
dftminVal=Number(dftVal) - Number(.012);
dftmaxVal=Number(dftVal) + Number(.012);
$$(".page #dftRange").attr("value", dftVal);
$$(".page #dftRange").attr("min", dftminVal );
$$(".page #dftRange").attr("max", dftmaxVal );


wVal=$$(".page #myCurrentWingAngle").text();
wminVal=Number(wVal) - Number(2);
wmaxVal=Number(wVal) + Number(2);
$$(".page #wingRange").attr("value", wVal);
$$(".page #wingRange").attr("min", wminVal );
$$(".page #wingRange").attr("max", wmaxVal );
}




// UPDATE VALUE REAL TIME BASED ON SLIDER POSITION
$$(document).on('touchmove', '.page #bindingRange , .page #lengthRange , .page #depthRange , .page #dftRange , .page #wingRange', function (e) {
    sliderNumberString=$$(this).val(); // get value from slider
    //console.log('sliderNumberString is ' + sliderNumberString);

    if (this.id == 'bindingRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(4);
      $$(".page #myCurrentBinding").text(sliderValue); // put in view
      if (typeof thisSetting !== "undefined") {
        $$("#stockBinding").text( (sliderValue - parseFloat(thisSetting.front_binding)).toFixed(4) );
      } else {
        $$("#stockBinding").text( (sliderValue - parseFloat(thisSki.stock_binding_location)).toFixed(4) );
      }
      calculateBindingToLE();
    }
    if (this.id == 'lengthRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentLength").text(sliderValue); // put in view
      if (typeof thisSetting !== "undefined") {
        $$("#stockLength").text( (sliderValue - parseFloat(thisSetting.length)).toFixed(3) );
      } else {
        $$("#stockLength").text( (sliderValue - parseFloat(thisSki.stock_fin_length)).toFixed(3) );
      }
      calculateLE();
      calculateBindingToLE();

    }
    if (this.id == 'depthRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentDepth").text(sliderValue); // put in view
      if (typeof thisSetting !== "undefined") {
        $$("#stockDepth").text( (sliderValue - parseFloat(thisSetting.depth)).toFixed(3) );
      } else {
        $$("#stockDepth").text( (sliderValue - parseFloat(thisSki.stock_fin_depth)).toFixed(3) );
      }

    }
    if (this.id == 'dftRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentDFT").text(sliderValue); // put in view
      if (typeof thisSetting !== "undefined") {
        $$("#stockDFT").text( (sliderValue - parseFloat(thisSetting.dft)).toFixed(3) );
      } else {
        $$("#stockDFT").text( (sliderValue - parseFloat(thisSki.stock_fin_dft)).toFixed(3) );
      }
      calculateLE();
      calculateBindingToLE();

    }
    if (this.id == 'wingRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(2);
      $$(".page #myCurrentWingAngle").text(sliderValue); // put in view
      if (typeof thisSetting !== "undefined") {
        $$("#stockWingAngle").text( (sliderValue - parseFloat(thisSetting.wing_angle)).toFixed(2) );
      } else {
        $$("#stockWingAngle").text( (sliderValue - parseFloat(thisSki.stock_wing_angle)).toFixed(2) );
      }
    }

});


$$(document).on('touchend', '.page #bindingRange , .page #lengthRange , .page #depthRange , .page #dftRange , .page #wingRange', function (e) {
    currentValue=$$(this).val();
    switch (this.id) {
      case 'bindingRange':
        updateSlider(this,currentValue,.500,.0625);
        break;

      case 'wingRange':
        updateSlider(this,currentValue,2,.25);
        break;

      default:
        updateSlider(this,currentValue,.012,.001);
        break;
    }
    console.log("this object is " + this.id)
});



// UPDATES RANGE SLIDER AFTER touchend event, so that it can continually be dragged to adjust settings in small/configured increments
function updateSlider(obj,currentValue,plusMinusRange,increment) {
  minVal=Number(currentValue) - Number(plusMinusRange);
  maxVal=Number(currentValue) + Number(plusMinusRange);
  obj.value=currentValue;
  obj.min=minVal;
  obj.max=maxVal;
  obj.step=increment;
  console.log('object value is ' + obj.value)
}

function calculateLE (change) {
  var length =parseFloat($$(".page #myCurrentLength").text());
  var dft =parseFloat($$(".page #myCurrentDFT").text());
  var LE = (length+dft).toFixed(3);

  // get leading edge if in settings or from stock ski settings
  if (typeof thisSetting != "undefined") {
    thisLE=Number(thisSetting.leading_edge).toFixed(3);
  } else {
    thisLE=(Number(thisSki.stock_fin_dft) + Number(thisSki.stock_fin_length)).toFixed(3);
  }

  var LE_diff=(LE-thisLE).toFixed(3);
  if (LE_diff==0) {
    LE_diff=" Neutral";
  } else {
    if (LE_diff>0) LE_diff=LE_diff.replace( /^0+/,"") + " Forward";
    else LE_diff=LE_diff.replace( /^-0+/,"") + " Backward";
  }

  $$(".page #myNewLE").text(LE);
  $$(".page #LE_diff").text(LE_diff);
}

function calculateBindingToLE (change) {
  var binding = parseFloat($$(".page #myCurrentBinding").text());
  var length = parseFloat($$(".page #myCurrentLength").text());
  var dft = parseFloat($$(".page #myCurrentDFT").text());
  var BindingToLE = (binding-(length+dft)).toFixed(4);

  // get binding to leading edge if in settings or from stock ski settings
  if (typeof thisSetting != "undefined") {
    this_B_LE=Number(thisSetting.binding_to_le).toFixed(4);
  } else {
    this_B_LE=(Number(thisSki.stock_binding_location) - (Number(thisSki.stock_fin_dft) + Number(thisSki.stock_fin_length))).toFixed(4);
  }

  var B_LE_diff=(BindingToLE-this_B_LE).toFixed(4);
  if (B_LE_diff==0) {
    B_LE_diff=" Neutral";
  } else {
    if (B_LE_diff>0) B_LE_diff = B_LE_diff.replace( /^0+/,"") + " Longer";
    else B_LE_diff = B_LE_diff.replace( /^-0+/,"") +  " Shorter";
  }

  $$(".page #myNewBindToLE").text(BindingToLE);
  $$(".page #B_LE_diff").text(B_LE_diff);
}




// popup screen for user to add notes on existing settings
function AddNotePopUp() {
	console.log('AddNotePopUp function');

          if (typeof thisSetting === "undefined") {
            myApp.alert(
              'No settings have been saved to add notes.  After you make your first settings change, you will be able to add multiple notes here.',
              'No Settings Available.',
              function () {
                null;
              }
            );
            return null;
          }




      popupNote = '<div class="popup popup-notes">';
          popupNote+='<div class="closePopup"><a href="#" class="close-popup"><i class="icon f7-icons">close_round</i></a></div>';
          popupNote+='<div class="content-block"></div>';
          popupNote+='<div class="content-block-title">Add Setting Note</div>';

          if (thisSki.my_ski_name) {
            popupNote+='<div class="content-block bold">'+thisSki.my_ski_name+'</div>';
          } else {
            popupNote+='<div class="content-block bold">'+thisSki.length + " " + thisSki.brand + " " + thisSki.model + " " + thisSki.year+'</div>';
          }

          popupNote+='<div class="list-block" id="addNoteSettingsTable">';

          popupNote+='<div class="data-table">';
          popupNote+='<table>';
          popupNote+='<thead>';
          popupNote+='<tr>';
          popupNote+='<th class="numeric-cell">Binding</th>';
          popupNote+='<th class="numeric-cell">Length</th>';
          popupNote+='<th class="numeric-cell">Depth</th>';
          popupNote+='<th class="numeric-cell">DFT</th>';
          popupNote+='<th class="numeric-cell">Wing</th>';
          popupNote+='</tr>';
          popupNote+='</thead>';
          popupNote+='<tbody>';
          popupNote+='<tr>';
          popupNote+='<td class="numeric-cell">' +thisSetting.front_binding+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.length+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.depth+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.dft+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.wing_angle+ '</td>';
          popupNote+='</tr>';
          popupNote+='<tr>';
          popupNote+='<td class="numeric-cell">' +thisSetting.measure_binding+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.measure_length+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.measure_depth+ '</td>';
          popupNote+='<td class="numeric-cell">' +thisSetting.measure_dft+ '</td>';
          popupNote+='<td class="numeric-cell"></td>';
          popupNote+='</tr>';
          popupNote+='</tbody>';
          popupNote+='</table>';
          popupNote+='</div>'; // end data-table
          popupNote+='</div>'; // end list-block

          popupNote+='<div class="list-block">';
          popupNote+='<ul>';
          popupNote+='<li class="align-top">';
          popupNote+='<div class="item-content">';
          popupNote+='<div class="item-media"><i class="icon f7-icons">compose</i></div>';
          popupNote+='<div class="item-inner">';
          //popupNote+='<div class="item-title label">Notes</div>';
          popupNote+='<div class="item-input">';
          popupNote+='<textarea name="notes" id="notes" placeholder="Add notes..."></textarea>';
          popupNote+='</div>';
          popupNote+='</div>';
          popupNote+='</div>';
          popupNote+='</li>';
          popupNote+='<li class="align-top">';
          popupNote+='<div class="item-content">';
          popupNote+='<div class="item-media"><div id="note_water_temp"><img src=img/water_temp3.png width="24px" heigh="24px" /></div><span id="note_water_deg"></span><span id="notes_scale"></span></div>';
          //popupNote+='<div id="note_water_temp">Water Temp</div><span id="notes_scale"></span>';
          popupNote+='<div class="item-inner">';
          //popupNote+='<div class="item-title label">Notes</div>';
          popupNote+='<div class="item-input">';
          if (thisUser.measure_water_temp=="C") {
            popupNote+='<div class="range-slider"><input type="range" min="15" max="37" value="28" step="1" id="note_temp_slider"></div>';
          } else {
            popupNote+='<div class="range-slider"><input type="range" min="60" max="99" value="75" step="1" id="note_temp_slider"></div>';
          }
          popupNote+='</div>';
          popupNote+='</div>';
          popupNote+='</div>';
          popupNote+='</li>';
          popupNote+='</ul>';
          popupNote+='</div>'; // END LIST-BLOCK


          popupNote+='<div class="content-block"><a href="#" class="inlineBlock whiteTransBG button margin-right_1em" id="addNoteBtn">Add Note</a></div>';
          //popupNote+='<a href="#" class="inlineBlock whiteTransBG margin-left_1em button close-popup">Cancel</a>';


          popupNote+='</div>'; // end popup class

      myApp.popup(popupNote,true);
} // END AddNote FUNCTION


function addNote() {
  console.log('AddNote function');
  if (offline) return onOffline();

  var notes=$$(".popup #notes").val();
  notes = notes.replace(/(\r\n|\n|\r)/g,'<br>'); // replace line returns with br tags...make sure br tags are allowed in php when stripping
  var date_time=getLocalDateTimeString(null,"ISO");
  var water_temp=$$(".popup #note_water_temp").text();
  var passed=false;

  var url=wsURL+'ws_set_settings_note_ret_json.php';

  $$.ajax({url:url,data:{user_name:thisUser.user_name,ski_id:thisSetting.ski_id,setting_id:thisSetting.id,notes:notes,water_temp:water_temp,water_temp_scale:thisUser.measure_water_temp,date_time:date_time },type:'POST',dataType: 'json'
  ,success:function(json_Obj) {
      console.log('ajax success.');
      if (json_Obj.length>0) { // RETURNED RESULTS
        console.log('json length is ' + json_Obj.length);
        if (json_Obj[0].RETURN_CODE==1) {
          console.log('json_Obj is ' + json_Obj);
          passed=true;
        } else {
          console.log('return code is NOT 1');
        }
      }
    }, complete: function(xhr, status){
        console.log('ajax complete for viewHistory.')
        console.log('status is ' + status);
        if (passed) {
          myApp.closeModal();
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
}



$$(document).on('touchmove', '.popup  #note_temp_slider', function (e) {
  console.log("in touchmove for notes temperature");
    noteTempString=$$(this).val(); // get value from slider

      //sliderValue=parseInt(noteTempString);
      $$(".popup #note_water_temp").text(noteTempString); // put in view.  This data sent/saved
      $$(".popup #note_water_deg").html('&deg; '); // put in view
      $$(".popup #notes_scale").text(thisUser.measure_water_temp); // put in view.  This data sent/saved

});
