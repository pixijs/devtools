import path from 'path';
import { bump } from './utils/bump.mts';
import { readJSON } from './utils/json.mts';
import { spawn } from './utils/spawn.mts';

const packages = ['packages/api', 'packages/devtool-chrome'];

/**
 * Bump the version of all packages in the monorepo
 * and their dependencies. Replacement for lerna version --exact --force-publish
 */
async function main(): Promise<void> {
  try {
    // Update the version of all packages
    for (const pkg of packages) {
      const { version, name } = await readJSON<{ version: string; name: string }>(
        path.join(process.cwd(), `${pkg}/package.json`),
      );
      const nextVersion = await bump(version, name);

      if (nextVersion === version) {
        continue;
      }

      await spawn('npm', ['version', nextVersion, '--no-git-tag-version'], {
        cwd: path.join(process.cwd(), pkg),
      });
    }

    // Commit the changes
    await spawn('git', ['commit', '-am', 'chore: bump package versions']);
    await spawn('git', ['push']);

    const { version } = await readJSON<{ version: string }>(path.join(process.cwd(), 'package.json'));
    const nextVersion = await bump(version, 'root');

    // Finish up: update lock, commit and tag the release
    await spawn('npm', ['version', nextVersion, '-m', `v${nextVersion}`]);

    // For testing purposes
    if (!process.argv.includes('--no-push')) {
      await spawn('git', ['push']);
      await spawn('git', ['push', '--tags']);
    }
  } catch (err) {
    console.error((err as Error).message);

    process.exit(1);
  }
}

main();
