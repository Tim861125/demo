var makeCounter = function() {
    var privateCounter = 0;  // 私有變數，外部無法存取
    
    function increment() {
        privateCounter++;
    }
    
    function decrement() {
        privateCounter--;
    }
    
    function value() {
        return privateCounter;
    }
    
    // 回傳公開介面物件
    return {
        increment: increment,
        decrement: decrement,
        value: value
    };
};

// 使用範例
var counter = makeCounter();
counter.increment();  // privateCounter 變成 1
counter.increment();  // privateCounter 變成 2
console.log(counter.value());  // 顯示 2
counter.decrement();  // privateCounter 變成 1
console.log(counter.value());  // 顯示 1

// 外部無法直接存取
console.log(typeof privateCounter);  // undefined，私有變數不存在於外部
