import * as inquirer from 'inquirer';
import * as downloadGitRepo from 'download-git-repo';
import * as ora from 'ora';

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
  init() {
    this.downloadRepo();
  }

  /**
   * 拉取模板
   */
  downloadRepo() {
    const spinner = ora('fetch template....').start();
    const { answers: { template, projectName }, owner, branch } = this.options;
    const tempUrl = `https://github.com:${owner}/${template}#${branch}`;
    console.log('\ntempUrl', tempUrl);
    downloadGitRepo(
      tempUrl,
      projectName,
      { clone: true },
      (err: string) => {
        console.log(err || 'Success');
        spinner.stop();
      }
    );
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
