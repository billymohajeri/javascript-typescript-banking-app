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
    if (newBalance < 0) {
      return false;
    } else {
      this.#transactions.push(new Transaction(amount));
      return true;
    }
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
    if (this.#customers.includes(customer)) {
      return false;
    } else {
      this.#customers.push(customer);
      return true;
    }
  };

  addCustomerTransaction = (customerId, amount) => {
    const customer = this.#customers.find((c) => (c.getId() === customerId));
    if (customer) {
      customer.addTransaction(amount);
      return true;
    } else {
      return false;
    }
  };
}
