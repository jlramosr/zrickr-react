import { createMuiTheme } from 'material-ui/styles'

let theme = createMuiTheme({
  standards: {
    colors: {
      primary: {
        'extraLight': '#FAFCF7',
        'light': '#DCEDC8',
        'main': '#689F38',
        'dark': '#56852B',
        'extraDark': '#355915',
        'contrastText': 'rgba(255, 255, 255, 1)'
      },
      secondary: {
        'extraLight': '#FFEEDB',
        'light': '#FDD3A5',
        'main': '#FF9800',
        'dark': '#F57C00',
        'extraDark': '#9F5100',
        'contrastText': 'rgba(255, 255, 255, 1)'
      },
      error: {
        'light': '#ffebee',
        'main': '#f44336',
        'dark': '#b71c1c'
      },
      success: {
        'light': '#E6F8E0',
        'main': '#689F38',
        'dark': '#355915',
        'contrastText': 'rgba(255, 255, 255, 1)'      
      },
      grey: {
        '50': '#FAFAFA',
        '100': '#F5F5F5',
        '200': '#EEEEEE',
        '300': '#E0E0E0',
        '400': '#BDBDBD',
        '500': '#9E9E9E',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
        'A100': '#EEEEEE',
        'A200': '#BDBDBD',
        'A400': '#616161',
        'A700': '#212121',
        'contrastDefaultColor': 'light'
      }
    },
    toolbarHeights: {
      mobilePortrait: 56,
      mobileLandscape: 48,
      tabletDesktop: 64
    },
    tableRowHeight: 26,
    listCellDense: {
      height: 36,
      lineHeight: '14px'
    },
    drawerWidth: 240,
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,' +
      '\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,sans-serif'
  }
})
  
theme = {
  ...theme,
  overrides: {
    ...theme.overrides,

    
    MuiAppBar: {
      root: {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    MuiDrawer: {
      paper: {
        width: theme.standards.drawerWidth
      }
    },
    MuiInput: {
      disabled: {
        outline: 'none'
      }
    },


    GridLayout: {
      headingPanel: {
        background: theme.standards.colors.secondary[100],
        fontSize: 14,
        paddingTop: theme.spacing.unit/2,
        paddingBottom: theme.spacing.unit/2,
        paddingRigth: theme.spacing.unit*3,
        paddingLeft: theme.spacing.unit*2,
        height: 32,
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      },
      footerPanel: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        padding: theme.spacing.unit
      }
    },
    MuiTableRow: {
      head: {
        height: theme.standards.tableRowHeight,
        background: theme.standards.colors.secondary[50]
      }
    },
    TableHeaderCell: {
      cell: {
        fontWeight: 700,
        paddingLeft: theme.spacing.unit*2
      }
    },
    TableFilterCell: {
      cell: {
        paddingTop: 0,
        paddingRight: 12,
        paddingLeft: theme.spacing.unit*2
      }
    },
    TableCell: {
      cell: {
        paddingLeft: theme.spacing.unit*2
      }
    },
    MuiCheckbox: {
      default: {
        width: theme.standards.tableRowHeight,
        height: theme.standards.tableRowHeight,
        marginTop: 2
      }
    },
    TableContainer: {
      root: {
        height: 'calc(100vh - 156px) !important',
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100vh - 164px) !important'
        }
      }
    },
    TableSelectCell: {
      cell: {
        paddingLeft: theme.spacing.unit*2
      },
      checkbox: {
        width: theme.standards.tableRowHeight,
        height: theme.standards.tableRowHeight,
        marginTop: 2
      }
    },
    TableSelectAllCell: {
      cell: {
        paddingLeft: theme.spacing.unit*2
      }
    },
    PageSizeSelector: {
      pageSizeSelector: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 2,
        color: theme.standards.colors.primary[900]
      }
    },


    MuiListItem: {
      root: {
        outline: 'none'
      },
      dense: {
        height: theme.standards.listCellDense.height
      }
    },
    MuiListItemText: {
      textDense: {
        lineHeight: theme.standards.listCellDense.lineHeight
      }
    }
  },

  palette: {
    ...theme.palette,
    ...theme.standards.colors
  },
  typography: {
    ...theme.typography,
    fontFamily: theme.standards.fontFamily
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: theme.standards.toolbarHeights.mobilePortrait,
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        minHeight: theme.standards.toolbarHeights.mobileLandscape
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: theme.standards.toolbarHeights.tabletDesktop
      }
    }
  }
}

export default theme