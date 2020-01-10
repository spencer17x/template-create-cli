const packageJson = require('../package');
const commander = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const downloadGitRepo = require('download-git-repo');
const fs = require('fs');
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

// 下载模板
function downloadTemplate() {
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
					// 异步读取文件
					fs.readFile(path.resolve(packageJsonData.name + '/package.json'), {
						encoding: 'utf8'
					}, (err, res) => {
						if (!err) {
							const prevData = JSON.parse(res);
							const data = {
								...prevData,
								...packageJsonData
							};
							// 异步写入文件
							fs.writeFile(
								path.resolve(packageJsonData.name + '/package.json'),
								JSON.stringify(data, null, 2),
								{ encoding: 'utf8' },
								(err) => {
									if (!err) log('successfully!!!');
									spinner.stop()
								}
							)
						}
					});
				}
			}
		);
	}).catch(err => log(chalk.red(err)));
}

// 创建命令
function createCommands() {
	program
		.command('init')
		.option('-i, --init', 'initialize template')
		.action(function (dir, cmdObj) {
			downloadTemplate();
		});

	program.parse(process.argv);
}

createCommands();
