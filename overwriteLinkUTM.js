function overwriteLinkUTM() {
    var link = $(".utmOverwrite");
    var l = link.attr('href');
    var a = l.split("?"); 

    var params = {
        utm_source : Cookies.get('utm_source'), 
        utm_medium : Cookies.get('utm_medium'),
        utm_campaign : Cookies.get('utm_campaign'),
        utm_content : Cookie.get('utm_content')
    }
    link.attr('href', a[0] + "?" + encodeQueryData(params));

}

function encodeQueryData(data) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }
 
 //Justs needs to call overwriteLinkUTM() after the cookies are init
