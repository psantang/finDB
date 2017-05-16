// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;






// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true
});



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");



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
      $$('#ul_saved_list>li:first-child').addClass('lightGreenBG'); //.css('background-color','#cfc');
    });



    //$$('#skiSelected').transitionEnd(function(){ $$('#skiSelected').css({'height':'100px','opacity':1}).transition(2000); });

    if ( getLocalStorage('stockSkis').length>2 ) {
      //if ( $$("#getLocalSettings_div").css('display') == 'none') {
      //  $$("#getLocalSettings_div").show();
        getLocalSettings();
      //}
    }

    //$$('#factory_brand').transitionEnd(function(){ console.log('!!! TRANSITION ENDED !!!!'); });



});



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
