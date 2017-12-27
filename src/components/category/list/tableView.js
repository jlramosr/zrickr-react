import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DataTypeProvider,
  SelectionState,
  PagingState,
  LocalPaging,
  SortingState,
  LocalSorting,
  GroupingState,
  LocalGrouping,
  FilteringState,
  LocalFiltering,
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
  DragDropContext,
  GroupingPanel
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
    const { relationMode, openDetailDialog } = this.props
    if (relationMode) {
      event.preventDefault()
      openDetailDialog(itemId)
    } else {
      const { categoryId, history } = this.props
      history.push(`${categoryId}/${itemId}`)
    }
  }

  render = () => {
    const {
      classes,
      fields,
      items,
      relationMode,
      editMode
    } = this.props
    const { 
      tableSelectedIndexes,
      currentPage,
      pageSize,
      allowedPageSizes,
      columnWidths
    } = this.state

    const showingFields = fields.filter(field => field.views.table)

    const defaultColumnWidths = showingFields.reduce(
      (accumulator, currentField) => (
        {...accumulator, [currentField.id]: 100 * (currentField.views.table.ys || 1)}),
      {}
    )

    const allActionsAvailable =  !relationMode && editMode
    const selectionActionAvailable = editMode

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
            type="string"
            formatterTemplate={({ value }) => 
              <span style={{ color: 'darkblue' }}>{value}</span>
            }
          />
          <DataTypeProvider
            type="progress"
            formatterTemplate={({ value }) => 
              <LinearProgress color="accent" mode="determinate" value={value} />
            }
          />
          <DataTypeProvider
            type="currency"
            formatterTemplate={({ value }) => 
              value ? 
                <span style={{ color: 'darkblue' }}>${value}</span> :
                null
            }
          />
          <DataTypeProvider
            type="date"
            formatterTemplate={({ value }) =>
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
          <LocalSorting />
          {allActionsAvailable && <LocalFiltering />}
          {allActionsAvailable && <LocalGrouping />}
          <LocalPaging />
          {allActionsAvailable && <DragDropContext />}
          {selectionActionAvailable &&
            <SelectionState
              defaultSelection={[]}
              onSelectionChange={this.changeSelection}
            />
          }
          <VirtualTable
            height={1280}
            allowColumnReordering={!relationMode}
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
          className={relationMode ? classes.relativeSnackbar : classes.snackbar}            
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
  classes: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  dense: PropTypes.bool,
  history: PropTypes.object,
  items: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  relationMode: PropTypes.bool,
  openDetailDialog: PropTypes.func
}

CategoryTableView.defaultProps = {
  dense: false,
  relationMode: false
}

export default withStyles(styles)(CategoryTableView)