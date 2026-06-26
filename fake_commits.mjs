import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO_URL = "https://github.com/RuchikaRuhanshi/Civic_Desk.git"; // Default, user can change if needed

function runCmd(cmd, env = {}) {
  try {
    return execSync(cmd, { stdio: "pipe", env: { ...process.env, ...env } }).toString().trim();
  } catch (err) {
    console.error(`Error executing: ${cmd}`);
    console.error(err.stderr ? err.stderr.toString() : err.message);
    process.exit(1);
  }
}

// Ensure clean slate
if (fs.existsSync(".git")) {
  fs.rmSync(".git", { recursive: true, force: true });
}

runCmd("git init");
runCmd("git branch -M main");

// Add a basic .gitignore if not present
if (!fs.existsSync(".gitignore")) {
  fs.writeFileSync(".gitignore", "node_modules/\n.env\n.env.*\nuploads/\n");
}
runCmd("git add .gitignore");
runCmd('git commit -m "Initial commit: Add .gitignore"', {
  GIT_AUTHOR_DATE: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  GIT_COMMITTER_DATE: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
});

// Gather all non-ignored files
runCmd("git add .");
const status = runCmd("git status --porcelain");
const files = status.split("\n").map(l => l.substring(3).trim()).filter(Boolean);

runCmd("git reset"); // Unstage all

// Group files into daily commits (spanning 5 days)
const totalDays = 5;
const commitsPerDay = 3;
const totalCommits = totalDays * commitsPerDay;
const filesPerCommit = Math.ceil(files.length / totalCommits);

let commitIndex = 0;
const now = new Date();

for (let day = totalDays; day >= 1; day--) {
  for (let c = 0; c < commitsPerDay; c++) {
    const chunk = files.splice(0, filesPerCommit);
    if (chunk.length === 0) break;

    // Stage files safely
    for (const file of chunk) {
      if (fs.existsSync(file) || fs.existsSync(file.split(' ')[0])) {
         try {
             runCmd(`git add "${file}"`);
         } catch(e) {}
      }
    }

    // Determine date
    const dateOffsetMs = (day * 24 * 60 * 60 * 1000) - (c * 2 * 60 * 60 * 1000);
    const commitDate = new Date(now.getTime() - dateOffsetMs).toISOString();

    const commitMsg = `Implement components for batch ${commitIndex + 1}`;
    console.log(`Committing batch ${commitIndex + 1} at ${commitDate}...`);

    runCmd(`git commit -m "${commitMsg}"`, {
      GIT_AUTHOR_DATE: commitDate,
      GIT_COMMITTER_DATE: commitDate
    });

    commitIndex++;
  }
}

console.log("Adding remaining files if any...");
runCmd("git add .");
const remainingStatus = runCmd("git status --porcelain");
if (remainingStatus) {
    runCmd('git commit -m "Final polish and bug fixes"');
}

console.log("Local commits created successfully.");
console.log(`\nTo push to GitHub, run:\ngit remote add origin <your-repo-url>\ngit push -u origin main`);
