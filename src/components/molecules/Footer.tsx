import Link from 'next/link';
import FbPage from '../molecules/FbPage';
import I18n from '../../utils/I18n';
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { amber } from '@material-ui/core/colors';
import { memo } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      width: '100%',
      margin: 'auto'
    },
    bottomCardContent: {
      backgroundColor: amber[500]
    },
    bottomCardLicense: {
      backgroundColor: amber[700],
      paddingBottom: 16
    },
    containerLarge: {
      width: '80%',
      margin: '0 auto'
    },
    containerSmall: {
      width: '100%',
      margin: '0 auto'
    },
    container: {
      maxWidth: 1176,
      margin: 'auto'
    }
  })
);

export default memo(function Footer() {
  const classes = useStyles();

  return (
    <Card>
      <CardContent className={classes.bottomCardContent}>
        <div className={classes.container}>
          <Grid container className={classes.gridContainer} spacing={10}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FbPage />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div>
                <Link href="/terms">
                  <a>{I18n.t('terms of service')}</a>
                </Link>
              </div>
              <div>
                <Link href="/privacy">
                  <a>{I18n.t('privacy policy')}</a>
                </Link>
              </div>
              <div>
                <a
                  href="https://github.com/yusuke-suzuki/qoodish-web"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </Grid>
          </Grid>
        </div>
      </CardContent>
      <CardContent className={classes.bottomCardLicense}>
        <div className={classes.container}>
          <Typography variant="caption">
            © 2021 Qoodish, All rights reserved.
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
});
