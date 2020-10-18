import React, { useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import PlaceIcon from '@material-ui/icons/Place';
import ExploreIcon from '@material-ui/icons/Explore';
import amber from '@material-ui/core/colors/amber';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import I18n from '../../utils/I18n';
import { useTheme } from '@material-ui/core';
import LoginButtons from '../../components/organisms/LoginButtons';
import Footer from '../../components/molecules/Footer';
import Layout from '../../components/Layout';
import Head from 'next/head';

const styles = {
  loginContainerLarge: {
    textAlign: 'center',
    width: '80%',
    margin: '0 auto',
    padding: 20
  },
  loginContainerSmall: {
    textAlign: 'center',
    margin: '0 auto',
    padding: 20
  },
  gridContainer: {
    width: '100%',
    margin: 'auto'
  },
  descriptionIcon: {
    width: 150,
    height: 150,
    color: amber[500]
  },
  descriptionCard: {
    height: '100%',
    boxShadow: 'initial',
    backgroundColor: 'initial'
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
  image: {
    width: '100%'
  },
  firebaseContainer: {
    marginTop: 20,
    whiteSpace: 'initial'
  },
  carouselContainerLarge: {
    textAlign: 'center',
    width: '100%',
    paddingTop: 64
  },
  carouselContainerSmall: {
    textAlign: 'center',
    width: '100%',
    paddingTop: 56
  },
  carouselTileBar: {
    height: '100%',
    background: 'rgba(0, 0, 0, 0.1)'
  },
  carouselTileBarText: {
    whiteSpace: 'initial'
  },
  scrollTopButton: {
    margin: 20
  }
};

const handleScrollTopClick = () => {
  window.scrollTo(0, 0);
};

const Login = () => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/login`,
      page_title: `${I18n.t('login')} | Qoodish`
    });
  }, []);

  return (
    <Layout hideBottomNav={true} fullWidth={true}>
      <Head>
        <title>{`${I18n.t('login')} | Qoodish`}</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/login`}
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/login?hl=en`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/login?hl=ja`}
          hrefLang="ja"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/login`}
          hrefLang="x-default"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, maps, travel, food, group, trip"
        />
        <meta name="title" content={`${I18n.t('login')} | Qoodish`} />
        <meta name="description" content={I18n.t('meta description')} />
        <meta property="og:title" content={`${I18n.t('login')} | Qoodish`} />
        <meta property="og:description" content={I18n.t('meta description')} />
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_ENDPOINT}/login`}
        />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_OGP_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={process.env.NEXT_PUBLIC_OGP_IMAGE}
        />
        <meta name="twitter:title" content={`${I18n.t('login')} | Qoodish`} />
        <meta name="twitter:description" content={I18n.t('meta description')} />
      </Head>

      <div
        style={
          smUp ? styles.carouselContainerLarge : styles.carouselContainerSmall
        }
      >
        <GridList cols={1} spacing={0} cellHeight={600}>
          <GridListTile key="carousel">
            <img src={process.env.NEXT_PUBLIC_LP_CAROUSEL_1} />
            <GridListTileBar
              title={
                <Typography
                  variant={smUp ? 'h2' : 'h3'}
                  color="inherit"
                  style={styles.carouselTileBarText}
                  gutterBottom
                >
                  {I18n.t('create map together')}
                </Typography>
              }
              subtitle={
                <div>
                  <Typography
                    variant={smUp ? 'h5' : 'h6'}
                    color="inherit"
                    style={styles.carouselTileBarText}
                  >
                    <span>{I18n.t('where are you going next')}</span>
                  </Typography>
                  <div style={styles.firebaseContainer}>
                    <LoginButtons nextPath="/" />
                  </div>
                </div>
              }
              style={styles.carouselTileBar}
            />
          </GridListTile>
        </GridList>
      </div>
      <div
        style={smUp ? styles.loginContainerLarge : styles.loginContainerSmall}
      >
        <Grid container style={styles.gridContainer} spacing={24}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card style={styles.descriptionCard}>
              <CardContent>
                <Typography gutterBottom>
                  <PlaceIcon style={styles.descriptionIcon} />
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {I18n.t('share favorite spot')}
                </Typography>
                <Typography component="p" gutterBottom>
                  {I18n.t('tell friends spot')}
                </Typography>
              </CardContent>
              <CardMedia>
                <img
                  src={process.env.NEXT_PUBLIC_LP_IMAGE_1}
                  style={styles.image}
                />
              </CardMedia>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card style={styles.descriptionCard}>
              <CardContent>
                <Typography gutterBottom>
                  <ExploreIcon style={styles.descriptionIcon} />
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {I18n.t('find your best place')}
                </Typography>
                <Typography component="p" gutterBottom>
                  {I18n.t('surely your friends know')}
                </Typography>
              </CardContent>
              <CardMedia>
                <img
                  src={process.env.NEXT_PUBLIC_LP_IMAGE_2}
                  style={styles.image}
                />
              </CardMedia>
            </Card>
          </Grid>
        </Grid>
        <Fab onClick={handleScrollTopClick} style={styles.scrollTopButton}>
          <ArrowUpwardIcon />
        </Fab>
      </div>
      <Footer />
    </Layout>
  );
};

export default React.memo(Login);
