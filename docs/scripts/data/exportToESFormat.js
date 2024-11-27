const mysql = require("mysql2/promise");
const { Client } = require("ssh2");
const fs = require("fs");

const sshConfig = {
  host: "example.example",
  port: 22,
  username: "example",
  privateKey: fs.readFileSync(
    "example"
  ),
};

const dbConfig = {
  host: "example",
  user: "example",
  password: "example",
  database: "example",
  port: "3306",
};

// Elasticsearch Bulk 파일 생성 함수
async function generateBulkFile(query, outputFilePath, indexName) {
  const sshClient = new Client();

  return new Promise((resolve, reject) => {
    sshClient
      .on("ready", () => {
        console.log("SSH Connection Established");

        sshClient.forwardOut(
          "127.0.0.1",
          3000,
          dbConfig.host,
          dbConfig.port,
          async (err, stream) => {
            if (err) {
              sshClient.end();
              return reject(err);
            }

            const connection = await mysql.createConnection({
              ...dbConfig,
              stream,
            });

            console.log("DB Connection Established");

            try {
              const [rows] = await connection.execute(query);

              const bulkLines =
                rows
                  .map((row) => {
                    const id = row.id;
                    delete row.id;

                    const meta = JSON.stringify({
                      index: { _index: indexName, _id: id },
                    });
                    const data = JSON.stringify(row);
                    return `${meta}\n${data}`;
                  })
                  .join("\n") + "\n";

              fs.writeFileSync(outputFilePath, bulkLines, "utf8");
              console.log(`Bulk file created: ${outputFilePath}`);
              resolve();
            } catch (error) {
              reject(error);
            } finally {
              await connection.end();
              sshClient.end();
            }
          }
        );
      })
      .on("error", reject)
      .connect(sshConfig);
  });
}

const query = "SELECT * FROM PLACE";
const outputFilePath = "./bulk_place_data.json";
const indexName = "place";

generateBulkFile(query, outputFilePath, indexName)
  .then(() => console.log("Bulk file generation completed."))
  .catch((err) => console.error("Error:", err));
