import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Link from 'next/link';
import I18n from '../utils/I18n';

const NotFound = () => {
  return (
    <div>
      <Alert severity="warning">
        <AlertTitle>{I18n.t('page not found')}</AlertTitle>
        {I18n.t('page not found description')}
      </Alert>
      <Link href="/discover" passHref>
        <Button color="primary" startIcon={<KeyboardArrowLeftIcon />}>
          {I18n.t('back to our site')}
        </Button>
      </Link>
    </div>
  );
};

export default React.memo(NotFound);
