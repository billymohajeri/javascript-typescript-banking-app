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

const customer1 = new Customer("Alice", 1);

console.log(customer1.getId());
console.log(customer1.getName());
console.log(customer1.getBalance());
console.log(customer1.addTransaction(100));
console.log(customer1.getBalance());
console.log(customer1.addTransaction(-66));
console.log(customer1.getBalance());
console.log(customer1.getTransactions());
