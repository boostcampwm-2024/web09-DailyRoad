const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

async function jsonToCsv(inputJsonPath, outputCsvPath) {
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, "utf-8"));

  const csvWriter = createObjectCsvWriter({
    path: outputCsvPath,
    header: [
      { id: "google_place_id", title: "google_place_id" },
      { id: "name", title: "name" },
      { id: "thumbnail_url", title: "thumbnail_url" },
      { id: "rating", title: "rating" },
      { id: "longitude", title: "longitude" },
      { id: "latitude", title: "latitude" },
      { id: "formatted_address", title: "formatted_address" },
      { id: "category", title: "category" },
      { id: "description", title: "description" },
      { id: "detail_page_url", title: "detail_page_url" },
    ],
  });

  const processedData = jsonData.map((item) => ({
    google_place_id: item.googlePlaceId,
    name: item.name,
    thumbnail_url: item.photoUrl || null,
    rating: item.googleRating,
    longitude: parseFloat(item.longitude),
    latitude: parseFloat(item.latitude),
    formatted_address: item.address || null,
    category: item.type || null,
    description: item.description || null,
    detail_page_url: item.googleURL || null,
  }));

  await csvWriter.writeRecords(processedData);
  console.log(`CSV 파일이 생성되었습니다: ${outputCsvPath}`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node script.js <inputJsonPath> <outputCsvPath>");
  process.exit(1);
}
const [inputJsonPath, outputCsvPath] = args;

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node script.js <inputJsonPath> <outputCsvPath>");
    process.exit(1);
  }

  const [inputJsonPath, outputCsvPath] = args;
  await jsonToCsv(inputJsonPath, outputCsvPath);
})();
