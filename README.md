# Invoice Generator SaaS

A comprehensive, professional invoice generator built with Next.js, TypeScript, and Tailwind CSS. This SaaS application provides all the tools freelancers and small businesses need to create, manage, and track invoices efficiently.

## 🚀 Features

### **User Management**
- ✅ User authentication (sign-up/login)
- ✅ Company profile management
- ✅ Logo upload and customization
- ✅ Company information for invoices

### **Client Management**
- ✅ Add, edit, and delete clients
- ✅ Complete client profiles (name, contact person, email, phone, address, tax ID)
- ✅ Client search and organization

### **Item/Service Management**
- ✅ Create and manage product/service catalog
- ✅ Set standard rates and units
- ✅ Detailed descriptions and pricing

### **Invoice Management**
- ✅ Create professional invoices with line items
- ✅ Auto-generated sequential invoice numbers
- ✅ Tax calculation (percentage-based)
- ✅ Discount support (percentage or fixed amount)
- ✅ Multiple invoice statuses (Draft, Sent, Paid, Overdue, Cancelled)
- ✅ Edit, duplicate, and delete invoices
- ✅ Notes and payment instructions
- ✅ Due date management

### **Dashboard & Analytics**
- ✅ Overview statistics (total invoices, paid amount, outstanding amount, client count)
- ✅ Recent invoices list
- ✅ Status-based filtering

### **Export & Sharing**
- ✅ PDF export functionality
- ✅ Professional invoice templates
- ✅ Print-ready formatting

### **Data Persistence**
- ✅ Local storage for all data
- ✅ Automatic data saving
- ✅ No data loss on page refresh

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React hooks with local storage
- **PDF Export**: Browser print functionality (print-to-PDF)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Getting Started

### Installation

1. **Clone or navigate to the project directory**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📖 Usage Guide

### 1. **Getting Started**
   - Sign up with your email and company information
   - Complete your company profile in the Profile section
   - Upload your company logo for professional invoices

### 2. **Managing Clients**
   - Navigate to the Clients tab
   - Add your clients with complete contact information
   - Edit or delete clients as needed

### 3. **Setting Up Items/Services**
   - Go to the Items/Services tab
   - Create your product or service catalog
   - Set standard rates and descriptions

### 4. **Creating Invoices**
   - Click "Create Invoice" in the Invoices tab
   - Select a client from your client list
   - Add items from your catalog or create custom items
   - Set tax rates and discounts
   - Add notes and payment instructions
   - Save your invoice

### 5. **Managing Invoices**
   - View all invoices in the list
   - Change invoice status (Draft → Sent → Paid)
   - Edit existing invoices
   - Duplicate invoices for similar clients
   - Export invoices as PDF
   - Delete invoices when needed

### 6. **Dashboard Overview**
   - Monitor your business metrics
   - Track outstanding payments
   - View recent invoice activity

## 🏗️ Project Structure

```
invoice-generator/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx      # Dashboard with statistics
│   │   ├── Clients.tsx        # Client management
│   │   ├── Items.tsx          # Item/service management
│   │   ├── Invoices.tsx       # Invoice creation and management
│   │   ├── Profile.tsx        # User profile management
│   │   └── Login.tsx          # Authentication
│   ├── globals.css            # Global styles with Tailwind
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main application page
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 💾 Data Storage

The application uses browser local storage to persist all data:
- **User Profile**: Company information and settings
- **Clients**: Complete client database
- **Items/Services**: Product and service catalog
- **Invoices**: All invoice data and history

All data is automatically saved and persists between browser sessions.

## 🎨 Features in Detail

### **Professional Invoice Features**
- Sequential invoice numbering (INV-001, INV-002, etc.)
- Multiple tax calculation options
- Flexible discount system (percentage or fixed amount)
- Due date management
- Status tracking (Draft, Sent, Paid, Overdue, Cancelled)
- Notes and payment instructions
- Professional PDF export

### **User Experience**
- Intuitive tab-based navigation
- Responsive design for all devices
- Real-time calculations
- Form validation and error handling
- Confirmation dialogs for destructive actions
- Professional UI with Tailwind CSS

### **Business Intelligence**
- Dashboard with key metrics
- Outstanding payment tracking
- Invoice status overview
- Recent activity monitoring

## 🔒 Security & Privacy

- All data is stored locally in your browser
- No external servers or data transmission
- Complete privacy and data ownership
- No subscription fees or limitations

## 🚀 Future Enhancements

Potential features for future versions:
- Cloud storage and synchronization
- Email integration for sending invoices
- Payment gateway integration
- Advanced reporting and analytics
- Multi-currency support
- Invoice templates customization
- Client portal for invoice viewing
- Automated payment reminders

## 🤝 Contributing

This is a free, open-source project. Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Share with other freelancers and small businesses

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for freelancers and small businesses** 