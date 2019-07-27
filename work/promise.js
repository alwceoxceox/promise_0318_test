(function(window){
   function Promise(excutor){
        /*
        Promise构造函数
        excutor: 同步执行回调函数: (resolve, reject) => {}
        */
        const self=this
        self.status='pending'
        self.data=undefined
        self.callbacks=[]
        /* 
        用来指定promise成功的状态和成功的value
            1). 指定status改为'resolved'
            2). 指定data为value
            3). 可能需要去执行已保存的待执行成功的回调函数
        */
        function resolve(value){
             // 如果状态不是pending, 直接结束
             if(self.status!='pending'){
                 return
             }
            //  1). 指定status改为'resolved'
            self.status='resolved'
            //  2). 指定data为value
            self.data=value
            //  3). 可能需要去执行已保存的待执行成功的回调函数
             if(self.callbacks.length>0){
                 setTimeout(()=>{// 本来需要使用微列队, 但js操作太麻烦, 简单使用宏列队
                    self.callbacks.forEach((callbackObj)=>{
                        callbackObj.onResolved(value)// 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
                    })
                 },0)
             }
        }
        /* 
            用来指定promise失败的状态和失败的reason
            1).指定status改为 'rejected'
            2).指定data为reason
            3).可能需要去执行已保存的待执行失败的回调函数
        */
        function reject(reason){
            // 如果状态不是pending, 直接结束
            if(self.status!=='pending'){
             return
            }
            // 1).指定status改为 'rejected'
            self.status='rejected'
            // 2).指定data为reason
            self.data=reason
            // 3).可能需要去执行已保存的待执行失败的回调函数
            if(self.callbacks.length>0){
                setTimeout(()=>{
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onRejected(reason) // 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
                      })
                   },0)
                }
            }
        }
         
        try{
            excutor(resolve,reject)
        }catch(error){
           reject(error)
        }
    }


      // 立即同步执行器函数(去启动异步任务)

       /*
        指定成功和失败后回调函数
        函数的返回值是一个新的promise
        */



       Promise.prototype.then=function(onResolved,onRejected){
        const self=this

        // 指定 onResolved 与 onRejected的默认值
        onResolved=typeof onResolved==='function'?onResolved:value=>value
        onRejected=typeof onRejected==='function'?onRejected:reason=>{throw reason}
        return new Promise((resolve,reject)=>{
            function handle(callback){
                try {
                    const result=callback(self.data)
                    if(result instanceof Promise){
                        result.then(
                            value=>{
                                resolve(value)
                            },
                            reason=>{
                                reject(reason)
                            }
                        )
                    }else{
                        resolve(result)
                    }
                }catch(error){
                    reject(error)
                }
            }



            if(self.status==='resolved'){
                setTimeout(()=>{
                    handle(onResolved)
                },0)
            }else if(self.status==='rejected'){
                setTimeout(()=>{
                    handle(onRejected)
                },0)
            }else{
                self.callbacks.push({
                   onResolved(){
                    handle(onResolved)
                   }
                },{
                   onRejected(){
                    handle(onRejected)
                   }
                })
            }
        })
    }

     /*
    方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同
    then()的语法糖
    */
    Promise.prototype.catch=function(onRejected){
        return  this.then(null,onRejected)
    }



    /* 
    用来返回一个成功的promise的静态方法
    */

   Promise.resolve=function(value){
     return new Promise((resolve,reject)=>{
         if(value instanceof Promise){
             value.then(resolve,reject)
         }else{
             resolve(value)
         }
     })
   }

    /* 
    用来返回一个失败的promise的静态方法
    */
   Promise.reject=function(reason){
       return new Promise((resolve,reject)=>{
           reject(reason)
       })
   }
   
    /* 
    用来返回一个promise的静态方法
    所有的promises都成功, 返回的promise才成功
    只要有一个失败了, 返回的promise就失败了
    */
   Promise.all=function(promises){
       const length=promises.length
       const values=new Array(length)
       let resolvedCount=0

       return new Promise((resolve,reject)=>{
                promises.forEach((p,index)=>{
                    Promise.resolve(p).then((value)=>{
                        resolvedCount++
                        values[index]=value
                        if(resolvedCount===length){
                            resolve(values)
                        }
                    },
                    reason=>{
                        reject(reason)
                    }
                )
           })
       })
   }
    /* 
    用来返回一个promise的静态方法
    第一个确定结果的promise来决定返回promise结果
    */
   Promise.race=function(promises){
       return new Promise((resolve,reject)=>{
           promises.forEach((p)=>{
               Promise.resolve(p).then(
                   value=>{
                       resolve(value)
                   },
                   reason=>{
                       reject(reason)
                   }
               )
           })
       })
   }


   Promise.resolveDelay = function (value, time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(value instanceof Promise){
                value.then(resolve,reject)
            }else{
                resolve(value)
            }
        },time)
    })
   }

   Promise.rejectDelay = function (reason, time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            reject(reason)
        },time)
    })
   }





     // 暴露Promise
     window.Promise=Promise
})(window);