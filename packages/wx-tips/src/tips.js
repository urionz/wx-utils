export default class {
    static instance

    configure = {
        isLoding: false,
        pause: false,
        duration: 1000,
        errorIconPath: '',
        successIconPath: 'success',
        alertIconPath: '',
        loadingMode: 'NavigationBarLoading'
    }

    constructor(props) {
        this.configure = Object.assign(this.configure, props)
    }

    static getInstance(config = {}) {
        if (this.instance instanceof this === false) {
            this.instance = new this(config)
        }
        return this.instance
    }

    success(title, duration = '') {
        title = title || '操作成功'
        duration = duration || this.configure.duration
        wx.showLoading({
            title,
            icon: this.configure.successIconPath,
            mask: true,
            duration
        })
        if (duration > 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, duration)
            })
        }
    }

    modal(content = '', title = '') {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title,
                content,
                showCancel: false,
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }

    confirm(content, payload = {}, title) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title,
                content,
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload)
                    } else if (res.cancel) {
                        reject(payload)
                    }
                },
                fail: () => {
                    reject(payload)
                }
            })
        })
    }

    toast(title, hideCallback, icon = 'success', duration = '') {
        duration = duration || this.configure.duration
        wx.showToast({
            title,
            icon,
            mask: true,
            duration
        })

        if (hideCallback) {
            setTimeout(() => {
                hideCallback()
            }, duration)
        }
    }

    loading(title = '加载中...', force = false) {
        if (this.configure.isLoading && !force) {
            return
        }
        this.configure.isLoading = true
        if (wx.showLoading) {
            wx[`show${this.configure.loadingMode}`]()
        }
    }

    loaded() {
        if (this.configure.isLoading) {
            this.configure.isLoading = false
            if (wx.hideLoading) {
                wx[`hide${this.configure.loadingMode}`]()
            }
        }
    }

    alert(title, duraion = '') {
        duraion = duraion || this.configure.duraion
        wx.showToast({
            title,
            image: this.configure.alertIconPath,
            mask: true,
            duration
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, duraion)
        })
    }

    error(title, hideCallback, duration = '') {
        duration = duration || this.configure.duration
        wx.showToast({
            title,
            image: this.configure.errorIconPath,
            mask: true,
            duration
        })

        if (hideCallback) {
            setTimeout(() => {
                hideCallback()
            }, duraion)
        }
    }

    setLoading() {
        this.configure.isLoading = true
    }
}