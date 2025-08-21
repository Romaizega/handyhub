import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../app/axios';


const MessageButton = ({
  profileId,        
  workerUserId,      
  myProfileId,      
  className = 'btn btn-sm btn-neutral',
  children = 'Message',
  showDisabledWhileLoading = true, 
}) => {
  const [resolvedProfileId, setResolvedProfileId] = useState(profileId ?? null);
  const [loading, setLoading] = useState(!profileId && !!workerUserId);

  useEffect(() => {
    if (profileId) {
      setResolvedProfileId(profileId);
      setLoading(false);
      return;
    }
    if (!workerUserId) {
      setResolvedProfileId(null);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(`/profiles/by-user/${workerUserId}`);
        if (!ignore) setResolvedProfileId(data?.profile?.id ?? null);
      } catch {
        if (!ignore) setResolvedProfileId(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [profileId, workerUserId]);

  if (loading && showDisabledWhileLoading) {
    return (
      <button className={className} disabled>
        {children}
      </button>
    );
  }

  if (!resolvedProfileId || resolvedProfileId === myProfileId) {
    return null;
  }

  return (
    <Link to={`/messages/${resolvedProfileId}`} className={className}>
      {children}
    </Link>
  );
};

export default MessageButton
