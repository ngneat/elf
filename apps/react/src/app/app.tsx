import './app.scss';

import { Route, Routes } from 'react-router-dom';
import Nav from './nav/nav';
import LoginPage from './login-page/login-page';
import ProductsPage from './products-page/products-page';
import TodosPage from './todos-page/todos-page';

function Home() {
  return <h1>Home</h1>;
}

export function App() {
  return (
    <div>
      <Nav />

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/todos" element={<TodosPage />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
