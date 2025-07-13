'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Phone, 
  Camera, 
  Save,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Trash2,
  Settings,
  Palette,
  Moon,
  Sun
} from 'lucide-react';

interface ProfileProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

export default function Profile({ user, onUpdateUser }: ProfileProps) {
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || '',
    logo: user?.logo || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(user?.logo || '');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('swiftbill_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...formData
      };
      
      onUpdateUser(updatedUser);
      localStorage.setItem('swiftbill_user', JSON.stringify(updatedUser));
      
      setSuccessMessage('Profile updated successfully!');
      setIsLoading(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('swiftbill_theme', newTheme);
    // In a real app, you would apply the theme to the document
  };

  const exportData = () => {
    const data = {
      user: user,
      clients: JSON.parse(localStorage.getItem('swiftbill_clients') || '[]'),
      items: JSON.parse(localStorage.getItem('swiftbill_items') || '[]'),
      invoices: JSON.parse(localStorage.getItem('swiftbill_invoices') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swiftbill-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.user) {
            onUpdateUser(data.user);
            localStorage.setItem('swiftbill_user', JSON.stringify(data.user));
          }
          if (data.clients) {
            localStorage.setItem('swiftbill_clients', JSON.stringify(data.clients));
          }
          if (data.items) {
            localStorage.setItem('swiftbill_items', JSON.stringify(data.items));
          }
          if (data.invoices) {
            localStorage.setItem('swiftbill_invoices', JSON.stringify(data.invoices));
          }
          setSuccessMessage('Data imported successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
          setErrors({ import: 'Invalid backup file' });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400 text-lg">
          Manage your account settings and preferences
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Information */}
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Company Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`input-field w-full ${errors.companyName ? 'border-red-500' : ''}`}
                    placeholder="Enter your company name"
                  />
                  {errors.companyName && (
                    <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    Business Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Enter your business address"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Company Logo */}
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Company Logo</h2>
            </div>
            
            <div className="space-y-6">
              {logoPreview ? (
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="file-input">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <span className="file-input-label cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Logo
                      </span>
                    </label>
                    <button
                      onClick={removeLogo}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <label className="file-input">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <span className="file-input-label cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </span>
                  </label>
                  <p className="text-gray-400 text-sm mt-2">
                    Recommended: 200x200px, PNG or JPG
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Theme</h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Moon className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Dark Mode</span>
                </div>
                {theme === 'dark' && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </button>
              
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  theme === 'light' 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sun className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Light Mode</span>
                </div>
                {theme === 'light' && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Data Management</h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
              <label className="file-input w-full">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
                <span className="file-input-label w-full cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </span>
              </label>
              
              {errors.import && (
                <p className="text-red-400 text-sm">{errors.import}</p>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Account Info</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{user?.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{user?.companyName}</span>
              </div>
              
              {user?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{user.phone}</span>
                </div>
              )}
              
              {user?.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm line-clamp-2">{user.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 