import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

export const  = async () => {
  try {
    const inputPath  = path.join(process.cwd(), "public", "uploads", "input.jpeg");
    const outputPath = path.join(process.cwd(), "public", "uploads", "output.jpeg");

    if (!fs.existsSync(inputPath)) {
      return NextResponse.json({ success: false, error: "No input image found" }, { status: 404 });
    }

    // Get image dimensions using ffprobe (comes with ffmpeg)
    const probeCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${inputPath}"`;
    const dimensions = execSync(probeCmd).toString().trim(); // e.g. "1920,1080"
    const [width, height] = dimensions.split(",").map(Number);

    if (!width || !height) {
      return NextResponse.json({ success: false, error: "Could not read image dimensions" }, { status: 500 });
    }

    const halfHeight = Math.floor(height / 2);

    // Crop to top half: crop=w:h:x:y
    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "crop=${width}:${halfHeight}:0:0" "${outputPath}"`;
    console.log("[process] Running:", ffmpegCmd);

    execSync(ffmpegCmd);
    console.log("[process] Done. Output:", outputPath);

    return NextResponse.json({
      success: true,
      url: `/uploads/output.jpeg`,
    });

  } catch (err: any) {
    console.error("[process] ffmpeg error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
};
