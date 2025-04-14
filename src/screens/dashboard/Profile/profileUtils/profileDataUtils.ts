export interface ProfileData {
  displayName: string;
  role: string;
  profileImageSource: any;
}

export const getProfileData = (): ProfileData => {
  return {
    displayName: 'Jacob Leon',
    role: 'Handler',
    profileImageSource: require('../../../../../assets/logos/OK-TF1-logo.jpg'),
  };
};

export const handleEditProfile = (): void => {
  console.log('Edit profile pressed');
};
