/* html 拖入文件处理 callback返回file对象  参数: element = 指定容器ID 默认全局 仅支持Chrome 浏览器 !!! */
function DragFile(callback, element) {
    element = element ? document.getElementById(element) : document;
    element.ondragenter = element.ondragover = element.ondrop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.type == "drop" && e.dataTransfer.effectAllowed == "copy") { //Copy
            var files = e.dataTransfer.files;
            for (var i = 0; i < files.length; i++) readFile(files[i]);
            return;
        }
        e.type == "drop" && search(e.dataTransfer.items[0].webkitGetAsEntry().filesystem.root);
    };

    var index = { "audio": "readAsArrayBuffer", "image": "readAsDataURL" }; //readAsText 默认
    function search(d) {
        var P = d.fullPath.replace(/^\//, "").replace(/(.+?)\/?$/, "$1/"); //多余?
        d.createReader().readEntries(function (e) {
            for (var i = 0; i < e.length || 0; i++) {
                e[i].isFile ? e[i].file(readFile) : search(e[i]);
            }
        })
        function readFile(f) {
            var fr = new FileReader();
            fr.onloadend = function (e) {
                /* Callback的参数 */
                callback({
                    "path": P + f.name,
                    "type": f.name.replace(/.+\./, ""),
                    "name": f.name,
                    "data": e.target.result.split(",")[1],
                    "file": f
                });
            };
            f.size < 1e+8 ? fr.readAsDataURL(f) : console.warn("警告: 文件大于10M 避免浏览器假死暂不处理")
        }
    }
}
