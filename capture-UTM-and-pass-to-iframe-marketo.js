
<script>
var $jQ = jQuery.noConflict();
  
// Parse the URL
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "empty" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
  
// Give the URL parameters variable names
var source = getParameterByName('utm_source');
var medium = getParameterByName('utm_medium');
var campaign = getParameterByName('utm_campaign');
var content = getParameterByName('utm_content');
var referrer = WebReferrerParam();
 
//function to build the the query string
function EncodeQueryData(data)
{
   var ret = [];
   for (var d in data){
       if(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'web_referrer'].indexOf(encodeURIComponent(d)) >= 0){
           ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
       }       
   }      
      
   return ret.join("&");
}

function WebReferrerParam() {
    var x = ((document.referrer) ? document.referrer : "empty");
    //var y = "web_referrer=";
    var z = encodeURIComponent(x);
    return z;
}   

$jQ(document).ready(function(){
  
//check if the main cookie exists
    if($jQ.cookie('web_referrer', { path: '/' }) || $jQ.cookie('web_referrer', { path: '/' }) == 'empty'){
        //Update the marketo iframe's url 
        var data = $jQ.cookie();
        var queryData = EncodeQueryData(data);
        
        //Update the marketo iframe with the cookie data
         $jQ("iframe[data-form='marketo']").each(function(){
            //get the source of each iframe
            var mktoIframe= $jQ(this);
            var formURL= mktoIframe.attr("src").trim();                   
            //combine the url and queryData 
            var newFormURL= formURL + "?" + queryData;
            //set the iframe src as the new combination 
            $jQ(this).attr("src", newFormURL);
            
        });   
                       
    }
    else{
        //console.log("Cookie Does Not Exists");
        //create the cookie for future use
        $jQ.cookie('utm_source', source, { path: '/' });
        $jQ.cookie('utm_medium', medium, { path: '/' });
        $jQ.cookie('utm_campaign', campaign, { path: '/' });
        $jQ.cookie('utm_content', content, { path: '/' });
        $jQ.cookie('web_referrer', decodeURIComponent(referrer), { path: '/' });
        
        //Update the marketo iframe's url from the window url
        $jQ("iframe[data-form='marketo']").each(function(){
            //get the source of each iframe
            var mktoIframe= $jQ(this);
            var formURL= mktoIframe.attr("src").trim();            
            //get the url params for the window
            var params = window.location.search; 
            try {
                var data = $jQ.cookie();
                params = EncodeQueryData(data);
                params = "?" + params
            } catch (error) {
                
            }                    
            //combine the url and parmams 
            var newFormURL= formURL + params;
            //set the iframe src as the new combination 
            $jQ(this).attr("src", newFormURL);
            
        });
    }


});   
</script>
