import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Menu from 'react-icons/lib/md/menu';
import './index.css';

const listStyle = {
  padding: "10px", 
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center"	
}

const itemStyle = {
  width: "200px",
  height: "58px",
  color: "#00838F",
  borderRadius: "5px",
  background: "#fff",
  margin: "20px",
  fontSize: "18px",
  fontWeight: "300",
  boxShadow: "1px 2px 1px 0px #888"
}

const avatarStyle = {
  background:"transparent"
}

class Dashboard extends Component {

  render() {
    const { categories, closeDrawer } = this.props;
    /*

    MIRAR http://www.material-ui.com/#/components/grid-list

    */
    return (
      <div className="dashboard">

        <Header title="ERP" operations={[
          {id:'menu', icon: Menu, onClick:closeDrawer}
        ]}/>

        <List style={listStyle}> {
          categories && categories.map(category =>
            <Link key={category.name} to={`/${category.name}`}>
              <ListItem
                primaryText={category.label}
                leftAvatar={
                  category.icon ?
                    <Avatar
                      style={avatarStyle}
                      color="#00838F"
                      size={44}
                      icon={React.createElement(category.icon)}
                    /> :
                    <Avatar/>
                }
                style={itemStyle}
                hoverColor="#B2DFDB"
              />
            </Link>
          )
        }</List>

      </div>

    );
  }
}

export default Dashboard;