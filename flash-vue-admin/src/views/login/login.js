
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { getAccount, setAccount, getPwd, setPwd, removeAccount, removePwd} from '@/utils/auth'
const Base64 = require('js-base64').Base64
export default {
  name: 'login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(this.$t('login.errorAccount') ))
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
      loginForm: {
        username: '',
        password: '',
        remember:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      pwdType: 'password',
      redirect:'/'
    }
  },
  mounted(){
    this.init()
    let account = getAccount();
    if(account) {
      this.loginForm.username = account;
      this.loginForm.password = Base64.decode(getPwd());
      this.loginForm.remember = true;
    }
  },
  methods: {
    init(){
      let redirect = this.$route.query.redirect
      console.log('redirect',redirect)
      if(redirect){
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
      if(this.loginForm.remember) {
        setAccount(this.loginForm.username);
        setPwd(Base64.encode(this.loginForm.password));
      } else {
        removeAccount();
        removePwd();
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect })
          }).catch((err) => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
