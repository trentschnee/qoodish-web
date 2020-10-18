import { memo, useCallback } from 'react';
import switchMap from '../../actions/switchMap';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { useRouter } from 'next/router';

export default memo(function BackButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

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
      router.back();
    } else {
      router.push('/');
    }
  }, [dispatch, router, mapSummaryOpen, historyCount, lgUp]);

  return (
    <IconButton color="inherit" onClick={handleBackButtonClick}>
      <ArrowBackIcon />
    </IconButton>
  );
});
