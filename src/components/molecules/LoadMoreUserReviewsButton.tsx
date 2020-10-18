import React, { memo, useCallback, useContext, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import fetchMoreUserReviews from '../../actions/fetchMoreUserReviews';
import I18n from '../../utils/I18n';
import { ReviewsApi } from '@yusuke-suzuki/qoodish-api-js-client';
import AuthContext from '../../context/AuthContext';
import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    buttonLarge: {
      textAlign: 'center',
      padding: 20
    },
    buttonSmall: {
      textAlign: 'center',
      marginTop: 16,
      paddingBottom: 8
    },
    progress: {
      textAlign: 'center',
      padding: 20,
      marginTop: 20
    }
  })
);

type Props = {
  params: any;
};

export default memo(function LoadMoreUserReviewsButton(props: Props) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const classes = useStyles();

  const mapState = useCallback(
    state => ({
      noMoreReviews: state.profile.noMoreReviews,
      nextTimestamp: state.profile.nextTimestamp,
      location: state.shared.currentLocation
    }),
    []
  );

  const { noMoreReviews, nextTimestamp, location } = useMappedState(mapState);

  const { params } = props;
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const handleClickLoadMoreButton = useCallback(async () => {
    setLoading(true);
    let userId = location === '/profile' ? currentUser.uid : params.userId;

    const apiInstance = new ReviewsApi();
    const opts = {
      nextTimestamp: nextTimestamp
    };
    apiInstance.usersUserIdReviewsGet(userId, opts, (error, data, response) => {
      setLoading(false);
      if (response.ok) {
        dispatch(fetchMoreUserReviews(response.body));
      }
    });
  }, [dispatch, currentUser, params, nextTimestamp, location]);

  if (loading) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    );
  } else {
    return noMoreReviews ? null : (
      <div className={smUp ? classes.buttonLarge : classes.buttonSmall}>
        <Button color="primary" onClick={handleClickLoadMoreButton}>
          {I18n.t('load more')}
        </Button>
      </div>
    );
  }
});
