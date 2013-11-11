
function cut_decimals(num, places){
	places = places || 3;
	var pv = Math.pow(10, places);
	return Math.round(num * pv)/pv;
}

function percent(num){
	return cut_decimals(num / 100);
}

function print_percent(rate){
	return cut_decimals(rate * 100);
}

function yinhua(cost){
	var rate = 0.001,
		yinhua_min = 5,
		p_yinhua = 0;

	// 印花税 ＝ 成交金额 x 0.1%，最低为5元
	p_yinhua = cost * rate;
	p_yinhua = p_yinhua > yinhua_min ? p_yinhua : yinhua_min;

	return p_yinhua;
}

function shouxu(cost){
	var rate = 0.001,
		shouxu_min = 5,
		p_shouxu = 0;

	// 手续费 ＝ 成交金额 x 0.1%，最低为5元
	p_shouxu = cost * rate;
	p_shouxu = p_shouxu > shouxu_min ? p_shouxu : shouxu_min;

	return p_shouxu;
}

function buy(num, price){

	var cost = 0,
		cost_actual = 0,
		buy_price = 0,
		sale_price = 0,
		p_other = 1;

	// 成交金额 ＝ 股票数量 x 股票价格
	cost = num * price;

	// 成交金额成本 ＝ 成交金额 ＋ 手续费 ＋ 其他杂费
	cost_actual = cost + shouxu(cost) + p_other;

	// 成本价 = 成交金额成本 ／ 股票数量
	buy_price = cost_actual / num;

	// 卖出价格计算 = （成交金额成本 ＋ 印花税 ＋ 手续费 ＋ 其他杂费）／ num
	sale_price = (cost_actual + yinhua(cost) + shouxu(cost) + p_other) / num

	return {
		'cost': cut_decimals(cost),
		'cost_actual': cut_decimals(cost_actual),
		'buy_price': cut_decimals(buy_price),
		'sale_price': cut_decimals(sale_price)
	}
}

function sale(num, price){
	var cost = 0,
		cost_actual = 0,
		buy_price = 0,
		sale_price = 0,
		p_other = 1;

	// 成交金额 ＝ 股票数量 x 股票价格
	cost = num * price;

	// 卖出发生金额 ＝ 成交金额 － 印花税 － 手续费 － 其他杂费
	cost_actual = cost - yinhua(cost) - shouxu(cost) - p_other;

	// 买进价格计算 = （成交金额 ＋ 手续费 ＋ 其他杂费）／ num
	buy_price = (cost + shouxu(cost) + p_other) / num;

	// 卖出参考价 ＝ 卖出发生金额 ／ 股票数量
	sale_price = cost_actual / num;

	return {
		'cost': cut_decimals(cost),
		'cost_actual': cut_decimals(cost_actual),
		'buy_price': cut_decimals(buy_price),
		'sale_price': cut_decimals(sale_price)
	}
}

function buy_cost(num, price, income){
	var buy_data = buy(num, price),
		expect_price = 0,
		cost = 0,
		p_other = 1,
		cost_expect = 0;

	console.log('成交金额为' + buy_data.cost + '元，实际发生金额为' + buy_data.cost_actual + '元\n核算后成本价为' + buy_data.buy_price + '元，卖出成本价至少为' + buy_data.sale_price + '元')

	if(income){
		// 成交金额 ＝ 股票数量 x 股票价格
		cost = num * price;

		// 预期收益金额 ＝ 买入发生金额 ＋ 收益金额
		cost_expect = buy_data.cost_actual + income;

		// 预期收益均价 ＝ （预期收益金额 ＋ 印花税 ＋ 手续费 ＋ 杂项） ／ 成交数量
		expect_price = (cost_expect + yinhua(cost_expect) + shouxu(cost_expect) + p_other) / num;

		console.log('预期收益卖出价至少为' + cut_decimals(expect_price) + '元')
	}



}

function sale_cost(num, price, income){
	var sale_data = sale(num, price),
		expect_price = 0,
		cost = 0,
		p_other = 1,
		cost_expect = 0;

	console.log('成交金额为' + sale_data.cost + '元，实际发生金额为' + sale_data.cost_actual + '元\n买进成本价为' + sale_data.buy_price + '元，卖出成本价实际为' + sale_data.sale_price + '元');

	if(income){
		// 成交金额 ＝ 股票数量 x 股票价格
		cost = num * price;

		// 预期收益金额 ＝ 卖出发生金额 - 收益金额
		cost_expect = sale_data.cost_actual - income;

		// 预期收益均价 ＝ （预期收益金额 ＋ 手续费 ＋ 杂项） ／ 成交数量
		expect_price = (cost_expect + shouxu(cost_expect) + p_other) / num;

		console.log('预期收益买人价最高为' + cut_decimals(expect_price) + '元')
	}

}

function income_cost(num, buy_price, sale_price){
	var buy_data = buy(num, buy_price),
		sale_data = sale(num, sale_price),
		income_actual = 0;

	// 收益金额 ＝ 卖出发生金额 - 买人发生金额
	income_actual = sale_data.cost_actual - buy_data.cost_actual;

	console.log('收益金额为' + cut_decimals(income_actual) + '元');
}


function acpi(amount, rate_year, months_num){
	if(!amount || !rate_year || !months_num){
			return -1;
	}

	var rate_month = rate_year / 12,
		v = Math.pow(1 + rate_month, months_num),
		result = amount * rate_month * v / (v - 1);

	return cut_decimals(result);
}

function loan(amount, rate_year, months_num){
	if(rate_year > 1){
		rate_year = percent(rate_year);
	}
	var month_payment = acpi(amount, rate_year, months_num),
		interest_total = month_payment * months_num - amount,
		interest_month = interest_total / months_num,
		interest_day = interest_month / 30,
		principal_interest = amount + interest_total;

	console.log('贷款金额：' + amount + '元，年利率：' + print_percent(rate_year) + '％，贷款期限：' + months_num + '个月，还款本息总额：' + cut_decimals(principal_interest) + '元');
	console.log('每月偿还本息：' + month_payment + '元，月利率：' + print_percent(rate_year / 12) + '％');
	console.log('总利息：' + cut_decimals(interest_total) + '元，每月利息：' + cut_decimals(interest_month) + '元，每天利息（按每月30天）：' + cut_decimals(interest_day) + '元');
}














