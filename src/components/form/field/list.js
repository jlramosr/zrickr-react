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

  render = () => {
    const {
      relation,
      relationLabel,
      infoMode,
      readonly,
      label,
      value,
      classes 
    } = this.props

    const itemIds = (
      typeof value === 'object' ? 
        Object.keys(value).reduce((ids, id) => (
          value[id] ? [...ids, id] : [...ids]), []
        ) :
        value
    )

    return (
      <Paper elevation={4} className={classes.list}>
        <CategoryList
          categoryId={relation}
          categoryLabel={label || relationLabel}
          itemIds={itemIds || []}
          relationMode={true}
          editMode={!infoMode && !readonly}
          tableMode={false}
          showAvatar={false}
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