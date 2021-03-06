function skiLookup() {
//$$('#skiLookup').click(function() {
  console.log('skiLookkup clicked');
  //$$('#factory_brand').show();
  console.log('offline is '+ offline);
  if (offline) return onOffline();

  if ($$('.page #list_brand')) $$('.page #list_brand').remove();
  if ($$('.page .smart-select #brand_select_id')) $$('.page .smart-select #brand_select_id').remove();

  if ($$('.page #list_model')) $$('.page #list_model').remove();
  if ($$('.page .smart-select #model_select_id')) $$('.page .smart-select #model_select_id').remove();

  if ($$('.page #list_length')) $$('.page #list_length').remove();
  if ($$('.page .smart-select #length_select_id')) $$('.page .smart-select #length_select_id').remove();

  if ($$('.page #list_year')) $$('.page #list_year').remove();
  if ($$('.page .smart-select #year_select_id')) $$('.page .smart-select #year_select_id').remove();

  var loggedIn=false;
  var url=wsURL+'ws_ski_lookup_ret_json.php';

  myApp.request({url:url,data:{ ski_attr: "brands",logged_in:loggedIn},type:'POST',dataType: 'json',success:function(brandsObj) {
    console.log('in success for skiLookup for brands');
    $$(".page #skiSelected").html('').hide();
  //var brandList = '<div class="item-input"><select name="brand" id="brand">';

    var brandList = '<ul id="ul_stock_list"><li id="list_brand"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Brand"><select name="brand" id="brand_select_id" class="brand_class">';

    //brandList += '<option>Select Brand...</option>';
    $$.each(brandsObj, function( index, value ) {
      brandList += '<option name="brand_option" value="'+ value.brand + '">'+ value.brand + '</option>';
    });
    brandList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Brand</div><div class="item-after"></div></div></div></a></ul>';



    $$(".page #factory_brand").html(brandList).trigger('create');
    $$(".page #skiLookup").hide();


    }, timeout: 5000

    , beforeSend: function(){
      console.log('beforeSend skiLookup for brands');
      //setTimeout( myApp.showIndicator(),4200);
      //t = setTimeout( myApp.showIndicator , 200);
      myApp.preloader.show();
      //console.log('brandtimeout is ' + t);

    }, complete: function(){
        console.log('complete skiLookup for brands');
        $$('.page #brand_select_id').click();

        // I animate closing these when user saves settings, so need to unanimate them
        $$('.page #factory_brand').css({'opacity':1,'display':'block','height':'auto'});
        myApp.preloader.hide();

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



//$$("div[data-select-name='brand']").change(function() {
//  $$('.smart-select #brand_select_id').change(function() {
  function getModels() {
//$$("#factory_brand").change(function() {
		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
		//theBrand = ( $$('#brand').val() );
    //theBrand = $$('#list_brand .item-content .item-inner .item-after').text();
    if (offline) return onOffline();

    if ($$('.page #list_model')) $$('.page #list_model').remove();
    if ($$('.page .smart-select #model_select_id')) $$('.page .smart-select #model_select_id').remove();

    if ($$('.page #list_length')) $$('.page #list_length').remove();
    if ($$('.page .smart-select #length_select_id')) $$('.page .smart-select #length_select_id').remove();

    if ($$('.page #list_year')) $$('.page #list_year').remove();
    if ($$('.page .smart-select #year_select_id')) $$('.page .smart-select #year_select_id').remove();


    $$(".page #skiSelected").html('').hide();

    //theBrand = $$('.smart-select select')["0"].value;
    //if ( $$('.page .smart-select #brand_select_id')["1"] ) $$('.page .smart-select #brand_select_id')["1"].remove();

    //console.log('HOLY COW!!!!! brand is  ' +  $$(".page .smart-select .item-after").text() );
    //$$(".page .smart-select .item-after").html($$('.page .smart-select #brand_select_id')["0"].value);

    theBrand = $$('.page .smart-select #brand_select_id')["0"].value;

    console.log('factory_Brand fired change...theBrand = ' + theBrand)
    var url=wsURL+'ws_ski_lookup_ret_json.php';

		myApp.request({url:url,data:{ ski_attr:"models",brand:theBrand },type:'POST',dataType: 'json',success:function(modelsObj) {

			var modelList = '<li id="list_model"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Model"><select name="model" id="model_select_id" class="model_class">';

			$$.each(modelsObj, function( index, value ) {
				modelList += '<option value="'+ value.model + '">'+ value.model + '</option>';
			});

      modelList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Model</div><div class="item-after"></div></div></div></a>';

			$$(".page #ul_stock_list").append(modelList).trigger('create');

      }, timeout: 5000
      , beforeSend: function(){
        console.log('beforeSend skiLookup for models');
        myApp.preloader.show();

      }, complete: function(){
          console.log('complete skiLookup for models');
          $$('#model_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
          console.log('after click triggered');

/*
          if ($$(".page #list_brand .item-content .item-inner .item-after").text() == null) {
            console.log("      IN empty brand after selected");
            $$(".page #list_brand .item-content .item-inner .item-after").text($$('.page .smart-select #brand_select_id')["0"].value) ;
          }
*/

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
//);



//  $$("#factory_model").change(function() {
/*
  function getYears() {
  		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
  		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
  		//theModel = ( $$('#model').val() );
      //theModel = $$('#list_model .item-content .item-inner .item-after').text();
      if (offline) return onOffline();

      if ($$('.page #list_year')) $$('.page #list_year').remove();
      if ($$('.page .smart-select #year_select_id')) $$('.page .smart-select #year_select_id').remove();
      //if ($$('#list_length')) $$('#list_length').remove();
      $$(".page #skiSelected").html('').hide();

      //theLength = $$('.smart-select select')["2"].value;
      theLength = $$('.page .smart-select #length_select_id')["0"].value;
      //theModel = $$('.smart-select select')["1"].value;
      //console.log('model change fired...theModel = ' + theModel)

      /*
      if (nullYear == null) {
        theYear=null;
      } else {
      theYear = $$('.smart-select select')["2"].value;
    }

      console.log("theYear is " + theYear);
*/
/*
      var url=wsURL+'ws_ski_lookup_ret_json.php';

      var yearVal;
  		//myApp.request({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel},type:'POST',dataType: 'json',success:function(yearsObj) {
      myApp.request({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel, length:theLength},type:'POST',dataType: 'json',success:function(yearsObj) {
        if (yearsObj[0]["year"] != null) {
          yearVal=true;
    			var yearList = '<li id="list_year"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Year"><select name="year" id="year_select_id">';

    			$$.each(yearsObj, function( index, value ) {
    				yearList += '<option value="'+ value.year + '">'+ value.year + '</option>';
    			});
    			yearList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Year</div><div class="item-after"></div></div></div></a>';
    			$$(".page #ul_stock_list").append(yearList).trigger('create');
        } else {
          yearVal=false;
          theYear=null;
        }
  		}, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for years');
          myApp.preloader.show();

        }, complete: function(){
          if (yearVal) {
            console.log('in complete with yearVal = true');
            myApp.preloader.hide();
            $$('#year_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
    				//$("#year").selectmenu('refresh');
    				//window.scrollTo(0, $("#factory_year").offset().top);
          } else {
            console.log('in complete with yearVal = false');
            //$$('#factory_year').trigger("change");
            //getStockSettings(null);
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
//);
*/




    // ******* AJAX CALL FOR SKI LENGTH	*********//
//  	$$('#factory_year').change(function() {
//function getLengths(nullYear) {
function getLengths() {
  		//$$('#factory_current,#factory_my_name,#factory_submit').hide(); // HIDE THESE
      //if (yearVal) {
  		    //theYear = ( $$("#year").val() );
          if (offline) return onOffline();

          if ($$('.page #list_length')) $$('.page #list_length').remove();
          if ($$('.page .smart-select #length_select_id')) $$('.page .smart-select #length_select_id').remove();

          if ($$('.page #list_year')) $$('.page #list_year').remove();
          if ($$('.page .smart-select #year_select_id')) $$('.page .smart-select #year_select_id').remove();

        $$(".page #skiSelected").html('').hide();

        //theModel = $$('.smart-select select')["1"].value;
      //  console.log('HOLY Macroni!!!!! models is  ' +  $$(".page .smart-select .item-after").text() );
        theModel = $$('.page .smart-select #model_select_id')["0"].value;
        /*
        if (nullYear == null) {
          theYear=null;
        } else {
        theYear = $$('.smart-select select')["2"].value;
      }

        console.log("theYear is " + theYear);
      */


      //} else {
      //  theYear=null;
      //}
      var url=wsURL+'ws_ski_lookup_ret_json.php';
  		//myApp.request({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel, year: theYear},type:'POST',dataType: 'json',success:function(lengthsObj) {
      myApp.request({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel},type:'POST',dataType: 'json',success:function(lengthsObj) {
  			var lengthList = '<li id="list_length"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Length"><select name="length" id="length_select_id">';
  			$$.each(lengthsObj, function( index, value ) {
  				lengthList += '<option value="'+ value.length + '">'+ value.length + '</option>';
  			});
        lengthList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Length</div><div class="item-after"></div></div></div></a>';
        $$(".page #ul_stock_list").append(lengthList).trigger('create');

      }, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for length');
          myApp.preloader.show();
        }, complete: function(){
            console.log('in complete for lengthsObj');
            myApp.preloader.hide();
            $$('#length_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
    		}, error: function(lengthsObj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + lengthsObj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function
  	}
//);


//    $$('#factory_length').change(function() {
function getStockSettings() {
  console.log('in getStockSettings');
  if (offline) return onOffline();

      if (typeof myApp.data.lookup.skiYear == 'undefined') {
        optionalYear='';
      } else {
        optionalYear=myApp.data.lookup.skiYear;
      }


      //console.log('AND NOW theYear = ' + theYear);


      var url=wsURL+'ws_get_stock_settings_ret_json.php';
  		myApp.request({url:url,data:{ theBrand:myApp.data.lookup.skiBrand, theModel:myApp.data.lookup.skiModel, theYear:optionalYear, theLength:myApp.data.lookup.skiLength},type:'POST',dataType: 'json',success:function(stock_Obj) {
        window.stock_Obj=stock_Obj;
        if (stock_Obj.status=='success' && stock_Obj.RETURN_CODE==1) { // RETURNED RESULTS
          //if (stock_Obj[0].RETURN_CODE==1) {
          //window.stock_Obj=stock_Obj;
          myApp.data.settingArray=stock_Obj.data; // this will have the array of all ski settings.

          console.log('stock_Obj.success=' +stock_Obj.success);
          if (stock_Obj.status='success' && stock_Obj.RETURN_CODE==1) {
            $$(".page #skiSelected").html('<div class="center bold">' +optionalYear+ ' ' +myApp.data.lookup.skiBrand+ ' ' +myApp.data.lookup.skiModel+ ' ' +myApp.data.lookup.skiLength+ '</div>');
            $$(".page #skiSelected").append('<div class="row head_setting_table"><div class="col-20">Binding</div><div class="col-20">Length</div><div class="col-20">Depth</div><div class="col-20">DFT</div><div class="col-20">Wing</div></div>');

            var ss=stock_Obj.data;
            window.ss=ss;

            ss.forEach( function( element ) {
              if (element.setting_name) {
                $$(".page #skiSelected").append('<div class="marginBottomMinusHalf"><span class="lightBlueText">' +element.setting_name+ '</span></div>');
              }
                  $$(".page #skiSelected").append('<div class="row data_setting_table"><div class="col-20" id="stock_binding">'+element.stock_binding_location+'</div><div class="col-20" id="stock_length">'+element.stock_fin_length+'</div><div class="col-20" id="stock_depth">'+element.stock_fin_depth+'</div><div class="col-20" id="stock_dft">'+element.stock_fin_dft+'</div><div class="col-20"  id="stock_wing_angle">'+element.stock_wing_angle+'</div></div>');
            });


            $$(".page #skiSelected").append('<div class="center top_padding_5"><a href="#" class="create-sheet brand_'+myApp.data.lookup.skiBrand+'">How is this measured?</a></div>');

            if ($$(".page #saveStock").length<1) {
              $$('<div class="padding_top_5em"><a href="#" class="button button-fill" id="saveStock">Save to Stock List</a></div>').appendTo('.page #skiSelected');
            }

        		$$(".page #skiSelected").show();
          } else {
            console.log('json success, but no stock ski data found.');
          }
        }

      }, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for length');
          myApp.preloader.show();
        }, complete: function(){
            console.log('in complete for stock_Obj');

            //document.getElementById("factory_brand").setAttribute("style", "height":document.getElementById("factory_brand").getAttribute("height");
            var fbHeight=$$('#factory_brand').height();
            $$('#factory_brand').css({'height':fbHeight+'px'});
            document.getElementById('factory_brand').style.height = fbHeight+'px';

            $$('.page #saveStock').css({'opacity':1,'height':'auto'});
            //$$('#factory_brand').css({'opacity':1,'display':'show','height':'auto'});
            $$('.page #skiSelected').css({'opacity':1,'height':'auto'});
            myApp.preloader.hide();

    		}, error: function(stock_Obj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + stock_Obj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function


  	}
//);


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
