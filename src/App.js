import React, { useState } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    wind_mph: '',
    pressure_mb: '',
    humidity: '',
    cloud: '',
    visibility_km: '',
    gust_mph: '',
    condition: 'Sunny',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('https://ds-backend-08bb.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation
  const chartData = {
    labels: [
      'Temperature (°C)',
      'Wind (mph)',
      'Pressure (mb)',
      'Humidity (%)',
      'Cloud (%)',
      'Visibility (km)',
      'Gust (mph)',
    ],
    datasets: [
      {
        label: 'Weather Parameters',
        data: prediction
          ? [
              prediction, // Predicted temperature
              parseFloat(formData.wind_mph) || 0,
              // Normalize pressure_mb (e.g., 950-1050 mb to 0-100 scale)
              ((parseFloat(formData.pressure_mb) - 950) / 100) * 100 || 0,
              parseFloat(formData.humidity) || 0,
              parseFloat(formData.cloud) || 0,
              parseFloat(formData.visibility_km) || 0,
              parseFloat(formData.gust_mph) || 0,
            ]
          : [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)', // Green for temperature
          'rgba(59, 130, 246, 0.6)', // Blue for wind
          'rgba(168, 85, 247, 0.6)', // Purple for pressure
          'rgba(234, 179, 8, 0.6)', // Yellow for humidity
          'rgba(239, 68, 68, 0.6)', // Red for cloud
          'rgba(6, 182, 212, 0.6)', // Cyan for visibility
          'rgba(236, 72, 153, 0.6)', // Pink for gust
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weather Parameters and Predicted Temperature',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#1f2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value (Normalized)',
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Parameters',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Air Quality <br /> Temperature Prediction
        </h1>
        <div className="flex flex-row gap-8">
          {/* Form Column */}
          <div className="form-column">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wind Speed (mph)</label>
                <input
                  type="number"
                  name="wind_mph"
                  value={formData.wind_mph}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pressure (mb)</label>
                <input
                  type="number"
                  name="pressure_mb"
                  value={formData.pressure_mb}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Humidity (%)</label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cloud Cover (%)</label>
                <input
                  type="number"
                  name="cloud"
                  value={formData.cloud}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Visibility (km)</label>
                <input
                  type="number"
                  name="visibility_km"
                  value={formData.visibility_km}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gust Speed (mph)</label>
                <input
                  type="number"
                  name="gust_mph"
                  value={formData.gust_mph}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weather Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="Sunny">Sunny</option>
                  <option value="Partly cloudy">Partly cloudy</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Overcast">Overcast</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Predicting...' : 'Predict Temperature'}
              </button>
            </form>
          </div>
          {/* Output Column */}
          <div className="output-column">
            {(prediction || error) && (
              <div className="space-y-4">
                {prediction && (
                  <>
                    <div className="p-4 bg-green-100 rounded-md text-center">
                      <p className="text-lg font-semibold">Predicted Temperature: {prediction}°C</p>
                    </div>
                    <div className="chart-container">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </>
                )}
                {error && (
                  <div className="p-4 bg-red-100 rounded-md text-center">
                    <p className="text-lg font-semibold text-red-600">Error: {error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
