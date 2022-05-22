// 導入模組
var fs = require('fs')
var path = require('path')
// 可改寫副檔名及編碼
var x = '.log'
var ru = 'utf8'
var wu = 'utf8'
// 完成後的副檔名
var afterName = ''
// 建立函數，以便回呼使用
function XmlAddMypb(go) {
    // 規範化檔案路徑
    var h = path.normalize(go)
    // 取得本檔檔名，以本檔檔名作參數，在當前目錄下：若有相同名的副檔名的檔案，就進行轉換

    // 取得當前目錄下所有檔案及資料夾
    var d = fs.readdirSync(h)
    // 循環目錄
    for (var k of d) {
        // 取得絕對路徑，並規範化路徑
        var n = path.normalize(h + '/' + k)
        // 取得檔案資訊
        var c = fs.statSync(n)
        // 判斷是否為資料夾，如果是：回呼函數，來執行下一層目錄
        if (c.isDirectory()) {
            // 若只執行當前目錄，則註釋此行，並啟動返回通知
            XmlAddMypb(n)
            // console.log('Stop read Directory:' + n)

            // 判斷是否為所要轉換的副檔名的檔案
        } else if (path.extname(n) == x) {

            // 用絕對路徑讀入檔案，使用node的readFileSync同步函數
            var a = fs.readFileSync(n, ru)
            // 導入陣列
            var b = a.split('\n')

            for (var i = 0; i < b.length; i++) {
                // 取代標記
                if (/<img/.test(b[i])) {
                    b[i] = b[i].replace(/(<img[^>]+>)/g, '$1<rubynote t="【圖】"/>')
                }
            }

            // 用絕對路徑寫入檔案
            fs.writeFileSync(n + afterName, b.join('\n'), wu)
            // 完成時返回通知
            console.log('addpb is OK: ' + n + afterName)
        }
    }
}
// 配合timeEnd()成對出現。 打印出代碼執行的時間
console.time('共耗費了')
// 啟用函數
XmlAddMypb('./')
// 'test'名字要和time()中的名字保持一致
console.timeEnd('共耗費了')