import { useEffect,  useState } from "react";
import Avatar from '@/libs/components/widgets/Avatar/Avatar';
import { AvatarSizes } from "@/libs/components/widgets/Avatar/Avatar.types";
import { getInitials } from '@/helpers';
import styled from "@emotion/styled";
import Icon from '@/libs/components/widgets/Icon/Icon';
import API from '@/services/api';
import WorkspaceButton from '@/components/WorkspaceButton';
import { useActiveChannelService } from '@/contexts/ServicesContext';

// Define a simple interface for channel display data
interface ChannelDisplayInfo {
  id: string;
  type: string;
  workspace_name?: string;
  workspace_type_id?: number;
  unread_count?: number;
}

const ChannelTitleBarStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 18px;
   &:after {
      content: '';
      display: block;
      width: 100%;
      height: 5px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(58, 134, 255, 1);
      border-radius: 40px;
    }
`;


const ChannelTitleWrapStyled = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 15px;
    font-size: 22px;
    font-weight: 500;
    .channel-title {
      flex: 1;
    }
    .favorite-btn {
      padding: 0px;
      background: none;
      border: none;
      align-items: center;
      cursor: pointer;
    }
   
`;

const FavoiriteBtnStyled = styled.button`
  display: inline-block; 
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  cursor: pointer;
  vertical-align: middle;
  .icon {
    display: block; 
    vertical-align: middle;
  }
`;

const RotatingIcon = styled(Icon)`
  animation: spin 0.7s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
`;

export default function ChannelTitleBar({
    channelName,
    isFavorite: isFavoriteProp,
    isOnline,
    channelId,
    channels,
    setSelectedChannel,
}: {
    channelName: string;
    isFavorite: boolean;
    isOnline: boolean;
    channelId: string;
    channels: ChannelDisplayInfo[];
    setSelectedChannel?: (channelId: string, channelType: string) => void;
}) {
    const initials = getInitials(channelName);
    const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
    const [loading, setLoading] = useState(false);
    const activeChannelService = useActiveChannelService();
   
    // Get channels and user from hook data

    useEffect(() => {
      setIsFavorite(isFavoriteProp);
    }, [isFavoriteProp]);

    const handleFavorite = async () => {
      setLoading(true);
      try {
        await API.post({
          url: '/chat/channel/favorite',
          body: {
            channelId,
            isFavorite: !isFavorite,
          },
        });
        setIsFavorite(!isFavorite);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
  return (
    <ChannelTitleBarStyled>
        <ChannelTitleWrapStyled>
            <Avatar text={initials} online={isOnline} size={AvatarSizes.l} />
            <div className="channel-title">{channelName}</div>
            <FavoiriteBtnStyled className="favorite-btn" title="Add as favorite" onClick={handleFavorite} disabled={loading}>
              {loading ? (
                <RotatingIcon name={isFavorite ? "star-filled" : "star"} className="icon" size="S" color="#FFB938" />
              ) : (
                <Icon name={isFavorite ? "star-filled" : "star"} className="icon" size="S" color="#FFB938" />
              )}
            </FavoiriteBtnStyled>
        </ChannelTitleWrapStyled>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {
          // Sort channels by workspace_name before rendering
          channels
            .sort((a, b) => {
              const aWorkspaceName = a.workspace_name ?? '';
              const bWorkspaceName = b.workspace_name ?? '';
              return aWorkspaceName.localeCompare(bWorkspaceName);
            })
            .map((channel) => (
            <WorkspaceButton 
              key={channel.id} 
              name={channel.workspace_name} 
              type={channel.workspace_type_id} 
              className={channel.id === channelId ? 'active active-bg' : ''}
              onClick={() => {
                // Set the channel as active when workspace button is clicked
                // Use the hook's setSelectedChannel function
                setSelectedChannel(channel.id, channel.type);
                
              }} 
              badgeCount={channel.unread_count} // Basic hook doesn't track unread counts
            />
          ))
        }
        </div>
    </ChannelTitleBarStyled>
  );
}