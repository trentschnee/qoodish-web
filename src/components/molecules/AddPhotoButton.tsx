import { createStyles, IconButton, makeStyles } from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import { memo, useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      display: 'none'
    }
  })
);

type Props = {
  id: string;
  onChange: Function;
  disabled?: boolean;
};

export default memo(function AddPhotoButton(props: Props) {
  const { id, onChange, disabled } = props;
  const classes = useStyles();
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const handleImageFilesChange = useCallback(e => {
    setCurrentFiles(Array.from(e.target.files));
  }, []);

  useEffect(() => {
    onChange(currentFiles);
  }, [currentFiles]);

  return (
    <>
      <input
        accept="image/*"
        className={classes.input}
        multiple
        id={id}
        type="file"
        onChange={handleImageFilesChange}
      />

      <label htmlFor={id}>
        <IconButton component="span" size="small" disabled={disabled}>
          <AddAPhoto color="secondary" />
        </IconButton>
      </label>
    </>
  );
});
