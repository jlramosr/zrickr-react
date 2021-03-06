import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/interactions'
import HeaderLayout from '../headerLayout'
import GridList, { GridListTile } from 'material-ui/GridList'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  emptyContainer: {
    padding: theme.spacing.unit*5
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      margin: theme.spacing.unit*3
    },
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing.unit*4
    }
  },
  gridList: {
    width: '100%',
    maxWidth: 2520,
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start'
    }
  },
  gridTile: {
    '& :hover': {
      opacity: 0.85
    }
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '99%',
    background: theme.palette.primary.extraLight
  },
  cardMedia: {
    height: 160
  },
  cardContent: {
    flex: 1,
    paddingBottom: 2
  },
  cardActions: {
  },
  cardTitle: {
    textTransform: 'capitalize'
  },
  cardDescription: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical'
  }
})

class Dashboard extends Component  {

  computeColsRows = () => {
    switch (this.props.windowSize) {
      case 'xs': return {c:1,r:1}
      case 'sm': return {c:2,r:1}
      case 'md': return {c:3,r:1}
      case 'lg': return {c:4,r:1}
      case 'xl': return {c:5,r:1}
      default: return {c:2,r:1}
    }
  }

  render = () => {
    const {
      appName,
      user,
      categoriesPath,
      categories,
      isFetchingCategories,
      isReceivedCategories,
      drawerOpen,
      toggleDrawer,
      windowSize,
      classes
    } = this.props

    if (!isReceivedCategories) {
      return (
        <div className={classes.emptyContainer}>
          <span>Loading categories ...</span>
        </div>
      )
    }

    if (!categories.length) {
      return (
        <div className={classes.emptyContainer}>
          <span>There is no categories</span>
        </div>
      )
    }

    return (
      <HeaderLayout
        title={appName}
        loading={isFetchingCategories}
        operations={[
          {id:'menu', icon:MenuIcon, onClick:() => toggleDrawer(!drawerOpen)},
          user && user.photoURL
            ? {id:'account', image:user.photoURL, right: true, small:true, to:'/account'}
            : {id:'account', icon:AccountCircle, right:true, small:true}
        ]}
      >
        <div className={classes.gridContainer}>
          <GridList
            cols={this.computeColsRows().c}
            spacing={windowSize !== 'xs' ? 16 : 0}
            className={classes.gridList}
            cellHeight={windowSize !== 'xs' ? 340 : 200}
          >
            {categories.map(category => (
              <GridListTile key={category.id} className={classes.gridTile} rows={this.computeColsRows().r}>
                <Link key={category.id} to={`/${categoriesPath}/${category.id}`}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={category.image || 'https://blogs.ntu.edu.sg/files/2014/07/change_default_category.jpg'}
                      title={category.label || ''}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography type="headline" component="h2" className={classes.cardTitle}>
                        {category.label || ''}
                      </Typography>
                      {windowSize !== 'xs' &&
                        <Typography component="p" className={classes.cardDescription}>
                          {category.description}
                        </Typography>
                      }
                    </CardContent>
                    {windowSize !== 'xs' &&
                      <CardActions className={classes.cardActions}>
                        <Button dense color="primary">
                          Share
                        </Button>
                        <Button dense color="primary">
                          Learn More
                        </Button>
                      </CardActions>
                    }
                  </Card>
                </Link>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </HeaderLayout>
    )
  }
}

Dashboard.propTypes = {
  appName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  isReceivedCategories: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ app, categories, interactions }) => ({
  appName: app.name,
  user: app.session.user,
  categoriesPath: app.categoriesPath,
  categories: Object.values(categories.byId), 
  isFetchingCategories: categories.flow.isFetchingAll,
  isReceivedCategories: categories.flow.isReceivedAll,
  drawerOpen: interactions.drawerOpen,
  windowSize: interactions.windowSize
})

const mapDispatchToProps = dispatch => ({
  toggleDrawer: opened => dispatch(toggleDrawer(opened))
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Dashboard)
)