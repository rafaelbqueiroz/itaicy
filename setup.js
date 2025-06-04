#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🌿 Setting up Itaicy Eco Lodge development environment...\n');

// Function to execute commands safely
function execCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    return false;
  }
}

// Check if pnpm is installed
try {
  execSync('pnpm --version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ pnpm is not installed. Installing pnpm...');
  execCommand('npm install -g pnpm');
}

// Setup steps
const steps = [
  {
    name: 'Installing dependencies',
    command: 'pnpm install'
  },
  {
    name: 'Creating environment file',
    action: () => {
      if (!fs.existsSync(path.join(__dirname, '.env'))) {
        fs.copyFileSync(
          path.join(__dirname, '.env.example'),
          path.join(__dirname, '.env')
        );
        return true;
      }
      console.log('→ .env file already exists, skipping...');
      return true;
    }
  },
  {
    name: 'Type checking',
    command: 'pnpm check'
  }
];

// Execute all steps
let success = true;
for (const step of steps) {
  console.log(`\n🔄 ${step.name}...`);
  
  if (step.command) {
    success = execCommand(step.command);
  } else if (step.action) {
    success = step.action();
  }
  
  if (!success) {
    console.error(`\n❌ Setup failed at step: ${step.name}`);
    process.exit(1);
  }
}

console.log('\n✅ Setup completed successfully!');
console.log('\n🚀 To start the development server, run:');
console.log('   pnpm dev');
console.log('\n📝 Make sure to update the .env file with your configuration.');
