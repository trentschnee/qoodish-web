import React, { useState, useCallback, useEffect, memo } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import I18n from '../../utils/I18n';
import getFirebase from '../../utils/getFirebase';
import getFirestore from '../../utils/getFirestore';
import closeAnnouncementDialog from '../../actions/closeAnnouncementDialog';
import moment from 'moment';
import updateAnnouncementIsNew from '../../actions/updateAnnoucementIsNew';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    listItemText: {
      paddingRight: 0
    },
    title: {
      wordBreak: 'break-all'
    },
    titleLink: {
      textDecoration: 'none'
    },
    body: {
      wordBreak: 'break-all'
    }
  })
);

const issuedAt = date => {
  return moment(date).locale(I18n.locale).format('LL');
};

export default memo(function AnnouncementDialog() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const mapState = useCallback(
    state => ({
      dialogOpen: state.shared.announcementDialogOpen
    }),
    []
  );
  const { dialogOpen } = useMappedState(mapState);

  const [announcements, setAnnouncements] = useState([]);
  const [isNew, setIsNew] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    const firebase = await getFirebase();
    await getFirestore();

    const firestore = firebase.firestore();
    const querySnapshot = await firestore
      .collection('announcements')
      .orderBy('date', 'desc')
      .limit(10)
      .get();
    const items = [];

    querySnapshot.forEach(doc => {
      items.push({
        id: doc.id,
        title: doc.data().title,
        link: doc.data().link,
        body: doc.data().body,
        date: doc.data().date.toDate()
      });
    });

    setAnnouncements(items);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const newArrival = announcements.some(annoucement => {
      const boundary = new Date();
      boundary.setDate(boundary.getDate() - 7);
      return annoucement.date > boundary;
    });
    setIsNew(newArrival);
  }, [announcements]);

  useEffect(() => {
    dispatch(updateAnnouncementIsNew(isNew));
  }, [isNew]);

  const handleRequestDialogClose = useCallback(() => {
    dispatch(closeAnnouncementDialog());
  }, [dispatch]);

  return (
    <Dialog open={dialogOpen} onClose={handleRequestDialogClose} fullWidth>
      <DialogTitle>{I18n.t('announcement')}</DialogTitle>
      <DialogContent>
        <List disablePadding>
          {announcements.map(announcement => (
            <React.Fragment key={announcement.id}>
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  primary={
                    <React.Fragment>
                      <Typography variant="subtitle2" color="textSecondary">
                        {issuedAt(announcement.date)}
                      </Typography>
                      <a
                        href={announcement.link}
                        target="_blank"
                        className={classes.titleLink}
                      >
                        <Typography variant="h6" color="primary">
                          {announcement.title}
                        </Typography>
                      </a>
                    </React.Fragment>
                  }
                  secondary={
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      className={classes.body}
                    >
                      {announcement.body}
                    </Typography>
                  }
                />
              </ListItem>

              <Divider />
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRequestDialogClose}>{I18n.t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
});
