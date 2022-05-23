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
    // 取得本檔絕對路徑
    // var p = path.parse(__filename)
    // { root: 'D:\\',
    //   dir: 'D:\\nj',
    //   base: 'txt.js',
    //   ext: '.js',
    //   name: 'txt' }

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
            // ===============================================
            // 導入陣列，準備編輯
            // 刪除過多的空行，及<頁<段
            // 因為《續藏》第1行是頁碼，必須刪除第1行的頁碼，但先要在最前面加一行，不然在後面的for b[0]會轉換不到
            a = '<file>' + a +'</file>'
            // var b = a
            //     .replace(/<頁碼? [^>]+>[\n|\r]*/g, '')
            //     .replace(/<段\/?>[\n|\r]*/g, '')
            //     .replace(/[\n|\r]{3,}/g, '\n\n')
            //     .split('\n')

            // 首行加一空行，後來不必了，b[0]之前，不能加任何字，否則「位元組順序記號」 EF BB BF ，會跑到第2行，變成亂碼
            // b.unshift('\n')
            // 將幾個檔頭位元，改為第一行，後來這方法無效
            // if(/0xEF0xBB0xBF/.test(b[0])){
            // b[0].replace(/[0xEF|0xBB|0xBF]/,'')

            // ===============================================
            // 開頭加上<file>
            // b[0] = b[0].replace(/^(.)/, '<file>\n$1')

            // ===============================================
            // 加上批次冊碼頁碼
            // 預設變量，才能累加冊碼頁碼
            var s0 = 0
            var s1 = 0
            var s2 = 1
            var sfn = 1
            var sa = 1


            // ===============================================
            // 結尾加上</file>
            // b[b.length] = '</file>'

            // ===============================================
            // 用絕對路徑寫入檔案
            fs.writeFileSync(n + afterName, a, wu)
            // 完成時返回通知
            console.log('addpb is OK: ' + n + afterName)
        }
    }
}

// ===============================================
// 配合timeEnd()成對出現。 打印出代碼執行的時間
console.time('共耗費了')
// 啟用函數
XmlAddMypb('./')
// 'test'名字要和time()中的名字保持一致
console.timeEnd('共耗費了')