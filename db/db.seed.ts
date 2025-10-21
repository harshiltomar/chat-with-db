import { db } from "./db";
import { productsTable, salesTable } from "./schema";

const productsData = [
    {
        name: "Laptop Pro 15",
        category: "Electronics",
        price: 1299.99,
        stock: 25
    },
    {
        name: "Wireless Mouse",
        category: "Electronics",
        price: 29.99,
        stock: 150
    },
    {
        name: "Office Chair",
        category: "Furniture",
        price: 199.99,
        stock: 45
    },
    {
        name: "Coffee Maker",
        category: "Appliances",
        price: 89.99,
        stock: 30
    },
    {
        name: "Notebook Set",
        category: "Office Supplies",
        price: 12.99,
        stock: 200
    },
    {
        name: "Desk Lamp",
        category: "Furniture",
        price: 45.99,
        stock: 75
    },
    {
        name: "Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        stock: 60
    },
    {
        name: "Stapler",
        category: "Office Supplies",
        price: 8.99,
        stock: 100
    },
    {
        name: "Monitor 24\"",
        category: "Electronics",
        price: 249.99,
        stock: 40
    },
    {
        name: "Filing Cabinet",
        category: "Furniture",
        price: 159.99,
        stock: 20
    }
];

const salesData = [
    {
      product_id: 1, // Laptop Pro 15
      quantity: 2,
      total_amount: 2599.98,
      customer_name: "John Smith",
      region: "North America"
    },
    {
      product_id: 2, // Wireless Mouse
      quantity: 5,
      total_amount: 149.95,
      customer_name: "Sarah Johnson",
      region: "Europe"
    },
    {
      product_id: 3, // Office Chair
      quantity: 1,
      total_amount: 199.99,
      customer_name: "Mike Davis",
      region: "North America"
    },
    {
      product_id: 1, // Laptop Pro 15
      quantity: 1,
      total_amount: 1299.99,
      customer_name: "Emily Chen",
      region: "Asia"
    },
    {
      product_id: 4, // Coffee Maker
      quantity: 3,
      total_amount: 269.97,
      customer_name: "David Wilson",
      region: "Europe"
    },
    {
      product_id: 6, // Desk Lamp
      quantity: 4,
      total_amount: 183.96,
      customer_name: "Lisa Anderson",
      region: "North America"
    },
    {
      product_id: 7, // Bluetooth Headphones
      quantity: 2,
      total_amount: 159.98,
      customer_name: "Tom Brown",
      region: "Asia"
    },
    {
      product_id: 5, // Notebook Set
      quantity: 10,
      total_amount: 129.90,
      customer_name: "Rachel Green",
      region: "Europe"
    },
    {
      product_id: 9, // Monitor 24"
      quantity: 1,
      total_amount: 249.99,
      customer_name: "James Taylor",
      region: "North America"
    },
    {
      product_id: 8, // Stapler
      quantity: 15,
      total_amount: 134.85,
      customer_name: "Anna Martinez",
      region: "South America"
    }
];

export const seed = async () => {

    await db.insert(productsTable).values(productsData);
    await db.insert(salesTable).values(salesData);
};