import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchSettingsIfNeeded } from '../../../actions/settings'
import { fetchFieldsIfNeeded } from '../../../actions/fields'
import Paper from 'material-ui/Paper'
import CategoryList from '../../category/list'

class ListField extends Component {

  componentWillMount = () => {
    if (this.props.relation) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
    }
  }

  _getItemIds() {
    const { value } = this.props
    return (
      typeof value === 'object' && !Array.isArray(value) ? (
        Object.keys(value).reduce((ids, id) => (
          value[id] ? [...ids, id] : [...ids]
        ), [])
      ) : (
        value || []
      )
    )
  }

  render = () => {
    const {
      id,
      relation,
      relationLabel,
      infoMode,
      readonly,
      label,
      handleFormFieldChange,
      classes 
    } = this.props
    const processedItemIds = this._getItemIds()
    return (
      <Paper elevation={4} className={classes.list}>
        <CategoryList
          categoryId={relation}
          categoryLabel={label || relationLabel}
          itemIds={processedItemIds}
          relationMode={true}
          relationFieldId={id}
          editMode={!infoMode && !readonly}
          tableMode={false}
          showAvatar={false}
          handleFormFieldChange={newItemIds =>
            handleFormFieldChange(id, newItemIds, true)
          }
        />
      </Paper>
    )
  }
}

ListField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  infoMode: PropTypes.bool,
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  handleFormFieldChange: PropTypes.func
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.relation
  return {
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId))
  }
}

export default connect(null, mapDispatchToProps)(ListField)