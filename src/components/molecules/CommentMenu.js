import React, { useState, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import I18n from '../../utils/I18n';

import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';
import openIssueDialog from '../../actions/openIssueDialog';
import openDeleteCommentDialog from '../../actions/openDeleteCommentDialog';

const CommentMenu = props => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = useMappedState(
    useCallback(state => state.app.currentUser, [])
  );
  const comment = props.comment;
  const dispatch = useDispatch();

  const handleIssueButtonClick = useCallback(() => {
    setMenuOpen(false);
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
    } else {
      dispatch(openIssueDialog(comment.id, 'comment'));
    }
  });

  const handleDeleteButtonClick = useCallback(() => {
    setMenuOpen(false);
    dispatch(openDeleteCommentDialog(comment));
  });

  return (
    <div>
      <IconButton
        aria-label="Comment"
        aria-owns={menuOpen ? 'comment-menu' : null}
        aria-haspopup="true"
        onClick={e => {
          setAnchorEl(e.currentTarget);
          setMenuOpen(true);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="comment-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        {comment && comment.editable ? (
          <MenuItem key="delete" onClick={handleDeleteButtonClick}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary={I18n.t('delete')} />
          </MenuItem>
        ) : (
          <MenuItem key="issue" onClick={handleIssueButtonClick}>
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary={I18n.t('report')} />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default React.memo(CommentMenu);
