import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../App/header';
import Calculator from 'react-icons/lib/fa/calculator';
import './index.css';

class Dashboard extends Component {
  render() {
    const { categories } = this.props;

    return (
      <div className="dashboard">

        <Header title="ERP" actions={[
          {id:'calculator', icon: Calculator}
        ]}/>

        {categories.map(category =>
          <div key={category.name} className="app-category">
            <Link to={`/${category.name}`}>{category.label}</Link>
          </div>
        )}

      </div>

    );
  }
}

export default Dashboard;