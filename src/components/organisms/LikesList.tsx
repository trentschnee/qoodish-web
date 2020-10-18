import React, {
  useEffect,
  useCallback,
  useState,
  useContext,
  Fragment
} from 'react';
import { useMappedState } from 'redux-react-hook';

import Link from 'next/link';

import moment from 'moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import NoContents from '../molecules/NoContents';

import I18n from '../../utils/I18n';
import { ApiClient, LikesApi } from '@yusuke-suzuki/qoodish-api-js-client';
import AuthContext from '../../context/AuthContext';

const styles = {
  listItemText: {
    paddingRight: 32
  },
  secondaryAvatar: {
    marginRight: 12,
    cursor: 'pointer'
  },
  progress: {
    textAlign: 'center',
    padding: 20,
    marginTop: 20
  }
};

const PrimaryText = props => {
  switch (props.like.votable.type) {
    case 'review':
      return (
        <Fragment>
          <b>{props.like.voter.name}</b>
          {` ${I18n.t('liked report of').replace(
            'owner',
            props.like.votable.owner.name
          )}`}
          <b>{props.like.votable.name}</b>
        </Fragment>
      );
    case 'map':
      return (
        <Fragment>
          <b>{props.like.voter.name}</b>
          {` ${I18n.t('liked map of').replace(
            'owner',
            props.like.votable.owner.name
          )}`}
          <b>{props.like.votable.name}</b>
        </Fragment>
      );
    default:
      return '';
  }
};

const fromNow = like => {
  return moment(like.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ')
    .locale(I18n.locale)
    .fromNow();
};

const LikesList = props => {
  const { params } = props;
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapState = useCallback(
    state => ({
      location: state.shared.currentLocation
    }),
    []
  );

  const { location } = useMappedState(mapState);

  const { currentUser } = useContext(AuthContext);

  const initUserLikes = useCallback(async () => {
    if (location === '/profile' && currentUser.isAnonymous) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const userId = params && params.userId ? params.userId : currentUser.uid;

    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';
    const apiInstance = new LikesApi();

    apiInstance.usersUserIdLikesGet(userId, (error, data, response) => {
      setLoading(false);
      if (response.ok) {
        setLikes(response.body);
      }
    });
  }, [params, currentUser, location]);

  useEffect(() => {
    initUserLikes();
  }, []);

  if (loading) {
    return (
      <div style={styles.progress}>
        <CircularProgress />
      </div>
    );
  } else {
    return likes.length > 0 ? (
      <Paper elevation={0}>
        <List>
          {likes.map(like => (
            <Link key={like.id} href={like.click_action} passHref>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar
                    src={like.voter.profile_image_url}
                    alt={like.voter.name}
                    loading="lazy"
                  />
                </ListItemAvatar>
                <ListItemText
                  style={styles.listItemText}
                  primary={
                    <Typography variant="subtitle1">
                      <PrimaryText like={like} />
                    </Typography>
                  }
                  secondary={
                    <Typography variant="subtitle1" color="textSecondary">
                      {fromNow(like)}
                    </Typography>
                  }
                  disableTypography
                />
                {like.votable.thumbnail_url && (
                  <ListItemSecondaryAction>
                    <Link key={like.id} href={like.click_action} passHref>
                      <ButtonBase>
                        <Avatar
                          src={like.votable.thumbnail_url}
                          variant="rounded"
                          style={styles.secondaryAvatar}
                          loading="lazy"
                        />
                      </ButtonBase>
                    </Link>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Link>
          ))}
        </List>
      </Paper>
    ) : (
      <NoContents
        contentType="like"
        action="discover-reviews"
        message={I18n.t('likes will see here')}
      />
    );
  }
};

export default React.memo(LikesList);
