import React from 'react';
import LockIcon from '@material-ui/icons/Lock';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%'
  },
  gridTile: {
    cursor: 'pointer'
  },
  tileBar: {
    height: 90
  },
  followCheckButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    border: '1px solid #ffc107'
  },
  mapTypeIcon: {
    marginLeft: 16,
    marginRight: 16,
    color: '#fff',
    fontSize: '1.2rem'
  },
  mapTypeContainer: {
    display: 'grid'
  }
};

export default class MapCollection extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <GridList
          cols={this.props.large ? 4 : 2}
          style={styles.gridList}
          spacing={this.props.large ? 20 : 10}
          cellHeight={220}
        >
          {this.renderMaps(this.props.maps)}
        </GridList>
      </div>
    );
  }

  renderMaps(maps) {
    return maps.map(map => (
      <GridListTile
        key={map.id}
        onClick={() => this.props.handleClickMap(map)}
        style={styles.gridTile}
      >
        {map.following && this.renderFollowCheckButton() }
        <img src={this.props.large ? map.image_url : map.thumbnail_url} />
        <GridListTileBar
          title={map.name}
          subtitle={
            <div>
              <Typography
                variant="body2"
                color="inherit"
              >
                by: {map.owner_name}
              </Typography>
              <Typography
                variant="body2"
                color="inherit"
              >
                {map.followers_count} followers
              </Typography>
            </div>
          }
          actionIcon={
            <div style={styles.mapTypeContainer}>
              {map.private && this.renderPrivateIcon()}
            </div>
          }
          style={styles.tileBar}
        />
      </GridListTile>
    ));
  }

  renderFollowCheckButton() {
    return (
      <Button variant="outlined" size="small" color="primary" style={styles.followCheckButton}>
        Following
      </Button>
    );
  }

  renderPrivateIcon() {
    return (
      <LockIcon style={styles.mapTypeIcon} />
    );
  }
}
