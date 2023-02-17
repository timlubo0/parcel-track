import { HelperText } from "react-native-paper";
import { IError } from "../interfaces/AuthInterface";

interface ErrorProps{
    key: string;
    error?: IError
}

const ErrorView = ({ error, key }: ErrorProps) => {
    return(
        <HelperText key={key} type="error" visible={error !== undefined}>
            { error?.message }
            <HelperText type="error" visible={true}>{ error?.sqlMessage }</HelperText>
            <HelperText type="error" visible={true}>{ error?.responseText }</HelperText>
        </HelperText>
    )
}

export default ErrorView;