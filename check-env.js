// Quick check for environment variables
// Run: node check-env.js

const requiredEnvVars = {
  server: ['DATABASE_URL', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'],
  client: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ],
};

console.log('🔍 Checking Environment Variables...\n');

let hasErrors = false;

// Check server-side vars
console.log('📦 Server-side variables:');
requiredEnvVars.server.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(
      `  ✅ ${varName}: ${varName === 'FIREBASE_PRIVATE_KEY' ? '***' + value.slice(-10) : value.substring(0, 30) + '...'}`
    );
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    hasErrors = true;
  }
});

console.log('\n🌐 Client-side variables:');
requiredEnvVars.client.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log('\n⚠️  Some environment variables are missing!');
  console.log('   Make sure your .env.local file has all required variables.');
  process.exit(1);
} else {
  console.log('\n✅ All environment variables are set!');
  process.exit(0);
}
