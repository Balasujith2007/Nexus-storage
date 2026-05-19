import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "files.json");
const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

// Helper to read database
async function getFiles() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const defaultFiles = [
        { id: 1, name: "System_Architecture_v2.pdf", size: "2.4 MB", type: "document", date: new Date().toLocaleDateString(), chunks: 24, sync: true },
      ];
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultFiles, null, 2));
      return defaultFiles;
    }
    throw error;
  }
}

// Helper to save database
async function saveFiles(files: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(files, null, 2));
}

export async function GET() {
  try {
    const files = await getFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch files database" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validation
    const extension = file.name.split('.').pop()?.toLowerCase();
    const dangerousExts = ["exe", "bat", "sh", "cmd", "msi"];
    
    if (dangerousExts.includes(extension || "")) {
      return NextResponse.json({ error: "Executable files are strictly prohibited for security reasons." }, { status: 403 });
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File exceeds the 100MB limit." }, { status: 413 });
    }

    // Ensure uploads directory exists
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
    } catch (e) {}

    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filePath = path.join(UPLOADS_DIR, `${Date.now()}_${safeFilename}`);
    
    // Save file permanently to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${(file.size / 1024).toFixed(2)} KB`;

    // Persist to JSON DB
    const files = await getFiles();
    const newFile = {
      id: Date.now(),
      name: safeFilename,
      size: formattedSize,
      type: file.type.includes("image") ? "image" : (file.type.includes("pdf") ? "pdf" : "document"),
      date: new Date().toLocaleDateString(),
      chunks: Math.max(1, Math.floor(file.size / (1024 * 1024 * 2))),
      sync: false, // Initially syncing
    };

    files.push(newFile);
    await saveFiles(files);

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
