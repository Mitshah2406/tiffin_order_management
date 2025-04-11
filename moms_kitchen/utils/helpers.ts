class Helper {
    static formatRupees = (amount: number): string => {
        return `₹ ${amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        })}`;
    }

}

export default Helper;