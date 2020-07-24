import { spawn } from 'child_process';
import path from 'path';

interface InstallOptions {
  pkgManager?: 'yarn' | 'npm';
  projectName?: string;
  args?: string[]
}

/**
 * 执行命令
 * @param installOptions
 */
const install = (installOptions: InstallOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { pkgManager = 'yarn', args = [], projectName } = installOptions;
    const child = spawn(
      pkgManager, args,
      {
        cwd: projectName ? path.join(process.cwd(), projectName) : '',
        stdio: ['pipe', process.stdout, process.stderr]
      }
    );
    child.once('close', code => {
      if (code !== 0) {
        reject({
          pkgManager: `${pkgManager} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
    child.once('error', reject);
  });
};

export default install;