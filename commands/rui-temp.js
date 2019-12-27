const packageJson = require('../package');
const commander = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const downloadGitRepo = require('download-git-repo');
const fsPromises = require('fs').promises;
const program = new commander.Command(packageJson.name);
const log = console.log;
const questions = [
	{ type: 'input', name: 'name', message: 'Please enter a project name', default: 'my-app' },
	{ type: 'input', name: 'version', message: 'Please enter the version number', default: '1.0.0' },
	{ type: 'input', name: 'description', message: 'Please enter a description' },
	{ type: 'input', name: 'main', message: 'Please enter the entry point', default: 'index.js' },
	{ type: 'input', name: 'author', message: 'Please enter the author' },
];
const spinner = ora('creating...');
let packageJsonData;
inquirer.prompt(questions).then(answers => {
	spinner.start();
	packageJsonData = answers;
}).then(() => {
	log(chalk.yellow('start to create template'));
	downloadGitRepo(
		`direct:https://github.com/xuzpeng/rui-temp.git`,
		packageJsonData.name,
		{ clone: true },
		err => {
			if (!err) {
				return fsPromises.readFile(path.resolve(packageJsonData.name + '/package.json'), {
					encoding: 'utf8'
				}).then(res => {
					const prevData = JSON.parse(res);
					const data = {
						...prevData,
						...packageJsonData
					};
					return fsPromises.writeFile(
						path.resolve(packageJsonData.name + '/package.json'),
						JSON.stringify(data, null, 2),
						{ encoding: 'utf8' }
					);
				}).then(() => {
					log('successfully!!!');
				}).catch(err => log(chalk.red(err))).finally(() => spinner.stop());
			}
			return Promise.reject(err);
		}
	);
}).catch(err => log(chalk.red(err)));

// 创建命令
function createCommands() {
	program
	.version(packageJson.version)
	.option('-d, --documentation', 'documentation')
	.option('-q, --quikely', 'quikely')
	.parse(process.argv);
	if (program.documentation) log('Hello World!');
	if (program.quikely) log('Hello World!!!');
}

createCommands();
