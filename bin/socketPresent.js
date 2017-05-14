/**
 * Created by QYH on 2017/5/10.
 */
var net = require('net');
var Elevator = require('./elevator');
var elevator = new Elevator();
var io;
var HOST = '192.168.1.107';
var PORT = 6969;
module.exports = {
    bindWebSocket: function (server) {
        console.log('bind websocket to server')
        io = require('socket.io')(server);
        io.on('connection', function (socket) {
            handle.socketConn(socket);
            socket.on('disconnect',function (socket) {
                console.log('an client disconnect');
            });
            socket.on('news',handle.socketNews.bind(this,socket));
        });
    },
    openTcpServer: function () {
        console.log('open tcp server')
        net.createServer(function (sock) {
            handle.tcpConn(sock);
            sock.on('data', handle.tcpNews.bind(this,sock));

            // 为这个socket实例添加一个"close"事件处理函数
            sock.on('close', handle.tcpClose.bind(this,sock));

        }).listen(PORT, HOST);
    }
}
var handle = {
    socketConn:function (socket) {
        console.log("new connection accepted");
        console.log("send fullstatus:"+JSON.stringify(elevator));
        socket.emit('fullstatus',elevator);
    },
    socketNews: function (socket,data) {
        console.log('receive data from web:'+JSON.stringify(data));
        elevator.updateAttr(data);
        io.sockets.emit('news',data);
    },
    tcpConn:function (sock) {
        console.log('tcp CONNECTED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        var msg={};
        msg.action='status';
        msg.index=0;
        msg.data=1;
        elevator.updateAttr(msg);
        io.sockets.emit('news',msg);
    },
    tcpNews:function (sock,data) {
        console.log('tcp DATA ' + sock.remoteAddress + ': ' + data);
        // 回发该数据，客户端将收到来自服务端的数据
        sock.write('You said "' + data + '"');

        var json;
        try{
            json=JSON.parse(data);
        }catch (err){
            console.warn(err.message);
            return;
        }
        if(json.action=='fullstatus'){
            console.log('receive fullstatus from tcp client');
            return;
        }
        elevator.updateAttr(json);
        io.sockets.emit('news',json);
    },
    tcpClose:function (sock,data) {
        console.log('tcp CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        var msg={};
        msg.action='status';
        msg.index=0;
        msg.data=0;
        elevator.updateAttr(msg);
        io.sockets.emit('news',msg);
        msg.index=1;
        elevator.updateAttr(msg);
        io.sockets.emit('news',msg);
    }
}