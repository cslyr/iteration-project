<template>
  <div style="border: 1px solid #ccc;" :style="{ width: width.indexOf('%') != -1 ? width : width + 'px' }">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="overflow-y: hidden;" :style="{ height: height.indexOf('%') != -1 ? height : height + 'px' }"
      v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="valueChange" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { message } from 'ant-design-vue';
// 可传属性
const props = defineProps({
  // 编辑器模式
  mode: {
    type: String,
    default: 'default'
  },
  // 编辑器宽度
  width: {
    type: String,
    default: '100%'
  },
  // 编辑器高度
  height: {
    type: String,
    default: '300'
  },
  // 只读
  readOnly: {
    type: Boolean,
    default: false
  },
  // 自动聚焦
  autoFocus: {
    type: Boolean,
    default: true
  },
  // 编辑器内容
  content: {
    type: String,
    default: ''
  },
  // 排除哪些菜单
  excludeToolbar: {
    type: Array,
    default: []
  },
  // 单张图片的最大体积(MB)
  maxImageSize: {
    type: Number,
    default: 2
  },
  // 允许上传图片的最大数量
  maxImageCounts: {
    type: Number,
    default: 20
  },
  // placeholder内容
  placeholder: {
    type: String,
    default: '请输入内容...'
  }
});
/*
update:content:(example)
父组件使用子组件添加v-model:content='data'指令时v-model:value会被拆解为
:content= 'data';
@update:content = newValue => data = newValue

uploadImg：上传图片
getText：监听获取编辑内容的纯文本形式（txt）
 */
const emit = defineEmits(['update:content', 'uploadImg', 'getText'])
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 模式
const mode = props.mode
// 工具栏菜单
const toolbarConfig = {
  excludeKeys: props.excludeToolbar, //排除某些菜单，其他都保留
  // 默认菜单
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
    'uploadImage',
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
// 编译器配置
const editorConfig = {
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  autoFocus: props.autoFocus,
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 自定义上传
      customUpload: (file, insertFn) => {
        // console.log(file);
        // 限制图片数量
        let imageList = editorRef.value.getElemsByType('image')
        // console.log('imageList', imageList);
        if (imageList.length >= props.maxImageCounts) return message.error('允许添加图片的最大数量不能超过' + props.maxImageCounts + '张')
        // 限制图片大小
        let size = file.size / 1024 / 1024;
        if (size > props.maxImageSize) return message.error('图片最大不能超过' + props.maxImageSize + 'Mb')
        const formData = new FormData()
        formData.append('file', file)
        emit('uploadImg', formData, (imageInfo) => {
          insertFn(imageInfo.url, imageInfo.alt ?? '', imageInfo.href ?? '')
          // insertFn(url, alt, href) 图片的地址信息
        })
      }
    }
  }
}
// 内容 HTML
const valueHtml = computed({
  get () {
    return props.content
  },
  set (value) {
    emit('update:content', value)
  }
})
const valueChange = (e) => {
  emit('getText', editorRef.value.getText())
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}
</script>
<style lang="less"></style>