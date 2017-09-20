import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Dashboard from '../Dashboard';
import Client from '../Clients';
import Movement from '../Movements';
import Invoice from '../Invoices';
import NotFound from '../NotFound';
import './index.css';

class App extends Component {
  state = {
    categories: [],
    fields: {},
    drawerOpen: false
  }

  toggleDrawer() {
    this.setState({drawerOpen: !this.state.drawerOpen});
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
    const { categories, drawerOpen } = this.state;

    return (
      <div className="app">
        
        <Drawer
          docked={false}
          width={200}
          open={drawerOpen}
          onRequestChange={drawerOpen => this.setState({drawerOpen})}>{
            categories.map(category => (
              <Link key={category.name} to={`/${category.name}`}>
                <MenuItem onClick={ _ => this.toggleDrawer()}>
                  {category.label}
                </MenuItem>
              </Link>
            ))
          }
        </Drawer>

        <div className="app-content">

          <Route path="/" exact render={ _ => (
            <Dashboard categories={categories} closeDrawer={ _ => this.toggleDrawer()}/>
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
