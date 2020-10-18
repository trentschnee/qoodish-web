import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import openDeleteAccountDialog from '../../actions/openDeleteAccountDialog';
import I18n from '../../utils/I18n';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@material-ui/core';
import PushSettings from '../../components/organisms/PushSettings';
import ProviderLinkSettings from '../../components/organisms/ProviderLinkSettings';
import DeleteAccountDialog from '../../components/organisms/DeleteAccountDialog';
import CreateResourceButton from '../../components/molecules/CreateResourceButton';
import Layout from '../../components/Layout';
import Head from 'next/head';

const styles = {
  card: {
    marginBottom: 20
  },
  deleteButton: {
    color: 'white',
    backgroundColor: 'red'
  }
};

const DeleteAccountCard = () => {
  const dispatch = useDispatch();

  const { currentUser } = useContext(AuthContext);

  const handleDeleteAccountButtonClick = useCallback(async () => {
    dispatch(openDeleteAccountDialog());
  }, [dispatch]);

  return (
    <Card style={styles.card} elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {I18n.t('delete account')}
        </Typography>
        <Typography component="p">{I18n.t('this cannot be undone')}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          onClick={handleDeleteAccountButtonClick}
          style={
            currentUser && currentUser.isAnonymous ? {} : styles.deleteButton
          }
          disabled={currentUser && currentUser.isAnonymous}
        >
          {I18n.t('delete account')}
        </Button>
      </CardActions>
    </Card>
  );
};

const Settings = () => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/settings`,
      page_title: `${I18n.t('settings')} | Qoodish`
    });
  }, []);

  return (
    <Layout hideBottomNav={false} fullWidth={false}>
      <Head>
        <title>{`${I18n.t('settings')} | Qoodish`}</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/settings`}
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/settings?hl=en`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/settings?hl=ja`}
          hrefLang="ja"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/settings`}
          hrefLang="x-default"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, maps, travel, food, group, trip"
        />
        <meta name="title" content={`${I18n.t('settings')} | Qoodish`} />
        <meta name="description" content={I18n.t('meta description')} />
        <meta property="og:title" content={`${I18n.t('settings')} | Qoodish`} />
        <meta property="og:description" content={I18n.t('meta description')} />
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_ENDPOINT}/settings`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_OGP_IMAGE} />
        <meta
          name="twitter:image"
          content={process.env.NEXT_PUBLIC_OGP_IMAGE}
        />
        <meta
          name="twitter:title"
          content={`${I18n.t('settings')} | Qoodish`}
        />
        <meta name="twitter:description" content={I18n.t('meta description')} />
      </Head>

      <div style={styles.card}>
        <PushSettings />
      </div>
      <div style={styles.card}>
        <ProviderLinkSettings />
      </div>
      <DeleteAccountCard />
      <DeleteAccountDialog />
      {smUp && <CreateResourceButton />}
    </Layout>
  );
};

export default React.memo(Settings);
