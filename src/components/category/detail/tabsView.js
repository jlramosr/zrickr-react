import React, { Component } from 'react'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import ConfirmationDialog from '../../dialog/confirmation'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
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
    tabTitles: [],
    hoverTab: -1,
    showConfirmDialogs: {
      closeView: false,
      changeMode: false,
      changeTabNum: -1
    }
  }

  state = this.initialState

  handleChangeTab = (event, activeTab) => {
    const { editMode, changeTab } = this.props
    if (editMode) {
      this.setState({
        showConfirmDialogs: {
          changeTabNum: activeTab
        }
      })
    } else { 
      changeTab(activeTab)
    }
  }

  handleCloseView = () => {
    const { editMode, closeRelations } = this.props
    if (editMode) {
      this.setState({
        showConfirmDialogs: {
          closeView: true
        }
      })
    } else {
      this.setState({tabTitles: []})
      closeRelations()
    }
  }

  removeTab = (event,index) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.removeOpenRelation(index)
    this.setState(prevState => ({
      tabTitles: [
        ...prevState.tabTitles.slice(0,index),
        ...prevState.tabTitles.slice(index+1)
      ]
    }))

  }

  componentDidMount = () => {
    this.setState({
      tabTitles:[this.props.title]
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
      let tabTitles = this.state.tabTitles
      if (diffNumRelations > 0) {
        tabTitles = [...tabTitles, newTitle]
      } else {
        const newOpenRelations = nextProps.openRelations
        tabTitles = newOpenRelations.reduce((titles, relation, index) => {
          const { categoryId, itemId } = relation
          const { activeCategoryId, activeItemId } = nextProps
          return [
            ...titles,
            categoryId === activeCategoryId && itemId === activeItemId ? newTitle : tabTitles[index]
          ]
        }, [])
      }
      this.setState({tabTitles})
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
    const { tabTitles, showConfirmDialogs } = this.state
    const { closeView, changeMode, changeTabNum } = showConfirmDialogs
    const messageNoSave = 'Your changes have not been saved yet. Are you sure to want to continue?'

    const smallSize = windowSize === 'xs' || windowSize === 'sm'
    const tabsContainerStyle = {
      width:'100%',
      paddingTop: smallSize ? 4 : 1
    }
    
    return (
      <React.Fragment>
        <HeaderLayout
          operations={[
            {id:'close', icon:Close, onClick:this.handleCloseView}
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
                {tabTitles.map((title, index) => {
                  const isVisibleIconClose = this.state.hoverTab === index || activeIndex === index
                  return (
                    <Tab
                      key={index}
                      onMouseMove={() => this.setState({hoverTab: index})}
                      onMouseOut={() => this.setState({hoverTab: -1})}
                      label={
                        <React.Fragment>
                          <span>{title}</span>
                          <div className={classes.tabIconContainer}>
                            <Close
                              style={{
                                visibility: isVisibleIconClose ? 'visible' : 'hidden'
                              }}
                              className={classes.tabIcon}
                              onClick={event => this.removeTab(event,index)}
                            />
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
            {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:this.handleCloseView},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() =>
              this.setState({
                showConfirmDialogs: {
                  changeMode: true
                }
              })
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
          />
        </HeaderLayout>

        <ConfirmationDialog
          open={closeView}
          message={messageNoSave}
          onClose={() => 
            this.setState({
              showConfirmDialogs: {
                closeView: false
              }
            })
          }
          onAccept={() => {
            this.setState({tabTitles: []})
            closeRelations()
          }}
        />

        <ConfirmationDialog
          open={changeMode}
          message={messageNoSave}
          onClose={() => 
            this.setState({
              showConfirmDialogs: {
                changeMode: false
              }
            })
          }
          onAccept={() => changeEditMode(false)}
        />

        <ConfirmationDialog
          open={changeTabNum >= 0}
          message={messageNoSave}
          onClose={() => 
            this.setState({
              showConfirmDialogs: {
                changeTabNum: -1
              }
            })
          }
          onAccept={() => {
            changeTab(changeTabNum)
            changeEditMode(false)
          }}
        />

      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CategoryItemDetailTabs)