import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const file = data.get("image") as File;

  if (!file) return NextResponse.json({ success: false, message: "No file" });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // save to public/uploads/
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);
console.log("added image")
  return NextResponse.json({
    success: true,
    url: `/uploads/${file.name}`,
  });
};

