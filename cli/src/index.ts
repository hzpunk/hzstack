#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { spawn } from 'cross-spawn'
import inquirer from 'inquirer'

const program = new Command()

program
  .name('create-hzstack')
  .description('CLI tool to bootstrap HzStack project with authentication, admin panel, and modern features')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('--no-install', 'Skip installing dependencies')
  .option('--use-yarn', 'Use yarn instead of npm')
  .action(async (projectName: string, options) => {
    // Get project name if not provided
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: 'my-hzstack-app',
          validate: (input: string) => {
            if (!input.trim()) {
              return 'Project name is required'
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
              return 'Project name can only contain letters, numbers, hyphens, and underscores'
            }
            return true
          }
        }
      ])
      projectName = answers.projectName
    }

    const targetDir = path.resolve(process.cwd(), projectName)
    
    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      console.log(chalk.red(`Error: Directory ${projectName} already exists`))
      process.exit(1)
    }

    console.log(chalk.blue(`🚀 Creating HzStack project: ${projectName}`))
    
    const spinner = ora('Cloning template...').start()

    try {
      // Clone the repository
      await cloneTemplate('https://github.com/hzpunk/hzstack.git', targetDir)
      
      spinner.succeed('Template cloned successfully!')

      // Clean up the template
      spinner.start('Cleaning up template...')
      await cleanupTemplate(targetDir, projectName)
      spinner.succeed('Template cleaned up!')

      // Update package.json
      spinner.start('Updating package.json...')
      await updatePackageJson(targetDir, projectName)
      spinner.succeed('Package.json updated!')

      // Install dependencies
      if (options.install) {
        spinner.start('Installing dependencies...')
        await installDependencies(targetDir, options.useYarn)
        spinner.succeed('Dependencies installed!')
      }

      console.log(chalk.green('\n✨ Success! Created HzStack project at:'), chalk.cyan(targetDir))
      console.log(chalk.blue('\n📋 Next steps:'))
      console.log(`  cd ${projectName}`)
      
      if (!options.install) {
        console.log('  npm install')
      }
      
      console.log('  cp .env.example .env')
      console.log('  # Configure your database in .env')
      console.log('  npx prisma migrate dev')
      console.log('  npm run dev')
      
      console.log(chalk.yellow('\n📚 Documentation: https://github.com/hzpunk/hzstack#readme'))
      console.log(chalk.cyan('\n🎉 Happy coding with HzStack!'))

    } catch (error) {
      spinner.fail('Error creating project')
      console.error(chalk.red(error))
      process.exit(1)
    }
  })

async function cloneTemplate(repoUrl: string, targetDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['clone', '--depth', '1', repoUrl, targetDir], {
      stdio: 'inherit'
    })

    child.on('close', (code: number) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Git clone failed with code ${code}`))
      }
    })

    child.on('error', (error: Error) => {
      reject(error)
    })
  })
}

async function cleanupTemplate(targetDir: string, projectName: string): Promise<void> {
  // Remove .git directory
  const gitDir = path.join(targetDir, '.git')
  if (fs.existsSync(gitDir)) {
    await fs.remove(gitDir)
  }

  // Remove CLI directory if it exists
  const cliDir = path.join(targetDir, 'cli')
  if (fs.existsSync(cliDir)) {
    await fs.remove(cliDir)
  }

  // Remove node_modules if it exists
  const nodeModulesDir = path.join(targetDir, 'node_modules')
  if (fs.existsSync(nodeModulesDir)) {
    await fs.remove(nodeModulesDir)
  }

  // Remove lock files
  const lockFiles = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']
  for (const lockFile of lockFiles) {
    const lockPath = path.join(targetDir, lockFile)
    if (fs.existsSync(lockPath)) {
      await fs.remove(lockPath)
    }
  }
}

async function updatePackageJson(targetDir: string, projectName: string): Promise<void> {
  const packageJsonPath = path.join(targetDir, 'package.json')
  const packageJson = await fs.readJson(packageJsonPath)
  
  // Update project name
  packageJson.name = projectName
  
  // Update description if it's the default
  if (packageJson.description === 'HzStack - Full-stack application with authentication and admin panel') {
    packageJson.description = `${projectName} - HzStack application`
  }
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
}

async function installDependencies(targetDir: string, useYarn: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = useYarn ? 'yarn' : 'npm'
    const args = useYarn ? ['install'] : ['install']
    
    const child = spawn(command, args, {
      cwd: targetDir,
      stdio: 'inherit'
    })

    child.on('close', (code: number) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} install failed with code ${code}`))
      }
    })

    child.on('error', (error: Error) => {
      reject(error)
    })
  })
}

program.parse()
