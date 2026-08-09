import { ViewStyle } from 'react-native';

export const raisedCard: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.14,
  shadowRadius: 9,
  elevation: 5,
  borderBottomWidth: 3,
  borderTopWidth: 1,
};

export const raisedCardLight: ViewStyle = {
  ...raisedCard,
  borderBottomColor: 'rgba(0,0,0,0.08)',
  borderTopColor: 'rgba(255,255,255,0.7)',
};

export const raisedCardDark: ViewStyle = {
  ...raisedCard,
  shadowOpacity: 0.4,
  borderBottomColor: 'rgba(0,0,0,0.4)',
  borderTopColor: 'rgba(255,255,255,0.08)',
};
