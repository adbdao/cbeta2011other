// 導入模組
var fs = require('fs')
var path = require('path')
// 可改寫副檔名及編碼
var x = '.xml'
var ru = 'utf16le'
var wu = 'utf8'
// 完成後的副檔名
var afterName = '.log'

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
            a = '\n' + a
            var b = a
                .replace(/<頁碼? [^>]+>[\n|\r]*/g, '')
                .replace(/<段\/?>[\n|\r]*/g, '')
                .replace(/[\n|\r]{3,}/g, '\n\n')
                .split('\n')

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

            // 30字切行
            // for (var i = 0; i < b.length; i++) {
            //     b[i] = b[i].replace(/(.{30})/g, '$1\n')
            // }

            // 第1行不好轉換，會出現亂碼，所以從第2行開始
            for (var i = 1; i < b.length; i++) {
                // 先刪除舊的<頁>標記
                // 取代標記
                b[i] = b[i].replace(/<頁碼? [^>]+>/g, '')
                    .replace(/<段\/?>/g, '')
                    .replace(/<聯 l/g, '<a href')
                    .replace(/聯>/g, 'a>')
                    .replace(/<_-書 .+/g, '')
                    .replace(/檔>/g, 'file>')
                    .replace(/<檔/g, '<file')
                    .replace(/&/g, '＆')
                    .replace(/粗>/g, 'b>')
                    .replace(/經>/g, 'le>')
                    // .replace(/字母>/g, 'h1>')
                    .replace(/英文名>/g, 'eng>')
                    .replace(/<嵌?圖 f/g, '<img n')
                    .replace(/<註/g, '<fn')
                    .replace(/註>/g, 'fn>')
                    // .replace(/<釋([^>]+)\/>(.*)/g, '<h1$1>$2</h1>')
                    .replace(/<釋/g, '<a')
                    // .replace(/釋>/g, 'a>')
                    .replace(/<頁碼>/g, '<rubynote t="')
                    .replace(/<\/頁碼>/g, '"/>')
                    .replace(/<偏右字>/g, '<rubynote t="')
                    .replace(/<\/偏右字>/g, '"/>')
                    .replace(/序>/g, 'talk>')
                    .replace(/分>/g, 'pv>')
                    .replace(/跋>/g, 'ba>')
                    .replace(/會>/g, 'va>')
                    .replace(/其他>/g, 'other>')
                    .replace(/附文>/g, 'ps>')
                    .replace(/科判>/g, 'h0>')
                    .replace(/卷>/g, 'sarticle>')
                    .replace(/<冊/g, '<book')
                    .replace(/冊>/g, 'book>')
                    .replace(/編>/g, 'h0>')
                    .replace(/大>/g, 'tag>')
                    .replace(/表>/g, 'kai>')
                    .replace(/<書/g, '<article')
                    .replace(/書>/g, 'article>')
                    .replace(/章>/g, 'article>')
                    .replace(/節>/g, 'article>')
                    .replace(/類>/g, 'le>')
                    .replace(/項>/g, 'xa>')
                    .replace(/文>/g, 'wi>')
                    .replace(/篇>/g, 'pe>')
                    .replace(/年>/g, 'year>')
                    .replace(/詩>/g, 'si>')
                    .replace(/著者>/g, 'sr>')
                    .replace(/詞>/g, 'tag>')
                    .replace(/人名>/g, 'name>')
                    .replace(/問>/g, 'ask>')
                    .replace(/答>/g, 'rep>')
                    .replace(/字>/g, 'zi>')
                    .replace(/小字>/g, 'little>')
                    .replace(/原出處>/g, 'ptr>')
                    .replace(/參考書>/g, 'def>')
                    .replace(/期>/g, 'l>')
                    .replace(/編目資訊>/g, 'ml>')
                    .replace(/原書分頁>/g, 'hr>')
                    .replace(/相應部>/g, 'sep>')
                    .replace(/藥>/g, 'by>')
                    .replace(/方>/g, 'bf>')
                    .replace(/症>/g, 'bz>')
                    // .replace(/甲>/g, 'h1>')
                    // .replace(/乙>/g, 'h2>')
                    // .replace(/丙>/g, 'h3>')
                    // .replace(/丁>/g, 'h4>')
                    // .replace(/戊>/g, 'h5>')
                    // .replace(/己>/g, 'h6>')
                    // .replace(/庚>/g, 'h7>')
                    // .replace(/辛>/g, 'h8>')
                    // .replace(/壬>/g, 'h9>')
                    // .replace(/癸>/g, 'h10>')
                    // .replace(/子>/g, 'h11>')
                    // .replace(/丑>/g, 'h12>')
                    // .replace(/寅>/g, 'h13>')
                    // .replace(/卯>/g, 'h14>')
                    // .replace(/辰>/g, 'h15>')
                    // .replace(/巳>/g, 'h16>')
                    // .replace(/午>/g, 'h17>')
                    // .replace(/未>/g, 'h18>')
                    // .replace(/申>/g, 'h19>')
                    // .replace(/酉>/g, 'h20>')
                    // .replace(/戌>/g, 'h21>')
                    // .replace(/亥>/g, 'h22>')
                    // .replace(/日>/g, 'h23>')
                    // .replace(/月>/g, 'h24>')
                    // .replace(/火>/g, 'h25>')
                    // .replace(/水>/g, 'h26>')
                    // .replace(/木>/g, 'h27>')
                    // .replace(/金>/g, 'h28>')
                    // .replace(/土>/g, 'h29>')
                    // .replace(/春>/g, 'h30>')
                    // .replace(/夏>/g, 'h31>')
                    // .replace(/秋>/g, 'h32>')
                    // .replace(/冬>/g, 'h33>')
                    // .replace(/東>/g, 'h34>')
                    .replace(/《/g, '<bf>《')
                    .replace(/》/g, '》</bf>')
                    .replace(/〈/g, '<by>〈')
                    .replace(/〉/g, '〉</by>')
                    .replace(/〔/g, '<bz>〔')
                    .replace(/〕/g, '〕</bz>')
                    .replace(/(<\/?by>)<\/?by>/g, '$1')
                    .replace(/(<\/?bf>)<\/?bf>/g, '$1')
                    .replace(/(<\/?bz>)<\/?bz>/g, '$1')

                // ===============================================
                // 調整[註釋]標記
                // if (/<釋 /.test(b[i])) {
                //     b[i] = b[i].replace(/(<釋 n=")([^"]+)("\/>)/g, '<link to ="' + path.basename(n,'.xml') + '_' + sfn + '">▼' + sfn + '</link>')
                //     sfn++
                // }
                // if (/<\?★/.test(b[i])) {
                //     b[i] = b[i].replace(/<\?★"([^"]+)">[^\?]*\?>/g, '<a n="' + path.basename(n,'.xml') + '_' + sa + '">▲</a>')
                //     sa++
                // }

                // ===============================================
                // 加上冊碼頁碼
                // 多個檔案的時候，不好算出冊碼，就省去冊碼
                if (i == 1 || s2 > 1023) {
                    // if (/<article/.test(b[i])) {
                    s2 = 1
                    // s1++
                    // b[i] = '<pb n="' + s1 + '.' + s2 + '"/>\n' + b[i]
                    b[i] = '<pb n="' + s2 + '"/>\n' + b[i]
                    s0 = i + 63
                }
                if (i == s0) {
                    s2++
                    // b[i] = '<pb n="' + s1 + '.' + s2 + '"/>\n' + b[i]
                    b[i] = '<pb n="' + s2 + '"/>\n' + b[i]
                    s0 = i + 63
                }
            }

            // ===============================================
            // 結尾加上</file>
            // b[b.length] = '</file>'

            // ===============================================
            // 用絕對路徑寫入檔案
            fs.writeFileSync(n + afterName, b.join('\n'), wu)
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