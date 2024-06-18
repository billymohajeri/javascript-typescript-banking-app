export class Transaction {
  amount;
  date;

  constructor(amount, date = new Date()) {
    if (!this.#validateTransactionAmount(amount)) {
      throw new Error("Invalid transaction amount");
    }
    if (!this.#validateTransactionDate(date)) {
      throw new Error("Invalid transaction date");
    }
    this.amount = amount;
    this.date = date;
  }

  #validateTransactionAmount = (amount) => {
    return typeof amount === "number" && !isNaN(amount);
  };

  #validateTransactionDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };
}

export class Customer {
  #name;
  #id;
  #transactions;

  constructor(name, id) {
    if (!this.#validateCustomerName(name)) {
      throw new Error("Invalid customer name");
    }

    if (!this.#validateCustomerId(id)) {
      throw new Error("Invalid customer ID");
    }

    this.#name = name;
    this.#id = id;
    this.#transactions = [];
  }

  #validateCustomerName = (name) => {
    return typeof name === "string" && name.trim() !== "";
  };

  #validateCustomerId = (id) => {
    return Number.isInteger(id) && id > 0;
  };

  getName = () => {
    return this.#name;
  };

  getId = () => {
    return this.#id;
  };

  getTransactions = () => {
    return this.#transactions;
  };

  getBalance = () => {
    const sum = this.#transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    return sum;
  };

  addTransaction = (amount) => {
    if (!this.#validateTransactionAmount(amount)) {
      throw new Error("Invalid transaction amount");
    }
    const newBalance = this.getBalance() + amount;
    if (newBalance >= 0) {
      this.#transactions.push(new Transaction(amount));
      return true;
    }
    return false;
  };

  #validateTransactionAmount = (amount) => {
    return typeof amount === "number" && !isNaN(amount);
  };
}

export class Branch {
  #name;
  #customers;

  constructor(name) {
    if (!this.#validateBranchName(name)) {
      throw new Error("Invalid branch name");
    }
    this.#name = name;
    this.#customers = [];
  }

  #validateBranchName(branchName) {
    return typeof branchName === "string" && branchName.trim() !== "";
  }

  getName = () => {
    return this.#name;
  };

  getCustomers = () => {
    return this.#customers;
  };

  addCustomer = (customer) => {
    if (
      !this.#customers.includes(customer) &&
      this.#validateCustomer(customer)
    ) {
      this.#customers.push(customer);
      return true;
    }
    return false;
  };

  #validateCustomerId(id) {
    return typeof id === "number" && !isNaN(id);
  }

  #validateCustomer(customer) {
    return (
      customer instanceof Customer &&
      this.#validateCustomerId(customer.getId()) &&
      typeof customer.getName() === "string" &&
      customer.getName().trim() !== ""
    );
  }

  #validateTransactionAmount(amount) {
    return typeof amount === "number" && !isNaN(amount);
  }

  addCustomerTransaction = (customerId, amount) => {
    if (!this.#validateCustomerId) {
      throw new Error("Invalid customer ID");
    }
    if (!this.#validateTransactionAmount) {
      throw new Error("Invalid transaction amount");
    }

    const customer = this.#customers.find((c) => c.getId() === customerId);
    if (customer) {
      return customer.addTransaction(amount);
    }
  };
}

export class Bank {
  #name;
  #branches;

  constructor(name) {
    if (!this.#validateName(name)) {
      throw new Error("Invalid bank name");
    }
    this.#name = name;
    this.#branches = [];
  }

  #validateName(name) {
    return typeof name === "string" && name.trim() !== "";
  }

  addBranch = (branch) => {
    if (this.#validateBranch && !this.#branches.includes(branch)) {
      this.#branches.push(branch);
      return true;
    }
    return false;
  };

  #validateBranch(branch) {
    return branch instanceof Branch;
  }

  addCustomer = (branch, customer) => {
    if (
      this.#branches.includes(branch) &&
      !branch.getCustomers().includes(customer) &&
      this.#validateCustomer(customer) &&
      this.#validateBranch(branch)
    ) {
      branch.addCustomer(customer);
      return true;
    }
    return false;
  };

  #validateCustomer(customer) {
    return customer instanceof Customer;
  }

  #validateCustomerId(id) {
    return typeof id === "number" && !isNaN(id);
  }

  #validateTransactionAmount(amount) {
    return typeof amount === "number" && !isNaN(amount);
  }

  addCustomerTransaction = (branch, customerId, amount) => {
    if (
      this.#validateBranch(branch) &&
      this.checkBranch(branch) &&
      this.#validateCustomerId &&
      this.#validateTransactionAmount
    ) {
      return branch.addCustomerTransaction(customerId, amount);
    }
    return false;
  };

  findBranchByName = (branchName) => {
    if (!this.#validateName(branchName)) {
      throw new Error("Invalid branch name");
    }
    const result = this.#branches.find((branch) => {
      return branch.getName().toLowerCase().includes(branchName.toLowerCase());
    });
    if (result) {
      console.log(`Search result for "${branchName}":  ${result.getName()}.`);
    } else {
      console.log(`\nNo branches found matching "${branchName}".`);
    }
    return result?.getName() || null;
  };

  checkBranch = (branch) => {
    if (!this.#validateBranch(branch)) {
      throw new Error("Invalid branch");
    }
    return this.#branches.includes(branch);
  };

  listCustomers = (branch, includeTransactions) => {
    if (!this.#validateBranch(branch)) {
      throw new Error("Invalid branch");
    }

    if (!this.#validateIncludeTransactions(includeTransactions)) {
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
        // console.log(customer.getTransactions());
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

  #validateIncludeTransactions(includeTransactions) {
    return typeof includeTransactions === "boolean";
  }
}
