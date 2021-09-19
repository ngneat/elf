import './app.scss';

import { Route } from 'react-router-dom';
import Nav from './nav/nav';
import LoginPage from './login-page/login-page';
import ProductsPage from './products-page/products-page';
import TodosPage from './todos-page/todos-page';

export function App() {
  return (
    <div>
      <Nav />

      <div className="container py-4">
        <Route path="/" exact render={() => <h1>Home</h1>} />

        <Route path="/todos" exact component={TodosPage} />

        <Route path="/products" exact component={ProductsPage} />

        <Route path="/login" exact component={LoginPage} />
      </div>
    </div>
  );
}

export default App;
