"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Transaction_validateTransactionAmount, _Transaction_validateTransactionDate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = exports.Branch = exports.Customer = exports.Transaction = void 0;
class Transaction {
    constructor(amount, date = new Date()) {
        _Transaction_validateTransactionAmount.set(this, (amount) => {
            return typeof amount === "number" && !isNaN(amount);
        });
        _Transaction_validateTransactionDate.set(this, (date) => {
            return date instanceof Date;
        });
        if (!__classPrivateFieldGet(this, _Transaction_validateTransactionAmount, "f").call(this, amount)) {
            throw new Error("Invalid transaction amount");
        }
        if (!__classPrivateFieldGet(this, _Transaction_validateTransactionDate, "f").call(this, date)) {
            throw new Error("Invalid transaction date");
        }
        this.amount = amount;
        this.date = date;
    }
}
exports.Transaction = Transaction;
_Transaction_validateTransactionAmount = new WeakMap(), _Transaction_validateTransactionDate = new WeakMap();
class Customer {
    constructor(name, id) {
        this.validateCustomerName = (name) => {
            return typeof name === "string" && name.trim() !== "";
        };
        this.validateCustomerId = (id) => {
            return Number.isInteger(id) && id > 0;
        };
        this.getName = () => {
            return this.name;
        };
        this.getId = () => {
            return this.id;
        };
        this.getTransactions = () => {
            return this.transactions;
        };
        this.getBalance = () => {
            const sum = this.transactions.reduce((total, transaction) => total + transaction.amount, 0);
            return sum;
        };
        this.addTransaction = (amount) => {
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
        this.validateTransactionAmount = (amount) => {
            return typeof amount === "number" && !isNaN(amount);
        };
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
}
exports.Customer = Customer;
class Branch {
    constructor(name) {
        this.getName = () => {
            return this.name;
        };
        this.getCustomers = () => {
            return this.customers;
        };
        this.addCustomer = (customer) => {
            if (!this.customers.includes(customer) && this.validateCustomer(customer)) {
                this.customers.push(customer);
                return true;
            }
            return false;
        };
        this.addCustomerTransaction = (customerId, amount) => {
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
        if (!this.validateBranchName(name)) {
            throw new Error("Invalid branch name");
        }
        this.name = name;
        this.customers = [];
    }
    validateBranchName(branchName) {
        return typeof branchName === "string" && branchName.trim() !== "";
    }
    validateCustomerId(id) {
        return typeof id === "number" && !isNaN(id);
    }
    validateCustomer(customer) {
        return (customer instanceof Customer &&
            this.validateCustomerId(customer.getId()) &&
            typeof customer.getName() === "string" &&
            customer.getName().trim() !== "");
    }
    validateTransactionAmount(amount) {
        return typeof amount === "number" && !isNaN(amount);
    }
}
exports.Branch = Branch;
class Bank {
    constructor(name) {
        this.addBranch = (branch) => {
            if (this.validateBranch(branch) && !this.branches.includes(branch)) {
                this.branches.push(branch);
                return true;
            }
            return false;
        };
        this.addCustomer = (branch, customer) => {
            if (this.branches.includes(branch) &&
                !branch.getCustomers().includes(customer) &&
                this.validateCustomer(customer) &&
                this.validateBranch(branch)) {
                branch.addCustomer(customer);
                return true;
            }
            return false;
        };
        this.addCustomerTransaction = (branch, customerId, amount) => {
            if (this.validateBranch(branch) &&
                this.checkBranch(branch) &&
                this.validateCustomerId(customerId) &&
                this.validateTransactionAmount(amount)) {
                return branch.addCustomerTransaction(customerId, amount);
            }
            return false;
        };
        this.findBranchByName = (branchName) => {
            if (!this.validateName(branchName)) {
                throw new Error("Invalid branch name");
            }
            const result = this.branches.find((branch) => {
                return branch.getName().toLowerCase().includes(branchName.toLowerCase());
            });
            if (result) {
                console.log(`Search result for "${branchName}":  ${result.getName()}.`);
            }
            else {
                console.log(`\nNo branches found matching "${branchName}".`);
            }
            return (result === null || result === void 0 ? void 0 : result.getName()) || null;
        };
        this.checkBranch = (branch) => {
            if (!this.validateBranch(branch)) {
                throw new Error("Invalid branch");
            }
            return this.branches.includes(branch);
        };
        this.listCustomers = (branch, includeTransactions) => {
            if (!this.validateBranch(branch)) {
                throw new Error("Invalid branch");
            }
            if (!this.validateIncludeTransactions(includeTransactions)) {
                throw new Error("Invalid parameter, includeTransactions should be either true or false");
            }
            if (!branch.getCustomers().length) {
                console.log("No customers found.");
                return;
            }
            console.log(`\n>>> ${branch.getName()}: ${branch.getCustomers().length} customer(s)`);
            branch.getCustomers().forEach((customer) => {
                console.log(`\n\tID: ${customer.getId()}, Name: ${customer.getName()}`);
                if (!customer.getTransactions().length) {
                    console.log(`\t\tThere is no transactions for ${customer.getName()} (ID: ${customer.getId()}).\n`);
                }
                else if (includeTransactions) {
                    customer.getTransactions().forEach((transaction) => {
                        var _a;
                        console.log(`\t\tDate: ${(_a = transaction.date) === null || _a === void 0 ? void 0 : _a.toLocaleDateString()} Amount: ${transaction.amount}`);
                    });
                }
            });
            return null;
        };
        if (!this.validateName(name)) {
            throw new Error("Invalid bank name");
        }
        this.name = name;
        this.branches = [];
    }
    validateName(name) {
        return typeof name === "string" && name.trim() !== "";
    }
    validateBranch(branch) {
        return branch instanceof Branch;
    }
    validateCustomer(customer) {
        return customer instanceof Customer;
    }
    validateCustomerId(id) {
        return typeof id === "number" && !isNaN(id);
    }
    validateTransactionAmount(amount) {
        return typeof amount === "number" && !isNaN(amount);
    }
    validateIncludeTransactions(includeTransactions) {
        return typeof includeTransactions === "boolean";
    }
}
exports.Bank = Bank;
