import { memo, ReactNode } from 'react';
import {
  AppBar,
  createStyles,
  IconButton,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import { ArrowBack, Close } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    appbar: {
      position: 'relative'
    },
    toolbar: {
      height: 56,
      paddingLeft: 8,
      paddingRight: 8
    },
    actionButton: {
      marginLeft: 'auto'
    }
  })
);

type Props = {
  color?: 'default' | 'inherit' | 'transparent' | 'primary' | 'secondary';
  iconType?: string;
  handleRequestDialogClose: any;
  action?: ReactNode;
  title: string;
};

export default memo(function DialogAppBar(props: Props) {
  const { color, iconType, handleRequestDialogClose, action, title } = props;
  const classes = useStyles();

  return (
    <AppBar position="relative" color={color ? color : 'primary'} elevation={2}>
      <Toolbar className={classes.toolbar}>
        <IconButton color="inherit" onClick={handleRequestDialogClose}>
          {iconType === 'back' ? <ArrowBack /> : <Close />}
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          {title}
        </Typography>
        {action && <div className={classes.actionButton}>{action}</div>}
      </Toolbar>
    </AppBar>
  );
});
