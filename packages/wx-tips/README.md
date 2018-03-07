## Tips 微信原生tips封装

### 安装

```console
npm install wx-tips  # npm安装方式
yarn add wx-tips  # yarn安装方式
```

### 使用指南

```javascript
// utils/tips.js
import tips from 'wx-tips'

export default const instance = tips.getInstance({
    errorIconPath: '/images/error.png', // 错误提示图片路径  必须提供
    alertIconPath: '/images/alert.png', // alert提示图片路径 必须提供
    loadingMode: 'Loading' // 选项 NavigationBarLoading|Loading
})
```

```javascript
// app.js
import tips '/utils/tips'

tips.alert('alert')
tips.modal('modal')
tips.loading()
tips.loaded()
```

### `tips getInstance方法参数配置`
| 参数       | 说明      | 类型       | 默认值       | 必须      |
|-----------|-----------|-----------|-------------|-------------|
| errorIconPath | 错误提示图片路径 | String | '' | true |
| alertIconPath | alert提示图片路径 | String | '' | true  |
| loadingMode | loading模式 Loading对应 wx.showLoading/wx.hideLoading  NavigationBarLoading对应 wx.showNavigationBarLoading/wx.hideNavigationBarLoading | NavigationBarLoading  | String | NavigationBarLoading | false |
| duration | 显示周期，毫秒 | int  | 1000 | false |

### `tips 实例方法api`
```javascript
    static getInstance(config = {}) this
    success(title, duration = '') Promise
    modal(content = '', title = '') Promise
    confirm(content, payload = {}, title) Promise
    toast(title, hideCallback, icon = 'success', duration = '')
    loading(title = '', force = false)
    loaded()
    alert(title, duration = '') Promise
    error(title, hideCallback, duration = '')
    setLoading()
```