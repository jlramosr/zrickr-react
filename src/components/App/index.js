import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Client from '../Clients';
import Movement from '../Movements';
import Invoice from '../Invoices';
import NotFound from '../NotFound';
import './index.css';

class App extends Component {
  state = {
    categories: []
  }

  componentDidMount() {
    const categories = [
      { name:'clients', label:'Clientes', itemLabel:'Cliente', component: Client},
      { name:'movements', label:'Movimientos', itemLabel:'Movimiento', component: Movement },
      { name:'invoices', label: 'Facturas', itemLabel:'Factura', component: Invoice }
    ]
    this.setState({categories});
  }

  render() {
    const { categories } = this.state;

    return (
      <div className="app">
        <div className="app-content">

          <Route path="/" exact render={ _ => (
            <Dashboard categories={categories}/>
          )}/>

          <Route path="/:categoryName" component={ props => {
            const categoryName = props.match.params.categoryName;
            const category = categories.filter( category => category.name === categoryName)[0];
            return category ?
              React.createElement(category.component, { category }) :
              React.createElement(NotFound, {title: 'Not Found'})
          }}/>
              
        </div>
      </div>
    );
  }
}

export default App;
