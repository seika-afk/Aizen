import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

export const maxDuration = 60;

const inputPath  = () => path.join(process.cwd(), "public", "uploads", "input.jpeg");
const outputPath = () => path.join(process.cwd(), "public", "uploads", "output.jpeg");

const SYSTEM_PROMPT = `
You are an ffmpeg command generator.
The input image absolute path is: INPUT_PATH
The output image absolute path is: OUTPUT_PATH
Always use -y flag to overwrite without prompting.

Rules:
- Reply with ONLY the raw ffmpeg command. No explanation, no markdown, no backticks.
- The command must start with "ffmpeg"
- Use the exact absolute paths provided above for input and output
- Do not include any text before or after the command

Example reply:
ffmpeg -y -i INPUT_PATH -vf "crop=iw:ih/2:0:0" OUTPUT_PATH
`.trim();

function extractFfmpegCommand(text: string): string | null {
  const lines = text.split("\n").map(l => l.trim());
  for (const line of lines) {
    if (line.startsWith("ffmpeg")) return line;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    let prompt: string;
    try {
      const body = await req.json();
      prompt = body?.prompt;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ success: false, error: "Missing or empty prompt" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API key" }, { status: 500 });
    }

    const input  = inputPath();
    const output = outputPath();

    const systemPrompt = SYSTEM_PROMPT
      .replaceAll("INPUT_PATH",  input)
      .replaceAll("OUTPUT_PATH", output);


    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_APP_NAME ?? "My App",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: prompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "(unreadable)");
      return NextResponse.json({ success: false, error: `OpenRouter ${response.status}`, detail: errorBody }, { status: response.status });
    }

    const geminiData = await response.json();
    const content: string = geminiData?.choices?.[0]?.message?.content ?? "";

    const ffmpegCmd = extractFfmpegCommand(content);

    if (!ffmpegCmd) {
      return NextResponse.json({ success: true, data: { content, imageUpdated: false } });
    }

    if (!fs.existsSync(input)) {
      return NextResponse.json({ success: false, error: "No input image uploaded yet" }, { status: 404 });
    }

    console.log("[chat/ai] Running:", ffmpegCmd);
    try {
      execSync(ffmpegCmd);
      console.log("[chat/ai] ffmpeg done ✓");
      fs.copyFileSync(output, input);
    } catch (ffErr: any) {
      const stderr = ffErr.stderr?.toString() ?? ffErr.message;
      console.error("[chat/ai] ffmpeg failed:", stderr);
      return NextResponse.json({ success: false, error: "ffmpeg failed", detail: stderr }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        content: `Done! Processing`,
        imageUpdated: true,
        outputUrl: `/uploads/output.jpeg`,
      },
    });

  } catch (err: any) {
    console.error("[chat/ai] Unexpected error:", err);
    return NextResponse.json({ success: false, error: err?.message ?? "Something went wrong" }, { status: 500 });
  }
}
