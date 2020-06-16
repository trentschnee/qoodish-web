import React, { useCallback } from 'react';
import switchMap from '../../actions/switchMap';
import { useHistory } from '@yusuke-suzuki/rize-router';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useMappedState, useDispatch } from 'redux-react-hook';

const BackButton = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const lgUp = useMediaQuery('(min-width: 1280px)');

  const mapState = useCallback(
    state => ({
      mapSummaryOpen: state.mapDetail.mapSummaryOpen,
      historyCount: state.shared.historyCount
    }),
    []
  );
  const { mapSummaryOpen, historyCount } = useMappedState(mapState);

  const handleBackButtonClick = useCallback(() => {
    if (!lgUp && mapSummaryOpen) {
      dispatch(switchMap());
      return;
    }

    if (historyCount > 2) {
      history.goBack();
    } else {
      history.push('/');
    }
  }, [dispatch, history, mapSummaryOpen, historyCount, lgUp]);

  return (
    <IconButton color="inherit" onClick={handleBackButtonClick}>
      <ArrowBackIcon />
    </IconButton>
  );
};

export default React.memo(BackButton);
