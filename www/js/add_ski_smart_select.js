function addSki() {
//$$('#skiLookup').click(function() {
  console.log('addSki function');
  //$$('#add_ski_div').show();
  console.log('offline is '+ offline);
  if (offline) return onOffline();

  if ($$('.page #list_brand_add')) $$('.page #list_brand_add').remove();
  if ($$('.page .smart-select #brand_select_id_add')) $$('.page .smart-select #brand_select_id_add').remove();

  if ($$('.page #list_model_add')) $$('.page #list_model_add').remove();
  if ($$('.page .smart-select #model_select_id_add')) $$('.page .smart-select #model_select_id_add').remove();

  if ($$('.page #list_length_add')) $$('.page #list_length_add').remove();
  if ($$('.page .smart-select #length_select_id_add')) $$('.page .smart-select #length_select_id_add').remove();

  if ($$('.page #list_year_add')) $$('.page #list_year_add').remove();
  if ($$('.page .smart-select #year_select_id_add')) $$('.page .smart-select #year_select_id_add').remove();

  var loggedIn=true;
  var url=wsURL+'ws_ski_lookup_ret_json.php';

  myApp.request({url:url,data:{ ski_attr: "brands",logged_in:loggedIn},type:'POST',dataType: 'json',success:function(brandsObj) {
    console.log('in success for skiLookup for brands');
    //$$("#skiSelected").html('').hide();

    var brandList = '<ul id="ul_stock_list_add"><li id="list_brand_add"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Brand"><select name="brand_add" id="brand_select_id_add" class="brand_class">';

    //brandList += '<option>Select Brand...</option>';
    //$$.each(brandsObj, function( index, value ) {
    for (a=0;a<brandsObj.length;a++) {
      //brandList += '<option name="brand_option" value="'+ value.brand + '">'+ value.brand + '</option>';
      brandList += '<option name="brand_option" value="'+ brandsObj[a].brand + '">'+ brandsObj[a].brand + '</option>';
    }
    //});
    brandList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Brand</div><div class="item-after"></div></div></div></a></ul>';

    $$(".page #add_ski_div").html(brandList).trigger('create');
    //$$("#skiLookup").hide();

    }, timeout: 5000

    , beforeSend: function(){
      console.log('beforeSend skiLookup for brands in addski');
      myApp.preloader.show();

    }, complete: function(){
        console.log('complete skiLookup for brands in addski');
        $$('.page #add_ski_div').css({'opacity':1,'display':'block','height':'auto'});
        myApp.preloader.hide();
        $$('.page #brand_select_id_add').click();

    }, error: function(brandsObj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + brandsObj + status + err);
        } else {
          console.log("error: " + status + err);
        }
    }
  }) // END ajax function for ski brands
//});
}



  function getModels_add() {

    if (offline) return onOffline();

    if ($$('.page #list_model_add')) $$('.page #list_model_add').remove();
    if ($$('.page .smart-select #model_select_id_add')) $$('.page .smart-select #model_select_id_add').remove();

    if ($$('.page #list_length_add')) $$('.page #list_length_add').remove();
    if ($$('.page .smart-select #length_select_id_add')) $$('.page .smart-select #length_select_id_add').remove();

    if ($$('.page #list_year_add')) $$('.page #list_year_add').remove();
    if ($$('.page .smart-select #year_select_id_add')) $$('.page .smart-select #year_select_id_add').remove();

    //$$("#skiSelected").html('').hide();

    //theBrand = $$('.smart-select select')["0"].value;
    theBrand = $$('.page .smart-select #brand_select_id_add')["0"].value;

    console.log('factory_Brand fired change...theBrand = ' + theBrand)
    var url=wsURL+'ws_ski_lookup_ret_json.php';

		myApp.request({url:url,data:{ ski_attr:"models",brand:theBrand },type:'POST',dataType: 'json',success:function(modelsObj) {

			var modelList = '<li id="list_model_add"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Model"><select name="model_add" id="model_select_id_add" class="model_class">';

			//$$.each(modelsObj, function( index, value ) {
      for (a=0;a<modelsObj.length;a++) {
				modelList += '<option value="'+ modelsObj[a].model + '">'+ modelsObj[a].model + '</option>';
      }
			//});

      modelList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Model</div><div class="item-after"></div></div></div></a>';

			$$(".page #ul_stock_list_add").append(modelList).trigger('create');

      }, timeout: 5000
      , beforeSend: function(){
        console.log('beforeSend for models in addski');
        myApp.preloader.show();

      }, complete: function(){
          console.log('complete  for models in addski');
          $$('#model_select_id_add').click(); // this would autoclick the next selector, but not the correct place to put it.
          console.log('after click triggered');
          myApp.preloader.hide();

      }, error: function(brandsObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + brandsObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }) // END ajax function for models
	}





function getLengths_add() {
        if (offline) return onOffline();

            if ($$('.page #list_length_add')) $$('.page #list_length_add').remove();
            if ($$('.page .smart-select #length_select_id_add')) $$('.page .smart-select #length_select_id_add').remove();

            if ($$('.page #list_year_add')) $$('.page #list_year_add').remove();
            if ($$('.page .smart-select #year_select_id_add')) $$('.page .smart-select #year_select_id_add').remove();


        theModel = $$('.page .smart-select #model_select_id_add')["0"].value;

      var url=wsURL+'ws_ski_lookup_ret_json.php';
  		//myApp.request({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel, year: theYear},type:'POST',dataType: 'json',success:function(lengthsObj) {
      myApp.request({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel},type:'POST',dataType: 'json',success:function(lengthsObj) {
  			var lengthList = '<li id="list_length_add"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Length"><select name="length_add" id="length_select_id_add">';

        //$$.each(lengthsObj, function( index, value ) {
        for (a=0;a<lengthsObj.length;a++) {
  				lengthList += '<option value="'+ lengthsObj[a].length + '">'+ lengthsObj[a].length + '</option>';
        }
        //});

        lengthList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Length</div><div class="item-after"></div></div></div></a>';
        $$(".page #ul_stock_list_add").append(lengthList).trigger('create');

      }, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend for length in addski');
          myApp.preloader.show();
        }, complete: function(){
            console.log('in complete for lengthsObj');
            myApp.preloader.hide();
            $$('#length_select_id_add').click(); // this would autoclick the next selector, but not the correct place to put it.
    		}, error: function(lengthsObj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + lengthsObj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function
  	}






    function getYears_add() {
        if (offline) return onOffline();

        if ($$('.page #list_year_add')) $$('.page #list_year_add').remove();
        if ($$('.page .smart-select #year_select_id_add')) $$('.page .smart-select #year_select_id_add').remove();

        theLength = $$('.page .smart-select #length_select_id_add')["0"].value;

        var url=wsURL+'ws_ski_lookup_ret_json.php';

        var yearVal;
        //myApp.request({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel},type:'POST',dataType: 'json',success:function(yearsObj) {
        myApp.request({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel, length:theLength},type:'POST',dataType: 'json',success:function(yearsObj) {
          if (yearsObj[0]["year"] != null) {
            yearVal=true;
            var yearList = '<li id="list_year_add"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Year"><select name="year_add" id="year_select_id_add">';

            //$$.each(yearsObj, function( index, value ) {
            for (a=0;a<yearsObj.length;a++) {
              yearList += '<option value="'+ yearsObj[a].year + '">'+ yearsObj[a].year + '</option>';
            }
            //});
            yearList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Year</div><div class="item-after"></div></div></div></a>';
            $$(".page #ul_stock_list_add").append(yearList).trigger('create');
          } else {
            yearVal=false;
            theYear=null;
          }
        }, timeout: 5000
          , beforeSend: function() {
            console.log('beforeSend for years for add ski functions');
            //myApp.preloader.show();
            myApp.preloader.show();

          }, complete: function() {

            if (yearVal) {
              console.log('in complete with yearVal = true');
              myApp.preloader.hide();
              $$('#year_select_id_add').click();

            } else {
              console.log('in complete with yearVal = false');
              skiName = theBrand + " " + theModel + " " + theLength;
              promptSkiName(null, skiName);
              //insertSki(null);
            }
          }, error: function(yearsObj, status, err) {
              if (status == "timeout") {
                console.log("Timeout Error. " + yearsObj + status + err);
              } else {
                console.log("error: "  + status + err);
              }
          }
        }) // END ajax function for models
      }





function promptSkiName (year) {
  //myApp.modal({
  var skiName=myApp.data.lookup.skiYear + ' ' +myApp.data.lookup.skiBrand+ ' ' +myApp.data.lookup.skiModel+ ' ' +myApp.data.lookup.skiLength;
  myApp.dialog.create({
    title: skiName,
    text: 'will be the name of your ski.  You can change it by entering a new name below.<div class="input-field"><input type="text" name="newSkiName" id="newSkiName" placeholder="Change Ski Name" value="" /></div>',
    buttons: [
      {
        text: 'Save',
        onClick: function() {
          newSkiName=$$("#newSkiName").val();
          if (newSkiName.length>0) {
            defaultToCurrentSki(year,newSkiName);
          } else {
            defaultToCurrentSki(year,skiName);
          }
        }
      }
    ]
  }).open();
}

function defaultToCurrentSki(year,skiName) {

  if (typeof thisSki !== "undefined") { // IF THIS IS THE USERS FIRST SKI ENTRY
  console.log('in defaultToCurrentSki and thisSki IS defined');
    myApp.dialog.create({
      title:  'Current Ski?',
      text: 'Do you want this to be your current ski?',
      buttons: [
        {
          text: 'Yes',
          onClick: function() {
            console.log('IS the current ski');
            insertSki(year,skiName,1);
          }
        },
        {
          text: 'No',
          onClick: function() {
            console.log('is NOT the current ski');
            insertSki(year,skiName,0);
          }
        }
      ]
    }).open();
  } else {
    console.log('in defaultToCurrentSki and thisSki is not defined');
    insertSki(year,skiName,1); // insert the ski as the default ski since it's the first one
  }
}


function insertSki(nullYear,my_ski_name,current) {
    console.log('running insertSki function');
    if (offline) return onOffline();



    if (nullYear == null) {
      theYear=null;
    } else {
      //theYear = $$('.page .smart-select #year_select_id_add')["0"].value;
      theYear=myApp.data.lookup.skiYear
    }

    var url=wsURL+'ws_add_ski_ret_json.php';

    myApp.request({url:url,data:{ user_name:thisUser.user_name,my_ski_name:my_ski_name,current:current,brand:myApp.data.lookup.skiBrand,model:myApp.data.lookup.skiModel,length:myApp.data.lookup.skiLength,year:theYear},type:'POST',dataType: 'json',success:function(jsonObj) {
      if (jsonObj[0].RETURN_CODE==1) {
        console.log('return code 1...success')
      } else {
        console.log('return code NOT 1...no luck')
      }
    }, timeout: 5000
      , beforeSend: function() {
        console.log('beforeSend insertSki');

        myApp.preloader.show();

      }, complete: function() {

          console.log('in complete insertSki');
          myApp.preloader.hide();
          // NOW REFRESH INTERFACE, but mySki list and mySettings page.
          if (current==1) {
            console.log('complete and current is 1');
            getCurrentSki(thisUser.user_name);
          } else {
            console.log('complete and current is NOT 1');
            $$(".page #saved_ski_list").remove();
            getMySkis(thisUser.user_name);
            closeAddSkiSelect();
            //mainView.router.load( { url:'mySkis.html' });
          }
          //mainView.router.load( { url:'mySettings.html' });


      }, error: function(jsonObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + jsonObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }) // END ajax function for models
  }





/*
function promptSkiName_old(year) {
//$$('.prompt-title-ok-cancel').on('click', function () {
myApp.prompt('Your ski will be labeled ' + skiName + '.  You can change it by typing below.', 'Name Your Ski',
  function (value) {
    defaultToCurrentSki(year,value);
  },
  function (value) {
    defaultToCurrentSki(year,skiName);
  }
);
}
*/
function defaultToCurrentSki_old(year,skiName) {
//$$('.prompt-title-ok-cancel').on('click', function () {
myApp.confirm('Do you want this to be your current ski?','Current Ski?',
  function () {
    console.log('IS the current ski');
    insertSki(year,skiName,1);
  },
  function () {
    console.log('is NOT the current ski');
    insertSki(year,skiName,0);
  }
);
//  });
}


// BELOW ARE EVENT LISTENERS FOR ADD SKI SMART SELECT
/*
$$(document).on('pageInit', '.page[data-select-name="brand_add"]', function (e) {
    console.log('brands smart select initialized in addski');

    $$('.smart-select #brand_select_id_add').change(getModels_add); // run getModels function
      $$('.page[data-select-name="brand_add"]').find(("input[type='radio']:checked")).prop('checked', false);
});
*/

$$(document).on('pageInit', '.page[data-select-name="model_add"]', function (e) {
    console.log('model smart select initialized in addski');
    $$('.smart-select #model_select_id_add').change(getLengths_add);
    $$('.page[data-select-name="model_add"]').find(("input[type='radio']:checked")).prop('checked', false);
})

$$(document).on('pageInit', '.page[data-select-name="length_add"]', function (e) {
    console.log('length smart select initialized in addski');
    $$('.smart-select #length_select_id_add').change(getYears_add);
    $$('.page[data-select-name="length_add"]').find(("input[type='radio']:checked")).prop('checked', false);
})

$$(document).on('pageInit', '.page[data-select-name="year_add"]', function (e) {
    console.log('year smart select initialized from page mySkis');
//    $$('.smart-select #year_select_id_add').change(insertSki);
    $$('.page[data-select-name="year_add"]').find(("input[type='radio']:checked")).prop('checked', false);
      $$('.smart-select #year_select_id_add').change( function() {
        theYear = $$('.page .smart-select #year_select_id_add')["0"].value;
        skiName=theBrand + " " + theModel + " " + theLength + " " + theYear;
        promptSkiName(theYear, skiName);
    });

})


// close smart select list
function closeAddSkiSelect () {
  console.log('closeAddSkiSelect triggered');
  document.getElementById("add_ski_div").setAttribute("style", "height:220px")
  console.log('add_ski_div height is ' + document.getElementById('add_ski_div').style.height );
  $$('.page #add_ski_div').attr('style','opacity:0;height:0px;margin-top:0px').transition(750);

  $$('#add_ski_div').transitionEnd(function(){
    console.log('add_ski_div TRANSITION ENDED.......');
    $$('.page #ul_stock_list_add').remove();
  });
}
