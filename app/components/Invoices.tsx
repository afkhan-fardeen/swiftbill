'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  Mail, 
  Eye,
  Calendar,
  DollarSign,
  Users,
  Package,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InvoicesProps {
  user: any;
}

interface InvoiceItem {
  id: string;
  itemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes: string;
  paymentInstructions: string;
  currency: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Item {
  id: string;
  name: string;
  unitPrice: number;
  unit: string;
}

export default function Invoices({ user }: InvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [] as InvoiceItem[],
    taxRate: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    notes: '',
    paymentInstructions: '',
    currency: 'USD'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedInvoices = localStorage.getItem('swiftbill_invoices');
    const savedClients = localStorage.getItem('swiftbill_clients');
    const savedItems = localStorage.getItem('swiftbill_items');

    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedItems) setItems(JSON.parse(savedItems));
  }, []);

  useEffect(() => {
    localStorage.setItem('swiftbill_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const removeInvoiceItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const discountAmount = formData.discountType === 'percentage' 
      ? subtotal * (formData.discountValue / 100)
      : formData.discountValue;
    const total = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, total };
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { subtotal, taxAmount, discountAmount, total } = calculateTotals();
    const selectedClient = clients.find(c => c.id === formData.clientId);

    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(invoice => 
        invoice.id === editingInvoice.id 
          ? {
              ...invoice,
              ...formData,
              clientName: selectedClient?.name || '',
              subtotal,
              taxAmount,
              discountAmount,
              total
            }
          : invoice
      ));
      setSuccessMessage('Invoice updated successfully!');
    } else {
      // Add new invoice
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        clientId: formData.clientId,
        clientName: selectedClient?.name || '',
        date: formData.date,
        dueDate: formData.dueDate,
        items: formData.items,
        subtotal,
        taxRate: formData.taxRate,
        taxAmount,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        discountAmount,
        total,
        status: 'draft',
        notes: formData.notes,
        paymentInstructions: formData.paymentInstructions,
        currency: formData.currency
      };
      setInvoices(prev => [...prev, newInvoice]);
      setSuccessMessage('Invoice created successfully!');
    }

    // Reset form
    setFormData({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      taxRate: 0,
      discountType: 'percentage',
      discountValue: 0,
      notes: '',
      paymentInstructions: '',
      currency: 'USD'
    });
    setEditingInvoice(null);
    setShowForm(false);
    setErrors({});

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      clientId: invoice.clientId,
      date: invoice.date,
      dueDate: invoice.dueDate,
      items: invoice.items,
      taxRate: invoice.taxRate,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      notes: invoice.notes,
      paymentInstructions: invoice.paymentInstructions,
      currency: invoice.currency
    });
    setShowForm(true);
  };

  const handleDelete = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      setSuccessMessage('Invoice deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'sent':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'sent':
        return 'status-pending';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-draft';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2">Invoices</h1>
        <p className="text-gray-400 text-lg">
          Create, manage, and track your invoices
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="message-success animate-slide-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Search, Filter, and Add Button */}
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              {showStatusFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showStatusFilter && (
              <div className="absolute top-full left-0 mt-2 card p-2 min-w-48 z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      statusFilter === option.value
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => {
            setShowForm(true);
            setEditingInvoice(null);
            setFormData({
              clientId: '',
              date: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              items: [],
              taxRate: 0,
              discountType: 'percentage',
              discountValue: 0,
              notes: '',
              paymentInstructions: '',
              currency: 'USD'
            });
            setErrors({});
          }}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Invoice Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingInvoice(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Client *
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    className={`select-field w-full ${errors.clientId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-red-400 text-sm mt-1">{errors.clientId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
                  <button
                    type="button"
                    onClick={addInvoiceItem}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                {formData.items.length === 0 ? (
                  <div className="card p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No items added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={item.id} className="card p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-2">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="input-field w-full"
                              placeholder="Item description"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="input-field w-full"
                              min="0"
                              step="1"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Unit Price
                            </label>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="input-field w-full"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <span className="text-lg font-semibold text-white">
                            Total: {formatCurrency(item.total)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.items && (
                  <p className="text-red-400 text-sm mt-1">{errors.items}</p>
                )}
              </div>

              {/* Totals */}
              {formData.items.length > 0 && (
                <div className="card p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white font-semibold">
                          {formatCurrency(calculateTotals().subtotal)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-white mb-2">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleInputChange}
                            className="input-field w-full"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <div className="flex items-end">
                          <span className="text-white font-semibold">
                            {formatCurrency(calculateTotals().taxAmount)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-white mb-2">
                            Discount
                          </label>
                          <div className="flex space-x-2">
                            <select
                              name="discountType"
                              value={formData.discountType}
                              onChange={handleInputChange}
                              className="select-field flex-1"
                            >
                              <option value="percentage">%</option>
                              <option value="fixed">$</option>
                            </select>
                            <input
                              type="number"
                              name="discountValue"
                              value={formData.discountValue}
                              onChange={handleInputChange}
                              className="input-field flex-1"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <span className="text-white font-semibold">
                            -{formatCurrency(calculateTotals().discountAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-3xl font-bold text-white">
                          {formatCurrency(calculateTotals().total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes and Payment Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Additional notes for the client"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Payment Instructions
                  </label>
                  <textarea
                    name="paymentInstructions"
                    value={formData.paymentInstructions}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Payment instructions for the client"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingInvoice(null);
                    setErrors({});
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <div className="table-container animate-fade-in">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-white">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{invoice.clientName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{formatDate(invoice.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{formatDate(invoice.dueDate)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(invoice.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-400 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters.'
              : 'Start by creating your first invoice to get paid faster.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingInvoice(null);
                setFormData({
                  clientId: '',
                  date: new Date().toISOString().split('T')[0],
                  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  items: [],
                  taxRate: 0,
                  discountType: 'percentage',
                  discountValue: 0,
                  notes: '',
                  paymentInstructions: '',
                  currency: 'USD'
                });
                setErrors({});
              }}
              className="btn-primary"
            >
              Create Your First Invoice
            </button>
          )}
        </div>
      )}
    </div>
  );
} 