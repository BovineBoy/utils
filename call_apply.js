// var a = {
// 	value: 1
// };

// function bar() {
// 	console.log(this.value);
// }

// bar.call(a); //1

// var b = {
// 	value: 2,
// 	bar: function() {
// 		console.log(this.value);
// 	}
// };

// b.bar(); //2

/**
 * 实现bind方法的思路
 * 1. 将函数设为对象的属性	bar.fn = foo
 * 2. 执行该函数	bar.fn()
 * 3. 删除该函数	delete bar.fn
 * tip: fn 是对象的属性名，反正最后也要删除它，所以起成什么都无所谓。
 */

/**
 * 第一版:
Function.prototype.newCall = function(context) {
	context.fn = this; //this就是调用newCall方法的函数
	context.fn();
	delete context.fn;
};

var c = {
	value: 3
};

function foo() {
	console.log(this.value);
}

foo.newCall(c); //3
 */

/**
  * 第二版:解决传递参数问题
Function.prototype.newCall2 = function(context) {
	// var args = Array.from(arguments);
	let args = [],
		i,
		len = arguments.length;
	for (i = 1; i < len; i++) {
		args.push('arguments[' + i + ']');
	}
	context.fn = this;
	eval('context.fn(' + args + ')'); //args会自动调用Array.toString这个方法
	delete context.fn;
};

var d = {
	value: 4
};

function bar(name, age) {
	console.log(name, age, this.value);
}

bar.newCall2(d, 'bovine', 12);
  */

/**
 * 第三版: 1.this参数可以传null，当为null的时候，视为指向window
 *		  2.函数可以有返回值
 Function.prototype.newCall3 = function(context) {
	var args = [],
		i,
		len = arguments.length;
	for (i = 1; i < len; i++) {
		args.push('arguments[' + i + ']');
	}
	var context = context || window;
	context.fn = this;
	var result = eval('context.fn(' + args + ')');
	delete context.fn;
	return result;
};

var d = {
	value: 4
};

function bar(name, age) {
	return {
		value: this.value,
		name,
		age
	};
}
console.log(bar.newCall3(d, 'bovine', 12)); //{value: 4, name: "bovine", age: 12}
 */

/**
 * apply的模拟实现
 *
Function.prototype.newApply = function(context, arr) {
	var context = context || window,
		result;
	context.fn = this;
	if (!arr) {
		result = context.fn();
	} else {
		var args = [];
		for (var i = 1; i < arr.length; i++) {
			args.push('arr[' + i + ']');
		}
		result = eval('context.fn(' + args + ')');
	}
	return result;
};

var d = [1, 2, 3];

console.log(Math.max.newApply(null, d));
 */
