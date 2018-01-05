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
    overflow: 'hidden',
    marginLeft: 2,
    marginRight: 2
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: 1
  },
  tabLabel: {
    whiteSpace: 'nowrap',
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

    isChangingToInfoMode2: false,
    showConfirmDialog2: false,

    isChangingToInfoMode: false,
    showConfirmDialog: false,
    isChangingTab: -1
  }

  state = this.initialState

  openDialog2 = () => {
    this.setState({showConfirmDialog2: true})
  }

  noOpenDialog2 = () => {
    this.setState({tabs: [], isChangingToInfoMode2: false, showConfirmDialog2:false})
    this.props.closeRelations()
  }

  openDialog = () => {
    this.setState({showConfirmDialog: true})
  }

  noOpenDialog = () => {
    const { tabs, isChangingTab } = this.state
    tabs[isChangingTab].editMode = false
    this.props.changeEditMode(false)
    this.setState({tabs, isChangingToInfoMode: false, showConfirmDialog:false})
  }

  handleChangeTab = (event, activeTab) => {
    const { editMode, changeEditMode } = this.props
    const tabs = this.state.tabs
    if (tabs[activeTab].editMode && !editMode) {
      changeEditMode(true)
    } else if (!tabs[activeTab].editMode && editMode) {
      changeEditMode(false)
    }
    this.props.changeTab(activeTab)
  }

  closeView = () => {
    const { closeRelations } = this.props
    const hasEditionTabs = this.state.tabs.reduce((has,tab) => has || tab.editMode, false)
    if (hasEditionTabs) {
      this.setState({isChangingToInfoMode2:true})
    } else {
      this.setState({tabs: []})
      closeRelations()
    }
  }

  removeTab = (event,index) => {
    event.preventDefault()
    //event.stopPropagation()
    this.props.removeOpenRelation(index)
    this.setState(prevState => ({
      tabs: [
        ...prevState.tabs.slice(0,index),
        ...prevState.tabs.slice(index+1)
      ]
    }))
  }

  componentDidMount = () => {
    this.setState({
      tabs:[{
        title:this.props.title,
        editMode: false
      }]
    })
  }

  componentDidUpdate = () => {
    
  }

  componentWillReceiveProps = nextProps => {
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
    const diffNumRelations = newNumOpenRelations - oldNumOpenRelations

    const oldTitle = this.props.title
    const newTitle = nextProps.title
    const hasChangedTitle = oldTitle !== newTitle

    if (diffNumRelations > 0 || hasChangedTitle) {
      let tabs = this.state.tabs
      if (diffNumRelations > 0) {
        tabs = [
          ...tabs, {
            title: newTitle, editMode: false
          }
        ]
      } else {
        const newOpenRelations = nextProps.openRelations
        tabs = newOpenRelations.reduce((titlesAndModes, relation, index) => {
          const { categoryId, itemId } = relation
          const { activeCategoryId, activeItemId } = nextProps
          const editMode = tabs[index].editMode
          return [
            ...titlesAndModes,
            categoryId === activeCategoryId && itemId === activeItemId ? {
              title: newTitle,
              editMode
            } : {
              title: tabs[index].title,
              editMode
            }
          ]
        }, [])
      }
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
      editMode,
      changeEditMode,
      changeTab,
      activeIndex,
      openRelations,
      updateItem,
      closeRelations,
      windowSize,
      classes
    } = this.props
    const { tabs, isChangingTab, showConfirmDialog, showConfirmDialog2, isChangingToInfoMode, isChangingToInfoMode2 } = this.state

    const smallSize = windowSize === 'xs' || windowSize === 'sm'
    const tabsContainerStyle = {
      width:'100%',
      paddingTop: smallSize ? 4 : 1
    }
    
    console.log(tabs)

    return (
      <React.Fragment>
        <HeaderLayout
          operations={[
            {id:'close', icon:Close, onClick:
              this.closeView
            }
          ]}
          overflow="hidden"
          hidden={openRelations.length < 2}
          secondaryToolbar
          secondaryToolbarHeight={smallSize ? 64 : 32}
          contentToolbar={
            <div style={tabsContainerStyle}>
              <Tabs
                value={activeIndex}
                onChange={this.handleChangeTab}
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
                    tab.editMode
                  const isVisibleIconClose = 
                    !isVisibleIconCircle && 
                    (this.state.hoverTab === index || activeIndex === index)
                  return (
                    <Tab
                      key={index}
                      onMouseMove={() => this.setState({hoverTab: index})}
                      onMouseLeave={() => this.setState({hoverTab: -1})}
                      label={
                        <React.Fragment>
                          <span>{tab.title}</span>
                          <div className={classes.tabIconContainer}>
                            {isVisibleIconClose &&
                              <Close
                                className={classes.tabIcon}
                                onClick={event => this.removeTab(event,index)}
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
            {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:
              this.closeView
            },
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => {
              const tempTabs = this.state.tabs
              tempTabs[activeIndex].editMode = true
              this.setState({tabs: tempTabs})
              changeEditMode(true)
            }},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => 
              this.setState({isChangingToInfoMode: true, isChangingTab: activeIndex})
            },
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
              this.formElement.dispatchEvent(
                new Event('submit'), {bubbles:false}
              )
            }}
          ]}
        >
          <Form
            cols={12}
            view="detail"
            infoMode={!editMode}
            fields={fields}
            values={item}
            handleSubmit={updateItem}
            formRef={el => this.formElement = el}
            isChangingToInfoMode2={isChangingToInfoMode2}
            openDialog2={this.openDialog2}
            noOpenDialog2={this.noOpenDialog2}
            isChangingToInfoMode={isChangingToInfoMode}
            openDialog={this.openDialog}
            noOpenDialog={this.noOpenDialog}
          />
        </HeaderLayout>

        <ConfirmationDialog
          open={showConfirmDialog2}
          message='There are items that are not saving yet. Are you sure to want to continue?'
          onClose={() => 
            this.setState({isChangingToInfoMode2: false, showConfirmDialog2:false})
          }
          onAccept={() => {
            this.setState({tabs: []})
            closeRelations()
          }}
        />

        <ConfirmationDialog
          open={showConfirmDialog}
          message='Changes of current item have not been saved yet. Are you sure to want to continue?'
          onClose={() => 
            this.setState({isChangingToInfoMode: false, showConfirmDialog:false})
          }
          onAccept={() => {
            const tempTabs = tabs
            tempTabs[isChangingTab].editMode = false
            this.setState({tabs: tempTabs})
            changeEditMode(false)
          }}
        />

      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CategoryItemDetailTabs)