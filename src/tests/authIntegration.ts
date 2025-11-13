#!/usr/bin/env tsx

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

interface TestResult {
  passed: boolean;
  name: string;
  error?: string;
}

const results: TestResult[] = [];

function addResult(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  if (passed) {
    console.log(`✅ ${name}`);
  } else {
    console.log(`❌ ${name}${error ? ': ' + error : ''}`);
  }
}

async function request(
  method: string,
  path: string,
  body?: any,
  cookies?: string,
): Promise<{ status: number; data: any; headers: Record<string, string> }> {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (cookies) {
    (options.headers as any).Cookie = cookies;
  }

  const response = await fetch(url, options);
  const data = await response.json() as any;

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    status: response.status,
    data,
    headers,
  };
}

async function runTests() {
  console.log(`🧪 Running authentication integration tests against ${BASE_URL}\n`);

  const testEmail = `test-${Date.now()}@example.com`;
  const validPassword = 'ValidPass123!@#';
  const validBirthDate = '2000-01-01'; // 24 years old
  const underageBirthDate = new Date();
  underageBirthDate.setFullYear(underageBirthDate.getFullYear() - 17);
  const underageString = underageBirthDate.toISOString().split('T')[0];

  let sessionCookie = '';
  let userId = '';

  // Test 1: Registration with valid data
  try {
    const res = await request('POST', '/api/auth/register', {
      email: testEmail,
      password: validPassword,
      confirmPassword: validPassword,
      birthDate: validBirthDate,
      termsAccepted: true,
    });

    const passed =
      res.status === 201 &&
      res.data.success === true &&
      res.data.userId &&
      res.data.email === testEmail;

    if (passed) {
      userId = res.data.userId;
      sessionCookie = res.headers['set-cookie']?.[0] || '';
    }

    addResult(
      'Register with valid data',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Register with valid data', false, error?.message);
  }

  // Test 2: Registration with duplicate email
  try {
    const res = await request('POST', '/api/auth/register', {
      email: testEmail,
      password: validPassword,
      confirmPassword: validPassword,
      birthDate: validBirthDate,
      termsAccepted: true,
    });

    const passed = res.status === 409 && res.data.message?.includes('email');

    addResult(
      'Reject duplicate email',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Reject duplicate email', false, error?.message);
  }

  // Test 3: Registration with underage birth date
  try {
    const res = await request('POST', '/api/auth/register', {
      email: `under-${Date.now()}@example.com`,
      password: validPassword,
      confirmPassword: validPassword,
      birthDate: underageString,
      termsAccepted: true,
    });

    const passed = res.status === 400 && res.data.message?.includes('18');

    addResult(
      'Reject underage registration',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Reject underage registration', false, error?.message);
  }

  // Test 4: Registration without terms acceptance
  try {
    const res = await request('POST', '/api/auth/register', {
      email: `notterms-${Date.now()}@example.com`,
      password: validPassword,
      confirmPassword: validPassword,
      birthDate: validBirthDate,
      termsAccepted: false,
    });

    const passed = res.status === 400 && res.data.message?.includes('умови');

    addResult(
      'Reject registration without terms',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Reject registration without terms', false, error?.message);
  }

  // Test 5: Registration with weak password
  try {
    const res = await request('POST', '/api/auth/register', {
      email: `weak-${Date.now()}@example.com`,
      password: 'weak',
      confirmPassword: 'weak',
      birthDate: validBirthDate,
      termsAccepted: true,
    });

    const passed = res.status === 400 && res.data.message;

    addResult(
      'Reject weak password',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Reject weak password', false, error?.message);
  }

  // Test 6: Login with valid credentials
  let loginSessionCookie = '';
  try {
    const res = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: validPassword,
    });

    const passed =
      res.status === 200 &&
      res.data.success === true &&
      res.data.userId === userId;

    if (passed) {
      loginSessionCookie = res.headers['set-cookie']?.[0] || '';
    }

    addResult(
      'Login with valid credentials',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Login with valid credentials', false, error?.message);
  }

  // Test 7: Login with wrong password
  try {
    const res = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword123!@#',
    });

    const passed = res.status === 401 && res.data.message?.includes('Невірна');

    addResult(
      'Reject wrong password',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Reject wrong password', false, error?.message);
  }

  // Test 8: Check session when authenticated
  try {
    const res = await request('GET', '/api/auth/session', undefined, loginSessionCookie);

    const passed =
      res.status === 200 &&
      res.data.authenticated === true &&
      res.data.userId === userId;

    addResult(
      'Check authenticated session',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Check authenticated session', false, error?.message);
  }

  // Test 9: Check session when not authenticated
  try {
    const res = await request('GET', '/api/auth/session');

    const passed = res.status === 200 && res.data.authenticated === false;

    addResult(
      'Check unauthenticated session',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Check unauthenticated session', false, error?.message);
  }

  // Test 10: Logout
  try {
    const res = await request('POST', '/api/auth/logout', undefined, loginSessionCookie);

    const passed = res.status === 200 && res.data.success === true;

    addResult(
      'Logout successfully',
      passed,
      passed ? undefined : `Status: ${res.status}, Response: ${JSON.stringify(res.data)}`,
    );
  } catch (error: any) {
    addResult('Logout successfully', false, error?.message);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`Tests passed: ${passedCount}/${totalCount}`);

  if (passedCount < totalCount) {
    process.exitCode = 1;
  }
}

runTests().catch((error) => {
  console.error('Test suite failed:', error);
  process.exitCode = 1;
});
