const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const MAX_CONCURRENT_REQUESTS = 50;
const REQUEST_INTERVAL_MS = 7000; // 600회/1분 제한
const MAX_WIDTH = 1200;

async function processWithRateLimit(tasks, maxConcurrent, intervalMs) {
  let index = 0;
  const results = [];

  async function worker() {
    while (index < tasks.length) {
      const currentIndex = index++;
      results[currentIndex] = await tasks[currentIndex]();
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  const workers = Array.from({ length: maxConcurrent }, worker);
  await Promise.all(workers);
  return results;
}

async function fetchPhotoDetails(placeId, apiKey) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "id,photos",
  };

  try {
    const response = await axios.get(url, { headers });
    const photos = response.data.photos || [];
    return {
      photoReferences: photos.map((photo) => photo.name.split("/").pop()),
    };
  } catch (error) {
    console.error(
      `Error fetching Place Details for ${placeId}:`,
      error.message
    );
    return null;
  }
}

async function fetchPhotoUrl(photoReference, apiKey) {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${MAX_WIDTH}&key=${apiKey}`;
  try {
    const response = await axios.get(photoUrl, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302,
    });
    return response.headers.location;
  } catch (error) {
    console.error(
      `Error fetching photo URL for reference ${photoReference}:`,
      error.message
    );
    return null;
  }
}

async function processFile(inputFile, outputDir, apiKey) {
  const fileContent = await fs.readFile(inputFile, "utf8");
  const data = JSON.parse(fileContent);
  const places = data.popularPlaceList || []; // 수집한 데이터 구조

  const errorInRefData = [];
  const errorInUrlData = [];

  const tasks = places.map((place) => async () => {
    const placeId = place.googlePlaceId;
    console.log(`Processing Place ID: ${placeId}`);

    const photoDetails = await fetchPhotoDetails(placeId, apiKey);
    if (photoDetails && photoDetails.photoReferences.length > 0) {
      const firstPhotoReference = photoDetails.photoReferences[0];
      place.photoReferences = photoDetails.photoReferences;
      console.log(
        `First photoReference for ${placeId}: ${firstPhotoReference}`
      );

      const photoUrl = await fetchPhotoUrl(firstPhotoReference, apiKey);
      if (photoUrl) {
        place.photoUrl = photoUrl;
        console.log(`Added photo URL for ${placeId}: ${photoUrl}`);
      } else {
        console.log(`Failed to fetch photo URL for ${placeId}`);
        errorInUrlData.push(place);
      }
    } else {
      console.log(`No photos found for ${placeId}`);
      errorInRefData.push(place);
    }
  });

  await processWithRateLimit(
    tasks,
    MAX_CONCURRENT_REQUESTS,
    REQUEST_INTERVAL_MS
  );

  const outputFileName =
    path.basename(inputFile, ".json") + "_photo_details.json";
  const outputFilePath = path.join(outputDir, outputFileName);
  await fs.writeFile(outputFilePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Processed data saved to: ${outputFilePath}`);

  if (errorInRefData.length > 0) {
    const errorRefFileName =
      path.basename(inputFile, ".json") + "_error_in_ref.json";
    const errorRefFilePath = path.join(outputDir, errorRefFileName);
    await fs.writeFile(
      errorRefFilePath,
      JSON.stringify(errorInRefData, null, 2),
      "utf8"
    );
    console.log(`Reference Error data saved to: ${errorRefFilePath}`);
  }

  if (errorInUrlData.length > 0) {
    const errorUrlFileName =
      path.basename(inputFile, ".json") + "_error_in_url.json";
    const errorUrlFilePath = path.join(outputDir, errorUrlFileName);
    await fs.writeFile(
      errorUrlFilePath,
      JSON.stringify(errorInUrlData, null, 2),
      "utf8"
    );
    console.log(`URL Error data saved to: ${errorUrlFilePath}`);
  }
}

async function processAllFiles(inputDir, outputDir, apiKey) {
  try {
    const inputFiles = (await fs.readdir(inputDir))
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.join(inputDir, file));

    console.log(`Found ${inputFiles.length} JSON files to process.`);

    for (const inputFile of inputFiles) {
      console.log(`Processing file: ${inputFile}`);
      await processFile(inputFile, outputDir, apiKey);
    }

    console.log("All files processed.");
  } catch (error) {
    console.error("Error processing files:", error.message);
  }
}

/**
 * 구글 API 키를 발급받아 사용
 */
(async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: node script.js <inputDir> <outputDir> <apiKey>");
    process.exit(1);
  }

  const [inputDir, outputDir, apiKey] = args;

  try {
    await fs.mkdir(outputDir, { recursive: true });
    await processAllFiles(inputDir, outputDir, apiKey);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
