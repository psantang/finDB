function displayStockSkis_listview(ski_Obj) {

  var str="<div class='content-block-title'>Saved Stock Ski List</div>";
      str+="<div class='list-block media-list' id='stock_list_div'>";
      str+="<ul id='ul_saved_list' class='padding_left_15px'>";
  console.log('in displayStockSkis');
  if (ski_Obj.length>0) {
    for (i=0; i<ski_Obj.length; i++) {
      //var tmp_ski_year = ski_Obj[i][0].year || null;
      //if (tmp_ski_year != null) tmp_ski_year = "("+ski_Obj[i][0].year+")";
      if (ski_Obj[i][0].year != null) { tmp_ski_year = "("+ski_Obj[i][0].year+")" } else {tmp_ski_year=""};

      str+="<li class='swipeout'>";

      str+="<div class='item-inner'>";
        str+="<div class='item-title-row'>";
          str+="<div class='item-title'><a href='#' class='create-picker brand_"+ski_Obj[i][0].brand+"'><i class='size-20 orange f7-icons'>info_fill</i></a> " + ski_Obj[i][0].brand + " " + ski_Obj[i][0].model + " " + ski_Obj[i][0].length + "</div>";
          str+="<div class='item-after'>" + tmp_ski_year + "</div>";
        str+="</div>"; // item-title-row


        str+="<div class='item-textA'>";

          str+="<div class='row head_setting_table sm'><div class='col-20'>Binding</div><div class='col-20'>Length</div><div class='col-20'>Depth</div><div class='col-20'>DFT</div><div class='col-20'>Wing</div></div>";
          str+="<div class='row data_setting_table sm'><div class='col-20'>"+ski_Obj[i][0].binding+"</div><div class='col-20'>"+ski_Obj[i][0].f_length+"</div><div class='col-20'>"+ski_Obj[i][0].f_depth+"</div><div class='col-20'>"+ski_Obj[i][0].f_dft+"</div><div class='col-20'>"+ski_Obj[i][0].f_wing_angle+"</div></div>";

        str+="</div>";
      //str+="</div>";
        str+="<div class='swipeout-actions-right'><a href='#' class='swipeout-delete' id='stockSki_"+i+"_'>Delete</a></div>";
      str+="</div>"; //item-inner
  //    str+="</a>";
      str+="</li>";

      console.log ('SKI: '+  ski_Obj[i][0].brand + ' | ' + ski_Obj[i][0].model + ' | ' +ski_Obj[i][0].length + ' | ' +ski_Obj[i][0].year + ' | ' +ski_Obj[i][0].f_length + ' | ' + ski_Obj[i][0].f_depth + ' | ' + ski_Obj[i][0].f_dft + ' | ' + ski_Obj[i][0].f_wing_angle);
    }
  str+="</ul>";
  str+="</div>";
  $$('.page #stockSkiListing_div').html(str);

  } else {
    $$('.page #stockSkiListing_div').html('');
  }
}


function displayStockSkis_accordian(ski_Obj) {
  var str="<div class='content-block-title'>Stock Ski Setting List</div>";
      str+="<div class='list-block accordion-list' id='stock_list_div'>";
      str+="<ul id='ul_saved_list'>";
  console.log('in displayStockSkis');
  if (ski_Obj.length>0) {
    for (i=0; i<ski_Obj.length; i++) {

      if (ski_Obj[i][0].year != null) { tmp_ski_year = "("+ski_Obj[i][0].year+")" } else {tmp_ski_year=""};
      str+="<li class='accordion-item swipeout'><a href='#' class='item-content item-link'>"; //  style='touch-action: manipulation;'
      str+="<div class='item-inner'>";
      str+="<div class='item-title'>" + ski_Obj[i][0].brand + " " + ski_Obj[i][0].model + " " + ski_Obj[i][0].length + " " + tmp_ski_year + "</div>";
      str+="</div></a>";

      str+="<div class='accordion-item-content'>";
      str+="<div class='content-block'>";
      str+="<div class='row head_setting_table sm'><div class='col-20'>Binding</div><div class='col-20'>Length</div><div class='col-20'>Depth</div><div class='col-20'>DFT</div><div class='col-20'>Wing</div></div>";
      str+="<div class='row data_setting_table sm'><div class='col-20'>"+ski_Obj[i][0].binding+"</div><div class='col-20'>"+ski_Obj[i][0].f_length+"</div><div class='col-20'>"+ski_Obj[i][0].f_depth+"</div><div class='col-20'>"+ski_Obj[i][0].f_dft+"</div><div class='col-20'>"+ski_Obj[i][0].f_wing_angle+"</div></div>";
      //str+="<p>" + ski_Obj[i][0].f_length + " " + ski_Obj[i][0].f_depth + " " + ski_Obj[i][0].f_dft + " " + ski_Obj[i][0].f_wing_angle + "</p>";
      str+="</div>";
      str+="</div>";
      str+="<div class='swipeout-actions-right'><a href='#' class='swipeout-delete' id='stockSki_"+i+"_'>Delete</a></div>";
      str+="</li>";

      console.log ('SKI: '+  ski_Obj[i][0].brand + ' | ' + ski_Obj[i][0].model + ' | ' +ski_Obj[i][0].length + ' | ' +ski_Obj[i][0].year + ' | ' +ski_Obj[i][0].f_length + ' | ' + ski_Obj[i][0].f_depth + ' | ' + ski_Obj[i][0].f_dft + ' | ' + ski_Obj[i][0].f_wing_angle);
    }
  str+="</ul>";
  str+="</div>";
  $$('.page #stockSkiListing_div').html(str);

  }
}

/* THIS BELOW NEEDS TO BE IN my-app.js with all other page event handlers
$$('#getLocalSettings').click(function() {
  getLocalSettings();
  console.log('in getLocalSettings click event');
});
*/
function getLocalSettings() {
  console.log('in getLocalSettings function');
  var storedSkis = getLocalStorage('stockSkis');
  if (storedSkis != null) {
    storedSkis_Obj = JSON.parse(storedSkis);
    console.log('stock skis are ' + storedSkis );
    displayStockSkis_listview(storedSkis_Obj);
  } else {
    console.log('No stock skis saved');
  }
}


function storeSettingsLocally() {

  console.log('saveStock clicked');

  var s_brand=$$('.smart-select #brand_select_id')["0"].value;
  var s_model=$$('.smart-select #model_select_id')["0"].value;
  var s_length=$$('.smart-select #length_select_id')["0"].value;

  if ( $$('.smart-select #year_select_id')["0"]) {
    if ( (typeof $$('.smart-select #year_select_id')["0"].value === 'undefined') || $$('.smart-select #year_select_id')["0"].value == null ) {
      var s_year=null;
    } else {
      var s_year=$$('.smart-select #year_select_id')["0"].value;
    }
  }

  var s_binding=$$('#stock_binding').text();
  var s_flength=$$('#stock_length').text();
  var s_depth=$$('#stock_depth').text();
  var s_dft=$$('#stock_dft').text();
  var s_wing_angle=$$('#stock_wing_angle').text();

  var stockSki = [
             {
              'brand': s_brand,
              'model': s_model,
              'length': s_length,
              'year': s_year,
              'binding': s_binding,
              'f_length': s_flength,
              'f_depth': s_depth,
              'f_dft': s_dft,
              'f_wing_angle': s_wing_angle
             }
           ];
  appendItem('stockSkis',stockSki)

}


function getLocalStorage( key ) {
  var localKey = localStorage.getItem (key);
  return localKey; // returns as string
}




function appendItem(key, data) {

    var t = data.constructor, tmp;

    console.log('data is ' + JSON.stringify(data) );
    switch(t) {

         case Array:
          console.log('appendItem as Array');
             tmp = localStorage.getItem(key);
             tmp = (tmp === null) ? [] : JSON.parse(tmp);
             tmp.unshift(data);

             localStorage.setItem(key, JSON.stringify(tmp));
             break;

         case String:
          console.log('appendItem as String');
             //... and so forth
    }
}


function deleteAllStockSkis () {
  localStorage.removeItem('stockSkis');
  console.log('stockSkis removed from local storage');
  return true;
}

function deleteStockSki (theID) {
    console.log('the ID is' + theID);
    //var idLength = theID.length;
    //var searchStr = theID.search("stockSki_");
    var startIndex=theID.indexOf("_");
    var endIndex=theID.lastIndexOf("_");
    var deleteIndex=theID.substring(startIndex+1, endIndex);
    console.log("the id to delete is " + deleteIndex);

    var stockSkis_Obj = JSON.parse( getLocalStorage('stockSkis') );
    console.log('before stocksSkis_Obj is ' + stockSkis_Obj);
    stockSkis_Obj.splice(deleteIndex,1);
    console.log('AFTER stocksSkis_Obj is ' + stockSkis_Obj + ' and length of object is ' + stockSkis_Obj.length);
    deleteAllStockSkis ();
    if (stockSkis_Obj.length>0) {
      localStorage.setItem('stockSkis', JSON.stringify(stockSkis_Obj));
    }

}
