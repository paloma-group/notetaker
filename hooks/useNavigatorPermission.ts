import { useEffect, useState } from 'react';

type useNavigatorPermissionsInterface = {
  status: string;
  error: boolean;
};

const useNavigatorPermissions = (
  name: PermissionName,
  configuration?: object
): useNavigatorPermissionsInterface => {
  const [error, setError] = useState(false);
  const [permitted, setPermitted] = useState('');

  useEffect(() => {
    if (window && window.navigator && window.navigator.permissions) {
      window.navigator.permissions
        .query({ name, ...configuration })
        .then((status) => {
          setPermitted(status.state);
        });
    } else {
      setError(true);
    }
  }, [name, configuration]);

  return { status: permitted, error };
};

export default useNavigatorPermissions;
