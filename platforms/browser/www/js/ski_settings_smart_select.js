
$$('#skiLookup').click(function() {
  console.log('skiLookkup clicked');
  var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

  $$.ajax({url:url,data:{ ski_attr: "brands"},type:'POST',dataType: 'json',success:function(brandsObj) {
    console.log('in success for skiLookup for brands');
    $$("#skiSelected").html('').hide();
  //var brandList = '<div class="item-input"><select name="brand" id="brand">';

    var brandList = '<ul id="ul_stock_list"><li id="list_brand"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Brand"><select name="brand" id="brand_select_id" class="brand_class">';

    //brandList += '<option>Select Brand...</option>';
    $$.each(brandsObj, function( index, value ) {
      brandList += '<option name="brand_option" value="'+ value.brand + '">'+ value.brand + '</option>';
    });
    brandList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Brand</div><div class="item-after"></div></div></div></a></ul>';



    $$("#factory_brand").html(brandList).trigger('create');



    }, timout: 5000

    , beforeSend: function(){
      console.log('beforeSend skiLookup for brands');

    }, complete: function(){
        console.log('complete skiLookup for brands');
        $$('#brand_select_id').click();

    }, error: function(brandsObj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + brandsObj + status + err);
        } else {
          console.log("error: " + status + err);
        }
    }
  }) // END ajax function for ski brands
});




//$$("div[data-select-name='brand']").change(function() {
//  $$('.smart-select #brand_select_id').change(function() {
  function getModels() {
//$$("#factory_brand").change(function() {
		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
		//theBrand = ( $$('#brand').val() );
    //theBrand = $$('#list_brand .item-content .item-inner .item-after').text();
    if ($$('#list_model')) $$('#list_model').remove();
    if ($$('#list_year')) $$('#list_year').remove();
    if ($$('#list_length')) $$('#list_length').remove();
    $$("#skiSelected").html('').hide();

    //theBrand = $$('.smart-select select')["0"].value;
    theBrand = $$('.smart-select #brand_select_id')["0"].value;

    console.log('factory_Brand fired change...theBrand = ' + theBrand)
    var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

		$$.ajax({url:url,data:{ ski_attr:"models",brand:theBrand },type:'POST',dataType: 'json',success:function(modelsObj) {

			var modelList = '<li id="list_model"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Model"><select name="model" id="model_select_id" class="model_class">';

			$$.each(modelsObj, function( index, value ) {
				modelList += '<option value="'+ value.model + '">'+ value.model + '</option>';
			});

      modelList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Model</div><div class="item-after"></div></div></div></a>';

			$$("#ul_stock_list").append(modelList).trigger('create');
      //$$("#factory_model").html(modelList).trigger('create');
      //$$("#factory_model").html(modelList).trigger('create');

      }, timout: 5000
      , beforeSend: function(){
        console.log('beforeSend skiLookup for models');

      }, complete: function(){
          console.log('complete skiLookup for models');
          //$$('#model_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
          console.log('after click triggered');

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
  function getYears() {
  		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
  		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
  		//theModel = ( $$('#model').val() );
      //theModel = $$('#list_model .item-content .item-inner .item-after').text();
      if ($$('#list_year')) $$('#list_year').remove();
      //if ($$('#list_length')) $$('#list_length').remove();
      $$("#skiSelected").html('').hide();

      //theLength = $$('.smart-select select')["2"].value;
      theLength = $$('.smart-select #length_select_id')["0"].value;
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

      var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

      var yearVal;
  		//$$.ajax({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel},type:'POST',dataType: 'json',success:function(yearsObj) {
      $$.ajax({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel, length:theLength},type:'POST',dataType: 'json',success:function(yearsObj) {
        if (yearsObj[0]["year"] != null) {
          yearVal=true;
    			var yearList = '<li id="list_year"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Year"><select name="year" id="year_select_id">';

    			$$.each(yearsObj, function( index, value ) {
    				yearList += '<option value="'+ value.year + '">'+ value.year + '</option>';
    			});
    			yearList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Year</div><div class="item-after"></div></div></div></a>';
    			$$("#ul_stock_list").append(yearList).trigger('create');
        } else {
          yearVal=false;
          theYear=null;
        }
  		}, timout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for years');

        }, complete: function(){
          if (yearVal) {
            console.log('in complete with yearVal = true');
            //$$('#year_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
    				//$("#year").selectmenu('refresh');
    				//window.scrollTo(0, $("#factory_year").offset().top);
          } else {
            console.log('in complete with yearVal = false');
            //$$('#factory_year').trigger("change");
            getStockSettings(null);
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





    // ******* AJAX CALL FOR SKI LENGTH	*********//
//  	$$('#factory_year').change(function() {
//function getLengths(nullYear) {
function getLengths() {
  		//$$('#factory_current,#factory_my_name,#factory_submit').hide(); // HIDE THESE
      //if (yearVal) {
  		    //theYear = ( $$("#year").val() );
        if ($$('#list_length')) $$('#list_length').remove();
        if ($$('#list_year')) $$('#list_year').remove();
        $$("#skiSelected").html('').hide();

        //theModel = $$('.smart-select select')["1"].value;
        theModel = $$('.smart-select #model_select_id')["0"].value;
        /*
        if (nullYear == null) {
          theYear=null;
        } else {
        theYear = $$('.smart-select select')["2"].value;
      }

        console.log("theYear is " + theYear);
      */
      //    if ( (typeof theYear == 'undefined') || theYear == null ) {
      //      theYear=null;
      //    }

      //} else {
      //  theYear=null;
      //}
      var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';
  		//$$.ajax({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel, year: theYear},type:'POST',dataType: 'json',success:function(lengthsObj) {
      $$.ajax({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel},type:'POST',dataType: 'json',success:function(lengthsObj) {
  			var lengthList = '<li id="list_length"><a href="#" class="item-link smart-select" data-back-on-select="true" data-page-title="Ski Length"><select name="length" id="length_select_id">';
  			$$.each(lengthsObj, function( index, value ) {
  				lengthList += '<option value="'+ value.length + '">'+ value.length + '</option>';
  			});
        lengthList += '</select><div class="item-content"><div class="item-inner"><div class="item-title">Length</div><div class="item-after"></div></div></div></a>';
        $$("#ul_stock_list").append(lengthList).trigger('create');

      }, timout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for length');

        }, complete: function(){
            console.log('in complete for lengthsObj');
            //$$('#length_select_id').click(); // this would autoclick the next selector, but not the correct place to put it.
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
function getStockSettings(nullYear) {
  console.log('nullYear = ' + nullYear);
      /*if ( (typeof theYear == 'undefined') || theYear == null  ) {
        theYear = null;
      } else {
        theYear = $$('.smart-select select')["3"].value;
      }*/

      if (nullYear == null) {
        theYear=null;
      } else {
      //theYear = $$('.smart-select select')["3"].value;
      theYear = $$('.smart-select #year_select_id')["0"].value;
    }


      console.log('AND NOW theYear = ' + theYear);


      var url='http://finappv2.paulsantangelo.com/ws/ws_get_stock_settings_ret_json.php';
  		$$.ajax({url:url,data:{ theBrand:theBrand, theModel:theModel, theYear:theYear, theLength:theLength},type:'POST',dataType: 'json',success:function(stock_Obj) {
        if (stock_Obj.length>0) { // RETURNED RESULTS
          if (stock_Obj[0].RETURN_CODE==1) {
            $$("#skiSelected").html('<div class="row head_setting_table"><div class="col-20">Binding</div><div class="col-20">Length</div><div class="col-20">Depth</div><div class="col-20">DFT</div><div class="col-20">Wing</div></div>');
            $$("#skiSelected").append('<div class="row data_setting_table"><div class="col-20" id="stock_binding">'+stock_Obj[0].stock_binding_location+'</div><div class="col-20" id="stock_length">'+stock_Obj[0].stock_fin_length+'</div><div class="col-20" id="stock_depth">'+stock_Obj[0].stock_fin_depth+'</div><div class="col-20" id="stock_dft">'+stock_Obj[0].stock_fin_dft+'</div><div class="col-20"  id="stock_wing_angle">'+stock_Obj[0].stock_wing_angle+'</div></div>');

            if ($$("#saveStock").length<1) {
              $$('<div class="padding_top_5em"><a href="#" class="button" id="saveStock">Save to Stock List</a></div>').insertAfter('#skiSelected');
            }

        		$$("#skiSelected").show();
          } else {
            console.log('json success, but no stock ski data found.');
          }
        }

      }, timout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for length');

        }, complete: function(){
            console.log('in complete for stock_Obj');
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
