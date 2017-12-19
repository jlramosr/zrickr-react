import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../../headerLayout'
import { fetchItemIfNeeded } from '../../../actions/items'
import Form from '../../form'
import { notify } from '../../../actions/notifier'
import { updateItem, removeItem } from '../../../actions/items'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import ChromeReaderMode from 'material-ui-icons/ChromeReaderMode'
import Delete from 'material-ui-icons/Delete'
import Dialog from '../../dialog'
import { getItemInfo } from '../utils/helpers'
import { capitalize, isEqual } from '../../../utils/helpers'
import CategoryItemDetailTabs from './tabsLayout'
import NotFound from '../../notFound'

class CategoryItemDetailHeader extends Component {
  state = {
    editMode: false,
    relations: {
      activeIndex: -1,
      activeCategoryId: '',
      activeItemId: ''
    }
  }

  changeEditMode = editMode => {
    this.setState({editMode})
  }

  changeTab = (activeTab, openRelations) => {
    const relation = openRelations[activeTab]
    this.setState({
      relations: {
        activeIndex: activeTab,
        activeCategoryId: relation.categoryId,
        activeItemId: relation.itemId
      }
    })
  }

  componentWillReceiveProps = nextProps => {
    const oldNumOpenRelations = this.props.openRelations.length
    const newNumOpenRelations = nextProps.openRelations.length
    if (oldNumOpenRelations !== newNumOpenRelations) {
      this.changeTab(newNumOpenRelations - 1, nextProps.openRelations)
    }
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

  removeItem = () => {
    const { categoryId, settings, removeItem, notify, history } = this.props
    return removeItem().then(
      () => {
        notify(`${capitalize(settings.itemLabel)} removed succesfully`, 'success')
        history.push(`/${categoryId}`)
      }, error => {
        notify(`There has been an error removing the ${settings.itemLabel.toLowerCase()}: ${error}`, 'error')
      }
    )
  }

  componentWillUnmount = () => {
    //console.log('DETAIL UNMOUNTED')
  }

  componentWillMount = () => {
    //console.log('DETAIL MOUNTED')
    this.props.fetchItemIfNeeded() //this.props.fetchItem()
  }

  render = () => {
    const {
      categoryId,
      settings,
      isFetchingSettings,
      fields,
      isFetchingFields,
      item,
      isFetchingItem,
      //itemReceived,
      isUpdating,
      openRelations,
    } = this.props
    const { editMode, relations } = this.state

    return (
      //itemReceived ? (
      item ? (
        <HeaderLayout
          title={item ? getItemInfo(settings.primaryFields, item) : ''}
          loading={isFetchingSettings || isFetchingFields || isFetchingItem || isUpdating }
          operations={[
            {id:'arrowBack', icon:ArrowBack, to:`/${categoryId}`},
            {id:'edit', icon:Edit, right:true, hidden:editMode, onClick:() => this.changeEditMode(true)},
            {id:'view', icon:ChromeReaderMode, right:true, hidden:!editMode, onClick:() => this.changeEditMode(false)},
            {id:'delete', icon:Delete, right:true, hidden:editMode, onClick:this.removeItem},
            {id:'check', icon:Check, right:true, hidden:!editMode, onClick:() => {
              this.formElement.dispatchEvent(new Event('submit'),{bubbles:false})
            }}
          ]}
        >
          <React.Fragment>
            <Form
              cols={12}
              view="detail"
              infoMode={!editMode}
              fields={fields}
              values={item}
              handleSubmit={this.updateItem}
              formRef={el => this.formElement = el}
            />
            <Dialog open={openRelations.length}>
              <CategoryItemDetailTabs
                handleChangeTab={this.changeTab}
                {...relations}
              />
            </Dialog>
          </React.Fragment>
        </HeaderLayout>
      ) : (
        <NotFound text="Item Not Found" />
      )
      //) : (
      //  <NotFound text="Loading Item ..." />
      //)
    )
  }
}

CategoryItemDetailHeader.propTypes = {
  /**
   * Category id of the item.
   */
  categoryId: PropTypes.string.isRequired,
  /**
   * Settings of the category obtained from Redux Store.
   */
  settings: PropTypes.object.isRequired,
  /**
   * Fields of the category obtained from Redux Store.
   */
  fields: PropTypes.array.isRequired
}

CategoryItemDetailHeader.defaultProps = {
}

const mapStateToProps = ({ categories, settings, fields, items, relations }, props) => {
  const categoryId = props.categoryId
  const itemId = props.match.params.itemId
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

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.categoryId
  const itemId = props.match.params.itemId
  return {
    fetchItemIfNeeded: () => dispatch(fetchItemIfNeeded(categoryId,itemId)),
    updateItem: item => dispatch(updateItem(props.categoryId, itemId, item)),
    removeItem: () => dispatch(removeItem(categoryId,itemId)),
    notify: (message, type) => dispatch(notify(message, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemDetailHeader)