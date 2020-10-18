import React from 'react';
import { CardContent, Typography, Divider, Paper } from '@material-ui/core';
import Link from 'next/link';
import I18n from '../../utils/I18n';
import RecommendMaps from './RecommendMaps';
import TrendingMaps from './TrendingMaps';
import TrendingSpots from './TrendingSpots';
import FbPage from '../molecules/FbPage';

const styles = {
  item: {
    marginBottom: 20
  },
  cardContent: {
    paddingBottom: 16
  },
  fbPage: {
    textAlign: 'center'
  }
};

const Footer = React.memo(() => {
  return (
    <Paper elevation={0}>
      <CardContent style={styles.cardContent}>
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
        <Typography variant="caption">
          © 2019 Qoodish, All rights reserved.
        </Typography>
      </CardContent>
    </Paper>
  );
});

const RightItems = () => {
  return (
    <div>
      <RecommendMaps />
      <Divider style={styles.item} />
      <div style={styles.item}>
        <TrendingMaps />
      </div>
      <div style={styles.item}>
        <TrendingSpots />
      </div>
      <div style={styles.item}>
        <Footer />
      </div>
      <div style={styles.fbPage}>
        <FbPage />
      </div>
    </div>
  );
};

export default React.memo(RightItems);
