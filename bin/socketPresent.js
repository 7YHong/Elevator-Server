/**
 * Created by QYH on 2017/5/10.
 */
var net = require('net');
var Elevator = require('./elevator');
var elevator = new Elevator();
var io;
var HOST = '192.168.137.1';
var PORT = 6969;
var tcpSock;
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
            tcpSock=sock;
            handle.tcpConn(sock);

            sock.on('error',function (err) {
                console.log('tcp err:'+err.message);
            });

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
        tcpSock.write(JSON.stringify(data)+'\r\n');
        elevator.updateAttr(data);
        io.sockets.emit('news',data);
    },
    tcpConn:function (sock) {
        sock.setKeepAlive(true);
        //sock.setTimeout(1000);
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
        jsonlist=String(data).match(/(\{.+?\})(?={|$)/g);       //使用正则表达式分开粘包的json
        console.log("jsonlist length="+jsonlist.length)
        for(i in jsonlist) {
            console.log(jsonlist[i])
            var json;
            try {
                json = JSON.parse(jsonlist[i]);
            } catch (err) {
                console.warn(err.message);
                return;
            }
            if (json.action == 'fullstatus') {
                console.log('receive fullstatus from tcp client');
                data = json.data;
                for (key in data) {
                    elevator[key] = data[key]
                }
                io.sockets.emit('fullstatus', data);
                continue;
            }
            elevator.updateAttr(json);
            io.sockets.emit('news', json);
        }
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