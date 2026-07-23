const path = require('path');
const fs = require('fs/promises');
const { execSync } = require('child_process');

// Deployment configuration
const BUILD_COMMAND = 'npm run build';
const SOURCE_DOCS_DIR = 'docs';
const TARGET_BASE_DIR = '../';
const TARGET_REPO_URL = 'https://github.com/vstechapps/thefullstack.in.git';
const TARGET_REPO_SLUG = 'thefullstack.in';
const CNAME_FILE_NAME = 'CNAME';
const FIREBASE_CONFIG_FILE_NAME = 'firebase.config.json';
const FIREBASE_CONFIG_PROD_FILE_NAME = 'firebase.config.prod.json';
const PROD_DOMAIN = 'thefullstack.in';
const GIT_BRANCH = 'main';
const REMOTE_NAME = 'origin';
const SOURCE_COMMIT_MESSAGE_PREFIX = 'Deploy test build';
const TARGET_COMMIT_MESSAGE_PREFIX = 'Deploy prod build';

const rootDir = path.resolve(__dirname, '..');
const sourceDocsPath = path.resolve(rootDir, SOURCE_DOCS_DIR);
const targetBasePath = path.resolve(rootDir, TARGET_BASE_DIR);
const targetRepoPath = path.resolve(targetBasePath, TARGET_REPO_SLUG);
const targetCnamePath = path.resolve(targetRepoPath, CNAME_FILE_NAME);
const targetFirebaseConfigPath = path.resolve(targetRepoPath, FIREBASE_CONFIG_FILE_NAME);
const sourceFirebaseConfigProdPath = path.resolve(rootDir,"scripts",FIREBASE_CONFIG_PROD_FILE_NAME);

function run(command, cwd = rootDir) {
  console.log(`Running: \"${command}\" in ${cwd}`);
  return execSync(command, { stdio: 'inherit', cwd });
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function removeDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
}

async function copyDocs(source, destination) {
  const preserveGit = path.resolve(destination) === path.resolve(targetRepoPath);

  if (preserveGit) {
    const entries = await fs.readdir(destination, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '.git') {
        continue;
      }
      await fs.rm(path.join(destination, entry.name), { recursive: true, force: true });
    }
  } else {
    await fs.rm(destination, { recursive: true, force: true });
    await fs.mkdir(destination, { recursive: true });
  }

  await fs.cp(source, destination, { recursive: true });
}

async function writeCname(filePath, domain) {
  console.log(`Writing CNAME file at ${filePath} with domain: ${domain}`);
  await fs.writeFile(filePath, `${domain}\n`, 'utf8');
}

async function copyFirebaseConfig(sourceFilePath, destinationFilePath) {
  console.log(`Copying Firebase config from ${sourceFilePath} to ${destinationFilePath}`);
  const content = await fs.readFile(sourceFilePath, 'utf8');
  await fs.writeFile(destinationFilePath, content, 'utf8');
}

async function deploy() {
  console.log('Starting production deployment...');

  // Prepare commit message timestamp used for source and target repos
  const dateTime = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC');
  const sourceCommitMessage = `${SOURCE_COMMIT_MESSAGE_PREFIX} ${dateTime}`;
  const targetCommitMessage = `${TARGET_COMMIT_MESSAGE_PREFIX} ${dateTime}`;

   // 1. Build the project in the current path
    run(BUILD_COMMAND, rootDir);

  try {
    // 0. Commit and push current repository (if there are any changes)
    console.log('Committing and pushing changes in current repository (if any)...');
    run('git add -A', rootDir);
    try {
      run(`git commit -m "${sourceCommitMessage}"`, rootDir);
    } catch (err) {
      console.log('No changes to commit in source repository.');
    }
    run(`git push ${REMOTE_NAME} ${GIT_BRANCH}`, rootDir);

    // 2. Clone the target repository into a clean target folder
    await removeDir(targetRepoPath);
    await ensureDir(targetBasePath);
    run(`git clone ${TARGET_REPO_URL} "${targetRepoPath}"`, rootDir);

    // 3. Verify the clone created a Git repo
    const gitDir = path.join(targetRepoPath, '.git');
    await fs.access(gitDir);

    // 4. Copy docs contents into the target repo folder
    const targetDocsDestination = targetRepoPath;
    await copyDocs(sourceDocsPath, targetDocsDestination);

    // 4. Replace CNAME content with the production domain
    await writeCname(targetCnamePath, PROD_DOMAIN);

    // 5. Update firebase.config.json with the content from firebase.config.prod.json
    await copyFirebaseConfig(sourceFirebaseConfigProdPath, targetFirebaseConfigPath);

    // 6. Commit and push the changes to the target repo (reuse same message)
    run('git add .', targetRepoPath);
    try {
      run(`git commit -m "${targetCommitMessage}"`, targetRepoPath);
    } catch (err) {
      console.log('No changes to commit in target repository.');
    }
    run(`git push ${REMOTE_NAME} ${GIT_BRANCH}`, targetRepoPath);

    console.log('Production deployment complete.');
  } finally {
    console.log('Cleaning up temporary target folder...');
    try {
      await removeDir(targetRepoPath);
      console.log('Cleanup successful.');
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
  }
}

deploy().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
