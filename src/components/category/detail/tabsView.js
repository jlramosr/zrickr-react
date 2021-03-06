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
    color: theme.palette.grey.main,
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
  state = {
    showCloseDialog: false,
    hoverTab: -1
  }

  onCloseClick = () => {
    const { openRelations, closeDialog, closeRelations } = this.props
    if (openRelations.list.find(relation => Boolean(relation.tempValues))) {
      this.setState({showCloseDialog: true})
    } else {
      closeDialog()
      closeRelations()
    }
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
        nextTab = activeIndex > 0 ? activeIndex - 1 : 0
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
    const { openRelations, windowSize, classes } = this.props
    const { showCloseDialog } = this.state

    const { activeIndex, list } = openRelations

    const tabs = list
    const currentRelation = list[activeIndex]

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
                  const isVisibleIconCircle = tab.tempValues
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

        {currentRelation &&
          <Category
            scene="detail"
            mode="temporal"
            categoryId={currentRelation.categoryId}
            itemId={currentRelation.itemId}
            onChange={this.onChangeForm}
            onClose={this.onCloseClick}
          />
        }

        <ConfirmationDialog
          open={showCloseDialog}
          message='There are items that are not saving yet. Are you sure to want to continue?'
          onAccept={() => {
            const { closeDialog, closeRelations } = this.props
            closeDialog()
            closeRelations()
          }}
          onClose={() => this.setState({showCloseDialog: false})}
        />

      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CategoryItemDetailTabs)