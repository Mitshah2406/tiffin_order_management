class Helper {
    static formatRupees = (amount: number): string => {
        return `₹ ${amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        })}`;
    }

    static mobileNumberRegex = /^[6-9]\d{9}$/;
}

export default Helper;