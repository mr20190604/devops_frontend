import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { getAccount, setAccount, getPwd, setPwd, removeAccount, removePwd } from '@/utils/auth'
import router from '../../router'
import countTo from 'vue-count-to';
const Base64 = require('js-base64').Base64
export default {
  name: 'login',
  components: { LangSelect ,countTo },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(this.$t('login.errorAccount')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error(this.$t('login.errorPassword')))
      } else {
        callback()
      }
    }
    return {
      decimals:3,
      startVal:0,
      endVal:113.719,
      loginForm: {
        username: '',
        password: '',
        remember: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      pwdType: 'password',
    }
  },
  mounted() {
    this.init()
    const account = getAccount()
    if (account) {
      this.loginForm.username = account
      this.loginForm.password = Base64.decode(getPwd())
      this.loginForm.remember = true
    }
  },
  methods: {
    init() {
      const redirect = this.$route.query.redirect
      if (redirect) {
        this.redirect = redirect
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      if (this.loginForm.remember) {
        setAccount(this.loginForm.username)
        setPwd(Base64.encode(this.loginForm.password))
      } else {
        removeAccount()
        removePwd()
      }
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            await this.$store.dispatch('user/login', this.loginForm)
            await this.$store.dispatch('user/getInfo')
            const accessRoutes = await this.$store.dispatch('menu/getSideMenus')
            router.addRoutes(accessRoutes)
            this.loading = false
            const childSysList = this.$store.state.user.childSys
            if (childSysList.length === 0) {
              this.$message({
                message: '暂未分配子系统,请联系管理员',
                type: 'warning'
              })
            } else if (childSysList.length === 1) {
              this.$router.push({ path: childSysList[0].mmChildSysModel.sysUrl })
            } else {
              this.$router.push({ path: '/platform' })
            }
          } catch (e) {
            this.loading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
