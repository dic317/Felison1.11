import { users, transactions, events, type User, type InsertUser, type Transaction, type InsertTransaction, type Event, type InsertEvent } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Transaction operations
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<boolean>;

  // Event operations
  getUserEvents(userId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private events: Map<number, Event>;
  private currentUserId: number;
  private currentTransactionId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.events = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentEventId = 1;

    // Create a default user for demo purposes
    this.createUser({
      username: "demo",
      password: "demo123",
      totalAssets: "47890.00",
      monthlySavings: "3240.00",
      creditScore: 785
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      totalAssets: insertUser.totalAssets ?? "0",
      monthlySavings: insertUser.monthlySavings ?? "0",
      creditScore: insertUser.creditScore ?? 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId,
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      id,
      type: insertTransaction.type,
      userId: insertTransaction.userId,
      category: insertTransaction.category,
      amount: insertTransaction.amount,
      description: insertTransaction.description ?? null,
      date: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async getUserEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId,
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = {
      id,
      userId: insertEvent.userId,
      title: insertEvent.title,
      description: insertEvent.description ?? null,
      date: insertEvent.date,
      type: insertEvent.type ?? "appointment"
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
