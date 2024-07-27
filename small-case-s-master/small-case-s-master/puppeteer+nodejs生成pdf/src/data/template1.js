export const templateModuleList = [
  {
    id: 1,
    moduleName: "基本信息",
    moduleType: 'info',
    // 更多信息
    moreInfo: [
      { key: 'wxCode', label: '微信号', value: '', type: 'input', icon: '/public/person.png' },
      { key: 'wxCode', label: '现居城市', value: '', type: 'input', icon: '' },
      { key: 'workYear', label: '工作年限', value: '', type: 'input', icon: '' },
      {
        key: 'sex', label: '性别', value: '', type: 'select', icon: '', options: [
          { value: '男', label: '男' },
          { value: '女', label: '女' },
        ]
      },
      { key: 'height', label: '身高', value: '', type: 'input', icon: '' },
      { key: 'weight', label: '体重', value: '', type: 'input', icon: '' },
      { key: 'nativePlace', label: '籍贯', value: '', type: 'input', icon: '' },
      { key: 'nation', label: '民族', value: '', type: 'input', icon: '' },
      {
        key: 'politicsFace', label: '政治面貌', value: '', type: 'select', icon: '', options: [
          { value: '群众', label: '群众' },
          { value: '共青团员', label: '共青团员' },
          { value: '预备党员', label: '预备党员' },
          { value: '党员', label: '党员' },
        ]
      },
      {
        key: 'maritalStatus', label: '婚姻状况', value: '', type: 'select', icon: '', options: [
          { value: '已婚', label: '已婚' },
          { value: '未婚', label: '未婚' },
        ]
      },
      { key: 'Github', label: 'Github', value: '', type: 'input', icon: '' },
    ],
    switch: true,
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'avatar', label: '头像', value: '', type: 'avatar', icon: '' },
            { key: 'name', label: '姓名', value: '', type: 'input', icon: '' },
            { key: 'phone', label: '电话', value: '', type: 'input', icon: '' },
            { key: 'email', label: '邮箱', value: '', type: 'input', icon: '' },
          ]
        },
        {
          moduleItemName: '求职意向',
          formItemList: [
            { key: 'currentStatus', label: '当前状态', value: '', type: 'input', icon: '' },
            { key: 'positionTitle', label: '职位名称', value: '', type: 'input', icon: '' },
            { key: 'workPlace', label: '期望工作地', value: '', type: 'input', icon: '' },
            { key: 'expectedSalary', label: '期望薪资', value: '', type: 'input', icon: '' }
          ]
        },
        {
          moduleItemName: '其它信息',
          formItemList: [
            { key: 'highestDegree', label: '最高学历', value: '', type: 'input', icon: '' },
            { key: 'selfWeb', label: '个人网站', value: '', type: 'input', icon: '' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'school', label: '学校', value: '', type: 'input', class: 'bolder' },
            { key: 'major', label: '专业', value: '', type: 'input', class: 'gray' },
            {
              key: 'academicDegree', label: '学历', value: '', type: 'select', class: 'gray', options: [
                { value: '中专', label: '中专' },
                { value: '高中', label: '高中' },
                { value: '大专', label: '大专' },
                { value: '本科', label: '本科' },
                { value: '硕士', label: '硕士' },
                { value: '博士', label: '博士' },
                { value: 'MBA', label: 'MBA' },
              ],
            },
            { key: 'startToEndTime', label: '在读时间', value: undefined, type: 'date', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            {
              key: 'degreeType', label: '学历类型', value: '', type: 'select', class: 'gray', options: [
                { value: '全日制', label: '全日制' },
                { value: '非全日制', label: '非全日制' },
                { value: '交流/交换生', label: '交流/交换生' },
              ],
            },
            { key: 'academy', label: '学院', value: '', type: 'input', class: 'gray' },
            { key: 'schoolCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'description', label: '在校经历', value: '', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'school', label: '学校', value: '', type: 'input', class: 'bolder' },
            { key: 'major', label: '专业', value: '', type: 'input', class: 'gray' },
            {
              key: 'academicDegree', label: '学历', value: '', type: 'select', class: 'gray', options: [
                { value: '中专', label: '中专' },
                { value: '高中', label: '高中' },
                { value: '大专', label: '大专' },
                { value: '本科', label: '本科' },
                { value: '硕士', label: '硕士' },
                { value: '博士', label: '博士' },
                { value: 'MBA', label: 'MBA' },
              ],
            },
            { key: 'startToEndTime', label: '在读时间', value: undefined, type: 'date', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            {
              key: 'degreeType', label: '学历类型', value: '', type: 'select', class: 'gray', options: [
                { value: '全日制', label: '全日制' },
                { value: '非全日制', label: '非全日制' },
                { value: '交流/交换生', label: '交流/交换生' },
              ],
            },
            { key: 'academy', label: '学院', value: '', type: 'input', class: 'gray' },
            { key: 'schoolCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'description', label: '在校经历', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillName', label: '技能名称', value: '', type: 'input', class: 'bolder' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillDescription', label: '技能描述', value: '', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillName', label: '技能名称', value: '', type: 'input', class: 'bolder' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'skillDescription', label: '技能描述', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'companyName', label: '公司名称', value: '', type: 'input', class: 'bolder' },
            { key: 'jobTime', label: '在岗时间', value: undefined, type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'deptName', label: '部门名称', value: '', type: 'input' },
            { key: 'postName', label: '岗位名称', value: '', type: 'input', class: 'gray' },
            { key: 'workCity', label: '工作城市', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'jobDetail', label: '工作详情', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: undefined, type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: undefined, type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '', type: 'richText' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectName', label: '项目名称', value: '', type: 'input', class: 'bolder' },
            { key: 'projectTime', label: '始末时间', value: undefined, type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectRole', label: '担任角色', value: '', type: 'input', class: 'gray' },
            { key: 'projectCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
            { key: 'projectLink', label: '项目链接', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'projectDetail', label: '项目详情', value: '', type: 'richText' },
          ]
        }
      ]
    ]
  },
  {
    id: 6,
    moduleName: "个人作品",
    moduleType: 'work',
    switch: true,
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'workName', label: '作品名称', value: '', type: 'input', class: 'bolder' },
            { key: 'workLink', label: '作品链接', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'workDetail', label: '作品详情', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'awardName', label: '奖项名称', value: '奖项名称', type: 'input', class: 'bolder' },
            { key: 'awardTime', label: '获奖时间', value: undefined, type: 'date' },
          ]
        }
      ],
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'awardName', label: '奖项名称', value: '', type: 'input', class: 'bolder' },
            { key: 'awardTime', label: '获奖时间', value: undefined, type: 'date' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceName', label: '经历名称', value: '', type: 'input', class: 'bolder' },
            { key: 'experienceTime', label: '经历时间', value: undefined, type: 'date' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceRole', label: '所属角色', value: '', type: 'input', class: 'gray' },
            { key: 'experienceDept', label: '所属部门', value: '', type: 'input', class: 'gray' },
            { key: 'experienceCity', label: '所属城市', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'experienceDetail', label: '经历详情', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchName', label: '项目名称', value: '', type: 'input', class: 'bolder' },
            { key: 'researchTime', label: '研究时间', value: undefined, type: 'date' },

          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchRole', label: '担任角色', value: '', type: 'input', class: 'gray' },
            { key: 'researchCity', label: '所在城市', value: '', type: 'input', class: 'gray' },
            { key: 'researchDept', label: '所属部门', value: '', type: 'input', class: 'gray' },
          ]
        },
        {
          moduleItemName: '',
          formItemList: [
            { key: 'researchDetail', label: '研究详情', value: '', type: 'richText' },
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
    moduleItemList: [
      [
        {
          moduleItemName: '',
          formItemList: [
            { key: 'introduction', label: '个人简历', value: '', type: 'richText' },
          ]
        }
      ]
    ]
  },
]