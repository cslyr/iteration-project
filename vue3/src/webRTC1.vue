<template>
  <div>
    <a-card :style="{ height: `${mapHeight}px`, overflow: 'auto' }">
      <template v-slot:title>
        <strong>能力要求属性</strong>
      </template>
      <a-form-model
        @submit="submitModel"
        ref="abilityReq"
        :model="postModel"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17, offset: 1 }"
      >
        <a-form-model-item label="能力名称" prop="abilityName">
          <a-textarea autoSize v-model="postModel.abilityName" placeholder="请输入能力名称"></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="能力权重" prop="ratio">
          <a-input-number :style="{ width: '30%' }" :min="0" defaultValue="1" v-model="postModel.ratio" />
        </a-form-model-item>
        <a-form-model-item :style="{ backgroundColor: `#eeeeee` }" :label-col="{ offset: 1 }" label="关联知识点" />
        <!-- 下方显示的添加 -->
        <a-row
          :gutter="10"
          v-for="(knowledgeNode, index) in this.temForm.showList[0] ? this.temForm.showList[0].tableData : []"
        >
          <!-- 左侧框 -->
          <a-col :span="13">
            <a-form-model-item :wrapper-col="{}">
                <div class="editDiv">{{ knowledgeNode.knowledges.thirdLevelName }}</div>
            </a-form-model-item>
          </a-col>
          <!-- 调整百分比 -->
          <a-col :span="6">
            <a-form-model-item>
              <a-input-number :style="{ width: '100%' }" :min="0" :max="100" v-model="knowledgeNode.atqCount" />
            </a-form-model-item>
          </a-col>
          <!-- 百分号 -->
          <a-col :span="2">
            <div style="font-size: 17px; margin-top: 6px"><strong>%</strong></div>
          </a-col>
          <!-- 删除图标，删除当前知识点 -->
          <a-col :span="2">
            <a-icon class="delete-button" type="close-circle" @click="removeKnowledgeNode(index)" />
          </a-col>
        </a-row>
        <!-- 点击添加知识点按钮 -->
        <a-form-model-item :wrapper-col="{}">
          <a-button type="dashed" style="width: 100%" @click="addKnowledgeNode">
            <a-icon type="plus" />
            添加知识点
          </a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button :style="{ marginRight: '10px' }" type="primary" html-type="submit">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <!-- 是否显示模态框 -->
    <a-modal
      width="71%"
      :closable="false"
      :maskClosable="false"
      class="konwledgeModal"
      :visible="knowledgeVisible"
      :footer="null"
    >
      <a-spin tip="Loading..." :spinning="konwledgeSpinning">
        <div class="header">
          <div class="back" @click="back"><a-icon type="left" />返回</div>
        </div>
        <a-divider type="horizontal" style="margin-top: 0" />
        <a-row>
          <a-col :span="8">
            <div style="margin-left: 20px">
              <question-tree ref="deptTree" :knowledgePointOptions="knowledgePointOptions" @select="nodeSelect" />
            </div>
          </a-col>
          <a-divider
            type="vertical"
            style="margin-top: 0; position: absolute; right: 0; min-height: 100%; margin-right: 67.4%"
          />
          <a-col :span="16">
            <div class="examination">
              <span style="font-size: 20px">选择知识点</span>
              <a-divider
                type="horizontal"
                style="margin-top: 10px; margin-bottom: 60px; width: 100%; margin-left: -15px"
              />
              <a-form-model
                ref="konwledgeForm"
                :model="konwledgeForm"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :rules="konwledgeRules"
              >
                <a-form-model-item label="知识点占比" prop="atqCount">
                  <a-input-number id="inputNumber" v-model="konwledgeForm.atqCount" :min="1" :max="100" />
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
                  <a-button type="primary" @click="save">保存</a-button>
                </a-form-model-item>
              </a-form-model>
              <h2 v-if="!this.isEditorKnowledge" style="width: 100%; text-align: right; padding-right: 25px">
                总占比：{{ temForm.showList.length >= 1 ? temForm.showList[0].atqCount : 0 }}%
              </h2>
              <div v-if="!this.isEditorKnowledge" class="logDiv">
                <a-table
                  ref="table"
                  :columns="columns.slice(0, 4)"
                  :loading="tableLoading"
                  :bordered="true"
                  :data-source="logTableData"
                  :pagination="false"
                  tableLayout="fixed"
                  rowKey="atqId"
                >
                  <span slot="tree1" slot-scope="text, record">
                    <a-popover>
                      <template slot="content">
                        {{ record.knowledges.firstLevelName }}
                      </template>
                      {{ record.knowledges.firstLevelName }}
                    </a-popover>
                  </span>
                  <span slot="tree2" slot-scope="text, record">
                    <a-popover>
                      <template slot="content">
                        {{ record.knowledges.secondLevelName }}
                      </template>
                      {{ record.knowledges.secondLevelName }}
                    </a-popover>
                  </span>
                  <span slot="tree3" slot-scope="text, record">
                    <a-popover>
                      <template slot="content">
                        {{ record.knowledges.thirdLevelName }}
                      </template>
                      {{ record.knowledges.thirdLevelName }}
                    </a-popover>
                  </span>
                  <span slot="atqCount" slot-scope="text, record">
                    <a-popover>
                      <template slot="content"> {{ record.atqCount }}% </template>
                      {{ record.atqCount }}%
                    </a-popover>
                  </span>
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getAllKnowMapList } from '@/api/sopmap/knowledgemap'
import { selectKnowledges } from '@/api/soptemplate/authenticationtemplate'
import QuestionTree from '../../../soptemplatemanager/authenticationtemplate/modules/QuestionTree.vue'
export default {
  name: 'Post3',
  components: { QuestionTree },
  props: {
    mapHeight: {
      type: Number,
      default: 400,
    },
    postModel: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        description: '',
        AbilityRatio: '',
        DisplayOrder: '',
        depth: '',
        type: '',
      }),
    },
  },
  data() {
    const columns = [
      {
        title: '一级知识点',
        dataIndex: 'tree1',
        scopedSlots: { customRender: 'tree1' },
      },
      {
        title: '二级知识点',
        dataIndex: 'tree2',
        ellipsis: true,
        scopedSlots: { customRender: 'tree2' },
      },

      {
        title: '三级知识点', //标题
        dataIndex: 'tree3', //列对应的数据字段
        align: 'center', //列的对齐方式
        scopedSlots: { customRender: 'tree3' }, //自定义渲染的插槽
      },
      {
        title: '知识点占比',
        dataIndex: 'dictLabel',
        align: 'center',
        scopedSlots: { customRender: 'atqCount' }, //自定义渲染的插槽
      },
    ]
    const validateAbilityName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写完整能力名称！！'))
      } else if (value) {
        let parentNode = {}
        this.$emit('parentNode', this.postModel, (val) => {
          parentNode = val
        })
        // console.log('传递走的值！！！！！！', this.postModel)
        parentNode.children.forEach((item) => {
          if (item.id !== this.postModel.id) {
            if (item.abilityName === value) {
              callback(new Error('能力名称不能相同！！'))
            }
          }
        })
        callback()
      } else callback()
    }
    //左侧框当中自定义验证规则
    const validateKnowledgeNodeName = (rule, value, callback) => {
      // const index = rule.field.split('.')[1]
      // if (this.postModel.sopPostMapKnowledgeList[index].knowledgemapId) {
      //   callback()
      // } else {
      //   callback(new Error('请选择知识点'))
      // }
    }
    //百分比自定义验证规则
    const validateKnowledgeNodeRatio = (rule, value) => {
      // const index = rule.field.split('.')[1]
      // let count = 0
      // this.postModel.sopPostMapKnowledgeList.forEach((item) => {
      //   count = count + Number(item.proportion)
      // })
      // if (count <= 100 && this.postModel.sopPostMapKnowledgeList[index].proportion) {
      //   return Promise.resolve()
      // } else if (!this.postModel.sopPostMapKnowledgeList[index].proportion) {
      //   return Promise.reject('占比不能为空')
      // } else {
      //   return Promise.reject('占比总和不能超过100%')
      // }
    }
    const validateRatio = (rules, value) => {
      let a = false
      this.$emit('valFun', this.postModel, (val) => {
        a = val
      })
      if (a && this.postModel.ratio) {
        return Promise.resolve()
      } else if (!this.postModel.ratio) {
        return Promise.reject('占比不能为空!')
      } else {
        return Promise.reject('同级能力占比不能高于100%！！')
      }
    }
    return {
      parentInitValue: {},
      parentInitTableData: {},
      validateAbilityName,
      validateRatio,
      validateKnowledgeNodeRatio,
      validateKnowledgeNodeName,
      knowledgeVisible: false,
      konwledgeSpinning: false, //是否显示加载状态
      tableLoading: false, //model当中的table是否处于加载状态
      rules: {
        // abilityName: [{required: true, validator: validateAbilityName, trigger: 'change'}],
        // ratio: [{required: true, validator: validateRatio, trigger: 'change'}],
      },
      //左侧树形控件当中的数据
      // replaceFields: {
      //   children: 'sopKnowledgeMapList',
      //   title: 'knowledgemapName',
      //   value: 'knowledgemapId',
      // },
      knowledgePointOptions: [],
      knowledgeMapList: [],
      // 弹框当中表单的数据
      konwledgeForm: {
        atq_knowledge_id: '',
        atqCount: '',
      },
      //验证规则   在失去焦点的时候进行表单的验证
      konwledgeRules: {
        atqCount: [{ required: true, message: '请输入题目数量', trigger: 'blur' }],
      },
      //表单当中的栅格布局方式
      labelCol: { span: 8 }, //表单项标签的布局样式
      wrapperCol: { span: 14 }, //表单项内容的布局样式
      // 是否编辑知识点
      isEditorKnowledge: false,
      // 当前操作的类型
      currentQuestionType: '',
      temTemForm: {
        authTemplateId: undefined,
        authTemplateType: '',
        authTemplatePostId: undefined,
        authTemplateSopCourse: [],
        abilityGoal: '',
        icon: '',
        chanceNum: 2,
        authTemplateName: '',
        minimumPassScore: '',
        authTemplateDuration: '',
        optionsOrder: 1,
        showList: [],
        categoryLabel: [],
      },
      // 模板表单
      temForm: {
        authTemplateId: undefined,
        authTemplateType: '',
        authTemplatePostId: undefined,
        authTemplateSopCourse: [],
        abilityGoal: '',
        icon: '',
        chanceNum: 2,
        authTemplateName: '',
        minimumPassScore: '',
        authTemplateDuration: '',
        optionsOrder: 1,
        showList: [],
        categoryLabel: [],
      },
      //表格列
      columns,
    }
  },
  methods: {
    //test
    
    back() {
      // 重置知识表单的所有字段
      // this.$refs.konwledgeForm.resetFields()
      // 关闭知识模态框
      this.knowledgeVisible = false
      // 隐藏标题
      // this.showTitle = false
      // 设置为非编辑知识状态   根据这个判断是编辑还是添加
      this.isEditorKnowledge = false
      // 清除编辑知识的ID
      // this.editKonwledgeId = undefined
      // 关闭部门树的展开状态
      // this.$refs.deptTree.closeExpand()
      // 重置知识表单的所有字段
      // this.konwledgeForm = {
      //   dictLabel: undefined,
      //   atq_knowledge_id: '',
      //   dictLabel: '',
      //   atqCount: '',
      //   atqScore: '',
      // }
    },
    // 当点击树状结构的时候 树结构选择
    async nodeSelect(id) {
      this.found = false //判断其中是否有符合的内容
      // console.log('树状结构', this.temForm.showList[0])
      if (this.temForm.showList[0]) {
        this.temForm.showList[0].tableData.forEach((item) => {
          if (item.atqKnowledgeId == id) {
            this.found = true
            this.konwledgeForm.atqCount = item.atqCount
          }
        })
      }
      // this.showTitle = true   //显示标题。
      // await this.getQuestionInfo(id) //获取问题信息。
      this.konwledgeForm.atq_knowledge_id = id
      if (!this.found) {
        this.konwledgeForm.atqCount = ''
      }
    },
    // 获取题目
    // async getQuestionInfo(id) {//其中的id是原来文件当中添加的题目类型
    //   let count = await selectAuthenticationQuestionCount(id, this.currentQuestionType)
    //   if (count.code == 200) {
    //     this.DifficultyTypeDiscts.forEach((item, index) => {
    //       for (const key in count.data) {
    //         if (key == item.dictValue) {
    //           this.$set(this.DifficultyTypeDiscts[index], 'count', count.data[key])
    //         }
    //       }
    //     })
    //   }
    // },

    // 知识点保存
    async save() {
      // console.log('执行save当中的代码')
      // console.log('刚点击save的时候', this.temForm.showList)
      // this.knowledgeVisible = false
      this.$refs.konwledgeForm.validate(async (valid) => {
        //填写符合验证要求之后valid变为true否则为false
        let { atq_knowledge_id, atqCount } = this.konwledgeForm
        let { showList } = this.temForm
        if (atq_knowledge_id == '') return this.$message.error('请选择考核知识点')
        if (atqCount == 0) return this.$message.error('知识点占比不能为0')
        if (valid) {
          //当点点击添加知识点并且验证通过的时候
          if (this.temForm.showList.length == 0) {
            this.temForm.showList.push({
              atqCount: 0,
              tableData: [],
            })
          }
          //对中间值obj进行赋值操作
          let obj = {
            knowledges: { firstLevelName: '', secondLevelName: '', thirdLevelName: '' },
            atqCount,
            atqKnowledgeId: atq_knowledge_id,
            atqId: Math.random(),
          }
          let res = await selectKnowledges(atq_knowledge_id) //获得选择考核项的三级名称
          if (res.code == 200) {
            obj.knowledges.firstLevelName = res.data.firstLevelName
            obj.knowledges.secondLevelName = res.data.secondLevelName
            obj.knowledges.thirdLevelName = res.data.thirdLevelName
          } else {
            return this.$message.error(res.msg)
          }
          // console.log("obj",obj)
          //检查是否有重复的内容
          this.found = false
          //是否改变知识点比例
          this.change = false
          //改变之后的差值
          this.changeValue = 0
          //点击完保存之后，判断数组当中该知识点是否已经被选中
          this.temForm.showList[0].tableData.forEach((item) => {
            if (item.atqKnowledgeId == obj.atqKnowledgeId) {
              if (item.atqCount == obj.atqCount) {
                this.found = true
                this.$message.warning('请不要添加重复的知识点')
              } else {
                this.$message.success('修改知识点占比成功')
                this.change = true
                this.changeValue = parseInt(obj.atqCount - item.atqCount)
                item.atqCount = obj.atqCount
              }
            }
          })
          if (!this.found) {
            if (this.change) {
              this.temForm.showList[0].atqCount += this.changeValue
            } else {
              this.$message.success('添加成功')
              // console.log('在save当中添加成功，向 this.temForm.showList[0].tableData加入值输出')
              this.temForm.showList[0].tableData.push(obj)
              this.temForm.showList[0].atqCount += this.temForm.showList[0].tableData.slice(-1)[0].atqCount
            }
          }

          //将输入的内容添加进去

          // console.log(this.temForm.showList[0], '单击save按钮之后输出全部都内容')
          // console.log(this.temForm.showList.length, '点击save按钮之后的长度')
          // this.temForm.showList.forEach((item, index) => {
          //   if (item.atqQuestionType == this.currentQuestionType) {
          //     // console.log(this.DifficultyTypeDiscts);
          //     this.DifficultyTypeDiscts.forEach((diff, d) => {
          //       // console.log("difff", diff);
          //       if (diff.dictValue == dictLabel) {
          //         obj.dictLabel = diff.dictLabel
          //       }
          //     })
          //     this.temForm.showList[index].tableData.push(obj)
          //   }
          // })
          // this.temForm.showList.forEach((item, i) => {
          //   item.tableData.forEach((item2, i2) => {
          //     this.temForm.showList[i].tableData[i2].atqOrder = i + 1
          //   })
          // })
          // this.formatScore()
          // this.konwledgeForm = {
          //   atq_knowledge_id,
          //   dictLabel: '',
          //   atqCount: '',
          //   atqScore,
          // }
        } else {
          return false
        }
      })
    },
    //test end
    //当提交表单的时候
    submitModel(e) {
      e.preventDefault()
      // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr",e)
      console.log('提交时候的table', this.temForm.showList)
      console.log('提交时候的parentInitTableData', this.parentInitTableData)
      this.count = 0
      this.parentInitTableData.sopPostMapKnowledgeList.forEach((item) => {
        this.count += Number(item.proportion)
      })
      if (this.count !== 100) {
        this.$message.error('知识点占比总和需等于100~')
      } else {
        this.$emit('changeNode', this.parentInitTableData)
      }
      // console.log(this.count)
      // console.log(this.postModel.sopPostMapKnowledgeList, 'this.postModel.sopPostMapKnowledgeList')
      // this.$refs.abilityReq.validate((val) => {
      //   if (val) {
      //     let count = 0
      //     this.postModel.sopPostMapKnowledgeList.forEach((item) => {
      //       count += Number(item.proportion)
      //     })
      //     } else {
      //       this.$message.error('知识点占比总和需等于100~')
      //     }
      //   } else {
      //     this.$message.error('请完善关联知识点信息~')
      //   }
      // })
      // return null
    },
    //当删除表单的时候
    removeKnowledgeNode(index) {
      console.log("index", index)
      if (index !== -1) {
        this.parentInitTableData.sopPostMapKnowledgeList.splice(index, 1)
        this.temForm.showList[0].tableData.splice(index, 1)
      }
      // console.log("")
    },
    async addKnowledgeNode() {
      // console.log(this.temForm.showList[0].tableData.length, 'this.temForm.showList[0].tableData长度是多少')
      // console.log(this.temForm.showList[0].tableData, 'this.temForm.showList[0].tableData输出具体值')
      //模态框部分
      this.isEditorKnowledge = false //是否显示右下角的知识点数量    总占比
      this.knowledgeVisible = true //显示模态框
      this.konwledgeSpinning = true //是否显示加载状态
      let konwledgeTree = null
      await getAllKnowMapList().then((res) => {
        const List = res.data
        List.forEach((item) => {
          item = this.createTree(item)
        })
        konwledgeTree = List
      }) //根据题目类型获取题目知识点树的数据，并将结果赋值给 konwledgeTree。
      this.knowledgePointOptions = konwledgeTree //在模态框中显示知识点选项。
      this.konwledgeSpinning = false
    },
    //递归构建知识图谱树
    createTree(tree) {
      if (tree.sopKnowledgeMapList != null && tree.sopKnowledgeMapList.length > 0) {
        tree.selectable = false
        for (const element of tree.sopKnowledgeMapList) {
          this.createTree(element)
        }
      }
      return tree
    },
  },
  async created() {
    //在数据初始化之后先将数组当中的内容进行清空
    const res = await getAllKnowMapList()
    const List = res.data
    // console.log(List, 'List')
    List.forEach((item) => {
      item = this.createTree(item)
    })
    this.knowledgeMapList = List


    console.log("created")
    this.temForm=this.temTemForm
    console.log("create当中的数据",this.temForm);
    // if (this.postModel.sopPostMapKnowledgeList.length > 0) {
    //   //父组件传递数据过来，并不是空值
    //   // parentInitValue
    //   this.postModel.sopPostMapKnowledgeList.forEach((item) => {
    //     this.parentInitValue.push(item.knowledgemapId)
    //   })
    //   console.log('执行页面初始化的created操作')
    //   console.log(this.parentInitValue, '拿到父组件传递过来的所有值的id')
    // }
    //调用接口获取到所有的id对应的三级名称
    // console.log(this.postModel, '父组件传递过来没有经过任何处理的postModel')
  },
  computed: {
    //表格当中的数据源发生变化的时候会马上进行计算
    logTableData() {
      // console.log('执行computed当中的代码')
      // console.log('computed当中的代码', this.temForm.showList)
      let dataRes = []
      let sum = 0
      if (this.temForm.showList[0]) {
        let seen = {}
        this.temForm.showList[0].tableData = this.temForm.showList[0].tableData.reduceRight((acc, cur) => {
          if (!seen[cur.atqKnowledgeId]) {
            seen[cur.atqKnowledgeId] = true
            acc.unshift(cur)
          }
          return acc
        }, [])
        this.temForm.showList[0].tableData.forEach((item) => {
          sum += Number(item.atqCount)
        })
        this.temForm.showList[0].atqCount = sum
        console.log('进行去重之后的table', this.temForm.showList[0])
        for (var i = this.temForm.showList[0].tableData.length - 1; i >= 0; i--) {
          dataRes.push(this.temForm.showList[0].tableData[i])
        }
        // console.log('dataRes', dataRes)
        return dataRes
      }
    },
  },
  async mounted() {
    // let sum = 0
    // // console.log('执行页面刚挂载时候的操作')
    // if (this.parentInitValue.sopPostMapKnowledgeList.length > 0) {
    //   if (this.temForm.showList.length == 0) {
    //     this.temForm.showList.push({
    //       atqCount: 0,
    //       tableData: [],
    //     })
    //   }
    let arr = []
    //   for (const item of this.parentInitValue.sopPostMapKnowledgeList) {
    //     try {
    //       //如果是父组件传过来的东西2，就将父组件当中的东西格式改变成为和最后提交的一样
    //       if (!item.knowledgemapName) {
    //         const res = await selectKnowledges(item.knowledgemapId)
    //         this.$set(item, 'knowledgemapName', res.data.thirdLevelName)
    //         sum += Number(item.proportion)
    //         let obj = {
    //           knowledges: { firstLevelName: '', secondLevelName: '', thirdLevelName: '' },
    //           atqCount: item.proportion,
    //           atqKnowledgeId: item.knowledgemapId,
    //           atqId: Math.random(),
    //         }
    //         obj.knowledges.firstLevelName = res.data.firstLevelName
    //         obj.knowledges.secondLevelName = res.data.secondLevelName
    //         obj.knowledges.thirdLevelName = res.data.thirdLevelName
    //         // this.parentInitValue=obj
    arr.push(obj)
    //         this.temForm.showList[0].tableData.push(obj)
    //         this.temForm.showList[0].atqCount = sum
    //       }
    this.temForm.showList[0].tableData=arr
    //     } catch (err) {
    //       console.log(err)
    //     }
    //   }
    // }
  },
  watch: {
    postModel: {
      immediate: true,
      deep: true,
      async handler() {
        // console.log('watch执行')
        // console.log('watch当中的this.temForm.showList', this.temForm.showList)
        console.log('postModel changed:', this.postModel)
        let sum = 0
        // if (this.temForm.showList.length > 0) {
        // }
        this.temForm.showList = []

        //如果父组件传递过来东西    如果没传过来就不会执行下面的操作
        if (this.postModel.abilityId) {
          this.parentInitValue = JSON.parse(JSON.stringify(this.postModel))
          this.parentInitTableData = JSON.parse(JSON.stringify(this.postModel))
          //     if (this.postModel.sopPostMapKnowledgeList.length > 0) {
          //       if (this.temForm.showList.length == 0) {
          //         this.temForm.showList.push({
          //           atqCount: 0,
          //           tableData: [],
          //         })
          //       }
          // for (const item of this.postModel.sopPostMapKnowledgeList) {
          //   try {
          //     //如果是父组件传过来的东西2，就将父组件当中的东西格式改变成为和最后提交的一样
          //     if (!item.knowledgemapName) {

          //       const res = await selectKnowledges(item.knowledgemapId)
          //       console.log('上方的res', res)
          //       // if ('knowledgemapName' in item){}
          //       this.$set(item, 'knowledgemapName', res.data.thirdLevelName)
          //       sum += Number(item.proportion)
          //       let obj = {
          //         knowledges: { firstLevelName: '', secondLevelName: '', thirdLevelName: '' },
          //         atqCount: item.proportion,
          //         atqKnowledgeId: item.knowledgemapId,
          //         atqId: Math.random(),
          //       }
          //       obj.knowledges.firstLevelName = res.data.firstLevelName
          //       obj.knowledges.secondLevelName = res.data.secondLevelName
          //       obj.knowledges.thirdLevelName = res.data.thirdLevelName
          //       // this.parentInitValue=obj
          //       this.temForm.showList[0].tableData.push(obj)
          //       this.temForm.showList[0].atqCount = sum
          //     }
          //   } catch (err) {
          //     console.log(err)
          //   }
          // }
          //     }
        }

        // console.log(this.temForm.showList[0].tableData, 'watch之后输出的内容this.temForm.showList[0].tableData')
        // console.log(this.temForm.showList[0].tableData.length, '长度')

        // console.log(this.postModel.sopPostMapKnowledgeList, 'this.postModel.sopPostMapKnowledgeList')
      },
    },
    parentInitValue: {
      immediate: true,
      deep: true,
      async handler() {
        let sum = 0

        console.log('监视parentInitValue当中的代码执行', this.parentInitValue)
        // if (this.parentInitValue.abilityId) {
        if (this.parentInitValue.sopPostMapKnowledgeList.length > 0) {
          // console.log('执行到长度', this.parentInitValue.sopPostMapKnowledgeList.length)
          if (this.temTemForm.showList.length == 0) {
            // console.log('判断有没有内容this.temTemForm.showList.length', this.temTemForm.showList.length)
            this.temTemForm.showList.push({
              atqCount: 0,
              tableData: [],
            })
          }
          for (const item of this.parentInitValue.sopPostMapKnowledgeList) {
            // ;(async (item) => {
            // console.log('111')
            try {
              //如果是父组件传过来的东西2，就将父组件当中的东西格式改变成为和最后提交的一样
              if (!item.knowledgeMap) {
                // console.log('上方的   item', item)
                const res = await selectKnowledges(item.knowledgemapId)
                // console.log('上方的res', res)
                // if ('knowledgemapName' in item){}
                // this.$set(item, 'knowledgemapName', res.data.thirdLevelName)
                sum += Number(item.proportion)
                let obj = {
                  knowledges: { firstLevelName: '', secondLevelName: '', thirdLevelName: '' },
                  atqCount: item.proportion,
                  atqKnowledgeId: item.knowledgemapId,
                  atqId: Math.random(),
                }
                obj.knowledges.firstLevelName = res.data.firstLevelName
                obj.knowledges.secondLevelName = res.data.secondLevelName
                obj.knowledges.thirdLevelName = res.data.thirdLevelName
                // this.parentInitValue=obj
                this.temTemForm.showList[0].tableData.push(obj)
                this.temTemForm.showList[0].atqCount = sum
                // console.log('this.parentInitValue当中最后处理的值的变化', this.temTemForm.showList[0].tableData)
              } else {
                // console.log('下方 的', item)
                const res = await selectKnowledges(item.knowledgeMap.knowledgemapId)
                // console.log('上方的res', res)
                // // if ('knowledgemapName' in item){}
                // this.$set(item, 'knowledgemapName', res.data.thirdLevelName)
                sum += Number(item.proportion)
                let obj = {
                  knowledges: { firstLevelName: '', secondLevelName: '', thirdLevelName: '' },
                  atqCount: item.proportion,
                  atqKnowledgeId: item.knowledgeMap.knowledgemapId,
                  atqId: Math.random(),
                }
                obj.knowledges.firstLevelName = res.data.firstLevelName
                obj.knowledges.secondLevelName = res.data.secondLevelName
                obj.knowledges.thirdLevelName = res.data.thirdLevelName
                // // this.parentInitValue=obj
                this.temTemForm.showList[0].tableData.push(obj)
                this.temTemForm.showList[0].atqCount = sum
                console.log('this.parentInitValue当中最后处理的值的变化', this.temTemForm.showList[0].tableData)
              }
            } catch (err) {
              console.log(err)
            }
            // })(item)
          }
        }
        // }
      },
    },
    temForm: {
      // immediate:true,
      deep: true,
      handler() {
        // console.log(this.parentInitTableData, '首先输出一次长什么样子')
        // console.log('输出这个时候的table是什么样子的', this.temForm.showList)
        if (this.temForm.showList.length > 0) {
          //如果this.postModel.sopPostMapKnowledgeList是空的话需要向其中添加内容
          if (!this.parentInitTableData.sopPostMapKnowledgeList) {
            // console.log('如果this.postModel.sopPostMapKnowledgeList是空的话需要向其中添加内容')
            this.parentInitTableData.sopPostMapKnowledgeList = []
          }
          //如果是首次的时候，改变格式
          this.parentInitTableData.sopPostMapKnowledgeList.forEach((item) => {
            console.log('准备赋值的item', item)
            if (item.knowledgeMap == null) {
              item.knowledgeMap = {
                knowledgemapId: item.knowledgemapId,
                knowledgemapName: item.knowledgemapName,
              }
              item.key = Date.now()
            }
          })

          // console.log('改变之后', this.postModel.sopPostMapKnowledgeList)
          //如果在表格当中创建的有数据
          // if (this.temForm.showList[0]) {
          //  如果当中有数据的话
          // if (this.parentInitTableData.sopPostMapKnowledgeList.length > 0) {
          //  如果并不是第一次赋予数据
          this.temForm.showList[0].tableData.forEach((tableItem) => {
            this.found = false // 添加一个标志变量
            //比较其中是否有重复的数据或者编辑的数据
            this.parentInitTableData.sopPostMapKnowledgeList.forEach((sopItem) => {
              if (!sopItem.knowledgeMap) {
                //如果是undefined
                this.parentInitTableData.sopPostMapKnowledgeList.push({
                  knowledgeMap: {
                    knowledgemapId: item.atqKnowledgeId,
                    knowledgemapName: item.knowledges.thirdLevelName,
                  },
                  proportion: item.atqCount,
                  key: Date.now(),
                  // knowledgemapName: item.knowledges.thirdLevelName,
                })
              } else {
                if (sopItem.knowledgeMap.knowledgemapId == tableItem.atqKnowledgeId) {
                  //如果id相等的话
                  this.found = true
                  //如果id相等，并且值也相等
                  if (sopItem.proportion == tableItem.atqCount) {
                    //如果值也相等就是重复添加
                  } else {
                    //值不相等，编辑改变比例了
                    sopItem.proportion = tableItem.atqCount
                  }
                }
              }
            })
            if (!this.found) {
              // console.log('发现id都不相等的情况')
              //如果id不相等也就是新增加的情况下
              this.temForm.showList[0].tableData.forEach((item, index) => {
                this.parentInitTableData.sopPostMapKnowledgeList.push({
                  knowledgeMap: {
                    knowledgemapId: item.atqKnowledgeId,
                    knowledgemapName: item.knowledges.thirdLevelName,
                  },
                  proportion: item.atqCount,
                  key: Date.now(),
                  // knowledgemapName: item.knowledges.thirdLevelName,
                })
              })
              // this.$emit('changeNode', this.parentInitTableData)
              // console.log('要传递给父组件当中的数据', this.parentInitTableData)
            }
          })
          // } else {
          //   this.temForm.showList[0].tableData.forEach((item, index) => {
          //     this.parentInitTableData.sopPostMapKnowledgeList.push({
          //       knowledgeMap: {
          //         knowledgemapId: item.atqKnowledgeId,
          //         knowledgemapName: item.knowledges.thirdLevelName,
          //       },
          //       proportion: item.atqCount,
          //       key: Date.now(),
          //       // knowledgemapName: item.knowledges.thirdLevelName,
          //     })
          //   })
          //   // this.$emit('changeNode', this.parentInitTableData)
          //   // console.log(this.postModel.sopPostMapKnowledgeList, '父祖件没有传自己新增的')
          // }
          // }
          // console.log(this.postModel.sopPostMapKnowledgeList, 'handleOk当中的值')
          // this.knowledgeVisible = false //关闭模态框

          // console.log(this.postModel.sopPostMapKnowledgeList, '更新之前的值this.postModel.sopPostMapKnowledgeList')
          //从右向左遍历数组，遇到重复的值之后保留后面的值
          let seen = {}
          this.parentInitTableData.sopPostMapKnowledgeList =
            this.parentInitTableData.sopPostMapKnowledgeList.reduceRight((acc, cur) => {
              if (!seen[cur.knowledgeMap.knowledgemapId]) {
                seen[cur.knowledgeMap.knowledgemapId] = true
                acc.unshift(cur)
              }
              return acc
            }, [])
          console.log(this.parentInitTableData.sopPostMapKnowledgeList, '打算传递给父组件的数据')
          this.parentInitTableData.sopPostMapKnowledgeList.forEach(item=>{
            item.knowledgemapId=item.knowledgeMap.knowledgemapId
          })
        }
      },
    },
  },
}
</script>

<style scoped lang="less">
.editDiv {
  border: 1px solid #d9d9d9;
  width: 100%;
  height: 32px;
  border-radius: 6px;
  margin-top: 4px;
  text-align: center;
  line-height: 32px;
}
.delete-button {
  cursor: pointer;
  position: relative;
  top: 10px;
  font-size: 20px;
  color: #595959;
  transition: all 0.3s;
}

.delete-button:hover {
  color: #999;
}

.delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
//模态框
.konwledgeModal {
  .logDiv {
    margin-right: 20px;
    max-height: 300px;
    overflow: scroll;
    overflow-x: hidden;
  }

  ::v-deep .ant-modal-header {
    display: none;
  }

  .header {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 15px;
    background: white;

    .back {
      cursor: pointer;
      width: 50px;
      color: rgba(24, 144, 255);
      font-size: 16px;
    }
  }

  .examination {
    box-sizing: border-box;
    padding-left: 15px;
  }
}
</style>