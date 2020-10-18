import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import twitter from 'twitter-text';
import Link from 'next/link';
import ReviewShareMenu from './ReviewShareMenu';
import ReviewVertMenu from './ReviewVertMenu';
import ReviewCardActions from './ReviewCardActions';
import ReviewComments from './ReviewComments';
import I18n from '../../utils/I18n';
import ReviewImageStepper from './ReviewImageStepper';
import SpotLink from './SpotLink';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    cardTitle: {
      width: 'fit-content',
      wordBreak: 'break-all'
    },
    reviewComment: {
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap'
    },
    cardContent: {
      paddingTop: 0
    },
    action: {
      display: 'flex'
    },
    cardActions: {
      paddingLeft: 24,
      paddingRight: 16
    },
    link: {
      textDecoration: 'none',
      color: 'inherit'
    }
  })
);

type ReviewCardChildrenProps = {
  currentReview: any;
};

const ReviewCardHeader = React.memo((props: ReviewCardChildrenProps) => {
  const { currentReview } = props;
  const classes = useStyles();

  return (
    <CardHeader
      avatar={
        <Link href={`/users/${currentReview.author.id}`}>
          <a title={currentReview.author.name}>
            <Avatar
              src={currentReview.author.profile_image_url}
              imgProps={{
                alt: currentReview.author.name,
                loading: 'lazy'
              }}
            />
          </a>
        </Link>
      }
      action={
        <div className={classes.action}>
          <ReviewShareMenu currentReview={currentReview} />
          <ReviewVertMenu currentReview={currentReview} />
        </div>
      }
      title={
        <Link href={`/users/${currentReview.author.id}`}>
          <a title={currentReview.author.name} className={classes.link}>
            {currentReview.author.name}
          </a>
        </Link>
      }
      subheader={createdAt(currentReview)}
    />
  );
});

const ReviewCardContent = React.memo((props: ReviewCardChildrenProps) => {
  const { currentReview } = props;
  const classes = useStyles();

  return (
    <CardContent className={classes.cardContent}>
      <Link href={`/maps/${currentReview.map.id}`}>
        <a title={currentReview.map.name} className={classes.link}>
          <Typography
            variant="subtitle1"
            color="primary"
            className={classes.cardTitle}
            gutterBottom
          >
            {currentReview.map.name}
          </Typography>
        </a>
      </Link>

      <SpotLink spot={currentReview.spot}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.cardTitle}
          gutterBottom
        >
          {currentReview.spot.name}
        </Typography>
      </SpotLink>
      <Typography
        component="p"
        dangerouslySetInnerHTML={commentHtml(currentReview)}
        className={classes.reviewComment}
        data-test="review-card-comment"
      />
    </CardContent>
  );
});

const createdAt = review => {
  return moment(review.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ')
    .locale(I18n.locale)
    .format('LL');
};

const commentHtml = review => {
  return {
    __html: twitter.autoLink(twitter.htmlEscape(review.comment), {
      targetBlank: true
    })
  };
};

const ReviewCard = props => {
  const { currentReview } = props;
  const classes = useStyles();

  return (
    <Card elevation={0}>
      <ReviewCardHeader currentReview={currentReview} />
      <ReviewCardContent currentReview={currentReview} />
      {currentReview.images.length > 0 ? (
        <ReviewImageStepper review={currentReview} />
      ) : (
        <Divider />
      )}
      {props.currentReview.comments.length > 0 && (
        <ReviewComments comments={currentReview.comments} />
      )}
      {props.hideActions ? null : (
        <CardActions disableSpacing className={classes.cardActions}>
          <ReviewCardActions review={currentReview} />
        </CardActions>
      )}
    </Card>
  );
};

export default React.memo(ReviewCard);
