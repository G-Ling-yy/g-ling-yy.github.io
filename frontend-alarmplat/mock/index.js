/**
 * @description:导入所有 controller 模块，npm run serve时在node环境中自动输出controller文件夹下Mock接口。
 * @version:1.0.0
 * @date:2021/11/18
 * @lastEditTime: （最后更新日期）
 * @lastEditDescription: （更新注释）
 * @lastEditors: (最后更新作者)
 **/
const { handleMockArray } = require('./utils')

const mocks = []
const mockArray = handleMockArray()
mockArray.forEach((item) => {
  const obj = require(item)
  mocks.push(...obj)
})
module.exports = {
  mocks
}
