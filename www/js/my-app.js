// only needed for ios/android interface differences
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
var offline = true;
// only needed for ios/android interface differences if using Template7
/*
Template7.global = {
    android: isAndroid,
    ios: isIos
};
*/




// Init App
var myApp = new Framework7({
    // Enable Material theme for Android device only
    material: isAndroid ? true : false //,
    // Enable Template7 pages
    //template7Pages: true
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


// only needed for ios/android interface differences to apply material design
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true
});



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!  Device name is " + device.name);

    if (navigator.connection && navigator.connection.type == Connection.NONE) {
          console.log('NO NETWORK CONNECTION');
      } else {
          console.log('NETWORK CONNECTION ESTABLISHED.');
          offline=false;
      }

  document.addEventListener("offline", onOffline, false);
  document.addEventListener("online", onOnline, false);



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
      //$$('#factory_brand').css('height',$$('#factory_brand.list-block').css('height') );
      //var fbHeight=$$('#factory_brand').height();
      //$$('#factory_brand').css({'height':fbHeight+'px'});
      //document.getElementById('factory_brand').style.height = fbHeight+'px';
      //document.getElementById('factory_brand').style.height='222px';
      console.log('factory_brand height is ' + document.getElementById('factory_brand').style.height );
      //$$('#factory_brand.list-block').css({'height':'0px'}).transition(2000);
      $$('#factory_brand, #skiSelected, #saveStock').attr('style','opacity:0;height:0px;margin-top:0px').transition(750);
      //document.getElementById("factory_brand").setAttribute("style", "height:0px; opacity: 0;").transition(2000);
      //document.getElementById('factory_brand').css({'height':'0px'}).transition(2000);

      storeSettingsLocally();

      //$$('#skiSelected').hide();
      //$$('#factory_brand').hide();
      //$$('#saveStock').css({'height':'0px','opacity':0}).transition(4000);
      //$$('#factory_brand').css({'height':'0px','opacity':0}).transition(2000);
      //$$('#skiSelected').css({'height':'0px','opacity':0}).transition(2000);

      //setTimeout($$('#factory_brand').hide(),6500);
      //setTimeout($$('#saveStock').parent().remove(),1100);
      $$('#saveStock').transitionEnd(function(){
        console.log('TRANSITION ENDED.......');
        $$('#factory_brand, #skiSelected').hide();
      });

      //$$('#saveStock').parent().remove();// removes the save buttons so can't duplicate saving
      $$('#skiLookup').show();
      getLocalSettings(); // this redraws screen for saved settings
      $$('#ul_saved_list>li:first-child').addClass('lightBlueBG'); //.css('background-color','#cfc');
    });




    if ( getLocalStorage('stockSkis') ) {
        getLocalSettings();
    } else { // show message on front page so user knows how to get started
      $$('<div class="center">Start by selecting the link below, then choose a ski brand, model, length and year (optional).<p>Save for quick access in the future.</div>').insertAfter('#indexTitle');
    }

    //$$('#factory_brand').transitionEnd(function(){ console.log('!!! TRANSITION ENDED !!!!'); });

    //console.log('navigator object is ' + navigator.connection);



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


}); // end DeviceReady


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




// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

myApp.onPageInit('index', function (page) {
    // Do something here for "index" page
    alert('index page');
})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;



    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
    if (page.name === 'index') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes index page');
    }

})




// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="index"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes index page');
})


// TESTING TO SEE HOW TO ACCESS DYNAMIC SMART SELECT page
$$(document).on('pageInit', '.page[data-select-name="brand"]', function (e) {
    console.log('brands smart select initialized');
    $$('.smart-select #brand_select_id').change(getModels); // run getModels function

  //  if ($$('.page[data-select-name="brand"]').find(("input[type='radio']:checked")) ) {
    //  var theName=$$('.page[data-select-name="brand"]').find(("input[type='radio']:checked"))[0].name;
    //  alert(theName);
      $$('.page[data-select-name="brand"]').find(("input[type='radio']:checked")).prop('checked', false);
    //}

})

$$(document).on('pageInit', '.page[data-select-name="model"]', function (e) {
    console.log('model smart select initialized');
    $$('.smart-select #model_select_id').change(getLengths);
    $$('.page[data-select-name="model"]').find(("input[type='radio']:checked")).prop('checked', false);
})

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

/*
  if ( $$(clickedObj).hasClass('brand_Connelly') ) return 'Connelly';
  if ( $$(clickedObj).hasClass('brand_D3') ) return 'D3';
  if ( $$(clickedObj).hasClass('brand_Goode') ) return 'Goode';
  if ( $$(clickedObj).hasClass('brand_Reflex') ) return 'Reflex';
  else return false;
  */
}






 console.log('triggering getHowToMeasure function');
 var measureObj={}; // make object global
 getHowToMeasure();

function getHowToMeasure() {
console.log('inside getHowToMeasure');
 var url='http://finappv2.paulsantangelo.com/ws/ws_get_how_to_measure_ret_json.php';
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
