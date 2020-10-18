import React, { memo, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import openPlaceSelectDialog from '../../actions/openPlaceSelectDialog';
import selectPlaceForReview from '../../actions/selectPlaceForReview';
import I18n from '../../utils/I18n';
import { createStyles, GridListTileBar, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    createReviewTile: {
      height: '100%',
      textAlign: 'center'
    }
  })
);

type Props = {
  currentSpot: any;
};

export default memo(function CreateReviewTile(props: Props) {
  const dispatch = useDispatch();
  const { currentSpot } = props;
  const classes = useStyles();

  const handleCreateReviewClick = useCallback(() => {
    if (currentSpot) {
      dispatch(
        selectPlaceForReview({
          description: currentSpot.name,
          placeId: currentSpot.place_id
        })
      );
    } else {
      dispatch(openPlaceSelectDialog());
    }
  }, [dispatch, currentSpot]);

  return (
    <div key="add-review" onClick={handleCreateReviewClick}>
      <GridListTileBar
        className={classes.createReviewTile}
        title={<Add fontSize="large" />}
        subtitle={I18n.t('create new report')}
      />
    </div>
  );
});
