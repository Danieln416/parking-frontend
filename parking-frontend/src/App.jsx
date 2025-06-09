import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, ParkingCircle, DollarSign, Plus, BarChart3, Settings, LogOut, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

// Login Component
const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      onLogin(token);
    } catch (err) {
      setError(err.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <div className="flex justify-center">
            <ParkingCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Parqueadero
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input mt-1"
              placeholder="usuario@uptc.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              className="input mt-1"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="button button-primary w-full h-12"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Admin: admin@uptc.com / admin123</p>
            <p>Usuario: user@uptc.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const ParkingDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ placa: '', tipo: 'Carro', clienteId: '' });

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, spacesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clientes`),
        axios.get(`${API_BASE_URL}/espacios`)
      ]);
      
      setClients(clientsRes.data || []);
      setSpaces(spacesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.placa || !newVehicle.clienteId) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/vehiculos`, newVehicle);
      setVehicles([...vehicles, response.data]);
      setNewVehicle({ placa: '', tipo: 'Carro', clienteId: '' });
      alert('Vehículo registrado exitosamente');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error al registrar el vehículo');
    }
  };

  const generateReport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reportes`);
      console.log('Reporte generado:', response.data);
      alert('Reporte generado exitosamente (ver consola)');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    }
  };

  // Mock data for demonstration
  const mockVehicles = [
    { id: "1", placa: "ABC-123", tipo: "Carro", entryTime: "09:30", spot: "A-01", status: "active" },
    { id: "2", placa: "XYZ-789", tipo: "Moto", entryTime: "10:15", spot: "B-05", status: "active" }
  ];

  const mockSpaces = [
    { id: "1", number: "A-01", status: "occupied", vehicle: "ABC-123" },
    { id: "2", number: "A-02", status: "available" },
    { id: "3", number: "A-03", status: "available" },
    { id: "4", number: "B-01", status: "available" },
    { id: "5", number: "B-02", status: "reserved" },
    { id: "6", number: "B-03", status: "occupied", vehicle: "XYZ-789" }
  ];

  const activeVehicles = vehicles.length > 0 ? vehicles : mockVehicles;
  const parkingSpots = spaces.length > 0 ? spaces : mockSpaces;
  const availableSpots = parkingSpots.filter(s => s.status === "available").length;
  const occupiedSpots = parkingSpots.filter(s => s.status === "occupied").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ParkingCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ParkingManager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="button button-outline button-sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </button>
            <button onClick={onLogout} className="button button-outline button-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Vehículos Activos</h3>
              <Car className="h-4 w-4 text-gray-500" />
            </div>
            <div className="card-content">
              <div className="text-2xl font-bold">{activeVehicles.length}</div>
              <p className="text-xs text-gray-500">En el parqueadero</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Espacios Disponibles</h3>
              <ParkingCircle className="h-4 w-4 text-gray-500" />
            </div>
            <div className="card-content">
              <div className="text-2xl font-bold">{availableSpots}</div>
              <p className="text-xs text-gray-500">De {parkingSpots.length} totales</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Ocupación</h3>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </div>
            <div className="card-content">
              <div className="text-2xl font-bold">{Math.round((occupiedSpots / parkingSpots.length) * 100)}%</div>
              <p className="text-xs text-gray-500">Espacios ocupados</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Clientes</h3>
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div className="card-content">
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-gray-500">Registrados</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="tabs-list">
            <button 
              onClick={() => setActiveTab('vehicles')}
              className={`tabs-trigger ${activeTab === 'vehicles' ? 'active' : ''}`}
            >
              Vehículos
            </button>
            <button 
              onClick={() => setActiveTab('parking')}
              className={`tabs-trigger ${activeTab === 'parking' ? 'active' : ''}`}
            >
              Parqueadero
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`tabs-trigger ${activeTab === 'reports' ? 'active' : ''}`}
            >
              Reportes
            </button>
          </div>

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Vehicle Form */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Registrar Vehículo
                    </h3>
                    <p className="card-description">Ingresa un nuevo vehículo al parqueadero</p>
                  </div>
                  <div className="card-content space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                      <input
                        className="input"
                        placeholder="ABC-123"
                        value={newVehicle.placa}
                        onChange={(e) => setNewVehicle({ ...newVehicle, placa: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        className="input"
                        value={newVehicle.tipo}
                        onChange={(e) => setNewVehicle({ ...newVehicle, tipo: e.target.value })}
                      >
                        <option value="Carro">Carro</option>
                        <option value="Moto">Moto</option>
                        <option value="Camión">Camión</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente ID</label>
                      <input
                        className="input"
                        placeholder="ID del cliente"
                        value={newVehicle.clienteId}
                        onChange={(e) => setNewVehicle({ ...newVehicle, clienteId: e.target.value })}
                      />
                    </div>
                    <button onClick={handleAddVehicle} className="button button-primary w-full h-10">
                      Registrar Vehículo
                    </button>
                  </div>
                </div>

                {/* Active Vehicles List */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Vehículos Activos</h3>
                      <p className="card-description">Vehículos actualmente en el parqueadero</p>
                    </div>
                    <div className="card-content">
                      <div className="space-y-4">
                        {activeVehicles.map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Car className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="font-semibold">{vehicle.placa}</p>
                                <p className="text-sm text-gray-500">
                                  {vehicle.tipo} • Espacio {vehicle.spot || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">{vehicle.entryTime || 'N/A'}</p>
                                <p className="text-xs text-gray-500">Hora de entrada</p>
                              </div>
                              <button className="button button-outline button-sm">
                                Salida
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parking Tab */}
          {activeTab === 'parking' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Estado del Parqueadero</h3>
                <p className="card-description">Vista general de todos los espacios de parqueo</p>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {parkingSpots.map((spot) => (
                    <div
                      key={spot.id}
                      className={`p-4 rounded-lg border-2 text-center ${
                        spot.status === "occupied"
                          ? "bg-red-50 border-red-200"
                          : spot.status === "reserved"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-green-50 border-green-200"
                      }`}
                    >
                      <ParkingCircle
                        className={`h-8 w-8 mx-auto mb-2 ${
                          spot.status === "occupied"
                            ? "text-red-600"
                            : spot.status === "reserved"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      />
                      <p className="font-semibold">{spot.number}</p>
                      <span
                        className={`badge ${
                          spot.status === "occupied"
                            ? "badge-destructive"
                            : spot.status === "reserved"
                              ? "badge-secondary"
                              : "badge-default"
                        } text-xs`}
                      >
                        {spot.status === "occupied"
                          ? "Ocupado"
                          : spot.status === "reserved"
                            ? "Reservado"
                            : "Disponible"}
                      </span>
                      {spot.vehicle && <p className="text-xs text-gray-500 mt-1">{spot.vehicle}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resumen Diario</h3>
                  <p className="card-description">Estadísticas del día actual</p>
                </div>
                <div className="card-content space-y-4">
                  <div className="flex justify-between">
                    <span>Total de ingresos:</span>
                    <span className="font-semibold">{activeVehicles.length} vehículos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espacios ocupados:</span>
                    <span className="font-semibold">{occupiedSpots} espacios</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espacios disponibles:</span>
                    <span className="font-semibold">{availableSpots} espacios</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clientes registrados:</span>
                    <span className="font-semibold text-green-600">{clients.length}</span>
                  </div>
                  <button onClick={generateReport} className="button button-primary w-full h-10">
                    Generar Reporte
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Tipos de Vehículos</h3>
                  <p className="card-description">Distribución por tipo</p>
                </div>
                <div className="card-content space-y-4">
                  <div className="flex justify-between">
                    <span>Carros:</span>
                    <span className="font-semibold">
                      {activeVehicles.filter(v => v.tipo === 'Carro').length} 
                      ({Math.round((activeVehicles.filter(v => v.tipo === 'Carro').length / activeVehicles.length) * 100) || 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Motos:</span>
                    <span className="font-semibold">
                      {activeVehicles.filter(v => v.tipo === 'Moto').length}
                      ({Math.round((activeVehicles.filter(v => v.tipo === 'Moto').length / activeVehicles.length) * 100) || 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Camiones:</span>
                    <span className="font-semibold">
                      {activeVehicles.filter(v => v.tipo === 'Camión').length}
                      ({Math.round((activeVehicles.filter(v => v.tipo === 'Camión').length / activeVehicles.length) * 100) || 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ParkingDashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;