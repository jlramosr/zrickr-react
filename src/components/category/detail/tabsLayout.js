import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../../headerLayout'
import Form from '../../form'
import Tabs, { Tab } from 'material-ui/Tabs'
import Close from 'material-ui-icons/Close'
import { getItemInfo } from '../utils/helpers'
import { capitalize, isEqual } from '../../../utils/helpers'
import { removeOpenRelation, removeAllOpenRelations } from '../../../actions/relations'

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
    console.log(this.props, nextProps)
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
    const { editMode, fields, item, activeIndex, removeAllOpenRelations } = this.props
    const { tabTitles } = this.state
    return (
      <HeaderLayout
        operations={[
          {id:'close', icon:Close, onClick:() => removeAllOpenRelations()}
          /*{id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => this.changeEditMode(true)},
          {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => this.changeEditMode(false)},
          {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this.removeItem},
          {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
            this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
          }}

          <CategoryItemDetailHeader
          key={activeIndex}
          categoryId={activeCategoryId}
          itemId={activeItemId}
          />
          
          */
        ]}
        secondaryToolbar
        contentToolbar={
          <Tabs
            value={activeIndex}
            onChange={this.handleChangeTab}
            indicatorColor="accent"
            scrollable
            scrollButtons="auto"
          >
            {tabTitles.map((title, index) =>
              <Tab key={index} label={title}/>
            )}
          </Tabs>
        }
      >
        <div key={activeIndex}>
          <Form
            cols={12}
            view="detail"
            infoMode={!editMode}
            fields={fields}
            values={item}
            handleSubmit={this.updateItem}
            formRef={el => this.formElement = el}
          />
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

export default connect(mapStateToProps,mapDispatchToProps)(CategoryItemDetailTabs)
