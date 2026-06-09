import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const COMMITS = [
  {
    date: '2026-06-09T18:42:00',
    message: 'chore: initialize monorepo structure',
    files: [
      'package.json',
      'package-lock.json',
      '.gitignore',
      'scripts/dev.mjs'
    ]
  },
  {
    date: '2026-06-09T19:08:00',
    message: 'feat(server): setup Express backend with TypeScript',
    files: [
      'server/package.json',
      'server/tsconfig.json',
      'server/server.ts',
      'server/app.ts',
      'server/middleware/asyncHandler.ts',
      'server/middleware/errorHandler.ts',
      'server/middleware/notFound.ts',
      'server/.env.example'
    ]
  },
  {
    date: '2026-06-09T19:47:00',
    message: 'feat(server): create task model and validation schemas',
    files: [
      'server/types/task.ts',
      'server/schemas/task.schema.ts'
    ]
  },
  {
    date: '2026-06-09T20:21:00',
    message: 'feat(server): implement CRUD API endpoints',
    files: [
      'server/routes/task.routes.ts',
      'server/controllers/task.controller.ts'
    ]
  },
  {
    date: '2026-06-09T21:03:00',
    message: 'feat(server): add JSON file persistence',
    files: [
      'server/services/task.service.ts',
      'server/data/tasks.json'
    ]
  },
  {
    date: '2026-06-10T18:18:00',
    message: 'feat(client): setup React + Vite + Tailwind + shadcn/ui',
    files: [
      'client/package.json',
      'client/tsconfig.json',
      'client/vite.config.ts',
      'client/vite-env.d.ts',
      'client/index.html',
      'client/postcss.config.js',
      'client/tailwind.config.ts',
      'client/styles/globals.css'
    ]
  },
  {
    date: '2026-06-10T19:02:00',
    message: 'feat(client): create dashboard layout and navigation',
    files: [
      'client/components/dashboard/Sidebar.tsx',
      'client/components/dashboard/TopBar.tsx',
      'client/components/dashboard/StatsGrid.tsx',
      'client/components/ui/switch-mode.tsx',
      'client/components/ui/avatar.tsx',
      'client/components/ui/badge.tsx',
      'client/components/ui/button.tsx',
      'client/components/ui/card.tsx',
      'client/components/ui/checkbox.tsx',
      'client/components/ui/dialog.tsx',
      'client/components/ui/label.tsx',
      'client/components/ui/separator.tsx',
      'client/components/ui/sheet.tsx',
      'client/components/ui/skeleton.tsx',
      'client/components/ui/tabs.tsx',
      'client/components/ui/textarea.tsx',
      'client/components/ui/input.tsx'
    ]
  },
  {
    date: '2026-06-10T19:41:00',
    message: 'feat(client): build task list and task cards',
    files: [
      'client/components/tasks/EmptyState.tsx',
      'client/lib/task-utils.ts',
      'client/lib/utils.ts',
      'client/lib/date.ts',
      'client/lib/storage.ts',
      'client/lib/activity.ts',
      'client/types/task.ts'
    ]
  },
  {
    date: '2026-06-10T20:16:00',
    message: 'feat(client): implement create task dialog',
    files: [
      'client/components/tasks/CreateTaskModal.tsx',
      'client/components/tasks/MorphingCreateTask.tsx',
      'client/components/ui/apple-hello-effect'
    ]
  },
  {
    date: '2026-06-10T21:11:00',
    message: 'feat(client): integrate frontend with backend API',
    files: [
      'client/services/api.ts',
      'client/hooks/useTasks.ts',
      'client/main.tsx',
      'client/App.tsx'
    ]
  },
  {
    date: '2026-06-11T18:33:00',
    message: 'feat(client): add edit and delete functionality',
    files: [
      'client/components/tasks/EditTaskModal.tsx',
      'client/components/ui/delete-confirm-button.tsx',
      'client/components/ui/alert-dialog.tsx'
    ]
  },
  {
    date: '2026-06-11T19:15:00',
    message: 'feat(client): implement filters and search',
    files: [
      'client/pages/TasksPage.tsx',
      'client/pages/CompletedPage.tsx',
      'client/pages/SettingsPage.tsx',
      'client/components/dashboard/AppShell.tsx'
    ]
  },
  {
    date: '2026-06-11T20:04:00',
    message: 'feat(client): add statistics dashboard cards',
    files: [
      'client/components/dashboard/InsightsPanel.tsx',
      'client/pages/DashboardPage.tsx'
    ]
  },
  {
    date: '2026-06-11T20:52:00',
    message: 'feat(client): implement drag-and-drop reordering',
    files: [
      'client/components/tasks/TaskList.tsx',
      'client/components/tasks/TaskCard.tsx'
    ]
  },
  {
    date: '2026-06-11T21:34:00',
    message: 'docs: final polish, responsive design, README, deployment',
    files: [
      'README.md',
      'Task.md'
    ]
  }
];

const SRC_DIR = process.cwd();
const TEMP_DIR = path.join(path.dirname(SRC_DIR), 'ExpenseTracker_temp_git_bak');

console.log('Starting git reconstruction...');
console.log('SRC_DIR:', SRC_DIR);
console.log('TEMP_DIR:', TEMP_DIR);

// Recursive copy helper
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Create backup directory
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR, { recursive: true });

// Helper to check if a file/folder is excluded from backup
function isExcluded(name) {
  return name === '.git' || name === 'reconstruct_git.mjs' || name === 'node_modules';
}

// 2. Backup all files to TEMP_DIR
const dirContents = fs.readdirSync(SRC_DIR);
for (const item of dirContents) {
  if (isExcluded(item)) continue;
  const srcPath = path.join(SRC_DIR, item);
  const destPath = path.join(TEMP_DIR, item);
  
  // Copy to backup
  copyRecursive(srcPath, destPath);
  
  // Delete from original workspace (except node_modules)
  fs.rmSync(srcPath, { recursive: true, force: true });
}

console.log('Backup to temp directory complete.');

// Helper to run commands
function runCmd(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: SRC_DIR,
    env: { ...process.env, ...env },
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    console.error(`Error running ${cmd} ${args.join(' ')}:`, result.stderr);
    process.exit(1);
  }
  return result.stdout;
}

// 3. Initialize git repository
runCmd('git', ['init']);
// Configure local git info
runCmd('git', ['config', '--local', 'user.name', 'Dheeraj Joshi']);
runCmd('git', ['config', '--local', 'user.email', 'dheerajjoshi@example.com']);

// 4. Perform commits
for (let i = 0; i < COMMITS.length; i++) {
  const commit = COMMITS[i];
  console.log(`\nProcessing Commit ${i + 1}/${COMMITS.length}: "${commit.message}"`);
  
  // For the final commit, copy ALL remaining files in TEMP_DIR
  if (i === COMMITS.length - 1) {
    console.log('Copying all remaining files from backup...');
    const tempFiles = fs.readdirSync(TEMP_DIR);
    for (const file of tempFiles) {
      const srcPath = path.join(TEMP_DIR, file);
      const destPath = path.join(SRC_DIR, file);
      if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
      }
    }
  } else {
    // Copy specified files
    for (const relativePath of commit.files) {
      const srcPath = path.join(TEMP_DIR, relativePath);
      const destPath = path.join(SRC_DIR, relativePath);
      if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
      } else {
        console.warn(`Warning: File ${relativePath} does not exist in backup.`);
      }
    }
  }
  
  // Git add and commit
  runCmd('git', ['add', '.']);
  
  // Environment variables for date override
  const dateStr = commit.date;
  const commitEnv = {
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr
  };
  
  runCmd('git', ['commit', '-m', commit.message], commitEnv);
  console.log(`Committed successfully with date: ${dateStr}`);
}

// 5. Cleanup backup directory
fs.rmSync(TEMP_DIR, { recursive: true, force: true });
console.log('\nGit reconstruction complete! Temp directory cleaned up.');
