class Transaction {
  amount;
  date;

  constructor(amount, date = new Date()) {
    this.amount = amount;
    this.date = date;
  }
}

class Customer {
  #name;
  #id;
  #transactions;

  constructor(name, id) {
    this.#name = name;
    this.#id = id;
    this.#transactions = [];
  }

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
    return this.#transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  addTransaction = (amount) => {
    const newBalance = this.getBalance() + amount;
    if (newBalance >= 0) {
      this.#transactions.push(new Transaction(amount));
      return true;
    }
    return false;
  };
}

class Branch {
  #name;
  #customers;

  constructor(name) {
    this.#name = name;
    this.#customers = [];
  }

  getName = () => {
    return this.#name;
  };

  getCustomers = () => {
    return this.#customers;
  };

  addCustomer = (customer) => {
    if (!this.#customers.includes(customer)) {
      this.#customers.push(customer);
      return true;
    }
    return false;
  };

  addCustomerTransaction = (customerId, amount) => {
    const customer = this.#customers.find((c) => c.getId() === customerId);
    if (customer) {
      customer.addTransaction(amount);
      return true;
    }
    return false;
  };
}

class Bank {
  #name;
  #branches;

  constructor(name) {
    this.#name = name;
    this.#branches = [];
  }

  addBranch = (branch) => {
    if (!this.#branches.includes(branch)) {
      this.#branches.push(branch);
      return true;
    }
    return false;
  };

  addCustomer = (branch, customer) => {
    if (
      this.#branches.includes(branch) &&
      !branch.getCustomers().includes(customer)
    ) {
      branch.addCustomer(customer);
      return true;
    }
    return false;
  };

  addCustomerTransaction = (branch, customerId, amount) => {
    if (this.checkBranch(branch)) {
      return branch.addCustomerTransaction(customerId, amount);
    }
    return false;
  };

  findBranchByName = (branchName) => {
    const result = this.#branches.find(
      (branch) => branch.getName() === branchName
    );
    return result || null;
  };

  checkBranch = (branch) => {
    return this.#branches.includes(branch);
  };

  listCustomers = (branch, includeTransactions) => {
    if (!branch.getCustomers().length) {
      console.log("No customers found.");
      return;
    }

    branch.getCustomers().forEach((customer) => {
      console.log(`ID: ${customer.getId()} Name: ${customer.getName()}`);

      if (includeTransactions) {
        customer.getTransactions().forEach((transaction) => {
          console.log(
            `Date: ${transaction.date.toLocaleDateString()} Amount:${
              transaction.amount
            }`
          );
        });
      }
    });
  };
}
