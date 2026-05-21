import {Button} from "react-bootstrap";
import {ClientAddressFromAPI} from "../../../../js/my_types.ts";

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
            <td>
                <Button>Carica contratto</Button>

                <Button>Vedi</Button>
            </td>
            <td>
                {/*<Button variant="outline-primary" size="sm">Modifica</Button>*/}
                {/*{' '}*/}
                {/*<Button variant="outline-danger" size="sm">Elimina</Button>*/}
            </td>
        </tr>
    )

}