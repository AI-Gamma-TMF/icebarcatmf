import styled from 'styled-components';

export const BankDetailsContainer = styled.div`
    .bank-head-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }
	.bank-create-button {
		display: flex;
		align-items: center;
		justify-content: end;
	}
`
export const BankModalContainer = styled.div`
	.buttonDiv-bank {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn {
			width: 150px;
		}
	}
	.bank-modal-head {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 15px;
		margin-bottom: 15px;
		h6 {
			color: rgb(48, 141, 222);
			font-size: 22px;
			margin-bottom: 0px;
		}
	}
`;
