import {Button} from "react-bootstrap";
import {ClientAddressFromAPI} from "../../../../js/my_types.ts";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import {useState} from "react";

const clientAddressesAPI = ClientAddressesAPI.getInstance()


/**
 * The props of this component.
 */
interface ComponentProps {
    clientAddress: ClientAddressFromAPI
}


export default function ClientAddressRow({ clientAddress }: ComponentProps) {


    return (
        // make this key unique
        <tr>
            <td>{clientAddress.clientName}</td>
            <td>{clientAddress.addressName}</td>
            <td>{clientAddress.addressDisplayName}</td>
            {/* contract expectation */}
            <td>
                {/* contract expectation not exists */}
                {!clientAddress.contractExpectation.exists && (
                    <Button>
                        carica contratto
                    </Button>
                )}

                {/* contract expectation exists and was success */}
                {clientAddress.contractExpectation.success && (
                    <span>già caricato</span>
                )}

                {/* contract expectation exists and failed */}
                {clientAddress.contractExpectation.failed && (
                    <span>ricarica</span>
                )}

                {/* contract expectation exists and is pending */}
                {clientAddress.contractExpectation.pending && (
                    <span>sta processando..</span>
                )}
            </td>
            <td>
                {/*<Button variant="outline-primary" size="sm">Modifica</Button>*/}
                {/*{' '}*/}
                {/*<Button variant="outline-danger" size="sm">Elimina</Button>*/}
            </td>
        </tr>
    )

}