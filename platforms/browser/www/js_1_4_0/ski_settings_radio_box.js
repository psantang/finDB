
$$('#skiLookup').click(function() {
  console.log('skiLookkup clicked');
  var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

  $$.ajax({url:url,data:{ ski_attr: "brands"},type:'POST',dataType: 'json',success:function(brandsObj) {
    console.log('in success for skiLookup for brands');

  var brandList = '<div class="list-block">';
    brandList += '<ul>';
    $$.each(brandsObj, function( index, value ) {

      brandList += '<li>';
      brandList += '<label class="label-radio item-content">';
        brandList += '<input type="radio" name="radio_brand" value="'+ value.brand + '">';
        brandList += '<div class="item-inner">';
          brandList += '<div class="item-title">'+ value.brand + '</div>';
        brandList += '</div>';
      brandList += '</label>';
    brandList += '</li>';



      //brandList += '<option value="'+ value.brand + '">'+ value.brand + '</option>';
    });
    brandList += '</ul></div>';
    $$("#factory_brand").html(brandList).trigger('create');


    }, timout: 5000

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
});




$$('#factory_brand').change(function() {
		//$$('#factory_year,#factory_length').empty(); // REMOVE ALL OTHERS
		//$('#factory_current,#factory_my_name,#factory_submit').hide();// HIDE THESE
		theBrand = $$('input[name="radio_brand"]:checked').val();
    console.log('theBrand = ' + theBrand)
    var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

		$$.ajax({url:url,data:{ ski_attr:"models",brand:theBrand },type:'POST',dataType: 'json',success:function(modelsObj) {

			var modelList = '<div class="list-block">';
        modelList += '<ul>';
			$$.each(modelsObj, function( index, value ) {
        modelList += '<li>';
        modelList += '<label class="label-radio item-content">';
          modelList += '<input type="radio" name="radio_model" value="'+ value.model + '">';
          modelList += '<div class="item-inner">';
            modelList += '<div class="item-title">'+ value.model + '</div>';
          modelList += '</div>';
        modelList += '</label>';
      modelList += '</li>';
			});
			modelList += '</ul></div>';
			$$("#factory_model").html(modelList).trigger('create');
      }, timout: 5000

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
  		theModel = $$('input[name="radio_model"]:checked').val();
      console.log('theModel = ' + theModel)
      var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';

      var yearVal;
  		$$.ajax({url:url,data:{ ski_attr: "years", brand:theBrand, model:theModel},type:'POST',dataType: 'json',success:function(yearsObj) {

        if (yearsObj[0]["year"] != null) {
          yearVal=true;
    			var yearList = '<div class="list-block">';
            yearList += '<ul>';
    			$$.each(yearsObj, function( index, value ) {
            yearList += '<li>';
            yearList += '<label class="label-radio item-content">';
              yearList += '<input type="radio" name="radio_year" value="'+ value.year + '">';
              yearList += '<div class="item-inner">';
                yearList += '<div class="item-title">'+ value.year + '</div>';
              yearList += '</div>';
            yearList += '</label>';
          yearList += '</li>';
    			});
    			yearList += '</ul></div>';
    			$$("#factory_year").html(yearList).trigger('create');
        } else {
          yearVal=false;
        }
  		}, timout: 5000
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
  		    theYear = $$('input[name="radio_year"]:checked').val();
          if (typeof theYear == 'undefined') {
            theYear=null;
          }
      //} else {
      //  theYear=null;
      //}
      var url='http://finappv2.paulsantangelo.com/ws/ws_ski_lookup_ret_json.php';
  		$$.ajax({url:url,data:{ ski_attr: "lengths", brand: theBrand, model: theModel, year: theYear},type:'POST',dataType: 'json',success:function(lengthsObj) {

  			var lengthList = '<div class="list-block">';
          lengthList += '<ul>';
  			$$.each(lengthsObj, function( index, value ) {
          lengthList += '<li>';
          lengthList += '<label class="label-radio item-content">';
            lengthList += '<input type="radio" name="radio_length" value="'+ value.length + '">';
            lengthList += '<div class="item-inner">';
              lengthList += '<div class="item-title">'+ value.length + '</div>';
            lengthList += '</div>';
          lengthList += '</label>';
        lengthList += '</li>';
  			});
  			lengthList += '</ul></div>';
  			$$("#factory_length").html(lengthList).trigger('create');

      }, timout: 5000
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
      theLength = $$('input[name="radio_length"]:checked').val();
      console.log('in factory_length');


      var url='http://finappv2.paulsantangelo.com/ws/ws_get_stock_settings_ret_json.php';
  		$$.ajax({url:url,data:{ theBrand:theBrand, theModel:theModel, theYear:theYear, theLength:theLength},type:'POST',dataType: 'json',success:function(stock_Obj) {
        if (stock_Obj.length>0) { // RETURNED RESULTS
          if (stock_Obj[0].RETURN_CODE==1) {

            $$("#skiSelected").html('<div class="row"><div class="col-20">Binding</div><div class="col-20">Length</div><div class="col-20">Depth</div><div class="col-20">DFT</div><div class="col-20">Wing</div></div>');
            $$("#skiSelected").append('<div class="row"><div class="col-20">'+stock_Obj[0].stock_binding_location+'</div><div class="col-20">'+stock_Obj[0].stock_fin_length+'</div><div class="col-20">'+stock_Obj[0].stock_fin_depth+'</div><div class="col-20">'+stock_Obj[0].stock_fin_dft+'</div><div class="col-20">'+stock_Obj[0].stock_wing_angle+'</div></div>');
            //$$("#skiSelected").html(theYear + " " + theLength + " " + theBrand + " " + theModel + ".<p>" + stock_Obj[0].stock_binding_location + " " + stock_Obj[0].stock_fin_length + " " + stock_Obj[0].stock_fin_depth  + " " + stock_Obj[0].stock_wing_angle  + "</p>")
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


  	});
