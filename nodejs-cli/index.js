const path = require('path')
const fs = require('fs')
let src = process.argv[2];
let opt = process.argv[3];
let src2 = process.argv0;
// debugger
// console.log(src, opt, src2, 'params');
let fileSizeArr = []
async function findBiger(path) {
    console.log('遍历：'+path);
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
        // console.log(dirent.name);
        // console.log(dirent.isDirectory());
        // console.log(dirent);
        if(dirent.isDirectory()){
            await findBiger(path + '\\' + dirent.name);
        }else if(dirent.isFile()){
            fs.stat(path + '\\' + dirent.name, (err, stats) => {
                fileSizeArr.push({path, file:dirent.name, size:stats.size, mSize:(stats.size/1024).toFixed(2)})
            })
            // fileSizeArr.push(dirent.name+'-'+fs.statSync(path + '\\' + dirent.name).size)
        }
    }
    return fileSizeArr;
}
if (opt === 'del') {
    try {
        fs.unlinkSync(src);
        console.log(`${src} delete success`);
    } catch (error) {
        console.log(error);
    }
} else if (opt === 'find-big') {
    // fs.opendir(src, async (err, dir) => {
    //     if (err) throw err;
    //     console.log(dir, 'dir');
    //     for await (const dirent of dir) {
    //         console.log(dirent.name);
    //         console.log(dirent.isDirectory());
    //         console.log(dirent);
    //     }
    // })
    findBiger(src).then((res)=>{
        // console.log(res);
        let ret = []
        res.sort((a,b)=>{
            return b.size - a.size
        })
        res.forEach(i => {
            // i=i.path + '-' + i.file + '-' + i.size + '-'+ i.mSize + 'MB'
            ret.push(i.path + '-' + i.file + '-' + i.size + '-'+ i.mSize + 'MB')
        })
        console.log(ret);
        fs.writeFileSync('result.txt', ret.join('\n'))
    }).catch(console.error);
}