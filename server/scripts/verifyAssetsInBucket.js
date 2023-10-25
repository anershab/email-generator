import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = "aner-emailgen-test";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsFolder = path.resolve(__dirname, "../../public/assets");

function extractFilenamesFromHTML(html) {
  const srcRegex = /src=["'](.*?)["']/g;
  const filenames = [];
  let match;

  while ((match = srcRegex.exec(html)) !== null) {
    const srcValue = match[1];
    const filenameMatch = srcValue.match(/\/?([^/]+)$/);
    if (filenameMatch && filenameMatch[1]) {
      filenames.push(filenameMatch[1]);
    }
  }

  return filenames;
}

// Soft cache in lifecycle so we avoid lengthy AWS checks on warmed-up environments.
const confirmedCache = {};

export async function verifyAssetsInBucket(html) {
  const filenames = extractFilenamesFromHTML(html);
  for (const filename of filenames) {
    console.log(`Verifying ${filename}...`);
    // Check if asset is cached in lifecycle. If yes, skip to next file.
    if (confirmedCache[filename]) {
      continue;
    }
    const params = {
      Bucket: bucketName,
      Key: filename,
    };
    // If not, check bucket. Is it there? Great. Cache it so we don't do the check again
    const isFoundInBucket = checkFileExists(params);
    if (isFoundInBucket) {
      confirmedCache[filename] = true;
    } else {
      // If not, upload.
      console.log(`Uploading ${filename}...`);
      try {
        const fileData = fs.readFileSync(path.join(assetsFolder, filename));
        params.Body = fileData;
        const uploadResult = await s3Client.send(new PutObjectCommand(params));
        if (uploadResult) {
          console.log("File uploaded successfully. File URL:", data.Location);
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  }
}

async function checkFileExists(params) {
  try {
    await s3Client.send(new HeadObjectCommand(params));
    console.log(`File ${params.Key} exists.`);
    return true;
  } catch (err) {
    if (err.name === "NotFound") {
      console.log("File not found:", params.Key);
    } else {
      console.error("Error occurred while checking the file:", err);
    }
    return false;
  }
}
