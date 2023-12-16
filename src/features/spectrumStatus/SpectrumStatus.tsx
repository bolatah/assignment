// src/components/SpectrumStatus.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  {fetchSpectrumStatus } from './spectrumStatusSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';

const SpectrumStatus = () => {
  const dispatch = useAppDispatch();
  const spectrumStatus = useSelector((state : RootState) => state.spectrumStatus);

  useEffect(() => {
    dispatch(fetchSpectrumStatus());
  }, [dispatch]);

  if (spectrumStatus.loading === 'loading') {
    return <div>Loading...</div>;
  }

  if (spectrumStatus.loading === 'failed') {
    return <div>Error: {spectrumStatus.error}</div>;
  }

  return (
    <div>
      <h2>Spectrum Status</h2>
      <pre>{JSON.stringify(spectrumStatus.data, null, 2)}</pre>
    </div>
  );
};

export default SpectrumStatus;