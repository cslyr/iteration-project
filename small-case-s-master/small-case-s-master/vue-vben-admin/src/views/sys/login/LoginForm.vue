<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef" v-show="getShow"
    @keypress.enter="handleLogin">
    <FormItem name="username" class="enter-x">
      <Input size="large" v-model:value="formData.username" placeholder="账号"
        class="fix-auto-fill" />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword size="large" visibilityToggle v-model:value="formData.password"
        placeholder="密码" />
    </FormItem>
    <a-col class="gutter-row" :span="16">
      <FormItem name="code">
        <div style="display: flex;">
          <a-input v-model:value="formData.code" size="small" type="text"></a-input>
          <img @click="usernamePasswordGetCodeImg" :src="captchaImg" class="getCaptcha" />
        </div>
      </FormItem>
    </a-col>
    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        登录
      </Button>
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="12"></ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            忘记密码
          </Button>
        </FormItem>
      </ACol>
    </ARow>
  </Form>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue'
import { Form, Input, Row, Col, Button } from 'ant-design-vue'
import LoginFormTitle from './LoginFormTitle.vue'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { useUserStore } from '/@/store/modules/user'
import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin'
import { useDesign } from '/@/hooks/web/useDesign'
import { getCodeImg } from '/@/api/sys/user'

const ACol = Col
const ARow = Row
const FormItem = Form.Item
const InputPassword = Input.Password
const { t } = useI18n()
const { notification, createErrorModal } = useMessage()
const { prefixCls } = useDesign('login')
const userStore = useUserStore()

const { setLoginState, getLoginState } = useLoginState()
const { getFormRules } = useFormRules()

const formRef = ref()
const loading = ref(false)

const uuid = ref('')
// 登录参数
const formData = reactive({
  username: 'jhmu',
  password: '123456',
  code: ''
})
const captchaImg = ref('')
const usernamePasswordGetCodeImg = () => {
  getCodeImg().then(res => {
    console.log(res);
    uuid.value = res.uuid
    captchaImg.value = 'data:image/gif;base64,' + res.img
  })
}
usernamePasswordGetCodeImg()

const { validForm } = useFormValid(formRef)

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

async function handleLogin() {
  const data = await validForm()
  if (!data) return
  try {
    loading.value = true
    const userInfo = await userStore.login({
      password: data.password,
      username: data.username,
      code: data.code,
      uuid: uuid.value,
      mode: 'none', //不要默认的错误提示
    })
    if (userInfo) {
      console.log('userInfo', userInfo);
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
        duration: 3,
      })
    }
  } catch (error) {
    console.log('error', error);
    createErrorModal({
      title: '错误提示',
      content: error as any || t('sys.api.networkExceptionMsg'),
      getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      okText: '确定',
      cancelText: '取消',
    })
    usernamePasswordGetCodeImg()
  } finally {
    loading.value = false
  }
}
</script>
