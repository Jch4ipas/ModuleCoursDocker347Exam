import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "scripts","read_dht11.py");
    exec(`python3 "${scriptPath}"`, (error, stdout) => {
      if (error) {
        console.error("Error executing script:", error);
        resolve(
          NextResponse.json(
            { error: "Failed to read DHT11" },
            { status: 500 }
          )
        );
        return;
      }

      try {
        const data = JSON.parse(stdout);
        resolve(NextResponse.json(data));
      } catch (e) {
        resolve(
          NextResponse.json(
            { error: "Invalid data from script" },
            { status: 500 }
          )
        );
      }
    });
  });
}
