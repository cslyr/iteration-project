<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" style="width: 60%;margin: 50px auto;" bordered>
  </a-table>
</template>
<script  setup>
let data = [
  {
    key: '1',
    deptId: 1,
    school: '河南工业大学',
    grade: '2023级',
    major: '人工智能技术应用',
    classHour: 10,
  },
  {
    key: '2',
    deptId: 2,
    school: '安徽林业职业技术学院',
    grade: '2021级',
    major: '软件工程',
    classHour: 10
  },
  {
    key: '3',
    deptId: 3,
    school: '北京大学',
    grade: '2022级',
    major: '软件工程',
    classHour: 10
  },
  {
    key: '4',
    deptId: 2,
    school: '安徽林业职业技术学院',
    grade: '2022级',
    major: '土木工程',
    classHour: 10
  },
  {
    key: '5',
    deptId: 1,
    school: '河南工业大学',
    grade: '2021级',
    major: '计算机科学与技术',
    classHour: 10
  },
  {
    key: '6',
    deptId: 4,
    school: '郑州大学',
    grade: '2023级',
    major: '计算机科学与技术',
    classHour: 10
  },
  {
    key: '7',
    deptId: 1,
    school: '河南工业大学',
    grade: '2021级',
    major: '软件工程',
    classHour: 10
  },
  {
    key: '8',
    deptId: 4,
    school: '郑州大学',
    grade: '2022级',
    major: '电子商务',
    classHour: 10
  },
  {
    key: '9',
    deptId: 1,
    school: '河南工业大学',
    grade: '2022级',
    major: '英语专业',
    classHour: 10
  },
  {
    key: '10',
    deptId: 4,
    school: '郑州大学',
    grade: '2023级',
    major: '化学专业',
    classHour: 10
  },
];
// console.time('test')
// 根据deptId升序排序，保证同一个学校的数据相邻,同一个dept下的数据按年级升序排序
data = data.sort((a, b) => {
  if (a.deptId == b.deptId) {
    return Number(a.grade.slice(0, 4)) - Number(b.grade.slice(0, 4))
  } else {
    return a.deptId - b.deptId
  }
})
// deptId的集合
let deptIdMap = data.map((item => item.deptId))
// 去重后的deptId集合
let filterDeptIdMap = [...new Set(deptIdMap)]
// 需要合并的单元格信息
let mergeCell = []

// 计算每个学校的总学时
data.forEach(item => item.totalHour = 0)
// 返回一个部门的总学时
const getTotalHour = (deptId, Array) => {
  return Array.reduce((totalHour, item) => {
    if (item.deptId == deptId) totalHour += item.classHour
    return totalHour
  }, 0)
}
data.forEach((item) => item.totalHour = getTotalHour(item.deptId, data))

// 统计学校deptId出现的次数
let mergeObj = { deptId: 0, num: 0 }
for (let i = 0; i < filterDeptIdMap.length; i++) {
  mergeObj = { deptId: filterDeptIdMap[i], num: 0 }
  for (let j = 0; j < deptIdMap.length; j++) {
    if (filterDeptIdMap[i] == deptIdMap[j]) mergeObj.num += 1
  }
  mergeCell.push(mergeObj)
}

// 过滤除掉只出现过一次的学校（不需要合并的学校）
let filterMergeCell = mergeCell.filter(item => item.num > 1)

// 找到各个学校部门的起始索引位置
filterMergeCell.forEach(item => item.startIndex = data.findIndex(dataItem => dataItem.deptId === item.deptId))
console.log(data, deptIdMap, filterDeptIdMap, mergeCell, filterMergeCell);

// 学校最终的合并结果
let mergeSchoolArr = []
// 合并学校单元格操作
const mergeSchoolCellHandle = (mergeCellNum = 10) => {
  // mergeCellNum：展示总数据的条数
  for (let rowIndex = 0; rowIndex < mergeCellNum; rowIndex++) {
    let tempObj = { rowIndex, rowSpan: 1 }
    for (let i = 0; i < filterMergeCell.length; i++) {
      // 需要合并的一组单元格
      let cellGroup = filterMergeCell[i]
      if (rowIndex >= cellGroup.startIndex && rowIndex < cellGroup.startIndex + cellGroup.num) {
        tempObj.rowSpan = rowIndex == cellGroup.startIndex ? cellGroup.num : tempObj.rowSpan = 0
      }
    }
    mergeSchoolArr.push(tempObj)
  }
  // console.log('mergeSchoolArr', mergeSchoolArr);
}
mergeSchoolCellHandle(10)
// console.timeEnd('test')

// 合并班级------------------------合并班级
let filterGradeList = JSON.parse(JSON.stringify(filterMergeCell))
filterGradeList.forEach(item => {
  data.forEach((rowRecord, rowIndex) => {
    if (rowRecord.deptId == item.deptId) {
      item.gradeInfo = item.gradeInfo ?? []
      item.gradeInfo.push({ gradeName: rowRecord.grade, rowIndex })
    }
  })
})
console.log('filterGradeList', filterGradeList);
// 过滤掉没有重复年级的学校（不需要合并年级的学校）
filterGradeList.forEach((item, index) => {
  // map映射全部年级的集合
  let gradeList = item.gradeInfo.map(grade => { return grade.gradeName })
  // 判断是否有重复年级
  if ([...new Set(gradeList)].length == gradeList.length) {
    // 没有重复的年级添加删除标志
    item.delete = true
  } else {
    // 用重复的年级添加一个过滤过的列表
    item.delete = false
    item.filterGradeInfoMap = []
    item.filterGradeInfoMap = [...new Set(gradeList)]
  }
})
console.log('filterGradeList', filterGradeList);
// 过滤调有删除标志的年级
filterGradeList = filterGradeList.filter(item => !item.delete)
// 统计每个学校不同年级出现的次数保存到每个学校的mergeArr中
filterGradeList.forEach(item => {
  item.filterGradeInfoMap.forEach(gradeMap => {
    let mergeObj = { gradeName: gradeMap, num: 0 }
    item.gradeInfo.forEach(grade => {
      if (grade.gradeName == gradeMap) mergeObj.num += 1
    })
    item.mergeArr = item.mergeArr ?? []
    item.mergeArr.push(mergeObj)
  })
})
// 过滤掉只出现过一次的年级
filterGradeList.forEach(item => {
  item.mergeArr = item.mergeArr.filter(mergeItem => mergeItem.num > 1)
})
// 找到需要合并单元格的起始索引
filterGradeList.forEach((item, index) => {
  item.mergeArr.forEach(mergeItem => {
    console.log('item.gradeInfo', item, item.gradeInfo, mergeItem, mergeItem.gradeName);
    mergeItem.startIndex = item.gradeInfo.find(row => row.gradeName == mergeItem.gradeName).rowIndex
  })
})
// 将带起始索引的全部班级合并信息整合到一起
let gradeList = []
filterGradeList.forEach(item => {
  item.mergeArr.forEach(mergeItem => {
    gradeList.push(mergeItem)
  })
})

// 处理最终的合并结果
let mergeGradeArr = []
// 合并班级单元格操作
const mergeGradeCellHandle = () => {
  for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
    // 每行默认占一格
    let tempObj = { rowIndex, rowSpan: 1 }
    for (let i = 0; i < gradeList.length; i++) {
      // 需要合并的一组单元格
      let cellGroup = gradeList[i]
      if (rowIndex >= cellGroup.startIndex && rowIndex < cellGroup.startIndex + cellGroup.num) {
        tempObj.rowSpan = rowIndex == cellGroup.startIndex ? cellGroup.num : tempObj.rowSpan = 0
      }
    }
    mergeGradeArr.push(tempObj)
  }
}
mergeGradeCellHandle()
console.log('filterGradeList', filterGradeList, gradeList, mergeGradeArr);

const columns = [
  {
    title: '学校',
    dataIndex: 'school',
    customCell: (rowRecord, rowIndex) => {
      return { rowSpan: mergeSchoolArr[rowIndex].rowSpan }
    }
  },
  {
    title: '学校总学时',
    dataIndex: 'totalHour',
    customCell: (rowRecord, rowIndex) => {
      return { rowSpan: mergeSchoolArr[rowIndex].rowSpan }
    }
  },
  {
    title: '年级',
    dataIndex: 'grade',
    customCell: (rowRecord, rowIndex) => {
      return { rowSpan: mergeGradeArr[rowIndex].rowSpan }
    }
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'address',
  },
  {
    title: '学时',
    dataIndex: 'classHour',
    key: 'classHour',
  },
];

</script>
<style></style>