// Builds the site for the GitHub Pages project URL and publishes dist/ to the gh-pages branch.
// Usage: npm run deploy
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';

const BASE_PATH = process.env.BASE_PATH ?? '/aurum-fitness/';
const SITE_URL = process.env.SITE_URL ?? 'https://grafikolabs.github.io/aurum-fitness';
const BRANCH = process.env.DEPLOY_BRANCH ?? 'gh-pages';
const WORKTREE = '.deploy';

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });
const out = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();

run('node', ['scripts/gen-pages.mjs'], { env: { ...process.env, BASE_PATH, SITE_URL, NOINDEX: process.env.NOINDEX ?? '1' } });
run('npx', ['vite', 'build'], { env: { ...process.env, BASE_PATH, SITE_URL } });

// Jekyll would otherwise skip files and folders beginning with an underscore.
writeFileSync('dist/.nojekyll', '');

if (existsSync(WORKTREE)) run('git', ['worktree', 'remove', '--force', WORKTREE]);
const branchExists = execFileSync('git', ['branch', '--list', BRANCH], { encoding: 'utf8' }).trim()
  || execFileSync('git', ['ls-remote', '--heads', 'origin', BRANCH], { encoding: 'utf8' }).trim();
run('git', branchExists ? ['worktree', 'add', WORKTREE, BRANCH] : ['worktree', 'add', '--orphan', '-b', BRANCH, WORKTREE]);

// Replace the branch contents with the fresh build.
for (const entry of out('git', ['-C', WORKTREE, 'ls-files']).split('\n').filter(Boolean)) {
  rmSync(path.join(WORKTREE, entry), { force: true });
}
run('cp', ['-R', 'dist/.', WORKTREE]);
run('git', ['-C', WORKTREE, 'add', '--all']);
const dirty = execFileSync('git', ['-C', WORKTREE, 'status', '--porcelain'], { encoding: 'utf8' }).trim();
if (dirty) {
  run('git', ['-C', WORKTREE, 'commit', '-m', `Deploy ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`]);
  run('git', ['-C', WORKTREE, 'push', 'origin', BRANCH]);
} else {
  console.log('No changes to deploy.');
}
run('git', ['worktree', 'remove', '--force', WORKTREE]);
console.log(`\nDeployed to ${SITE_URL}/`);
