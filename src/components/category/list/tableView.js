import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DataTypeProvider,
  SelectionState,
  PagingState,
  IntegratedPaging,
  SortingState,
  IntegratedSorting,
  GroupingState,
  IntegratedGrouping,
  FilteringState,
  IntegratedFiltering,
  TableColumnResizing
} from '@devexpress/dx-react-grid'
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  TableGroupRow,
  TableSelection,
  PagingPanel,
  DragDropProvider,
  GroupingPanel,
  Toolbar
} from '@devexpress/dx-react-grid-material-ui'
import { TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import { LinearProgress } from 'material-ui/Progress'
import Delete from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  row: {
    cursor: 'pointer',
    height: theme.standards.tableRowHeight
  },
  snackbar: {
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    overflow: 'hidden',
    minHeight: theme.standards.toolbarHeights.mobilePortrait,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight: theme.standards.toolbarHeights.mobileLandscape
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.standards.toolbarHeights.tabletDesktop
    }
  },
  relativeSnackbar: {

  },
  snackbarContent: {
    width: '100%',
    flex: 1,
    maxWidth: 'inherit',
    flexWrap: 'inherit'
  }
})

let CategoryTableView = class extends Component {
  state = {
    tableSelectedIndexes: [],
    currentPage: 0,
    pageSize: 20,
    allowedPageSizes: [20,50,200,500,0],
    columnOrder: null,
    columnWidths: null
  }

  changeCurrentPage = currentPage => this.setState({ currentPage })
  
  changePageSize = pageSize => this.setState({ pageSize })

  changeColumnOrder = columnOrder => this.setState({ columnOrder })

  changeColumnWidths = columnWidths => this.setState({ columnWidths })

  changeSelection = tableSelectedIndexes => this.setState({tableSelectedIndexes})

  changeFiltering = filters => console.log(filters)

  rowClick = (event, itemId) => {
    
  }

  getColumnsOfType = (fields, type) => {
    const columns = fields.reduce((tempColumns, field) => {
      let fieldType = field.type
      if (!fieldType) {
        fieldType = 'string'
      }
      if (fieldType === type) {
        return [...tempColumns, field.id]
      }
      return tempColumns
    }, [])
    return columns
  }


  render = () => {
    const {
      classes,
      fields,
      items,
      mode,
      editable
    } = this.props
    const { 
      tableSelectedIndexes,
      currentPage,
      pageSize,
      allowedPageSizes,
      columnWidths
    } = this.state

    const showingFields = fields.filter(field => field.views.table)

    const defaultColumnWidths = showingFields.reduce((accumulator, currentField) => (
      [...accumulator, {columnName: currentField.id, width: 100 * (currentField.views.table.ys || 1)}]
    ), [])

    const allActionsAvailable =  mode !== 'relation' && editable
    const selectionActionAvailable = editable

    return (
      <React.Fragment>
        <Grid
          rows={items}
          columns={showingFields.map(field => {
            //https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/getting-started/
            return {
              title: field.label || '',
              name: field.id,
              dataType: field.type || 'string',
              align: field.type === 'number' ? 'right' : 'left'
            }
          })}
          getCellValue={ (row, columnName) => {
            const value = row[columnName]
            if (typeof value === 'object') {
              return Object.keys(value).toString()
            }
            return value
          }}
        >
          <DataTypeProvider
            for={this.getColumnsOfType(showingFields, 'string')}
            formatterComponent={({ value }) => 
              <span style={{ color: 'darkblue' }}>{value}</span>
            }
          />
          <DataTypeProvider
            for={this.getColumnsOfType(showingFields, 'progress')}
            formatterComponent={({ value }) => 
              <LinearProgress color="accent" mode="determinate" value={value} />
            }
          />
          <DataTypeProvider
            for={this.getColumnsOfType(showingFields, 'currency')}
            formatterComponent={({ value }) => 
              value ? 
                <span style={{ color: 'darkblue' }}>${value}</span> :
                null
            }
          />
          <DataTypeProvider
            for={this.getColumnsOfType(showingFields, 'date')}
            formatterComponent={({ value }) =>
              value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1')}
          />
          <SortingState
            defaultSorting={[]}
          />
          <PagingState 
            defaultCurrentPage={0}
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          {allActionsAvailable &&
            <FilteringState
              defaultFilters={[]}
              onFiltersChange={this.changeFiltering}
            />
          }
          {allActionsAvailable &&
            <GroupingState
              defaultGroups={[]}
            />
          }
          <IntegratedSorting />
          {allActionsAvailable && <IntegratedFiltering />}
          {allActionsAvailable && <IntegratedGrouping />}
          <IntegratedPaging />
          {allActionsAvailable && <DragDropProvider />}
          {selectionActionAvailable &&
            <SelectionState
              defaultSelection={[]}
              onSelectionChange={this.changeSelection}
            />
          }
          <VirtualTable
            height={1280}
            allowColumnReordering={mode !== 'relation'}
            tableRowTemplate={({ children, row, tableRow }) => (
              <TableRow
                hover
                selected={tableSelectedIndexes.includes(tableRow.rowId)}
                className={classes.row}
                onClick={event => this.rowClick(event, row.id)}
              >
                {children}
              </TableRow>
            )}
          />
          {allActionsAvailable &&
            <TableColumnResizing
              columnWidths={columnWidths || defaultColumnWidths}
              onColumnWidthsChange={this.changeColumnWidths}
            />
          }
          <TableHeaderRow
            allowSorting
            allowDragging={allActionsAvailable}
            allowResizing={allActionsAvailable}
            //allowGroupingByClick 
          />
          {allActionsAvailable && <TableFilterRow />}
          {selectionActionAvailable && <TableSelection />}
          <PagingPanel
            allowedPageSizes={allowedPageSizes}
          />
          {allActionsAvailable && <Toolbar />}
          {allActionsAvailable &&
            <GroupingPanel
              allowSorting
              allowDragging
              allowUngroupingByClick
            />
          }
          {allActionsAvailable && <TableGroupRow />}
        </Grid>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={Boolean(tableSelectedIndexes.length)}
          className={mode === 'relation' ? classes.relativeSnackbar : classes.snackbar}            
          transitionDuration={{
            enter: 200,
            exit: 0
          }}
          SnackbarContentProps={{
            className: classes.snackbarContent
          }}
          message={
            <span>
              {tableSelectedIndexes.length} selected
            </span>
          }
          action={[
            <Button key="undo" color="accent" dense onClick={this.handleRequestClose}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleRequestClose}
            >
              <Delete />
            </IconButton>
          ]}
        />
      </React.Fragment>
    )
  }
}

CategoryTableView.propTypes = {
  mode: PropTypes.oneOf(['normal', 'relation', 'selection']).isRequired,
  categoryId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  showAvatar: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

CategoryTableView.defaultProps = {
  
}

export default withStyles(styles)(CategoryTableView)