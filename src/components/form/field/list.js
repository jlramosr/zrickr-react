import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import CategoryList from '../../category/list'

let ListField = props => {
  const { relation, label, classes } = props
  return (
    <Paper elevation={4} className={classes.list}>
      <CategoryList
        relationMode={true}
        tableMode={false}
        categoryId={relation}
        categoryLabel={label || props.relationLabel}
        categorySettingsId={props.relationSettingsId}
        categoryFieldsIds={props.relationFieldsIds}
        categoryItemsIds={props.relationItemsIds}
        showAvatar={false}
      />
    </Paper>
  )
}

ListField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.array,
  relation: PropTypes.string,
  value: PropTypes.any,
  order: PropTypes.number,
  handleFormFieldChange: PropTypes.func
}

export default ListField