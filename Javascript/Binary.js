/* ES6 一个简单的buffer类   数学不好已技穷...  如果还有大佬能优化性能 请在群内@我 */
class Binary {
    constructor() {
        this.data = [];
        this.offset = 0;
        arguments.length && this.put.apply(this, arguments)
    }
    add(any) {
        if (typeof any == "number") return this.set(...arguments);
        if (typeof any == "string") return this.str(...arguments);
        if (any instanceof Array) return this.add(...any);
        if (any && (any.buffer || any) instanceof ArrayBuffer)
            return this.data.push(... new Uint8Array(any.buffer || any));
    }
    /* 批量添加 支持:put(100, [200, 2, true], 250, "文本",360) */
    put(...list) {
        list.forEach(e => this.add(e));//比for in 快三倍
    }
    /* value, length, littleEndian 疑问: 咋直接运算出一个整数所占字节数? */
    set(v, l, e) {
        l = (l || (v > 0 ? (v > 255 ? v > 65535 ? 4 : 2 : 1) : (v < -255 ? v < -65535 ? 4 : 2 : 1))) - 1;
        for (var i = l; i > -1; i--) this.data.push(v >> (e ? l - i : i) * 8 & 255)
    }
    /* 取 */
    get(length = 1, littleEndian, offset) {
        var c = 0, a = this.data, m = Math.abs(length), s = (offset || this.offset);
        for (var i = m - 1, k = 0; i > -1; i-- , k++)
            c += a[s + (littleEndian ? i : k)] << i * 8
        this.offset = s + m;
        return length < 0 ? (length == -1 ? c | -256 : length == -2 ? c | -65536 : c << 0) : c >>> 0;
    }
    /* 读写文本 --> 2字节长度+内容 */
    str(e) {
        if (typeof e == "string") {
            this.set(e.length * 2, 2);
            for (var i = 0; i < e.length; i++) this.set(e.charCodeAt(i), 2);
        } else {
            var len = this.get(2) / 2, str = "";
            for (var i = 0; i < len; i++) str += String.fromCharCode(this.get(2));
            return str;
        }
    }
    buffer() {
        return this.buf = new Uint8Array(this.data).buffer;
    }
}

/* 栗子 */
let m = new Binary(new Uint16Array([789, -999]), -666, 313213, [50, 4, true], "哇哈哈");
console.log(m.get(2, true))
console.log(m.get(-2, true))
console.log(m.get(-2))
console.log(m.get(4))
console.log(m.get(4,true))
console.log(m.str())

/* 验证 */
let b = new DataView(m.buffer());
console.log(b.getInt16(0, true))
console.log(b.getInt16(2, true))
console.log(b.getInt16(4))
console.log(b.getUint32(6))
console.log(b.getUint32(10, true))

/* 性能 */
// setInterval(function () {
//     console.time('1');
//     for (var i = 0; i < 300000; i++) {
//         let buffer = new Binary()
//         for (var k = 0; k < 30; k++) {
//             buffer.set(k, 1) //buffer.add(k)
//         }
//         buffer.buffer()
//     }
//     console.timeEnd('1');

//     console.time('2');
//     for (var i = 0; i < 300000; i++) {
//         let buffer = new DataView(new ArrayBuffer(30))
//         for (var k = 0; k < 30; k++) {
//             buffer.setUint8(k, k)
//         }
//     }
//     console.timeEnd('2');
// }, 500)
