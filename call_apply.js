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
 * 实现call方法的思路
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

/**
 * bind的模拟实现
 * bind()方法会创建一个新函数。当这个新函数被调用时，bind()的第一个参数将作为它运行时的this，之后的一系列参数将会在传递的实参前作为它的参数
 * bind函数的两个特点
 * 1. 返回一个函数
 * 2. 可以传入参数
 */

/**
 * 第一版
Function.prototype.newBind = function(context) {
	var self = this;
	//绑定函数可能是有返回值的所以return
	return function() {
		return self.apply(context);
	};
};
 */

/**
 *第二版: 传入参数
 *
Function.prototype.newBind2 = function(context) {
	var self = this;
	// 获取newBind2函数从第二个参数到最后一个参数
	var args = Array.prototype.slice.call(arguments, 1);

	return function() {
		// 这个时候的arguments是bind返回的函数传入的参数
		var bindArgs = Array.prototype.slice.call(arguments);
		return self.ally(context, args.concat(bindArgs));
	};
};
 */

/**
 *第三版: 构造函数效果的模拟实现
 *
Function.prototype.newBind3 = function(context) {
	var self = this;
	var args = Array.prototype.slice.call(arguments, 1);

	var fBound = function() {
		var bindArgs = Array.prototype.slice.call(arguments);
		// 当作为构造函数时，this指向实例，此时结果为true，将绑定函数的this指向该实例，可以让实例获得来自绑定函数的值
		// 当作为普通函数时，this指向window，此时结果为false，将绑定函数的this指向context
		return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
	};
	// 修稿返回函数的prototype为绑定函数的prototype，实例就可以继承绑定函数中原型的值
	fBound.prototype = this.prototype;
	return fBound;
};
 */

/**
 * 第四版:构造函数效果的优化实现
 *
 */
Function.prototype.newBind4 = function(context) {
	if (typeof this !== 'function') {
		throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
	}
	var self = this;
	var args = Array.prototype.slice.call(arguments, 1);

	var fNOP = function() {};

	var fBound = function() {
		var bindArgs = Array.prototype.slice.call(arguments);
		return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
	};
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	return fBound;
};
