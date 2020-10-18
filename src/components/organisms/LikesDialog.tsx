import React, { useCallback } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Link from 'next/link';

import I18n from '../../utils/I18n';
import closeLikesDialog from '../../actions/closeLikesDialog';
import DialogAppBar from '../molecules/DialogAppBar';
import { useTheme, useMediaQuery } from '@material-ui/core';

const styles = {
  dialogContent: {
    padding: 0
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LikesDialog = () => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      dialogOpen: state.shared.likesDialogOpen,
      likes: state.shared.likes
    }),
    []
  );
  const { dialogOpen, likes } = useMappedState(mapState);

  const handleRequestDialogClose = useCallback(() => {
    dispatch(closeLikesDialog());
  }, [dispatch]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleRequestDialogClose}
      fullWidth
      TransitionComponent={smUp ? Fade : Transition}
    >
      {smUp ? (
        <DialogTitle>{I18n.t('likes')}</DialogTitle>
      ) : (
        <DialogAppBar
          title={I18n.t('likes')}
          handleRequestDialogClose={handleRequestDialogClose}
          color="inherit"
        />
      )}
      <DialogContent style={styles.dialogContent}>
        <List>
          {likes.map(like => (
            <Link key={like.id} href={`/users/${like.voter.id}`} passHref>
              <ListItem button title={like.voter.name}>
                <ListItemAvatar>
                  <Avatar
                    src={like.voter.profile_image_url}
                    alt={like.voter.name}
                  />
                </ListItemAvatar>
                <ListItemText primary={like.voter.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(LikesDialog);
