import fs from "fs";
import path from "path";

export function getPfpUrl(userId: string | number): string | null {
  const pfpDir = path.join(process.cwd(), "public", "static", "pfp");
  try {
    const files = fs.readdirSync(pfpDir);
    const match = files.find((f) => f.startsWith(`${userId}.`));
    return match ? `/static/pfp/${match}` : null;
  } catch {
    return null;
  }
}
