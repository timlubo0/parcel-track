import React from 'react';
import { Text } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import appTheme, { custom } from '../theme/appTheme';

interface CircleCountDownProps{
    props: { theme: ReturnType<typeof appTheme> };
    duration: number;
    onCountDown: () => void
}

const CircleCountDown = ({ props, duration, onCountDown }: CircleCountDownProps) => (

  <CountdownCircleTimer
    isPlaying
    duration={duration}
    colors={[`#${props.theme.colors.accent.replace('#', '')}`, `#${props.theme.colors.primary.replace('#', '')}`, '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
    size={60}
    onComplete={() => onCountDown()}
  >
    {({ remainingTime }) => <Text style={{ color: props.theme.dark ? "#000" : props.theme.colors.text }}>{remainingTime}</Text>}
  </CountdownCircleTimer>
);

export default CircleCountDown;