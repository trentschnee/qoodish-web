import { useContext, useEffect, useCallback, useState, memo } from 'react';
import GoogleMapsContext from '../../context/GoogleMapsContext';
import { useMappedState } from 'redux-react-hook';
import I18n from '../../utils/I18n';

export default memo(function CurrentPositionMarker() {
  const { googleMap } = useContext(GoogleMapsContext);
  const [currentPositionMarker, setCurrentPositionMarker] = useState(undefined);

  const mapState = useCallback(
    state => ({
      currentPosition: state.gMap.currentPosition
    }),
    []
  );
  const { currentPosition } = useMappedState(mapState);

  const createCurrentPositionMarker = useCallback(() => {
    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(currentPosition.lat),
        lng: parseFloat(currentPosition.lng)
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#0088ff',
        fillOpacity: 0.8,
        strokeColor: '#0088ff',
        strokeOpacity: 0.2
      },
      title: I18n.t('you are hear')
    });

    marker.setMap(googleMap);
    setCurrentPositionMarker(marker);
  }, [currentPosition, googleMap]);

  const removeCurrentPositionMarker = useCallback(() => {
    currentPositionMarker.setMap(null);
  }, [currentPositionMarker]);

  useEffect(() => {
    if (!currentPosition.lat || !googleMap) {
      return;
    }
    createCurrentPositionMarker();

    return () => {
      if (currentPositionMarker) {
        removeCurrentPositionMarker();
      }
    };
  }, [currentPosition]);

  return null;
});
