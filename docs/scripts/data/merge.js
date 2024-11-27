const fs = require("fs");
const path = require("path");

function mergeDataFiles(inputDir, outputFile) {
  try {
    const files = fs.readdirSync(inputDir);
    const mergedData = [];

    files.forEach((file) => {
      const filePath = path.join(inputDir, file);
      if (path.extname(file) === ".json") {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          if (Array.isArray(data)) {
            mergedData.push(...data);
          } else {
            console.warn(`${file}에 배열이 없습니다.`);
          }
        } catch (error) {
          console.error(`${file}를 처리하는 중 오류 발생:`, error.message);
        }
      }
    });

    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
    console.log(`통합 완료! 결과는 ${outputFile}에 저장되었습니다.`);
  } catch (error) {
    console.error(`디렉토리 처리 중 오류 발생:`, error.message);
  }
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node script.js <inputDir> <outputFile>");
    process.exit(1);
  }

  const [inputDir, outputFile] = args;
  mergeDataFiles(inputDir, outputFile);
})();
