/* html http请求*/
function request(url, data, callback) {
    if (data instanceof Function) return request(url, undefined, data);
    var n = new XMLHttpRequest();
    n.open(data ? "POST" : "GET", url, true);
    n.onloadend = function (e) {callback && callback(n.responseText)}
    n.send(data);
}