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

  if (typeof thisSki != "undefined") {
    if (thisSki.my_ski_name) {
      $$(".page #myCurrentSki").text(thisSki.my_ski_name);
    } else {
      var skiName=thisSki.length + " " + thisSki.brand + " " + thisSki.model + " " + thisSki.year;
      $$(".page #myCurrentSki").text(skiName);
    }
  } else { // IF USER HAS NO SKI's SELECTED, Like first time entry, direct to ski selection page
    if (viewCounter<1) {
      viewCounter++;
      myApp.alert(
        'First you must select a ski to start saving your settings.  Select OK below to continue.',
        'Welcome!',
        function () {
          mainView.router.load( { url:'mySkis.html' });
        }
      );
    }
  }
}

function populateCurrentSettings() {
  if (typeof thisSetting != "undefined") {
    console.log("ObjectthisSetting IS DEFINED");
    if (thisSetting.ski_id) {
      $$(".page #dateCreated").html(thisSetting.date_time_created);
      $$(".page #myCurrentBinding").html(thisSetting.front_binding);
      $$(".page #myCurrentLength").html(thisSetting.length);
      $$(".page #myCurrentDepth").html(thisSetting.depth);
      $$(".page #myCurrentDFT").html(thisSetting.dft);
      $$(".page #myCurrentWingAngle").html(thisSetting.wing_angle);

      $$(".page #mySettingsBinding").html(thisSetting.measure_binding);
      $$(".page #mySettingsLength").html(thisSetting.measure_length);
      $$(".page #mySettingsDepth").html(thisSetting.measure_depth);
      $$(".page #mySettingsDFT").html(thisSetting.measure_dft);

      if ( $$(".page #dateCreated , .page .measureOverlay").hasClass('redText') ) { // redText class is for stock settings only when initially loaded
        $$(".page #dateCreated , .page .measureOverlay").removeClass('redText');
      }
    }
  } else {
    console.log("object thisSetting is undefined");
    if (typeof thisSki != "undefined") {
      $$(".page #dateCreated").html('Stock Settings');
      $$(".page #myCurrentBinding").html(thisSki.stock_binding_location);
      $$(".page #myCurrentLength").html(thisSki.stock_fin_length);
      $$(".page #myCurrentDepth").html(thisSki.stock_fin_depth);
      $$(".page #myCurrentDFT").html(thisSki.stock_fin_dft);
      $$(".page #myCurrentWingAngle").html(thisSki.stock_wing_angle);

      $$(".page #mySettingsBinding").html(thisSki.measure_binding);
      $$(".page #mySettingsLength").html(thisSki.measure_length);
      $$(".page #mySettingsDepth").html(thisSki.measure_depth);
      $$(".page #mySettingsDFT").html(thisSki.measure_dft);

      $$(".page #dateCreated , .page .measureOverlay").addClass('redText');
      //$$("#viewStockBtn").hide();
    }
  }
}


function toggleViewStock() {
//  if (typeof thisSetting != "undefined") {
    //if ($$(".page #viewStockBtn i").text() == "more_vertical_round") {
    if ($$(".page #viewStockBtn").text() == "STOCK") {

/*
      var diffLength=parseFloat( (parseFloat(thisSetting.length*100) - parseFloat(thisSki.stock_fin_length)*100) / 100).toFixed(3) ;
      var diffDepth=parseFloat( (parseFloat(thisSetting.depth*100) - parseFloat(thisSki.stock_fin_depth)*100) / 100).toFixed(3) ;
      var diffDFT=parseFloat( (parseFloat(thisSetting.dft*100) - parseFloat(thisSki.stock_fin_dft)*100) / 100).toFixed(3) ;
      var diffWingAngle=parseFloat( (parseFloat(thisSetting.wing_angle*100) - parseFloat(thisSki.stock_wing_angle)*100) / 100).toFixed(3) ;
*/
/*    //below lines are to calculate differences of user changing settings compared to stock
      var diffBinding=parseFloat( (parseFloat(thisSetting.front_binding*100) - parseFloat(thisSki.stock_binding_location)*100) / 100).toFixed(3) ;
      var diffLength=parseFloat( (parseFloat(thisSetting.length*100) - parseFloat(thisSki.stock_fin_length)*100) / 100).toFixed(3) ;
      var diffDepth=parseFloat( (parseFloat(thisSetting.depth*100) - parseFloat(thisSki.stock_fin_depth)*100) / 100).toFixed(3) ;
      var diffDFT=parseFloat( (parseFloat(thisSetting.dft*100) - parseFloat(thisSki.stock_fin_dft)*100) / 100).toFixed(3) ;
      var diffWingAngle=parseFloat( (parseFloat(thisSetting.wing_angle*100) - parseFloat(thisSki.stock_wing_angle)*100) / 100).toFixed(3) ;

/*    // below lines are for putting stock settings next to users settings...didn't like this so moved under MY SKI
      $$(".page #stockBinding").html( thisSki.stock_binding_location + "<br />(" +diffBinding + ")" );
      $$(".page #stockLength").html( thisSki.stock_fin_length + "<br />(" +diffLength + ")");
      $$(".page #stockDepth").html( thisSki.stock_fin_depth + "<br />(" +diffDepth + ")");
      $$(".page #stockDFT").html( thisSki.stock_fin_dft + "<br />(" +diffDFT + ")");
      $$(".page #stockWingAngle").html( thisSki.stock_wing_angle + "<br />(" +diffWingAngle + ")");
*/
      stockHTML ='<div id="stockSettings">';
      stockHTML+='<div class="data-table">';
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


      //$$("#stockSettingsDiv").css("height","100%");

      $$("#stockSettingsDiv").animate(
        /* CSS properties to animate, e.g.: */
        {
            'height': 38,
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
      $$(".page #stockBinding, .page #stockLength, .page #stockDepth, .page #stockDFT, .page #stockWingAngle").text("");
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

  				console.log('viewHistory function');

          if (typeof thisSetting == "undefined") {
            myApp.alert(
              'No History is available yet.  After you make your first settings change, you will be able to view all setting changes here.',
              'No History Available.',
              function () {
                null;
              }
            );
            return null;
          }

          var url='http://finappv2.paulsantangelo.com/ws/ws_get_settings_history_ret_json.php';

        	$$.ajax({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSetting.ski_id },type:'POST',dataType: 'json'
  				,success:function(json_Obj) {
  						console.log('ajax success.');
  						if (json_Obj.length>0) { // RETURNED RESULTS
                console.log('json length is ' + json_Obj.length);

            		if (json_Obj[0].RETURN_CODE==1) {

                  console.log('json_Obj is ' + json_Obj);

                  var popupHTML = '<div class="popup popup-history">';
                      popupHTML+='<div class="closePopup"><a href="#" class="close-popup"><i class="icon f7-icons">close_round</i></a></div>';
                      popupHTML+='<div class="content-block"></div>';
                      //popupHTML+='<p><a href="#" class="close-popup">Close me</a></p>';
                      popupHTML+='<div class="content-block-title">Fin History</div>';
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

                    //popupHTML+='<div class="notesPopUpHistory">Notes:</div><div class="notesPopUpDetails">' +value.notes+ '</div>';

                    //popupHTML+='</div>'; // END CONTENT block
                    popupHTML+='</div>'; // END accordian
                    popupHTML+='</li>';
            			});

                  popupHTML+='</div>'; // end class popup
                  myApp.popup(popupHTML);


  							} else {
                  delete thisSetting;
                  //$("#profileBtn").hide();
                  console.log('return code is NOT 1');
                }
  						}
        		}, complete: function(xhr, status){
                console.log('ajax complete for viewHistory.')
        				console.log('status is ' + status);
                var jsonObjLength=JSON.parse(xhr.responseText).length;

                myApp.accordionOpen('.item_0');
                //if ($$("#ulHistory li").hasClass("item_1")) {
                if (jsonObjLength>1) {
                  myApp.accordionOpen('.item_1');
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



function cancelSave () {
  populateCurrentSettings();
  $$(".page .slideAdjust").css('display','none');
  $$(".page #editFinBtn").text("Edit");
}


function toggleEditFin () {
  if ( $$(".page .slideAdjust").css('display') == 'none' ) {
    if (isAndroid) {
      $$(".overFlowHidden").css('width','initial');
    }
    $$(".page .slideAdjust").css('display','inline-block');
    $$(".page #editFinBtn").text("Save");
    $$("#dateCreated").html("<a href='#' id='cancelSaveBtn'>Cancel</a>");
    //$$(".page #editFinBtn").addClass('saveClass');
  } else {
    $$(".page .slideAdjust").css('display','none');
    $$(".page #editFinBtn").text("Edit");
    //$$(".page #editFinBtn").removeClass('saveClass');
    // NOTE, but a check here to see if any settings have been changed before saving

    var front_binding=$$("#myCurrentBinding").text();
    var length=$$("#myCurrentLength").text();
    var depth=$$("#myCurrentDepth").text();
    var dft=$$("#myCurrentDFT").text();
    var wing_angle=$$("#myCurrentWingAngle").text();
    var measure_binding = thisUser.measure_binding;
    var measure_length = thisUser.measure_length;
    var measure_depth = thisUser.measure_depth;
    var measure_dft = thisUser.measure_dft
    var date_time_created=getLocalDateTimeString("ISO");
    var date_time_created_pretty=getLocalDateTimeString("pretty");




    console.log('date time is: ' + date_time_created);

    var url='http://finappv2.paulsantangelo.com/ws/ws_add_cur_settings_ret_json.php';

    $$.ajax({url:url,data:{ user_name:thisUser.user_name,ski_id:thisSki.id,front_binding:front_binding,length:length,depth:depth,dft:dft,wing_angle:wing_angle,measure_binding:measure_binding,measure_length:measure_length,measure_depth:measure_depth,measure_dft:measure_dft,date_time_created:date_time_created},type:'POST',dataType: 'json'
    ,success:function(json_Obj) {
        console.log('ajax success.');
        if (json_Obj.length>0) { // RETURNED RESULTS
          if (json_Obj[0].RETURN_CODE==1) {
            console.log('settings saved');
            console.log('json_Obj is ' + json_Obj);
            console.log('insertid is ' + json_Obj[0].INSERT_ID);

            if (typeof thisSetting == "undefined") {
              const thisSetting = new Settings(json_Obj[0].INSERT_ID, thisUser.user_name, thisSki.id, front_binding, length, depth, dft, wing_angle, measure_binding, measure_length, measure_depth, measure_dft, date_time_created);
              window.thisSetting = thisSetting;
            } else {
              thisSetting.id=json_Obj[0].INSERT_ID;
              thisSetting.front_binding = front_binding;
              thisSetting.length = length;
              thisSetting.depth = depth;
              thisSetting.dft = dft;
              thisSetting.wing_angle = wing_angle;

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
          $$("#stockBinding, #stockLength, #stockDepth, #stockDFT, #stockWingAngle").text('');
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

minVal=Number(bVal) - Number(.750);
maxVal=Number(bVal) + Number(.750);
$$(".page #bindingRange").attr("value", bVal);
$$(".page #bindingRange").attr("min", minVal );
$$(".page #bindingRange").attr("max", maxVal );


lVal=$$(".page #myCurrentLength").text();
lminVal=Number(lVal) - Number(.020);
lmaxVal=Number(lVal) + Number(.020);
$$(".page #lengthRange").attr("value", lVal);
$$(".page #lengthRange").attr("min", lminVal );
$$(".page #lengthRange").attr("max", lmaxVal );


dVal=$$(".page #myCurrentDepth").text();
dminVal=Number(dVal) - Number(.020);
dmaxVal=Number(dVal) + Number(.020);
$$(".page #depthRange").attr("value", dVal);
$$(".page #depthRange").attr("min", dminVal );
$$(".page #depthRange").attr("max", dmaxVal );


dftVal=$$(".page #myCurrentDFT").text();
dftminVal=Number(dftVal) - Number(.020);
dftmaxVal=Number(dftVal) + Number(.020);
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
    if (this.id == 'bindingRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(4);
      $$(".page #myCurrentBinding").text(sliderValue); // put in view
      if (typeof thisSetting != "undefined") { $$("#stockBinding").text( (sliderValue - parseFloat(thisSetting.front_binding)).toFixed(4) ); }
    }
    if (this.id == 'lengthRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentLength").text(sliderValue); // put in view
      if (typeof thisSetting != "undefined") { $$("#stockLength").text( (sliderValue - parseFloat(thisSetting.length)).toFixed(3) ); }
    }
    if (this.id == 'depthRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentDepth").text(sliderValue); // put in view
      if (typeof thisSetting != "undefined") { $$("#stockDepth").text( (sliderValue - parseFloat(thisSetting.depth)).toFixed(3) ); }
    }
    if (this.id == 'dftRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(3);
      $$(".page #myCurrentDFT").text(sliderValue); // put in view
      if (typeof thisSetting != "undefined") { $$("#stockDFT").text( (sliderValue - parseFloat(thisSetting.dft)).toFixed(3) ); }
    }
    if (this.id == 'wingRange') {
      sliderValue=parseFloat(sliderNumberString).toFixed(2);
      $$(".page #myCurrentWingAngle").text(sliderValue); // put in view
      if (typeof thisSetting != "undefined") { $$("#stockWingAngle").text( (sliderValue - parseFloat(thisSetting.wing_angle)).toFixed(2) ); }
    }
});




$$(document).on('touchend', '.page #bindingRange , .page #lengthRange , .page #depthRange , .page #dftRange , .page #wingRange', function (e) {
    currentValue=$$(this).val();
    switch (this.id) {
      case 'bindingRange':
        updateSlider(this,currentValue,.750,.0625);
        break;

      case 'wingRange':
        updateSlider(this,currentValue,2,.25);
        break;

      default:
        updateSlider(this,currentValue,.020,.001);
        break;
    }
    console.log("this object is " + this.id)
});




function updateSlider(obj,currentValue,plusMinusRange,increment) {
  minVal=Number(currentValue) - Number(plusMinusRange);
  maxVal=Number(currentValue) + Number(plusMinusRange);
  obj.value=currentValue;
  obj.min=minVal;
  obj.max=maxVal;
  obj.step=increment;
  console.log('object value is ' + obj.value)
}
