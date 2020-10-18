import React, { useState, useEffect } from 'react';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import Fab from '@material-ui/core/Fab';
import CardMedia from '@material-ui/core/CardMedia';
import SwipeableViews from 'react-swipeable-views';
import Link from 'next/link';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    swipeable: {
      height: 150
    },
    stepperContainer: {
      width: '100%',
      zIndex: 1,
      position: 'absolute',
      top: 125
    },
    stepper: {
      background: 'rgba(0, 0, 0, 0)',
      justifyContent: 'center'
    },
    spotImage: {
      width: '100%',
      objectFit: 'cover',
      height: 150
    },
    stepButtonLeft: {
      position: 'absolute',
      zIndex: 1,
      top: 60,
      left: 12,
      width: 24,
      height: 24,
      minHeight: 'auto'
    },
    stepButtonRight: {
      position: 'absolute',
      zIndex: 1,
      top: 60,
      right: 12,
      width: 24,
      height: 24,
      minHeight: 'auto'
    },
    icon: {
      width: '0.7em',
      height: '0.7em'
    }
  })
);

const SpotImageStepper = props => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  let maxSteps = props.spotReviews.length;
  const classes = useStyles();

  useEffect(() => {
    setActiveStep(0);
  }, [props.currentSpot]);

  return (
    <CardMedia>
      <SwipeableViews
        index={activeStep}
        onChangeIndex={step => setActiveStep(step)}
        style={classes.swipeable}
      >
        {props.spotReviews.map(review => (
          <Link
            key={review.id}
            href={`${router.pathname}?modal=review`}
            as={`/maps/${review.map.id}/reports/${review.id}`}
            scroll={false}
            prefetch={false}
          >
            <ButtonBase>
              <img
                src={
                  review.images.length > 0
                    ? review.images[0].thumbnail_url_400
                    : process.env.NEXT_PUBLIC_SUBSTITUTE_URL
                }
                className={classes.spotImage}
                alt={review.spot.name}
                loading="lazy"
              />
            </ButtonBase>
          </Link>
        ))}
      </SwipeableViews>
      {maxSteps > 1 && (
        <React.Fragment>
          <Fab
            size="small"
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={activeStep === 0}
            className={classes.stepButtonLeft}
          >
            <KeyboardArrowLeft className={classes.icon} />
          </Fab>
          <Fab
            size="small"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={activeStep === maxSteps - 1}
            className={classes.stepButtonRight}
          >
            <KeyboardArrowRight className={classes.icon} />
          </Fab>
          <div className={classes.stepperContainer}>
            <MobileStepper
              className={classes.stepper}
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              backButton={null}
              nextButton={null}
            />
          </div>
        </React.Fragment>
      )}
    </CardMedia>
  );
};

export default React.memo(SpotImageStepper);
