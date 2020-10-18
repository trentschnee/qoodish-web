import React, { Fragment } from 'react';
import {
  CssBaseline,
  makeStyles,
  createStyles,
  Theme,
  Grid,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import NavBar from './organisms/NavBar';
import RightItems from './organisms/RightItems';
import BottomNav from './molecules/BottomNav';
import SharedDialogs from './SharedDialogs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar
  })
);

const styles = {
  containerLarge: {
    maxWidth: 1176,
    margin: 'auto'
  },
  containerSmall: {
    margin: 'auto',
    paddingBottom: 56
  },
  mainLarge: {
    padding: 20
  },
  mainSmall: {
    padding: 16
  },
  right: {
    padding: 20
  }
};

type Props = {
  children: any;
  fullWidth: boolean;
  hideBottomNav: boolean;
};

function Layout(props: Props) {
  const { children, fullWidth, hideBottomNav } = props;

  const classes = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Fragment>
      <NavBar />
      <div className={classes.toolbar} />
      <CssBaseline />
      <Grid
        container
        style={
          fullWidth ? {} : smUp ? styles.containerLarge : styles.containerSmall
        }
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={fullWidth ? 12 : 8}
          lg={fullWidth ? 12 : 8}
          xl={fullWidth ? 12 : 8}
          style={fullWidth ? {} : smUp ? styles.mainLarge : styles.mainSmall}
        >
          {children}
        </Grid>
        {mdUp && !fullWidth && (
          <Grid item md={4} lg={4} xl={4} style={styles.right}>
            <RightItems />
          </Grid>
        )}
      </Grid>
      {!smUp && !hideBottomNav && <BottomNav />}
      <SharedDialogs />
    </Fragment>
  );
}

export default React.memo(Layout);
