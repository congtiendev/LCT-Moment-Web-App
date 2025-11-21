const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test health endpoint
async function testHealth() {
  try {
    const response = await axios.get('http://localhost:3000/api/health');
    console.log('✓ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return false;
  }
}

// Test that routes exist (they'll return 401 without auth, which is expected)
async function testRouteExists(method, path) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${path}`,
      validateStatus: () => true // Don't throw on any status
    };

    const response = await axios(config);

    // 401 means route exists but requires auth
    // 404 means route doesn't exist
    if (response.status === 404) {
      console.error(`✗ Route not found: ${method.toUpperCase()} ${path}`);
      return false;
    } else {
      console.log(`✓ Route exists: ${method.toUpperCase()} ${path} (status: ${response.status})`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error testing route ${method.toUpperCase()} ${path}:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('Testing Settings API Endpoints...\n');

  // Test health first
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('\nServer is not responding. Exiting tests.');
    process.exit(1);
  }

  console.log('\nTesting Settings Routes:');

  const tests = [
    ['get', '/users/settings'],
    ['put', '/users/settings'],
    ['post', '/users/avatar'],
    ['put', '/users/profile'],
    ['delete', '/photos/all'],
    ['delete', '/users/account'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [method, path] of tests) {
    const result = await testRouteExists(method, path);
    if (result) passed++;
    else failed++;
  }

  console.log(`\n=================================`);
  console.log(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`=================================`);

  if (failed === 0) {
    console.log('\n✓ All routes registered successfully!');
    process.exit(0);
  } else {
    console.log('\n✗ Some routes failed registration.');
    process.exit(1);
  }
}

runTests();
