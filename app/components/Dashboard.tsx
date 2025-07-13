'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Eye
} from 'lucide-react';

interface DashboardProps {
  user: any;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
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
}

export default function Dashboard({ user }: DashboardProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedInvoices = localStorage.getItem('swiftbill_invoices');
    const savedClients = localStorage.getItem('swiftbill_clients');
    const savedItems = localStorage.getItem('swiftbill_items');

    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices);
      setInvoices(parsedInvoices);
      setRecentInvoices(parsedInvoices.slice(0, 5));
    }
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedItems) setItems(JSON.parse(savedItems));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-400" />;
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
      case 'pending':
      case 'sent':
        return 'status-pending';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-draft';
    }
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

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'pending').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.companyName || user?.email}
        </h1>
        <p className="text-gray-400 text-lg">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Total Revenue */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-2 text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Amount</p>
              <p className="text-3xl font-bold text-white mt-2">{formatCurrency(pendingAmount)}</p>
              <div className="flex items-center mt-2 text-yellow-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{pendingInvoices} invoices</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Overdue Amount</p>
              <p className="text-3xl font-bold text-white mt-2">{formatCurrency(overdueAmount)}</p>
              <div className="flex items-center mt-2 text-red-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{overdueInvoices} invoices</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-white mt-2">{clients.length}</p>
              <div className="flex items-center mt-2 text-blue-400">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">+3 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Revenue Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">This Month</span>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Last Month</span>
            </div>
          </div>
          
          {/* Simple Chart */}
          <div className="space-y-4">
            {[65, 80, 45, 90, 75, 85, 70].map((height, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg flex-1"
                  style={{ height: `${height}px` }}
                ></div>
                <div 
                  className="bg-gradient-to-t from-gray-500 to-gray-600 rounded-t-lg flex-1"
                  style={{ height: `${height * 0.8}px` }}
                ></div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Growth</p>
              <p className="text-2xl font-bold text-green-400">+12.5%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Add Client</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">Invoice #001 paid</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-white">New client added</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-white">Invoice #002 sent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Recent Invoices</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
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
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice) => (
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
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No invoices yet</h3>
                      <p className="text-gray-400 mb-4">Create your first invoice to get started</p>
                      <button className="btn-primary">
                        Create Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 