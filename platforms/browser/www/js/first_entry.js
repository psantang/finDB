var ftBinding, ftLength, ftDepth, ftDFT, measure_water_temp;

function firstTimeEntry() {
  console.log("in firstTimeEntry");

  var modal = myApp.dialog.create({
    title: 'Successful Login!',
    text: 'Before you get started, let us know how you plan to measure your set-up.'+
          '<div class="swiper-container" style="width: auto; margin:5px -15px -15px">'+
          '<div class="swiper-pagination"></div>'+
          '<div class="swiper-wrapper">'+
            '<div class="swiper-slide center"><img src="img/firstTimeUser.jpg" style="display:block;margin: 0px auto;width:100%"></div>' +
          '</div>'+
          '</div>',
    buttons: [
      {
        text: 'Let\'s Go!',
        bold: true,
        onClick: function () {
          firstTimeBinding();
        }
      },
    ]
  }).open();
}

function firstTimeBinding() {
  if (thisUser.measure_binding) {// BY PASS IF THIS IS ALREADY SET
    //ftBinding=thisUser.measure_binding;
    return firstTimeLength();
  }

  var modalBinding = myApp.dialog.create({
    title:  'Front Binding',
    text: 'How do you measure your front binding?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Heel',
        onClick: function() {
          ftBinding='Heel';
          firstTimeLength();
        }
      },
      {
        text: 'Ankle',
        onClick: function() {
          ftBinding='Ankle';
          firstTimeLength();
        }
      },
    ]
  }).open();
}



function firstTimeLength() {
  if (thisUser.measure_length) {// BY PASS IF THIS IS ALREADY SET
    //ftLength=thisUser.measure_length;
    return firstTimeDepth();
  }


  var modalLength = myApp.dialog.create({
    title:  'Fin Length',
    text: 'How do you measure the LENGTH of your fin?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Tips',
        onClick: function() {
          ftLength='Tips';
          firstTimeDepth();
        }
      },
      {
        text: 'Jaws',
        onClick: function() {
          ftLength='Jaws';
          firstTimeDepth();
        }
      },
      {
        text: 'Axiom Tool',
        onClick: function() {
          ftLength='Axiom';
          firstTimeDepth();
        }
      },
    ]
  }).open();
}


function firstTimeDepth() {
  if (thisUser.measure_depth) { // BY PASS IF THIS IS ALREADY SET
    //ftDepth=thisUser.measure_depth;
    return firstTimeDFT();
  }
  var modalDepth = myApp.dialog.create({
    title:  'Fin Depth',
    text: 'How do you measure the DEPTH of your fin?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Flat',
        onClick: function() {
          ftDepth='Flat';
          firstTimeDFT();
        }
      },
      {
        text: 'Axiom Tool',
        onClick: function() {
          ftDepth='Axiom';
          firstTimeDFT();
        }
      },
    ]
  }).open();
}



function firstTimeDFT() {
  if (thisUser.measure_dft) { // BY PASS IF THIS IS ALREADY SET
    //ftDFT=thisUser.measure_dft;
    return firstTimeWaterTemp();
  }

  var modalDFT = myApp.dialog.create({
    title:  'Fin DFT',
    text: 'How do you measure the Depth From Tail (DFT) of your fin?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Flat',
        onClick: function() {
          ftDFT='Flat';
          firstTimeWaterTemp();
        }
      },
      {
        text: 'Needle',
        onClick: function() {
          ftDFT='Needle';
          firstTimeWaterTemp();
        }
      },
      {
        text: 'Slot',
        onClick: function() {
          ftDFT='Slot';
          firstTimeWaterTemp();
        }
      },
      {
        text: 'Axiom Tool',
        onClick: function() {
          ftDFT='Axiom';
          firstTimeWaterTemp();
        }
      },
    ]
  }).open();
}


function firstTimeWaterTemp() {
  if (thisUser.measure_water_temp) {
    return firstTimeSummary(); // BY PASS IF THIS IS ALREADY SET
  }

  var modalWaterTemp = myApp.dialog.create({
    title:  'Water Temperature',
    text: 'What scale do you use for water temperature?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Celcius',
        onClick: function() {
          measure_water_temp='C';
          firstTimeSummary();
        }
      },
      {
        text: 'Farenheit',
        onClick: function() {
          measure_water_temp='F';
          firstTimeSummary();
        }
      }
    ]
  }).open();
}



function firstTimeSummary() {
  var summaryStr='<div class="ftSummaryList">';
  if (typeof ftBinding!="undefined") {summaryStr+='<div>Front Binding: <span class="floatRight bold">'+ ftBinding +'</span></div>'};
  if (typeof ftLength!="undefined") {summaryStr+='<div>Fin Length: <span class="floatRight bold">'+ ftLength +'</span></div>'};
  if (typeof ftDepth!="undefined") {summaryStr+='<div>Fin Depth: <span class="floatRight bold">'+ ftDepth +'</span></div>'};
  if (typeof ftDFT!="undefined") {summaryStr+='<div>Fin DFT: <span class="floatRight bold">'+ ftDFT +'</span></div>'};
  if (typeof measure_water_temp!="undefined") {summaryStr+='<div>Water Temp: <span class="floatRight bold">'+ measure_water_temp +'</span></div>'};
  summaryStr+='</div>';

  var modalSummary = myApp.dialog.create({
    title: 'Complete!',
    text: '<div>Below are the settings you\'ve chosen.  These can be changed at anytime in your profile.</div>' + summaryStr,
/*
      summaryStr='<div class="ftSummaryList">';
      if (typeof ftBinding!="ftBinding") {summaryStr+='<div>Front Binding: <span class="floatRight bold">'+ ftBinding +'</span></div>'};
      summaryStr+='<div>Fin Length: <span class="floatRight bold">'+ ftLength +'</span></div>';
      summaryStr+='<div>Fin Depth: <span class="floatRight bold">'+ ftDepth +'</span></div>';
      summaryStr+='<div>Fin DFT: <span class="floatRight bold">'+ ftDFT +'</span></div>';
      summaryStr+='<div>Water Temp: <span class="floatRight bold">'+ measure_water_temp +'</span></div>';
      summaryStr+='</div>';
      */
      //afterText:summaryStr,
    buttons: [
      {
        text: 'Oops!',
        bold: true,
        onClick: function () {
          firstTimeBinding();
        }
      },
      {
        text: 'Perfect!',
        bold: true,
        onClick: function () {
          saveMeasuring();
        }
      },
    ]
  }).open();
}



function saveMeasuring() {
  console.log('in saveMeasuring');

  if (offline) return onOffline();

  console.log('saveMeasuring function fired with user_name ' + user_name);

  var url=wsURL+'ws_set_how_i_measure_ret_json.php';
  var passed;

  myApp.request({url:url,data:{ user_name:thisUser.user_name,measure_binding:ftBinding,measure_length:ftLength,measure_depth:ftDepth,measure_dft:ftDFT,measure_water_temp:measure_water_temp },type:'POST',dataType: 'json',success:function(json_Obj) {
      if (json_Obj.length>0) { // RETURNED RESULTS
        if (json_Obj[0].RETURN_CODE==1) {
          console.log('success with obj ' + json_Obj)
          thisUser.profileActivated=true;
          passed=true;
        } else {
          console.log('json success, but not return code 1.');
          passed=false;
        }
      } else {
        console.log('json success, but no data/return code sent');
        passed=false;
      }
    }, timeout: 5000
    , beforeSend: function(){
      console.log('beforeSend saveMeasuring');
      //myApp.showIndicator();
      myApp.preloader.show();
    }, complete: function(){
        console.log('complete saveMeasuring');
        if (passed) { // CHANGE THESE OBJECT PROPERTIES IF CHANGED DURING LOGIN SELF SELECTION
          if (ftBinding) thisUser.measure_binding=ftBinding;
          if (ftLength) thisUser.measure_length=ftLength;
          if (ftDepth) thisUser.measure_depth=ftDepth;
          if (ftDFT) thisUser.measure_dft=ftDFT;
          if (measure_water_temp) thisUser.measure_water_temp=measure_water_temp;
          //myApp.hideIndicator();
          myApp.preloader.hide();
//          mainView.router.load( { url:'mySettings.html'});
          getCurrentSki(thisUser.user_name); // THIS IS IN THE skiClass.php file...first time user will not have any but it will route around
        } else {
          myApp.dialog.alert(
            'Data could not be saved due to an unknown error.  Please try again.',
            'Save Failed',
            function () {
              firstTimeBinding();
            }
          );
        }
    }, error: function(json_Obj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + json_Obj + status + err);
        } else {
          console.log("error: "  + status + err);
        }
    }
  }); // END ajax function for saveMeasuring
}
