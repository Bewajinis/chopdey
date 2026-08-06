// One-time seed script: uploads src/data/seedVenues.json into Cloud Firestore.
// Run with: npm run seed   (or: node --env-file=.env scripts/seedFirestore.mjs)
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, writeBatch } from 'firebase/firestore'

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`)
  console.error('Copy .env.example to .env, fill in your Firebase config, and run: npm run seed')
  process.exit(1)
}

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
})
const db = getFirestore(app)

const { zones, venues } = JSON.parse(
  readFileSync(new URL('../src/data/seedVenues.json', import.meta.url), 'utf8'),
)

console.log(`Seeding ${zones.length} zones and ${venues.length} venues into project "${process.env.VITE_FIREBASE_PROJECT_ID}"...`)

// Firestore batches allow up to 500 writes; 5 + 60 fits in one, but chunk to stay safe.
const writes = [
  ...zones.map((z) => ({ ref: doc(db, 'zones', z.id), data: z, label: `zone ${z.name}` })),
  ...venues.map((v) => ({ ref: doc(db, 'venues', v.id), data: v, label: `venue ${v.name}` })),
]

const CHUNK = 400
for (let i = 0; i < writes.length; i += CHUNK) {
  const batch = writeBatch(db)
  const chunk = writes.slice(i, i + CHUNK)
  for (const w of chunk) batch.set(w.ref, w.data)
  await batch.commit()
  for (const w of chunk) console.log(`  ✓ ${w.label}`)
}

console.log(`\nDone: ${zones.length} zones and ${venues.length} venues written to Cloud Firestore.`)
process.exit(0)
