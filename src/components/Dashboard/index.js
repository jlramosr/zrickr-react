import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Menu from 'react-icons/lib/md/menu';
import './index.css';

class Dashboard extends Component {
  render() {
    const { categories, closeDrawer } = this.props;

    return (
      <div className="dashboard">

        <Header title="ERP" actions={[
          {id:'menu', icon: Menu, onClick:closeDrawer}
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