/* 计算 hash 来源网络 */
function hash(b) {
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    var d = 5381;
    var e = b.length - 1;
    if (typeof b == 'string') {
        for (; e > -1; e--) d += (d << 5) + b.charCodeAt(e);
    } else {
        for (; e > -1; e--) d += (d << 5) + b[e];
    }
    var f = d & 0x7FFFFFFF;
    var g = '';
    do {
        g += c[f & 0x3F];
    } while (f >>= 6);
    return g;
}