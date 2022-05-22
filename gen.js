var createCorpusFromJSON=null;
try{
	createCorpusFromJSON=require("ksana-corpus-builder").createCorpusFromJSON;
} catch(e){
	createCorpusFromJSON=require("ksana-corpus-lib").createCorpusFromJSON;
}

createCorpusFromJSON("cbeta2011other-corpus.json",function(err,res){
	console.log(res)
	if (err)console.log(err);
});
