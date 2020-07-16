const inquirer = require('inquirer');

const questions = [
	{ name: 'projectName', message: '请输入项目名称', default: 'my-app' },
	{ name: 'template', message: '请选择模板', type: 'list', choices: ['react-ui-template'] }
];

inquirer
	.prompt(questions)
	.then(answers => {
		console.log('answers', answers);
	})
	.catch(error => {
		console.log('error', error);
	});