import React, { useState, useEffect } from 'react';
import { DataDisplay, AssetFormat } from '@ui';
import { useTranslation } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import { v4 as uuidv4 } from 'uuid';
import { CURRENCIES } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/agent';
import { validatePrincipalId } from '@shared/utils/ids';
import { DEFAULT_FEE } from '@shared/constants/addresses';

const portRPC = new PortRPC({
  name: 'transfer-port',
  target: 'bg-script',
  timeout: 5000,
});

portRPC.start();

const useRequests = (incomingRequests, callId, portId) => {
  const { t } = useTranslation();
  const [currentRequest, setCurrentRequest] = useState(0);
  const [requests, setRequests] = useState(incomingRequests);

  const [response, setResponse] = useState([]);

  const [accountId, setAccountId] = useState(null);
  const [principalId, setPrincipalId] = useState(null);
  /* eslint-disable no-param-reassign */
  useEffect(() => {
    incomingRequests.map((item) => (
      { ...item, id: uuidv4() }
    ));

    const address = requests[currentRequest].to;

    if (validatePrincipalId(address)) {
      setPrincipalId(address);
      setAccountId(
        PlugController.getAccountId(
          Principal.fromText(address),
        ),
      );
    } else {
      setAccountId(address);
    }
  }, []);

  useEffect(async () => {
    if (requests.length === 0) {
      await portRPC.call('handleRequestTransfer', [response, callId, portId]);
      window.close();
    }
  }, [requests]);

  const handleSetNextRequest = () => setCurrentRequest(currentRequest + 1);
  const handleSetPreviousRequest = () => setCurrentRequest(currentRequest - 1);

  const handleDeclineAll = async () => {
    const declinedRequests = requests.map((r) => ({ ...r, status: 'declined' }));
    await portRPC.call('handleRequestTransfer', [declinedRequests, callId, portId]);
    window.close();
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

  const data = [];

  if (principalId) {
    data.push({
      label: t('common.principalId'),
      component: <DataDisplay value={shortAddress(principalId)} />,
    });
  }

  if (accountId) {
    data.push({
      label: t('common.accountId'),
      component: <DataDisplay value={shortAddress(accountId)} />,
    });
  }

  data.push(...[
    {
      label: t('common.fee'),
      component: <DataDisplay value={<AssetFormat value={requests[currentRequest]?.args?.fee || DEFAULT_FEE} asset={CURRENCIES.get('ICP').value} />} />,
    },
    {
      label: t('common.memo'),
      component: <DataDisplay value={requests[currentRequest]?.args?.memo || t('common.null')} />,
    },
  ]);

  return {
    requests,
    currentRequest,
    data,
    handleSetNextRequest,
    handleSetPreviousRequest,
    handleRequest,
    handleDeclineAll,
    principalId,
  };
};

export default useRequests;
