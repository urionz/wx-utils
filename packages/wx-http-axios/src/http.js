const RequestMQ = {
    map: {},
    mq: [],
    running: [],
    MAX_REQUEST: 5,
    push(param) {
        param.t = +new Date()
        while ((this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1)) {
            param.t += Math.random() * 10 >> 0
        }
        this.mq.push(param.t)
        this.map[param.t] = param
    },
    next() {
        const me = this

        if (this.mq.length === 0) { return }

        if (this.running.length < this.MAX_REQUEST - 1) {
            const newone = this.mq.shift()
            const obj = this.map[newone]
            const oldComplete = obj.complete
            obj.complete = (...args) => {
                me.running.splice(me.running.indexOf(obj.t), 1)
                delete me.map[obj.t]
                oldComplete && oldComplete.apply(obj, args)
                me.next()
            }
            this.running.push(obj.t)
            return wx.request(obj)
        }
    },
    request(obj) {
        obj = obj || {}
        obj = (typeof (obj) === 'string') ? { url: obj } : obj
        this.push(obj)
        return this.next()
    }
}

const deepClone = obj => {
    const proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
}

export default class {
    configure = {
        baseURL: '',
        headers: {},
        method: 'GET',
        data: {}
    }
    interceptors = {
        request: {
            prepare: '',
            done: '',
            use: (configCb, prepareCb = '', doneCb) => {
                const config = configCb && configCb(this.configure)
                this.configure = Object.assign(this.configure, config || {})
                this.interceptors.request.prepare = prepareCb || ''
                this.interceptors.request.done = doneCb || ''
            }
        },
        response: {
            before: '',
            error: '',
            use: (configCb, errorCb = '', beforeCb = '') => {
                const config = configCb && configCb(this.configure)
                this.configure = Object.assign(this.configure, config || {})
                this.interceptors.response.error = errorCb || ''
                this.interceptors.response.before = beforeCb || ''
            }
        }
    }
    constructor(props) {
        this.configure = Object.assign(this.configure, props)
    }
    static create(configure = {}) {
        return new this(configure)
    }
    get(url, data = {}, header = '') {
        return this.request('GET', url, data, header)
    }
    post(url, data = {}, header = '') {
        return this.request('POST', url, data, header)
    }
    options(url, data = {}, header = '') {
        return this.request('OPTIONS', url, data, header)
    }
    head(url, data = {}, header = '') {
        return this.request('HEAD', url, data, header)
    }
    put(url, data = {}, header = '') {
        return this.request('PUT', url, data, header)
    }
    delete(url, data = {}, header = '') {
        return this.request('DELETE', url, data, header)
    }
    trace(url, data = {}, header = '') {
        return this.request('TRACE', url, data, header)
    }
    connect(url, data = {}, header = '') {
        return this.request('CONNECT', url, data, header)
    }
    request(method = '', url, data = {}, header = '') {
        // 请求前预处理
        if (this.interceptors.request.prepare != '') {
            this.interceptors.request.prepare(this)
        }
        const cloneConf = deepClone(this.configure.data)

        data = Object.assign(cloneConf, data)
        method = method || this.configure.method
        url = this.configure.baseURL + url
        let param = {
            url,
            method: method || this.configure.method,
            data,
            header: header || this.configure.headers,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {}
        }
        // 请求前处理
        if (this.interceptors.request.done != '') {
            param = this.interceptors.request.done.call(this, param)
        }
        return new Promise((resolve, reject) => {
            ['fail', 'success', 'complete'].forEach((k) => {
                param[k] = (res) => {
                    if (k === 'success') {
                        // 返回响应前处理
                        if (this.interceptors.response.before != '') res = this.interceptors.response.before.call(this, res)
                        resolve(res)
                    } else if (k === 'fail') {
                        // 返回响应错误前处理
                        if (this.interceptors.response.errorCb != '') res = this.interceptors.response.errorCb.call(this, res)
                        reject(res)
                    }
                }
            })

            RequestMQ.request(param)
        })
    }
}
