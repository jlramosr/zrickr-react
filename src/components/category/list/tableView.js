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
import { getItemString } from './../utils/helpers'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  row: {
    cursor: 'pointer',
    height: 32,
    '&:hover': {
      background: theme.palette.grey.light
    }
  },

  cell: {
  }
})

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

  renderRow = props => {
    const { primaryFields, primaryFieldsSeparator, classes } = this.props
    const { row } = props
    const primaryInfo = getItemString(row, primaryFields, primaryFieldsSeparator) || ' '
    return <VirtualTable.Row
      onClick={() => this.props.onItemClick(row.id, primaryInfo)}
      className={classes.row}
      {...props}
    />
  }

  renderCell = props => {
    const { classes } = this.props
    return <VirtualTable.Cell className={classes.cell} {...props} />
  }

  changeSelection = selection => {
    this.setState({ selection })
    this.props.changeActiveIds(selection)
  }

  render = () => {
    const { items, mode, editable } = this.props
    const { columns, dateColumns, currencyColumns, selection, tableColumnExtensions } = this.state

    const allActionsAvailable =  mode !== 'relation' && editable
    const selectionActionAvailable = mode !== 'relation'

    return (
      <Grid rows={items} columns={columns} getRowId={getRowId}>
        {allActionsAvailable &&
          <DragDropProvider />
        }
        
        <CurrencyTypeProvider for={currencyColumns} />
        <DateTypeProvider for={dateColumns} />

        {allActionsAvailable &&
          <FilteringState
            /*defaultFilters={[{ columnName: '12344', value: 'Infinis' }]}*/
          />
        }
        <SortingState
          defaultSorting={[
            { columnName: '12330', direction: 'asc' },
            { columnName: '12331', direction: 'asc' }
          ]}
        />

        {allActionsAvailable &&
          <GroupingState
            /*defaultGrouping={[{ columnName: '12330' }]}
            defaultExpandedGroups={['EnviroCare Max']}*/
          />
        }
        
        {selectionActionAvailable && 
          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
        }

        <IntegratedSorting />
        {allActionsAvailable &&
          <IntegratedFiltering />
        }
        {allActionsAvailable &&
          <IntegratedGrouping />
        }
        {selectionActionAvailable &&
          <IntegratedSelection />
        }

        <VirtualTable
          columnExtensions={tableColumnExtensions}
          rowComponent={this.renderRow}
          cellComponent={this.renderCell}
        />
        <TableHeaderRow showSortingControls />

        {allActionsAvailable &&
          <TableColumnReordering defaultOrder={columns.map(column => column.name)} />
        }
        {allActionsAvailable &&
          <TableFilterRow />
        }
        {allActionsAvailable &&
          <TableGroupRow />
        }
        {selectionActionAvailable &&
          <TableSelection showSelectAll />
        }
        {allActionsAvailable &&
          <Toolbar />
        }
        {allActionsAvailable &&
          <GroupingPanel showSortingControls />
        }
      </Grid>
    )
  }
}

CategoryTableView.propTypes = {
  mode: PropTypes.oneOf(['normal', 'relation', 'election']).isRequired,
  categoryId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
}

CategoryTableView.defaultProps = {
  
}

export default withStyles(styles)(CategoryTableView)