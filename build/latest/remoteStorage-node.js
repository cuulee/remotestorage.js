(function(){function c(c,d,e){a[c]=e;var f=c.substring(0,c.lastIndexOf("/")+1);b[c]=[];for(var g=0;g<d.length;g++)d[g].substring(0,2)=="./"&&(d[g]=d[g].substring(2)),b[c].push(f+d[g])}function d(c){if(c=="require")return function(){};var e=b[c],f={};for(var g=0;g<e.length;g++)f[e[g]]=d(e[g]);var h=[];for(var g=0;g<e.length;g++)h.push(f[e[g]]);return a[c].apply({},h)}var a={},b={};c("lib/platform",[],function(){function a(a){var b=!1,c;a.timeout&&(c=window.setTimeout(function(){b=!0,a.error("timeout")},a.timeout));var d=new XMLHttpRequest;a.method||(a.method="GET"),d.open(a.method,a.url,!0);if(a.headers)for(var e in a.headers)d.setRequestHeader(e,a.headers[e]);d.onreadystatechange=function(){d.readyState==4&&!b&&(c&&window.clearTimeout(c),d.status==200||d.status==201||d.status==204?a.success(d.responseText):a.error(d.status))},typeof a.data=="string"?d.send(a.data):d.send()}function b(a){var b=new XDomainRequest;b.timeout=a.timeout||3e3,b.open(a.method,a.url),b.onload=function(){b.status==200||b.status==201||b.status==204?a.success(xhr.responseText):a.error(xhr.status)},b.onerror=function(){err("unknown error")},b.ontimeout=function(){err(timeout)},a.data?b.send(a.data):b.send()}function c(a){var b=require("http"),c=require("https"),d=require("url");a.method||(a.method="GET"),a.data||(a.data=null);var e=d.parse(a.url),f={method:a.method,host:e.hostname,path:e.path,port:e.port?port:e.protocol=="https:"?443:80,headers:a.headers},g,h,i=e.protocol=="https:"?c:b,j=i.request(f,function(b){var c="";b.setEncoding("utf8"),b.on("data",function(a){c+=a}),b.on("end",function(){g&&clearTimeout(g),h||(b.statusCode==200||b.statusCode==201||b.statusCode==204?a.success(c):a.error(b.statusCode))})});j.on("error",function(b){a.error(b.message)}),a.timeout&&(g=setTimeout(function(){a.error("timeout"),h=!0},a.timeout)),a.data?j.end(a.data):j.end()}function d(a,b){var c=(new DOMParser).parseFromString(a,"text/xml"),d=c.getElementsByTagName("Link"),e={Link:[]};for(var f=0;f<d.length;f++){var g={};for(var h=0;h<d[f].attributes.length;h++)g[d[f].attributes[h].name]=d[f].attributes[h].value;g.rel&&e.Link.push({"@":g})}b(null,e)}function e(a,b){var c=require("xml2js");(new c.Parser).parseString(a,b)}function f(){return[]}function g(){return location.hash.length?location.hash.substring(1).split("&"):[]}return typeof window=="undefined"?{ajax:c,parseXml:e,getFragmentParams:f}:window.XDomainRequest?{ajax:b,parseXml:d,getFragmentParams:g}:{ajax:a,parseXml:d,getFragmentParams:g}}),c("lib/couch",["./platform"],function(a){function c(a){if(!b){try{b=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(c){}b||(b={})}return b[a]}function d(a,c){if(!b)try{b=JSON.parse(localStorage.getItem("_shadowCouchRev"))}catch(d){}b||(b={}),b[a]=c,localStorage.setItem("_shadowCouchRev",JSON.stringify(b))}function e(b,c,d,e,f){var g={url:c,method:b,error:function(a){a==404?f(null,undefined):f(a,null)},success:function(a){f(null,a)},timeout:3e3};e&&(g.headers={Authorization:"Bearer "+e}),g.fields={withCredentials:"true"},b!="GET"&&(g.data=d),a.ajax(g)}function f(a,b,c){e("GET",a,null,b,function(b,e){if(b)c(b,e);else{var f;try{f=JSON.parse(e)}catch(g){}f&&f._rev?(d(a,f._rev),c(null,f.value)):typeof e=="undefined"?c(null,undefined):c("unparsable data from couch")}})}function g(a,b,f,g){var h=c(a),i={value:b};h&&(i._rev=h),e("PUT",a,JSON.stringify(i),f,function(c,h){if(c)c==409?e("GET",a,null,f,function(c,h){if(c)g("after 409, got a "+c);else{var j;try{j=JSON.parse(h)._rev}catch(k){}j?(i={value:b,_rev:j},d(a,j),e("PUT",a,JSON.stringify(i),f,function(a,b){a?g("after 409, second attempt got "+a):g(null)})):g("after 409, got unparseable JSON")}}):g(c);else{var i;try{i=JSON.parse(h)}catch(j){}i&&i.rev&&d(a,i.rev),g(null)}})}function h(a,b,f){var g=c(a);e("DELETE",a+(g?"?rev="+g:""),null,b,function(c,g){c==409?e("GET",a,null,b,function(c,g){if(c)f("after 409, got a "+c);else{var h;try{h=JSON.parse(g)._rev}catch(i){}h?(d(a,h),e("DELETE",a+"?rev="+h,null,b,function(b,c){b?f("after 409, second attempt got "+b):(d(a,undefined),f(null))})):f("after 409, got unparseable JSON")}}):(c||d(a,undefined),f(c))})}var b=null;return{get:f,put:g,"delete":h}}),c("lib/dav",["./platform"],function(a){function b(b,c,d,e,f,g){var h={url:c,method:b,error:function(a){a==404?f(null,undefined):f(a,null)},success:function(a){f(null,a)},timeout:3e3};h.headers={Authorization:"Bearer "+e,"Content-Type":"text/plain;charset=UTF-8"},h.fields={withCredentials:"true"},b!="GET"&&(h.data=d),a.ajax(h)}function c(a,c,d){b("GET",a,null,c,d)}function d(a,c,d,e){b("PUT",a,c,d,e)}function e(a,c,d){b("DELETE",a,null,c,d)}return{get:c,put:d,"delete":e}}),c("lib/webfinger",["./platform"],function(a){function b(a,b){var c=a.toLowerCase().split("@");c.length<2?b("That is not a user address. There is no @-sign in it"):c.length>2?b("That is not a user address. There is more than one @-sign in it"):/^[\.0-9a-z\-\_]+$/.test(c[0])?/^[\.0-9a-z\-]+$/.test(c[1])?b(null,["https://"+c[1]+"/.well-known/host-meta","http://"+c[1]+"/.well-known/host-meta"]):b('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+c[1]+'"'):b('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+c[0]+'"')}function c(b,f,g){var h=b.shift();h?a.ajax({url:h,success:function(a){e(a,function(e,h){e?d(a,function(a,d){a?c(b,f,g):g(null,d)}):g(null,h)})},error:function(a){c(b,f,g)},timeout:f}):g("could not fetch xrd")}function d(b,c){a.parseXml(b,function(a,b){if(a)c(a);else if(b&&b.Link){var d={};if(b.Link&&b.Link["@"])b.Link["@"].rel&&(d[b.Link["@"].rel]=b.Link["@"]);else for(var e=0;e<b.Link.length;e++)b.Link[e]["@"]&&b.Link[e]["@"].rel&&(d[b.Link[e]["@"].rel]=b.Link[e]["@"]);c(null,d)}else c("found valid xml but with no Link elements in there")})}function e(a,b){var c;try{c=JSON.parse(a)}catch(d){b("not valid JSON");return}var e={};for(var f=0;f<c.links.length;f++)c.links[f].rel&&(e[c.links[f].rel]=c.links[f]);b(null,e)}function f(a,d,e){b(a,function(b,f){b?e(b):c(f,d.timeout,function(b,f){if(b)e("could not fetch host-meta for "+a);else if(f.lrdd&&f.lrdd.template){var g=f.lrdd.template.split("{uri}"),h=[g.join("acct:"+a),g.join(a)];c(h,d.timeout,function(b,c){if(b)e("could not fetch lrdd for "+a);else if(c.remoteStorage&&c.remoteStorage.auth&&c.remoteStorage.api&&c.remoteStorage.template){var d={};if(c["remoteStorage"]["api"]=="simple")d.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#simple";else if(c["remoteStorage"]["api"]=="WebDAV")d.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#webdav";else if(c["remoteStorage"]["api"]=="CouchDB")d.type="https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#couchdb";else{e("api not recognized");return}var f=c.remoteStorage.template.split("{category}");f[0].substring(f[0].length-1)=="/"?d.href=f[0].substring(0,f[0].length-1):d.href=f[0],d.properties={"access-methods":["http://oauth.net/core/1.0/parameters/auth-header"],"auth-methods":["http://oauth.net/discovery/1.0/consumer-identity/static"],"http://oauth.net/core/1.0/endpoint/request":c.remoteStorage.auth},f.length==2&&f[1]!="/"&&(d.properties.legacySuffix=f[1]),e(null,d)}else c.remotestorage&&c.remotestorage.href&&c.remotestorage.type&&c.remotestorage.properties&&c.remotestorage.properties["http://oauth.net/core/1.0/endpoint/request"]?e(null,c.remotestorage):e("could not extract storageInfo from lrdd")})}else e("could not extract lrdd template from host-meta")})})}return{getStorageInfo:f}}),c("lib/hardcoded",["./platform"],function(a){function c(b,c,d){a.ajax({url:"http://proxy.unhosted.org/irisCouchCheck?q=acct:"+b,success:function(a){var b;try{b=JSON.parse(a)}catch(c){}b?d(null,b):d("err: unparsable response from IrisCouch check")},error:function(a){d("err: during IrisCouch test:"+a)},timeout:c.timeout})}function d(a){var b=a.split("@");return["libredocs","mail","browserid","me"].indexOf(b[0])==-1?b[0]+"@iriscouch.com":b[2].substring(0,b[2].indexOf("."))+"@iriscouch.com"}function e(a,d,e){var f=a.split("@");if(f.length<2)e("That is not a user address. There is no @-sign in it");else if(f.length>2)e("That is not a user address. There is more than one @-sign in it");else if(!/^[\.0-9A-Za-z]+$/.test(f[0]))e('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+f[0]+'"');else if(!/^[\.0-9A-Za-z\-]+$/.test(f[1]))e('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+f[1]+'"');else{while(f[1].indexOf(".")!=-1){if(b[f[1]]){blueprint=b[f[1]],e(null,{rel:"https://www.w3.org/community/unhosted/wiki/personal-data-service-00",type:blueprint.type,href:blueprint.hrefPrefix+"/"+(blueprint.pathFormat=="user@host"?a:f[1]+"/"+f[0]),properties:{"access-methods":["http://oauth.net/core/1.0/parameters/auth-header"],"auth-methods":["http://oauth.net/discovery/1.0/consumer-identity/static"],"http://oauth.net/core/1.0/endpoint/request":blueprint.authPrefix+a}});return}f[1]=f[1].substring(f[1].indexOf(".")+1)}new Date<new Date("9/9/2012")?c(a,d,e):e("err: not a guessable domain, and fakefinger-migration has ended")}}var b={"iriscouch.com":{type:"https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#couchdb",authPrefix:"http://proxy.unhosted.org/OAuth.html?userAddress=",hrefPrefix:"http://proxy.unhosted.org/CouchDb",pathFormat:"host/user"}};return function(){var a={type:"https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#simple",authPrefix:"https://storage.surfnetlabs.nl/saml/oauth/authorize?user_address=",hrefPrefix:"https://storage.surfnetlabs.nl/saml",pathFormat:"user@host"},c={type:"https://www.w3.org/community/unhosted/wiki/remotestorage-2011.10#simple",authPrefix:"https://storage.surfnetlabs.nl/browserid/oauth/authorize?user_address=",hrefPrefix:"https://storage.surfnetlabs.nl/browserid",pathFormat:"user@host"},d=["leidenuniv.nl","leiden.edu","uva.nl","vu.nl","eur.nl","maastrichtuniversity.nl","ru.nl","rug.nl","uu.nl","tudelft.nl","utwente.nl","tue.nl","tilburguniversity.edu","uvt.nl","wur.nl","wageningenuniversity.nl","ou.nl","lumc.nl","amc.nl"],e=["surfnet.nl","fontys.nl"];for(var f=0;f<e.length;f++)b[e[f]]=a;for(var f=0;f<d.length;f++)b[d[f]]=c}(),{guessStorageInfo:e}}),c("remoteStorage",["require","./lib/platform","./lib/couch","./lib/dav","./lib/webfinger","./lib/hardcoded"],function(a,b,c,d,e,f){var g=function(a,b,c){return{href:a,type:b,properties:c}},h=function(a,b){typeof a!="string"?b("user address should be a string"):e.getStorageInfo(a,{timeout:3e3},function(c,d){c?f.guessStorageInfo(a,{timeout:3e3},function(a,c){var d;try{g(c.href,c.type,c.properties)}catch(e){}b(a,d)}):b(c,g(d.href,d.type,d.properties))})},i=function(a,b,c){if(a.type=="https://www.w3.org/community/rww/wiki/read-write-web-00#simple")scopesStr=b.join(" ");else{var d=[];for(var e=0;e<b.length;e++)d.push(b[e].split(":")[0].split("/")[0]);scopesStr=d.join(",")}var f;if(c.substring(0,"https://".length)=="https://")f=c.substring("https://".length);else if(c.substring(0,"http://".length)=="http://")f=c.substring("http://".length);else throw new Error("redirectUri does not start with https:// or http://");var g=f.split(":")[0].split("/")[0],h=["redirect_uri="+encodeURIComponent(c),"scope="+encodeURIComponent(scopesStr),"response_type=token","client_id="+encodeURIComponent(g)],i=a.properties["http://oauth.net/core/1.0/endpoint/request"];return i+(i.indexOf("?")===-1?"?":"&")+h.join("&")},j=function(a,b){b(a==="pds-remotestorage-00#couchdb"?c:d)},k=function(a,b,c){var d=((b.length?b+"/":"")+c).split("/"),e=d.splice(1).join("_");return a.href+"/"+d[0]+(a.properties.legacySuffix?a.properties.legacySuffix:"")+"/"+(e[0]=="_"?"u":"")+e},l=function(a,b,c){return{get:function(d,e){typeof d!="string"?e('argument "key" should be a string'):j(a.type,function(f){f.get(k(a,b,d),c,e)})},put:function(d,e,f){typeof d!="string"?f('argument "key" should be a string'):typeof e!="string"?f('argument "value" should be a string'):j(a.type,function(g){g.put(k(a,b,d),e,c,f)})},"delete":function(d,e){typeof d!="string"?e('argument "key" should be a string'):j(a.type,function(f){f["delete"](k(a,b,d),c,e)})}}},m=function(){var a=b.getFragmentParams();for(var c=0;c<a.length;c++)if(a[c].substring(0,"access_token=".length)=="access_token=")return a[c].substring("access_token=".length);return null};return{getStorageInfo:h,createStorageInfo:g,createOAuthAddress:i,createClient:l,receiveToken:m}}),module.exports=d("remoteStorage")})()