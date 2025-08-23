import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../app/axios';

/**
 * MessageButton allows the user to open a chat with a worker's profile.
 * If only workerUserId is given, it resolves their profile ID via API.
 * If profileId is given directly, it uses that.
 */

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

   // Show loading button if needed
  if (loading && showDisabledWhileLoading) {
    return (
      <button className={className} disabled>
        {children}
      </button>
    );
  }
   // Hide button if profile not found or it's the current user's own profile
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
