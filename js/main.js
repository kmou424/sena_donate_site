var alipay = document.getElementById("alipay");
var wechatpay = document.getElementById("wechatpay");
alipay.onclick = function () {
	alipay.setAttribute("class", "mdui-chip mdui-shadow-2 mdui-color-pink");
	wechatpay.setAttribute("class", "mdui-chip");
	alipay.setAttribute("isChecked", "true");
	wechatpay.setAttribute("isChecked", "false");
}
wechatpay.onclick = function () {
	alipay.setAttribute("class", "mdui-chip")
	wechatpay.setAttribute("class", "mdui-chip mdui-shadow-2 mdui-color-pink")
	alipay.setAttribute("isChecked", "false");
	wechatpay.setAttribute("isChecked", "true");
}

const query = Bmob.Query('user');
var socid1 = document.getElementById("socid1");
var socid2 = document.getElementById("socid2");
var isEdited = false;
document.getElementById("socid1").onblur = function () {
	setSocIdStatus();
}
document.getElementById("socid1").oninput = function () {
	socid2.focus();
	socid2.setAttribute("value", socid1.value);
	socid1.focus();
}
function setSocIdStatus() {
	isEdited = false;
	query.equalTo("socid", "==", socid1.value)
	query.find().then(res => {
		var json = eval(JSON.stringify(res));
		query.set("id", json[0].objectId);
		isEdited = true;
	})
}

function submit() {
	var paymentcode_input = document.getElementById("payment_code");
	var payment_code = paymentcode_input.value;
	var regex = /^\d{12,}$/
	if (regex.test(payment_code)) {
		query.set("alipay", eval(alipay.getAttribute("isChecked")));
		query.set("wechatpay", eval(wechatpay.getAttribute("isChecked")));
		query.set("payment_code", paymentcode_input.value);
		query.set("socid", socid1.value);
		if (isEdited) {
			mdui.dialog({
				title: '修改模式!',
				content: '检测到你填写的SocID已经存在于服务器，所以我们判断你正在请求修改已提交过的数据，你需要再次确认你输入的信息都是正确的，否则提交无效',
				buttons: [
					{
						text: '取消'
					},
					{
						text: '确认',
						onClick: function (inst) {
							query.save().then(res => {
								mdui.dialog({
									title: '完成',
									content: '提交成功，请等待审核通过在本页面下方获取你的激活码。(资料填写错误可重新提交)',
									buttons: [
										{
											text: '确认',
											onClick: function (inst) {
											}
										}
									]
								});
							}).catch(err => {
								mdui.dialog({
									title: '错误',
									content: '提交失败，请检查网络后重试',
									buttons: [
										{
											text: '关闭窗口',
											onClick: function (inst) {
											}
										}
									]
								});
							})
						}
					}
				]
			});
		} else {
			mdui.dialog({
				title: '确定吗?',
				content: '你需要确认你输入的信息都是正确的，否则提交无效',
				buttons: [
					{
						text: '取消'
					},
					{
						text: '确认',
						onClick: function (inst) {
							query.save().then(res => {
								mdui.dialog({
									title: '完成',
									content: '提交成功，请等待审核通过在本页面下方获取你的激活码。(资料填写错误可重新提交)',
									buttons: [
										{
											text: '确认',
											onClick: function (inst) {
											}
										}
									]
								});
							}).catch(err => {
								mdui.dialog({
									title: '错误',
									content: '提交失败，请检查网络后重试',
									buttons: [
										{
											text: '关闭窗口',
											onClick: function (inst) {
											}
										}
									]
								});
							})
						}
					}
				]
			});
		}
	} else {
		alert("订单号至少为12位");
	}
}

function query_code() {
	var isSocIdExsited = false;
	var active_code = document.getElementById("active_code");
	query.equalTo("socid", "==", socid2.value);
	query.find().then(res => {
		var json = eval(JSON.stringify(res));
		active_code.setAttribute("value", json[0].secret);
		isSocIdExsited = true;
	})
	if (!isSocIdExsited) {
		active_code.setAttribute("value", "错误: 服务器上不存在此SocID，请绑定设备后再试");
	}
	if (socid2.value == "" | socid2.value == null) {
		active_code.setAttribute("value", "错误: 请填写SocID后再进行查询操作")
	}
}