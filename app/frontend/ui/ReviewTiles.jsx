import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import PlaceIcon from '@material-ui/icons/Place';
import I18n from '../containers/I18n';

const styles = {
  gridContainer: {
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
    height: '100%',
    textAlign: 'center'
  },
  placeIconLarge: {
    fontSize: 64
  },
  placeIconSmall: {
    fontSize: 36
  }
};

const Subheader = (props) => {
  return (
    <Typography
      variant="subtitle2"
      gutterBottom
      color="textSecondary"
    >
      {`${props.reviews.length} ${I18n.t('reviews count')}`}
    </Typography>
  );
}

const ReviewGridList = (props) => {
  return (
    <div>
      {props.showSubheader && <Subheader {...props} />}
      <div style={styles.gridContainer}>
        <GridList
          style={styles.gridList}
          cols={props.cols}
          spacing={props.spacing}
          cellHeight={props.cellHeight}
        >
          {props.reviews.map(review => (
            <GridListTile
              key={review.id}
              onClick={() => props.handleReviewClick(review)}
              style={styles.gridTile}
            >
              {review.image ?
                <img
                  src={review.image.thumbnail_url}
                  alt={review.spot.name}
                />
              :
                <GridListTileBar
                  title={<PlaceIcon style={props.large ? styles.placeIconLarge : styles.placeIconSmall} />}
                  style={styles.tileBar}
                />
              }
            </GridListTile>
          ))}
        </GridList>
      </div>
    </div>
  );
}

ReviewGridList.defaultProps = {
  cols: 3,
  spacing: 4,
  cellHeight: 100
};

export default ReviewGridList;
