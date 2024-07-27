<template>
  <div style="border: 1px solid #ccc;box-sizing: border-box;width:100%;">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch, defineEmits } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
let prop = defineProps({
  value: {
    type: String, // 参数类型
    default: 1, //默认值
  },
})

console.log(prop.value);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const mode = ref('simple')

const emits = defineEmits(['updateMsg'])

// 内容 HTML
const valueHtml = ref('')

watch(valueHtml, (newVal) => {
  emits('updateMsg', newVal)
})

watch(() => prop.value, (newVal) => {
  if (newVal == '') { valueHtml.value = '' }
})


const toolbarConfig = {
  toolbarKeys: [
    'headerSelect',
    'blockquote',
    '|',
    'bold',
    'underline',
    'italic',
    {
      key: 'group-more-style',
      title: '更多',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
      menuKeys: ['through', 'code', 'sup', 'sub']
    },
    'color',
    'bgColor',
    '|',
    'fontSize',
    {
      key: 'group-justify',
      title: '对齐',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
      menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
    },
    'todo',
    'fontFamily',
    {
      key: 'group-indent',
      title: '缩进',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
      menuKeys: ['indent', 'delIndent']
    },
    '|',
    'emotion',
    'insertLink',
    'insertTable',
    'codeBlock',
    'divider',
    'clearStyle',
    '|',
    'undo',
    'redo',
    'fullScreen'
  ]
}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

</script>   

<style scoped>
::v-deep .w-e-text-container .w-e-scroll {
  height: 300px;
}
</style>