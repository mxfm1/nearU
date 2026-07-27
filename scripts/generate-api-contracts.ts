import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:3000';
const OUTPUT_DIR = resolve(__dirname, '..', 'types', 'contracts');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'api-contracts-types.ts');

async function main() {
  console.log(`📡 Fetching spec from ${API_URL}/api/openapi.json...`);

  const res = await fetch(`${API_URL}/api/openapi.json`);
  if (!res.ok) {
    console.error(`❌ Failed to fetch spec: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const spec = await res.json();
  console.log(
    `✅ Got spec: ${Object.keys(spec.paths).length} paths, ${Object.keys(spec.components.schemas).length} schemas`
  );

  const tmpSpec = resolve(__dirname, '.tmp-openapi.json');
  writeFileSync(tmpSpec, JSON.stringify(spec));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  execSync(`npx openapi-typescript ${tmpSpec} --output ${OUTPUT_FILE}`, { stdio: 'inherit' });

  unlinkSync(tmpSpec);

  console.log(`✅ Types generated: ${OUTPUT_FILE}`);
}

main();
