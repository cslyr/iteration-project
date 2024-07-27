<template>
  <div class="main">
    <div class="leftModule">
      <div class="moduleSelect">
        <a-card class="card" :border="false">
          <h3 style="font-weight: 600;">模块选择</h3>
          <li class="moduleItem" v-for="item in moduleList" :key="item.id">
            <div class="moduleName">
              <a-tooltip placement="top" v-if="!state.isShowModuleSelectName">
                <template #title>
                  <span>{{ item.moduleName }}</span>
                </template>
                <!-- <img src="/public/person.png" style="cur"> -->
              </a-tooltip>
              <!-- <img src="/public/person.png" v-else> -->
              <span v-if="state.isShowModuleSelectName">
                {{ item.moduleName }}
              </span>
            </div>
            <div class="moduleSwitch"><a-switch v-model:checked="item.switch" size="small" /></div>
          </li>
          <a-button @click="addModule" type="primary" class="addModule">
            <PlusOutlined />添加模块
          </a-button>
        </a-card>
      </div>
      <a-card class="edit" :border="false">
        <!-- 模块折叠面板 -->
        <div v-for="(item, index) in  moduleList.filter(row => row.switch) " :key="item.id">
          <!-- 折叠面板行 -->
          <div class="moduleItem" @click="collapseItemClick(item)">
            <div class="left">
              <DownOutlined v-if="isExpand(item.id)" />
              <RightOutlined v-else />
              <div class="moduleName">
                <a-input v-model:value="item.moduleName" class="moduleNameIpt" @click.stop
                  v-if="item.id == state.editModuleId" @blur="state.editModuleId = ''" />
                <span v-else>{{ item.moduleName }}</span>
              </div>
            </div>
            <div class="right">
              <EditOutlined class="actionIcon" v-if="item.id != state.editModuleId"
                @click.stop="state.editModuleId = item.id" />
              <div></div>
              <div class="action" v-if="!isExpand(item.id)">
                <ArrowUpOutlined class="actionIcon" @click.stop="moveModule(item, 'up')" v-if="index != 0" />
                <ArrowDownOutlined class="actionIcon" @click.stop="moveModule(item, 'down')"
                  v-if="index != moduleList.filter(row => row.switch).length - 1" />
                <!-- <a-popconfirm title="确定要删除该模块吗？" ok-text="确定" cancel-text="取消" @confirm="removeModule(item, index)"> -->
                <DeleteOutlined class="actionIcon" @click.stop="removeModule(item, index)" />
                <!-- </a-popconfirm> -->
              </div>
            </div>
          </div>
          <!-- 表单区域（折叠面板内容） -->
          <div class="form" v-if="isExpand(item.id)">
            <!-- moduleItemList的数组 -->
            <div v-for="(moduleFormItemArray, arrayIndex) in item.moduleItemList">
              <!-- 遍历moduleItemList里面的数组 -->
              <div v-for="moduleItem in moduleFormItemArray">
                <div class="moduleItemName">
                  {{ moduleItem.moduleItemName }}
                </div>
                <!-- 遍历formItemList -->
                <a-form style="display: flex;flex-wrap: wrap;justify-content: space-between">
                  <a-form-item v-for="formItem in moduleItem.formItemList">
                    <!-- formItem的label -->
                    <div class="formItemLabel">
                      {{ formItem.label }}
                      <div v-if="item.id == 1" style="display: flex;justify-content: center;align-items: center;">
                        <a-switch v-model:checked="formItem.showIcon" size="small" class="showIcon"
                          checked-children="隐藏图标" un-checked-children="显示图标" />
                        <span style="cursor: pointer;margin-left: 5px;font-size: 20px;"
                          v-if="moduleItem.moduleItemName == '' && formItem.tagId" @click="removeTag(formItem)">x</span>
                      </div>
                    </div>
                    <!-- formItem的输入框 -->
                    <div class="formItem">
                      <a-upload list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                        v-if="formItem.type == 'avatar'">
                        <img v-if="formItem.value" :src="formItem.value" style="width: 100%;height: 100%;" alt="avatar" />
                        <div v-else>
                          <LoadingOutlined v-if="state.avatarLoading"></LoadingOutlined>
                          <PlusOutlined v-else></PlusOutlined>
                          <div class="ant-upload-text">上传头像</div>
                        </div>
                      </a-upload>
                      <a-input v-model:value="formItem.value" class="ipt" v-if="formItem.type == 'input'"
                        style="width: 220px;" />
                      <a-select v-model:value="formItem.value" v-if="formItem.type == 'select'"
                        :options="formItem.options" style="width: 220px;" />
                      <a-range-picker v-model:value="formItem.value" v-if="formItem.type == 'date'" picker="month"
                        :placeholder="['开始时间', '结束时间']" style="width: 220px;" valueFormat="YYYY-MM" />
                      <WangEditor v-model:content="formItem.value" v-if="formItem.type == 'richText'" height="320"
                        :excludeToolbar="excludeToolbar" />
                    </div>
                  </a-form-item>
                </a-form>
              </div>
              <!-- 删除moduleItem(默认的第一项不能删除) -->
              <div class="removeModuleItem" v-if="item.id != 1 && arrayIndex != 0">
                <a @click="removeModuleItem(item, arrayIndex)">删除此项</a>
              </div>
            </div>
            <!-- 更多信息 -->
            <div class="moreInfo" v-if="item.id == 1">
              <a-tag style="cursor: pointer;margin-bottom: 8px;" v-for="(tagItem, index) in item.moreInfo "
                @click="moreInfoTagClick(tagItem, index)">
                <template #icon>
                  <PlusOutlined />
                </template>
                {{ tagItem.label }}
              </a-tag>
            </div>
          </div>
          <div class="addModuleItem" style="text-align: center;" v-if="item.id != 1 && isExpand(item.id)">
            <a-button type="primary" style="margin-bottom: 20px;border-radius: 18px;" @click="addModuleItem(item)">
              <PlusOutlined />添加{{ item.moduleName }}
            </a-button>
          </div>
        </div>
      </a-card>
    </div>
    <div class="content">
      <div class="contentAction">
        <a-button type="primary" @click="save">保存为pdf</a-button>
      </div>
      <div class="preview" :border="false" id="preview">
        <div class="divider" v-for="item in state.pageNum"
          :style="{ top: (1120 * item) + (state.pageNum > 1 ? 10 : 0) + 'px' }">
          -----------------------------------------------------------
          第{{ item }}页到此结束---------------------------------------------------------------
        </div>
        <!-- draggable="true"
          @dragstart="onDragstart($event, item.id)" @dragend="onDragend($event, item.id)"
          @dragover="onDragover($event, item.id)"  -->
        <div v-for="(item, index) in moduleList.filter(row => row.switch) " :key="item.id" draggable="true"
          @dragstart="onDragstart($event, item.id)" @dragend="onDragend($event, item.id)"
          @dragover="onDragover($event, item.id)">
          <!-- 基本信息模块布局 -->
          <div class="baseInfoModule" id="draggableEl" v-if="item.id == 1">
            <div class="avatar"><img :src="state.baseInfoModule.formItemList[0].value" /></div>
            <div style="display: flex;flex-direction: column;width: 80%;">
              <div v-for="moduleItemArray in item.moduleItemList">
                <div class="baseInfo" v-for="moduleItem in moduleItemArray">
                  <span v-for="formItem in moduleItem.formItemList">
                    <h2 v-if="formItem.key == 'name'" style="margin-bottom: 0;font-weight: 600;">{{ formItem.value }}
                    </h2>
                    <span v-if="formItem.key != 'avatar' && formItem.key != 'name'" style="margin-right: 8px;">
                      <!-- <img style="width: 12px;margin-right: 2px;margin-top: -3px;" :src="formItem.icon"
                        v-if="formItem.showIcon" /> -->
                      {{ formItem.icon }}
                      {{ formItem.value }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 其余模块布局 -->
          <div class="otherModule" id="draggableEl" v-else data-background="1">
            <!-- 模块操作 -->
            <div class="moduleAction">
              <a-space>
                <div class="plusBtn" @click="addModuleItem(item)">
                  <PlusOutlined />
                </div>
                <div class="upBtn" @click="moveModule(item, 'up')">
                  <ArrowUpOutlined />
                </div>
                <div class="downBtn" @click="moveModule(item, 'down')">
                  <ArrowDownOutlined />
                </div>
                <div class="deleteBtn" @click="removeModule(item, index)">
                  <DeleteOutlined />
                </div>
              </a-space>
            </div>
            <div class="moduleName">{{ item.moduleName }}</div>
            <div v-for="(moduleItemArray, arrayIndex) in item.moduleItemList" class="moduleItem">
              <!-- 子模块操作（moduleItemArray） -->
              <div class="moduleItemAction">
                <a-space>
                  <div class="upBtn" @click="moveModuleItem(item, arrayIndex, 'up')">
                    <ArrowUpOutlined />
                  </div>
                  <div class="downBtn" @click="moveModuleItem(item, arrayIndex, 'down')">
                    <ArrowDownOutlined />
                  </div>
                  <div class="deleteBtn" @click="removeModuleItem(item, arrayIndex)">
                    <DeleteOutlined />
                  </div>
                </a-space>
              </div>
              <div class="arrayItem" v-for="arrayItem in moduleItemArray">
                <div class="formItem" v-for="formItem in arrayItem.formItemList">
                  <div :class="{ bolder: formItem.class == 'bolder', gray: formItem.class == 'gray' }"
                    v-if="formItem.type == 'input' || formItem.type == 'select'">
                    {{ formItem.value }}
                  </div>
                  <div v-if="formItem.type == 'date' && formItem.value" class="date">
                    {{ formItem.value[0] }} ~ {{ formItem.value[1] }}
                  </div>
                  <div v-if="formItem.type == 'richText'" v-html="formItem.value"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 用于占位 -->
      <!-- <div id="tempContent"></div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import WangEditor from '../components/wangEditor.vue'
import Icon, { RightOutlined, DownOutlined, DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue';
import { exportPDF, domToCanvas } from '../utils/exportPdf'
import { templateModuleList } from "../data/template1";
// 富文本框排除菜单
const excludeToolbar = ['fullScreen', 'uploadImage', 'emotion', 'blockquote', 'group-more-style', 'codeBlock', 'clearStyle', 'insertTable']
// 全局状态
const state = reactive({
  // 是否显示模块名称
  isShowModuleSelectName: true,
  // 当前展开的id
  expandId: '0',
  // 上传头像Loading
  avatarLoading: false,
  // 编辑编辑折叠面板行的id
  editModuleId: '',
  // 基本信息模块信息
  baseInfoModule: {},
  // 拖拽开始元素的索引
  sourceId: '',
  // 目标元素索引
  targetId: '',
  // 总共有几页
  pageNum: 1
})
// 模块列表
const moduleList = ref([
  {
    id: 1,
    moduleName: "基本信息",
    moduleType: 'info',
    moduleIcon: '',
    // 更多信息
    moreInfo: [
      { key: 'wxCode', label: '微信号', value: '', type: 'input', icon: '', showIcon: true },
      { key: 'wxCode', label: '现居城市', value: '', type: 'input', icon: '', showIcon: true },
      { key: 'workYear', label: '工作年限', value: '', type: 'input', icon: '', showIcon: true },
      {
        key: 'sex', label: '性别', value: '', type: 'select', icon: '', showIcon: true, options: [
          { value: '男', label: '男' },
          { value: '女', label: '女' },
        ]
      },
      { key: 'height', label: '身高', value: '', type: 'input', icon: '' },
      { key: 'weight', label: '体重', value: '', type: 'input', icon: '' },
      { key: 'nativePlace', label: '籍贯', value: '', type: 'input', icon: '' },
      { key: 'nation', label: '民族', value: '', type: 'input', icon: '' },
      {
        key: 'politicsFace', label: '政治面貌', value: '', type: 'select', icon: '', showIcon: true, options: [
          { value: '群众', label: '群众' },
          { value: '共青团员', label: '共青团员' },
          { value: '预备党员', label: '预备党员' },
          { value: '党员', label: '党员' },
        ]
      },
      {
        key: 'maritalStatus', label: '婚姻状况', value: '', type: 'select', icon: '', showIcon: true, options: [
          { value: '已婚', label: '已婚' },
          { value: '未婚', label: '未婚' },
        ]
      },
      { key: 'Github', label: 'Github', value: '', type: 'input', icon: '', showIcon: true },
    ],
    switch: true,
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'avatar', label: '头像', value: '', type: 'avatar', icon: '', showIcon: true },
            { key: 'name', label: '姓名', value: '慕俊浩', type: 'input', icon: '', showIcon: true },
            { key: 'phone', label: '电话', value: '15234562158', type: 'input', icon: '', showIcon: true },
            { key: 'email', label: '邮箱', value: '1453618541@qq.com', type: 'input', icon: '', showIcon: true },
          ]
        },
        {
          moduleItemName: '求职意向',
          formItemList: [
            { key: 'currentStatus', label: '当前状态', value: '在职', type: 'input', icon: '/public/templateIcon/phone.svg', showIcon: true },
            { key: 'positionTitle', label: '职位名称', value: 'web前端', type: 'input', icon: '', showIcon: true },
            { key: 'workPlace', label: '期望工作地', value: '郑州', type: 'input', icon: '', showIcon: true },
            { key: 'expectedSalary', label: '期望薪资', value: '999999999999', type: 'input', icon: '', showIcon: true }
          ]
        },
        {
          moduleItemName: '其它信息',
          formItemList: [
            { key: 'highestDegree', label: '最高学历', value: '本科', type: 'input', icon: '', showIcon: true },
            { key: 'selfWeb', label: '个人网站', value: 'wwww.baidu.com', type: 'input', icon: '', showIcon: true },
          ]
        }
      ],
    ]
  },
  {
    id: 2,
    moduleName: "教育经历",
    moduleType: 'education',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'school', label: '学校', value: '河南工业大学1', type: 'input', class: 'bolder' },
            { key: 'major', label: '专业', value: '计算机科学与技术', type: 'input', class: 'gray' },
            {
              key: 'academicDegree', label: '学历', value: 'MBA', type: 'select', class: 'gray', options: [
                { value: '中专', label: '中专' },
                { value: '高中', label: '高中' },
                { value: '大专', label: '大专' },
                { value: '本科', label: '本科' },
                { value: '硕士', label: '硕士' },
                { value: '博士', label: '博士' },
                { value: 'MBA', label: 'MBA' },
              ],
            },
            { key: 'startToEndTime', label: '在读时间', value: ['2023-01', '2024-09'], type: 'date', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            {
              key: 'degreeType', label: '学历类型', value: '全日制', type: 'select', class: 'gray', options: [
                { value: '全日制', label: '全日制' },
                { value: '非全日制', label: '非全日制' },
                { value: '交流/交换生', label: '交流/交换生' },
              ],
            },
            { key: 'academy', label: '学院', value: '计算机与人工智能学院', type: 'input', class: 'gray' },
            { key: 'schoolCity', label: '所在城市', value: '郑州', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'description', label: '在校经历', value: '<p>XXX比赛一等奖</p>', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'school', label: '学校', value: '河南工业大学2', type: 'input', class: 'bolder' },
            { key: 'major', label: '专业', value: '计算机科学与技术', type: 'input', class: 'gray' },
            {
              key: 'academicDegree', label: '学历', value: 'MBA', type: 'select', class: 'gray', options: [
                { value: '中专', label: '中专' },
                { value: '高中', label: '高中' },
                { value: '大专', label: '大专' },
                { value: '本科', label: '本科' },
                { value: '硕士', label: '硕士' },
                { value: '博士', label: '博士' },
                { value: 'MBA', label: 'MBA' },
              ],
            },
            { key: 'startToEndTime', label: '在读时间', value: ['2023-01', '2024-09'], type: 'date', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            {
              key: 'degreeType', label: '学历类型', value: '全日制', type: 'select', class: 'gray', options: [
                { value: '全日制', label: '全日制' },
                { value: '非全日制', label: '非全日制' },
                { value: '交流/交换生', label: '交流/交换生' },
              ],
            },
            { key: 'academy', label: '学院', value: '计算机与人工智能学院', type: 'input', class: 'gray' },
            { key: 'schoolCity', label: '所在城市', value: '郑州', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'description', label: '在校经历', value: '<p>XXX比赛一等奖</p>', type: 'richText' },
          ]
        }
      ],
    ]
  },
  {
    id: 3,
    moduleName: "专业技能",
    moduleType: 'skill',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillName', label: '技能名称', value: 'html', type: 'input', class: 'bolder' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillDescription', label: '技能描述', value: '熟练使用html生成页面结构', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillName', label: '技能名称', value: 'css', type: 'input', class: 'bolder' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillDescription', label: '技能描述', value: '熟练使用css对页面结构进行美化', type: 'richText' },
          ]
        }
      ]
    ]
  },
  {
    id: 4,
    moduleName: "工作经历",
    moduleType: 'job',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'companyName', label: '公司名称', value: '科大讯飞', type: 'input', class: 'bolder' },
            { key: 'jobTime', label: '在岗时间', value: ['2023-01', '2024-12'], type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'deptName', label: '部门名称', value: '人才培养二部', type: 'input' },
            { key: 'postName', label: '岗位名称', value: '软件开发', type: 'input', class: 'gray' },
            { key: 'workCity', label: '工作城市', value: '郑州', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'jobDetail', label: '工作详情', value: 'web开发', type: 'richText' },
          ]
        },
      ]
    ]
  },
  {
    id: 5,
    moduleName: "项目经历",
    moduleType: 'project',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '人才呀', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: ['2023-01', '2024-12'], type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '开发', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '郑州', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: 'rencaiya.vip', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '岗、课、证', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '虚拟仿真', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: ['2023-01', '2024-12'], type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '开发', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '郑州', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: 'xunifangzhen.vip', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '虚拟仿真项目详情', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '博思', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: ['2023-01', '2024-12'], type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '开发', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '郑州', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: 'xunifangzhen.vip', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '博思项目详情', type: 'richText' },
          ]
        }
      ],
    ]
  },
  {
    id: 6,
    moduleName: "个人作品",
    moduleType: 'work',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            // { key: 'workPicture', label: '作品图片', value: '', type: 'avatar' },
            { key: 'workName', label: '作品名称', value: '作品名称', type: 'input', class: 'bolder' },
            { key: 'workLink', label: '作品链接', value: '作品链接', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'workDetail', label: '作品详情', value: '<p>作品详情</p>', type: 'richText' },
          ]
        }
      ]
    ]
  },
  {
    id: 7,
    moduleName: "荣誉奖项",
    moduleType: 'award',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'awardName', label: '奖项名称', value: '奖项名称', type: 'input', class: 'bolder' },
            { key: 'awardTime', label: '获奖时间', value: ['2022-01', '2022-06'], type: 'date' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'awardName', label: '奖项名称', value: '奖项名称', type: 'input', class: 'bolder' },
            { key: 'awardTime', label: '获奖时间', value: ['2022-01', '2022-06'], type: 'date' },
          ]
        }
      ]
    ]
  },
  {
    id: 8,
    moduleName: "其他经历",
    moduleType: 'experience',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceName', label: '经历名称', value: '经历名称', type: 'input', class: 'bolder' },
            { key: 'experienceTime', label: '经历时间', value: ['2022-01', '2022-06'], type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceRole', label: '所属角色', value: '所属角色', type: 'input', class: 'gray' },
            { key: 'experienceDept', label: '所属部门', value: '所属部门', type: 'input', class: 'gray' },
            { key: 'experienceCity', label: '所属城市', value: '所属城市', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceDetail', label: '经历详情', value: '<p>经历详情</p>', type: 'richText' },
          ]
        }
      ]
    ]
  },
  {
    id: 9,
    moduleName: "研究经历",
    moduleType: 'research',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchName', label: '项目名称', value: '项目名称', type: 'input', class: 'bolder' },
            { key: 'researchTime', label: '研究时间', value: ['2022-09', '2033-05'], type: 'date' },

          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchRole', label: '担任角色', value: '担任角色', type: 'input', class: 'gray' },
            { key: 'researchCity', label: '所在城市', value: '所在城市', type: 'input', class: 'gray' },
            { key: 'researchDept', label: '所属部门', value: '所属部门', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchDetail', label: '研究详情', value: '<p>研究详情</p>', type: 'richText' },
          ]
        }
      ]
    ]
  },
  {
    id: 10,
    moduleName: "个人简介",
    moduleType: 'about',
    switch: true,
    moduleIcon: '',
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'introduction', label: '个人简历', value: '<p>个人简历个人简历个人简历个人简历个人简历个人简历</p>', type: 'richText' },
          ]
        }
      ]
    ]
  },
])
// 基础信息（方便展示头像）
state.baseInfoModule = moduleList.value.find(item => item.id == 1).moduleItemList[0][0]
// 判断编辑区域的折叠面板是否展开
const isExpand = (id) => state.expandId == id

// 添加折叠面板的一行（添加模块）
const addModule = () => {
  let module = {
    id: new Date().getTime(),
    moduleName: "自定义模块",
    moduleType: 'custom',
    switch: true,
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [{ key: 'custom', label: '自定义内容', value: '', type: 'richText' }]
        }
      ]
    ]
  }
  moduleList.value.push(module)
}
// 移动折叠面板的一行（移动模块）
const moveModule = (module, type) => {
  let { id } = module
  // 找到点击module的索引
  let moduleIndex = moduleList.value.findIndex(row => row.id == id)
  // 如果向上换位，则从这个数据向上截取。从后往前找，找到第一个switch为true的索引，他就是需要交换位置的索引
  if (type == 'up') {
    let resetArr = moduleList.value.slice(0, moduleIndex)
    for (let i = resetArr.length - 1; i >= 0; i--) {
      if (resetArr[i].switch) {
        let tempIndex = moduleList.value.findIndex(row => row.id == resetArr[i].id)
        moduleList.value[moduleIndex] = resetArr[i]
        moduleList.value[tempIndex] = module
        return
      }
    }
  }
  // 如果向下换位，则从这个数据向下截取。从前往后找，找到第一个switch为true的索引，他就是需要交换位置的索引
  else {
    let resetArr = moduleList.value.slice(moduleIndex + 1, moduleList.value.length)
    for (let i = 0; i < resetArr.length; i++) {
      if (resetArr[i].switch) {
        // 需要交换位置的索引
        let tempIndex = moduleList.value.findIndex(row => row.id == resetArr[i].id)
        moduleList.value[moduleIndex] = resetArr[i]
        moduleList.value[tempIndex] = module
        return
      }
    }
  }
}
// 删除折叠面板的一行（删除模块）
const removeModule = (module) => {
  Modal.confirm({
    title: '删除模块',
    content: '确定要删除该模块吗？',
    okText: '确定',
    cancelText: '取消',
    onOk () {
      let { id } = module
      let moduleIndex = moduleList.value.findIndex(row => row.id == id)
      // 自定义模块直接删除
      if (module.moduleType == 'custom') {
        moduleList.value.splice(moduleIndex, 1)
      } else {
        // 非自定义模块初始化值
        moduleList.value[moduleIndex].switch = false
        moduleList.value[moduleIndex].moduleItemList = JSON.parse(JSON.stringify(templateModuleList[moduleIndex].moduleItemList))
      }
    },
  });
}
// 折叠面板行点击（模块行）
const collapseItemClick = (module) => {
  let index = moduleList.value.findIndex(row => row.id == module.id)
  state.expandId = moduleList.value[index].id == state.expandId ? 0 : moduleList.value[index].id
}

// 更多信息的tag点击
const moreInfoTagClick = (tagItem, index) => {
  console.log(tagItem, index);
  // 为第一个moduleItem添加form项（基本信息的id规定为1）
  let moduleItem = moduleList.value.find(row => row.id == 1)
  // 添加标识符（用户删除）
  moduleItem.moduleItemList[0][0].formItemList.push({ tagId: new Date().getTime(), ...tagItem })
  console.log(moduleItem.moduleItemList[0][0].formItemList);
  // 删除moreInfo中的tag
  moduleItem.moreInfo.splice(index, 1)
}
// 删除个人信息模块的Tag
const removeTag = (formItem) => {
  console.log(formItem);
  let { key } = formItem
  let moduleItem = moduleList.value.find(row => row.id == 1)
  // 查找索引并删除
  let formItemIndex = moduleItem.moduleItemList[0][0].formItemList.findIndex(row => row.key == key)
  moduleItem.moduleItemList[0][0].formItemList.splice(formItemIndex, 1)
  // 清空formItem信息并添加到moreInfo中
  formItem.value = ''
  moduleItem.moreInfo.push(formItem)
}

// 编辑区域添加moduleItemArray（添加子模块）
const addModuleItem = (module) => {
  let moduleItemArray = JSON.parse(JSON.stringify(module.moduleItemList[0]))
  // 将表单数据清空
  moduleItemArray.forEach(moduleItem => {
    moduleItem.formItemList.forEach(row => row.type == 'date' ? row.value = undefined : row.value = '')
  })
  module.moduleItemList.push(moduleItemArray)
  state.expandId = module.id
}
// 移动moduleItemArray（移动子模块）
const moveModuleItem = (module, arrayIndex, type) => {
  // 点击的ModuleItemArray
  let moduleItemArray = module.moduleItemList[arrayIndex]
  if (type == 'up' && arrayIndex == 0) return message.warning('已经是第一个了')
  if (type == 'down' && arrayIndex == module.moduleItemList.length - 1) return message.warning('已经是最后一个了')
  // 换位
  let tempIndex = type == 'up' ? arrayIndex - 1 : arrayIndex + 1
  let tempModuleItemArray = module.moduleItemList[tempIndex]
  module.moduleItemList[arrayIndex] = tempModuleItemArray
  module.moduleItemList[tempIndex] = moduleItemArray
}
// 编辑区域删除moduleItemArray（删除子模块）
const removeModuleItem = (module, arrayIndex) => {
  Modal.confirm({
    title: '删除模块',
    content: '确定要删除该模块吗？',
    okText: '确定',
    cancelText: '取消',
    onOk () {
      // 只剩最后一项,则删除或制空外层的module
      if (module.moduleItemList.length == 1) {
        let { id } = module
        let moduleIndex = moduleList.value.findIndex(row => row.id == id)
        // 自定义模块直接删除
        if (module.moduleType == 'custom') {
          moduleList.value.splice(moduleIndex, 1)
        } else {
          // 非自定义模块初始化值
          moduleList.value[moduleIndex].switch = false
          moduleList.value[moduleIndex].moduleItemList = JSON.parse(JSON.stringify(templateModuleList[moduleIndex].moduleItemList))
        }
      } else {
        module.moduleItemList.splice(arrayIndex, 1)
      }
    },
  });
}

// 拖拽相关
const onDragstart = (e, sourceId) => {
  state.sourceId = sourceId;
  e.target.style.opacity = 0.5
  console.log(e);
}
const onDragend = (e) => {
  let targetIndex = moduleList.value.findIndex(item => item.id == state.targetId)
  let sourceIndex = moduleList.value.findIndex(item => item.id == state.sourceId)
  let tempModule = moduleList.value[sourceIndex]
  moduleList.value[sourceIndex] = moduleList.value[targetIndex]
  moduleList.value[targetIndex] = tempModule
  e.target.style.opacity = 1
}
const onDragover = (e, targetId) => {
  e.preventDefault()
  state.targetId = targetId
}

// 保存为pdf
const save = () => {
  let preview = document.querySelector('#preview')
  let dividers = document.querySelectorAll('.divider')
  // 下载前先隐藏分割线
  dividers.forEach(item => {
    item.style.display = 'none'
  })
  // htmlToCanvas只能转换可视区域内的dom，如果dom元素存在滚动，在转换前应先展示全部高度
  domToCanvas(preview, (canvas) => {
    exportPDF('#preview', 'test')
    dividers.forEach(item => {
      item.style.display = 'block'
    })
  })
}
onMounted(() => {
  // 监听页面大小变化
  window.addEventListener('resize', () => {
    let moduleSelect = document.querySelector('.moduleSelect')
    let edit = document.querySelector('.edit')
    console.log(window.innerWidth);
    if (window.innerWidth <= 1760) {
      moduleSelect.style.width = '10%'
      edit.style.width = '90%'
      state.isShowModuleSelectName = false
    } else {
      state.isShowModuleSelectName = true
      moduleSelect.style.width = '20%'
      edit.style.width = '80%'
    }
  });
  let preview = document.querySelector('#preview')
  window.addEventListener('scroll', (e) => {
    state.pageNum = Math.floor(preview.offsetHeight / 900)
    console.log('preview', e, state.pageNum);
  })

})
</script>
<style scoped lang='less'>
.card {
  height: 90%;
  overflow: auto;
  overflow-x: hidden;
  width: 100%;
  border-radius: 0 15px 15px 0;

  .addModule {
    margin-top: 20px;
    margin-left: 50%;
    transform: translateX(-50%);
    border-radius: 15px;
  }
}

.card::-webkit-scrollbar {
  display: none;
}

.bolder {
  font-size: 16px;
  font-weight: bolder;
}

.ipt {
  border-radius: 8px;
}

.date {
  position: absolute;
  right: 20px;
  color: rgba(0, 0, 0, 0.45);
}

.gray {
  color: rgba(0, 0, 0, 0.45);
}

.main {
  page-break-inside: avoid;
  width: 100%;
  min-height: 100vh;
  padding-top: 50px;
  background: rgb(235, 238, 240);
  // flex-direction: column;

  .leftModule {
    display: flex;
    justify-content: space-between;
    width: 50%;
    position: fixed;
    top: 50px;

    .moduleSelect {
      width: 20%;
      height: 100vh;
      min-width: 100px;
      display: flex;

      .moduleItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 54px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
    }

    .edit {
      width: 80%;
      height: 90vh;
      border-radius: 18px;
      overflow: auto;

      :deep(.ant-card-body) {
        padding: 0;
      }

      .moduleItem {
        width: 100%;
        height: 52px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #353535;
        padding: 16px 20px;
        position: relative;

        .left,
        .right {
          width: 50%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action {
          display: flex;
        }

        .moduleNameIpt {
          width: 120px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .actionIcon {
          display: none;
          cursor: pointer;
          margin: 0 3px;
          color: #969696;
        }

        &:hover .actionIcon {
          display: block;
        }
      }

      .form {
        padding: 0 20px;

        .moduleItemName {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .formItemLabel {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          align-items: center;

          .showIcon {
            display: none;
          }

          &:hover .showIcon {
            display: block;
          }
        }

        .moreInfo {
          display: flex;
          flex-wrap: wrap;
        }

        .removeModuleItem {
          display: flex;
          align-items: center;
          justify-content: end;
        }
      }
    }

    .edit::-webkit-scrollbar {
      display: none;
    }
  }

  .content {
    width: 50%;
    min-width: 800px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 50%;
    justify-content: center;

    .contentAction {
      text-align: right;
      background: white;
      padding: 8px;
      border-radius: 5px;
      width: 800px;
      margin-bottom: 10px;
    }


    .preview {
      overflow: hidden;
      width: 800px;
      min-height: auto;
      background: #ffffff;
      border-radius: 18px;
      padding: 20px;
      position: relative;

      .divider {
        position: absolute;
        z-index: 1;
      }


      .baseInfoModule {
        display: flex;
        align-items: center;
        width: 100%;
        // cursor: grab;

        .avatar {
          width: 20%;

          img {
            width: 100px;
            height: 100px;
          }
        }

        .baseInfo {
          padding: 0 10px;
          width: 100%;
          text-align: center;
          margin: 1px 0;
        }
      }

      .otherModule {
        position: relative;
        // cursor: grab;

        .moduleName {
          height: 27px;
          line-height: 27px;
          font-size: 18px;
          color: rgb(70, 114, 242);
          font-weight: bold;
          margin: 16px 0 12px;
          padding-left: 12px;
          position: relative;

          &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            width: 8px;
            height: 100%;
            background: #4672FF;
          }
        }

        .moduleAction {
          width: 100px;
          position: absolute;
          right: 10px;
          top: 5px;
          display: none;
          z-index: 2;

          div {
            width: 20px;
            height: 20px;
            border-radius: 5px;
            text-align: center;
            color: white;
            font-size: 12px;
            line-height: 20px;
            background: rgb(70, 114, 242);
          }
        }

        // background: red;
        &:hover {
          transition: all .3s;
          background: whitesmoke;
        }

        &:hover .moduleAction {
          display: block;
          cursor: pointer;
        }

        .moduleItem {
          position: relative;

          .moduleItemAction {
            position: absolute;
            width: 60px;
            top: 0;
            right: 23px;
            display: none;
            z-index: 2;

            div {
              width: 20px;
              height: 20px;
              border-radius: 5px;
              text-align: center;
              color: white;
              font-size: 12px;
              line-height: 20px;
              background: rgb(70, 114, 242);
            }
          }

          &:hover .moduleItemAction {
            display: block;
            cursor: pointer;
          }

          .arrayItem {
            margin-bottom: 5px;
            display: flex;

            .formItem {
              margin-right: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }


    .preview::-webkit-scrollbar {
      display: none;
    }

    #tempContent {
      width: 49.5%;
      border-radius: 18px;
      background: rgb(235, 238, 240);
      display: none;
      right: 0;
      top: 5%;
      position: absolute;
    }
  }
}

@media screen and (max-width:1620px) {
  .main {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;

    .leftModule {
      position: static;
      width: 800px;
    }
  }

  .content {
    margin-right: 50%;
  }

}
</style>