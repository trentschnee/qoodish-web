import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch } from 'redux-react-hook';
import openSpotDialog from '../../actions/openSpotDialog';

type Props = {
  spot: any;
  children: any;
};

const styles = {
  link: {
    textDecoration: 'none',
    color: 'inherit'
  }
};

export default memo(function SpotLink(props: Props) {
  const { spot, children } = props;
  const dispatch = useDispatch();

  const handleClick = useCallback(
    e => {
      e.preventDefault();
      dispatch(openSpotDialog(spot));
    },
    [dispatch, spot]
  );

  return (
    <Link href={`/spots/${spot.place_id}`}>
      <a title={spot.name} onClick={handleClick} style={styles.link}>
        {children}
      </a>
    </Link>
  );
});
