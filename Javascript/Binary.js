/* 个人二进制构建 https://github.com/ToJane/CodeTools */
class Binary {
    constructor() {
        this.data = [];
        arguments.length && this.put.apply(this, arguments)
    }
    /* 加入数据 */
    add(any) {
        if (typeof any == "number") return this.set(any);
        if (typeof any == "string") return this.str(any);
        /* 扩展-性能还能优化 */
        if (any instanceof Array)
            return this[any[0]] ? this[any[0]](any[1]) : (typeof any[0] == "number" ? this.set.apply(this, any) : this.str(any[0]));
        /* 扩展-添加其他类型数据 */
        if (any && (any.buffer || any) instanceof ArrayBuffer)
            return this.data.push.apply(this.data, new Uint8Array(any.buffer || any));
    }
    /* 批量添加 支持:(100, [200, 2, true], 250, "我靠是阿德法大蒜素",360) */
    put() {
        for (var i in arguments) this.add(arguments[i]);
    }
    /* value, length, littleEndian */
    set(v, l, e) {
        /* 疑问: 如何直接运算出一个整数所占字节数? */
        l = (l || (v > 0 ? (v > 255 ? v > 65535 ? 4 : 2 : 1) : (v < -255 ? v < -65535 ? 4 : 2 : 1))) - 1;
        /* 使用i-- 就可以少了个 l - i 的运算  littleEndian 一般用不到  疑问: 还能继续优化么 */
        for (var i = l; i > -1; i--) this.data.push(v >> (e ? l - i : i) * 8 & 255);
    }
    /* 添加文本 -- 2字节长度+内容 */
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
let t = new Binary(-666, 313213, [50, 4, true], ["str", "文本"], new Uint16Array([6, 7, 8, 9]), "哇哈哈").buffer();
/* 验证 */
let b = new DataView(t);
console.log(b.getInt16(0))
console.log(b.getUint32(2))
console.log(b.getUint32(6, true))

/* 测试 */
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