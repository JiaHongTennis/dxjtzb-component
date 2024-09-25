import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

function ToastfComponent(props) {
    const [text, setText] = useState('loading')

    const toSuccess = () => {
        // 更改为成功
        setText('success')
    }
    const toError = () => {
        // 更改为成功
        setText('error')
    }

    useEffect(() => {
        // 初始化方法
        props.initHandel({
            toSuccess,
            toError
        })
    }, [])
    return <span>{text}</span>
}

export const LoadingToast = () => {
    return new Promise((resolve) => {
        const divDom = document.createElement('div')
        const toastRoot = ReactDOM.createRoot(divDom)
        const childNodes = []
        // 关闭方法
        const close = () => {
            // 方法1会多出div
            // toastRoot.unmount()

            //方法2外出不会多出div
            childNodes.forEach(node => {
                node.remove()
            })
        }
        // 初始化
        const initHandel = ({ toSuccess, toError }) => {
            // 方法1会多出div
            // document.body.appendChild(divDom)

            //方法2外出不会多出div
            divDom.childNodes.forEach(node => {
                childNodes.push(node)
                document.body.appendChild(node)
            })
            resolve({ toSuccess, toError, close })
        }
        toastRoot.render(<ToastfComponent initHandel={initHandel} />)
    })
}