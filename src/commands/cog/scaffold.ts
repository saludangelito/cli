import Command, {flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import {CogGenerator} from '../../services/cog-generator'

export class Scaffold extends Command {
  static description = 'Generate boilerplate code for a new cog in a language of your choice.'
  static examples = [
    '$ crank cog:scaffold',
  ]

  static flags = {
    language: flags.string({
      description: 'The programming language you want to use to build your cog.',
      options: ['typescript']
    }),
    'output-directory': flags.string({
      char: 'o',
      description: 'The directory where scaffolded code will be placed (defaults to the current working directory).',
      default: process.cwd()
    }),
    name: flags.string({
      description: 'The friendly, human name of your cog',
    }),
    org: flags.string({
      description: "Your organization's name (e.g. from docker hub or github)"
    }),
    'include-example-step': flags.boolean({
      description: "Scaffolded code will include an example step and tests (prepend with --no- to negate",
      allowNo: true
    })
  }

  async run() {
    const {flags} = this.parse(Scaffold)

    if (!flags.name) {
      const inquiry: any = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: "What's your Cog connecting to (e.g. Salesforce)?",
      })
      flags.name = inquiry.name
    }

    if (!flags.org) {
      const inquiry: any = await inquirer.prompt({
        name: 'org',
        type: 'input',
        message: "What's your organization's docker hub name?",
        default: 'automatoninc'
      })
      flags.org = inquiry.org
    }

    if (!flags.language) {
      const inquiry: any = await inquirer.prompt({
        name: 'language',
        type: 'list',
        message: 'What language will you use to build your cog?',
        choices: Scaffold.flags.language.options,
      })
      flags.language = inquiry.language
    }

    if (!flags.hasOwnProperty('include-example-step')) {
      const inquiry: any = await inquirer.prompt({
        name: 'includeExampleStep',
        type: 'confirm',
        message: 'Would you like to include an example step in the generated code?',
        default: false
      })
      flags['include-example-step'] = inquiry.includeExampleStep
    }

    const generator: CogGenerator = new CogGenerator()
    await generator.generate(flags)
  }

}
