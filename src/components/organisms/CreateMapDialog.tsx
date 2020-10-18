import React, { memo, useCallback } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import SharedEditMapDialog from './SharedEditMapDialog';

import selectMap from '../../actions/selectMap';
import createMap from '../../actions/createMap';
import closeCreateMapDialog from '../../actions/closeCreateMapDialog';
import openToast from '../../actions/openToast';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import uploadToStorage from '../../utils/uploadToStorage';

import I18n from '../../utils/I18n';
import { MapsApi, NewMap } from '@yusuke-suzuki/qoodish-api-js-client';
import { useRouter } from 'next/router';
import { v1 as uuidv1 } from 'uuid';

export default memo(function CreateMapDialog() {
  const dispatch = useDispatch();
  const router = useRouter();

  const mapState = useCallback(
    state => ({
      dialogOpen: state.maps.createMapDialogOpen,
      selectedBase: state.maps.selectedBase
    }),
    []
  );
  const { dialogOpen, selectedBase } = useMappedState(mapState);

  const handleRequestDialogClose = useCallback(() => {
    dispatch(closeCreateMapDialog());
  }, [dispatch]);

  const handleSaveButtonClick = useCallback(
    async (params, _mapId) => {
      dispatch(requestStart());

      if (params.image_url) {
        const fileName = `maps/${uuidv1()}.jpg`;
        const imageUrl = await uploadToStorage(
          params.image_url,
          fileName,
          'data_url'
        );

        Object.assign(params, {
          image_url: imageUrl
        });
      }

      const apiInstance = new MapsApi();
      const newMap = NewMap.constructFromObject(params);

      apiInstance.mapsPost(newMap, (error, data, response) => {
        dispatch(requestFinish());

        if (response.ok) {
          const map = response.body;
          dispatch(createMap(map));
          dispatch(closeCreateMapDialog());
          dispatch(selectMap(map));
          router.push(`/maps/${map.id}`);
          dispatch(openToast(I18n.t('create map success')));

          (window as any).gtag('event', 'create', {
            event_category: 'engagement',
            event_label: 'map'
          });
        } else if (response.status === 409) {
          dispatch(openToast(response.body.detail));
        } else {
          dispatch(openToast('Failed to create map.'));
        }
      });
    },
    [dispatch, router]
  );

  return (
    <SharedEditMapDialog
      selectedBase={selectedBase}
      dialogOpen={dialogOpen}
      handleSaveButtonClick={handleSaveButtonClick}
      handleRequestDialogClose={handleRequestDialogClose}
    />
  );
});
