#!/usr/bin/env node
/**
 * Test script to verify database connection with SSL configuration
 * This script imports the db module and attempts a simple query
 */

import { pool } from './server/db';

async function testConnection() {
  console.log('[Test] Starting database connection test...');
  
  try {
    const result = await pool.query('SELECT 1 as test, current_timestamp as now');
    console.log('[Test] ✓ Database connection successful!');
    console.log('[Test] Query result:', result.rows[0]);
    
    // Test pool info
    console.log('[Test] Pool stats:', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    });
    
    await pool.end();
    console.log('[Test] ✓ Pool closed gracefully');
    process.exit(0);
  } catch (error: any) {
    console.error('[Test] ✗ Database connection failed!');
    console.error('[Test] Error:', error.message);
    if (error.code) {
      console.error('[Test] Error code:', error.code);
    }
    if (error.stack) {
      console.error('[Test] Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

testConnection();
