import * as glob from 'glob'
const bullet = []
bullet.push('1')
bullet.push('2')
bullet.push('3')
console.log(bullet)
bullet.shift()
console.log(bullet)
bullet.pop()
console.log(bullet)
bullet.push('4')
console.log(bullet)
const imgFileList =  glob.sync(`./imagesForClients/*.*`)
for (let index = 0; index < imgFileList.length; index++) {
    const element = imgFileList[index]
    const elements = element.split("/")
    imgFileList[index] = elements[elements.length - 1]
}
console.log(imgFileList)