import * as fse from 'fs-extra';
import * as path from 'path';
import * as cp from 'child_process';
import * as chalk from 'chalk';

export class Scaffold {
    exec(command: string) {
        // inherit
        return cp.execSync(command, {
            stdio: [0, 1, 2]
        });
    }

    usingTemplate(name = 'aspnet') {
        let templateFolder = path.join(__dirname, '../templates', name);
        let thisFolder = process.cwd();

        let exist = fse.existsSync(templateFolder);
        if (!exist) {
            console.log('Unable to find new project template for: ' + chalk.red(name));
            return;
        }

        console.log('Initializing new project using template: ' + chalk.cyan(name));
        console.log('Scaffolding project into your web application...');
        fse.copySync(templateFolder, thisFolder);
        console.log(chalk.green('Scaffold completed.') + ' Restoring packages for you...');
        console.log();

        try {
            this.exec('yarn');
        }
        catch (error) {
            console.log();
            console.log(chalk.red('Package restore using Yarn failed.') + ' Attempting package restore using NPM...');
            console.log();
            this.exec('npm update');
            // if NPM fails, tough luck.
        }

        console.log();
        console.log(chalk.green('Package restored successfully!'));
        console.log('To build the application, type: ' + chalk.yellow('ipack'));
    }
}
