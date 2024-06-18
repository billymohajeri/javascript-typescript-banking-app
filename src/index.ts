export class Transaction {
  amount: number;
  date: Date;

  constructor(amount: number, date = new Date()) {
    if (!this.#validateTransactionAmount(amount)) {
      throw new Error("Invalid transaction amount");
    }
    if (!this.#validateTransactionDate(date)) {
      throw new Error("Invalid transaction date");
    }
    this.amount = amount;
    this.date = date;
  }

  #validateTransactionAmount = (amount: number) => {
    return typeof amount === "number" && !isNaN(amount);
  };

  #validateTransactionDate = (date: Date) => {
    return date instanceof Date;
  };
}

export class Customer {
  private name: string;
  private id: number;
  private transactions: Transaction[];

  constructor(name: string, id: number) {
    if (!this.validateCustomerName(name)) {
      throw new Error("Invalid customer name");
    }

    if (!this.validateCustomerId(id)) {
      throw new Error("Invalid customer ID");
    }

    this.name = name;
    this.id = id;
    this.transactions = [];
  }

  private validateCustomerName = (name: string) => {
    return typeof name === "string" && name.trim() !== "";
  };

  private validateCustomerId = (id: number) => {
    return Number.isInteger(id) && id > 0;
  };

  getName = () => {
    return this.name;
  };

  getId = () => {
    return this.id;
  };

  getTransactions = () => {
    return this.transactions;
  };

  getBalance = () => {
    const sum = this.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    return sum;
  };

  addTransaction = (amount: number) => {
    if (!this.validateTransactionAmount(amount)) {
      throw new Error("Invalid transaction amount");
    }
    const newBalance = this.getBalance() + amount;
    if (newBalance >= 0) {
      this.transactions.push(new Transaction(amount));
      return true;
    }
    return false;
  };

  private validateTransactionAmount = (amount: number) => {
    return typeof amount === "number" && !isNaN(amount);
  };
}

export class Branch {
  private name: string;
  private customers: Customer[];

  constructor(name: string) {
    if (!this.validateBranchName(name)) {
      throw new Error("Invalid branch name");
    }
    this.name = name;
    this.customers = [];
  }

  private validateBranchName(branchName: string) {
    return typeof branchName === "string" && branchName.trim() !== "";
  }

  getName = () => {
    return this.name;
  };

  getCustomers = () => {
    return this.customers;
  };

  addCustomer = (customer: Customer) => {
    if (!this.customers.includes(customer) && this.validateCustomer(customer)) {
      this.customers.push(customer);
      return true;
    }
    return false;
  };

  private validateCustomerId(id: number) {
    return typeof id === "number" && !isNaN(id);
  }

  private validateCustomer(customer: Customer) {
    return (
      customer instanceof Customer &&
      this.validateCustomerId(customer.getId()) &&
      typeof customer.getName() === "string" &&
      customer.getName().trim() !== ""
    );
  }

  validateTransactionAmount(amount: number) {
    return typeof amount === "number" && !isNaN(amount);
  }

  addCustomerTransaction = (customerId: number, amount: number) => {
    if (!this.validateCustomerId(customerId)) {
      throw new Error("Invalid customer ID");
    }
    if (!this.validateTransactionAmount(amount)) {
      throw new Error("Invalid transaction amount");
    }

    const customer = this.customers.find((c) => c.getId() === customerId);
    if (customer) {
      return customer.addTransaction(amount);
    }
  };
}

export class Bank {
  private name: string;
  private branches: Branch[];

  constructor(name: string) {
    if (!this.validateName(name)) {
      throw new Error("Invalid bank name");
    }
    this.name = name;
    this.branches = [];
  }

  validateName(name: string) {
    return typeof name === "string" && name.trim() !== "";
  }

  addBranch = (branch: Branch) => {
    if (this.validateBranch(branch) && !this.branches.includes(branch)) {
      this.branches.push(branch);
      return true;
    }
    return false;
  };

  private validateBranch(branch: Branch) {
    return branch instanceof Branch;
  }

  addCustomer = (branch: Branch, customer: Customer) => {
    if (
      this.branches.includes(branch) &&
      !branch.getCustomers().includes(customer) &&
      this.validateCustomer(customer) &&
      this.validateBranch(branch)
    ) {
      branch.addCustomer(customer);
      return true;
    }
    return false;
  };

  validateCustomer(customer: Customer) {
    return customer instanceof Customer;
  }

  private validateCustomerId(id: number) {
    return typeof id === "number" && !isNaN(id);
  }

  validateTransactionAmount(amount: number) {
    return typeof amount === "number" && !isNaN(amount);
  }

  addCustomerTransaction = (
    branch: Branch,
    customerId: number,
    amount: number
  ) => {
    if (
      this.validateBranch(branch) &&
      this.checkBranch(branch) &&
      this.validateCustomerId(customerId) &&
      this.validateTransactionAmount(amount)
    ) {
      return branch.addCustomerTransaction(customerId, amount);
    }
    return false;
  };

  findBranchByName = (branchName: string) => {
    if (!this.validateName(branchName)) {
      throw new Error("Invalid branch name");
    }
    const result = this.branches.find((branch) => {
      return branch.getName().toLowerCase().includes(branchName.toLowerCase());
    });
    if (result) {
      console.log(`Search result for "${branchName}":  ${result.getName()}.`);
    } else {
      console.log(`\nNo branches found matching "${branchName}".`);
    }
    return result?.getName() || null;
  };

  checkBranch = (branch: Branch) => {
    if (!this.validateBranch(branch)) {
      throw new Error("Invalid branch");
    }
    return this.branches.includes(branch);
  };

  listCustomers = (branch: Branch, includeTransactions: boolean) => {
    if (!this.validateBranch(branch)) {
      throw new Error("Invalid branch");
    }

    if (!this.validateIncludeTransactions(includeTransactions)) {
      throw new Error(
        "Invalid parameter, includeTransactions should be either true or false"
      );
    }

    if (!branch.getCustomers().length) {
      console.log("No customers found.");
      return;
    }
    console.log(
      `\n>>> ${branch.getName()}: ${branch.getCustomers().length} customer(s)`
    );
    branch.getCustomers().forEach((customer) => {
      console.log(`\n\tID: ${customer.getId()}, Name: ${customer.getName()}`);

      if (!customer.getTransactions().length) {
        console.log(
          `\t\tThere is no transactions for ${customer.getName()} (ID: ${customer.getId()}).\n`
        );
      } else if (includeTransactions) {
        customer.getTransactions().forEach((transaction) => {
          console.log(
            `\t\tDate: ${transaction.date?.toLocaleDateString()} Amount: ${
              transaction.amount
            }`
          );
        });
      }
    });
    return null;
  };

  validateIncludeTransactions(includeTransactions: boolean) {
    return typeof includeTransactions === "boolean";
  }
}
