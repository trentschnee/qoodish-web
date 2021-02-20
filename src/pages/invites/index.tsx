import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'redux-react-hook';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

import I18n from '../../utils/I18n';
import openToast from '../../actions/openToast';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import {
  ApiClient,
  FollowsApi,
  InvitesApi
} from '@yusuke-suzuki/qoodish-api-js-client';
import { useTheme } from '@material-ui/core';
import AuthContext from '../../context/AuthContext';
import NoContents from '../../components/molecules/NoContents';
import CreateResourceButton from '../../components/molecules/CreateResourceButton';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Head from 'next/head';

const styles = {
  cardLarge: {
    marginBottom: 20
  },
  cardSmall: {
    marginBottom: 16
  },
  cardContent: {
    paddingTop: 0
  },
  contentText: {
    wordBreak: 'break-all'
  },
  progress: {
    textAlign: 'center',
    padding: 10,
    marginTop: 20
  }
};
const createdAt = invite => {
  return moment(invite.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ')
    .locale(I18n.locale)
    .format('LL');
};

const Invites = () => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    const apiInstance = new InvitesApi();

    apiInstance.invitesGet((error, data, response) => {
      setLoading(false);
      if (response.ok) {
        setInvites(response.body);
      } else {
        dispatch(openToast('Failed to fetch invites'));
      }
    });
  }, [dispatch]);

  const handleFollowButtonClick = useCallback(
    async invite => {
      dispatch(requestStart());

      const apiInstance = new FollowsApi();
      const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
      firebaseAuth.apiKey = await currentUser.getIdToken();
      firebaseAuth.apiKeyPrefix = 'Bearer';
      const opts = {
        inviteId: invite.id
      };

      apiInstance.mapsMapIdFollowPost(
        invite.invitable.id,
        opts,
        (error, data, response) => {
          dispatch(requestFinish());
          if (response.ok) {
            dispatch(openToast(I18n.t('follow map success')));
            router.push(`/maps/${invite.invitable.id}`);
            (window as any).gtag('event', 'follow', {
              event_category: 'engagement',
              event_label: 'map'
            });
          } else {
            dispatch(openToast('Failed to follow map'));
          }
        }
      );
    },
    [dispatch, router, currentUser]
  );

  useEffect(() => {
    if (!currentUser || !currentUser.uid || currentUser.isAnonymous) {
      setLoading(false);
      return;
    }
    fetchInvites();
  }, [currentUser]);

  useEffect(() => {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/invites`,
      page_title: `${I18n.t('invites')} | Qoodish`
    });
  }, []);

  return (
    <Layout hideBottomNav={false} fullWidth={false}>
      <Head>
        <title>{`${I18n.t('invites')} | Qoodish`}</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/invites`}
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/invites?hl=en`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/invites?hl=ja`}
          hrefLang="ja"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/invites`}
          hrefLang="x-default"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, maps, travel, food, group, trip"
        />
        <meta name="title" content={`${I18n.t('invites')} | Qoodish`} />
        <meta name="description" content={I18n.t('meta description')} />
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        <meta property="og:title" content={`${I18n.t('invites')} | Qoodish`} />
        <meta property="og:description" content={I18n.t('meta description')} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_ENDPOINT}/invites`}
        />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_OGP_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={process.env.NEXT_PUBLIC_OGP_IMAGE}
        />
        <meta name="twitter:title" content={`${I18n.t('invites')} | Qoodish`} />
        <meta name="twitter:description" content={I18n.t('meta description')} />
      </Head>

      <div>
        {loading ? (
          <div style={styles.progress}>
            <CircularProgress />
          </div>
        ) : invites.length > 0 ? (
          invites.map(invite => (
            <Card
              key={invite.id}
              style={smUp ? styles.cardLarge : styles.cardSmall}
              elevation={0}
            >
              <CardHeader
                avatar={<Avatar src={invite.invitable.image_url} />}
                title={invite.invitable.name}
                subheader={createdAt(invite)}
              />
              <CardContent style={styles.cardContent}>
                <Typography component="p" style={styles.contentText}>
                  {invite.invitable.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleFollowButtonClick(invite)}
                  disabled={invite.expired}
                >
                  {I18n.t('follow')}
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <NoContents
            contentType="invite"
            message={I18n.t('no invites here')}
          />
        )}
      </div>
      {smUp && <CreateResourceButton />}
    </Layout>
  );
};

export default React.memo(Invites);
