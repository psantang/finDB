function init_ski() {
  console.log('in init_ski');

  if (!thisUser.profileActivated) { // see if user profile is populated
    myApp.dialog.alert(
      'your user profile must be complete.  Select OK below to continue.',
      'Before you can begin...',
      function () {
        mainView.router.load( { url:'profile.html' });
      }
    );
  } else {
    populateCurrentSki();
    populateCurrentSettings();
  }



} // end init_ski functions






function checkImageExists(imageUrl, callBack) {
  var imageData = new Image();
  imageData.onload = function() {
    callBack(true);
  };
  imageData.onerror = function() {
    callBack(false);
  };
  imageData.src = imageUrl;
  console.log("++++++++++imageUrl:" + imageUrl);
}

// image url that want to check
//var imageFile = 'http://example.com/image.png;

//Here pass image url like imageFile in function to check image exist or not.



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

    // INSERT BRAND LOGO IF LOGO IS AVAILABLE
    if (thisSki.brand) {
      checkImageExists("img/skiLogos/"+thisSki.brand+"_logo.png", function(existsImage) {
        if(existsImage == true) {
          console.log("++++++++++true.  Logo available.");
          $$(".page #ul_mySki .item-content .item-media").append('<a href="/mySkis/" id="editSkiBtn"><img src="img/skiLogos/'+thisSki.brand+'_logo.png" class="logo_36height" /></a>');
        }
        else {
          console.log("++++++++++false.  Logo not available.");
        }
      });
    }



  } else { // IF USER HAS NO SKI's SELECTED, Like first time entry, direct to ski selection page
    $$(".page #myCurrentSki").text("Add Ski");
    if (viewCounter<1) {
      viewCounter++;
      console.log("first select a ski with viewCounter=" + viewCounter);
      var modalFirstSki = myApp.dialog.create({
        title: 'Welcome!',
        text: 'Before you save any settings, you must select a ski to apply these to.',
        afterText:  '',
        buttons: [
          {
            text: 'Select My Ski',
            bold: true,
            onClick: function () {
              //mainView.router.load( { url:'mySkis.html' });
              myApp.router.navigate('/mySkis/');
            }
          },
        ]
      }).open();
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
  console.log("in populateCurrentSettings");
  if (typeof thisSetting !== "undefined") { // window object
    console.log("Object thisSetting IS DEFINED");
    if (thisSetting.id) {
      $$(".page #dateCreated").html(thisSetting.date_time_created);
      $$(".page #myCurrentBinding").html(thisSetting.front_binding);
      $$(".page #myCurrentLength").html(thisSetting.length);
      $$(".page #myCurrentDepth").html(thisSetting.depth);
      $$(".page #myCurrentDFT").html(thisSetting.dft);
      $$(".page #myCurrentWingAngle").html(thisSetting.wing_angle);
      $$(".page #myCurrentLE").html(thisSetting.leading_edge);
      $$(".page #myCurrentBindToLE").html(thisSetting.binding_to_le);
      //myCurrentBindToLE

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
      if (thisSki.stockArray.data.length>1) {
        console.log('if writeOut');
        chooseFromMultiSettings(thisSki);
      } else {
        console.log('else writeOut');
        writeOutStockSettings(0);
      }


      //$$("#viewStockBtn").hide();
    }
  }
} // END populateCurrentSettings







// Function to prompt user to select from multiple stock settings
// REturns index of array item
function chooseFromMultiSettings(thisSki) {
  console.log("func chooseFromMultiSettings");

  var textStr="The <span class='bold'>"+thisSki.year+" "+thisSki.brand+ " "+thisSki.model+" "+thisSki.length+ "</span> has multiple stock settings.  Please choose from the list below as your starting point.";
  var btns=[];
  thisSki.stockArray.data.forEach( function(element){
    //btns['text']=element.setting_name;
    btns.push({
        text: element.setting_name
    });

  });
  console.log(btns);
  //var btns= [ {text:'Radar 1'} , {text:'Radar 2'} ];

  myApp.dialog.create({
    title: 'Multiple Settings',
    text: textStr,
    buttons: btns ,
    verticalButtons: true,
    onClick: function(dialog, index) {
      console.log('button index clicked= '+index);
      writeOutStockSettings(index);
      //return index;
      //myApp.router.navigate('/mySkis/');
    }
  }).open();
}





// Writes out stock settings to mySettings page for case of a new ski (NOT custom settings)
function writeOutStockSettings (index) {
  console.log('--------------- embedded function writeOut');
  $$(".page #dateCreated").html('Stock Settings');
  $$(".page #myCurrentBinding").html(thisSki.stockArray.data[index].stock_binding_location);
  $$(".page #myCurrentLength").html(thisSki.stockArray.data[index].stock_fin_length);
  $$(".page #myCurrentDepth").html(thisSki.stockArray.data[index].stock_fin_depth);
  $$(".page #myCurrentDFT").html(thisSki.stockArray.data[index].stock_fin_dft);
  $$(".page #myCurrentWingAngle").html(thisSki.stockArray.data[index].stock_wing_angle);
  $$(".page #myCurrentLE").html( (Number(thisSki.stockArray.data[index].stock_fin_dft) + Number(thisSki.stockArray.data[index].stock_fin_length)).toFixed(3));
  $$(".page #myCurrentBindToLE").html( (Number(thisSki.stockArray.data[index].stock_binding_location) - (Number(thisSki.stockArray.data[index].stock_fin_dft) + Number(thisSki.stockArray.data[index].stock_fin_length))).toFixed(4));

  //BELOW SHOW HOW STOCK IS MEASURED IF THERE IS A VALUE FOR EACH OF THE SETTINGS FROM THE FACTORY
  thisSki.stockArray.data[index].stock_binding_location>0 ? $$(".page #stockBinding").html("<span class='redText'>"+thisSki.measure_binding+"</span>") : $$(".page #stockBinding").html("");
  thisSki.stockArray.data[index].stock_fin_length>0 ? $$(".page #stockLength").html("<span class='redText'>"+thisSki.measure_length+"</span>") : $$(".page #stockLength").html("");
  thisSki.stockArray.data[index].stock_fin_depth>0 ? $$(".page #stockDepth").html("<span class='redText'>"+thisSki.measure_depth+"</span>") : $$(".page #stockDepth").html("");
  thisSki.stockArray.data[index].stock_fin_dft>0 ? $$(".page #stockDFT").html("<span class='redText'>"+thisSki.measure_dft+"</span>") : $$(".page #stockDFT").html("");
  $$(".page #stockWingAngle").html("");

  $$(".page #dateCreated").addClass('redText');
  tempStockSettingsChosen (index);
}

// NEED A FUNCTION TO TEMPORAIRLIY HOLD STOCK SETTINGS UNTIL USER SAVES THEIR SETTINGS
function tempStockSettingsChosen (index) {
  var tempStockChosen={'stock_binding_location': thisSki.stockArray.data[index].stock_binding_location,'stock_fin_length':thisSki.stockArray.data[index].stock_fin_length,'stock_fin_depth':thisSki.stockArray.data[index].stock_fin_depth,'stock_fin_dft':thisSki.stockArray.data[index].stock_fin_dft,'stock_wing_angle':thisSki.stockArray.data[index].stock_wing_angle};
  window.tempStockChosen = tempStockChosen;
}













function toggleViewStock() {
  console.log("in toggleViewStock");
    //if ($$(".page #viewStockBtn i").text() == "more_vertical_round") {
    if ($$(".page #viewStockBtn").text() == "STOCK") {

      if ( thisSki.stockArray.status!='success' && thisSki.stockArray.RETURN_CODE!=1) {

        console.log("No stock settings available");
        stockHTML ='<div id="stockSettings">';
        stockHTML+='<div class="stockName center">No stock data is available.</div>';
        stockHTML+='</div>';
    } else {
      stockSettingsArray=thisSki.stockArray.data;
      console.log("Stock settings are available");
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


      stockSettingsArray.forEach(function(element) {
        stockHTML+='<tr>';
        stockHTML+='<td colspan="5"><span class="lightBlueText bold">' +element.setting_name+ '</span></td>';
        stockHTML+='</tr>';

        stockHTML+='<tr>';
        stockHTML+='<td class="numeric-cell">' +element.stock_binding_location+ '</td>';
        stockHTML+='<td class="numeric-cell">' +element.stock_fin_length+ '</td>';
        stockHTML+='<td class="numeric-cell">' +element.stock_fin_depth+ '</td>';
        stockHTML+='<td class="numeric-cell">' +element.stock_fin_dft+ '</td>';
        stockHTML+='<td class="numeric-cell">' +element.stock_wing_angle+ '</td>';
        stockHTML+='</tr>';
      });

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

      $$('#stockSettingsDiv').html(stockHTML);
      stockHeight=$$("#stockSettings").height();
      console.log("stockSettingsDiv height = " + stockHeight);

      $$('#stockSettingsDiv').animate(
        /* CSS properties to animate, e.g.: */
        {
            'height': stockHeight,
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

    } else { // NOW HIDE THE SETTINGS
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
            myApp.dialog.alert(
              'No History is available yet.  After you make your first settings change, you will be able to view all setting changes here.',
              'No History Available.',
              function () {
                null;
              }
            );
            return null;
          }

          var url=wsURL+'ws_get_settings_history_ret_json.php';

        	myApp.request({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSetting.ski_id },type:'POST',dataType: 'json'
  				,success:function(json_Obj) {
  						console.log('ajax success.');
  						if (json_Obj.length>0) { // RETURNED RESULTS
                console.log('json length is ' + json_Obj.length);

            		if (json_Obj[0].RETURN_CODE==1) {

                  //var popupHTML = "HELLO!";
                  //console.log('json_Obj is ' + json_Obj);

                  window.popupHTML = '<div class="popup popup-history">';
                      popupHTML+='<div class="page">';

                      popupHTML+='<div class="navbar">';
                      popupHTML+='<div class="navbar-inner">';
                      popupHTML+='<div class="title">Setups: '+thisSki.my_ski_name+'</div>';
                      popupHTML+='<div class="right"><a href="#" class="link popup-close">Close</a></div>';
                      popupHTML+='</div>';
                      popupHTML+='</div>';

                      popupHTML+='<div class="page-content">';
                      //popupHTML+='<div class="block">';

                      //popupHTML+='<div class="closePopup"><a href="#" class="link popup-close"><i class="icon f7-icons">close_round</i></a></div>';

                      //popupHTML+='<div class="content-block"></div>';
                      //popupHTML+='<p><a href="#" class="close-popup">Close me</a></p>';

                      //popupHTML+='<div class="block-title">Setup History for '+thisSki.my_ski_name+'</div>';
                      popupHTML+='<div class="list">';
                      popupHTML+='<ul id="ulHistory">';

                  //$$.each(json_Obj, function( index, value ) {
                  for (a=0;a<json_Obj.length;a++) {
                  //  popupHTML+='<li>'+json_Obj[a].date_time_created+'</li>';

                    popupHTML+='<li class="accordion-item item_'+a+'"><a href="#" class="item-content item-link lightOrangeBG">';
                    popupHTML+='<div class="item-inner">';
                    popupHTML+='<div class="item-title">'+json_Obj[a].date_time_created;
                    if (json_Obj[a].current==1) {
                      popupHTML+='<span class="smallText">(current)</span></div>';
                    } else {
                      popupHTML+='</div>';
                    }
                    popupHTML+='</div></a>'; // item inner
                    popupHTML+='<div class="accordion-item-content">';
                    popupHTML+='<div class="block">';

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
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].front_binding+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].length+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].depth+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].dft+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].wing_angle+ '</td>';
                      popupHTML+='</tr>';
                      popupHTML+='<tr>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].measure_binding+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].measure_length+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].measure_depth+ '</td>';
                      popupHTML+='<td class="numeric-cell">' +json_Obj[a].measure_dft+ '</td>';
                      popupHTML+='<td class="numeric-cell"></td>';
                      popupHTML+='</tr>';
                      popupHTML+='</tbody>';
                      popupHTML+='</table>';
                      popupHTML+='</div>'; // end data-table

                      popupHTML+='<div class="center">';
                      if (json_Obj[a].leading_edge>0) {
                        popupHTML+='<div class="chip">';
                        popupHTML+='<div class="chip-label">LE: '+json_Obj[a].leading_edge+'</div>';
                        popupHTML+='</div> ';
                      }
                      if (json_Obj[a].binding_to_le>0) {
                        popupHTML+=' <div class="chip">';
                        popupHTML+='<div class="chip-label">B-LE: '+json_Obj[a].binding_to_le+'</div>';
                        popupHTML+='</div>';
                      }
                      popupHTML+='</div>'; // end center

                      if (json_Obj[a].notes) {
                        popupHTML+='<div class="metaNotes" id="note_'+json_Obj[a].notes+'"></div>';
                        notesIdArray.push(json_Obj[a].notes);
                        metaNotes=true;
                      }
                    popupHTML+='</div>'; // END block
                    popupHTML+='</div>'; // END accordian item content
                    popupHTML+='</li>';
                  }

            			//});
                  popupHTML+='</ul>'; // end ul

                  popupHTML+='</div>'; // end class accordian list

                  //popupHTML+='</div>'; // end class block
                  popupHTML+='</div>'; // end class page content
                  popupHTML+='</div>'; // end class page
                  popupHTML+='</div>'; // end class popup

                  //console.log(popupHTML);
                  myApp.popup.open(popupHTML);


  							} else {
                  //delete thisSetting;
                  //$("#profileBtn").hide();
                  console.log('return code is NOT 1');
                }
  						}
        		}, complete: function(xhr, status){
                console.log('ajax complete for viewHistory.')
        				//console.log('status is ' + status + ' xhr is ' + xhr.responseText);
                var jsonObjLength=JSON.parse(xhr.responseText).length;

            //    myApp.accordionOpen('.item_0');

                //if ($$("#ulHistory li").hasClass("item_1")) {
                if (jsonObjLength>1) {
            //      myApp.accordionOpen('.item_1');
                    myApp.accordion.toggle('.item_1');
                }
                myApp.accordion.toggle('.item_0');

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

  myApp.request({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSetting.ski_id, setting_id:setting_id },type:'POST',dataType: 'json'
  ,success:function(json_Obj) {
      console.log('ajax success.');
      if (json_Obj.length>0) { // RETURNED RESULTS
        console.log('json length is ' + json_Obj.length);

        if (json_Obj[0].RETURN_CODE==1) {

          console.log('json_Obj is ' + json_Obj);

          //$$.each(json_Obj, function( index, value ) {
          for (a=0;a<json_Obj.length;a++) {
            var noteStr='';
            noteStr+="<div class='historyNotesHdr'>"+getLocalDateTimeString(json_Obj[a].date_time,'pretty');
            if (json_Obj[a].water_temp>0){
              noteStr+="<span class='floatRight'>Water: "+json_Obj[a].water_temp+"&deg; "+json_Obj[a].water_temp_scale+"</span>";
            }
            noteStr+="</div>";
            noteStr+="<div class='historyNotes'>"+json_Obj[a].notes+"</div>";
            console.log(noteStr);
            $$("#note_"+json_Obj[a].setting_id).append(noteStr);
          }
          //});



        } else {
          console.log('return code is NOT 1');
        }
      }
    }, complete: function(xhr, status){
        console.log('ajax complete for viewNotes.')
        //console.log('status is ' + status + ' xhr is ' + xhr.responseText);
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
  console.log("in cancelSave");
  populateCurrentSettings();
  $$(".page .slideAdjust").css('display','none');
  $$(".page #editFinBtn").text("Edit");
  $$("#mySettingsBinding, #mySettingsLength, #mySettingsDepth, #mySettingsDFT, #myNewLE, #myNewBindToLE, #LE_diff, #B_LE_diff").html('');
  $$(".page #summary_POS").hide();
  $$(".stockText").css("margin-left","0em");
}












function toggleEditFin () {
  console.log("in toggleEditFin");
  if ( $$(".page .slideAdjust").css('display') == 'none' )  {// Makes the settings editable
    if (isAndroid) {
      //$$(".overFlowHidden").css('width','initial');
    }
    $$(".page .slideAdjust").css('display','inline-block');

    // V2 specific code for range slider move all range sliders to center on init;
    $$(".page .range-knob-wrap").css("left","50%");

    $$(".page #editFinBtn").text("Save");
    $$("#dateCreated").html("<a href='#' id='cancelSaveBtn'>Cancel</a>");
    $$(".page #summary_POS").show();

    $$(".page #mySettingsBinding").html(thisUser.measure_binding);
    $$(".page #mySettingsLength").html(thisUser.measure_length);
    $$(".page #mySettingsDepth").html(thisUser.measure_depth);
    $$(".page #mySettingsDFT").html(thisUser.measure_dft);

    // BLOCKS below address cases where there are NO stock settings in the database...set to base defaults
    if (parseFloat($$("#myCurrentBinding").text() ) <= 0 ) {
      $$("#myCurrentBinding").text("29.50"); $$(".page #stockBinding").html("Estimated");
    } else {
      $$(".page #stockBinding").html("&Delta; 0");
    }


    if (parseFloat($$("#myCurrentLength").text() ) <= 0 ) {
      $$("#myCurrentLength").text("6.900"); $$(".page #stockLength").html("Estimated");
    } else {
      $$(".page #stockLength").html("&Delta; 0");
    }

    if (parseFloat($$("#myCurrentDepth").text() ) <= 0 ) {
        $$("#myCurrentDepth").text("2.500"); $$(".page #stockDepth").html("Estimated");
    } else {
      $$(".page #stockDepth").html("&Delta; 0");
    }

    if (parseFloat($$("#myCurrentDFT").text() ) <= 0 ) {
      $$("#myCurrentDFT").text("0.750"); $$(".page #stockDFT").html("Estimated");}
    else {
      $$(".page #stockDFT").html("&Delta; 0");
    }

    if (parseFloat($$("#myCurrentWingAngle").text() ) <= 0 ) {
      $$("#myCurrentWingAngle").text("7.00"); $$(".page #stockWingAngle").html("Estimated");
    } else {
      $$(".page #stockWingAngle").html("&Delta; 0");
    }

    $$(".stockText").css("margin-left","-1em");


  } else { // Changes mode back to disabled and saves the settings
    $$(".page .slideAdjust").css('display','none');
    $$(".page #editFinBtn").text("Edit");

    $$(".page #summary_POS").hide();
    $$("#mySettingsBinding, #mySettingsLength, #mySettingsDepth, #mySettingsDFT").html('');
    $$(".stockText").css("margin-left","0em");

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
      parseFloat(front_binding).toFixed(4)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.front_binding : tempStockChosen.stock_binding_location)).toFixed(4) &&
      parseFloat(length).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.length : tempStockChosen.stock_fin_length)).toFixed(3) &&
      parseFloat(depth).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.depth : tempStockChosen.stock_fin_depth)).toFixed(3) &&
      parseFloat(dft).toFixed(3)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.dft : tempStockChosen.stock_fin_dft)).toFixed(3) &&
      parseFloat(wing_angle).toFixed(2)==parseFloat((typeof thisSetting != "undefined" ? thisSetting.wing_angle : tempStockChosen.stock_wing_angle)).toFixed(2) &&
      typeof thisSetting!='undefined' // NO SETTINGS CURRENTLY SAVED
    ) {
      myApp.dialog.alert(
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

    myApp.request({url:url,data:{ user_name:thisUser.user_name,ski_id:thisSki.id,front_binding:front_binding,length:length,depth:depth,dft:dft,wing_angle:wing_angle,leading_edge:leading_edge,binding_to_le:binding_to_le,measure_binding:measure_binding,measure_length:measure_length,measure_depth:measure_depth,measure_dft:measure_dft,date_time_created:date_time_created},type:'POST',dataType: 'json'
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
          displaySetupNotes();
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


function init_ranges() {

  if (typeof thisSetting !== 'undefined' && thisSetting.hasOwnProperty("front_binding") ) {
    thisBND=thisSetting.front_binding;
  } else {
    thisBND=tempStockChosen.stock_binding_location;
  }
  if (typeof b_range !== 'undefined') { myApp.range.destroy(b_range); }

  if (typeof thisSetting !== 'undefined' && thisSetting.hasOwnProperty("length") ) {
    thisLEN=thisSetting.length;
  } else {
    thisLEN=tempStockChosen.stock_fin_length;
  }
  if (typeof l_range !== 'undefined') { myApp.range.destroy(l_range); }

  if (typeof thisSetting !== 'undefined' && thisSetting.hasOwnProperty("depth") ) {
    thisDEP=thisSetting.depth;
  } else {
    thisDEP=tempStockChosen.stock_fin_depth;
  }
  if (typeof d_range !== 'undefined') { myApp.range.destroy(d_range); }

  if (typeof thisSetting !== 'undefined' && thisSetting.hasOwnProperty("dft") ) {
    thisDFT=thisSetting.dft;
  } else {
    thisDFT=tempStockChosen.stock_fin_dft;
  }
  if (typeof dft_range !== 'undefined') { myApp.range.destroy(dft_range); }

  if (typeof thisSetting !== 'undefined' && thisSetting.hasOwnProperty("wing_angle") ) {
    thisWIN=thisSetting.wing_angle;
  } else {
    thisWIN=tempStockChosen.stock_wing_angle;
  }
  if (typeof w_range !== 'undefined') { myApp.range.destroy(w_range); }



  b_range = myApp.range.create({
    el: '#bindingRange',
    dual:false,
    value:Number(thisBND),
    min: Number((Number(thisBND) - Number(.75)).toFixed(4)),
    max: Number((Number(thisBND) + Number(.75)).toFixed(4)),
    step:.0625,
    on: {
      change: function () {
        console.log('Range Slider value changed for binding ' +this.value );
        console.log('typeof value ' + typeof this.value);
        $$("#myCurrentBinding").text(this.value.toFixed(4));
        bnd_diff=(typeof thisSetting !== 'undefined') ? (this.value - Number(thisSetting.front_binding)).toFixed(4) : (this.value - Number(tempStockChosen.stock_binding_location)).toFixed(4);
        bnd_diff = (bnd_diff>0) ? "+"+bnd_diff : bnd_diff;
        $$("#stockBinding").html('&Delta; ' + bnd_diff);
        calculateBindingToLE();
      }
    }
  });

  l_range = myApp.range.create({
    el: '#lengthRange',
    dual:false,
    value:Number(thisLEN),
    min: Number((Number(thisLEN) - Number(.012)).toFixed(3)),
    max: Number((Number(thisLEN) + Number(.012)).toFixed(3)),
    step:.001,
    on: {
      change: function () {
        console.log('Range Slider value changed for length');
        $$("#myCurrentLength").text(this.value.toFixed(3));
        len_diff=(typeof thisSetting !== 'undefined') ? (this.value - Number(thisSetting.length)).toFixed(3) : (this.value - Number(tempStockChosen.stock_fin_length)).toFixed(3);
        len_diff = (len_diff>0) ? "+"+len_diff : len_diff;
        $$("#stockLength").html('&Delta; ' + len_diff );
        calculateLE();
        calculateBindingToLE();
      }
    }
  });

  d_range = myApp.range.create({
    el: '#depthRange',
    dual:false,
    value:Number(thisDEP),
    min: Number((Number(thisDEP) - Number(.012)).toFixed(3)),
    max: Number((Number(thisDEP) + Number(.012)).toFixed(3)),
    step:.001,
    on: {
      change: function () {
        console.log('Range Slider value changed for depth');
        $$("#myCurrentDepth").text(this.value.toFixed(3));
        dpt_diff=(typeof thisSetting !== 'undefined') ? (this.value - Number(thisSetting.depth)).toFixed(3) : (this.value - Number(tempStockChosen.stock_fin_depth)).toFixed(3);
        dpt_diff = (dpt_diff>0) ? "+"+dpt_diff : dpt_diff;
        $$("#stockDepth").html('&Delta; ' + dpt_diff );
      }
    }
  });

  dft_range = myApp.range.create({
    el: '#dftRange',
    dual:false,
    value:Number(thisDFT),
    min: Number((Number(thisDFT) - Number(.012)).toFixed(3)),
    max: Number((Number(thisDFT) + Number(.012)).toFixed(3)),
    step:.001,
    on: {
      change: function () {
        console.log('Range Slider value changed for dft');
        $$("#myCurrentDFT").text(this.value.toFixed(3));
        dft_diff=(typeof thisSetting !== 'undefined') ? (this.value - Number(thisSetting.dft)).toFixed(3) : (this.value - Number(tempStockChosen.stock_fin_dft)).toFixed(3);
        dft_diff = (dft_diff>0) ? "+"+dft_diff : dft_diff;
        $$("#stockDFT").html('&Delta; ' + dft_diff );
        calculateLE();
        calculateBindingToLE();
      }
    }
  });

  w_range = myApp.range.create({
    el: '#wingRange',
    dual:false,
    value:Number(thisWIN),
    min: Number((Number(thisWIN) - Number(.25)).toFixed(2)),
    max: Number((Number(thisWIN) + Number(.25)).toFixed(2)),
    step:.25,
    on: {
      change: function () {
        console.log('Range Slider value changed for wing angle');
        $$("#myCurrentWingAngle").text(this.value.toFixed(2));
        wa_diff=(typeof thisSetting !== 'undefined') ? (this.value - Number(thisSetting.wing_angle)).toFixed(2) : (this.value - Number(tempStockChosen.stock_wing_angle)).toFixed(2);
        wa_diff = (wa_diff>0) ? "+"+wa_diff : wa_diff;
        $$("#stockWingAngle").html('&Delta; ' + wa_diff );
      }
    }
  });

  // THIS IS A FIX/OVERRIDE FOR SMALL RANGE KNOB IN ANDROID
  if (isAndroid) {
    $$(".page .range-knob-wrap > .range-knob").addClass('androidSliderRangeKnob');
  }

}

// INITIALIZE slider
function init_slider() {
  console.log('in init_slider');
  toggleEditFin();
  init_ranges();
}


//$$(document).on('touchend', '.page #bindingRange , .page #lengthRange , .page #depthRange , .page #dftRange , .page #wingRange', function (e) {
$$(document).on('touchend', '#bindingRange, #lengthRange , #depthRange , #dftRange , #wingRange', function (e) {
  //console.log("------------> touch ended with e=" +this.id);
  //currentValue=$$(this).val();
  //currentValue=$$(this).attr('value');
  console.log("------------> touch ended with e=" +this.id );
  //currentValue=this.dataset.value;
  switch (this.id) {
    case 'bindingRange':
      updateSlider(b_range,b_range.value.toFixed(4),.750,.0625);
      console.log("------------> touch ended with b_range current value = " +Number(b_range.value.toFixed(4))+ " typeof = " + typeof Number(b_range.value.toFixed(4)) );
      break;

    case 'lengthRange':
      updateSlider(l_range,l_range.value.toFixed(3),.012,.001);
      break;

    case 'depthRange':
      updateSlider(d_range,d_range.value.toFixed(3),.012,.001);
      break;

    case 'dftRange':
      updateSlider(dft_range,dft_range.value.toFixed(3),.012,.001);
      break;

    case 'wingRange':
      updateSlider(w_range,w_range.value.toFixed(2),2,.25);
      break;
    }
    // re-center the slider knob
    $$("#" +this.id+ " .range-knob-wrap").css("left","50%");
});





// UPDATES RANGE SLIDER AFTER touchend event, so that it can continually be dragged to adjust settings in small/configured increments
function updateSlider(obj,currentValue,plusMinusRange,increment) {
  console.log("updateSlider currentValue is "+currentValue);

  //console.log("obj="+obj);
  minVal=Number(currentValue) - Number(plusMinusRange);
  maxVal=Number(currentValue) + Number(plusMinusRange);
  obj.value=Number(Number(currentValue).toFixed(4));
  obj.min=Number(minVal.toFixed(4));
  obj.max=Number(maxVal.toFixed(4));
  obj.step=increment;
  console.log("obj.currentValue value = "+obj.value+ " with typeof " + typeof obj.value);
  console.log('obj.min value = ' + obj.min+ " with typeof " + typeof obj.value);
  console.log("obj.max value = "+obj.max+ " with typeof " + typeof obj.value);
  console.log("obj.step value = "+obj.step+ " with typeof " + typeof obj.step);
}

function calculateLE (change) {
  var length =parseFloat($$(".page #myCurrentLength").text());
  var dft =parseFloat($$(".page #myCurrentDFT").text());
  var LE = (length+dft).toFixed(3);
  console.log("LE = " + LE);
  // get leading edge if in settings or from stock ski settings
  if (typeof thisSetting != "undefined") {
    thisLE=Number(thisSetting.leading_edge).toFixed(3);
  } else {
    thisLE=(Number(tempStockChosen.stock_fin_dft) + Number(tempStockChosen.stock_fin_length)).toFixed(3);
  }

  var LE_diff=(LE-thisLE).toFixed(3);
  console.log("LE_diff = " + LE_diff);

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
  console.log('typeof binding=' + typeof binding);
  var length = parseFloat($$(".page #myCurrentLength").text());
  var dft = parseFloat($$(".page #myCurrentDFT").text());
  var BindingToLE = Number((binding-(length+dft)).toFixed(4));

  console.log('typeof BindingToLE=' + typeof BindingToLE);
  console.log("BindingToLE = " + BindingToLE);

  // get binding to leading edge if in settings or from stock ski settings
  if (typeof thisSetting != "undefined") {
    this_B_LE=Number(thisSetting.binding_to_le).toFixed(4);
  } else {
    this_B_LE=(Number(tempStockChosen.stock_binding_location) - (Number(tempStockChosen.stock_fin_dft) + Number(tempStockChosen.stock_fin_length))).toFixed(4);
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
	console.log('AddNotePopUp function!!!');

          if (typeof thisSetting === "undefined") {
            myApp.dialog.alert(
              'After you edit and save your first settings, you will be able to add notes here.',
              'No Saved Settings.',
              function () {
                null;
              }
            );
            return null;
          }


      var popupNote = '<div class="popup popup-notes">';
          popupNote +='<div class="view view-init">';
          popupNote +='<div class="page">';

          popupNote+='<div class="navbar">';
          popupNote+='<div class="navbar-inner">';
          popupNote+='<div class="title">Setting Notes</div>';
          popupNote+='<div class="right"><a href="#" class="link popup-close">Close</a></div>';
          popupNote+='</div>';
          popupNote+='</div>';

          popupNote+='<div class="page-content">';
          popupNote+='<div class="block">';

          if (thisSki.my_ski_name) {
            popupNote+='<div class="content-block bold">'+thisSki.my_ski_name+'</div>';
          } else {
            popupNote+='<div class="content-block bold">'+thisSki.length + " " + thisSki.brand + " " + thisSki.model + " " + thisSki.year+'</div>';
          }

          popupNote+='<div class="list" id="addNoteSettingsTable">';
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
          popupNote+='</div>'; // end list

          popupNote+='<div class="list simple-list">';
          popupNote+='<ul>';
          popupNote+='<li class="txtAreaHeight">';
          popupNote+='<div class="item-cell width-auto flex-shrink-0">';
          popupNote+='<i class="icon f7-icons">compose</i>';
          popupNote+='</div>';
          //popupNote+='<div class="item-title label">Notes</div>';
          popupNote+='<div class="item-cell flex-shrink-3">';
          popupNote+='<textarea name="notes" id="notes" placeholder="Add notes..."></textarea>';
          popupNote+='</div>';

          popupNote+='</li>';

          popupNote+='<li class="item-row">';
          popupNote+='<div class="item-cell width-auto flex-shrink-0">';
          popupNote+='<span id="note_water_temp"><img src=img/water_temp3.png width="24px" heigh="24px" /></span><span id="note_water_deg"></span><span id="notes_scale"></span>';
          popupNote+='</div>';
          popupNote+='<div class="item-cell flex-shrink-3">';
          //popupNote+='<div class="item-title label">Notes</div>';
          //popupNote+='<div class="item-input">';
          if (thisUser.measure_water_temp=="C") {
            popupNote+='<div id="note_temp_slider" class="range-slider" data-label="true"><input type="range" min="15" max="37" value="28" step="1"></div>';
          } else {
            popupNote+='<div id="note_temp_slider" class="range-slider" data-label="true"><input type="range" min="60" max="99" value="75" step="1"></div>';
          }
          //popupNote+='</div>';
          //popupNote+='</div>';
          popupNote+='</div>';

          //popupNote+='<div class="item-cell width-auto flex-shrink-0">';
          //popupNote+='<span id="note_water_tempB"><img src=img/water_temp3.png width="24px" heigh="24px" /></span>';
          //popupNote+='</div>';


          popupNote+='</li>';
          popupNote+='</ul>';
          popupNote+='</div>'; // END LIST


          popupNote+='<div class="content-block"><a href="#" class="inlineBlock whiteTransBG button margin-right_1em" id="addNoteBtn">Add Note</a></div>';
          //popupNote+='<a href="#" class="inlineBlock whiteTransBG margin-left_1em button close-popup">Cancel</a>';


          popupNote+='</div>'; // END  block
          popupNote+='</div>'; // END  page content

          popupNote+='</div>'; // end class page
          popupNote+='</div>'; // end class view
          popupNote+='</div>'; // end class popup

      myApp.popup.open(popupNote,true);

      var rangeWaterTemp = myApp.range.create({
        el: '#note_temp_slider',
        on: {
          change: function (e, range) {
            $$('#note_water_temp').html(this.getValue() + '&deg;' +thisUser.measure_water_temp);
          }
        }
      });

} // END AddNote FUNCTION









function addNote() {
  console.log('AddNote function');
  if(typeof newAnim != 'undefined') newAnim.stop(); // THIS seems to be a fix for when the animation does not go to completion...happened several times.
  $$('#thisSettingNotes').removeAttr("style");
  if (offline) return onOffline();

  var notes=$$(".popup #notes").val();
  notes = notes.replace(/(\r\n|\n|\r)/g,'<br>'); // replace line returns with br tags...make sure br tags are allowed in php when stripping
  var date_time=getLocalDateTimeString(null,"ISO");
  var water_temp=$$(".popup #note_water_temp").text();
  var passed=false;

  var url=wsURL+'ws_set_settings_note_ret_json.php';

  myApp.request({url:url,data:{user_name:thisUser.user_name,ski_id:thisSetting.ski_id,setting_id:thisSetting.id,notes:notes,water_temp:water_temp,water_temp_scale:thisUser.measure_water_temp,date_time:date_time },type:'POST',dataType: 'json'
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
          //myApp.closeModal();
          thisPop=myApp.popup.close("div.popup.popup-notes");
          displaySetupNotes();
          //console.log("thisPop is " + thisPop);
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

/*
$$('#note_temp_slider').on('range:change', function (e, range) {
  console.log("in on range change");
  $$('#note_water_temp').text(range.value[0]);
});


$$(document).on('touchmove', '.popup  #note_temp_slider', function (e) {
  console.log("in touchmove for notes temperature");
    noteTempString=$$(this).val(); // get value from slider

      //sliderValue=parseInt(noteTempString);
      $$(".popup #note_water_temp").text(noteTempString); // put in view.  This data sent/saved
      $$(".popup #note_water_deg").html('&deg; '); // put in view
      $$(".popup #notes_scale").text(thisUser.measure_water_temp); // put in view.  This data sent/saved

});
*/







function versionDetails(vers_Obj) {
  console.log("in versionDetails function");
  var popupNote = '<div class="popup popup-notes">';
      popupNote +='<div class="view view-init">';
      popupNote +='<div class="page">';

      popupNote+='<div class="navbar">';
      popupNote+='<div class="navbar-inner">';
      popupNote+='<div class="title">Version Update</div>';
      popupNote+='<div class="right"><a href="#" class="link popup-close">Close</a></div>';
      popupNote+='</div>';
      popupNote+='</div>';

      popupNote+='<div class="page-content">';
      popupNote+='<div class="block">';

      if (vers_Obj.user_vers) {
        popupNote+='<div class="content-block bold">Your Version: '+vers_Obj.user_vers+'</div>';
      }
      if (vers_Obj.latest_vers) {
        popupNote+='<div class="content-block bold">Latest Version: '+vers_Obj.latest_vers+'</div>';
      }

      popupNote+='<div>New or upgraded features:</div>';
      if (vers_Obj.vers_features) {
        popupNote+='<div>'+vers_Obj.vers_features+'</div>';
      }

      if (isIos) {
        update_link="<a class='external' href='"+appLinkiOS+"' target='_system'>Learn More</a>";
      }
      if (isAndroid) {
        update_link="<a class='external' href='"+appLinkAndroid+"' target='_system'>Learn More</a>";
      }
      popupNote+='<div>'+update_link+'</div>';





      popupNote+='</div>'; // END  block
      popupNote+='</div>'; // END  page content

      popupNote+='</div>'; // end class page
      popupNote+='</div>'; // end class view
      popupNote+='</div>'; // end class popup

  myApp.popup.open(popupNote,true);
}







function displaySetupNotes() {
  console.log("in displaySetupNotes ");
  $$('#thisSettingNotes').css('height','0px');
  $$('#thisSettingNotes').css('opacity','0');
  $$('#thisSettingNotes').removeAttr("style");
  $$('#settingNotesDiv').html("");
  //$$('#settingNotesDiv').remove();

  if (offline) return onOffline();

  if (typeof thisSki=='undefined' || typeof thisSetting=='undefined') {
    return false;
  } else if (!thisSki.id || !thisSetting.id) { // if the ski and setting are not set, do not execute
    return false;
  }

  var noteStr='';
  var returnCode=-1;
  var url=wsURL+'ws_get_settings_history_notes_ret_json.php';

  myApp.request({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSki.id, setting_id:thisSetting.id },type:'POST',dataType: 'json'
  ,success:function(json_Obj) {
      console.log('ajax success.');
      if (json_Obj.length>0) { // RETURNED RESULTS
        console.log('json length is ' + json_Obj.length);

        if (json_Obj[0].RETURN_CODE==1) {
          returnCode=1;
          //console.log('json_Obj is ' + json_Obj);

          //noteStr+="<div id='settingNotesDiv'>";
          for (a=0;a<json_Obj.length;a++) {
            //var noteStr='';
            noteStr+="<div class='historyNotesHdr'>"+getLocalDateTimeString(json_Obj[a].date_time,'pretty');
            if (json_Obj[a].water_temp>0){
              noteStr+="<span class='floatRight'>Water: "+json_Obj[a].water_temp+"&deg; "+json_Obj[a].water_temp_scale+"</span>";
            }
            noteStr+="</div>";
            noteStr+="<div class='historyNotes'>"+json_Obj[a].notes+"</div>";
            //console.log(noteStr);
            //$$("#thisSettingNotes").append(noteStr);
          }
          //noteStr+="</div>";
          console.log(noteStr);

        } else {
          console.log('return code is NOT 1 so hide the div for notes.');
          $$('#thisSettingNotes').css('display','none');
        }
      }
    }, complete: function(xhr, status){
      console.log('in complete ...');
      if (returnCode==1){

        $$('#thisSettingNotes').css('height','0px');

        $$('#settingNotesDiv').html(noteStr);
        notesHeight=$$("#settingNotesDiv").height();

        winHeight=$$("#mySettings_div").height();
        skiCardTop=document.getElementById("ski_card").offsetTop;
        skiCardHeight=$$("#ski_card").height();
        spaceLeft=winHeight-skiCardTop-skiCardHeight-34;

        console.log('spaceLeft=' +spaceLeft);



        if (spaceLeft>60) { // IF THERE IS ENOUGH SPACE TO DISPLAY NOTES AND KEEP SKI CARD DIAGRAM, THEN SHOW NOTES ON THIS PAGE
          console.log('in spaceleft>60 and = ' + spaceLeft);

          $$('#thisSettingNotes').addClass('notesGradientBG');
          $$('#thisSettingNotes').css('display','inline-block');
          $$('#thisSettingNotes').css('border-top','1px solid #444');
          $$('#thisSettingNotes').css('border-bottom','1px solid #444');

          thisAnim = $$('#thisSettingNotes').animate(
            {
                'height': spaceLeft,
                'opacity': 1
            },
            {
                duration: 700,
                easing: 'swing',
                begin: function () {
                    console.log('********** animation began');
                    //$$('#settingNotesDiv').html(noteStr);
                    //$$('#thisSettingNotes').html(noteStr);
                },
                // Animation completed, optional
                complete: function () {
                    console.log('********** animation completed');
                    //$$('#thisSettingNotes').removeAttr("style");
                    //$$('#thisSettingNotes').css('height','auto');
                    thisAnim.stop();
                    if (notesHeight<spaceLeft) {
                      console.log('calling bounceBack with value='+notesHeight);
                      bounceBack(notesHeight);
                    }
                    //notesHeight=$$("#settingNotesDiv").height();
                }
            }
          ) ; // END ANIMATION 1

        }
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

function bounceBack(newHeight) {

  window.newAnim=newAnim=$$('#thisSettingNotes').animate(
    {
        'height': newHeight,
        'opacity': 1
    },
    {
        duration: 350,
        easing: 'swing',
        begin: function () {
            console.log('animation2 began');

            //$$('#thisSettingNotes').html(noteStr);
            //$$('#thisSettingNotes').append($$('#settingNotesDiv'));
        },
        // Animation completed, optional
        complete: function () {
            console.log('animation2 completed');
            newAnim.stop();
        },
        // Animation in progress, optional
        progress: function (elements, complete, remaining, start) {

        }
    }
  ); // END ANIMATION
}

function displaySetupNotes_newAttempt() {
  console.log("in displaySetupNotes ");
  //if ($$('#settingNotesDiv'))  $$('#settingNotesDiv').remove();
  if ($$('#settingNotesDiv')) $$("#settingNotesDiv").html("");
  //$$('#thisSettingNotes').css('height','0px');
  $$('#thisSettingNotes').removeClass('settingNotesView');
  $$('#thisSettingNotes').removeAttr("style");
  $$('#thisSettingNotes #settingNotesDiv').removeClass('heightAuto');
  $$('#thisSettingNotes #settingNotesDiv').addClass('heightZero');

  //$$('#settingNotesDiv').css('height','0px');
  //$$('#thisSettingNotes').removeAttr("style");

  if (offline) return onOffline();

  if (typeof thisSki=='undefined' || typeof thisSetting=='undefined') {
    return false;
  } else if (!thisSki.id || !thisSetting.id) { // if the ski and setting are not set, do not execute
    return false;
  }

  var noteStr='';
  var returnCode=-1;
  var url=wsURL+'ws_get_settings_history_notes_ret_json.php';

  myApp.request({url:url,data:{ user_name:thisUser.user_name, ski_id:thisSki.id, setting_id:thisSetting.id },type:'POST',dataType: 'json'
  ,success:function(json_Obj) {
      console.log('ajax success.');
      if (json_Obj.length>0) { // RETURNED RESULTS
        console.log('json length is ' + json_Obj.length);

        if (json_Obj[0].RETURN_CODE==1) {
          returnCode=1;
          console.log('json_Obj is ' + json_Obj);

          //notesDiv=document.createElement('div');
          //notesDiv.setAttribute("id", "settingNotesDiv");

          //noteStr+="<div id='settingNotesDiv'>";
          for (a=0;a<json_Obj.length;a++) {
            //var noteStr='';
            noteStr+="<div class='historyNotesHdr'>"+getLocalDateTimeString(json_Obj[a].date_time,'pretty');
            if (json_Obj[a].water_temp>0){
              noteStr+="<span class='floatRight'>Water: "+json_Obj[a].water_temp+"&deg; "+json_Obj[a].water_temp_scale+"</span>";
            }
            noteStr+="</div>";
            noteStr+="<div class='historyNotes'>"+json_Obj[a].notes+"</div>";
            //console.log(noteStr);
            //$$("#thisSettingNotes").append(noteStr);
          }
          //noteStr+="</div>";
          $$("#settingNotesDiv").html(noteStr);
          window.noteStr=noteStr;
          console.log(noteStr);

        } else {
          console.log('return code is NOT 1');
          //$$('#settingNotesDiv').remove();
          $$('#thisSettingNotes').css('display','none');
        }
      }
    }, complete: function(xhr, status){

      if (returnCode==1) {
        console.log('in returnCode1 for complete xhr of get notes');

        //$$('#thisSettingNotes #settingNotesDiv').removeClass('heightZero');
        $$('#settingNotesDiv').removeClass('heightZero');
        $$('#thisSettingNotes').addClass('settingNotesView');
        $$('#settingNotesDiv').addClass('heightAuto');

        winHeight=$$("#mySettings_div").height();
        skiCardTop=document.getElementById("ski_card").offsetTop;
        skiCardHeight=$$("#ski_card").height();
        spaceLeft=winHeight-skiCardTop-skiCardHeight-34;

        if (spaceLeft>60) { // IF THERE IS ENOUGH SPACE TO DISPLAY NOTES AND KEEP SKI CARD DIAGRAM, THEN SHOW NOTES ON THIS PAGE
          console.log('in spaceleft>60 and = ' + spaceLeft);
          //$$('#thisSettingNotes').css('height','0px');
          //$$('#thisSettingNotes').css('display','inline-block');
          //$$('#thisSettingNotes').css('border-top','1px solid #007aff');
          //$$('#thisSettingNotes').css('border-bottom','1px solid #007aff');



          $$('#thisSettingNotes').animate(
            {
                'height': spaceLeft,
                'opacity': 1
            },
            {
                duration: 700,
                easing: 'swing',
                begin: function (elements) {
                    console.log('animation began');

                    //$$('#thisSettingNotes').html(noteStr);
                    //$$('#thisSettingNotes').append($$('#settingNotesDiv'));
                },
                // Animation completed, optional
                complete: function (elements) {
                    console.log('animation completed');
                    notesHeight=$$("#settingNotesDiv").height();
                    if (notesHeight<spaceLeft) {
                      $$('#thisSettingNotes').animate(
                        {
                            'height': notesHeight+0,
                            'opacity': 1
                        },
                        {
                            duration: 350,
                            easing: 'swing',
                        }
                      );
                    }
                },
                // Animation in progress, optional
                progress: function (elements, complete, remaining, start) {

                }
            }
          ); // END ANIMATION
        }
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
