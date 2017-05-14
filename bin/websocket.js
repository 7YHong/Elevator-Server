var Elevator=require('./elevator');
elevator=new Elevator();
module.exports=function (server) {
    io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log("new connection accepted");
        socket.emit('fullstatus',elevator);
        console.log('fullstatus:'+JSON.stringify(elevator));
        socket.on('news',function (data) {
            console.log(JSON.stringify(data));
            elevator.updateAttr(data);
            socket.emit('news',data);
        });
        socket.on('disconnect',function (socket) {
            console.log('an client disconnect');
        });
    });
}