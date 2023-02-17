import appTheme, { custom } from "../theme/appTheme";

export interface OnboardingScreenState{
    activeScreen: number;
    screens: any
}

export interface OnboardingProps{
    illustration: any;
    title: string, 
    description: string, 
    active: number, 
    onNext: (screenIndex: number) => void,
    navigation: any
}