import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Form from '../form'
import Menu from '../menu'
import HeaderLayout from '../headerLayout'
import { getItemString } from './utils/helpers'
import Directions from 'material-ui-icons/Directions'
import IconButton from 'material-ui/IconButton'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'

class CategoryItemNew extends Component {
  state = {
    anchorEl: null,
    itemState: null,
    itemValues: {}, //only for state
    isPosibleChangeState: true
  }

  componentWillMount = () => {
    const { categoryStates } = this.props
    const statesList = categoryStates ? categoryStates.list : null

    if (statesList && Object.keys(categoryStates).length) {
      const initialStatesIds = Object.keys(statesList).filter(
        id => statesList[id].initial
      )
      const initialStates = initialStatesIds.map(id => (
        {id, ...statesList[id]}
      ))
      const numInitialStates = initialStates.length
      const stateRequired = categoryStates.required === false  ? false : true
      let itemState = null
      let isPosibleChangeState = true

      if (stateRequired) {
        if (numInitialStates > 0) {
          itemState = initialStates[0]
          if (numInitialStates === 1) {
            isPosibleChangeState = false
          }
        } else {
          itemState = statesList[0]
        }
      }

      this.setState({ itemState, isPosibleChangeState })
    }
  }

  createItem = values => {
    const { onCreateItem, primaryFields, closeDialog } = this.props
    const { itemState } = this.state
    const title = getItemString(values, primaryFields)
    let valuesWithState = {...values}
    if (itemState) {
      valuesWithState = {...valuesWithState, state:itemState.id}
    }
    return onCreateItem(valuesWithState, title).then(() => {
      closeDialog()
    })
  }

  onStateSelected = state => {
    this.setState({ anchorEl: null, itemSelected: state })
  }

  handleStatesMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleStatesMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  renderDescription = () => {
    const { itemLabel, categoryStates, getNextStatesAsOperations } = this.props
    const { itemState, itemSelected, isPosibleChangeState } = this.state
    const statesList = categoryStates ? categoryStates.list : null

    if (!(statesList && Object.keys(statesList).length)) {
      return null
    }

    const { anchorEl } = this.state
    const stateText = itemState ? itemState.label : 'without state'
    return (
      <React.Fragment>
        <span>
          {`This ${itemLabel} will start ${itemState ? 'as ' : ' '}`}
        </span>
        <span
          onClick={isPosibleChangeState ? this.handleStatesMenuClick : null}
          style={isPosibleChangeState ?
            {textDecorationLine: 'underline', cursor: 'pointer'} :
            {}
          }
        >
          {stateText}
        </span>

        {isPosibleChangeState && (
          <React.Fragment>

            <IconButton
              disableRipple
              style={{fontSize:16, marginLeft:4, marginBottom:1, height:16, width:16}}
              color="inherit"
              onClick={this.handleStatesMenuClick}
            >
              <Directions />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleStatesMenuClose}
              horizontal="right"
              onExited={() => {
                this.setState({
                  itemState: itemSelected ? itemSelected : null
                })
              }}
              operations={
                getNextStatesAsOperations({
                  itemValues: {state:itemState ? itemState.id : null},
                  onSelected: this.onStateSelected
                })
              }
            />
          </React.Fragment>
        )}

      </React.Fragment>
    )

  }

  render = () => {
    const {
      closeDialog,
      fields,
      isFetchingFields,
      isCreatingItem,
      itemLabel
    } = this.props

    return (
      <HeaderLayout
        title={`New ${itemLabel}`}
        description={this.renderDescription()}
        loading={isFetchingFields || isCreatingItem}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'create', icon:Check, disabled: isFetchingFields || isCreatingItem, right: true, onClick: () => {
            this.formElement.dispatchEvent(new Event('submit'))
          }}
        ]}
      >
        <Form
          cols={12}
          view="detail"
          fields={fields}
          values={{}}
          handleSubmit={this.createItem}
          formRef={el => this.formElement = el}
        />
      </HeaderLayout>
    )
  }
}


CategoryItemNew.propTypes = {

  categoryId: PropTypes.string.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  getNextStatesAsOperations: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,

  itemLabel: PropTypes.string,
  primaryFields: PropTypes.array,
  categoryStates: PropTypes.object,
  fields: PropTypes.array,
  isFetchingFields: PropTypes.bool,
  isCreatingItem: PropTypes.bool
  
}

const mapStateToProps = ({ categories, fields, settings, items }, props) => {
  const categoryId = props.categoryId
  const category = categories.byId[categoryId]
  const categorySettings = category.settings ? settings.byId[category.settings] : {}
  const itemLabel = categorySettings.itemLabel
  return {
    itemLabel,
    primaryFields: categorySettings.primaryFields,
    categoryStates: categorySettings.states,
    fields: Object.values(fields.byId).filter(field => category.fields.includes(field.id)),
    isFetchingFields: fields.flow[categoryId].isFetchingAll,
    isCreatingItem: items.flow[categoryId].isUpdating
  }
}

export default connect(mapStateToProps, null)(CategoryItemNew)
