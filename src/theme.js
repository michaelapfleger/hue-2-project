import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default function theme() {
  return getMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
      primary1Color: '#17A188',
      primary2Color: '#DE0670',
      primary3Color: '#fff',
      textColor: '#DE0300',
    },
    drawer: {
      width: 500,
    },
  });
}
