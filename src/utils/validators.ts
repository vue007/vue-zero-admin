/**
 * 封装 通用校验函数
 */

export const validateIP = (rule: any, value: any, cb: any) => {
  if (!value) cb()
  if (!/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/.test(value)) {
    cb(new Error('请输入正确的IP'))
  }
  cb()
}

export const validatePort = (rule: any, value: any, cb: any) => {
  if (!value) cb()
  if (!/^\d+$/.test(value)) {
    cb(new Error('请输入正确的端口'))
  }
  cb()
}

export const validateUsername = (rule: any, value: any, cb: any) => {
  if (!value) cb()
  if (value.length < 2 || value.length > 20) {
    cb(new Error('用户名称长度必须介于 2 和 20 之间'))
  }
  cb()
}

export const validatePassword = (rule: any, value: any, cb: any) => {
  if (!value) cb()
  if (value.length < 5 || value.length > 20) {
    cb(new Error('用户密码长度必须介于 5 和 20 之间'))
  }
  if (!/^[^<>"'|\\]+$/.test(value)) {
    cb(new Error('不能包含非法字符：< > " \' \\\ |'))
  }
  cb()
}

export const validatePhone = (rule: any, value: any, cb: any) => {
  if (!value) cb()
  if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
    cb(new Error('请输入正确的手机号'))
  }
  cb()
}
