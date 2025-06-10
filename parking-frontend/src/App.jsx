import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, ParkingCircle, Plus, BarChart3, LogOut, User, Clock, FileText as DocumentText } from 'lucide-react';
import PropTypes from 'prop-types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configuración de Axios
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';

// Interceptor para logs
axios.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  error => {
    console.error(`Error from ${error.config.url}:`, error.response);
    return Promise.reject(error);
  }
);

// Login Component
const LoginForm = ({ onLogin, onToggleForm }) => {
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
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      onLogin(token);
    } catch (err) {
      console.error('Error de login:', err.response?.data);
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = ({ onToggleForm }) => {
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'operador'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      alert('Usuario registrado exitosamente');
      onToggleForm(); // Volver al login
    } catch (err) {
      console.error('Error de registro:', err.response?.data);
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ParkingCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userData.nombre}
                onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userData.confirmPassword}
                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const ParkingDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('registro');
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  // Estados para formularios
  const [newVehicle, setNewVehicle] = useState({
    placa: '',
    tipo: 'Carro',
    clienteId: ''
  });

  const [newRegistro, setNewRegistro] = useState({
    clienteId: '',
    vehiculoId: '',
    espacioId: '',
    valorHora: 5000,
    observaciones: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Forzar revalidación agregando timestamp
      const timestamp = new Date().getTime();
      const [clientsRes, spacesRes, vehiclesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clientes`),
        axios.get(`${API_BASE_URL}/espacios?t=${timestamp}`),
        axios.get(`${API_BASE_URL}/vehiculos`)
      ]);
      
      console.log('Espacios raw:', spacesRes);
      console.log('Espacios data:', spacesRes.data);

      // Asegurarse de que los datos son arrays y tienen la estructura correcta
      const espaciosData = Array.isArray(spacesRes.data) ? spacesRes.data : [];
      
      // Log para depuración
      console.log('Espacios procesados:', espaciosData);
      console.log('Espacios disponibles:', espaciosData.filter(space => space.estado === 'disponible'));

      setSpaces(espaciosData);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
    } catch (error) {
      console.error('Error en fetchData:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData();
    }
  }, [token]);

  const handleAddVehicle = async () => {
    if (!newVehicle.placa || !newVehicle.tipo) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const vehiculoData = {
        placa: newVehicle.placa,
        tipoVehiculo: newVehicle.tipo.toLowerCase(),
        clienteId: newVehicle.clienteId || undefined
      };

      const response = await axios.post(`${API_BASE_URL}/vehiculos`, vehiculoData);
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      setNewVehicle({ placa: '', tipo: 'carro', clienteId: '' });
      alert('Vehículo registrado exitosamente');
      fetchData(); // Agregar aquí para actualizar después de añadir
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(error.response?.data?.error || 'Error al registrar el vehículo');
    }
  };

  const handleCreateRegistro = async () => {
    if (!newRegistro.clienteId || !newRegistro.vehiculoId || !newRegistro.espacioId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const registroData = {
        cliente: newRegistro.clienteId,
        vehiculo: newRegistro.vehiculoId,
        espacio: newRegistro.espacioId,
        valorHora: newRegistro.valorHora,
        observaciones: newRegistro.observaciones
      };

      const response = await axios.post(`${API_BASE_URL}/registros`, registroData);
      setRegistros(prevRegistros => [...prevRegistros, response.data]);
      setNewRegistro({
        clienteId: '',
        vehiculoId: '',
        espacioId: '',
        valorHora: 5000,
        observaciones: ''
      });
      alert('Registro de entrada creado exitosamente');
      await fetchData(); // Agregar aquí para actualizar después de crear
    } catch (error) {
      console.error('Error creating registro:', error);
      alert(error.response?.data?.error || 'Error al crear el registro de entrada');
    }
  };

  const handleFinalizarRegistro = async (registroId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/registros/${registroId}/finalizar`);
      setRegistros(prevRegistros => 
        prevRegistros.map(reg => 
          reg._id === registroId ? response.data : reg
        )
      );
      alert(`Registro finalizado. Total a pagar: ${formatCurrency(response.data.valorTotal)}`);
      await fetchData(); // Agregar aquí para actualizar después de finalizar
    } catch (error) {
      console.error('Error finalizing registro:', error);
      alert(error.response?.data?.error || 'Error al finalizar el registro');
    }
  };

  //eliminar vehículo
  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/vehiculos/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
      alert('Vehículo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      alert('Error al eliminar el vehículo');
    }
  };

  //generar reporte
  const handleGenerateReport = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reportes`, {
        fechaInicio: reportStartDate,
        fechaFin: reportEndDate
      });
      setReports([...reports, response.data]);
      alert('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  //eliminar reporte
  const handleDeleteReport = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/reportes/${id}`);
      setReports(reports.filter(r => r._id !== id));
      alert('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      alert('Error al eliminar el reporte');
    }
  };

  const activeVehicles = vehicles;
  const parkingSpots = spaces;
  const availableSpots = spaces.filter(s => s.disponible).length;
  const occupiedSpots = spaces.filter(s => !s.disponible).length;
  const activeRegistros = registros.filter(r => r.estado === 'activo');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ParkingCircle className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ParkingManager</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={onLogout} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <LogOut className="h-4 w-4 mr-2 inline" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registros Activos</p>
                    <p className="text-2xl font-bold text-gray-900">{activeRegistros.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehículos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">{activeVehicles.length}</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Espacios Disponibles</p>
                    <p className="text-2xl font-bold text-gray-900">{availableSpots}</p>
                  </div>
                  <ParkingCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ocupación</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round((occupiedSpots / parkingSpots.length) * 100)}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  </div>
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="space-y-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button 
                    onClick={() => setActiveTab('registro')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'registro' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Registro
                  </button>
                  <button 
                    onClick={() => setActiveTab('vehicles')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'vehicles' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Vehículos
                  </button>
                  <button 
                    onClick={() => setActiveTab('parking')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'parking' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Parqueadero
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reports' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Reportes
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === 'registro' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* formulario de registro*/}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        Nuevo Registro de Entrada
                      </h3>
                      <p className="text-sm text-gray-500">Registra el ingreso de un vehículo</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="clienteRegistro" className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente
                        </label>
                        <select
                          id="clienteRegistro"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newRegistro.clienteId}
                          onChange={(e) => {
                            console.log('Cliente seleccionado:', e.target.value);
                            setNewRegistro({ ...newRegistro, clienteId: e.target.value });
                          }}
                        >
                          <option value="">Seleccionar cliente</option>
                          {clients && clients.length > 0 ? (
                            clients.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.nombre} - {client.documento}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No hay clientes disponibles</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="vehiculoId" className="block text-sm font-medium text-gray-700 mb-1">
                          Vehículo
                        </label>
                        <select
                          id="vehiculoId"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newRegistro.vehiculoId}
                          onChange={(e) => setNewRegistro({ ...newRegistro, vehiculoId: e.target.value })}
                        >
                          <option value="">Seleccionar vehículo</option>
                          {vehicles.map((vehicle) => (
                            <option key={vehicle._id} value={vehicle._id}>
                              {vehicle.placa} - {vehicle.tipoVehiculo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="espacioId" className="block text-sm font-medium text-gray-700 mb-1">
                          Espacio
                        </label>
                        <select
                          id="espacioId"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newRegistro.espacioId}
                          onChange={(e) => setNewRegistro({ ...newRegistro, espacioId: e.target.value })}
                        >
                          <option value="">Seleccionar espacio</option>
                          {spaces && spaces.length > 0 ? (
                            spaces
                              .filter(space => space && space.estado === 'disponible')
                              .map((space) => (
                                <option key={space._id} value={space._id}>
                                  {space.codigo || space.numero} - {space.tipoEspacio}
                                </option>
                              ))
                          ) : (
                            <option value="" disabled>No hay espacios disponibles</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="valorHora" className="block text-sm font-medium text-gray-700 mb-1">
                          Valor por Hora
                        </label>
                        <input
                          id="valorHora"
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newRegistro.valorHora}
                          onChange={(e) => setNewRegistro({ ...newRegistro, valorHora: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                          Observaciones
                        </label>
                        <textarea
                          id="observaciones"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                          value={newRegistro.observaciones}
                          onChange={(e) => setNewRegistro({ ...newRegistro, observaciones: e.target.value })}
                        />
                      </div>
                      <button 
                        onClick={handleCreateRegistro}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Crear Registro
                      </button>
                    </div>
                  </div>

                  {/* Active Registros List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Registros Activos</h3>
                        <p className="text-sm text-gray-500">Vehículos actualmente en el parqueadero</p>
                      </div>
                      <div className="space-y-4">
                        {activeRegistros.map((registro) => (
                          <div key={registro._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Car className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="font-semibold">
                                  {registro.vehiculo?.placa || 'N/A'} - {registro.vehiculo?.tipo || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Cliente: {registro.cliente?.nombre || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Espacio: {registro.espacio?.numero || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {new Date(registro.fechaEntrada).toLocaleTimeString()}
                                </p>
                                <p className="text-xs text-gray-500">Hora de entrada</p>
                                <p className="text-sm font-medium text-green-600">
                                  {formatCurrency(registro.valorHora)}/hora
                                </p>
                              </div>
                              <button 
                                onClick={() => handleFinalizarRegistro(registro._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                              >
                                Finalizar
                              </button>
                            </div>
                          </div>
                        ))}
                        {activeRegistros.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No hay registros activos
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Add Vehicle Form */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        Registrar Vehículo
                      </h3>
                      <p className="text-sm text-gray-500">Ingresa un nuevo vehículo al sistema</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                          Placa
                        </label>
                        <input
                          id="placa"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="ABC-123"
                          value={newVehicle.placa}
                          onChange={(e) => setNewVehicle({ ...newVehicle, placa: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          id="tipoVehiculo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newVehicle.tipo}
                          onChange={(e) => setNewVehicle({ ...newVehicle, tipo: e.target.value })}
                        >
                          <option value="carro">Carro</option>
                          <option value="moto">Moto</option>
                          <option value="bicicleta">Bicicleta</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="clienteVehiculo" className="block text-sm font-medium text-gray-700 mb-1">
                          Cliente
                        </label>
                        <select
                          id="clienteVehiculo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={newVehicle.clienteId}
                          onChange={(e) => setNewVehicle({ ...newVehicle, clienteId: e.target.value })}
                        >
                          <option value="">Seleccionar cliente</option>
                          {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                              {client.nombre} - {client.documento}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={handleAddVehicle}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Registrar Vehículo
                      </button>
                    </div>
                  </div>

                  {/* Vehicles List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Vehículos Registrados</h3>
                        <p className="text-sm text-gray-500">Lista de todos los vehículos en el sistema</p>
                      </div>
                      <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                          <div key={vehicle._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Car className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="font-semibold">{vehicle.placa}</p>
                                <p className="text-sm text-gray-500">
                                  {vehicle.tipo} • Cliente: {vehicle.cliente?.nombre || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => handleDeleteVehicle(vehicle._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parking' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Estado del Parqueadero</h3>
                      <p className="text-sm text-gray-500">Resumen de espacios disponibles y ocupados</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Espacios Libres</p>
                          <p className="text-2xl font-bold text-gray-900">{availableSpots}</p>
                        </div>
                        <ParkingCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Espacios Ocupados</p>
                          <p className="text-2xl font-bold text-gray-900">{occupiedSpots}</p>
                        </div>
                        <Car className="h-10 w-10 text-red-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Registro de Parqueo Activo</h3>
                      <p className="text-sm text-gray-500">Vehículos actualmente en el parqueadero</p>
                    </div>
                    <div className="space-y-4">
                      {activeRegistros.map((registro) => (
                        <div key={registro._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Car className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="font-semibold">
                                {registro.vehiculo?.placa || 'N/A'} - {registro.vehiculo?.tipo || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Cliente: {registro.cliente?.nombre || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Espacio: {registro.espacio?.numero || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {new Date(registro.fechaEntrada).toLocaleTimeString()}
                              </p>
                              <p className="text-xs text-gray-500">Hora de entrada</p>
                              <p className="text-sm font-medium text-green-600">
                                {formatCurrency(registro.valorHora)}/hora
                              </p>
                            </div>
                            <button 
                              onClick={() => handleFinalizarRegistro(registro._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                            >
                              Finalizar
                            </button>
                          </div>
                        </div>
                      ))}
                      {activeRegistros.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No hay vehículos en el parqueadero
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Generar Reporte</h3>
                    <p className="text-sm text-gray-500">Crea un reporte de la actividad del parqueadero</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="reportDateStart" className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar Fechas
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          id="reportDateStart"
                          type="date"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={reportStartDate}
                          onChange={(e) => setReportStartDate(e.target.value)}
                        />
                        <input
                          id="reportDateEnd"
                          type="date"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={reportEndDate}
                          onChange={(e) => setReportEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={handleGenerateReport}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Generar Reporte
                      </button>
                    </div>
                  </div>
                </div>

                {/* Report List */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Reportes Generados</h3>
                    <p className="text-sm text-gray-500">Lista de reportes disponibles</p>
                  </div>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <DocumentText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-semibold">{report.titulo}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(report.fecha).toLocaleDateString()} - {report.tipo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <a 
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver Reporte
                          </a>
                          <button 
                            onClick={() => handleDeleteReport(report._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No hay reportes generados
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onToggleForm: PropTypes.func.isRequired
};

RegisterForm.propTypes = {
  onToggleForm: PropTypes.func.isRequired
};

ParkingDashboard.propTypes = {
  token: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
};

const App = () => {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    axios.defaults.headers.common['Authorization'] = '';
  };

  const toggleForm = () => {
    setShowRegister(!showRegister);
  };

  const renderContent = () => {
    if (token) {
      return <ParkingDashboard token={token} onLogout={handleLogout} />;
    }
    if (showRegister) {
      return <RegisterForm onToggleForm={toggleForm} />;
    }
    return <LoginForm onLogin={handleLogin} onToggleForm={toggleForm} />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderContent()}
    </div>
  );
};

export default App;
