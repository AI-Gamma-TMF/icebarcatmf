import styled from 'styled-components';

export const ActivityLogContainer = styled.div`
	border-top: 2px solid #eee;
	margin-top: 30px;
	margin-bottom: 30px;
	padding-top: 30px;
    .activity-head-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }
	.act-fav-icon {
		cursor: pointer
	}
`
export const NoDataContainer = styled.div`
    width: 300px;
    margin: 0px auto;
    color: white;
    min-height: 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
	font-size: 18px;
    font-weight: 600;
    color: black;
`;