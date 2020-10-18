import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import Fab from '@material-ui/core/Fab';
import CardMedia from '@material-ui/core/CardMedia';
import SwipeableViews from 'react-swipeable-views';
import ButtonBase from '@material-ui/core/ButtonBase';

import openImageDialog from '../../actions/openImageDialog';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    cardMedia: {
      position: 'relative'
    },
    stepper: {
      background: 'rgba(0, 0, 0, 0)',
      justifyContent: 'center',
      padding: 16,
      paddingBottom: 0
    },
    stepButtonLeft: {
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      left: 12,
      transform: 'translateY(-50%)'
    },
    stepButtonRight: {
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      right: 12,
      transform: 'translateY(-50%)'
    },
    reviewImage: {
      width: '100%'
    }
  })
);

const ReviewImageStepper = props => {
  const { review } = props;
  const large = useMediaQuery('(min-width: 600px)');
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = review.images.length;
  const classes = useStyles();

  const dispatch = useDispatch();

  const handleImageClick = useCallback(
    image => {
      dispatch(openImageDialog(image.url));
    },
    [dispatch]
  );

  useEffect(() => {
    setActiveStep(0);
  }, [review]);

  return (
    <div>
      <CardMedia className={classes.cardMedia}>
        {large && maxSteps > 1 && (
          <Fab
            size="small"
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={activeStep === 0}
            className={classes.stepButtonLeft}
          >
            <KeyboardArrowLeft fontSize="large" />
          </Fab>
        )}
        <SwipeableViews
          index={activeStep}
          onChangeIndex={step => setActiveStep(step)}
        >
          {review.images.map(image => (
            <ButtonBase onClick={() => handleImageClick(image)} key={image.id}>
              <img
                src={image.thumbnail_url_800}
                className={classes.reviewImage}
                alt={review.spot.name}
                loading="lazy"
              />
            </ButtonBase>
          ))}
        </SwipeableViews>
        {large && maxSteps > 1 && (
          <Fab
            size="small"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={activeStep === maxSteps - 1}
            className={classes.stepButtonRight}
          >
            <KeyboardArrowRight fontSize="large" />
          </Fab>
        )}
      </CardMedia>
      <MobileStepper
        className={classes.stepper}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        backButton={null}
        nextButton={null}
      />
    </div>
  );
};

export default React.memo(ReviewImageStepper);
