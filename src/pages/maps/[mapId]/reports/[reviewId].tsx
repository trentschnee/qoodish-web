import React, {
  useEffect,
  useCallback,
  useState,
  useContext,
  Fragment,
  memo
} from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import { ApiClient, ReviewsApi } from '@yusuke-suzuki/qoodish-api-js-client';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ReviewCard from '../../../../components/molecules/ReviewCard';
import NoContents from '../../../../components/molecules/NoContents';
import I18n from '../../../../utils/I18n';
import AuthContext from '../../../../context/AuthContext';
import fetchReview from '../../../../actions/fetchReview';
import openToast from '../../../../actions/openToast';
import SkeletonReviewCard from '../../../../components/molecules/SkeletonReviewCard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import Head from 'next/head';

const styles = {
  backButtonContainer: {
    marginTop: 16
  }
};

const ReviewCardContainer = React.memo(props => {
  const { review } = props;
  if (review) {
    return <ReviewCard currentReview={review} />;
  } else {
    return (
      <NoContents
        contentType="review"
        message={I18n.t('reports will see here')}
      />
    );
  }
});

const MapButton = React.memo(props => {
  const { currentReview } = props;
  return (
    <Link href={`/maps/${currentReview.map.id}`} passHref>
      <Button color="primary" startIcon={<KeyboardArrowLeftIcon />}>
        {I18n.t('back to map')}
      </Button>
    </Link>
  );
});

export default memo(function ReviewDetail() {
  const router = useRouter();
  const { mapId, reviewId } = router.query;
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      currentReview: state.reviewDetail.currentReview
    }),
    []
  );
  const { currentReview } = useMappedState(mapState);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);

  const initReview = useCallback(async () => {
    setLoading(true);
    const apiInstance = new ReviewsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.mapsMapIdReviewsReviewIdGet(
      mapId,
      reviewId,
      (error, data, response) => {
        setLoading(false);

        if (response.ok) {
          dispatch(fetchReview(response.body));
        } else if (response.status == 401) {
          dispatch(openToast('Authenticate failed'));
        } else if (response.status == 404) {
          dispatch(openToast('Report not found.'));
        } else {
          dispatch(openToast('Failed to fetch Report.'));
        }
      }
    );
  }, [currentReview, dispatch, currentUser, mapId, reviewId]);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      return;
    }

    if (mapId && reviewId) {
      initReview();
    }
  }, [currentUser, mapId, reviewId]);

  useEffect(() => {
    if (!currentReview) {
      return;
    }

    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}`,
      page_title: `${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`
    });
  }, [currentReview]);

  return (
    <Layout hideBottomNav={true} fullWidth={false}>
      <Head>
        {currentReview && (
          <title>{`${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`}</title>
        )}
        {currentReview && (
          <link
            rel="canonical"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}`}
          />
        )}
        {currentReview && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}?hl=en`}
            hrefLang="en"
          />
        )}
        {currentReview && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}?hl=ja`}
            hrefLang="ja"
          />
        )}
        {currentReview && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}`}
            hrefLang="x-default"
          />
        )}
        {currentReview && currentReview.map.private && (
          <meta name="robots" content="noindex" />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {currentReview && (
          <meta
            name="keywords"
            content={`${currentReview.map.name}, ${currentReview.spot.name}, Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, 観光スポット, maps, travel, food, group, trip`}
          />
        )}
        {currentReview && (
          <meta
            name="title"
            content={`${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`}
          />
        )}
        {currentReview && (
          <meta name="description" content={currentReview.comment} />
        )}
        {currentReview && (
          <meta
            property="og:title"
            content={`${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`}
          />
        )}
        {currentReview && (
          <meta property="og:description" content={currentReview.comment} />
        )}
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        {currentReview && (
          <meta
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentReview.map.id}/reports/${currentReview.id}`}
          />
        )}
        {currentReview && (
          <meta
            property="og:image"
            content={
              currentReview.images.length > 0
                ? currentReview.images[0].thumbnail_url_800
                : process.env.NEXT_PUBLIC_OGP_IMAGE_URL
            }
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {currentReview && (
          <meta
            name="twitter:image"
            content={
              currentReview.images.length > 0
                ? currentReview.images[0].thumbnail_url_800
                : process.env.NEXT_PUBLIC_OGP_IMAGE_URL
            }
          />
        )}
        {currentReview && (
          <meta
            name="twitter:title"
            content={`${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`}
          />
        )}
        {currentReview && (
          <meta name="twitter:description" content={currentReview.comment} />
        )}
      </Head>

      {loading ? (
        <SkeletonReviewCard />
      ) : (
        <Fragment>
          <ReviewCardContainer review={currentReview} />
          <div style={styles.backButtonContainer}>
            {currentReview && <MapButton currentReview={currentReview} />}
          </div>
        </Fragment>
      )}
    </Layout>
  );
});
