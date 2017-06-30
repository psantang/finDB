
function skiLookup() {
//$$('#skiLookup').click(function() {
  console.log('skiLookkup clicked');
  var url='http://finDB.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

  $$.ajax({url:url,data:{ ski_attr: "brands"},type:'POST',dataType: 'json',success:function(brandsObj) {
    console.log('in success for skiLookup for brands');

  var brandList = '<div class="item-input"><select name="brand" id="brand">';
    brandList += '<option>Select Brand...</option>';
    $$.each(brandsObj, function( index, value ) {
      brandList += '<option value="'+ value.brand + '">'+ value.brand + '</option>';
    });
    brandList += '</select></div>';
    $$("#factory_brand").html(brandList).trigger('create');


    }, timeout: 5000

    , beforeSend: function(){
      console.log('beforeSend skiLookup for brands');

    }, complete: function(){
        console.log('complete skiLookup for brands');

    }, error: function(brandsObj, status, err) {
        if (status == "timeout") {
          console.log("Timeout Error. " + brandsObj + status + err);
        } else {
          console.log("error: " + request + status + err);
        }
    }
  }) // END ajax function for ski brands
//});
}



$$('#factory_brand').change(function() {
		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
		theBrand = ( $$('#brand').val() );
    console.log('theBrand = ' + theBrand)
    var url='http://finDB.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

		$$.ajax({url:url,data:{ ski_attr:"models",brand:theBrand },type:'POST',dataType: 'json',success:function(modelsObj) {

			var modelList = '<div class="item-input"><select name="model" id="model">';
			modelList += '<option>Select Model...</option>';
			$$.each(modelsObj, function( index, value ) {
				modelList += '<option value="'+ value.model + '">'+ value.model + '</option>';
			});
			modelList += '</select></div>';
			$$("#factory_model").html(modelList).trigger('create');
      }, timeout: 5000

      , beforeSend: function(){
        console.log('beforeSend skiLookup for models');

      }, complete: function(){
          console.log('complete skiLookup for models');

      }, error: function(brandsObj, status, err) {
          if (status == "timeout") {
            console.log("Timeout Error. " + brandsObj + status + err);
          } else {
            console.log("error: "  + status + err);
          }
      }
    }) // END ajax function for models
	});



  $$('#factory_model').change(function() {
  		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
  		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
  		theModel = ( $$('#model').val() );
      console.log('theModel = ' + theModel)
      var url='http://finDB.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

      var yearVal;
  		$$.ajax({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel},type:'POST',dataType: 'json',success:function(yearsObj) {

        if (yearsObj[0]["year"] != null) {
          yearVal=true;
    			var yearList = '<div class="item-input"><select name="year" id="year">';
    			yearList += '<option>Select Year...</option>';
    			$$.each(yearsObj, function( index, value ) {
    				yearList += '<option value="'+ value.year + '">'+ value.year + '</option>';
    			});
    			yearList += '</select></div>';
    			$$("#factory_year").html(yearList).trigger('create');
        } else {
          yearVal=false;
        }
  		}, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for years');

        }, complete: function(){
          if (yearVal) {
            console.log('in complete with yearVal = true');
    				//$("#year").selectmenu('refresh');
    				//window.scrollTo(0, $("#factory_year").offset().top);
          } else {
            console.log('in complete with yearVal = false');
            $$('#factory_year').trigger("change");
          }
    		}, error: function(yearsObj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + yearsObj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function for models
  	});





    // ******* AJAX CALL FOR SKI LENGTH	*********//
  	$$('#factory_year').change(function() {
  		//$$('#factory_current,#factory_my_name,#factory_submit').hide(); // HIDE THESE
      //if (yearVal) {
  		    theYear = ( $$("#year").val() );
          if (typeof theYear == 'undefined') {
            theYear=null;
          }
      //} else {
      //  theYear=null;
      //}
      var url='http://finDB.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';
  		$$.ajax({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel, year: theYear},type:'POST',dataType: 'json',success:function(lengthsObj) {

  			var lengthList = '<div class="item-input"><select name="length" id="length">';
  			lengthList += '<option>Select Length...</option>';
  			$$.each(lengthsObj, function( index, value ) {
  				lengthList += '<option value="'+ value.length + '">'+ value.length + '</option>';
  			});
  			lengthList += '</select></div>';
  			$$("#factory_length").html(lengthList).trigger('create');

      }, timeout: 5000
        , beforeSend: function(){
          console.log('beforeSend skiLookup for length');

        }, complete: function(){
            console.log('in complete for lengthsObj');
    		}, error: function(lengthsObj, status, err) {
            if (status == "timeout") {
              console.log("Timeout Error. " + lengthsObj + status + err);
            } else {
              console.log("error: "  + status + err);
            }
        }
      }) // END ajax function
  	});


    $$('#factory_length').change(function() {
      theLength = ( $$("#length").val() );
      console.log('in factory_length');


      var url='http://finDB.paulsantangelo.com/ws/ws_get_stock_settings_ret_json.php';
  		$$.ajax({url:url,data:{ theBrand:theBrand, theModel:theModel, theYear:theYear, theLength:theLength},type:'POST',dataType: 'json',success:function(stock_Obj) {
        if (stock_Obj.length>0) { // RETURNED RESULTS
          if (stock_Obj[0].RETURN_CODE==1) {
            $$("#skiSelected").html(theYear + " " + theLength + " " + theBrand + " " + theModel + ".<p>" + stock_Obj[0].stock_binding_location + " " + stock_Obj[0].stock_fin_length + " " + stock_Obj[0].stock_fin_depth  + " " + stock_Obj[0].stock_wing_angle  + "</p>")
        		$$("#skiSelected").show();
          } else {
            console.log('json success, but no stock ski data found.');
          }
        }

      }, timeout: 5000
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


  	});
