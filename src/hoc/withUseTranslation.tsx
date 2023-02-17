import { useTranslation } from "react-i18next";

export const withUseTranslation = (Component: any) => {
  return (props: any) => {
    const translation = useTranslation();

    return <Component translation={translation} {...props} />;
  };
};