import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  SortingState, SelectionState, FilteringState, GroupingState,
  IntegratedFiltering, IntegratedGrouping, IntegratedSorting, IntegratedSelection,
  DataTypeProvider
} from '@devexpress/dx-react-grid'
import {
  Grid,
  VirtualTable, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
  GroupingPanel, DragDropProvider, TableColumnReordering, Toolbar
} from '@devexpress/dx-react-grid-material-ui'
import { isObject } from '../../../utils/helpers'
import { withStyles } from 'material-ui/styles'

const getCellValue = value => {
  if (isObject(value)) {
    return 'object'
  }
  return value
}

const getColumns = (fields=[]) => {
  const showingFields = fields.filter(field => field.views.table)
  return showingFields.map(field => ({
    name: field.id,
    title: field.label || '',
    getCellValue: row => getCellValue(row[field.id])
  }))
}

const getRowId = row => row.id

const Cell = props => {
  return <VirtualTable.Cell {...props} />
}

const CurrencyFormatter = ({ value }) =>
  <b style={{ color: 'darkblue' }}>${value}</b>

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={CurrencyFormatter}
    {...props}
  />
)

const DateFormatter = ({ value='' }) =>
  value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1')

const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    {...props}
  />
)

const styles = theme => ({
  row: {
    cursor: 'pointer',
    height: theme.standards.tableRowHeight
  }
})

class CategoryTableView extends Component {
  state = {
    columns: getColumns(this.props.fields),
    dateColumns: ['12330'],
    currencyColumns: ['12331'],
    selection: [],
    tableColumnExtensions: [
      { columnName: '12330', align: 'right' },
      { columnName: '12331' }
    ]
  }

  changeSelection = selection => {
    this.setState({ selection })
    this.props.changeActiveIds(selection)
  }

  render = () => {
    const { items, mode, editable, classes } = this.props
    const { columns, dateColumns, currencyColumns, selection, tableColumnExtensions } = this.state

    const allActionsAvailable =  mode !== 'relation' && editable
    const selectionActionAvailable = editable

    return (
      <Grid rows={items} columns={columns} getRowId={getRowId}>
        <DragDropProvider />

        <CurrencyTypeProvider for={currencyColumns} />
        <DateTypeProvider for={dateColumns} />

        <FilteringState
          /*defaultFilters={[{ columnName: '12344', value: 'Infinis' }]}*/
        />
        <SortingState
          defaultSorting={[
            { columnName: '12330', direction: 'asc' },
            { columnName: '12331', direction: 'asc' }
          ]}
        />
        <GroupingState
          /*defaultGrouping={[{ columnName: '12330' }]}
          defaultExpandedGroups={['EnviroCare Max']}*/
        />
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />

        <IntegratedFiltering />
        <IntegratedSorting />
        <IntegratedGrouping />
        <IntegratedSelection />

        <VirtualTable
          columnExtensions={tableColumnExtensions}
          cellComponent={Cell}
          estimatedHeight={20}
        />
        <TableHeaderRow showSortingControls />
        <TableColumnReordering defaultOrder={columns.map(column => column.name)} />
        <TableFilterRow />
        <TableSelection showSelectAll />
        <TableGroupRow />
        <Toolbar />
        <GroupingPanel showSortingControls />
      </Grid>
    )
  }
}

CategoryTableView.propTypes = {
  mode: PropTypes.oneOf(['normal', 'relation', 'selection']).isRequired,
  categoryId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
}

CategoryTableView.defaultProps = {
  
}

export default withStyles(styles)(CategoryTableView)