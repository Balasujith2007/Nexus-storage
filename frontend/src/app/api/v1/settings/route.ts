import { NextResponse } from 'next/server';

// Simulated Database
let settingsDB = {
  workspace: {
    name: "Nexus Production",
    region: "US-East-1 (N. Virginia)"
  },
  toggles: {
    e2e: true,
    mfa: false,
    alerts: true,
    autoBackup: true,
    betaFeatures: false,
    emailDaily: false,
    slackIntegration: true,
  },
  theme: "dark"
};

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(settingsDB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate database write latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly fail sometimes to test error handling (optional, maybe not)
    // if (Math.random() < 0.1) throw new Error("Simulated backend failure");
    
    // Update DB
    if (body.workspace) settingsDB.workspace = { ...settingsDB.workspace, ...body.workspace };
    if (body.toggles) settingsDB.toggles = { ...settingsDB.toggles, ...body.toggles };
    if (body.theme) settingsDB.theme = body.theme;

    return NextResponse.json({ success: true, message: 'Settings saved successfully', settings: settingsDB });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to synchronize settings with remote cluster.' }, { status: 500 });
  }
}
