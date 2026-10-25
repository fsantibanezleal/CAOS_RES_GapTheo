import { readdir, stat } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAX_BUNDLE_BYTES = 500 * 1024;

export function bundleBudgetFindings(files, maxBytes = MAX_BUNDLE_BYTES) {
  const javascript = files.filter((file) => file.name.endsWith('.js'));
  const findings = [];
  if (javascript.length === 0) findings.push('the production build emitted no JavaScript chunks');
  if (!javascript.some((file) => file.name.includes('react-vendor'))) {
    findings.push('the separate react-vendor chunk is missing');
  }
  if (!javascript.some((file) => file.name.includes('math-vendor'))) {
    findings.push('the separate math-vendor chunk is missing');
  }
  for (const file of javascript) {
    if (file.bytes > maxBytes) {
      findings.push(`${file.name} is ${file.bytes} bytes; the limit is ${maxBytes}`);
    }
  }
  return findings;
}

async function javascriptFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await javascriptFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push({ name: entry.name, bytes: (await stat(path)).size });
    }
  }
  return files;
}

async function main() {
  const assets = resolve(fileURLToPath(new URL('../dist/assets/', import.meta.url)));
  let files;
  try {
    files = await javascriptFiles(assets);
  } catch (error) {
    console.error(`bundle budget: cannot read ${assets}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const findings = bundleBudgetFindings(files);
  if (findings.length) {
    for (const finding of findings) console.error(`::error::bundle budget: ${finding}`);
    process.exitCode = 1;
    return;
  }
  console.log(`bundle budget: OK; ${files.length} JavaScript chunks, maximum ${MAX_BUNDLE_BYTES} bytes`);
  for (const file of files.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`${basename(file.name)} ${file.bytes} bytes`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
