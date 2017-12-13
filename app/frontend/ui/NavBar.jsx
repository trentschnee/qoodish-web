import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import HomeIcon from 'material-ui-icons/Home';
import ExploreIcon from 'material-ui-icons/Explore';
import MapIcon from 'material-ui-icons/Map';
import SettingsIcon from 'material-ui-icons/Settings';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import NotificationsIcon from 'material-ui-icons/Notifications';
import moment from 'moment';
import Badge from 'material-ui/Badge';

const styles = {
  title: {
    cursor: 'pointer'
  },
  toolbar: {
    paddingLeft: 10,
    paddingRight: 10
  },
  menuButton: {
    color: 'white'
  },
  logo: {
    cursor: 'pointer',
    color: 'white',
    paddingLeft: 8
  },
  pageTitleLarge: {
    cursor: 'pointer',
    color: 'white',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    paddingLeft: 24,
    marginLeft: 24
  },
  pageTitleSmall: {
    cursor: 'pointer',
    color: 'white',
    marginLeft: 10
  },
  rightContents: {
    marginLeft: 'auto',
    paddingRight: 10,
    display: 'flex'
  },
  listItemContent: {
    overflow: 'hidden',
  },
  notificationText: {
    paddingRight: 32,
    fontSize: 14
  },
  fromNow: {
    fontSize: 14
  },
  notificationImage: {
    width: 40,
    height: 40
  },
  secondaryAvatar: {
    borderRadius: 0,
    marginRight: 12
  },
  notificationMenuItem: {
    height: 'auto'
  },
  notificationButton: {
    marginRight: 10
  },
  noContentsContainer: {
    textAlign: 'center',
    color: '#9e9e9e',
    height: 'auto',
    display: 'flow-root'
  },
  noContentsIcon: {
    width: 80,
    height: 80
  }
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
    this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
    this.handleRequestAvatarMenuClose = this.handleRequestAvatarMenuClose.bind(this);
    this.handleNotificationButtonClick = this.handleNotificationButtonClick.bind(this);
    this.handleRequestNotificationClose = this.handleRequestNotificationClose.bind(this);

    this.state = {
      drawerOpen: false,
      anchorEl: undefined,
      accountMenuOpen: false,
      notificationOpen: false
    };
  }

  componentWillMount() {
    this.props.handleMount();
  }

  handleTitleClick() {
    window.location.reload();
  }

  handleAvatarClick(event) {
    this.setState({
      accountMenuOpen: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestAvatarMenuClose(event) {
    this.setState({
      accountMenuOpen: false
    });
  }

  handleNotificationButtonClick(event) {
    this.setState({
      notificationOpen: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestNotificationClose(event) {
    this.setState({
      notificationOpen: false
    });
  }

  handleToggleDrawer(event) {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  handleCloseDrawer() {
    this.setState({
      drawerOpen: false
    });
  }

  render() {
    return (
      <div>
        <AppBar position='fixed'>
          <Toolbar disableGutters style={styles.toolbar}>
            <IconButton color='contrast' onClick={this.handleToggleDrawer}>
              <MenuIcon style={styles.menuButton} />
            </IconButton>
            {this.props.large ? this.renderLogo() : null}
            <Typography
              type='headline'
              color='inherit'
              style={this.props.large ? styles.pageTitleLarge : styles.pageTitleSmall}
              onClick={this.handleTitleClick}
            >
              {this.props.pageTitle}
            </Typography>
            <div style={styles.rightContents}>
              {this.renderNotificationCenter()}
              {this.renderNotificationMenu()}
              {this.renderAvatar()}
              {this.renderAvatarMenu()}
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          open={this.state.drawerOpen}
          onRequestClose={this.handleCloseDrawer}
          onClick={this.handleCloseDrawer}
        >
          {this.renderDrawerContents()}
        </Drawer>
      </div>
    );
  }

  renderLogo() {
    return (
      <Typography type='headline' color='inherit' style={styles.logo} onClick={this.props.requestHome}>
        Qoodish
      </Typography>
    );
  }

  renderNotificationCenter() {
    return (
      <IconButton
        aria-label='Notification'
        aria-owns={this.state.notificationOpen ? 'notification-menu' : null}
        aria-haspopup='true'
        onClick={this.handleNotificationButtonClick}
        style={styles.notificationButton}
      >
        {
          this.props.unreadNotifications.length > 0 ?
            <Badge
              badgeContent={this.props.unreadNotifications.length}
              color='accent'
            >
              <NotificationsIcon />
            </Badge>
          : <NotificationsIcon />
        }
      </IconButton>
    );
  }

  renderNotificationMenu() {
    return (
      <Menu
        id='notification-menu'
        anchorEl={this.state.anchorEl}
        open={this.state.notificationOpen}
        onRequestClose={this.handleRequestNotificationClose}
        onEntered={() => this.props.readNotifications(this.props.notifications)}
        style={styles.notificationMenu}
      >
        {this.props.notifications.length > 0 ? this.renderNotifications(this.props.notifications) : this.renderNoNotifications()}
      </Menu>
    );
  }

  renderNoNotifications() {
    return (
      <MenuItem style={styles.noContentsContainer}>
        <NotificationsIcon style={styles.noContentsIcon} />
        <Typography type='subheading' color='inherit'>
          No notifications.
        </Typography>
      </MenuItem>
    );
  }

  renderNotifications(notifications) {
    return notifications.map((notification) => (
      <MenuItem onClick={() => this.props.handleNotificationClick(notification)} key={notification.id} style={styles.notificationMenuItem}>
        <Avatar src={notification.notifier && notification.notifier.profile_image_url} />
        <ListItemText
          primary={
            <div style={styles.notificationText}>
              <b>{notification.notifier && notification.notifier.name}</b> {notification.key} your {this.renderResourceName(notification.notifiable.notifiable_type)}.
            </div>
          }
          secondary={
            <div style={styles.fromNow}>
              {this.fromNow(notification)}
            </div>
          }
          style={styles.listItemContent}
        />
        {notification.notifiable && notification.notifiable.image_url &&
          <ListItemSecondaryAction>
            <Avatar style={styles.secondaryAvatar}>
              <img src={notification.notifiable.image_url} style={styles.notificationImage} />
            </Avatar>
          </ListItemSecondaryAction>
        }
      </MenuItem>
    ));
  }

  renderResourceName(type) {
    switch(type) {
      case 'Review':
        return 'report';
      case 'Map':
        return 'map';
      default:
        'post';
    }
  }

  fromNow(notification) {
    return moment(notification.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ').locale(window.currentLocale).fromNow();
  }

  renderAvatar() {
    return (
      <IconButton
        aria-label='Account'
        aria-owns={this.state.accountMenuOpen ? 'account-menu' : null}
        aria-haspopup='true'
        onClick={this.handleAvatarClick}
      >
        <Avatar src={this.props.currentUser ? this.props.currentUser.image_url : ''} />
      </IconButton>
    );
  }

  renderAvatarMenu() {
    return (
      <Menu
        id='account-menu'
        anchorEl={this.state.anchorEl}
        open={this.state.accountMenuOpen}
        onRequestClose={this.handleRequestAvatarMenuClose}
      >
        <MenuItem onClick={this.props.requestSettings}>Settings</MenuItem>
        <MenuItem onClick={this.props.signOut}>Logout</MenuItem>
      </Menu>
    );
  }

  renderDrawerContents() {
    return (
      <div>
        <List disablePadding>
          <div>
            <ListItem divider={true}>
              <ListItemText disableTypography primary={this.renderTitle()} secondary={this.renderTitleSecondary()} />
            </ListItem>
            <ListItem button onClick={this.props.requestHome}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
            <ListItem button onClick={this.props.requestDiscover}>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary='Discover' />
            </ListItem>
            <ListItem button onClick={this.props.requestMaps}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary='Maps' />
            </ListItem>
            <Divider />
            <ListItem button onClick={this.props.requestSettings}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary='Settings' />
            </ListItem>
          </div>
        </List>
      </div>
    );
  }

  renderTitle() {
    return (
      <Typography type='headline' color='secondary' style={styles.title} onClick={this.props.requestHome}>
        Qoodish
      </Typography>
    );
  }

  renderTitleSecondary() {
    return (
      <Typography type='caption' color='secondary'>
        {`v${process.env.npm_package_version}`}
      </Typography>
    );
  }
}

export default NavBar;
