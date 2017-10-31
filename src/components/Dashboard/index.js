import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/drawer'
import HeaderLayout from '../headerLayout'
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import InfoIcon from 'material-ui-icons/Info'
import MenuIcon from 'material-ui-icons/Menu'
import { withStyles } from 'material-ui/styles'

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
})

const Dashboard = props => {
  const { categories, isFetchingCategories, drawerOpened, toggleDrawer, classes } = props

  return (
    <HeaderLayout
      title="ERP"
      loading={isFetchingCategories}
      operations={[
        {id:'menu', icon: MenuIcon, onClick: _ => toggleDrawer(!drawerOpened)},
      ]}
    >

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
                  title={category.label || ''}
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
    </HeaderLayout>
  )
}

Dashboard.propTypes = {
  categories: PropTypes.array.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories, drawer }) => ({
  categories: categories.items, 
  isFetchingCategories: categories.isFetching,
  drawerOpened: drawer.opened
})

const mapDispatchToProps = dispatch => ({
  toggleDrawer: opened => dispatch(toggleDrawer(opened)),
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Dashboard)
)