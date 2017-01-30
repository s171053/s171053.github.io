//カメラ／マイクにアクセスするためのメソッドを取得
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//自分のカメラ・マイクのstreamオブジェクト退避用変数
var myStream;
// Peerオブジェクト生成（シグナリングサーバへ接続）
var peer = new Peer({key: 'a6g8unhbznay8pvi', debug: 3});
 
//自分のカメラ・マイクのstreamオブジェクト取得成功時に呼び出す関数 
//streamオブジェクトは自分のカメラ・マイク
var setMyStream = function(stream){
  //相手からの呼び出しやこちらからのコールに使うため自分のstreamオブジェクトを変数に保存
  myStream = stream;
  //streamオブジェクトをULRに変換してvideo要素のsrc属性にセット
  //自分のカメラ映像を表示
  $('#my-video').prop('src', URL.createObjectURL(stream));
};
 
//相手のカメラ・マイクのstreamオブジェクトが渡ってきた時に呼び出される
//streamオブジェクトは相手のカメラ・マイク
var setOthersStream = function(stream){
  //streamオブジェクトをULRに変換してvideo要素のsrc属性にセット
  //自分のカメラ映像を表示
  $('#others-video').prop('src', URL.createObjectURL(stream));
};
 
//シグナリングサーバへ接続した時に発生するイベント）
peer.on('open', function(id){
  //自分のPeer IDをテキストボックスへ表示する
  $('#peer-id').text(id);
});
 
//相手からcallされた時に発生するcallイベント
//相手からcallオブジェクトが渡される
peer.on('call', function(call){
  //受取ったcallオブジェクトのanswerメソッドで自分のstreamオブジェクトを返す
  call.answer(myStream);
  //相手のストリームが渡された時発生するstreamイベント
  call.on('stream', setOthersStream);
});
 
//DOM要素構築後に呼び出される
$(function(){
  //カメラ・マイクのstreamオブジェクトを取得
  //取得成功時に第二引数の関数が呼ばれる
  navigator.getUserMedia({audio: true, video: true}, setMyStream, function(){});
  //「相手をコール」ボタンクリック時の動作
  $('#call').on('click', function(){
    //テキストボックスに入力された相手のIDを指定し、
    //自分のカメラのstreamオブジェクトをセットし、callイベントで相手を呼び出す
    var call = peer.call($('#others-peer-id').val(), myStream);
    //（相手がanswerで渡してきた）ストリームが渡ってきた時発生するstreamイベント
    call.on('stream', setOthersStream);
  });
});
 
//peerオブジェクトがエラー時に発生するerrorイベント
peer.on('error', function(e){
  console.log(e.message);
});