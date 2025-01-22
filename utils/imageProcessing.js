import https from "https";
import sharp from "sharp";
import fs from "fs";
import path from "path";

let filePath;
let imageDir;

export const processImages = async (url) => {
  try {
    const tempDir = path.resolve("temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const imageName = Date.now() + "_" + path.basename(url);
    const imageDirName = path.parse(imageName).name;

    imageDir = path.resolve(tempDir, imageDirName);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    filePath = path.resolve(imageDir, path.basename(url));

    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);

      https
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to download image. HTTP ${response.statusCode}`)
            );
          }
          response.pipe(file);

          // Ensure stream finishes before resolving
          file.on("finish", () => {
            file.close(resolve);
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    const metadata = await sharp(filePath).metadata();
    // fs.unlinkSync(filePath);
    const perimeter = 2 * (metadata.width + metadata.height);

    const perimeterFilePath = path.resolve(
      imageDir,
      `${path.basename(url)}.txt`
    );
    fs.writeFileSync(perimeterFilePath, perimeter.toString());

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 300 + 100)
    );
    return perimeter;
  } catch (error) {
    console.error("Error in processImages:", error.message);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err.message);
      });
    }
    if (imageDir && fs.existsSync(imageDir)) {
      fs.rm(imageDir, { recursive: true }, (err) => {
        if (err) console.error("Error deleting directory:", err.message);
      });
    }

    throw error;
  }
};
