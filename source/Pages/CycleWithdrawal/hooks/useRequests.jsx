import React, { useState, useEffect } from 'react';
import { DataDisplay } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import extension from 'extensionizer';

const portRPC = new PortRPC({
  name: 'cycle-withdrawal-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const storage = extension.storage.local;

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const poll = (promiseFn, time) => promiseFn().then(
  sleep(time).then(() => poll(promiseFn, time)),
);

const useRequests = (callId, portId) => {
  const { t } = useTranslation();

  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState([]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateRequests = () => {
    storage.get(['requests'], (state) => {
      const storedRequests = state.requests;

      if (storedRequests) {
        setRequests(
          [
            ...requests,
            ...storedRequests.filter((sr) => sr.status === 'pending'),
          ],
        );

        storage.set({
          requests: storedRequests.map((r) => {
            const temp = r;
            if (temp.status === 'pending') {
              temp.status = 'processing';
            }
            return temp;
          }),
        });
      }
    });
  };

  useEffect(() => {
    poll(() => new Promise(() => updateRequests()), 1000);
  }, []);

  useEffect(async () => {
    if (requests.length > 0 && loading) setLoading(false);

    if (requests.length === 0 && !loading) {
      storage.set({
        requests: response,
        open: false,
      });

      await portRPC.call('handleDankProxyRequest', [callId, portId]);

      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));

    setResponse([
      ...response,
      ...declinedRequests,
    ]);

    setRequests([]);
  };

  const handleRequest = async (request, status) => {
    request.status = status;

    setResponse([
      ...response,
      request,
    ]);

    setCurrentRequest(0);
    setRequests(requests.filter((r) => r.id !== request.id));
  };

  const requestCount = requests.length;

  const validData = (property) => (
    requestCount > 0
      ? requests[currentRequest][property]
      : ''
  );

  const data = [
    {
      label: t('cycleTransactions.canisterId'),
      component: <DataDisplay value={validData('canisterId')} />,
    },
    {
      label: t('cycleTransactions.methodName'),
      component: <DataDisplay value={validData('methodName')} />,
    },
    {
      label: t('cycleTransactions.parameters'),
      component: <DataDisplay value={JSON.stringify(validData('args'))} big />,
    },
  ];

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    loading,
  };
};

export default useRequests;
