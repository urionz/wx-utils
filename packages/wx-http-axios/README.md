## wx-http-axios 微信原生request封装

### 修复原生wx-request并发问题 （参考自[wepy](https://github.com/Tencent/wepy)框架）

### 安装

```console
npm install wx-http-axios  # npm安装方式
yarn add wx-http-axios  # yarn安装方式
```

### 使用指南

```javascript
// utils/request.js
import http from 'wx-http-axios'
import tips from 'wx-tips'

// 创建实例
const service = http.create({
    baseURL: 'http://your.api.com'
    headers: {
        'content-type': 'application/json'
    },
    data: {
        app_key: 'APP_KEY'
    }
})

// 设置全局请求拦截器
service.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
}, () => {
    tips.loading()
})

// 设置全局响应拦截器
service.interceptors.response.use(config => {
    return config
}, error => {
    return Promise.reject(error)
}, response => {
    console.log(response)
    tips.loaded()
})
export default service
```

```javascript
// api/config.js

import service from 'utils/request'

export function getConfig() {
    return service.post('/config', {
        shop_id: 1
    })
}

export function getPages() {
    return service.post('/pages')
}
```

### 配置说明

```javascript
{
    baseURL: '', // 基地址
    headers: {}, // 基础header
    method: 'GET', // 默认请求方法
    data: {} // 基础填充数据
}
```

### 方法api
```javascript
    static create(configure = {}) this
    get(url, data = {}, header = '') Promise
    post(url, data = {}, header = '') Promise
    options(url, data = {}, header = '') Promise
    head(url, data = {}, header = '') Promise
    put(url, data = {}, header = '') Promise
    delete(url, data = {}, header = '') Promise
    trace(url, data = {}, header = '') Promise
    connect(url, data = {}, header = '') Promise
    request(method = '', url, data = {}, header = '') Promise
```