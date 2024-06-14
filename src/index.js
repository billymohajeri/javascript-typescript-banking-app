class Transaction {
  amount;
  date;

  Constructor(amount, date) {
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

  getBalance = () => {};

  addTransactions = (amount) => {};
}
