import React, { useState, useEffect } from "react";
import TableIn from "./InstallmentTable";

const InstallmentPage = () => {
    const [total, setTotal] = useState(1000);
    const [count, setCount] = useState(5);
    const [installments, setInstallments] = useState([]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        if (name === "total") {
            setTotal(value);
        } else if (name === "count") {
            setCount(value);
        }
    };


    useEffect(() => {
        if (total > 0 && count > 0) {
            const newInstallments = Array.from({ length: count }, (_, index) => ({
                id: index + 1,
                insNumber: index + 1,
                checked: false,
                amount: Math.floor(total / count).toFixed(2),
                dueDate: "",
                show: true

            }));
            setInstallments(newInstallments);
        } else {
            setInstallments([]);
        }
    }, [total, count]);


    const handleSplit = () => {
        let newInstallments = [];
        installments.forEach((inst) => {
            if (inst.checked) {
                const halfAmount = (inst.amount / 2).toFixed(2);
                const baseNumber = inst.insNumber;

                newInstallments.push(
                    { ...inst, checked: false, show: false }, // Hide original installment

                    { // First new installment
                        ...inst,
                        insNumber: baseNumber + 0.1, // Create a unique number
                        amount: halfAmount,
                        checked: false,
                        show: true,
                        isSplited: true
                    },

                    { // Second new installment
                        ...inst,
                        insNumber: baseNumber + 0.2, // Create a unique number
                        amount: halfAmount,
                        checked: false,
                        show: true,
                        isSplited: true
                    }
                );
            } else {
                newInstallments.push(inst);
            }
        });

        newInstallments.sort((a, b) => a.insNumber - b.insNumber);

        setInstallments(newInstallments);
    };

    const handleMerge = () => {
        let newInstallments = [];

        let selectedInstallments = installments.filter(inst => inst.checked);

        if (selectedInstallments.length < 2) {
            alert("Please select at least two installments to merge.");
            return;
        }

        const totalMergedAmount = selectedInstallments
            .reduce((sum, inst) => sum + parseFloat(inst.amount), 0)
            .toFixed(2);

        const mergedInsNumber = selectedInstallments.map(inst => inst.insNumber).join("+");
        const mergedDueDate = selectedInstallments[0].dueDate || "";
        installments.forEach(inst => {
            if (inst.checked) {
                newInstallments.push({ ...inst, checked: false, show: false });
            } else {
                newInstallments.push(inst);
            }
        });

        newInstallments.push({
            id: selectedInstallments[0].id,
            insNumber: mergedInsNumber,
            amount: totalMergedAmount,
            dueDate: mergedDueDate,
            checked: false,
            show: true,
            isMerged: true
        });
        newInstallments.sort((a, b) => a.id - b.id);
        setInstallments(newInstallments);
    };

    

    return (
        <div>
            <form>
                <label>Amount</label>
                <input type="number" name="total" onChange={handleOnChange} value={total} />

                <label>Count</label>
                <input type="number" name="count" onChange={handleOnChange} value={count} />
            </form>

            <TableIn installments={installments} setInstallments={setInstallments} />

            <button onClick={handleMerge}>merge</button>
            <button onClick={handleSplit}>split</button>

        </div>
    );
};

export default InstallmentPage;
