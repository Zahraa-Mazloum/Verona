import { Routes, Route } from 'react-router-dom';
// import Dashboard from "../src/pages/Dashboard/dashboard"
import Login from "../src/pages/login/login"
import RequireAuth from './components/RequireAuth'
function App() {
  return (
    <Routes>
      
      {/* public routes */}
      <Route path="/login" element={<Login />} />
      {/* protect routes */}
      <Route  path="/" element={<RequireAuth />}>
      </Route>
    </Routes>
  )
}
export default App;