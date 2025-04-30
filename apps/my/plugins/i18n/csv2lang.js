const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const createFolderIfNotExists = (folderPath) => {
  try {
    fs.accessSync(folderPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log('----- 创建文件夹' + folderPath + ' -----\n')
    } else {
      throw new Error(`Error checking folder: ${err.message}`);
    }
  }
}
createFolderIfNotExists(path.join(__dirname, 'langs'))

const clearFolder = (name) => {
  const folderPath = path.join(__dirname, name);
  const files = fs.readdirSync(folderPath);

  // 删除 lang 文件夹中的每个文件
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath);
  });
}

let pageKey, contentKey, counter, remark, filenames, outputArr
fs.createReadStream(path.join(__dirname, 'i18n.csv'))
  .pipe(csv())
  .on('headers', (headers) => {
    [pageKey, contentKey, counter, remark, ...filenames] = headers.filter(Boolean)
    outputArr = filenames.map(() => ({}))
  })
  .on('data', (row) => {
    const pageName = row[pageKey]
    const contentName = row[contentKey]

    filenames.forEach((filename, i) => {
      const obj = outputArr[i]
      if (!obj[pageName]) {
        obj[pageName] = {}
      }
      obj[pageName][contentName] = row[filename]
    })
  })
  .on('end', () => {
    clearFolder('langs')
    filenames.forEach((filename, i) => {
      const _name = filename.indexOf(' | ') !== -1 ? filename.split(' | ')[1] : filename
      fs.writeFileSync(
        path.join(__dirname, 'langs/' + _name + '.js'),
        `export default ${JSON.stringify(outputArr[i])}`
      );
    })
    console.log('----- langs转换完成 -----\n')
  });