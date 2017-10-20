import { createMuiTheme } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';

let theme = createMuiTheme({
    standards: {
      colors: {
        primary: {
          "50": "#FAFCF7",
          "100": "#EDF9E0",
          "200": "#D3E7BC",
          "300": "#A0D374",
          "400": "#86BF54",
          "500": "#689F38",
          "600": "#5E9031",
          "700": "#56852B",
          "800": "#487321",
          "900": "#355915",
          "A100": "#D3E7BC",
          "A200": "#86BF54",
          "A400": "#5E9031",
          "A700": "#355915",
          "contrastDefaultColor": "light",
          ...grey,
        },
        secondary: {
          "50": "#FFF6EC",
          "100": "#FFEEDB",
          "200": "#FDD3A5",
          "300": "#FAB268",
          "400": "#FF9800",
          "500": "#F57C00",
          "600": "#DD7101",
          "700": "#CC6900",
          "800": "#B45C00",
          "900": "#9F5100",
          "A100": "#FDD3A5",
          "A200": "#F57C00",
          "A400": "#DD7101",
          "A700": "#9F5100",
          "contrastDefaultColor": "light",
        },
        "error": {
          "50": "#ffebee",
          "100": "#ffcdd2",
          "200": "#ef9a9a",
          "300": "#e57373",
          "400": "#ef5350",
          "500": "#f44336",
          "600": "#e53935",
          "700": "#d32f2f",
          "800": "#c62828",
          "900": "#b71c1c",
          "A100": "#ff8a80",
          "A200": "#ff5252",
          "A400": "#ff1744",
          "A700": "#d50000",
          "contrastDefaultColor": "light",
        },
        grey: {
          "50": "#FAFAFA",
          "100": "#F5F5F5",
          "200": "#EEEEEE",
          "300": "#E0E0E0",
          "400": "#BDBDBD",
          "500": "#9E9E9E",
          "600": "#757575",
          "700": "#616161",
          "800": "#424242",
          "900": "#212121",
          "A100": "#EEEEEE",
          "A200": "#BDBDBD",
          "A400": "#616161",
          "A700": "#212121",
          "contrastDefaultColor": "light",
        },
      },
      toolbarHeights: {
        mobilePortrait: 56,
        mobileLandscape: 48,
        tabletDesktop: 64,
      },
      listCellDense: {
        height: 20,
        lineHeight: '14px',
      },
      drawerWidth: 240,
      fontFamily:
        '-apple-system,system-ui,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    },
  });
  
  theme = {
    ...theme,
    overrides: {
      ...theme.overrides,
  
      
      MuiAppBar: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      MuiDrawer: {
        paper: {
          width: theme.standards.drawerWidth,
        },
      },
  
  
      GridLayout: {
        headingPanel: {
          background: theme.standards.colors.secondary[100],
        },
      },
      MuiTableRow: {
        root: {
        },
        head: {
          background: theme.standards.colors.secondary[50],
        },
      },
      MuiTableHead: {
        root: {
        }
      },
      TableHeaderCell: {
        title: {
          fontWeight: 700,
        },
      },
      TableFilterCell: {
        cell: {
          paddingTop: 0,
          paddingRight: 12,
        },
      },
      MuiTableCell: {
        padding: {
          padding: '0 12px',
        },
      },
      PageSizeSelector: {
        select: {
          width: 30,
        },
      },
  
  
      MuiList: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
          [`${theme.breakpoints.up('sm')}`]: {
            paddingTop: theme.spacing.unit,
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit*2,
            paddingRight: theme.spacing.unit*2,
          },
          [`${theme.breakpoints.up('md')}`]: {
            paddingLeft: theme.spacing.unit*3,
            paddingRight: theme.spacing.unit*3,
          },
          [`${theme.breakpoints.up('lg')}`]: {
            paddingLeft: theme.spacing.unit*4,
            paddingRight: theme.spacing.unit*4,
          },
        },
        dense: {
          padding: 0,
        }
      },
      MuiListItem: {
        root: {
          outline: 'none',
        },
        dense: {
          height: theme.standards.listCellDense.height,
        },
      },
      MuiListItemText: {
        textDense: {
          lineHeight: theme.standards.listCellDense.lineHeight,
        }
      },
  
      
    },
    palette: {
      ...theme.palette,
      ...theme.standards.colors,
    },
    typography: {
      ...theme.typography,
      fontFamily: theme.standards.fontFamily,
    },
    mixins: {
      ...theme.mixins,
      toolbar: {
        minHeight: theme.standards.toolbarHeights.mobilePortrait,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          minHeight: theme.standards.toolbarHeights.mobileLandscape,
        },
        [theme.breakpoints.up('sm')]: {
          minHeight: theme.standards.toolbarHeights.tabletDesktop,
        },
      },
    },
  }

  export default theme;