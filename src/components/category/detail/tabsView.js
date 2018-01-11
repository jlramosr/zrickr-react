import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import ConfirmationDialog from '../../dialog/confirmation'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
import FiberManualRecord from 'material-ui-icons/FiberManualRecord'
import { capitalize, isEqual } from '../../../utils/helpers'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  spaceBetween: {
    height: 6,
    background: `linear-gradient(${theme.palette.primary[500]}, ${theme.palette.primary[500]})`
  },
  tabs: {
    paddingBottom: 0,
    width: '100%',
    marginBottom: -17
  },
  tabsButton: {
    color: theme.palette.primary[700],
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
    marginRight: theme.spacing.unit*2,
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
    color: theme.palette.secondary[500]
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
    hoverTab: -1,
    nextTab: -1,
    removeTab: -1,
    checkWhenClose: false,
    showWhenCloseDialog: false,
    checkWhenInfoMode: false,
    showWhenInfoModeDialog: false,
    checkWhenChangeTab: false,
    checkWhenRemoveTab: false
  }

  state = this.initialState

  updateItem = values => {
    const { updateItem } = this.props
    return updateItem(values).then(() => {
      this.whenInfoModeWithoutChanges()
    })
  }

  onViewClick = () => {
    this.setState({checkWhenInfoMode: true})
  }

  onEditClick = () => {
    const tempTabs = this.state.tabs
    const { activeIndex } = this.props
    tempTabs[activeIndex].editMode = true
    this.setState({tabs: tempTabs})
  }

  onCheckClick = () => {
    this.formElement.dispatchEvent(
      new Event('submit'), {bubbles:false}
    )
  }

  onCloseClick = () => {
    const hasEditionTabs = this.state.tabs.reduce((has,tab) => has || tab.hasChanged, false)
    if (hasEditionTabs) {
      this.setState({checkWhenClose:true})
    } else {
      this.whenAcceptClose()
    }
  }

  onChangeTab = nextTab => {
    this.setState({checkWhenChangeTab: true, nextTab})
  }

  onMouseMoveTab = index => {
    this.setState({hoverTab: index})
  }

  onMouseLeaveTab = () => {
    this.setState({hoverTab: -1})
  }

  onCloseTabClick = index => {
    this.setState({checkWhenRemoveTab: true, removeTab: index})
  }

  whenDifferentValues = () => {
    const { tabs } = this.state
    tabs[this.props.activeIndex].hasChanged = true
    this.setState({tabs})
  }

  whenSameValues = () => {
    const { tabs } = this.state
    tabs[this.props.activeIndex].hasChanged = false
    this.setState({tabs})
  }

  whenInfoModeWithChanges = () => {
    this.setState({showWhenInfoModeDialog: true})
  }

  whenInfoModeWithoutChanges = () => {
    const { tabs } = this.state
    const { activeIndex } = this.props
    //if (tabs[activeIndex]) {
    tabs[activeIndex].editMode = false
    tabs[activeIndex].hasChanged = false
    //}
    this.setState({tabs, checkWhenInfoMode: false, showWhenInfoModeDialog: false})
  }

  whenClose = () => {
    this.setState({showWhenCloseDialog: true})
  }

  whenAcceptClose = () => {
    this.setState({tabs: [], checkWhenClose: false, showWhenCloseDialog:false})
    this.props.closeRelations()
  }

  whenChangeTab = values => {
    const { tabs, nextTab, checkWhenRemoveTab } = this.state
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
    }
  }

  whenRemoveTab = values => {
    //event.preventDefault()
    //event.stopPropagation()
    const { activeIndex, removeOpenRelation } = this.props
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
    this.setState({tabs: tempTabs})
  }

  componentDidMount = () => {
    this.setState({
      tabs:[{
        title: this.props.title,
        itemLabel: this.props.itemLabel,
        editMode: false,
        hasChanged: false,
        values: null
      }]
    })
  }

  componentWillReceiveProps = nextProps => {
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
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
            itemLabel: nextProps.itemLabel,
            editMode: false,
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
    }
  }

  render = () => {
    const {
      title,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      isUpdating,
      activeIndex,
      openRelations,
      windowSize,
      classes
    } = this.props
    const {
      tabs,
      checkWhenInfoMode, 
      showWhenInfoModeDialog, 
      showWhenCloseDialog,
      checkWhenClose,
      checkWhenChangeTab,
      checkWhenRemoveTab
    } = this.state

    let values = item
    if (tabs[activeIndex] && tabs[activeIndex].values) {
      values = tabs[activeIndex].values
    }

    const smallSize = windowSize === 'xs' || windowSize === 'sm'
    const tabsContainerStyle = {
      width:'100%',
      paddingTop: smallSize ? 4 : 1
    }

    const editMode = tabs[activeIndex] ? tabs[activeIndex].editMode : false
    const showCheckIcon =
      editMode &&
      !isUpdating &&
      (tabs[activeIndex] ? tabs[activeIndex].hasChanged : false) 
    //console.log(tabs, tabs[activeIndex], editMode)

    return (
      <React.Fragment>
        <HeaderLayout
          operations={[
            {id:'close', icon:Close, onClick:this.onCloseClick}
          ]}
          overflow="hidden"
          hidden={openRelations.length < 2}
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
                  const isVisibleIconCircle =
                    tab.hasChanged
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
        
        <div className={classes.spaceBetween}></div>

        <HeaderLayout
          key={activeIndex}
          title={title}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
          operations={[
            {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:this.onCloseClick},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:this.onEditClick},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:this.onViewClick},
            {id:'check', icon:Check, right:true, hidden:!showCheckIcon, onClick:this.onCheckClick}
          ]}
        >
          <Form
            cols={12}
            view="detail"
            infoMode={!editMode}
            fields={fields}
            values={values}
            origValues={item}
            handleSubmit={this.updateItem}
            formRef={el => this.formElement = el}
            checks={[
              {handler:checkWhenClose, callback:this.whenClose},
              {handler:checkWhenChangeTab, callback:this.whenChangeTab},
              {handler:checkWhenRemoveTab, callback:this.whenRemoveTab},
              {when:'hasChanged', handler:checkWhenInfoMode, callback:this.whenInfoModeWithChanges},
              {when:'hasNotChanged', handler:checkWhenInfoMode, callback:this.whenInfoModeWithoutChanges},
            ]}
            onDifferentValues={this.whenDifferentValues}
            onEqualValues={this.whenSameValues}
          />
        </HeaderLayout>

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