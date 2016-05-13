<!-- Marketo JS -->

<script type="text/javascript">
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
    if($jQ.cookie('utm_source')){
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
        $jQ.cookie('utm_source', source);
        $jQ.cookie('utm_medium', medium);
        $jQ.cookie('utm_campaign', campaign);
        $jQ.cookie('utm_content', content);
        $jQ.cookie('web_referrer', decodeURIComponent(referrer));
        
        //Update the marketo iframe's url from the window url
        $jQ("iframe[data-form='marketo']").each(function(){
            //get the source of each iframe
            var mktoIframe= $jQ(this);
            var formURL= mktoIframe.attr("src").trim();            
            //get the url params for the window
            var params= window.location.search; 
            if(!params){
                var data = $jQ.cookie();
                params = EncodeQueryData(data);
                params = "?" + params;
            }           
            //combine the url and parmams 
            var newFormURL= formURL + params;
            //set the iframe src as the new combination 
            $jQ(this).attr("src", newFormURL);
            
        });
    }

var excludedReferrers = [ "frontlinek12.com" ];
var cookieDomain = "frontlinek12.com";
var payPerClickParameter = "keyword";

// IDs for the fields to be updated.
var searchStringField = "#Search_String__c";
var searchEngineField = "#Search_Engine__c";
var payPerClickKeywordField = "#Pay_Per_Click_Keyword__c";

var refer = document.referrer;
var searchString;
var searchEngine;

// if there's no referrer, do nothing
if ( (refer == undefined) || (refer == "") ) {
;
} else {

// get the domain of the referring website -- http://[[this-thing.com]]/
var referrerDomain =
refer.substr(refer.indexOf("\/\/") + 2,
refer.indexOf("\/",8) - refer.indexOf("\/\/") - 2).toLowerCase();

var excludedDomainFound = false;
var i = 0;

// search the excluded domain list to see if the referrer domain is on it
while ( (i < excludedReferrers.length) && !excludedDomainFound) {
var thisExcludedDomain = excludedReferrers[i].toLowerCase();

// thus excludedDomainFound is true only when indexOf matches an excluded domain (!= -1)
excludedDomainFound = (referrerDomain.indexOf(thisExcludedDomain) != -1);
i++;
}

// only if the referrer isn't in our excluded domain list...
if( !excludedDomainFound ) {


var searchEngines = [
{ name: "Yahoo", url: /\.yahoo\.co/i, query: "p" },
{ name: "Google", url: /\.google\./i, query: "q" },
{ name: "Microsoft Live", url: /\.live\.com/i, query: "q" },
{ name: "MSN Search", url: /search\.msn\./i, query: "q" },
{ name: "AOL", url: /\.aol\./i, query: "query" },
{ name: "Bing", url: /\.bing\.com/i, query: "q" },
{ name: "Ask", url: /\.ask\.com/i, query: "q" }
];

// find the referring search engine (if any)
i = 0;
while (i < searchEngines.length) {
if (refer.match(searchEngines[i].url)) {
searchEngine = searchEngines[i].name;
searchString = $jQ.getQueryString({ ID: searchEngines[i].query,
URL: refer,
DefaultValue: "" });
break;
}
i++;
}

// If no search engine is found, this person probably used a less
// popular one. Use the referring doman, then guess the query parameter
if (i == searchEngines.length) {

searchEngine = referrerDomain;

var queries = ["q","p","query"];
var i = 0;
while ((i < queries.length) && (searchString == undefined)) {
searchString = $jQ.getQueryString({ ID: queries[i], 
URL: refer });
i++;
}

// no search strings found -- use this text instead.
if (searchString == undefined) {
searchString = "None";
}
}

// Use the provided URL parameter to get the PPC keyword.
var payPerClickWord = 
$jQ.getQueryString({ID: payPerClickParameter, 
URL: refer,
DefaultValue: "" });

// Put the info into cookies. These values will be extracted 
// and put into a Marketo form later. Expires in 2 years.
$jQ.cookie('mktoPPCKeyword', payPerClickWord,
{expires: 730, path: '\/', domain: cookieDomain});
$jQ.cookie('mktoSearchEngine', searchEngine,
{expires: 730, path: '\/', domain: cookieDomain});
$jQ.cookie('mktoSearchString', searchString,
{expires: 730, path: '\/', domain: cookieDomain});
}
}

//Get the values from the cookies and put them into the hidden fields
$jQ(searchStringField).attr("value",$jQ.cookie('mktoSearchString'));
$jQ(searchEngineField).attr("value",$jQ.cookie('mktoSearchEngine'));
$jQ(payPerClickKeywordField).attr("value",$jQ.cookie('mktoPPCKeyword')); 

});

</script>
