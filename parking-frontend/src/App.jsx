import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Clock, 
  DollarSign, 
  Users, 
  ParkingCircle,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Home,
  BarChart3
} from 'lucide-react';

// Context para el estado global
const AppContext = createContext();

// Hook personalizado para usar el contexto
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Simulación de API (reemplazar con tu backend real)
const mockAPI = {
  getVehicles: () => Promise.resolve([
    { id: 1, placa: 'ABC123', tipo: 'carro', propietario: 'Juan Pérez', estado: 'estacionado', horaIngreso: '2024-06-01T08:00:00Z' },
    { id: 2, placa: 'XYZ789', tipo: 'moto', propietario: 'María García', estado: 'disponible', horaIngreso: null },
    { id: 3, placa: 'DEF456', tipo: 'carro', propietario: 'Carlos López', estado: 'estacionado', horaIngreso: '2024-06-01T10:30:00Z' }
  ]),
  
  getParkingSpots: () => Promise.resolve([
    { id: 1, numero: 'A1', tipo: 'carro', ocupado: true, vehiculo: 'ABC123' },
    { id: 2, numero: 'A2', tipo: 'carro', ocupado: false, vehiculo: null },
    { id: 3, numero: 'B1', tipo: 'moto', ocupado: true, vehiculo: 'XYZ789' },
    { id: 4, numero: 'B2', tipo: 'moto', ocupado: false, vehiculo: null }
  ]),
  
  addVehicle: (vehicle) => Promise.resolve({ id: Date.now(), ...vehicle }),
  
  checkIn: (data) => Promise.resolve({ success: true, message: 'Vehículo ingresado correctamente' }),
  
  checkOut: (vehicleId) => Promise.resolve({ 
    success: true, 
    message: 'Vehículo retirado correctamente',
    total: Math.floor(Math.random() * 10000) + 2000
  })
};

// Componente Provider
const AppProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesData, spotsData] = await Promise.all([
        mockAPI.getVehicles(),
        mockAPI.getParkingSpots()
      ]);
      setVehicles(vehiclesData);
      setParkingSpots(spotsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData) => {
    try {
      const newVehicle = await mockAPI.addVehicle(vehicleData);
      setVehicles(prev => [...prev, newVehicle]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const checkInVehicle = async (data) => {
    try {
      const result = await mockAPI.checkIn(data);
      await loadData();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const checkOutVehicle = async (vehicleId) => {
    try {
      const result = await mockAPI.checkOut(vehicleId);
      await loadData();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AppContext.Provider value={{
      vehicles,
      parkingSpots,
      loading,
      currentView,
      setCurrentView,
      sidebarOpen,
      setSidebarOpen,
      addVehicle,
      checkInVehicle,
      checkOutVehicle,
      loadData
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Componente Header
const Header = () => {
  const { setSidebarOpen, currentView } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'vehicles': return 'Gestión de Vehículos';
      case 'parking': return 'Estado del Parqueadero';
      case 'checkin': return 'Registro de Ingreso';
      case 'checkout': return 'Registro de Salida';
      default: return 'Sistema de Parqueadero';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente Sidebar
const Sidebar = () => {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'vehicles', label: 'Vehículos', icon: Car },
    { id: 'parking', label: 'Parqueadero', icon: ParkingCircle },
    { id: 'checkin', label: 'Ingreso', icon: CheckCircle },
    { id: 'checkout', label: 'Salida', icon: XCircle },
    { id: 'reports', label: 'Reportes', icon: BarChart3 }
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Parqueadero</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                  ${currentView === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

// Componente Dashboard
const Dashboard = () => {
  const { vehicles, parkingSpots } = useApp();

  const stats = {
    totalSpots: parkingSpots.length,
    occupiedSpots: parkingSpots.filter(spot => spot.ocupado).length,
    totalVehicles: vehicles.length,
    parkedVehicles: vehicles.filter(v => v.estado === 'estacionado').length
  };

  const occupancyRate = stats.totalSpots > 0 ? (stats.occupiedSpots / stats.totalSpots * 100).toFixed(1) : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espacios Totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSpots}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ParkingCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espacios Ocupados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupiedSpots}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Car className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ocupación</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3 className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehículos Registrados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Vehículos Estacionados</h3>
          <div className="space-y-3">
            {vehicles.filter(v => v.estado === 'estacionado').slice(0, 5).map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{vehicle.placa}</p>
                  <p className="text-sm text-gray-600">{vehicle.propietario}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ingreso</p>
                  <p className="text-sm font-medium">
                    {vehicle.horaIngreso ? new Date(vehicle.horaIngreso).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Estado del Parqueadero</h3>
          <div className="grid grid-cols-4 gap-2">
            {parkingSpots.map(spot => (
              <div
                key={spot.id}
                className={`
                  p-3 rounded-lg text-center text-sm font-medium
                  ${spot.ocupado 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                  }
                `}
              >
                <div>{spot.numero}</div>
                <div className="text-xs mt-1">
                  {spot.ocupado ? spot.vehiculo : 'Libre'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Gestión de Vehículos
const VehicleManagement = () => {
  const { vehicles, addVehicle, loading } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    placa: '',
    tipo: 'carro',
    propietario: '',
    telefono: '',
    email: ''
  });

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addVehicle({...formData, estado: 'disponible'});
    if (result.success) {
      setFormData({ placa: '', tipo: 'carro', propietario: '', telefono: '', email: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header con búsqueda y botón agregar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por placa o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Agregar Vehículo</span>
        </button>
      </div>

      {/* Modal para agregar vehículo */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Vehículo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
                <input
                  type="text"
                  value={formData.propietario}
                  onChange={(e) => setFormData({...formData, propietario: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de vehículos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingreso</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.tipo === 'carro' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {vehicle.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.propietario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.estado === 'estacionado' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {vehicle.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.horaIngreso ? new Date(vehicle.horaIngreso).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente CheckIn
const CheckIn = () => {
  const { vehicles, parkingSpots, checkInVehicle } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSpot, setSelectedSpot] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const availableVehicles = vehicles.filter(v => v.estado === 'disponible');
  const availableSpots = parkingSpots.filter(s => !s.ocupado);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedSpot) return;

    const result = await checkInVehicle({
      vehicleId: selectedVehicle,
      spotId: selectedSpot
    });

    if (result.success) {
      setMessage('Vehículo ingresado correctamente');
      setMessageType('success');
      setSelectedVehicle('');
      setSelectedSpot('');
    } else {
      setMessage(result.error || 'Error al ingresar vehículo');
      setMessageType('error');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Registro de Ingreso</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Vehículo
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Seleccionar vehículo --</option>
              {availableVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.placa} - {vehicle.propietario} ({vehicle.tipo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Espacio
            </label>
            <select
              value={selectedSpot}
              onChange={(e) => setSelectedSpot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Seleccionar espacio --</option>
              {availableSpots.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.numero} ({spot.tipo})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <CheckCircle size={20} />
            <span>Registrar Ingreso</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente CheckOut
const CheckOut = () => {
  const { vehicles, checkOutVehicle } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const parkedVehicles = vehicles.filter(v => v.estado === 'estacionado');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const result = await checkOutVehicle(selectedVehicle);

    if (result.success) {
      setMessage('Vehículo retirado correctamente');
      setMessageType('success');
      setPaymentDetails({ total: result.total });
      setSelectedVehicle('');
    } else {
      setMessage(result.error || 'Error al retirar vehículo');
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage('');
      setPaymentDetails(null);
    }, 10000);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Registro de Salida</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
            {paymentDetails && (
              <div className="mt-2 p-3 bg-white rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total a pagar:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${paymentDetails.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Vehículo a Retirar
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Seleccionar vehículo --</option>
              {parkedVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.placa} - {vehicle.propietario} 
                  {vehicle.horaIngreso && ` (${new Date(vehicle.horaIngreso).toLocaleString()})`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <XCircle size={20} />
            <span>Registrar Salida</span>
          </button>
        </form>

        {/* Información de vehículos estacionados */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Vehículos Actualmente Estacionados</h3>
          <div className="space-y-2">
            {parkedVehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{vehicle.placa}</p>
                  <p className="text-sm text-gray-600">{vehicle.propietario}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tiempo estacionado</p>
                  <p className="text-sm font-medium">
                    {vehicle.horaIngreso 
                      ? Math.round((new Date() - new Date(vehicle.horaIngreso)) / (1000 * 60 * 60)) + 'h'
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            ))}
            {parkedVehicles.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay vehículos estacionados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Estado del Parqueadero
const ParkingStatus = () => {
  const { parkingSpots, vehicles } = useApp();

  const getVehicleInfo = (vehiclePlaca) => {
    return vehicles.find(v => v.placa === vehiclePlaca);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Estado del Parqueadero</h2>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Ocupado</span>
          </div>
        </div>

        {/* Grid de espacios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {parkingSpots.map(spot => {
            const vehicleInfo = spot.ocupado ? getVehicleInfo(spot.vehiculo) : null;
            
            return (
              <div
                key={spot.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all cursor-pointer
                  ${spot.ocupado 
                    ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                    : 'bg-green-100 border-green-300 hover:bg-green-200'
                  }
                `}
                title={spot.ocupado ? `Ocupado por: ${spot.vehiculo}` : 'Espacio disponible'}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">{spot.numero}</div>
                  <div className="text-xs text-gray-600 capitalize">{spot.tipo}</div>
                  {spot.ocupado && (
                    <div className="mt-2">
                      <div className="text-xs font-medium">{spot.vehiculo}</div>
                      {vehicleInfo && (
                        <div className="text-xs text-gray-500 truncate">
                          {vehicleInfo.propietario}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Indicador de estado */}
                <div className={`
                  absolute top-1 right-1 w-3 h-3 rounded-full
                  ${spot.ocupado ? 'bg-red-500' : 'bg-green-500'}
                `}></div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">{parkingSpots.length}</div>
            <div className="text-sm text-gray-600">Total Espacios</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {parkingSpots.filter(s => !s.ocupado).length}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {parkingSpots.filter(s => s.ocupado).length}
            </div>
            <div className="text-sm text-gray-600">Ocupados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Reportes
const Reports = () => {
  const { vehicles, parkingSpots } = useApp();
  
  const generateDailyReport = () => {
    const today = new Date().toDateString();
    const todayVehicles = vehicles.filter(v => 
      v.horaIngreso && new Date(v.horaIngreso).toDateString() === today
    );
    
    return {
      ingresos: todayVehicles.length,
      ocupacionActual: parkingSpots.filter(s => s.ocupado).length,
      ingresosPorTipo: {
        carro: todayVehicles.filter(v => v.tipo === 'carro').length,
        moto: todayVehicles.filter(v => v.tipo === 'moto').length
      }
    };
  };

  const dailyReport = generateDailyReport();

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Reportes Diarios</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Ingresos Hoy</h3>
            <p className="text-2xl font-bold text-blue-600">{dailyReport.ingresos}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Carros</h3>
            <p className="text-2xl font-bold text-green-600">{dailyReport.ingresosPorTipo.carro}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Motos</h3>
            <p className="text-2xl font-bold text-purple-600">{dailyReport.ingresosPorTipo.moto}</p>
          </div>
        </div>

        {/* Tabla de vehículos del día */}
        <div>
          <h3 className="text-lg font-medium mb-4">Vehículos Ingresados Hoy</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Placa</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Propietario</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Hora Ingreso</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.filter(v => 
                  v.horaIngreso && 
                  new Date(v.horaIngreso).toDateString() === new Date().toDateString()
                ).map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{vehicle.placa}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{vehicle.tipo}</td>
                    <td className="border border-gray-300 px-4 py-2">{vehicle.propietario}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(vehicle.horaIngreso).toLocaleTimeString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.estado === 'estacionado' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {vehicle.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <MainContent />
            </main>
          </div>
        </div>
      </div>
    </AppProvider>
  );
};

// Componente para renderizar el contenido principal
const MainContent = () => {
  const { currentView } = useApp();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'parking':
        return <ParkingStatus />;
      case 'checkin':
        return <CheckIn />;
      case 'checkout':
        return <CheckOut />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return renderContent();
};

export default App;