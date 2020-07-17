import * as inquirer from 'inquirer';
import * as downloadGitRepo from 'download-git-repo';
import * as ora from 'ora';
import * as fs from 'fs';

const questions = [
  { name: 'projectName', message: '请输入项目名称', default: 'my-app' },
  {
    name: 'template', message: '请选择模板', type: 'list', choices: ['react-ui-template']
  }
];

interface Answers {
  template: string;
  projectName: string;

  [k: string]: string;
}

interface TemplateInitOptions {
  answers: Answers;
  owner: string;
  branch: string;
}

class TemplateInit {
  public options: TemplateInitOptions;

  constructor(options: TemplateInitOptions) {
    this.options = options;
  }

  /**
   * 初始化入口
   */
  async init() {
    const { answers: { template, projectName }, owner, branch } = this.options;
    if (this.isDirExist(projectName)) {
      console.log('当前路径下存在同名的目录，请重新创建项目');
      return;
    }
    const spinner = ora('fetch template....').start();
    const res = await this.downloadRepo(
      template, projectName, owner, branch
    );
    spinner.stop();
    console.log(res);
  }

  /**
   * 检查目录是否已存在
   * @param dir
   */
  isDirExist(dir: string) {
    try {
      fs.statSync(process.cwd() + '/' + dir);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 拉取模板
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
  }
}

inquirer
  .prompt(questions)
  .then((answers: Answers) => {
    const temp = new TemplateInit({
      answers,
      owner: 'Spencer17x',
      branch: 'master'
    });
    temp.init();
  })
  .catch((error: string) => {
    console.log('error', error);
  });
