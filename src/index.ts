const inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo');

const questions = [
  { name: 'projectName', message: '请输入项目名称', default: 'my-app' },
  { name: 'template', message: '请选择模板', type: 'list', choices: ['react-ui-template'] }
];

interface Answers {
  projectName: string;
  template: string;
}

class TemplateInit {

  public answers: Answers;

  constructor(options: Answers) {
    this.answers = options;
  }

  init() {
    // answers: { projectName: 'my-app', template: 'react-ui-template' }
    const { template, projectName } = this.answers;
    this.downloadRepo(
      template,
      'master',
      projectName
    );
  }

  downloadRepo(
    repo = 'react-ui-template',
    branch = 'master',
    projectName = 'my-app'
  ) {
    const tempUrl = `https://github.com/Spencer17x/${repo}#${branch}`;
    console.log(tempUrl);
    downloadGitRepo(
      tempUrl,
      projectName,
      { clone: true },
      function (err: string) {
        console.log(err);
        console.log(err ? 'Error' : 'Success');
      });
  }
}

inquirer
  .prompt(questions)
  .then((answers: Answers) => {
    const temp = new TemplateInit(answers);
    temp.init();
  })
  .catch((error: string) => {
    console.log('error', error);
  });