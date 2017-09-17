import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import RateReviewIcon from 'material-ui-icons/RateReview';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import ShareIcon from 'material-ui-icons/Share';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReviewCardContainer from '../containers/ReviewCardContainer';
import EditReviewDialogContainer from '../containers/EditReviewDialogContainer';
import DeleteReviewDialogContainer from '../containers/DeleteReviewDialogContainer';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemText } from 'material-ui/List';
import MapIcon from 'material-ui-icons/Map';
import CreateMapDialogContainer from '../containers/CreateMapDialogContainer.js';

const styles = {
  rootLarge: {
    margin: '94px auto 200px',
    width: '40%'
  },
  rootSmall: {
    margin: '64px auto 200px',
    width: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 20
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: 20
  },
  progress: {
    textAlign: 'center',
    padding: 10,
    marginTop: 20
  },
  noContentsContainer: {
    textAlign: 'center',
    color: '#9e9e9e',
    marginTop: 20
  },
  noContentsIcon: {
    width: 150,
    height: 150
  },
  profileImage: {
    width: 40
  },
  mapsContainer: {
    position: 'absolute',
    top: 94,
    left: 0,
    marginLeft: 20,
    minWidth: 'calc(30% - 40px)'
  },
  mapImage: {
    width: 40,
    height: 40
  },
  raisedButton: {
    width: '100%',
    marginBottom: 10
  }
};

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.handleClickLoadMoreButton = this.handleClickLoadMoreButton.bind(this);
  }

  componentWillMount() {
    this.props.updatePageTitle();
    this.props.refreshReviews();
    this.props.refreshMaps();
  }

  handleClickLoadMoreButton() {
    this.props.loadMoreReviews(this.props.nextTimestamp);
  }

  renderProgress() {
    return (
      <div style={styles.progress}>
        <CircularProgress />
      </div>
    );
  }

  renderLoadMoreButton() {
    if (this.props.noMoreReviews) {
      return null;
    }
    return (
      <div style={styles.buttonContainer}>
        <Button raised onClick={this.handleClickLoadMoreButton} style={styles.raisedButton}>
          Load More
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div style={this.props.large ? styles.rootLarge : styles.rootSmall}>
        <div style={styles.container}>
          {this.props.loadingReviews ? this.renderProgress() : this.renderReviewContainer(this.props.currentReviews)}
        </div>
        {this.props.large ? this.renderFollowingMapContainer() : null}
        <EditReviewDialogContainer />
        <DeleteReviewDialogContainer />
        <CreateMapDialogContainer />
      </div>
    );
  }

  renderFollowingMapContainer() {
    return (
      <div style={styles.mapsContainer}>
        <List subheader={<ListSubheader>Following Maps</ListSubheader>}>
          {this.props.loadingMaps ? this.renderProgress() : this.renderFollowingMaps(this.props.currentMaps)}
        </List>
        <Button raised onClick={this.props.handleCreateMapButtonClick} style={styles.raisedButton}>
          Create New Map
        </Button>
        <Button raised onClick={this.props.handleDashboardLinkClick} style={styles.raisedButton}>
          Search Maps
        </Button>
      </div>
    )
  }

  renderNoMaps() {
    return (
      <div style={styles.noContentsContainer}>
        <MapIcon style={styles.noContentsIcon} />
        <Typography type='subheading' color='inherit'>
          Currently you are not following any maps.
        </Typography>
        <br/>
      </div>
    );
  }

  renderFollowingMaps(maps) {
    if (maps.length > 0) {
      return maps.map((map) => (
        <ListItem
          button
          key={map.id}
          onClick={() => this.props.handleClickMap(map)}
        >
          <Avatar>
            <img src={map.image_url} style={styles.mapImage} />
          </Avatar>
          <ListItemText primary={map.name} />
        </ListItem>
      ));
    } else {
      return this.renderNoMaps();
    }
  }

  renderNoReviews() {
    return (
      <div style={styles.noContentsContainer}>
        <RateReviewIcon style={styles.noContentsIcon} />
        <Typography type='subheading' color='inherit'>
          When you create or follow maps, you will see posts here.
        </Typography>
        <br/>
        <Button raised onClick={this.props.handleCreateMapButtonClick} style={styles.raisedButton}>
          Create New Map
        </Button>
        <Button raised onClick={this.props.handleDashboardLinkClick} style={styles.raisedButton}>
          Search Maps
        </Button>
      </div>
    );
  }

  renderReviewContainer(reviews) {
    if (reviews.length > 0) {
      return (
        <div>
          {this.renderReviewCards(reviews)}
          {this.props.loadingMoreReviews ? this.renderProgress() : this.renderLoadMoreButton()}
        </div>
      );
    } else {
      return this.renderNoReviews();
    }
  }

  renderReviewCards(reviews) {
    return reviews.map((review) => (
      <ReviewCardContainer currentReview={review} key={review.id} />
    ));
  }
}
