import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FoodInventory from './pages/FoodInventory';
import AddFood from './pages/AddFood';

// Simple inline navigation component for testing
const SimpleNav = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="flex gap-4">
      <Link to="/" className="hover:text-blue-300">View Inventory</Link>
      <Link to="/add" className="hover:text-blue-300">Add Food</Link>
    </div>
  </nav>
);

function App() {
  return (
    <BrowserRouter>
      <SimpleNav />
      <Routes>
        <Route path="/" element={<FoodInventory />} />
        <Route path="/add" element={<AddFood />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
