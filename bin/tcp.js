/**
 * Created by QYH on 2017/5/3.
 */
var net = require('net');
module.exports = function () {
    var HOST = '127.0.0.1';
    var PORT = 6969;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
    net.createServer(function (sock) {

        // 我们获得一个连接 - 该连接自动关联一个socket对象
        console.log('CONNECTED: ' +
            sock.remoteAddress + ':' + sock.remotePort);
        elevator.status[0]=1;
        // 为这个socket实例添加一个"data"事件处理函数
        sock.on('data', function (data) {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            // 回发该数据，客户端将收到来自服务端的数据
            sock.write('You said "' + data + '"');
            try {
                var json = JSON.parse(data);
                //switch (json.action) {
                //    case 'up':
                //        elevator.btnfloorup[json.data] = 1;
                //        break;
                //    case 'down':
                //        elevator.btnfloordown[json.data] = 1;
                //        break;
                //    case 'indoor':
                //        elevator.btnindoor[json.data] = 1
                //        break;
                //    case 'status':
                //        elevator.status = json.data;
                //        break;
                //    case 'door':
                //        elevator.door = json.data;
                //        break;
                //    case 'arrive':
                //        console.log('arrive'+json.data);
                //        elevator.arrive = json.data;
                //        elevator.btnindoor[json.data] = 0;
                //        if (elevator.status) elevator.btnfloorup[json.data] = 0;
                //        else elevator.btnfloordown[json.data] = 0;
                //        break;
                //}
                elevator[json.action]=json.data;
                io.sockets.emit('news', json);
            } catch (e) {
                console.log(e.message);
            }
        });

        // 为这个socket实例添加一个"close"事件处理函数
        sock.on('close', function (data) {
            console.log('CLOSED: ' +
                sock.remoteAddress + ' ' + sock.remotePort);
            elevator.status[0]=0;
            elevator.status[1]=0;
        });

    }).listen(PORT, HOST);
    console.log('Server listening on ' + HOST + ':' + PORT);
}