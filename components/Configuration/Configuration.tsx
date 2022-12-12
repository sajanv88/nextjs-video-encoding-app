import {PaginationResponse} from "@bitmovin/api-sdk";
import {CodeConfiguration} from "aws-sdk/clients/apprunner";

interface ConfigurationProps {
    configuration: PaginationResponse<CodeConfiguration>;
}
export default function Configuration({configuration}: ConfigurationProps) {
    return (
        <div className='configuration'>
                
        </div>
    )
}