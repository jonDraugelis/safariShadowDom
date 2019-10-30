const fs = require('fs')
const path = require('path')

const mergeResults = (...args) => {
    const dir = process.argv[2];
    const filePattern = process.argv[3];
    if(fs.existsSync(`${dir}/wdio-merged.json`)) {
        fs.unlinkSync(`${dir}/wdio-merged.json`);
    }
    const rawData = getDataFromFiles(dir, filePattern)
    writeFile(dir, rawData)
}
/* get and format the data */
function getDataFromFiles (dir, filePattern) {
    const fileNames = fs.readdirSync(dir).filter(file => file.match(filePattern))
    const data = []
    fileNames.forEach(fileName => {
        const filepath = `${dir}/${fileName}`;
        const file = fs.readFileSync(filepath, 'utf8');
        let parsed = {};
        try {
            parsed = JSON.parse(file);
        } catch (err) {
            console.log(`Error parsing JSON file at ${filepath}`);
        }
        data.push(parsed)
    });
    return data
}

/* write to a file */
function writeFile (dir, mergedResults) {
    const fileName = 'wdio-merged.json'
    const filePath = path.join(dir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(mergedResults))
}
mergeResults();
