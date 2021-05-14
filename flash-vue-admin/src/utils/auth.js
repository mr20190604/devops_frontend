import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const AccountKey = 'vue_admin_account'

const PwdKey = 'vue_admin_pwd'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAccount() {
  return Cookies.get(AccountKey)
}

export function setAccount(account) {
  return Cookies.set(AccountKey, account)
}

export function removeAccount() {
  return Cookies.remove(AccountKey)
}

export function getPwd() {
  return Cookies.get(PwdKey)
}

export function setPwd(pwd) {
  return Cookies.set(PwdKey, pwd)
}

export function removePwd() {
  return Cookies.remove(PwdKey)
}

