import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Category from '../'
import ConfirmationDialog from '../../dialog/confirmation'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
import FiberManualRecord from 'material-ui-icons/FiberManualRecord'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  spaceBetween: {
    height: 4,
    background: theme.palette.primary.main
  },
  tabs: {
    paddingBottom: 0,
    width: '100%',
    marginBottom: -17
  },
  tabsButton: {
    color: theme.palette.primary.dark,
    marginBottom: 16
  },
  tab: {
    color: theme.palette.grey[500],
    height: '100%',
    marginLeft: 2,
    marginRight: 2
  },
  tabTextContainer: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    marginRight: theme.spacing.unit*3,
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  tabTitle: {
    overflow:'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12
  },
  tabItemLabel: {
    overflow:'hidden',
    textOverflow: 'ellipsis',
    fontSize: 11
  },
  tabSelected: {
    color: theme.palette.secondary.main
  },
  tabWrapper: {
    display: 'inline',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  tabLabelContainer: {
    paddingLeft: 1
  },
  tabLabel: {
    textAlign: 'left',
    marginRight: theme.spacing.unit
  },
  tabIconContainer: {
    position: 'absolute',
    right: 0,
    top: '50%',
    paddingRight: theme.spacing.unit
  },
  tabIcon: {
    position:'relative',
    transform: 'translate(0, -50%)',
    marginTop: 1,
    width:16,
    height:16
  }
})

class CategoryItemDetailTabs extends Component {
  initialState = {
    tabs: [],
    nextTab: -1,
    removeTab: -1,
    checkWhenClose: false,
    showWhenCloseDialog: false,
    checkWhenInfoMode: false,
    showWhenInfoModeDialog: false,
    checkWhenChangeTab: false,
    checkWhenRemoveTab: false,
    
    hoverTab: -1
  }

  state = this.initialState

  componentWillReceiveProps = nextProps => {
    /*const oldNumOpenRelations = this.props.openRelations.list.length
    const newNumOpenRelations = nextProps.openRelations.list.length
    const diffNumRelations = newNumOpenRelations - oldNumOpenRelations
    const oldRepeatedIndex = this.props.repeatedIndex
    const newRepeatedIndex = nextProps.repeatedIndex
    const oldTitle = this.props.title
    const newTitle = nextProps.title
    const oldActiveIndex = this.props.activeIndex
    const newActiveIndex = nextProps.activeIndex
    const hasChangedTitle = (oldTitle !== newTitle) && (oldActiveIndex === newActiveIndex) 

    if (diffNumRelations > 0) {
      this.setState(prevState => ({
        tabs: [
          ...prevState.tabs, {
            title: nextProps.title,
            categoryItemLabel: nextProps.categoryItemLabel,
            access: 'info',
            hasChanged: false,
            values: null
          }
        ]
      }))
    } else if ((oldRepeatedIndex !== newRepeatedIndex) && newRepeatedIndex > -1) {
      this.setState({checkWhenChangeTab: true, nextTab: newRepeatedIndex})
    } else if (hasChangedTitle) {
      let tabs = this.state.tabs
      tabs[newActiveIndex].title = newTitle
      this.setState({tabs})
    }*/
  }

  componentDidMount = () => {
    /*this.setState({
      tabs:[{
        title: this.props.title,
        categoryItemLabel: this.props.categoryItemLabel,
        access: 'info',
        hasChanged: false,
        values: null
      }]
    })*/
  }

  changeTab = (activeTab, openRelations) => {
    /*this.props.changeOpenRelation()
    if (!openRelations) {
      openRelations = this.props.openRelations
    }
    if (activeTab < 0) {
      this.setState(this.initialState)
    } else {
      const relation = openRelations[activeTab]
      this.setState({
        relations: {
          activeIndex: activeTab,
          activeCategoryId: relation.categoryId,
          activeItemId: relation.itemId
        }
      })
    }*/
  }

  updateItem = values => {
    /*const { onUpdateItem, itemId, title } = this.props
    return onUpdateItem(itemId, values, title).then(() => {
      this.whenInfoModeWithoutChanges()
    })*/
  }

  onViewClick = () => {
    /*this.setState({checkWhenInfoMode: true})*/
  }

  _onEditClick = () => {
    /*const tempTabs = this.state.tabs
    const { activeIndex } = this.props
    tempTabs[activeIndex].access = 'edit'
    this.setState({tabs: tempTabs})*/
  }

  onCheckClick = () => {
    /*this.formElement.dispatchEvent(
      new Event('submit'), {bubbles:false}
    )*/
  }

  _onCloseClick = () => {
    /*const hasEditionTabs = this.state.tabs.reduce((has,tab) => has || tab.hasChanged, false)
    if (hasEditionTabs) {
      this.setState({checkWhenClose:true})
    } else {
      this.whenAcceptClose()
    }*/
  }

  whenDifferentValues = () => {
    /*const { tabs } = this.state
    tabs[this.props.activeIndex].hasChanged = true
    this.setState({tabs})*/
  }

  whenSameValues = () => {
    /*const { tabs } = this.state
    tabs[this.props.activeIndex].hasChanged = false
    this.setState({tabs})*/
  }

  whenInfoModeWithChanges = () => {
    /*this.setState({showWhenInfoModeDialog: true})*/
  }

  whenInfoModeWithoutChanges = () => {
    /*const { tabs } = this.state
    const { activeIndex } = this.props
    //if (tabs[activeIndex]) {
    tabs[activeIndex].access = 'info'
    tabs[activeIndex].hasChanged = false
    //}
    this.setState({tabs, checkWhenInfoMode: false, showWhenInfoModeDialog: false})*/
  }

  whenClose = () => {
    /*this.setState({showWhenCloseDialog: true})*/
  }

  whenAcceptClose = () => {
    /*this.setState({tabs: [], checkWhenClose: false, showWhenCloseDialog:false})
    this.props.closeDialog()
    this.props.closeRelations()*/
  }

  whenChangeTab = values => {
    /*const { tabs, nextTab, checkWhenRemoveTab } = this.state
    const { changeTab, activeIndex } = this.props
    if (!checkWhenRemoveTab) {
      if (values) {
        tabs[activeIndex].values = values
        this.setState({tabs})
      }
      this.setState({checkWhenChangeTab: false})
      changeTab(nextTab)
    }
    else {
      this.setState({checkWhenChangeTab: false, checkWhenRemoveTab: false, nextTab: -1, removeTab: -1})
    }*/
  }

  whenRemoveTab = values => {
    //event.preventDefault()
    //event.stopPropagation()
    /*const { activeIndex, removeOpenRelation } = this.props
    const { tabs, removeTab } = this.state
    let tempTabs = tabs
    if (values) {
      tempTabs[activeIndex].values = values
    }
    removeOpenRelation(removeTab)
    tempTabs = [
      ...tempTabs.slice(0,removeTab),
      ...tempTabs.slice(removeTab+1)
    ]
    this.setState({tabs: tempTabs})*/
  }

  componentDidMount = () => {
  }

  onCloseClick = () => {
    const { closeDialog, closeRelations } = this.props
    closeDialog()
    closeRelations()
  }

  onCloseTabClick = index => {
    this.isRemovingTab = true
    this.props.removeOpenRelation(index) //then onChangeTab
  }

  onChangeTab = tab => {
    const { openRelations } = this.props
    const { activeIndex } = openRelations
    let nextTab = tab
    if (this.isRemovingTab) {
      if (tab <= activeIndex) {
        nextTab = (activeIndex - 1) || 0
      } else {
        nextTab = activeIndex
      }
      this.isRemovingTab = false
    }
    this.props.changeActiveOpenRelation(nextTab)
  }

  onMouseMoveTab = index => {
    this.setState({hoverTab: index})
  }

  onMouseLeaveTab = () => {
    this.setState({hoverTab: -1})
  }

  render = () => {
    const {
      openRelations,
      windowSize,
      classes
    } = this.props
    const {
      showWhenInfoModeDialog, 
      showWhenCloseDialog
    } = this.state

    const { activeIndex, list } = openRelations

    const tabs = list
    const currentRelation = tabs[activeIndex]

    const smallSize = windowSize === 'xs' || windowSize === 'sm'
    const tabsContainerStyle = {
      width:'100%',
      paddingTop: smallSize ? 4 : 1
    }

    return (
      <React.Fragment>
        <HeaderLayout
          operations={[
            {id:'close', icon:Close, onClick:this.onCloseClick}
          ]}
          overflow="hidden"
          hidden={openRelations.list.length < 2}
          secondaryToolbar
          secondaryToolbarHeight={smallSize ? 64 : 48}
          contentToolbar={
            <div style={tabsContainerStyle}>
              <Tabs
                value={activeIndex}
                onChange={(event, nextTab) => this.onChangeTab(nextTab)}
                classes={{
                  root: classes.tabs,
                  buttonAuto: classes.tabsButton
                }}
                textColor="primary"
                indicatorColor="accent"           
                scrollable
                scrollButtons="auto"
              >
                {tabs.map((tab, index) => {
                  const isVisibleIconCircle = tab.values
                  const isVisibleIconClose = 
                    !isVisibleIconCircle && 
                    (this.state.hoverTab === index || activeIndex === index)
                  return (
                    <Tab
                      key={index}
                      onMouseMove={() => this.onMouseMoveTab(index)}
                      onMouseLeave={this.onMouseLeaveTab}
                      label={
                        <React.Fragment>
                          <div className={classes.tabTextContainer}>
                            <div className={classes.tabTitle}>{tab.title}</div>
                            <div className={classes.tabItemLabel}>({tab.itemLabel})</div>
                          </div>
                          <div className={classes.tabIconContainer}>
                            {isVisibleIconClose &&
                              <Close
                                className={classes.tabIcon}
                                onClick={() => this.onCloseTabClick(index)}
                              />
                            }
                            {isVisibleIconCircle &&
                              <FiberManualRecord className={classes.tabIcon} />
                            }
                          </div>
                        </React.Fragment>
                      }
                      disableRipple
                      classes={{
                        rootPrimary: classes.tab,
                        rootPrimarySelected: classes.tabSelected,
                        wrapper: classes.tabWrapper,
                        label: classes.tabLabel,
                        labelContainer: classes.tabLabelContainer
                      }}
                    /> 
                  )
                })}
              </Tabs>
            </div>
          }
        >
        </HeaderLayout>
        
        {tabs.length > 1 && <div className={classes.spaceBetween}></div>}

        <Category
          scene="detail"
          mode="temporal"
          categoryId={currentRelation.categoryId}
          itemId={currentRelation.itemId}
          onChange={this.onChangeForm}
          onClose={this.onCloseClick}
        />

        <ConfirmationDialog
          open={showWhenCloseDialog}
          message='There are items that are not saving yet. Are you sure to want to continue?'
          onAccept={this.whenAcceptClose}
          onCancel={() => this.setState({checkWhenClose: false, showWhenCloseDialog:false})}
        />

        <ConfirmationDialog
          open={showWhenInfoModeDialog}
          message='Changes of current item have not been saved yet. Are you sure to want to continue?'
          onAccept={() => {
            this.whenInfoModeWithoutChanges()
            document.dispatchEvent(new Event('restart-form'))
          }}
          onCancel={() => this.setState({checkWhenInfoMode: false, showWhenInfoModeDialog:false})}
        />

      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CategoryItemDetailTabs)