import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
import { getItemInfo } from '../utils/helpers'
import { capitalize, isEqual } from '../../../utils/helpers'
import { removeOpenRelation, removeAllOpenRelations } from '../../../actions/relations'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  tabs: {
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
    marginBottom: -17
  },
  buttonAuto: {
    color: theme.palette.primary[700],
    marginBottom: 17
  },
  tab: {
    color: theme.palette.primary[400]
  },
  tabSelected: {
    color: theme.palette.secondary[500]
  }
})

class CategoryItemDetailTabs extends Component {
  state = {
    tabTitles: []
  }

  updateItem = values => {
    const { settings, updateItem, notify } = this.props
    if (!isEqual(this.props.item, values)) {
      return updateItem(values).then(
        () => {
          notify(`${capitalize(settings.itemLabel)} updated succesfully`, 'success')
          this.changeEditMode(false)
        }, error => {
          notify(`There has been an error updating the ${settings.itemLabel.toLowerCase()}: ${error}`, 'error')
        }
      )
    }
    notify(`There has been no change updating this ${settings.itemLabel}`, 'info')
    this.changeEditMode(false)
    return new Promise(resolve => resolve())
  }

  handleChangeTab = (event, activeTab) => {
    this.props.handleChangeTab(activeTab, this.props.openRelations)
  }

  componentDidMount = () => {
    const { settings, item } = this.props 
    this.setState({
      tabTitles:[getItemInfo(settings.primaryFields, item)]
    })
  }

  componentWillReceiveProps = nextProps => {
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
    if (oldNumOpenRelations !== newNumOpenRelations) {
      this.setState(prevState => {
        const { settings, item } = nextProps 
        return {
          tabTitles: [...prevState.tabTitles, getItemInfo(settings.primaryFields, item)]
        }
      })
    }
  }

  render = () => {
    const {
      editMode,
      fields,
      item,
      activeIndex,
      openRelations,
      removeAllOpenRelations,
      classes
    } = this.props
    const { tabTitles } = this.state
    return (
      <HeaderLayout
        operations={[
          {id:'close', icon:Close, onClick:() => removeAllOpenRelations()}
        ]}
        hidden={openRelations.length < 2}
        secondaryToolbar
        secondaryToolbarHeight={48}
        contentToolbar={
          <Tabs
            value={activeIndex}
            onChange={this.handleChangeTab}
            classes={{
              root: classes.tabs,
              buttonAuto: classes.buttonAuto
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
                  rootPrimarySelected: classes.tabSelected
                }}
              />
            )}
          </Tabs>
        }
      >
        <div key={activeIndex}>
          <HeaderLayout
            title={tabTitles[activeIndex]}
            operations={[
              {id:'close', icon:Close, hidden:openRelations.length > 1, onClick:() => removeAllOpenRelations()},
              {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => this.changeEditMode(true)},
              {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => this.changeEditMode(false)},
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
              handleSubmit={this.updateItem}
              formRef={el => this.formElement = el}
            />
          </HeaderLayout>
        </div>
      </HeaderLayout>
    )
  }
}

CategoryItemDetailTabs.propTypes = {
  openRelations: PropTypes.array.isRequired
}

const mapStateToProps = ( {categories, settings, fields, items, relations}, props ) => {
  const categoryId = props.activeCategoryId
  const itemId = props.activeItemId
  const category = categories.byId[categoryId]
  return {
    settings: category.settings ? settings.byId[category.settings] : {},
    isFetchingSettings: settings.flow[categoryId].isFetching,
    fields: Object.values(fields.byId).filter(
      field => category.fields && category.fields.includes(field.id)
    ),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    item: category.items && category.items.includes(itemId) ? items.byId[itemId] : null,
    isFetchingItem: items.flow[categoryId].isFetchingItem,
    //itemReceived: items.flow[categoryId].isReceivedItem || items.flow[categoryId].errorFetchingItem
    isUpdating: items.flow[categoryId].isUpdating,
    openRelations: relations.openRelations
  }
}

const mapDispatchToProps = dispatch => ({
  removeOpenRelation: () => dispatch(removeOpenRelation()),
  removeAllOpenRelations: () => dispatch(removeAllOpenRelations()),
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(CategoryItemDetailTabs)
)
