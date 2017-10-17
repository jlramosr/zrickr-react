import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Toolbar from '../HeaderLayout/toolbar';
import Content from '../HeaderLayout/content';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import MenuIcon from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    maxWidth: 700,
    textTransform: 'capitalize',
  },
  gridImage: {
    width: 250,
    height: 250,
    objectFit: 'cover',
  }
});

const Dashboard = props => {
  const { categories, closeDrawer, loading, classes } = props;

  return (
    <div>
      <Toolbar
        title="ERP"
        loading={loading}
        operations={[
          {id:'menu', icon: MenuIcon, onClick:closeDrawer},
        ]}
      />

      <Content>
        <div className={classes.gridContainer}>
          <GridList cols={1} spacing={16} className={classes.gridList}>
            {categories.map(category => (
              <GridListTile key={category.id}>
                <Link
                  key={category.id}
                  to={`/${category.id}`}
                >
                  <img className={classes.gridImage} src={category.image || "https://blogs.ntu.edu.sg/files/2014/07/change_default_category.jpg"} alt={category.label} />
                  <GridListTileBar
                    title={category.label}
                    subtitle={<span>{category.description}</span>}
                    actionIcon={
                      <IconButton>
                        <InfoIcon color="rgba(255, 255, 255, 0.54)" />
                      </IconButton>
                    }
                  />
                </Link>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Content>
    </div>
  )
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  closeDrawer: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Dashboard);