var ftBinding, ftLength, ftDepth, ftDFT;

function firstTimeEntry() {
  var modal = myApp.modal({
    title: 'Successful Login!',
    text: 'Before you get started, let us know how you plan to measure your set-up.',
    afterText:  '<div class="swiper-container" style="width: auto; margin:5px -15px -15px">'+
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
  });
}

function firstTimeBinding() {
  var modalBinding = myApp.modal({
    title:  'Front Binding',
    text: 'How do you measure your front binding?',
    afterText:  '',
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
  })
}



function firstTimeLength() {
  var modalLength = myApp.modal({
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
  });
}


function firstTimeDepth() {
  var modalDepth = myApp.modal({
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
  });
}



function firstTimeDFT() {
  var modalDFT = myApp.modal({
    title:  'Fin DFT',
    text: 'How do you measure the Depth From Tail (DFT) of your fin?',
    verticalButtons: true,
    buttons: [
      {
        text: 'Flat',
        onClick: function() {
          ftDFT='Flat';
          firstTimeSummary();
        }
      },
      {
        text: 'Needle',
        onClick: function() {
          ftDFT='Needle';
          firstTimeSummary();
        }
      },
      {
        text: 'Slot',
        onClick: function() {
          ftDFT='Slot';
          firstTimeSummary();
        }
      },
      {
        text: 'Axiom Tool',
        onClick: function() {
          ftDFT='Axiom';
          firstTimeSummary();
        }
      },
    ]
  });
}



function firstTimeSummary() {
  var modalSummary = myApp.modal({
    title: 'Complete!',
    text: 'Below are the settings you\'ve chosen.  These can be changed at anytime in your profile.',
    afterText:  '<div class="ftSummaryList">' +
                '<div>Front Binding: <span class="floatRight bold">'+ ftBinding +'</span></div>' +
                '<div>Fin Length: <span class="floatRight bold">'+ ftLength +'</span></div>' +
                '<div>Fin Depth: <span class="floatRight bold">'+ ftDepth +'</span></div>' +
                '<div>Fin DFT: <span class="floatRight bold">'+ ftDFT +'</span></div>' +
                '</div>',
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
  });
}



function saveMeasuring() {
  console.log('in saveMeasuring');

  if (offline) return onOffline();

  console.log('saveMeasuring function fired with user_name ' + user_name);

  var url=wsURL+'ws_set_how_i_measure_ret_json.php';
  var passed;

  $$.ajax({url:url,data:{ user_name:thisUser.user_name,measure_binding:ftBinding,measure_length:ftLength,measure_depth:ftDepth,measure_dft:ftDFT },type:'POST',dataType: 'json',success:function(json_Obj) {
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
      myApp.showIndicator();
    }, complete: function(){
        console.log('complete saveMeasuring');
        if (passed) {
          thisUser.measure_binding=ftBinding;
          thisUser.measure_length=ftLength;
          thisUser.measure_depth=ftDepth;
          thisUser.measure_dft=ftDFT;
          myApp.hideIndicator();
          mainView.router.load( { url:'mySettings.html'});
        } else {
          myApp.alert(
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
