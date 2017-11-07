/* ES6 快捷二进制构建 https://github.com/ToJane/CodeTools */
class Binary {
    constructor() {
        this.data = [];
        arguments.length && this.put.apply(this, arguments)
    }
    /* 加入数据 */
    add(any) {
        if (typeof any == "number") return this.set(...arguments);
        if (typeof any == "string") return this.str(...arguments);
        /* 扩展-性能还能优化 */
        if (any instanceof Array)
            return this.add(...any);//typeof any[0] == "number" ? this.set.apply(this, any) : this.str(any[0])
        /* 扩展-添加其他类型数据 */
        if (any && (any.buffer || any) instanceof ArrayBuffer)
            return this.data.push(... new Uint8Array(any.buffer || any));
    }
    /* 批量添加 支持:(100, [200, 2, true], 250, "我靠是阿德法大蒜素",360) */
    put() {
        for (var i of arguments) this.add(i);
    }
    /* value, length, littleEndian 疑问: 如何直接运算出一个整数所占字节数? */
    set(v, l, e) {
        l = (l || (v > 0 ? (v > 255 ? v > 65535 ? 4 : 2 : 1) : (v < -255 ? v < -65535 ? 4 : 2 : 1))) - 1;
        for (var i = l; i > -1; i--) this.data.push(v >> (e ? l - i : i) * 8 & 255);
    }
    /* 添加文本 --> 2字节长度+内容 */
    str(e) {
        this.set(e.length * 2, 2);
        for (var i = 0; i < e.length; i++) this.set(e.charCodeAt(i), 2);
    }
    /* 生成Buffer */
    buffer() {
        return this.buf = new Uint8Array(this.data).buffer;
    }
}
/* 栗子 */
let t = new Binary(new Uint16Array([789, -999]), -666, 313213, [50, 4, true], "哇哈哈").buffer();
/* 验证 */
let b = new DataView(t);
console.log(b.getInt16(0, true))
console.log(b.getInt16(2, true))
console.log(b.getInt16(4))
console.log(b.getUint32(6))
console.log(b.getUint32(10, true))

/* 性能 */
setInterval(function () {
    console.time('1');
    for (var i = 0; i < 300000; i++) {
        let buffer = new Binary()
        for (var k = 0; k < 30; k++) {
            buffer.set(k, 1) //buffer.add(k)
        }
        buffer.buffer()
    }
    console.timeEnd('1');

    console.time('2');
    for (var i = 0; i < 300000; i++) {
        let buffer = new DataView(new ArrayBuffer(30))
        for (var k = 0; k < 30; k++) {
            buffer.setUint8(k, k)
        }
    }
    console.timeEnd('2');
}, 500)
