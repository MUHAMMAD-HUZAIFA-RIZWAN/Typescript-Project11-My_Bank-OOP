import inquirer from 'inquirer';
import figlet from 'figlet';
import chalk from 'chalk';
import * as chalkAnimation from 'chalk-animation';

class BankAccount {
  private pin: string;
  private balance: number;

  constructor(initialBalance: number) {
    this.pin = '';
    this.balance = initialBalance;
  }

  async startBankApp() {
    this.showWelcomeScreen();
    await this.setPin();
    await this.verifyPin();
    this.showMenu();
  }

  private showWelcomeScreen() {
    const welcomeText = figlet.textSync('Bank App', { horizontalLayout: 'full' });
    console.log(chalk.green(welcomeText));
    console.log(chalk.blue('Welcome to the Bank App!'));
    console.log();
  }

  private async setPin() {
    const { pin } = await inquirer.prompt({
      type: 'password',
      name: 'pin',
      message: 'Create a 4-digit PIN:',
      mask: '*',
      validate: (input: string) => /^\d{4}$/.test(input) ? true : 'PIN must be a 4-digit number.',
    });

    this.pin = pin;
    console.log(chalk.green('PIN set successfully!'));
    console.log();
  }

  private async verifyPin() {
    const { pin } = await inquirer.prompt({
      type: 'password',
      name: 'pin',
      message: 'Enter your PIN:',
      mask: '*',
    });

    if (pin !== this.pin) {
      console.log(chalk.red('Incorrect PIN. Exiting...'));
      process.exit();
    }
  }

  private async showMenu() {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'Select an option:',
      choices: ['Debit', 'Credit', 'Balance Inquiry', 'Exit'],
    });

    switch (choice) {
      case 'Debit':
        await this.performDebit();
        break;
      case 'Credit':
        await this.performCredit();
        break;
      case 'Balance Inquiry':
        this.checkBalance();
        break;
      case 'Exit':
        console.log(chalk.yellow('Thank you for using the bank app. Goodbye!'));
        process.exit();
    }

    this.showMenu();
  }

  private async performDebit() {
    const { amount } = await inquirer.prompt({
      type: 'number',
      name: 'amount',
      message: 'Enter the debit amount:',
    });

    if (amount <= 0) {
      console.log(chalk.red('Invalid debit amount. Please try again.'));
      return;
    }

    if (this.balance < amount) {
      console.log(chalk.red('Insufficient funds.'));
      return;
    }

    this.balance -= amount;
    console.log(chalk.green(`Debit of ${amount} successfully processed. Current balance: ${this.balance}`));
  }

  private async performCredit() {
    const { amount } = await inquirer.prompt({
      type: 'number',
      name: 'amount',
      message: 'Enter the credit amount:',
    });

    if (amount <= 0) {
      console.log(chalk.red('Invalid credit amount. Please try again.'));
      return;
    }

    this.balance += amount;
    console.log(chalk.green(`Credit of ${amount} successfully processed. Current balance: ${this.balance}`));
  }

  private checkBalance() {
    console.log(chalk.blue(`Current balance: ${this.balance}`));
  }
}

// chalkAnimation.neon(('Initializing Bank App...'));

const bankAccount = new BankAccount(100000); // Replace 100000 with the initial balance
bankAccount.startBankApp();
