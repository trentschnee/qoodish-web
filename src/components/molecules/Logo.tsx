import React, { memo } from 'react';
import Link from 'next/link';
import { Typography, useTheme, useMediaQuery } from '@material-ui/core';

const styles = {
  logo: {
    cursor: 'pointer',
    fontFamily: "'Lobster', cursive"
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  }
};

type Props = {
  color:
    | 'inherit'
    | 'initial'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';
};

export default memo(function Logo(props: Props) {
  const { color } = props;
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Typography
      variant={smUp ? 'h4' : 'h5'}
      color={color ? color : 'primary'}
      style={styles.logo}
    >
      <Link href="/">
        <a title="Qoodish" style={styles.link}>
          Qoodish
        </a>
      </Link>
    </Typography>
  );
});
