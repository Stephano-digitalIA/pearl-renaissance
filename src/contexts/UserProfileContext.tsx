import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, emptyProfile } from '@/types/userProfile';

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  shippingCountryCode: string;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'deesse-pearls-user-profile';

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : emptyProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const shippingCountryCode = profile.usePostalAsShipping 
    ? profile.postalAddress.countryCode 
    : profile.shippingAddress.countryCode;

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, shippingCountryCode }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};
