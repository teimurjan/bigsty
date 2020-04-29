import pkgJSON from 'package.json';
import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { safeWindow } from 'src/utils/dom';

export const CacheBuster = () => {
  const {
    dependencies: {
      storages: { version: versionStorage },
    },
  } = useDependencies();

  React.useEffect(() => {
    const currentVersion = versionStorage.getVersion();
    const newVersion = pkgJSON.version;

    if (currentVersion !== newVersion) {
      versionStorage.setVersion(newVersion);
      safeWindow(w => w.location.reload(true), undefined);
    }
  }, [versionStorage]);

  return null;
};
