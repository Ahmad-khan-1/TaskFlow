const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const envFile = path.resolve(process.cwd(), ".env.local");
console.log("env path:", envFile);
if (!fs.existsSync(envFile)) {
  console.error("ENV file missing");
  process.exit(1);
}
const content = fs.readFileSync(envFile, "utf8");
content.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^([^=\s]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});
const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB } =
  process.env;
console.log("loaded env:", {
  MONGODB_USERNAME,
  MONGODB_PASSWORD: MONGODB_PASSWORD ? "***" : undefined,
  MONGODB_CLUSTER,
  MONGODB_DB,
});
const uri = `mongodb+srv://${encodeURIComponent(MONGODB_USERNAME)}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;
console.log("uri:", uri);

mongoose
  .connect(uri, { dbName: MONGODB_DB })
  .then(() => {
    console.log("connected");
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error("connect error:", err && err.message);
    console.error(err);
    process.exit(1);
  });
