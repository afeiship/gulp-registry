import NxFetch from '@jswork/next-fetch';
import httpSchema from '@jswork/http-schema';
import nxFetchWithDebug from '@jswork/next-fetch-with-debug';
import nxFetchWithTimeout from '@jswork/next-fetch-with-timeout';
import nxFetchWithCancelable from '@jswork/next-fetch-with-cancelable';
import nxApplyFetchMilddeware from '@jswork/next-apply-fetch-middleware';

export default (inConfig, inOptions?) => {
  const fetch = nxApplyFetchMilddeware([
    nxFetchWithTimeout,
    nxFetchWithCancelable,
    nxFetchWithDebug
  ])(global.fetch);

  const http = NxFetch.getInstance({
    fetch,
    ...inOptions
  });

  return httpSchema(inConfig, http);
};
