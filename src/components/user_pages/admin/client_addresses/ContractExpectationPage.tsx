import {useState} from "react";
import {
    AppEvent,
    AppEventMessageType,
    AppRoutes,
    ContractExpectationFromAPI,
    UpdatedContractExpectationToAPI
} from "../../../../js/my_types.ts";
import {useNavigate, useParams} from "react-router-dom";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import BadRequestError from "../../../../js/exceptions/BadRequestError.ts";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";

const appEventDispatcher = AppEventDispatcher.getInstance()

const clientAddressesAPI = ClientAddressesAPI.getInstance()

type RouteURLParams = {
    clientAddressId: string
}

/**
 * What we get from the API.
 */
const initialContractExpectation: ContractExpectationFromAPI = {
    exists: false,
    pending: false,
    success: false,
    failed: false,
    detail: {
        id: "",
        clientAddressId: "",
        state: "",
        expectations: "",
        processedAt: ""
    }
}

/**
 * What we send to the API.
 */
const initialUpdatedContractExpectation: UpdatedContractExpectationToAPI = {
    expectations: ""
}


export default function ContractExpectationPage() {

    const [contractExpectation, setContractExpectation] = useState(initialContractExpectation)
    const [updatedContractExpectation, setUpdatedContractExpectation] = useState(initialUpdatedContractExpectation)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const params = useParams<RouteURLParams>()

    const navigate = useNavigate()


    /**
     * On component first render, load contract expectation
     * of client address.
     */
    useState(() => {

        const clientAddressId = params.clientAddressId

        // if no clientAddressId was found
        if (!clientAddressId) {
            navigate(AppRoutes.clientAddresses)
            return
        }


        clientAddressesAPI
            .findContractExpectation(clientAddressId)
            .then((contractExpectationFromAPI) => {

                // what we get from API
                setContractExpectation(contractExpectationFromAPI)

                // contract expectation exists? in the sense,
                // is the detail not null?
                if(contractExpectationFromAPI.detail) {

                    // what we're going to send to API
                    setUpdatedContractExpectation({
                        ...updatedContractExpectation,
                        // we initialize the expectations to be updated,
                        // as the expectations that we got from API
                        expectations: contractExpectationFromAPI.detail.expectations
                    })

                } else {
                    setUpdatedContractExpectation({
                        ...updatedContractExpectation,
                        expectations: ""
                    })
                }


            })
            .catch((err: Error) => {

                if(err instanceof BadRequestError) {

                    // appEventDispatcher.dispatchStandard(
                    //     AppEvent.APP_ERROR,
                    //     AppEventMessageType.BAD_REQUEST
                    // )

                }

            })

    //@ts-ignore
    }, [])

    return (
        <>
            <p>aspettative contratto</p>
        </>
    )
}