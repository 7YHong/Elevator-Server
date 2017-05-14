/**
 * Created by QYH on 2017/5/9.
 */
module.exports = Elevator;
function Elevator() {
//远程控制启用状态
//this.relctl=0;
//远程连接状态
// this.conn_status=0;
//电梯状态
//0：静止
//1：上升
//-1：下降
// this.status=0;
//电梯门状态
//0：关着
//1：开着
//-1：正在关门
//1：正在开门
// this.door=0;
//电梯目前所在楼层
// this.arrive=0;

//0:conn_status
//1:remotectl
//2:status
//3:door
//4:arrive
    this.status = new Array(4);
//各种按钮的状态
    this.btnup = new Array(8);
    this.btndown = new Array(8);
    this.btnindoor = new Array(8);
}
Elevator.prototype.updateAttr = function (msg) {
    console.log('update:'+JSON.stringify(msg));
    this[msg.action][msg.index] = msg.data;
}