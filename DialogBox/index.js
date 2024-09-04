import Vue from 'vue'
import DialogBoxComponent from './component.vue'

export class dialogBox {
  constructor (data) {
    console.log('初始化清单')
    this.initCompnentView = new Vue({
      render: (h) => {
        return h(
          DialogBoxComponent,
          {
            props: {
              ...data,
              savedatefun: this.savedatefun.bind(this),
              closefun: this.closefun.bind(this)
            }
          }
        )
      }
    })
    // 定义一个容器
    const dialogWrap = document.createElement('div');
    if (data.appendTo) {
      // 创建一个div,否则遮造层，会直接插入到body上
      data.appendTo.appendChild(dialogWrap)
    } else {
      // 将字符串模板生成的内容添加到body上
      document.body.appendChild(dialogWrap)
    }
    this.vmInstance = this.initCompnentView.$mount(dialogWrap)
    return new Promise((resolve, reject) => {
      this.resolvefun = resolve
      this.rejectfun = reject
    })
  }

  closefun (res) {
    this.resolvefun({ state: 'close', data: res })
    this.vmInstance.$el.remove() // 删除dom
    this.vmInstance.$nextTick(() => {
      this.vmInstance.$destroy()
      this.vmInstance = null
    })
  }

  savedatefun (res, state) {
    let returnstate = 'save'
    if (state) {
      returnstate = state
    }
    if (this.vmInstance) {
      this.resolvefun({ state: returnstate, data: res })
      this.vmInstance.$el.remove()
      this.vmInstance.$nextTick(() => {
        this.vmInstance.$destroy()
      })
    }
  }

  // 关闭
  close () {
    this.vmInstance.closeFn()
  }
}
