#!/usr/bin/env node
/**
 * Cloudflare R2 Pin Asset Uploader (zero external dependencies, AWS SigV4)
 *
 * Usage:
 *   node scripts/r2-upload.mjs <local-dir> <r2-prefix> [--dry-run]
 *
 * Example:
 *   node scripts/r2-upload.mjs antigravity/mobile-detailing/output/v0.1.0-draft/pinterest pins/mobile-detailing --dry-run
 *
 * Validates every Pinterest image before upload:
 *   - Must be PNG or JPEG (no WebP/SVG)
 *   - Must be <= 500 KB
 *   - Must be exact 1000x1500 (2:3 vertical Pinterest standard)
 */

import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_BYTES = 500 * 1024;
const EXPECTED_WIDTH = 1000;
const EXPECTED_HEIGHT = 1500;

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function parsePngDimensions(buf) {
  if (buf.length < 24) return null;
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(sig)) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseJpegDimensions(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}

function validatePinAsset(filename, buf) {
  const ext = path.extname(filename).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : null;
  if (!contentType) {
    throw new Error(`${filename}: unsupported extension (use .png or .jpg)`);
  }
  if (buf.length > MAX_BYTES) {
    throw new Error(`${filename}: ${buf.length} bytes exceeds 500 KB limit`);
  }
  const dims = contentType === 'image/png' ? parsePngDimensions(buf) : parseJpegDimensions(buf);
  if (!dims || dims.width !== EXPECTED_WIDTH || dims.height !== EXPECTED_HEIGHT) {
    throw new Error(`${filename}: expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, got ${dims ? `${dims.width}x${dims.height}` : 'unreadable'}`);
  }
  return { contentType, width: dims.width, height: dims.height };
}

async function uploadToR2({ accountId, accessKeyId, secretAccessKey, bucket, key, body, contentType }) {
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const canonicalUri = `/${encodeURIComponent(bucket)}/${encodedKey}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body);
  const cacheControl = 'public, max-age=86400, immutable';

  const canonicalHeaders = [
    `cache-control:${cacheControl}`,
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n';
  const signedHeaders = 'cache-control;content-type;host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = ['PUT', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');

  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256Hex(canonicalRequest)].join('\n');

  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, 'auto');
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`https://${host}${canonicalUri}`, {
    method: 'PUT',
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      Authorization: authorization,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`R2 PUT ${key} failed (${response.status}): ${await response.text()}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positional = args.filter(a => !a.startsWith('--'));
  const [localDir, rawPrefix] = positional;

  if (!localDir || !rawPrefix) {
    console.error('Usage: node scripts/r2-upload.mjs <local-dir> <r2-prefix> [--dry-run]');
    process.exit(1);
  }

  const prefix = rawPrefix.replace(/^\/+|\/+$/g, '');
  const entries = (await fs.readdir(localDir)).filter(f => /\.(png|jpe?g)$/i.test(f)).sort();
  if (entries.length === 0) {
    console.error(`No .png/.jpg files found in ${localDir}`);
    process.exit(1);
  }

  const files = [];
  for (const filename of entries) {
    const buf = await fs.readFile(path.join(localDir, filename));
    const meta = validatePinAsset(filename, buf);
    files.push({ filename, buf, key: `${prefix}/${filename}`, ...meta });
  }

  if (dryRun) {
    const publicBase = (process.env.R2_PUBLIC_BASE_URL || 'https://studio-assets.ibrahimzahir.com').replace(/\/+$/, '');
    for (const f of files) {
      console.log(`[dry-run OK] ${f.filename} (${f.width}x${f.height}, ${f.buf.length}B, ${f.contentType}) -> ${publicBase}/${f.key}`);
    }
    return;
  }

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = (process.env.R2_BUCKET || 'studio-os-assets').trim();
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY (set in .env or environment).');
    process.exit(1);
  }

  const publicBase = (process.env.R2_PUBLIC_BASE_URL || 'https://studio-assets.ibrahimzahir.com').replace(/\/+$/, '');
  for (const f of files) {
    await uploadToR2({ accountId, accessKeyId, secretAccessKey, bucket, key: f.key, body: f.buf, contentType: f.contentType });
    const publicUrl = `${publicBase}/${f.key}`;
    const check = await fetch(publicUrl, { method: 'HEAD' });
    const liveType = check.headers.get('content-type') || 'unknown';
    console.log(`[uploaded & verified ${check.status} ${liveType}] ${publicUrl} (${f.width}x${f.height}, ${f.buf.length}B)`);
    if (!check.ok) {
      throw new Error(`Post-upload verification failed for ${publicUrl}: HTTP ${check.status}`);
    }
  }
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
