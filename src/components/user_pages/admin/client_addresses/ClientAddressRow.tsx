import {Button, Spinner} from "react-bootstrap";
import {AppEvent, AppRoutes, ClientAddressFromAPI} from "../../../../js/my_types.ts";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import {ChangeEvent} from "react";
import {ExclamationTriangleFill, EyeFill, Upload} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";

const appEventDispatcher = AppEventDispatcher.getInstance()

const clientAddressesAPI = ClientAddressesAPI.getInstance()


/**
 * The props of this component.
 */
interface ComponentProps {
    clientAddress: ClientAddressFromAPI
}


export default function ClientAddressRow({ clientAddress }: ComponentProps) {

    const navigate = useNavigate()


    // ******************************
    //  HANDLERS
    // ******************************

    /**
     * Upload the contract.
     */
    const onFileUpload = (clientAddress: ClientAddressFromAPI,
                                                            contract: File) =>
    {

        // TODO: check that file is a pdf
        // TODO: show is loading when the contract gets uploaded

        console.log(clientAddress, contract)

        appEventDispatcher.dispatch(
            AppEvent.APP_SUCCESS,
            `Stiamo caricando il contratto di ${clientAddress.clientName}. Non chiudere la pagina.`
        )

        clientAddressesAPI
            .uploadContractForExtraction(clientAddress.id, contract)
            .then(() => {

                appEventDispatcher.dispatch(
                    AppEvent.APP_SUCCESS,
                    `Il contratto di ${clientAddress.clientName} è stato caricato con successo. Puoi chiudere la pagina.`
                )

            })
            .catch(err => {

                appEventDispatcher.dispatch(
                    AppEvent.APP_ERROR,
                    `Errore nel caricamento del contratto di ${clientAddress.clientName}.`
                )

            })

    }

    const handleFileChange = (clientAddress: ClientAddressFromAPI) =>
    {

        return (event: ChangeEvent<HTMLInputElement>) => {
            const fileList = event.target.files;
            if (fileList && fileList.length > 0) {
                onFileUpload(clientAddress, fileList[0]);
            }
        };

    }

    /**
     * User wants to see expectations for this client address
     *
     */
    const onViewExpectations = (clientAddress: ClientAddressFromAPI) =>
    {

        navigate(
            AppRoutes.contractExpectationsWith(clientAddress.id)
        )

    }

    return (
        <tr>
            <td>{clientAddress.clientName}</td>
            <td>{clientAddress.addressName}</td>
            <td>{clientAddress.addressDisplayName}</td>
            {/* contract expectation */}
            <td>

                {/* Hidden native input element used across upload actions */}
                <input
                    type="file"
                    id={`file-upload-${clientAddress.id}`}
                    style={{ display: 'none' }}
                    accept=".pdf"
                    onChange={handleFileChange(clientAddress)}
                    disabled={clientAddress.contractExpectation.pending}
                />

                {/* 1. INITIAL STATE: Contract does not exist */}
                {!clientAddress.contractExpectation.exists && (
                    <Button
                        as="label"
                        htmlFor={`file-upload-${clientAddress.id}`}
                        variant="primary"
                        size="sm"
                        className="d-inline-flex align-items-center gap-2"
                        style={{ cursor: 'pointer' }}
                    >
                        <Upload size={16} /> Carica PDF contratto
                    </Button>
                )}

                {/* 2. SUCCESS STATE: Expectations are ready to be viewed */}
                {clientAddress.contractExpectation.success && (
                    <Button
                        variant="link"
                        size="sm"
                        className="d-inline-flex align-items-center gap-2 p-0 text-decoration-none fw-semibold"
                        onClick={() => onViewExpectations(clientAddress)}
                    >
                        <EyeFill size={16} /> Vedi aspettative
                    </Button>
                )}

                {/* 3. FAILED STATE: Processing crashed, allow re-upload */}
                {clientAddress.contractExpectation.failed && (
                    <Button
                        as="label"
                        htmlFor={`file-upload-${clientAddress.id}`}
                        variant="outline-danger"
                        size="sm"
                        className="d-inline-flex align-items-center gap-2"
                        style={{ cursor: 'pointer' }}
                    >
                        <ExclamationTriangleFill size={16} /> Errore. Riprova carica
                    </Button>
                )}

                {/* 4. PENDING STATE: Async worker is processing */}
                {clientAddress.contractExpectation.pending && (
                    <div className="d-inline-flex align-items-center gap-2 text-warning fw-semibold" style={{ fontSize: '0.875rem' }}>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Elaborazione in corso...
                    </div>
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