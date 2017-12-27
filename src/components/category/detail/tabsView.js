import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
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
    color: theme.palette.grey[400],
    height: '100%',
    overflow: 'hidden'
  },
  tabSelected: {
    color: theme.palette.secondary[500]
  },
  tabWrapper: {
    display: 'inline'
  },
  tabLabel: {
    whiteSpace: 'nowrap'
  },
  tabLabelContainer: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

class CategoryItemDetailTabs extends Component {
  state = {
    tabTitles: []
  }

  handleChangeTab = (event, activeTab) => {
    this.props.handleChangeTab(activeTab, this.props.openRelations)
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
    const hasChangedNumRelations = oldNumOpenRelations !== newNumOpenRelations

    const oldTitle = this.props.title
    const newTitle = nextProps.title
    const hasChangedTitle = oldTitle !== newTitle

    if (hasChangedNumRelations || hasChangedTitle) {
      let tabTitles = this.state.tabTitles
      if (hasChangedNumRelations) {
        tabTitles = [...tabTitles, newTitle]
      } else {
        const oldOpenRelations = this.props.openRelations
        tabTitles = oldOpenRelations.reduce((titles, relation, index) => {
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
      editMode,
      title,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      isUpdating,
      activeIndex,
      openRelations,
      updateItem,
      changeEditMode,
      closeRelations,
      windowSize,
      classes
    } = this.props
    const { tabTitles } = this.state
    const smallSize = windowSize === 'xs' || windowSize === 'sm'

    return (
      <React.Fragment>
        <HeaderLayout
          operations={[
            {id:'close', icon:Close, onClick:closeRelations}
          ]}
          overflow="hidden"
          hidden={openRelations.length < 2}
          secondaryToolbar
          secondaryToolbarHeight={smallSize ? 64 : 32}
          contentToolbar={
            <div style={{width:'100%', paddingTop: smallSize ? 4 : 1}}>
              <Tabs
                value={activeIndex}
                onChange={this.handleChangeTab}
                classes={{
                  root: classes.tabs,
                  buttonAuto: classes.tabsButton
                }}
                
                textColor="primary"
                indicatorColor="accent"
                fullWidth            
                scrollable
                scrollButtons="auto"
              >
                {tabTitles.map((title, index) =>
                  <Tab
                    key={index}
                    label={title}
                    disableRipple
                    classes={{
                      rootPrimary: classes.tab,
                      rootPrimarySelected: classes.tabSelected,
                      wrapper: classes.tabWrapper,
                      label: classes.tabLabel,
                      labelContainer: classes.tabLabelContainer
                    }}
                  />
                )}
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
            {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:closeRelations},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => changeEditMode(false)},
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
              this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ interactions }) => ({ 
  windowSize: interactions.windowSize
})

export default connect(mapStateToProps)(
  withStyles(styles)(CategoryItemDetailTabs)
)