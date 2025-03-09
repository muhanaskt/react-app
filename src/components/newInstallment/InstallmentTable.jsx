import React from "react";
import { Table } from "react-bootstrap";

const TableIn = ({ installments, setInstallments }) => {
    const onDateChange = (insNumber, value) => {
        const updatedInstallments = installments.map((inst) =>
            inst.insNumber === insNumber ? { ...inst, dueDate: value } : inst
        );
        setInstallments(updatedInstallments);
    };

    const onCheckboxChange = (insNumber) => {
        const updatedInstallments = installments.map((inst) =>
            inst.insNumber === insNumber ? { ...inst, checked: !inst.checked } : inst
        );
        setInstallments(updatedInstallments);
    };

    console.log(installments);

    /**
     * Handle undo operation for an installment.
     * @param {Object} installment - The installment object to undo.
     */
    const handleUndo = (installment) => {
        let newInstallments = [];

        if (installment.isMerged) {
            
            const originalNumbers = installment.insNumber.split("+").map(num => Number(num));
            console.log(originalNumbers);
            
          
            newInstallments = installments.map(inst =>
                originalNumbers.includes(inst.insNumber)
                    ? { ...inst, show: true, checked: false } 
                    : inst.insNumber === installment.insNumber
                        ? null 
                        : inst
            ).filter(Boolean) ;
        } else if (installment.isSplited) {
           
            const originalNumber = Math.floor(installment.insNumber);

         
            newInstallments = installments.map(inst =>
                inst.insNumber === originalNumber
                    ? { ...inst, show: true, checked: false }
                    : inst.insNumber === originalNumber + 0.1 || inst.insNumber === originalNumber + 0.2
                        ? null
                        : inst
            ).filter(Boolean);
        } else {
            
            newInstallments = [...installments];
        }

    
        setInstallments(newInstallments);
    };


    return (
        <div>
            <Table bordered striped hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Installment No</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    {installments.length > 0 ? (
                        installments.filter((inst) => inst.show).map((installment) => (

                            <tr key={installment.insNumber}>
                                <td>
                                    <input type="checkbox"
                                        checked={installment.checked}
                                        onChange={() => onCheckboxChange(installment.insNumber)}
                                    />
                                    {installment.isSplited && <span>
                                        s{" "}
                                        <span style={{ cursor: "pointer", color: "red" }} onClick={() => handleUndo(installment)}>
                                            🔄
                                        </span>
                                    </span>}

                                    {installment.isMerged && <span>
                                        m{" "}
                                        <span style={{ cursor: "pointer", color: "red" }} onClick={() => handleUndo(installment)}>
                                            🔄
                                        </span>
                                    </span>}

                                </td>
                                <td>{installment.insNumber}</td>
                                <td>{installment.amount}</td>
                                <td>
                                    <input
                                        type="date"
                                        value={installment.dueDate}
                                        onChange={(e) => onDateChange(installment.insNumber, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No Installments Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default TableIn;
