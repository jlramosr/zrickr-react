import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchSettingsIfNeeded } from '../../../actions/settings'
import { fetchFieldsIfNeeded } from '../../../actions/fields'
import Paper from 'material-ui/Paper'
import CategoryList from '../../category/list/'

class ListField extends Component {

  componentWillMount = () => {
    if (this.props.relation) {
      this.props.fetchSettingsIfNeeded()
      this.props.fetchFieldsIfNeeded()
    }
  }

  //{2134: true, 2135: added} => [{id:2134, state:true}, {id:2135, state:added}]
  statesObjectToArray = object =>
    (Object.keys(object) || []).map(id => ({id, state:object[id]}))

  //[{id:2134, state:true}, {id:2135, state:added}] => {2134: true, 2135: added}
  statesArrayToObject = array =>
    array.reduce((stateIds, idState) => (
      {...stateIds, [idState.id]: idState.state}
    ), {})

  render = () => {
    const {
      id,
      value,
      relation,
      relationLabel,
      infoMode,
      readonly,
      label,
      sendFormFieldChange,
      classes
    } = this.props
    
    return (
      <Paper elevation={4} className={classes.list}>
        <CategoryList
          categoryId={relation}
          categoryLabel={label || relationLabel}
          filterItemIds={this.statesObjectToArray(value)}
          relationMode
          relationFieldId={id}
          editMode={!infoMode && !readonly}
          tableMode={false}
          showAvatar={false}
          sendFormFieldChange={newFilterItemIds => {
            sendFormFieldChange(id, this.statesArrayToObject(newFilterItemIds))
          }}
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
  sendFormFieldChange: PropTypes.func
}

const mapDispatchToProps = (dispatch, props) => {
  const categoryId = props.relation
  return {
    fetchSettingsIfNeeded: () => dispatch(fetchSettingsIfNeeded(categoryId)),
    fetchFieldsIfNeeded: () => dispatch(fetchFieldsIfNeeded(categoryId))
  }
}

export default connect(null, mapDispatchToProps)(ListField)