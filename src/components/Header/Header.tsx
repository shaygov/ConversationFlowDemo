import { FC } from 'react';
import { 
  HeaderStyled, 
  SearchWrapperStyled, 
  SearchInnerStyled, 
  SearchInputStyled, 
  UserWrapperStyled,
  UserInnerStyled,
  UserNameStyled,
} from './HeaderStyled';
import Icon from '@libs/components/widgets/Icon/Icon';
import Avatar from '@libs/components/widgets/Avatar/Avatar';
import { AvatarSizes } from '@libs/components/widgets/Avatar/Avatar.types';
import { useAuth } from '@/contexts/AuthContext';
import withActionsMenu from '@components/Header/withActionsMenu';

export interface Props {
  className?: string;
}

// Create UserWrapperWithActionsMenu component using HOC
const UserWrapperWithActionsMenu = withActionsMenu(UserWrapperStyled);

const Header: FC<Props> = ({ className }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <HeaderStyled className={className}>
      <SearchWrapperStyled>
        <SearchInnerStyled>
          <SearchInputStyled
            type="text"
            placeholder="Search..."
          />
          <Icon name="search" />
        </SearchInnerStyled>
      </SearchWrapperStyled>
      
      {isAuthenticated ? (
        <UserWrapperWithActionsMenu>
          <UserInnerStyled>
            <UserNameStyled>
              {user ? user.fullName : 'Guest'}
            </UserNameStyled>
            <Avatar 
              size={AvatarSizes.m}
              text={user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
            />
          </UserInnerStyled>
        </UserWrapperWithActionsMenu>
      ) : (
        <UserWrapperStyled>
          <UserInnerStyled>
            <UserNameStyled>Guest</UserNameStyled>
            <Avatar 
              size={AvatarSizes.m}
              text="U"
            />
          </UserInnerStyled>
        </UserWrapperStyled>
      )}
    </HeaderStyled>
  );
};

export default Header;