import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import transitions from 'material-ui/styles/transitions';

import HomeIcon from 'material-ui/svg-icons/action/home';
import PlayerIcon from 'material-ui/svg-icons/action/face';
import DrawIcon from 'material-ui/svg-icons/image/color-lens';
import InfoIcon from 'material-ui/svg-icons/action/info';

import Home from './routes/Home.jsx';
import Players from './routes/Players.jsx';
import Draw from './routes/Draw.jsx';
import Info from './routes/Info.jsx';

const styles = {
  content: {
    paddingTop: 40,
    maxWidth: 800,
    transition: transitions.easeOut(null, 'padding-left', null),
    margin: 'auto',
    textAlign: 'center',
  },
  logo: {
    width: 80,
    margin: '30px 80px',
  },
};

const muiTheme = getMuiTheme({
  fontFamily: 'Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif',
  palette: {
    primary1Color: '#25737c',
    primary2Color: '#DE0670',
    primary3Color: '#fff',
    textColor: '#25737c',
  },
});

const routes = [
  {
    link: '/',
    exact: true,
    title: 'Home',
    component: Home,
    icon: <HomeIcon/>,
  },
  {
    link: '/players',
    title: 'Players',
    component: Players,
    icon: <PlayerIcon/>,
  },
  {
    link: '/draw',
    title: 'Draw',
    component: Draw,
    icon: <DrawIcon/>,
  },
  {
    link: '/info',
    title: 'Info',
    component: Info,
    icon: <InfoIcon/>,
  },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: {
        open: false,
        docked: false,
      },
      user: {
        name: 'Tamara Czakert',
      },
    };
  }

  toggleDrawer() {
    this.setState({
      drawer: {
        ...this.state.drawer,
        open: !this.state.drawer.open,
      },
    });
  }

  closeDrawer() {
    this.toggleDrawer();
  }

  render() {
    const paddingLeft = (this.state.drawer.docked ? 256 : 0) + 16;

    console.log('[theme]', this.state.theme);

    return <MuiThemeProvider muiTheme={muiTheme}>
      <Router>
      <div>
        <AppBar title={this.state.user.name}
                onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                style={{ paddingLeft }}
                />
        <Drawer open={this.state.drawer.open}
                docked={this.state.drawer.docked}
                onRequestChange={() => this.toggleDrawer()}>
          <img src="./logo.png"style={{ ...styles.logo }}/>
          {routes.map(route =>
              <Link to={route.link} key={route.link} style={styles.menuLink}>
                <MenuItem primaryText={route.title}
                          leftIcon={route.icon}
                          onTouchTap={() => this.closeDrawer()}>
                </MenuItem>

              </Link>)}
        </Drawer>
        <div style={{ ...styles.content }}>
          {routes.map(route => (
              <Route exact={route.exact}
                     key={route.link}
                     path={route.link}
                     component={route.component}/>
          ))}
        </div>
      </div>
      </Router>
    </MuiThemeProvider>;
  }
}
