# Inventory Management System - Frontend

A modern, responsive inventory management system built with React, Material-UI, Tailwind CSS, and Framer Motion.

## Features

- 🔐 **Secure Login Flow** - Beautiful authentication page with username/password
- 📊 **Dashboard** - Overview with key metrics, low stock alerts, recent transactions, and quick actions
- 📦 **Product Management** - Add, edit, delete products with auto-generated IDs (INV-100001) and barcodes
- 🔲 **Barcode System** - Generate and print barcode labels with QR code support
- 💰 **POS/Billing** - Real-time barcode scanning interface with cart management
- 📈 **Stock Management** - Track inventory levels, low stock alerts, and adjust quantities
- 📉 **Reports** - Analytics with charts showing sales trends, top products, and revenue metrics

## Tech Stack

- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Recharts** - Charting library for analytics
- **React Router** - Navigation
- **QRCode React** - QR code generation

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Build for Production

Create a production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── DashboardLayout.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Products.js
│   │   ├── POS.js
│   │   ├── StockManagement.js
│   │   └── Reports.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Key Features Implementation

### Auto-generated Product IDs
Products are automatically assigned IDs in the format `INV-100001`, `INV-100002`, etc.

### Barcode System
- Auto-generated barcodes for each product
- QR code generation for location tracking
- Barcode scanning in POS system

### Real-time Stock Validation
- Stock validation during sales
- Low stock alerts (items with stock < 10)
- Out of stock warnings

### Transaction History
All sales are tracked and stored in localStorage with:
- Transaction ID
- Items sold
- Total amount
- Date and time

### Analytics
Comprehensive reports including:
- Sales trends over time
- Revenue charts
- Top selling products
- Average transaction value

## Usage

1. **Login**: Use any username/password to login (mock authentication)
2. **Add Products**: Navigate to Products page and click "Add Product"
3. **Manage Stock**: Go to Stock Management to adjust inventory levels
4. **Process Sales**: Use the POS page to scan barcodes and process transactions
5. **View Reports**: Check the Reports page for analytics and insights

## Data Storage

Currently, the application uses localStorage for data persistence. In a production environment, this should be replaced with a backend API.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

