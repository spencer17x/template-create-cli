import inquirer from 'inquirer';
import downloadGitRepo from 'download-git-repo';
import ora from 'ora';
import fs from 'fs';
import program from 'commander';
import pkg from '../package.json';
import chalk from 'chalk';
import install from './utils/install';
import path from 'path';

const error = chalk.bold.red;

interface TempMap {
  [K: string]: {
    owner: string;
    branch: string;
  }
}

interface Answers {
  template: 'react-ui-template' | 'TypeScript-React-Starter';
  pkgManager: 'yarn' | 'npm';

  [k: string]: string;
}

const tempMapConfig: TempMap = {
  'react-ui-template': {
    owner: 'Spencer17x',
    branch: 'master'
  },
  'TypeScript-React-Starter': {
    owner: 'microsoft',
    branch: 'master'
  },
  'koa-generator': {
    owner: 'i5ting',
    branch: 'master'
  },
};

const questions = [
  {
    name: 'template', message: '请选择模板', type: 'list',
    choices: [
      'react-ui-template',
      'TypeScript-React-Starter',
      'koa-generator'
    ]
  },
  {
    name: 'pkgManager', message: '请选择包管理器', type: 'list',
    choices: [
      'yarn',
      'npm'
    ]
  }
];

const TemplateInit = {
  /**
   * 创建目录名
   * @param projectName
   */
  async init(projectName = 'myApp') {
    try {
      if (this.isDirExist(projectName)) {
        console.log(error('当前路径下存在同名的目录，请重新创建项目'));
        return;
      }
      const answers: Answers = await inquirer.prompt(questions); // 提问
      const { template, pkgManager } = answers;
      const { owner, branch } = tempMapConfig[template]; // 模板选择
      const spinner = ora('fetch template....').start();
      const res = await this.downloadRepo(
        template, projectName, owner, branch
      );
      this.rewritePkg(projectName);
      spinner.stop();
      await install({
        pkgManager, projectName
      });
      console.log(res);
    } catch (err) {
      console.log(error(err));
    }
  },
  /**
   * 从 github 拉取模板
   * @param template
   * @param projectName
   * @param owner
   * @param branch
   */
  downloadRepo(
    template: string, projectName: string, owner: string, branch: string
  ): Promise<string> {
    return new Promise(resolve => {
      const tempUrl = `https://github.com:${owner}/${template}#${branch}`;
      console.log('\ntempUrl', tempUrl);
      downloadGitRepo(
        tempUrl,
        projectName,
        { clone: true },
        (err: string) => {
          resolve(err || 'Success');
        }
      );
    });
  },
  /**
   * 检查目录是否存在
   * @param dir
   */
  isDirExist(dir: string): boolean {
    try {
      fs.statSync(process.cwd() + '/' + dir);
      return true;
    } catch (e) {
      return false;
    }
  },
  /**
   * 写入 package.json 文件
   * @param projectName
   */
  rewritePkg(projectName: string) {
    const pkgPath = path.resolve(projectName, './package.json');
    const result = fs.readFileSync(
      pkgPath, {
        encoding: 'utf8'
      }
    );
    const pkgObject = JSON.parse(result) || {};
    Object.assign(pkgObject, {
      name: projectName
    });
    fs.writeFileSync(pkgPath, JSON.stringify(
      pkgObject, null, 2
    ));
  }
};

/**
 * 配置 command
 */
function configCommand() {
  program
    .version(pkg.version, '-v, --version')
    .helpOption('-h, --help');

  program
    .command('init [projectName]')
    .description('create your project')
    .action(projectName => {
      // 开始搞事情
      TemplateInit.init(projectName);
    });

  program
    .command('update [version]')
    .description('update rui-app')
    .action((version: string = 'latest') => {
      install({
        pkgManager: 'yarn',
        args: ['global', 'add', `rui-app@${version}`]
      });
    });

  program.parse(process.argv);
}

// 主入口
configCommand();
