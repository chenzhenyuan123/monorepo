const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// 支持参数化：--csv=<csv文件路径> --out=<输出目录>
// 缺省时读取本包内 i18n.csv，输出到本包内 langs/
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const ROOT = __dirname;
const csvPath = path.resolve(ROOT, getArg('csv', 'i18n.csv'));
const outDir = path.resolve(ROOT, getArg('out', 'langs'));

// 受保护文件：清空目录时不会被删除
const PROTECTED_FILES = ['index.js'];

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
createFolderIfNotExists(outDir)

const clearFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    if (PROTECTED_FILES.indexOf(file) !== -1) return;
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isDirectory()) return;
    fs.unlinkSync(filePath);
  });
}

let pageKey, contentKey, filenames, outputArr
fs.createReadStream(csvPath)
  .pipe(csv())
  .on('headers', (headers) => {
    [pageKey, contentKey, , , ...filenames] = headers.filter(Boolean)
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
    clearFolder(outDir)
    filenames.forEach((filename, i) => {
      const _name = filename.indexOf(' | ') !== -1 ? filename.split(' | ')[1] : filename
      fs.writeFileSync(
        path.join(outDir, _name + '.js'),
        `export default ${JSON.stringify(outputArr[i])}`
      );
    })
    console.log(`----- langs转换完成：${path.relative(process.cwd(), outDir)} -----\n`)
  });
