import { UseTranslationResponse } from "react-i18next";
import appTheme from "../theme/appTheme";

export interface ScreenProps{
    theme: ReturnType<typeof appTheme>;
    translation?: UseTranslationResponse<"translation", undefined>;
}