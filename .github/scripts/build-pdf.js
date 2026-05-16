const fs = require('fs');
const { execSync } = require('child_process');

// 1. Gather live Git deployment metadata
const devName = process.env.DEV_NAME || "anonymous_dev";
const prTitle = process.env.PR_TITLE || "Core Code Optimization";
const prHash = (process.env.PR_HASH || "SYSTEM_GEN_VALID").substring(0, 8); // Uses shorthand SHA as unique hash
const dateString = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// 2. Read the master printable certificate template
let htmlContent = fs.readFileSync('./templates/certificate_template.html', 'utf8');

// 3. Dynamically inject variables over the template placeholders
htmlContent = htmlContent
    .replace('@dev_username', `@${devName}`)
    .replace('For successful optimization and submission of production code patch asset fixing core responsive layout issues.', prTitle)
    .replace('QDE-9842X-SYS', `QDE-${prHash.toUpperCase()}`)
    .replace('APPROVED & VERIFIED', `VERIFIED ON ${dateString.toUpperCase()}`);

fs.writeFileSync('./templates/active_compiled_cert.html', htmlContent);

// 4. Use native CLI to export HTML directly to PDF utilizing print boundaries
try {
    // FIXED: Added --no-sandbox and --disable-dev-shm-usage flags so Chrome doesn't crash inside the automated container
    execSync(`google-chrome --headless --no-sandbox --disable-dev-shm-usage --disable-gpu --print-to-pdf=cert-${devName}.pdf ./templates/active_compiled_cert.html`);
    console.log(`Certificate successfully compiled for ${devName}`);
} catch (error) {
    console.error("Compilation error:", error);
    process.exit(1);
}
