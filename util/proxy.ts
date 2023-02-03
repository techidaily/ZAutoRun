export const proxyServer = process.env?.TEST_ENV ?? `http://127.0.0.1:20172`;
export const disableProxy = Boolean(process.env?.TEST_NO_PROXY);

export const getProxySetting = () => {
	if (disableProxy) {
		return {};
	}

	return {
		proxy: {
			server: proxyServer
		}
	};
}

export const getLaunchProxySetting = () => {
  if (disableProxy) {
    return {};
  }

  return {
    proxy: {
      server: 'per-context'
    }
  };
}