/**
 * 打开文件
 * @param {*} filePath 文件地址
 */
import { baseUrl } from '../../../utils/util'
export function openFile(filePath, fileName) {
  const ext = fileName.substring(fileName.lastIndexOf(".")).substring(1)
  wx.showLoading({
    title: '打开文件中..',
    mask: true,
  })
  const url = baseUrl.replace('/jeecgboot', '')
  console.log('url + filePath', url + filePath);
  wx.downloadFile({
    url: url + filePath,
    filePath: wx.env.USER_DATA_PATH + "/" + fileName,
    success: function (res) {
      wx.openDocument({
        filePath: res.filePath,
        fileType: ext,
        showMenu: true,
        success: function (res) {
          wx.hideLoading()
          console.log('打开文档成功')
        },
        fail(err) {
          console.log(err)
          wx.showToast({
            title: '文件打开失败',
            icon: 'none',
            duration: 2000,
          })
        },
        complete() {
          wx.hideLoading()
        },
      })
    },
  })
}