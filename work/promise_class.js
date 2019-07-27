(function(window){
    class Promise{
        /*
        Promise构造函数
        excutor: 同步执行回调函数: (resolve, reject) => {}
        */
        constructor(excutor){

        }
        /*
        指定成功和失败后回调函数
        函数的返回值是一个新的promise
        */
        then(onResolved,onRejected){

        }

         /*
        方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同
        then()的语法糖
        */
        catch(onRejected){}



        /* 
        用来返回一个成功的promise的静态方法
        */

        static  resolve(value){}

        /* 
        用来返回一个失败的promise的静态方法
        */
       static reject(reason){}
       
        /* 
        用来返回一个promise的静态方法
        所有的promises都成功, 返回的promise才成功
        只要有一个失败了, 返回的promise就失败了
        */
        static all(promises){}
        /* 
        用来返回一个promise的静态方法
        第一个确定结果的promise来决定返回promise结果
        */
       static race(promises){}

          // 暴露Promise
       window.Promise=Promise
    }
})(window);