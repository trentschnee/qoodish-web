import React, { memo } from 'react';
import ReviewLink from '../molecules/ReviewLink';

const styles = {
  reviewImage: {
    width: '100%'
  }
};

type Props = {
  review: any;
};

export default memo(function ReviewImageTile(props: Props) {
  const { review } = props;

  return (
    <ReviewLink review={review}>
      <img
        src={
          review.images.length > 0
            ? review.images[0].thumbnail_url_400
            : process.env.NEXT_PUBLIC_NO_IMAGE
        }
        alt={review.spot.name}
        loading="lazy"
        style={styles.reviewImage}
      />
    </ReviewLink>
  );
});
