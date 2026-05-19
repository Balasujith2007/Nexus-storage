import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "nodes.json");

// Helper to read database
async function getNodes() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Return default cluster nodes if file doesn't exist
      const defaultNodes = [
        { id: "node-alpha-01", name: "Alpha Core", ip: "192.168.1.10", capacity: 32, region: "US-East-1", status: "online", replicationEnabled: true },
        { id: "node-beta-02", name: "Beta Edge", ip: "192.168.1.11", capacity: 16, region: "EU-West-2", status: "online", replicationEnabled: true },
        { id: "node-gamma-03", name: "Gamma Backup", ip: "192.168.1.12", capacity: 64, region: "AP-South-1", status: "syncing", replicationEnabled: true },
      ];
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultNodes, null, 2));
      return defaultNodes;
    }
    throw error;
  }
}

// Helper to save database
async function saveNodes(nodes: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(nodes, null, 2));
}

export async function GET() {
  try {
    const nodes = await getNodes();
    return NextResponse.json(nodes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nodes database" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.ip) {
      return NextResponse.json({ error: "Name and IP are required" }, { status: 400 });
    }
    
    const nodes = await getNodes();

    if (nodes.some((n: any) => n.ip === body.ip)) {
      return NextResponse.json({ error: "Node with this IP already exists" }, { status: 409 });
    }

    const newNode = {
      id: `node-${Date.now()}`,
      name: body.name,
      ip: body.ip,
      capacity: Number(body.capacity) || 10,
      region: body.region || "US-East-1",
      status: "syncing",
      replicationEnabled: body.replicationEnabled ?? true,
    };

    nodes.push(newNode);
    await saveNodes(nodes);

    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}
