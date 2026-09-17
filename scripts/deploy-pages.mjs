// Builds the site for the GitHub Pages project URL and publishes dist/ to the gh-pages branch.
// Uses git plumbing (a temporary index + commit-tree) so nothing touches the working tree and
// no checkout of the deploy branch is needed.
// Usage: npm run deploy
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const BASE_PATH = process.env.BASE_PATH ?? '/aurum-fitness/';
const SITE_URL = process.env.SITE_URL ?? 'https://grafikolabs.github.io/aurum-fitness';
const BRANCH = process.env.DEPLOY_BRANCH ?? 'gh-pages';

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });
const out = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim();
const tryOut = (cmd, args, opts = {}) => { try { return out(cmd, args, opts); } catch { return ''; } };

const buildEnv = { ...process.env, BASE_PATH, SITE_URL, NOINDEX: process.env.NOINDEX ?? '1' };
run('node', ['scripts/gen-pages.mjs'], { env: buildEnv });
run('npx', ['vite', 'build'], { env: buildEnv });

// Jekyll would otherwise skip files and folders beginning with an underscore.
writeFileSync('dist/.nojekyll', '');

const gitDir = out('git', ['rev-parse', '--absolute-git-dir']);
const indexFile = path.join(gitDir, 'deploy-index');
rmSync(indexFile, { force: true });
const env = { ...process.env, GIT_INDEX_FILE: indexFile };

// Stage dist/ as the entire tree for the branch (--force: dist/ is git-ignored in the main branch).
run('git', ['--work-tree=dist', 'add', '--all', '--force'], { env });
const tree = out('git', ['write-tree'], { env });
const parent = tryOut('git', ['rev-parse', '--verify', `refs/heads/${BRANCH}`])
  || tryOut('git', ['rev-parse', '--verify', `refs/remotes/origin/${BRANCH}`]);

if (parent && out('git', ['rev-parse', `${parent}^{tree}`]) === tree) {
  console.log('No changes to deploy.');
} else {
  const message = `Deploy ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
  const commit = out('git', ['commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', message], { env });
  run('git', ['update-ref', `refs/heads/${BRANCH}`, commit]);
  run('git', ['push', 'origin', `${BRANCH}:${BRANCH}`]);
  console.log(`\nDeployed ${commit.slice(0, 8)} to ${SITE_URL}/`);
}
rmSync(indexFile, { force: true });
