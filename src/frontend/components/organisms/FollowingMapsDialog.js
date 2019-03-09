import React, { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import I18n from '../../utils/I18n';
import Link from '../molecules/Link';
import Slide from '@material-ui/core/Slide';
import FollowMapButton from '../molecules/FollowMapButton';

import closeFollowingMapsDialog from '../../actions/closeFollowingMapsDialog';
import DialogAppBar from '../molecules/DialogAppBar';

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const styles = {
  toolbar: {
    paddingLeft: 8
  },
  dialogContent: {
    padding: 0
  },
  listItem: {
    paddingRight: 100
  },
  listItemSecondaryAction: {
    paddingRight: 16
  }
};

const FollowingMapsDialog = () => {
  const large = useMediaQuery('(min-width: 600px)');
  const mapState = useCallback(
    state => ({
      open: state.profile.followingMapsDialogOpen,
      maps: state.profile.followingMaps
    }),
    []
  );
  const { open, maps } = useMappedState(mapState);
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(closeFollowingMapsDialog());
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={!large}
      TransitionComponent={Transition}
    >
      {large ? (
        <DialogTitle>{I18n.t('following')}</DialogTitle>
      ) : (
        <DialogAppBar
          title={I18n.t('following')}
          handleRequestDialogClose={onClose}
          color="inherit"
        />
      )}
      <DialogContent style={styles.dialogContent}>
        <List>
          {maps.map(map => (
            <ListItem
              button
              component={Link}
              to={`/maps/${map.id}`}
              key={map.id}
              onClick={onClose}
              style={styles.listItem}
            >
              <ListItemAvatar>
                <Avatar alt={map.name} src={map.thumbnail_url} />
              </ListItemAvatar>
              <ListItemText
                primary={map.name}
                primaryTypographyProps={{ noWrap: true }}
              />
              <ListItemSecondaryAction style={styles.listItemSecondaryAction}>
                <FollowMapButton currentMap={map} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(FollowingMapsDialog);
