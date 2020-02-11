import React, { useCallback } from 'react';
import { ArrayParam, NumberParam, useQueryParams } from 'use-query-params';

import {
  QUERY_PARAM_BASE_FREQUENCY, QUERY_PARAM_NOTES, QUERY_PARAM_RANGE_SIZE, QUERY_PARAM_START_OCTAVE
} from './queryParams';


export const ResetParamsButton = () => {
  const [query, setQuery] = useQueryParams({
    [QUERY_PARAM_BASE_FREQUENCY]: NumberParam,
    [QUERY_PARAM_NOTES]: ArrayParam,
    [QUERY_PARAM_START_OCTAVE]: NumberParam,
    [QUERY_PARAM_RANGE_SIZE]: NumberParam,
  });
  const reset = useCallback(
    () => {
      setQuery({
        [QUERY_PARAM_BASE_FREQUENCY]: undefined,
        [QUERY_PARAM_NOTES]: undefined,
        [QUERY_PARAM_START_OCTAVE]: undefined,
        [QUERY_PARAM_RANGE_SIZE]: undefined,
      });
    },
    [setQuery],
  );
  const isAnyParameterPresent = Object.values(query).findIndex(val => val !== undefined) >= 0;

  if (!isAnyParameterPresent) {
    return null;
  }

  return (
    <button onClick={reset}>Reset</button>
  );
};
